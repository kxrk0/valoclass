'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, X, User, MessageCircle } from 'lucide-react'

interface OAuthData {
  provider: 'google' | 'discord' | 'riot'
  userName: string
  userEmail?: string
  userId?: string
}

const OAuthHandler = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [oauthData, setOAuthData] = useState<OAuthData | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
        setOAuthData(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage])

  useEffect(() => {
    // Check for OAuth success parameters
    const googleLogin = searchParams.get('google_login')
    const discordLogin = searchParams.get('discord_login')
    const riotLogin = searchParams.get('riot_login')

    const userName = searchParams.get('user_name')
    const userEmail = searchParams.get('user_email')
    const userId = searchParams.get('user_id')

    if (googleLogin === 'success' && userName) {
      setOAuthData({
        provider: 'google',
        userName: decodeURIComponent(userName),
        userEmail: userEmail ? decodeURIComponent(userEmail) : undefined
      })
      setShowSuccessMessage(true)
      cleanUrl()
    } else if (discordLogin === 'success' && userName) {
      setOAuthData({
        provider: 'discord',
        userName: decodeURIComponent(userName),
        userEmail: userEmail ? decodeURIComponent(userEmail) : undefined,
        userId: userId || undefined
      })
      setShowSuccessMessage(true)
      cleanUrl()
    } else if (riotLogin === 'success' && userName) {
      setOAuthData({
        provider: 'riot',
        userName: decodeURIComponent(userName),
        userEmail: userEmail ? decodeURIComponent(userEmail) : undefined
      })
      setShowSuccessMessage(true)
      cleanUrl()
    }
  }, [searchParams, router])

  const cleanUrl = () => {
    // Clean URL by removing all OAuth parameters
    const url = new URL(window.location.href)
    
    // Remove OAuth-related parameters
    url.searchParams.delete('google_login')
    url.searchParams.delete('discord_login')
    url.searchParams.delete('riot_login')
    url.searchParams.delete('user_name')
    url.searchParams.delete('user_email')
    url.searchParams.delete('user_id')
    
    // Update URL without page refresh
    window.history.replaceState({}, '', url.pathname + url.search)
  }

  const hideSuccessMessage = () => {
    setShowSuccessMessage(false)
    setOAuthData(null)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )
      case 'discord':
        return <MessageCircle className="w-5 h-5 text-indigo-400" />
      case 'riot':
        return <User className="w-5 h-5 text-red-400" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'from-blue-500/20 to-green-500/20 border-blue-500/30'
      case 'discord':
        return 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30'
      case 'riot':
        return 'from-red-500/20 to-orange-500/20 border-red-500/30'
      default:
        return 'from-gray-500/20 to-gray-400/20 border-gray-500/30'
    }
  }

  if (!showSuccessMessage || !oauthData) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`
        bg-gradient-to-r ${getProviderColor(oauthData.provider)}
        backdrop-blur-md border rounded-xl p-4 shadow-2xl
        max-w-sm w-full
        relative overflow-hidden
      `}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        </div>

        {/* Close button */}
        <button
          onClick={hideSuccessMessage}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center gap-2">
              {getProviderIcon(oauthData.provider)}
              <span className="text-white font-semibold capitalize">
                {oauthData.provider} Login Successful!
              </span>
            </div>
          </div>

          <div className="ml-11 space-y-1">
            <p className="text-white/90 font-medium">
              Welcome, {oauthData.userName}!
            </p>
            {oauthData.userEmail && (
              <p className="text-white/60 text-sm">
                {oauthData.userEmail}
              </p>
            )}
            {oauthData.userId && (
              <p className="text-white/60 text-xs">
                ID: {oauthData.userId}
              </p>
            )}
          </div>

          {/* Auto-hide indicator */}
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/30 rounded-full animate-[shrink_5s_linear_forwards]" />
          </div>
        </div>
      </div>
    </div>
  )
}


export default OAuthHandler
