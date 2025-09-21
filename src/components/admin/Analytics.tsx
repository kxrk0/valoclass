'use client'

import { useState } from 'react'
import { TrendingUp, Users, Target, Eye, Download, Heart } from 'lucide-react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Mock analytics data
  const analytics = {
    overview: {
      totalUsers: 12547,
      activeUsers: 1834,
      newUsers: 89,
      retention: 67.8,
      totalContent: 24557,
      contentViews: 145789,
      engagement: 78.4
    },
    content: {
      lineups: {
        total: 8923,
        approved: 8456,
        pending: 23,
        rejected: 444,
        avgRating: 4.2,
        totalViews: 89456
      },
      crosshairs: {
        total: 15634,
        public: 12890,
        private: 2744,
        avgDownloads: 23.7,
        totalDownloads: 345789
      }
    },
    activity: [
      { date: '2024-01-12', users: 1654, content: 89, views: 12456 },
      { date: '2024-01-13', users: 1789, content: 102, views: 13245 },
      { date: '2024-01-14', users: 1834, content: 95, views: 11987 },
      { date: '2024-01-15', users: 1923, content: 118, views: 14567 },
      { date: '2024-01-16', users: 2001, content: 134, views: 15234 },
      { date: '2024-01-17', users: 1876, content: 87, views: 13567 },
      { date: '2024-01-18', users: 1834, content: 112, views: 14234 }
    ],
    topContent: [
      { type: 'lineup', title: 'Viper Ascent B Site One-Way', views: 2345, likes: 234 },
      { type: 'crosshair', title: 'TenZ Crosshair Recreation', downloads: 1234, likes: 189 },
      { type: 'lineup', title: 'Sova Bind Hookah Dart', views: 1987, likes: 167 },
      { type: 'crosshair', title: 'Minimalist Dot Crosshair', downloads: 987, likes: 145 }
    ]
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      case '1y': return 'Last year'
      default: return 'Last 30 days'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Analytics Dashboard</h3>
            <p className="text-gray-400 text-sm">Platform metrics and insights</p>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{analytics.overview.totalUsers.toLocaleString()}</p>
              <p className="text-green-400 text-xs">+{analytics.overview.newUsers} this month</p>
            </div>
            <Users className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{analytics.overview.activeUsers.toLocaleString()}</p>
              <p className="text-green-400 text-xs">+5.2% vs last period</p>
            </div>
            <TrendingUp className="text-green-400" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Content</p>
              <p className="text-2xl font-bold text-white">{analytics.overview.totalContent.toLocaleString()}</p>
              <p className="text-blue-400 text-xs">+234 this week</p>
            </div>
            <Target className="text-red-400" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">{analytics.overview.contentViews.toLocaleString()}</p>
              <p className="text-green-400 text-xs">+12.8% vs last period</p>
            </div>
            <Eye className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Content Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-semibold text-lg mb-4">Lineup Statistics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Lineups</span>
              <span className="font-semibold text-white">{analytics.content.lineups.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Approved</span>
              <span className="font-semibold text-green-400">{analytics.content.lineups.approved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pending Review</span>
              <span className="font-semibold text-yellow-400">{analytics.content.lineups.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Rejected</span>
              <span className="font-semibold text-red-400">{analytics.content.lineups.rejected}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Rating</span>
              <span className="font-semibold text-blue-400">{analytics.content.lineups.avgRating}/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Views</span>
              <span className="font-semibold text-purple-400">{analytics.content.lineups.totalViews.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-semibold text-lg mb-4">Crosshair Statistics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Crosshairs</span>
              <span className="font-semibold text-white">{analytics.content.crosshairs.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Public</span>
              <span className="font-semibold text-green-400">{analytics.content.crosshairs.public}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Private</span>
              <span className="font-semibold text-gray-400">{analytics.content.crosshairs.private}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Avg Downloads</span>
              <span className="font-semibold text-blue-400">{analytics.content.crosshairs.avgDownloads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Downloads</span>
              <span className="font-semibold text-purple-400">{analytics.content.crosshairs.totalDownloads.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card">
        <h4 className="font-semibold text-lg mb-4">Daily Activity ({getTimeRangeLabel()})</h4>
        <div className="space-y-4">
          {analytics.activity.map((day, index) => (
            <div key={day.date} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{new Date(day.date).toLocaleDateString()}</span>
                <span className="text-white">{day.users} users, {day.content} content, {day.views} views</span>
              </div>
              <div className="flex gap-1 h-2">
                <div 
                  className="bg-blue-500 rounded-sm"
                  style={{ width: `${(day.users / 2500) * 100}%` }}
                  title={`${day.users} users`}
                />
                <div 
                  className="bg-red-500 rounded-sm"
                  style={{ width: `${(day.content / 200) * 100}%` }}
                  title={`${day.content} content`}
                />
                <div 
                  className="bg-purple-500 rounded-sm"
                  style={{ width: `${(day.views / 20000) * 100}%` }}
                  title={`${day.views} views`}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex gap-6 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-gray-400">Users</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-gray-400">Content</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
            <span className="text-gray-400">Views</span>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="card">
        <h4 className="font-semibold text-lg mb-4">Top Performing Content</h4>
        <div className="space-y-3">
          {analytics.topContent.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
              <div className="text-2xl">
                {item.type === 'lineup' ? '🎯' : '⚔️'}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-white">{item.title}</h5>
                <div className="flex gap-4 text-sm text-gray-400">
                  {'views' in item && (
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {item.views} views
                    </div>
                  )}
                  {'downloads' in item && (
                    <div className="flex items-center gap-1">
                      <Download size={12} />
                      {item.downloads} downloads
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Heart size={12} />
                    {item.likes} likes
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-400">
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-xl font-bold text-white mb-1">{analytics.overview.engagement}%</div>
          <div className="text-sm text-gray-400">Engagement Rate</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-2">🔄</div>
          <div className="text-xl font-bold text-white mb-1">{analytics.overview.retention}%</div>
          <div className="text-sm text-gray-400">User Retention</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-xl font-bold text-white mb-1">{analytics.content.lineups.avgRating}</div>
          <div className="text-sm text-gray-400">Avg Content Rating</div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
