'use client'

import { useState } from 'react'
import { Edit3, Settings, Share2, Calendar, Trophy, Heart, Eye, Users } from 'lucide-react'

// Mock user data
const mockUser = {
  id: '1',
  username: 'ValoPlayer',
  email: 'user@valoclass.com',
  avatar: null,
  banner: null,
  bio: 'Immortal 2 Jett main. Love creating lineups and sharing strategies with the community.',
  location: 'Los Angeles, CA',
  website: 'https://twitch.tv/valoplayer',
  riotId: 'ValoPlayer#NA1',
  role: 'USER',
  isVerified: true,
  isPremium: false,
  joinDate: new Date('2023-06-15'),
  stats: {
    lineupsCreated: 23,
    crosshairsCreated: 8,
    totalLikes: 156,
    totalViews: 4230,
    reputation: 85,
    followers: 45,
    following: 32
  }
}

const ProfileHeader = () => {
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
        {mockUser.banner ? (
          <img 
            src={mockUser.banner} 
            alt="Profile banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}
        
        {/* Edit Banner Button */}
        <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors">
          <Edit3 size={18} />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative -mt-20 z-10">
        <div className="card">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-4xl font-bold text-white border-4 border-gray-900">
                {mockUser.avatar ? (
                  <img 
                    src={mockUser.avatar} 
                    alt={mockUser.username} 
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  mockUser.username.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Edit Avatar Button */}
              <button className="absolute bottom-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-lg text-white transition-colors">
                <Edit3 size={16} />
              </button>

              {/* Verified Badge */}
              {mockUser.isVerified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-heading font-bold text-3xl text-white">
                    {mockUser.username}
                  </h1>
                  {mockUser.isPremium && (
                    <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mockUser.role === 'ADMIN' 
                      ? 'bg-red-600 text-white' 
                      : mockUser.role === 'MODERATOR'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {mockUser.role}
                  </span>
                </div>

                {mockUser.bio && (
                  <p className="text-gray-300 max-w-2xl leading-relaxed mb-4">
                    {mockUser.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {mockUser.location && (
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{mockUser.location}</span>
                    </div>
                  )}
                  {mockUser.website && (
                    <div className="flex items-center gap-1">
                      <span>🔗</span>
                      <a 
                        href={mockUser.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {mockUser.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  {mockUser.riotId && (
                    <div className="flex items-center gap-1">
                      <span>🎮</span>
                      <span>{mockUser.riotId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Joined {formatDate(mockUser.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Settings size={18} />
                Edit Profile
              </button>
              <button className="btn btn-primary flex items-center gap-2">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-red-400 mb-1">
            {formatNumber(mockUser.stats.lineupsCreated)}
          </div>
          <div className="text-xs text-gray-400">Lineups</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-yellow-400 mb-1">
            {formatNumber(mockUser.stats.crosshairsCreated)}
          </div>
          <div className="text-xs text-gray-400">Crosshairs</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-pink-400 mb-1">
            {formatNumber(mockUser.stats.totalLikes)}
          </div>
          <div className="text-xs text-gray-400">Likes</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Eye size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-blue-400 mb-1">
            {formatNumber(mockUser.stats.totalViews)}
          </div>
          <div className="text-xs text-gray-400">Views</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-purple-400 mb-1">
            {formatNumber(mockUser.stats.reputation)}
          </div>
          <div className="text-xs text-gray-400">Reputation</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-green-400 mb-1">
            {formatNumber(mockUser.stats.followers)}
          </div>
          <div className="text-xs text-gray-400">Followers</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users size={20} className="text-white" />
          </div>
          <div className="text-xl font-bold text-cyan-400 mb-1">
            {formatNumber(mockUser.stats.following)}
          </div>
          <div className="text-xs text-gray-400">Following</div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader