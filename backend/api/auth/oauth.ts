import { Router, Request, Response } from 'express';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { AuthService } from '../../lib/auth';

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
  const isAdminFlow = req.query.redirect === 'admin';
  
  console.log(`[${requestId}] Starting Google OAuth flow`, {
    ip: req.ip,
    timestamp: new Date().toISOString(),
    isAdminFlow
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
    const state = isAdminFlow ? `${requestId}:admin` : requestId; // Include admin flag in state

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
    const errorUrl = isAdminFlow 
      ? new URL('/admin/login', frontendUrl)
      : new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', 'Google OAuth configuration error');
    
    return res.redirect(302, errorUrl.toString());
  }
});

// GET /api/auth/oauth/google/callback
// Google OAuth callback
router.get('/google/callback', async (req: Request, res: Response) => {
  const { code, state, error } = req.query;
  const stateParam = (state as string) || 'unknown';
  const [requestId, adminFlag] = stateParam.split(':');
  const isAdminFlow = adminFlag === 'admin';

  console.log(`[${requestId}] Google OAuth callback`, {
    hasCode: !!code,
    hasError: !!error,
    error: error || null,
    timestamp: new Date().toISOString(),
    isAdminFlow
  });

  const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';

  if (error) {
    console.error(`[${requestId}] Google OAuth error:`, error);
    const errorUrl = isAdminFlow 
      ? new URL('/admin/login', frontendUrl)
      : new URL('/auth/login', frontendUrl);
    errorUrl.searchParams.set('error', `Google authentication failed: ${error}`);
    return res.redirect(302, errorUrl.toString());
  }

  if (!code) {
    console.error(`[${requestId}] No authorization code received`);
    const errorUrl = isAdminFlow 
      ? new URL('/admin/login', frontendUrl)
      : new URL('/auth/login', frontendUrl);
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
      
      const errorUrl = isAdminFlow 
        ? new URL('/admin/login', frontendUrl)
        : new URL('/auth/login', frontendUrl);
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
      const errorUrl = isAdminFlow 
        ? new URL('/admin/login', frontendUrl)
        : new URL('/auth/login', frontendUrl);
      errorUrl.searchParams.set('error', 'Failed to get user information');
      return res.redirect(302, errorUrl.toString());
    }

    const userInfo = await userInfoResponse.json();
    
    // Check if user is in admin whitelist
    const adminUIDs = process.env.ADMIN_GOOGLE_UIDS ? process.env.ADMIN_GOOGLE_UIDS.split(',').map(uid => uid.trim()) : [];
    const userGoogleId = userInfo.id?.toString().trim();
    const isAuthorizedAdmin = adminUIDs.includes(userGoogleId);
    
    console.log(`[${requestId}] User info retrieved:`, {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      hasProfile: !!userInfo,
      isAuthorizedAdmin,
      adminUIDs: adminUIDs,
      adminUIDsCount: adminUIDs.length,
      rawUserInfo: userInfo
    });
    
    console.log(`[${requestId}] UID DEBUG:`, {
      'Google OAuth ID': userGoogleId,
      'Google ID Type': typeof userInfo.id,
      'Google ID Length': userGoogleId?.length,
      'Admin UIDs Array': adminUIDs,
      'Admin UIDs Types': adminUIDs.map(uid => typeof uid),
      'Admin UIDs Lengths': adminUIDs.map(uid => uid.length),
      'Is ID in array?': adminUIDs.includes(userGoogleId),
      'Manual check matches': adminUIDs.map(uid => uid === userGoogleId),
      'Match found?': isAuthorizedAdmin,
      'Admin flow?': isAdminFlow,
      'Should be admin?': isAdminFlow || isAuthorizedAdmin
    });

    // Enhanced user creation and session management
    let dbUser;
    let jwtToken = null;
    let sessionRecord = null;
    
    try {
      // Create or update user in Prisma database
      try {
        dbUser = await prisma.user.upsert({
          where: { email: userInfo.email },
          include: { accounts: true },
          update: {
            username: userInfo.name || userInfo.email.split('@')[0],
            avatar: userInfo.picture,
            role: (isAdminFlow || isAuthorizedAdmin) ? 'ADMIN' : undefined, // Update role only if admin
            isVerified: true, // Google OAuth users are automatically verified
            lastLoginAt: new Date(),
            updatedAt: new Date()
          },
          create: {
            email: userInfo.email,
            username: userInfo.name || userInfo.email.split('@')[0],
            avatar: userInfo.picture,
            role: (isAdminFlow || isAuthorizedAdmin) ? 'ADMIN' : 'USER',
            isVerified: true,
            isActive: true,
            isPremium: false,
            lastLoginAt: new Date(),
            preferences: {
              theme: 'dark',
              language: 'en',
              timezone: 'America/New_York',
              notifications: {
                email: true,
                inApp: true,
                newLineups: true,
                crosshairUpdates: true,
                weeklyDigest: true,
                marketing: false
              },
              privacy: {
                profileVisibility: 'public',
                showStats: true,
                showActivity: true,
                allowMessages: 'everyone',
                searchable: true
              }
            },
            stats: {
              lineupsCreated: 0,
              crosshairsCreated: 0,
              totalLikes: 0,
              totalViews: 0,
              reputation: 0,
              followers: 0,
              following: 0
            }
          }
        });

        // Create or update Google OAuth account record
        if (dbUser) {
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: 'google',
              providerId: userInfo.id,
              userId: dbUser.id
            }
          });

          if (existingAccount) {
            await prisma.account.update({
              where: { id: existingAccount.id },
              data: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
                tokenType: tokens.token_type || 'Bearer',
                scope: tokens.scope,
                idToken: tokens.id_token
              }
            });
          } else {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: 'oauth',
                provider: 'google',
                providerId: userInfo.id,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
                tokenType: tokens.token_type || 'Bearer',
                scope: tokens.scope,
                idToken: tokens.id_token
              }
            });
          }
        }

        console.log(`✅ User ${isAdminFlow ? 'admin' : 'user'} saved to database:`, dbUser.id);

      } catch (dbError) {
        console.error('Database user creation error:', dbError);
      }

      // Generate JWT token and create enhanced session
      console.log(`[${requestId}] 🔍 Checking dbUser for token generation:`, {
        hasDbUser: !!dbUser,
        dbUserId: dbUser?.id || 'none',
        dbUserEmail: dbUser?.email || 'none'
      });
      
      if (dbUser) {
        console.log(`[${requestId}] 🔑 Generating JWT token for user:`, dbUser.id);
        jwtToken = await AuthService.generateAccessToken(dbUser as any);
        console.log(`[${requestId}] 🔑 JWT token generated:`, !!jwtToken);
        
        // Create enhanced session record
        const deviceInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          browser: req.headers['user-agent']?.includes('Chrome') ? 'Chrome' : 'Unknown',
          platform: req.headers['user-agent']?.includes('Windows') ? 'Windows' : 'Unknown',
          timestamp: new Date().toISOString()
        };

        console.log(`[${requestId}] 🔑 Generating refresh token...`);
        const refreshToken = await AuthService.generateRefreshToken(dbUser.id);
        console.log(`[${requestId}] 🔑 Refresh token generated:`, !!refreshToken);
        
        console.log(`[${requestId}] 🗑️ Cleaning up existing sessions for user...`);
        await prisma.session.deleteMany({
          where: { 
            userId: dbUser.id,
            isActive: true
          }
        });
        
        console.log(`[${requestId}] 📝 Creating session record...`);
        sessionRecord = await prisma.session.create({
          data: {
            userId: dbUser.id,
            token: jwtToken,
            refreshToken: refreshToken,
            ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
            userAgent: req.headers['user-agent'] || 'Unknown',
            deviceInfo: deviceInfo,
            loginMethod: 'oauth_google',
            isAdminSession: isAdminFlow || isAuthorizedAdmin,
            adminRights: (isAdminFlow || isAuthorizedAdmin) ? {
              fullAccess: true,
              grantedAt: new Date().toISOString(),
              grantedBy: 'oauth_system'
            } : null,
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isActive: true,
            isVerified: true
          }
        });
        console.log(`[${requestId}] ✅ Session record created:`, sessionRecord.id);

        // Log authentication event
        await prisma.authEvent.create({
          data: {
            userId: dbUser.id,
            eventType: isAdminFlow ? 'ADMIN_LOGIN' : 'LOGIN',
            success: true,
            ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
            userAgent: req.headers['user-agent'] || 'Unknown',
            details: {
              provider: 'google',
              isAdminFlow,
              isAuthorizedAdmin,
              userInfo: {
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture
              }
            },
            riskLevel: 'LOW'
          }
        });

        console.log('🔑 Enhanced session created for user:', dbUser.id);
        console.log('📊 Auth event logged:', isAdminFlow ? 'ADMIN_LOGIN' : 'LOGIN');
      } else {
        console.log(`[${requestId}] ❌ Cannot generate tokens - dbUser is null/undefined`);
      }

      console.log(`[${requestId}] 🎉 ${isAdminFlow ? 'Admin' : 'User'} authentication complete:`, {
        database: !!dbUser,
        email: userInfo.email,
        name: userInfo.name,
        hasToken: !!jwtToken,
        hasSessionRecord: !!sessionRecord,
        tokenLength: jwtToken ? jwtToken.length : 0,
        dbUserId: dbUser?.id || 'none'
      });

    } catch (error) {
      console.error('User creation/update error:', error);
    }

    // Set httpOnly cookies for secure session management
    if (jwtToken && sessionRecord) {
      console.log(`[${requestId}] 🍪 Setting cookies - NODE_ENV:`, process.env.NODE_ENV);
      
      // Cookie options - simplified for localhost development
      const cookieOptions = {
        httpOnly: true,
        secure: false, // Always false for localhost development
        sameSite: 'lax' as const,
        path: '/'
      };
      
      console.log(`[${requestId}] 🍪 Cookie options:`, cookieOptions);
      
      // Set authentication cookie (7 days)
      res.cookie('authToken', jwtToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Also set access_token for middleware compatibility
      res.cookie('access_token', jwtToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Set refresh token cookie (30 days)
      if (sessionRecord.refreshToken) {
        res.cookie('refreshToken', sessionRecord.refreshToken, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // Also set refresh_token for middleware compatibility
        res.cookie('refresh_token', sessionRecord.refreshToken, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
      }

      console.log(`[${requestId}] 🍪 Cookie debug:`, {
        authTokenSet: true,
        accessTokenSet: true,
        refreshTokenSet: !!sessionRecord.refreshToken,
        tokenPreview: jwtToken.substring(0, 20) + '...',
        refreshPreview: sessionRecord.refreshToken ? sessionRecord.refreshToken.substring(0, 20) + '...' : 'none',
        environment: process.env.NODE_ENV
      });
      
      console.log(`[${requestId}] 🍪 HttpOnly cookies set successfully`);
    } else {
      console.log(`[${requestId}] ❌ Cannot set cookies:`, {
        hasJwtToken: !!jwtToken,
        hasSessionRecord: !!sessionRecord,
        dbUser: !!dbUser,
        jwtTokenError: jwtToken ? 'OK' : 'MISSING',
        sessionRecordError: sessionRecord ? 'OK' : 'MISSING'
      });
    }

    // Backend-centric redirect (no tokens in URL)
    const shouldRedirectToAdmin = isAdminFlow || isAuthorizedAdmin;
    const successUrl = shouldRedirectToAdmin 
      ? new URL('/admin/dashboard', frontendUrl)
      : new URL('/', frontendUrl);
    
    // Only add success indicator, no sensitive data in URL
    if (shouldRedirectToAdmin) {
      successUrl.searchParams.set('admin_login', 'success');
    } else {
      successUrl.searchParams.set('google_login', 'success');
    }
    
    console.log(`[${requestId}] Backend-centric redirect to:`, successUrl.toString());
    return res.redirect(302, successUrl.toString());

  } catch (error: any) {
    console.error(`[${requestId}] Error in Google OAuth callback:`, error.message);
    
    const errorUrl = isAdminFlow 
      ? new URL('/admin/login', frontendUrl)
      : new URL('/auth/login', frontendUrl);
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

    // Save user to Prisma database
    let jwtToken = null;
    let sessionRecord = null;
    
    try {
      // Create or update user in Prisma database
      let dbUser;
      try {
        const email = userInfo.email || `${userInfo.username}@discord.local`;
        
        dbUser = await prisma.user.upsert({
          where: { email },
          include: { accounts: true },
          update: {
            username: userInfo.username,
            avatar: userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` : undefined,
            isVerified: !!userInfo.email, // Verify only if real email
            lastLoginAt: new Date(),
            updatedAt: new Date()
          },
          create: {
            email,
            username: userInfo.username,
            avatar: userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` : undefined,
            role: 'USER',
            isVerified: !!userInfo.email,
            isActive: true,
            isPremium: false,
            lastLoginAt: new Date(),
            preferences: {
              theme: 'dark',
              language: 'en',
              timezone: 'America/New_York',
              notifications: {
                email: true,
                inApp: true,
                newLineups: true,
                crosshairUpdates: true,
                weeklyDigest: true,
                marketing: false
              },
              privacy: {
                profileVisibility: 'public',
                showStats: true,
                showActivity: true,
                allowMessages: 'everyone',
                searchable: true
              }
            },
            stats: {
              lineupsCreated: 0,
              crosshairsCreated: 0,
              totalLikes: 0,
              totalViews: 0,
              reputation: 0,
              followers: 0,
              following: 0
            }
          }
        });

        // Create or update Discord OAuth account record
        if (dbUser) {
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: 'discord',
              providerId: userInfo.id,
              userId: dbUser.id
            }
          });

          if (existingAccount) {
            await prisma.account.update({
              where: { id: existingAccount.id },
              data: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
                tokenType: tokens.token_type || 'Bearer',
                scope: tokens.scope
              }
            });
          } else {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: 'oauth',
                provider: 'discord',
                providerId: userInfo.id,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
                tokenType: tokens.token_type || 'Bearer',
                scope: tokens.scope
              }
            });
          }
        }

        console.log('✅ Discord user saved to database:', dbUser.id);

      } catch (dbError) {
        console.error('Database Discord user creation error:', dbError);
      }

      // Generate JWT token and create session
      if (dbUser) {
        jwtToken = await AuthService.generateAccessToken(dbUser as any);
        
        // Create session record like Google OAuth
        const deviceInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          browser: req.headers['user-agent']?.includes('Chrome') ? 'Chrome' : 'Unknown',
          platform: req.headers['user-agent']?.includes('Windows') ? 'Windows' : 'Unknown',
          timestamp: new Date().toISOString()
        };

        const refreshToken = await AuthService.generateRefreshToken(dbUser.id);
        
        console.log(`[${requestId}] 🗑️ Cleaning up existing Discord sessions for user...`);
        await prisma.session.deleteMany({
          where: { 
            userId: dbUser.id,
            isActive: true
          }
        });
        
        sessionRecord = await prisma.session.create({
          data: {
            userId: dbUser.id,
            token: jwtToken,
            refreshToken: refreshToken,
            ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
            userAgent: req.headers['user-agent'] || 'Unknown',
            deviceInfo: deviceInfo,
            loginMethod: 'oauth_discord',
            isAdminSession: false,
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isActive: true,
            isVerified: true
          }
        });
        
        console.log('🔑 JWT token generated and session created for Discord user:', dbUser.id);
      }

      console.log('🎉 Discord user authentication complete:', {
        database: !!dbUser,
        username: userInfo.username,
        email: userInfo.email,
        hasToken: !!jwtToken
      });

    } catch (error) {
      console.error('Discord user creation/update error:', error);
    }
    
    // Set httpOnly cookies for secure session management (like Google OAuth)
    if (jwtToken && sessionRecord) {
      console.log(`[${requestId}] 🍪 Setting Discord OAuth cookies...`);
      
      // Cookie options - simplified for localhost development
      const cookieOptions = {
        httpOnly: true,
        secure: false, // Always false for localhost development
        sameSite: 'lax' as const,
        path: '/'
      };
      
      console.log(`[${requestId}] 🍪 Cookie options:`, cookieOptions);
      
      // Set authentication cookie (7 days)
      res.cookie('authToken', jwtToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Also set access_token for middleware compatibility
      res.cookie('access_token', jwtToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Set refresh token cookie (30 days)
      if (sessionRecord.refreshToken) {
        res.cookie('refreshToken', sessionRecord.refreshToken, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // Also set refresh_token for middleware compatibility
        res.cookie('refresh_token', sessionRecord.refreshToken, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
      }

      console.log('🍪 HttpOnly cookies set for Discord session management');
    }

    const successUrl = new URL('/', frontendUrl);
    successUrl.searchParams.set('discord_login', 'success');

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