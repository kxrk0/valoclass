import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { AuthService } from '../../lib/auth';
import { getClientIP, loginRateLimit } from '../../lib/middleware';
import { ApiResponse, LoginCredentials } from '../../types';

const router = Router();

// POST /api/auth/login
router.post('/login', loginRateLimit, async (req: Request, res: Response) => {
  try {
    const clientIP = getClientIP(req);
    const { email, password, rememberMe }: LoginCredentials & { rememberMe?: boolean } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse<never>);
    }

    if (!AuthService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      } as ApiResponse<never>);
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      logger.warn(`Failed login attempt for email: ${email} from IP: ${clientIP}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<never>);
    }

    // Verify password
    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<never>);
    }
    
    const isPasswordValid = await AuthService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for user: ${user.id} from IP: ${clientIP}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<never>);
    }

    // Check if user is active
    if (user.role === 'USER' && !user.createdAt) {
      return res.status(403).json({
        success: false,
        error: 'Account has been deactivated'
      } as ApiResponse<never>);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await AuthService.createSession(user as any);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    logger.info(`Successful login for user: ${user.id} from IP: ${clientIP}`);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          riotId: user.riotId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken // Send token in response as well for frontend storage
      },
      message: 'Login successful'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>);
  }
});

export default router;
