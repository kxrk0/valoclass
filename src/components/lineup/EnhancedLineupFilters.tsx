'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Filter, Search, X, ChevronDown, ChevronRight, 
  MapPin, Target, Zap, Shield, Star, Award,
  Grid, List, SortAsc, SortDesc, RefreshCw
} from 'lucide-react'
import { LineupFilters } from '@/types/lineup-enhanced'
import { agents } from '@/data/agents'
import { maps } from '@/data/maps'

interface EnhancedLineupFiltersProps {
  filters: LineupFilters
  onFiltersChange: (filters: LineupFilters) => void
  onSearchChange: (query: string) => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void
  searchQuery: string
  viewMode: 'grid' | 'list'
  sortBy: string
  sortOrder: 'asc' | 'desc'
  resultCount: number
}

const EnhancedLineupFilters = ({
  filters,
  onFiltersChange,
  onSearchChange,
  onViewModeChange,
  onSortChange,
  searchQuery,
  viewMode,
  sortBy,
  sortOrder,
  resultCount
}: EnhancedLineupFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    agents: true,
    maps: true,
    abilities: true,
    difficulty: true,
    context: false,
    professional: false
  })

  // Filter options based on LineupsValorant.com structure
  const filterOptions = {
    agents: agents.map(agent => ({
      name: agent.displayName,
      icon: agent.displayIcon,
      role: agent.role.displayName
    })),
    
    maps: maps.map(map => ({
      name: map.displayName,
      icon: map.displayIcon,
      coordinates: map.coordinates
    })),
    
    abilities: [
      'Incendiary', 'Smoke', 'Flash', 'Recon Bolt', 'Shock Dart',
      'Poison Cloud', 'Toxic Screen', 'Snake Bite', 'Alarmbot', 'Turret',
      'Nanoswarm', 'Barrier Orb', 'Slow Orb', 'Heal Orb', 'Prowler',
      'Seize', 'Haunt', 'Aftershock', 'Flashpoint', 'Fault Line'
    ],
    
    abilityTypes: [
      { name: 'Smoke', icon: '💨', color: 'text-blue-400' },
      { name: 'Molotov', icon: '🔥', color: 'text-red-400' },
      { name: 'Flash', icon: '⚡', color: 'text-yellow-400' },
      { name: 'Recon', icon: '👁️', color: 'text-green-400' },
      { name: 'Wall', icon: '🧱', color: 'text-gray-400' },
      { name: 'Heal', icon: '💚', color: 'text-green-300' },
      { name: 'Trap', icon: '⚠️', color: 'text-orange-400' }
    ],
    
    difficulty: [
      { name: 'Easy', color: 'text-green-400 bg-green-900/20', description: 'Simple execution' },
      { name: 'Medium', color: 'text-yellow-400 bg-yellow-900/20', description: 'Moderate skill' },
      { name: 'Hard', color: 'text-red-400 bg-red-900/20', description: 'Advanced technique' },
      { name: 'Expert', color: 'text-purple-400 bg-purple-900/20', description: 'Pro level' }
    ],
    
    side: [
      { name: 'Attacker', icon: '⚔️', color: 'text-red-400' },
      { name: 'Defender', icon: '🛡️', color: 'text-blue-400' }
    ],
    
    situation: [
      'Execute', 'Retake', 'Post-plant', 'Anti-eco', 'Force-buy', 'Full-buy'
    ],
    
    roundType: [
      'Pistol', 'Anti-eco', 'Gun-round', 'Eco', 'Force'
    ],
    
    tags: [
      'one-way', 'post-plant', 'retake', 'execute', 'denial', 'stall',
      'fast', 'safe', 'default', 'pro', 'easy', 'advanced'
    ],
    
    quality: [
      { name: 'Diamond', color: 'text-cyan-400', icon: '💎' },
      { name: 'Gold', color: 'text-yellow-400', icon: '🏆' },
      { name: 'Silver', color: 'text-gray-300', icon: '🥈' },
      { name: 'Bronze', color: 'text-orange-400', icon: '🥉' }
    ]
  }

  const updateFilter = <K extends keyof LineupFilters>(
    category: K,
    value: string
  ) => {
    const currentValues = filters[category] as string[]
    let newValues: string[]
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(item => item !== value)
    } else {
      newValues = [...currentValues, value]
    }
    
    onFiltersChange({
      ...filters,
      [category]: newValues
    })
  }

  const updateBooleanFilter = <K extends keyof LineupFilters>(
    category: K,
    value: boolean
  ) => {
    onFiltersChange({
      ...filters,
      [category]: value
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      query: '',
      agents: [],
      maps: [],
      abilities: [],
      abilityTypes: [],
      difficulty: [],
      side: [],
      situation: [],
      roundType: [],
      tags: [],
      professional: false,
      verified: false,
      featured: false,
      quality: []
    })
    onSearchChange('')
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length
      } else if (typeof value === 'boolean') {
        return count + (value ? 1 : 0)
      }
      return count
    }, 0)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string
    sectionKey: string
    children: React.ReactNode
  }) => {
    const isExpanded = expandedSections[sectionKey]
    
    return (
      <div className="border-b border-gray-800 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
        >
          <span className="font-semibold text-white">{title}</span>
          <ChevronRight 
            className={`w-4 h-4 text-gray-400 transform transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </button>
        {isExpanded && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  const AgentFilter = () => (
    <div className="grid grid-cols-2 gap-2">
      {filterOptions.agents.map((agent) => (
        <label
          key={agent.name}
          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
            filters.agents.includes(agent.name)
              ? 'bg-yellow-500/20 border border-yellow-500/50'
              : 'hover:bg-gray-800/50 border border-transparent'
          }`}
        >
          <input
            type="checkbox"
            checked={filters.agents.includes(agent.name)}
            onChange={() => updateFilter('agents', agent.name)}
            className="sr-only"
          />
          <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={agent.icon}
              alt={agent.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">{agent.name}</div>
            <div className="text-xs text-gray-400 truncate">{agent.role}</div>
          </div>
        </label>
      ))}
    </div>
  )

  const MapFilter = () => (
    <div className="grid grid-cols-1 gap-2">
      {filterOptions.maps.map((map) => (
        <label
          key={map.name}
          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${
            filters.maps.includes(map.name)
              ? 'bg-blue-500/20 border border-blue-500/50'
              : 'hover:bg-gray-800/50 border border-transparent'
          }`}
        >
          <input
            type="checkbox"
            checked={filters.maps.includes(map.name)}
            onChange={() => updateFilter('maps', map.name)}
            className="sr-only"
          />
          <div className="w-10 h-6 rounded overflow-hidden flex-shrink-0">
            <Image
              src={map.icon}
              alt={map.name}
              width={40}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">{map.name}</div>
            <div className="text-xs text-gray-400">{map.coordinates}</div>
          </div>
        </label>
      ))}
    </div>
  )

  const AbilityTypeFilter = () => (
    <div className="grid grid-cols-2 gap-2">
      {filterOptions.abilityTypes.map((type) => (
        <label
          key={type.name}
          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
            filters.abilityTypes.includes(type.name)
              ? 'bg-purple-500/20 border border-purple-500/50'
              : 'hover:bg-gray-800/50 border border-transparent'
          }`}
        >
          <input
            type="checkbox"
            checked={filters.abilityTypes.includes(type.name)}
            onChange={() => updateFilter('abilityTypes', type.name)}
            className="sr-only"
          />
          <span className="text-lg">{type.icon}</span>
          <span className={`text-sm font-medium ${type.color}`}>{type.name}</span>
        </label>
      ))}
    </div>
  )

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
            {getActiveFilterCount() > 0 && (
              <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
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
        {/* Search & Controls */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl mb-4">
          <div className="p-4 border-b border-gray-800">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search lineups..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-yellow-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* View & Sort Controls */}
            <div className="flex items-center justify-between">
              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-yellow-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-yellow-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value, sortOrder)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-yellow-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="agent">Agent</option>
                </select>
                <button
                  onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 text-sm text-gray-400">
              {resultCount} lineup{resultCount !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">Active Filters</span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
                >
                  <RefreshCw size={12} />
                  <span>Clear All</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Search Query */}
                {searchQuery && (
                  <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <span>&quot;{searchQuery}&quot;</span>
                    <button onClick={() => onSearchChange('')}>
                      <X size={10} />
                    </button>
                  </span>
                )}

                {/* Filter Tags */}
                {Object.entries(filters).map(([key, values]) => {
                  if (Array.isArray(values) && values.length > 0) {
                    return values.map((value: string) => (
                      <span
                        key={`${key}-${value}`}
                        className="bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                      >
                        <span>{value}</span>
                        <button onClick={() => updateFilter(key as keyof LineupFilters, value)}>
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  } else if (typeof values === 'boolean' && values) {
                    return (
                      <span
                        key={key}
                        className="bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                      >
                        <span>{key}</span>
                        <button onClick={() => updateBooleanFilter(key as keyof LineupFilters, false)}>
                          <X size={10} />
                        </button>
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}

          {/* Filter Sections */}
          <div className="divide-y divide-gray-800">
            <FilterSection title="Agents" sectionKey="agents">
              <AgentFilter />
            </FilterSection>

            <FilterSection title="Maps" sectionKey="maps">
              <MapFilter />
            </FilterSection>

            <FilterSection title="Ability Types" sectionKey="abilityTypes">
              <AbilityTypeFilter />
            </FilterSection>

            <FilterSection title="Difficulty" sectionKey="difficulty">
              <div className="grid grid-cols-1 gap-2">
                {filterOptions.difficulty.map((diff) => (
                  <label
                    key={diff.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                      filters.difficulty.includes(diff.name.toLowerCase())
                        ? `${diff.color} border-current`
                        : 'hover:bg-gray-800/50 border-transparent'
                    }`}
                  >
                    <div>
                      <span className="font-medium">{diff.name}</span>
                      <div className="text-xs text-gray-400">{diff.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(diff.name.toLowerCase())}
                      onChange={() => updateFilter('difficulty', diff.name.toLowerCase())}
                      className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                    />
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Context" sectionKey="context">
              <div className="space-y-4">
                {/* Side */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Side</label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.side.map((side) => (
                      <label
                        key={side.name}
                        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
                          filters.side.includes(side.name.toLowerCase())
                            ? 'bg-gray-700 border border-gray-600'
                            : 'hover:bg-gray-800/50 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={filters.side.includes(side.name.toLowerCase())}
                          onChange={() => updateFilter('side', side.name.toLowerCase())}
                          className="sr-only"
                        />
                        <span className="text-lg">{side.icon}</span>
                        <span className={`text-sm font-medium ${side.color}`}>{side.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Situation */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Situation</label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.situation.map((situation) => (
                      <label
                        key={situation}
                        className={`text-xs px-3 py-1 rounded-full cursor-pointer transition-all ${
                          filters.situation.includes(situation.toLowerCase())
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={filters.situation.includes(situation.toLowerCase())}
                          onChange={() => updateFilter('situation', situation.toLowerCase())}
                          className="sr-only"
                        />
                        {situation}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Professional" sectionKey="professional">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Used by Pros</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.professional}
                    onChange={(e) => updateBooleanFilter('professional', e.target.checked)}
                    className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Verified</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => updateBooleanFilter('verified', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Featured</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => updateBooleanFilter('featured', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedLineupFilters
