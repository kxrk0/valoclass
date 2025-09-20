import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { AuthService } from '@/lib/auth'
import { getClientIPNext, getUserAgentNext, checkRateLimit } from '@/lib/middleware'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIPNext(request)
    if (!checkRateLimit(clientIP, 900000, 10)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, username, password, riotId } = await request.json()

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      )
    }

    // Validate email
    if (!AuthService.isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate username
    const usernameValidation = AuthService.validateUsername(username)
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        { error: usernameValidation.errors[0] },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = AuthService.validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmailUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingEmailUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Check if username already exists
    const existingUsernameUser = await prisma.user.findUnique({
      where: { username }
    })
    if (existingUsernameUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Validate Riot ID if provided
    if (riotId && !/^.+#.+$/.test(riotId)) {
      return NextResponse.json(
        { error: 'Invalid Riot ID format. Use PlayerName#TAG' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await AuthService.hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        riotId: riotId || undefined,
        role: 'USER',
        isVerified: false,
        isPremium: false,
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
    })

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, user.id)

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      }
    }, { status: 201 })

  } catch (error) {
    logger.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
