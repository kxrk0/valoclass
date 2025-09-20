'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CommunityHero from '@/components/community/CommunityHero'
import TopContributors from '@/components/community/TopContributors'
import RecentActivity from '@/components/community/RecentActivity'
import CommunityStats from '@/components/community/CommunityStats'

// Metadata is handled by layout since this is a client component

export default function CommunityPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [sectionIndex, setSectionIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    // Stagger section reveals
    const timer = setInterval(() => {
      setSectionIndex(prev => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-2/3 left-1/6 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        <div className="absolute inset-0 bg-[url('/patterns/community-network.svg')] opacity-5 animate-slow-spin" />
        
        {/* Enhanced Network Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              <div className={`w-1.5 h-1.5 rounded-full animate-float ${
                Math.random() > 0.6 ? 'bg-green-400/25' : 
                Math.random() > 0.3 ? 'bg-purple-400/20' : 'bg-blue-400/15'
              }`} />
            </div>
          ))}
        </div>
      </div>

      <Header />
      <main className="pt-20 relative">
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          <CommunityHero />
        </div>
        
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Main Content */}
            <div className={`lg:col-span-2 space-y-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <div className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 ${
                  sectionIndex === 0 ? 'animate-pulse-glow' : ''
                }`} />
                <div className="relative">
                  <RecentActivity />
                </div>
              </div>
            </div>

            {/* Enhanced Animated Sidebar */}
            <div className={`lg:col-span-1 space-y-8 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
              <div className="sticky top-24 space-y-8">
                <div className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 ${
                    sectionIndex === 1 ? 'animate-pulse-glow' : ''
                  }`} />
                  <div className="relative">
                    <CommunityStats />
                  </div>
                </div>
                
                <div className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 ${
                    sectionIndex === 2 ? 'animate-pulse-glow' : ''
                  }`} />
                  <div className="relative">
                    <TopContributors />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Community Features Section */}
          <div className={`mt-20 py-16 px-8 rounded-3xl relative overflow-hidden transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="absolute inset-0 bg-[url('/patterns/network.svg')] opacity-5 animate-slow-spin" />
            
            {/* Enhanced decorative elements */}
            <div className="absolute top-8 left-8 w-16 h-16 bg-green-500/10 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-purple-500/15 rounded-full blur-md animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm animate-bounce" style={{animationDelay: '2s'}} />
            
            <div className="relative text-center max-w-4xl mx-auto">
              <h3 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6 hover:text-green-300 transition-colors duration-300">
                🌟 Join the Community
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  { icon: '🤝', title: 'Connect & Learn', description: 'Join discussions, share strategies, and learn from experienced players worldwide.', color: 'green', delay: '0ms' },
                  { icon: '🎯', title: 'Share Your Work', description: 'Upload lineups, crosshairs, and guides. Get recognition from the community.', color: 'purple', delay: '100ms' },
                  { icon: '🏆', title: 'Compete & Grow', description: 'Participate in tournaments, challenges, and climb the community leaderboards.', color: 'blue', delay: '200ms' }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className={`group/feature p-8 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-${feature.color}-400/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-${feature.color}-500/20`}
                    style={{ animationDelay: feature.delay }}
                  >
                    <div className={`text-4xl mb-4 group-hover/feature:scale-110 group-hover/feature:rotate-12 transition-transform duration-300 ${
                      sectionIndex === 3 ? 'animate-bounce' : ''
                    }`}>{feature.icon}</div>
                    <h4 className={`font-semibold text-lg text-white mb-3 group-hover/feature:text-${feature.color}-400 transition-colors duration-300`}>{feature.title}</h4>
                    <p className="text-gray-400 text-sm group-hover/feature:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {feature.description}
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes network-pulse {
          0%, 100% { 
            box-shadow: 0 0 5px currentColor;
            opacity: 1;
          }
          50% { 
            box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-slow-spin {
          animation: slow-spin 40s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-network-pulse {
          animation: network-pulse 3s ease-in-out infinite;
        }

        /* Enhanced hover effects */
        .group/feature:hover {
          transform: translateY(-8px) scale(1.05);
        }
      `}</style>
    </div>
  )
}
