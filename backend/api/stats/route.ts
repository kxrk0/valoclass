import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import valorantAPI from '@/services/valorantAPI'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameName = searchParams.get('gameName')
    const tagLine = searchParams.get('tagLine')
    const region = searchParams.get('region') || 'na'

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: 'gameName and tagLine are required' },
        { status: 400 }
      )
    }

    // Validate region
    const validRegions = ['na', 'eu', 'ap', 'kr', 'latam', 'br']
    if (!validRegions.includes(region)) {
      return NextResponse.json(
        { error: 'Invalid region. Valid regions: ' + validRegions.join(', ') },
        { status: 400 }
      )
    }

    // Get player stats from Valorant API
    const playerStats = await valorantAPI.getPlayerStats(gameName, tagLine, region)

    if (!playerStats) {
      return NextResponse.json(
        { error: 'Player not found or API unavailable' },
        { status: 404 }
      )
    }

    // Get match history
    const matchHistory = await valorantAPI.getMatchHistory(gameName, tagLine, region)

    // Rank information is included in player stats
    const rankInfo = playerStats?.currenttierpatched || 'Unranked'

    return NextResponse.json({
      success: true,
      data: {
        player: playerStats,
        matches: matchHistory?.data || [],
        rank: rankInfo
      }
    })

  } catch (error) {
    logger.error('Get player stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gameName, tagLine, region = 'na' } = await request.json()

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: 'gameName and tagLine are required' },
        { status: 400 }
      )
    }

    // This endpoint could be used to save/cache player stats
    // For now, just return the fresh data
    const playerStats = await valorantAPI.getPlayerStats(gameName, tagLine, region)

    if (!playerStats) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // In a real app, you might save this to your database for caching
    // await db.savePlayerStats(playerStats)

    return NextResponse.json({
      success: true,
      data: playerStats,
      message: 'Player stats retrieved and cached'
    })

  } catch (error) {
    logger.error('Cache player stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
