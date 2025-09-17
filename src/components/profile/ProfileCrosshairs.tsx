'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Copy, Heart, Download, MoreVertical } from 'lucide-react'
import CrosshairPreview from '@/components/crosshair/CrosshairPreview'

// Mock crosshairs data
const mockCrosshairs = [
  {
    id: '1',
    name: 'Main Crosshair',
    shareCode: 'VALO-MAIN001',
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
    isPublic: true,
    likes: 45,
    downloads: 123,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Dot Only',
    shareCode: 'VALO-DOT002',
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
    isPublic: false,
    likes: 23,
    downloads: 67,
    createdAt: new Date('2024-01-10')
  }
]

const ProfileCrosshairs = () => {
  const [filter, setFilter] = useState('all')

  const filteredCrosshairs = mockCrosshairs.filter(crosshair => {
    if (filter === 'all') return true
    if (filter === 'public') return crosshair.isPublic
    if (filter === 'private') return !crosshair.isPublic
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">My Crosshairs</h2>
          <p className="text-gray-400">Manage your crosshair collection</p>
        </div>
        <Link href="/crosshairs" className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Crosshair
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex gap-2">
          {['all', 'public', 'private'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === filterOption
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Crosshairs Grid */}
      {filteredCrosshairs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">⌖</div>
          <h3 className="text-xl font-semibold mb-2">No crosshairs found</h3>
          <p className="text-gray-400 mb-6">Create your first custom crosshair</p>
          <Link href="/crosshairs" className="btn btn-primary">
            <Plus size={18} />
            Create Crosshair
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrosshairs.map((crosshair) => (
            <div key={crosshair.id} className="card group">
              {/* Preview */}
              <div className="mb-4">
                <CrosshairPreview settings={crosshair.settings} size="medium" />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{crosshair.name}</h3>
                    <div className="text-sm text-gray-400 font-mono">{crosshair.shareCode}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-red-400">
                    <Heart size={14} />
                    <span>{crosshair.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Download size={14} />
                    <span>{crosshair.downloads}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    crosshair.isPublic 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {crosshair.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 btn btn-secondary text-sm py-2">
                    <Copy size={14} />
                    Copy Code
                  </button>
                  <button className="btn btn-secondary text-sm py-2 px-3">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileCrosshairs