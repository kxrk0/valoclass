import { Socket } from 'socket.io';
import { AuthService } from './auth';
import { prisma } from './prisma';

export interface AuthenticatedSocket extends Socket {
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string; // ✅ Avatar field eklendi
  };
}

export const adminAuthMiddleware = async (socket: Socket, next: Function) => {
  try {
    console.log('🔍 AdminAuthMiddleware: Starting unified auth...');
    
    let token = null;
    const authToken = socket.handshake.auth.token;
    
    // Check if frontend sent dummy token (cookie-based auth)
    if (authToken === 'authenticated-via-cookies') {
      console.log('🍪 Cookie-based auth detected, reading from cookies...');
      
      // Try to get token from parsed cookies (thanks to engine.use(cookieParser()))
      const req = socket.request as any;
      console.log('🔍 Request cookies available:', !!req.cookies);
      
      if (req.cookies) {
        token = req.cookies.authToken || req.cookies.access_token;
        if (token) {
          console.log('🍪 Token found in httpOnly cookies');
        }
      }
      
      // Fallback: manual cookie parsing
      if (!token) {
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
          const parsedCookies = cookies.split(';').reduce((acc: any, cookie: string) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});
          
          token = parsedCookies.authToken || parsedCookies.access_token;
          if (token) {
            console.log('🍪 Token found via manual cookie parsing');
          }
        }
      }
    } else {
      // Direct token auth
      token = authToken || socket.handshake.headers.authorization?.replace('Bearer ', '');
    }
    
    if (!token) {
      console.log('❌ No valid token found for WebSocket auth');
      return next(new Error('No authentication token provided'));
    }
    
    console.log('✅ Token found for verification, length:', token.length);

    // Verify JWT token using same method as HTTP auth
    const decoded = await AuthService.verifyToken(token);
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
        isActive: true,
        avatar: true // ✅ Avatar field dahil et
      }
    });

    if (!user) {
      return next(new Error('User not found'));
    }

    if (!user.isActive) {
      return next(new Error('User account is inactive'));
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
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
