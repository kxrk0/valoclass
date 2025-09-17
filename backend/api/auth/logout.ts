import { Router, Request, Response } from 'express';
import { AuthService } from '../../lib/auth';
import { logger } from '../../lib/logger';
import { getClientIP, requireAuth, AuthenticatedRequest } from '../../lib/middleware';
import { ApiResponse } from '../../types';

const router = Router();

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientIP = getClientIP(req);

    // Logout using AuthService
    await AuthService.logout(req, res);

    logger.info(`User logged out: ${req.user?.id} from IP: ${clientIP}`);

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    } as ApiResponse<never>);

  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>);
  }
});

export default router;
