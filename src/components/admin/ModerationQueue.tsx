'use client'

import { useState } from 'react'
import { Check, X, Eye, Flag, Clock, User, Target, MessageSquare } from 'lucide-react'

interface ModerationItem {
  id: string
  type: 'lineup' | 'crosshair' | 'comment' | 'user'
  title: string
  creator: string
  reportReason: string
  reportedBy: string
  content: string
  timestamp: Date
  status: 'pending' | 'approved' | 'rejected'
  severity: 'low' | 'medium' | 'high'
}

const ModerationQueue = () => {
  const [items, setItems] = useState<ModerationItem[]>([
    {
      id: '1',
      type: 'lineup',
      title: 'Sova Ascent A Site Recon',
      creator: 'PlayerOne',
      reportReason: 'Inappropriate content',
      reportedBy: 'ModUser',
      content: 'This lineup contains offensive language in the description...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'comment',
      title: 'Comment on "Viper Bind Setup"',
      creator: 'ToxicUser',
      reportReason: 'Harassment',
      reportedBy: 'CommunityMember',
      content: 'User is using abusive language towards other community members...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'pending',
      severity: 'high'
    },
    {
      id: '3',
      type: 'crosshair',
      title: 'Pro Player Crosshair',
      creator: 'FakeUser',
      reportReason: 'Copyright violation',
      reportedBy: 'ContentModerator',
      content: 'User is claiming ownership of a professional player\'s crosshair...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
      severity: 'low'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'high' | 'medium' | 'low'>('all')
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ))
  }

  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ))
  }

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'pending') return item.status === 'pending'
    return item.severity === filter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lineup': return Target
      case 'crosshair': return Eye
      case 'comment': return MessageSquare
      case 'user': return User
      default: return Flag
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'low': return 'text-green-400 bg-green-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/20'
      case 'rejected': return 'text-red-400 bg-red-900/20'
      case 'pending': return 'text-yellow-400 bg-yellow-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white mb-2">Moderation Queue</h1>
          <p className="text-gray-400">Review reported content and take appropriate action</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">
            {filteredItems.filter(item => item.status === 'pending').length} pending reviews
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'pending', 'high', 'medium', 'low'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                filter === filterOption
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {filterOption}
              {filterOption === 'pending' && (
                <span className="ml-2 text-xs">
                  ({items.filter(item => item.status === 'pending').length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="card text-center py-12">
            <Flag size={48} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2">No items to review</h3>
            <p className="text-gray-400">All clear! No pending moderation items.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            return (
              <div key={item.id} className="card">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <TypeIcon size={20} className="text-gray-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>by {item.creator}</span>
                          <span>•</span>
                          <span>reported by {item.reportedBy}</span>
                          <span>•</span>
                          <span>{item.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(item.severity)}`}>
                          {item.severity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-red-400 font-medium mb-2">
                        Reason: {item.reportReason}
                      </div>
                      <p className="text-gray-300 text-sm">{item.content}</p>
                    </div>

                    {/* Actions */}
                    {item.status === 'pending' && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="btn btn-secondary text-sm"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="btn btn-secondary text-sm text-green-400 hover:bg-green-900/20"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="btn btn-secondary text-sm text-red-400 hover:bg-red-900/20"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-white">Review Content</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">{selectedItem.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>Created by {selectedItem.creator}</span>
                    <span>•</span>
                    <span>Reported by {selectedItem.reportedBy}</span>
                  </div>
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <div className="font-medium text-red-400 mb-2">Report Reason:</div>
                    <div className="text-white">{selectedItem.reportReason}</div>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-white mb-2">Content Details:</div>
                  <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
                    {selectedItem.content}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      handleApprove(selectedItem.id)
                      setSelectedItem(null)
                    }}
                    className="flex-1 btn btn-secondary text-green-400 hover:bg-green-900/20"
                  >
                    <Check size={16} />
                    Approve Content
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedItem.id)
                      setSelectedItem(null)
                    }}
                    className="flex-1 btn btn-secondary text-red-400 hover:bg-red-900/20"
                  >
                    <X size={16} />
                    Reject Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModerationQueue