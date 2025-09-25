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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Dynamic Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 0, 84, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 84, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 84, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-flow 30s linear infinite'
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              <div className={`w-2 h-2 ${i % 4 === 0 ? 'bg-red-400/30' : i % 4 === 1 ? 'bg-cyan-400/30' : i % 4 === 2 ? 'bg-purple-400/30' : 'bg-pink-400/30'} rounded-full`} />
            </div>
          ))}
        </div>
      </div>

      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 mb-8 rounded-full transition-all duration-1000"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                 backdropFilter: 'blur(20px)',
                 border: '1px solid rgba(0, 212, 255, 0.3)'
               }}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-60 animate-pulse" />
              <div className="relative w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">
              Community Arsenal
            </span>
            <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full">
              <span className="text-cyan-300 text-xs font-bold">LIVE</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6">
            <span className="block text-white drop-shadow-2xl mb-2">Valorant</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent relative">
              Crosshairs
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl -z-10 animate-pulse"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover and share the best Valorant crosshairs from <span className="text-cyan-400 font-semibold">pro players</span> and the 
            <span className="text-purple-400 font-semibold"> community</span>. Copy codes instantly and improve your aim today.
          </p>

          {/* Create Button */}
          <Link
            href="/crosshairs/builder"
            className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden text-white transition-all duration-500 hover:scale-105"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl">
              <Plus size={22} className="group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
              <span>Create Your Own Crosshair</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            {/* Glassmorphism Container */}
            <div 
              className="relative p-6 rounded-2xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Enhanced Search Bar */}
                <div className="relative flex-1 max-w-md group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-70 transition duration-300"></div>
                  <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors z-10" />
                    <input
                      type="text"
                      placeholder="Search crosshairs, players, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border-2 border-gray-700 group-focus-within:border-cyan-400/50 rounded-xl text-white text-lg placeholder-gray-500 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Modern Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white hover:scale-105'
                      }`}
                    >
                      {selectedCategory === category && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      )}
                      <span className="relative z-10">{category}</span>
                    </button>
                  ))}
                </div>

                {/* Enhanced Sort Options */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none px-4 py-3 pr-10 bg-gray-900/50 border-2 border-gray-700 focus:border-purple-400/50 rounded-xl text-white outline-none transition-all duration-300 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="downloads">Most Downloads</option>
                    <option value="newest">Newest</option>
                    <option value="az">A-Z</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Results Count */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="text-gray-300 font-medium">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                    Loading crosshairs...
                  </span>
                ) : (
                  <>
                    <span className="text-cyan-400 font-bold">{filteredCrosshairs.length}</span> crosshairs found
                  </>
                )}
              </div>
            </div>
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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCrosshairs.map((crosshair, index) => (
                <div 
                  key={crosshair.id} 
                  className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  
                  {/* Crosshair Preview */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-900/50 to-gray-800/50 flex items-center justify-center overflow-hidden">
                    {/* Background Pattern */}
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />
                    
                    {/* Badges */}
                    {crosshair.isFeatured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ FEATURED
                      </div>
                    )}
                    {crosshair.isNew && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        ✨ NEW
                      </div>
                    )}
                    
                    {/* Enhanced Crosshair Preview */}
                    <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                      {/* Glow Effect for Crosshair */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Center dot */}
                      {crosshair.preview.centerDot > 0 && (
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg"
                          style={{
                            width: `${crosshair.preview.centerDot * 3}px`,
                            height: `${crosshair.preview.centerDot * 3}px`,
                            backgroundColor: crosshair.preview.color === 1 ? '#00ff00' : 
                                            crosshair.preview.color === 5 ? '#ffff00' : '#ffffff',
                            opacity: crosshair.preview.centerDotOpacity,
                            boxShadow: '0 0 20px currentColor'
                          }}
                        />
                      )}
                      
                      {/* Inner lines */}
                      {crosshair.preview.innerLines > 0 && (
                        <>
                          <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                            style={{
                              width: `${crosshair.preview.innerLines * 3}px`,
                              height: '3px',
                              backgroundColor: crosshair.preview.color === 1 ? '#00ff00' : 
                                              crosshair.preview.color === 5 ? '#ffff00' : '#ffffff',
                              opacity: crosshair.preview.innerLinesOpacity,
                              boxShadow: '0 0 10px currentColor'
                            }}
                          />
                          <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                            style={{
                              width: '3px',
                              height: `${crosshair.preview.innerLines * 3}px`,
                              backgroundColor: crosshair.preview.color === 1 ? '#00ff00' : 
                                              crosshair.preview.color === 5 ? '#ffff00' : '#ffffff',
                              opacity: crosshair.preview.innerLinesOpacity,
                              boxShadow: '0 0 10px currentColor'
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6 relative">
                    {/* Floating Category Badge */}
                    <div className={`absolute -top-3 left-6 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-xl shadow-lg transition-all duration-300 ${getCategoryColor(crosshair.category)}`}>
                      {getCategoryIcon(crosshair.category)}
                      <span>{crosshair.category}</span>
                    </div>

                    {/* Name and Author */}
                    <div className="mt-4 mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1">
                        {crosshair.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">
                        by <span className="text-purple-400 font-semibold">{crosshair.author}</span>
                      </p>
                    </div>

                    {/* Enhanced Stats */}
                    <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-700/50">
                      <div className="flex items-center space-x-1 text-red-400">
                        <Heart size={14} className="group-hover:animate-pulse" />
                        <span className="text-sm font-bold">{crosshair.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-cyan-400">
                        <Download size={14} />
                        <span className="text-sm font-bold">{crosshair.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-400">
                        <Eye size={14} />
                        <span className="text-sm font-bold">{crosshair.views.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Stylish Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {crosshair.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-300 text-xs font-medium rounded-lg border border-gray-600/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Modern Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCopyCode(crosshair.code, crosshair.id)}
                        className={`flex-1 relative overflow-hidden flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                          copiedId === crosshair.id
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                            : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <Copy size={16} className={copiedId === crosshair.id ? 'animate-bounce' : ''} />
                        <span>{copiedId === crosshair.id ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                      
                      <button className="relative p-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-red-400 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-gray-600/30">
                        <Heart size={16} className="hover:animate-pulse" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCrosshairs.length === 0 && !loading && (
            <div className="text-center py-20 relative">
              {/* Enhanced Empty State */}
              <div className="relative max-w-md mx-auto">
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <Search size={40} className="text-purple-400 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    No Crosshairs Found
                  </span>
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Try adjusting your search criteria or browse all crosshairs to discover the perfect aim.
                </p>
                
                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
