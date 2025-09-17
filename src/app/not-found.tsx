import Link from 'next/link'
import { Search, Home, Target, Crosshair } from 'lucide-react'

export default function NotFound() {
  const quickLinks = [
    {
      name: 'Browse Lineups',
      href: '/lineups',
      icon: Target,
      description: 'Discover agent lineups for all maps'
    },
    {
      name: 'Build Crosshair',
      href: '/crosshairs',
      icon: Crosshair,
      description: 'Create your perfect crosshair'
    },
    {
      name: 'Player Stats',
      href: '/stats',
      icon: Search,
      description: 'Search player statistics'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-gray-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <Search size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
          Looks like this page went missing in action. Let&apos;s get you back on track with some helpful links.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-600 transition-colors">
                  <Icon size={20} className="text-gray-300" />
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                  {link.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {link.description}
                </p>
              </Link>
            )
          })}
        </div>

        {/* Home Button */}
        <Link href="/" className="btn btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
          <Home size={20} />
          Back to Home
        </Link>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
