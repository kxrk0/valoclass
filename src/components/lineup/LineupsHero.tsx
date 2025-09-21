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
    { id: 'all', label: t.lineups.hero.tabs.all, count: totalLineups },
    { id: 'smokes', label: t.lineups.hero.tabs.smokes, count: 456 },
    { id: 'flashes', label: t.lineups.hero.tabs.flashes, count: 234 },
    { id: 'recon', label: t.lineups.hero.tabs.recon, count: 189 },
    { id: 'molly', label: t.lineups.hero.tabs.molotovs, count: 156 }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log('Searching for:', searchQuery)
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Multi-layered animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-red-500/25 via-orange-500/20 to-yellow-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-500/20 via-pink-500/15 to-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Additional ambient particles */}
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-green-400/20 to-blue-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="absolute bottom-1/3 left-1/6 w-56 h-56 bg-gradient-to-tr from-yellow-400/20 to-red-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2.5s'}} />
        
        {/* Animated Grid pattern with enhanced opacity */}
        <div className="absolute inset-0 bg-[url('/patterns/tactical-grid.svg')] opacity-15 animate-slow-spin" />
        
        {/* Additional layered effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 to-gray-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-purple-500/5" />
      </div>

      <div className="container relative">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Badge */}
          <div className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500/25 via-orange-500/20 to-yellow-500/25 border border-red-400/40 rounded-full text-red-300 text-sm font-semibold mb-8 backdrop-blur-xl shadow-2xl shadow-red-500/20 hover:shadow-red-500/30 hover:scale-105 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Target size={12} className="text-white animate-pulse" />
            </div>
            {t.lineups.hero.badge}
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          </div>

          {/* Hero Title */}
          <h1 className={`font-heading font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <span className="text-white">{t.lineups.hero.title.main}</span>{' '}
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
              {t.lineups.hero.title.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            {t.lineups.hero.subtitle}
          </p>

          {/* Stats Row */}
          <div className={`flex justify-center items-center gap-8 mb-12 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="flex items-center gap-2 text-green-400">
              <Target size={20} />
              <span className="font-semibold">{totalLineups.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">{t.lineups.hero.stats.lineups}</span>
            </div>
            <div className="w-1 h-6 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2 text-blue-400">
              <Users size={20} />
              <span className="font-semibold">{activeUsers.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">{t.lineups.hero.stats.activeUsers}</span>
            </div>
            <div className="w-1 h-6 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2 text-purple-400">
              <TrendingUp size={20} />
              <span className="font-semibold">{t.lineups.hero.stats.updatedDaily}</span>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className={`max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                {/* Enhanced glass effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl group-hover:shadow-red-500/10 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Search icon with enhanced styling */}
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-red-400/20">
                  <Search size={20} className="text-red-300 group-hover:text-red-200 transition-colors duration-300" />
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.lineups.hero.search.placeholder}
                  className="relative w-full pl-20 pr-40 py-7 bg-transparent text-white placeholder-gray-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all duration-300 rounded-3xl"
                />
                
                {/* Enhanced submit button */}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-8 py-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 group/btn"
                >
                  <div className="flex items-center gap-2">
                    <span>{t.lineups.hero.search.button}</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                      <Target size={12} className="text-white" />
                    </div>
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Enhanced Quick Filter Tabs */}
          <div className={`flex justify-center transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="inline-flex bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 rounded-2xl font-semibold transition-all duration-500 overflow-hidden group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white shadow-xl shadow-red-500/30 transform scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-102'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Animated background effect for active tab */}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-orange-400/20 to-yellow-400/20 animate-pulse" />
                  )}
                  
                  <div className="relative flex items-center gap-2">
                    <span>{tab.label}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white/30 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 group-hover:bg-gray-600/50'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                  
                  {/* Hover effect shimmer */}
                  <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent ${
                    activeTab !== tab.id ? 'opacity-100' : 'opacity-0'
                  }`} />
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
              <h3 className="font-semibold text-lg text-white mb-2">{t.lineups.hero.features.proLevel.title}</h3>
              <p className="text-gray-400 text-sm">
                {t.lineups.hero.features.proLevel.description}
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">{t.lineups.hero.features.videoGuides.title}</h3>
              <p className="text-gray-400 text-sm">
                {t.lineups.hero.features.videoGuides.description}
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-purple-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">{t.lineups.hero.features.communityTested.title}</h3>
              <p className="text-gray-400 text-sm">
                {t.lineups.hero.features.communityTested.description}
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
