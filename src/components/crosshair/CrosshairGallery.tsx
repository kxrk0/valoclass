'use client'

import { useState, useEffect } from 'react'
import { Heart, Copy, Download, Search } from 'lucide-react'
import CrosshairPreview from './CrosshairPreview'
import type { Crosshair } from '@/types'

// Mock data for demonstration
const mockCrosshairs: Crosshair[] = [
  {
    id: '1',
    name: 'TenZ Classic',
    createdBy: 'TenZ',
    createdAt: new Date('2024-01-15'),
    settings: {
      color: '#00ff00',
      outlines: true,
      outlineOpacity: 0.5,
      outlineThickness: 1,
      centerDot: false,
      centerDotOpacity: 1,
      centerDotThickness: 2,
      innerLines: true,
      innerLineOpacity: 1,
      innerLineLength: 4,
      innerLineThickness: 1,
      innerLineOffset: 2,
      outerLines: false,
      outerLineOpacity: 0.35,
      outerLineLength: 2,
      outerLineThickness: 2,
      outerLineOffset: 10,
      movementError: 0,
      firingError: 0,
    },
    shareCode: 'VALO-TENZ001',
    likes: 1247,
    isPublic: true
  },
  {
    id: '2',
    name: 'ScreaM Dot',
    createdBy: 'ScreaM',
    createdAt: new Date('2024-01-10'),
    settings: {
      color: '#ffffff',
      outlines: false,
      outlineOpacity: 0.5,
      outlineThickness: 1,
      centerDot: true,
      centerDotOpacity: 1,
      centerDotThickness: 3,
      innerLines: false,
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
    },
    shareCode: 'VALO-SCREAM01',
    likes: 892,
    isPublic: true
  },
  {
    id: '3',
    name: 'Shroud Pro',
    createdBy: 'shroud',
    createdAt: new Date('2024-01-12'),
    settings: {
      color: '#00ffff',
      outlines: true,
      outlineOpacity: 0.3,
      outlineThickness: 1,
      centerDot: true,
      centerDotOpacity: 0.8,
      centerDotThickness: 2,
      innerLines: true,
      innerLineOpacity: 0.9,
      innerLineLength: 5,
      innerLineThickness: 1,
      innerLineOffset: 3,
      outerLines: false,
      outerLineOpacity: 0.35,
      outerLineLength: 2,
      outerLineThickness: 2,
      outerLineOffset: 10,
      movementError: 0,
      firingError: 0,
    },
    shareCode: 'VALO-SHROUD01',
    likes: 1456,
    isPublic: true
  },
  {
    id: '4',
    name: 'Dynamic Cross',
    createdBy: 'ValoPlayer',
    createdAt: new Date('2024-01-14'),
    settings: {
      color: '#ffff00',
      outlines: true,
      outlineOpacity: 0.4,
      outlineThickness: 1,
      centerDot: false,
      centerDotOpacity: 1,
      centerDotThickness: 2,
      innerLines: true,
      innerLineOpacity: 1,
      innerLineLength: 6,
      innerLineThickness: 2,
      innerLineOffset: 2,
      outerLines: true,
      outerLineOpacity: 0.5,
      outerLineLength: 3,
      outerLineThickness: 1,
      outerLineOffset: 12,
      movementError: 1,
      firingError: 1.5,
    },
    shareCode: 'VALO-DYN001',
    likes: 324,
    isPublic: true
  }
]

const CrosshairGallery = () => {
  const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent'>('all')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCrosshairs(mockCrosshairs)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCrosshairs = crosshairs.filter(crosshair => {
    const matchesSearch = crosshair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crosshair.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (filter) {
      case 'popular':
        return matchesSearch && crosshair.likes > 500
      case 'recent':
        const isRecent = new Date().getTime() - crosshair.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
        return matchesSearch && isRecent
      default:
        return matchesSearch
    }
  }).sort((a, b) => {
    switch (filter) {
      case 'popular':
        return b.likes - a.likes
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return b.likes - a.likes
    }
  })

  const copyShareCode = async (shareCode: string) => {
    try {
      await navigator.clipboard.writeText(shareCode)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy share code:', err)
    }
  }

  if (loading) {
    return (
      <div 
        className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <h3 className="font-semibold text-base mb-3">Gallery</h3>
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base">Gallery</h3>
        <span className="text-xs text-gray-400">{filteredCrosshairs.length}</span>
      </div>

      {/* Compact Search and Filter */}
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-xs focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <div className="flex gap-1">
          {['all', 'popular', 'recent'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as typeof filter)}
              className={`px-2 py-1 text-xs rounded-md capitalize transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-gray-800/30 text-gray-400 border border-transparent'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Crosshair List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredCrosshairs.map((crosshair) => (
          <div
            key={crosshair.id}
            className="rounded-lg p-3 transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-start gap-3">
              {/* Compact Preview */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <CrosshairPreview
                    settings={crosshair.settings}
                    size="small"
                    background="dark"
                  />
                </div>
              </div>

              {/* Compact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="font-medium text-sm text-white truncate">{crosshair.name}</h4>
                    <p className="text-xs text-gray-400">by {crosshair.createdBy}</p>
                  </div>
                  <div className="flex items-center text-red-400 text-xs">
                    <Heart size={12} className="mr-1" />
                    {crosshair.likes}
                  </div>
                </div>

                {/* Compact Actions */}
                <div className="flex gap-1 mb-1">
                  <button
                    onClick={() => copyShareCode(crosshair.shareCode)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <Copy size={10} />
                    Copy
                  </button>
                  <button 
                    className="flex items-center justify-center gap-1 px-2 py-1 text-xs rounded transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <Download size={10} />
                    Load
                  </button>
                </div>

                {/* Compact Share Code */}
                <div className="text-xs font-mono text-gray-500 truncate bg-gray-900/30 px-2 py-1 rounded">
                  {crosshair.shareCode}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCrosshairs.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          <Search size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No crosshairs found</p>
          <p className="text-xs">Try adjusting your search</p>
        </div>
      )}
    </div>
  )
}

export default CrosshairGallery
