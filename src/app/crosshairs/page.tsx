'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CrosshairBuilder from '@/components/crosshair/CrosshairBuilder'

// Metadata is handled by layout since this is a client component

export default function CrosshairsPage() {
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
    { label: '100% Accurate Codes', color: 'green', icon: '🎯' },
    { label: 'Pro Player Presets', color: 'blue', icon: '👑' },
    { label: 'Community Sharing', color: 'purple', icon: '🌟' }
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
              🎯 Professional Crosshair Builder
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping ml-2" />
            </div>
            
            <h1 className={`font-heading font-black text-5xl md:text-7xl mb-6 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <span className="text-white">Perfect Your</span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                Crosshair
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              Create tournament-ready crosshairs with pixel-perfect accuracy. 
              Featuring pro player presets, real-time preview, and instant Valorant codes.
            </p>
            
            {/* Enhanced Animated Stats */}
            <div className={`flex justify-center gap-8 flex-wrap mb-8 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-500 hover:scale-110 cursor-pointer ${
                    activeFeature === index 
                      ? `bg-${feature.color}-500/20 border border-${feature.color}-500/40 shadow-lg shadow-${feature.color}-500/20 scale-105` 
                      : `bg-${feature.color}-500/10 border border-${feature.color}-500/20`
                  }`}
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className={`w-3 h-3 bg-${feature.color}-400 rounded-full ${
                    activeFeature === index ? 'animate-ping' : 'animate-pulse'
                  }`}></div>
                  <span className={`text-${feature.color}-400 font-semibold transition-all duration-300 ${
                    activeFeature === index ? 'text-white' : ''
                  }`}>{feature.label}</span>
                  <span className="text-lg">{feature.icon}</span>
                </div>
              ))}
            </div>

            {/* Enhanced Quick Actions */}
            <div className={`flex justify-center gap-4 mb-12 transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Start Building</span>
              </button>
              <button className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Browse Presets</span>
              </button>
              <a 
                href="/community/crosshairs"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-600 hover:to-blue-600 backdrop-blur-sm border border-purple-400/30 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/20 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  <span>👥</span>
                  Community Crosshairs
                </span>
              </a>
            </div>
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

          {/* Enhanced Animated Features Grid */}
          <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            {[
              {
                icon: '🎯',
                title: 'Pixel-Perfect Accuracy',
                description: 'Every crosshair code is tested and validated to match exactly what you see in Valorant. No more guesswork - what you build is what you get in-game.',
                badge: '100% Compatible',
                color: 'green',
                delay: '0ms'
              },
              {
                icon: '👑',
                title: 'Pro Player Arsenal',
                description: 'Use the exact same crosshairs as TenZ, ScreaM, cNed, aspas, and other tournament champions. Battle-tested in professional matches.',
                badge: '15+ Pro Presets',
                color: 'blue',
                delay: '200ms'
              },
              {
                icon: '🌟',
                title: 'Community Powered',
                description: 'Share your creations with thousands of players worldwide. Discover unique styles and vote on the best community crosshairs.',
                badge: '10K+ Shared',
                color: 'purple',
                delay: '400ms'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl text-center overflow-hidden backdrop-blur-sm border border-${feature.color}-500/20 hover:border-${feature.color}-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${feature.color}-500/20`}
                style={{
                  background: `linear-gradient(135deg, rgba(${feature.color === 'green' ? '34, 197, 94' : feature.color === 'blue' ? '59, 130, 246' : '168, 85, 247'}, 0.1) 0%, rgba(${feature.color === 'green' ? '34, 197, 94' : feature.color === 'blue' ? '59, 130, 246' : '168, 85, 247'}, 0.05) 100%)`,
                  animationDelay: feature.delay
                }}
              >
                {/* Animated background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${feature.color}-400/20 to-transparent animate-shimmer`} />
                </div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
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

          {/* Enhanced How to Use Section */}
          <div className={`mt-20 transition-all duration-1000 delay-1400 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div 
              className="relative p-8 rounded-3xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-red-500/10 to-purple-500/10" />
              </div>
              
              <div className="relative">
                <h2 className="font-heading font-bold text-3xl mb-8 text-center text-white group-hover:text-yellow-300 transition-colors duration-300">
                  ⚡ How to Use Your Crosshair in Valorant
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: 1, title: 'Create', description: 'Design your crosshair using our builder with real-time preview', delay: '0ms' },
                    { step: 2, title: 'Copy Code', description: 'Click "Share & Codes" and copy the Valorant crosshair code', delay: '100ms' },
                    { step: 3, title: 'Open Valorant', description: 'Go to Settings → Crosshair → Import Profile Code', delay: '200ms' },
                    { step: 4, title: 'Paste & Play', description: 'Paste the code and enjoy your new crosshair in-game!', delay: '300ms' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="text-center group/item hover:scale-105 transition-transform duration-300"
                      style={{ animationDelay: item.delay }}
                    >
                      <div className="relative mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto group-hover/item:shadow-lg group-hover/item:shadow-yellow-500/30 transition-all duration-300 group-hover/item:scale-110">
                          {item.step}
                        </div>
                        {/* Connecting line (except for last item) */}
                        {index < 3 && (
                          <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-yellow-400/50 to-red-400/50 opacity-30" />
                        )}
                      </div>
                      <h4 className="font-semibold mb-2 text-white group-hover/item:text-yellow-300 transition-colors duration-300">{item.title}</h4>
                      <p className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-300">{item.description}</p>
                    </div>
                  ))}
                </div>
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

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 5px currentColor;
            opacity: 1;
          }
          50% { 
            box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
            opacity: 0.8;
          }
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

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        /* Enhanced hover effects */
        .group:hover .animate-shimmer {
          animation-duration: 0.8s;
        }

        /* Staggered animation delays */
        .delay-0 { animation-delay: 0ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1200 { animation-delay: 1200ms; }
        .delay-1400 { animation-delay: 1400ms; }
      `}</style>
    </div>
  )
}
