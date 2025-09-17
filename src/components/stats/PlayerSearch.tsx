'use client'

import { useState } from 'react'
import { Search, Loader, User, TrendingUp } from 'lucide-react'
import PlayerStats from './PlayerStats'
import type { PlayerStats as PlayerStatsType } from '@/types'

const PlayerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [playerStats, setPlayerStats] = useState<PlayerStatsType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const searchPlayer = async (riotId: string) => {
    if (!riotId.trim()) return

    setLoading(true)
    setError(null)
    setPlayerStats(null)

    try {
      // Parse Riot ID (Name#Tag)
      const [gameName, tagLine] = riotId.split('#')
      
      if (!gameName || !tagLine) {
        throw new Error('Please enter a valid Riot ID (Name#Tag)')
      }

      // Mock API call - In a real app, you'd call your backend API
      // which would then call the Valorant API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay

      // Mock player data
      const mockPlayerStats: PlayerStatsType = {
        puuid: 'mock-puuid-12345',
        gameName: gameName,
        tagLine: tagLine,
        card: {
          small: '/player-cards/default-small.png',
          large: '/player-cards/default-large.png',
          wide: '/player-cards/default-wide.png',
          id: 'card-001'
        },
        accountLevel: 156,
        currenttier: 21, // Immortal 3
        currenttierpatched: 'Immortal 3',
        ranking_in_tier: 45,
        mmr_change_to_last_game: 23,
        elo: 2145,
        region: 'na',
        updated_at: new Date().toISOString()
      }

      setPlayerStats(mockPlayerStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchPlayer(searchQuery)
  }

  const recentSearches = [
    'TenZ#NA1',
    'Shroud#NA1',
    'ScreaM#EU1',
    'nAts#EU1'
  ]

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Player by Riot ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="PlayerName#TAG"
                className="block w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              {loading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Loader className="h-5 w-5 text-gray-400 animate-spin" />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Enter your full Riot ID including the tag (e.g., PlayerName#NA1)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !searchQuery.includes('#')}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search size={18} />
                Search Player
              </>
            )}
          </button>
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !playerStats && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-1 text-gray-300 text-sm rounded-md transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="card bg-red-900/20 border-red-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-red-400">Player Not Found</h3>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Player Stats */}
      {playerStats && (
        <div className="space-y-6">
          <PlayerStats playerStats={playerStats} />
        </div>
      )}

      {/* Tips */}
      {!playerStats && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-blue-400" size={20} />
              <h3 className="font-semibold">Track Your Progress</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Monitor your rank progression, win rate, and performance metrics across all game modes.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-purple-400" size={20} />
              <h3 className="font-semibold">Compare with Friends</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Search for your friends&apos; profiles and compare your statistics to see who&apos;s improving faster.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerSearch
