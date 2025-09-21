'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { useNotificationSafe } from '@/hooks/useNotificationSafe';

type SocketType = ReturnType<typeof io>;

// 🎨 Gelişmiş animasyon durumları
interface AnimationState {
  pulse: boolean;
  shake: boolean;
  glow: boolean;
  bounce: boolean;
  rotate: boolean;
  fade: boolean;
}

// 📊 Detaylı performans metrikleri
interface PerformanceMetrics {
  ping: number;
  uptime: number;
  packetsReceived: number;
  packetsSent: number;
  lastActivity: string;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'critical';
  dataTransferRate: number; // KB/s
  memoryUsage: number; // MB
}

// 🎯 Genişletilmiş admin istatistikleri
interface AdminStats {
  totalUsers: number;
  totalLineups: number;
  totalCrosshairs: number;
  pendingReports: number;
  timestamp: string;
  // Yeni zengin özellikler
  activeUsers: number;
  onlineAdmins: number;
  systemLoad: number;
  errorRate: number;
  averageResponseTime: number;
  dailyActiveUsers: number;
  weeklyGrowth: number;
  topRegions: { name: string; users: number; flag: string }[];
  recentActivities: ActivityLog[];
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

// 📝 Aktivite günlüğü
interface ActivityLog {
  id: string;
  type: 'user_join' | 'user_leave' | 'report_created' | 'content_flagged' | 'admin_action';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user?: string;
  metadata?: any;
}

// 🎵 Ses efektleri
interface SoundEffects {
  connectionEstablished: string;
  connectionLost: string;
  newNotification: string;
  criticalAlert: string;
  userActivity: string;
  systemError: string;
}

// 🌍 Gerçek zamanlı aktivite haritası
interface ActivityHeatmap {
  [region: string]: {
    users: number;
    activity: number;
    coordinates: [number, number];
    color: string;
  };
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  // Gelişmiş profil bilgileri
  lastSeen: string;
  permissions: string[];
  preferences: {
    theme: 'dark' | 'light' | 'auto';
    notifications: boolean;
    sounds: boolean;
    animations: boolean;
  };
  stats: {
    totalActions: number;
    todayActions: number;
    averageResponseTime: number;
  };
}

// 🎛️ Kapsamlı context tipi
interface AdminSocketContextType {
  // Temel bağlantı
  socket: SocketType | null;
  connected: boolean;
  connecting: boolean;
  
  // Veri
  stats: AdminStats | null;
  adminUser: AdminUser | null;
  
  // Performans & Sağlık
  performance: PerformanceMetrics | null;
  connectionHistory: { timestamp: string; status: boolean; ping: number }[];
  
  // Animasyonlar & Efektler
  animations: AnimationState;
  visualEffects: boolean;
  soundEnabled: boolean;
  
  // Aktivite & İzleme
  activityHeatmap: ActivityHeatmap;
  liveUsers: number;
  activeAdmins: string[];
  
  // Hatalar & Uyarılar
  error: string | null;
  warnings: string[];
  criticalAlerts: number;
  
  // Eylemler
  requestStats: () => void;
  subscribeToUserActivity: () => void;
  subscribeToReports: () => void;
  resetConnection: () => void;
  
  // Yeni gelişmiş eylemler
  toggleAnimations: () => void;
  toggleSounds: () => void;
  toggleVisualEffects: () => void;
  triggerPulse: () => void;
  requestPerformanceReport: () => void;
  exportActivityData: () => void;
  broadcastAdminMessage: (message: string) => void;
  
  // Real-time kontroller
  pauseRealTimeUpdates: () => void;
  resumeRealTimeUpdates: () => void;
  setUpdateFrequency: (frequency: number) => void;
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
  // 🔌 Temel bağlantı durumları
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  // 📊 Veri durumları
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  
  // 🚀 Performans ve sağlık izleme
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [connectionHistory, setConnectionHistory] = useState<{ timestamp: string; status: boolean; ping: number }[]>([]);
  
