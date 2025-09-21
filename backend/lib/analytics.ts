import { prisma } from './prisma';
import { logger } from './logger';
import { Request } from 'express';

interface UserContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: any;
  location?: any;
}

interface ActivityData {
  type: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  duration?: number;
  success?: boolean;
  errorCode?: string;
  isPublic?: boolean;
}

export class AnalyticsService {
  
  /**
   * Track user activity with comprehensive context
   */
  static async trackActivity(
    userContext: UserContext,
    activityData: ActivityData
  ): Promise<void> {
    try {
      // Don't track if no user context and activity requires user
      if (!userContext.userId && this.requiresUser(activityData.type)) {
        return;
      }

      await prisma.activity.create({
        data: {
          type: activityData.type as any,
          userId: userContext.userId!,
          entityType: activityData.entityType,
          entityId: activityData.entityId,
          ipAddress: userContext.ipAddress,
          userAgent: userContext.userAgent,
          sessionId: userContext.sessionId,
          deviceInfo: userContext.deviceInfo,
          location: userContext.location,
          duration: activityData.duration,
          success: activityData.success ?? true,
          errorCode: activityData.errorCode,
          metadata: activityData.metadata,
          isPublic: activityData.isPublic ?? true,
        }
      });

      // Update real-time analytics if needed
      await this.updateRealTimeMetrics(activityData.type);
      
    } catch (error) {
      logger.error('Failed to track activity:', error);
    }
  }

  /**
   * Track page view with comprehensive data
   */
  static async trackPageView(
    req: Request,
    userId?: string,
    additionalData?: any
  ): Promise<void> {
    try {
      const deviceInfo = this.extractDeviceInfo(req);
      const location = await this.extractLocation(req.ip);

      await prisma.pageView.create({
        data: {
          userId,
          path: req.path,
          title: additionalData?.title,
          referrer: req.get('Referer'),
          sessionId: req.sessionID || req.get('x-session-id') || 'anonymous',
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip,
          deviceType: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          screenSize: additionalData?.screenSize,
          country: location?.country,
          city: location?.city,
          loadTime: additionalData?.loadTime,
        }
      });

      // Update hourly analytics
      await this.updateHourlyAnalytics('pageViews', 1);
      
    } catch (error) {
      logger.error('Failed to track page view:', error);
    }
  }

  /**
   * Track system metrics
   */
  static async trackSystemMetric(
    metricType: string,
    value: number,
    unit?: string,
    source?: string,
    endpoint?: string,
    metadata?: any
  ): Promise<void> {
    try {
      await prisma.systemMetric.create({
        data: {
          metricType,
          value,
          unit,
          source,
          endpoint,
          metadata,
        }
      });
    } catch (error) {
      logger.error('Failed to track system metric:', error);
    }
  }

  /**
   * Log errors with comprehensive context
   */
  static async logError(
    error: Error,
    req?: Request,
    userId?: string,
    additionalContext?: any
  ): Promise<void> {
    try {
      await prisma.errorLog.create({
        data: {
          userId,
          errorType: error.name,
          errorMessage: error.message,
          errorCode: additionalContext?.errorCode,
          statusCode: additionalContext?.statusCode,
          method: req?.method,
          endpoint: req?.path,
          userAgent: req?.get('User-Agent'),
          ipAddress: req?.ip,
          stackTrace: error.stack,
          requestBody: req?.body,
          queryParams: req?.query,
          headers: this.sanitizeHeaders(req?.headers),
        }
      });

      // Update error metrics
      await this.updateHourlyAnalytics('errors', 1);
      
    } catch (logError) {
      logger.error('Failed to log error:', logError);
    }
  }

  /**
   * Update hourly analytics aggregations
   */
  static async updateHourlyAnalytics(
    metricName: string,
    increment: number = 1
  ): Promise<void> {
    try {
      const now = new Date();
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const hour = now.getHours();

      await prisma.analytics.upsert({
        where: {
          date_hour: {
            date,
            hour,
          }
        },
        update: {
          [metricName]: {
            increment
          }
        },
        create: {
          date,
          hour,
          [metricName]: increment,
        }
      });
    } catch (error) {
      logger.error('Failed to update hourly analytics:', error);
    }
  }

  /**
   * Get comprehensive analytics data for admin dashboard
   */
  static async getAnalyticsSummary(
    timeRange: '1h' | '24h' | '7d' | '30d' = '24h'
  ): Promise<any> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case '1h':
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const [
        userStats,
        contentStats,
        engagementStats,
        systemStats,
        recentActivities,
        topPages,
        errorStats
      ] = await Promise.all([
        this.getUserStats(startDate),
        this.getContentStats(startDate),
        this.getEngagementStats(startDate),
        this.getSystemStats(startDate),
        this.getRecentActivities(20),
        this.getTopPages(startDate, 10),
        this.getErrorStats(startDate)
      ]);

      return {
        timeRange,
        startDate,
        endDate: now,
        users: userStats,
        content: contentStats,
        engagement: engagementStats,
        system: systemStats,
        recentActivities,
        topPages,
        errors: errorStats,
      };
    } catch (error) {
      logger.error('Failed to get analytics summary:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  private static async getUserStats(startDate: Date): Promise<any> {
    const [
      totalUsers,
      activeUsers,
      newUsers,
      premiumUsers,
      onlineUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.activity.count({
        distinct: ['userId'],
        where: { createdAt: { gte: startDate } }
      }),
      prisma.user.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.user.count({
        where: { isPremium: true }
      }),
      // Users active in last 5 minutes
      prisma.activity.count({
        distinct: ['userId'],
        where: {
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000)
          }
        }
      })
    ]);

    return {
      total: totalUsers,
      active: activeUsers,
      new: newUsers,
      premium: premiumUsers,
      online: onlineUsers,
    };
  }

  /**
   * Get content statistics
   */
  private static async getContentStats(startDate: Date): Promise<any> {
    const [
      totalLineups,
      newLineups,
      totalCrosshairs,
      newCrosshairs,
      totalComments,
      newComments
    ] = await Promise.all([
      prisma.lineup.count(),
      prisma.lineup.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.crosshair.count(),
      prisma.crosshair.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.comment.count(),
      prisma.comment.count({
        where: { createdAt: { gte: startDate } }
      })
    ]);

    return {
      lineups: { total: totalLineups, new: newLineups },
      crosshairs: { total: totalCrosshairs, new: newCrosshairs },
      comments: { total: totalComments, new: newComments },
    };
  }

  /**
   * Get engagement statistics
   */
  private static async getEngagementStats(startDate: Date): Promise<any> {
    const [
      totalViews,
      totalLikes,
      totalBookmarks,
      avgSessionDuration
    ] = await Promise.all([
      prisma.pageView.count({
        where: { viewedAt: { gte: startDate } }
      }),
      prisma.like.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.bookmark.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.pageView.aggregate({
        where: {
          viewedAt: { gte: startDate },
          timeOnPage: { not: null }
        },
        _avg: { timeOnPage: true }
      })
    ]);

    return {
      views: totalViews,
      likes: totalLikes,
      bookmarks: totalBookmarks,
      avgSessionDuration: avgSessionDuration._avg.timeOnPage || 0,
    };
  }

  /**
   * Get system statistics
   */
  private static async getSystemStats(startDate: Date): Promise<any> {
    const [
      totalRequests,
      totalErrors,
      avgResponseTime
    ] = await Promise.all([
      prisma.activity.count({
        where: {
          type: 'API_REQUEST_MADE',
          createdAt: { gte: startDate }
        }
      }),
      prisma.errorLog.count({
        where: { occurredAt: { gte: startDate } }
      }),
      prisma.systemMetric.aggregate({
        where: {
          metricType: 'response_time',
          recordedAt: { gte: startDate }
        },
        _avg: { value: true }
      })
    ]);

    return {
      requests: totalRequests,
      errors: totalErrors,
      avgResponseTime: avgResponseTime._avg.value || 0,
      errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
    };
  }

  /**
   * Get recent activities
   */
  private static async getRecentActivities(limit: number = 20): Promise<any> {
    return await prisma.activity.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      }
    });
  }

  /**
   * Get top pages
   */
  private static async getTopPages(startDate: Date, limit: number = 10): Promise<any> {
    return await prisma.pageView.groupBy({
      by: ['path'],
      where: { viewedAt: { gte: startDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: limit,
    });
  }

  /**
   * Get error statistics
   */
  private static async getErrorStats(startDate: Date): Promise<any> {
    const [
      totalErrors,
      errorsByType,
      unresolvedErrors
    ] = await Promise.all([
      prisma.errorLog.count({
        where: { occurredAt: { gte: startDate } }
      }),
      prisma.errorLog.groupBy({
        by: ['errorType'],
        where: { occurredAt: { gte: startDate } },
        _count: { errorType: true },
        orderBy: { _count: { errorType: 'desc' } },
        take: 5,
      }),
      prisma.errorLog.count({
        where: {
          occurredAt: { gte: startDate },
          isResolved: false
        }
      })
    ]);

    return {
      total: totalErrors,
      byType: errorsByType,
      unresolved: unresolvedErrors,
    };
  }

  /**
   * Update real-time metrics
   */
  private static async updateRealTimeMetrics(activityType: string): Promise<void> {
    // This could be used to update Redis cache or WebSocket real-time data
    // For now, we'll just log it
    logger.info(`Real-time metric update: ${activityType}`);
  }

  /**
   * Extract device information from request
   */
  private static extractDeviceInfo(req: Request): any {
    const userAgent = req.get('User-Agent') || '';
    
    // Simple device detection (you might want to use a library like ua-parser-js)
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Tablet/.test(userAgent);
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    
    const browser = this.extractBrowser(userAgent);
    const os = this.extractOS(userAgent);

    return {
      deviceType,
      browser,
      os,
      userAgent,
    };
  }

  /**
   * Extract browser from user agent
   */
  private static extractBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * Extract OS from user agent
   */
  private static extractOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }

  /**
   * Extract location from IP (placeholder - you'd use a service like MaxMind)
   */
  private static async extractLocation(ip?: string): Promise<any> {
    // Placeholder implementation
    return {
      country: 'Unknown',
      city: 'Unknown',
    };
  }

  /**
   * Sanitize headers for logging
   */
  private static sanitizeHeaders(headers?: any): any {
    if (!headers) return {};
    
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    
    return sanitized;
  }

  /**
   * Check if activity type requires a user
   */
  private static requiresUser(activityType: string): boolean {
    const guestActivities = [
      'LINEUP_VIEWED',
      'CROSSHAIR_VIEWED',
      'API_REQUEST_MADE',
      'SEARCH_PERFORMED',
      'ERROR_ENCOUNTERED'
    ];
    
    return !guestActivities.includes(activityType);
  }
}

/**
 * Middleware to automatically track API requests
 */
export const analyticsMiddleware = (req: Request, res: any, next: any) => {
  const startTime = Date.now();

  // Track the request
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    const userId = (req as any).user?.id;

    // Track API request
    AnalyticsService.trackActivity(
      {
        userId,
        sessionId: req.sessionID || req.get('x-session-id'),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
      {
        type: 'API_REQUEST_MADE',
        duration,
        success: res.statusCode < 400,
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          responseSize: data ? JSON.stringify(data).length : 0,
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

    return originalSend.call(this, data);
  };

  next();
};
