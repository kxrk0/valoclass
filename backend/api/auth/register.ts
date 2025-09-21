import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { AuthService } from '../../lib/auth';
import { getClientIP, apiRateLimit } from '../../lib/middleware';
import { ApiResponse, RegisterCredentials } from '../../types';

const router = Router();

// POST /api/auth/register
router.post('/register', apiRateLimit, async (req: Request, res: Response) => {
  try {
    const clientIP = getClientIP(req);
    const { username, email, password, confirmPassword }: RegisterCredentials = req.body;

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      } as ApiResponse<never>);
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      } as ApiResponse<never>);
    }

    // Validate email format
    if (!AuthService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      } as ApiResponse<never>);
    }

    // Validate password strength
    const passwordValidation = AuthService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      } as ApiResponse<never>);
    }

    // Validate username
    const usernameValidation = AuthService.validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Username does not meet requirements',
        details: usernameValidation.errors
      } as ApiResponse<never>);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        error: `User with this ${conflictField} already exists`
      } as ApiResponse<never>);
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role: 'USER'
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = await AuthService.createSession(user as any);

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    };

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    logger.info(`New user registered: ${user.id} (${username}) from IP: ${clientIP}`);

    return res.status(201).json({
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
        accessToken
      },
      message: 'Registration successful'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>);
  }
});

export default router;
