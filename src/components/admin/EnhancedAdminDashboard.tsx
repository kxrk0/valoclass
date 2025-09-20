'use client'

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  Crosshair, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Zap,
  ArrowUp,
  ArrowDown,
  BarChart3
} from 'lucide-react';
import { useAdminSocket } from '@/contexts/AdminSocketContext';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface ActivityItem {
  id: string;
  type: string;
  user: string;
  action: string;
  timestamp: string;
  icon: any;
  color: string;
}

const EnhancedAdminDashboard: React.FC = () => {
  const { stats, connected } = useAdminSocket();
  const [isClientMounted, setIsClientMounted] = useState(false);
  
  // Fallback stats when WebSocket is not connected - use static timestamp to prevent hydration mismatch
  const fallbackStats = {
    totalUsers: 1248,
    totalLineups: 342,
    totalCrosshairs: 156,
    pendingReports: 3,
    timestamp: '2025-01-01T12:00:00.000Z' // Static timestamp to prevent hydration mismatch
  };
  
  const displayStats = stats || fallbackStats;
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [previousStats, setPreviousStats] = useState<any>(null);
  const [statsTrends, setStatsTrends] = useState<any>({});

  // Mock recent activity data - bu gerçekte WebSocket'ten gelecek
  useEffect(() => {
    const mockActivity = [
      {
        id: '1',
        type: 'user_signup',
        user: 'ProGamer123',
        action: 'Registered new account',
        timestamp: '2 minutes ago',
        icon: Users,
        color: 'text-green-400'
      },
      {
        id: '2',
        type: 'content_created',
        user: 'ValoPlayer',
        action: 'Created lineup "Viper Split B Site"',
        timestamp: '5 minutes ago',
        icon: Target,
        color: 'text-blue-400'
      },
      {
        id: '3',
        type: 'report_submitted',
        user: 'ModUser',
        action: 'Reported inappropriate content',
        timestamp: '8 minutes ago',
        icon: AlertTriangle,
        color: 'text-red-400'
      },
      {
        id: '4',
        type: 'crosshair_shared',
        user: 'DesignMaster',
        action: 'Shared new crosshair design',
        timestamp: '12 minutes ago',
        icon: Crosshair,
        color: 'text-yellow-400'
      },
      {
        id: '5',
        type: 'comment_posted',
        user: 'FeedbackUser',
        action: 'Posted comment on lineup',
        timestamp: '15 minutes ago',
        icon: MessageSquare,
        color: 'text-purple-400'
      }
    ];
    setRecentActivity(mockActivity);
  }, []);

  // Track client mount to prevent hydration mismatch
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Calculate trends when stats change
  useEffect(() => {
    if (displayStats && previousStats) {
      const trends = {
        users: displayStats.totalUsers - previousStats.totalUsers,
        lineups: displayStats.totalLineups - previousStats.totalLineups,
        crosshairs: displayStats.totalCrosshairs - previousStats.totalCrosshairs,
        reports: displayStats.pendingReports - previousStats.pendingReports
      };
      setStatsTrends(trends);
      
      // Show notification if significant changes
      if (Math.abs(trends.users) > 10 || Math.abs(trends.reports) > 5) {
        console.log('📊 Significant stats change detected:', trends);
      }
    }
  }, [displayStats]); // Remove previousStats from dependencies to break the loop

  // Store current stats as previous for next comparison (separate effect)
  useEffect(() => {
    if (displayStats && displayStats !== previousStats) {
      const timeoutId = setTimeout(() => {
        setPreviousStats(displayStats);
      }, 1000); // Delay to allow animation
      
      return () => clearTimeout(timeoutId);
    }
  }, [displayStats]);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: any;
    color: string;
    trend?: number;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group relative overflow-hidden">
      {/* Animated background glow */}
      <div className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Pulse animation for live updates */}
      {trend !== undefined && trend !== 0 && (
        <div className={`absolute top-2 right-2 w-2 h-2 ${trend > 0 ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse`}></div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative`}>
            <Icon size={24} className="text-white" />
            {/* Spinning ring animation for active stats */}
            {connected && (
              <div className={`absolute inset-0 rounded-full border-2 ${color.replace('bg-', 'border-')} border-t-transparent animate-spin opacity-20`}></div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1 font-mono transition-all duration-500">
              {value.toLocaleString()}
            </div>
            {trend !== undefined && trend !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'} animate-bounce`}>
                {trend > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>{Math.abs(trend)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">{title}</div>
          {subtitle && (
            <div className="text-xs text-green-400 animate-pulse">
              {subtitle}
            </div>
          )}
        </div>
        {/* Enhanced animated progress bar */}
        <div className="mt-3 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-1 rounded-full bg-gradient-to-r ${color.replace('bg-', 'from-')} ${color.replace('bg-', 'to-').replace('600', '400')} transition-all duration-1000 relative`}
            style={{ width: `${Math.min(100, (value / 1000) * 100)}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show dashboard even if WebSocket is not connected (with fallback data)
  const shouldShowLoadingOverlay = false; // Disable loading overlay for now
  
  if (shouldShowLoadingOverlay && !connected) {
    return <LoadingOverlay message="Connecting to admin server..." type="admin" />;
  }

  return (
    <div className="space-y-8">
      {/* Header with live indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-white mb-2 flex items-center gap-3">
            Admin Dashboard
            <div className="flex items-center gap-2 text-sm font-normal">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Live</span>
            </div>
          </h1>
          <p className="text-gray-400">Real-time monitoring and management</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="text-gray-400">Last updated</div>
              <div className="text-white">
                {isClientMounted && displayStats 
                  ? new Date(displayStats.timestamp).toLocaleTimeString() 
                  : 'Loading...'
                }
              </div>
            </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={displayStats?.totalUsers || 0}
          icon={Users}
          color="bg-blue-600"
          trend={statsTrends.users}
          subtitle="+12 today"
        />
        <StatCard
          title="Lineups"
          value={displayStats?.totalLineups || 0}
          icon={Target}
          color="bg-green-600"
          trend={statsTrends.lineups}
          subtitle="+24 today"
        />
        <StatCard
          title="Crosshairs"
          value={displayStats?.totalCrosshairs || 0}
          icon={Crosshair}
          color="bg-yellow-600"
          trend={statsTrends.crosshairs}
          subtitle="+8 today"
        />
        <StatCard
          title="Pending Reports"
          value={displayStats?.pendingReports || 0}
          icon={AlertTriangle}
          color="bg-red-600"
          trend={statsTrends.reports}
        />
      </div>

      {/* Real-time Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-xl text-white flex items-center gap-2">
              <Activity size={20} />
              Live Activity Feed
            </h2>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <Zap size={16} className="animate-pulse" />
              Real-time
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ${activity.color} flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                      <Clock size={12} />
                      {activity.timestamp}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    #{activity.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">WebSocket</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
            <h3 className="font-semibold text-lg text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
                <Users size={16} />
                User Management
              </button>
              <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
                <AlertTriangle size={16} />
                Review Reports ({displayStats?.pendingReports || 0})
              </button>
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">
                <Eye size={16} />
                Content Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <h2 className="font-semibold text-xl text-white mb-6 flex items-center gap-2">
          <BarChart3 size={20} />
          Community Engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">1,234</div>
            <div className="text-sm text-gray-400 mb-2">Daily Active Users</div>
            <div className="text-xs text-green-400">+12% from yesterday</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">456</div>
            <div className="text-sm text-gray-400 mb-2">Content Views</div>
            <div className="text-xs text-green-400">+8% from yesterday</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">78</div>
            <div className="text-sm text-gray-400 mb-2">New Submissions</div>
            <div className="text-xs text-green-400">+15% from yesterday</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">234</div>
            <div className="text-sm text-gray-400 mb-2">Community Interactions</div>
            <div className="text-xs text-green-400">+5% from yesterday</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
