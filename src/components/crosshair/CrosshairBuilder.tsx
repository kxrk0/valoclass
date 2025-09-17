'use client'

import { useState, useCallback } from 'react'
import { Copy, Download, Share2, Save, Palette } from 'lucide-react'
import CrosshairPreview from './CrosshairPreview'
import CrosshairControls from './CrosshairControls'
import type { CrosshairSettings } from '@/types'

const defaultSettings: CrosshairSettings = {
  color: '#00ff00',
  outlines: true,
  outlineOpacity: 0.5,
  outlineThickness: 1,
  centerDot: false,
  centerDotOpacity: 1,
  centerDotThickness: 2,
  innerLines: true,
  innerLineOpacity: 1,
  innerLineLength: 6,
  innerLineThickness: 2,
  innerLineOffset: 3,
  outerLines: false,
  outerLineOpacity: 0.35,
  outerLineLength: 2,
  outerLineThickness: 2,
  outerLineOffset: 10,
  movementError: 0,
  firingError: 0,
}

const CrosshairBuilder = () => {
  const [settings, setSettings] = useState<CrosshairSettings>(defaultSettings)
  const [shareCode, setShareCode] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const updateSetting = useCallback((key: keyof CrosshairSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const generateShareCode = useCallback(() => {
    // Convert settings to a compressed base64 string
    const compressed = btoa(JSON.stringify(settings))
    const code = `VALO-${compressed.slice(0, 12).toUpperCase()}`
    setShareCode(code)
    return code
  }, [settings])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      console.log('Copied to clipboard:', text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const saveCrosshair = async () => {
    setIsSaving(true)
    try {
      // Here you would save to your backend
      const code = generateShareCode()
      console.log('Saved crosshair with code:', code)
      // Show success message
    } catch (error) {
      console.error('Failed to save crosshair:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'valorant-crosshair.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const presetCrosshairs = [
    {
      name: 'Classic',
      settings: { ...defaultSettings, innerLineLength: 6, innerLineThickness: 2 }
    },
    {
      name: 'Dot Only',
      settings: { ...defaultSettings, innerLines: false, centerDot: true, centerDotThickness: 3 }
    },
    {
      name: 'Pro Style',
      settings: { 
        ...defaultSettings, 
        innerLineLength: 4, 
        innerLineThickness: 1,
        outlineThickness: 0,
        outlines: false
      }
    },
    {
      name: 'Dynamic',
      settings: { 
        ...defaultSettings, 
        outerLines: true,
        movementError: 1,
        firingError: 1
      }
    }
  ]

  return (
    <div className="space-y-4">
      {/* Compact Header with Actions */}
      <div 
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl mb-1">Builder</h2>
            <p className="text-sm text-gray-400">Design your perfect crosshair</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSettings(defaultSettings)}
              className="px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              Reset
            </button>
            <button
              onClick={exportSettings}
              className="px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={() => {
                const code = generateShareCode()
                setShowShareModal(true)
              }}
              className="px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
              style={{
                background: 'linear-gradient(135deg, #f0db4f 0%, #f59e0b 100%)',
                color: '#000',
                border: '1px solid rgba(240, 219, 79, 0.3)'
              }}
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Optimized Main Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Preview - Smaller but prominent */}
        <div className="lg:col-span-2">
          <div 
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <Palette size={16} />
              Preview
            </h3>
            <div className="flex justify-center">
              <CrosshairPreview settings={settings} size="medium" />
            </div>
          </div>
        </div>

        {/* Controls - Takes more space */}
        <div className="lg:col-span-3">
          <CrosshairControls 
            settings={settings} 
            updateSetting={updateSetting}
          />
        </div>
      </div>

      {/* Compact Presets */}
      <div 
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <h3 className="font-semibold text-base mb-3">Quick Presets</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {presetCrosshairs.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSettings(preset.settings)}
              className="p-2 rounded-lg transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="text-xs font-medium mb-1 text-gray-300">{preset.name}</div>
              <div className="w-full h-8 bg-gray-900/50 rounded flex items-center justify-center">
                <CrosshairPreview settings={preset.settings} size="small" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Improved Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-md w-full rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Share Crosshair</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Share Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareCode}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(shareCode)}
                    className="px-3 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #f0db4f 0%, #f59e0b 100%)',
                      color: '#000'
                    }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg">
                Share this code with friends or paste it in-game to import your crosshair settings.
              </div>
              
              <button
                onClick={saveCrosshair}
                disabled={isSaving}
                className="w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #f0db4f 0%, #f59e0b 100%)',
                  color: '#000'
                }}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save to Gallery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrosshairBuilder
