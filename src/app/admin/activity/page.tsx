import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Target, 
  Crosshair, 
  Heart,
  Flag,
  Shield,
  Clock,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  Eye
} from 'lucide-react'
import { AdminLoader } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Activity Monitor - Admin Dashboard',
  description: 'Monitor real-time user activity and system events',
  robots: { index: false, follow: false }
}

function ActivityMonitorPage() {
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const mockActivities = [
    {
      id: '1',
      type: 'user_signup',
      user: 'ProGamer123',
      action: 'Registered new account',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      icon: Users,
      color: 'text-green-400',
      details: { email: 'pro***@example.com', method: 'Google OAuth' }
    },
    {
      id: '2',
      type: 'content_created',
      user: 'ValoPlayer',
      action: 'Created lineup "Viper Split B Site"',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      icon: Target,
      color: 'text-blue-400',
      details: { contentId: 'lineup_456', map: 'Split', agent: 'Viper' }
    },
    {
      id: '3',
      type: 'user_login',
      user: 'AdminModerator',
      action: 'Logged in to admin panel',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      icon: Shield,
      color: 'text-purple-400',
      details: { ip: '192.168.1.***', userAgent: 'Chrome/91.0' }
    },
    {
      id: '4',
      type: 'report_submitted',
      user: 'ModUser',
      action: 'Reported inappropriate content',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      icon: Flag,
      color: 'text-red-400',
      details: { reportedContentId: 'comment_789', reason: 'Inappropriate' }
    },
    {
      id: '5',
      type: 'crosshair_shared',
      user: 'DesignMaster',
      action: 'Shared new crosshair design',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      icon: Crosshair,
      color: 'text-yellow-400',
      details: { crosshairId: 'ch_123', shareCode: 'XH4B9K2L' }
    },
    {
      id: '6',
      type: 'content_liked',
      user: 'FanUser',
      action: 'Liked lineup "Sage Walls for Icebox"',
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      icon: Heart,
      color: 'text-pink-400',
      details: { contentId: 'lineup_321', contentType: 'lineup' }
    },
    {
      id: '7',
      type: 'comment_posted',
      user: 'FeedbackUser',
      action: 'Posted comment on lineup',
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      icon: MessageSquare,
      color: 'text-indigo-400',
      details: { commentId: 'com_987', parentContent: 'Reyna Flash Spots' }
    },
    {
      id: '8',
      type: 'user_logout',
      user: 'ProGamer123',
      action: 'Logged out',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      icon: Users,
      color: 'text-gray-400',
      details: { sessionDuration: '45 minutes' }
    }
  ];

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const filteredActivities = mockActivities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false;
    if (search && !activity.user.toLowerCase().includes(search.toLowerCase()) && 
        !activity.action.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Activity size={28} />
            Activity Monitor
            <div className="flex items-center gap-2 text-sm font-normal">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Live</span>
            </div>
          </h1>
          <p className="text-gray-400">Real-time monitoring of user activities and system events</p>
        </div>
        <button
          onClick={() => setLoading(!loading)}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Activity Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Activities</option>
            <option value="user_signup">User Signups</option>
            <option value="user_login">User Logins</option>
            <option value="content_created">Content Created</option>
            <option value="content_liked">Content Liked</option>
            <option value="comment_posted">Comments</option>
            <option value="report_submitted">Reports</option>
          </select>

          {/* Time Range */}
          <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none">
            <option>Last hour</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>

          {/* Export */}
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2">
            <ExternalLink size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">234</div>
              <div className="text-sm text-green-400">+12 today</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Active Users</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Activity size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">1,847</div>
              <div className="text-sm text-blue-400">Last hour</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Activities</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">89</div>
              <div className="text-sm text-yellow-400">Today</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">New Content</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Flag size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-sm text-red-400">Pending</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Reports</div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity size={20} />
            Live Activity Feed ({filteredActivities.length})
          </h3>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            Real-time
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-16 text-center">
              <AdminLoader size="lg" message="Loading activities..." />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No activities found</p>
              <p>No activities match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {filteredActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className="p-4 hover:bg-gray-700/20 transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ${activity.color} flex-shrink-0`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm mb-1">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {getTimeAgo(activity.timestamp)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {activity.type.replace('_', ' ')}
                          </div>
                        </div>
                        {activity.details && (
                          <div className="mt-2 text-xs text-gray-500">
                            {Object.entries(activity.details).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        #{activity.id}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add React import
import * as React from 'react';
import ActivityLog from '@/components/admin/ActivityLog'

export default function AdminActivityPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminSocketProvider>
          <AdminLayout>
            <ActivityLog />
          </AdminLayout>
        </AdminSocketProvider>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
