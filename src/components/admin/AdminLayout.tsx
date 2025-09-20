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
  ChevronDown,
  ChevronRight,
  Layers,
  FileText,
  Wrench
} from 'lucide-react';
import { useAdminSocket } from '@/contexts/AdminSocketContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const { connected, stats, adminUser, error } = useAdminSocket();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: AlertTriangle, badge: stats?.pendingReports },
    { name: 'Activity', href: '/admin/activity', icon: Activity },
    { name: 'Moderation', href: '/admin/moderation', icon: Shield },
    { name: 'Crosshairs', href: '/admin/crosshairs', icon: Crosshair },
    { name: 'Lineups', href: '/admin/lineups', icon: Target },
    { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
    { name: 'System', href: '/admin/system', icon: Database },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

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
    return activeItem?.name || 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#1A1D2E] to-[#242738]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-black/20 backdrop-blur-2xl border-r border-white/10 transform transition-all duration-500 ease-out lg:translate-x-0 shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `} style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '4px 0 40px rgba(0,0,0,0.5)'
      }}>
        <div className={`flex items-center justify-between h-16 px-4 border-b border-white/10 transition-all duration-300 ${
          sidebarCollapsed ? 'justify-center' : ''
        }`} style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Shield size={16} className="text-white/80" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-white font-semibold text-base">ValoClass</h1>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-white/60">Admin</span>
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">Live</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Menu size={16} />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* User & Connection Status */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-white/10" style={{
            background: 'rgba(255,255,255,0.02)'
          }}>
            {adminUser && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {adminUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{adminUser.username}</div>
                  <div className="text-white/60 text-xs">Administrator</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {connected ? (
                  <Wifi size={14} className="text-green-400" />
                ) : (
                  <WifiOff size={14} className="text-red-400" />
                )}
                <span className="text-white/80 text-xs font-medium">
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            </div>
          </div>
        )}

        {/* Quick Stats - Only shown when expanded */}
        {stats && !sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-white/10" style={{
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div className="mb-3">
              <h3 className="text-white font-medium text-xs">Quick Access</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/admin/users"
                className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-white/60 group-hover:text-white transition-colors" />
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{stats.totalUsers}</div>
                    <div className="text-white/50 text-xs">Users</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/admin/reports"
                className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer relative"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-white/60 group-hover:text-white transition-colors" />
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{stats.pendingReports}</div>
                    <div className="text-white/50 text-xs">Reports</div>
                  </div>
                  {stats.pendingReports > 0 && (
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav 
          className={`flex-1 overflow-y-auto py-4 transition-all duration-300 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
          onWheel={(e) => {
            // Enable smooth mousewheel scrolling
            e.currentTarget.scrollBy({
              top: e.deltaY,
              behavior: 'smooth'
            });
          }}
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const hasNotification = item.badge && item.badge > 0;
            
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl mb-1 transition-all duration-300 relative overflow-hidden group
                    ${active 
                      ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {/* Background glow effect for active item */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl"></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`
                    relative z-10 flex items-center justify-center transition-all duration-300
                    ${sidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                  `}>
                    <Icon 
                      size={sidebarCollapsed ? 20 : 18} 
                      className={`transition-all duration-300 ${
                        active 
                          ? 'text-white' 
                          : 'text-white/60 group-hover:text-white group-hover:scale-110'
                      }`} 
                    />
                    
                    {/* Notification badge */}
                    {hasNotification && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold leading-none">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Text label - hidden when collapsed */}
                  {!sidebarCollapsed && (
                    <span className="relative z-10 font-medium text-sm transition-all duration-300">
                      {item.name}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm transition-all duration-300"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </Link>
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-black/90"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-white/10 transition-all duration-300 ${sidebarCollapsed ? 'p-2' : 'p-4'}`} style={{
          background: 'rgba(255,255,255,0.02)'
        }}>
          {sidebarCollapsed ? (
            // Collapsed footer - just logo
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield size={14} className="text-white/60" />
              </div>
            </div>
          ) : (
            // Expanded footer - logo + version
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                  <Shield size={12} className="text-white/60" />
                </div>
                <div className="text-white font-medium text-sm">ValoClass</div>
              </div>
              <div className="text-xs text-white/40">Admin v1.0</div>
            </div>
          )}
          
          {/* Error display - always visible if there's an error */}
          {error && (
            <div className={`mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-300 backdrop-blur-sm ${
              sidebarCollapsed ? 'text-center' : ''
            }`}>
              <div className="flex items-center gap-2 justify-center">
                <AlertTriangle size={12} className="text-red-400" />
                {!sidebarCollapsed && <span className="font-medium">Error</span>}
              </div>
              {!sidebarCollapsed && (
                <div className="mt-1 text-xs opacity-80">{error}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-500 ease-out ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Header */}
        <header className="bg-[#1A1D2E]/80 backdrop-blur-sm border-b border-gray-700 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {getCurrentPageName()}
                </h1>
                <p className="text-sm text-gray-400">
                  Manage your ValoClass community
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Real-time indicator */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">Live</span>
              </div>

              {/* Notifications */}
              <button className="relative text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </button>

              {/* User menu */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF4654] to-[#FF6B7A] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {adminUser?.username.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{adminUser?.username || 'Admin'}</div>
                  <div className="text-gray-400 text-xs">Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
