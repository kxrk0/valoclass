import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { db } from '@/lib/database'
import { logger } from '@/lib/logger'

// Generate random share code
function generateShareCode(): string {
  const prefix = 'VALO'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = prefix + '-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareCode = searchParams.get('shareCode')
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (shareCode) {
      // Get specific crosshair by share code
      const crosshair = await db.getCrosshairByShareCode(shareCode)
      if (!crosshair) {
        return NextResponse.json(
          { error: 'Crosshair not found' },
          { status: 404 }
        )
      }

      if (!crosshair.isPublic) {
        return NextResponse.json(
          { error: 'Crosshair is private' },
          { status: 403 }
        )
      }

      // Increment download count
      await db.updateCrosshair(crosshair.id, {
        stats: {
          ...crosshair.stats,
          downloads: crosshair.stats.downloads + 1
        }
      })

      return NextResponse.json({
        success: true,
        data: crosshair
      })
    }

    // Get all public crosshairs (updated for new structure)
    const allCrosshairs = [
      {
        id: '1',
        name: 'TenZ Sentinel',
        description: 'Professional crosshair used by TenZ in competitive play',
        shareCode: 'VLC-TENZ001',
        valorantCode: '0;s;1;P;c;1;o;1;d;0;f;0;s;0;0t;1;0l;4;0o;2;0a;255;0f;1;1t;2;1l;2;1o;10;1a;90;1m;0;1f;0',
        settings: {
          profile: 0,
          colorType: 1,
          customColor: '#00ff00',
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
          movementError: false,
          movementErrorMultiplier: 0,
          firingError: false,
          firingErrorMultiplier: 0,
          adsError: false,
          outerLines: false,
          outerLineOpacity: 0.35,
          outerLineLength: 2,
          outerLineThickness: 2,
          outerLineOffset: 10
        },
        tags: ['pro', 'green', 'minimal', 'sentinel'],
        isPublic: true,
        featured: true,
        category: 'general',
        createdBy: 'user1',
        likes: 1247,
        downloads: 8945,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '2',
        name: 'ScreaM Precision',
        description: 'Dot crosshair for precise headshot accuracy',
        shareCode: 'VLC-SCREAM1',
        valorantCode: '0;s;1;P;c;0;o;0;d;1;f;0;s;0;0t;2;0l;6;0o;3;0a;255;0f;0;1t;2;1l;2;1o;10;1a;90;1m;0;1f;0',
        settings: {
          profile: 0,
          colorType: 0,
          customColor: '#ffffff',
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
          movementError: false,
          movementErrorMultiplier: 0,
          firingError: false,
          firingErrorMultiplier: 0,
          adsError: false,
          outerLines: false,
          outerLineOpacity: 0.35,
          outerLineLength: 2,
          outerLineThickness: 2,
          outerLineOffset: 10
        },
        tags: ['pro', 'white', 'dot', 'precision'],
        isPublic: true,
        featured: true,
        category: 'general',
        createdBy: 'user2',
        likes: 892,
        downloads: 6234,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    ]

    // Filter based on criteria
    let filteredCrosshairs = allCrosshairs.filter(crosshair => crosshair.isPublic)
    
    if (featured) {
      filteredCrosshairs = filteredCrosshairs.filter(crosshair => crosshair.featured)
    }

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCrosshairs = filteredCrosshairs.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedCrosshairs,
      pagination: {
        page,
        limit,
        total: filteredCrosshairs.length,
        pages: Math.ceil(filteredCrosshairs.length / limit)
      }
    })

  } catch (error) {
    logger.error('Get crosshairs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Mock authentication for demo
    const mockUser = {
      id: 'user-1',
      stats: { crosshairsCreated: 0 }
    }

    const crosshairData = await request.json()

    // Validate required fields
    if (!crosshairData.name || !crosshairData.settings) {
      return NextResponse.json(
        { error: 'Name and settings are required' },
        { status: 400 }
      )
    }

    // Generate unique share code
    let shareCode: string
    let isUnique = false
    let attempts = 0
    
    do {
      shareCode = generateShareCode()
      const existing = await db.getCrosshairByShareCode(shareCode)
      isUnique = !existing
      attempts++
    } while (!isUnique && attempts < 10)

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Unable to generate unique share code' },
        { status: 500 }
      )
    }

    // Create crosshair
    const crosshair = await db.createCrosshair({
      name: crosshairData.name,
      description: crosshairData.description,
      shareCode: shareCode!,
      settings: crosshairData.settings,
      tags: crosshairData.tags || [],
      isPublic: crosshairData.isPublic || false,
      featured: false,
      createdBy: mockUser.id,
      stats: {
        downloads: 0,
        likes: 0,
        bookmarks: 0,
        shares: 0
      }
    })

    // Update user stats (mock)
    // await db.updateUser(mockUser.id, { ... })

    return NextResponse.json({
      success: true,
      data: crosshair
    }, { status: 201 })

  } catch (error) {
    logger.error('Create crosshair error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
