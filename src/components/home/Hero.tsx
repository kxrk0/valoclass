'use client'

import Link from 'next/link'
import { ArrowRight, Target, Crosshair, TrendingUp, Users, Zap, Star, Shield, Award } from 'lucide-react'
import { useState, useEffect } from 'react'

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([])
  
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-red-500/20 to-purple-500/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  )
}

// Animated feature card
const FeatureCard = ({ icon: Icon, title, description, delay, color }: {
  icon: any, title: string, description: string, delay: number, color: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="relative group cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative p-6 rounded-2xl transition-all duration-700 ease-out transform 
          ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}`}
        style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? color + '80' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered ? `0 20px 40px ${color}20` : '0 8px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : ''}`}
             style={{ background: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none
            ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  )
}

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Animated Background with Parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)`,
            transition: 'background 0.3s ease',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        
        {/* Additional parallax layers */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `conic-gradient(from 180deg at 50% 50%, rgba(239, 68, 68, 0.1) 0deg, rgba(168, 85, 247, 0.1) 180deg, rgba(59, 130, 246, 0.1) 360deg)`,
            transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)`,
          }}
        />
      </div>
      
      {/* Floating Particles with Parallax */}
      <div style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
        <FloatingParticles />
      </div>
      
      {/* Hero Grid Layout */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full animate-bounce-gentle"
                 style={{
                   background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                   border: '1px solid rgba(239, 68, 68, 0.3)',
                   backdropFilter: 'blur(20px)'
                 }}>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-300 uppercase tracking-wider">
                #1 Valorant Hub
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                <span className="block text-white animate-slide-up">Master</span>
                <span className="block bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-slide-up-delay">
                  Valorant
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl animate-fade-in-delayed">
                The ultimate platform for <span className="text-yellow-400 font-semibold">lineups</span>, 
                <span className="text-red-400 font-semibold"> crosshairs</span>, and 
                <span className="text-cyan-400 font-semibold"> statistics</span>. 
                Elevate your gameplay with our community-driven tools.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delayed-2">
              <Link href="/lineups" 
                    className="group relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/25" />
                <div className="relative flex items-center gap-3 text-white">
                  <Target size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  Explore Lineups
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
              
              <Link href="/crosshairs" 
                    className="group relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300" />
                <div className="relative flex items-center gap-3 text-white">
                  <Crosshair size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  Build Crosshair
                </div>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 pt-4 animate-fade-in-delayed-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Pro Lineups</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1.2K+</div>
                <div className="text-sm text-gray-400">Crosshairs</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="relative mt-12 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-6">
                <FeatureCard 
                  icon={Target}
                  title="Pro Lineups"
                  description="Master smoke, flash, and molly lineups from professional players."
                  delay={200}
                  color="#ef4444"
                />
                <FeatureCard 
                  icon={Users}
                  title="Community Hub"
                  description="Share and discover crosshairs with thousands of players."
                  delay={600}
                  color="#8b5cf6"
                />
              </div>
              
              <div className="space-y-4 lg:space-y-6 sm:mt-6 lg:mt-12">
                <FeatureCard 
                  icon={Crosshair}
                  title="Crosshair Builder"
                  description="Create perfect crosshairs with our advanced customization tools."
                  delay={400}
                  color="#06b6d4"
                />
                <FeatureCard 
                  icon={TrendingUp}
                  title="Live Statistics"
                  description="Track your progress and compare with other players."
                  delay={800}
                  color="#10b981"
                />
              </div>
            </div>
            
            {/* Floating Achievement Badge */}
            <div className="hidden lg:block absolute -top-4 -right-4 animate-float">
              <div className="relative p-4 rounded-2xl"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 69, 0, 0.2) 100%)',
                     backdropFilter: 'blur(20px)',
                     border: '1px solid rgba(255, 215, 0, 0.3)'
                   }}>
                <div className="flex items-center gap-3">
                  <Award className="text-yellow-400" size={24} />
                  <div>
                    <div className="text-sm font-semibold text-yellow-400">#1 Valorant Tool</div>
                    <div className="text-xs text-yellow-300/70">Trusted by pros</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Achievement Badge */}
            <div className="lg:hidden mt-8 text-center">
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl"
                   style={{
                     background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 69, 0, 0.2) 100%)',
                     backdropFilter: 'blur(20px)',
                     border: '1px solid rgba(255, 215, 0, 0.3)'
                   }}>
                <Award className="text-yellow-400" size={20} />
                <div>
                  <div className="text-sm font-semibold text-yellow-400">#1 Valorant Tool</div>
                  <div className="text-xs text-yellow-300/70">Trusted by pros</div>
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
