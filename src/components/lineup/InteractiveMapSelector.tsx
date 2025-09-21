'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, Target, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { maps } from '@/data/maps'

interface Position {
  x: number
  y: number
}

interface MapMarker {
  id: string
  position: Position
  type: 'start' | 'end'
  location: string
}

interface InteractiveMapSelectorProps {
  selectedMap: string | null
  onMapChange: (mapName: string) => void
  onPositionSelect: (from: string, to: string) => void
  startMarker?: MapMarker | null
  endMarker?: MapMarker | null
  onMarkersChange?: (start: MapMarker | null, end: MapMarker | null) => void
}

// Map callout positions based on actual game maps
const mapCallouts = {
  'Bind': [
    { name: 'A Site', x: 150, y: 200, type: 'site' },
    { name: 'B Site', x: 400, y: 350, type: 'site' },
    { name: 'A Short', x: 180, y: 180, type: 'path' },
    { name: 'A Long', x: 120, y: 220, type: 'path' },
    { name: 'Hookah', x: 250, y: 280, type: 'path' },
    { name: 'Lamps', x: 380, y: 320, type: 'path' },
    { name: 'Elbow', x: 360, y: 300, type: 'path' },
    { name: 'Garden', x: 420, y: 380, type: 'path' },
    { name: 'Attacker Spawn', x: 50, y: 150, type: 'spawn' },
    { name: 'Defender Spawn', x: 450, y: 250, type: 'spawn' }
  ],
  'Ascent': [
    { name: 'A Site', x: 170, y: 190, type: 'site' },
    { name: 'B Site', x: 430, y: 310, type: 'site' },
    { name: 'A Main', x: 150, y: 170, type: 'path' },
    { name: 'A Rafters', x: 190, y: 210, type: 'path' },
    { name: 'Mid', x: 300, y: 250, type: 'path' },
    { name: 'Catwalk', x: 320, y: 230, type: 'path' },
    { name: 'Market', x: 280, y: 270, type: 'path' },
    { name: 'B Main', x: 450, y: 330, type: 'path' },
    { name: 'Attacker Spawn', x: 80, y: 120, type: 'spawn' },
    { name: 'Defender Spawn', x: 380, y: 380, type: 'spawn' }
  ],
  'Haven': [
    { name: 'A Site', x: 180, y: 150, type: 'site' },
    { name: 'B Site', x: 300, y: 300, type: 'site' },
    { name: 'C Site', x: 450, y: 180, type: 'site' },
    { name: 'A Long', x: 160, y: 120, type: 'path' },
    { name: 'A Short', x: 200, y: 130, type: 'path' },
    { name: 'Mid', x: 250, y: 220, type: 'path' },
    { name: 'C Long', x: 470, y: 160, type: 'path' },
    { name: 'Garage', x: 320, y: 280, type: 'path' },
    { name: 'Attacker Spawn', x: 100, y: 80, type: 'spawn' },
    { name: 'Defender Spawn', x: 400, y: 350, type: 'spawn' }
  ],
  'Split': [
    { name: 'A Site', x: 200, y: 150, type: 'site' },
    { name: 'B Site', x: 350, y: 350, type: 'site' },
    { name: 'A Ramp', x: 180, y: 130, type: 'path' },
    { name: 'A Main', x: 220, y: 170, type: 'path' },
    { name: 'Mid', x: 275, y: 250, type: 'path' },
    { name: 'B Main', x: 370, y: 330, type: 'path' },
    { name: 'Rafters', x: 240, y: 200, type: 'path' },
    { name: 'Vents', x: 300, y: 220, type: 'path' },
    { name: 'Attacker Spawn', x: 120, y: 100, type: 'spawn' },
    { name: 'Defender Spawn', x: 400, y: 280, type: 'spawn' }
  ]
}

