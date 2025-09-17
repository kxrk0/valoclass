import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { logger } from './logger';
import { env } from '../config/env';

// Advanced rate limiting configurations
export const createAdvancedRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request) => boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests from this IP',
    keyGenerator: options.keyGenerator || ((req: Request) => {
      return req.ip || req.connection.remoteAddress || 'unknown';
    }),
    skip: options.skip || (() => false),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}, path: ${req.path}`);
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.round(options.windowMs / 1000),
        message: options.message || 'Too many requests from this IP'
      });
    }
  });
};

// Specific rate limiters
export const authRateLimit = createAdvancedRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later',
  keyGenerator: (req: Request) => {
    const email = req.body?.email || 'unknown';
    return `auth:${req.ip}:${email}`;
  }
});

export const apiRateLimit = createAdvancedRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'API rate limit exceeded'
});

export const strictRateLimit = createAdvancedRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Strict rate limit exceeded'
});

// IP Whitelist/Blacklist
const ipWhitelist = new Set<string>();
const ipBlacklist = new Set<string>();

export const addToWhitelist = (ip: string) => {
  ipWhitelist.add(ip);
  logger.info(`IP added to whitelist: ${ip}`);
};

export const addToBlacklist = (ip: string) => {
  ipBlacklist.add(ip);
  logger.warn(`IP added to blacklist: ${ip}`);
};

export const removeFromBlacklist = (ip: string) => {
  ipBlacklist.delete(ip);
  logger.info(`IP removed from blacklist: ${ip}`);
};

export const ipFilterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Check blacklist first
  if (ipBlacklist.has(clientIP)) {
    logger.warn(`Blocked request from blacklisted IP: ${clientIP}`);
    return res.status(403).json({
      error: 'Access denied',
      message: 'Your IP address has been blocked'
    });
  }
  
  // If whitelist is not empty and IP is not whitelisted
  if (ipWhitelist.size > 0 && !ipWhitelist.has(clientIP)) {
    logger.warn(`Blocked request from non-whitelisted IP: ${clientIP}`);
    return res.status(403).json({
      error: 'Access denied',
      message: 'Your IP address is not authorized'
    });
  }
  
  next();
};

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /(<script>|<\/script>)/i, // XSS attempts
    /(union|select|insert|delete|drop|create|alter)/i, // SQL injection attempts
    /(\.\.|\/etc\/|\/bin\/)/i, // Path traversal attempts
    /(eval\(|javascript:)/i // Code injection attempts
  ];
  
  const requestString = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestString)) {
      logger.error(`Suspicious request detected from IP: ${req.ip}`, {
        pattern: pattern.toString(),
        request: requestString,
        userAgent: req.headers['user-agent']
      });
      
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request contains suspicious content'
      });
    }
  }
  
  next();
};

// Content Security Policy
export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  );
  next();
};

// Request size validation
export const requestSizeValidator = (maxSize: number = 10 * 1024 * 1024) => { // 10MB default
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      logger.warn(`Request size exceeded limit: ${contentLength} bytes from IP: ${req.ip}`);
      return res.status(413).json({
        error: 'Request too large',
        message: `Request size exceeds ${maxSize} bytes limit`
      });
    }
    
    next();
  };
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  if (env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// Suspicious activity detector
const suspiciousActivity = new Map<string, {
  count: number;
  firstSeen: number;
  lastSeen: number;
  activities: string[];
}>();

export const trackSuspiciousActivity = (ip: string, activity: string) => {
  const now = Date.now();
  const existing = suspiciousActivity.get(ip) || {
    count: 0,
    firstSeen: now,
    lastSeen: now,
    activities: []
  };
  
  existing.count++;
  existing.lastSeen = now;
  existing.activities.push(activity);
  
  // Keep only last 10 activities
  if (existing.activities.length > 10) {
    existing.activities = existing.activities.slice(-10);
  }
  
  suspiciousActivity.set(ip, existing);
  
  // Auto-blacklist if too many suspicious activities
  if (existing.count > 10 && (now - existing.firstSeen) < 60000) { // 10 activities in 1 minute
    addToBlacklist(ip);
    logger.error(`IP auto-blacklisted due to suspicious activity: ${ip}`, existing);
  }
};

// Request logger with security focus
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('content-length') || 0
    };
    
    // Log suspicious status codes
    if (res.statusCode >= 400) {
      if (res.statusCode === 401 || res.statusCode === 403) {
        trackSuspiciousActivity(req.ip || 'unknown', `${res.statusCode} ${req.method} ${req.url}`);
      }
      logger.warn('HTTP Error', logData);
    } else if (env.NODE_ENV === 'development') {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};
