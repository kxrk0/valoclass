import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { AlertTriangle, TrendingDown, TrendingUp, Clock, Shield, Users, Flag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reports - Admin Dashboard',
  description: 'View and manage user reports and violations',
  robots: { index: false, follow: false }
}

function ReportsPage() {
  const mockReportsData = {
    totalReports: 127,
    pendingReports: 23,
    resolvedReports: 89,
    dismissedReports: 15,
    weeklyTrend: +12,
    avgResponseTime: '2.4 hours',
    topReasons: [
      { reason: 'Inappropriate Content', count: 45, percentage: 35 },
      { reason: 'Spam', count: 32, percentage: 25 },
      { reason: 'Harassment', count: 28, percentage: 22 },
      { reason: 'Copyright', count: 15, percentage: 12 },
      { reason: 'Other', count: 7, percentage: 6 }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Reports Overview</h1>
        <p className="text-gray-400">Monitor and analyze user reports across the platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{mockReportsData.totalReports}</div>
              <div className="flex items-center gap-1 text-sm text-green-400">
                {mockReportsData.weeklyTrend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(mockReportsData.weeklyTrend)} this week</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Reports</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{mockReportsData.pendingReports}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Pending Review</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{mockReportsData.resolvedReports}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Resolved</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{mockReportsData.avgResponseTime}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Avg Response Time</div>
        </div>
      </div>

      {/* Reports by Reason */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Flag size={20} />
            Reports by Reason
          </h3>
          <div className="space-y-4">
            {mockReportsData.topReasons.map((reason, index) => (
              <div key={reason.reason} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span className="text-gray-300 font-medium">{reason.reason}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${reason.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-bold text-sm w-8">{reason.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
              <AlertTriangle size={20} />
              <div>
                <div className="font-semibold">Review Pending Reports</div>
                <div className="text-sm opacity-90">{mockReportsData.pendingReports} items waiting</div>
              </div>
            </button>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
              <Shield size={20} />
              <div>
                <div className="font-semibold">Moderation Queue</div>
                <div className="text-sm opacity-90">Manage content violations</div>
              </div>
            </button>
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
              <Users size={20} />
              <div>
                <div className="font-semibold">User Management</div>
                <div className="text-sm opacity-90">Handle user violations</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Report Activity</h3>
        <div className="space-y-4">
          {[
            { user: 'ModeratorAlice', action: 'resolved report', target: 'inappropriate comment', time: '5 minutes ago', type: 'resolve' },
            { user: 'AdminBob', action: 'dismissed report', target: 'false spam claim', time: '15 minutes ago', type: 'dismiss' },
            { user: 'ModeratorCharlie', action: 'banned user', target: 'ToxicPlayer123', time: '30 minutes ago', type: 'ban' },
            { user: 'AdminDave', action: 'removed content', target: 'inappropriate lineup', time: '1 hour ago', type: 'remove' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'resolve' ? 'bg-green-400' :
                activity.type === 'dismiss' ? 'bg-gray-400' :
                activity.type === 'ban' ? 'bg-red-400' :
                'bg-orange-400'
              }`}></div>
              <div className="flex-1">
                <span className="text-white font-medium">{activity.user}</span>
                <span className="text-gray-300"> {activity.action} "</span>
                <span className="text-blue-400">{activity.target}</span>
                <span className="text-gray-300">"</span>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <NotificationProvider>
      <AdminSocketProvider>
        <AdminLayout>
          <ReportsPage />
        </AdminLayout>
      </AdminSocketProvider>
    </NotificationProvider>
  )
}
