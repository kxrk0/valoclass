import { Router, Request, Response } from 'express';
import { AuthService } from '../../lib/auth';
import { logger } from '../../lib/logger';
import { getClientIP, apiRateLimit } from '../../lib/middleware';
import { ApiResponse } from '../../types';

const router = Router();

// POST /api/auth/refresh
router.post('/refresh', apiRateLimit, async (req: Request, res: Response) => {
  try {
    const clientIP = getClientIP(req);
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token not found'
      } as ApiResponse<never>);
    }

    // Refresh the session
    const result = await AuthService.refreshSession(refreshToken);

    if (!result) {
      // Clear invalid cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      } as ApiResponse<never>);
    }

    // Set new access token cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    logger.info(`Token refreshed for session from IP: ${clientIP}`);

    return res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken
      },
      message: 'Token refreshed successfully'
    } as ApiResponse<{ accessToken: string }>);

  } catch (error) {
    logger.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>);
  }
});

export default router;
