'use client'

import { useState } from 'react'
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
  Shield,
  Target
} from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const FuturisticLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeOAuth, setActiveOAuth] = useState<string | null>(null)
  
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
    <div className="w-full max-w-md mx-auto">
      {/* Cyberpunk Login Container */}
      <div className="relative">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animation: 'float 4s ease-in-out infinite alternate'
              }}
            />
          ))}
        </div>

        {/* Main Container */}
        <div 
          className="relative p-10 rounded-3xl backdrop-blur-40 border transition-all duration-700 hover:scale-105"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(15, 23, 42, 0.95) 0%, 
                rgba(30, 41, 59, 0.9) 50%,
                rgba(15, 23, 42, 0.95) 100%
              ),
              radial-gradient(circle at 20% 20%, rgba(255, 70, 84, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
            `,
            borderImage: 'linear-gradient(135deg, rgba(255, 70, 84, 0.5), rgba(0, 212, 255, 0.5)) 1',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.1),
              0 25px 50px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 100px rgba(255, 70, 84, 0.1)
            `
          }}
        >
          {/* Glitch Header */}
          <div className="text-center mb-8 relative">
            {/* Animated Icon */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-cyan-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Target size={32} className="text-white animate-pulse" />
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-red-400 rounded-full transform -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full transform -translate-x-1/2"></div>
              </div>
            </div>

            {/* Glitch Text Effect */}
            <h1 className="text-4xl font-bold mb-3 relative">
              <span className="relative inline-block">
                <span className="text-white">VALO</span>
                <span className="bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">ACCESS</span>
                
                {/* Glitch overlay */}
                <span className="absolute inset-0 text-red-400 opacity-50 animate-pulse" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                  VALOACCESS
                </span>
                <span className="absolute inset-0 text-cyan-400 opacity-50 animate-pulse" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', animationDelay: '0.5s' }}>
                  VALOACCESS
                </span>
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg">
              <span className="inline-flex items-center gap-2">
                <Zap size={16} className="text-yellow-400 animate-pulse" />
                Neural Link Established
              </span>
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-20 animate-fade-in-up">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 text-sm">{message}</span>
            </div>
          )}

          {/* Futuristic OAuth Buttons */}
          <div className="space-y-4 mb-8">
            {/* Google */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={activeOAuth !== null}
              className="group w-full p-4 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(66, 133, 244, 0.1) 0%, 
                    rgba(66, 133, 244, 0.05) 100%
                  )
                `,
                border: '2px solid rgba(66, 133, 244, 0.3)',
                boxShadow: '0 8px 25px rgba(66, 133, 244, 0.1)'
              }}
            >
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `conic-gradient(from 0deg, 
                    rgba(66, 133, 244, 0.5), 
                    transparent, 
                    rgba(66, 133, 244, 0.5)
                  )`,
                  padding: '2px'
                }}>
                <div className="w-full h-full rounded-2xl" 
                  style={{ background: 'rgba(15, 23, 42, 0.9)' }} />
              </div>
              
              <div className="relative flex items-center justify-center gap-3 text-white">
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
                <span className="font-semibold">
                  {activeOAuth === 'google' ? 'Connecting...' : 'Google Neural Link'}
                </span>
              </div>
            </button>

            {/* Discord */}
            <button
              onClick={() => handleOAuthLogin('discord')}
              disabled={activeOAuth !== null}
              className="group w-full p-4 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(88, 101, 242, 0.1) 0%, 
                    rgba(88, 101, 242, 0.05) 100%
                  )
                `,
                border: '2px solid rgba(88, 101, 242, 0.3)',
                boxShadow: '0 8px 25px rgba(88, 101, 242, 0.1)'
              }}
            >
              <div className="relative flex items-center justify-center gap-3 text-white">
                {activeOAuth === 'discord' ? (
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MessageCircle size={24} className="text-purple-400" />
                )}
                <span className="font-semibold">
                  {activeOAuth === 'discord' ? 'Connecting...' : 'Discord Protocol'}
                </span>
              </div>
            </button>

            {/* Steam */}
            <button
              onClick={() => handleOAuthLogin('steam')}
              disabled={activeOAuth !== null}
              className="group w-full p-4 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(27, 40, 56, 0.1) 0%, 
                    rgba(27, 40, 56, 0.05) 100%
                  )
                `,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="relative flex items-center justify-center gap-3 text-white">
                {activeOAuth === 'steam' ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gamepad2 size={24} className="text-gray-400" />
                )}
                <span className="font-semibold">
                  {activeOAuth === 'steam' ? 'Connecting...' : 'Steam Interface'}
                </span>
              </div>
            </button>
          </div>

          {/* Cyber Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 py-2 bg-gray-900/90 text-gray-400 backdrop-blur-20 rounded-full border border-red-500/30 text-sm font-medium">
                <Shield size={14} className="inline mr-2" />
                Manual Access
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-3">Neural ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="agent@valoclass.net"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border-2 border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 backdrop-blur-10 hover:bg-gray-900/70"
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}
                  {...register('email', {
                    required: 'Neural ID is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid neural ID format'
                    }
                  })}
                />
                
                {/* Animated border on focus */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 70, 84, 0.5), rgba(0, 212, 255, 0.5))',
                    padding: '2px'
                  }}>
                  <div className="w-full h-full rounded-2xl bg-gray-900/50 backdrop-blur-10" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2 animate-fade-in-up">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-3">Access Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border-2 border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 backdrop-blur-10 hover:bg-gray-900/70"
                  style={{
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}
                  {...register('password', {
                    required: 'Access code is required',
                    minLength: { value: 6, message: 'Access code must be at least 6 characters' }
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
                <p className="text-red-400 text-sm flex items-center gap-2 animate-fade-in-up">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 text-red-500 bg-gray-900 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-300 cursor-pointer">
                  Keep neural link active
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 transition-colors hover:underline"
              >
                Neural reset?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-20 animate-fade-in-up">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="group w-full py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center justify-center gap-3 text-white">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Establishing Link...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    INITIATE ACCESS
                  </>
                )}
              </div>
              
              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
              </div>
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
            <p className="text-gray-400">
              Need neural implant?{' '}
              <Link href="/auth/register" className="text-red-400 hover:text-red-300 font-medium transition-colors hover:underline">
                Initialize new agent
              </Link>
            </p>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-4 w-1 h-8 bg-gradient-to-b from-red-500/50 to-transparent"></div>
          <div className="absolute top-1/2 right-4 w-1 h-8 bg-gradient-to-t from-cyan-500/50 to-transparent"></div>
        </div>
      </div>
    </div>
  )
}

export default FuturisticLoginForm
