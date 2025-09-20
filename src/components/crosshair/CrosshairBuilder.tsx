'use client'

import { useState, useCallback, useEffect } from 'react'
import { Copy, Download, Share2, Save, Palette, Import, Code, Shuffle, Users, X, Check, AlertCircle, Settings } from 'lucide-react'
import CrosshairPreview from './CrosshairPreview'
import CrosshairControls from './CrosshairControls'
import type { ValorantCrosshairSettings } from '@/types'
import { 
  DEFAULT_VALORANT_CROSSHAIR, 
  encodeValorantCrosshair, 
  decodeValorantCrosshair,
  isValidValorantCode,
  generateShareCode,
  getColorFromType,
  validateCrosshairAccuracy,
  PRO_PRESETS
} from '@/utils/valorantCrosshair'

// Import test utilities for development validation
if (process.env.NODE_ENV === 'development') {
  import('@/utils/testCrosshairAccuracy')
}

const CrosshairBuilder = () => {
  const [profileSettings, setProfileSettings] = useState({
    general: { ...DEFAULT_VALORANT_CROSSHAIR, profile: 0 },
    primary: { ...DEFAULT_VALORANT_CROSSHAIR, profile: 1 },
    ads: { ...DEFAULT_VALORANT_CROSSHAIR, profile: 2 },
    sniper: { ...DEFAULT_VALORANT_CROSSHAIR, profile: 3 }
  })
  const [activeProfile, setActiveProfile] = useState<'general' | 'primary' | 'ads' | 'sniper'>('general')
  const [shareCode, setShareCode] = useState('')
  const [valorantCode, setValorantCode] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [showPresets, setShowPresets] = useState(false)
  const [copySuccess, setCopySuccess] = useState('')
  const [importError, setImportError] = useState('')
  const [codeAccuracy, setCodeAccuracy] = useState(true)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  const [communityForm, setCommunityForm] = useState({
    name: '',
    description: '',
    tags: '',
    isPublic: true
  })

  // Get current profile settings
  const settings = profileSettings[activeProfile]

  // Update codes when settings change
  useEffect(() => {
    const newValorantCode = encodeValorantCrosshair(settings)
    const newShareCode = generateShareCode(settings)
    const isAccurate = validateCrosshairAccuracy(settings)
    
    setValorantCode(newValorantCode)
    setShareCode(newShareCode)
    setCodeAccuracy(isAccurate)
    
    // Log validation result for debugging
    if (!isAccurate) {
      console.warn('Crosshair code accuracy validation failed for settings:', settings)
    }
  }, [settings])

  const updateSetting = useCallback((key: keyof ValorantCrosshairSettings, value: string | number | boolean) => {
    setProfileSettings(prev => ({
      ...prev,
      [activeProfile]: {
        ...prev[activeProfile],
        [key]: value
      }
    }))
  }, [activeProfile])

  const generateRandomCrosshair = useCallback(() => {
    const randomSettings: ValorantCrosshairSettings = {
      ...DEFAULT_VALORANT_CROSSHAIR,
      profile: settings.profile,
      colorType: Math.floor(Math.random() * 7),
      innerLineLength: Math.floor(Math.random() * 15) + 2,
      innerLineThickness: Math.floor(Math.random() * 5) + 1,
      innerLineOffset: Math.floor(Math.random() * 10) + 1,
      centerDot: Math.random() > 0.5,
      centerDotThickness: Math.floor(Math.random() * 8) + 2,
      outlines: Math.random() > 0.3,
      outlineThickness: Math.floor(Math.random() * 3) + 1,
      movementError: Math.random() > 0.7,
      firingError: Math.random() > 0.7,
    }
    setProfileSettings(prev => ({
      ...prev,
      [activeProfile]: randomSettings
    }))
  }, [activeProfile, settings.profile])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleImportCode = () => {
    if (!importCode.trim()) {
      setImportError('Please enter a code')
      return
    }

    if (isValidValorantCode(importCode)) {
      const decodedSettings = decodeValorantCrosshair(importCode)
      setProfileSettings(prev => ({
        ...prev,
        [activeProfile]: { ...decodedSettings, profile: settings.profile }
      }))
      setShowImportModal(false)
      setImportCode('')
      setImportError('')
    } else {
      setImportError('Invalid Valorant crosshair code format')
    }
  }

  const loadPreset = (preset: typeof PRO_PRESETS[0]) => {
    setProfileSettings(prev => ({
      ...prev,
      [activeProfile]: { ...preset.settings, profile: settings.profile }
    }))
    setShowPresets(false)
  }

  const saveCrosshair = async () => {
    setIsSaving(true)
    try {
      // Here you would save to your backend
      console.log('Saved crosshair with code:', shareCode)
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

  const profileConfigs = [
    { key: 'general' as const, name: 'General', icon: '⊕', description: 'Default crosshair' },
    { key: 'primary' as const, name: 'Primary', icon: '🎯', description: 'Primary weapons' },
    { key: 'ads' as const, name: 'ADS', icon: '🔍', description: 'Aim down sight' },
    { key: 'sniper' as const, name: 'Sniper', icon: '🎯', description: 'Sniper scopes' }
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Profile Selector */}
      <div 
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-2 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              Crosshair Builder
            </h2>
            <p className="text-sm text-gray-400">Create your perfect Valorant crosshair with accurate in-game codes</p>
          </div>
          
          {/* Profile Selector */}
          <div className="flex gap-2">
            {profileConfigs.map((profile) => (
              <button
                key={profile.key}
                onClick={() => setActiveProfile(profile.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeProfile === profile.key
                    ? 'bg-gradient-to-r from-yellow-400 to-red-400 text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                title={profile.description}
              >
                <span className="mr-2">{profile.icon}</span>
                {profile.name}
              </button>
            ))}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setProfileSettings(prev => ({
              ...prev,
              [activeProfile]: { ...DEFAULT_VALORANT_CROSSHAIR, profile: settings.profile }
            }))}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300"
          >
            Reset
          </button>
          
          <button
            onClick={generateRandomCrosshair}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Shuffle size={16} />
            Random
          </button>
          
          <button
            onClick={() => {
              const centerDotOnly = {
                ...DEFAULT_VALORANT_CROSSHAIR,
                profile: activeProfile === 'general' ? 0 : activeProfile === 'primary' ? 1 : activeProfile === 'ads' ? 2 : 3,
                centerDot: true,
                centerDotThickness: 3,
                centerDotOpacity: 1,
                innerLines: false,
                innerLineLength: 0,
                outerLines: false,
                outerLineLength: 0,
                movementError: false,
                firingError: false
              }
              setProfileSettings(prev => ({
                ...prev,
                [activeProfile]: centerDotOnly
              }))
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 text-red-300 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-red-300 rounded-full"></div>
            Dot Only
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Import size={16} />
            Import
          </button>

          <button
            onClick={() => setShowPresets(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Users size={16} />
            Pro Presets
          </button>

          <button
            onClick={exportSettings}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-yellow-400 to-red-400 text-black flex items-center gap-2"
          >
            <Share2 size={16} />
            Share & Codes
          </button>
          
          <button
            onClick={() => setShowCommunityModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center gap-2"
          >
            <Users size={16} />
            Share to Community
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div 
            className="rounded-2xl p-4 h-fit sticky top-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <Palette size={18} />
              Live Preview
            </h3>
            <div className="flex justify-center mb-3">
              <CrosshairPreview settings={settings} size="medium" />
            </div>
            
            {/* Quick Info */}
            <div className="text-xs text-gray-400 space-y-2 bg-gray-800/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Profile:</span>
                <span className="capitalize font-medium text-yellow-400">{activeProfile}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Style:</span>
                <span className="font-medium">
                  {settings.innerLines && settings.centerDot ? 'Lines + Dot' :
                   settings.innerLines ? 'Lines Only' :
                   settings.centerDot ? 'Dot Only' : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dynamic:</span>
                <span className={`font-medium ${settings.movementError || settings.firingError ? 'text-green-400' : 'text-gray-500'}`}>
                  {settings.movementError || settings.firingError ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Color:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-600"
                    style={{ backgroundColor: getColorFromType(settings.colorType, settings.customColor) }}
                  />
                  <span className="text-xs">{getColorFromType(settings.colorType, settings.customColor)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Accuracy:</span>
                <div className="flex items-center gap-1">
                  {codeAccuracy ? (
                    <>
                      <Check size={12} className="text-green-400" />
                      <span className="text-xs text-green-400 font-medium">100%</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} className="text-red-400" />
                      <span className="text-xs text-red-400 font-medium">Error</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="lg:col-span-2">
          <CrosshairControls 
            settings={settings} 
            updateSetting={updateSetting}
            profile={activeProfile}
          />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-2xl w-full rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl">Share Crosshair</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Code Accuracy Indicator */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                codeAccuracy 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {codeAccuracy ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span className="text-sm text-green-400 font-medium">100% Valorant Accurate</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Code Validation Failed</span>
                  </>
                )}
              </div>

              {/* Valorant Code */}
              <div>
                <label className="block text-sm font-medium mb-2 text-yellow-400">
                  🎯 Valorant Crosshair Code (Use in-game)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={valorantCode}
                    readOnly
                    className={`flex-1 px-4 py-3 border rounded-lg text-sm font-mono ${
                      codeAccuracy 
                        ? 'bg-gray-800/50 border-gray-600 text-green-400' 
                        : 'bg-red-900/20 border-red-500/50 text-red-300'
                    }`}
                  />
                  <button
                    onClick={() => copyToClipboard(valorantCode, 'valorant')}
                    className="px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-400 to-red-400 text-black hover:shadow-lg transition-all"
                    disabled={!codeAccuracy}
                  >
                    {copySuccess === 'valorant' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Copy this code and paste it in Valorant → Settings → Crosshair → Import Profile Code
                </p>
              </div>
              
              <div className="text-xs text-gray-400 bg-gray-800/30 p-4 rounded-lg">
                <p className="font-medium text-yellow-400 mb-2">📋 How to use in Valorant:</p>
                <div className="space-y-1">
                  <p><span className="text-yellow-400 font-medium">1.</span> Copy the crosshair code above</p>
                  <p><span className="text-yellow-400 font-medium">2.</span> Launch Valorant and enter a match or practice range</p>
                  <p><span className="text-yellow-400 font-medium">3.</span> Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">ESC</kbd> → Settings → Crosshair</p>
                  <p><span className="text-yellow-400 font-medium">4.</span> Click &quot;Import Profile Code&quot; button</p>
                  <p><span className="text-yellow-400 font-medium">5.</span> Paste the code and click &quot;Import&quot;</p>
                  <p><span className="text-yellow-400 font-medium">6.</span> Your crosshair is now applied!</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-700">
                  <p className="text-green-400 font-medium text-xs">✨ REAL Valorant format - No more s;1 parameters!</p>
                  <p className="text-green-400 font-medium text-xs">✨ Perfect opacity scaling (0-1 decimal, supports 0.35)</p>
                  <p className="text-green-400 font-medium text-xs">✨ Exact 34-part structure (0;P;c;1;o;1;...;1f;1)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-md w-full rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl">Import Crosshair</h3>
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setImportCode('')
                  setImportError('')
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valorant Crosshair Code</label>
                <textarea
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  placeholder="0;s;1;P;c;1;o;1;d;1;f;0;s;0;0t;1;0l;4;0o;2..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-sm font-mono h-24 resize-none"
                />
                {importError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                    <AlertCircle size={14} />
                    {importError}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportCode('')
                    setImportError('')
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium bg-white/10 hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCode}
                  className="flex-1 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-yellow-400 to-red-400 text-black hover:shadow-lg transition-all"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Share Modal */}
      {showCommunityModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-2xl w-full rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-xl">Share to Community</h3>
              </div>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-black/20 rounded-lg p-4 flex justify-center">
                <CrosshairPreview settings={settings} size="medium" />
              </div>
              
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Crosshair Name *
                  </label>
                  <input
                    type="text"
                    placeholder="My Amazing Crosshair"
                    value={communityForm.name}
                    onChange={(e) => setCommunityForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your crosshair and how it helps your aim..."
                    value={communityForm.description}
                    onChange={(e) => setCommunityForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 h-24 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="precise, dynamic, pro, competitive (separate with commas)"
                    value={communityForm.tags}
                    onChange={(e) => setCommunityForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="public"
                    checked={communityForm.isPublic}
                    onChange={(e) => setCommunityForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                  />
                  <label htmlFor="public" className="text-sm text-gray-300">
                    Make public (visible to all community members)
                  </label>
                </div>
              </div>
              
              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-blue-500/20">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Share with the ValoClass community!</p>
                    <p className="text-blue-300/80">Your crosshair will be available for others to discover, download, and rate. Help fellow players improve their aim!</p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCommunityModal(false)
                    setCommunityForm({ name: '', description: '', tags: '', isPublic: true })
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium bg-white/10 hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!communityForm.name.trim()) {
                      alert('Please enter a name for your crosshair')
                      return
                    }
                    
                    try {
                      const response = await fetch('/api/community/crosshairs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: communityForm.name,
                          description: communityForm.description || undefined,
                          tags: communityForm.tags,
                          settings: settings,
                          valorantCode: valorantCode,
                          isPublic: communityForm.isPublic,
                          category: activeProfile
                        })
                      })
                      
                      if (response.ok) {
                        const data = await response.json()
                        const userChoice = confirm('Crosshair shared successfully to the community! 🎉\n\nWould you like to view the community page?')
                        if (userChoice) {
                          window.open('/community/crosshairs', '_blank')
                        }
                        setShowCommunityModal(false)
                        setCommunityForm({ name: '', description: '', tags: '', isPublic: true })
                      } else {
                        throw new Error('Failed to share crosshair')
                      }
                    } catch (error) {
                      console.error('Error sharing crosshair:', error)
                      alert('Failed to share crosshair. Please try again.')
                    }
                  }}
                  disabled={!communityForm.name.trim()}
                  className="flex-1 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share to Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Presets Modal */}
      {showPresets && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="max-w-4xl w-full rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl">Professional Player Presets</h3>
              <button
                onClick={() => setShowPresets(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => loadPreset(preset)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center">
                      <CrosshairPreview settings={preset.settings} size="small" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{preset.name}</h4>
                      <p className="text-xs text-gray-400">by {preset.player}</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-yellow-400 to-red-400 text-black hover:shadow-lg transition-all">
                    Load Preset
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrosshairBuilder