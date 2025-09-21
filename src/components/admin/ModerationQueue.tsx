'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Flag,
  MessageSquare,
  Crosshair,
  Target,
  User,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Ban,
  Shield
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { AdminLoader } from '@/components/ui/LoadingSpinner';

interface ModerationItem {
  id: string;
  type: 'USER' | 'LINEUP' | 'CROSSHAIR' | 'COMMENT';
  entityId: string;
  reason: 'SPAM' | 'INAPPROPRIATE' | 'COPYRIGHT' | 'HARASSMENT' | 'OTHER';
  description?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  
  // Reporter info
  reporter: {
    id: string;
    username: string;
    avatar?: string;
  };
  
  // Reported content/user info
  reported: {
    id: string;
    title?: string; // For content
    username?: string; // For users
    content?: string; // Preview text
    createdAt: string;
  };
  
  // Moderation info
  reviewedBy?: string;
  reviewedAt?: string;
  resolution?: string;
  
  createdAt: string;
  updatedAt: string;
}

const ModerationQueue: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    status: 'PENDING',
    reason: '',
    search: ''
  });

  const { success, error: showError } = useNotifications();

  // Mock data - in real app this would come from API
  const mockItems: ModerationItem[] = [
    {
      id: '1',
      type: 'COMMENT',
      entityId: 'comment_1',
      reason: 'INAPPROPRIATE',
      description: 'Contains offensive language',
      status: 'PENDING',
      reporter: {
        id: 'user_1',
        username: 'ModeratorUser',
        avatar: '/avatars/mod.jpg'
      },
      reported: {
        id: 'comment_1',
        content: 'This comment contains inappropriate content that violates our guidelines...',
        createdAt: '2024-01-15T10:30:00Z'
      },
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      type: 'LINEUP',
      entityId: 'lineup_1',
      reason: 'SPAM',
      description: 'Duplicate lineup with misleading title',
      status: 'PENDING',
      reporter: {
        id: 'user_2',
        username: 'CommunityHelper',
        avatar: '/avatars/helper.jpg'
      },
      reported: {
        id: 'lineup_1',
        title: 'BEST VIPER SMOKE EVER!!! (NOT CLICKBAIT)',
        content: 'Viper smoke lineup for Bind A site...',
        createdAt: '2024-01-14T15:20:00Z'
      },
      createdAt: '2024-01-15T12:15:00Z',
      updatedAt: '2024-01-15T12:15:00Z'
    },
    {
      id: '3',
      type: 'USER',
      entityId: 'user_3',
      reason: 'HARASSMENT',
      description: 'Multiple reports of toxic behavior in comments',
      status: 'PENDING',
      reporter: {
        id: 'user_4',
        username: 'SafetyFirst',
        avatar: '/avatars/safety.jpg'
      },
      reported: {
        id: 'user_3',
        username: 'ToxicPlayer123',
        createdAt: '2024-01-10T09:45:00Z'
      },
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    }
  ];

  useEffect(() => {
    // Load moderation items
    setLoading(true);
    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'USER': return User;
      case 'LINEUP': return Target;
      case 'CROSSHAIR': return Crosshair;
      case 'COMMENT': return MessageSquare;
      default: return Flag;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'USER': return 'text-blue-400 bg-blue-600/20';
      case 'LINEUP': return 'text-green-400 bg-green-600/20';
      case 'CROSSHAIR': return 'text-yellow-400 bg-yellow-600/20';
      case 'COMMENT': return 'text-purple-400 bg-purple-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'SPAM': return 'text-yellow-400 bg-yellow-600/20';
      case 'INAPPROPRIATE': return 'text-red-400 bg-red-600/20';
      case 'COPYRIGHT': return 'text-orange-400 bg-orange-600/20';
      case 'HARASSMENT': return 'text-pink-400 bg-pink-600/20';
      case 'OTHER': return 'text-gray-400 bg-gray-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const handleModerationAction = async (itemId: string, action: 'approve' | 'reject' | 'ban', resolution?: string) => {
    try {
      // API call would go here
      console.log(`Moderation action: ${action} for item ${itemId}`, { resolution });
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: action === 'approve' ? 'RESOLVED' : 'DISMISSED',
              reviewedAt: new Date().toISOString(),
              resolution: resolution || `Item ${action}ed by admin`
            }
          : item
      ));

      success(`Item ${action}ed`, `The reported content has been ${action}ed successfully.`);
    } catch (error) {
      showError('Action Failed', `Failed to ${action} the reported item.`);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) return;

    try {
      // Bulk API call would go here
      console.log(`Bulk ${action} for items:`, selectedItems);
      
      setItems(prev => prev.map(item => 
        selectedItems.includes(item.id)
          ? { 
              ...item, 
              status: action === 'approve' ? 'RESOLVED' : 'DISMISSED',
              reviewedAt: new Date().toISOString(),
              resolution: `Bulk ${action}ed by admin`
            }
          : item
      ));
      
      setSelectedItems([]);
      success(`Bulk ${action} completed`, `${selectedItems.length} items have been ${action}ed.`);
    } catch (error) {
      showError('Bulk Action Failed', `Failed to ${action} selected items.`);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    const visibleItems = items.filter(item => item.status === 'PENDING');
    if (selectedItems.length === visibleItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(visibleItems.map(item => item.id));
    }
  };

  const filteredItems = items.filter(item => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.reason && item.reason !== filters.reason) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        item.reported.title?.toLowerCase().includes(searchTerm) ||
        item.reported.username?.toLowerCase().includes(searchTerm) ||
        item.reported.content?.toLowerCase().includes(searchTerm) ||
        item.reporter.username.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Moderation</h1>
          <p className="text-gray-400">Review reported content and manage community standards</p>
        </div>
        <div className="flex items-center gap-4">
          {selectedItems.length > 0 && (
        <div className="flex items-center gap-2">
              <span className="text-white text-sm">{selectedItems.length} selected</span>
            <button
                onClick={() => handleBulkAction('approve')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                onClick={() => handleBulkAction('reject')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="USER">Users</option>
            <option value="LINEUP">Lineups</option>
            <option value="CROSSHAIR">Crosshairs</option>
            <option value="COMMENT">Comments</option>
          </select>

          {/* Reason Filter */}
          <select
            value={filters.reason}
            onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Reasons</option>
            <option value="SPAM">Spam</option>
            <option value="INAPPROPRIATE">Inappropriate</option>
            <option value="COPYRIGHT">Copyright</option>
            <option value="HARASSMENT">Harassment</option>
            <option value="OTHER">Other</option>
          </select>
              </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 overflow-hidden">
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Reports Queue ({filteredItems.length})
          </h3>
          {filteredItems.some(item => item.status === 'PENDING') && (
                <button
              onClick={selectAllItems}
              className="text-sm text-blue-400 hover:text-blue-300"
                >
              {selectedItems.length === filteredItems.filter(item => item.status === 'PENDING').length
                ? 'Deselect All'
                : 'Select All Pending'
              }
                </button>
          )}
              </div>

        <div className="divide-y divide-gray-700/50">
          {loading ? (
            <div className="p-16 text-center">
              <AdminLoader size="lg" message="Loading moderation queue..." />
                  </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Shield size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No reports found</p>
              <p>All caught up! No items matching your current filters.</p>
                  </div>
          ) : (
            filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              const typeColors = getTypeColor(item.type);
              const reasonColors = getReasonColor(item.reason);
              const isPending = item.status === 'PENDING';
              
              return (
                <div key={item.id} className={`p-6 hover:bg-gray-700/20 ${isPending ? 'bg-yellow-600/5' : ''}`}>
                  <div className="flex items-start gap-4">
                    {isPending && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="mt-2 w-4 h-4"
                      />
                    )}
                    
                    <div className={`p-3 rounded-lg ${typeColors}`}>
                      <TypeIcon size={20} />
                </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">
                            {item.type === 'USER' ? item.reported.username : item.reported.title}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors}`}>
                            {item.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${reasonColors}`}>
                            {item.reason}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={12} />
                          {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                      <div className="text-gray-300 text-sm">
                        <span className="font-medium">Reported by:</span> {item.reporter.username}
                        {item.description && (
                          <>
                            <br />
                            <span className="font-medium">Reason:</span> {item.description}
                          </>
                        )}
                      </div>
                      
                      {item.reported.content && (
                        <div className="bg-gray-800/50 p-3 rounded-lg text-sm text-gray-300">
                          <span className="font-medium mb-2 block">Content Preview:</span>
                          {item.reported.content.length > 150 
                            ? item.reported.content.substring(0, 150) + '...'
                            : item.reported.content
                          }
                        </div>
                      )}
                      
                      {isPending && (
                        <div className="flex items-center gap-2">
                  <button
                            onClick={() => handleModerationAction(item.id, 'approve', 'Content approved after review')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Check size={16} />
                            Approve
                  </button>
                  <button
                            onClick={() => handleModerationAction(item.id, 'reject', 'Content removed for policy violation')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <X size={16} />
                            Remove
                          </button>
                          <button
                            onClick={() => handleModerationAction(item.id, 'ban', 'User banned for repeated violations')}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                          >
                            <Ban size={16} />
                            Ban User
                          </button>
                          <button className="text-gray-400 hover:text-white p-2">
                            <ExternalLink size={16} />
                  </button>
                </div>
                      )}
                      
                      {!isPending && item.resolution && (
                        <div className="bg-blue-900/30 border border-blue-600/50 p-3 rounded-lg text-sm">
                          <span className="font-medium text-blue-400">Resolution:</span>
                          <br />
                          <span className="text-blue-200">{item.resolution}</span>
              </div>
                      )}
            </div>
          </div>
        </div>
              );
            })
      )}
    </div>
      </div>
    </div>
  );
};

export default ModerationQueue;