'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotifications } from './NotificationContext';

interface AdminStats {
  totalUsers: number;
  totalLineups: number;
  totalCrosshairs: number;
  pendingReports: number;
  timestamp: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AdminSocketContextType {
  socket: Socket | null;
  connected: boolean;
  stats: AdminStats | null;
  adminUser: AdminUser | null;
  error: string | null;
  requestStats: () => void;
  subscribeToUserActivity: () => void;
  subscribeToReports: () => void;
}

const AdminSocketContext = createContext<AdminSocketContextType | null>(null);

export const useAdminSocket = () => {
  const context = useContext(AdminSocketContext);
  if (!context) {
    throw new Error('useAdminSocket must be used within AdminSocketProvider');
  }
  return context;
};

interface AdminSocketProviderProps {
  children: React.ReactNode;
}

export const AdminSocketProvider: React.FC<AdminSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { success, error: showError, warning, info } = useNotifications();
  
  // Token'ı localStorage'dan al (geçici çözüm - gerçekte AuthContext'ten gelecek)
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      // Check if admin user is logged in via OAuth
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        try {
          const user = JSON.parse(adminUser);
          if (user.role === 'admin') {
            // Return the development mock token that backend expects
            return 'dev-admin-token-mock-jwt-for-testing-only';
          }
        } catch (error) {
          console.error('Error parsing admin user:', error);
        }
      }
      
      // Fallback to regular auth token for non-admin users
      const existingToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (existingToken) {
        // If it's an admin token format, convert to development mock token
        if (existingToken.startsWith('admin_')) {
          return 'dev-admin-token-mock-jwt-for-testing-only';
        }
        return existingToken;
      }
    }
    return null;
  };

  const connectSocket = useCallback(() => {
    const token = getAuthToken();
    
    if (!token) {
      setError('Authentication token not found. Please login first.');
      setConnected(false);
      return;
    }

    try {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/admin`, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        forceNew: true
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('🔗 Connected to admin WebSocket');
        setConnected(true);
        setError(null);
        success('Connected', 'Admin WebSocket connection established');
      });

      newSocket.on('connect_error', (err) => {
        console.error('❌ Admin socket connection error:', err);
        setConnected(false);
        setError(err.message || 'Connection failed');
        showError('Connection Failed', err.message || 'Unable to connect to admin server');
      });

            newSocket.on('disconnect', (reason) => {
              console.log('🔌 Admin socket disconnected:', reason);
              setConnected(false);
              warning('Disconnected', 'Admin WebSocket connection lost');
              // No automatic reconnection - user needs to refresh or re-login
            });

      // Admin-specific event handlers
      newSocket.on('admin:welcome', (data) => {
        console.log('👋 Admin welcome message:', data);
        setAdminUser(data.user);
        info('Welcome', `Welcome ${data.user.username}! You are now connected to the admin panel.`);
      });

      newSocket.on('admin:stats_update', (data: AdminStats) => {
        console.log('📊 Stats updated:', data);
        setStats(data);
      });

      newSocket.on('admin:error', (data) => {
        console.error('❌ Admin error:', data);
        setError(data.message);
        showError('Admin Error', data.message);
      });

      // User activity events
      newSocket.on('admin:user_login', (data) => {
        console.log('👤 User logged in:', data);
        info('User Activity', `${data.username} has logged in`);
      });

      newSocket.on('admin:user_logout', (data) => {
        console.log('👤 User logged out:', data);
        info('User Activity', `${data.username} has logged out`);
      });

      // Report events
      newSocket.on('admin:report_created', (data) => {
        console.log('🚨 New report:', data);
        warning('New Report', `New report submitted: ${data.reason}`, {
          action: {
            label: 'View Reports',
            onClick: () => {
              window.location.href = '/admin/reports';
            }
          }
        });
      });

      // Content moderation events
      newSocket.on('admin:content_flagged', (data) => {
        console.log('⚠️ Content flagged:', data);
        warning('Content Flagged', `${data.contentType} has been auto-flagged for review`, {
          action: {
            label: 'Review Content',
            onClick: () => {
              window.location.href = '/admin/moderation';
            }
          }
        });
      });

      setSocket(newSocket);
    } catch (err) {
      console.error('Socket initialization error:', err);
      setError('Failed to initialize socket connection');
    }
  }, [success, showError, warning, info]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
      setAdminUser(null);
      setStats(null);
    }
  }, [socket]);

  // Actions
  const requestStats = useCallback(() => {
    if (socket && connected) {
      socket.emit('admin:request_stats');
    }
  }, [socket, connected]);

  const subscribeToUserActivity = useCallback(() => {
    if (socket && connected) {
      socket.emit('admin:subscribe_user_activity');
    }
  }, [socket, connected]);

  const subscribeToReports = useCallback(() => {
    if (socket && connected) {
      socket.emit('admin:subscribe_reports');
    }
  }, [socket, connected]);

  // Initialize socket connection on mount
  useEffect(() => {
    connectSocket();
    
    return () => {
      disconnectSocket();
    };
  }, [connectSocket]);

  // Auto-request stats on connection and set interval
  useEffect(() => {
    if (connected) {
      requestStats();
      subscribeToUserActivity();
      subscribeToReports();
      
      // Set up auto-refresh stats every 30 seconds
      const statsInterval = setInterval(() => {
        requestStats();
      }, 30000);
      
      return () => clearInterval(statsInterval);
    }
  }, [connected, requestStats, subscribeToUserActivity, subscribeToReports]);

  const value: AdminSocketContextType = {
    socket,
    connected,
    stats,
    adminUser,
    error,
    requestStats,
    subscribeToUserActivity,
    subscribeToReports
  };

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export default AdminSocketContext;
