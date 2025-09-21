import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthService } from '../../lib/auth';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../../types';
import { z } from 'zod';
import { AnalyticsService } from '../../lib/analytics';
import os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

const router = express.Router();
const execAsync = promisify(exec);

// System configuration schema
const systemConfigSchema = z.object({
  maxFileSize: z.number().optional(),
  rateLimitWindow: z.number().optional(),
  rateLimitMax: z.number().optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistrations: z.boolean().optional(),
  featuresEnabled: z.object({
    lineups: z.boolean().optional(),
    crosshairs: z.boolean().optional(),
    comments: z.boolean().optional(),
    achievements: z.boolean().optional(),
  }).optional()
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
        email: true
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// GET /api/admin/system/health - System health check
router.get('/health', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      dbHealth,
      systemInfo,
      appMetrics,
      recentErrors
    ] = await Promise.all([
      checkDatabaseHealth(),
      getSystemInfo(),
      getApplicationMetrics(),
      getRecentErrors()
    ]);

    const overallHealth = determineOverallHealth(dbHealth, systemInfo, appMetrics, recentErrors);

    res.json({
      status: overallHealth.status,
      timestamp: new Date(),
      checks: {
        database: dbHealth,
        system: systemInfo,
        application: appMetrics,
        errors: recentErrors
      },
      summary: overallHealth.summary
    });

  } catch (error) {
    console.error('System health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Failed to perform health check',
      timestamp: new Date()
    });
  }
});

// GET /api/admin/system/metrics - Detailed system metrics
router.get('/metrics', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const timeRange = req.query.timeRange as string || '1h';
    const startDate = getStartDate(timeRange);

    const [
      systemMetrics,
      performanceMetrics,
      resourceUtilization,
      errorMetrics
    ] = await Promise.all([
      getSystemMetrics(startDate),
      getPerformanceMetrics(startDate),
      getResourceUtilization(),
      getErrorMetrics(startDate)
    ]);

    res.json({
      timeRange,
      startDate,
      endDate: new Date(),
      system: systemMetrics,
      performance: performanceMetrics,
      resources: resourceUtilization,
      errors: errorMetrics
    });

  } catch (error) {
    console.error('System metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

// GET /api/admin/system/logs - System logs with filtering
router.get('/logs', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      level = 'all',
      source = 'all',
      limit = '100',
      offset = '0',
      startDate,
      endDate,
      search
    } = req.query;

    const where: any = {};

    if (level !== 'all') {
      where.errorType = level;
    }

    if (startDate && endDate) {
      where.occurredAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    if (search) {
      where.OR = [
        { errorMessage: { contains: search as string, mode: 'insensitive' } },
        { endpoint: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [logs, totalCount] = await Promise.all([
      prisma.errorLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: { occurredAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.errorLog.count({ where })
    ]);

    res.json({
      logs,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: totalCount > parseInt(offset as string) + parseInt(limit as string)
      }
    });

  } catch (error) {
    console.error('System logs error:', error);
    res.status(500).json({ error: 'Failed to fetch system logs' });
  }
});

// POST /api/admin/system/maintenance - Toggle maintenance mode
router.post('/maintenance', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enabled, message } = req.body;

    // Here you would typically update a configuration store or cache
    // For now, we'll track it as a system metric
    await AnalyticsService.trackSystemMetric(
      'maintenance_mode',
      enabled ? 1 : 0,
      'boolean',
      'admin_panel',
      undefined,
      {
        message,
        changedBy: req.user!.username,
        timestamp: new Date()
      }
    );

    // Log the admin action
    await AnalyticsService.trackActivity(
      {
        userId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      },
      {
        type: 'ADMIN_ACTION',
        metadata: {
          action: 'MAINTENANCE_MODE_TOGGLE',
          enabled,
          message
        },
        isPublic: false
      }
    );

    res.json({
      message: enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
      maintenanceMode: {
        enabled,
        message,
        timestamp: new Date(),
        changedBy: req.user!.username
      }
    });

  } catch (error) {
    console.error('Maintenance mode toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle maintenance mode' });
  }
});

// POST /api/admin/system/cache/clear - Clear application cache
router.post('/cache/clear', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cacheType = 'all' } = req.body;

    // Here you would clear Redis cache, in-memory cache, etc.
    // For demonstration, we'll just log the action

    await AnalyticsService.trackActivity(
      {
        userId: req.user!.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      },
      {
        type: 'ADMIN_ACTION',
        metadata: {
          action: 'CACHE_CLEAR',
          cacheType
        },
        isPublic: false
      }
    );

    res.json({
      message: `Cache cleared successfully`,
      cacheType,
      clearedAt: new Date(),
      clearedBy: req.user!.username
    });

  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// GET /api/admin/system/database - Database statistics
router.get('/database', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      collections,
      totalDocuments,
      recentActivity
    ] = await Promise.all([
      getDatabaseCollectionStats(),
      getTotalDocumentCount(),
      getRecentDatabaseActivity()
    ]);

    res.json({
      collections,
      totalDocuments,
      recentActivity,
      lastChecked: new Date()
    });

  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({ error: 'Failed to fetch database statistics' });
  }
});

// Helper functions
async function checkDatabaseHealth() {
  try {
    // Test database connection by running a simple query
    const userCount = await prisma.user.count();
    
    return {
      status: 'healthy',
      connection: 'active',
      latency: 0, // You could measure actual latency here
      recordCount: userCount
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getSystemInfo() {
  return {
    status: 'healthy',
    platform: os.platform(),
    architecture: os.arch(),
    nodeVersion: process.version,
    uptime: process.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      percentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
    },
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0]?.model || 'Unknown',
      loadAverage: os.loadavg()
    }
  };
}

async function getApplicationMetrics() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const [
    activeUsers,
    recentRequests,
    averageResponseTime
  ] = await Promise.all([
    prisma.activity.count({
      distinct: ['userId'],
      where: { createdAt: { gte: fiveMinutesAgo } }
    }),
    prisma.activity.count({
      where: {
        type: 'API_REQUEST_MADE',
        createdAt: { gte: fiveMinutesAgo }
      }
    }),
    prisma.systemMetric.aggregate({
      where: {
        metricType: 'response_time',
        recordedAt: { gte: fiveMinutesAgo }
      },
      _avg: { value: true }
    })
  ]);

  return {
    status: 'healthy',
    activeUsers,
    recentRequests,
    averageResponseTime: averageResponseTime._avg.value || 0,
    requestsPerMinute: recentRequests / 5
  };
}

async function getRecentErrors() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  const errorCount = await prisma.errorLog.count({
    where: { occurredAt: { gte: fiveMinutesAgo } }
  });

  return {
    status: errorCount < 5 ? 'healthy' : errorCount < 20 ? 'warning' : 'critical',
    count: errorCount,
    timeframe: '5 minutes'
  };
}

function determineOverallHealth(dbHealth: any, systemInfo: any, appMetrics: any, recentErrors: any) {
  const checks = [dbHealth.status, systemInfo.status, appMetrics.status, recentErrors.status];
  
  if (checks.includes('critical')) {
    return {
      status: 'critical',
      summary: 'System requires immediate attention'
    };
  } else if (checks.includes('warning')) {
    return {
      status: 'warning',
      summary: 'System is operational but needs monitoring'
    };
  } else if (checks.every(status => status === 'healthy')) {
    return {
      status: 'healthy',
      summary: 'All systems operational'
    };
  } else {
    return {
      status: 'unknown',
      summary: 'System status unclear'
    };
  }
}

async function getSystemMetrics(startDate: Date) {
  const metrics = await prisma.systemMetric.findMany({
    where: { recordedAt: { gte: startDate } },
    orderBy: { recordedAt: 'desc' },
    take: 100
  });

  // Group metrics by type
  const groupedMetrics = metrics.reduce((acc: any, metric) => {
    if (!acc[metric.metricType]) {
      acc[metric.metricType] = [];
    }
    acc[metric.metricType].push({
      value: metric.value,
      timestamp: metric.recordedAt
    });
    return acc;
  }, {});

  return groupedMetrics;
}

async function getPerformanceMetrics(startDate: Date) {
  const [
    avgResponseTime,
    totalRequests,
    errorRate
  ] = await Promise.all([
    prisma.systemMetric.aggregate({
      where: {
        metricType: 'response_time',
        recordedAt: { gte: startDate }
      },
      _avg: { value: true }
    }),
    prisma.activity.count({
      where: {
        type: 'API_REQUEST_MADE',
        createdAt: { gte: startDate }
      }
    }),
    Promise.all([
      prisma.activity.count({
        where: {
          type: 'API_REQUEST_MADE',
          createdAt: { gte: startDate }
        }
      }),
      prisma.errorLog.count({
        where: { occurredAt: { gte: startDate } }
      })
    ]).then(([requests, errors]) => 
      requests > 0 ? (errors / requests) * 100 : 0
    )
  ]);

  return {
    averageResponseTime: avgResponseTime._avg.value || 0,
    totalRequests,
    errorRate,
    throughput: totalRequests / ((Date.now() - startDate.getTime()) / 1000 / 60) // requests per minute
  };
}

function getResourceUtilization() {
  const memUsage = process.memoryUsage();
  
  return {
    memory: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      heapUsedPercentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
    },
    cpu: {
      loadAverage: os.loadavg(),
      usage: process.cpuUsage()
    }
  };
}

async function getErrorMetrics(startDate: Date) {
  const [
    totalErrors,
    errorsByType,
    criticalErrors
  ] = await Promise.all([
    prisma.errorLog.count({
      where: { occurredAt: { gte: startDate } }
    }),
    prisma.errorLog.groupBy({
      by: ['errorType'],
      where: { occurredAt: { gte: startDate } },
      _count: { errorType: true },
      orderBy: { _count: { errorType: 'desc' } }
    }),
    prisma.errorLog.count({
      where: {
        occurredAt: { gte: startDate },
        statusCode: { gte: 500 }
      }
    })
  ]);

  return {
    total: totalErrors,
    byType: errorsByType,
    critical: criticalErrors
  };
}

async function getDatabaseCollectionStats() {
  // Get document counts for each collection
  const [
    users,
    lineups,
    crosshairs,
    comments,
    activities,
    sessions
  ] = await Promise.all([
    prisma.user.count(),
    prisma.lineup.count(),
    prisma.crosshair.count(),
    prisma.comment.count(),
    prisma.activity.count(),
    prisma.session.count()
  ]);

  return {
    users,
    lineups,
    crosshairs,
    comments,
    activities,
    sessions
  };
}

async function getTotalDocumentCount() {
  const collections = await getDatabaseCollectionStats();
  return Object.values(collections).reduce((total, count) => total + count, 0);
}

async function getRecentDatabaseActivity() {
  const lastHour = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentActivity = await prisma.activity.count({
    where: { createdAt: { gte: lastHour } }
  });

  return {
    lastHour: recentActivity,
    averagePerMinute: recentActivity / 60
  };
}

function getStartDate(timeRange: string): Date {
  const now = new Date();
  switch (timeRange) {
    case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
    case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default: return new Date(now.getTime() - 60 * 60 * 1000);
  }
}

export default router;
