'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Target, 
  Crosshair, 
  TrendingUp, 
  Search,
  Newspaper,
  Calendar,
  Clock
} from 'lucide-react'
import '@/styles/hero.scss'
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

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [updates, setUpdates] = useState<ValorantUpdate[]>([])
  const [updatesLoading, setUpdatesLoading] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`/api/valorant-updates?lang=${language}`)
        const data = await response.json()
        
        if (data.success) {
          // Get only the first 3 updates for the banner
          setUpdates(data.updates.slice(0, 3))
        }
      } catch (error) {
        console.error('Failed to fetch updates:', error)
      } finally {
        setUpdatesLoading(false)
      }
    }

    fetchUpdates()
  }, [language])

  const handleRiotLogin = async () => {
    try {
      window.location.href = '/api/auth/oauth/riot'
    } catch {
      // Handle error silently for production
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-particles">
        <div className="particle" style={{ left: '15.4%', top: '23.8%', animationDelay: '2.1s' }}></div>
        <div className="particle" style={{ left: '78.2%', top: '67.3%', animationDelay: '8.7s' }}></div>
        <div className="particle" style={{ left: '45.6%', top: '12.9%', animationDelay: '5.4s' }}></div>
        <div className="particle" style={{ left: '89.1%', top: '34.7%', animationDelay: '11.2s' }}></div>
        <div className="particle" style={{ left: '23.8%', top: '89.4%', animationDelay: '1.6s' }}></div>
        <div className="particle" style={{ left: '67.3%', top: '45.2%', animationDelay: '13.8s' }}></div>
        <div className="particle" style={{ left: '12.9%', top: '78.6%', animationDelay: '4.3s' }}></div>
        <div className="particle" style={{ left: '34.7%', top: '56.1%', animationDelay: '9.9s' }}></div>
        <div className="particle" style={{ left: '56.1%', top: '23.4%', animationDelay: '7.2s' }}></div>
        <div className="particle" style={{ left: '91.8%', top: '12.7%', animationDelay: '14.5s' }}></div>
        <div className="particle" style={{ left: '8.3%', top: '67.9%', animationDelay: '3.1s' }}></div>
        <div className="particle" style={{ left: '42.7%', top: '91.2%', animationDelay: '6.8s' }}></div>
        <div className="particle" style={{ left: '73.4%', top: '34.5%', animationDelay: '12.4s' }}></div>
        <div className="particle" style={{ left: '25.9%', top: '78.3%', animationDelay: '0.7s' }}></div>
        <div className="particle" style={{ left: '58.6%', top: '45.8%', animationDelay: '10.1s' }}></div>
        <div className="particle" style={{ left: '84.2%', top: '67.4%', animationDelay: '5.9s' }}></div>
        <div className="particle" style={{ left: '16.7%', top: '23.1%', animationDelay: '8.3s' }}></div>
        <div className="particle" style={{ left: '49.3%', top: '89.7%', animationDelay: '2.5s' }}></div>
        <div className="particle" style={{ left: '71.8%', top: '12.4%', animationDelay: '11.7s' }}></div>
        <div className="particle" style={{ left: '37.5%', top: '56.8%', animationDelay: '4.8s' }}></div>
        <div className="particle" style={{ left: '62.1%', top: '78.2%', animationDelay: '13.2s' }}></div>
        <div className="particle" style={{ left: '29.4%', top: '34.6%', animationDelay: '7.6s' }}></div>
        <div className="particle" style={{ left: '85.7%', top: '91.3%', animationDelay: '1.4s' }}></div>
        <div className="particle" style={{ left: '14.2%', top: '67.7%', animationDelay: '9.8s' }}></div>
        <div className="particle" style={{ left: '46.8%', top: '23.5%', animationDelay: '6.1s' }}></div>
        <div className="particle" style={{ left: '79.3%', top: '45.9%', animationDelay: '12.6s' }}></div>
        <div className="particle" style={{ left: '21.6%', top: '78.4%', animationDelay: '3.9s' }}></div>
        <div className="particle" style={{ left: '54.1%', top: '12.8%', animationDelay: '10.3s' }}></div>
        <div className="particle" style={{ left: '87.4%', top: '56.2%', animationDelay: '5.7s' }}></div>
        <div className="particle" style={{ left: '32.9%', top: '89.6%', animationDelay: '14.1s' }}></div>
      </div>

      <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
          <div className="lg:col-span-8 flex flex-col justify-center py-16 lg:py-0">
            <div className={`hero-title transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <span className="title-line primary">Master</span>
              <span className="title-line gradient">Valorant</span>
            </div>

            <p className={`hero-subtitle transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              The ultimate platform for professional lineups, customizable crosshairs and detailed statistics. Elevate your gameplay to the next level.
            </p>

            <div className={`hero-buttons transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <Link className="btn-primary group" href="/lineups">
                <Target size={20} className="group-hover:scale-110 transition-transform" />
                Explore Lineups
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link className="btn-secondary group" href="/crosshairs">
                <Crosshair size={20} className="group-hover:scale-110 transition-transform" />
                Create Crosshair
              </Link>
            </div>

            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
              <div className="valorant-search">
                <div className="search-container">
                  <div className="relative">
                    <input
                      placeholder="Find an Agent or Guide, ie. player#NA1, or Sage"
                      className="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="search-icon">
                      <Search size={20} />
                    </div>
                  </div>
                  <button className="riot-id-button w-full mt-4" onClick={handleRiotLogin}>
                    <svg className="riot-icon" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <polygon points="80.11463165283203,8.324189960956573 0,45.35578089952469 19.96091079711914,121.31561595201492 35.225154876708984,119.41886454820633 30.980073928833008,71.72943431138992 36.03803253173828,69.47140055894852 44.61853790283203,118.24470835924149 70.54061126708984,115.08348399400711 65.93424224853516,62.42641764879227 70.81159210205078,60.25872737169266 80.29529571533203,113.90928965806961 106.57864379882812,110.6577256321907 101.52070617675781,52.942733108997345 106.48834228515625,50.775035202503204 116.87525177001953,109.39323741197586 142.79733276367188,106.23201304674149 142.79733276367188,24.040038406848907" />
                        <polygon points="82.01138305664062,123.3929780125618 83.27587127685547,130.8895142674446 142.79733276367188,140.8247407078743 142.79733276367188,115.98668986558914 82.10169982910156,123.3929780125618" />
                      </g>
                    </svg>
                    <span className="button-text">
                      Sign in<span className="collapsed"> with Riot ID</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative">
               <div className="grid grid-cols-1 gap-6">
                 <Link href="/lineups" className="block">
                   <div
                     className={`group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer transition-all duration-500 delay-1000 ${
                       isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                     }`}
                     style={{
                       background: 'rgba(255, 70, 84, 0.15)',
                       border: '1px solid rgba(255, 70, 84, 0.4)',
                       boxShadow: 'rgba(255, 70, 84, 0.2) 0px 8px 32px, inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}
                   >
                     <div
                       className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                       style={{ background: 'rgba(255, 70, 84, 0.3)' }}
                     >
                       <Target size={24} style={{ color: 'rgb(255, 70, 84)' }} />
                     </div>
                     <h3
                       className="text-lg font-semibold mb-2 group-hover:text-red-300 transition-colors text-white"
                     >
                       Pro Lineups
                     </h3>
                     <p className="text-sm leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors">
                       Learn and apply smoke, flash and molotov lineups from professional players.
                     </p>
                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                     
                     {/* Click indicator */}
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <ArrowRight size={16} className="text-red-400" />
                     </div>
                   </div>
                 </Link>

                 <Link href="/crosshairs/builder" className="block">
                   <div
                     className={`group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer transition-all duration-500 delay-1200 ${
                       isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                     }`}
                     style={{
                       background: 'rgba(0, 212, 255, 0.15)',
                       border: '1px solid rgba(0, 212, 255, 0.4)',
                       boxShadow: 'rgba(0, 212, 255, 0.2) 0px 8px 32px, inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}
                   >
                     <div
                       className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                       style={{ background: 'rgba(0, 212, 255, 0.3)' }}
                     >
                       <Crosshair size={24} style={{ color: 'rgb(0, 212, 255)' }} />
                     </div>
                     <h3
                       className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors text-white"
                     >
                       Crosshair Editor
                     </h3>
                     <p className="text-sm leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors">
                       Create the perfect crosshair with advanced customization tools.
                     </p>
                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                     
                     {/* Click indicator */}
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <ArrowRight size={16} className="text-cyan-400" />
                     </div>
                   </div>
                 </Link>

                 <Link href="/stats" className="block">
                   <div
                     className={`group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer transition-all duration-500 delay-1400 ${
                       isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                     }`}
                     style={{
                       background: 'rgba(168, 85, 247, 0.15)',
                       border: '1px solid rgba(168, 85, 247, 0.4)',
                       boxShadow: 'rgba(168, 85, 247, 0.2) 0px 8px 32px, inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}
                   >
                     <div
                       className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                       style={{ background: 'rgba(168, 85, 247, 0.3)' }}
                     >
                       <TrendingUp size={24} style={{ color: 'rgb(168, 85, 247)' }} />
                     </div>
                     <h3
                       className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors text-white"
                     >
                       Live Statistics
                     </h3>
                     <p className="text-sm leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors">
                       Track your progress and compare with other players.
                     </p>
                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                     
                     {/* Click indicator */}
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <ArrowRight size={16} className="text-purple-400" />
                     </div>
                   </div>
                 </Link>
               </div>

              <div
                className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-red-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse transition-all duration-1000 delay-1600 pointer-events-none z-0 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              ></div>
              <div
                className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse transition-all duration-1000 delay-1800 pointer-events-none z-0 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
                style={{ animationDelay: '1s' }}
              ></div>
              <div
                className={`absolute -top-4 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse transition-all duration-1000 delay-2000 pointer-events-none z-0 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
                style={{ animationDelay: '2s' }}
              ></div>
              <div
                className={`absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-r from-pink-500/25 to-rose-500/20 rounded-full blur-lg animate-pulse transition-all duration-1000 delay-2200 pointer-events-none z-0 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
                style={{ animationDelay: '2.5s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Updates Banner - Modern & Animated */}
      <div className="w-full relative overflow-hidden backdrop-blur-xl z-30">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-slate-800/90 to-purple-900/95 animate-gradient-x"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-2 h-2 bg-red-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-20 right-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-16 left-1/3 w-3 h-3 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-32 right-1/4 w-2 h-2 bg-yellow-400/25 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
            `
          }}></div>
        </div>

        {/* Glass Border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 py-8 relative z-40">
          {updatesLoading ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl animate-pulse backdrop-blur-sm"></div>
                <div className="space-y-2">
                  <div className="w-40 h-6 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg animate-pulse"></div>
                  <div className="w-32 h-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="hidden md:flex space-x-6 flex-1 justify-center max-w-4xl">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex-1">
                    <div className="w-16 h-12 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="w-full h-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded animate-pulse"></div>
                      <div className="w-3/4 h-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-32 h-12 bg-gradient-to-r from-red-500/50 to-red-600/50 rounded-xl animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
               {/* Left: Enhanced Updates Title */}
               <div className="flex items-center space-x-6 group min-w-0 flex-shrink-0 -ml-20">
                 <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-purple-500/30 rounded-2xl blur-xl animate-pulse"></div>
                   <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
                     <Newspaper className="w-8 h-8 text-red-400 animate-pulse" />
                   </div>
                 </div>
                 <div className="space-y-1 min-w-0 -ml-6">
                   <h2 className="text-white font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                     Latest Updates
                   </h2>
                   <p className="text-gray-400 text-sm flex items-center gap-3 whitespace-nowrap">
                     <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                     Stay updated with VALORANT
                   </p>
                 </div>
               </div>

              {/* Center: Enhanced Updates Cards */}
              <div className="hidden md:flex items-center space-x-6 flex-1 justify-center max-w-4xl -ml-4">
                {updates.map((update, index) => (
                  <Link
                    key={update.id}
                    href={`/updates/${update.id}`}
                    className="group relative flex items-center space-x-4 bg-black/30 hover:bg-black/40 border border-white/10 hover:border-red-500/40 rounded-2xl px-5 py-4 transition-all duration-500 hover:scale-105 hover:-translate-y-2 min-w-0 flex-1 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={(e) => {
                      console.log('🎯 Update card clicked:', update.id, update.title)
                    }}
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"></div>
                    </div>

                    {/* Update Image */}
                    <div className="relative flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 group-hover:border-red-500/30 transition-all duration-300">
                      {update.imageUrl && (
                        <img
                          src={update.imageUrl}
                          alt={update.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Update Info */}
                    <div className="min-w-0 flex-1 relative">
                      <h3 className="text-white text-sm font-semibold truncate group-hover:text-red-300 transition-colors duration-300 mb-1">
                        {update.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-500 group-hover:text-red-400 transition-colors duration-300" />
                          <span className="text-gray-500 text-xs group-hover:text-gray-300 transition-colors duration-300">
                            {new Date(update.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {update.isNew && (
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-red-400" />
                    </div>
                  </Link>
                ))}
              </div>

               {/* Right: Enhanced View All Button */}
               <div className="relative group ml-16 flex-shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                 <Link
                   href="/updates"
                   className="relative flex items-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-red-500/25 whitespace-nowrap cursor-pointer border border-red-400/30 backdrop-blur-sm"
                   onClick={(e) => {
                     console.log('🎯 View All Updates clicked')
                   }}
                 >
                   <span className="text-sm font-bold relative">
                     View All Updates
                     <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300"></span>
                   </span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                   
                   {/* Button glow */}
                   <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </Link>
               </div>
            </div>
          )}

          {/* Enhanced Mobile Updates */}
          {!updatesLoading && (
            <div className="md:hidden mt-6">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {updates.map((update, index) => (
                  <Link
                    key={update.id}
                    href={`/updates/${update.id}`}
                    className="group relative flex-shrink-0 w-72 bg-black/30 hover:bg-black/40 border border-white/10 hover:border-red-500/40 rounded-2xl p-4 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={(e) => {
                      console.log('🎯 Mobile update card clicked:', update.id, update.title)
                    }}
                  >
                    {/* Mobile card background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="flex items-center space-x-4 relative">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex-shrink-0">
                        {update.imageUrl && (
                          <img
                            src={update.imageUrl}
                            alt={update.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white text-sm font-semibold truncate group-hover:text-red-300 transition-colors duration-300 mb-1">
                          {update.title}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-500 group-hover:text-red-400 transition-colors duration-300" />
                            <span className="text-gray-500 text-xs group-hover:text-gray-300 transition-colors duration-300">
                              {new Date(update.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          {update.isNew && (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
