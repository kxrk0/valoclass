import express from 'express';
import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthService } from '../../lib/auth';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../../types';
import { z } from 'zod';

const router = express.Router();

// User filtering and pagination schema
const getUsersSchema = z.object({
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('20'),
  search: z.string().optional(),
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['username', 'email', 'createdAt', 'lastLoginAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// User update schema
const updateUserSchema = z.object({
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isPremium: z.boolean().optional()
});

// Bulk action schema
const bulkActionSchema = z.object({
  userIds: z.array(z.string()),
  action: z.enum(['activate', 'deactivate', 'verify', 'unverify', 'promote', 'demote', 'delete']),
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional()
});

// Middleware to verify admin role
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

// GET /api/admin/users - List users with filtering
router.get('/', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, search, role, isActive, sortBy, sortOrder } = getUsersSchema.parse(req.query);

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Get total count
    const totalCount = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        isPremium: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            lineups: true,
            crosshairs: true,
            comments: true,
            reports: true
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
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Admin users GET error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/:id', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = updateUserSchema.parse(req.body);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        isPremium: true
      }
    });

    // Log admin activity
    await prisma.activity.create({
      data: {
        type: 'ADMIN_ACTION' as any,
        userId: req.user!.id,
        data: {
          action: 'USER_UPDATE',
          targetUserId: userId,
          changes: updateData,
          timestamp: new Date().toISOString()
        },
        isPublic: false
      }
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Admin users PUT error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// POST /api/admin/users/bulk - Bulk actions
router.post('/bulk', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userIds, action, role } = bulkActionSchema.parse(req.body);

    let updateData: any = {};
    let actionDescription = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        actionDescription = 'Activated users';
        break;
      case 'deactivate':
        updateData = { isActive: false };
        actionDescription = 'Deactivated users';
        break;
      case 'verify':
        updateData = { isVerified: true };
        actionDescription = 'Verified users';
        break;
      case 'unverify':
        updateData = { isVerified: false };
        actionDescription = 'Unverified users';
        break;
      case 'promote':
        if (!role) {
          return res.status(400).json({ error: 'Role is required for promotion' });
        }
        updateData = { role };
        actionDescription = `Promoted users to ${role}`;
        break;
      case 'demote':
        updateData = { role: UserRole.USER };
        actionDescription = 'Demoted users to USER';
        break;
      case 'delete':
        // Soft delete - just deactivate
        updateData = { isActive: false };
        actionDescription = 'Deleted users';
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Execute bulk update
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: updateData
    });

    // Log admin activity
    await prisma.activity.create({
      data: {
        type: 'ADMIN_ACTION' as any,
        userId: req.user!.id,
        data: {
          action: 'BULK_USER_ACTION',
          bulkAction: action,
          affectedUsers: userIds.length,
          userIds,
          timestamp: new Date().toISOString()
        },
        isPublic: false
      }
    });

    res.json({
      message: `${actionDescription}: ${result.count} users affected`,
      affectedCount: result.count
    });

  } catch (error) {
    console.error('Admin users bulk action error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to execute bulk action' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/:id', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Soft delete - deactivate user instead of hard delete
    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    // Log admin activity
    await prisma.activity.create({
      data: {
        type: 'ADMIN_ACTION' as any,
        userId: req.user!.id,
        data: {
          action: 'USER_DELETE',
          deletedUserId: userId,
          deletedUserInfo: {
            username: deletedUser.username,
            email: deletedUser.email
          },
          timestamp: new Date().toISOString()
        },
        isPublic: false
      }
    });

    res.json({
      message: 'User deleted successfully',
      user: deletedUser
    });

  } catch (error) {
    console.error('Admin users DELETE error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/admin/users/stats - User statistics
router.get('/stats', verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({ where: { role: UserRole.MODERATOR } }),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.user.count({ where: { isPremium: true } }),
      // New users in last 24 hours
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Active users in last 24 hours
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    const [
      totalUsers,
      activeUsers,
      adminUsers,
      moderatorUsers,
      verifiedUsers,
      premiumUsers,
      newUsersToday,
      activeUsersToday
    ] = stats;

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminUsers,
      moderatorUsers,
      regularUsers: totalUsers - adminUsers - moderatorUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      newUsersToday,
      activeUsersToday
    });

  } catch (error) {
    console.error('Admin user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

export default router;
