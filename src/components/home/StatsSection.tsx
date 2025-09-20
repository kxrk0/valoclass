'use client'

import { Trophy, TrendingUp, Users, Target } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

const StatsSection = () => {
  const t = useTranslation()
  
  // Add CSS animations
  if (typeof document !== 'undefined' && !document.getElementById('stats-animations')) {
    const style = document.createElement('style')
    style.id = 'stats-animations'
    style.textContent = `
      @keyframes statsFadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes statsCountUp {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes statsIconFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      
      @keyframes statsParticleFloat {
        0%, 100% {
          transform: translateY(0px) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-8px) scale(1.1);
          opacity: 1;
        }
      }
      
      .stats-card {
        animation: statsFadeInUp 0.8s ease-out both;
      }
      
      .stats-number {
        animation: statsCountUp 1s ease-out both;
      }
      
      .stats-icon {
        animation: statsIconFloat 3s ease-in-out infinite;
      }
      
      .stats-particle {
        animation: statsParticleFloat 4s ease-in-out infinite;
      }
      
      .stats-card:hover .stats-icon {
        animation-play-state: paused;
        transform: translateY(-8px) scale(1.1);
      }
      
      .stats-card:hover .stats-particle {
        animation-duration: 2s;
      }
      
      @keyframes statsGlow {
        0%, 100% {
          box-shadow: 0 0 20px currentColor;
        }
        50% {
          box-shadow: 0 0 40px currentColor;
        }
      }
    `
    document.head.appendChild(style)
  }

  const stats = [
    {
      icon: Users,
      value: '10,247',
      label: t.statsSection.stats.activeUsers,
      color: 'text-blue-400'
    },
    {
      icon: Target,
      value: '1,843',
      label: t.statsSection.stats.lineupsCreated,
      color: 'text-red-400'
    },
    {
      icon: TrendingUp,
      value: '5,692',
      label: t.statsSection.stats.crosshairsShared,
      color: 'text-yellow-400'
    },
    {
      icon: Trophy,
      value: '2,156',
      label: t.statsSection.stats.rankImprovements,
      color: 'text-green-400'
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="container">
        <div className="text-center mb-16">
          <h2 
            className="font-heading font-bold text-4xl md:text-6xl mb-6"
            style={{
              animation: 'statsFadeInUp 1s ease-out both',
              animationDelay: '0.2s'
            }}
          >
            <span className="gradient-text">{t.statsSection.title}</span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
            style={{
              animation: 'statsFadeInUp 1s ease-out both',
              animationDelay: '0.4s'
            }}
          >
            {t.statsSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colors = [
              { primary: '#ff0054', secondary: '#ff4081', accent: '#8b0000' },
              { primary: '#f0db4f', secondary: '#ffed4e', accent: '#b8860b' },
              { primary: '#00d4ff', secondary: '#4dd0e1', accent: '#1976d2' },
              { primary: '#00f5a0', secondary: '#69f0ae', accent: '#2e7d32' }
            ]
            const colorTheme = colors[index % colors.length]
            
            return (
              <div 
                key={stat.label}
                className="stats-card group"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'both'
                }}
              >
                <div 
                  className="relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:rotate-1"
                  style={{
                    background: `
                      radial-gradient(circle at 20% 20%, ${colorTheme.primary}15 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, ${colorTheme.secondary}10 0%, transparent 50%),
                      linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)
                    `,
                    border: `1px solid ${colorTheme.primary}30`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${colorTheme.primary}20`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${colorTheme.primary}60`
                    e.currentTarget.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${colorTheme.primary}40`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colorTheme.primary}30`
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${colorTheme.primary}20`
                  }}
                >
                  {/* Enhanced Icon Container */}
                  <div 
                    className="stats-icon w-16 h-16 mb-6 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(135deg, ${colorTheme.primary}20 0%, transparent 100%),
                        radial-gradient(circle at center, ${colorTheme.primary}15 0%, transparent 70%)
                      `,
                      border: `2px solid ${colorTheme.primary}40`,
                      animationDelay: `${index * 0.2 + 0.3}s`
                    }}
                  >
                    <Icon 
                      size={32} 
                      style={{ 
                        color: colorTheme.primary,
                        filter: `drop-shadow(0 0 10px ${colorTheme.primary}60)`
                      }} 
                    />
                    
                    {/* Enhanced glow effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                      style={{
                        background: `radial-gradient(circle, ${colorTheme.primary}20 0%, transparent 70%)`
                      }}
                    />
                  </div>
                  
                  {/* Animated Stats Value */}
                  <div 
                    className="stats-number text-4xl lg:text-5xl font-bold mb-3 text-center transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      color: colorTheme.primary,
                      textShadow: `0 0 15px ${colorTheme.primary}40`,
                      animationDelay: `${index * 0.2 + 0.5}s`
                    }}
                  >
                    {stat.value}
                  </div>
                  
                  {/* Stats Label */}
                  <div 
                    className="text-xs uppercase tracking-wider font-semibold text-center transition-colors duration-300"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      animationDelay: `${index * 0.2 + 0.7}s`
                    }}
                  >
                    {stat.label}
                  </div>
                  
                  {/* Enhanced Decorative Elements */}
                  <div 
                    className="stats-particle absolute top-4 right-4 w-3 h-3 rounded-full"
                    style={{
                      background: colorTheme.secondary,
                      boxShadow: `0 0 8px ${colorTheme.secondary}`,
                      animationDelay: `${index * 0.3}s`
                    }}
                  />
                  <div 
                    className="stats-particle absolute bottom-4 left-4 w-2 h-2 rounded-full"
                    style={{
                      background: colorTheme.accent,
                      boxShadow: `0 0 6px ${colorTheme.accent}`,
                      animationDelay: `${index * 0.3 + 1}s`
                    }}
                  />
                  
                  {/* Additional floating particle */}
                  <div 
                    className="stats-particle absolute top-1/3 left-4 w-1 h-1 rounded-full"
                    style={{
                      background: colorTheme.primary,
                      boxShadow: `0 0 4px ${colorTheme.primary}`,
                      animationDelay: `${index * 0.3 + 2}s`
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default StatsSection
