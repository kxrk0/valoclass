'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { id: 'en', label: 'English', flag: '🇺🇸', shortLabel: 'EN' },
    { id: 'tr', label: 'Türkçe', flag: '🇹🇷', shortLabel: 'TR' }
  ]

  const currentLanguage = languages.find(lang => lang.id === language)
  
  return (
    <div className="relative group">
      <button
        onClick={() => {
          setLanguage(language === 'en' ? 'tr' : 'en')
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
        style={{ color: 'var(--text-sub)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--yellow)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-sub)'}
        aria-label={`Current language: ${currentLanguage?.label}. Click to switch.`}
      >
        <Globe size={18} className="text-blue-400" />
        <span className="hidden sm:block text-sm font-medium">
          {currentLanguage?.shortLabel}
        </span>
      </button>

      {/* Language Options Dropdown */}
      <div className="absolute right-0 top-full mt-2 py-2 w-40 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-md border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        {languages.map((languageOption) => (
          <button
            key={languageOption.id}
            onClick={() => setLanguage(languageOption.id as any)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
              language === languageOption.id
                ? 'text-valorant-accent bg-background-tertiary/50'
                : 'text-text-secondary hover:text-white hover:bg-background-tertiary/30'
            }`}
            style={{
              color: language === languageOption.id ? 'var(--yellow)' : 'var(--text-sub)',
              backgroundColor: language === languageOption.id ? 'rgba(240, 219, 79, 0.1)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (language !== languageOption.id) {
                e.currentTarget.style.color = 'var(--text-main)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (language !== languageOption.id) {
                e.currentTarget.style.color = 'var(--text-sub)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <span className="text-lg">{languageOption.flag}</span>
            <span>{languageOption.label}</span>
            {language === languageOption.id && (
              <span className="ml-auto text-yellow-400">✓</span>
            )}
          </button>
        ))}
        
        <div className="border-t border-white/10 mt-2 pt-2 px-3">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium" style={{ color: 'var(--text-main)' }}>
                {t.common.language}: {currentLanguage?.label}
              </span>
            </div>
            <p>Switch between English and Turkish</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageToggle
