import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../lib/analytics';

interface AnalyticsRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
  startTime?: number;
}

/**
 * Middleware to track all API requests and responses
 */
export const trackApiRequest = (req: AnalyticsRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();

  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function(data: any) {
    const duration = Date.now() - (req.startTime || Date.now());
    const success = res.statusCode < 400;

    // Track the API request
    AnalyticsService.trackActivity(
      {
        userId: req.user?.id,
        sessionId: req.sessionID || req.get('x-session-id'),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        deviceInfo: extractDeviceInfo(req),
      },
      {
        type: 'API_REQUEST_MADE',
        duration,
        success,
        errorCode: success ? undefined : res.statusCode.toString(),
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          responseSize: JSON.stringify(data).length,
          queryParams: req.query,
          userAgent: req.get('User-Agent'),
        },
        isPublic: false,
      }
    );

    // Track system metrics
    AnalyticsService.trackSystemMetric(
      'response_time',
      duration,
      'ms',
      'api_server',
      req.path
    );

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Middleware to track user page views
 */
export const trackPageView = (req: AnalyticsRequest, res: Response, next: NextFunction) => {
  // Only track GET requests to avoid duplicate tracking
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    AnalyticsService.trackPageView(req, req.user?.id);
  }
  next();
};

/**
 * Middleware to track user login events
 */
export const trackUserLogin = (userId: string, req: Request, loginMethod: string = 'credentials') => {
  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      deviceInfo: extractDeviceInfo(req),
    },
    {
      type: 'LOGIN',
      metadata: {
        loginMethod,
        timestamp: new Date(),
      },
      isPublic: false,
    }
  );

  // Also create an auth event
  AnalyticsService.trackActivity(
    {
      userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: 'LOGIN',
      metadata: {
        eventType: 'LOGIN',
        success: true,
        loginMethod,
      },
      isPublic: false,
    }
  );
};

/**
 * Middleware to track user logout events
 */
export const trackUserLogout = (userId: string, req: Request) => {
  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: 'LOGOUT',
      metadata: {
        timestamp: new Date(),
      },
      isPublic: false,
    }
  );
};

/**
 * Middleware to track content creation
 */
export const trackContentCreation = (
  userId: string,
  contentType: 'LINEUP' | 'CROSSHAIR' | 'COMMENT',
  contentId: string,
  req: Request,
  additionalMetadata?: any
) => {
  const activityType = contentType === 'LINEUP' ? 'LINEUP_CREATED' :
                      contentType === 'CROSSHAIR' ? 'CROSSHAIR_CREATED' :
                      'COMMENT_POSTED';

  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: activityType,
      entityType: contentType,
      entityId: contentId,
      metadata: {
        ...additionalMetadata,
        timestamp: new Date(),
      },
      isPublic: true,
    }
  );
};

/**
 * Middleware to track content interactions
 */
export const trackContentInteraction = (
  userId: string,
  interactionType: 'VIEW' | 'LIKE' | 'UNLIKE' | 'BOOKMARK' | 'UNBOOKMARK' | 'DOWNLOAD' | 'SHARE',
  contentType: 'LINEUP' | 'CROSSHAIR' | 'COMMENT',
  contentId: string,
  req: Request,
  additionalMetadata?: any
) => {
  const activityType = `${contentType}_${interactionType}` as any;

  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: activityType,
      entityType: contentType,
      entityId: contentId,
      metadata: {
        ...additionalMetadata,
        timestamp: new Date(),
      },
      isPublic: true,
    }
  );
};

/**
 * Middleware to track social interactions
 */
export const trackSocialInteraction = (
  userId: string,
  interactionType: 'FOLLOW' | 'UNFOLLOW' | 'BLOCK' | 'UNBLOCK',
  targetUserId: string,
  req: Request
) => {
  const activityType = `USER_${interactionType}ED` as any;

  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: activityType,
      entityType: 'USER',
      entityId: targetUserId,
      metadata: {
        targetUserId,
        timestamp: new Date(),
      },
      isPublic: true,
    }
  );
};

/**
 * Middleware to track search queries
 */
export const trackSearch = (
  userId: string | undefined,
  query: string,
  filters: any,
  results: number,
  req: Request
) => {
  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: 'SEARCH_PERFORMED',
      metadata: {
        query,
        filters,
        resultCount: results,
        timestamp: new Date(),
      },
      isPublic: false,
    }
  );
};

/**
 * Middleware to track admin actions
 */
export const trackAdminAction = (
  adminUserId: string,
  action: string,
  targetUserId?: string,
  req?: Request,
  additionalMetadata?: any
) => {
  AnalyticsService.trackActivity(
    {
      userId: adminUserId,
      sessionId: req?.sessionID || req?.get('x-session-id'),
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
    },
    {
      type: 'ADMIN_ACTION',
      entityType: targetUserId ? 'USER' : undefined,
      entityId: targetUserId,
      metadata: {
        action,
        targetUserId,
        ...additionalMetadata,
        timestamp: new Date(),
      },
      isPublic: false,
    }
  );
};

/**
 * Error tracking middleware
 */
export const trackError = (
  error: Error,
  req: Request,
  userId?: string,
  additionalContext?: any
) => {
  AnalyticsService.logError(error, req, userId, additionalContext);

  // Also track as an activity
  AnalyticsService.trackActivity(
    {
      userId,
      sessionId: req.sessionID || req.get('x-session-id'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    },
    {
      type: 'ERROR_ENCOUNTERED',
      success: false,
      errorCode: error.name,
      metadata: {
        errorMessage: error.message,
        endpoint: req.path,
        method: req.method,
        ...additionalContext,
      },
      isPublic: false,
    }
  );
};

/**
 * Extract device information from request
 */
function extractDeviceInfo(req: Request): any {
  const userAgent = req.get('User-Agent') || '';
  
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Tablet/.test(userAgent);
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  
  return {
    deviceType,
    browser: extractBrowser(userAgent),
    os: extractOS(userAgent),
    userAgent,
  };
}

function extractBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function extractOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
}
