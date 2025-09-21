'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Shield, 
  BarChart3, 
  AlertTriangle, 
  Activity,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  Crosshair,
  Target,
  MessageSquare,
  TrendingUp,
  Database,
  Wifi,
  WifiOff,
  Command,
  Zap,
  Globe,
  Search,
  LogOut,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Crown,
  Star,
  User,
  Settings2
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useAdminSocket, AdminSocketProvider } from '@/contexts/AdminSocketContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayoutComponent: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { connected, stats, adminUser, error } = useAdminSocket();
  
  // Get admin user info from backend API (backend-centric approach)
  const [backendUser, setBackendUser] = useState<any>(null);
  const [backendUserLoading, setBackendUserLoading] = useState(true);

  const fetchAdminUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setBackendUser(data.user);
        }
      }
    } catch (error) {
      console.error('Error fetching admin user:', error);
    } finally {
      setBackendUserLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUser();
  }, []);

  const currentAdminUser = adminUser || backendUser;

  const navigation = [
    { 
      name: 'Overview', 
      href: '/admin/dashboard', 
      icon: Home,
      description: 'System overview',
      category: 'Main'
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: TrendingUp,
      description: 'Performance metrics',
      category: 'Analytics'
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: Users,
      description: 'User management',
      badge: stats?.totalUsers,
      category: 'Management'
    },
    { 
      name: 'Reports', 
      href: '/admin/reports', 
      icon: AlertTriangle, 
      description: 'User reports',
      badge: stats?.pendingReports,
      urgent: stats?.pendingReports > 0,
      category: 'Moderation'
    },
    { 
      name: 'Activity', 
      href: '/admin/activity', 
      icon: Activity,
      description: 'System activity',
      category: 'Monitoring'
    },
    { 
      name: 'Moderation', 
      href: '/admin/moderation', 
      icon: Shield,
      description: 'Content moderation',
      category: 'Moderation'
    },
    { 
      name: 'Crosshairs', 
      href: '/admin/crosshairs', 
      icon: Crosshair,
      description: 'Crosshair content',
      category: 'Content'
    },
    { 
      name: 'Lineups', 
      href: '/admin/lineups', 
      icon: Target,
      description: 'Lineup content',
      category: 'Content'
    },
    { 
      name: 'System', 
      href: '/admin/system', 
      icon: Database,
      description: 'System monitoring',
      category: 'System'
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      description: 'Configuration',
      category: 'System'
    }
  ];

  const categories = ['Main', 'Analytics', 'Management', 'Moderation', 'Content', 'Monitoring', 'System'];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getCurrentPageName = () => {
    const activeItem = navigation.find(item => isActive(item.href));
    return activeItem?.name || 'Admin Console';
  };

  // Logout function (backend-centric)
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Redirect to login
    window.location.href = '/admin/login';
  };

  // Keyboard shortcuts and click outside handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0D] relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0B0D] via-[#111318] to-[#1A1D29]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-20' : 'w-80'}
      `}>
        {/* Sidebar Background with Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 backdrop-blur-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between h-20 px-6 border-b border-white/10 ${
            sidebarCollapsed ? 'justify-center px-4' : ''
          }`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Crown size={20} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-white font-bold text-xl tracking-tight">ValorantGuides</h1>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-cyan-400 font-medium">Admin Console</span>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSidebar}
                className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Menu size={18} />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Connection Status */}
          {!sidebarCollapsed && (
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    connected 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25' 
                      : 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25'
                  }`}>
                    {connected ? (
                      <Wifi size={18} className="text-white" />
                    ) : (
                      <WifiOff size={18} className="text-white" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${connected ? 'text-green-400' : 'text-red-400'}`}>
                      {connected ? 'System Online' : 'System Offline'}
                    </div>
                    <div className="text-white/60 text-xs">
                      {connected ? 'All systems operational' : 'Connection lost'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  {connected && (
                    <div className="text-xs text-green-400 font-medium">
                      Live
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {stats && !sidebarCollapsed && (
            <div className="px-6 py-4 border-b border-white/10">
              <div className="space-y-3">
                <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">System Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-3 rounded-xl border border-blue-500/20">
                    <div className="text-blue-400 font-bold text-lg">{stats.totalUsers || 0}</div>
                    <div className="text-white/60 text-xs">Users</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-3 rounded-xl border border-orange-500/20">
                    <div className="text-orange-400 font-bold text-lg">{stats.pendingReports || 0}</div>
                    <div className="text-white/60 text-xs">Reports</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {categories.map((category) => {
              const categoryItems = navigation.filter(item => item.category === category);
              
              return (
                <div key={category} className={sidebarCollapsed ? 'space-y-2' : 'space-y-2 mb-6'}>
                  {!sidebarCollapsed && (
                    <div className="px-3 py-1">
                      <h3 className="text-white/40 font-semibold text-xs uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>
                  )}
                  
                  {categoryItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const hasNotification = item.badge && item.badge > 0;
                    const isUrgent = item.urgent;
                    
                    return (
                      <div key={item.name} className="relative group">
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 relative overflow-hidden group
                            ${active 
                              ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                              : 'text-white/60 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 hover:border hover:border-white/10'
                            }
                            ${sidebarCollapsed ? 'justify-center' : ''}
                          `}
                        >
                          {/* Active indicator */}
                          {active && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-r-full"></div>
                          )}
                          
                          {/* Icon container */}
                          <div className={`
                            relative flex items-center justify-center transition-all duration-300
                            ${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                            ${active ? 'text-cyan-400' : 'group-hover:text-white group-hover:scale-110'}
                          `}>
                            <Icon size={sidebarCollapsed ? 22 : 18} />
                            
                            {/* Notification badge */}
                            {hasNotification && (
                              <div className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] ${
                                isUrgent ? 'bg-red-500' : 'bg-cyan-500'
                              } rounded-full flex items-center justify-center border-2 border-black`}>
                                <span className="text-white text-xs font-bold leading-none px-1">
                                  {item.badge > 99 ? '99+' : item.badge}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Text label */}
                          {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-white/40 truncate">{item.description}</div>
                            </div>
                          )}
                          
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        </Link>
                        
                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-white/60">{item.description}</div>
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-black/90"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Crown size={14} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <Crown size={12} className="text-white" />
                    </div>
                    <div className="text-white font-semibold text-sm">ValorantGuides</div>
                  </div>
                  <div className="text-xs text-white/40">Admin Console v2.0</div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/60 hover:text-white text-xs"
                  >
                    <Command size={12} />
                    <span>⌘K</span>
                  </button>
                  
                  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Error display */}
            {error && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-xs text-red-300 backdrop-blur-sm">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <AlertTriangle size={12} className="text-red-400" />
                  {!sidebarCollapsed && <span className="font-medium">System Alert</span>}
                </div>
                {!sidebarCollapsed && (
                  <div className="text-center opacity-80">{error}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-500 ease-out ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'} relative z-10`}>
        {/* Top Header */}
        <header className="bg-black/20 backdrop-blur-2xl border-b border-white/10 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {getCurrentPageName()}
                </h1>
                <p className="text-sm text-white/60">
                  Manage your ValorantGuides platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 text-white/60 hover:text-white"
              >
                <Search size={16} />
                <span className="text-sm">Search...</span>
                <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-0.5 rounded-md">
                  <Command size={10} />
                  <span>K</span>
                </div>
              </button>

              {/* Live indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>

              {/* 🔔 Enhanced Notifications Dropdown */}
              <NotificationDropdown />

              {/* Admin Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative">
                    {currentAdminUser?.avatar ? (
                      <img 
                        src={currentAdminUser.avatar} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {currentAdminUser?.name?.charAt(0).toUpperCase() || 
                         currentAdminUser?.username?.charAt(0).toUpperCase() || 
                         currentAdminUser?.email?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-left">
                    <div className="text-white font-medium text-sm">
                      {currentAdminUser?.name || currentAdminUser?.username || 'Administrator'}
                    </div>
                    <div className="text-white/60 text-xs flex items-center gap-1">
                      <span className="text-blue-400">🔧</span>
                      DEVELOPER
                    </div>
                  </div>
                  
                  <ChevronDown 
                    size={16} 
                    className={`text-white/60 transition-transform duration-200 hidden md:block ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                          {currentAdminUser?.avatar ? (
                            <img 
                              src={currentAdminUser.avatar} 
                              alt="Avatar" 
                              className="w-16 h-16 rounded-2xl object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-xl">
                              {currentAdminUser?.name?.charAt(0).toUpperCase() || 
                               currentAdminUser?.username?.charAt(0).toUpperCase() || 
                               currentAdminUser?.email?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="text-white font-bold text-lg">
                            {currentAdminUser?.name || currentAdminUser?.username || 'Administrator'}
                          </div>
                          <div className="text-white/60 text-sm mb-2">
                            {currentAdminUser?.email || 'admin@valoclass.com'}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                              <span className="text-blue-400">🔧</span>
                              <span className="text-blue-400 text-xs font-medium">
                                DEVELOPER
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-green-400 text-xs font-medium">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-6 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={18} />
                        <div>
                          <div className="font-medium">Profile</div>
                          <div className="text-xs text-white/40">View and edit your profile</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-6 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings2 size={18} />
                        <div>
                          <div className="font-medium">Admin Settings</div>
                          <div className="text-xs text-white/40">System configuration</div>
                        </div>
                      </Link>
                      
                      <hr className="border-white/10 my-2" />
                      
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <LogOut size={18} />
                        <div className="text-left">
                          <div className="font-medium">Logout</div>
                          <div className="text-xs text-red-400/60">Sign out of admin panel</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                      <div className="text-center text-xs text-white/40">
                        Logged in as admin • {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <div className="bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Command size={20} className="text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search commands, pages, users..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCommandPaletteOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-all duration-200 text-white/80 hover:text-white"
                    >
                      <Icon size={18} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-white/40">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main AdminLayout with Socket Provider
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AdminSocketProvider>
      <AdminLayoutComponent>
        {children}
      </AdminLayoutComponent>
    </AdminSocketProvider>
  );
};

export default AdminLayout;