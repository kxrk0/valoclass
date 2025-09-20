'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { AdminLoader } from '@/components/ui/LoadingSpinner';

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

interface UserFilters {
  search: string;
  role: string;
  isActive: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const { success, error: showError } = useNotifications();

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isActive && { isActive: filters.isActive })
      });

      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Initial load and refresh on filter changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle filter changes
  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string, role?: string) => {
    if (selectedUsers.length === 0) return;

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          action,
          ...(role && { role })
        })
      });

      if (!response.ok) {
        throw new Error('Bulk action failed');
      }

      const data = await response.json();
      
      // Refresh users list
      await fetchUsers();
      setSelectedUsers([]);
      setShowBulkActions(false);
      
      success('Bulk Action Completed', data.message);
    } catch (error) {
      console.error('Bulk action error:', error);
      showError('Bulk Action Failed', 'Failed to perform bulk action on users');
    }
  };

  // Individual user actions
  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'verify' | 'unverify' | 'promote' | 'demote', role?: string) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(action === 'activate' && { isActive: true }),
          ...(action === 'deactivate' && { isActive: false }),
          ...(action === 'verify' && { isVerified: true }),
          ...(action === 'unverify' && { isVerified: false }),
          ...(role && { role })
        })
      });

      if (!response.ok) {
        throw new Error('User action failed');
      }

      const data = await response.json();
      
      // Refresh users list
      await fetchUsers();
      
      success('User Updated', data.message);
    } catch (error) {
      console.error('User action error:', error);
      showError('User Action Failed', 'Failed to update user');
    }
  };

  // Pagination
  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600';
      case 'MODERATOR': return 'bg-blue-600';
      case 'USER': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'MODERATOR': return 'Moderator';
      case 'USER': return 'User';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage users, roles, and permissions</p>
        </div>
        <button
          onClick={fetchUsers}
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
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          
          {/* Sort */}
          <select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
            }}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="username:asc">Username A-Z</option>
            <option value="username:desc">Username Z-A</option>
            <option value="lastLoginAt:desc">Last Login</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/50">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('verify')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Verify
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={selectAllUsers}
                    className="w-4 h-4"
                  />
                </th>
                <th className="p-4 text-left text-white font-semibold">User</th>
                <th className="p-4 text-left text-white font-semibold">Role</th>
                <th className="p-4 text-left text-white font-semibold">Status</th>
                <th className="p-4 text-left text-white font-semibold">Content</th>
                <th className="p-4 text-left text-white font-semibold">Joined</th>
                <th className="p-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <AdminLoader size="lg" message="Loading users..." />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                    <div>
                          <div className="text-white font-medium">{user.username}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                    </div>
                  </td>
                    <td className="p-4">
                      <span className={`${getRoleColor(user.role)} text-white px-2 py-1 rounded text-sm font-medium`}>
                        {getRoleName(user.role)}
                    </span>
                  </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                        {user.isVerified && <ShieldCheck size={14} className="text-blue-400" />}
                        {user.isPremium && <Star size={14} className="text-yellow-400" />}
                      </div>
                  </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-300">
                        <div>{user._count.lineups} lineups</div>
                        <div>{user._count.crosshairs} crosshairs</div>
                        <div>{user._count.comments} comments</div>
                    </div>
                  </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                      <button
                          onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                          className={`p-1 rounded hover:bg-gray-600 ${user.isActive ? 'text-red-400' : 'text-green-400'}`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                          onClick={() => handleUserAction(user.id, user.isVerified ? 'unverify' : 'verify')}
                          className={`p-1 rounded hover:bg-gray-600 ${user.isVerified ? 'text-blue-400' : 'text-gray-400'}`}
                          title={user.isVerified ? 'Unverify' : 'Verify'}
                        >
                          {user.isVerified ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                      </button>
                        <button
                          className="p-1 rounded hover:bg-gray-600 text-gray-400"
                          title="More actions"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
      </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-700/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-white text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                <ChevronRight size={16} />
              </button>
        </div>
          </div>
        )}
        </div>
      </div>
  );
};

export default UserManagement;