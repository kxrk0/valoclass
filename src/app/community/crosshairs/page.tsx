'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useTranslation } from '@/contexts/LanguageContext'
import { Search, Filter, Heart, Eye, Download, Users, Star, TrendingUp, Clock, Zap, Target, ArrowRight } from 'lucide-react'

// Önceden tanımlanmış particle pozisyonları (hydration mismatch'i önlemek için)
const COMMUNITY_PARTICLES = [
  { left: 12.4, top: 18.7, delay: 1.2, color: 'purple', duration: 4.2 },
  { left: 87.1, top: 23.4, delay: 2.8, color: 'red', duration: 3.8 },
  { left: 34.8, top: 67.2, delay: 0.5, color: 'blue', duration: 5.1 },
  { left: 76.3, top: 41.9, delay: 3.4, color: 'purple', duration: 4.7 },
  { left: 23.7, top: 85.6, delay: 1.9, color: 'red', duration: 3.5 },
  { left: 65.2, top: 12.3, delay: 2.6, color: 'blue', duration: 4.9 },
  { left: 8.9, top: 54.1, delay: 0.8, color: 'purple', duration: 4.4 },
  { left: 91.6, top: 78.8, delay: 3.1, color: 'red', duration: 3.9 },
  { left: 45.3, top: 29.7, delay: 1.5, color: 'blue', duration: 4.6 },
  { left: 58.7, top: 93.2, delay: 2.3, color: 'purple', duration: 3.7 },
  { left: 29.1, top: 7.4, delay: 0.9, color: 'red', duration: 5.2 },
  { left: 82.4, top: 62.8, delay: 3.7, color: 'blue', duration: 4.1 },
  { left: 15.8, top: 37.5, delay: 1.7, color: 'purple', duration: 4.8 },
  { left: 73.9, top: 81.3, delay: 2.4, color: 'red', duration: 3.6 },
  { left: 41.2, top: 16.9, delay: 0.6, color: 'blue', duration: 4.3 },
  { left: 67.5, top: 52.6, delay: 3.2, color: 'purple', duration: 3.8 },
  { left: 19.3, top: 74.1, delay: 1.4, color: 'red', duration: 4.7 },
  { left: 86.7, top: 35.8, delay: 2.9, color: 'blue', duration: 4.5 },
  { left: 52.8, top: 89.4, delay: 0.7, color: 'purple', duration: 3.9 },
  { left: 38.4, top: 43.7, delay: 3.5, color: 'red', duration: 4.2 },
  { left: 74.6, top: 27.2, delay: 1.8, color: 'blue', duration: 4.8 },
  { left: 26.9, top: 65.9, delay: 2.7, color: 'purple', duration: 3.7 },
  { left: 63.1, top: 11.6, delay: 1.1, color: 'red', duration: 4.6 },
  { left: 89.5, top: 58.3, delay: 3.8, color: 'blue', duration: 4.1 },
  { left: 7.2, top: 82.7, delay: 2.1, color: 'purple', duration: 4.9 }
];

// Mock real-time data
const MOCK_STATS = {
  totalCrosshairs: 15247,
  activePlayers: 2834,
  todayUploads: 156,
  trending: '+18%'
};

// Mock crosshair data
const MOCK_CROSSHAIRS = [
  {
    id: 1,
    name: "TenZ Pro Setup",
    author: "TenZ_Official",
    code: "0;P;c;5;o;1;d;1;z;3;f;0;s;0;0l;4;0o;2;0a;1;0f;0;1b;0",
    likes: 12543,
    downloads: 45612,
    views: 128456,
    category: "Pro Player",
    agent: "Jett",
    preview: "/crosshairs/tenz.png",
    verified: true
  },
  {
    id: 2,
    name: "Phantom Precision",
    author: "AimGod",
    code: "0;s;1;P;c;1;h;0;m;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0",
    likes: 8934,
    downloads: 23781,
    views: 67432,
    category: "Rifle",
    agent: "All",
    preview: "/crosshairs/phantom.png",
    verified: false
  },
  {
    id: 3,
    name: "Dot Perfect",
    author: "MinimalAim",
    code: "0;P;c;5;o;1;d;1;z;1;f;0;s;0;0l;1;0o;1;0a;1;0f;0;1b;0",
    likes: 15647,
    downloads: 89234,
    views: 234567,
    category: "Minimalist",
    agent: "All",
    preview: "/crosshairs/dot.png",
    verified: true
  },
  {
    id: 4,
    name: "Valorant Default+",
    author: "CommunityFav",
    code: "0;s;1;P;c;1;h;0;m;1;0t;4;0l;2;0o;2;0a;1;0f;0;1b;0",
    likes: 6789,
    downloads: 19876,
    views: 45321,
    category: "Classic",
    agent: "All",
    preview: "/crosshairs/default.png",
    verified: false
  }
];

