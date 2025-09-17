'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    // console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Something went wrong!
        </h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working on a fix.
        </p>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try again
          </button>
          
          <Link href="/" className="w-full btn btn-secondary flex items-center justify-center gap-2">
            <Home size={18} />
            Go home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-gray-800 rounded-lg text-left">
            <summary className="text-sm text-gray-400 cursor-pointer mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-red-400 overflow-auto">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
