import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // OAuth hata kontrolü
  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, request.url))
  }

  // Authorization code yoksa, kullanıcıyı Riot OAuth'a yönlendir
  if (!code) {
    const clientId = process.env.RIOT_CLIENT_ID
    if (!clientId) {
      return NextResponse.redirect(new URL('/auth/login?error=missing_client_id', request.url))
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/oauth/riot`
    const scope = 'openid' // Riot OAuth scopes
    const stateParam = Math.random().toString(36).substring(7)

    // Riot OAuth authorization URL
    const authUrl = new URL('https://auth.riotgames.com/oauth2/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', scope)
    authUrl.searchParams.append('state', stateParam)

    return NextResponse.redirect(authUrl.toString())
  }

  // Authorization code'u access token ile değiştir
  try {
    const clientId = process.env.RIOT_CLIENT_ID
    const clientSecret = process.env.RIOT_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/oauth/riot`

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/auth/login?error=missing_credentials', request.url))
    }

    // Token exchange request
    const tokenResponse = await fetch('https://auth.riotgames.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()

    // Kullanıcı bilgilerini al
    const userResponse = await fetch('https://auth.riotgames.com/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    if (!userResponse.ok) {
      throw new Error(`User info fetch failed: ${userResponse.status}`)
    }

    const userData = await userResponse.json()

    // Burada kullanıcı bilgilerini veritabanına kaydetme işlemi yapılacak
    // Şimdilik başarılı login olarak yönlendir
    console.log('Riot user data:', userData)

    // Session oluştur ve ana sayfaya yönlendir
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // JWT token veya session cookie set edebilirsiniz
    response.cookies.set('riot_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in || 3600
    })

    return response

  } catch (error) {
    console.error('Riot OAuth error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }
}
