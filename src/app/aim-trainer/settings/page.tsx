'use client'

import { useState, useEffect } from 'react'
import { Settings, Volume2, VolumeX, Monitor, Gamepad2, Target, Crosshair, Save, RotateCcw } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface AimTrainerSettings {
  // Mouse & Sensitivity (Valorant Style)
  sensitivity: number
  dpi: number
  eDPI: number
  cm360: number
  pollRate: number
  rawInput: boolean
  mouseAcceleration: boolean
  windowsSensitivity: number
  aimingMode: 'hold' | 'toggle'
  mouseSensitivityMultiplier: number

  // Display Settings
  fov: number
  resolution: string
  fullscreen: boolean
  vsync: boolean
  frameRate: number
  aspectRatio: string
  brightness: number
  contrast: number

  // Audio Settings
  masterVolume: number
  sfxVolume: number
  musicVolume: number
  hitSounds: boolean
  missedSounds: boolean
  streakSounds: boolean
  spatialAudio: boolean
  hitSoundType: 'classic' | 'modern' | 'valorant' | 'aimlabs'
  
  // Target Settings
  targetColor: string
  targetSize: number
  targetHitEffects: boolean
  targetOutline: boolean
  targetOpacity: number
  hitmarker: boolean
  hitmarkerColor: string
  hitmarkerSize: number
  
  // Crosshair Settings
  crosshairColor: string
  crosshairSize: number
  crosshairOpacity: number
  crosshairThickness: number
  centerDot: boolean
  centerDotSize: number
  outlineEnabled: boolean
  outlineThickness: number
  dynamicCrosshair: boolean
  crosshairGap: number
  crosshairLength: number
  
  // Game Mode Settings
  gameMode: 'gridshot' | 'tracking' | 'flicking' | 'precision'
  gameDuration: number
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  
  // Performance
  particleEffects: boolean
  bloomEffects: boolean
  shadows: boolean
  antiAliasing: string
  textureQuality: string
  renderDistance: number
  fpsCap: number
  
  // Advanced Settings
  preRender: number
  gpuScheduling: boolean
  multiThreading: boolean
  reducedMotion: boolean
}

const defaultSettings: AimTrainerSettings = {
  // Mouse & Sensitivity (Valorant Style)
  sensitivity: 0.4,
  dpi: 800,
  eDPI: 320,
  cm360: 41.25,
  pollRate: 1000,
  rawInput: true,
  mouseAcceleration: false,
  windowsSensitivity: 6,
  aimingMode: 'hold',
  mouseSensitivityMultiplier: 1.0,
  
  // Display Settings
  fov: 103,
  resolution: '1920x1080',
  fullscreen: true,
  vsync: false,
  frameRate: 144,
  aspectRatio: '16:9',
  brightness: 100,
  contrast: 100,
  
  // Audio Settings
  masterVolume: 80,
  sfxVolume: 70,
  musicVolume: 30,
  hitSounds: true,
  missedSounds: true,
  streakSounds: true,
  spatialAudio: false,
  hitSoundType: 'aimlabs',
  
  // Target Settings
  targetColor: '#ff4757',
  targetSize: 0.3,
  targetHitEffects: true,
  targetOutline: false,
  targetOpacity: 100,
  hitmarker: true,
  hitmarkerColor: '#ffffff',
  hitmarkerSize: 8,
  
  // Crosshair Settings
  crosshairColor: '#00ff00',
  crosshairSize: 1.0,
  crosshairOpacity: 100,
  crosshairThickness: 2,
  centerDot: true,
  centerDotSize: 2,
  outlineEnabled: true,
  outlineThickness: 1,
  dynamicCrosshair: false,
  crosshairGap: 0,
  crosshairLength: 10,
  
  // Game Mode Settings
  gameMode: 'gridshot',
  gameDuration: 60,
  difficulty: 'medium',
  
  // Performance
  particleEffects: true,
  bloomEffects: true,
  shadows: true,
  antiAliasing: 'MSAA 4x',
  textureQuality: 'High',
  renderDistance: 100,
  fpsCap: 240,
  
  // Advanced Settings
  preRender: 1,
  gpuScheduling: true,
  multiThreading: true,
  reducedMotion: false
}

export default function AimTrainerSettingsPage() {
  const [settings, setSettings] = useState<AimTrainerSettings>(defaultSettings)
  const [isVisible, setIsVisible] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('aimTrainerSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  // Valorant sensitivity calculator (exact formula)
  const calculateSensitivityMetrics = (dpi: number, sens: number, winSens: number = 6) => {
    // Windows sensitivity multiplier (exactly like Valorant)
    const winMultiplier = winSens === 6 ? 1.0 : winSens / 6
    const effectiveDPI = dpi * sens * winMultiplier
    // Valorant uses 0.0022 multiplier (not 0.022)
    const cm360 = (2.54 * 360) / (effectiveDPI * 0.0022)
    const inches360 = cm360 / 2.54
    
    return { 
      eDPI: Math.round(effectiveDPI), 
      cm360: Math.round(cm360 * 100) / 100,
      inches360: Math.round(inches360 * 100) / 100
    }
  }

  const updateSetting = <K extends keyof AimTrainerSettings>(
    key: K,
    value: AimTrainerSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      
      // Auto-calculate sensitivity metrics when DPI or sensitivity changes
      if (key === 'dpi' || key === 'sensitivity' || key === 'windowsSensitivity') {
        const metrics = calculateSensitivityMetrics(
          key === 'dpi' ? value as number : newSettings.dpi,
          key === 'sensitivity' ? value as number : newSettings.sensitivity,
          key === 'windowsSensitivity' ? value as number : newSettings.windowsSensitivity
        )
        newSettings.eDPI = metrics.eDPI
        newSettings.cm360 = metrics.cm360
      }
      
      return newSettings
    })
    setHasChanges(true)
  }

  const saveSettings = () => {
    localStorage.setItem('aimTrainerSettings', JSON.stringify(settings))
    setHasChanges(false)
    // Show success notification
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const resolutionOptions = [
    '1920x1080', '2560x1440', '3840x2160', '1680x1050', '1440x900', '1280x720'
  ]

  const frameRateOptions = [60, 75, 120, 144, 165, 240, 360]
  const antiAliasingOptions = ['Off', 'FXAA', 'MSAA 2x', 'MSAA 4x', 'MSAA 8x']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Dynamic Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 0, 84, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 84, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 84, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-flow 30s linear infinite'
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              <div className={`w-2 h-2 ${i % 4 === 0 ? 'bg-red-400/30' : i % 4 === 1 ? 'bg-cyan-400/30' : i % 4 === 2 ? 'bg-purple-400/30' : 'bg-pink-400/30'} rounded-full`} />
            </div>
          ))}
        </div>
      </div>

      <Header />
      
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Aim Trainer <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Fine-tune your training experience for optimal performance
            </p>
          </div>

          {/* Save/Reset Actions */}
          <div className={`flex justify-center gap-4 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <button
              onClick={saveSettings}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                hasChanges 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 shadow-lg'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save size={20} />
              Save Settings
            </button>
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <RotateCcw size={20} />
              Reset to Default
            </button>
          </div>

          {/* Settings Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Mouse & Input Settings */}
            <div 
              className={`p-8 rounded-2xl transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Gamepad2 className="text-cyan-400" size={24} />
                Mouse & Input
              </h2>
              
              <div className="space-y-6">
                {/* Valorant Style Sensitivity */}
                <div className="p-4 bg-gray-800/30 rounded-xl border border-purple-500/30">
                  <h3 className="text-purple-300 font-semibold mb-4 flex items-center gap-2">
                    <Target size={16} />
                    Valorant Sensitivity Calculator
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        In-Game Sensitivity: {settings.sensitivity}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.01"
                        value={settings.sensitivity}
                        onChange={(e) => updateSetting('sensitivity', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Mouse DPI: {settings.dpi}
                      </label>
                      <input
                        type="range"
                        min="400"
                        max="3200"
                        step="50"
                        value={settings.dpi}
                        onChange={(e) => updateSetting('dpi', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                      <p className="text-cyan-300 text-xs font-bold">eDPI</p>
                      <p className="text-white text-lg font-black">{settings.eDPI}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <p className="text-purple-300 text-xs font-bold">CM/360°</p>
                      <p className="text-white text-lg font-black">{settings.cm360}</p>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-green-300 text-xs font-bold">Windows</p>
                      <p className="text-white text-lg font-black">{settings.windowsSensitivity}/11</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Windows Sensitivity: {settings.windowsSensitivity}/11
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="11"
                    step="1"
                    value={settings.windowsSensitivity}
                    onChange={(e) => updateSetting('windowsSensitivity', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>6/11 (Recommended)</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Polling Rate: {settings.pollRate}Hz
                  </label>
                  <select
                    value={settings.pollRate}
                    onChange={(e) => updateSetting('pollRate', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value={125}>125Hz</option>
                    <option value={250}>250Hz</option>
                    <option value={500}>500Hz</option>
                    <option value={1000}>1000Hz</option>
                    <option value={2000}>2000Hz</option>
                    <option value={4000}>4000Hz</option>
                    <option value={8000}>8000Hz</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Raw Input</span>
                  <button
                    onClick={() => updateSetting('rawInput', !settings.rawInput)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.rawInput ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.rawInput ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mouse Acceleration</span>
                  <button
                    onClick={() => updateSetting('mouseAcceleration', !settings.mouseAcceleration)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.mouseAcceleration ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.mouseAcceleration ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div 
              className={`p-8 rounded-2xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Monitor className="text-purple-400" size={24} />
                Display
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    FOV: {settings.fov}°
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    step="1"
                    value={settings.fov}
                    onChange={(e) => updateSetting('fov', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Resolution</label>
                  <select
                    value={settings.resolution}
                    onChange={(e) => updateSetting('resolution', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-purple-400 transition-colors"
                  >
                    {resolutionOptions.map(res => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Frame Rate</label>
                  <select
                    value={settings.frameRate}
                    onChange={(e) => updateSetting('frameRate', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-purple-400 transition-colors"
                  >
                    {frameRateOptions.map(fps => (
                      <option key={fps} value={fps}>{fps} FPS</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Fullscreen</span>
                  <button
                    onClick={() => updateSetting('fullscreen', !settings.fullscreen)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.fullscreen ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.fullscreen ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">V-Sync</span>
                  <button
                    onClick={() => updateSetting('vsync', !settings.vsync)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.vsync ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.vsync ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Settings */}
            <div 
              className={`p-8 rounded-2xl transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Volume2 className="text-green-400" size={24} />
                Audio
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Master Volume: {settings.masterVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.masterVolume}
                    onChange={(e) => updateSetting('masterVolume', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    SFX Volume: {settings.sfxVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.sfxVolume}
                    onChange={(e) => updateSetting('sfxVolume', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Music Volume: {settings.musicVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.musicVolume}
                    onChange={(e) => updateSetting('musicVolume', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Hit Sound Type
                  </label>
                  <select
                    value={settings.hitSoundType}
                    onChange={(e) => updateSetting('hitSoundType', e.target.value as any)}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="valorant">Valorant</option>
                    <option value="aimlabs">Aim Labs</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hit Sounds</span>
                    <button
                      onClick={() => updateSetting('hitSounds', !settings.hitSounds)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.hitSounds ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.hitSounds ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Miss Sounds</span>
                    <button
                      onClick={() => updateSetting('missedSounds', !settings.missedSounds)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.missedSounds ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.missedSounds ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Streak Sounds</span>
                    <button
                      onClick={() => updateSetting('streakSounds', !settings.streakSounds)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.streakSounds ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.streakSounds ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Spatial Audio</span>
                    <button
                      onClick={() => updateSetting('spatialAudio', !settings.spatialAudio)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.spatialAudio ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.spatialAudio ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Settings */}
            <div 
              className={`p-8 rounded-2xl transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(220, 38, 38, 0.2)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="text-red-400" size={24} />
                Target Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Target Color: <span className="text-white font-bold">{settings.targetColor}</span>
                  </label>
                  <input
                    type="color"
                    value={settings.targetColor}
                    onChange={(e) => updateSetting('targetColor', e.target.value)}
                    className="w-full h-12 bg-gray-900/50 border border-gray-700 rounded-xl cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Target Size: <span className="text-white font-bold">{settings.targetSize.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={settings.targetSize}
                    onChange={(e) => updateSetting('targetSize', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Target Opacity: <span className="text-white font-bold">{settings.targetOpacity}%</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={settings.targetOpacity}
                    onChange={(e) => updateSetting('targetOpacity', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Hitmarker Color: <span className="text-white font-bold">{settings.hitmarkerColor}</span>
                  </label>
                  <input
                    type="color"
                    value={settings.hitmarkerColor}
                    onChange={(e) => updateSetting('hitmarkerColor', e.target.value)}
                    className="w-full h-12 bg-gray-900/50 border border-gray-700 rounded-xl cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Hitmarker Size: <span className="text-white font-bold">{settings.hitmarkerSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="2"
                    value={settings.hitmarkerSize}
                    onChange={(e) => updateSetting('hitmarkerSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hit Effects</span>
                    <button
                      onClick={() => updateSetting('targetHitEffects', !settings.targetHitEffects)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.targetHitEffects ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.targetHitEffects ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Target Outline</span>
                    <button
                      onClick={() => updateSetting('targetOutline', !settings.targetOutline)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.targetOutline ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.targetOutline ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hitmarker</span>
                    <button
                      onClick={() => updateSetting('hitmarker', !settings.hitmarker)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        settings.hitmarker ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.hitmarker ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Crosshair Settings */}
            <div 
              className={`p-8 rounded-2xl transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Crosshair className="text-red-400" size={24} />
                Crosshair
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.crosshairColor}
                      onChange={(e) => updateSetting('crosshairColor', e.target.value)}
                      className="w-16 h-10 rounded-lg border-2 border-gray-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.crosshairColor}
                      onChange={(e) => updateSetting('crosshairColor', e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-purple-400 transition-colors"
                      placeholder="#00ff00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Size: {settings.crosshairSize}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={settings.crosshairSize}
                    onChange={(e) => updateSetting('crosshairSize', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Opacity: {Math.round(settings.crosshairOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.crosshairOpacity}
                    onChange={(e) => updateSetting('crosshairOpacity', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Thickness: {settings.crosshairThickness}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={settings.crosshairThickness}
                    onChange={(e) => updateSetting('crosshairThickness', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Center Dot</span>
                  <button
                    onClick={() => updateSetting('centerDot', !settings.centerDot)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.centerDot ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.centerDot ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Outline</span>
                  <button
                    onClick={() => updateSetting('outlineEnabled', !settings.outlineEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.outlineEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        settings.outlineEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Crosshair Preview */}
                <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <p className="text-gray-300 text-sm mb-3">Preview:</p>
                  <div className="w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center relative">
                    {/* Crosshair Preview */}
                    <div className="relative">
                      {/* Horizontal line */}
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          width: `${settings.crosshairSize * 20}px`,
                          height: `${settings.crosshairThickness}px`,
                          backgroundColor: settings.crosshairColor,
                          opacity: settings.crosshairOpacity,
                          outline: settings.outlineEnabled ? '1px solid rgba(0, 0, 0, 0.8)' : 'none'
                        }}
                      />
                      {/* Vertical line */}
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          width: `${settings.crosshairThickness}px`,
                          height: `${settings.crosshairSize * 20}px`,
                          backgroundColor: settings.crosshairColor,
                          opacity: settings.crosshairOpacity,
                          outline: settings.outlineEnabled ? '1px solid rgba(0, 0, 0, 0.8)' : 'none'
                        }}
                      />
                      {/* Center dot */}
                      {settings.centerDot && (
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{
                            width: `${settings.crosshairThickness * 2}px`,
                            height: `${settings.crosshairThickness * 2}px`,
                            backgroundColor: settings.crosshairColor,
                            opacity: settings.crosshairOpacity,
                            outline: settings.outlineEnabled ? '1px solid rgba(0, 0, 0, 0.8)' : 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
