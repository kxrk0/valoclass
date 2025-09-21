'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Target, 
  Crosshair, 
  Eye, 
  Check, 
  X, 
  Flag, 
  AlertTriangle, 
  Clock, 
  User,
  Calendar,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  RefreshCw,
  Download,
  Settings,
  Zap,
  PlayCircle,
  Image,
  FileText,
  Star,
  Heart,
  TrendingUp,
  Archive,
  Trash2
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface ContentItem {
  id: string;
  type: 'lineup' | 'crosshair';
  title: string;
  description: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  updatedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  rejectionReason?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    reports: number;
  };
  tags: string[];
  map?: string;
  agent?: string;
  flagReason?: string;
  autoFlagged?: boolean;
}

interface ModerationStats {
  pendingLineups: number;
  pendingCrosshairs: number;
  flaggedContent: number;
  totalReports: number;
  approvedToday: number;
  rejectedToday: number;
  averageReviewTime: number;
}

const ContentModeration: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'flagged' | 'all'>('pending');
  const [filterType, setFilterType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [viewingContent, setViewingContent] = useState<ContentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [contentToReject, setContentToReject] = useState<ContentItem | null>(null);

  const { success, error: showError, warning, info } = useNotifications();

  // Fetch content for moderation
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const params = new URLSearchParams({
        status: selectedTab,
        type: filterType,
        search: searchTerm,
        sortBy: sortBy
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/moderation/content?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.content || []);
      
    } catch (err: any) {
      console.error('Error fetching content:', err);
      // For now, use mock data
      setContent(generateMockContent());
    } finally {
      setLoading(false);
    }
  }, [selectedTab, filterType, searchTerm, sortBy]);

  // Fetch moderation statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/moderation/stats`, {
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
          pendingLineups: 12,
          pendingCrosshairs: 8,
          flaggedContent: 3,
          totalReports: 15,
          approvedToday: 24,
          rejectedToday: 6,
          averageReviewTime: 145 // seconds
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Approve content
  const approveContent = async (contentId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/moderation/approve/${contentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve content');
      }

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'approved' as const, moderatedAt: new Date().toISOString() }
          : item
      ));

      success('Success', 'Content approved successfully');
      
    } catch (err: any) {
      console.error('Error approving content:', err);
      showError('Error', 'Failed to approve content');
    }
  };

  // Reject content
  const rejectContent = async (contentId: string, reason: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/moderation/reject/${contentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject content');
      }

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              status: 'rejected' as const, 
              moderatedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          : item
      ));

      success('Success', 'Content rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
      setContentToReject(null);
      
    } catch (err: any) {
      console.error('Error rejecting content:', err);
      showError('Error', 'Failed to reject content');
    }
  };

  // Generate mock content for development
  const generateMockContent = (): ContentItem[] => {
    return [
      {
        id: '1',
        type: 'lineup',
        title: 'Haven A-Site Smoke Setup',
        description: 'Perfect smoke lineup for Haven A-site rushes. Works from spawn position.',
        author: { id: '1', username: 'ProPlayer123', avatar: undefined },
        status: 'pending',
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        stats: { views: 245, likes: 18, comments: 5, reports: 0 },
        tags: ['smoke', 'haven', 'attack'],
        map: 'Haven',
        agent: 'Omen'
      },
      {
        id: '2',
        type: 'crosshair',
        title: 'TenZ Inspired Crosshair',
        description: 'Clean minimalist crosshair inspired by TenZ settings.',
        author: { id: '2', username: 'CrosshairMaster', avatar: undefined },
        status: 'flagged',
        createdAt: '2024-01-19T15:45:00Z',
        updatedAt: '2024-01-19T15:45:00Z',
        stats: { views: 128, likes: 9, comments: 2, reports: 2 },
        tags: ['crosshair', 'pro', 'minimalist'],
        flagReason: 'Reported for inappropriate content',
        autoFlagged: false
      },
      {
        id: '3',
        type: 'lineup',
        title: 'Bind B-Site Molly Lineups',
        description: 'Complete guide for Bind B-site molotov lineups.',
        author: { id: '3', username: 'UtilityKing', avatar: undefined },
        status: 'pending',
        createdAt: '2024-01-18T20:15:00Z',
        updatedAt: '2024-01-18T20:15:00Z',
        stats: { views: 89, likes: 12, comments: 3, reports: 0 },
        tags: ['molotov', 'bind', 'defense'],
        map: 'Bind',
        agent: 'Phoenix'
      }
    ];
  };

  useEffect(() => {
    fetchContent();
    fetchStats();
  }, [fetchContent, fetchStats]);

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      case 'flagged': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    return type === 'lineup' ? Target : Crosshair;
  };

  const filteredContent = content.filter(item => {
    if (selectedTab === 'pending' && item.status !== 'pending') return false;
    if (selectedTab === 'flagged' && item.status !== 'flagged') return false;
    if (filterType && item.type !== filterType) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading && content.length === 0) {
    return <LoadingOverlay message="Loading content..." type="admin" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Shield size={20} className="text-white" />
            </div>
            Content Moderation
          </h1>
          <p className="text-white/60">Review and moderate community-generated content</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchContent()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl transition-all duration-200 shadow-lg hover:scale-105">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent backdrop-blur-sm border border-yellow-500/20 p-6 rounded-2xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{stats.pendingLineups}</div>
                <div className="text-white/60 text-sm">Pending Lineups</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25 group-hover:scale-110 transition-transform duration-300">
                <Target size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-yellow-400">Needs review</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-sm border border-blue-500/20 p-6 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">{stats.pendingCrosshairs}</div>
                <div className="text-white/60 text-sm">Pending Crosshairs</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Crosshair size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-400">Needs review</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent backdrop-blur-sm border border-red-500/20 p-6 rounded-2xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors duration-300">{stats.flaggedContent}</div>
                <div className="text-white/60 text-sm">Flagged Content</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform duration-300">
                <Flag size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-red-400">Urgent review</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent backdrop-blur-sm border border-green-500/20 p-6 rounded-2xl shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">{stats.approvedToday}</div>
                <div className="text-white/60 text-sm">Approved Today</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                <Check size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-xs text-green-400">{stats.rejectedToday} rejected</div>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg">
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
            Pending ({stats?.pendingLineups || 0 + stats?.pendingCrosshairs || 0})
          </button>
          
          <button
            onClick={() => setSelectedTab('flagged')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'flagged'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Flagged ({stats?.flaggedContent || 0})
          </button>
          
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            All Content
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
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
            <option value="lineup">Lineups</option>
            <option value="crosshair">Crosshairs</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Newest First</option>
            <option value="reports">Most Reported</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <div className="space-y-1">
          {filteredContent.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            
            return (
              <div key={item.id} className="p-6 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TypeIcon size={20} className="text-gray-400" />
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium truncate">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {item.autoFlagged && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                          Auto-flagged
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{item.author.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTimeAgo(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{item.stats.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{item.stats.likes}</span>
                      </div>
                      {item.stats.reports > 0 && (
                        <div className="flex items-center gap-1 text-red-400">
                          <Flag size={14} />
                          <span>{item.stats.reports} reports</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rejection reason */}
                    {item.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
                          <AlertTriangle size={14} />
                          Rejection Reason
                        </div>
                        <p className="text-red-300 text-sm">{item.rejectionReason}</p>
                      </div>
                    )}

                    {/* Flag reason */}
                    {item.flagReason && (
                      <div className="mt-3 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-400 text-sm font-medium mb-1">
                          <Flag size={14} />
                          Flag Reason
                        </div>
                        <p className="text-orange-300 text-sm">{item.flagReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setViewingContent(item)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View content"
                    >
                      <Eye size={16} />
                    </button>

                    {item.status === 'pending' || item.status === 'flagged' ? (
                      <>
                        <button
                          onClick={() => approveContent(item.id)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Approve content"
                        >
                          <Check size={16} />
                        </button>
                        
                        <button
                          onClick={() => {
                            setContentToReject(item);
                            setShowRejectModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Reject content"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Archive content"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-2">No content to review</h3>
            <p className="text-gray-400 text-sm">All caught up! No pending content in this category.</p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && contentToReject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Reject Content</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setContentToReject(null);
                  setRejectionReason('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this content..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => rejectContent(contentToReject.id, rejectionReason)}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Reject Content
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setContentToReject(null);
                    setRejectionReason('');
                  }}
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

export default ContentModeration;
