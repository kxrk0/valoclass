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
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
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
  maxNotifications = 5,
  defaultDuration = 5000 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      id,
      autoClose: true,
      duration: defaultDuration,
      ...notification
    };

    setNotifications(prev => {
      // Remove oldest if we exceed max notifications
      const updated = prev.length >= maxNotifications 
        ? prev.slice(1)
        : prev;
      
      return [...updated, newNotification];
    });

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
    addNotification,
    removeNotification,
    clearAllNotifications,
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

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'success': 
        return {
          bg: 'bg-gradient-to-r from-green-600 to-green-700',
          icon: 'text-green-100',
          border: 'border-green-500'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-700',
          icon: 'text-red-100',
          border: 'border-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
          icon: 'text-yellow-100',
          border: 'border-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
          icon: 'text-blue-100',
          border: 'border-blue-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-600 to-gray-700',
          icon: 'text-gray-100',
          border: 'border-gray-500'
        };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type);
        const colors = getColors(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`${colors.bg} ${colors.border} border text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-in slide-in-from-right`}
          >
            <div className="flex items-start gap-3">
              <Icon size={20} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1">
                  {notification.title}
                </div>
                <div className="text-sm opacity-90 break-words">
                  {notification.message}
                </div>
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-xs underline hover:no-underline opacity-90 hover:opacity-100"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/80 hover:text-white flex-shrink-0 p-1 hover:bg-white/10 rounded"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Progress bar for auto-close notifications */}
            {notification.autoClose && (
              <div className="mt-3 w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-white h-1 rounded-full transition-all linear"
                  style={{
                    animation: `shrink ${notification.duration}ms linear forwards`
                  }}
                ></div>
              </div>
            )}
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
      transform: translateX(100%);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-in {
    animation: slide-in-from-right 0.3s ease-out;
  }
`;

  document.head.appendChild(style);
}

export default NotificationContext;
