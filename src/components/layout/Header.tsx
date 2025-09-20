'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Target, Users, BarChart3, Crosshair } from 'lucide-react'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useTranslation } from '@/contexts/LanguageContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslation()

  const navigation = [
    { name: t.nav.lineups, href: '/lineups', icon: Target },
    { name: t.nav.crosshairs, href: '/crosshairs', icon: Crosshair },
    { name: t.nav.stats, href: '/stats', icon: BarChart3 },
    { name: t.nav.community, href: '/community', icon: Users },
  ]

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-6xl w-[95%] glass rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 transform group-hover:scale-105 transition-all duration-200">
              <Image
                src="/assets/logos/brand/vlogo.png" 
                alt="PlayValorantGuides Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-heading font-bold text-lg md:text-xl lg:text-2xl text-white group-hover:text-red-300 transition-colors duration-200">
              PLAYVALORANTGUIDES.COM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 transition-all duration-200 font-medium group"
                  style={{ color: 'var(--text-sub)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-sub)'}
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <Link href="/auth/login" className="btn-primary text-sm px-6 py-2">
              {t.nav.signIn}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-white transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-white/20 mt-4 rounded-b-2xl">
            <nav className="flex flex-col space-y-4 pt-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-text-secondary hover:text-valorant-accent transition-colors duration-200 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Link href="/auth/login" className="btn-primary text-center py-3">
                  {t.nav.signIn}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
