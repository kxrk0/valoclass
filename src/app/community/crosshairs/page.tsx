'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Heart, Download, Copy, Shuffle, TrendingUp, Clock, Users, Star } from 'lucide-react'
import type { SharedCrosshair } from '@/types'
import CrosshairPreview from '@/components/crosshair/CrosshairPreview'
import { encodeValorantCrosshair } from '@/utils/valorantCrosshair'

const CommunityPageHeader = ({ stats }: { stats?: { totalCrosshairs: number, totalLikes: number, totalDownloads: number } }) => (
  <div className="relative overflow-hidden rounded-2xl p-8 mb-8"
    style={{
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}
  >
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-purple-500">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Community Crosshairs</h1>
          <p className="text-gray-300">Discover and share the best crosshairs from the ValoClass community</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.totalCrosshairs.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-400">Total Crosshairs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.totalLikes.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-400">Total Likes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Download className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.totalDownloads.toLocaleString() || '0'}</p>
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
    {/* Search */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search crosshairs by name, author, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 backdrop-blur-sm"
      />
    </div>
    
    {/* Category Filter */}
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 backdrop-blur-sm"
    >
      <option value="">All Categories</option>
      <option value="general">General</option>
      <option value="primary">Primary</option>
      <option value="ads">ADS</option>
      <option value="sniper">Sniper</option>
    </select>
    
    {/* Sort */}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 backdrop-blur-sm"
    >
      <option value="newest">Newest First</option>
      <option value="popular">Most Popular</option>
      <option value="downloads">Most Downloaded</option>
      <option value="featured">Featured</option>
    </select>
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
      onUpdate() // Refresh the list
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
      onUpdate() // Refresh the list
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
    <div className="rounded-xl p-6 transition-all duration-300 hover:scale-105 group"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{crosshair.name}</h3>
          <p className="text-sm text-gray-400">by {crosshair.author}</p>
          {crosshair.description && (
            <p className="text-sm text-gray-300 mt-2">{crosshair.description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {crosshair.featured && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">Featured</span>
            </div>
          )}
          
          {crosshair.likes > 500 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Popular</span>
            </div>
          )}
          
          {crosshair.downloads > 1000 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Trending</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center mb-4 p-4 bg-black/20 rounded-lg">
        <CrosshairPreview settings={crosshair.settings} size="medium" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          crosshair.category === 'general' ? 'bg-blue-500/20 text-blue-400' :
          crosshair.category === 'primary' ? 'bg-green-500/20 text-green-400' :
          crosshair.category === 'ads' ? 'bg-purple-500/20 text-purple-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {crosshair.category.toUpperCase()}
        </span>
        
        {crosshair.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full">
            {tag}
          </span>
        ))}
        
        {crosshair.tags.length > 3 && (
          <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full">
            +{crosshair.tags.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {crosshair.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {crosshair.downloads.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {formatDate(crosshair.createdAt)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleLike}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
            liked 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          Like
        </button>
        
        <button
          onClick={handleCopyCode}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Downloaded!' : 'Copy Code'}
        </button>
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

const CommunityPage = () => {
  const [crosshairs, setCrosshairs] = useState<SharedCrosshair[]>([])
  const [filteredCrosshairs, setFilteredCrosshairs] = useState<SharedCrosshair[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ totalCrosshairs: number, totalLikes: number, totalDownloads: number }>({
    totalCrosshairs: 0,
    totalLikes: 0,
    totalDownloads: 0
  })

  const fetchCrosshairs = async () => {
    try {
      const response = await fetch('/api/community/crosshairs')
      const data = await response.json()
      
      if (data.crosshairs) {
        setCrosshairs(data.crosshairs)
        
        // Update stats if available
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        console.error('No crosshairs data received from API')
        setCrosshairs([])
      }
    } catch (error) {
      console.error('Failed to fetch crosshairs:', error)
      setCrosshairs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCrosshairs()
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-purple-900/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <Shuffle className="w-6 h-6 text-red-400 animate-spin" />
              <span className="text-white text-lg">Loading community crosshairs...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        <CommunityPageHeader stats={stats} />
        
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {filteredCrosshairs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No crosshairs found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrosshairs.map((crosshair) => (
              <CrosshairCard 
                key={crosshair.id} 
                crosshair={crosshair} 
                onUpdate={fetchCrosshairs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityPage
