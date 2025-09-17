import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { env } from '../config/env';

// Custom Error Classes
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, true, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, true, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, true, 'CONFLICT_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, true, 'DATABASE_ERROR', details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `External service ${service} is unavailable`, 503, true, 'EXTERNAL_SERVICE_ERROR');
  }
}

// Error Response Interface
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
  };
  stack?: string;
}

// Generate unique request ID
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = generateRequestId();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error classifier
const classifyError = (error: any): { statusCode: number; code: string; isOperational: boolean } => {
  // Prisma errors
  if (error.code === 'P2002') {
    return { statusCode: 409, code: 'UNIQUE_CONSTRAINT_ERROR', isOperational: true };
  }
  if (error.code === 'P2025') {
    return { statusCode: 404, code: 'RECORD_NOT_FOUND', isOperational: true };
  }
  if (error.code?.startsWith('P')) {
    return { statusCode: 500, code: 'DATABASE_ERROR', isOperational: true };
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return { statusCode: 401, code: 'INVALID_TOKEN', isOperational: true };
  }
  if (error.name === 'TokenExpiredError') {
    return { statusCode: 401, code: 'TOKEN_EXPIRED', isOperational: true };
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return { statusCode: 400, code: 'VALIDATION_ERROR', isOperational: true };
  }

  // Mongoose/MongoDB errors
  if (error.name === 'CastError') {
    return { statusCode: 400, code: 'INVALID_ID_FORMAT', isOperational: true };
  }

  // Default
  return { 
    statusCode: error.statusCode || 500, 
    code: error.code || 'INTERNAL_SERVER_ERROR', 
    isOperational: error.isOperational || false 
  };
};

// Main error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { statusCode, code, isOperational } = classifyError(error);
  
  const requestId = req.headers['x-request-id'] as string;
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code,
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      requestId
    }
  };

  // Add details for operational errors
  if (isOperational && error.details) {
    errorResponse.error.details = error.details;
  }

  // Add stack trace in development
  if (env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  // Log error
  const logData = {
    requestId,
    statusCode,
    code,
    message: error.message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: (req as any).user?.id,
    stack: error.stack
  };

  if (statusCode >= 500) {
    logger.error('Server Error', logData);
    
    // Send alert for critical errors (in production, you might want to send to monitoring service)
    if (env.NODE_ENV === 'production' && !isOperational) {
      logger.error('CRITICAL ERROR - Manual intervention required', logData);
    }
  } else if (statusCode >= 400) {
    logger.warn('Client Error', logData);
  }

  // Don't send sensitive information in production
  if (env.NODE_ENV === 'production' && statusCode >= 500 && !isOperational) {
    errorResponse.error.message = 'Internal Server Error';
    errorResponse.error.code = 'INTERNAL_SERVER_ERROR';
    delete errorResponse.error.details;
  }

  res.status(statusCode).json(errorResponse);
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

// Graceful shutdown error handler
export const handleUncaughtExceptions = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', {
      reason,
      promise: promise.toString()
    });
    
    process.exit(1);
  });
};

// Recovery mechanisms
export class CircuitBreaker {
  private failures: number = 0;
  private lastFailTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly timeout: number = 60000, // 1 minute
    private readonly resetTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new ExternalServiceError('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        )
      ]) as T;

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.warn(`Circuit breaker opened after ${this.failures} failures`);
    }
  }

  getState(): string {
    return this.state;
  }
}

// Error boundaries for specific operations
export const withErrorBoundary = async <T>(
  operation: () => Promise<T>,
  fallback: () => T,
  errorMessage?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.error(errorMessage || 'Operation failed, using fallback', error);
    return fallback();
  }
};
