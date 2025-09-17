'use client'

import { Trophy, TrendingUp, Users, Target } from 'lucide-react'

const StatsSection = () => {
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
      label: 'Active Users',
      color: 'text-blue-400'
    },
    {
      icon: Target,
      value: '1,843',
      label: 'Lineups Created',
      color: 'text-red-400'
    },
    {
      icon: TrendingUp,
      value: '5,692',
      label: 'Crosshairs Shared',
      color: 'text-yellow-400'
    },
    {
      icon: Trophy,
      value: '2,156',
      label: 'Rank Improvements',
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
            Success 
            <span className="gradient-text"> Stories</span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
            style={{
              animation: 'statsFadeInUp 1s ease-out both',
              animationDelay: '0.4s'
            }}
          >
            Real achievements from our community members who elevated their gameplay.
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

        {/* Testimonial */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="card text-center" style={{ background: 'var(--glass-green)', borderColor: 'var(--border-green)' }}>
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-7 h-7 hover:scale-110 transition-transform duration-200 mx-1"
                    style={{ color: 'var(--yellow)' }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed" style={{ color: 'var(--text-main)' }}>
                &ldquo;ValoClass completely changed my gameplay. The lineups are precise, the crosshair builder is amazing, 
                and the community is incredibly helpful. Went from Silver to Immortal in just 3 months!&rdquo;
              </blockquote>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'var(--glass-red)', border: '2px solid var(--border-red)' }}>
                <span className="font-bold text-xl" style={{ color: 'var(--red)' }}>JM</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg" style={{ color: 'var(--text-main)' }}>John Martinez</div>
                <div className="text-sm font-medium" style={{ color: 'var(--green)' }}>Immortal 2 • 2,847 RR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
