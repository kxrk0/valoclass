import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { db } from '@/lib/database'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const agent = searchParams.get('agent')
    const map = searchParams.get('map')
    const difficulty = searchParams.get('difficulty')
    const side = searchParams.get('side')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build search filters
    const filters = {
      ...(agent && { agent }),
      ...(map && { map }),
      ...(difficulty && { difficulty }),
      ...(side && { side })
    }

    // Search lineups
    const lineups = await db.searchLineups(query, filters)

    // Filter only published lineups for public API
    const publishedLineups = lineups.filter(lineup => lineup.status === 'published')

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLineups = publishedLineups.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedLineups,
      pagination: {
        page,
        limit,
        total: publishedLineups.length,
        pages: Math.ceil(publishedLineups.length / limit)
      }
    })

  } catch (error) {
    logger.error('Get lineups error:', error)
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
      email: 'user@example.com',
      username: 'user',
      stats: { lineupsCreated: 0 }
    }

    const lineupData = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'description', 'agent', 'ability', 'map', 'side', 'position', 'instructions']
    for (const field of requiredFields) {
      if (!lineupData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate SEO slug
    const slug = lineupData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Create lineup
    const lineup = await db.createLineup({
      ...lineupData,
      createdBy: mockUser.id,
      status: lineupData.status || 'draft',
      featured: false,
      verified: false,
      stats: {
        views: 0,
        likes: 0,
        dislikes: 0,
        bookmarks: 0,
        shares: 0,
        comments: 0
      },
      seo: {
        slug,
        metaTitle: lineupData.title,
        metaDescription: lineupData.description,
        keywords: [lineupData.agent, lineupData.map, lineupData.ability, 'valorant', 'lineup']
      }
    })

    // Update user stats (mock)
    // await db.updateUser(mockUser.id, { ... })

    return NextResponse.json({
      success: true,
      data: lineup
    }, { status: 201 })

  } catch (error) {
    logger.error('Create lineup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
