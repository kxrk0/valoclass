import { Router, Request, Response } from 'express';
import { AuthService } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

// GET /api/auth/me - Current user info + session status
router.get('/me', async (req: Request, res: Response) => {
  try {
    console.log('🔍 /api/auth/me - Cookie debug:');
    console.log('- req.cookies:', req.cookies);
    console.log('- req.cookies?.authToken:', req.cookies?.authToken ? 'Found' : 'Missing');
    console.log('- req.cookies?.access_token:', req.cookies?.access_token ? 'Found' : 'Missing');
    console.log('- Headers authorization:', req.headers.authorization ? 'Present' : 'Missing');
    
    const token = req.cookies?.authToken || req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');
    
    console.log('- Final token:', token ? `Found (${token.substring(0, 20)}...)` : 'Not found');
    
    if (!token) {
      console.log('❌ /api/auth/me - No token found, returning 401');
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
        user: null,
        session: null
      });
    }

    // Verify JWT token
    const decoded = await AuthService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        user: null,
        session: null
      });
    }

    // Get user from database with full details
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        accounts: {
          select: {
            provider: true,
            createdAt: true
          }
        },
        sessions: {
          where: {
            token: token,
            isActive: true,
            expiresAt: { gt: new Date() }
          },
          select: {
            id: true,
            lastActivity: true,
            deviceInfo: true,
            ipAddress: true,
            isAdminSession: true,
            expiresAt: true,
            createdAt: true
          },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        user: null,
        session: null
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
        user: null,
        session: null
      });
    }

    // Update last activity if session exists
    if (user.sessions.length > 0) {
      await prisma.session.update({
        where: { id: user.sessions[0].id },
        data: {
          lastActivity: new Date(),
          ipAddress: req.ip,
          deviceInfo: {
            userAgent: req.headers['user-agent'],
            timestamp: new Date().toISOString()
          }
        }
      });
    }

    // Log auth check (for audit trail)
    console.log(`🔐 Auth check successful for ${user.username} (${user.email})`);

    return res.json({
      success: true,
      message: 'Authentication valid',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        accounts: user.accounts
      },
      session: user.sessions[0] || null,
      permissions: {
        isAdmin: user.role === 'ADMIN',
        isModerator: user.role === 'MODERATOR' || user.role === 'ADMIN',
        canAccessAdmin: user.role === 'ADMIN',
        canModerate: user.role === 'MODERATOR' || user.role === 'ADMIN'
      }
    });

  } catch (error) {
    console.error('Auth status check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication check',
      user: null,
      session: null
    });
  }
});

// POST /api/auth/validate-admin - Admin permission check
router.post('/validate-admin', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.authToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
        isAdmin: false
      });
    }

    // Verify JWT token
    const decoded = await AuthService.verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        isAdmin: false
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User not found or inactive',
        isAdmin: false
      });
    }

    const isAdmin = user.role === 'ADMIN';

    // Log admin access attempt
    console.log(`🔐 Admin validation for ${user.username}: ${isAdmin ? 'GRANTED' : 'DENIED'}`);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin privileges required',
        isAdmin: false
      });
    }

    return res.json({
      success: true,
      message: 'Admin access granted',
      isAdmin: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Admin validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during admin validation',
      isAdmin: false
    });
  }
});

// POST /api/auth/logout - Session invalidation + logging
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.authToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Invalidate session in database
      await prisma.session.updateMany({
        where: { token: token },
        data: { isActive: false }
      });

      // Log logout event
      const decoded = await AuthService.verifyToken(token);
      if (decoded?.userId) {
        console.log(`🚪 User logout: ${decoded.userId}`);
      }
    }

    // Clear authentication cookie
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

export default router;
