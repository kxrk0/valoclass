'use client'

import { useState, useCallback, useEffect } from 'react'
import { Play, Target, Zap, Crosshair, ArrowLeft, X, Clock, Users } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import dynamic from 'next/dynamic'

// Dynamically import the 3D component to avoid SSR issues
const AimTrainer3D = dynamic(() => import('@/components/aim-trainer/AimTrainer3D'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen bg-black flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
    </div>
  )
})

interface GameMode {
  id: string
  name: string
  description: string
  icon: any
  color: string
  valorantSkill: string
  difficulty: string
  players: string
}

interface Target {
  id: string
  position: [number, number, number]
  scale: number
  color: string
  isHit: boolean
  lifetime: number
}

interface GameState {
  score: number
  accuracy: number
  targetsHit: number
  targetsMissed: number
  timeLeft: number
  gameActive: boolean
  targets: any[]
  consecutiveHits: number
  lastHitTime: number
}

interface GameSettings {
  // Mouse & Sensitivity (Valorant Style - No DPI)
  sensitivity: number
  
  // Game Settings
  gameDuration: number
  
  // Crosshair Settings
  crosshairColor: string
  crosshairSize: number
  crosshairThickness: number
  crosshairOpacity: number
  crosshairGap: number
  centerDot: boolean
  centerDotSize: number
  centerDotOpacity: number
  outlineEnabled: boolean
  outlineThickness: number
  outlineOpacity: number
  crosshairStyle: 'cross' | 'dot' | 'circle' | 't-style'
  
  // Target Settings
  targetColor: string
  targetHitEffects: boolean
  targetOutline: boolean
  targetOpacity: number
  
  // Audio Settings
  hitSoundType: 'aimlabs' | 'kovaaks' | 'classic' | 'off'
  hitSoundVolume: number
  masterVolume: number
  
  // Visual Settings
  backgroundColor: string
}

const gameModes: GameMode[] = [
  {
    id: 'gridshot',
    name: 'Gridshot',
    description: 'Classic clicking training with targets appearing in a grid pattern. Perfect for improving your flick accuracy and speed.',
    icon: Target,
    color: 'from-red-500 to-orange-500',
    valorantSkill: 'Rifling',
    difficulty: 'Easy',
    players: '2.1M'
  },
  {
    id: 'tracking',
    name: 'Tracking',
    description: 'Follow moving targets to improve your tracking accuracy. Essential for agents like Reyna and Jett.',
    icon: Crosshair,
    color: 'from-blue-500 to-cyan-500',
    valorantSkill: 'Spraying',
    difficulty: 'Medium',
    players: '1.8M'
  },
  {
    id: 'flicking',
    name: 'Flicking',
    description: 'Quick target acquisition training. Perfect for one-taps and entry fragging situations.',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    valorantSkill: 'Flicking',
    difficulty: 'Hard',
    players: '1.2M'
  }
]

export default function AimTrainerPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPauseMenu, setShowPauseMenu] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [settings, setSettings] = useState<GameSettings>({
    // Mouse & Sensitivity (Valorant Default - No DPI)
    sensitivity: 0.4,
    
    // Game Settings
    gameDuration: 60,
    
    // Crosshair Settings
    crosshairColor: 'rgb(0, 255, 0)',
    crosshairSize: 4,
    crosshairThickness: 2,
    crosshairOpacity: 1.0,
    crosshairGap: 2,
    centerDot: true,
    centerDotSize: 2,
    centerDotOpacity: 1.0,
    outlineEnabled: true,
    outlineThickness: 1,
    outlineOpacity: 0.8,
    crosshairStyle: 'cross',
    
    // Target Settings
    targetColor: 'rgb(255, 71, 87)',
    targetHitEffects: true,
    targetOutline: true,
    targetOpacity: 1.0,
    
    // Audio Settings
    hitSoundType: 'aimlabs',
    hitSoundVolume: 0.8,
    masterVolume: 0.7,
    
    // Visual Settings
    backgroundColor: 'rgb(10, 10, 10)'
  })

  const handleGameUpdate = useCallback((newGameState: GameState) => {
    setGameState(newGameState)
    if (!newGameState.gameActive && newGameState.timeLeft === 0) {
      setTimeout(() => setGameStarted(false), 2000)
    }
  }, [])

  // ESC key handler for pause menu
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && gameStarted) {
        setShowPauseMenu(!showPauseMenu)
        setIsPaused(!showPauseMenu)
        
        // Pause/Resume game
        if (typeof window !== 'undefined') {
          if (!showPauseMenu && (window as any).pauseAimGame) {
            (window as any).pauseAimGame()
          } else if (showPauseMenu && (window as any).resumeAimGame) {
            (window as any).resumeAimGame()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, showPauseMenu])

  // Animation trigger
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleStartGame = () => {
    if (isStarting) return // Prevent double clicks
    
    setIsStarting(true)
    setGameStarted(true)
    
    // Reset starting state after animation
    setTimeout(() => setIsStarting(false), 1000)
  }

  const handleBackToModes = () => {
    setGameStarted(false)
    setSelectedMode(null)
    setGameState(null)
    setShowPauseMenu(false)
    setIsPaused(false)
  }

  const handleResume = () => {
    setShowPauseMenu(false)
    setIsPaused(false)
    if (typeof window !== 'undefined' && (window as any).resumeAimGame) {
      (window as any).resumeAimGame()
    }
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
    setShowPauseMenu(false)
  }

  const handleSettingsChange = (key: keyof GameSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      
      // Apply settings to the game engine
      if (typeof window !== 'undefined' && (window as any).updateAimGameSettings) {
        (window as any).updateAimGameSettings(newSettings)
      }
      
      return newSettings
    })
  }

  // Mode Selection Page
  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header />

        {/* Hero Section */}
        <div className="pt-32 pb-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-semibold">Professional Aim Training</span>
          </div>
          
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            Choose Your <span className="text-red-500">Training</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Select a training mode to enhance your Valorant skills. Each mode targets specific aspects of aim improvement.
          </p>
        </div>

        {/* Game Modes */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {gameModes.map((mode, index) => (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode)}
                className="group relative cursor-pointer bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color} bg-opacity-20 border border-white/10`}>
                    <mode.icon size={24} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Play size={12} />
                    <span className="text-xs font-medium">{mode.players}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{mode.name}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{mode.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Target size={14} />
                    <span>{mode.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{mode.players}</span>
                  </div>
                </div>

                {/* Skill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-medium">{mode.valorantSkill}</span>
                </div>

                {/* Hover Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${mode.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity -z-10`} />
              </div>
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  // Game Playing Page - Simplified
  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Simple UI Overlay - Only Back Button and Game Stats */}
      {gameStarted && (
        <div className="absolute inset-x-0 top-0 z-50 pointer-events-none">
          <div className="flex justify-between items-start p-6 pointer-events-auto">
            <button
              onClick={handleBackToModes}
              className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white hover:bg-black/90 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Modes
            </button>

            {/* Minimal Game Stats */}
            {gameState && (
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/40 rounded-xl px-6 py-3">
                <div className="flex items-center gap-6 text-center text-sm">
                  <div>
                    <div className="text-cyan-400 font-bold text-lg">{gameState.score}</div>
                    <div className="text-gray-400">Score</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold text-lg">{Math.round(gameState.accuracy)}%</div>
                    <div className="text-gray-400">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-orange-400 font-bold text-lg">{gameState.timeLeft}s</div>
                    <div className="text-gray-400">Time</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern ESC Pause Menu */}
      {showPauseMenu && gameStarted && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95 backdrop-blur-xl z-50 flex items-center justify-center">
          <div className="relative max-w-lg w-full mx-4">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-purple-500/10 to-blue-500/20 rounded-3xl blur-xl"></div>
            
            {/* Main Container */}
            <div className="relative bg-black/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <Target size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Game Paused</h2>
                <p className="text-gray-400">Take a break or adjust your settings</p>
              </div>
              
              {/* Modern Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleResume}
                  className="group w-full relative overflow-hidden py-5 px-8 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">🎮 Resume Game</span>
                </button>
                
                <button
                  onClick={handleOpenSettings}
                  className="group w-full relative overflow-hidden py-5 px-8 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">⚙️ Settings</span>
                </button>
                
                <button
                  onClick={handleBackToModes}
                  className="group w-full relative overflow-hidden py-5 px-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">🏠 Back to Menu</span>
                </button>
              </div>
              
              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">Keep practicing to improve your aim!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowSettings(false)}
          />
          
          {/* Compact Settings Container */}
          <div className="relative w-full max-w-4xl">
            <div className="bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
              {/* Simple Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white/70 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Compact Content - No Scroll */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Sensitivity */}
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-red-400">⚡</span>
                      <h3 className="text-white font-semibold">Sensitivity</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-gray-300 text-sm">Valorant Sensitivity</label>
                          <span className="text-cyan-400 font-bold text-sm">{settings.sensitivity}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.01"
                          value={settings.sensitivity}
                          onChange={(e) => handleSettingsChange('sensitivity', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0.1</span>
                          <span>3.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Crosshair */}
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-purple-400">✛</span>
                      <h3 className="text-white font-semibold">Crosshair</h3>
                    </div>
                    
                    {/* Simple Crosshair Preview */}
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-300 text-sm">Preview</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="relative w-full h-24 flex items-center justify-center bg-black/40 rounded border border-gray-700">
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'radial-gradient(circle, rgb(51, 51, 51) 1px, transparent 1px)',
                          backgroundSize: '8px 8px'
                        }}></div>
                        
                        {/* Preview crosshair - exact same calculations as trainer */}
                        {settings.crosshairStyle === 'cross' && (
                          <>
                            {/* Top line */}
                            <div 
                              style={{
                                width: `${settings.crosshairSize * 3}px`,
                                height: `${settings.crosshairThickness}px`,
                                backgroundColor: settings.crosshairColor,
                                opacity: settings.crosshairOpacity,
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginTop: `-${settings.crosshairGap + settings.crosshairThickness/2}px`
                              }}
                            />
                            {/* Bottom line */}
                            <div 
                              style={{
                                width: `${settings.crosshairSize * 3}px`,
                                height: `${settings.crosshairThickness}px`,
                                backgroundColor: settings.crosshairColor,
                                opacity: settings.crosshairOpacity,
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginTop: `${settings.crosshairGap + settings.crosshairThickness/2}px`
                              }}
                            />
                            {/* Left line */}
                            <div 
                              style={{
                                width: `${settings.crosshairThickness}px`,
                                height: `${settings.crosshairSize * 3}px`,
                                backgroundColor: settings.crosshairColor,
                                opacity: settings.crosshairOpacity,
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginLeft: `-${settings.crosshairGap + settings.crosshairThickness/2}px`
                              }}
                            />
                            {/* Right line */}
                            <div 
                              style={{
                                width: `${settings.crosshairThickness}px`,
                                height: `${settings.crosshairSize * 3}px`,
                                backgroundColor: settings.crosshairColor,
                                opacity: settings.crosshairOpacity,
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                marginLeft: `${settings.crosshairGap + settings.crosshairThickness/2}px`
                              }}
                            />
                          </>
                        )}
                        
                        {settings.crosshairStyle === 'dot' && (
                          <div 
                            style={{
                              width: `${settings.crosshairSize * 2}px`,
                              height: `${settings.crosshairSize * 2}px`,
                              backgroundColor: settings.crosshairColor,
                              opacity: settings.crosshairOpacity,
                              borderRadius: '50%',
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        )}
                        
                        {settings.crosshairStyle === 'circle' && (
                          <div 
                            style={{
                              width: `${settings.crosshairSize * 4}px`,
                              height: `${settings.crosshairSize * 4}px`,
                              border: `${settings.crosshairThickness}px solid ${settings.crosshairColor}`,
                              opacity: settings.crosshairOpacity,
                              borderRadius: '50%',
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'transparent'
                            }}
                          />
                        )}
                        
                        {/* Center dot - always rendered if enabled, regardless of style */}
                        {settings.centerDot && (
                          <div 
                            style={{
                              width: `${settings.centerDotSize}px`,
                              height: `${settings.centerDotSize}px`,
                              backgroundColor: settings.crosshairColor,
                              opacity: settings.centerDotOpacity,
                              borderRadius: '50%',
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Simple Controls */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-300 text-sm mb-2 block">Style</label>
                          <select
                            value={settings.crosshairStyle}
                            onChange={(e) => handleSettingsChange('crosshairStyle', e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          >
                            <option value="cross">Cross</option>
                            <option value="dot">Dot</option>
                            <option value="circle">Circle</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-gray-300 text-sm mb-2 block">Color</label>
                          <input
                            type="color"
                            value={settings.crosshairColor}
                            onChange={(e) => handleSettingsChange('crosshairColor', e.target.value)}
                            className="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-300 text-sm">Size</label>
                            <span className="text-cyan-400 text-sm font-bold">{settings.crosshairSize}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={settings.crosshairSize}
                            onChange={(e) => handleSettingsChange('crosshairSize', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer slider"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-300 text-sm">Thickness</label>
                            <span className="text-cyan-400 text-sm font-bold">{settings.crosshairThickness}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            step="0.5"
                            value={settings.crosshairThickness}
                            onChange={(e) => handleSettingsChange('crosshairThickness', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-300 text-sm">Gap</label>
                            <span className="text-cyan-400 text-sm font-bold">{settings.crosshairGap}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={settings.crosshairGap}
                            onChange={(e) => handleSettingsChange('crosshairGap', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer slider"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-300 text-sm">Opacity</label>
                            <span className="text-cyan-400 text-sm font-bold">{Math.round(settings.crosshairOpacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={settings.crosshairOpacity}
                            onChange={(e) => handleSettingsChange('crosshairOpacity', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                        <span className="text-gray-300 text-sm">Center Dot</span>
                        <button
                          onClick={() => handleSettingsChange('centerDot', !settings.centerDot)}
                          className={`w-10 h-6 rounded-full relative transition-colors ${settings.centerDot ? 'bg-purple-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.centerDot ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      
                      {settings.centerDot && (
                        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-700/30 rounded">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-gray-400 text-xs">Dot Size</label>
                              <span className="text-cyan-400 text-xs font-bold">{settings.centerDotSize}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="8"
                              step="0.5"
                              value={settings.centerDotSize}
                              onChange={(e) => handleSettingsChange('centerDotSize', parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-gray-600 rounded appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-gray-400 text-xs">Dot Opacity</label>
                              <span className="text-cyan-400 text-xs font-bold">{Math.round(settings.centerDotOpacity * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.1"
                              value={settings.centerDotOpacity}
                              onChange={(e) => handleSettingsChange('centerDotOpacity', parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-gray-600 rounded appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                
                {/* Bottom Row - Audio & Target */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Audio Section */}
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-green-400">🔊</span>
                      <h3 className="text-white font-semibold">Audio</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-300 text-sm mb-2 block">Hit Sound</label>
                        <select
                          value={settings.hitSoundType}
                          onChange={(e) => handleSettingsChange('hitSoundType', e.target.value)}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        >
                          <option value="aimlabs">Aim Labs</option>
                          <option value="kovaaks">Kovaaks</option>
                          <option value="classic">Classic</option>
                          <option value="off">Off</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).testHitSound) {
                            (window as any).testHitSound()
                          }
                        }}
                        className="w-full py-2 px-3 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded transition-colors"
                      >
                        🎵 Test Sound
                      </button>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-gray-300 text-sm">Volume</label>
                          <span className="text-cyan-400 text-sm font-bold">{Math.round(settings.masterVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={settings.masterVolume}
                          onChange={(e) => handleSettingsChange('masterVolume', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target Color Only */}
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-orange-400">🎯</span>
                      <h3 className="text-white font-semibold">Target</h3>
                    </div>
                    
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Target Color</label>
                      <input
                        type="color"
                        value={settings.targetColor}
                        onChange={(e) => handleSettingsChange('targetColor', e.target.value)}
                        className="w-full h-12 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Footer */}
              <div className="border-t border-gray-700/50 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Settings automatically saved</span>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click Anywhere to Start */}
      {!gameStarted && (
        <div 
          onClick={handleStartGame}
          className="absolute inset-0 flex items-center justify-center z-40 cursor-pointer"
        >
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">{selectedMode.name} Training</h1>
              <p className="text-gray-300 text-lg">{selectedMode.description}</p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
              <button className="relative bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-12 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
                <Play size={24} className="inline mr-3" />
                Click to Start Training
              </button>
            </div>
            
            <p className="text-gray-500 mt-6 text-sm">Press ESC anytime to pause</p>
          </div>
        </div>
      )}

      {/* 3D Game Component */}
      {selectedMode && (
        <AimTrainer3D 
          gameMode={selectedMode.id}
          gameStarted={gameStarted}
          isPaused={isPaused}
          onGameUpdate={handleGameUpdate}
          settings={settings}
        />
      )}
    </div>
  )
}