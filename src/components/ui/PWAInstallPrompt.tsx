'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installPWA } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    setIsDismissed(dismissed === 'true')

    // Show prompt after a delay if installable and not dismissed
    if (isInstallable && !isDismissed && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isDismissed, isInstalled])

  const handleInstall = async () => {
    const success = await installPWA()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  const handleDismissTemporary = () => {
    setShowPrompt(false)
  }

  if (!showPrompt || isInstalled || !isInstallable) {
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
        {/* Prompt Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom duration-300 md:animate-in md:zoom-in">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Install ValoClass</h3>
                <p className="text-gray-400 text-sm">Add to your home screen</p>
              </div>
            </div>
            <button
              onClick={handleDismissTemporary}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-300">
              <Smartphone size={16} className="text-yellow-400" />
              <span className="text-sm">Quick access from your home screen</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Monitor size={16} className="text-yellow-400" />
              <span className="text-sm">Works offline with cached content</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Download size={16} className="text-yellow-400" />
              <span className="text-sm">Fast loading and native app feel</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Not Now
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            You can always install the app later from your browser menu
          </p>
        </div>
      </div>
    </>
  )
}

export default PWAInstallPrompt