export default function CommunityCrosshairsPage() {
  const t = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState(MOCK_STATS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [crosshairs, setCrosshairs] = useState(MOCK_CROSSHAIRS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    
    // Simulate loading crosshairs
    setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    // Real-time stats simulation
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activePlayers: Math.max(2500, prev.activePlayers + Math.floor(Math.random() * 20 - 10)),
        todayUploads: prev.todayUploads + (Math.random() > 0.8 ? 1 : 0)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate search
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [searchQuery])

  const filters = [
    { id: 'all', name: 'Tümü', icon: Filter, count: 15247 },
    { id: 'popular', name: 'Popüler', icon: TrendingUp, count: 2834 },
    { id: 'recent', name: 'Yeni', icon: Clock, count: 456 },
    { id: 'pro', name: 'Pro', icon: Star, count: 89 },
    { id: 'favorites', name: 'Favoriler', icon: Heart, count: 189 }
  ]

  const handleLike = (id: number) => {
    setCrosshairs(prev => prev.map(ch => 
      ch.id === id ? { ...ch, likes: ch.likes + 1 } : ch
    ))
  }

  const handleDownload = (crosshair: typeof MOCK_CROSSHAIRS[0]) => {
    setCrosshairs(prev => prev.map(ch => 
      ch.id === crosshair.id ? { ...ch, downloads: ch.downloads + 1 } : ch
    ))
    // Copy to clipboard
    navigator.clipboard.writeText(crosshair.code)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-red-500/12 to-orange-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 25s linear infinite'
        }} />
        
        {/* Sabit Community Particles */}
        <div className="absolute inset-0">
          {COMMUNITY_PARTICLES.map((particle, i) => (
            <div
              key={i}
              className="absolute"
    style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            >
              <div className={`w-1 h-1 rounded-full animate-float ${
                particle.color === 'purple' ? 'bg-purple-400/30' : 
                particle.color === 'red' ? 'bg-red-400/25' : 'bg-blue-400/20'
              }`} />
        </div>
          ))}
        </div>
      </div>
      
      <Header />
      <main className="pt-20">
        <div className="container py-8">
          {/* Modern Hero Section */}
          <section className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            {/* Status Badge with Real-time Data */}
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-blue-500/20 border border-purple-400/30 rounded-full text-white text-sm font-medium mb-8 backdrop-blur-xl shadow-2xl">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="font-semibold">🔥 {stats.activePlayers.toLocaleString()}</span>
              <span className="text-gray-300">aktif oyuncu • </span>
              <span className="font-semibold text-green-400">{stats.trending}</span>
              <span className="text-gray-300">trend</span>
              <div className="w-px h-4 bg-white/20" />
              <Users className="w-4 h-4 text-purple-400" />
              <span className="font-semibold">{stats.totalCrosshairs.toLocaleString()}</span>
              <span className="text-gray-300">crosshair</span>
            </div>
            
            <h1 className="font-heading font-black text-5xl md:text-8xl mb-8 leading-tight">
              <span className="text-white">Community</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                Crosshairs
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto mb-12 leading-relaxed">
              Valorant topluluğunun en iyi crosshair&apos;leri. Profesyonel oyunculardan ilham alın, 
              kendi yaratımlarınızı paylaşın ve mükemmel nişanı bulun.
            </p>

            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <TrendingUp className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white mb-2">{stats.totalCrosshairs.toLocaleString()}</div>
                <div className="text-sm text-gray-400 font-medium">Toplam Crosshair</div>
            </div>
              
              <div className="group relative bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-xl border border-pink-400/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <Zap className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white mb-2">{stats.activePlayers.toLocaleString()}</div>
                <div className="text-sm text-gray-400 font-medium">Aktif Oyuncu</div>
            </div>
              
              <div className="group relative bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <Clock className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white mb-2">{stats.todayUploads}</div>
                <div className="text-sm text-gray-400 font-medium">Bugün Yüklenen</div>
          </div>
        </div>
          </section>

          {/* Advanced Search and Filter Section */}
          <section className={`mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-4 px-6">
                      <Search className="w-6 h-6 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Crosshair ara... (örn: 'TenZ', 'dot', 'pro')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none"
                      />
            </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                    >
                      <Search className="w-5 h-5" />
                      Ara
                    </button>
            </div>
          </div>
              </form>
        </div>
        
            {/* Filter Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                {filters.map((filter) => {
                  const Icon = filter.icon
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeFilter === filter.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{filter.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeFilter === filter.id ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        {filter.count.toLocaleString()}
                      </span>
                    </button>
                  )
                })}
            </div>
          </div>
          </section>

          {/* Main Content Grid */}
          <section className={`transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            {loading ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Crosshair&apos;ler Yükleniyor...</h3>
                    <p className="text-gray-400 mb-4">En popüler topluluk crosshair&apos;leri getiriliyor</p>
                    <div className="w-64 bg-white/10 rounded-full h-2 mx-auto overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {crosshairs.map((crosshair, index) => (
                  <div
                    key={crosshair.id}
                    className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-500 hover:bg-white/10 ${
                      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Verified Badge */}
                    {crosshair.verified && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Doğrulanmış
            </div>
          )}
          
                    {/* Preview Area */}
                    <div className="bg-black/50 rounded-xl p-8 mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-center h-16">
                        <div className="w-8 h-8 relative">
                          {/* Crosshair Preview - Basic representation */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-6 bg-white rounded-full"></div>
                            <div className="w-6 h-1 bg-white rounded-full absolute"></div>
                            <div className="w-2 h-2 bg-white rounded-full absolute border-2 border-black"></div>
            </div>
            </div>
        </div>
      </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors">
                          {crosshair.name}
                        </h3>
                        <p className="text-sm text-gray-400">by {crosshair.author}</p>
      </div>

      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {crosshair.likes.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {crosshair.downloads.toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {crosshair.views.toLocaleString()}
        </div>
      </div>

                      {/* Tags */}
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                          {crosshair.category}
                        </span>
                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                          {crosshair.agent}
                        </span>
                      </div>

      {/* Actions */}
                      <div className="flex gap-2 pt-2">
        <button
                          onClick={() => handleLike(crosshair.id)}
                          className="flex-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/40 hover:to-purple-600/40 text-purple-400 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Heart className="w-4 h-4" />
                          Beğen
        </button>
        <button
                          onClick={() => handleDownload(crosshair)}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          İndir
        </button>
      </div>
    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(60px) translateY(60px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.3);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
