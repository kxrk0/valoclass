'use client'

import { useState, useEffect } from 'react'
import { Target, Play, TrendingUp, Users, Star, Search, Filter } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

const LineupsHero = () => {
  const t = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [totalLineups] = useState(1247)
  const [activeUsers] = useState(8432)
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const tabs = [
    { id: 'all', label: 'All Lineups', count: totalLineups },
    { id: 'smokes', label: 'Smokes', count: 456 },
    { id: 'flashes', label: 'Flashes', count: 234 },
    { id: 'recon', label: 'Recon', count: 189 },
    { id: 'molly', label: 'Molotovs', count: 156 }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log('Searching for:', searchQuery)
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/patterns/tactical-grid.svg')] opacity-10 animate-slow-spin" />
      </div>

      <div className="container relative">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-8 backdrop-blur-sm transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <Target size={16} className="animate-pulse" />
            Professional Valorant Lineups
          </div>

          {/* Hero Title */}
          <h1 className={`font-heading font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <span className="text-white">Master</span>{' '}
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
              Every Lineup
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            Discover precise lineups from pro players. Smokes, flashes, recon darts, and utility setups
            for every agent and map combination.
          </p>

          {/* Stats Row */}
          <div className={`flex justify-center items-center gap-8 mb-12 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="flex items-center gap-2 text-green-400">
              <Target size={20} />
              <span className="font-semibold">{totalLineups.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">Lineups</span>
            </div>
            <div className="w-1 h-6 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2 text-blue-400">
              <Users size={20} />
              <span className="font-semibold">{activeUsers.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">Active Users</span>
            </div>
            <div className="w-1 h-6 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2 text-purple-400">
              <TrendingUp size={20} />
              <span className="font-semibold">Updated Daily</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search size={24} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agents, maps, abilities..."
                  className="w-full pl-16 pr-32 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 text-lg focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Quick Filter Tabs */}
          <div className={`flex justify-center transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white/20'
                      : 'bg-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Highlights */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-red-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Pro-Level Accuracy</h3>
              <p className="text-gray-400 text-sm">
                Every lineup tested by professionals with exact crosshair placements and timing
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Video Guides</h3>
              <p className="text-gray-400 text-sm">
                Step-by-step video tutorials for every lineup with multiple camera angles
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-purple-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">Community Tested</h3>
              <p className="text-gray-400 text-sm">
                Verified by thousands of players in competitive matches with success ratings
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-slow-spin {
          animation: slow-spin 60s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default LineupsHero
