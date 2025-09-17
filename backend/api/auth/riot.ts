import { Router, Request, Response } from 'express';
import { riotAuthService } from '../../services/riotAuth';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { 
  requireAuth, 
  AuthenticatedRequest, 
  apiRateLimit 
} from '../../lib/middleware';
import { 
  ApiResponse, 
  ValidationError, 
  NotFoundError,
  ConflictError 
} from '../../lib/errors';

const router = Router();

// Temporary in-memory storage for verification challenges
// In production, this should be stored in Redis or database
const verificationChallenges = new Map<string, any>();

// POST /api/auth/riot/search
// Search for Riot account by Game Name + Tag
router.post('/search', apiRateLimit, async (req: Request, res: Response) => {
  try {
    const { gameName, tagLine, region } = req.body;

    if (!gameName || !tagLine) {
      throw new ValidationError('Game Name and Tag Line are required');
    }

    // Validate format
    if (gameName.length < 3 || gameName.length > 16) {
      throw new ValidationError('Game Name must be between 3-16 characters');
    }

    if (tagLine.length < 3 || tagLine.length > 5) {
      throw new ValidationError('Tag Line must be between 3-5 characters');
    }

    const playerProfile = await riotAuthService.getPlayerProfile(
      gameName, 
      tagLine, 
      region || 'tr1'
    );

    logger.info('Riot account search successful', { 
      gameName, 
      tagLine, 
      puuid: playerProfile.account.puuid 
    });

    res.json({
      success: true,
      data: playerProfile,
      message: 'Riot account found successfully'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Riot account search failed', { 
      gameName: req.body.gameName, 
      tagLine: req.body.tagLine,
      error: error.message 
    });

    if (error.message.includes('Failed to fetch Riot account')) {
      throw new NotFoundError('Riot account not found. Please check your Game Name and Tag Line.');
    }
    
    throw error;
  }
});

// POST /api/auth/riot/verify/start
// Start account verification process
router.post('/verify/start', requireAuth, apiRateLimit, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { puuid, verificationType } = req.body;

    if (!puuid) {
      throw new ValidationError('PUUID is required');
    }

    // Check if account is already verified by another user
    const existingVerification = await prisma.user.findFirst({
      where: { 
        riotId: puuid,
        id: { not: req.user!.id }
      }
    });

    if (existingVerification) {
      throw new ConflictError('This Riot account is already verified by another user');
    }

    // Create verification challenge
    const challenge = riotAuthService.createVerificationChallenge(
      verificationType || 'third_party_code'
    );

    // Store challenge temporarily
    const challengeKey = `${req.user!.id}:${puuid}`;
    verificationChallenges.set(challengeKey, {
      ...challenge,
      userId: req.user!.id,
      puuid,
      createdAt: Date.now()
    });

    logger.info('Verification challenge created', { 
      userId: req.user!.id, 
      puuid, 
      type: challenge.type 
    });

    res.json({
      success: true,
      data: {
        challenge: challenge.challenge,
        type: challenge.type,
        expiresAt: challenge.expiresAt,
        instructions: getVerificationInstructions(challenge)
      },
      message: 'Verification challenge created'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Failed to start verification', { 
      userId: req.user?.id, 
      puuid: req.body.puuid,
      error: error.message 
    });
    throw error;
  }
});

// POST /api/auth/riot/verify/complete
// Complete account verification
router.post('/verify/complete', requireAuth, apiRateLimit, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { puuid, region } = req.body;

    if (!puuid) {
      throw new ValidationError('PUUID is required');
    }

    const challengeKey = `${req.user!.id}:${puuid}`;
    const storedChallenge = verificationChallenges.get(challengeKey);

    if (!storedChallenge) {
      throw new NotFoundError('No verification challenge found. Please start verification first.');
    }

    if (Date.now() > storedChallenge.expiresAt) {
      verificationChallenges.delete(challengeKey);
      throw new ValidationError('Verification challenge has expired. Please start again.');
    }

    // Verify account ownership
    const isVerified = await riotAuthService.verifyAccountOwnership(
      puuid,
      storedChallenge,
      region || 'tr1'
    );

    if (!isVerified) {
      throw new ValidationError('Account verification failed. Please ensure you completed the challenge correctly.');
    }

    // Get account info for storage
    const accountInfo = await riotAuthService.getAccountByRiotId(
      storedChallenge.gameName || 'Unknown',
      storedChallenge.tagLine || 'Unknown'
    );

    // Update user with Riot account info
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: { 
        riotId: puuid,
        // Store additional Riot info in a JSON field if available
        // This would depend on your User model structure
      }
    });

    // Clean up challenge
    verificationChallenges.delete(challengeKey);

    logger.info('Riot account verification completed', { 
      userId: req.user!.id, 
      puuid,
      gameName: accountInfo.gameName,
      tagLine: accountInfo.tagLine
    });

    res.json({
      success: true,
      data: {
        riotAccount: accountInfo,
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          riotId: updatedUser.riotId
        }
      },
      message: 'Riot account verified and linked successfully'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Failed to complete verification', { 
      userId: req.user?.id, 
      puuid: req.body.puuid,
      error: error.message 
    });
    throw error;
  }
});

// DELETE /api/auth/riot/unlink
// Unlink Riot account from user
router.delete('/unlink', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: { riotId: null }
    });

    logger.info('Riot account unlinked', { userId: req.user!.id });

    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          riotId: updatedUser.riotId
        }
      },
      message: 'Riot account unlinked successfully'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Failed to unlink Riot account', { 
      userId: req.user?.id,
      error: error.message 
    });
    throw error;
  }
});

// GET /api/auth/riot/profile
// Get current user's linked Riot profile
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user!.riotId) {
      throw new NotFoundError('No Riot account linked to this user');
    }

    // Get current Riot profile data
    const accountInfo = await riotAuthService.getAccountByRiotId('', ''); // This would need PUUID lookup
    
    // For now, return basic info
    res.json({
      success: true,
      data: {
        riotId: req.user!.riotId,
        linkedAt: req.user!.updatedAt // Approximate linking time
      },
      message: 'Riot profile retrieved'
    } as ApiResponse<any>);

  } catch (error) {
    logger.error('Failed to get Riot profile', { 
      userId: req.user?.id,
      error: error.message 
    });
    throw error;
  }
});

// Helper function to get verification instructions
function getVerificationInstructions(challenge: any): string {
  switch (challenge.type) {
    case 'summoner_name':
      return `Change your summoner name to: ${challenge.challenge}. This verification method requires changing your summoner name temporarily.`;
    
    case 'status_message':
      return `Set your status message to: ${challenge.challenge}. Update your League of Legends client status message.`;
    
    case 'profile_icon':
      return `${challenge.challenge}. Go to your League of Legends client and change your profile icon to the specified ID.`;
    
    case 'third_party_code':
      return `Open the League of Legends client and set your Third-Party Verification Code to EXACTLY: ${challenge.challenge}. After setting it, return here and complete verification.`;
    
    default:
      return 'Complete the verification challenge as instructed.';
  }
}

export default router;

