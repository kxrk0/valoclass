'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  Flag, 
  User, 
  MessageSquare, 
  Target, 
  Crosshair,
  Clock, 
  Eye, 
  Check, 
  X, 
  Ban,
  Shield,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ExternalLink,
  FileText,
  Hash,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Archive,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface Report {
  id: string;
  type: 'user' | 'content' | 'comment';
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  description: string;
  reporter: {
    id: string;
    username: string;
    avatar?: string;
  };
  reported: {
    id: string;
    username?: string;
    title?: string;
    type?: string;
  };
  evidence?: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    username: string;
  };
  resolutionNote?: string;
  autoAction?: string;
  category?: string;
}

interface ReportStats {
  totalReports: number;
  pendingReports: number;
  resolvedToday: number;
  averageResolutionTime: number;
  criticalReports: number;
  userReports: number;
  contentReports: number;
  commentReports: number;
  autoActionsTriggered: number;
}

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'investigating' | 'resolved'>('pending');
  const [filterType, setFilterType] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [actionType, setActionType] = useState<'resolve' | 'dismiss'>('resolve');

  const { success, error: showError, warning, info } = useNotifications();

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const params = new URLSearchParams({
        status: selectedTab === 'all' ? '' : selectedTab,
        type: filterType,
        priority: filterPriority,
        search: searchTerm,
        sortBy: sortBy
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();
      setReports(data.reports || []);
      
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      // Use mock data for development
      setReports(generateMockReports());
    } finally {
      setLoading(false);
    }
  }, [selectedTab, filterType, filterPriority, searchTerm, sortBy]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/reports/stats`, {
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
          totalReports: 47,
          pendingReports: 12,
          resolvedToday: 8,
          averageResolutionTime: 4.2, // hours
          criticalReports: 2,
          userReports: 28,
          contentReports: 15,
          commentReports: 4,
          autoActionsTriggered: 6
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Update report status
  const updateReportStatus = async (reportId: string, status: string, note?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, resolutionNote: note })
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      // Update local state
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: status as any, resolutionNote: note, updatedAt: new Date().toISOString() }
          : report
      ));

      success('Success', `Report ${status} successfully`);
      setShowResolutionModal(false);
      setSelectedReport(null);
      setResolutionNote('');
      
    } catch (err: any) {
      console.error('Error updating report:', err);
      showError('Error', 'Failed to update report');
    }
  };

  // Assign report
  const assignReport = async (reportId: string, assigneeId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/reports/${reportId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assigneeId })
      });

      if (!response.ok) {
        throw new Error('Failed to assign report');
      }

      success('Success', 'Report assigned successfully');
      fetchReports();
      
    } catch (err: any) {
      console.error('Error assigning report:', err);
      showError('Error', 'Failed to assign report');
    }
  };

  // Generate mock reports for development
  const generateMockReports = (): Report[] => {
    return [
      {
        id: '1',
        type: 'user',
        status: 'pending',
        priority: 'high',
        reason: 'Harassment',
        description: 'User is sending inappropriate messages and harassing other players in comments.',
        reporter: { id: '1', username: 'CommunityHelper' },
        reported: { id: '2', username: 'ToxicPlayer123' },
        evidence: ['screenshot1.png', 'chat_log.txt'],
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        category: 'harassment'
      },
      {
        id: '2',
        type: 'content',
        status: 'investigating',
        priority: 'medium',
        reason: 'Inappropriate Content',
        description: 'Lineup contains offensive imagery and inappropriate text.',
        reporter: { id: '3', username: 'ModeratorUser' },
        reported: { id: '4', title: 'Bind A-Site Lineup', type: 'lineup' },
        createdAt: '2024-01-19T10:15:00Z',
        updatedAt: '2024-01-20T09:00:00Z',
        assignedTo: { id: '5', username: 'AdminMod1' },
        category: 'inappropriate'
      },
      {
        id: '3',
        type: 'comment',
        status: 'resolved',
        priority: 'low',
        reason: 'Spam',
        description: 'User is posting repetitive spam comments on multiple lineups.',
        reporter: { id: '6', username: 'CleanPlayer' },
        reported: { id: '7', username: 'SpamBot99' },
        createdAt: '2024-01-18T16:45:00Z',
        updatedAt: '2024-01-19T11:20:00Z',
        resolutionNote: 'User was given a 24-hour comment ban. Comments were removed.',
        autoAction: 'temp_ban',
        category: 'spam'
      },
      {
        id: '4',
        type: 'content',
        status: 'pending',
        priority: 'critical',
        reason: 'Copyright Violation',
        description: 'Crosshair design appears to be stolen from another creator without permission.',
        reporter: { id: '8', username: 'OriginalCreator' },
        reported: { id: '9', title: 'Pro Crosshair Pack', type: 'crosshair' },
        evidence: ['original_design.png', 'comparison.jpg'],
        createdAt: '2024-01-20T11:00:00Z',
        updatedAt: '2024-01-20T11:00:00Z',
        category: 'copyright'
      }
    ];
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [fetchReports, fetchStats]);

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'investigating': return 'text-blue-400 bg-blue-400/20';
      case 'resolved': return 'text-green-400 bg-green-400/20';
      case 'dismissed': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'content': return FileText;
      case 'comment': return MessageSquare;
      default: return AlertTriangle;
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedTab !== 'all' && report.status !== selectedTab) return false;
    if (filterType && report.type !== filterType) return false;
    if (filterPriority && report.priority !== filterPriority) return false;
    if (searchTerm && !report.reason.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading && reports.length === 0) {
    return <LoadingOverlay message="Loading reports..." type="admin" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Flag size={20} className="text-white" />
            </div>
            Reports Management
          </h1>
          <p className="text-white/60">Review and manage community reports & violations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchReports()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent backdrop-blur-sm border border-yellow-500/20 p-6 rounded-2xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{stats.pendingReports}</div>
                <div className="text-white/60 text-sm">Pending Reports</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-yellow-400">
              {stats.criticalReports} critical
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent backdrop-blur-sm border border-green-500/20 p-6 rounded-2xl shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">{stats.resolvedToday}</div>
                <div className="text-white/60 text-sm">Resolved Today</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-green-400">
              {stats.averageResolutionTime}h avg time
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.totalReports}</div>
                <div className="text-gray-400 text-sm">Total Reports</div>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Flag size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-400">
              {stats.userReports} users, {stats.contentReports} content
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{stats.autoActionsTriggered}</div>
                <div className="text-gray-400 text-sm">Auto Actions</div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-400">
              Automated today
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Pending ({stats?.pendingReports || 0})
          </button>
          
          <button
            onClick={() => setSelectedTab('investigating')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'investigating'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Investigating
          </button>
          
          <button
            onClick={() => setSelectedTab('resolved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'resolved'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Resolved
          </button>
          
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'all'
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            All Reports
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="user">User Reports</option>
            <option value="content">Content Reports</option>
            <option value="comment">Comment Reports</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Newest First</option>
            <option value="priority">Priority</option>
            <option value="updatedAt">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 overflow-hidden">
        <div className="space-y-1">
          {filteredReports.map((report) => {
            const TypeIcon = getTypeIcon(report.type);
            
            return (
              <div key={report.id} className="p-6 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Priority & Type */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getPriorityColor(report.priority)}`}>
                      <TypeIcon size={18} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>

                  {/* Report Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{report.reason}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      {report.autoAction && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                          Auto-action
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{report.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>By: {report.reporter.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag size={14} />
                        <span>Target: {report.reported.username || report.reported.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTimeAgo(report.createdAt)}</span>
                      </div>
                      {report.assignedTo && (
                        <div className="flex items-center gap-1">
                          <Shield size={14} />
                          <span>Assigned: {report.assignedTo.username}</span>
                        </div>
                      )}
                    </div>

                    {/* Evidence */}
                    {report.evidence && report.evidence.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500">Evidence:</span>
                        {report.evidence.map((evidence, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs cursor-pointer hover:bg-blue-500/30 transition-colors"
                          >
                            {evidence}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Resolution Note */}
                    {report.resolutionNote && (
                      <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
                          <CheckCircle size={14} />
                          Resolution
                        </div>
                        <p className="text-green-300 text-sm">{report.resolutionNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>

                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReportStatus(report.id, 'investigating')}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Start investigating"
                        >
                          <Search size={16} />
                        </button>
                      </>
                    )}

                    {(report.status === 'pending' || report.status === 'investigating') && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('resolve');
                            setShowResolutionModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Resolve report"
                        >
                          <Check size={16} />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('dismiss');
                            setShowResolutionModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Dismiss report"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}

                    <button
                      className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                      title="More actions"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-2">No reports found</h3>
            <p className="text-gray-400 text-sm">All caught up! No reports match your current filters.</p>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {actionType === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
              </h3>
              <button
                onClick={() => {
                  setShowResolutionModal(false);
                  setSelectedReport(null);
                  setResolutionNote('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  {actionType === 'resolve' ? 'Resolution Note' : 'Dismissal Reason'}
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder={`Please provide details about your ${actionType}...`}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => updateReportStatus(
                    selectedReport.id, 
                    actionType === 'resolve' ? 'resolved' : 'dismissed', 
                    resolutionNote
                  )}
                  disabled={!resolutionNote.trim()}
                  className={`flex-1 px-4 py-2 ${
                    actionType === 'resolve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors`}
                >
                  {actionType === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
                </button>
                <button
                  onClick={() => {
                    setShowResolutionModal(false);
                    setSelectedReport(null);
                    setResolutionNote('');
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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

export default ReportsManagement;
