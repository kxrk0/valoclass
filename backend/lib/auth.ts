import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { prisma } from './prisma';
import { env } from '../config/env';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = env.REFRESH_TOKEN_EXPIRES_IN;

// Convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET)

export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  riotId?: string
  preferences: any
  stats: any
  isVerified: boolean
  isPremium: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface JWTPayload {
  userId: string
  email: string
  username: string
  role: string
  iat?: number
  exp?: number
}

export class AuthService {
  // Client-side validation methods

  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Username validation
  static validateUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long')
    }

    if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long')
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Rate limiting helper
  static createRateLimiter(windowMs: number, maxRequests: number) {
    const requests = new Map()

    return (identifier: string): boolean => {
      const now = Date.now()
      const windowStart = now - windowMs

      // Clean old entries
      for (const [key, timestamp] of Array.from(requests.entries())) {
        if (timestamp < windowStart) {
          requests.delete(key)
        }
      }

      // Count current requests
      const userRequests = Array.from(requests.entries())
        .filter(([key]) => key.startsWith(identifier))
        .length

      if (userRequests >= maxRequests) {
        return false
      }

      // Add current request
      requests.set(`${identifier}:${now}`, now)
      return true
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  // Generate JWT access token
  static async generateAccessToken(user: User): Promise<string> {
    return new SignJWT({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey)
  }

  // Generate refresh token
  static async generateRefreshToken(userId: string): Promise<string> {
    return new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secretKey)
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, secretKey)
      // Validate payload structure to ensure it matches JWTPayload
      if (
        typeof payload === 'object' &&
        payload !== null &&
        typeof payload.userId === 'string' &&
        typeof payload.email === 'string' &&
        typeof payload.username === 'string' &&
        typeof payload.role === 'string'
      ) {
        return {
          userId: payload.userId,
          email: payload.email,
          username: payload.username,
          role: payload.role
        } as JWTPayload
      }
      return null
    } catch {
      return null
    }
  }

  // Session management
  static async createSession(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user)
    const refreshToken = await this.generateRefreshToken(user.id)

    // Store refresh token in database
    await prisma.session.create({
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lastActivity: new Date()
      }
    })

    return { accessToken, refreshToken }
  }

  static async verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
    try {
      const { payload } = await jwtVerify(token, secretKey)
      return { userId: payload.userId as string }
    } catch {
      return null
    }
  }

  static async refreshSession(refreshToken: string): Promise<{ accessToken: string } | null> {
    const payload = await this.verifyRefreshToken(refreshToken)
    
    if (!payload) {
      return null
    }

    // Verify refresh token exists in database
    const tokenRecord = await prisma.session.findFirst({
      where: { 
        refreshToken: refreshToken, 
        userId: payload.userId,
        expiresAt: { gt: new Date() }
      }
    })
    
    if (!tokenRecord) {
      return null
    }

    // Get user and generate new access token
    const user = await prisma.user.findUnique({ 
      where: { id: payload.userId } 
    })
    
    if (!user) return null

    const accessToken = await this.generateAccessToken(user as User)
    
    // Update session with new access token
    await prisma.session.update({
      where: { id: tokenRecord.id },
      data: { 
        token: accessToken,
        lastActivity: new Date()
      }
    })
    
    return { accessToken }
  }

  static async revokeSession(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { refreshToken: refreshToken }
    })
  }

  // Get current user from request
  static async getCurrentUser(req: Request): Promise<User | null> {
    try {
      const token = req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return null;
      }

      const payload = await this.verifyToken(token);
      if (!payload) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });

      return user as User | null;
    } catch {
      return null;
    }
  }

  // Logout user
  static async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await this.revokeSession(refreshToken);
    }

    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}

export default AuthService
