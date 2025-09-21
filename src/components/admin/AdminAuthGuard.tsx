'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingOverlay } from '@/components/ui/LoadingSpinner'
import { useNotifications } from '@/contexts/NotificationContext'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    email: string
    displayName?: string
    avatar?: string
    role: string
    isVerified: boolean
    isPremium: boolean
    lastLoginAt?: string
    createdAt: string
    accounts: Array<{
      provider: string
      createdAt: string
    }>
  }
  session?: {
    id: string
    lastActivity: string
    deviceInfo?: any
    ipAddress?: string
    isAdminSession: boolean
    expiresAt: string
    createdAt: string
  }
  permissions?: {
    isAdmin: boolean
    isModerator: boolean
    canAccessAdmin: boolean
    canModerate: boolean
  }
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { success, error: showError } = useNotifications()

  // Backend-centric authentication check
  const checkAuthWithBackend = async (showFailureMessage = true) => {
    try {
      console.log('🔍 AdminAuthGuard: Checking auth with backend...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data: AuthResponse = await response.json()

      if (!response.ok || !data.success) {
        console.log('❌ Backend auth check failed:', data.message)
        
        if (showFailureMessage && response.status !== 401) {
          showError('Auth Error', `Authentication failed: ${data.message}`)
        }
        
        setIsAuthenticated(false)
        router.push('/admin/login')
        return
      }

      // Validate admin permissions
      if (!data.permissions?.canAccessAdmin) {
        console.log('❌ User does not have admin privileges')
        showError('Access Denied', 'You do not have admin privileges')
        setIsAuthenticated(false)
        router.push('/admin/login')
        return
      }

      console.log('✅ Backend auth check successful:', {
        username: data.user?.username,
        role: data.user?.role,
        isAdmin: data.permissions?.isAdmin,
        sessionId: data.session?.id
      })

      setUser(data.user)
      setIsAuthenticated(true)

    } catch (error) {
      console.error('❌ Backend auth check error:', error)
      showError('Auth Error', 'Failed to verify authentication')
      setIsAuthenticated(false)
      router.push('/admin/login')
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AdminAuthGuard: Starting auth check...')
      
      // Check for OAuth success parameter (backend-centric)
      const adminLogin = searchParams.get('admin_login')
      
      if (adminLogin === 'success') {
        setIsProcessingOAuth(true)
        
        try {
          // Clean URL parameters
          const cleanUrl = new URL(window.location.href)
          cleanUrl.searchParams.delete('admin_login')
          window.history.replaceState({}, '', cleanUrl.toString())

          // Give a small delay for cookies to be set properly
          await new Promise(resolve => setTimeout(resolve, 500))

          // Check auth with backend (cookies should be set) - don't show error for 401
          await checkAuthWithBackend(false)
          
          if (user) {
            success('Welcome!', `Admin login successful: ${user.username}`)
          }
          setIsProcessingOAuth(false)
          return
          
        } catch (error) {
          console.error('Error processing OAuth:', error)
          showError('Login Failed', 'OAuth authentication was not completed properly. Please try again.')
          setIsProcessingOAuth(false)
          setIsAuthenticated(false)
          router.push('/admin/login?error=oauth_failed')
          return
        }
      }

      // Check for force logout parameter
      const forceLogout = searchParams.get('clearAuth')
      if (forceLogout === 'true') {
        console.log('🔄 Force logout requested...')
        
        try {
          // Call backend logout endpoint
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
          })
        } catch (error) {
          console.error('Logout API error:', error)
        }
        
        // Clean URL
        const cleanUrl = new URL(window.location.href)
        cleanUrl.searchParams.delete('clearAuth')
        window.history.replaceState({}, '', cleanUrl.toString())
        
        setIsAuthenticated(false)
        router.push('/admin/login')
        return
      }

      // Default: Check authentication with backend
      await checkAuthWithBackend(false)
    }

    checkAuth()
  }, [router, searchParams, success, showError])

  // Show loading while checking authentication
  if (isAuthenticated === null || isProcessingOAuth) {
    return (
      <LoadingOverlay 
        message={isProcessingOAuth ? "Processing login..." : "Verifying admin access..."} 
        type="admin" 
      />
    )
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <LoadingOverlay 
        message="Redirecting to login..." 
        type="admin" 
      />
    )
  }

  // Render protected content
  return <>{children}</>
}

export default AdminAuthGuard
