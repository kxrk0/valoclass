import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare,
  Target,
  Crosshair,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analytics - Admin Dashboard',
  description: 'View platform analytics and insights',
  robots: { index: false, follow: false }
}

function AnalyticsPage() {
  const mockAnalytics = {
    overview: {
      totalUsers: 2847,
      activeUsers: 387,
      newUsers: 45,
      retention: 68.5
    },
    engagement: {
      totalViews: 45621,
      totalLikes: 8934,
      totalComments: 2156,
      avgSessionTime: '8m 32s'
    },
    content: {
      totalLineups: 1456,
      totalCrosshairs: 892,
      featuredContent: 67,
      pendingReview: 23
    },
    trends: {
      users: { current: 387, previous: 342, change: 13 },
      content: { current: 2348, previous: 2103, change: 11 },
      engagement: { current: 8934, previous: 7821, change: 14 }
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }: any) => (
    <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white mb-1">{value}</div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && <div className="text-xs text-green-400 mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Platform insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Calendar size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">User Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={mockAnalytics.overview.totalUsers.toLocaleString()}
            subtitle="+45 this week"
            icon={Users}
            trend={mockAnalytics.trends.users.change}
            color="bg-blue-600"
          />
          <StatCard
            title="Active Users"
            value={mockAnalytics.overview.activeUsers}
            subtitle="Currently online"
            icon={Globe}
            trend={mockAnalytics.trends.users.change}
            color="bg-green-600"
          />
          <StatCard
            title="New Users"
            value={mockAnalytics.overview.newUsers}
            subtitle="This week"
            icon={TrendingUp}
            trend={8}
            color="bg-purple-600"
          />
          <StatCard
            title="Retention Rate"
            value={`${mockAnalytics.overview.retention}%`}
            subtitle="7-day retention"
            icon={Heart}
            trend={3}
            color="bg-pink-600"
          />
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Views"
            value={mockAnalytics.engagement.totalViews.toLocaleString()}
            subtitle="+1.2k today"
            icon={Eye}
            trend={12}
            color="bg-indigo-600"
          />
          <StatCard
            title="Total Likes"
            value={mockAnalytics.engagement.totalLikes.toLocaleString()}
            subtitle="+89 today"
            icon={Heart}
            trend={mockAnalytics.trends.engagement.change}
            color="bg-red-600"
          />
          <StatCard
            title="Comments"
            value={mockAnalytics.engagement.totalComments.toLocaleString()}
            subtitle="+34 today"
            icon={MessageSquare}
            trend={7}
            color="bg-yellow-600"
          />
          <StatCard
            title="Avg Session"
            value={mockAnalytics.engagement.avgSessionTime}
            subtitle="Per user"
            icon={Clock}
            trend={5}
            color="bg-teal-600"
          />
        </div>
      </div>

      {/* Content Stats */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Content Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Lineups"
            value={mockAnalytics.content.totalLineups.toLocaleString()}
            subtitle="+24 this week"
            icon={Target}
            trend={mockAnalytics.trends.content.change}
            color="bg-green-600"
          />
          <StatCard
            title="Total Crosshairs"
            value={mockAnalytics.content.totalCrosshairs.toLocaleString()}
            subtitle="+8 this week"
            icon={Crosshair}
            trend={6}
            color="bg-yellow-600"
          />
          <StatCard
            title="Featured Content"
            value={mockAnalytics.content.featuredContent}
            subtitle="Currently featured"
            icon={BarChart3}
            trend={2}
            color="bg-purple-600"
          />
          <StatCard
            title="Pending Review"
            value={mockAnalytics.content.pendingReview}
            subtitle="Awaiting approval"
            icon={Clock}
            trend={-15}
            color="bg-orange-600"
          />
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Content Types */}
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={20} />
            Popular Content Types
          </h3>
          <div className="space-y-4">
            {[
              { type: 'Lineups', count: 1456, percentage: 62, color: 'from-green-500 to-green-600' },
              { type: 'Crosshairs', count: 892, percentage: 38, color: 'from-yellow-500 to-yellow-600' },
              { type: 'Comments', count: 2156, percentage: 85, color: 'from-blue-500 to-blue-600' },
              { type: 'User Profiles', count: 2847, percentage: 95, color: 'from-purple-500 to-purple-600' }
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                  <span className="text-gray-300 font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-bold text-sm w-16">{item.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} />
            Top Performing Content
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Viper Snake Bite Lineups - Bind', views: 2341, likes: 189, type: 'lineup' },
              { title: 'Pro Player Crosshair Settings', views: 1876, likes: 234, type: 'crosshair' },
              { title: 'Sage Wall Placements - Haven', views: 1654, likes: 156, type: 'lineup' },
              { title: 'Minimal Red Dot Crosshair', views: 1432, likes: 198, type: 'crosshair' },
              { title: 'Jett Updraft Spots - Ascent', views: 1287, likes: 143, type: 'lineup' }
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    {content.type === 'lineup' ? <Target size={16} className="text-white" /> : <Crosshair size={16} className="text-white" />}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{content.title}</div>
                    <div className="text-xs text-gray-400">{content.views} views • {content.likes} likes</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity Timeline */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Clock size={20} />
          User Activity Timeline (Last 24 Hours)
        </h3>
        <div className="grid grid-cols-12 gap-2 h-32">
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i;
            const activity = Math.floor(Math.random() * 100) + 20; // Mock data
            return (
              <div key={i} className="flex flex-col justify-end items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${activity}%` }}
                  title={`${hour}:00 - ${activity}% activity`}
                ></div>
                <span className="text-xs text-gray-400">{hour}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-400">Hours (24h format)</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <NotificationProvider>
      <AdminSocketProvider>
        <AdminLayout>
          <AnalyticsPage />
        </AdminLayout>
      </AdminSocketProvider>
    </NotificationProvider>
  )
}
