'use client'

import { TrendingUp, Users, Target, Crosshair, MessageCircle, Calendar } from 'lucide-react'

const CommunityStats = () => {
  const stats = [
    {
      label: 'Total Members',
      value: '25,847',
      change: '+1,234',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Active Today',
      value: '3,456',
      change: '+234',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Lineups Shared',
      value: '5,234',
      change: '+89',
      changeType: 'increase',
      icon: Target,
      color: 'text-red-400'
    },
    {
      label: 'Crosshairs Created',
      value: '12,567',
      change: '+156',
      changeType: 'increase',
      icon: Crosshair,
      color: 'text-yellow-400'
    }
  ]

  const weeklyActivity = [
    { day: 'Mon', lineups: 12, crosshairs: 34, discussions: 45 },
    { day: 'Tue', lineups: 18, crosshairs: 28, discussions: 52 },
    { day: 'Wed', lineups: 15, crosshairs: 41, discussions: 38 },
    { day: 'Thu', lineups: 22, crosshairs: 35, discussions: 47 },
    { day: 'Fri', lineups: 28, crosshairs: 52, discussions: 61 },
    { day: 'Sat', lineups: 35, crosshairs: 67, discussions: 78 },
    { day: 'Sun', lineups: 31, crosshairs: 45, discussions: 69 }
  ]

  const topCountries = [
    { country: 'United States', flag: '🇺🇸', percentage: 28.5, members: 7345 },
    { country: 'Germany', flag: '🇩🇪', percentage: 12.3, members: 3178 },
    { country: 'United Kingdom', flag: '🇬🇧', percentage: 9.8, members: 2533 },
    { country: 'France', flag: '🇫🇷', percentage: 8.1, members: 2094 },
    { country: 'Brazil', flag: '🇧🇷', percentage: 7.4, members: 1913 }
  ]

  const recentMilestones = [
    {
      milestone: '25,000 Members',
      date: '2024-01-15',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      milestone: '10,000 Crosshairs',
      date: '2024-01-10',
      icon: Crosshair,
      color: 'text-yellow-400'
    },
    {
      milestone: '5,000 Lineups',
      date: '2024-01-05',
      icon: Target,
      color: 'text-red-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-green-400" size={24} />
          <h2 className="font-heading font-bold text-xl">Community Stats</h2>
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Icon size={16} className={stat.color} />
                  </div>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stat.value}</div>
                  <div className="text-xs text-green-400">{stat.change} this week</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Weekly Activity</h3>
        <div className="space-y-3">
          {weeklyActivity.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <div className="w-8 text-xs text-gray-400">{day.day}</div>
              <div className="flex-1 flex gap-1">
                <div 
                  className="bg-red-600 h-4 rounded-sm"
                  style={{ width: `${(day.lineups / 40) * 100}%` }}
                  title={`${day.lineups} lineups`}
                />
                <div 
                  className="bg-yellow-600 h-4 rounded-sm"
                  style={{ width: `${(day.crosshairs / 70) * 100}%` }}
                  title={`${day.crosshairs} crosshairs`}
                />
                <div 
                  className="bg-blue-600 h-4 rounded-sm"
                  style={{ width: `${(day.discussions / 80) * 100}%` }}
                  title={`${day.discussions} discussions`}
                />
              </div>
              <div className="text-xs text-gray-400 w-8 text-right">
                {day.lineups + day.crosshairs + day.discussions}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
            <span className="text-gray-400">Lineups</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-600 rounded-sm"></div>
            <span className="text-gray-400">Crosshairs</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
            <span className="text-gray-400">Discussions</span>
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Members by Country</h3>
        <div className="space-y-3">
          {topCountries.map((country, index) => (
            <div key={country.country} className="flex items-center gap-3">
              <div className="text-lg">{country.flag}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{country.country}</span>
                  <span className="text-xs text-gray-400">{country.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-400 text-right">
                {country.members.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Milestones */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-purple-400" size={20} />
          <h3 className="font-semibold text-lg">Recent Milestones</h3>
        </div>
        
        <div className="space-y-3">
          {recentMilestones.map((milestone, index) => {
            const Icon = milestone.icon
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <Icon size={14} className={milestone.color} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{milestone.milestone}</div>
                  <div className="text-xs text-gray-400">{new Date(milestone.date).toLocaleDateString()}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Join CTA */}
      <div className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Join the Discussion</h3>
          <p className="text-gray-400 text-sm mb-4">
            Connect with players, share your strategies, and learn from the community.
          </p>
          <button className="btn btn-primary w-full">
            Join Discord
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommunityStats
