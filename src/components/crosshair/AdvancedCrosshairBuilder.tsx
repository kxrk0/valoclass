'use client'

import { useState, useCallback, useEffect } from 'react'
import { Copy, Share2, Download, RotateCcw, Code, Eye, Zap, Target, Settings } from 'lucide-react'

// Complete Valorant Crosshair Settings Interface
interface ValorantCrosshairSettings {
  // Color Settings
  color: number // 0-7
  customColor: string
  
  // Outline Settings
  outline: boolean
  outlineOpacity: number // 0-1
  outlineThickness: number // 1-6
  
  // Center Dot Settings
  centerDot: boolean
  centerDotOpacity: number // 0-1
  centerDotThickness: number // 1-6
  
  // Inner Lines Settings
  innerLines: boolean
  innerLineOpacity: number // 0-1
  innerLineLength: number // 0-20
  innerLineThickness: number // 0-10
  innerLineOffset: number // 0-20
  
  // Outer Lines Settings
  outerLines: boolean
  outerLineOpacity: number // 0-1
  outerLineLength: number // 0-10
  outerLineThickness: number // 0-10
  outerLineOffset: number // 0-40
  
  // Error Settings
  movementError: boolean
  movementErrorMultiplier: number // 0-3
  firingError: boolean
  firingErrorMultiplier: number // 0-3
  
  // Profile Settings
  profile: 'primary' | 'ads' | 'sniper'
}

const AdvancedCrosshairBuilder = () => {
  const [settings, setSettings] = useState<ValorantCrosshairSettings>({
    color: 1,
    customColor: '#00ff00',
    outline: true,
    outlineOpacity: 0.5,
    outlineThickness: 1,
    centerDot: false,
    centerDotOpacity: 1,
    centerDotThickness: 2,
    innerLines: true,
    innerLineOpacity: 0.8,
    innerLineLength: 6,
    innerLineThickness: 2,
    innerLineOffset: 3,
    outerLines: true,
    outerLineOpacity: 0.35,
    outerLineLength: 2,
    outerLineThickness: 2,
    outerLineOffset: 10,
    movementError: false,
    movementErrorMultiplier: 1,
    firingError: false,
    firingErrorMultiplier: 1,
    profile: 'primary'
  })

  const [selectedBackground, setSelectedBackground] = useState(0)
  const [generatedCode, setGeneratedCode] = useState('')
  const [pasteCode, setPasteCode] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'inner' | 'outer' | 'advanced'>('general')

  // Valorant Colors
  const colors = [
    { name: 'White', value: '#ffffff', index: 0 },
    { name: 'Green', value: '#00ff00', index: 1 },
    { name: 'Yellow Green', value: '#80ff00', index: 2 },
    { name: 'Green Yellow', value: '#b3ff00', index: 3 },
    { name: 'Yellow', value: '#ffff00', index: 4 },
    { name: 'Cyan', value: '#00ffff', index: 5 },
    { name: 'Pink', value: '#ff00ff', index: 6 },
    { name: 'Red', value: '#ff0000', index: 7 },
    { name: 'Custom', value: settings.customColor, index: 8 }
  ]

  // Background options for preview
  const backgrounds = [
    { name: 'Dark', color: '#1a1a1a' },
    { name: 'Haven', color: '#8B7355' },
    { name: 'Bind', color: '#D4AF37' },
    { name: 'Split', color: '#556B2F' },
    { name: 'Ascent', color: '#708090' },
    { name: 'Icebox', color: '#E0FFFF' },
    { name: 'Breeze', color: '#87CEEB' },
    { name: 'Fracture', color: '#800080' },
    { name: 'Pearl', color: '#FFE4E1' }
  ]

  // Generate comprehensive Valorant code
  const generateValorantCode = useCallback((currentSettings: ValorantCrosshairSettings) => {
    const parts = [
      '0', 's', '1', 'P',
      'c', currentSettings.color.toString(),
      'u', currentSettings.customColor.replace('#', ''),
      'h', currentSettings.outline ? '1' : '0',
      'o', Math.round(currentSettings.outlineOpacity * 1000).toString(),
      't', currentSettings.outlineThickness.toString(),
      'd', currentSettings.centerDot ? '1' : '0',
      'a', Math.round(currentSettings.centerDotOpacity * 1000).toString(),
      'z', currentSettings.centerDotThickness.toString(),
      '0b', currentSettings.innerLines ? '1' : '0',
      '0a', Math.round(currentSettings.innerLineOpacity * 1000).toString(),
      '0l', currentSettings.innerLineLength.toString(),
      '0t', currentSettings.innerLineThickness.toString(),
      '0o', currentSettings.innerLineOffset.toString(),
      '0m', currentSettings.movementError ? '1' : '0',
      '0s', Math.round(currentSettings.movementErrorMultiplier * 1000).toString(),
      '0f', currentSettings.firingError ? '1' : '0',
      '0e', Math.round(currentSettings.firingErrorMultiplier * 1000).toString(),
      '1b', currentSettings.outerLines ? '1' : '0',
      '1a', Math.round(currentSettings.outerLineOpacity * 1000).toString(),
      '1l', currentSettings.outerLineLength.toString(),
      '1t', currentSettings.outerLineThickness.toString(),
      '1o', currentSettings.outerLineOffset.toString(),
      '1m', currentSettings.movementError ? '1' : '0',
      '1s', Math.round(currentSettings.movementErrorMultiplier * 1000).toString(),
      '1f', currentSettings.firingError ? '1' : '0',
      '1e', Math.round(currentSettings.firingErrorMultiplier * 1000).toString()
    ]
    return parts.join(';')
  }, [])

  // Parse comprehensive Valorant code
  const parseValorantCode = useCallback((code: string) => {
    try {
      const parts = code.split(';')
      const newSettings: Partial<ValorantCrosshairSettings> = {}

      for (let i = 0; i < parts.length; i += 2) {
        const key = parts[i]
        const value = parts[i + 1]

        switch (key) {
          case 'c': newSettings.color = parseInt(value) || 1; break
          case 'u': newSettings.customColor = '#' + value; break
          case 'h': newSettings.outline = value === '1'; break
          case 'o': newSettings.outlineOpacity = parseInt(value) / 1000; break
          case 't': newSettings.outlineThickness = parseInt(value); break
          case 'd': newSettings.centerDot = value === '1'; break
          case 'a': newSettings.centerDotOpacity = parseInt(value) / 1000; break
          case 'z': newSettings.centerDotThickness = parseInt(value); break
          case '0b': newSettings.innerLines = value === '1'; break
          case '0a': newSettings.innerLineOpacity = parseInt(value) / 1000; break
          case '0l': newSettings.innerLineLength = parseInt(value); break
          case '0t': newSettings.innerLineThickness = parseInt(value); break
          case '0o': newSettings.innerLineOffset = parseInt(value); break
          case '0m': newSettings.movementError = value === '1'; break
          case '0s': newSettings.movementErrorMultiplier = parseInt(value) / 1000; break
          case '0f': newSettings.firingError = value === '1'; break
          case '0e': newSettings.firingErrorMultiplier = parseInt(value) / 1000; break
          case '1b': newSettings.outerLines = value === '1'; break
          case '1a': newSettings.outerLineOpacity = parseInt(value) / 1000; break
          case '1l': newSettings.outerLineLength = parseInt(value); break
          case '1t': newSettings.outerLineThickness = parseInt(value); break
          case '1o': newSettings.outerLineOffset = parseInt(value); break
          case '1m': newSettings.movementError = value === '1'; break
          case '1s': newSettings.movementErrorMultiplier = parseInt(value) / 1000; break
          case '1f': newSettings.firingError = value === '1'; break
          case '1e': newSettings.firingErrorMultiplier = parseInt(value) / 1000; break
        }
      }

      setSettings(prev => ({ ...prev, ...newSettings }))
    } catch (error) {
      console.error('Error parsing code:', error)
    }
  }, [])

  useEffect(() => {
    setGeneratedCode(generateValorantCode(settings))
  }, [settings, generateValorantCode])

  const updateSetting = useCallback((key: keyof ValorantCrosshairSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePasteCode = () => {
    if (pasteCode.trim()) {
      parseValorantCode(pasteCode.trim())
      setPasteCode('')
    }
  }

  const resetSettings = () => {
    setSettings({
      color: 1,
      customColor: '#00ff00',
      outline: true,
      outlineOpacity: 0.5,
      outlineThickness: 1,
      centerDot: false,
      centerDotOpacity: 1,
      centerDotThickness: 2,
      innerLines: true,
      innerLineOpacity: 0.8,
      innerLineLength: 6,
      innerLineThickness: 2,
      innerLineOffset: 3,
      outerLines: true,
      outerLineOpacity: 0.35,
      outerLineLength: 2,
      outerLineThickness: 2,
      outerLineOffset: 10,
      movementError: false,
      movementErrorMultiplier: 1,
      firingError: false,
      firingErrorMultiplier: 1,
      profile: 'primary'
    })
  }

  // Enhanced Toggle Component
  const AdvancedToggle = ({ label, checked, onChange, description }: { 
    label: string, 
    checked: boolean, 
    onChange: (checked: boolean) => void,
    description?: string 
  }) => (
    <div className="glassmorphism-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-sm font-semibold text-white">{label}</label>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <button
          onClick={() => onChange(!checked)}
          className={`
            relative w-14 h-8 rounded-full transition-all duration-300 border-2 shadow-lg
            ${checked 
              ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 shadow-red-500/30' 
              : 'bg-gray-700 border-gray-600 shadow-gray-700/30'
            }
          `}
        >
          <div className={`
            absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg
            ${checked ? 'translate-x-7' : 'translate-x-1'}
          `} />
        </button>
      </div>
    </div>
  )

  // Advanced Slider Component
  const AdvancedSlider = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 1, 
    unit = '',
    description 
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step?: number
    unit?: string
    description?: string
  }) => {
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className="glassmorphism-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-semibold text-white">{label}</label>
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
          </div>
          <div className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-lg">
            <span className="text-sm font-bold text-red-300">
              {step < 1 ? value.toFixed(3) : value}{unit}
            </span>
          </div>
        </div>
        
        <div className="relative h-6 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500/60 to-red-400/60 rounded-lg transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg pointer-events-none border-2 border-white"
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        </div>
      </div>
    )
  }

  // Enhanced Crosshair Preview
  const EnhancedCrosshairPreview = () => {
    const selectedColor = settings.color === 8 ? settings.customColor : colors.find(c => c.index === settings.color)?.value || '#00ff00'
    
    return (
      <div className="glassmorphism-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-red-400">Live Preview</h3>
          <div className="flex gap-2">
            {backgrounds.map((bg, index) => (
              <button
                key={index}
                onClick={() => setSelectedBackground(index)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  selectedBackground === index 
                    ? 'border-red-400 scale-110' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: bg.color }}
                title={bg.name}
              />
            ))}
          </div>
        </div>
        
        <div 
          className="relative w-full h-80 rounded-lg border border-gray-700 overflow-hidden"
          style={{ backgroundColor: backgrounds[selectedBackground].color }}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Crosshair Rendering */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer Lines */}
              {settings.outerLines && (
                <>
                  {/* Top */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.outerLineLength * 4}px`,
                      height: `${settings.outerLineThickness}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.outerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginTop: `-${settings.innerLineLength * 2 + settings.outerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                  {/* Bottom */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.outerLineLength * 4}px`,
                      height: `${settings.outerLineThickness}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.outerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginTop: `${settings.innerLineLength * 2 + settings.outerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                  {/* Left */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.outerLineThickness}px`,
                      height: `${settings.outerLineLength * 4}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.outerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginLeft: `-${settings.innerLineLength * 2 + settings.outerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                  {/* Right */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.outerLineThickness}px`,
                      height: `${settings.outerLineLength * 4}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.outerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginLeft: `${settings.innerLineLength * 2 + settings.outerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                </>
              )}
              
              {/* Inner Lines */}
              {settings.innerLines && (
                <>
                  {/* Top */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.innerLineLength * 2}px`,
                      height: `${settings.innerLineThickness}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.innerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginTop: `-${settings.innerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                  {/* Bottom */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.innerLineLength * 2}px`,
                      height: `${settings.innerLineThickness}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.innerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginTop: `${settings.innerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                  {/* Left */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.innerLineThickness}px`,
                      height: `${settings.innerLineLength * 2}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.innerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginLeft: `-${settings.innerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                  {/* Right */}
                  <div 
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${settings.innerLineThickness}px`,
                      height: `${settings.innerLineLength * 2}px`,
                      backgroundColor: selectedColor,
                      opacity: settings.innerLineOpacity,
                      transform: 'translate(-50%, -50%)',
                      marginLeft: `${settings.innerLineOffset}px`,
                      outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                    }}
                  />
                </>
              )}
              
              {/* Center Dot */}
              {settings.centerDot && (
                <div 
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: `${settings.centerDotThickness * 2}px`,
                    height: `${settings.centerDotThickness * 2}px`,
                    backgroundColor: selectedColor,
                    opacity: settings.centerDotOpacity,
                    transform: 'translate(-50%, -50%)',
                    outline: settings.outline ? `${settings.outlineThickness}px solid rgba(0,0,0,${settings.outlineOpacity})` : 'none'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-flow 20s linear infinite'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-full">
            <Target className="text-red-400" size={20} />
            <span className="text-red-400 font-bold uppercase tracking-wider">Advanced Crosshair Studio</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Professional Builder
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create pixel-perfect crosshairs with professional-grade controls
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Preview Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              <EnhancedCrosshairPreview />
              
              {/* Code Section */}
              <div className="glassmorphism-card p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4">Valorant Code</h3>
                
                <div className="relative mb-4">
                  <textarea
                    value={generatedCode}
                    readOnly
                    rows={3}
                    className="w-full px-3 py-2 text-sm font-mono bg-gray-800/50 border border-gray-600 rounded-lg text-green-400 resize-none"
                  />
                  <button
                    onClick={copyCode}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {copySuccess ? '✓' : <Copy size={16} />}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={copyCode}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button
                    onClick={resetSettings}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
                
                {/* Import Section */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Import Code</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pasteCode}
                      onChange={(e) => setPasteCode(e.target.value)}
                      placeholder="Paste crosshair code..."
                      className="flex-1 px-3 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                    <button
                      onClick={handlePasteCode}
                      disabled={!pasteCode.trim()}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Code size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="xl:col-span-2">
            {/* Tab Navigation */}
            <div className="glassmorphism-card p-2 mb-6">
              <div className="flex gap-2">
                {[
                  { key: 'general' as const, label: 'General', icon: Settings },
                  { key: 'inner' as const, label: 'Inner Lines', icon: Target },
                  { key: 'outer' as const, label: 'Outer Lines', icon: Zap },
                  { key: 'advanced' as const, label: 'Advanced', icon: Eye }
                ].map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
                        ${activeTab === tab.key
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }
                      `}
                    >
                      <IconComponent size={16} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'general' && (
                <>
                  {/* Color Settings */}
                  <div className="glassmorphism-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Color Settings</h3>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {colors.slice(0, 8).map((color) => (
                        <button
                          key={color.index}
                          onClick={() => updateSetting('color', color.index)}
                          className={`
                            relative h-12 rounded-lg border-2 transition-all duration-300
                            ${settings.color === color.index 
                              ? 'border-red-400 scale-110 ring-2 ring-red-400/50' 
                              : 'border-gray-600 hover:border-gray-500'
                            }
                          `}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {settings.color === color.index && (
                            <div className="absolute inset-0 bg-white/20 rounded-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Color */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateSetting('color', 8)}
                        className={`
                          px-4 py-2 rounded-lg border-2 transition-all duration-300 font-medium
                          ${settings.color === 8 
                            ? 'border-red-400 bg-red-500/20 text-red-300' 
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }
                        `}
                      >
                        Custom
                      </button>
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-12 h-10 rounded-lg border-2 border-gray-600"
                      />
                      <input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white font-mono text-sm"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Basic Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdvancedToggle 
                      label="Outline" 
                      checked={settings.outline} 
                      onChange={(checked) => updateSetting('outline', checked)}
                      description="Dark border around crosshair elements"
                    />
                    <AdvancedToggle 
                      label="Center Dot" 
                      checked={settings.centerDot} 
                      onChange={(checked) => updateSetting('centerDot', checked)}
                      description="Small dot at the center"
                    />
                  </div>

                  {/* Outline Settings */}
                  {settings.outline && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdvancedSlider 
                        label="Outline Opacity" 
                        value={settings.outlineOpacity}
                        onChange={(value) => updateSetting('outlineOpacity', value)}
                        min={0} 
                        max={1} 
                        step={0.01}
                        description="Transparency of the outline"
                      />
                      <AdvancedSlider 
                        label="Outline Thickness" 
                        value={settings.outlineThickness}
                        onChange={(value) => updateSetting('outlineThickness', value)}
                        min={1} 
                        max={6}
                        unit="px"
                        description="Width of the outline border"
                      />
                    </div>
                  )}

                  {/* Center Dot Settings */}
                  {settings.centerDot && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AdvancedSlider 
                        label="Center Dot Opacity" 
                        value={settings.centerDotOpacity}
                        onChange={(value) => updateSetting('centerDotOpacity', value)}
                        min={0} 
                        max={1} 
                        step={0.01}
                        description="Transparency of the center dot"
                      />
                      <AdvancedSlider 
                        label="Center Dot Thickness" 
                        value={settings.centerDotThickness}
                        onChange={(value) => updateSetting('centerDotThickness', value)}
                        min={1} 
                        max={6}
                        unit="px"
                        description="Size of the center dot"
                      />
                    </div>
                  )}
                </>
              )}

              {activeTab === 'inner' && (
                <>
                  <AdvancedToggle 
                    label="Show Inner Lines" 
                    checked={settings.innerLines} 
                    onChange={(checked) => updateSetting('innerLines', checked)}
                    description="Main crosshair lines closest to center"
                  />
                  
                  {settings.innerLines && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdvancedSlider 
                          label="Inner Line Opacity" 
                          value={settings.innerLineOpacity}
                          onChange={(value) => updateSetting('innerLineOpacity', value)}
                          min={0} 
                          max={1} 
                          step={0.01}
                          description="Transparency of inner lines"
                        />
                        <AdvancedSlider 
                          label="Inner Line Length" 
                          value={settings.innerLineLength}
                          onChange={(value) => updateSetting('innerLineLength', value)}
                          min={0} 
                          max={20}
                          unit="px"
                          description="Length of inner lines"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdvancedSlider 
                          label="Inner Line Thickness" 
                          value={settings.innerLineThickness}
                          onChange={(value) => updateSetting('innerLineThickness', value)}
                          min={0} 
                          max={10}
                          unit="px"
                          description="Width of inner lines"
                        />
                        <AdvancedSlider 
                          label="Inner Line Offset" 
                          value={settings.innerLineOffset}
                          onChange={(value) => updateSetting('innerLineOffset', value)}
                          min={0} 
                          max={20}
                          unit="px"
                          description="Distance from center"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'outer' && (
                <>
                  <AdvancedToggle 
                    label="Show Outer Lines" 
                    checked={settings.outerLines} 
                    onChange={(checked) => updateSetting('outerLines', checked)}
                    description="Secondary crosshair lines further from center"
                  />
                  
                  {settings.outerLines && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdvancedSlider 
                          label="Outer Line Opacity" 
                          value={settings.outerLineOpacity}
                          onChange={(value) => updateSetting('outerLineOpacity', value)}
                          min={0} 
                          max={1} 
                          step={0.01}
                          description="Transparency of outer lines"
                        />
                        <AdvancedSlider 
                          label="Outer Line Length" 
                          value={settings.outerLineLength}
                          onChange={(value) => updateSetting('outerLineLength', value)}
                          min={0} 
                          max={10}
                          unit="px"
                          description="Length of outer lines"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdvancedSlider 
                          label="Outer Line Thickness" 
                          value={settings.outerLineThickness}
                          onChange={(value) => updateSetting('outerLineThickness', value)}
                          min={0} 
                          max={10}
                          unit="px"
                          description="Width of outer lines"
                        />
                        <AdvancedSlider 
                          label="Outer Line Offset" 
                          value={settings.outerLineOffset}
                          onChange={(value) => updateSetting('outerLineOffset', value)}
                          min={0} 
                          max={40}
                          unit="px"
                          description="Distance from inner lines"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'advanced' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdvancedToggle 
                      label="Movement Error" 
                      checked={settings.movementError} 
                      onChange={(checked) => updateSetting('movementError', checked)}
                      description="Lines expand when moving"
                    />
                    <AdvancedToggle 
                      label="Firing Error" 
                      checked={settings.firingError} 
                      onChange={(checked) => updateSetting('firingError', checked)}
                      description="Lines expand when firing"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settings.movementError && (
                      <AdvancedSlider 
                        label="Movement Error Multiplier" 
                        value={settings.movementErrorMultiplier}
                        onChange={(value) => updateSetting('movementErrorMultiplier', value)}
                        min={0} 
                        max={3} 
                        step={0.01}
                        description="How much lines expand when moving"
                      />
                    )}
                    
                    {settings.firingError && (
                      <AdvancedSlider 
                        label="Firing Error Multiplier" 
                        value={settings.firingErrorMultiplier}
                        onChange={(value) => updateSetting('firingErrorMultiplier', value)}
                        min={0} 
                        max={3} 
                        step={0.01}
                        description="How much lines expand when firing"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glassmorphism-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          box-shadow: 
            0 0 30px rgba(239, 68, 68, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        
        input[type="range"]::-webkit-slider-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default AdvancedCrosshairBuilder

