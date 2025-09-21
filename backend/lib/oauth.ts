import { prisma } from '@/lib/prisma'
import { AuthService } from '@/lib/auth'
import { logger } from '@/lib/logger'

export interface OAuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  provider: string
  providerId: string
}

export class OAuthService {
  /**
   * Create or update user from OAuth provider
   */
  static async handleOAuthUser(oauthUser: OAuthUser) {
    try {
      // Check if user already exists with this provider
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: oauthUser.email },
            {
              accounts: {
                some: {
                  provider: oauthUser.provider,
                  providerId: oauthUser.providerId
                }
              }
            }
          ]
        },
        include: {
          accounts: true
        }
      })

      if (user) {
        // Update existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            avatar: oauthUser.avatar || user.avatar,
            isVerified: true // OAuth users are automatically verified
          },
          include: {
            accounts: true
          }
        })

        // Check if this provider account exists
        const existingAccount = user.accounts.find(
          account => account.provider === oauthUser.provider
        )

        if (!existingAccount) {
          // Link new provider to existing user
          await prisma.account.create({
            data: {
              userId: user.id,
              provider: oauthUser.provider,
              providerId: oauthUser.providerId,
              type: 'oauth'
            }
          })
        }
      } else {
        // Create new user
        const username = await this.generateUniqueUsername(oauthUser.name || oauthUser.email)
        
        user = await prisma.user.create({
          data: {
            email: oauthUser.email,
            username,
            displayName: oauthUser.name,
            avatar: oauthUser.avatar,
            isVerified: true,
            isActive: true,
            role: 'USER',
            lastLoginAt: new Date(),
            accounts: {
              create: {
                provider: oauthUser.provider,
                providerId: oauthUser.providerId,
                type: 'oauth'
              }
            }
          },
          include: {
            accounts: true
          }
        })
      }

      return user
    } catch (error) {
      logger.error('OAuth user handling error:', error)
      throw new Error('Failed to process OAuth user')
    }
  }

  /**
   * Generate unique username from name or email
   */
  private static async generateUniqueUsername(nameOrEmail: string): Promise<string> {
    let baseUsername = nameOrEmail
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20)

    if (!baseUsername) {
      baseUsername = 'user'
    }

    let username = baseUsername
    let counter = 1

    while (true) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })

      if (!existingUser) {
        return username
      }

      username = `${baseUsername}${counter}`
      counter++

      // Prevent infinite loop
      if (counter > 9999) {
        username = `${baseUsername}${Date.now()}`
        break
      }
    }

    return username
  }

  /**
   * Parse Google OAuth user data
   */
  static parseGoogleUser(googleUser: any): OAuthUser {
    return {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture,
      provider: 'google',
      providerId: googleUser.id
    }
  }

  /**
   * Parse Discord OAuth user data
   */
  static parseDiscordUser(discordUser: any): OAuthUser {
    const avatar = discordUser.avatar 
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
      : null

    return {
      id: discordUser.id,
      email: discordUser.email,
      name: discordUser.username,
      avatar: avatar || undefined,
      provider: 'discord',
      providerId: discordUser.id
    }
  }

  /**
   * Parse Steam OAuth user data
   */
  static parseSteamUser(steamUser: any): OAuthUser {
    return {
      id: steamUser.steamid,
      email: `${steamUser.steamid}@steam.local`, // Steam doesn't provide email
      name: steamUser.personaname,
      avatar: steamUser.avatarfull,
      provider: 'steam',
      providerId: steamUser.steamid
    }
  }

  /**
   * Unlink OAuth provider from user account
   */
  static async unlinkProvider(userId: string, provider: string) {
    try {
      // Check if user has password or other providers
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Prevent unlinking if it's the only authentication method
      if (!user.passwordHash && user.accounts.length <= 1) {
        throw new Error('Cannot unlink the only authentication method')
      }

      await prisma.account.deleteMany({
        where: {
          userId,
          provider
        }
      })

      return true
    } catch (error) {
      logger.error('OAuth unlink error:', error)
      throw error
    }
  }

  /**
   * Get user's linked providers
   */
  static async getUserProviders(userId: string) {
    try {
      const accounts = await prisma.account.findMany({
        where: { userId },
        select: {
          provider: true,
          type: true,
          createdAt: true
        }
      })

      return accounts
    } catch (error) {
      logger.error('Get user providers error:', error)
      throw error
    }
  }
}
