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

interface NavigationCategory {
  name: string;
  icon: any;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
  }[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Core']); // Dashboard açık başlasın
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const { connected, stats, adminUser, error } = useAdminSocket();

  const navigationCategories: NavigationCategory[] = [
    {
      name: 'Core',
      icon: Home,
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
      ]
    },
    {
      name: 'Management',
      icon: Users,
      items: [
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Reports', href: '/admin/reports', icon: AlertTriangle, badge: stats?.pendingReports > 0 ? stats.pendingReports.toString() : undefined },
        { name: 'Activity', href: '/admin/activity', icon: Activity },
      ]
    },
    {
      name: 'Content',
      icon: Layers,
      items: [
        { name: 'Moderation', href: '/admin/moderation', icon: Shield },
        { name: 'Crosshairs', href: '/admin/crosshairs', icon: Crosshair },
        { name: 'Lineups', href: '/admin/lineups', icon: Target },
        { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
      ]
    },
    {
      name: 'System',
      icon: Wrench,
      items: [
        { name: 'System', href: '/admin/system', icon: Database },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const getCurrentPageName = () => {
    for (const category of navigationCategories) {
      const item = category.items.find(item => isActive(item.href));
      if (item) return item.name;
    }
    return 'Admin Panel';
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
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0F1419] via-[#1A1D2E] to-[#242738] transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-gradient-to-b border-gray-700/30 backdrop-blur-xl shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{
        background: 'linear-gradient(180deg, rgba(15,20,25,0.95) 0%, rgba(26,29,46,0.98) 50%, rgba(36,39,56,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(107,114,128,0.2)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.3)'
      }}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700/50" style={{
          background: 'linear-gradient(135deg, rgba(255,70,84,0.1) 0%, rgba(255,107,122,0.1) 100%)',
          borderBottom: '1px solid rgba(107,114,128,0.3)'
        }}>
          <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF4654] via-[#FF6B7A] to-[#FF8A9B] rounded-lg flex items-center justify-center shadow-lg">
                  <Shield size={18} className="text-white drop-shadow-sm" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F1419] animate-pulse"></div>
              </div>
              <div className="space-y-0.5">
                <h1 className="text-white font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text">ValoClass</h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Admin Panel</span>
                  <div className="w-0.5 h-0.5 bg-[#FF6B7A] rounded-full"></div>
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
          <div className="px-4 py-3 border-b border-gray-700/50" style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.03) 0%, rgba(168,85,247,0.03) 100%)'
          }}>
            <div className="mb-2">
              <h3 className="text-white font-medium text-xs">Live Statistics</h3>
              <p className="text-xs text-gray-400">Platform metrics</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/30 p-2 rounded-md border border-blue-500/20">
                <div className="flex items-center gap-1">
                  <Users size={10} className="text-blue-400" />
                  <div className="text-blue-400 font-bold text-xs">{stats.totalUsers}</div>
                </div>
                <div className="text-gray-300 text-xs">Users</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 p-2 rounded-md border border-yellow-500/20">
                <div className="flex items-center gap-1">
                  <Crosshair size={10} className="text-yellow-400" />
                  <div className="text-yellow-400 font-bold text-xs">{stats.totalCrosshairs}</div>
                </div>
                <div className="text-gray-300 text-xs">Crosshairs</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-green-700/30 p-2 rounded-md border border-green-500/20">
                <div className="flex items-center gap-1">
                  <Target size={10} className="text-green-400" />
                  <div className="text-green-400 font-bold text-xs">{stats.totalLineups}</div>
                </div>
                <div className="text-gray-300 text-xs">Lineups</div>
              </div>
              <div className="bg-gradient-to-br from-red-600/20 to-red-700/30 p-2 rounded-md border border-red-500/20">
                <div className="flex items-center gap-1">
                  <AlertTriangle size={10} className="text-red-400" />
                  <div className="text-red-400 font-bold text-xs">{stats.pendingReports}</div>
                  {stats.pendingReports > 0 && (
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-gray-300 text-xs">Reports</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Navigation</h4>
          </div>
          
          {navigationCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategories.includes(category.name);
            const hasActiveItem = category.items.some(item => isActive(item.href));
            
            return (
              <div key={category.name} className="space-y-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${hasActiveItem || isExpanded
                      ? 'bg-gradient-to-r from-[#FF4654]/20 to-[#FF6B7A]/10 text-white border border-[#FF4654]/30' 
                      : 'text-gray-300 hover:bg-gray-700/40 hover:text-white'
                    }
                  `}
                >
                  <div className={`p-1.5 rounded-md transition-all duration-200
                    ${hasActiveItem || isExpanded
                      ? 'bg-[#FF4654]/30 text-white' 
                      : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-white'
                    }
                  `}>
                    <CategoryIcon size={14} />
                  </div>
                  <span className="flex-1 text-left text-xs font-semibold tracking-wide uppercase">{category.name}</span>
                  <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="space-y-0.5 pl-2 animate-in slide-in-from-top-2 duration-200">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 group relative
                            ${active
                              ? 'bg-gradient-to-r from-[#FF4654] to-[#FF6B7A] text-white shadow-md' 
                              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }
                          `}
                        >
                          <div className={`p-1 rounded transition-all duration-200
                            ${active 
                              ? 'bg-white/20' 
                              : 'bg-gray-700/30 group-hover:bg-gray-600/50'
                            }
                          `}>
                            <Icon size={14} className={active ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                          </div>
                          <span className="flex-1 font-medium">{item.name}</span>
                          
                          {/* Badge */}
                          {item.badge && (
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                              {item.badge}
                            </div>
                          )}
                          
                          {/* Active indicator */}
                          {active && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-sm shadow-sm"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50" style={{
          background: 'linear-gradient(135deg, rgba(15,20,25,0.8) 0%, rgba(26,29,46,0.9) 100%)'
        }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-5 h-5 bg-gradient-to-r from-[#FF4654] to-[#FF6B7A] rounded-md flex items-center justify-center">
                <Shield size={10} className="text-white" />
              </div>
              <div className="text-white font-medium text-sm">ValoClass</div>
            </div>
            <div className="text-xs text-gray-500">Admin Panel v1.0</div>
          </div>
          {error && (
            <div className="mt-3 p-2 bg-gradient-to-r from-red-900/60 to-red-800/60 border border-red-600/50 rounded-md text-xs text-red-200 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-red-400" />
                <span className="font-medium">Error:</span>
              </div>
              <div className="mt-1 text-xs opacity-80">{error}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
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
