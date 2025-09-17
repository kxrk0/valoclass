'use client'

import Link from 'next/link'
import { ArrowRight, Target, Crosshair, TrendingUp } from 'lucide-react'

const Hero = () => {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-5xl mx-auto">
          {/* Hero Content */}
          <div className="fade-in space-y-6">
            <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl mb-6 gradient-text">
              Master Valorant
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--text-sub)' }}>
              The ultimate hub for <span style={{ color: 'var(--yellow)' }} className="font-semibold">lineups</span>, 
              <span style={{ color: 'var(--red)' }} className="font-semibold"> crosshairs</span>, and 
              <span style={{ color: 'var(--text-main)' }} className="font-semibold"> player statistics</span>. 
              Join our community and elevate your gameplay.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
              <Link href="/lineups" className="btn-primary text-lg px-8 py-4 group">
                <Target size={20} className="group-hover:rotate-12 transition-transform duration-200" />
                Explore Lineups
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link href="/crosshairs" className="btn-secondary text-lg px-8 py-4 group">
                <Crosshair size={20} className="group-hover:scale-110 transition-transform duration-200" />
                Build Crosshair
              </Link>
            </div>
          </div>


          {/* Enhanced Stats Section */}
          <div className="mt-8 pt-4">
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-4"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                     border: '1px solid rgba(255, 255, 255, 0.1)',
                     backdropFilter: 'blur(20px)'
                   }}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Live Stats</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Trusted by the <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent">Community</span>
              </h3>
            </div>

            {/* Responsive Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
              {[
                { value: '500+', label: 'Lineups', color: '#ff4654', icon: '🎯' },
                { value: '1.2K+', label: 'Crosshairs', color: '#f0db4f', icon: '⌖' },
                { value: '10K+', label: 'Users', color: '#00d4ff', icon: '👥' },
                { value: '24/7', label: 'Updates', color: '#00f5a0', icon: '🔄' }
               ].map((stat, index) => (
                 <div key={stat.label} 
                      className="group relative animate-fade-in-up"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'both'
                      }}>
                   <div className="relative p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 h-full"
                        style={{
                          background: `rgba(30, 35, 45, 0.4)`,
                          border: `2px solid rgba(156, 163, 175, 0.3)`,
                          backdropFilter: 'blur(10px)',
                          minHeight: '140px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `rgba(156, 163, 175, 0.5)`
                          e.currentTarget.style.background = `rgba(30, 35, 45, 0.6)`
                          e.currentTarget.style.boxShadow = `0 8px 25px rgba(0, 0, 0, 0.2)`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `rgba(156, 163, 175, 0.3)`
                          e.currentTarget.style.background = `rgba(30, 35, 45, 0.4)`
                          e.currentTarget.style.boxShadow = 'none'
                        }}>
                     
                     {/* Floating Icon */}
                     <div className="text-2xl md:text-3xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 text-center"
                          style={{
                            color: stat.color
                          }}>
                       {stat.icon}
                     </div>
                     
                     {/* Clean Value */}
                     <div className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110 text-center"
                          style={{ 
                            color: stat.color,
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}>
                       {stat.value}
                     </div>
                     
                     {/* Minimal Label */}
                     <div className="text-xs uppercase tracking-wider font-medium text-center text-white/70">
                       {stat.label}
                     </div>
                     
                   </div>
                 </div>
               ))}
            </div>

            {/* Bottom Achievement Banner */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 69, 0, 0.1) 100%)',
                     border: '1px solid rgba(255, 215, 0, 0.2)',
                     backdropFilter: 'blur(20px)'
                   }}>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white/20"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full border-2 border-white/20"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white/20"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">+</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-yellow-400">Join 10,000+ Players</div>
                  <div className="text-xs text-gray-400">Improving their rank every day</div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
