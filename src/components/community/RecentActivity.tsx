'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Heart, Share2, Target, Crosshair, Trophy, Clock, Eye, TrendingUp } from 'lucide-react'

const RecentActivity = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'lineups' | 'crosshairs' | 'discussions'>('all')

  const activities = [
    {
      id: '1',
      type: 'lineup',
      user: {
        username: 'LineupMaster',
        rank: 'Immortal 3',
        avatar: '/avatars/lineupmaster.jpg'
      },
      content: {
        title: 'New Viper Ascent B Site One-Way Smoke',
        description: 'Perfect one-way smoke for defending B site on Ascent. Works every time!',
        agent: 'Viper',
        map: 'Ascent',
        thumbnail: '/lineups/viper-ascent-b.jpg'
      },
      stats: {
        likes: 47,
        comments: 12,
        views: 234
      },
      timestamp: '2 hours ago',
      isNew: true
    },
    {
      id: '2',
      type: 'crosshair',
      user: {
        username: 'CrosshairKing',
        rank: 'Radiant',
        avatar: '/avatars/crosshairking.jpg'
      },
      content: {
        title: 'TenZ-Inspired Crosshair',
        description: 'Recreation of TenZ crosshair with personal tweaks for better visibility.',
        shareCode: 'VALO-TENZ247'
      },
      stats: {
        likes: 89,
        comments: 23,
        downloads: 156
      },
      timestamp: '4 hours ago',
      isNew: true
    },
    {
      id: '3',
      type: 'discussion',
      user: {
        username: 'ValoStrats',
        rank: 'Immortal 1',
        avatar: '/avatars/valostrats.jpg'
      },
      content: {
        title: 'Best Agents for Ascent in Current Meta?',
        description: 'What do you think are the best agent compositions for Ascent after the recent patches?',
        replies: 34
      },
      stats: {
        likes: 23,
        comments: 34,
        views: 189
      },
      timestamp: '6 hours ago',
      isNew: false
    },
    {
      id: '4',
      type: 'lineup',
      user: {
        username: 'SmokesMaster',
        rank: 'Diamond 2',
        avatar: '/avatars/smokemaster.jpg'
      },
      content: {
        title: 'Omen Split B Site Execute Smokes',
        description: 'Complete smoke setup for B site execute on Split. Includes timing guide.',
        agent: 'Omen',
        map: 'Split',
        thumbnail: '/lineups/omen-split-b.jpg'
      },
      stats: {
        likes: 31,
        comments: 8,
        views: 156
      },
      timestamp: '8 hours ago',
      isNew: false
    },
    {
      id: '5',
      type: 'achievement',
      user: {
        username: 'ProGamer2023',
        rank: 'Diamond 3',
        avatar: '/avatars/progamer.jpg'
      },
      content: {
        title: 'Reached Diamond 3!',
        description: 'Finally reached Diamond 3 using lineups from this community. Thank you all!',
        achievement: 'Diamond Rank'
      },
      stats: {
        likes: 67,
        comments: 19,
        congratulations: 45
      },
      timestamp: '12 hours ago',
      isNew: false
    }
  ]

  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true
    if (activeTab === 'lineups') return activity.type === 'lineup'
    if (activeTab === 'crosshairs') return activity.type === 'crosshair'
    if (activeTab === 'discussions') return activity.type === 'discussion'
    return true
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lineup': return Target
      case 'crosshair': return Crosshair
      case 'discussion': return MessageCircle
      case 'achievement': return Trophy
      default: return MessageCircle
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lineup': return 'text-red-400'
      case 'crosshair': return 'text-yellow-400'
      case 'discussion': return 'text-blue-400'
      case 'achievement': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getRankColor = (rank: string) => {
    if (rank.includes('Radiant')) return 'text-red-400'
    if (rank.includes('Immortal')) return 'text-purple-400'
    if (rank.includes('Diamond')) return 'text-blue-400'
    return 'text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-2xl">Recent Activity</h2>
        <Link 
          href="/community/activity" 
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Activity', count: activities.length },
          { id: 'lineups', label: 'Lineups', count: activities.filter(a => a.type === 'lineup').length },
          { id: 'crosshairs', label: 'Crosshairs', count: activities.filter(a => a.type === 'crosshair').length },
          { id: 'discussions', label: 'Discussions', count: activities.filter(a => a.type === 'discussion').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const iconColor = getActivityColor(activity.type)
          
          return (
            <div key={activity.id} className="card hover:bg-gray-800/50 transition-colors">
              <div className="flex gap-4">
                {/* Activity Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <Icon size={20} className={iconColor} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{activity.user.username.charAt(0)}</span>
                      </div>
                      <div>
                        <Link 
                          href={`/community/user/${activity.user.username}`}
                          className="font-medium hover:text-purple-400 transition-colors"
                        >
                          {activity.user.username}
                        </Link>
                        <div className={`text-xs ${getRankColor(activity.user.rank)}`}>
                          {activity.user.rank}
                        </div>
                      </div>
                      {activity.isNew && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {activity.timestamp}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 hover:text-purple-400 transition-colors cursor-pointer">
                      {activity.content.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {activity.content.description}
                    </p>

                    {/* Activity-specific content */}
                    {activity.type === 'lineup' && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded">
                          {activity.content.agent}
                        </span>
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                          {activity.content.map}
                        </span>
                      </div>
                    )}

                    {activity.type === 'crosshair' && (
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Share Code:</span>
                          <code className="bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                            {activity.content.shareCode}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Activity Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart size={14} />
                      {activity.stats.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <MessageCircle size={14} />
                      {activity.stats.comments}
                    </button>
                    {activity.stats.views && (
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {activity.stats.views}
                      </div>
                    )}
                    {activity.stats.downloads && (
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        {activity.stats.downloads} downloads
                      </div>
                    )}
                    <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn btn-secondary">
          Load More Activity
        </button>
      </div>
    </div>
  )
}

export default RecentActivity
