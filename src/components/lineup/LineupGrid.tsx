'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Grid, List, Play, Heart, Clock } from 'lucide-react'
import type { Lineup } from '@/types'

// Mock data for lineups
const mockLineups: Lineup[] = [
  {
    id: '1',
    title: 'Viper Bind A Site Smoke',
    description: 'Perfect smoke placement for A site execute on Bind',
    agent: 'Viper',
    ability: 'Poison Cloud',
    map: 'Bind',
    side: 'attacker',
    position: { x: 150, y: 200, angle: 45, description: 'From A Short' },
    instructions: [
      'Position yourself at the corner of A Short',
      'Aim at the top of the lamp post',
      'Throw the smoke orb with full power',
      'Activate when team is ready to execute'
    ],
    images: ['/lineups/viper-bind-a-1.jpg', '/lineups/viper-bind-a-2.jpg'],
    videoUrl: 'https://youtube.com/watch?v=example1',
    createdBy: 'ProPlayer',
    createdAt: new Date('2024-01-15'),
    tags: ['smoke', 'execute', 'one-way'],
    likes: 245,
    difficulty: 'medium'
  },
  {
    id: '2',
    title: 'Sova Ascent A Site Recon',
    description: 'Reveals all common angles on A site',
    agent: 'Sova',
    ability: 'Recon Bolt',
    map: 'Ascent',
    side: 'attacker',
    position: { x: 180, y: 160, angle: 30, description: 'From A Main' },
    instructions: [
      'Stand at the entrance of A Main',
      'Aim at the roof corner above site',
      'Use 1 bounce with medium charge',
      'Wait for scan before pushing'
    ],
    images: ['/lineups/sova-ascent-a-1.jpg'],
    createdBy: 'SovaMain',
    createdAt: new Date('2024-01-12'),
    tags: ['recon', 'info', 'entry'],
    likes: 189,
    difficulty: 'easy'
  },
  {
    id: '3',
    title: 'Killjoy Haven C Site Setup',
    description: 'Complete site lockdown with turret and alarmbot',
    agent: 'Killjoy',
    ability: 'Turret',
    map: 'Haven',
    side: 'defender',
    position: { x: 300, y: 250, angle: 90, description: 'C Site Default' },
    instructions: [
      'Place turret on the box for maximum coverage',
      'Put alarmbot at the entrance chokepoint',
      'Save nanoswarms for post-plant situations',
      'Coordinate with team for rotations'
    ],
    images: ['/lineups/killjoy-haven-c-1.jpg', '/lineups/killjoy-haven-c-2.jpg'],
    createdBy: 'SentinelPro',
    createdAt: new Date('2024-01-10'),
    tags: ['setup', 'defender', 'site-control'],
    likes: 156,
    difficulty: 'medium'
  },
  {
    id: '4',
    title: 'Omen Split B Site Smoke',
    description: 'One-way smoke for B site defense',
    agent: 'Omen',
    ability: 'Dark Cover',
    map: 'Split',
    side: 'defender',
    position: { x: 400, y: 350, angle: 180, description: 'B Site' },
    instructions: [
      'Position yourself at B site default spot',
      'Place smoke at the entrance choke',
      'Create one-way vision advantage',
      'Coordinate with team for timing'
    ],
    images: ['/lineups/omen-split-b-1.jpg'],
    createdBy: 'ControllerKing',
    createdAt: new Date('2024-01-08'),
    tags: ['smoke', 'one-way', 'defender'],
    likes: 98,
    difficulty: 'hard'
  }
]

const LineupGrid = () => {
  const [lineups, setLineups] = useState<Lineup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'views'>('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLineups(mockLineups)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredAndSortedLineups = lineups
    .filter(lineup => 
      lineup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lineup.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lineup.map.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lineup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'views':
          return Math.random() - 0.5 // Mock views sorting
        default:
          return 0
      }
    })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getAbilityColor = (ability: string) => {
    if (ability.includes('Smoke') || ability.includes('Cloud') || ability.includes('Cover')) return 'bg-blue-600'
    if (ability.includes('Flash')) return 'bg-yellow-600'
    if (ability.includes('Molotov') || ability.includes('Bite')) return 'bg-red-600'
    if (ability.includes('Recon') || ability.includes('Dart')) return 'bg-purple-600'
    if (ability.includes('Turret') || ability.includes('Alarmbot')) return 'bg-orange-600'
    return 'bg-gray-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-40">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search lineups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-yellow-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-700 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <span>{filteredAndSortedLineups.length} lineups found</span>
          {searchQuery && (
            <span>for &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>
      </div>

      {/* Lineups Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedLineups.map((lineup) => (
            <Link key={lineup.id} href={`/lineups/${lineup.id}`} className="group">
              <div className="card h-full hover:scale-105 transition-transform duration-300">
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <Play size={32} className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
                    </div>
                  </div>

                  {/* Overlay Info */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getAbilityColor(lineup.ability)} text-white`}>
                      {lineup.ability}
                    </span>
                    <span className="bg-black/70 px-2 py-1 text-xs rounded-full text-white">
                      {lineup.map}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full text-xs text-white">
                      <Heart size={10} className="text-red-400" />
                      {lineup.likes}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold leading-tight group-hover:text-yellow-400 transition-colors">
                      {lineup.title}
                    </h3>
                    <span className={`text-sm font-medium ${getDifficultyColor(lineup.difficulty)} capitalize ml-2`}>
                      {lineup.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm">
                    {lineup.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {lineup.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700">
                    <span>by {lineup.createdBy}</span>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(lineup.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedLineups.map((lineup) => (
            <Link key={lineup.id} href={`/lineups/${lineup.id}`} className="group">
              <div className="card hover:bg-gray-800/50 transition-colors">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Play size={24} className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold group-hover:text-yellow-400 transition-colors truncate">
                        {lineup.title}
                      </h3>
                      <span className={`text-sm font-medium ${getDifficultyColor(lineup.difficulty)} capitalize ml-2`}>
                        {lineup.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {lineup.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className={`px-2 py-1 rounded-full ${getAbilityColor(lineup.ability)} text-white`}>
                        {lineup.agent} • {lineup.ability}
                      </span>
                      <span>{lineup.map}</span>
                      <div className="flex items-center gap-1">
                        <Heart size={10} className="text-red-400" />
                        {lineup.likes}
                      </div>
                      <span>by {lineup.createdBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredAndSortedLineups.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No lineups found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <Link href="/lineups/submit" className="btn btn-primary">
            Submit Your Own Lineup
          </Link>
        </div>
      )}
    </div>
  )
}

export default LineupGrid
