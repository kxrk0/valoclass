'use client'

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X, 
  Bell 
} from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  timestamp: number; // 📅 Bildirim zamanı
  isRead: boolean; // 📖 Okundu mu?
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  notificationHistory: Notification[]; // 📜 Bildirim geçmişi
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  clearHistory: () => void; // 🧹 Geçmişi temizle
  getUnreadCount: () => number; // 🔔 Okunmamış sayısı
  markAsRead: (id: string) => void; // ✅ Okundu olarak işaretle
  markAllAsRead: () => void; // ✅ Tümünü okundu olarak işaretle
  // Convenience methods
  success: (title: string, message: string, options?: Partial<Notification>) => string;
  error: (title: string, message: string, options?: Partial<Notification>) => string;
  warning: (title: string, message: string, options?: Partial<Notification>) => string;
  info: (title: string, message: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  maxNotifications = 3,
  defaultDuration = 3000 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id,
      autoClose: true,
      duration: defaultDuration,
      timestamp: Date.now(),
      isRead: false,
      ...notification
    };

    setNotifications(prev => {
      // Remove oldest if we exceed max notifications
      const updated = prev.length >= maxNotifications 
        ? prev.slice(1)
        : prev;
      
      return [...updated, newNotification];
    });

    // 📜 Geçmişe ekle
    setNotificationHistory(prev => [newNotification, ...prev.slice(0, 49)]); // Son 50 bildirimi tut

    // Auto remove if autoClose is enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [maxNotifications, defaultDuration]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 🧹 Geçmişi temizle
  const clearHistory = useCallback(() => {
    setNotificationHistory([]);
  }, []);

  // 🔔 Okunmamış sayısı
  const getUnreadCount = useCallback(() => {
    return notificationHistory.filter(n => !n.isRead).length;
  }, [notificationHistory]);

  // ✅ Okundu olarak işaretle
  const markAsRead = useCallback((id: string) => {
    setNotificationHistory(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  // ✅ Tümünü okundu olarak işaretle
  const markAllAsRead = useCallback(() => {
    setNotificationHistory(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  }, [addNotification]);

  const error = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, autoClose: false, ...options });
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, duration: 7000, ...options });
  }, [addNotification]);

  const info = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    notificationHistory,
    addNotification,
    removeNotification,
    clearAllNotifications,
    clearHistory,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  // 🎨 Unified style - tüm bildirimler success stili gibi
  const getColors = (type: NotificationType) => {
    // Success stili base alınarak tüm türler için tutarlı tasarım
    const baseStyle = {
      bg: 'bg-black/30 backdrop-blur-2xl',
      border: 'border-green-500/30',
      accent: 'bg-green-500/20'
    };
    
    // Sadece icon rengi türe göre değişir
    switch (type) {
      case 'success': 
        return {
          ...baseStyle,
          icon: 'text-green-400'
        };
      case 'error':
        return {
          ...baseStyle,
          icon: 'text-green-400' // Success rengi kullan
        };
      case 'warning':
        return {
          ...baseStyle,
          icon: 'text-green-400' // Success rengi kullan
        };
      case 'info':
        return {
          ...baseStyle,
          icon: 'text-green-400' // Success rengi kullan
        };
      default:
        return {
          ...baseStyle,
          icon: 'text-green-400' // Success rengi kullan
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80">
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type);
        const colors = getColors(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`${colors.bg} ${colors.border} border text-white rounded-2xl shadow-2xl transform transition-all duration-500 animate-in slide-in-from-right hover:scale-105 hover:shadow-green-500/20 overflow-hidden group`}
          >
            {/* Accent line */}
            <div className={`h-1 ${colors.accent}`}></div>
            
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 ${colors.accent} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className={colors.icon} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white mb-1">
                    {notification.title}
                  </div>
                  <div className="text-xs text-white/70 break-words leading-relaxed">
                    {notification.message}
                  </div>
                  
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className={`mt-2 text-xs font-medium ${colors.icon} hover:underline`}
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-white/60 hover:text-white flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <X size={14} />
                </button>
              </div>
              
              {/* 🎨 Enhanced Progress bar for auto-close notifications */}
              {notification.autoClose && (
                <div className="mt-3 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-1 rounded-full transition-all linear ${colors.accent} shadow-sm`}
                    style={{
                      animation: `shrink ${notification.duration}ms linear forwards, pulse 2s ease-in-out infinite`
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Add keyframes for progress bar animation (client-side only)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  @keyframes slide-in-from-right {
    from { 
      transform: translateX(100%) scale(0.9);
      opacity: 0;
    }
    50% {
      transform: translateX(-5%) scale(1.02);
      opacity: 0.8;
    }
    to { 
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% { 
      opacity: 0.8;
      transform: scaleY(1);
    }
    50% { 
      opacity: 1;
      transform: scaleY(1.1);
    }
  }
  
  .animate-in {
    animation: slide-in-from-right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .group:hover .group-hover\\:scale-110 {
    transform: scale(1.1);
  }
`;

  document.head.appendChild(style);
}

export default NotificationContext;
