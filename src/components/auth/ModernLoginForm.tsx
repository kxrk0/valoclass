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
  MessageCircle
} from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const ModernLoginForm = () => {
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
      // OAuth login will be implemented
      window.location.href = `/api/auth/oauth/${provider}`
    } catch (error) {
      setError(`Failed to login with ${provider}`)
    } finally {
      setActiveOAuth(null)
    }
  }

  const SocialButton = ({ 
    provider, 
    icon, 
    color, 
    bgColor, 
    hoverColor,
    children 
  }: {
    provider: string
    icon: React.ReactNode
    color: string
    bgColor: string
    hoverColor: string
    children: React.ReactNode
  }) => (
    <button
      onClick={() => handleOAuthLogin(provider)}
      disabled={activeOAuth !== null}
      className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}08 100%)`,
        border: `2px solid ${color}30`,
        backdropFilter: 'blur(20px)'
      }}
      onMouseEnter={(e) => {
        if (activeOAuth === null) {
          e.currentTarget.style.borderColor = `${color}60`
          e.currentTarget.style.background = `linear-gradient(135deg, ${bgColor}25 0%, ${bgColor}15 100%)`
          e.currentTarget.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${color}20`
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}30`
        e.currentTarget.style.background = `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}08 100%)`
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="flex items-center justify-center gap-3">
        <div 
          className="text-2xl transition-transform duration-300 group-hover:scale-110"
          style={{ color }}
        >
          {activeOAuth === provider ? (
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" 
                 style={{ borderColor: `${color} transparent transparent` }} />
          ) : (
            icon
          )}
        </div>
        <span className="font-semibold text-white group-hover:text-opacity-90">
          {activeOAuth === provider ? 'Connecting...' : children}
        </span>
      </div>
      
      {/* Animated background effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from 0deg, ${color}20, transparent, ${color}20)`,
          borderRadius: '1rem'
        }}
      />
    </button>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Login Card */}
      <div 
        className="relative p-8 rounded-3xl backdrop-blur-30 border-2 transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(255, 70, 84, 0.1)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-gray-400">
            Continue your Valorant journey
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-20">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-400 text-sm">{message}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-4 mb-8">
          <SocialButton
            provider="google"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
            color="#4285f4"
            bgColor="#4285f4"
            hoverColor="#3367d6"
          >
            Continue with Google
          </SocialButton>

          <SocialButton
            provider="discord"
            icon={<MessageCircle size={24} />}
            color="#5865f2"
            bgColor="#5865f2"
            hoverColor="#4752c4"
          >
            Continue with Discord
          </SocialButton>

          <SocialButton
            provider="steam"
            icon={<Gamepad2 size={24} />}
            color="#1b2838"
            bgColor="#1b2838"
            hoverColor="#2a475e"
          >
            Continue with Steam
          </SocialButton>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/80 text-gray-400 backdrop-blur-10 rounded-full">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 backdrop-blur-10"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={14} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 backdrop-blur-10"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm flex items-center gap-2">
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
                className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-20">
              <AlertCircle size={20} className="text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full btn-primary text-lg py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-orange-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  )
}

export default ModernLoginForm
