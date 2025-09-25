'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Tag, ExternalLink, Zap, Shield, Users, MapPin, RefreshCw, X, TrendingUp, Eye, Filter, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

interface ValorantUpdate {
  id: string
  title: string
  version: string
  date: string
  category: 'Agent Updates' | 'Map Changes' | 'Weapon Changes' | 'System Updates' | 'Bug Fixes' | 'Competitive Updates'
  summary: string
  content: string
  imageUrl?: string
  officialUrl: string
  tags: string[]
  isNew?: boolean
}

const Updates = () => {
  const [updates, setUpdates] = useState<ValorantUpdate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { language } = useLanguage()

  const categories = ['All', 'System Updates', 'Competitive Updates', 'Agent Updates', 'Map Changes', 'Weapon Changes', 'Bug Fixes']

  const fetchUpdates = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      console.log(`🔄 Frontend: Fetching updates from real-time API (${language})...`)
      const response = await fetch(`/api/valorant-updates?lang=${language}`)
      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Frontend: Successfully loaded ${data.count} updates from ${data.source} (${data.language})`)
        setUpdates(data.updates)
        setLastUpdated(data.lastUpdated)
      } else {
        console.error('❌ Frontend: API returned error:', data.error)
        setUpdates([])
        setLastUpdated(new Date().toISOString())
      }
    } catch (error) {
      console.error('🚨 Frontend: Network error while fetching updates:', error)
      setUpdates([])
      setLastUpdated(new Date().toISOString())
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchUpdates()
  }, [fetchUpdates])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchUpdates(true)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredUpdates = updates.filter(update => {
    const matchesCategory = selectedCategory === 'All' || update.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Agent Updates': return <Users size={16} />
      case 'Map Changes': return <MapPin size={16} />
      case 'Weapon Changes': return <Zap size={16} />
      case 'System Updates': return <Shield size={16} />
      case 'Bug Fixes': return <ExternalLink size={16} />
      case 'Competitive Updates': return <TrendingUp size={16} />
      default: return <Filter size={16} />
    }
  }

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Agent Updates': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Map Changes': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Weapon Changes': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'System Updates': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Bug Fixes': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Competitive Updates': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
              <div className="h-12 bg-slate-700 rounded w-96 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-slate-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Gaming Site Layout */}
      <div className="pt-20">
        {/* Breadcrumb Bar */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-white font-medium">Updates</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-red-600 rounded-full text-white text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                Live from VALORANT.com
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                VALORANT Updates
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                Stay up-to-date with the latest patches, balance changes, and system updates.
                All content synchronized live from official Riot sources.
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{updates.length}</div>
                  <div className="text-sm text-slate-400">Total Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{updates.filter(u => u.isNew).length}</div>
                  <div className="text-sm text-slate-400">New This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">Live</div>
                  <div className="text-sm text-slate-400">Real-time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <main className="flex-1">
              {/* Filters Bar */}
              <div className="bg-slate-800 rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Filter Updates</span>
                  </h2>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search updates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-red-500 focus:outline-none w-64"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleRefresh()}
                    disabled={refreshing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      refreshing 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
                
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                      <span className="text-xs bg-black/30 px-2 py-0.5 rounded">
                        {category === 'All' ? updates.length : updates.filter(u => u.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>
                
                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading updates...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Showing {filteredUpdates.length} of {updates.length} updates</span>
                      </>
                    )}
                  </div>
                  {lastUpdated && (
                    <span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Updates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUpdates.map((update) => (
                  <Link
                    key={update.id}
                    href={`/updates/${update.id}`}
                    className="group bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    {/* Update Image */}
                    {update.imageUrl && (
                      <div className="aspect-video bg-slate-700">
                        <img
                          src={update.imageUrl}
                          alt={update.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getCategoryBadgeStyle(update.category)}`}>
                          {update.category}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(update.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          {update.isNew && (
                            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                        {update.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                        {update.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {update.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {update.tags.length > 3 && (
                          <span className="text-slate-400 text-xs">
                            +{update.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 text-sm font-medium group-hover:text-red-300">
                          Read More →
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Eye className="w-3 h-3" />
                          <span>2.4K views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {filteredUpdates.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No updates found</h3>
                  <p className="text-slate-400 mb-6">Try adjusting your filters or search query</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All')
                      setSearchQuery('')
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:w-80 xl:w-96 space-y-6">
              {/* Popular This Week */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Popular This Week</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <span className="text-red-400 font-bold text-lg">#1</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        Replay System Finally Here
                      </h4>
                      <p className="text-xs text-slate-400">15.2K views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <span className="text-orange-400 font-bold text-lg">#2</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        New AFK Penalty System
                      </h4>
                      <p className="text-xs text-slate-400">12.8K views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <span className="text-yellow-400 font-bold text-lg">#3</span>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        Mobile Verification Beta
                      </h4>
                      <p className="text-xs text-slate-400">9.1K views</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest News */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Latest News</h3>
                <div className="space-y-4">
                  <div className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <img
                        src="https://picsum.photos/60/45?random=20"
                        alt="News"
                        className="w-15 h-11 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          Champions 2025 Bundle Coming Soon
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <img
                        src="https://picsum.photos/60/45?random=21"
                        alt="News"
                        className="w-15 h-11 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          Agent Balance Changes Preview
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <img
                        src="https://picsum.photos/60/45?random=22"
                        alt="News"
                        className="w-15 h-11 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          New Map Rotation Announced
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Updates