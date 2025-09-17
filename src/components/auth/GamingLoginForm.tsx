'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle, 
  CheckCircle,
  Gamepad2,
  MessageCircle,
  Zap,
  Star,
  Trophy,
  Crosshair,
  Swords
} from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const GamingLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeOAuth, setActiveOAuth] = useState<string | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    mode: 'onChange'
  })

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 400,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: ['#ff4654', '#f0db4f', '#00d4ff', '#9d4edd'][Math.floor(Math.random() * 4)]
      })
    }
    setParticles(initialParticles)

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        opacity: particle.opacity > 0 ? particle.opacity - 0.002 : 1
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      router.push('/')
      
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setActiveOAuth(provider)
    try {
      window.location.href = `/api/auth/oauth/${provider}`
    } catch (error) {
      setError(`Failed to login with ${provider}`)
    } finally {
      setActiveOAuth(null)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto relative">
      {/* Animated Particle Background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Gaming HUD Container */}
      <div className="relative">
        {/* Corner brackets */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-red-500"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-red-500"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-red-500"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-red-500"></div>

        {/* Main Panel */}
        <div 
          className="relative p-10 rounded-3xl backdrop-blur-40 border-2 transition-all duration-700 hover:scale-[1.02]"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(15, 23, 42, 0.9) 0%, 
                rgba(30, 41, 59, 0.8) 50%,
                rgba(15, 23, 42, 0.9) 100%
              ),
              radial-gradient(circle at 20% 20%, rgba(255, 70, 84, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(240, 219, 79, 0.15) 0%, transparent 50%)
            `,
            borderColor: 'rgba(255, 70, 84, 0.5)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.1),
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 50px rgba(255, 70, 84, 0.2)
            `
          }}
        >
          {/* Gaming Header */}
          <div className="text-center mb-8">
            {/* Animated Gaming Icon */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              {/* Pulsing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 rounded-full blur-lg opacity-60 animate-spin" style={{ animationDuration: '3s' }}></div>
              
              {/* Main icon container */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                <Crosshair size={36} className="text-white animate-pulse" />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-red-500 rounded-full text-xs text-white font-bold">
                <Star size={10} />
                100
              </div>
              <div className="absolute -bottom-2 -left-2 flex items-center gap-1 px-2 py-1 bg-yellow-500 rounded-full text-xs text-black font-bold">
                <Trophy size={10} />
                RANK S
              </div>
            </div>

            {/* Gaming Title */}
            <h1 className="text-4xl font-bold mb-3 relative">
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                PLAYER
              </span>
              <br />
              <span className="text-white">LOGIN</span>
              
              {/* Animated underline */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full animate-pulse"></div>
            </h1>
            
            <p className="text-gray-400 text-lg flex items-center justify-center gap-2">
              <Swords size={16} className="text-red-400" />
              Ready to dominate?
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-green-500/20 border border-green-500/40 rounded-2xl backdrop-blur-20 animate-fade-in-up">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">{message}</span>
            </div>
          )}

          {/* Gaming OAuth Buttons */}
          <div className="space-y-4 mb-8">
            {/* Google Gaming Style */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={activeOAuth !== null}
              className="group w-full p-4 rounded-xl relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50 border-2"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(66, 133, 244, 0.2) 0%, 
                    rgba(66, 133, 244, 0.1) 100%
                  )
                `,
                borderColor: 'rgba(66, 133, 244, 0.4)',
                boxShadow: '0 8px 25px rgba(66, 133, 244, 0.2)'
              }}
            >
              {/* Gaming border animation */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `conic-gradient(from 0deg, 
                    rgba(66, 133, 244, 0.8), 
                    transparent, 
                    rgba(66, 133, 244, 0.8)
                  )`,
                  padding: '2px'
                }}>
                <div className="w-full h-full rounded-xl" 
                  style={{ background: 'rgba(15, 23, 42, 0.9)' }} />
              </div>
              
              <div className="relative flex items-center justify-center gap-3 text-white">
                <div className="flex items-center gap-3">
                  {activeOAuth === 'google' ? (
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span className="font-bold">
                    {activeOAuth === 'google' ? 'CONNECTING...' : 'GOOGLE PLAY'}
                  </span>
                </div>
                <Zap size={16} className="text-yellow-400 animate-pulse" />
              </div>
            </button>

            {/* Discord Gaming Style */}
            <button
              onClick={() => handleOAuthLogin('discord')}
              disabled={activeOAuth !== null}
              className="group w-full p-4 rounded-xl relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50 border-2"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(88, 101, 242, 0.2) 0%, 
                    rgba(88, 101, 242, 0.1) 100%
                  )
                `,
                borderColor: 'rgba(88, 101, 242, 0.4)',
                boxShadow: '0 8px 25px rgba(88, 101, 242, 0.2)'
              }}
            >
              <div className="relative flex items-center justify-center gap-3 text-white">
                <div className="flex items-center gap-3">
                  {activeOAuth === 'discord' ? (
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MessageCircle size={24} className="text-purple-400" />
                  )}
                  <span className="font-bold">
                    {activeOAuth === 'discord' ? 'CONNECTING...' : 'DISCORD SQUAD'}
                  </span>
                </div>
                <Zap size={16} className="text-yellow-400 animate-pulse" />
              </div>
            </button>

            {/* Steam Gaming Style */}
            <button
              onClick={() => handleOAuthLogin('steam')}
              disabled={activeOAuth !== null}
              className="group w-full p-4 rounded-xl relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50 border-2"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(27, 40, 56, 0.2) 0%, 
                    rgba(27, 40, 56, 0.1) 100%
                  )
                `,
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="relative flex items-center justify-center gap-3 text-white">
                <div className="flex items-center gap-3">
                  {activeOAuth === 'steam' ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Gamepad2 size={24} className="text-gray-400" />
                  )}
                  <span className="font-bold">
                    {activeOAuth === 'steam' ? 'CONNECTING...' : 'STEAM POWER'}
                  </span>
                </div>
                <Zap size={16} className="text-yellow-400 animate-pulse" />
              </div>
            </button>
          </div>

          {/* Gaming HUD Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 py-2 bg-gray-900/90 text-red-400 backdrop-blur-20 rounded-full border border-red-500/40 text-sm font-bold uppercase tracking-wider">
                Manual Input
              </span>
            </div>
          </div>

          {/* Gaming Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field - Gaming Style */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-red-400 uppercase tracking-wider">Player ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="player@valorant.gg"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/60 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 backdrop-blur-20 hover:bg-gray-900/80 font-medium"
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}
                  {...register('email', {
                    required: 'Player ID is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid Player ID format'
                    }
                  })}
                />
                
                {/* Gaming border effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-red-500/50" />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2 font-medium">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field - Gaming Style */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-red-400 uppercase tracking-wider">Security Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/60 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 backdrop-blur-20 hover:bg-gray-900/80 font-medium"
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}
                  {...register('password', {
                    required: 'Security code is required',
                    minLength: { value: 6, message: 'Security code must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-2 font-medium">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Gaming Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 text-red-500 bg-gray-900 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-300 cursor-pointer font-medium">
                  Keep me logged in
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 transition-colors hover:underline font-medium"
              >
                Reset access?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/40 rounded-xl backdrop-blur-20">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-400 text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Gaming Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="group w-full py-4 rounded-xl font-bold text-lg transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden border-2 border-red-500/50"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 70, 84, 0.9) 0%, 
                    rgba(255, 140, 100, 0.9) 50%,
                    rgba(255, 70, 84, 0.9) 100%
                  )
                `,
                boxShadow: `
                  0 8px 25px rgba(255, 70, 84, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `
              }}
            >
              {/* Animated gaming border */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
              <div className="relative flex items-center justify-center gap-3 text-white">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    LOADING...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    ENTER GAME
                    <Zap size={20} className="animate-pulse" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
            <p className="text-gray-400">
              New player?{' '}
              <Link href="/auth/register" className="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>

          {/* Gaming HUD Elements */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-xs text-red-400 font-bold">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            ONLINE
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-xs text-yellow-400 font-bold">
            <Star size={12} />
            PRO
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamingLoginForm
