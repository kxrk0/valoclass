'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Tag, ExternalLink, Zap, Shield, Users, MapPin, RefreshCw } from 'lucide-react'
import Header from '@/components/layout/Header'

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

// No more hardcoded data! All updates are now fetched live from playvalorant.com

const Updates = () => {
  const [updates, setUpdates] = useState<ValorantUpdate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)

  const categories = ['All', 'Agent Updates', 'Map Changes', 'Weapon Changes', 'System Updates', 'Bug Fixes', 'Competitive Updates']

  useEffect(() => {
    fetchUpdates()
    
    // Set up real-time polling every 5 minutes
    const interval = setInterval(() => {
      fetchUpdates(true) // Silent refresh
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  const fetchUpdates = async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      console.log('🔄 Frontend: Fetching updates from real-time API...')
      const response = await fetch('/api/valorant-updates')
      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ Frontend: Successfully loaded ${data.count} updates from ${data.source}`)
        setUpdates(data.updates)
        setLastUpdated(data.lastUpdated)
      } else {
        console.error('❌ Frontend: API returned error:', data.error)
        setUpdates([])
        setLastUpdated(new Date().toISOString())
      }
    } catch (error) {
      console.error('❌ Frontend: Failed to fetch updates:', error)
      setUpdates([])
      setLastUpdated(new Date().toISOString())
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleManualRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/valorant-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceUpdate: true })
      })
      const data = await response.json()
      
      if (data.success) {
        setUpdates(data.updates)
        setLastUpdated(data.lastUpdated)
      }
    } catch (error) {
      console.error('Failed to refresh updates:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredUpdates = selectedCategory === 'All' 
    ? updates 
    : updates.filter(update => update.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Agent Updates': return <Users size={20} />
      case 'Map Changes': return <MapPin size={20} />
      case 'Weapon Changes': return <Zap size={20} />
      case 'System Updates': return <Shield size={20} />
      default: return <Tag size={20} />
    }
  }

  const getCategoryColor = (category: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live from playvalorant.com</span>
            </div>
            
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="inline-flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 rounded-full px-4 py-2 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={14} className={`text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-gray-400 text-sm font-medium">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Valorant <span className="text-red-400">Updates</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Stay up-to-date with the latest Valorant patches, agent changes, map updates, and competitive adjustments. 
            Real-time tracking of official updates from Riot Games.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Results Count & Last Updated */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-400">
              {loading ? 'Loading...' : `${filteredUpdates.length} updates found`}
            </p>
            {lastUpdated && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading updates...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredUpdates.map((update) => (
                <div key={update.id} className="glass rounded-2xl border border-white/10 overflow-hidden group hover:border-red-500/30 transition-all duration-300">
                  {/* Update Image */}
                  {update.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={update.imageUrl}
                        alt={update.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/static/ui_icons/placeholder.png'
                        }}
                      />
                      {update.isNew && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category Badge */}
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getCategoryColor(update.category)}`}>
                      {getCategoryIcon(update.category)}
                      <span>{update.category}</span>
                    </div>

                    {/* Version & Date */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Tag size={14} />
                        <span>v{update.version}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(update.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-red-300 transition-colors duration-200">
                      {update.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {update.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {update.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {update.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-md">
                          +{update.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Read More Button */}
                    <a 
                      href={update.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                    >
                      <span>Read Official Post</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredUpdates.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Updates Found</h3>
              <p className="text-gray-400">No updates available for the selected category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Updates
