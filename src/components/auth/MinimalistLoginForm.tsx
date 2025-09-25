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
  AlertCircle, 
  CheckCircle,
  MessageCircle,
  Circle,
  ArrowRight,
  Shield,
  Gamepad2
} from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

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
  const t = useTranslation()

  
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
      // Redirect to OAuth endpoint for all providers
      window.location.href = `/api/auth/oauth/${provider}`
    } catch (error) {
      setError(`Failed to login with ${provider}`)
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

      {/* Modern Clean Container */}
      <div className="relative">
        {/* Professional Form Container */}
        <div 
          className="relative p-6 lg:p-8 rounded-2xl backdrop-blur-20 border transition-all duration-300 hover:shadow-2xl group"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(30, 30, 40, 0.95) 0%, 
                rgba(35, 35, 50, 0.92) 50%,
                rgba(25, 25, 35, 0.95) 100%
              ),
              radial-gradient(circle at 30% 40%, rgba(255, 70, 84, 0.08) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.06) 0%, transparent 60%)
            `,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Clean hover effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          {/* Clean Professional Header */}
          <div className="text-center mb-6 relative">
            {/* Simple Logo */}
            <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10">
                <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-cyan-400 rounded-lg"></div>
              </div>
            </div>

            {/* Clean title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Sign In
            </h1>
            <p className="text-gray-400 text-sm">
              Access your tactical dashboard
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
          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={activeOAuth !== null}
              className="group w-full p-3 rounded-lg border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 hover:bg-blue-500/5 disabled:opacity-50"
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
              className="group w-full p-3 rounded-lg border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-purple-500/5 disabled:opacity-50"
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
              className="group w-full p-3 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300 bg-red-500/5 hover:bg-red-500/10 disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-3 text-red-300 group-hover:text-red-200">
                {activeOAuth === 'riot' ? (
                  <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                    <g fill="currentColor">
                      <polygon points="80.11463165283203,8.324189960956573 0,45.35578089952469 19.96091079711914,121.31561595201492 35.225154876708984,119.41886454820633 30.980073928833008,71.72943431138992 36.03803253173828,69.47140055894852 44.61853790283203,118.24470835924149 70.54061126708984,115.08348399400711 65.93424224853516,62.42641764879227 70.81159210205078,60.25872737169266 80.29529571533203,113.90928965806961 106.57864379882812,110.6577256321907 101.52070617675781,52.942733108997345 106.48834228515625,50.775035202503204 116.87525177001953,109.39323741197586 142.79733276367188,106.23201304674149 142.79733276367188,24.040038406848907"></polygon>
                      <polygon points="82.01138305664062,123.3929780125618 83.27587127685547,130.8895142674446 142.79733276367188,140.8247407078743 142.79733276367188,115.98668986558914 82.10169982910156,123.3929780125618"></polygon>
                    </g>
                  </svg>
                )}
                <span className="font-semibold text-sm">
                  {activeOAuth === 'riot' ? 'Connecting...' : 'Sign in with Riot ID'}
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
            {/* Enhanced Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 group-focus-within:text-red-300 transition-colors">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pl-12 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50 hover:border-gray-500/60 group-focus-within:shadow-lg group-focus-within:shadow-red-500/10"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-red-400 group-hover:text-gray-400 transition-all duration-300" />
                </div>
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg border border-red-500/0 group-focus-within:border-red-500/20 transition-all duration-300 pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2 animate-fade-in">
                  <Circle size={4} className="fill-current animate-pulse" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Enhanced Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 group-focus-within:text-red-300 transition-colors">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-12 pr-12 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50 hover:border-gray-500/60 group-focus-within:shadow-lg group-focus-within:shadow-red-500/10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-red-400 group-hover:text-gray-400 transition-all duration-300" />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white hover:scale-110 transition-all duration-200 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg border border-red-500/0 group-focus-within:border-red-500/20 transition-all duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-2 animate-fade-in">
                  <Circle size={4} className="fill-current animate-pulse" />
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
