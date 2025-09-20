'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Target, 
  Crosshair, 
  TrendingUp, 
  Users, 
  Star, 
  Shield, 
  Award 
} from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import ValorantSearch from '@/components/hero/ValorantSearch'
import '@/styles/hero.scss'

// Önceden tanımlanmış particle konumları (hydration mismatch'i önlemek için)
const PARTICLE_POSITIONS = [
  { left: 15.4, top: 23.8, delay: 2.1 },
  { left: 78.2, top: 67.3, delay: 8.7 },
  { left: 45.6, top: 12.9, delay: 5.4 },
  { left: 89.1, top: 34.7, delay: 11.2 },
  { left: 23.8, top: 89.4, delay: 1.6 },
  { left: 67.3, top: 45.2, delay: 13.8 },
  { left: 12.9, top: 78.6, delay: 4.3 },
  { left: 34.7, top: 56.1, delay: 9.9 },
  { left: 56.1, top: 23.4, delay: 7.2 },
  { left: 91.8, top: 12.7, delay: 14.5 },
  { left: 8.3, top: 67.9, delay: 3.1 },
  { left: 42.7, top: 91.2, delay: 6.8 },
  { left: 73.4, top: 34.5, delay: 12.4 },
  { left: 25.9, top: 78.3, delay: 0.7 },
  { left: 58.6, top: 45.8, delay: 10.1 },
  { left: 84.2, top: 67.4, delay: 5.9 },
  { left: 16.7, top: 23.1, delay: 8.3 },
  { left: 49.3, top: 89.7, delay: 2.5 },
  { left: 71.8, top: 12.4, delay: 11.7 },
  { left: 37.5, top: 56.8, delay: 4.8 },
  { left: 62.1, top: 78.2, delay: 13.2 },
  { left: 29.4, top: 34.6, delay: 7.6 },
  { left: 85.7, top: 91.3, delay: 1.4 },
  { left: 14.2, top: 67.7, delay: 9.8 },
  { left: 46.8, top: 23.5, delay: 6.1 },
  { left: 79.3, top: 45.9, delay: 12.6 },
  { left: 21.6, top: 78.4, delay: 3.9 },
  { left: 54.1, top: 12.8, delay: 10.3 },
  { left: 87.4, top: 56.2, delay: 5.7 },
  { left: 32.9, top: 89.6, delay: 14.1 }
];

const Hero = () => {
  const t = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // İlk mount'u işaretle (hydration sonrası)
    setIsMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <section className="hero-section">
      {/* Advanced Particle System - Sabit konumlar ile */}
      <div className="hero-particles">
        {PARTICLE_POSITIONS.map((particle, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
          {/* Left Content */}
          <div className="lg:col-span-8 flex flex-col justify-center py-16 lg:py-0">

            {/* Enhanced Hero Title with Animation */}
            <div className={`hero-title ${isMounted ? `transition-all duration-1000 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }` : ''}`}>
              <span className="title-line primary">
                {t.hero.title.main}
              </span>
              <span className="title-line gradient">
                {t.hero.title.highlight}
              </span>
            </div>
              
            <p className={`hero-subtitle ${isMounted ? `transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }` : ''}`}>
              {t.hero.subtitle}
            </p>

            {/* Enhanced Action Buttons with Animation */}
            <div className={`hero-buttons ${isMounted ? `transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }` : ''}`}>
              <Link href="/lineups" className="btn-primary group">
                <Target size={20} className="group-hover:scale-110 transition-transform" />
                {t.hero.buttons.exploreLineups}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/crosshairs" className="btn-secondary group">
                <Crosshair size={20} className="group-hover:scale-110 transition-transform" />
                {t.hero.buttons.createCrosshair}
              </Link>
            </div>

            {/* Valorant Search Bar with Animation */}
            <div className={isMounted ? `transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }` : ''}>
              <ValorantSearch />
            </div>

          </div>

          {/* Right Column - Enhanced Feature Showcase with Staggered Animation */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative">
              {/* Floating Feature Cards with Staggered Animation */}
              <div className="grid grid-cols-1 gap-6">
                
                {/* Feature Card 1 - Pro Lineups */}
                <div className={`group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer ${isMounted && isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'} transition-all duration-1000 delay-1000`}
                     style={{ 
                       background: 'rgba(255, 70, 84, 0.1)',
                       border: '1px solid rgba(255, 70, 84, 0.2)',
                       boxShadow: '0 8px 32px rgba(255, 70, 84, 0.1)'
                     }}>
                  <div className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                       style={{ background: 'rgba(255, 70, 84, 0.2)' }}>
                    <Target size={24} style={{ color: '#ff4654' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-red-300 transition-colors" style={{ color: 'var(--text-main)' }}>
                    {t.features.proLineups.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {t.features.proLineups.description}
                  </p>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>

                {/* Feature Card 2 - Crosshair Editor */}
                <div className={`group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer ${isMounted && isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'} transition-all duration-1000 delay-1200`}
                     style={{ 
                       background: 'rgba(0, 212, 255, 0.1)',
                       border: '1px solid rgba(0, 212, 255, 0.2)',
                       boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1)'
                     }}>
                  <div className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                       style={{ background: 'rgba(0, 212, 255, 0.2)' }}>
                    <Crosshair size={24} style={{ color: '#00d4ff' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors" style={{ color: 'var(--text-main)' }}>
                    {t.features.crosshairEditor.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {t.features.crosshairEditor.description}
                  </p>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>

                {/* Feature Card 3 - Live Statistics */}
                <div className={`group relative p-6 rounded-2xl backdrop-blur-xl hover:scale-105 hover:-translate-y-2 cursor-pointer ${isMounted && isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'} transition-all duration-1000 delay-1400`}
                     style={{ 
                       background: 'rgba(168, 85, 247, 0.1)',
                       border: '1px solid rgba(168, 85, 247, 0.2)',
                       boxShadow: '0 8px 32px rgba(168, 85, 247, 0.1)'
                     }}>
                  <div className="inline-flex p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                       style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
                    <TrendingUp size={24} style={{ color: '#a855f7' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition-colors" style={{ color: 'var(--text-main)' }}>
                    {t.features.liveStats.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {t.features.liveStats.description}
                  </p>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Enhanced Floating Decorative Elements with Staggered Animation */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-red-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse ${isMounted && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all duration-1000 delay-1600`} />
              
              <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse ${isMounted && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all duration-1000 delay-1800`} style={{ animationDelay: '1s' }} />
              
              {/* Additional Floating Elements for Enhanced Appeal */}
              <div className={`absolute -top-4 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse ${isMounted && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all duration-1000 delay-2000`} style={{ animationDelay: '2s' }} />
              
              <div className={`absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-r from-pink-500/25 to-rose-500/20 rounded-full blur-lg animate-pulse ${isMounted && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all duration-1000 delay-2200`} style={{ animationDelay: '2.5s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero