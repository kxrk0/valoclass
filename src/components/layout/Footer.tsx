'use client'

import Link from 'next/link'
import { Twitter, Github, MessageSquare, Youtube } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    Features: [
      { name: 'Agent Lineups', href: '/lineups' },
      { name: 'Crosshair Builder', href: '/crosshairs' },
      { name: 'Player Statistics', href: '/stats' },
      { name: 'Community Hub', href: '/community' },
    ],
    Resources: [
      { name: 'Map Guides', href: '/guides/maps' },
      { name: 'Agent Guides', href: '/guides/agents' },
      { name: 'Pro Player Settings', href: '/pro-settings' },
      { name: 'Patch Notes', href: '/patch-notes' },
    ],
    Community: [
      { name: 'Discord Server', href: 'https://discord.gg/valoclass' },
      { name: 'Reddit', href: 'https://reddit.com/r/valoclass' },
      { name: 'Twitter', href: 'https://twitter.com/valoclass' },
      { name: 'YouTube', href: 'https://youtube.com/valoclass' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Bug Reports', href: '/bug-reports' },
      { name: 'Feature Requests', href: '/feature-requests' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/valoclass', icon: Twitter },
    { name: 'Discord', href: 'https://discord.gg/valoclass', icon: MessageSquare },
    { name: 'GitHub', href: 'https://github.com/valoclass', icon: Github },
    { name: 'YouTube', href: 'https://youtube.com/valoclass', icon: Youtube },
  ]

  return (
    <footer className="bg-background-secondary/50 border-t border-white/10 backdrop-blur-sm">
      <div className="container mx-auto py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-valorant-red to-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="font-heading font-bold text-2xl text-white">ValorantGuides</span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-sm leading-relaxed">
              The ultimate Valorant community hub for lineups, crosshairs, and player statistics. 
              Master your gameplay and climb the ranks.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-background-tertiary/50 rounded-xl flex items-center justify-center text-text-muted hover:text-valorant-accent hover:bg-background-tertiary transition-all duration-200 hover:scale-105"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-white mb-6 text-lg">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-valorant-accent transition-colors duration-200 text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-text-muted font-medium">
              © 2024 ValorantGuides. All rights reserved.
            </div>
            <div className="flex space-x-8 text-sm">
              <Link href="/privacy" className="text-text-muted hover:text-valorant-accent transition-colors duration-200 font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-muted hover:text-valorant-accent transition-colors duration-200 font-medium">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-text-muted hover:text-valorant-accent transition-colors duration-200 font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
