'use client'

import { useState, useEffect } from 'react'
import { Users, Target, Crosshair, BarChart3, Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalLineups: number
  totalCrosshairs: number
  totalReports: number
  activeUsers: number
  pendingModerations: number
  todaySignups: number
  todayContent: number
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLineups: 0,
    totalCrosshairs: 0,
    totalReports: 0,
    activeUsers: 0,
    pendingModerations: 0,
    todaySignups: 0,
    todayContent: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalUsers: 2847,
        totalLineups: 1456,
        totalCrosshairs: 892,
        totalReports: 23,
        activeUsers: 387,
        pendingModerations: 8,
        todaySignups: 12,
        todayContent: 34
      })
      setLoading(false)
    }, 1000)
  }, [])

  const recentActivity = [
    {
      id: '1',
      type: 'user_signup',
      user: 'ProGamer123',
      action: 'Registered new account',
      timestamp: '2 minutes ago',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: '2',
      type: 'content_created',
      user: 'ValoPlayer',
      action: 'Created lineup "Viper Split B Site"',
      timestamp: '5 minutes ago',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      id: '3',
      type: 'report_submitted',
      user: 'ModUser',
      action: 'Reported inappropriate content',
      timestamp: '8 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-400'
    },
    {
      id: '4',
      type: 'crosshair_shared',
      user: 'DesignMaster',
      action: 'Shared new crosshair design',
      timestamp: '12 minutes ago',
      icon: Crosshair,
      color: 'text-yellow-400'
    }
  ]

  const quickActions = [
    { label: 'User Management', icon: Users, href: '/admin/users', color: 'bg-blue-600' },
    { label: 'Content Moderation', icon: Shield, href: '/admin/moderation', color: 'bg-purple-600' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics', color: 'bg-green-600' },
    { label: 'Reports', icon: AlertTriangle, href: '/admin/reports', color: 'bg-red-600' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your ValorantGuides community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
          </div>
          <div className="text-sm text-green-400">
            +{stats.todaySignups} today
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats.totalLineups.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Lineups</div>
            </div>
          </div>
          <div className="text-sm text-green-400">
            +{Math.floor(stats.todayContent * 0.7)} today
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <Crosshair size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats.totalCrosshairs.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Crosshairs</div>
            </div>
          </div>
          <div className="text-sm text-green-400">
            +{Math.floor(stats.todayContent * 0.3)} today
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats.totalReports}</div>
              <div className="text-sm text-gray-400">Open Reports</div>
            </div>
          </div>
          <div className="text-sm text-red-400">
            {stats.pendingModerations} pending
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-semibold text-xl text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                className={`${action.color} p-6 rounded-xl text-white hover:opacity-90 transition-opacity group`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={24} />
                  <span className="font-medium">{action.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Users */}
        <div className="card">
          <h2 className="font-semibold text-xl text-white mb-6 flex items-center gap-2">
            <Activity size={20} />
            Active Users
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Currently Online</span>
              <span className="font-semibold text-green-400">{stats.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Peak Today</span>
              <span className="font-semibold text-white">{Math.floor(stats.activeUsers * 1.8)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">24h Average</span>
              <span className="font-semibold text-white">{Math.floor(stats.activeUsers * 1.3)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.activeUsers / 500) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="font-semibold text-xl text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ${activity.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </div>
                    <div className="text-gray-400 text-xs">{activity.timestamp}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <h2 className="font-semibold text-xl text-white mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <div className="font-medium text-white">API Status</div>
            <div className="text-sm text-gray-400">All systems operational</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <div className="font-medium text-white">Database</div>
            <div className="text-sm text-gray-400">Running smoothly</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <div className="font-medium text-white">External APIs</div>
            <div className="text-sm text-gray-400">Minor delays</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard