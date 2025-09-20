'use client'

import { useState, useEffect } from 'react'
import { Heart, Copy, Download, Search, Filter, Star, TrendingUp, Clock, Users, Eye, ChevronDown } from 'lucide-react'
import CrosshairPreview from './CrosshairPreview'
import type { Crosshair, ValorantCrosshairSettings } from '@/types'
import { PRO_PRESETS, encodeValorantCrosshair, generateShareCode } from '@/utils/valorantCrosshair'

// Enhanced mock data with the new structure
const mockCrosshairs: Crosshair[] = [
  {
    id: '1',
    name: 'TenZ Sentinel',
    description: 'Professional crosshair used by TenZ',
    createdBy: 'TenZ',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    settings: PRO_PRESETS[0].settings,
    shareCode: 'VLC-TENZ001',
    valorantCode: PRO_PRESETS[0].valorantCode,
    tags: ['pro', 'green', 'minimal', 'sentinel'],
    likes: 1247,
    downloads: 8945,
    isPublic: true,
    featured: true,
    category: 'general'
  },
  {
    id: '2',
    name: 'ScreaM Precision',
    description: 'Dot crosshair for precise headshots',
    createdBy: 'ScreaM',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    settings: PRO_PRESETS[1].settings,
    shareCode: 'VLC-SCREAM1',
    valorantCode: PRO_PRESETS[1].valorantCode,
    tags: ['pro', 'white', 'dot', 'precision'],
    likes: 892,
    downloads: 6234,
    isPublic: true,
    featured: true,
    category: 'general'
  },
  {
    id: '3',
    name: 'shroud Hybrid',
    description: 'Balanced crosshair for versatile gameplay',
    createdBy: 'shroud',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    settings: PRO_PRESETS[2].settings,
    shareCode: 'VLC-SHROUD1',
    valorantCode: PRO_PRESETS[2].valorantCode,
    tags: ['pro', 'cyan', 'hybrid', 'versatile'],
    likes: 1456,
    downloads: 9876,
    isPublic: true,
    featured: true,
    category: 'general'
  },
  {
    id: '4',
    name: 'aspas Dynamic',
    description: 'Dynamic crosshair for aggressive playstyle',
    createdBy: 'aspas',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    settings: PRO_PRESETS[3].settings,
    shareCode: 'VLC-ASPAS01',
    valorantCode: PRO_PRESETS[3].valorantCode,
    tags: ['pro', 'green', 'dynamic', 'aggressive'],
    likes: 724,
    downloads: 5432,
    isPublic: true,
    featured: false,
    category: 'general'
  }
]

const CrosshairGallery = () => {
  const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'featured' | 'popular' | 'recent' | 'pro'>('all')
  const [sortBy, setSortBy] = useState<'likes' | 'downloads' | 'recent'>('likes')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [copySuccess, setCopySuccess] = useState<string>('')

  useEffect(() => {
    // Simulate loading with more realistic delay
    setTimeout(() => {
      setCrosshairs(mockCrosshairs)
      setLoading(false)
    }, 800)
  }, [])

  // Get all unique tags from crosshairs
  const allTags = Array.from(new Set(crosshairs.flatMap(c => c.tags)))

  const filteredCrosshairs = crosshairs.filter(crosshair => {
    // Search term filter
    const matchesSearch = 
      crosshair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crosshair.createdBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crosshair.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crosshair.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => crosshair.tags.includes(tag))
    
    // Category filter
    let matchesFilter = true
    switch (filter) {
      case 'featured':
        matchesFilter = crosshair.featured
        break
      case 'popular':
        matchesFilter = crosshair.likes > 500
        break
      case 'recent':
        const isRecent = new Date().getTime() - crosshair.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
        matchesFilter = isRecent
        break
      case 'pro':
        matchesFilter = crosshair.tags.includes('pro')
        break
      default:
        matchesFilter = true
    }
    
    return matchesSearch && matchesTags && matchesFilter
  }).sort((a, b) => {
    switch (sortBy) {
      case 'downloads':
        return b.downloads - a.downloads
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return b.likes - a.likes
    }
  })

  const copyToClipboard = async (text: string, type: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(`${type}-${id}`)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div 
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <h3 className="font-semibold text-lg mb-4">Community Gallery</h3>
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">Community Gallery</h3>
          <p className="text-sm text-gray-400">{filteredCrosshairs.length} crosshairs</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-all"
        >
          <Filter size={16} />
          Filters
          <ChevronDown 
            size={16} 
            className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search crosshairs, players, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700/50">
            {/* Filter Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All', icon: '📋' },
                  { key: 'featured', label: 'Featured', icon: '⭐' },
                  { key: 'popular', label: 'Popular', icon: '🔥' },
                  { key: 'recent', label: 'Recent', icon: '🕒' },
                  { key: 'pro', label: 'Pro Players', icon: '👑' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as typeof filter)}
                    className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      filter === filterOption.key
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-800/30 text-gray-400 border border-transparent hover:bg-gray-800/50'
                    }`}
                  >
                    <span>{filterOption.icon}</span>
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <div className="flex gap-2">
                {[
                  { key: 'likes', label: 'Most Liked', icon: <Heart size={14} /> },
                  { key: 'downloads', label: 'Most Downloaded', icon: <Download size={14} /> },
                  { key: 'recent', label: 'Recently Added', icon: <Clock size={14} /> }
                ].map((sortOption) => (
                  <button
                    key={sortOption.key}
                    onClick={() => setSortBy(sortOption.key as typeof sortBy)}
                    className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      sortBy === sortOption.key
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-800/30 text-gray-400 border border-transparent hover:bg-gray-800/50'
                    }`}
                  >
                    {sortOption.icon}
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gray-800/30 text-gray-400 border border-transparent hover:bg-gray-800/50'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Crosshair Grid */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredCrosshairs.map((crosshair) => (
          <div
            key={crosshair.id}
            className="rounded-xl p-4 transition-all duration-200 hover:bg-white/5"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700/50">
                  <CrosshairPreview
                    settings={crosshair.settings}
                    size="small"
                    background="dark"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white truncate">{crosshair.name}</h4>
                      {crosshair.featured && (
                        <Star size={14} className="text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">by {crosshair.createdBy}</p>
                    {crosshair.description && (
                      <p className="text-xs text-gray-500 truncate">{crosshair.description}</p>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex flex-col items-end text-xs text-gray-400 ml-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Heart size={12} className="text-red-400" />
                      {crosshair.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={12} className="text-blue-400" />
                      {crosshair.downloads}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {crosshair.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {crosshair.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-full">
                      +{crosshair.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(crosshair.valorantCode, 'valorant', crosshair.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-yellow-400 to-red-400 text-black hover:shadow-lg"
                    title="Copy Valorant code"
                  >
                    {copySuccess === `valorant-${crosshair.id}` ? (
                      <>✓ Copied!</>
                    ) : (
                      <>
                        <Copy size={12} />
                        Valorant Code
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => copyToClipboard(crosshair.shareCode, 'share', crosshair.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300"
                    title="Copy share code"
                  >
                    {copySuccess === `share-${crosshair.id}` ? (
                      <>✓</>
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                  
                  <button 
                    className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300"
                    title="Load crosshair"
                  >
                    <Download size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCrosshairs.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium mb-2">No crosshairs found</h4>
          <p className="text-sm">Try adjusting your search criteria or filters</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedTags([])
              setFilter('all')
            }}
            className="mt-4 px-4 py-2 text-sm bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default CrosshairGallery