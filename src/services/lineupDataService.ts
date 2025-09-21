// LineupDataService - Integration with LineupsValorant.com data
import { LineupEnhanced, LineupFilters, ScrapedLineup } from '@/types/lineup-enhanced'
import { lineupScraper } from './lineupScraper'

export class LineupDataService {
  private apiBaseUrl = '/api/lineups'
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  // Main search function - mirrors LineupsValorant.com functionality
  async searchLineups(
    filters: LineupFilters,
    options: {
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
      fromLocation?: string
      toLocation?: string
      selectedMap?: string
    } = {}
  ): Promise<{
    lineups: LineupEnhanced[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
      hasNext: boolean
      hasPrev: boolean
    }
    analytics: {
      totalResults: number
      popularAgents: Array<{ name: string, count: number }>
      popularMaps: Array<{ name: string, count: number }>
      averageDifficulty: string
      professionalCount: number
    }
  }> {
    try {
      const cacheKey = this.generateCacheKey('search', { filters, options })
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data
        }
      }

      // Build query parameters
      const params = new URLSearchParams()
      
      // Basic filters
      if (filters.query) params.append('q', filters.query)
      if (filters.agents.length > 0) params.append('agents', filters.agents.join(','))
      if (filters.maps.length > 0) params.append('maps', filters.maps.join(','))
      if (filters.abilities.length > 0) params.append('abilities', filters.abilities.join(','))
      if (filters.abilityTypes.length > 0) params.append('abilityTypes', filters.abilityTypes.join(','))
      if (filters.difficulty.length > 0) params.append('difficulty', filters.difficulty.join(','))
      if (filters.side.length > 0) params.append('side', filters.side.join(','))
      if (filters.situation.length > 0) params.append('situation', filters.situation.join(','))
      if (filters.roundType.length > 0) params.append('roundType', filters.roundType.join(','))
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','))
      if (filters.quality.length > 0) params.append('quality', filters.quality.join(','))
      
      // Boolean filters
      if (filters.professional) params.append('professional', 'true')
      if (filters.verified) params.append('verified', 'true')
      if (filters.featured) params.append('featured', 'true')
      
      // Position filters (LineupsValorant.com style)
      if (options.fromLocation) params.append('from', options.fromLocation)
      if (options.toLocation) params.append('to', options.toLocation)
      if (options.selectedMap) params.append('selectedMap', options.selectedMap)
      
      // Pagination and sorting
      params.append('page', (options.page || 1).toString())
      params.append('limit', (options.limit || 20).toString())
      params.append('sortBy', options.sortBy || 'popularity')
      params.append('sortOrder', options.sortOrder || 'desc')

      const response = await fetch(`${this.apiBaseUrl}/enhanced?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed')
      }

      const searchResult = {
        lineups: result.data || [],
        pagination: result.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
          hasNext: false,
          hasPrev: false
        },
        analytics: result.analytics || {
          totalResults: 0,
          popularAgents: [],
          popularMaps: [],
          averageDifficulty: 'medium',
          professionalCount: 0
        }
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: searchResult,
        timestamp: Date.now()
      })

      return searchResult

    } catch (error) {
      console.error('Lineup search failed:', error)
      
      // Return mock data as fallback
      return this.getMockSearchResults(filters, options)
    }
  }

  // Get featured lineups (most popular/trending)
  async getFeaturedLineups(limit: number = 10): Promise<LineupEnhanced[]> {
    return this.searchLineups(
      { 
        featured: true,
        query: '',
        agents: [], maps: [], abilities: [], abilityTypes: [], difficulty: [],
        side: [], situation: [], roundType: [], tags: [], quality: [],
        professional: false, verified: false
      },
      { limit, sortBy: 'popularity', sortOrder: 'desc' }
    ).then(result => result.lineups)
  }

  // Get lineups by position (LineupsValorant.com style)
  async getLineupsByPosition(
    mapName: string,
    fromLocation: string,
    toLocation: string
  ): Promise<LineupEnhanced[]> {
    return this.searchLineups(
      {
        maps: [mapName],
        query: '',
        agents: [], abilities: [], abilityTypes: [], difficulty: [],
        side: [], situation: [], roundType: [], tags: [], quality: [],
        professional: false, verified: false, featured: false
      },
      { fromLocation, toLocation, sortBy: 'popularity' }
    ).then(result => result.lineups)
  }

  // Create new lineup
  async createLineup(lineup: Partial<LineupEnhanced>): Promise<LineupEnhanced> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if available
        },
        body: JSON.stringify(lineup)
      })

      if (!response.ok) {
        throw new Error(`Failed to create lineup: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Creation failed')
      }

      // Clear relevant cache entries
      this.clearCacheByPattern('search')

      return result.data

    } catch (error) {
      console.error('Lineup creation failed:', error)
      throw error
    }
  }

  // Scrape and import lineups from LineupsValorant.com
  async importFromLineupsValorant(
    progressCallback?: (progress: { current: number, total: number, message: string }) => void
  ): Promise<{ imported: number, errors: number, duplicates: number }> {
    try {
      progressCallback?.({ current: 0, total: 100, message: 'Starting scraper...' })
      
      // Use our enhanced scraper
      const scrapedLineups = await lineupScraper.scrapeAllLineups()
      
      let imported = 0
      let errors = 0
      let duplicates = 0
      
      for (let i = 0; i < scrapedLineups.length; i++) {
        const scraped = scrapedLineups[i]
        
        progressCallback?.({
          current: i + 1,
          total: scrapedLineups.length,
          message: `Processing ${scraped.title}...`
        })
        
        try {
          // Convert scraped data to enhanced lineup format
          const enhanced = lineupScraper.convertToEnhancedLineup(scraped)
          
          // Check for duplicates
          const existing = await this.findSimilarLineup(enhanced)
          if (existing) {
            duplicates++
            continue
          }
          
          // Create the lineup
          await this.createLineup(enhanced)
          imported++
          
        } catch (error) {
          console.warn(`Failed to import lineup: ${scraped.title}`, error)
          errors++
        }
        
        // Rate limiting
        if (i % 10 === 0) {
          await this.delay(1000) // 1 second delay every 10 lineups
        }
      }
      
      progressCallback?.({
        current: scrapedLineups.length,
        total: scrapedLineups.length,
        message: `Import complete! ${imported} imported, ${duplicates} duplicates, ${errors} errors`
      })
      
      return { imported, errors, duplicates }
      
    } catch (error) {
      console.error('Import from LineupsValorant.com failed:', error)
      throw error
    }
  }

  // Get available filter options
  async getFilterOptions(): Promise<{
    agents: string[]
    maps: string[]
    abilityTypes: Array<{ name: string, icon: string, color: string }>
    difficulty: Array<{ name: string, color: string }>
    side: Array<{ name: string, icon: string }>
    situation: string[]
    roundType: string[]
    tags: string[]
    quality: Array<{ name: string, color: string }>
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/enhanced`)
      const result = await response.json()
      
      if (result.success && result.filters?.available) {
        return result.filters.available
      }
      
      // Fallback to default options
      return this.getDefaultFilterOptions()
      
    } catch (error) {
      console.error('Failed to get filter options:', error)
      return this.getDefaultFilterOptions()
    }
  }

  // Analytics and statistics
  async getLineupAnalytics(timeRange: 'week' | 'month' | 'all' = 'month'): Promise<{
    totalLineups: number
    popularAgents: Array<{ name: string, count: number, percentage: number }>
    popularMaps: Array<{ name: string, count: number, percentage: number }>
    difficultyDistribution: Record<string, number>
    sideDistribution: { attacker: number, defender: number }
    professionalUsage: number
    averageSuccessRate: number
    trendingTags: string[]
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/analytics?timeRange=${timeRange}`)
      const result = await response.json()
      
      if (result.success) {
        return result.data
      }
      
      throw new Error(result.error || 'Analytics request failed')
      
    } catch (error) {
      console.error('Failed to get analytics:', error)
      
      // Return mock analytics
      return {
        totalLineups: 1250,
        popularAgents: [
          { name: 'Sova', count: 180, percentage: 14.4 },
          { name: 'Viper', count: 165, percentage: 13.2 },
          { name: 'Brimstone', count: 145, percentage: 11.6 },
          { name: 'Omen', count: 125, percentage: 10.0 },
          { name: 'Killjoy', count: 110, percentage: 8.8 }
        ],
        popularMaps: [
          { name: 'Ascent', count: 200, percentage: 16.0 },
          { name: 'Bind', count: 180, percentage: 14.4 },
          { name: 'Haven', count: 165, percentage: 13.2 },
          { name: 'Split', count: 150, percentage: 12.0 },
          { name: 'Icebox', count: 135, percentage: 10.8 }
        ],
        difficultyDistribution: { easy: 400, medium: 500, hard: 300, expert: 50 },
        sideDistribution: { attacker: 720, defender: 530 },
        professionalUsage: 180,
        averageSuccessRate: 84.5,
        trendingTags: ['one-way', 'post-plant', 'retake', 'execute', 'pro']
      }
    }
  }

  // Private helper methods
  private generateCacheKey(operation: string, data: any): string {
    return `${operation}_${JSON.stringify(data)}`
  }

  private clearCacheByPattern(pattern: string): void {
    Array.from(this.cache.keys()).forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    })
  }

  private async findSimilarLineup(lineup: Partial<LineupEnhanced>): Promise<LineupEnhanced | null> {
    // Check for similar lineups to avoid duplicates
    try {
      const searchResult = await this.searchLineups({
        query: `${lineup.agent?.displayName} ${lineup.map?.displayName} ${lineup.title}`,
        agents: lineup.agent?.displayName ? [lineup.agent.displayName] : [],
        maps: lineup.map?.displayName ? [lineup.map.displayName] : [],
        abilities: [], abilityTypes: [], difficulty: [], side: [], 
        situation: [], roundType: [], tags: [], quality: [],
        professional: false, verified: false, featured: false
      }, { limit: 5 })
      
      // Simple similarity check
      return searchResult.lineups.find(existing => 
        existing.title.toLowerCase() === lineup.title?.toLowerCase() &&
        existing.agent.displayName === lineup.agent?.displayName &&
        existing.map.displayName === lineup.map?.displayName
      ) || null
      
    } catch (error) {
      return null
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getMockSearchResults(filters: LineupFilters, options: any) {
    // Return mock search results for demonstration
    return {
      lineups: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false
      },
      analytics: {
        totalResults: 0,
        popularAgents: [],
        popularMaps: [],
        averageDifficulty: 'medium',
        professionalCount: 0
      }
    }
  }

  private getDefaultFilterOptions() {
    return {
      agents: ['Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Fade', 'Harbor', 'Jett', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru', 'Gekko', 'Deadlock'],
      maps: ['Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'],
      abilityTypes: [
        { name: 'Smoke', icon: '💨', color: 'text-blue-400' },
        { name: 'Molotov', icon: '🔥', color: 'text-red-400' },
        { name: 'Flash', icon: '⚡', color: 'text-yellow-400' },
        { name: 'Recon', icon: '👁️', color: 'text-green-400' },
        { name: 'Wall', icon: '🧱', color: 'text-gray-400' },
        { name: 'Heal', icon: '💚', color: 'text-green-300' },
        { name: 'Trap', icon: '⚠️', color: 'text-orange-400' }
      ],
      difficulty: [
        { name: 'Easy', color: 'text-green-400 bg-green-900/20' },
        { name: 'Medium', color: 'text-yellow-400 bg-yellow-900/20' },
        { name: 'Hard', color: 'text-red-400 bg-red-900/20' },
        { name: 'Expert', color: 'text-purple-400 bg-purple-900/20' }
      ],
      side: [
        { name: 'Attacker', icon: '⚔️' },
        { name: 'Defender', icon: '🛡️' }
      ],
      situation: ['Execute', 'Retake', 'Post-plant', 'Anti-eco', 'Force-buy', 'Full-buy'],
      roundType: ['Pistol', 'Anti-eco', 'Gun-round', 'Eco', 'Force'],
      tags: ['one-way', 'post-plant', 'retake', 'execute', 'denial', 'stall', 'fast', 'safe', 'default', 'pro', 'easy', 'advanced'],
      quality: [
        { name: 'Diamond', color: 'text-cyan-400' },
        { name: 'Gold', color: 'text-yellow-400' },
        { name: 'Silver', color: 'text-gray-300' },
        { name: 'Bronze', color: 'text-orange-400' }
      ]
    }
  }
}

// Export singleton instance
export const lineupDataService = new LineupDataService()
