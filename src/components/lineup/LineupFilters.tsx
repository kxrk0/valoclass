'use client'

import { useState } from 'react'
import { Filter, ChevronDown, Search, X } from 'lucide-react'

interface FilterState {
  agents: string[]
  maps: string[]
  abilities: string[]
  difficulty: string[]
  side: string[]
}

interface LineupFiltersProps {
  onFiltersChange?: (filters: FilterState) => void
}

const LineupFilters = ({ onFiltersChange }: LineupFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    agents: [],
    maps: [],
    abilities: [],
    difficulty: [],
    side: []
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Data for filters
  const agents = [
    'Astra', 'Breach', 'Brimstone', 'Chamber', 'Cypher', 'Fade', 'Harbor',
    'Jett', 'KAY/O', 'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze',
    'Reyna', 'Sage', 'Skye', 'Sova', 'Viper', 'Yoru'
  ]

  const maps = [
    'Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 'Icebox', 
    'Lotus', 'Pearl', 'Split', 'Sunset'
  ]

  const abilities = [
    'Molotov/Incendiary', 'Smoke', 'Flash', 'Recon Dart', 'Shock Dart',
    'Poison Cloud', 'Toxic Screen', 'Snake Bite', 'Alarmbot', 'Turret',
    'Nanoswarm', 'Barrier Orb', 'Slow Orb', 'Heal Orb'
  ]

  const difficulties = ['Easy', 'Medium', 'Hard']
  const sides = ['Attacker', 'Defender']

  const updateFilter = (category: keyof FilterState, value: string) => {
    const newFilters = { ...filters }
    
    if (newFilters[category].includes(value)) {
      newFilters[category] = newFilters[category].filter(item => item !== value)
    } else {
      newFilters[category] = [...newFilters[category], value]
    }
    
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      agents: [],
      maps: [],
      abilities: [],
      difficulty: [],
      side: []
    }
    setFilters(emptyFilters)
    setSearchTerm('')
    onFiltersChange?.(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0) || searchTerm

  const FilterSection = ({ 
    title, 
    items, 
    category, 
    limit = 5 
  }: { 
    title: string
    items: string[]
    category: keyof FilterState
    limit?: number
  }) => {
    const [showAll, setShowAll] = useState(false)
    const displayItems = showAll ? items : items.slice(0, limit)

    return (
      <div className="mb-6">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Filter size={16} />
          {title}
        </h4>
        <div className="space-y-2">
          {displayItems.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters[category].includes(item)}
                onChange={() => updateFilter(category, item)}
                className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
              />
              <span>{item}</span>
              {filters[category].includes(item) && (
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                  ✓
                </span>
              )}
            </label>
          ))}
          
          {items.length > limit && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 mt-2"
            >
              {showAll ? 'Show Less' : `Show ${items.length - limit} More`}
              <ChevronDown 
                size={14} 
                className={`transform transition-transform ${showAll ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full btn btn-secondary flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter size={18} />
            Filters
            {hasActiveFilters && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </span>
          <ChevronDown 
            size={18} 
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="card space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-xl">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X size={14} />
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search lineups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {Object.entries(filters).map(([category, values]) =>
                  values.map(value => (
                    <span
                      key={`${category}-${value}`}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {value}
                      <button onClick={() => updateFilter(category as keyof FilterState, value)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Filter Sections */}
          <FilterSection title="Agents" items={agents} category="agents" />
          <FilterSection title="Maps" items={maps} category="maps" />
          <FilterSection title="Abilities" items={abilities} category="abilities" limit={8} />
          <FilterSection title="Difficulty" items={difficulties} category="difficulty" limit={3} />
          <FilterSection title="Side" items={sides} category="side" limit={2} />

          {/* Quick Filters */}
          <div className="pt-4 border-t border-gray-700">
            <h4 className="font-semibold text-white mb-3">Quick Filters</h4>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => {
                  setFilters(prev => ({ ...prev, difficulty: ['Easy'] }))
                  onFiltersChange?.({ ...filters, difficulty: ['Easy'] })
                }}
                className="text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
              >
                🟢 Beginner Friendly
              </button>
              <button 
                onClick={() => {
                  setFilters(prev => ({ ...prev, agents: ['Sova', 'Viper', 'Omen'] }))
                  onFiltersChange?.({ ...filters, agents: ['Sova', 'Viper', 'Omen'] })
                }}
                className="text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
              >
                🎯 Popular Agents
              </button>
              <button 
                onClick={() => {
                  setFilters(prev => ({ ...prev, maps: ['Ascent', 'Bind', 'Haven'] }))
                  onFiltersChange?.({ ...filters, maps: ['Ascent', 'Bind', 'Haven'] })
                }}
                className="text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
              >
                🗺️ Active Duty Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LineupFilters