'use client'

import { useState, lazy, Suspense } from 'react'
import { Palette, Zap, Minimize2, Gamepad2 } from 'lucide-react'

// Lazy load components to avoid module loading issues
const ModernLoginForm = lazy(() => import('./ModernLoginForm'))
const FuturisticLoginForm = lazy(() => import('./FuturisticLoginForm'))
const MinimalistLoginForm = lazy(() => import('./MinimalistLoginForm'))
const GamingLoginForm = lazy(() => import('./GamingLoginForm'))

type DesignType = 'modern' | 'futuristic' | 'minimalist' | 'gaming'

interface DesignOption {
  id: DesignType
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

const designs: DesignOption[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Current sleek design',
    icon: <Palette size={16} />,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'futuristic',
    name: 'Cyberpunk',
    description: 'Futuristic neon theme',
    icon: <Zap size={16} />,
    color: 'from-red-500 to-cyan-500'
  },
  {
    id: 'minimalist',
    name: 'Minimal',
    description: 'Clean geometric style',
    icon: <Minimize2 size={16} />,
    color: 'from-gray-400 to-white'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Ultimate gamer experience',
    icon: <Gamepad2 size={16} />,
    color: 'from-red-500 to-yellow-500'
  }
]

const DesignSwitcher = () => {
  const [activeDesign, setActiveDesign] = useState<DesignType>('futuristic')

  const renderLoginForm = () => {
    switch (activeDesign) {
      case 'modern':
        return <ModernLoginForm />
      case 'futuristic':
        return <FuturisticLoginForm />
      case 'minimalist':
        return <MinimalistLoginForm />
      case 'gaming':
        return <GamingLoginForm />
      default:
        return <ModernLoginForm />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Design Selection Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Choose Your Style</h2>
        <div className="flex flex-wrap justify-center gap-3 px-4">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setActiveDesign(design.id)}
              className="group relative px-4 sm:px-6 py-3 rounded-2xl border-2 transition-all duration-300 hover:scale-105"
              style={{
                background: activeDesign === design.id 
                  ? `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`
                  : 'rgba(255, 255, 255, 0.05)',
                borderColor: activeDesign === design.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: activeDesign === design.id ? '0 8px 25px rgba(0, 0, 0, 0.3)' : 'none'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`p-2 rounded-lg bg-gradient-to-r ${design.color} text-white`}
                >
                  {design.icon}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-white font-semibold text-sm">{design.name}</div>
                  <div className="text-gray-400 text-xs">{design.description}</div>
                </div>
                <div className="text-center sm:hidden">
                  <div className="text-white font-semibold text-xs">{design.name}</div>
                </div>
              </div>
              
              {/* Active indicator */}
              {activeDesign === design.id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Login Form Container */}
      <div className="transition-all duration-500 ease-in-out">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          {renderLoginForm()}
        </Suspense>
      </div>

      {/* Design Info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm">
            Current: <strong className="text-white">{designs.find(d => d.id === activeDesign)?.name}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export default DesignSwitcher
