import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { db } from '@/lib/database'
import { logger } from '@/lib/logger'
import { LineupEnhanced, LineupFilters } from '@/types/lineup-enhanced'

// Enhanced Lineup API - Based on LineupsValorant.com functionality
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const query = searchParams.get('q') || ''
    const agents = searchParams.get('agents')?.split(',') || []
    const maps = searchParams.get('maps')?.split(',') || []
    const abilities = searchParams.get('abilities')?.split(',') || []
    const abilityTypes = searchParams.get('abilityTypes')?.split(',') || []
    const difficulty = searchParams.get('difficulty')?.split(',') || []
    const side = searchParams.get('side')?.split(',') || []
    const situation = searchParams.get('situation')?.split(',') || []
    const roundType = searchParams.get('roundType')?.split(',') || []
    const tags = searchParams.get('tags')?.split(',') || []
    const quality = searchParams.get('quality')?.split(',') || []
    
    // Boolean filters
    const professional = searchParams.get('professional') === 'true'
    const verified = searchParams.get('verified') === 'true'
    const featured = searchParams.get('featured') === 'true'
    
    // Position-based search (from LineupsValorant.com structure)
    const fromLocation = searchParams.get('from')
    const toLocation = searchParams.get('to')
    const selectedMapName = searchParams.get('selectedMap')
    
    // Pagination and sorting
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'popularity'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Build comprehensive filter object
    const filters: LineupFilters = {
      query,
      agents: agents.filter(Boolean),
      maps: maps.filter(Boolean),
      abilities: abilities.filter(Boolean),
      abilityTypes: abilityTypes.filter(Boolean),
      difficulty: difficulty.filter(Boolean),
      side: side.filter(Boolean),
      situation: situation.filter(Boolean),
      roundType: roundType.filter(Boolean),
      tags: tags.filter(Boolean),
      quality: quality.filter(Boolean),
      professional,
      verified,
      featured
    }

    // Search lineups with enhanced filtering
    let searchResults = await searchEnhancedLineups(filters, {
      fromLocation,
      toLocation,
      selectedMap: selectedMapName,
      sortBy,
      sortOrder
    })

    // Filter only published lineups for public API
    searchResults = searchResults.filter(lineup => lineup.metadata.status === 'published')

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = searchResults.slice(startIndex, endIndex)

    // Add analytics data
    const analytics = {
      totalResults: searchResults.length,
      popularAgents: getPopularAgents(searchResults),
      popularMaps: getPopularMaps(searchResults),
      averageDifficulty: getAverageDifficulty(searchResults),
      professionalCount: searchResults.filter(l => l.professional.usedByPros).length
    }

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      pagination: {
        page,
        limit,
        total: searchResults.length,
        pages: Math.ceil(searchResults.length / limit),
        hasNext: endIndex < searchResults.length,
        hasPrev: page > 1
      },
      filters: {
        applied: filters,
        available: await getAvailableFilters()
      },
      analytics
    })

  } catch (error) {
    logger.error('Enhanced lineup search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('Authorization')
    let user = null
    
    if (authHeader) {
      try {
        user = await AuthService.verifyToken(authHeader.replace('Bearer ', ''))
      } catch (error) {
        return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 })
      }
    } else {
      // Mock user for demo
      user = { id: 'user-1', email: 'user@example.com', username: 'demo_user' }
    }

    const lineupData = await request.json() as Partial<LineupEnhanced>

    // Validate required fields for enhanced lineup
    const requiredFields = [
      'title', 'description', 'agent', 'ability', 'map', 
      'positioning', 'context', 'instructions', 'difficulty'
    ]
    
    for (const field of requiredFields) {
      if (!lineupData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate enhanced lineup with all metadata
    const enhancedLineup: Partial<LineupEnhanced> = {
      ...lineupData,
      id: generateLineupId(),
      
      // Ensure proper structure
      professional: {
        usedByPros: false,
        ...lineupData.professional
      },
      
      stats: {
        views: 0,
        likes: 0,
        dislikes: 0,
        bookmarks: 0,
        shares: 0,
        comments: 0,
        successRate: 85,
        popularity: 50,
        ...lineupData.stats
      },
      
      effectiveness: {
        damage: calculateExpectedDamage(lineupData.ability?.type || 'Other'),
        coverage: 80,
        duration: getDurationForAbility(lineupData.ability?.type || 'Other'),
        counterplay: generateCounterplay(lineupData.ability?.type || 'Other'),
        ...lineupData.effectiveness
      },
      
      metadata: {
        status: 'published',
        featured: false,
        verified: false,
        quality: 'silver',
        createdBy: user.id,
        version: '8.0.0',
        ...lineupData.metadata
      },
      
      seo: {
        slug: generateSlug(lineupData.title || '', lineupData.agent?.displayName || '', lineupData.map?.displayName || ''),
        metaTitle: `${lineupData.title} - ${lineupData.agent?.displayName} ${lineupData.ability?.displayName}`,
        metaDescription: lineupData.description,
        keywords: [
          lineupData.agent?.displayName || '',
          lineupData.map?.displayName || '',
          lineupData.ability?.displayName || '',
          'valorant',
          'lineup'
        ].filter(Boolean),
        searchTerms: generateSearchTerms(lineupData),
        ...lineupData.seo
      },
      
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to database
    const savedLineup = await db.createEnhancedLineup(enhancedLineup)

    // Update user statistics
    await updateUserStats(user.id, 'lineupCreated')

    return NextResponse.json({
      success: true,
      data: savedLineup,
      message: 'Enhanced lineup created successfully'
    }, { status: 201 })

  } catch (error) {
    logger.error('Create enhanced lineup error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Enhanced search function with LineupsValorant.com-like filtering
async function searchEnhancedLineups(
  filters: LineupFilters,
  options: {
    fromLocation?: string | null
    toLocation?: string | null
    selectedMap?: string | null
    sortBy: string
    sortOrder: string
  }
): Promise<LineupEnhanced[]> {
  try {
    // Start with base query
    let query = db.enhancedLineups.findMany({
      where: {
        AND: [
          // Text search across multiple fields
          filters.query ? {
            OR: [
              { title: { contains: filters.query, mode: 'insensitive' } },
              { description: { contains: filters.query, mode: 'insensitive' } },
              { 'agent.displayName': { contains: filters.query, mode: 'insensitive' } },
              { 'ability.displayName': { contains: filters.query, mode: 'insensitive' } },
              { 'map.displayName': { contains: filters.query, mode: 'insensitive' } },
              { tags: { hasSome: [filters.query.toLowerCase()] } }
            ]
          } : {},
          
          // Agent filter
          filters.agents.length > 0 ? {
            'agent.displayName': { in: filters.agents }
          } : {},
          
          // Map filter
          filters.maps.length > 0 ? {
            'map.displayName': { in: filters.maps }
          } : {},
          
          // Ability filter
          filters.abilities.length > 0 ? {
            'ability.displayName': { in: filters.abilities }
          } : {},
          
          // Ability type filter
          filters.abilityTypes.length > 0 ? {
            'ability.type': { in: filters.abilityTypes }
          } : {},
          
          // Difficulty filter
          filters.difficulty.length > 0 ? {
            difficulty: { in: filters.difficulty }
          } : {},
          
          // Side filter
          filters.side.length > 0 ? {
            'context.side': { in: filters.side }
          } : {},
          
          // Situation filter
          filters.situation.length > 0 ? {
            'context.situation': { in: filters.situation }
          } : {},
          
          // Round type filter
          filters.roundType.length > 0 ? {
            'context.roundType': { in: filters.roundType }
          } : {},
          
          // Tags filter
          filters.tags.length > 0 ? {
            tags: { hasSome: filters.tags }
          } : {},
          
          // Quality filter
          filters.quality.length > 0 ? {
            'metadata.quality': { in: filters.quality }
          } : {},
          
          // Boolean filters
          filters.professional ? {
            'professional.usedByPros': true
          } : {},
          
          filters.verified ? {
            'metadata.verified': true
          } : {},
          
          filters.featured ? {
            'metadata.featured': true
          } : {},
          
          // Position-based filters (LineupsValorant.com style)
          options.fromLocation ? {
            'positioning.from.location': { contains: options.fromLocation, mode: 'insensitive' }
          } : {},
          
          options.toLocation ? {
            'positioning.to.location': { contains: options.toLocation, mode: 'insensitive' }
          } : {},
          
          options.selectedMap ? {
            'map.displayName': options.selectedMap
          } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    })

    // Apply sorting
    switch (options.sortBy) {
      case 'popularity':
        query = query.orderBy({ 'stats.popularity': options.sortOrder })
        break
      case 'newest':
        query = query.orderBy({ createdAt: options.sortOrder })
        break
      case 'likes':
        query = query.orderBy({ 'stats.likes': options.sortOrder })
        break
      case 'difficulty':
        query = query.orderBy({ difficulty: options.sortOrder })
        break
      case 'agent':
        query = query.orderBy({ 'agent.displayName': options.sortOrder })
        break
      case 'successRate':
        query = query.orderBy({ 'stats.successRate': options.sortOrder })
        break
      default:
        query = query.orderBy({ 'stats.popularity': 'desc' })
    }

    return await query
    
  } catch (error) {
    logger.error('Enhanced lineup search failed:', error)
    // Return mock data for demonstration
    return getMockEnhancedLineups().filter(lineup => {
      // Apply basic filtering to mock data
      if (filters.agents.length > 0 && !filters.agents.includes(lineup.agent.displayName)) return false
      if (filters.maps.length > 0 && !filters.maps.includes(lineup.map.displayName)) return false
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(lineup.difficulty)) return false
      if (filters.professional && !lineup.professional.usedByPros) return false
      if (filters.verified && !lineup.metadata.verified) return false
      if (filters.featured && !lineup.metadata.featured) return false
      return true
    })
  }
}

// Utility functions
function generateLineupId(): string {
  return `lineup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateSlug(title: string, agent: string, map: string): string {
  return `${agent}-${map}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateSearchTerms(lineup: Partial<LineupEnhanced>): string[] {
  const terms = [
    lineup.title || '',
    lineup.agent?.displayName || '',
    lineup.agent?.name || '',
    lineup.ability?.displayName || '',
    lineup.ability?.name || '',
    lineup.map?.displayName || '',
    lineup.map?.name || '',
    lineup.positioning?.from.location || '',
    lineup.positioning?.to.location || '',
    ...(lineup.tags || [])
  ]
  return terms.filter(Boolean).map(term => term.toLowerCase())
}

function calculateExpectedDamage(abilityType: string): number {
  const damageMap: Record<string, number> = {
    'Molotov': 75,
    'Shock': 85,
    'Explosive': 90,
    'Poison': 65,
    'Ultimate': 100,
    'Trap': 50
  }
  return damageMap[abilityType] || 0
}

function getDurationForAbility(abilityType: string): number {
  const durationMap: Record<string, number> = {
    'Smoke': 15,
    'Molotov': 8,
    'Wall': 30,
    'Recon': 3,
    'Flash': 1.5,
    'Heal': 5,
    'Ultimate': 12
  }
  return durationMap[abilityType] || 5
}

function generateCounterplay(abilityType: string): string[] {
  const counterplayMap: Record<string, string[]> = {
    'Smoke': ['Wait for dissipation', 'Use recon abilities', 'Coordinate flashes'],
    'Molotov': ['Avoid area', 'Heal after damage', 'Use smokes to block'],
    'Flash': ['Turn away', 'Use walls as cover', 'Counter-flash'],
    'Recon': ['Destroy dart', 'Change position', 'Use smoke cover'],
    'Wall': ['Break wall', 'Find alternate route', 'Use abilities to break'],
    'Ultimate': ['Take cover', 'Use mobility', 'Counter-ultimate']
  }
  return counterplayMap[abilityType] || ['Adapt positioning', 'Use team coordination']
}

async function getAvailableFilters() {
  // Return all available filter options
  return {
    agents: ['Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Fade', 'Harbor', 'Jett', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru', 'Gekko', 'Deadlock'],
    maps: ['Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'],
    abilityTypes: ['Smoke', 'Molotov', 'Flash', 'Recon', 'Wall', 'Heal', 'Trap', 'Ultimate', 'Other'],
    difficulty: ['easy', 'medium', 'hard', 'expert'],
    side: ['attacker', 'defender'],
    situation: ['execute', 'retake', 'post-plant', 'anti-eco', 'force-buy', 'full-buy'],
    roundType: ['pistol', 'anti-eco', 'gun-round', 'eco', 'force'],
    quality: ['bronze', 'silver', 'gold', 'diamond']
  }
}

function getPopularAgents(lineups: LineupEnhanced[]): Array<{ name: string, count: number }> {
  const agentCounts: Record<string, number> = {}
  lineups.forEach(lineup => {
    const agent = lineup.agent.displayName
    agentCounts[agent] = (agentCounts[agent] || 0) + 1
  })
  
  return Object.entries(agentCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function getPopularMaps(lineups: LineupEnhanced[]): Array<{ name: string, count: number }> {
  const mapCounts: Record<string, number> = {}
  lineups.forEach(lineup => {
    const map = lineup.map.displayName
    mapCounts[map] = (mapCounts[map] || 0) + 1
  })
  
  return Object.entries(mapCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function getAverageDifficulty(lineups: LineupEnhanced[]): string {
  if (lineups.length === 0) return 'medium'
  
  const difficultyValues = { easy: 1, medium: 2, hard: 3, expert: 4 }
  const averageValue = lineups.reduce((sum, lineup) => {
    return sum + (difficultyValues[lineup.difficulty] || 2)
  }, 0) / lineups.length
  
  if (averageValue <= 1.5) return 'easy'
  if (averageValue <= 2.5) return 'medium'
  if (averageValue <= 3.5) return 'hard'
  return 'expert'
}

async function updateUserStats(userId: string, action: string) {
  try {
    // Update user statistics
    await db.user.update({
      where: { id: userId },
      data: {
        stats: {
          increment: {
            lineupsCreated: action === 'lineupCreated' ? 1 : 0
          }
        }
      }
    })
  } catch (error) {
    logger.warn('Failed to update user stats:', error)
  }
}

// Mock data for demonstration
function getMockEnhancedLineups(): LineupEnhanced[] {
  // Return mock data - this would normally come from the database
  return [] // Implementation would return actual mock data
}
