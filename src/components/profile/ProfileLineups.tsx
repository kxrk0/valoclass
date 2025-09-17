'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Play, Heart, Eye, Edit3, Trash2, MoreVertical } from 'lucide-react'

// Mock lineups data
const mockLineups = [
  {
    id: '1',
    title: 'Viper Bind A Site Smoke',
    description: 'Perfect smoke placement for A site execute',
    agent: 'Viper',
    ability: 'Poison Cloud',
    map: 'Bind',
    side: 'attacker',
    difficulty: 'medium',
    status: 'published',
    likes: 89,
    views: 1250,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Sova Ascent A Site Recon',
    description: 'Reveals all common angles on A site',
    agent: 'Sova',
    ability: 'Recon Bolt',
    map: 'Ascent',
    side: 'attacker',
    difficulty: 'easy',
    status: 'published',
    likes: 67,
    views: 890,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Omen Split B Site Setup',
    description: 'Complete site control with smokes',
    agent: 'Omen',
    ability: 'Dark Cover',
    map: 'Split',
    side: 'defender',
    difficulty: 'hard',
    status: 'draft',
    likes: 23,
    views: 456,
    createdAt: new Date('2024-01-08')
  }
]

const ProfileLineups = () => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const filteredLineups = mockLineups
    .filter(lineup => {
      if (filter === 'all') return true
      if (filter === 'published') return lineup.status === 'published'
      if (filter === 'draft') return lineup.status === 'draft'
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'views':
          return b.views - a.views
        default:
          return 0
      }
    })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'hard': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-900/20'
      case 'draft': return 'text-yellow-400 bg-yellow-900/20'
      case 'archived': return 'text-gray-400 bg-gray-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">My Lineups</h2>
          <p className="text-gray-400">Manage your lineup collection</p>
        </div>
        <Link href="/lineups/create" className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Lineup
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            {['all', 'published', 'draft'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === filterOption
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {filterOption}
                {filterOption === 'all' && (
                  <span className="ml-2 text-xs">({mockLineups.length})</span>
                )}
                {filterOption === 'published' && (
                  <span className="ml-2 text-xs">({mockLineups.filter(l => l.status === 'published').length})</span>
                )}
                {filterOption === 'draft' && (
                  <span className="ml-2 text-xs">({mockLineups.filter(l => l.status === 'draft').length})</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:border-red-500"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lineups Grid */}
      {filteredLineups.length === 0 ? (
        <div className="card text-center py-12">
          <Target size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No lineups found</h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all' 
              ? "You haven't created any lineups yet."
              : `No ${filter} lineups found.`
            }
          </p>
          <Link href="/lineups/create" className="btn btn-primary">
            <Plus size={18} />
            Create Your First Lineup
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLineups.map((lineup) => (
            <div key={lineup.id} className="card group hover:scale-105 transition-all duration-300">
              {/* Thumbnail */}
              <div className="relative mb-4">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <Play size={32} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(lineup.status)}`}>
                    {lineup.status}
                  </span>
                </div>

                {/* More Options */}
                <div className="absolute top-2 right-2">
                  <button className="p-1 bg-black/50 hover:bg-black/70 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-md text-xs text-white">
                    <Heart size={12} className="text-red-400" />
                    {lineup.likes}
                  </div>
                  <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-md text-xs text-white">
                    <Eye size={12} className="text-blue-400" />
                    {lineup.views}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white mb-1 leading-tight">
                    {lineup.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {lineup.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-600 text-white rounded">
                    {lineup.agent}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
                    {lineup.map}
                  </span>
                  <span className={`px-2 py-1 rounded capitalize ${getDifficultyColor(lineup.difficulty)}`}>
                    {lineup.difficulty}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link 
                    href={`/lineups/${lineup.id}`}
                    className="flex-1 btn btn-secondary text-sm py-2"
                  >
                    <Play size={14} />
                    View
                  </Link>
                  <Link 
                    href={`/lineups/${lineup.id}/edit`}
                    className="btn btn-secondary text-sm py-2 px-3"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button className="btn btn-secondary text-sm py-2 px-3 text-red-400 hover:bg-red-900/20">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                  Created {lineup.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileLineups