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
// Google OAuth initiation - Real authentication
router.get('/google', (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${requestId}] Starting Google OAuth flow`, {
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    console.log(`[${requestId}] Environment check:`, {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      clientIdLength: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0
    });
    
    if (!clientId) {
      throw new Error('Google Client ID not configured in environment variables');
    }

    const redirectUri = `${env.API_BASE_URL}/api/auth/oauth/google/callback`;
    const scope = 'openid email profile';
    const state = requestId; // Use request ID as state for verification

    // Build Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'select_account');

    console.log(`[${requestId}] Redirecting to Google OAuth:`, authUrl.toString());

    // Add cache control headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return res.redirect(302, authUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Google OAuth:`, error.message);
    
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'Google OAuth configuration error');
    
    return res.redirect(302, errorUrl.toString());
  }
});

// GET /api/auth/oauth/google/callback
// Google OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const requestId = (state as string) || 'unknown';

  console.log(`[${requestId}] Google OAuth callback`, {
    hasCode: !!code,
    hasError: !!error,
    error: error || null,
    timestamp: new Date().toISOString()
  });

  const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';

  if (error) {
    console.error(`[${requestId}] Google OAuth error:`, error);
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', `Google authentication failed: ${error}`);
    return res.redirect(302, errorUrl.toString());
  }

  if (!code) {
    console.error(`[${requestId}] No authorization code received`);
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'No authorization code received from Google');
    return res.redirect(302, errorUrl.toString());
  }

  try {
    console.log(`[${requestId}] Exchanging authorization code for tokens...`);

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code as string,
        redirect_uri: `${env.API_BASE_URL}/api/auth/oauth/google/callback`
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

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
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
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      hasProfile: !!userInfo
    });

    // TODO: Save user to database, create session, etc.
    // For now, redirect to success page with user info

    const successUrl = new URL('/', frontendUrl);
    successUrl.searchParams.set('google_login', 'success');
    successUrl.searchParams.set('user_name', userInfo.name || 'Unknown');
    successUrl.searchParams.set('user_email', userInfo.email || '');
    
    console.log(`[${requestId}] Redirecting to success page:`, successUrl.toString());
    return res.redirect(302, successUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Google OAuth callback:`, error.message);
    
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'Google authentication process failed');
    return res.redirect(302, errorUrl.toString());
  }
});

// GET /api/auth/oauth/discord
// Discord OAuth initiation - Real authentication
router.get('/discord', (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${requestId}] Starting Discord OAuth flow`, {
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    console.log(`[${requestId}] Environment check:`, {
      hasDiscordClientId: !!process.env.DISCORD_CLIENT_ID,
      clientIdLength: process.env.DISCORD_CLIENT_ID ? process.env.DISCORD_CLIENT_ID.length : 0
    });
    
    if (!clientId) {
      throw new Error('Discord Client ID not configured in environment variables');
    }

    const redirectUri = `${env.API_BASE_URL}/api/auth/oauth/discord/callback`;
    const scope = 'identify email';
    const state = requestId; // Use request ID as state for verification

    // Build Discord OAuth URL
    const authUrl = new URL('https://discord.com/api/oauth2/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', state);

    console.log(`[${requestId}] Redirecting to Discord OAuth:`, authUrl.toString());

    // Add cache control headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return res.redirect(302, authUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Discord OAuth:`, error.message);
    
    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'Discord OAuth configuration error');
    
    return res.redirect(302, errorUrl.toString());
  }
});

// GET /api/auth/oauth/discord/callback
// Discord OAuth callback
router.get('/discord/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const requestId = (state as string) || 'unknown';

  console.log(`[${requestId}] Discord OAuth callback`, {
    hasCode: !!code,
    hasError: !!error,
    error: error || null,
    timestamp: new Date().toISOString()
  });

  const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';

  if (error) {
    console.error(`[${requestId}] Discord OAuth error:`, error);
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', `Discord authentication failed: ${error}`);
    return res.redirect(302, errorUrl.toString());
  }

  if (!code) {
    console.error(`[${requestId}] No authorization code received`);
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'No authorization code received from Discord');
    return res.redirect(302, errorUrl.toString());
  }

  try {
    console.log(`[${requestId}] Exchanging authorization code for tokens...`);

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Discord OAuth credentials not configured');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code as string,
        redirect_uri: `${env.API_BASE_URL}/api/auth/oauth/discord/callback`
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

    // Get user info from Discord
    const userInfoResponse = await fetch('https://discord.com/api/v10/users/@me', {
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
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      discriminator: userInfo.discriminator,
      hasProfile: !!userInfo
    });

    // TODO: Save user to database, create session, etc.
    // For now, redirect to success page with user info

    const successUrl = new URL('/', frontendUrl);
    successUrl.searchParams.set('discord_login', 'success');
    successUrl.searchParams.set('user_name', userInfo.username || 'Unknown');
    successUrl.searchParams.set('user_email', userInfo.email || '');
    successUrl.searchParams.set('user_id', userInfo.id || '');

    console.log(`[${requestId}] Redirecting to success page:`, successUrl.toString());
    return res.redirect(302, successUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Discord OAuth callback:`, error.message);
    
    const errorUrl = new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'Discord authentication process failed');
    return res.redirect(302, errorUrl.toString());
  }
});

export default router;


