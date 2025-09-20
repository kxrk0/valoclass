import { Socket } from 'socket.io';
import { verifyToken } from './auth';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';

export interface AuthenticatedSocket extends Socket {
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export const adminAuthMiddleware = async (socket: Socket, next: Function) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('No authentication token provided'));
    }

    // Development mode bypass for testing
    if (process.env.NODE_ENV === 'development' && token === 'dev-admin-token-mock-jwt-for-testing-only') {
      const mockUser = {
        id: 'dev-admin-id-mock',
        username: 'DevAdmin', 
        email: 'dev@admin.test',
        role: 'ADMIN',
        isActive: true
      };
      
      (socket as any).userId = mockUser.id;
      (socket as any).user = mockUser;
      return next();
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return next(new Error('Invalid token'));
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

    if (!user) {
      return next(new Error('User not found'));
    }

    if (!user.isActive) {
      return next(new Error('User account is inactive'));
    }

    // Check if user is admin
    if (user.role !== UserRole.ADMIN) {
      return next(new Error('Admin access required'));
    }

    // Attach user info to socket
    (socket as AuthenticatedSocket).userId = user.id;
    (socket as AuthenticatedSocket).user = user;

    console.log(`🔐 Admin user ${user.username} connected to WebSocket`);
    next();
  } catch (error) {
    console.error('Socket admin auth error:', error);
    next(new Error('Authentication failed'));
  }
};

export const emitToAdmins = (io: any, event: string, data: any) => {
  // Emit to all connected admin clients
  io.to('admins').emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const logAdminActivity = async (userId: string, action: string, details?: any) => {
  try {
    // TODO: Implement activity logging when Activity model is ready
    console.log(`[ADMIN ACTIVITY] User: ${userId}, Action: ${action}`, details ? `Details: ${JSON.stringify(details)}` : '');
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
};
