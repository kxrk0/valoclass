'use client'

import { Calendar, Heart, MessageSquare, Users, Trophy, Target } from 'lucide-react'

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'lineup_created',
    title: 'Created a new lineup',
    description: 'Viper Bind A Site Smoke',
    timestamp: new Date('2024-01-15T10:30:00'),
    icon: Target,
    color: 'text-green-400'
  },
  {
    id: '2',
    type: 'like_received',
    title: 'Received 5 likes',
    description: 'On "Sova Ascent A Site Recon"',
    timestamp: new Date('2024-01-14T15:45:00'),
    icon: Heart,
    color: 'text-red-400'
  },
  {
    id: '3',
    type: 'follower_gained',
    title: 'New follower',
    description: 'ProPlayer started following you',
    timestamp: new Date('2024-01-13T09:20:00'),
    icon: Users,
    color: 'text-blue-400'
  },
  {
    id: '4',
    type: 'comment_received',
    title: 'New comment',
    description: 'On "Omen Split B Site Setup"',
    timestamp: new Date('2024-01-12T14:15:00'),
    icon: MessageSquare,
    color: 'text-purple-400'
  },
  {
    id: '5',
    type: 'achievement_earned',
    title: 'Achievement unlocked',
    description: 'Content Creator - Created 20 lineups',
    timestamp: new Date('2024-01-11T11:00:00'),
    icon: Trophy,
    color: 'text-yellow-400'
  }
]

const ProfileActivity = () => {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-bold text-2xl text-white mb-2">Activity</h2>
        <p className="text-gray-400">Your recent activity and interactions</p>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {mockActivities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="card">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ${activity.color}`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-white">{activity.title}</h3>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
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

export default ProfileActivity