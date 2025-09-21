'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Settings,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  FileText,
  Database,
  Globe,
  Lock,
  Unlock,
  Ban,
  CheckCircle,
  XCircle,
  Archive,
  MoreHorizontal
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminUsername: string;
  action: string;
  category: 'user' | 'content' | 'system' | 'security' | 'moderation';
  target?: {
    type: string;
    id: string;
    name: string;
  };
  details: string;
  ipAddress: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface ActivityStats {
  totalActions: number;
  actionsToday: number;
  uniqueAdmins: number;
  criticalActions: number;
  categoryBreakdown: {
    user: number;
    content: number;
    system: number;
    security: number;
    moderation: number;
  };
}

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [filterAdmin, setFilterAdmin] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLogEntry | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { success, error: showError, info } = useNotifications();

  // Fetch activity logs
  const fetchActivityLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const params = new URLSearchParams({
        search: searchTerm,
        category: filterCategory,
        severity: filterSeverity,
        admin: filterAdmin,
        dateRange: dateRange
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/activity?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch activity logs: ${response.status}`);
      }

      const data = await response.json();
      setActivities(data.activities || []);
      
    } catch (err: any) {
      console.error('Error fetching activity logs:', err);
      // Use mock data for development
      setActivities(generateMockActivities());
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterSeverity, filterAdmin, dateRange]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/activity/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Mock stats for development
        setStats({
          totalActions: 2847,
          actionsToday: 127,
          uniqueAdmins: 8,
          criticalActions: 12,
          categoryBreakdown: {
            user: 1245,
            content: 892,
            system: 345,
            security: 234,
            moderation: 131
          }
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Generate mock activity data
  const generateMockActivities = (): ActivityLogEntry[] => {
    return [
      {
        id: '1',
        timestamp: '2024-01-20T14:30:00Z',
        adminId: 'admin1',
        adminUsername: 'AdminModerator',
        action: 'USER_BANNED',
        category: 'moderation',
        target: { type: 'user', id: 'user123', name: 'ToxicPlayer' },
        details: 'User banned for 7 days due to harassment violation',
        ipAddress: '192.168.1.100',
        severity: 'high',
        metadata: { duration: '7d', reason: 'harassment' }
      },
      {
        id: '2',
        timestamp: '2024-01-20T14:15:00Z',
        adminId: 'admin2',
        adminUsername: 'ContentMod',
        action: 'CONTENT_APPROVED',
        category: 'content',
        target: { type: 'lineup', id: 'lineup456', name: 'Haven A-Site Smoke' },
        details: 'Lineup approved after review',
        ipAddress: '192.168.1.101',
        severity: 'low'
      },
      {
        id: '3',
        timestamp: '2024-01-20T13:45:00Z',
        adminId: 'admin1',
        adminUsername: 'AdminModerator',
        action: 'SYSTEM_CONFIG_CHANGED',
        category: 'system',
        details: 'Updated rate limiting configuration',
        ipAddress: '192.168.1.100',
        severity: 'medium',
        metadata: { setting: 'rate_limit', oldValue: '100', newValue: '150' }
      },
      {
        id: '4',
        timestamp: '2024-01-20T13:30:00Z',
        adminId: 'admin3',
        adminUsername: 'SecurityAdmin',
        action: 'IP_BLOCKED',
        category: 'security',
        target: { type: 'ip', id: '203.0.113.1', name: '203.0.113.1' },
        details: 'Blocked suspicious IP address due to multiple failed login attempts',
        ipAddress: '192.168.1.102',
        severity: 'critical',
        metadata: { reason: 'brute_force', attempts: 25 }
      },
      {
        id: '5',
        timestamp: '2024-01-20T12:20:00Z',
        adminId: 'admin2',
        adminUsername: 'ContentMod',
        action: 'USER_ROLE_CHANGED',
        category: 'user',
        target: { type: 'user', id: 'user789', name: 'NewModerator' },
        details: 'User role changed from USER to MODERATOR',
        ipAddress: '192.168.1.101',
        severity: 'medium',
        metadata: { oldRole: 'USER', newRole: 'MODERATOR' }
      }
    ];
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchActivityLogs();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchActivityLogs]);

  useEffect(() => {
    fetchActivityLogs();
    fetchStats();
  }, [fetchActivityLogs, fetchStats]);

  // Export logs
  const exportLogs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/activity/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        success('Success', 'Activity log exported successfully');
      }
    } catch (err) {
      showError('Error', 'Failed to export activity log');
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return User;
      case 'content': return FileText;
      case 'system': return Settings;
      case 'security': return Shield;
      case 'moderation': return AlertTriangle;
      default: return Activity;
    }
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('BANNED') || action.includes('BLOCKED')) return Ban;
    if (action.includes('APPROVED') || action.includes('VERIFIED')) return CheckCircle;
    if (action.includes('REJECTED') || action.includes('DELETED')) return XCircle;
    if (action.includes('LOCKED')) return Lock;
    if (action.includes('UNLOCKED')) return Unlock;
    if (action.includes('EDITED') || action.includes('UPDATED')) return Edit3;
    if (action.includes('VIEWED')) return Eye;
    return Activity;
  };

  const filteredActivities = activities.filter(activity => {
    if (filterCategory && activity.category !== filterCategory) return false;
    if (filterSeverity && activity.severity !== filterSeverity) return false;
    if (filterAdmin && activity.adminUsername !== filterAdmin) return false;
    if (searchTerm && 
        !activity.action.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !activity.details.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !activity.adminUsername.toLowerCase().includes(searchTerm.toLowerCase())
    ) return false;
    return true;
  });

  if (loading && activities.length === 0) {
    return <LoadingOverlay message="Loading activity logs..." type="admin" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Activity size={20} className="text-white" />
            </div>
            Activity Log
          </h1>
          <p className="text-white/60">Track all admin actions and system events in real-time</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 hover:bg-white/10 transition-all duration-200">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500/50"
            />
            Auto-refresh
          </label>
          
          <button
            onClick={() => fetchActivityLogs()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-green-500/25 hover:scale-105"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalActions.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Actions</div>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Activity size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.actionsToday}</div>
                <div className="text-gray-400 text-sm">Today</div>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Clock size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.uniqueAdmins}</div>
                <div className="text-gray-400 text-sm">Active Admins</div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.criticalActions}</div>
                <div className="text-gray-400 text-sm">Critical Actions</div>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.categoryBreakdown.security}</div>
                <div className="text-gray-400 text-sm">Security Events</div>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="user">User Management</option>
            <option value="content">Content</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="moderation">Moderation</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Admins</option>
            <option value="AdminModerator">AdminModerator</option>
            <option value="ContentMod">ContentMod</option>
            <option value="SecurityAdmin">SecurityAdmin</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <div className="space-y-1">
          {filteredActivities.map((activity) => {
            const CategoryIcon = getCategoryIcon(activity.category);
            const ActionIcon = getActionIcon(activity.action);
            
            return (
              <div key={activity.id} className="p-6 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icons */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <CategoryIcon size={18} className="text-gray-400" />
                    </div>
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <ActionIcon size={12} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{activity.action.replace(/_/g, ' ')}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(activity.severity)}`}>
                        {activity.severity}
                      </span>
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs">
                        {activity.category}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{activity.details}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{activity.adminUsername}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe size={14} />
                        <span>{activity.ipAddress}</span>
                      </div>
                      {activity.target && (
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>Target: {activity.target.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    {activity.metadata && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Metadata:</span>
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      title="More actions"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={24} className="text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-2">No activities found</h3>
            <p className="text-gray-400 text-sm">No activities match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
