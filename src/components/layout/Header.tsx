'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Target, Users, BarChart3, Crosshair } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Lineups', href: '/lineups', icon: Target },
    { name: 'Crosshairs', href: '/crosshairs', icon: Crosshair },
    { name: 'Stats', href: '/stats', icon: BarChart3 },
    { name: 'Community', href: '/community', icon: Users },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: 'var(--red)' }}>
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="font-heading font-bold text-2xl text-white">ValoClass</span>
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
            <ThemeToggle />
            <Link href="/auth/login" className="btn-secondary text-sm px-4 py-2">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm px-6 py-2">
              Sign Up
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
          <div className="md:hidden pb-6 border-t border-white/10 mt-4">
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
                <Link href="/auth/login" className="btn-secondary text-center py-3">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-center py-3">
                  Sign Up
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
