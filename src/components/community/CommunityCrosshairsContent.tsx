'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Heart, Download, Copy, Shuffle, TrendingUp, Clock, Users, Star } from 'lucide-react'
import type { SharedCrosshair } from '@/types'
import CrosshairPreview from '@/components/crosshair/CrosshairPreview'
import { encodeValorantCrosshair } from '@/utils/valorantCrosshair'

const CommunityStatsHeader = ({ stats }: { stats?: { totalCrosshairs: number, totalLikes: number, totalDownloads: number } }) => (
  <div className="relative overflow-hidden rounded-3xl p-8 mb-8"
    style={{
      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 85, 247, 0.2)'
    }}
  >
    <div className="absolute inset-0 bg-[url('/patterns/crosshair-pattern.svg')] opacity-5" />
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Community Gallery</h2>
          <p className="text-gray-300">Shared by players worldwide</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats?.totalCrosshairs?.toLocaleString() || '2,847'}</p>
              <p className="text-sm text-gray-400">Total Crosshairs</p>
            </div>
          </div>
        </div>
        
        <div className="group p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-red-400/30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats?.totalLikes?.toLocaleString() || '45.2K'}</p>
              <p className="text-sm text-gray-400">Total Likes</p>
            </div>
          </div>
        </div>
        
        <div className="group p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-400/30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats?.totalDownloads?.toLocaleString() || '127K'}</p>
              <p className="text-sm text-gray-400">Downloads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy 
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}) => (
  <div className="flex flex-col lg:flex-row gap-4 mb-8">
    {/* Enhanced Search */}
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search crosshairs by name, author, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300"
      />
    </div>
    
    {/* Enhanced Filters */}
    <div className="flex gap-4">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300"
      >
        <option value="">All Categories</option>
        <option value="general">General</option>
        <option value="primary">Primary</option>
        <option value="ads">ADS</option>
        <option value="sniper">Sniper</option>
      </select>
      
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300"
      >
        <option value="newest">Newest First</option>
        <option value="popular">Most Popular</option>
        <option value="downloads">Most Downloaded</option>
        <option value="featured">Featured</option>
      </select>
    </div>
  </div>
)

