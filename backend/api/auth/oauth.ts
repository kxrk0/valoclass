import { Router, Request, Response } from 'express';
import { env } from '../../config/env';

const router = Router();

// GET /api/auth/oauth/riot
// Riot OAuth - Real authentication with Riot Games
router.get('/riot', (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${requestId}] Starting Riot OAuth flow`, {
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  try {
    // Real Riot OAuth configuration
    const clientId = process.env.RIOT_CLIENT_ID || 'valoclass-demo-client-id';
    const redirectUri = `${env.API_BASE_URL}/api/auth/oauth/riot/callback`;
    const scope = 'openid offline_access';
    const state = requestId; // Use request ID as state for verification

    // Build official Riot OAuth URL
    const authUrl = new URL('https://auth.riotgames.com/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', state);

    console.log(`[${requestId}] Redirecting to Riot OAuth:`, authUrl.toString());

    // Add cache control headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return res.redirect(302, authUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Riot OAuth:`, error.message);
    
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'OAuth configuration error');
    
    return res.redirect(302, errorUrl.toString());
  }
});

// GET /api/auth/oauth/riot/callback
// Riot OAuth callback - Handle authorization code from Riot
router.get('/riot/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const requestId = (state as string) || 'unknown';

  console.log(`[${requestId}] Riot OAuth callback`, {
    hasCode: !!code,
    hasError: !!error,
    error: error || null,
    timestamp: new Date().toISOString()
  });

  const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';

  if (error) {
    console.error(`[${requestId}] Riot OAuth error:`, error);
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', `Riot authentication failed: ${error}`);
    return res.redirect(302, errorUrl.toString());
  }

  if (!code) {
    console.error(`[${requestId}] No authorization code received`);
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'No authorization code received from Riot');
    return res.redirect(302, errorUrl.toString());
  }

  try {
    console.log(`[${requestId}] Exchanging authorization code for tokens...`);

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://auth.riotgames.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.RIOT_CLIENT_ID || 'valoclass-demo-client-id',
        client_secret: process.env.RIOT_CLIENT_SECRET || 'demo-secret',
        code: code as string,
        redirect_uri: `${env.API_BASE_URL}/api/auth/oauth/riot/callback`
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`[${requestId}] Token exchange failed:`, {
        status: tokenResponse.status,
        error: errorText
      });
      
      const errorUrl = new URL('/auth/login', frontendUrl);
      errorUrl.searchParams.set('error', 'Failed to exchange authorization code');
      return res.redirect(302, errorUrl.toString());
    }

    const tokens = await tokenResponse.json();
    console.log(`[${requestId}] Token exchange successful`, {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in
    });

    // Get user info from Riot
    const userInfoResponse = await fetch('https://auth.riotgames.com/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!userInfoResponse.ok) {
      console.error(`[${requestId}] Failed to get user info:`, userInfoResponse.status);
      const errorUrl = new URL('/auth/login', frontendUrl);
      errorUrl.searchParams.set('error', 'Failed to get user information');
      return res.redirect(302, errorUrl.toString());
    }

    const userInfo = await userInfoResponse.json();
    console.log(`[${requestId}] User info retrieved:`, {
      sub: userInfo.sub,
      username: userInfo.username,
      hasProfile: !!userInfo
    });

    // TODO: Save user to database, create session, etc.
    // For now, redirect to success page with user info

    const successUrl = new URL('/', frontendUrl);
    successUrl.searchParams.set('riot_login', 'success');
    successUrl.searchParams.set('username', userInfo.username || 'Unknown');
    
    console.log(`[${requestId}] Redirecting to success page:`, successUrl.toString());
    return res.redirect(302, successUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Riot OAuth callback:`, error.message);
    
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'Authentication process failed');
    return res.redirect(302, errorUrl.toString());
  }
});

// GET /api/auth/oauth/google
// Google OAuth initiation
router.get('/google', (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || 'demo-google-client-id';
  const redirectUri = `${env.API_BASE_URL}/api/auth/oauth/google/callback`;
  const scope = 'openid email profile';
  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('state', state);

  // Store state in session/memory for verification
  return res.redirect(302, authUrl.toString());
});

// GET /api/auth/oauth/google/callback
// Google OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/auth/login', frontendUrl);
    redirectUrl.searchParams.set('error', error as string);
    return res.redirect(302, redirectUrl.toString());
  }

  if (!code) {
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/auth/login', frontendUrl);
    redirectUrl.searchParams.set('error', 'No authorization code received');
    return res.redirect(302, redirectUrl.toString());
  }

  try {
    // Exchange code for access token
    // TODO: Implement Google OAuth token exchange
    console.log('Google OAuth code received:', code);

    // For now, redirect to success page
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/', frontendUrl);
    redirectUrl.searchParams.set('success', 'Google login successful');
    return res.redirect(302, redirectUrl.toString());

  } catch (error) {
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/auth/login', frontendUrl);
    redirectUrl.searchParams.set('error', 'Google authentication failed');
    return res.redirect(302, redirectUrl.toString());
  }
});

// GET /api/auth/oauth/discord
// Discord OAuth initiation
router.get('/discord', (req: Request, res: Response) => {
  const clientId = process.env.DISCORD_CLIENT_ID || 'demo-discord-client-id';
  const redirectUri = `${env.API_BASE_URL}/api/auth/oauth/discord/callback`;
  const scope = 'identify email';
  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL('https://discord.com/api/oauth2/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('state', state);

  return res.redirect(302, authUrl.toString());
});

// GET /api/auth/oauth/discord/callback
// Discord OAuth callback
router.get('/discord/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/auth/login', frontendUrl);
    redirectUrl.searchParams.set('error', error as string);
    return res.redirect(302, redirectUrl.toString());
  }

  if (!code) {
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/auth/login', frontendUrl);
    redirectUrl.searchParams.set('error', 'No authorization code received');
    return res.redirect(302, redirectUrl.toString());
  }

  try {
    // Exchange code for access token
    // TODO: Implement Discord OAuth token exchange
    console.log('Discord OAuth code received:', code);

    // For now, redirect to success page
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/', frontendUrl);
    redirectUrl.searchParams.set('success', 'Discord login successful');
    return res.redirect(302, redirectUrl.toString());

  } catch (error) {
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = new URL('/auth/login', frontendUrl);
    redirectUrl.searchParams.set('error', 'Discord authentication failed');
    return res.redirect(302, redirectUrl.toString());
  }
});

export default router;


