import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { OAuthService } from '@/lib/oauth'
import { AuthService } from '@/lib/auth'

// OAuth Configuration
const OAUTH_CONFIGS = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: 'openid email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    scope: 'identify email',
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/v10/users/@me'
  },
  steam: {
    apiKey: process.env.STEAM_API_KEY,
    returnUrl: process.env.NEXTAUTH_URL + '/api/auth/oauth/steam/callback',
    authUrl: 'https://steamcommunity.com/openid/login',
    userInfoUrl: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Check if provider is supported
    if (!OAUTH_CONFIGS[provider as keyof typeof OAUTH_CONFIGS]) {
      return NextResponse.json(
        { error: 'Unsupported OAuth provider' },
        { status: 400 }
      )
    }

    const config = OAUTH_CONFIGS[provider as keyof typeof OAUTH_CONFIGS]

    // Handle OAuth callback (when user returns from provider)
    if (code) {
      return handleOAuthCallback(request, provider, code, state)
    }

    // Handle OAuth error
    if (error) {
      logger.error(`OAuth ${provider} error:`, error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(`${provider} authentication failed`)}`, request.url)
      )
    }

    // Initiate OAuth flow
    return initiateOAuthFlow(request, provider, config)

  } catch (error) {
    logger.error(`OAuth ${params.provider} error:`, error)
    return NextResponse.json(
      { error: 'OAuth authentication failed' },
      { status: 500 }
    )
  }
}

async function initiateOAuthFlow(
  request: NextRequest,
  provider: string,
  config: any
) {
  const { origin } = new URL(request.url)
  const redirectUri = `${origin}/api/auth/oauth/${provider}`
  const state = generateRandomString(32)

  // Store state in session/cookie for CSRF protection
  const response = new NextResponse()
  response.cookies.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/'
  })

  let authUrl: string

  switch (provider) {
    case 'google':
      authUrl = `${config.authUrl}?` + new URLSearchParams({
        client_id: config.clientId!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: config.scope,
        state,
        access_type: 'offline',
        prompt: 'consent'
      }).toString()
      break

    case 'discord':
      authUrl = `${config.authUrl}?` + new URLSearchParams({
        client_id: config.clientId!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: config.scope,
        state
      }).toString()
      break

    case 'steam':
      // Steam OpenID is different from OAuth2
      authUrl = `${config.authUrl}?` + new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': redirectUri,
        'openid.realm': new URL(request.url).origin,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
      }).toString()
      break

    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }

  return NextResponse.redirect(authUrl, { status: 302 })
}

async function handleOAuthCallback(
  request: NextRequest,
  provider: string,
  code: string,
  state: string | null
) {
  try {
    // Verify state for CSRF protection (except Steam which doesn't use state)
    if (provider !== 'steam') {
      const storedState = request.cookies.get(`oauth_state_${provider}`)?.value
      if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter')
      }
    }

    let userInfo: any

    switch (provider) {
      case 'google':
        userInfo = await handleGoogleCallback(request, code)
        break
      case 'discord':
        userInfo = await handleDiscordCallback(request, code)
        break
      case 'steam':
        userInfo = await handleSteamCallback(request)
        break
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    // Process OAuth user data
    let oauthUser: any
    
    switch (provider) {
      case 'google':
        oauthUser = OAuthService.parseGoogleUser(userInfo)
        break
      case 'discord':
        oauthUser = OAuthService.parseDiscordUser(userInfo)
        break
      case 'steam':
        oauthUser = OAuthService.parseSteamUser(userInfo)
        break
    }

    // Create or update user in database
    const user = await OAuthService.handleOAuthUser(oauthUser)

    // Generate JWT tokens
    const { accessToken, refreshToken } = await AuthService.createSession({
      ...user,
      avatar: user.avatar || undefined
    } as any)

    // Set authentication cookies
    const response = NextResponse.redirect(new URL('/', request.url))
    
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })

    // Clear OAuth state cookie
    response.cookies.delete(`oauth_state_${provider}`)
    
    return response

  } catch (error) {
    logger.error(`OAuth ${provider} callback error:`, error)
    const errorUrl = new URL('/auth/login', request.url)
    errorUrl.searchParams.set('error', `${provider} authentication failed`)
    return NextResponse.redirect(errorUrl)
  }
}

async function handleGoogleCallback(request: NextRequest, code: string) {
  const config = OAUTH_CONFIGS.google
  const { origin } = new URL(request.url)
  const redirectUri = `${origin}/api/auth/oauth/google`

  // Exchange code for token
  const tokenResponse = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId!,
      client_secret: config.clientSecret!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for token')
  }

  const tokenData = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user info')
  }

  return await userResponse.json()
}

async function handleDiscordCallback(request: NextRequest, code: string) {
  const config = OAUTH_CONFIGS.discord
  const { origin } = new URL(request.url)
  const redirectUri = `${origin}/api/auth/oauth/discord`

  // Exchange code for token
  const tokenResponse = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId!,
      client_secret: config.clientSecret!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange code for token')
  }

  const tokenData = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user info')
  }

  return await userResponse.json()
}

async function handleSteamCallback(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Steam OpenID verification
  const params = new URLSearchParams()
  for (const [key, value] of searchParams.entries()) {
    params.append(key, value)
  }
  params.set('openid.mode', 'check_authentication')

  // Verify with Steam
  const verifyResponse = await fetch('https://steamcommunity.com/openid/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  const verifyText = await verifyResponse.text()
  
  if (!verifyText.includes('is_valid:true')) {
    throw new Error('Steam OpenID verification failed')
  }

  // Extract Steam ID from claimed_id
  const claimedId = searchParams.get('openid.claimed_id')
  if (!claimedId) {
    throw new Error('No claimed_id in Steam response')
  }

  const steamId = claimedId.split('/').pop()
  
  // Get Steam user info
  const config = OAUTH_CONFIGS.steam
  const userInfoUrl = `${config.userInfoUrl}?key=${config.apiKey}&steamids=${steamId}`
  
  const userResponse = await fetch(userInfoUrl)
  if (!userResponse.ok) {
    throw new Error('Failed to fetch Steam user info')
  }

  const userData = await userResponse.json()
  return userData.response?.players?.[0] || null
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
