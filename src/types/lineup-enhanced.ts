// Enhanced Lineup Types - Based on LineupsValorant.com Analysis
export interface LineupEnhanced {
  id: string
  title: string
  description: string
  
  // Agent & Ability Information
  agent: {
    name: string
    displayName: string
    role: 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel'
    icon: string
  }
  
  ability: {
    name: string
    displayName: string
    slot: 'C' | 'Q' | 'E' | 'X' | 'Passive'
    type: 'Smoke' | 'Flash' | 'Molotov' | 'Recon' | 'Heal' | 'Wall' | 'Trap' | 'Ultimate' | 'Other'
    icon: string
  }
  
  // Map Information  
  map: {
    name: string
    displayName: string
    icon: string
    coordinates: string
  }
  
  // Positioning Details
  positioning: {
    from: {
      location: string      // e.g., "A Short", "B Lobby"
      coordinates: { x: number, y: number }
      landmark: string      // e.g., "Corner near boxes", "Behind cover"
      image: string        // Reference point image
    }
    to: {
      location: string      // e.g., "A Site", "B Default" 
      coordinates: { x: number, y: number }
      targetArea: string   // e.g., "Default plant", "Generator"
      effectiveArea: string // Area coverage description
    }
    trajectory: {
      angle: number        // Aim angle
      power: number        // Throw power (1-100)
      bounces?: number     // For Sova darts
      timing: string       // When to execute
    }
  }
  
  // Game Context
  context: {
    side: 'attacker' | 'defender'
    situation: 'execute' | 'retake' | 'post-plant' | 'anti-eco' | 'force-buy' | 'full-buy'
    roundType: 'pistol' | 'anti-eco' | 'gun-round' | 'eco' | 'force'
    teamStrategy: 'entry' | 'control' | 'delay' | 'support'
  }
  
  // Instructions & Media
  instructions: {
    setup: string[]       // Positioning steps
    execution: string[]   // Execution steps  
    timing: string[]      // When and how to use
    tips: string[]        // Pro tips
  }
  
  media: {
    images: {
      reference: string    // Main reference image
      position: string     // Position setup image
      result: string       // Expected result image
      minimap?: string     // Minimap view
    }
    video: {
      url?: string        // YouTube/Video URL
      timestamp?: string  // Specific timestamp
      thumbnail?: string  // Video thumbnail
    }
  }
  
  // Difficulty & Tags
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  tags: string[]          // e.g., ['one-way', 'post-plant', 'retake']
  
  // Professional Usage
  professional: {
    usedByPros: boolean
    proPlayer?: string    // Pro player name if applicable
    tournament?: string   // Tournament where used
    winRate?: number      // Success rate in pro matches
  }
  
  // Community Stats
  stats: {
    views: number
    likes: number
    dislikes: number
    bookmarks: number
    shares: number
    comments: number
    successRate: number   // User reported success rate
    popularity: number    // Trending score
  }
  
  // Effectiveness
  effectiveness: {
    damage: number        // Expected damage (for molotovs/utilities)
    coverage: number      // Area coverage percentage 
    duration: number      // Effect duration in seconds
    counterplay: string[] // How enemies can counter
  }
  
  // Metadata
  metadata: {
    status: 'draft' | 'published' | 'featured' | 'archived'
    featured: boolean
    verified: boolean     // Verified by moderators
    quality: 'bronze' | 'silver' | 'gold' | 'diamond' // Quality rating
    createdBy: string
    moderatedBy?: string
    moderatedAt?: Date
    version: string       // For game version compatibility
  }
  
  // SEO & Search
  seo: {
    slug: string
    metaTitle?: string
    metaDescription?: string
    keywords: string[]
    searchTerms: string[] // Alternative search terms
  }
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

// Filtering Types
export interface LineupFilters {
  query?: string
  agents: string[]
  maps: string[] 
  abilities: string[]
  abilityTypes: string[]
  difficulty: string[]
  side: string[]
  situation: string[]
  roundType: string[]
  tags: string[]
  professional: boolean
  verified: boolean
  featured: boolean
  quality: string[]
}

// Map Interactive Types
export interface MapInteractive {
  mapName: string
  regions: MapRegion[]
  connections: MapConnection[]
}

export interface MapRegion {
  id: string
  name: string
  displayName: string
  coordinates: { x: number, y: number }
  radius: number
  type: 'site' | 'spawn' | 'choke' | 'cover' | 'elevation'
  connections: string[] // IDs of connected regions
}

export interface MapConnection {
  from: string
  to: string
  type: 'walk' | 'jump' | 'boost' | 'rotate'
  difficulty: 'easy' | 'medium' | 'hard'
}

// Scraping Types  
export interface ScrapedLineup {
  agent?: string
  ability?: string
  title?: string
  description?: string
  fromLocation?: string
  toLocation?: string
  imageUrl?: string
  videoUrl?: string
  instructions?: string[]
  tags?: string[]
  difficulty?: string
  side?: string
  map?: string
  source?: string
  sourceUrl?: string
}

export interface LineupSource {
  name: string
  baseUrl: string
  selectors: {
    lineupCard: string
    agent: string
    ability: string
    title: string
    description: string
    image: string
    video?: string
    instructions: string
    tags: string
    difficulty: string
  }
}
