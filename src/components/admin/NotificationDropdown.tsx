'use client';

/**
 * 🔔 Admin Bildirim Dropdown'u
 * 
 * Etkileşimli ve animasyonlu bildirim merkezi
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Info,
  ChevronDown
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    notificationHistory, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications,
    clearHistory 
  } = useNotifications();

  const unreadCount = getUnreadCount();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format time
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Az önce';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dakika önce`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat önce`;
    return `${Math.floor(diff / 86400000)} gün önce`;
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'error': return <XCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-green-400" />;
      case 'info': return <Info size={16} className="text-green-400" />;
      default: return <Bell size={16} className="text-green-400" />;
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* 🔔 Bildirim İkonu */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
      >
        <Bell 
          size={20} 
          className={`transition-all duration-300 ${isOpen ? 'text-green-400 scale-110' : ''}`}
        />
        
        {/* Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
        
        {/* Pulse effect */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500/30 rounded-full animate-ping"></div>
        )}
      </button>

      {/* 📋 Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-black/90 backdrop-blur-2xl border border-green-500/30 rounded-2xl shadow-2xl z-50 transform animate-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Bell size={18} className="text-green-400" />
                Bildirimler
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'current'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Güncel ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                Geçmiş ({notificationHistory.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {/* Current Notifications */}
            {activeTab === 'current' && (
              <div className="p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Yeni bildirim yok</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/15 transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium mb-1">
                              {notification.title}
                            </div>
                            <div className="text-white/70 text-xs leading-relaxed">
                              {notification.message}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                              <Clock size={10} />
                              {formatTime(notification.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Clear All Button */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-green-500/20 mt-2">
                    <button
                      onClick={clearAllNotifications}
                      className="w-full text-xs text-white/60 hover:text-white py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Tümünü Temizle
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notification History */}
            {activeTab === 'history' && (
              <div className="p-2">
                {notificationHistory.length === 0 ? (
                  <div className="text-center py-8 text-white/60">
                    <Clock size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Bildirim geçmişi boş</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notificationHistory.slice(0, 20).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border rounded-xl transition-all duration-200 group cursor-pointer ${
                          notification.isRead
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-green-500/10 border-green-500/20 hover:bg-green-500/15'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium mb-1 ${
                              notification.isRead ? 'text-white/60' : 'text-white'
                            }`}>
                              {notification.title}
                            </div>
                            <div className={`text-xs leading-relaxed ${
                              notification.isRead ? 'text-white/40' : 'text-white/70'
                            }`}>
                              {notification.message}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-xs text-white/50">
                                <Clock size={10} />
                                {formatTime(notification.timestamp)}
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Action Buttons */}
                {notificationHistory.length > 0 && (
                  <div className="p-2 border-t border-green-500/20 mt-2 space-y-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="w-full text-xs text-green-400 hover:text-green-300 py-2 hover:bg-green-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCheck size={12} />
                        Tümünü Okundu İşaretle
                      </button>
                    )}
                    <button
                      onClick={clearHistory}
                      className="w-full text-xs text-white/60 hover:text-red-400 py-2 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={12} />
                      Geçmişi Temizle
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🎨 Custom Styles */}
      <style jsx>{`
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-in {
          animation: slide-in-from-top-2 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