const InteractiveMapSelector = ({
  selectedMap,
  onMapChange,
  onPositionSelect,
  startMarker,
  endMarker,
  onMarkersChange
}: InteractiveMapSelectorProps) => {
  const [activeMode, setActiveMode] = useState<'start' | 'end' | null>(null)
  const [hoveredCallout, setHoveredCallout] = useState<string | null>(null)
  const [selectedMapData, setSelectedMapData] = useState(selectedMap ? maps.find(m => m.displayName === selectedMap) : null)

  const handleMapSelect = (mapName: string) => {
    const mapData = maps.find(m => m.displayName === mapName)
    setSelectedMapData(mapData || null)
    onMapChange(mapName)
    // Clear markers when changing map
    onMarkersChange?.(null, null)
  }

  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedMapData || !activeMode) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 500 // Normalize to 500px width
    const y = ((event.clientY - rect.top) / rect.height) * 400 // Normalize to 400px height

    // Find nearest callout
    const callouts = mapCallouts[selectedMapData.displayName as keyof typeof mapCallouts] || []
    let nearestCallout = callouts[0]
    let minDistance = Infinity

    callouts.forEach(callout => {
      const distance = Math.sqrt(Math.pow(callout.x - x, 2) + Math.pow(callout.y - y, 2))
      if (distance < minDistance) {
        minDistance = distance
        nearestCallout = callout
      }
    })

    const newMarker: MapMarker = {
      id: `${activeMode}-${Date.now()}`,
      position: { x: nearestCallout.x, y: nearestCallout.y },
      type: activeMode,
      location: nearestCallout.name
    }

    if (activeMode === 'start') {
      onMarkersChange?.(newMarker, endMarker || null)
    } else {
      onMarkersChange?.(startMarker || null, newMarker)
    }

    // If both markers are set, trigger position select
    if (startMarker && activeMode === 'end') {
      onPositionSelect(startMarker.location, newMarker.location)
    } else if (endMarker && activeMode === 'start') {
      onPositionSelect(newMarker.location, endMarker.location)
    }

    setActiveMode(null)
  }, [selectedMapData, activeMode, startMarker, endMarker, onMarkersChange, onPositionSelect])

  const clearMarker = (type: 'start' | 'end') => {
    if (type === 'start') {
      onMarkersChange?.(null, endMarker || null)
    } else {
      onMarkersChange?.(startMarker || null, null)
    }
  }

  const availableMaps = maps.filter(map => ['Bind', 'Ascent', 'Haven', 'Split', 'Breeze', 'Icebox'].includes(map.displayName))

  if (!selectedMapData) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Select a Map</h3>
          <p className="text-gray-400">Choose a map to start selecting lineup positions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableMaps.map((map) => (
            <button
              key={map.uuid}
              onClick={() => handleMapSelect(map.displayName)}
              className="group relative bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition-all duration-300"
            >
              <div className="aspect-video relative">
                <Image
                  src={map.splash}
                  alt={map.displayName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="font-semibold text-white text-sm">{map.displayName}</h4>
                  <p className="text-xs text-gray-300">{map.coordinates}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const callouts = mapCallouts[selectedMapData.displayName as keyof typeof mapCallouts] || []

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleMapSelect('')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="font-semibold text-white">{selectedMapData.displayName}</h3>
              <p className="text-sm text-gray-400">{selectedMapData.coordinates}</p>
            </div>
          </div>

          {/* Position Markers Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Start</span>
              {startMarker && (
                <span className="text-xs text-green-400">{startMarker.location}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-gray-300">End</span>
              {endMarker && (
                <span className="text-xs text-red-400">{endMarker.location}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-500/10 border-b border-gray-800">
        <p className="text-sm text-blue-400">
          Click &quot;Set Start&quot; or &quot;Set End&quot; buttons below, then click on the map to mark positions for your lineup.
        </p>
      </div>

      {/* Interactive Map */}
      <div className="relative">
        <div 
          className={`relative w-full aspect-[5/4] bg-gray-800 overflow-hidden cursor-${activeMode ? 'crosshair' : 'default'}`}
          onClick={handleMapClick}
        >
          {/* Map Background */}
          <Image
            src={selectedMapData.splash}
            alt={selectedMapData.displayName}
            fill
            className="object-cover opacity-70"
          />

          {/* Callout Overlays */}
          {callouts.map((callout) => (
            <div
              key={callout.name}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                hoveredCallout === callout.name ? 'scale-110' : ''
              }`}
              style={{ 
                left: `${(callout.x / 500) * 100}%`, 
                top: `${(callout.y / 400) * 100}%` 
              }}
              onMouseEnter={() => setHoveredCallout(callout.name)}
              onMouseLeave={() => setHoveredCallout(null)}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${
                callout.type === 'site' ? 'bg-yellow-400 border-yellow-600' :
                callout.type === 'spawn' ? 'bg-blue-400 border-blue-600' :
                'bg-gray-400 border-gray-600'
              }`} />
              
              {hoveredCallout === callout.name && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {callout.name}
                </div>
              )}
            </div>
          ))}

          {/* Start Marker */}
          {startMarker && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ 
                left: `${(startMarker.position.x / 500) * 100}%`, 
                top: `${(startMarker.position.y / 400) * 100}%` 
              }}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-green-400 border-2 border-green-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Start: {startMarker.location}
                </div>
              </div>
            </div>
          )}

          {/* End Marker */}
          {endMarker && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ 
                left: `${(endMarker.position.x / 500) * 100}%`, 
                top: `${(endMarker.position.y / 400) * 100}%` 
              }}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-red-400 border-2 border-red-600 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  End: {endMarker.location}
                </div>
              </div>
            </div>
          )}

          {/* Active Mode Overlay */}
          {activeMode && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30">
              <div className="bg-black/80 text-white px-6 py-3 rounded-lg text-center">
                <p className="font-medium">Click on the map to set {activeMode} position</p>
                <p className="text-sm text-gray-300 mt-1">Click anywhere to place marker at nearest callout</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveMode(activeMode === 'start' ? null : 'start')}
              className={`btn ${activeMode === 'start' ? 'btn-primary' : 'btn-secondary'} flex items-center space-x-2`}
            >
              <MapPin className="w-4 h-4" />
              <span>{activeMode === 'start' ? 'Cancel' : 'Set Start'}</span>
            </button>

            <button
              onClick={() => setActiveMode(activeMode === 'end' ? null : 'end')}
              className={`btn ${activeMode === 'end' ? 'btn-primary' : 'btn-secondary'} flex items-center space-x-2`}
            >
              <Target className="w-4 h-4" />
              <span>{activeMode === 'end' ? 'Cancel' : 'Set End'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {startMarker && (
              <button
                onClick={() => clearMarker('start')}
                className="btn btn-sm btn-ghost text-red-400 hover:text-red-300"
              >
                Clear Start
              </button>
            )}
            {endMarker && (
              <button
                onClick={() => clearMarker('end')}
                className="btn btn-sm btn-ghost text-red-400 hover:text-red-300"
              >
                Clear End
              </button>
            )}
          </div>
        </div>

        {/* Position Summary */}
        {startMarker && endMarker && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-sm">
              <span className="text-green-400 font-medium">Lineup Position:</span>
              <span className="text-white ml-2">From {startMarker.location} to {endMarker.location}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveMapSelector
