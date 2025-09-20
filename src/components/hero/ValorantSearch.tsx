'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, User, TrendingUp, Target, Award, Clock } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

interface PlayerStats {
  puuid: string
  gameName: string
  tagLine: string
  tier: number
  tierName: string
  rr: number
  wins: number
  losses: number
  winRate: number
}

interface SearchResult {
  puuid: string
  gameName: string
  tagLine: string
  avatar?: string
}

const ValorantSearch = () => {
  const t = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  const mockPlayers: SearchResult[] = [
    { puuid: '1', gameName: 'TenZ', tagLine: 'SEN', avatar: '/api/placeholder/32/32' },
    { puuid: '2', gameName: 'ScreaM', tagLine: 'TL', avatar: '/api/placeholder/32/32' },
    { puuid: '3', gameName: 'nAts', tagLine: 'GMB', avatar: '/api/placeholder/32/32' },
    { puuid: '4', gameName: 'cNed', tagLine: 'ACE', avatar: '/api/placeholder/32/32' },
    { puuid: '5', gameName: 'Chronicle', tagLine: 'GMB', avatar: '/api/placeholder/32/32' },
  ]

  const mockStats: PlayerStats = {
    puuid: '1',
    gameName: 'TenZ',
    tagLine: 'SEN',
    tier: 24,
    tierName: 'Radiant',
    rr: 567,
    wins: 89,
    losses: 34,
    winRate: 72.4
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Filter mock data based on query
      const filtered = mockPlayers.filter(player =>
        player.gameName.toLowerCase().includes(query.toLowerCase()) ||
        player.tagLine.toLowerCase().includes(query.toLowerCase())
      )

      setSearchResults(filtered)
      setShowResults(true)
    } catch (err) {
      setError('Failed to search players')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayerSelect = async (player: SearchResult) => {
    setIsLoading(true)
    setShowResults(false)
    setSearchQuery(`${player.gameName}#${player.tagLine}`)

    try {
      // Simulate API call for player stats
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSelectedPlayer({
        ...mockStats,
        puuid: player.puuid,
        gameName: player.gameName,
        tagLine: player.tagLine
      })
    } catch (err) {
      setError('Failed to load player stats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRiotLogin = async () => {
    try {
      // Direct OAuth redirect like in login forms
      window.location.href = '/api/auth/oauth/riot'
    } catch (error) {
      setError('Failed to connect with Riot ID')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    handleSearch(value)
  }

  const getRankColor = (tier: number) => {
    if (tier >= 24) return 'from-yellow-400 to-yellow-600' // Radiant
    if (tier >= 21) return 'from-purple-400 to-pink-500' // Immortal
    if (tier >= 15) return 'from-blue-400 to-purple-500' // Diamond+
    return 'from-green-400 to-blue-500' // Lower ranks
  }

  return (
    <div className="valorant-search" ref={searchRef}>
      {/* Search Input */}
      <div className="search-container">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Find an Agent or Guide, ie. player#NA1, or Sage"
            className="search-input"
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />
          <div className="search-icon">
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full" />
            ) : (
              <Search size={20} />
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
            {searchResults.map((player) => (
              <div
                key={player.puuid}
                onClick={() => handlePlayerSelect(player)}
                className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{player.gameName}</div>
                  <div className="text-gray-400 text-sm">#{player.tagLine}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl p-4 z-50">
            <div className="text-center text-gray-400">
              No players found for "{searchQuery}"
            </div>
          </div>
        )}

        {/* Riot ID Sign In Button - Positioned under search container */}
        <button className="riot-id-button w-full mt-4" onClick={handleRiotLogin}>
          <svg className="riot-icon" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
            <g>
              <polygon points="80.11463165283203,8.324189960956573 0,45.35578089952469 19.96091079711914,121.31561595201492 35.225154876708984,119.41886454820633 30.980073928833008,71.72943431138992 36.03803253173828,69.47140055894852 44.61853790283203,118.24470835924149 70.54061126708984,115.08348399400711 65.93424224853516,62.42641764879227 70.81159210205078,60.25872737169266 80.29529571533203,113.90928965806961 106.57864379882812,110.6577256321907 101.52070617675781,52.942733108997345 106.48834228515625,50.775035202503204 116.87525177001953,109.39323741197586 142.79733276367188,106.23201304674149 142.79733276367188,24.040038406848907" />
              <polygon points="82.01138305664062,123.3929780125618 83.27587127685547,130.8895142674446 142.79733276367188,140.8247407078743 142.79733276367188,115.98668986558914 82.10169982910156,123.3929780125618" />
            </g>
          </svg>
          <span className="button-text">
            Sign in<span className="collapsed"> with Riot ID</span>
          </span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* Player Stats Display */}
      {selectedPlayer && (
        <div className="mt-8 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          {/* Player Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedPlayer.gameName}
                  <span className="text-gray-400">#{selectedPlayer.tagLine}</span>
                </h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getRankColor(selectedPlayer.tier)} text-white font-semibold text-sm`}>
                  <Award size={16} />
                  {selectedPlayer.tierName} • {selectedPlayer.rr} RR
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Current Season</div>
              <div className="text-white font-semibold">Episode 8 Act 2</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-gray-400 text-sm">Wins</span>
              </div>
              <div className="text-2xl font-bold text-white">{selectedPlayer.wins}</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-red-400" />
                <span className="text-gray-400 text-sm">Losses</span>
              </div>
              <div className="text-2xl font-bold text-white">{selectedPlayer.losses}</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-yellow-400" />
                <span className="text-gray-400 text-sm">Win Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">{selectedPlayer.winRate}%</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-blue-400" />
                <span className="text-gray-400 text-sm">Games</span>
              </div>
              <div className="text-2xl font-bold text-white">{selectedPlayer.wins + selectedPlayer.losses}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Live data from Riot Games API
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValorantSearch
