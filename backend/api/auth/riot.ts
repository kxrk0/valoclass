import { Router, Request, Response, NextFunction } from 'express';
import { riotAuthService, RiotAccount, RiotProfile } from '../../services/RiotAuthService';
import { logger } from '../../lib/logger';
import { apiRateLimit, strictRateLimit } from '../../lib/middleware';
import { z } from 'zod';

const router = Router();

// ===== VALIDATION SCHEMAS =====
const SearchAccountSchema = z.object({
  gameName: z.string()
    .min(3, 'Game Name must be at least 3 characters')
    .max(16, 'Game Name must be no more than 16 characters')
    .trim(),
  tagLine: z.string()
    .min(2, 'Tag Line must be at least 2 characters') 
    .max(5, 'Tag Line must be no more than 5 characters')
    .trim()
    .toUpperCase(),
  region: z.string().optional().default('tr1')
});

const LoginSchema = z.object({
  gameName: z.string()
    .min(3, 'Game Name must be at least 3 characters')
    .max(16, 'Game Name must be no more than 16 characters')
    .trim(),
  tagLine: z.string()
    .min(2, 'Tag Line must be at least 2 characters')
    .max(5, 'Tag Line must be no more than 5 characters')
    .trim()
    .toUpperCase(),
  region: z.string().optional().default('tr1')
});

// ===== MIDDLEWARE =====
const validateJson = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          message: 'Please check your input and try again'
        });
        return;
      }
      
      req.body = result.data;
      next();
    } catch (error) {
      logger.error('Validation middleware error', { error: (error as Error).message });
      res.status(400).json({
        success: false,
        error: 'Invalid request format',
        message: 'Request body must be valid JSON'
      });
    }
  };
};

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Riot API route error', {
    url: req.url,
    method: req.method,
    body: req.body,
    error: error.message,
    stack: error.stack
  });

  // Check if response already sent
  if (res.headersSent) {
    return next(error);
  }

  // Handle specific error types
  if (error.message.includes('Rate limit')) {
    res.status(429).json({
      success: false,
      error: error.message,
      message: 'Too many requests. Please wait a moment before trying again.',
      retryAfter: 60
    });
    return;
  }

  if (error.message.includes('not found')) {
    res.status(404).json({
      success: false,
      error: error.message,
      message: 'Player not found. Please check your Game Name and Tag Line.'
    });
    return;
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong. Please try again later.'
  });
};

// ===== API ENDPOINTS =====

/**
 * POST /api/auth/riot/search
 * Search for a Riot account without authentication
 */
router.post('/search', 
  apiRateLimit,
  validateJson(SearchAccountSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gameName, tagLine, region } = req.body;
      
      logger.info('Riot account search request', { 
        gameName, 
        tagLine, 
        region,
        ip: req.ip 
      });

      const result = await riotAuthService.validateAccount(gameName, tagLine);

      if (result.success && result.account) {
        res.json({
          success: true,
          data: {
            account: {
              puuid: result.account.puuid,
              gameName: result.account.gameName,
              tagLine: result.account.tagLine
            },
            region,
            searchedAt: new Date().toISOString()
          },
          message: `Account found: ${result.account.gameName}#${result.account.tagLine} ✅`
        });
      } else {
        res.status(404).json({
          success: false,
          error: result.error || 'Account not found',
          message: 'Unable to find a Riot account with that Game Name and Tag Line.'
        });
      }

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/riot/authenticate  
 * Authenticate and login with Riot account
 */
router.post('/authenticate',
  strictRateLimit,
  validateJson(LoginSchema), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gameName, tagLine, region } = req.body;

      logger.info('Riot authentication request', { 
        gameName, 
        tagLine, 
        region,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      const authResult = await riotAuthService.authenticatePlayer(gameName, tagLine, region);

      if (authResult.success && authResult.profile && authResult.token) {
        // Set secure session cookies
        res.cookie('riot_session', authResult.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          path: '/'
        });

        // Set user info cookie for client-side access
        const userInfo = {
          gameName: authResult.profile.account.gameName,
          tagLine: authResult.profile.account.tagLine,
          region: authResult.profile.region
        };

        res.cookie('riot_user', JSON.stringify(userInfo), {
          httpOnly: false, // Accessible to client
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
          path: '/'
        });

        logger.info('Riot authentication successful', {
          puuid: authResult.profile.account.puuid,
          gameName: authResult.profile.account.gameName,
          tagLine: authResult.profile.account.tagLine,
          region: authResult.profile.region,
          ip: req.ip
        });

        res.json({
          success: true,
          data: {
            user: {
              gameName: authResult.profile.account.gameName,
              tagLine: authResult.profile.account.tagLine,
              displayName: `${authResult.profile.account.gameName}#${authResult.profile.account.tagLine}`,
              region: authResult.profile.region,
              accountLevel: authResult.profile.accountLevel || 1,
              authenticatedAt: new Date().toISOString()
            },
            // Don't send token in response body for security
            sessionActive: true
          },
          message: authResult.message
        });

      } else {
        logger.warn('Riot authentication failed', {
          gameName,
          tagLine,
          region,
          error: authResult.error,
          ip: req.ip
        });

        res.status(401).json({
          success: false,
          error: authResult.error || 'Authentication failed',
          message: authResult.message || 'Unable to authenticate with Riot account'
        });
      }

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/auth/riot/profile
 * Get current user's Riot profile (requires authentication)
 */
router.get('/profile', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionToken = req.cookies?.riot_session;
    const userCookie = req.cookies?.riot_user;

    if (!sessionToken || !userCookie) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
        message: 'Please login with your Riot account first'
      });
      return;
    }

    try {
      const userInfo = JSON.parse(userCookie);
      
      res.json({
        success: true,
        data: {
          profile: {
            gameName: userInfo.gameName,
            tagLine: userInfo.tagLine,
            displayName: `${userInfo.gameName}#${userInfo.tagLine}`,
            region: userInfo.region,
            isAuthenticated: true,
            sessionActive: true
          }
        },
        message: 'Profile retrieved successfully'
      });

    } catch (parseError) {
      res.status(401).json({
        success: false,
        error: 'Invalid session',
        message: 'Session data is corrupted. Please login again.'
      });
    }

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/riot/logout
 * Logout and clear Riot session
 */
router.post('/logout', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Clear all Riot-related cookies
    res.clearCookie('riot_session', { path: '/' });
    res.clearCookie('riot_user', { path: '/' });

    logger.info('Riot user logged out', { ip: req.ip });

    res.json({
      success: true,
      message: 'Successfully logged out from Riot account'
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/riot/status
 * Check authentication status
 */
router.get('/status', async (req: Request, res: Response): Promise<void> => {
  const sessionToken = req.cookies?.riot_session;
  const userCookie = req.cookies?.riot_user;

  res.json({
    success: true,
    data: {
      isAuthenticated: !!(sessionToken && userCookie),
      hasActiveSession: !!sessionToken,
      serverTime: new Date().toISOString()
    },
    message: 'Status retrieved'
  });
});

// ===== ERROR HANDLING =====
router.use(errorHandler);

export default router;
