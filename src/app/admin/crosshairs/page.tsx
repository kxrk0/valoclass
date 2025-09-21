'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Crosshair, 
  Eye, 
  Heart, 
  Download, 
  Flag, 
  Search, 
  Filter,
  Star,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'
import * as React from 'react'

function CrosshairsManagement() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')

  const mockCrosshairs = [
    {
      id: 'ch_001',
      name: 'TenZ Classic Red',
      author: 'ProPlayer_TenZ',
      code: '0;s;1;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0',
      status: 'approved',
      category: 'Pro Player',
      views: 15420,
      likes: 2847,
      downloads: 8934,
      reports: 0,
      isFeatured: true,
      createdAt: '2024-01-15',
      lastModified: '2024-01-20'
    },
    {
      id: 'ch_002', 
      name: 'Minimal Green Dot',
      author: 'DesignMaster',
      code: '0;s;1;P;c;1;t;4;o;1;d;1;z;1;0t;6;0l;3;0o;1;0a;1;0f;0;1t;3;1l;2;1o;2;1a;1;1m;0;1f;0',
      status: 'pending',
      category: 'Community',
      views: 1203,
      likes: 156,
      downloads: 89,
      reports: 2,
      isFeatured: false,
      createdAt: '2024-01-22',
      lastModified: '2024-01-22'
    },
    {
      id: 'ch_003',
      name: 'Shroud Precision',
      author: 'ShroudFan2024',
      code: '0;s;1;P;c;1;h;0;m;1;0l;4;0o;1;0a;1;0f;0;1b;0',
      status: 'approved',
      category: 'Pro Player',
      views: 9821,
      likes: 1654,
      downloads: 4321,
      reports: 1,
      isFeatured: false,
      createdAt: '2024-01-18',
      lastModified: '2024-01-19'
    },
    {
      id: 'ch_004',
      name: 'Rainbow Unicorn',
      author: 'FunCrosshair',
      code: '0;s;1;P;c;8;h;0;f;0;0l;6;0o;3;0a;1;0f;0;1b;0',
      status: 'rejected',
      category: 'Fun',
      views: 234,
      likes: 23,
      downloads: 12,
      reports: 5,
      isFeatured: false,
      createdAt: '2024-01-21',
      lastModified: '2024-01-21'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'pending': return AlertTriangle
      case 'rejected': return XCircle
      default: return AlertTriangle
    }
  }

  const filteredCrosshairs = mockCrosshairs.filter(crosshair => {
    if (statusFilter !== 'all' && crosshair.status !== statusFilter) return false
    if (searchQuery && !crosshair.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crosshair.author.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Crosshair size={28} />
            Crosshairs Management
          </h1>
          <p className="text-gray-400">Manage community crosshairs and featured content</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{filteredCrosshairs.length} crosshairs</span>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Crosshair size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">892</div>
              <div className="text-sm text-blue-400">+34 this week</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Crosshairs</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">756</div>
              <div className="text-sm text-green-400">84.7% approved</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Approved</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">23</div>
              <div className="text-sm text-yellow-400">Needs review</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">67</div>
              <div className="text-sm text-purple-400">Featured</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Featured Items</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search crosshairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800/50 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="downloads">Most Downloads</option>
          </select>

          <button className="bg-gray-800/50 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Crosshairs Table */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">Crosshairs Database</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Crosshair</th>
                <th className="text-left p-4 text-gray-300 font-medium">Author</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                <th className="text-right p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredCrosshairs.map((crosshair) => {
                const StatusIcon = getStatusIcon(crosshair.status)
                return (
                  <tr key={crosshair.id} className="hover:bg-gray-800/50/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Crosshair size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{crosshair.name}</div>
                          <div className="text-sm text-gray-400">{crosshair.category}</div>
                          {crosshair.isFeatured && (
                            <div className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs mt-1">
                              <Star size={12} />
                              Featured
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{crosshair.author}</div>
                      <div className="text-sm text-gray-400">ID: {crosshair.id}</div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(crosshair.status)}`}>
                        <StatusIcon size={14} />
                        {crosshair.status.charAt(0).toUpperCase() + crosshair.status.slice(1)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Eye size={12} />
                          {crosshair.views.toLocaleString()} views
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Heart size={12} />
                          {crosshair.likes.toLocaleString()} likes
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Download size={12} />
                          {crosshair.downloads.toLocaleString()} downloads
                        </div>
                        {crosshair.reports > 0 && (
                          <div className="flex items-center gap-2 text-red-400">
                            <Flag size={12} />
                            {crosshair.reports} reports
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">{crosshair.createdAt}</div>
                      <div className="text-sm text-gray-400">Modified: {crosshair.lastModified}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50/50 rounded-lg transition-all duration-200">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function AdminCrosshairsPage() {
  return (
    <AdminLayout>
      <CrosshairsManagement />
    </AdminLayout>
  )
}
