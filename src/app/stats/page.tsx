'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PlayerSearch from '@/components/stats/PlayerSearch'
import FeaturedPlayers from '@/components/stats/FeaturedPlayers'
import { useTranslation } from '@/contexts/LanguageContext'

// Metadata is handled by layout since this is a client component

export default function StatsPage() {
  const t = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [activeStatBadge, setActiveStatBadge] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    // Rotate active stat badge for dynamic effect
    const interval = setInterval(() => {
      setActiveStatBadge(prev => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  const statBadges = [
    { label: t.stats.hero.features.liveData, color: 'green', icon: '📊' },
    { label: t.stats.hero.features.matchHistory, color: 'blue', icon: '🎮' },
    { label: t.stats.hero.features.rankTracking, color: 'purple', icon: '🏆' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Advanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        <div className="absolute inset-0 bg-[url('/patterns/stats-grid.svg')] opacity-5 animate-slow-spin" />
        
        {/* Enhanced Floating Stats Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            >
              <div className="w-2 h-2 bg-blue-400/20 rounded-full animate-float" />
            </div>
          ))}
        </div>
      </div>

      <Header />
      <main className="pt-20">
        <div className="container py-8">
          {/* Enhanced Animated Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm transition-all duration-1000 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              📊 {t.stats.hero.badge}
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping ml-2" />
            </div>
            
            <h1 className={`font-heading font-black text-5xl md:text-7xl mb-6 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <span className="text-white">{t.stats.hero.title.main}</span>{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                {t.stats.hero.title.highlight}
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              {t.stats.hero.subtitle}
            </p>

            {/* Enhanced Live Stats Banner with Rotation */}
            <div className={`flex justify-center items-center gap-8 flex-wrap mb-8 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              {statBadges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-500 cursor-pointer hover:scale-110 ${
                    activeStatBadge === index 
                      ? `bg-${badge.color}-500/20 border border-${badge.color}-500/40 shadow-lg shadow-${badge.color}-500/20 scale-105` 
                      : `bg-${badge.color}-500/10 border border-${badge.color}-500/20`
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-3 h-3 bg-${badge.color}-400 rounded-full ${
                    activeStatBadge === index ? 'animate-ping' : 'animate-pulse'
                  }`}></div>
                  <span className={`text-${badge.color}-400 font-semibold transition-all duration-300 ${
                    activeStatBadge === index ? 'text-white' : ''
                  }`}>{badge.label}</span>
                  <span className="text-lg">{badge.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Animated Player Search */}
          <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:bg-white/10 transition-all duration-300">
                {/* Enhanced decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/30 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}} />
                <div className="absolute -top-4 -right-4 w-6 h-6 bg-purple-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '2s'}} />
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-cyan-500/20 rounded-full blur-lg animate-pulse" />
                <div className="absolute -bottom-4 -right-4 w-7 h-7 bg-pink-500/30 rounded-full blur-md animate-pulse" style={{animationDelay: '1.5s'}} />
                
                <PlayerSearch />
              </div>
            </div>
          </div>

          {/* Enhanced Featured Players Section */}
          <div className={`mb-16 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                {t.stats.hero.featuredPlayers.badge}
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
                {t.stats.hero.featuredPlayers.title}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t.stats.hero.featuredPlayers.subtitle}
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-50" />
              <div className="relative">
                <FeaturedPlayers />
              </div>
            </div>
          </div>

          {/* Enhanced Animated Features Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            {[
              {
                icon: '✅',
                title: t.stats.hero.grid.realTime.title,
                description: t.stats.hero.grid.realTime.description,
                badge: t.stats.hero.grid.realTime.badge,
                color: 'blue',
                delay: '0ms'
              },
              {
                icon: '📊',
                title: t.stats.hero.grid.deepAnalytics.title,
                description: t.stats.hero.grid.deepAnalytics.description,
                badge: t.stats.hero.grid.deepAnalytics.badge,
                color: 'purple',
                delay: '200ms'
              },
              {
                icon: '👥',
                title: t.stats.hero.grid.social.title,
                description: t.stats.hero.grid.social.description,
                badge: t.stats.hero.grid.social.badge,
                color: 'green',
                delay: '400ms'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl text-center overflow-hidden backdrop-blur-sm border border-${feature.color}-500/20 hover:border-${feature.color}-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${feature.color}-500/20`}
                style={{
                  background: `linear-gradient(135deg, rgba(${feature.color === 'blue' ? '59, 130, 246' : feature.color === 'purple' ? '168, 85, 247' : '34, 197, 94'}, 0.1) 0%, rgba(${feature.color === 'blue' ? '59, 130, 246' : feature.color === 'purple' ? '168, 85, 247' : '34, 197, 94'}, 0.05) 100%)`,
                  animationDelay: feature.delay
                }}
              >
                {/* Animated background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${feature.color}-400/20 to-transparent animate-shimmer`} />
                </div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className={`font-heading font-bold text-xl mb-4 text-${feature.color}-400 group-hover:text-white transition-colors duration-300`}>{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className={`mt-6 px-4 py-2 bg-${feature.color}-500/20 group-hover:bg-${feature.color}-500/30 rounded-full inline-block transition-all duration-300 group-hover:scale-105`}>
                    <span className={`text-${feature.color}-400 group-hover:text-${feature.color}-300 text-sm font-semibold`}>{feature.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Performance Tips Section */}
          <div className={`mt-20 py-16 px-8 rounded-3xl relative overflow-hidden transition-all duration-1000 delay-1400 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <div className="absolute inset-0 bg-[url('/patterns/analytics.svg')] opacity-5 animate-slow-spin" />
            
            {/* Enhanced background effects */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-cyan-500/15 rounded-full blur-md animate-bounce" style={{animationDelay: '2s'}} />
            
            <div className="relative text-center max-w-4xl mx-auto">
              <h3 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6 group-hover:text-blue-300 transition-colors duration-300">
                {t.stats.hero.improveTips.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  { icon: '🎯', title: t.stats.hero.improveTips.analyze.title, description: t.stats.hero.improveTips.analyze.description, delay: '0ms' },
                  { icon: '📊', title: t.stats.hero.improveTips.track.title, description: t.stats.hero.improveTips.track.description, delay: '100ms' },
                  { icon: '🏆', title: t.stats.hero.improveTips.learn.title, description: t.stats.hero.improveTips.learn.description, delay: '200ms' }
                ].map((tip, index) => (
                  <div 
                    key={index}
                    className="group/tip p-6 bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ animationDelay: tip.delay }}
                  >
                    <div className="text-4xl mb-4 group-hover/tip:scale-110 group-hover/tip:rotate-12 transition-transform duration-300">{tip.icon}</div>
                    <h4 className="font-semibold text-lg text-white mb-2 group-hover/tip:text-blue-300 transition-colors duration-300">{tip.title}</h4>
                    <p className="text-gray-400 text-sm group-hover/tip:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes data-flow {
          0% { 
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translateY(-15px) scale(1.1);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-stats {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 currentColor;
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 10px transparent;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-slow-spin {
          animation: slow-spin 30s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }

        .animate-data-flow {
          animation: data-flow 3s ease-in-out infinite;
        }

        .animate-pulse-stats {
          animation: pulse-stats 2s ease-in-out infinite;
        }

        /* Enhanced hover effects for stats */
        .group:hover .animate-shimmer {
          animation-duration: 1s;
        }

        .group/tip:hover {
          transform: translateY(-5px) scale(1.05);
        }

        /* Staggered animation delays */
        .delay-0 { animation-delay: 0ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1200 { animation-delay: 1200ms; }
        .delay-1400 { animation-delay: 1400ms; }
      `}</style>
    </div>
  )
}
