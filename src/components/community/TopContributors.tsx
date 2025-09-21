'use client'

import Link from 'next/link'
import { Crown, Trophy, Star } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

const TopContributors = () => {
  const t = useTranslation()
  
  const contributors = [
    {
      id: '1',
      username: 'LineupMaster',
      avatar: '/avatars/lineupmaster.jpg',
      rank: 'Immortal 3',
      contributions: {
        lineups: 127,
        crosshairs: 45,
        likes: 3456
      },
      badges: ['Top Creator', 'Verified', 'Pro Player'],
      joinDate: '2023-03-15',
      isTopContributor: true
    },
    {
      id: '2',
      username: 'CrosshairKing',
      avatar: '/avatars/crosshairking.jpg',
      rank: 'Radiant',
      contributions: {
        lineups: 34,
        crosshairs: 189,
        likes: 2876
      },
      badges: ['Top Creator', 'Crosshair Expert'],
      joinDate: '2023-01-20',
      isTopContributor: true
    },
    {
      id: '3',
      username: 'ValoStrats',
      avatar: '/avatars/valostrats.jpg',
      rank: 'Immortal 1',
      contributions: {
        lineups: 98,
        crosshairs: 67,
        likes: 2234
      },
      badges: ['Strategy Guide', 'Helpful'],
      joinDate: '2023-05-10',
      isTopContributor: true
    },
    {
      id: '4',
      username: 'ProGamer2023',
      avatar: '/avatars/progamer.jpg',
      rank: 'Diamond 3',
      contributions: {
        lineups: 56,
        crosshairs: 78,
        likes: 1987
      },
      badges: ['Rising Star'],
      joinDate: '2023-08-12',
      isTopContributor: false
    },
    {
      id: '5',
      username: 'TacticalGenius',
      avatar: '/avatars/tactical.jpg',
      rank: 'Immortal 2',
      contributions: {
        lineups: 89,
        crosshairs: 23,
        likes: 1654
      },
      badges: ['Strategy Master'],
      joinDate: '2023-04-05',
      isTopContributor: false
    }
  ]

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Top Creator': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'Verified': return 'bg-gradient-to-r from-blue-500 to-blue-600'
      case 'Pro Player': return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'Crosshair Expert': return 'bg-gradient-to-r from-yellow-500 to-orange-500'
      case 'Strategy Guide': return 'bg-gradient-to-r from-green-500 to-green-600'
      case 'Rising Star': return 'bg-gradient-to-r from-cyan-500 to-blue-500'
      case 'Strategy Master': return 'bg-gradient-to-r from-indigo-500 to-purple-500'
      default: return 'bg-gray-600'
    }
  }

  const getRankColor = (rank: string) => {
    if (rank.includes('Radiant')) return 'text-red-400'
    if (rank.includes('Immortal')) return 'text-purple-400'
    if (rank.includes('Diamond')) return 'text-blue-400'
    if (rank.includes('Ascendant')) return 'text-green-400'
    return 'text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Top Contributors */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="text-yellow-400" size={24} />
          <h2 className="font-heading font-bold text-xl">{t.community.contributors.title}</h2>
        </div>

        <div className="space-y-4">
          {contributors.slice(0, 3).map((contributor, index) => (
            <Link 
              key={contributor.id} 
              href={`/community/user/${contributor.username}`}
              className="group block"
            >
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-300 text-black' :
                  'bg-orange-500 text-white'
                }`}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">{contributor.username.charAt(0)}</span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate group-hover:text-purple-400 transition-colors">
                      {contributor.username}
                    </h3>
                    {contributor.isTopContributor && (
                      <Crown size={14} className="text-yellow-400" />
                    )}
                  </div>
                  <div className={`text-sm ${getRankColor(contributor.rank)}`}>
                    {contributor.rank}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="text-sm font-medium text-pink-400">
                    {contributor.contributions.likes}
                  </div>
                  <div className="text-xs text-gray-400">{t.community.contributors.likes}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link 
          href="/community/leaderboard" 
          className="block mt-6 text-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          {t.community.contributors.viewLeaderboard}
        </Link>
      </div>

      {/* Rising Stars */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Star className="text-cyan-400" size={24} />
          <h2 className="font-heading font-bold text-xl">{t.community.contributors.risingStars}</h2>
        </div>

        <div className="space-y-3">
          {contributors.slice(3).map((contributor) => (
            <Link 
              key={contributor.id} 
              href={`/community/user/${contributor.username}`}
              className="group block"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-xs">{contributor.username.charAt(0)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate group-hover:text-cyan-400 transition-colors">
                    {contributor.username}
                  </h3>
                  <div className={`text-xs ${getRankColor(contributor.rank)}`}>
                    {contributor.rank}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">{contributor.contributions.lineups + contributor.contributions.crosshairs}</div>
                  <div className="text-xs text-gray-400">{t.community.contributors.posts}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Badges */}
      <div className="card">
        <h2 className="font-heading font-bold text-lg mb-4">Community Badges</h2>
        <div className="space-y-3">
          {Array.from(new Set(contributors.flatMap(c => c.badges))).slice(0, 6).map((badge) => (
            <div key={badge} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${getBadgeColor(badge)} flex items-center justify-center`}>
                <Trophy size={12} className="text-white" />
              </div>
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </div>
        <Link 
          href="/community/badges" 
          className="block mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View All Badges →
        </Link>
      </div>
    </div>
  )
}

export default TopContributors
