import { Router, Request, Response } from 'express';
import { env } from '../../config/env';

const router = Router();

// GET /api/auth/oauth/riot
// Riot does not provide public OAuth for third parties. Redirect to frontend flow.
router.get('/riot', (req: Request, res: Response) => {
  const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUrl = new URL('/auth/login', frontendUrl);
  redirectUrl.searchParams.set('provider', 'riot');
  redirectUrl.searchParams.set('message', 'Riot login uses account verification (no public OAuth).');

  // Use 302 to switch client to the frontend-guided flow
  return res.redirect(302, redirectUrl.toString());
});

export default router;


