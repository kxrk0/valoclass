'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Settings, Pause, Play, RotateCcw } from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'

// Dynamically import 3D component to avoid SSR issues
const AimTrainer3D = dynamic(
  () => import('@/components/aim-trainer/AimTrainer3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading 3D Environment...</p>
        </div>
      </div>
    )
  }
)

interface GameSettings {
  sensitivity: number
  fov: number
  targetSize: number
  gameDuration: number
  crosshairColor: string
  crosshairSize: number
}

interface GameState {
  score: number
  accuracy: number
  targetsHit: number
  targetsMissed: number
  timeLeft: number
  gameActive: boolean
  targets: any[]
}

const defaultSettings: GameSettings = {
  sensitivity: 2.5,
  fov: 103,
  targetSize: 1.0,
  gameDuration: 60,
  crosshairColor: '#00ff00',
  crosshairSize: 1.0
}

const gameModeConfig = {
  gridshot: {
    name: 'Gridshot',
    description: 'Click targets as fast as possible',
    duration: 60,
    color: 'from-red-400 to-red-600',
    valorantSkill: 'Entry Fragging'
  },
  tracking: {
    name: 'Tracking',
    description: 'Follow moving targets with your crosshair',
    duration: 60,
    color: 'from-blue-400 to-blue-600',
    valorantSkill: 'Spray Control'
  },
  flicking: {
    name: 'Flicking',
    description: 'Quick flick shots to random targets',
    duration: 60,
    color: 'from-orange-400 to-orange-600',
    valorantSkill: 'Flick Shots'
  }
}

export default function AimTrainerPlayPage() {
  const params = useParams()
  const router = useRouter()
  const mode = params?.mode as string

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const currentMode = gameModeConfig[mode as keyof typeof gameModeConfig]

  useEffect(() => {
    if (!currentMode) {
      router.push('/aim-trainer')
    }
  }, [mode, currentMode, router])

  useEffect(() => {
    if (currentMode) {
      setSettings(prev => ({
        ...prev,
        gameDuration: currentMode.duration
      }))
    }
  }, [currentMode])

  const handleGameUpdate = useCallback((newGameState: GameState) => {
    setGameState(newGameState)
    if (!newGameState.gameActive && newGameState.timeLeft === 0) {
      // Game ended, save results
      console.log('Game ended with state:', newGameState)
    }
  }, [])

  const handleStartGame = () => {
    setGameStarted(true)
    setIsPaused(false)
    // Start the actual 3D game timer
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).startAimGame) {
        (window as any).startAimGame()
      }
    }, 100) // Small delay to ensure 3D component is ready
  }

  const handlePauseGame = () => {
    const newPausedState = !isPaused
    setIsPaused(newPausedState)
    
    // Pause/Resume the actual 3D game timer
    if (typeof window !== 'undefined') {
      if (newPausedState && (window as any).pauseAimGame) {
        (window as any).pauseAimGame()
      } else if (!newPausedState && (window as any).resumeAimGame) {
        (window as any).resumeAimGame()
      }
    }
  }

  const handleRestartGame = () => {
    setGameStarted(false)
    setGameState(null)
    setTimeout(() => {
      setGameStarted(true)
      // Start the actual 3D game timer after restart
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).startAimGame) {
          (window as any).startAimGame()
        }
      }, 100)
    }, 100)
  }

  const handleSettingsChange = (key: keyof GameSettings, value: number | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!currentMode) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Header - hidden in game mode for full immersion */}
      {(!gameStarted || showSettings) && <Header />}
      
      {/* Game UI Overlay */}
      <div className="absolute inset-x-0 top-0 z-50 p-4">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          {/* Back button */}
          <button
            onClick={() => router.push('/aim-trainer')}
            className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 bg-black/60 backdrop-blur-lg border border-red-500/30 rounded-xl text-white hover:bg-black/80 transition-all duration-200 z-50"
          >
            <ArrowLeft size={16} className="lg:w-[18px] lg:h-[18px]" />
            <span className="text-xs lg:text-sm font-medium">BACK</span>
          </button>

          {/* Game Controls */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            {gameStarted && (
              <>
                <button
                  onClick={handlePauseGame}
                  className="p-2 lg:p-3 bg-black/60 backdrop-blur-lg border border-gray-600/50 rounded-xl text-white hover:bg-black/80 transition-all duration-200"
                >
                  {isPaused ? <Play size={16} className="lg:w-[18px] lg:h-[18px]" /> : <Pause size={16} className="lg:w-[18px] lg:h-[18px]" />}
                </button>
                <button
                  onClick={handleRestartGame}
                  className="p-2 lg:p-3 bg-black/60 backdrop-blur-lg border border-gray-600/50 rounded-xl text-white hover:bg-black/80 transition-all duration-200"
                >
                  <RotateCcw size={16} className="lg:w-[18px] lg:h-[18px]" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 lg:p-3 bg-black/60 backdrop-blur-lg border border-cyan-500/30 rounded-xl text-white hover:bg-black/80 transition-all duration-200"
            >
              <Settings size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Game Mode Info - Only show before game starts with smooth transition */}
        <div className={`flex justify-center transition-all duration-700 ease-out ${!gameStarted ? 'mb-4 opacity-100 transform translate-y-0' : 'mb-0 opacity-0 transform -translate-y-8 pointer-events-none'}`}>
          <div className="bg-black/70 backdrop-blur-xl border border-red-500/40 rounded-xl lg:rounded-2xl px-4 lg:px-8 py-3 lg:py-4 text-center mx-4">
            <div className={`text-xl lg:text-3xl font-black bg-gradient-to-r ${currentMode.color} bg-clip-text text-transparent mb-1 lg:mb-2`}>
              {currentMode.name.toUpperCase()}
            </div>
            <div className="text-gray-300 text-xs lg:text-sm font-medium tracking-wide">
              {currentMode.valorantSkill}
            </div>
          </div>
        </div>

        {/* Game Stats - Separate Container with smooth entrance */}
        {gameState && gameStarted && !isPaused && (
          <div className="flex justify-center">
            <div className="bg-black/70 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 max-w-md w-full mx-4 transform transition-all duration-500 ease-out opacity-100 translate-y-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-center">
                <div className="px-2 lg:px-3">
                  <div className="text-xs text-gray-400 font-medium tracking-wide mb-1">SCORE</div>
                  <div className="text-lg lg:text-xl font-bold text-cyan-400 transition-all duration-300">{gameState.score.toLocaleString()}</div>
                </div>
                <div className="px-2 lg:px-3 lg:border-l lg:border-gray-700/50">
                  <div className="text-xs text-gray-400 font-medium tracking-wide mb-1">ACCURACY</div>
                  <div className="text-lg lg:text-xl font-bold text-purple-400 transition-all duration-300">{gameState.accuracy.toFixed(1)}%</div>
                </div>
                <div className="px-2 lg:px-3 border-t lg:border-t-0 lg:border-l lg:border-gray-700/50 pt-2 lg:pt-0">
                  <div className="text-xs text-gray-400 font-medium tracking-wide mb-1">TIME</div>
                  <div className="text-lg lg:text-xl font-bold text-red-400 transition-all duration-300">{gameState.timeLeft}s</div>
                </div>
                <div className="px-2 lg:px-3 border-t lg:border-t-0 lg:border-l lg:border-gray-700/50 pt-2 lg:pt-0">
                  <div className="text-xs text-gray-400 font-medium tracking-wide mb-1">HITS</div>
                  <div className="text-lg lg:text-xl font-bold text-green-400 transition-all duration-300">{gameState.targetsHit}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Valorant-style Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="w-full max-w-lg mx-4">
            {/* Settings Header */}
            <div className="bg-gradient-to-r from-red-500/20 to-cyan-400/20 border border-red-500/30 rounded-t-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">GAME SETTINGS</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-lg bg-black/40 border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-400 transition-all"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="bg-black/80 border-x border-red-500/30 backdrop-blur-sm p-6 space-y-6">
              
              {/* Valorant Sensitivity Section */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-400">
                <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  VALORANT SENSITIVITY
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Sensitivity: <span className="text-cyan-400 font-bold">{settings.sensitivity}</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.05"
                      value={settings.sensitivity}
                      onChange={(e) => handleSettingsChange('sensitivity', parseFloat(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.1</span>
                      <span>5.0</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      FOV: <span className="text-cyan-400 font-bold">{settings.fov}°</span>
                    </label>
                    <input
                      type="range"
                      min="75"
                      max="110"
                      step="1"
                      value={settings.fov}
                      onChange={(e) => handleSettingsChange('fov', parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>75</span>
                      <span>110</span>
                    </div>
                  </div>
                </div>

                {/* DPI Info */}
                <div className="mt-4 p-3 bg-black/40 rounded-lg border border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated eDPI:</span>
                    <span className="text-white font-bold">{(settings.sensitivity * 800).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">cm/360°:</span>
                    <span className="text-white font-bold">{(2.54 * 360 / (settings.sensitivity * 800 * 0.0022)).toFixed(1)} cm</span>
                  </div>
                </div>
              </div>

              {/* Target & Crosshair Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30">
                  <h4 className="text-blue-400 font-semibold mb-3 text-sm">TARGET</h4>
                  <label className="block text-gray-300 text-xs mb-2">
                    Size: <span className="text-blue-400 font-bold">{settings.targetSize}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={settings.targetSize}
                    onChange={(e) => handleSettingsChange('targetSize', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30">
                  <h4 className="text-green-400 font-semibold mb-3 text-sm">CROSSHAIR</h4>
                  <label className="block text-gray-300 text-xs mb-2">
                    Size: <span className="text-green-400 font-bold">{settings.crosshairSize}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.crosshairSize}
                    onChange={(e) => handleSettingsChange('crosshairSize', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <div className="mt-3">
                    <label className="block text-gray-300 text-xs mb-2">Color</label>
                    <input
                      type="color"
                      value={settings.crosshairColor}
                      onChange={(e) => handleSettingsChange('crosshairColor', e.target.value)}
                      className="w-full h-8 bg-gray-800 border border-gray-600 rounded-md cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Footer */}
            <div className="bg-gradient-to-r from-red-500/20 to-cyan-400/20 border border-red-500/30 rounded-b-2xl p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  Optimized for <span className="text-red-400 font-semibold">VALORANT</span>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false)
                    if (gameStarted) handleRestartGame()
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm"
                >
                  APPLY & CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Game Screen */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center z-30">
          <div className="text-center">
            <div className={`inline-flex p-6 rounded-3xl mb-8 bg-gradient-to-r ${currentMode.color}`}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
            
            <h1 className={`text-6xl font-black mb-4 bg-gradient-to-r ${currentMode.color} bg-clip-text text-transparent`}>
              {currentMode.name}
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              {currentMode.description}
            </p>
            
            <button
              onClick={handleStartGame}
              className={`px-12 py-4 bg-gradient-to-r ${currentMode.color} text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl`}
            >
              Start Training
            </button>
          </div>
        </div>
      )}

      {/* Pause Screen */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Game Paused</h2>
            <div className="flex space-x-4">
              <button
                onClick={handlePauseGame}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300"
              >
                Resume
              </button>
              <button
                onClick={() => router.push('/aim-trainer')}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Game Component */}
      {gameStarted && !isPaused && !showSettings && (
        <Suspense fallback={
          <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl">Loading 3D Environment...</p>
            </div>
          </div>
        }>
          <AimTrainer3D
            gameMode={mode}
            onGameUpdate={handleGameUpdate}
            settings={settings}
          />
        </Suspense>
      )}
    </div>
  )
}
