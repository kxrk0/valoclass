'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { ValidationUtils } from '@/lib/validation'

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  riotId?: string
  acceptTerms: boolean
}

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  
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
      
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Registration Successful!</h2>
        <p className="text-gray-400 mb-4">
          Your account has been created successfully. You will be redirected to the login page.
        </p>
        <div className="loading-spinner mx-auto"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card">
        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter your username"
              className="pl-10"
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
          </div>
          {errors.username && (
            <div className="form-error">{errors.username.message}</div>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="pl-10"
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
            <div className="form-error">{errors.email.message}</div>
          )}
        </div>

        {/* Riot ID (Optional) */}
        <div className="form-group">
          <label>Riot ID (Optional)</label>
          <input
            type="text"
            placeholder="PlayerName#TAG"
            {...register('riotId', {
              pattern: {
                value: /^.+#.+$/,
                message: 'Riot ID must include # symbol (e.g., PlayerName#TAG)'
              }
            })}
          />
          {errors.riotId && (
            <div className="form-error">{errors.riotId.message}</div>
          )}
          <div className="form-help">
            Link your Riot account to automatically sync your stats and rank
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              className="pl-10 pr-10"
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="form-error">{errors.password.message}</div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="pl-10 pr-10"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="form-error">{errors.confirmPassword.message}</div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="form-group">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptTerms"
              className="mt-1 mr-3"
              {...register('acceptTerms', {
                required: 'You must accept the terms and conditions'
              })}
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-300 cursor-pointer">
              I agree to the{' '}
              <Link href="/terms" className="text-yellow-400 hover:text-yellow-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <div className="form-error">{errors.acceptTerms.message}</div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-md">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </form>
  )
}

export default RegisterForm
