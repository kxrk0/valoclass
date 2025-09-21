import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  Target, 
  Eye, 
  Heart, 
  Download, 
  Flag, 
  Search, 
  Filter,
  Star,
  Map,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  User
} from 'lucide-react'
import * as React from 'react'

export const metadata: Metadata = {
  title: 'Lineups Management - Admin Dashboard', 
  description: 'Manage community lineups and tactical content',
  robots: { index: false, follow: false }
}

function LineupsManagement() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [mapFilter, setMapFilter] = React.useState('all')
  const [agentFilter, setAgentFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')

  const mockLineups = [
    {
      id: 'lu_001',
      title: 'Viper Snake Bite Defense - B Site',
      author: 'TacticalMaster',
      agent: 'Viper',
      map: 'Bind',
      ability: 'Snake Bite',
      type: 'Defensive',
      status: 'approved',
      views: 25430,
      likes: 3847,
      downloads: 12934,
      reports: 0,
      isFeatured: true,
      difficulty: 'Advanced',
      accuracy: 95,
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      tags: ['post-plant', 'defensive', 'b-site']
    },
    {
      id: 'lu_002',
      title: 'Sage Wall Placement - Mid Control',
      author: 'ProStrat',
      agent: 'Sage',
      map: 'Haven',
      ability: 'Barrier Orb',
      type: 'Utility',
      status: 'pending',
      views: 1203,
      likes: 156,
      downloads: 89,
      reports: 1,
      isFeatured: false,
      difficulty: 'Beginner',
      accuracy: 88,
      createdAt: '2024-01-22',
      lastModified: '2024-01-22',
      tags: ['mid-control', 'defensive', 'rotation']
    },
    {
      id: 'lu_003',
      title: 'Sova Dart Spots - A Site Info',
      author: 'ReconExpert',
      agent: 'Sova',
      map: 'Ascent', 
      ability: 'Recon Bolt',
      type: 'Information',
      status: 'approved',
      views: 18921,
      likes: 2654,
      downloads: 8321,
      reports: 0,
      isFeatured: false,
      difficulty: 'Intermediate',
      accuracy: 92,
      createdAt: '2024-01-18',
      lastModified: '2024-01-19',
      tags: ['info-gathering', 'a-site', 'retake']
    },
    {
      id: 'lu_004',
      title: 'Jett Updraft Escape Routes',
      author: 'DashMaster',
      agent: 'Jett',
      map: 'Split',
      ability: 'Updraft',
      type: 'Mobility',
      status: 'rejected',
      views: 456,
      likes: 23,
      downloads: 12,
      reports: 3,
      isFeatured: false,
      difficulty: 'Expert',
      accuracy: 65,
      createdAt: '2024-01-21',
      lastModified: '2024-01-21',
      tags: ['escape', 'risky', 'situational']
    }
  ]

  const maps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus', 'Sunset']
  const agents = ['Viper', 'Sage', 'Sova', 'Jett', 'Phoenix', 'Omen', 'Brimstone', 'Cypher', 'Reyna', 'Killjoy', 'Breach', 'Raze', 'Skye', 'Yoru', 'Astra', 'KAYO', 'Chamber', 'Neon', 'Fade', 'Harbor', 'Gekko', 'Deadlock']

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'Advanced': return 'text-orange-400 bg-orange-400/10'
      case 'Expert': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const filteredLineups = mockLineups.filter(lineup => {
    if (statusFilter !== 'all' && lineup.status !== statusFilter) return false
    if (mapFilter !== 'all' && lineup.map !== mapFilter) return false
    if (agentFilter !== 'all' && lineup.agent !== agentFilter) return false
    if (searchQuery && !lineup.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lineup.author.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Target size={28} />
            Lineups Management
          </h1>
          <p className="text-gray-400">Manage community lineups and tactical content</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{filteredLineups.length} lineups</span>
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
              <Target size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">1,456</div>
              <div className="text-sm text-blue-400">+78 this week</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Lineups</div>
        </div>

        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">1,289</div>
              <div className="text-sm text-green-400">88.5% approved</div>
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
              <div className="text-2xl font-bold text-white">34</div>
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
              <div className="text-2xl font-bold text-white">124</div>
              <div className="text-sm text-purple-400">Featured</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">Featured Items</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lineups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={mapFilter}
            onChange={(e) => setMapFilter(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Maps</option>
            {maps.map(map => (
              <option key={map} value={map}>{map}</option>
            ))}
          </select>

          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="accuracy">Highest Accuracy</option>
          </select>
        </div>
      </div>

      {/* Lineups Table */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">Lineups Database</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Lineup</th>
                <th className="text-left p-4 text-gray-300 font-medium">Map & Agent</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Stats</th>
                <th className="text-left p-4 text-gray-300 font-medium">Details</th>
                <th className="text-right p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredLineups.map((lineup) => {
                const StatusIcon = getStatusIcon(lineup.status)
                return (
                  <tr key={lineup.id} className="hover:bg-gray-700/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Target size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{lineup.title}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <User size={12} />
                            {lineup.author}
                          </div>
                          {lineup.isFeatured && (
                            <div className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs mt-1">
                              <Star size={12} />
                              Featured
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white">
                          <MapPin size={12} />
                          {lineup.map}
                        </div>
                        <div className="text-sm text-gray-400">{lineup.agent} - {lineup.ability}</div>
                        <div className="text-xs text-gray-500">{lineup.type}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(lineup.status)}`}>
                        <StatusIcon size={14} />
                        {lineup.status.charAt(0).toUpperCase() + lineup.status.slice(1)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Eye size={12} />
                          {lineup.views.toLocaleString()} views
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Heart size={12} />
                          {lineup.likes.toLocaleString()} likes
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Download size={12} />
                          {lineup.downloads.toLocaleString()} downloads
                        </div>
                        {lineup.reports > 0 && (
                          <div className="flex items-center gap-2 text-red-400">
                            <Flag size={12} />
                            {lineup.reports} reports
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(lineup.difficulty)}`}>
                          {lineup.difficulty}
                        </div>
                        <div className="text-gray-300">Accuracy: {lineup.accuracy}%</div>
                        <div className="text-gray-400">{lineup.createdAt}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lineup.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
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

export default function AdminLineupsPage() {
  return (
    <AdminLayout>
      <LineupsManagement />
    </AdminLayout>
  )
}
