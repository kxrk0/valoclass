'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Language, defaultLanguage, translations, TranslationKeys } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: TranslationKeys
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('valoclass-language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
      setLanguage(savedLanguage)
    } else {
      // Set default language to Turkish
      setLanguage('tr')
    }
  }, [])

  useEffect(() => {
    // Update document language attribute
    document.documentElement.setAttribute('lang', language)
    
    // Save to localStorage
    localStorage.setItem('valoclass-language', language)
    
    // Update document title based on language
    const title = language === 'tr' 
      ? 'ValorantGuides - Valorant Türk Topluluğu' 
      : 'ValorantGuides - Valorant Community Hub'
    document.title = title
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      const description = language === 'tr'
        ? 'Valorant lineup\'ları, crosshair paylaşımı ve topluluk özellikleri için en iyi platform. Oyun seviyenizi gelişmiş araçlarımızla yükseltin.'
        : 'The ultimate destination for Valorant lineups, crosshair sharing, player statistics, and community features. Improve your gameplay with our comprehensive tools and guides.'
      metaDescription.setAttribute('content', description)
    }
  }, [language])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  const toggleLanguage = () => {
    setLanguage(current => current === 'en' ? 'tr' : 'en')
  }

  // Get translations for current language
  const t = translations[language]

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        toggleLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Convenience hook for translations only
export function useTranslation() {
  const { t } = useLanguage()
  return t
}
