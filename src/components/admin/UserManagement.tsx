'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  Eye,
  Mail,
  Calendar,
  Crown,
  Star,
  AlertTriangle,
  ChevronDown,
  Download,
  Upload,
  RefreshCw,
  Settings,
  CheckSquare,
  Square,
  X,
  Check,
  Ban,
  Unlock
} from 'lucide-react';
import { useNotificationSafe } from '@/hooks/useNotificationSafe';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count: {
    lineups: number;
    crosshairs: number;
    comments: number;
    reports: number;
  };
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  moderatorUsers: number;
  regularUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  premiumUsers: number;
  freeUsers: number;
  newUsersToday: number;
  activeUsersToday: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { success, error, warning, info } = useNotificationSafe();

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
    setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchTerm,
        role: filterRole,
        isActive: filterStatus,
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.pages || 1);
      
    } catch (err: any) {
      console.error('Error fetching users:', err);
      error('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterRole, filterStatus, sortBy, sortOrder, error]);

  // Fetch user statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/users/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Update user
  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ));

      success('Success', 'User updated successfully');
      setEditingUser(null);
      
    } catch (err: any) {
      console.error('Error updating user:', err);
      error('Error', 'Failed to update user');
    }
  };

  // Bulk actions
  const performBulkAction = async (action: string, role?: string) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/users/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action,
          role
        })
      });

      if (!response.ok) {
        throw new Error('Bulk action failed');
      }

      const data = await response.json();
      success('Success', data.message);
      setSelectedUsers([]);
      setShowBulkActions(false);
      fetchUsers();
      
    } catch (err: any) {
      console.error('Error performing bulk action:', err);
      error('Error', 'Bulk action failed');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MODERATOR': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading && users.length === 0) {
    return <LoadingOverlay message="Loading users..." type="admin" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Users size={20} className="text-white" />
            </div>
            User Management
          </h1>
          <p className="text-white/60">Manage community members, roles, and permissions</p>
        </div>
        
        <div className="flex items-center gap-3">
        <button
            onClick={() => fetchUsers()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105"
        >
            <RefreshCw size={16} />
          Refresh
        </button>
          
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-green-500/25 hover:scale-105"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-white/60 text-sm font-medium">Total Users</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <div className="relative flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>+{stats.newUsersToday} today</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">{stats.activeUsers.toLocaleString()}</div>
                <div className="text-white/60 text-sm font-medium">Active Users</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                <UserCheck size={24} className="text-white" />
              </div>
            </div>
            <div className="relative flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>+{stats.activeUsersToday} today</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{stats.verifiedUsers.toLocaleString()}</div>
                <div className="text-white/60 text-sm font-medium">Verified Users</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25 group-hover:scale-110 transition-transform duration-300">
                <Shield size={24} className="text-white" />
              </div>
            </div>
            <div className="relative flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% verified</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">{stats.premiumUsers.toLocaleString()}</div>
                <div className="text-white/60 text-sm font-medium">Premium Users</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <Crown size={24} className="text-white" />
              </div>
            </div>
            <div className="relative flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>{Math.round((stats.premiumUsers / stats.totalUsers) * 100)}% premium</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center">
            <Filter size={16} className="text-white" />
          </div>
          <h3 className="text-white font-semibold">Filters & Search</h3>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors duration-200" />
              <input
                type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
              />
            </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          
          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="username-asc">Name A-Z</option>
            <option value="username-desc">Name Z-A</option>
            <option value="lastLoginAt-desc">Last Login</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-sm border border-blue-500/20 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">{selectedUsers.length} users selected</span>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => performBulkAction('activate')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => performBulkAction('deactivate')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => performBulkAction('verify')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600/50">
                <th className="p-4 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-white"
                  >
                    {selectedUsers.length === users.length ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th className="p-4 text-left text-gray-300 font-medium">User</th>
                <th className="p-4 text-left text-gray-300 font-medium">Role</th>
                <th className="p-4 text-left text-gray-300 font-medium">Status</th>
                <th className="p-4 text-left text-gray-300 font-medium">Activity</th>
                <th className="p-4 text-left text-gray-300 font-medium">Joined</th>
                <th className="p-4 text-left text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                    <button
                      onClick={() => toggleUserSelection(user.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {selectedUsers.includes(user.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>
                    </td>
                  
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-white font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                        </div>
                    <div>
                          <div className="text-white font-medium">{user.username}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  
                    <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={`text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                      {user.isVerified && (
                        <Shield size={14} className="text-blue-400" />
                      )}
                      {user.isPremium && (
                        <Crown size={14} className="text-yellow-400" />
                      )}
                      </div>
                  </td>
                  
                    <td className="p-4">
                      <div className="text-sm text-gray-300">
                        <div>{user._count.lineups} lineups</div>
                        <div>{user._count.crosshairs} crosshairs</div>
                    </div>
                  </td>
                  
                    <td className="p-4">
                      <div className="text-sm text-gray-400">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  
                    <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit3 size={16} />
                      </button>
                      
                      <button
                        onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                            : 'text-gray-400 hover:text-green-400 hover:bg-green-900/20'
                        }`}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.isActive ? <Ban size={16} /> : <Unlock size={16} />}
                      </button>
                      
                        <button
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          title="More actions"
                        >
                        <MoreVertical size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-600/50 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, users.length)} of {users.length} users
          </div>
          
            <div className="flex items-center gap-2">
              <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Previous
              </button>
            
            <span className="px-3 py-2 text-white">
              Page {page} of {totalPages}
              </span>
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.isVerified}
                    onChange={(e) => setEditingUser({ ...editingUser, isVerified: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 text-sm">Verified</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.isPremium}
                    onChange={(e) => setEditingUser({ ...editingUser, isPremium: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 text-sm">Premium</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updateUser(editingUser.id, {
                    role: editingUser.role,
                    isVerified: editingUser.isVerified,
                    isPremium: editingUser.isPremium
                  })}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                  Cancel
              </button>
              </div>
            </div>
        </div>
          </div>
        )}
      </div>
  );
};

export default UserManagement;