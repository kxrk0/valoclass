import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth';
import { SafeUser } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function createRateLimiter(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = getClientIP(req);
    const now = Date.now();

    // Clean expired entries
    for (const [key, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }

    const current = rateLimitStore.get(identifier);
    
    if (!current || current.resetTime < now) {
      // New window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (current.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests from this IP, please try again later.'
      });
    }

    current.count++;
    return next();
  };
}

// Create rate limiters
export const loginRateLimit = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const apiRateLimit = createRateLimiter(60 * 1000, 100); // 100 requests per minute
export const strictRateLimit = createRateLimiter(60 * 1000, 10); // 10 requests per minute

// Authentication middleware
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const payload = await AuthService.verifyToken(token);
    if (payload) {
      const user = await AuthService.getCurrentUser(req);
      if (user) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          riotId: user.riotId,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
  }

  next();
}

// Role-based authorization
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }
  next();
}

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }
    next();
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return requireRole('ADMIN')(req, res, next);
}

export function requireModerator(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const allowedRoles = ['MODERATOR', 'ADMIN'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Moderator access required'
    });
  }
  next();
}

// IP and User Agent helpers
export function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIP = req.headers['x-real-ip'] as string;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return req.ip || 'unknown';
}

export function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown';
}

// Input validation middleware
export function validateJSON<T>(validator: (data: any) => data is T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!validator(req.body)) {
        return res.status(400).json({
          error: 'Invalid request data'
        });
      }
      next();
    } catch {
      return res.status(400).json({
        error: 'Invalid JSON in request body'
      });
    }
  };
}

// Error handling middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
}
