'use client'

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Shield,
  Clock,
  Zap,
  Globe,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  Star,
  Crown,
  Award,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Filter,
  Search,
  Calendar,
  MapPin,
  Flag,
  Settings
} from 'lucide-react';
import { useAdminSocket } from '@/contexts/AdminSocketContext';
import Link from 'next/link';

const EnhancedAdminDashboard: React.FC = () => {
  const { connected, stats, adminUser } = useAdminSocket();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'monitoring'>('overview');

  // Mock real-time data
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 234,
    serverLoad: 45,
    memoryUsage: 67,
    responseTime: 142,
    errorRate: 0.02,
    bandwidth: 89.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10 - 5))),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + Math.floor(Math.random() * 6 - 3))),
        responseTime: Math.max(80, Math.min(200, prev.responseTime + Math.floor(Math.random() * 20 - 10))),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() * 0.02 - 0.01))),
        bandwidth: Math.max(50, Math.min(100, prev.bandwidth + Math.floor(Math.random() * 10 - 5)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    description,
    trend = 'up',
    href,
    urgent = false
  }: any) => (
    <Link href={href || '#'} className="block group">
      <div className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl backdrop-blur-sm
        ${urgent 
          ? 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-red-500/30 shadow-lg shadow-red-500/10' 
          : `bg-gradient-to-br ${color} border-white/10 shadow-lg`
        }
      `}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
              ${urgent 
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25' 
                : `bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${color.includes('blue') ? 'shadow-blue-500/25' : color.includes('green') ? 'shadow-green-500/25' : color.includes('purple') ? 'shadow-purple-500/25' : 'shadow-orange-500/25'}`
              }
            `}>
            <Icon size={24} className="text-white" />
          </div>
            
            {change && (
              <div className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                ${trend === 'up' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }
              `}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
              {value}
        </div>
            <div className="text-white/60 font-medium text-sm">{title}</div>
            {description && (
              <div className="text-white/40 text-xs">{description}</div>
          )}
        </div>
          
          {/* Hover arrow */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <ChevronRight size={16} className="text-white/60" />
          </div>
        </div>
      </div>
    </Link>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, href, badge }: any) => (
    <Link href={href} className="block group">
      <div className={`
        relative overflow-hidden rounded-xl border border-white/10 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20 backdrop-blur-sm
        bg-gradient-to-br ${color}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon size={20} className="text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium text-sm">{title}</h3>
              {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-white/60 text-xs mt-1">{description}</p>
          </div>
          
          <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {adminUser?.username || 'Administrator'}! 👋
          </h1>
          <p className="text-white/60">Here's what's happening with your ValorantGuides platform today.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-lg">
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  timeRange === range 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 backdrop-blur-sm border border-blue-400/20"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
            </div>
        </div>

      {/* System Status Banner */}
      <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 shadow-lg shadow-green-500/10">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">All Systems Operational</h3>
              <p className="text-green-400 text-sm">ValorantGuides is running smoothly with 99.9% uptime</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-white font-bold">{realtimeData.activeUsers}</div>
              <div className="text-white/60">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold">{realtimeData.serverLoad}%</div>
              <div className="text-white/60">Server Load</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold">{realtimeData.responseTime}ms</div>
              <div className="text-white/60">Response Time</div>
              </div>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="12,547"
          change="+12.5%"
          icon={Users}
          color="from-blue-500/20 via-blue-500/10 to-transparent"
          description="Active community members"
          href="/admin/users"
        />
        
        <StatCard
          title="Pending Reports"
          value={stats?.pendingReports ?? 0}
          change="+3"
          icon={AlertTriangle}
          color="from-orange-500/20 via-orange-500/10 to-transparent"
          description="Requiring immediate attention"
          trend="down"
          urgent={(stats?.pendingReports ?? 0) > 5}
          href="/admin/reports"
        />
        
        <StatCard
          title="Content Created"
          value="1,847"
          change="+8.3%"
          icon={Target}
          color="from-green-500/20 via-green-500/10 to-transparent"
          description="Lineups and crosshairs today"
          href="/admin/moderation"
        />
        
        <StatCard
          title="System Health"
          value="99.9%"
          change="+0.1%"
          icon={Activity}
          color="from-purple-500/20 via-purple-500/10 to-transparent"
          description="Platform uptime"
          href="/admin/system"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Activity */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                <BarChart3 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Real-time Analytics</h3>
                <p className="text-white/60 text-sm">Live user activity and engagement</p>
            </div>
          </div>
            
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live
                    </div>
                  </div>
          
          {/* Mini charts area */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Active Users</span>
                <span className="text-white font-bold">{realtimeData.activeUsers}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(realtimeData.activeUsers / 300) * 100}%` }}
                ></div>
                  </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Engagement Rate</span>
                <span className="text-white font-bold">78.4%</span>
                </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-[78%]"></div>
          </div>
        </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Server Load</span>
                <span className="text-white font-bold">{realtimeData.serverLoad}%</span>
                </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${realtimeData.serverLoad}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Memory Usage</span>
                <span className="text-white font-bold">{realtimeData.memoryUsage}%</span>
                </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${realtimeData.memoryUsage}%` }}
                ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Quick Actions</h3>
                <p className="text-white/60 text-sm">Common admin tasks</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <QuickActionCard
                title="Review Reports"
                description="Check pending user reports"
                icon={AlertTriangle}
                color="from-red-500/10 to-red-500/5"
                href="/admin/reports"
                badge={stats?.pendingReports}
              />
              
              <QuickActionCard
                title="Moderate Content"
                description="Review submitted content"
                icon={Shield}
                color="from-blue-500/10 to-blue-500/5"
                href="/admin/moderation"
              />
              
              <QuickActionCard
                title="User Management"
                description="Manage user accounts"
                icon={Users}
                color="from-green-500/10 to-green-500/5"
                href="/admin/users"
              />
              
              <QuickActionCard
                title="System Settings"
                description="Configure platform"
                icon={Settings}
                color="from-purple-500/10 to-purple-500/5"
                href="/admin/settings"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Recent Activity</h3>
                <p className="text-white/60 text-sm">Latest platform events</p>
              </div>
            </div>
            
            <Link href="/admin/activity" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { user: 'ProGamer123', action: 'created new lineup', time: '2 min ago', type: 'content' },
              { user: 'AdminMod', action: 'approved content', time: '5 min ago', type: 'moderation' },
              { user: 'NewUser456', action: 'registered account', time: '8 min ago', type: 'user' },
              { user: 'ContentCreator', action: 'uploaded crosshair', time: '12 min ago', type: 'content' },
              { user: 'ModeratorX', action: 'resolved report', time: '15 min ago', type: 'moderation' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'content' ? 'bg-blue-400' :
                  activity.type === 'moderation' ? 'bg-green-400' :
                  'bg-purple-400'
                }`}></div>
                <div className="flex-1">
                  <span className="text-white font-medium text-sm">{activity.user}</span>
                  <span className="text-white/60 text-sm"> {activity.action}</span>
                </div>
                <span className="text-white/40 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Server size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">System Performance</h3>
              <p className="text-white/60 text-sm">Real-time metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={16} className="text-blue-400" />
                <span className="text-white/60 text-sm">CPU Usage</span>
              </div>
              <div className="text-white font-bold text-xl">{realtimeData.serverLoad}%</div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                <div 
                  className="bg-blue-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${realtimeData.serverLoad}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive size={16} className="text-green-400" />
                <span className="text-white/60 text-sm">Memory</span>
              </div>
              <div className="text-white font-bold text-xl">{realtimeData.memoryUsage}%</div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                <div 
                  className="bg-green-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${realtimeData.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-purple-400" />
                <span className="text-white/60 text-sm">Bandwidth</span>
              </div>
              <div className="text-white font-bold text-xl">{realtimeData.bandwidth}%</div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                <div 
                  className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${realtimeData.bandwidth}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-yellow-400" />
                <span className="text-white/60 text-sm">Response</span>
          </div>
              <div className="text-white font-bold text-xl">{realtimeData.responseTime}ms</div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                <div 
                  className="bg-yellow-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${(realtimeData.responseTime / 300) * 100}%` }}
                ></div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
