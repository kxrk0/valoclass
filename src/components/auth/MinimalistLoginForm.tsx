'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  AlertCircle, 
  CheckCircle,
  MessageCircle,
  Circle,
  ArrowRight
} from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const MinimalistLoginForm = () => {
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
    <div className="w-full max-w-lg mx-auto relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Minimal geometric elements */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-red-500/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-cyan-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Container */}
      <div className="relative">
        {/* Glassmorphism container */}
        <div 
          className="relative p-6 lg:p-8 rounded-2xl backdrop-blur-30 border transition-all duration-300"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.02) 100%
              ),
              radial-gradient(circle at 30% 40%, rgba(255, 70, 84, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 25px 45px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 50px rgba(255, 255, 255, 0.05)
            `
          }}
        >
          {/* Minimal Header */}
          <div className="text-center mb-5">
            {/* Geometric logo */}
            <div className="relative inline-flex items-center justify-center w-8 h-8 mb-3">
              {/* Overlapping shapes */}
              <div className="absolute w-8 h-8 border border-red-400/60 rounded-lg rotate-45 animate-pulse"></div>
              <div className="absolute w-5 h-5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-2 h-2 bg-white rounded-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <h1 className="text-xl font-light mb-1 text-white tracking-wide">
              Welcome
            </h1>
            <p className="text-gray-400 text-xs font-light">
              Enter your credentials to continue
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="flex items-center gap-3 p-2.5 mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl backdrop-blur-20">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">{message}</span>
            </div>
          )}

          {/* Clean OAuth Buttons */}
          <div className="space-y-2 mb-4">
            {/* Google */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={activeOAuth !== null}
              className="group w-full p-2.5 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 bg-gray-800/20 hover:bg-gray-800/40 backdrop-blur-20"
            >
              <div className="flex items-center justify-center gap-3 text-gray-300 group-hover:text-white">
                {activeOAuth === 'google' ? (
                  <div className="w-5 h-5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="font-medium text-sm">
                  {activeOAuth === 'google' ? 'Connecting...' : 'Continue with Google'}
                </span>
              </div>
            </button>

            {/* Discord */}
            <button
              onClick={() => handleOAuthLogin('discord')}
              disabled={activeOAuth !== null}
              className="group w-full p-2.5 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 bg-gray-800/20 hover:bg-gray-800/40 backdrop-blur-20"
            >
              <div className="flex items-center justify-center gap-3 text-gray-300 group-hover:text-white">
                {activeOAuth === 'discord' ? (
                  <div className="w-5 h-5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MessageCircle size={20} />
                )}
                <span className="font-medium text-sm">
                  {activeOAuth === 'discord' ? 'Connecting...' : 'Continue with Discord'}
                </span>
              </div>
            </button>

            {/* Riot ID */}
            <button
              onClick={() => handleOAuthLogin('riot')}
              disabled={activeOAuth !== null}
              className="group w-full p-2.5 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 bg-gray-800/20 hover:bg-gray-800/40 backdrop-blur-20"
            >
              <div className="flex items-center justify-center gap-3 text-gray-300 group-hover:text-white">
                {activeOAuth === 'riot' ? (
                  <div className="w-5 h-5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.534 21.25l-1.09-2.21 10.52-5.18L12.534 2v5.5L2 12l10.534 4.5v4.75z"/>
                  </svg>
                )}
                <span className="font-medium text-sm">
                  {activeOAuth === 'riot' ? 'Connecting...' : 'Continue with Riot ID'}
                </span>
              </div>
            </button>
          </div>

          {/* Elegant Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-gray-900/80 text-gray-400 backdrop-blur-20 rounded-full text-sm">
                or
              </span>
            </div>
          </div>

          {/* Clean Email Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-red-400 transition-colors" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('rememberMe')}
                  />
                  <div className="relative w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                  <span className="ml-3 text-sm text-gray-400">Remember me</span>
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-20">
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="group w-full py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 70, 84, 0.8) 0%, 
                    rgba(255, 70, 84, 0.9) 100%
                  )
                `,
                boxShadow: '0 8px 25px rgba(255, 70, 84, 0.3)'
              }}
            >
              <div className="flex items-center justify-center gap-3 text-white">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4 pt-3 border-t border-gray-700/30">
            <p className="text-gray-400 text-xs">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-white hover:text-red-400 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Minimal decorative elements */}
          <div className="absolute top-2.5 right-4 w-1 h-1 bg-red-400/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default MinimalistLoginForm