const CrosshairCard = ({ 
  crosshair, 
  onUpdate 
}: { 
  crosshair: SharedCrosshair
  onUpdate: () => void
}) => {
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(crosshair.valorantCode)
      setCopied(true)
      
      // Update download count
      setIsUpdating(true)
      await updateCrosshairStats(crosshair.id, 'download')
      onUpdate()
      setIsUpdating(false)
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
      setIsUpdating(false)
    }
  }

  const handleLike = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    const action = liked ? 'unlike' : 'like'
    const success = await updateCrosshairStats(crosshair.id, action)
    
    if (success) {
      setLiked(!liked)
      onUpdate()
    }
    setIsUpdating(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="group relative rounded-2xl p-6 transition-all duration-500 hover:scale-105 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">{crosshair.name}</h3>
            <p className="text-sm text-gray-400">by {crosshair.author}</p>
            {crosshair.description && (
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">{crosshair.description}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {crosshair.featured && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full border border-yellow-400/30">
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">Featured</span>
              </div>
            )}
            
            {crosshair.likes > 500 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full border border-red-400/30">
                <Heart className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400 font-medium">Popular</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Preview */}
        <div className="flex justify-center mb-4 p-6 bg-black/30 rounded-xl backdrop-blur-sm border border-white/10 group-hover:border-purple-400/30 transition-colors duration-300">
          <CrosshairPreview settings={crosshair.settings} size="large" />
        </div>

        {/* Enhanced Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
            crosshair.category === 'general' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
            crosshair.category === 'primary' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
            crosshair.category === 'ads' ? 'bg-purple-500/20 text-purple-400 border-purple-400/30' :
            'bg-red-500/20 text-red-400 border-red-400/30'
          }`}>
            {crosshair.category.toUpperCase()}
          </span>
          
          {crosshair.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-3 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full border border-gray-400/20">
              {tag}
            </span>
          ))}
          
          {crosshair.tags.length > 2 && (
            <span className="px-3 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full border border-gray-400/20">
              +{crosshair.tags.length - 2}
            </span>
          )}
        </div>

        {/* Enhanced Stats */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              {crosshair.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <Download className="w-4 h-4" />
              {crosshair.downloads.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-4 h-4" />
            {formatDate(crosshair.createdAt)}
          </div>
        </div>

        {/* Enhanced Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleLike}
            disabled={isUpdating}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 justify-center font-medium ${
              liked 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:scale-105' 
                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:scale-105 hover:text-white'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            Like
          </button>
          
          <button
            onClick={handleCopyCode}
            disabled={isUpdating}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 justify-center font-medium ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:scale-105'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Downloaded!' : 'Get Code'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to update crosshair stats via API
const updateCrosshairStats = async (id: string, action: 'like' | 'unlike' | 'download') => {
  try {
    const response = await fetch('/api/community/crosshairs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    })
    return response.ok
  } catch (error) {
    console.error('Failed to update crosshair stats:', error)
    return false
  }
}

// Mock data for development
const mockCrosshairs: SharedCrosshair[] = [
  {
    id: '1',
    name: 'TenZ Classic',
    description: 'The exact crosshair used by TenZ in Champions 2023',
    author: 'TenZ',
    category: 'primary',
    tags: ['pro', 'tournament', 'clean'],
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
      innerLineThickness: 2,
      innerLineOffset: 2,
      movementError: false,
      movementErrorMultiplier: 0,
      firingError: false,
      firingErrorMultiplier: 0,
      adsError: false,
      outerLines: false,
      outerLineOpacity: 1,
      outerLineLength: 2,
      outerLineOffset: 10
    },
    valorantCode: '0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1',
    likes: 1247,
    downloads: 5632,
    featured: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Perfect Dot',
    description: 'Simple dot crosshair for precise aim',
    author: 'CommunityUser',
    category: 'general',
    tags: ['dot', 'simple', 'precision'],
    settings: {
      profile: 0,
      colorType: 1,
      customColor: '#00ff00',
      outlines: false,
      outlineOpacity: 0.5,
      outlineThickness: 1,
      centerDot: true,
      centerDotOpacity: 1,
      centerDotThickness: 2,
      innerLines: false,
      innerLineOpacity: 1,
      innerLineLength: 0,
      innerLineThickness: 1,
      innerLineOffset: 1,
      movementError: false,
      movementErrorMultiplier: 0,
      firingError: false,
      firingErrorMultiplier: 0,
      adsError: false,
      outerLines: false,
      outerLineOpacity: 1,
      outerLineLength: 0,
      outerLineOffset: 5
    },
    valorantCode: '0;P;c;1;o;0;d;1;z;2;f;0;0t;1;0l;0;0o;1;0a;1;0f;0;1t;1;1l;0;1o;5;1a;1;1m;0;1f;0',
    likes: 832,
    downloads: 3421,
    featured: false,
    createdAt: '2024-01-12T14:22:00Z'
  }
]

const CommunityCrosshairsContent = () => {
  const [crosshairs, setCrosshairs] = useState<SharedCrosshair[]>(mockCrosshairs)
  const [filteredCrosshairs, setFilteredCrosshairs] = useState<SharedCrosshair[]>(mockCrosshairs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(false)
  const [stats] = useState({
    totalCrosshairs: 2847,
    totalLikes: 45200,
    totalDownloads: 127000
  })

  useEffect(() => {
    let filtered = crosshairs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crosshair =>
        crosshair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crosshair.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crosshair.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(crosshair => crosshair.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredCrosshairs(filtered)
  }, [crosshairs, searchTerm, selectedCategory, sortBy])

  const handleUpdate = () => {
    // Refresh logic here
    console.log('Refreshing crosshairs...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Shuffle className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="text-white text-xl">Loading community crosshairs...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <CommunityStatsHeader stats={stats} />
      
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {filteredCrosshairs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <p className="text-2xl font-semibold mb-2">No crosshairs found</p>
            <p className="text-lg">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCrosshairs.map((crosshair) => (
            <CrosshairCard 
              key={crosshair.id} 
              crosshair={crosshair} 
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center pt-8">
        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/20 shadow-lg">
          Load More Crosshairs
        </button>
      </div>
    </div>
  )
}

export default CommunityCrosshairsContent
