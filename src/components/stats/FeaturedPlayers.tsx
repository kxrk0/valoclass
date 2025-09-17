'use client'

import Link from 'next/link'
import { Trophy, Star, ExternalLink } from 'lucide-react'

const FeaturedPlayers = () => {
  const featuredPlayers = [
    {
      id: '1',
      gameName: 'TenZ',
      tagLine: 'SEN',
      rank: 'Radiant',
      elo: 847,
      region: 'NA',
      team: 'Sentinels',
      mainAgent: 'Jett',
      winRate: 73.2,
      avgCombatScore: 287,
      headShotRate: 28.4,
      recentForm: [true, true, false, true, true], // Win/Loss last 5 games
      isVerified: true,
      profileImage: '/players/tenz.jpg'
    },
    {
      id: '2',
      gameName: 'ScreaM',
      tagLine: 'TL',
      rank: 'Radiant',
      elo: 732,
      region: 'EU',
      team: 'Team Liquid',
      mainAgent: 'Jett',
      winRate: 69.8,
      avgCombatScore: 265,
      headShotRate: 32.1,
      recentForm: [true, false, true, true, true],
      isVerified: true,
      profileImage: '/players/scream.jpg'
    },
    {
      id: '3',
      gameName: 'Chronicle',
      tagLine: 'FNC',
      rank: 'Radiant',
      elo: 698,
      region: 'EU',
      team: 'Fnatic',
      mainAgent: 'Sova',
      winRate: 71.5,
      avgCombatScore: 243,
      headShotRate: 24.8,
      recentForm: [true, true, true, false, true],
      isVerified: true,
      profileImage: '/players/chronicle.jpg'
    },
    {
      id: '4',
      gameName: 'yay',
      tagLine: 'C9',
      rank: 'Radiant',
      elo: 654,
      region: 'NA',
      team: 'Cloud9',
      mainAgent: 'Jett',
      winRate: 68.7,
      avgCombatScore: 271,
      headShotRate: 26.9,
      recentForm: [false, true, true, true, false],
      isVerified: true,
      profileImage: '/players/yay.jpg'
    }
  ]

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Radiant': return 'from-red-500 to-red-600'
      case 'Immortal': return 'from-purple-500 to-purple-600'
      case 'Diamond': return 'from-blue-500 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const topRadiantPlayers = [
    { rank: 1, name: 'TenZ#SEN', elo: 847, region: 'NA' },
    { rank: 2, name: 'ScreaM#TL', elo: 732, region: 'EU' },
    { rank: 3, name: 'Chronicle#FNC', elo: 698, region: 'EU' },
    { rank: 4, name: 'yay#C9', elo: 654, region: 'NA' },
    { rank: 5, name: 'Aspas#LOUD', elo: 631, region: 'BR' },
  ]

  return (
    <div className="space-y-8">
      {/* Featured Pro Players */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">
              Featured Pro Players
            </h2>
            <p className="text-gray-400">
              Top professional players and their current statistics
            </p>
          </div>
          <Link 
            href="/stats/leaderboard" 
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            View Leaderboard
            <ExternalLink size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlayers.map((player) => (
            <Link key={player.id} href={`/stats/player/${player.gameName}-${player.tagLine}`} className="group">
              <div className="card h-full hover:scale-105 transition-transform duration-300">
                {/* Player Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="font-bold">{player.gameName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate group-hover:text-blue-400 transition-colors">
                        {player.gameName}
                      </h3>
                      {player.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">#{player.tagLine}</p>
                  </div>
                </div>

                {/* Rank */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 bg-gradient-to-r ${getRankColor(player.rank)} rounded-full text-white text-sm font-medium`}>
                    {player.rank}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{player.elo} RR</div>
                    <div className="text-xs text-gray-400">{player.region}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="font-medium text-green-400">{player.winRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg ACS</span>
                    <span className="font-medium">{player.avgCombatScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">HS Rate</span>
                    <span className="font-medium text-blue-400">{player.headShotRate}%</span>
                  </div>
                </div>

                {/* Recent Form */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Recent Form</div>
                  <div className="flex gap-1">
                    {player.recentForm.map((win, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          win ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {win ? 'W' : 'L'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Team</span>
                    <span className="text-xs font-medium">{player.team}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Radiant Players */}
      <section>
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-red-400" size={24} />
            <h3 className="font-heading font-bold text-xl">Top Radiant Players</h3>
          </div>

          <div className="space-y-3">
            {topRadiantPlayers.map((player) => (
              <div 
                key={player.rank} 
                className="flex items-center justify-between p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                  e.currentTarget.style.backdropFilter = 'blur(15px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.backdropFilter = 'blur(10px)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.rank === 1 ? 'bg-yellow-500 text-black' :
                    player.rank === 2 ? 'bg-gray-300 text-black' :
                    player.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.region}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-400">{player.elo} RR</div>
                  <div className="text-xs text-gray-400">Radiant</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="card text-center">
        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="font-semibold text-xl mb-2">Want to be Featured?</h3>
        <p className="text-gray-400 mb-4">
          Reach Radiant rank and maintain consistent performance to be featured on our leaderboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/guides/rank-up" className="btn btn-secondary">
            Rank Up Guide
          </Link>
          <Link href="/stats/leaderboard" className="btn btn-primary">
            View Full Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPlayers
