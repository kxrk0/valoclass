'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Play, Heart, Eye, Clock, Star, Bookmark, Share2, 
  MapPin, Target, Zap, Shield, Crosshair, ChevronRight,
  Filter, Search, Grid, List, SortAsc, SortDesc
} from 'lucide-react'
import { LineupEnhanced, LineupFilters } from '@/types/lineup-enhanced'

interface EnhancedLineupGridProps {
  filters: LineupFilters
  searchQuery: string
  viewMode: 'grid' | 'list'
  sortBy: 'popularity' | 'newest' | 'difficulty' | 'agent'
  sortOrder: 'asc' | 'desc'
}

// Mock data based on LineupsValorant.com structure
const mockEnhancedLineups: LineupEnhanced[] = [
  {
    id: '1',
    title: 'A Truck Denial from Short',
    description: 'Perfect incendiary placement to deny A Truck area from A Short position. Stops enemy rotations and forces them to use utility.',
    
    agent: {
      name: 'brimstone',
      displayName: 'Brimstone',
      role: 'Controller',
      icon: '/agents/brimstone/icon.png'
    },
    
    ability: {
      name: 'incendiary',
      displayName: 'Incendiary',
      slot: 'Q',
      type: 'Molotov',
      icon: '/agents/brimstone/abilities/incendiary.png'
    },
    
    map: {
      name: 'bind',
      displayName: 'Bind',
      icon: '/maps/bind/icon.png',
      coordinates: '34.4°N 118.2°W'
    },
    
    positioning: {
      from: {
        location: 'A Short',
        coordinates: { x: 180, y: 180 },
        landmark: 'Behind cover boxes',
        image: '/lineups/brimstone-bind-ashort-1.jpg'
      },
      to: {
        location: 'A Truck',
        coordinates: { x: 150, y: 200 },
        targetArea: 'Truck area denial',
        effectiveArea: 'Full truck coverage'
      },
      trajectory: {
        angle: 45,
        power: 85,
        timing: 'On enemy contact'
      }
    },
    
    context: {
      side: 'defender',
      situation: 'retake',
      roundType: 'gun-round',
      teamStrategy: 'delay'
    },
    
    instructions: {
      setup: ['Position behind A Short boxes', 'Wait for enemy contact'],
      execution: ['Aim at truck corner', 'Throw with medium power'],
      timing: ['Use when enemies push truck', 'Coordinate with team'],
      tips: ['Practice the lineup in range', 'Communicate with teammates']
    },
    
    media: {
      images: {
        reference: '/lineups/brimstone-bind-featured-1.jpg',
        position: '/lineups/brimstone-bind-position-1.jpg',
        result: '/lineups/brimstone-bind-result-1.jpg'
      },
      video: {
        url: 'https://youtube.com/watch?v=example1',
        thumbnail: '/lineups/brimstone-bind-thumb-1.jpg'
      }
    },
    
    difficulty: 'medium',
    tags: ['molly', 'denial', 'defensive', 'retake'],
    
    professional: {
      usedByPros: true,
      proPlayer: 'FNS',
      tournament: 'VCT Masters',
      winRate: 78
    },
    
    stats: {
      views: 15420,
      likes: 892,
      dislikes: 23,
      bookmarks: 445,
      shares: 167,
      comments: 89,
      successRate: 87,
      popularity: 95
    },
    
    effectiveness: {
      damage: 75,
      coverage: 85,
      duration: 8,
      counterplay: ['Smoke blocker', 'Flash over', 'Alternate route']
    },
    
    metadata: {
      status: 'published',
      featured: true,
      verified: true,
      quality: 'diamond',
      createdBy: 'pro_player_1',
      version: '8.0.0'
    },
    
    seo: {
      slug: 'brimstone-bind-truck-denial-ashort',
      keywords: ['brimstone', 'bind', 'incendiary', 'truck', 'denial'],
      searchTerms: ['brimstone', 'bind', 'incendiary', 'truck', 'denial', 'smoke', 'lineup']
    },
    
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Reveal all of A Site',
    description: 'Complete A Site recon setup that reveals all common angles including default, quad, and heaven positions.',
    
    agent: {
      name: 'sova',
      displayName: 'Sova',
      role: 'Initiator',
      icon: '/agents/sova/icon.png'
    },
    
    ability: {
      name: 'recon_bolt',
      displayName: 'Recon Bolt',
      slot: 'E',
      type: 'Recon',
      icon: '/agents/sova/abilities/reconbolt.png'
    },
    
    map: {
      name: 'ascent',
      displayName: 'Ascent',
      icon: '/maps/ascent/icon.png',
      coordinates: '45.26°N 12.33°E'
    },
    
    positioning: {
      from: {
        location: 'A Lobby',
        coordinates: { x: 150, y: 170 },
        landmark: 'Corner near stairs',
        image: '/lineups/sova-ascent-lobby-1.jpg'
      },
      to: {
        location: 'A Site',
        coordinates: { x: 170, y: 190 },
        targetArea: 'Full site coverage',
        effectiveArea: 'Default, Quad, Heaven'
      },
      trajectory: {
        angle: 35,
        power: 75,
        bounces: 1,
        timing: 'Pre-execute'
      }
    },
    
    context: {
      side: 'attacker',
      situation: 'execute',
      roundType: 'gun-round',
      teamStrategy: 'entry'
    },
    
    instructions: {
      setup: ['Position in A Lobby corner', 'Align with stairs'],
      execution: ['Aim at ceiling corner', 'Use 1 bounce, medium charge'],
      timing: ['Execute before team push', 'Wait 2 seconds for scan'],
      tips: ['Practice bounce timing', 'Communicate scanned enemies']
    },
    
    media: {
      images: {
        reference: '/lineups/sova-ascent-featured-1.jpg',
        position: '/lineups/sova-ascent-position-1.jpg',
        result: '/lineups/sova-ascent-result-1.jpg'
      },
      video: {
        url: 'https://youtube.com/watch?v=example2'
      }
    },
    
    difficulty: 'easy',
    tags: ['recon', 'info', 'execute', 'easy'],
    
    professional: {
      usedByPros: true,
      proPlayer: 'Crashies',
      winRate: 82
    },
    
    stats: {
      views: 23150,
      likes: 1205,
      dislikes: 31,
      bookmarks: 678,
      shares: 234,
      comments: 156,
      successRate: 92,
      popularity: 88
    },
    
    effectiveness: {
      damage: 0,
      coverage: 95,
      duration: 3,
      counterplay: ['Destroy dart', 'Smoke cover']
    },
    
    metadata: {
      status: 'published',
      featured: true,
      verified: true,
      quality: 'gold',
      createdBy: 'sova_main_1',
      version: '8.0.0'
    },
    
    seo: {
      slug: 'sova-ascent-site-recon-lobby',
      keywords: ['sova', 'ascent', 'recon', 'dart', 'site'],
      searchTerms: ['sova', 'ascent', 'recon', 'dart', 'site', 'reveal', 'lineup']
    },
    
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
]

const EnhancedLineupGrid = ({ 
  filters, 
  searchQuery, 
  viewMode, 
  sortBy, 
  sortOrder 
}: EnhancedLineupGridProps) => {
  const [lineups, setLineups] = useState<LineupEnhanced[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLineup, setSelectedLineup] = useState<string | null>(null)

  // Filter and sort lineups
  const filteredLineups = useMemo(() => {
    let filtered = mockEnhancedLineups

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(lineup => 
        lineup.title.toLowerCase().includes(query) ||
        lineup.description.toLowerCase().includes(query) ||
        lineup.agent.displayName.toLowerCase().includes(query) ||
        lineup.ability.displayName.toLowerCase().includes(query) ||
        lineup.map.displayName.toLowerCase().includes(query) ||
        lineup.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.agents.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.agents.includes(lineup.agent.displayName)
      )
    }

    if (filters.maps.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.maps.includes(lineup.map.displayName)
      )
    }

    if (filters.abilities.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.abilities.includes(lineup.ability.displayName)
      )
    }

    if (filters.abilityTypes.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.abilityTypes.includes(lineup.ability.type)
      )
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.difficulty.includes(lineup.difficulty)
      )
    }

    if (filters.side.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.side.includes(lineup.context.side)
      )
    }

    if (filters.situation.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.situation.includes(lineup.context.situation)
      )
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(lineup => 
        filters.tags.some(tag => lineup.tags.includes(tag))
      )
    }

    if (filters.professional) {
      filtered = filtered.filter(lineup => lineup.professional.usedByPros)
    }

    if (filters.verified) {
      filtered = filtered.filter(lineup => lineup.metadata.verified)
    }

    if (filters.featured) {
      filtered = filtered.filter(lineup => lineup.metadata.featured)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'popularity':
          comparison = b.stats.popularity - a.stats.popularity
          break
        case 'newest':
          comparison = b.createdAt.getTime() - a.createdAt.getTime()
          break
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3, 'expert': 4 }
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          break
        case 'agent':
          comparison = a.agent.displayName.localeCompare(b.agent.displayName)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [filters, searchQuery, sortBy, sortOrder])

  useEffect(() => {
    setLoading(true)
    // Simulate loading
    setTimeout(() => {
      setLineups(filteredLineups)
      setLoading(false)
    }, 500)
  }, [filteredLineups])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'hard': return 'text-red-400 bg-red-900/20 border-red-500/30'
      case 'expert': return 'text-purple-400 bg-purple-900/20 border-purple-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'diamond': return 'text-cyan-400 bg-cyan-900/20'
      case 'gold': return 'text-yellow-400 bg-yellow-900/20'
      case 'silver': return 'text-gray-300 bg-gray-800/20'
      case 'bronze': return 'text-orange-400 bg-orange-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const LineupCard = ({ lineup }: { lineup: LineupEnhanced }) => (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
      {/* Featured Badge */}
      {lineup.metadata.featured && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
          ⭐ Featured
        </div>
      )}

      {/* Quality Badge */}
      <div className={`absolute top-3 right-3 z-10 ${getQualityColor(lineup.metadata.quality)} text-xs px-2 py-1 rounded-full border`}>
        {lineup.metadata.quality.toUpperCase()}
      </div>

      {/* Image Container */}
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        {lineup.media.images.reference && (
          <Image
            src={lineup.media.images.reference}
            alt={lineup.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Video Play Button */}
        {lineup.media.video.url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-3 group-hover:bg-yellow-600 transition-colors">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Agent & Ability Icons */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Image
              src={lineup.agent.icon}
              alt={lineup.agent.displayName}
              width={20}
              height={20}
            />
          </div>
          <div className="w-8 h-8 bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Image
              src={lineup.ability.icon}
              alt={lineup.ability.displayName}
              width={16}
              height={16}
            />
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
            <Eye className="w-3 h-3" />
            <span>{lineup.stats.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
            <Heart className="w-3 h-3 text-red-400" />
            <span>{lineup.stats.likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          {/* Agent & Ability Names */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-yellow-400 font-medium">{lineup.agent.displayName}</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-400">{lineup.ability.displayName}</span>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(lineup.difficulty)}`}>
              {lineup.difficulty.toUpperCase()}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {lineup.title}
          </h3>
        </div>

        {/* Location Info */}
        <div className="space-y-1">
          <div className="flex items-center text-xs text-gray-400">
            <MapPin className="w-3 h-3 mr-1 text-green-400" />
            <span>From {lineup.positioning.from.location}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Target className="w-3 h-3 mr-1 text-red-400" />
            <span>To {lineup.positioning.to.location}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {lineup.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {lineup.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{lineup.tags.length - 3} more</span>
          )}
        </div>

        {/* Pro Usage */}
        {lineup.professional.usedByPros && (
          <div className="flex items-center space-x-2 text-xs">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400">Used by {lineup.professional.proPlayer}</span>
            <span className="text-gray-400">• {lineup.professional.winRate}% WR</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          <Link 
            href={`/lineups/${lineup.seo.slug}`}
            className="flex items-center space-x-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )

  const LineupListItem = ({ lineup }: { lineup: LineupEnhanced }) => (
    <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-300">
      <div className="flex space-x-4">
        {/* Image */}
        <div className="relative w-24 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
          {lineup.media.images.reference && (
            <Image
              src={lineup.media.images.reference}
              alt={lineup.title}
              fill
              className="object-cover"
            />
          )}
          {lineup.media.video.url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-yellow-400 font-medium">{lineup.agent.displayName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-400">{lineup.ability.displayName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{lineup.map.displayName}</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                {lineup.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{lineup.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(lineup.difficulty)}`}>
                {lineup.difficulty}
              </div>
              {lineup.metadata.featured && (
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs px-2 py-1 rounded-full">
                  Featured
                </div>
              )}
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{lineup.stats.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span>{lineup.stats.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-green-400" />
                <span>{lineup.stats.successRate}% success</span>
              </div>
            </div>

            <Link 
              href={`/lineups/${lineup.seo.slug}`}
              className="btn btn-sm btn-primary"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-900/50 rounded-xl p-4 animate-pulse">
            <div className="h-48 bg-gray-800 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400">
          <span className="text-white font-medium">{filteredLineups.length}</span> lineups found
        </div>
      </div>

      {/* Grid/List Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLineups.map((lineup) => (
            <LineupCard key={lineup.id} lineup={lineup} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLineups.map((lineup) => (
            <LineupListItem key={lineup.id} lineup={lineup} />
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredLineups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No lineups found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or search query to find more results.
          </p>
          <button className="btn btn-primary">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

export default EnhancedLineupGrid
