'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Twitter, 
  Github, 
  MessageSquare, 
  Youtube, 
  Mail, 
  ArrowUp, 
  Heart,
  Zap,
  Sparkles,
  Target,
  Crosshair,
  TrendingUp,
  Users
} from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

// Predefined floating particle positions for consistency
const FOOTER_PARTICLES = [
  { left: 10.2, top: 15.8, delay: 1.2, color: 'red', size: 3 },
  { left: 85.7, top: 25.4, delay: 2.8, color: 'cyan', size: 2 },
  { left: 25.8, top: 65.2, delay: 0.5, color: 'purple', size: 4 },
  { left: 70.3, top: 45.9, delay: 3.4, color: 'yellow', size: 2 },
  { left: 15.7, top: 80.6, delay: 1.9, color: 'red', size: 3 },
  { left: 90.2, top: 35.3, delay: 2.6, color: 'cyan', size: 2 },
  { left: 45.9, top: 75.1, delay: 0.8, color: 'purple', size: 3 },
  { left: 65.4, top: 18.8, delay: 3.1, color: 'yellow', size: 4 },
  { left: 5.3, top: 55.7, delay: 1.5, color: 'red', size: 2 },
  { left: 95.7, top: 70.2, delay: 2.3, color: 'cyan', size: 3 }
];

const Footer = () => {
  const t = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [email, setEmail] = useState('')
  
  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 200)
    
    // Scroll to top button logic
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    // Custom smooth scroll with easing
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop
    const duration = 800 // Animation duration in milliseconds
    const startTime = performance.now()
    
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      const easedProgress = easeInOutCubic(progress)
      const scrollTop = currentScroll * (1 - easedProgress)
      
      window.scrollTo(0, scrollTop)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Newsletter signup logic here
    console.log('Newsletter signup:', email)
    setEmail('')
  }
  
  const footerLinks = {
    [t.footer.categories.features]: [
      { name: t.footer.links.agentLineups, href: '/lineups', icon: Target },
      { name: t.footer.links.crosshairBuilder, href: '/crosshairs', icon: Crosshair },
      { name: t.footer.links.playerStatistics, href: '/stats', icon: TrendingUp },
      { name: t.footer.links.communityHub, href: '/community', icon: Users },
    ],
    [t.footer.categories.resources]: [
      { name: t.footer.links.mapGuides, href: '/guides/maps' },
      { name: t.footer.links.agentGuides, href: '/guides/agents' },
      { name: t.footer.links.proPlayerSettings, href: '/pro-settings' },
      { name: t.footer.links.patchNotes, href: '/patch-notes' },
    ],
    [t.footer.categories.community]: [
      { name: t.footer.links.discordServer, href: 'https://discord.gg/valoclass' },
      { name: t.footer.links.reddit, href: 'https://reddit.com/r/valoclass' },
      { name: t.footer.links.twitter, href: 'https://twitter.com/valoclass' },
      { name: t.footer.links.youtube, href: 'https://youtube.com/valoclass' },
    ],
    [t.footer.categories.support]: [
      { name: t.footer.links.helpCenter, href: '/help' },
      { name: t.footer.links.contactUs, href: '/contact' },
      { name: t.footer.links.bugReports, href: '/bug-reports' },
      { name: t.footer.links.featureRequests, href: '/feature-requests' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/valoclass', icon: Twitter, color: '#1da1f2' },
    { name: 'Discord', href: 'https://discord.gg/valoclass', icon: MessageSquare, color: '#7289da' },
    { name: 'GitHub', href: 'https://github.com/valoclass', icon: Github, color: '#ffffff' },
    { name: 'YouTube', href: 'https://youtube.com/valoclass', icon: Youtube, color: '#ff0000' },
  ]

  return (
    <>
      <footer className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
          
          {/* Advanced Gradient Overlays */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(255, 70, 84, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
              `
            }}
          />
          
          {/* Animated Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 70, 84, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 70, 84, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'footer-grid-move 25s linear infinite'
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {FOOTER_PARTICLES.map((particle, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-bounce opacity-60`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: 
                  particle.color === 'red' ? '#ff4654' : 
                  particle.color === 'cyan' ? '#00d4ff' : 
                  particle.color === 'purple' ? '#a855f7' : '#f0db4f',
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + i * 0.2}s`,
                boxShadow: `0 0 ${particle.size * 2}px currentColor`
              }}
            />
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          
          {/* Newsletter Section */}
          <div className={`text-center mb-16 ${isMounted ? `transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }` : ''}`}>
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-red-500/10 border border-red-500/20 backdrop-blur-20">
                <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-red-400 text-sm font-medium">STAY UPDATED</span>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Get the Latest Updates
              </h3>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                Subscribe to receive the latest lineups, crosshair updates, and pro player settings directly in your inbox.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/50 backdrop-blur-20 transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  <span>Subscribe</span>
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Main Footer Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12 ${isMounted ? `transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }` : ''}`}>
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative w-12 h-12 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Image
                    src="/assets/logos/brand/vlogo.png" 
                    alt="PlayValorantGuides Logo"
                    width={48}
                    height={48}
                    className="object-contain drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="block font-bold text-xl text-white mb-1">PLAYVALORANTGUIDES</span>
                  <span className="block text-sm text-red-400 font-medium">.COM</span>
                </div>
              </Link>
              
              <p className="text-gray-400 text-sm mb-8 max-w-sm leading-relaxed">
                {t.footer.description}
              </p>
              
              {/* Enhanced Social Links */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${isMounted ? `animate-bounce` : ''}`}
                      style={{
                        background: `radial-gradient(circle, ${social.color}15 0%, transparent 70%)`,
                        border: `1px solid ${social.color}30`,
                        animationDelay: `${index * 0.2 + 1}s`,
                        animationDuration: '2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${social.color}60`
                        e.currentTarget.style.background = `radial-gradient(circle, ${social.color}25 0%, transparent 70%)`
                        e.currentTarget.style.boxShadow = `0 8px 25px ${social.color}40`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${social.color}30`
                        e.currentTarget.style.background = `radial-gradient(circle, ${social.color}15 0%, transparent 70%)`
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <Icon size={20} />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Footer Link Sections with Enhanced Design */}
            {Object.entries(footerLinks).map(([category, links], sectionIndex) => (
              <div key={category} className={`${isMounted ? `animate-footer-fade-in-up` : ''}`} style={{ animationDelay: `${sectionIndex * 0.1 + 0.5}s` }}>
                <h3 className="relative font-bold text-white mb-6 text-lg group cursor-default">
                  {category}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-transparent transition-all duration-300 group-hover:w-full"></div>
                </h3>
                <ul className="space-y-4">
                  {links.map((link, linkIndex) => {
                    const LinkIcon = 'icon' in link ? link.icon : null
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1"
                        >
                          {LinkIcon && (
                            <LinkIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                          )}
                          <span className="relative">
                            {link.name}
                            <div className="absolute bottom-0 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full"></div>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Enhanced Bottom Section */}
          <div className={`pt-8 border-t border-gray-700/50 relative ${isMounted ? `transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }` : ''}`}>
            
            {/* Decorative Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                <span>{t.footer.copyright}</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {[
                  { name: t.footer.links.privacyPolicy, href: '/privacy' },
                  { name: t.footer.links.termsOfService, href: '/terms' },
                  { name: t.footer.links.cookiePolicy, href: '/cookies' }
                ].map((link, index) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="relative text-gray-400 hover:text-white transition-all duration-300 font-medium group"
                  >
                    {link.name}
                    <div className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isMounted ? 'animate-footer-bounce-in' : ''}`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        )}

      </footer>
    </>
  )
}

export default Footer
