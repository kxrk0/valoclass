'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Download, Copy, Eye, Heart, Users, Plus, Star, TrendingUp, Clock, Grid, Tag } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useTranslation } from '@/contexts/LanguageContext'

interface Crosshair {
  id: string
  name: string
  author: string
  code: string
  category: 'Pro Player' | 'Community' | 'Team' | 'Fun' | 'Other'
  tags: string[]
  likes: number
  downloads: number
  views: number
  isNew?: boolean
  isFeatured?: boolean
  preview: {
    outline: number
    outlineOpacity: number
    centerDot: number
    centerDotOpacity: number
    innerLines: number
    innerLinesOpacity: number
    outerLines: number
    outerLinesOpacity: number
    movementError: number
    firingError: number
    color: number
  }
}

const SAMPLE_CROSSHAIRS: Crosshair[] = [
  {
    id: '1',
    name: 'TenZ Classic',
    author: 'TenZ',
    code: '0;s;1;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0',
    category: 'Pro Player',
    tags: ['Pro', 'TenZ', 'Sentinels', 'Classic'],
    likes: 2847,
    downloads: 15420,
    views: 24589,
    isFeatured: true,
    preview: {
      outline: 1,
      outlineOpacity: 1,
      centerDot: 1,
      centerDotOpacity: 1,
      innerLines: 4,
      innerLinesOpacity: 1,
      outerLines: 2,
      outerLinesOpacity: 1,
      movementError: 0,
      firingError: 0,
      color: 5
    }
  },
  {
    id: '2',
    name: 'Shroud Dot',
    author: 'Shroud',
    code: '0;s;1;P;c;1;t;4;o;1;d;1;z;1;0t;6;0l;3;0o;1;0a;1;0f;0;1t;3;1l;2;1o;2;1a;1;1m;0;1f;0',
    category: 'Pro Player',
    tags: ['Pro', 'Shroud', 'Dot', 'Minimal'],
    likes: 1956,
    downloads: 9873,
    views: 18542,
    preview: {
      outline: 1,
      outlineOpacity: 1,
      centerDot: 1,
      centerDotOpacity: 1,
      innerLines: 0,
      innerLinesOpacity: 1,
      outerLines: 0,
      outerLinesOpacity: 1,
      movementError: 0,
      firingError: 0,
      color: 1
    }
  },
  {
    id: '3',
    name: 'Valorant Default+',
    author: 'Community',
    code: '0;s;1;P;c;5;h;0;m;1;0l;5;0o;2;0a;1;0f;0;1b;0',
    category: 'Community',
    tags: ['Default', 'Enhanced', 'Beginner'],
    likes: 834,
    downloads: 4521,
    views: 7892,
    isNew: true,
    preview: {
      outline: 1,
      outlineOpacity: 1,
      centerDot: 0,
      centerDotOpacity: 1,
      innerLines: 5,
      innerLinesOpacity: 1,
      outerLines: 2,
      outerLinesOpacity: 1,
      movementError: 1,
      firingError: 0,
      color: 5
    }
  },
  {
    id: '4',
    name: 'ScreaM Crosshair',
    author: 'ScreaM',
    code: '0;s;1;P;c;1;h;0;m;1;0l;4;0o;1;0a;1;0f;0;1b;0',
    category: 'Pro Player',
    tags: ['Pro', 'ScreaM', 'Team Liquid', 'Classic'],
    likes: 1645,
    downloads: 8234,
    views: 14567,
    preview: {
      outline: 1,
      outlineOpacity: 1,
      centerDot: 0,
      centerDotOpacity: 1,
      innerLines: 4,
      innerLinesOpacity: 1,
      outerLines: 1,
      outerLinesOpacity: 1,
      movementError: 1,
      firingError: 0,
      color: 1
    }
  }
]

export default function CrosshairsPage() {
  const t = useTranslation()
  const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
  const [filteredCrosshairs, setFilteredCrosshairs] = useState<Crosshair[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'downloads' | 'az'>('popular')
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = ['All', 'Pro Player', 'Community', 'Team', 'Fun', 'Other']

  useEffect(() => {
    // Simulate API call to fetch crosshairs
    setTimeout(() => {
      setCrosshairs(SAMPLE_CROSSHAIRS)
      setFilteredCrosshairs(SAMPLE_CROSSHAIRS)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = crosshairs

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(crosshair => crosshair.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(crosshair =>
        crosshair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crosshair.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crosshair.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort crosshairs
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredCrosshairs(filtered)
  }, [crosshairs, selectedCategory, searchQuery, sortBy])

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pro Player': return <Star size={16} />
      case 'Community': return <Users size={16} />
      case 'Team': return <Grid size={16} />
      case 'Fun': return <Tag size={16} />
      default: return <Tag size={16} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pro Player': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Community': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Team': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Fun': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
            <Star size={16} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Community Database</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Valorant <span className="text-yellow-400">Crosshairs</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Discover and share the best Valorant crosshairs from pro players and the community. 
            Copy codes instantly and improve your aim today.
          </p>

          {/* Create Button */}
          <Link
            href="/crosshairs/builder"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            <span>Create Your Own Crosshair</span>
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crosshairs, players, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
              >
                <option value="popular">Most Popular</option>
                <option value="downloads">Most Downloads</option>
                <option value="newest">Newest</option>
                <option value="az">A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              {loading ? 'Loading...' : `${filteredCrosshairs.length} crosshairs found`}
            </p>
          </div>
        </div>
      </section>

      {/* Crosshairs Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading crosshairs...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCrosshairs.map((crosshair) => (
                <div key={crosshair.id} className="glass rounded-2xl border border-white/10 overflow-hidden group hover:border-yellow-500/30 transition-all duration-300">
                  {/* Crosshair Preview */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    {crosshair.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        FEATURED
                      </div>
                    )}
                    {crosshair.isNew && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </div>
                    )}
                    
                    {/* Simple crosshair preview */}
                    <div className="relative">
                      {/* Center dot */}
                      {crosshair.preview.centerDot > 0 && (
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{
                            width: `${crosshair.preview.centerDot * 2}px`,
                            height: `${crosshair.preview.centerDot * 2}px`,
                            backgroundColor: crosshair.preview.color === 1 ? '#00ff00' : 
                                            crosshair.preview.color === 5 ? '#ffff00' : '#ffffff',
                            opacity: crosshair.preview.centerDotOpacity
                          }}
                        />
                      )}
                      
                      {/* Inner lines */}
                      {crosshair.preview.innerLines > 0 && (
                        <>
                          <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              width: `${crosshair.preview.innerLines * 2}px`,
                              height: '2px',
                              backgroundColor: crosshair.preview.color === 1 ? '#00ff00' : 
                                              crosshair.preview.color === 5 ? '#ffff00' : '#ffffff',
                              opacity: crosshair.preview.innerLinesOpacity
                            }}
                          />
                          <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              width: '2px',
                              height: `${crosshair.preview.innerLines * 2}px`,
                              backgroundColor: crosshair.preview.color === 1 ? '#00ff00' : 
                                              crosshair.preview.color === 5 ? '#ffff00' : '#ffffff',
                              opacity: crosshair.preview.innerLinesOpacity
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Category Badge */}
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium border mb-3 ${getCategoryColor(crosshair.category)}`}>
                      {getCategoryIcon(crosshair.category)}
                      <span>{crosshair.category}</span>
                    </div>

                    {/* Name and Author */}
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-yellow-300 transition-colors duration-200">
                      {crosshair.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">by {crosshair.author}</p>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Heart size={12} />
                        <span>{crosshair.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download size={12} />
                        <span>{crosshair.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{crosshair.views}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {crosshair.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopyCode(crosshair.code, crosshair.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg font-medium transition-all duration-200 ${
                          copiedId === crosshair.id
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        }`}
                      >
                        <Copy size={14} />
                        <span>{copiedId === crosshair.id ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                      <button className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white rounded-lg transition-colors duration-200">
                        <Heart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCrosshairs.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Crosshairs Found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or browse all crosshairs.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
