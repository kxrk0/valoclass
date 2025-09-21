import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthService } from '../../lib/auth';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../../types';
import { z } from 'zod';

const router = express.Router();

// Report filtering schema
const getReportsSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'all']).optional().default('all'),
  type: z.enum(['crosshair', 'lineup', 'comment', 'user', 'other', 'all']).optional().default('all'),
  priority: z.enum(['low', 'medium', 'high', 'critical', 'all']).optional().default('all'),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'priority', 'status', 'type']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('20')
});

// Report action schema
const reportActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'resolve', 'escalate']),
  reason: z.string().optional(),
  moderatorNote: z.string().optional()
});

// Middleware to verify admin role (cookie-based)
async function verifyAdmin(req: AuthenticatedRequest, res: Response, next: Function) {
  try {
    // Check both cookies and headers for auth token
    const token = req.cookies?.admin_token || 
                  req.cookies?.auth_token || 
                  req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = await AuthService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid authentication token' });
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

    // Attach user info to request
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

// GET /api/admin/reports - List reports with filtering
router.get('/', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, type, priority, search, sortBy, sortOrder, page, limit } = getReportsSchema.parse(req.query);

    // Build where clause
    const where: any = {};
    
    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (type !== 'all') {
      where.type = type.toUpperCase();
    }

    if (priority !== 'all') {
      where.priority = priority.toUpperCase();
    }

    if (search) {
      where.OR = [
        { reason: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { reporter: { username: { contains: search, mode: 'insensitive' } } },
        { reported: { username: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Get total count
    const totalCount = await prisma.report.count({ where });

    // Get reports with pagination
    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        reported: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        crosshair: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        lineup: {
          select: {
            id: true,
            title: true,
            map: true
          }
        },
        comment: {
          select: {
            id: true,
            content: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Admin reports GET error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// PUT /api/admin/reports/:id - Take action on report
router.put('/:id', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reportId = req.params.id;
    const { action, reason, moderatorNote } = reportActionSchema.parse(req.body);

    if (!reportId) {
      return res.status(400).json({ error: 'Report ID is required' });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: { select: { id: true, username: true } },
        reported: { select: { id: true, username: true } }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Update report status
    let updateData: any = {
      moderatedAt: new Date(),
      moderatedBy: req.user!.id
    };

    if (moderatorNote) {
      updateData.moderatorNote = moderatorNote;
    }

    switch (action) {
      case 'approve':
        updateData.status = 'APPROVED';
        break;
      case 'reject':
        updateData.status = 'REJECTED';
        if (reason) updateData.rejectionReason = reason;
        break;
      case 'resolve':
        updateData.status = 'RESOLVED';
        break;
      case 'escalate':
        updateData.priority = 'CRITICAL';
        updateData.status = 'ESCALATED';
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
      include: {
        reporter: { select: { id: true, username: true, avatar: true } },
        reported: { select: { id: true, username: true, avatar: true } }
      }
    });

    // Log admin activity
    await prisma.activity.create({
      data: {
        type: 'ADMIN_ACTION' as any,
        userId: req.user!.id,
        data: {
          action: 'REPORT_ACTION',
          reportId,
          reportAction: action,
          reason,
          moderatorNote,
          timestamp: new Date().toISOString()
        },
        isPublic: false
      }
    });

    res.json({
      message: `Report ${action}ed successfully`,
      report: updatedReport
    });

  } catch (error) {
    console.error('Admin reports PUT error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// GET /api/admin/reports/stats - Report statistics
router.get('/stats', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'APPROVED' } }),
      prisma.report.count({ where: { status: 'REJECTED' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { priority: 'CRITICAL' } }),
      prisma.report.count({ where: { priority: 'HIGH' } }),
      // New reports in last 24 hours
      prisma.report.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Reports by type
      prisma.report.groupBy({
        by: ['type'],
        _count: { type: true }
      })
    ]);

    const [
      totalReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      resolvedReports,
      criticalReports,
      highPriorityReports,
      newReportsToday,
      reportsByType
    ] = stats;

    res.json({
      totalReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      resolvedReports,
      criticalReports,
      highPriorityReports,
      newReportsToday,
      reportsByType: reportsByType.reduce((acc, item) => {
        acc[item.type.toLowerCase()] = item._count.type;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error('Admin report stats error:', error);
    res.status(500).json({ error: 'Failed to fetch report statistics' });
  }
});

export default router;