  // 🎨 Animasyon ve görsel efektler
  const [animations, setAnimations] = useState<AnimationState>({
    pulse: false,
    shake: false,
    glow: false,
    bounce: false,
    rotate: false,
    fade: false
  });
  const [visualEffects, setVisualEffects] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // 🗺️ Aktivite izleme
  const [activityHeatmap, setActivityHeatmap] = useState<ActivityHeatmap>({});
  const [liveUsers, setLiveUsers] = useState(0);
  const [activeAdmins, setActiveAdmins] = useState<string[]>([]);
  
  // ⚠️ Hata ve uyarı sistemi
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState(0);
  
  // 🎛️ Real-time kontrol
  const [realTimeUpdatesEnabled, setRealTimeUpdatesEnabled] = useState(true);
  const [updateFrequency, setUpdateFrequency] = useState(1000); // ms
  
  // 📱 Referanslar ve durumlar
  const [lastConnectionState, setLastConnectionState] = useState<boolean | null>(null);
  const connectionAttemptsRef = useRef(0);
  const socketRef = useRef<SocketType | null>(null);
  const connectionLockRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const performanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // 🚫 Duplicate socket emit önleme  
  const lastSocketEmitRef = useRef<string>('');
  
  // 🔊 Ses yöneticisi
  const soundEffects = useRef<SoundEffects>({
    connectionEstablished: '/sounds/connection-success.mp3',
    connectionLost: '/sounds/connection-lost.mp3',
    newNotification: '/sounds/notification.mp3',
    criticalAlert: '/sounds/alert.mp3',
    userActivity: '/sounds/user-activity.mp3',
    systemError: '/sounds/error.mp3'
  });
  
  const { success, error, warning, info } = useNotificationSafe();
  
  // 🎵 Ses efektleri çalma
  const playSound = useCallback(async (soundType: keyof SoundEffects) => {
    if (!soundEnabled) return;
    
    try {
      const audio = new Audio(soundEffects.current[soundType]);
      audio.volume = 0.3;
      await audio.play();
    } catch (error) {
      console.warn('Ses çalınamadı:', error);
    }
  }, [soundEnabled]);
  
  // 🎨 Animasyon tetikleyici
  const triggerAnimation = useCallback((type: keyof AnimationState, duration: number = 2000) => {
    if (!visualEffects) return;
    
    setAnimations(prev => ({ ...prev, [type]: true }));
    
    const timeout = setTimeout(() => {
      setAnimations(prev => ({ ...prev, [type]: false }));
    }, duration);
    
    animationTimeoutsRef.current.push(timeout);
  }, [visualEffects]);
  
  // 📊 Performans metrikleri güncelleme
  const updatePerformanceMetrics = useCallback(() => {
    if (!socket || !connected) return;
    
    const startTime = Date.now();
    socket.emit('admin:ping', { timestamp: startTime });
    
    const performanceData: PerformanceMetrics = {
      ping: 0, // Will be updated by pong response
      uptime: performance ? performance.uptime + 1 : 1,
      packetsReceived: performance ? performance.packetsReceived + 1 : 1,
      packetsSent: performance ? performance.packetsSent + 1 : 1,
      lastActivity: new Date().toISOString(),
      connectionQuality: 'good', // Will be calculated based on ping
      dataTransferRate: Math.random() * 100, // Simulated for now
      memoryUsage: Math.random() * 512 // Simulated for now
    };
    
    setPerformance(performanceData);
    
    // Bağlantı geçmişini güncelle
    setConnectionHistory(prev => [
      ...prev.slice(-99), // Son 100 kayıt tut
      {
        timestamp: new Date().toISOString(),
        status: connected,
        ping: performanceData.ping
      }
    ]);
  }, [socket, connected, performance]);
  
