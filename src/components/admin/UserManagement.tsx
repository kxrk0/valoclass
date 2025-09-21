'use client'

import { useState } from 'react'
import { Search, Shield, Ban, Mail, User, AlertTriangle } from 'lucide-react'

interface UserData {
  id: string
  username: string
  email: string
  role: 'user' | 'moderator' | 'admin'
  status: 'active' | 'banned' | 'suspended' | 'pending'
  joinDate: Date
  lastActive: Date
  reputation: number
  contentCount: {
    lineups: number
    crosshairs: number
    comments: number
  }
  reports: number
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'moderator' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'suspended' | 'pending'>('all')

  // Mock users data
  const users: UserData[] = [
    {
      id: '1',
      username: 'ValoMaster',
      email: 'valomaster@example.com',
      role: 'user',
      status: 'active',
      joinDate: new Date('2023-03-15'),
      lastActive: new Date('2024-01-18'),
      reputation: 1250,
      contentCount: { lineups: 45, crosshairs: 23, comments: 189 },
      reports: 0
    },
    {
      id: '2',
      username: 'LineupKing',
      email: 'lineupking@example.com',
      role: 'moderator',
      status: 'active',
      joinDate: new Date('2023-01-20'),
      lastActive: new Date('2024-01-18'),
      reputation: 2890,
      contentCount: { lineups: 156, crosshairs: 67, comments: 423 },
      reports: 0
    },
    {
      id: '3',
      username: 'ToxicPlayer',
      email: 'toxic@example.com',
      role: 'user',
      status: 'banned',
      joinDate: new Date('2024-01-10'),
      lastActive: new Date('2024-01-15'),
      reputation: -150,
      contentCount: { lineups: 2, crosshairs: 0, comments: 15 },
      reports: 8
    },
    {
      id: '4',
      username: 'NewPlayer123',
      email: 'newplayer@example.com',
      role: 'user',
      status: 'pending',
      joinDate: new Date('2024-01-18'),
      lastActive: new Date('2024-01-18'),
      reputation: 0,
      contentCount: { lineups: 0, crosshairs: 1, comments: 0 },
      reports: 0
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user:`, userId)
    // In real app, call API
    alert(`User ${action} action triggered for user ${userId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'banned': return 'text-red-400 bg-red-400/10'
      case 'suspended': return 'text-orange-400 bg-orange-400/10'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-400 bg-purple-400/10'
      case 'moderator': return 'text-blue-400 bg-blue-400/10'
      case 'user': return 'text-gray-400 bg-gray-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search users by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Content</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Reputation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-white">{user.username}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div>{user.contentCount.lineups} lineups</div>
                      <div>{user.contentCount.crosshairs} crosshairs</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className={user.reputation > 0 ? 'text-green-400' : 'text-red-400'}>
                        {user.reputation}
                      </span>
                      {user.reports > 0 && (
                        <div className="flex items-center gap-1 text-red-400">
                          <AlertTriangle size={12} />
                          <span className="text-xs">{user.reports}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {user.lastActive.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleUserAction(user.id, 'view')}
                        className="p-1 text-blue-400 hover:bg-blue-400/10 rounded"
                        title="View Profile"
                      >
                        <User size={14} />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'message')}
                        className="p-1 text-green-400 hover:bg-green-400/10 rounded"
                        title="Send Message"
                      >
                        <Mail size={14} />
                      </button>
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="p-1 text-orange-400 hover:bg-orange-400/10 rounded"
                          title="Suspend User"
                        >
                          <AlertTriangle size={14} />
                        </button>
                      )}
                      {user.status !== 'banned' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                          title="Ban User"
                        >
                          <Ban size={14} />
                        </button>
                      )}
                      {user.role === 'user' && (
                        <button
                          onClick={() => handleUserAction(user.id, 'promote')}
                          className="p-1 text-purple-400 hover:bg-purple-400/10 rounded"
                          title="Promote to Moderator"
                        >
                          <Shield size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-xs text-gray-400">Active Users</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {users.filter(u => u.status === 'pending').length}
          </div>
          <div className="text-xs text-gray-400">Pending Approval</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {users.filter(u => u.status === 'suspended').length}
          </div>
          <div className="text-xs text-gray-400">Suspended</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">
            {users.filter(u => u.status === 'banned').length}
          </div>
          <div className="text-xs text-gray-400">Banned</div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
