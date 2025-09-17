'use client'

import { TrendingUp, Trophy, Heart, Eye, Target, Calendar } from 'lucide-react'

const ProfileStats = () => {
  // Mock stats data
  const stats = {
    overview: {
      totalLikes: 156,
      totalViews: 4230,
      totalFollowers: 45,
      joinDate: new Date('2023-06-15')
    },
    content: {
      lineupsCreated: 23,
      crosshairsCreated: 8,
      mostLikedLineup: 'Viper Bind A Site Smoke',
      mostDownloadedCrosshair: 'Main Crosshair'
    },
    engagement: {
      avgLikesPerContent: 7.2,
      totalComments: 34,
      responseRate: 85,
      communityRep: 'Good'
    }
  }

  const achievements = [
    { name: 'First Steps', description: 'Created your first lineup', icon: '🎯', earned: true },
    { name: 'Community Favorite', description: 'Received 100+ likes', icon: '❤️', earned: true },
    { name: 'Content Creator', description: 'Created 20+ lineups', icon: '📝', earned: true },
    { name: 'Crosshair Master', description: 'Created 10+ crosshairs', icon: '⌖', earned: false },
    { name: 'Viral Content', description: 'Get 1000+ views on a single lineup', icon: '🔥', earned: false },
    { name: 'Community Leader', description: 'Get 100+ followers', icon: '👑', earned: false }
  ]

  const monthlyStats = [
    { month: 'Jan', lineups: 5, crosshairs: 2, likes: 34 },
    { month: 'Feb', lineups: 8, crosshairs: 3, likes: 67 },
    { month: 'Mar', lineups: 10, crosshairs: 3, likes: 55 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-bold text-2xl text-white mb-2">Statistics</h2>
        <p className="text-gray-400">Your performance and engagement metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-red-400 mb-1">{stats.overview.totalLikes}</div>
          <div className="text-sm text-gray-400">Total Likes</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Eye size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">{stats.overview.totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Views</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.overview.totalFollowers}</div>
          <div className="text-sm text-gray-400">Followers</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar size={20} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {Math.floor((new Date().getTime() - stats.overview.joinDate.getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-gray-400">Days Active</div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target size={20} />
            Content Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lineups Created</span>
              <span className="font-semibold text-white">{stats.content.lineupsCreated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Crosshairs Created</span>
              <span className="font-semibold text-white">{stats.content.crosshairsCreated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Most Liked Lineup</span>
              <span className="font-semibold text-blue-400">{stats.content.mostLikedLineup}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Top Crosshair</span>
              <span className="font-semibold text-yellow-400">{stats.content.mostDownloadedCrosshair}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Engagement
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Likes per Content</span>
              <span className="font-semibold text-green-400">{stats.engagement.avgLikesPerContent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Comments</span>
              <span className="font-semibold text-white">{stats.engagement.totalComments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Response Rate</span>
              <span className="font-semibold text-purple-400">{stats.engagement.responseRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Community Rep</span>
              <span className="font-semibold text-green-400">{stats.engagement.communityRep}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Monthly Activity</h3>
        <div className="grid grid-cols-3 gap-4">
          {monthlyStats.map((month) => (
            <div key={month.month} className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="font-medium text-white mb-2">{month.month}</div>
              <div className="space-y-1 text-sm">
                <div className="text-blue-400">{month.lineups} lineups</div>
                <div className="text-yellow-400">{month.crosshairs} crosshairs</div>
                <div className="text-red-400">{month.likes} likes</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.name}
              className={`p-4 rounded-lg border-2 transition-colors ${
                achievement.earned
                  ? 'border-yellow-600 bg-yellow-600/10'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="text-center">
                <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-semibold mb-1 ${
                  achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-400">{achievement.description}</p>
                {achievement.earned && (
                  <div className="text-xs text-yellow-400 mt-2 font-medium">✓ EARNED</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileStats