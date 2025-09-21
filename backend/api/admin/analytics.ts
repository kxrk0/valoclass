import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthService } from '../../lib/auth';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../../types';
import { z } from 'zod';
import { AnalyticsService } from '../../lib/analytics';

const router = express.Router();

// Analytics query schema
const analyticsQuerySchema = z.object({
  timeRange: z.enum(['1h', '24h', '7d', '30d']).optional().default('24h'),
  metric: z.enum(['users', 'content', 'engagement', 'system', 'errors', 'all']).optional().default('all'),
  granularity: z.enum(['hour', 'day', 'week']).optional().default('hour'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// Middleware to verify admin role
async function verifyAdmin(req: AuthenticatedRequest, res: Response, next: Function) {
  try {
    const token = req.cookies?.admin_token || 
                  req.cookies?.auth_token || 
                  req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = await AuthService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        role: true, 
        isActive: true, 
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || !user.isActive || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as any,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// GET /api/admin/analytics - Get comprehensive analytics
router.get('/', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { timeRange, metric } = analyticsQuerySchema.parse(req.query);

    const analytics = await AnalyticsService.getAnalyticsSummary(timeRange);

    // Filter by specific metric if requested
    if (metric !== 'all') {
      const filteredAnalytics = {
        timeRange: analytics.timeRange,
        startDate: analytics.startDate,
        endDate: analytics.endDate,
        [metric]: analytics[metric]
      };
      return res.json(filteredAnalytics);
    }

    res.json(analytics);

  } catch (error) {
    console.error('Admin analytics GET error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/admin/analytics/dashboard - Get real-time dashboard data
router.get('/dashboard', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const [
      // Real-time metrics
      onlineUsers,
      todayStats,
      hourlyStats,
      recentErrors,
      systemHealth,
      contentStats,
      engagementMetrics,
      geographicData
    ] = await Promise.all([
      // Users online in last 5 minutes
      prisma.activity.count({
        distinct: ['userId'],
        where: {
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000)
          }
        }
      }),

      // Today's statistics
      this.getTodayStats(last24h),
      
      // Last hour statistics
      this.getHourlyStats(lastHour),
      
      // Recent errors (last 1 hour)
      prisma.errorLog.findMany({
        where: { occurredAt: { gte: lastHour } },
        orderBy: { occurredAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { id: true, username: true }
          }
        }
      }),

      // System health metrics
      this.getSystemHealth(),
      
      // Content statistics
      this.getContentStats(last24h),
      
      // Engagement metrics
      this.getEngagementMetrics(last24h),
      
      // Geographic data
      this.getGeographicData(last24h)
    ]);

    res.json({
      realtime: {
        onlineUsers,
        timestamp: now,
      },
      today: todayStats,
      lastHour: hourlyStats,
      recentErrors,
      systemHealth,
      content: contentStats,
      engagement: engagementMetrics,
      geographic: geographicData,
    });

  } catch (error) {
    console.error('Admin dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

// GET /api/admin/analytics/charts/:type - Get chart data
router.get('/charts/:type', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const chartType = req.params.type;
    const { timeRange = '24h', granularity = 'hour' } = req.query;

    let chartData;

    switch (chartType) {
      case 'users':
        chartData = await this.getUserChartData(timeRange as string, granularity as string);
        break;
      case 'content':
        chartData = await this.getContentChartData(timeRange as string, granularity as string);
        break;
      case 'engagement':
        chartData = await this.getEngagementChartData(timeRange as string, granularity as string);
        break;
      case 'performance':
        chartData = await this.getPerformanceChartData(timeRange as string, granularity as string);
        break;
      case 'errors':
        chartData = await this.getErrorChartData(timeRange as string, granularity as string);
        break;
      default:
        return res.status(400).json({ error: 'Invalid chart type' });
    }

    res.json(chartData);

  } catch (error) {
    console.error('Admin chart data error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// GET /api/admin/analytics/activities - Get recent activities with filtering
router.get('/activities', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      type,
      userId,
      limit = '50',
      offset = '0',
      startDate,
      endDate
    } = req.query;

    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const totalCount = await prisma.activity.count({ where });

    res.json({
      activities,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: totalCount > parseInt(offset as string) + parseInt(limit as string)
      }
    });

  } catch (error) {
    console.error('Admin activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET /api/admin/analytics/reports - Get comprehensive reports
router.get('/reports', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      reportType = 'summary',
      timeRange = '30d'
    } = req.query;

    let reportData;

    switch (reportType) {
      case 'summary':
        reportData = await this.generateSummaryReport(timeRange as string);
        break;
      case 'users':
        reportData = await this.generateUserReport(timeRange as string);
        break;
      case 'content':
        reportData = await this.generateContentReport(timeRange as string);
        break;
      case 'performance':
        reportData = await this.generatePerformanceReport(timeRange as string);
        break;
      case 'security':
        reportData = await this.generateSecurityReport(timeRange as string);
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    res.json({
      reportType,
      timeRange,
      generatedAt: new Date(),
      data: reportData
    });

  } catch (error) {
    console.error('Admin reports error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Helper methods for the analytics router
const analyticsHelpers = {
  
  async getTodayStats(startDate: Date) {
    const [
      newUsers,
      activeUsers,
      pageViews,
      apiRequests,
      errors,
      newContent
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      prisma.activity.count({ distinct: ['userId'], where: { createdAt: { gte: startDate } } }),
      prisma.pageView.count({ where: { viewedAt: { gte: startDate } } }),
      prisma.activity.count({ where: { type: 'API_REQUEST_MADE', createdAt: { gte: startDate } } }),
      prisma.errorLog.count({ where: { occurredAt: { gte: startDate } } }),
      Promise.all([
        prisma.lineup.count({ where: { createdAt: { gte: startDate } } }),
        prisma.crosshair.count({ where: { createdAt: { gte: startDate } } }),
        prisma.comment.count({ where: { createdAt: { gte: startDate } } })
      ]).then(([lineups, crosshairs, comments]) => ({ lineups, crosshairs, comments }))
    ]);

    return {
      newUsers,
      activeUsers,
      pageViews,
      apiRequests,
      errors,
      newContent
    };
  },

  async getHourlyStats(startDate: Date) {
    const activities = await prisma.activity.count({
      where: { createdAt: { gte: startDate } }
    });

    const errors = await prisma.errorLog.count({
      where: { occurredAt: { gte: startDate } }
    });

    return {
      activities,
      errors,
      errorRate: activities > 0 ? (errors / activities) * 100 : 0
    };
  },

  async getSystemHealth() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const [
      recentErrors,
      avgResponseTime,
      activeConnections
    ] = await Promise.all([
      prisma.errorLog.count({
        where: { occurredAt: { gte: fiveMinutesAgo } }
      }),
      prisma.systemMetric.aggregate({
        where: {
          metricType: 'response_time',
          recordedAt: { gte: fiveMinutesAgo }
        },
        _avg: { value: true }
      }),
      prisma.session.count({
        where: {
          isActive: true,
          lastActivity: { gte: fiveMinutesAgo }
        }
      })
    ]);

    return {
      status: recentErrors < 5 ? 'healthy' : recentErrors < 20 ? 'warning' : 'critical',
      recentErrors,
      avgResponseTime: avgResponseTime._avg.value || 0,
      activeConnections
    };
  },

  async getContentStats(startDate: Date) {
    const [
      totalLineups,
      totalCrosshairs,
      totalComments,
      newToday
    ] = await Promise.all([
      prisma.lineup.count(),
      prisma.crosshair.count(),
      prisma.comment.count(),
      Promise.all([
        prisma.lineup.count({ where: { createdAt: { gte: startDate } } }),
        prisma.crosshair.count({ where: { createdAt: { gte: startDate } } }),
        prisma.comment.count({ where: { createdAt: { gte: startDate } } })
      ]).then(([lineups, crosshairs, comments]) => ({ lineups, crosshairs, comments }))
    ]);

    return {
      total: {
        lineups: totalLineups,
        crosshairs: totalCrosshairs,
        comments: totalComments
      },
      newToday
    };
  },

  async getEngagementMetrics(startDate: Date) {
    const [
      views,
      likes,
      bookmarks,
      shares,
      avgTimeOnPage
    ] = await Promise.all([
      prisma.pageView.count({ where: { viewedAt: { gte: startDate } } }),
      prisma.like.count({ where: { createdAt: { gte: startDate } } }),
      prisma.bookmark.count({ where: { createdAt: { gte: startDate } } }),
      prisma.activity.count({ where: { type: 'CROSSHAIR_SHARED', createdAt: { gte: startDate } } }),
      prisma.pageView.aggregate({
        where: {
          viewedAt: { gte: startDate },
          timeOnPage: { not: null }
        },
        _avg: { timeOnPage: true }
      })
    ]);

    return {
      views,
      likes,
      bookmarks,
      shares,
      avgTimeOnPage: avgTimeOnPage._avg.timeOnPage || 0
    };
  },

  async getGeographicData(startDate: Date) {
    const geoData = await prisma.pageView.groupBy({
      by: ['country'],
      where: {
        viewedAt: { gte: startDate },
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10
    });

    return geoData.map(item => ({
      country: item.country,
      visits: item._count.country
    }));
  },

  async getUserChartData(timeRange: string, granularity: string) {
    // Implementation for user chart data
    const startDate = this.getStartDate(timeRange);
    const intervals = this.generateTimeIntervals(startDate, new Date(), granularity);

    const data = await Promise.all(intervals.map(async (interval) => {
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: interval.start,
            lt: interval.end
          }
        }
      });
      return {
        date: interval.start,
        value: count
      };
    }));

    return data;
  },

  async getContentChartData(timeRange: string, granularity: string) {
    const startDate = this.getStartDate(timeRange);
    const intervals = this.generateTimeIntervals(startDate, new Date(), granularity);

    const data = await Promise.all(intervals.map(async (interval) => {
      const [lineups, crosshairs, comments] = await Promise.all([
        prisma.lineup.count({
          where: { createdAt: { gte: interval.start, lt: interval.end } }
        }),
        prisma.crosshair.count({
          where: { createdAt: { gte: interval.start, lt: interval.end } }
        }),
        prisma.comment.count({
          where: { createdAt: { gte: interval.start, lt: interval.end } }
        })
      ]);

      return {
        date: interval.start,
        lineups,
        crosshairs,
        comments
      };
    }));

    return data;
  },

  getStartDate(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  },

  generateTimeIntervals(start: Date, end: Date, granularity: string) {
    const intervals = [];
    const current = new Date(start);

    while (current < end) {
      const intervalStart = new Date(current);
      
      switch (granularity) {
        case 'hour':
          current.setHours(current.getHours() + 1);
          break;
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
      }

      intervals.push({
        start: intervalStart,
        end: new Date(current)
      });
    }

    return intervals;
  }
};

// Attach helper methods to router
Object.assign(router, analyticsHelpers);

export default router;
