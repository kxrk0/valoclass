'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrosshairBuilder from '@/components/crosshair/CrosshairBuilder'
import { useTranslation } from '@/contexts/LanguageContext'

// Metadata is handled by layout since this is a client component

export default function CrosshairBuilderPage() {
  const t = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    // Rotate active feature for dynamic effect
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { label: t.crosshairs.hero.features.accuracy, color: 'green', icon: '🎯' },
    { label: t.crosshairs.hero.features.presets, color: 'blue', icon: '👑' },
    { label: t.crosshairs.hero.features.community, color: 'purple', icon: '🌟' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}} />
        <div className="absolute inset-0 bg-[url('/patterns/crosshair-grid.svg')] opacity-5 animate-slow-spin" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <Header />
      <main className="pt-20">
        <div className="container py-8">
          {/* Enhanced Animated Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-red-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-medium mb-6 backdrop-blur-sm transition-all duration-1000 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              🎯 {t.crosshairs.hero.badge}
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping ml-2" />
            </div>
            
            <h1 className={`font-heading font-black text-5xl md:text-7xl mb-6 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <span className="text-white">Crosshair</span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                Builder
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              Create and customize your perfect Valorant crosshair with our advanced builder tool
            </p>
          </div>

          {/* Enhanced Main Builder */}
          <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="relative group">
              {/* Enhanced Decorative elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}} />
              <div className="absolute -top-12 -right-12 w-12 h-12 bg-gradient-to-br from-cyan-400/30 to-green-400/30 rounded-full blur-lg animate-bounce" style={{animationDelay: '2s'}} />
              <div className="absolute -bottom-12 -left-12 w-14 h-14 bg-gradient-to-br from-pink-400/25 to-purple-400/25 rounded-full blur-lg animate-bounce" style={{animationDelay: '3s'}} />
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-red-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <CrosshairBuilder />
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
          50% { transform: translateY(-10px); }
        }

        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
