// LineupsValorant.com Scraping Service
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ScrapedLineup, LineupEnhanced } from '@/types/lineup-enhanced'

export class LineupScraper {
  private baseUrl = 'https://lineupsvalorant.com'
  private rateLimitDelay = 1000 // 1 second between requests
  
  constructor() {
    // Setup axios with proper headers
    axios.defaults.headers.common['User-Agent'] = 
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }

  async scrapeAllLineups(): Promise<ScrapedLineup[]> {
    console.log('🎯 Starting comprehensive scraping of LineupsValorant.com...')
    
    const allLineups: ScrapedLineup[] = []
    
    try {
      // 1. Get all agent pages
      const agents = await this.getAgentList()
      console.log(`📝 Found ${agents.length} agents to scrape`)
      
      // 2. Get all maps  
      const maps = await this.getMapList()
      console.log(`🗺️ Found ${maps.length} maps to scrape`)
      
      // 3. Scrape each combination
      for (const agent of agents) {
        for (const map of maps) {
          console.log(`⚡ Scraping ${agent} lineups on ${map}...`)
          
          const lineups = await this.scrapeAgentMapCombination(agent, map)
          allLineups.push(...lineups)
          
          // Rate limiting
          await this.delay(this.rateLimitDelay)
        }
      }
      
      // 4. Get popular/featured lineups
      const popularLineups = await this.scrapePopularLineups()
      allLineups.push(...popularLineups)
      
      console.log(`✅ Scraping completed! Total lineups found: ${allLineups.length}`)
      return this.deduplicateLineups(allLineups)
      
    } catch (error) {
      console.error('❌ Scraping failed:', error)
      throw error
    }
  }

  private async getAgentList(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl)
      const $ = cheerio.load(response.data)
      
      const agents: string[] = []
      
      // Extract agents from the filter dropdown/options
      $('[data-agent], .agent-filter option, .agent-selector').each((_, element) => {
        const agentName = $(element).text().trim() || $(element).attr('data-agent') || $(element).val()
        if (agentName && typeof agentName === 'string' && !agents.includes(agentName)) {
          agents.push(agentName)
        }
      })
      
      // Fallback: Common Valorant agents
      const fallbackAgents = [
        'Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Fade', 'Harbor',
        'Jett', 'KAYO', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 
        'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru', 'Gekko', 'Deadlock'
      ]
      
      return agents.length > 0 ? agents : fallbackAgents
      
    } catch (error) {
      console.error('Failed to get agent list:', error)
      return ['Brimstone', 'Sova', 'Viper', 'Omen'] // Essential agents
    }
  }

  private async getMapList(): Promise<string[]> {
    try {
      const response = await axios.get(this.baseUrl)
      const $ = cheerio.load(response.data)
      
      const maps: string[] = []
      
      // Extract maps from the interface
      $('[data-map], .map-selector option, .map-filter').each((_, element) => {
        const mapName = $(element).text().trim() || $(element).attr('data-map') || $(element).val()
        if (mapName && typeof mapName === 'string' && mapName !== 'Any' && !maps.includes(mapName)) {
          maps.push(mapName)
        }
      })
      
      // Fallback: Current active duty maps
      const fallbackMaps = [
        'Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 'Icebox', 
        'Lotus', 'Pearl', 'Split', 'Sunset'
      ]
      
      return maps.length > 0 ? maps : fallbackMaps
      
    } catch (error) {
      console.error('Failed to get map list:', error)
      return ['Ascent', 'Bind', 'Haven', 'Split'] // Core maps
    }
  }

  private async scrapeAgentMapCombination(agent: string, map: string): Promise<ScrapedLineup[]> {
    const lineups: ScrapedLineup[] = []
    
    try {
      // Build URL for specific agent/map combination
      const searchUrl = `${this.baseUrl}/?agent=${encodeURIComponent(agent)}&map=${encodeURIComponent(map)}`
      
      const response = await axios.get(searchUrl)
      const $ = cheerio.load(response.data)
      
      // Find lineup cards/items
      $('.lineup-card, .lineup-item, [data-lineup]').each((_, element) => {
        const lineup = this.extractLineupFromElement($, element)
        if (lineup) {
          lineups.push({
            ...lineup,
            agent,
            map,
            source: 'LineupsValorant.com',
            sourceUrl: searchUrl
          })
        }
      })
      
    } catch (error) {
      console.warn(`Failed to scrape ${agent}/${map}:`, error)
    }
    
    return lineups
  }

  private async scrapePopularLineups(): Promise<ScrapedLineup[]> {
    const lineups: ScrapedLineup[] = []
    
    try {
      const response = await axios.get(this.baseUrl)
      const $ = cheerio.load(response.data)
      
      // Find popular/featured lineups section
      $('.popular-lineups, .featured-lineups, .lineup-grid').find('.lineup-card, .lineup-item').each((_, element) => {
        const lineup = this.extractLineupFromElement($, element)
        if (lineup) {
          lineups.push({
            ...lineup,
            source: 'LineupsValorant.com',
            sourceUrl: this.baseUrl,
            tags: [...(lineup.tags || []), 'popular', 'featured']
          })
        }
      })
      
    } catch (error) {
      console.warn('Failed to scrape popular lineups:', error)
    }
    
    return lineups
  }

  private extractLineupFromElement($: cheerio.CheerioAPI, element: any): Partial<ScrapedLineup> | null {
    try {
      const $el = $(element)
      
      // Extract basic information
      const title = this.extractText($el, '.title, .lineup-title, h3, h4')
      const description = this.extractText($el, '.description, .lineup-desc, p')
      
      // Extract agent and ability
      const agent = this.extractText($el, '.agent, [data-agent]') || 
                   this.extractFromText($el.text(), /^(\w+)\s/)
      
      const ability = this.extractText($el, '.ability, .skill, [data-ability]') ||
                     this.extractFromImg($el, 'alt', /(incendiary|smoke|flash|recon|shock)/i)
      
      // Extract locations
      const fromLocation = this.extractText($el, '.from, .start-location') ||
                          this.extractFromText(description, /from\s+([^to]+)/i)
      
      const toLocation = this.extractText($el, '.to, .end-location') ||
                        this.extractFromText(description, /to\s+([^\n.]+)/i)
      
      // Extract image
      const imageUrl = this.extractImageUrl($el) 
      
      // Extract video if available
      const videoUrl = this.extractVideoUrl($el)
      
      // Extract side (attacker/defender)
      const side = this.extractSide($el, description + ' ' + title)
      
      // Extract difficulty
      const difficulty = this.extractDifficulty($el, description)
      
      // Extract instructions
      const instructions = this.extractInstructions($, $el)
      
      // Extract tags
      const tags = this.extractTags($, $el, title + ' ' + description)
      
      // Only return if we have essential data
      if (title && (agent || ability)) {
        return {
          title: title.trim(),
          description: (description || '').trim(),
          agent: (agent || 'Unknown').trim(),
          ability: (ability || 'Unknown').trim(),
          fromLocation: (fromLocation || 'Unknown').trim(),
          toLocation: (toLocation || 'Unknown').trim(),
          imageUrl: imageUrl || '',
          videoUrl: videoUrl || undefined,
          instructions: instructions,
          tags: tags,
          difficulty: difficulty,
          side: side
        }
      }
      
      return null
      
    } catch (error) {
      console.warn('Failed to extract lineup from element:', error)
      return null
    }
  }

  private extractText($el: cheerio.Cheerio<any>, selectors: string): string {
    for (const selector of selectors.split(', ')) {
      const text = $el.find(selector.trim()).first().text().trim()
      if (text) return text
    }
    return ''
  }

  private extractFromText(text: string, regex: RegExp): string {
    const match = text.match(regex)
    return match ? match[1].trim() : ''
  }

  private extractFromImg($el: cheerio.Cheerio<any>, attr: string, regex: RegExp): string {
    const imgs = $el.find('img')
    for (let i = 0; i < imgs.length; i++) {
      const attrValue = imgs.eq(i).attr(attr)
      if (attrValue) {
        const match = attrValue.match(regex)
        if (match) return match[1] || match[0]
      }
    }
    return ''
  }

  private extractImageUrl($el: cheerio.Cheerio<any>): string {
    // Try different image selectors
    const img = $el.find('img').first()
    if (img.length) {
      const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy')
      if (src) {
        return src.startsWith('http') ? src : `${this.baseUrl}${src}`
      }
    }
    
    // Try background images
    const bgImg = $el.css('background-image')
    if (bgImg && bgImg !== 'none') {
      const match = bgImg.match(/url\(['"]?([^'"]+)['"]?\)/)
      if (match) {
        return match[1].startsWith('http') ? match[1] : `${this.baseUrl}${match[1]}`
      }
    }
    
    return ''
  }

  private extractVideoUrl($el: cheerio.Cheerio<any>): string | undefined {
    // Try to find YouTube/video links
    const videoLink = $el.find('a[href*="youtube"], a[href*="youtu.be"], a[href*="video"]').first()
    if (videoLink.length) {
      return videoLink.attr('href') || undefined
    }
    
    // Try embedded videos
    const iframe = $el.find('iframe[src*="youtube"], iframe[src*="video"]').first()
    if (iframe.length) {
      return iframe.attr('src') || undefined
    }
    
    return undefined
  }

  private extractSide($el: cheerio.Cheerio<any>, text: string): string {
    // Look for side indicators
    const sideEl = $el.find('.side, [data-side]').first()
    if (sideEl.length) {
      return sideEl.text().toLowerCase().includes('attack') ? 'attacker' : 'defender'
    }
    
    // Check text for indicators
    const lowerText = text.toLowerCase()
    if (lowerText.includes('attack') || lowerText.includes('execute') || lowerText.includes('push')) {
      return 'attacker'
    }
    if (lowerText.includes('defend') || lowerText.includes('hold') || lowerText.includes('retake')) {
      return 'defender'
    }
    
    return 'attacker' // default
  }

  private extractDifficulty($el: cheerio.Cheerio<any>, text: string): string {
    // Look for difficulty indicators
    const diffEl = $el.find('.difficulty, [data-difficulty]').first()
    if (diffEl.length) {
      const diff = diffEl.text().toLowerCase()
      if (diff.includes('hard') || diff.includes('expert')) return 'hard'
      if (diff.includes('medium')) return 'medium'
      return 'easy'
    }
    
    // Check text for complexity indicators
    const lowerText = text.toLowerCase()
    if (lowerText.includes('hard') || lowerText.includes('difficult') || lowerText.includes('advanced')) {
      return 'hard'
    }
    if (lowerText.includes('medium') || lowerText.includes('intermediate')) {
      return 'medium'
    }
    
    return 'easy' // default
  }

  private extractInstructions($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>): string[] {
    const instructions: string[] = []
    
    // Look for instruction lists
    $el.find('ol li, ul li, .instruction, .step').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 10) {
        instructions.push(text)
      }
    })
    
    return instructions
  }

  private extractTags($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>, text: string): string[] {
    const tags: string[] = []
    
    // Look for explicit tags
    $el.find('.tag, .badge, [data-tag]').each((_, el) => {
      const tag = $(el).text().trim()
      if (tag) tags.push(tag.toLowerCase())
    })
    
    // Extract implicit tags from text
    const lowerText = text.toLowerCase()
    const tagPatterns = {
      'one-way': /one.?way|oneway/,
      'post-plant': /post.?plant|after.?plant/,
      'retake': /retake|take.?back/,
      'execute': /execute|push|entry/,
      'molly': /molly|incendiary|fire/,
      'smoke': /smoke|block/,
      'flash': /flash|blind/,
      'recon': /recon|reveal|scout/,
      'default': /default|common/,
      'safe': /safe|secure/,
      'fast': /fast|quick/,
      'slow': /slow|patient/
    }
    
    Object.entries(tagPatterns).forEach(([tag, pattern]) => {
      if (pattern.test(lowerText) && !tags.includes(tag)) {
        tags.push(tag)
      }
    })
    
    return tags
  }

  private deduplicateLineups(lineups: ScrapedLineup[]): ScrapedLineup[] {
    const unique = new Map<string, ScrapedLineup>()
    
    lineups.forEach(lineup => {
      const key = `${lineup.agent}-${lineup.ability}-${lineup.title}-${lineup.map}`.toLowerCase()
      if (!unique.has(key) || (unique.get(key)!.imageUrl === '' && lineup.imageUrl !== '')) {
        unique.set(key, lineup)
      }
    })
    
    return Array.from(unique.values())
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Convert scraped data to enhanced lineup format
  convertToEnhancedLineup(scraped: ScrapedLineup): Partial<LineupEnhanced> {
    return {
      title: scraped.title,
      description: scraped.description,
      
      agent: scraped.agent ? {
        name: scraped.agent.toLowerCase(),
        displayName: scraped.agent,
        role: this.getAgentRole(scraped.agent),
        icon: `/agents/${scraped.agent.toLowerCase()}/icon.png`
      } : undefined,
      
      ability: scraped.ability ? {
        name: scraped.ability.toLowerCase(),
        displayName: scraped.ability,
        slot: this.getAbilitySlot(scraped.agent || '', scraped.ability),
        type: this.getAbilityType(scraped.ability),
        icon: `/agents/${(scraped.agent || '').toLowerCase()}/abilities/${scraped.ability.toLowerCase()}.png`
      } : undefined,
      
      map: scraped.map ? {
        name: scraped.map.toLowerCase(),
        displayName: scraped.map,
        icon: `/maps/${scraped.map.toLowerCase()}/icon.png`,
        coordinates: this.getMapCoordinates(scraped.map)
      } : undefined,
      
      positioning: {
        from: {
          location: scraped.fromLocation || 'Unknown',
          coordinates: { x: 0, y: 0 }, // Will be set later
          landmark: scraped.fromLocation || 'Unknown',
          image: scraped.imageUrl || '/static/ui_icons/placeholder.png'
        },
        to: {
          location: scraped.toLocation || 'Unknown',
          coordinates: { x: 0, y: 0 }, // Will be set later
          targetArea: scraped.toLocation || 'Unknown',
          effectiveArea: scraped.toLocation || 'Unknown'
        },
        trajectory: {
          angle: 45, // Default
          power: 100, // Default
          timing: 'Pre-execute'
        }
      },
      
      context: {
        side: (scraped.side as 'attacker' | 'defender') || 'attacker',
        situation: 'execute',
        roundType: 'gun-round',
        teamStrategy: 'entry'
      },
      
      instructions: {
        setup: scraped.instructions?.slice(0, 2) || [],
        execution: scraped.instructions?.slice(2, 4) || [],
        timing: ['Use during team execute'],
        tips: ['Practice in range first']
      },
      
      media: {
        images: {
          reference: scraped.imageUrl || '/static/ui_icons/placeholder.png',
          position: scraped.imageUrl || '/static/ui_icons/placeholder.png',
          result: scraped.imageUrl || '/static/ui_icons/placeholder.png'
        },
        video: {
          url: scraped.videoUrl
        }
      },
      
      difficulty: (scraped.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
      tags: scraped.tags || [],
      
      stats: {
        views: 0,
        likes: 0,
        dislikes: 0,
        bookmarks: 0,
        shares: 0,
        comments: 0,
        successRate: 85,
        popularity: 50
      },
      
      metadata: {
        status: 'published',
        featured: scraped.tags?.includes('featured') || false,
        verified: false,
        quality: 'silver',
        createdBy: 'scraper',
        version: '8.0.0'
      }
    }
  }

  private getAgentRole(agent: string): 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel' {
    const roles: Record<string, 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel'> = {
      'brimstone': 'Controller', 'viper': 'Controller', 'omen': 'Controller', 'astra': 'Controller', 'harbor': 'Controller',
      'sova': 'Initiator', 'breach': 'Initiator', 'skye': 'Initiator', 'kayo': 'Initiator', 'fade': 'Initiator', 'gekko': 'Initiator',
      'jett': 'Duelist', 'phoenix': 'Duelist', 'raze': 'Duelist', 'reyna': 'Duelist', 'yoru': 'Duelist', 'neon': 'Duelist',
      'sage': 'Sentinel', 'cypher': 'Sentinel', 'killjoy': 'Sentinel', 'chamber': 'Sentinel', 'deadlock': 'Sentinel'
    }
    return roles[agent.toLowerCase()] || 'Controller'
  }

  private getAbilitySlot(agent: string, ability: string): 'C' | 'Q' | 'E' | 'X' {
    // Simplified mapping - would need full ability database
    const ults = ['viper\'s pit', 'rolling thunder', 'orbital strike', 'hunter\'s fury']
    if (ults.some(ult => ability.toLowerCase().includes(ult))) return 'X'
    
    const signatures = ['smoke', 'poison cloud', 'toxic screen', 'recon bolt']
    if (signatures.some(sig => ability.toLowerCase().includes(sig))) return 'E'
    
    return 'Q' // Default
  }

  private getAbilityType(ability: string): 'Smoke' | 'Flash' | 'Molotov' | 'Recon' | 'Heal' | 'Wall' | 'Trap' | 'Ultimate' | 'Other' {
    const lower = ability.toLowerCase()
    if (lower.includes('incendiary') || lower.includes('molly') || lower.includes('fire')) return 'Molotov'
    if (lower.includes('smoke') || lower.includes('cloud')) return 'Smoke'
    if (lower.includes('flash') || lower.includes('blind')) return 'Flash'
    if (lower.includes('recon') || lower.includes('reveal')) return 'Recon'
    if (lower.includes('heal') || lower.includes('resurrect')) return 'Heal'
    if (lower.includes('wall') || lower.includes('barrier')) return 'Wall'
    if (lower.includes('trap') || lower.includes('alarm')) return 'Trap'
    return 'Other'
  }

  private getMapCoordinates(map: string): string {
    const coords: Record<string, string> = {
      'bind': '34.4°N 118.2°W',
      'ascent': '45.26°N 12.33°E', 
      'haven': '27.28°N 39.54°E',
      'split': '35.41°N 139.45°E',
      'breeze': '26.2°N 127.9°E',
      'icebox': '76.44°N 68.78°W',
      'fracture': '35.1°N 87.8°W',
      'pearl': '38.73°N 9.14°W',
      'lotus': '11.57°N 92.61°E',
      'sunset': '34.05°N 118.25°W'
    }
    return coords[map.toLowerCase()] || '0°N 0°W'
  }
}

// Export singleton instance
export const lineupScraper = new LineupScraper()
