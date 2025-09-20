'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  User,
  Lock,
  AlertCircle, 
  CheckCircle,
  MessageCircle,
  Circle,
  ArrowRight,
  UserPlus,
  Gamepad2
} from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import { ValidationUtils } from '@/lib/validation'

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  riotId?: string
  acceptTerms: boolean
}

const MinimalistRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeOAuth, setActiveOAuth] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const t = useTranslation()

  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    mode: 'onChange'
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate form data
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (!data.acceptTerms) {
        setError('You must accept the terms and conditions')
        return
      }

      // Validate password strength
      const passwordValidation = ValidationUtils.validatePassword(data.password)
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors[0])
        return
      }

      // Validate username
      const usernameValidation = ValidationUtils.validateUsername(data.username)
      if (!usernameValidation.isValid) {
        setError(usernameValidation.errors[0])
        return
      }

      // Validate email
      if (!ValidationUtils.isValidEmail(data.email)) {
        setError('Please enter a valid email address')
        return
      }

      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          riotId: data.riotId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/auth/login?message=Registration successful! Please sign in.')
      }, 2000)
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
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
      setError(`Failed to register with ${provider}`)
      setActiveOAuth(null)
    }
  }

  // Success State
  if (success) {
    return (
      <div className="w-full max-w-lg mx-auto relative">
        <div 
          className="relative p-6 lg:p-8 rounded-2xl backdrop-blur-30 border transition-all duration-300 text-center"
          style={{
            background: `
              linear-gradient(145deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.02) 100%
              )
            `,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 25px 45px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Registration Successful!</h2>
          <p className="text-gray-400 mb-4">
            Your account has been created successfully. You will be redirected to the login page.
          </p>
          <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Minimal geometric elements */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-green-500/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-purple-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
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
              radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
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
              <div className="absolute w-8 h-8 border border-green-400/60 rounded-lg rotate-45 animate-pulse"></div>
              <div className="absolute w-5 h-5 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-2 h-2 bg-white rounded-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <h1 className="text-xl font-light mb-1 text-white tracking-wide">
              Create Account
            </h1>
            <p className="text-gray-400 text-xs font-light">
              Join the community and start your journey
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
              className="w-full riot-id-button-auth"
            >
              {activeOAuth === 'riot' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="riot-icon" width="20" height="20" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <polygon points="80.11463165283203,8.324189960956573 0,45.35578089952469 19.96091079711914,121.31561595201492 35.225154876708984,119.41886454820633 30.980073928833008,71.72943431138992 36.03803253173828,69.47140055894852 44.61853790283203,118.24470835924149 70.54061126708984,115.08348399400711 65.93424224853516,62.42641764879227 70.81159210205078,60.25872737169266 80.29529571533203,113.90928965806961 106.57864379882812,110.6577256321907 101.52070617675781,52.942733108997345 106.48834228515625,50.775035202503204 116.87525177001953,109.39323741197586 142.79733276367188,106.23201304674149 142.79733276367188,24.040038406848907"></polygon>
                    <polygon points="82.01138305664062,123.3929780125618 83.27587127685547,130.8895142674446 142.79733276367188,140.8247407078743 142.79733276367188,115.98668986558914 82.10169982910156,123.3929780125618"></polygon>
                  </g>
                </svg>
              )}
              <span className="button-text">
                {activeOAuth === 'riot' ? 'Connecting...' : (
                  <>
                    Sign up<span className="collapsed"> with Riot ID</span>
                  </>
                )}
              </span>
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

          {/* Clean Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                    maxLength: { value: 20, message: 'Username must be no more than 20 characters' },
                    pattern: {
                      value: /^[a-zA-Z0-9_-]+$/,
                      message: 'Username can only contain letters, numbers, underscores, and hyphens'
                    }
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                </div>
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Riot ID Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Riot ID <span className="text-gray-500">(Optional)</span></label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="PlayerName#TAG"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('riotId', {
                    pattern: {
                      value: /^.+#.+$/,
                      message: 'Riot ID must include # symbol (e.g., PlayerName#TAG)'
                    }
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Gamepad2 className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
              </div>
              {errors.riotId && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.riotId.message}
                </p>
              )}
              <p className="text-xs text-gray-500">Link your Riot account to sync stats and rank</p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    validate: (value) => {
                      const validation = ValidationUtils.validatePassword(value)
                      return validation.isValid || validation.errors[0]
                    }
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 backdrop-blur-20 hover:bg-gray-800/50"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start">
                <label className="relative inline-flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('acceptTerms', {
                      required: 'You must accept the terms and conditions'
                    })}
                  />
                  <div className="relative mt-1 w-4 h-4 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500/50 rounded peer peer-checked:after:scale-100 after:scale-0 after:content-['✓'] after:absolute after:top-0 after:left-0 after:w-4 after:h-4 after:text-white after:text-xs after:flex after:items-center after:justify-center after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ml-3 text-sm text-gray-300 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-400 hover:text-green-300 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-green-400 hover:text-green-300 underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Circle size={4} className="fill-current" />
                  {errors.acceptTerms.message}
                </p>
              )}
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
                    rgba(34, 197, 94, 0.8) 0%, 
                    rgba(34, 197, 94, 0.9) 100%
                  )
                `,
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
              }}
            >
              <div className="flex items-center justify-center gap-3 text-white">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4 pt-3 border-t border-gray-700/30">
            <p className="text-gray-400 text-xs">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-white hover:text-green-400 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Minimal decorative elements */}
          <div className="absolute top-2.5 right-4 w-1 h-1 bg-green-400/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

    </div>
  )
}

export default MinimalistRegisterForm
