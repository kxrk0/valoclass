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
  WifiOff
} from 'lucide-react';
import { useAdminSocket } from '@/contexts/AdminSocketContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const { connected, stats, adminUser, error } = useAdminSocket();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Content Moderation', href: '/admin/moderation', icon: Shield },
    { name: 'Reports', href: '/admin/reports', icon: AlertTriangle },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Activity Monitor', href: '/admin/activity', icon: Activity },
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
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0F1419] via-[#1A1D2E] to-[#242738] transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-gradient-to-b border-gray-700/30 backdrop-blur-xl shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{
        background: 'linear-gradient(180deg, rgba(15,20,25,0.95) 0%, rgba(26,29,46,0.98) 50%, rgba(36,39,56,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(107,114,128,0.2)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.3)'
      }}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700/50" style={{
          background: 'linear-gradient(135deg, rgba(255,70,84,0.1) 0%, rgba(255,107,122,0.1) 100%)',
          borderBottom: '1px solid rgba(107,114,128,0.3)'
        }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4654] via-[#FF6B7A] to-[#FF8A9B] rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={22} className="text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0F1419] animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-white font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text">ValoClass</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Admin Panel</span>
                <div className="w-1 h-1 bg-[#FF6B7A] rounded-full"></div>
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Connection Status */}
        <div className="px-6 py-4 border-b border-gray-700/50" style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(59,130,246,0.05) 100%)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {connected ? (
                <>
                  <div className="relative">
                    <Wifi size={18} className="text-green-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <div className="text-green-400 font-semibold text-sm">Connected</div>
                    <div className="text-xs text-gray-400">Real-time active</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <WifiOff size={18} className="text-red-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold text-sm">Disconnected</div>
                    <div className="text-xs text-gray-400">Reconnecting...</div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Status</span>
            </div>
          </div>
          {adminUser && (
            <div className="mt-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {adminUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{adminUser.username}</div>
                  <div className="text-xs text-gray-400">Administrator</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="px-6 py-4 border-b border-gray-700/50" style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.03) 0%, rgba(168,85,247,0.03) 100%)'
          }}>
            <div className="mb-3">
              <h3 className="text-white font-semibold text-sm mb-1">Live Statistics</h3>
              <p className="text-xs text-gray-400">Real-time platform metrics</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/30 p-3 rounded-lg border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={12} className="text-blue-400" />
                  <div className="text-blue-400 font-bold text-sm">{stats.totalUsers}</div>
                </div>
                <div className="text-gray-300 font-medium">Users</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 p-3 rounded-lg border border-yellow-500/20 hover:border-yellow-400/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <Crosshair size={12} className="text-yellow-400" />
                  <div className="text-yellow-400 font-bold text-sm">{stats.totalCrosshairs}</div>
                </div>
                <div className="text-gray-300 font-medium">Crosshairs</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-green-700/30 p-3 rounded-lg border border-green-500/20 hover:border-green-400/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={12} className="text-green-400" />
                  <div className="text-green-400 font-bold text-sm">{stats.totalLineups}</div>
                </div>
                <div className="text-gray-300 font-medium">Lineups</div>
              </div>
              <div className="bg-gradient-to-br from-red-600/20 to-red-700/30 p-3 rounded-lg border border-red-500/20 hover:border-red-400/30 transition-all duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} className="text-red-400" />
                  <div className="text-red-400 font-bold text-sm">{stats.pendingReports}</div>
                </div>
                <div className="text-gray-300 font-medium">Reports</div>
                {stats.pendingReports > 0 && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mt-1"></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Navigation</h4>
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
                  ${active
                    ? 'bg-gradient-to-r from-[#FF4654] to-[#FF6B7A] text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 hover:text-white hover:transform hover:scale-[1.01]'
                  }
                `}
                style={active ? {
                  boxShadow: '0 8px 25px rgba(255,70,84,0.3), 0 4px 10px rgba(0,0,0,0.3)'
                } : {}}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                )}
                <div className={`
                  p-2 rounded-lg transition-all duration-300 relative z-10
                  ${active 
                    ? 'bg-white/20 shadow-inner' 
                    : 'bg-gray-700/30 group-hover:bg-gray-600/50'
                  }
                `}>
                  <Icon size={18} className={active ? 'text-white drop-shadow-sm' : 'text-gray-400 group-hover:text-white'} />
                </div>
                <span className="relative z-10 tracking-wide">{item.name}</span>
                
                {/* Badge for notifications */}
                {item.name === 'Reports' && stats?.pendingReports > 0 && (
                  <div className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg animate-pulse relative z-10">
                    {stats.pendingReports}
                  </div>
                )}
                
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                )}
                
                {/* Hover glow effect */}
                {!active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50" style={{
          background: 'linear-gradient(135deg, rgba(15,20,25,0.8) 0%, rgba(26,29,46,0.9) 100%)'
        }}>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-[#FF4654] to-[#FF6B7A] rounded-lg flex items-center justify-center">
                <Shield size={12} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">ValoClass Admin</div>
                <div className="text-xs text-gray-400">v1.0.0</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              © 2024 ValoClass. All rights reserved.
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-gradient-to-r from-red-900/60 to-red-800/60 border border-red-600/50 rounded-lg text-xs text-red-200 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="font-medium">Error:</span>
              </div>
              <div className="mt-1">{error}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
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
                  {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
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
