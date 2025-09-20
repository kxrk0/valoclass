'use client'

import Link from 'next/link'
import { Target, Crosshair, Users, BarChart3, Map, Zap } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

const FeaturesSection = () => {
  const t = useTranslation()
  
  // Advanced CSS animations for futuristic effects
  if (typeof document !== 'undefined' && !document.getElementById('valo-futuristic-animations')) {
    const style = document.createElement('style')
    style.id = 'valo-futuristic-animations'
    style.textContent = `
      @keyframes futuristicSlideUp {
        from {
          opacity: 0;
          transform: translateY(50px) rotateX(10deg);
          filter: blur(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
          filter: blur(0px);
        }
      }
      
      @keyframes neonPulse {
        0%, 100% {
          box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 30px currentColor, 0 0 60px currentColor, 0 0 90px currentColor;
          transform: scale(1.05);
        }
      }
      
      @keyframes orbitalRotation {
        from {
          transform: rotate(0deg) translateX(20px) rotate(0deg);
        }
        to {
          transform: rotate(360deg) translateX(20px) rotate(-360deg);
        }
      }
      
      @keyframes particleFloat {
        0%, 100% {
          transform: translateY(0px) scale(1);
          opacity: 0.7;
        }
        33% {
          transform: translateY(-10px) scale(1.1);
          opacity: 1;
        }
        66% {
          transform: translateY(5px) scale(0.9);
          opacity: 0.8;
        }
      }
      
      @keyframes energyFlow {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      @keyframes holographicShimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
      
      .futuristic-card {
        perspective: 1000px;
        transform-style: preserve-3d;
      }
      
      .card-inner {
        transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
        transform-style: preserve-3d;
      }
      
      .futuristic-card:hover .card-inner {
        transform: rotateY(-5deg) rotateX(5deg) scale3d(1.02, 1.02, 1.02);
      }
      
      .holographic-border {
        background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #ff006e);
        background-size: 300% 300%;
        animation: holographicShimmer 3s ease-in-out infinite;
      }
      
      .energy-beam {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ff41, transparent);
        transform: translateY(-50%);
        animation: energyFlow 2s ease-in-out infinite;
      }
      
      @keyframes slideDown {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(100%);
        }
      }
    `
    document.head.appendChild(style)
  }
  const features = [
    {
      title: t.featuresSection.features.advancedLineups.title,
      description: t.featuresSection.features.advancedLineups.description,
      icon: Target,
      primary: '#ff0054',
      secondary: '#ff4081',
      accent: '#8b0000',
      href: '/lineups'
    },
    {
      title: t.featuresSection.features.customCrosshairs.title,
      description: t.featuresSection.features.customCrosshairs.description,
      icon: Crosshair,
      primary: '#f0db4f',
      secondary: '#ffed4e',
      accent: '#b8860b',
      href: '/crosshairs'
    },
    {
      title: t.featuresSection.features.playerStatistics.title,
      description: t.featuresSection.features.playerStatistics.description,
      icon: BarChart3,
      primary: '#00d4ff',
      secondary: '#4dd0e1',
      accent: '#1976d2',
      href: '/stats'
    },
    {
      title: t.featuresSection.features.communityHub.title,
      description: t.featuresSection.features.communityHub.description,
      icon: Users,
      primary: '#9d4edd',
      secondary: '#c77dff',
      accent: '#6a1b9a',
      href: '/community'
    },
    {
      title: t.featuresSection.features.completeMaps.title,
      description: t.featuresSection.features.completeMaps.description,
      icon: Map,
      primary: '#00f5a0',
      secondary: '#69f0ae',
      accent: '#2e7d32',
      href: '/maps'
    },
    {
      title: t.featuresSection.features.liveUpdates.title,
      description: t.featuresSection.features.liveUpdates.description,
      icon: Zap,
      primary: '#ff8c42',
      secondary: '#ffb74d',
      accent: '#f57c00',
      href: '/updates'
    }
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'slideDown 20s linear infinite'
        }} />
      </div>

      <div className="container relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="relative">
            <h2 className="font-heading font-bold text-5xl md:text-7xl mb-8 relative">
              <span className="relative z-10">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {t.featuresSection.title}
                  </span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-xl" />
                </span>
              </span>
            </h2>
            
            {/* Floating particles around title */}
            <div className="absolute -top-8 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse" 
                 style={{ animation: 'particleFloat 3s ease-in-out infinite' }} />
            <div className="absolute -top-4 right-1/3 w-1 h-1 bg-purple-500 rounded-full opacity-80" 
                 style={{ animation: 'particleFloat 2.5s ease-in-out infinite 0.5s' }} />
            <div className="absolute -bottom-4 left-1/3 w-1.5 h-1.5 bg-pink-500 rounded-full opacity-70" 
                 style={{ animation: 'particleFloat 2.8s ease-in-out infinite 1s' }} />
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed relative">
            <span className="relative z-10">
              {t.featuresSection.subtitle}
            </span>
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <Link 
                key={feature.title}
                href={feature.href}
                className="futuristic-card block group"
                style={{ 
                  animation: `futuristicSlideUp 0.8s ease-out ${index * 0.15}s both`
                }}
              >
                <div className="card-inner relative">
                  <div 
                    className="relative overflow-hidden"
                    style={{
                      background: `
                        radial-gradient(circle at 0% 0%, ${feature.primary}15 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, ${feature.secondary}10 0%, transparent 50%),
                        linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)
                      `,
                      border: `1px solid ${feature.primary}30`,
                      borderRadius: '24px',
                      padding: '2rem',
                      height: '100%',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.320, 1)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget
                      card.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      card.style.boxShadow = `
                        0 25px 50px rgba(0, 0, 0, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15)
                      `
                      card.style.background = `
                        linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)
                      `
                      card.style.backdropFilter = 'blur(25px) saturate(180%)'
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget
                      card.style.borderColor = `${feature.primary}30`
                      card.style.boxShadow = 'none'
                      card.style.background = `
                        radial-gradient(circle at 0% 0%, ${feature.primary}15 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, ${feature.secondary}10 0%, transparent 50%),
                        linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)
                      `
                      card.style.backdropFilter = 'blur(20px)'
                    }}
                  >


                    {/* Futuristic Icon Container */}
                    <div 
                      className="relative mb-8"
                      style={{
                        width: '100px',
                        height: '100px',
                        background: `
                          linear-gradient(135deg, ${feature.primary}20 0%, transparent 100%),
                          radial-gradient(circle at center, ${feature.primary}15 0%, transparent 70%)
                        `,
                        border: `2px solid ${feature.primary}50`,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Orbital rings */}
                      <div 
                        className="absolute inset-0 rounded-[20px] border opacity-30"
                        style={{
                          borderColor: feature.secondary,
                          animation: 'orbitalRotation 8s linear infinite'
                        }}
                      />
                      
                      <Icon 
                        size={48} 
                        style={{ 
                          color: feature.primary,
                          filter: `drop-shadow(0 0 15px ${feature.primary}60)`,
                          zIndex: 10,
                          position: 'relative'
                        }} 
                      />
                      
                      {/* Pulsing background */}
                      <div 
                        className="absolute inset-0 rounded-[20px] opacity-50"
                        style={{
                          background: `radial-gradient(circle, ${feature.primary}20 0%, transparent 70%)`,
                          animation: 'neonPulse 3s ease-in-out infinite'
                        }}
                      />
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="relative z-10">
                      <h3 
                        className="font-heading font-bold text-2xl mb-4 text-white"
                        style={{
                          textShadow: `0 0 20px ${feature.primary}60`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-300 leading-relaxed mb-6 text-base">
                        {feature.description}
                      </p>
                      
                      {/* Modern CTA Button */}
                      <div 
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${feature.primary}15 0%, transparent 100%)`,
                          border: `1px solid ${feature.primary}40`,
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'
                          e.currentTarget.style.transform = 'translateX(8px)'
                          e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${feature.primary}15 0%, transparent 100%)`
                          e.currentTarget.style.borderColor = `${feature.primary}40`
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                          e.currentTarget.style.transform = 'translateX(0px)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <span>{t.featuresSection.accessNow}</span>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Floating Particles */}
                    <div 
                      className="absolute top-6 right-6 w-3 h-3 rounded-full opacity-60"
                      style={{
                        background: feature.secondary,
                        boxShadow: `0 0 10px ${feature.secondary}`,
                        animation: 'particleFloat 4s ease-in-out infinite'
                      }}
                    />
                    <div 
                      className="absolute bottom-8 left-6 w-2 h-2 rounded-full opacity-40"
                      style={{
                        background: feature.accent,
                        boxShadow: `0 0 8px ${feature.accent}`,
                        animation: 'particleFloat 3.5s ease-in-out infinite 1s'
                      }}
                    />
                    <div 
                      className="absolute top-1/3 right-8 w-1 h-1 rounded-full opacity-80"
                      style={{
                        background: feature.primary,
                        boxShadow: `0 0 6px ${feature.primary}`,
                        animation: 'particleFloat 2.8s ease-in-out infinite 2s'
                      }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-24">
          <div 
            className="relative max-w-5xl mx-auto p-12 rounded-3xl overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)
              `,
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Animated background pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, #8b5cf6 2px, transparent 2px),
                  radial-gradient(circle at 75% 75%, #ec4899 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'slideDown 15s linear infinite'
              }}
            />
            
            <div className="relative z-10">
              <h3 className="font-heading font-bold text-4xl md:text-5xl mb-8">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {t.featuresSection.cta.title}
                </span>
              </h3>
              
              <p className="text-xl md:text-2xl mb-12 leading-relaxed text-slate-300 max-w-3xl mx-auto">
                {t.featuresSection.cta.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href="/auth/register" 
                  className="group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {t.featuresSection.cta.joinCommunity}
                </Link>
                
                <Link 
                  href="/lineups" 
                  className="group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                  style={{
                    background: 'transparent',
                    color: '#8b5cf6',
                    border: '2px solid #8b5cf6'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {t.featuresSection.cta.exploreLineups}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
