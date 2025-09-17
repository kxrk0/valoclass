'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ]

  const currentTheme = themes.find(t => t.id === theme)
  const CurrentIcon = currentTheme?.icon || Moon

  return (
    <div className="relative group">
      <button
        onClick={() => {
          if (theme === 'dark') {
            setTheme('light')
          } else if (theme === 'light') {
            setTheme('system')
          } else {
            setTheme('dark')
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-valorant-accent hover:bg-background-tertiary/50 rounded-lg transition-all duration-200"
        aria-label={`Current theme: ${currentTheme?.label}. Click to switch.`}
      >
        <CurrentIcon size={18} className={resolvedTheme === 'dark' ? 'text-blue-400' : 'text-yellow-500'} />
        <span className="hidden sm:block text-sm font-medium capitalize">
          {currentTheme?.label}
        </span>
      </button>

      {/* Theme Options Dropdown */}
      <div className="absolute right-0 top-full mt-2 py-2 w-36 bg-background-card border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-md">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                theme === themeOption.id
                  ? 'text-valorant-accent bg-background-tertiary/50'
                  : 'text-text-secondary hover:text-white hover:bg-background-tertiary/30'
              }`}
            >
              <Icon size={16} />
              <span>{themeOption.label}</span>
              {theme === themeOption.id && (
                <span className="ml-auto text-valorant-accent">✓</span>
              )}
            </button>
          )
        })}
        
        <div className="border-t border-white/10 mt-2 pt-2 px-3">
          <div className="text-xs text-text-secondary">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium text-white">
                Active: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </div>
            <p>Optimized for Valorant experience</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle
