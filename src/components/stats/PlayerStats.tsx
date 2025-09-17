'use client'

import { useState } from 'react'
import { Trophy, TrendingUp, Target, Clock, Award, Star, BarChart3, Calendar } from 'lucide-react'
import type { PlayerStats as PlayerStatsType, MatchHistory } from '@/types'

interface PlayerStatsProps {
  playerStats: PlayerStatsType
  matchHistory?: MatchHistory
}

const PlayerStats = ({ playerStats, matchHistory }: PlayerStatsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'performance'>('overview')

  const getRankColor = (tier: number) => {
    if (tier >= 24) return 'text-red-400'
    if (tier >= 21) return 'text-purple-400'
    if (tier >= 15) return 'text-blue-400'
    if (tier >= 9) return 'text-cyan-400'
    if (tier >= 3) return 'text-yellow-400'
    if (tier >= 1) return 'text-gray-400'
    return 'text-orange-400'
  }

  const getRankBadge = (tier: number) => {
    if (tier >= 24) return '👑'
    if (tier >= 21) return '💎'
    if (tier >= 15) return '💠'
    if (tier >= 9) return '🔷'
    if (tier >= 3) return '🟡'
    if (tier >= 1) return '⚪'
    return '🟤'
  }

  const getMMRChange = (change: number) => {
    if (change > 0) return { color: 'text-green-400', icon: '↗️', text: `+${change} RR` }
    if (change < 0) return { color: 'text-red-400', icon: '↘️', text: `${change} RR` }
    return { color: 'text-gray-400', icon: '➡️', text: '±0 RR' }
  }

  const mmrChange = getMMRChange(playerStats.mmr_change_to_last_game)

  // Mock additional stats for demonstration
  const mockStats = {
    winRate: 67,
    avgKDA: 1.34,
    mostPlayedAgent: 'Jett',
    peakRank: 'Immortal 2',
    gamesPlayed: 145,
    hoursPlayed: 89,
    headhotPercentage: 23.4,
    avgDamagePerRound: 156.7
  }

  const tabButtons = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'matches', label: 'Recent Matches', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp }
  ]

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Player Card */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
              {playerStats.gameName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">
                {playerStats.gameName}
                <span className="text-gray-400">#{playerStats.tagLine}</span>
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400">Level {playerStats.accountLevel}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 uppercase">{playerStats.region}</span>
              </div>
            </div>
          </div>

          {/* Rank Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">{getRankBadge(playerStats.currenttier)}</span>
                <div className={`font-bold ${getRankColor(playerStats.currenttier)}`}>
                  {playerStats.currenttierpatched}
                </div>
              </div>
              <div className="text-sm text-gray-400">Current Rank</div>
            </div>

            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className={`font-bold text-lg ${mmrChange.color}`}>
                  {mmrChange.text}
                </span>
                <span>{mmrChange.icon}</span>
              </div>
              <div className="text-sm text-gray-400">Last Game</div>
            </div>

            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="font-bold text-lg text-blue-400 mb-2">
                {playerStats.elo} ELO
              </div>
              <div className="text-sm text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {tabButtons.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">{mockStats.winRate}%</div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">{mockStats.avgKDA}</div>
            <div className="text-sm text-gray-400">Avg K/D</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">{mockStats.mostPlayedAgent}</div>
            <div className="text-sm text-gray-400">Main Agent</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{mockStats.peakRank}</div>
            <div className="text-sm text-gray-400">Peak Rank</div>
          </div>

          <div className="card text-center">
            <div className="text-xl font-bold text-white mb-1">{mockStats.gamesPlayed}</div>
            <div className="text-sm text-gray-400">Games Played</div>
          </div>

          <div className="card text-center">
            <div className="text-xl font-bold text-white mb-1">{mockStats.hoursPlayed}h</div>
            <div className="text-sm text-gray-400">Hours Played</div>
          </div>

          <div className="card text-center">
            <div className="text-xl font-bold text-red-400 mb-1">{mockStats.headhotPercentage}%</div>
            <div className="text-sm text-gray-400">Headshot %</div>
          </div>

          <div className="card text-center">
            <div className="text-xl font-bold text-cyan-400 mb-1">{mockStats.avgDamagePerRound}</div>
            <div className="text-sm text-gray-400">Avg DMG/Round</div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-4">
          {matchHistory?.data?.slice(0, 5).map((match, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${match.teams?.red?.has_won ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div>
                    <div className="font-medium text-white">{match.meta?.map?.name || 'Unknown Map'}</div>
                    <div className="text-sm text-gray-400">{match.meta?.mode || 'Competitive'}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-white">
                    {match.stats?.kills || 0}/{match.stats?.deaths || 0}/{match.stats?.assists || 0}
                  </div>
                  <div className="text-sm text-gray-400">K/D/A</div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-white">{match.stats?.character?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-400">Agent</div>
                </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  match.teams?.red?.has_won ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                }`}>
                  {match.teams?.red?.has_won ? 'Victory' : 'Defeat'}
                </div>
              </div>
            </div>
          )) || (
            <div className="card text-center py-8">
              <Clock size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold mb-2">No Recent Matches</h3>
              <p className="text-gray-400">Match history will appear here once available.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart Placeholder */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Rank Progress
            </h3>
            <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">Performance charts coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Performance */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar size={20} />
              This Week
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Games Played</span>
                <span className="font-semibold text-white">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-semibold text-green-400">75%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">Avg K/D</span>
                <span className="font-semibold text-blue-400">1.45</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">RR Gained</span>
                <span className="font-semibold text-yellow-400">+156</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(playerStats.updated_at).toLocaleString()}
      </div>
    </div>
  )
}

export default PlayerStats