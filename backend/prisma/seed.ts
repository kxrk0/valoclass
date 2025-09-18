import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@valoclass.com' },
    update: {},
    create: {
      email: 'admin@valoclass.com',
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
      isPremium: true,
      isActive: true,
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
        reputation: 100,
        followers: 0,
        following: 0
      }
    }
  })

  // Create demo user
  const userPasswordHash = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@valoclass.com' },
    update: {},
    create: {
      email: 'user@valoclass.com',
      username: 'user',
      passwordHash: userPasswordHash,
      role: 'USER',
      isVerified: true,
      isPremium: false,
      isActive: true,
      riotId: 'DemoUser#NA1',
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/New_York',
        notifications: {
          email: true,
          inApp: true,
          newLineups: true,
          crosshairUpdates: true,
          weeklyDigest: false,
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
        lineupsCreated: 5,
        crosshairsCreated: 3,
        totalLikes: 45,
        totalViews: 1250,
        reputation: 25,
        followers: 12,
        following: 8
      }
    }
  })

  // Create sample lineups
  const sampleLineups = [
    {
      title: 'Viper Bind A Site Smoke',
      description: 'Perfect smoke placement for A site execute on Bind. This lineup allows for safe site takes.',
      agent: 'Viper',
      ability: 'Poison Cloud',
      map: 'Bind',
      side: 'ATTACKER' as const,
      difficulty: 'MEDIUM' as const,
      position: {
        x: 150,
        y: 200,
        angle: 45,
        description: 'From A Short corner'
      },
      instructions: [
        'Position yourself at the corner of A Short',
        'Aim at the top of the lamp post',
        'Throw the smoke orb with full power',
        'Activate when team is ready to execute'
      ],
      images: ['/lineups/viper-bind-a-1.jpg', '/lineups/viper-bind-a-2.jpg'],
      videoUrl: 'https://youtube.com/watch?v=example1',
      tags: ['smoke', 'execute', 'one-way', 'bind', 'viper'],
      status: 'PUBLISHED' as const,
      featured: true,
      verified: true,
      stats: {
        views: 1250,
        likes: 89,
        dislikes: 3,
        bookmarks: 45,
        shares: 12,
        comments: 8
      },
      seo: {
        slug: 'viper-bind-a-site-smoke',
        metaTitle: 'Viper Bind A Site Smoke - ValorantGuides',
        metaDescription: 'Learn the perfect Viper smoke lineup for A site executes on Bind',
        keywords: ['viper', 'bind', 'smoke', 'lineup', 'valorant']
      },
      createdBy: user.id
    },
    {
      title: 'Sova Ascent A Site Recon',
      description: 'Reveals all common angles on A site including default, ninja, and close positions.',
      agent: 'Sova',
      ability: 'Recon Bolt',
      map: 'Ascent',
      side: 'ATTACKER' as const,
      difficulty: 'EASY' as const,
      position: {
        x: 180,
        y: 160,
        angle: 30,
        description: 'From A Main entrance'
      },
      instructions: [
        'Stand at the entrance of A Main',
        'Aim at the roof corner above site',
        'Use 1 bounce with medium charge',
        'Wait for scan before pushing'
      ],
      images: ['/lineups/sova-ascent-a-1.jpg'],
      tags: ['recon', 'info', 'entry', 'ascent', 'sova'],
      status: 'PUBLISHED' as const,
      featured: false,
      verified: true,
      stats: {
        views: 890,
        likes: 67,
        dislikes: 2,
        bookmarks: 32,
        shares: 8,
        comments: 5
      },
      seo: {
        slug: 'sova-ascent-a-site-recon',
        metaTitle: 'Sova Ascent A Site Recon - ValorantGuides',
        metaDescription: 'Master this essential Sova recon bolt for A site on Ascent',
        keywords: ['sova', 'ascent', 'recon', 'lineup', 'valorant']
      },
      createdBy: user.id
    }
  ]

  for (const lineupData of sampleLineups) {
    await prisma.lineup.upsert({
      where: { 
        createdBy_title: {
          createdBy: lineupData.createdBy,
          title: lineupData.title
        }
      },
      update: {},
      create: lineupData
    })
  }

  // Create sample crosshairs
  const sampleCrosshairs = [
    {
      name: 'TenZ Classic',
      description: 'Professional crosshair inspired by TenZ settings',
      shareCode: 'VALO-TENZ001',
      settings: {
        color: '#00ff00',
        outlines: true,
        outlineOpacity: 0.5,
        outlineThickness: 1,
        centerDot: false,
        centerDotOpacity: 1,
        centerDotThickness: 2,
        innerLines: true,
        innerLineOpacity: 1,
        innerLineLength: 4,
        innerLineThickness: 1,
        innerLineOffset: 2,
        outerLines: false,
        outerLineOpacity: 0.35,
        outerLineLength: 2,
        outerLineThickness: 2,
        outerLineOffset: 10,
        movementError: 0,
        firingError: 0,
      },
      tags: ['pro', 'green', 'minimal', 'tenz'],
      isPublic: true,
      featured: true,
      stats: {
        downloads: 1247,
        likes: 89,
        bookmarks: 45,
        shares: 23
      },
      createdBy: user.id
    },
    {
      name: 'ScreaM Dot',
      description: 'Clean dot crosshair for precise aim',
      shareCode: 'VALO-SCREAM01',
      settings: {
        color: '#ffffff',
        outlines: false,
        outlineOpacity: 0.5,
        outlineThickness: 1,
        centerDot: true,
        centerDotOpacity: 1,
        centerDotThickness: 3,
        innerLines: false,
        innerLineOpacity: 1,
        innerLineLength: 6,
        innerLineThickness: 2,
        innerLineOffset: 3,
        outerLines: false,
        outerLineOpacity: 0.35,
        outerLineLength: 2,
        outerLineThickness: 2,
        outerLineOffset: 10,
        movementError: 0,
        firingError: 0,
      },
      tags: ['dot', 'white', 'clean', 'scream'],
      isPublic: true,
      featured: false,
      stats: {
        downloads: 892,
        likes: 67,
        bookmarks: 34,
        shares: 15
      },
      createdBy: user.id
    }
  ]

  for (const crosshairData of sampleCrosshairs) {
    await prisma.crosshair.upsert({
      where: { shareCode: crosshairData.shareCode },
      update: {},
      create: crosshairData
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('📧 Admin: admin@valoclass.com / admin123')
  console.log('👤 User: user@valoclass.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