  // 🌡️ Sistem sağlığı kontrolü
  const checkSystemHealth = useCallback(() => {
    if (!stats) return;
    
    const healthIssues: string[] = [];
    
    if (stats.systemHealth.cpu > 80) {
      healthIssues.push('Yüksek CPU kullanımı');
    }
    if (stats.systemHealth.memory > 90) {
      healthIssues.push('Bellek kullanımı kritik seviyede');
    }
    if (stats.errorRate > 5) {
      healthIssues.push('Yüksek hata oranı');
    }
    
    if (healthIssues.length > 0) {
      setWarnings(healthIssues);
      setCriticalAlerts(prev => prev + healthIssues.length);
      triggerAnimation('shake', 3000);
      playSound('systemError');
    }
  }, [stats, triggerAnimation, playSound]);
  
  // 🎯 Gelişmiş eylemler
  const toggleAnimations = useCallback(() => {
    setVisualEffects(prev => !prev);
  }, []);
  
  const toggleSounds = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);
  
  const toggleVisualEffects = useCallback(() => {
    setVisualEffects(prev => !prev);
  }, []);
  
  const triggerPulse = useCallback(() => {
    triggerAnimation('pulse', 1500);
  }, [triggerAnimation]);
  
  const requestPerformanceReport = useCallback(() => {
    if (socket && connected) {
      socket.emit('admin:request_performance_report');
    }
  }, [socket, connected]);
  
  const exportActivityData = useCallback(() => {
    if (!stats) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      stats,
      performance,
      connectionHistory,
      activityHeatmap
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-activity-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stats, performance, connectionHistory, activityHeatmap]);
  
  const broadcastAdminMessage = useCallback((message: string) => {
    if (socket && connected) {
      socket.emit('admin:broadcast_message', { message });
      info('Mesaj Gönderildi', `Admin mesajı tüm kullanıcılara gönderildi`);
    }
  }, [socket, connected, info]);
  
  const pauseRealTimeUpdates = useCallback(() => {
    setRealTimeUpdatesEnabled(false);
  }, []);
  
  const resumeRealTimeUpdates = useCallback(() => {
    setRealTimeUpdatesEnabled(true);
  }, []);
  
  const setUpdateFrequencyHandler = useCallback((frequency: number) => {
    setUpdateFrequency(frequency);
  }, []);

  // Backend-centric auth validation
  const validateAuth = useCallback(async () => {
    try {
      // Check auth with backend to validate current session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user && data.permissions?.canAccessAdmin) {
          console.log('🔐 Auth validation successful for WebSocket connection');
          return true;
        }
      }
      
      console.log('❌ Auth validation failed for WebSocket connection');
      return false;
    } catch (error) {
      console.error('Error validating auth for WebSocket:', error);
      return false;
    }
  }, []);

  const connectSocket = useCallback(async () => {
    console.log('🚀 Enhanced ConnectSocket called - Lock:', connectionLockRef.current, 'Connecting:', connecting, 'Connected:', connected);
    
    // 🎨 Bağlantı animasyonu başlat
    triggerAnimation('pulse', 3000);
    
    // RELAXED CONNECTION PREVENTION - only prevent if truly busy
    if (connecting) {
      console.log('⏳ Connection already in progress, skipping...');
      return;
    }
    
    // If already connected, don't create new connection
    if (connected && socket && socket.connected) {
      console.log('✅ Already connected, triggering success pulse');
      triggerAnimation('glow', 1000);
      return;
    }
    
    // Prevent too many connection attempts
    if (connectionAttemptsRef.current >= 3) {
      console.log('❌ Max connection attempts reached, not retrying');
      setErrorMessage('Çok fazla bağlantı denemesi. Lütfen sayfayı yenileyin.');
      triggerAnimation('shake', 2000);
      playSound('systemError');
      return;
    }
    
    // LIGHT LOCK - only during connection attempt
    connectionLockRef.current = true;
    setConnecting(true);
    connectionAttemptsRef.current += 1;
    
    // 🎵 Bağlantı denendiğinde ses efekti
    if (connectionAttemptsRef.current === 1) {
      triggerAnimation('rotate', 2000);
    }
    
    // Validate authentication before attempting WebSocket connection
    const isAuthenticated = await validateAuth();
    
    if (!isAuthenticated) {
      setErrorMessage('Kimlik doğrulama başarısız. Lütfen önce giriş yapın.');
      setConnected(false);
      setConnecting(false);
      connectionLockRef.current = false; // UNLOCK
      triggerAnimation('shake', 2000);
      playSound('systemError');
      return;
    }

    try {
      console.log(`🔗 Attempting WebSocket connection (attempt ${connectionAttemptsRef.current}/3)...`);
      
      // Clean up any existing connections first
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
      
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/admin`, {
        auth: {
          token: 'authenticated-via-cookies' // Dummy token, real auth via httpOnly cookies
        },
        transports: ['websocket', 'polling'],
        forceNew: false, // Allow connection reuse
        timeout: 10000, // Faster timeout - 10 seconds
        reconnection: false // Disable auto-reconnection to prevent multiple connections
      });

      // 🎉 Gelişmiş bağlantı event handler'ları
      newSocket.on('connect', () => {
        console.log('🎉 Enhanced admin WebSocket connected!');
        setConnected(true);
        setConnecting(false);
        setErrorMessage(null);
        setWarnings([]);
        connectionLockRef.current = false; // UNLOCK CONNECTION
        connectionAttemptsRef.current = 0; // Reset attempts on successful connection
        
        // 🎨 Başarılı bağlantı animasyonları
        triggerAnimation('bounce', 2000);
        triggerAnimation('glow', 3000);
        
        // 🎵 Başarı sesi
        playSound('connectionEstablished');
        
        // Performans izlemeyi başlat
        updatePerformanceMetrics();
        
        // Only show notification if this is a real connection change
        if (lastConnectionState === false || lastConnectionState === null) {
          success('🚀 Sistem Çevrimiçi', 'Admin sunucusuna başarıyla bağlanıldı');
          setLastConnectionState(true);
        }
        
        console.log('✨ Connection established with enhanced features active');
      });

      newSocket.on('connect_error', (err: Error) => {
        console.error('💥 Enhanced connection error handler:', err);
        setConnected(false);
        setConnecting(false);
        connectionLockRef.current = false; // UNLOCK CONNECTION
        setErrorMessage(err.message || 'Bağlantı başarısız');
        
        // 🎨 Hata animasyonları
        triggerAnimation('shake', 3000);
        triggerAnimation('fade', 2000);
        
        // 🎵 Hata sesi
        playSound('connectionLost');
        
        // Only show error notification once per session to prevent spam
        if (lastConnectionState !== false) {
          error('🚨 Bağlantı Hatası', err.message || 'Admin sunucusuna bağlanılamadı');
        }
        
        // Performans metriklerini güncelle
        setConnectionHistory(prev => [
          ...prev.slice(-99),
          {
            timestamp: new Date().toISOString(),
            status: false,
            ping: 9999 // Yüksek ping hata göstergesi
          }
        ]);
      });

      newSocket.on('disconnect', (reason: string) => {
        console.log('🔌 Enhanced disconnect handler:', reason);
        setConnected(false);
        setConnecting(false);
        connectionLockRef.current = false; // UNLOCK CONNECTION
        
        // 🎨 Bağlantı kesilme animasyonları
        triggerAnimation('fade', 2000);
        
        // 🎵 Bağlantı kesilme sesi
        playSound('connectionLost');
        
        // Only show notification if this is a real disconnection
        if (lastConnectionState === true) {
          warning('📡 Sistem Çevrimdışı', `Bağlantı kesildi: ${reason}`);
          setLastConnectionState(false);
        }
        
        // Performans metriklerini sıfırla
        setPerformance(null);
        setActivityHeatmap({});
        setActiveAdmins([]);
        setLiveUsers(0);
        
        console.log('🔌 Enhanced disconnect cleanup completed');
      });

      // 🎯 Gelişmiş admin-specific event handlers
      newSocket.on('admin:welcome', (data: { user: AdminUser }) => {
        console.log('🌟 Enhanced admin welcome:', data);
        console.log('🖼️ Profile Avatar Debug:', {
          hasAvatar: !!data.user.avatar,
          avatarValue: data.user.avatar,
          userObject: data.user
        });
        
        setAdminUser(data.user);
        
        // 🎨 Hoşgeldin animasyonu
        triggerAnimation('bounce', 1500);
        
        // Admin kullanıcı listesine ekle
        setActiveAdmins(prev => [...prev.filter(admin => admin !== data.user.username), data.user.username]);
        
        console.log(`✨ Enhanced admin user ${data.user.username} loaded with preferences`);
        
        // Kullanıcı tercihlerini uygula
        if (data.user.preferences) {
          setVisualEffects(data.user.preferences.animations);
          setSoundEnabled(data.user.preferences.sounds);
        }
      });

      newSocket.on('admin:stats_update', (data: AdminStats) => {
        console.log('📈 Enhanced stats update:', data);
        setStats(data);
        
        // 🎨 İstatistik güncellendiğinde animasyon
        triggerAnimation('pulse', 800);
        
        // Sistem sağlığını kontrol et
        checkSystemHealth();
        
        // Aktivite haritasını güncelle
        if (data.topRegions) {
          const heatmapData: ActivityHeatmap = {};
          data.topRegions.forEach((region, index) => {
            heatmapData[region.name] = {
              users: region.users,
              activity: Math.random() * 100, // Simulated activity
              coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90],
              color: `hsl(${120 - (index * 30)}, 70%, 50%)`
            };
          });
          setActivityHeatmap(heatmapData);
        }
        
        // Canlı kullanıcı sayısını güncelle
        setLiveUsers(data.activeUsers);
      });

      newSocket.on('admin:error', (data: { message: string }) => {
        console.error('💥 Enhanced admin error:', data);
        setErrorMessage(data.message);
        
        // 🎨 Hata animasyonları
        triggerAnimation('shake', 2000);
        triggerAnimation('fade', 1500);
        
        // 🎵 Hata sesi
        playSound('systemError');
        
        // Uyarı listesine ekle
        setWarnings(prev => [...prev, data.message]);
        setCriticalAlerts(prev => prev + 1);
        
        error('🚨 Admin Hatası', data.message);
      });
      
      // 🎯 Yeni gelişmiş event handler'lar
      newSocket.on('admin:pong', (data: { timestamp: number }) => {
        const ping = Date.now() - data.timestamp;
        setPerformance(prev => prev ? {
          ...prev,
          ping,
          connectionQuality: ping < 50 ? 'excellent' : ping < 100 ? 'good' : ping < 200 ? 'poor' : 'critical'
        } : null);
      });

      newSocket.on('admin:performance_report', (data: PerformanceMetrics) => {
        console.log('📊 Performance report received:', data);
        setPerformance(data);
        
        // Performans raporu geldiğinde animasyon
        triggerAnimation('glow', 1000);
      });

      newSocket.on('admin:live_users_update', (data: { count: number }) => {
        setLiveUsers(data.count);
        
        // Kullanıcı sayısı değişiminde küçük animasyon
        if (visualEffects) {
          triggerAnimation('pulse', 500);
        }
      });

      newSocket.on('admin:system_health_alert', (data: { level: string; message: string }) => {
        console.warn('🚨 System health alert:', data);
        
        if (data.level === 'critical') {
          setCriticalAlerts(prev => prev + 1);
          triggerAnimation('shake', 3000);
          playSound('criticalAlert');
          error('🚨 Kritik Sistem Uyarısı', data.message);
        } else {
          setWarnings(prev => [...prev, data.message]);
          triggerAnimation('bounce', 1000);
          warning('⚠️ Sistem Uyarısı', data.message);
        }
      });

      // 👥 Gelişmiş kullanıcı aktivite eventi
      newSocket.on('admin:user_login', (data: any) => {
        console.log('🌟 Enhanced user login:', data);
        
        // Görsel efekt ve ses (spam olmayacak şekilde)
        if (visualEffects && Math.random() > 0.8) { // %20 olasılıkla
          triggerAnimation('pulse', 300);
          playSound('userActivity');
        }
        
        // Canlı kullanıcı sayısını artır
        setLiveUsers(prev => prev + 1);
      });

      newSocket.on('admin:user_logout', (data: any) => {
        console.log('👋 Enhanced user logout:', data);
        
        // Canlı kullanıcı sayısını azalt
        setLiveUsers(prev => Math.max(0, prev - 1));
      });

      // 📋 Gelişmiş rapor eventi
      newSocket.on('admin:report_created', (data: { reason: string, user?: string }) => {
        console.log('🚨 Enhanced new report:', data);
        
        // 🎨 Rapor animasyonları
        triggerAnimation('shake', 1500);
        triggerAnimation('glow', 2000);
        
        // 🎵 Bildirim sesi
        playSound('criticalAlert');
        
        // Kritik uyarı sayısını artır
        setCriticalAlerts(prev => prev + 1);
        
        warning('🚨 Yeni Rapor', `Yeni rapor: ${data.reason}`, {
          action: {
            label: '📋 Raporları Görüntüle',
            onClick: () => {
              window.location.href = '/admin/reports';
            }
          }
        });
      });

      // 🛡️ Gelişmiş içerik moderasyon eventi
      newSocket.on('admin:content_flagged', (data: { contentType: string, severity?: string }) => {
        console.log('⚠️ Enhanced content flagged:', data);
        
        // 🎨 Moderasyon animasyonları
        if (data.severity === 'high') {
          triggerAnimation('shake', 2000);
          playSound('criticalAlert');
          setCriticalAlerts(prev => prev + 1);
        } else {
          triggerAnimation('bounce', 1000);
          playSound('newNotification');
        }
        
        warning('🛡️ İçerik İşaretlendi', `${data.contentType} inceleme için işaretlendi`, {
          action: {
            label: '🔍 İncelemek İçin Git',
            onClick: () => {
              window.location.href = '/admin/moderation';
            }
          }
        });
      });
      
      // 🌍 Aktivite haritası güncelleme eventi
      newSocket.on('admin:activity_map_update', (data: ActivityHeatmap) => {
        console.log('🗺️ Activity map updated:', data);
        setActivityHeatmap(data);
        
        if (visualEffects) {
          triggerAnimation('pulse', 600);
        }
      });
      
      // 🎯 Admin aksiyon eventi
      newSocket.on('admin:action_logged', (data: ActivityLog) => {
        console.log('📝 Admin action logged:', data);
        
        // Günlük aktivite animasyonu
        if (visualEffects) {
          triggerAnimation('glow', 800);
        }
      });

      setSocket(newSocket);
      socketRef.current = newSocket;
    } catch (err) {
      console.error('Socket initialization error:', err);
      setErrorMessage('Failed to initialize socket connection');
      setConnecting(false);
      connectionLockRef.current = false; // UNLOCK CONNECTION
    }
  }, [success, error, warning, info, validateAuth]);

  const disconnectSocket = useCallback(() => {
    console.log('🔌 Disconnecting WebSocket...');
    
    // Disconnect current socket
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
    }
    
    // Disconnect socket from ref as well
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    // Cleanup artık global hook tarafından yönetiliyor
    
    // Reset all states
    setConnected(false);
    setConnecting(false);
    connectionLockRef.current = false; // UNLOCK CONNECTION
    setAdminUser(null);
    setStats(null);
    setErrorMessage(null);
    setWarnings([]);
    setCriticalAlerts(0);
    connectionAttemptsRef.current = 0;
    
    console.log('✅ WebSocket disconnected and cleaned up (with notification cleanup)');
  }, [socket]);
  
  // Reset function for debugging
  const resetConnection = useCallback(() => {
    console.log('🔄 MANUAL CONNECTION RESET');
    connectionLockRef.current = false;
    hasInitializedRef.current = false;
    setConnecting(false);
    connectionAttemptsRef.current = 0;
    disconnectSocket();
    
    setTimeout(() => {
      connectSocket();
    }, 1000);
  }, [disconnectSocket, connectSocket]);

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

  // Initialize socket connection on mount - RELAXED CONTROLS
  useEffect(() => {
    console.log('🔍 Mount effect triggered, hasInitialized:', hasInitializedRef.current);
    
    if (hasInitializedRef.current) {
      console.log('🔒 Already initialized, skipping mount effect');
      return;
    }
    
    hasInitializedRef.current = true;
    let isMounted = true;
    
    const initConnection = async () => {
      if (isMounted) {
        console.log('🚀 Initializing WebSocket connection (mount effect)');
        await connectSocket();
      }
    };
    
    // Remove delay - immediate connection
    initConnection();
    
    return () => {
      isMounted = false;
      console.log('🧹 Mount effect cleanup');
      disconnectSocket();
    };
  }, []); // Empty dependency array - only run once on mount

  // Auto-request stats on connection and set interval - DEBOUNCED
  useEffect(() => {
    if (!connected || !socket) return;
    
    console.log('📊 Setting up stats and subscriptions...');
    
    // Request initial stats - INLINE to avoid callback dependencies
    // Sadece bir kez çalışması için kontrol ekle
    const emitKey = `${socket?.id}-${connected}`;
    
    if (socket && connected && lastSocketEmitRef.current !== emitKey) {
      console.log('📡 Emitting admin subscriptions (duplicate prevention)...');
      socket.emit('admin:request_stats');
      socket.emit('admin:subscribe_user_activity');
      socket.emit('admin:subscribe_reports');
      lastSocketEmitRef.current = emitKey;
    } else if (lastSocketEmitRef.current === emitKey) {
      console.log('🚫 Duplicate socket emit prevented:', emitKey);
    }
    
    // Set up auto-refresh stats every 30 seconds
    const statsInterval = setInterval(() => {
      if (connected && socket) { // Double check
        socket.emit('admin:request_stats');
      }
    }, 30000);
    
    return () => {
      console.log('🧹 Cleaning up stats interval');
      clearInterval(statsInterval);
    };
  }, [connected, socket]); // Remove callbacks from dependencies
  
  // AUTO RECOVERY - if stuck in connecting state for too long
  useEffect(() => {
    if (!connecting) return;
    
    console.log('⏰ Starting connection timeout (15 seconds)');
    const timeout = setTimeout(() => {
      if (connecting) {
        console.log('🚨 Connection timeout! Auto-recovery starting...');
        resetConnection();
      }
    }, 15000); // 15 second timeout
    
    return () => clearTimeout(timeout);
  }, [connecting, resetConnection]);
  
  // Expose resetConnection globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).adminSocketReset = resetConnection;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).adminSocketReset;
      }
    };
  }, [resetConnection]);

  // 🎯 Gelişmiş context değeri
  const value: AdminSocketContextType = {
    // Temel bağlantı
    socket,
    connected,
    connecting,
    
    // Veri
    stats,
    adminUser,
    
    // Performans & Sağlık
    performance,
    connectionHistory,
    
    // Animasyonlar & Efektler
    animations,
    visualEffects,
    soundEnabled,
    
    // Aktivite & İzleme
    activityHeatmap,
    liveUsers,
    activeAdmins,
    
    // Hatalar & Uyarılar
    error: errorMessage,
    warnings,
    criticalAlerts,
    
    // Temel eylemler
    requestStats,
    subscribeToUserActivity,
    subscribeToReports,
    resetConnection,
    
    // Gelişmiş eylemler
    toggleAnimations,
    toggleSounds,
    toggleVisualEffects,
    triggerPulse,
    requestPerformanceReport,
    exportActivityData,
    broadcastAdminMessage,
    
    // Real-time kontroller
    pauseRealTimeUpdates,
    resumeRealTimeUpdates,
    setUpdateFrequency: setUpdateFrequencyHandler
  };

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export default AdminSocketContext;
