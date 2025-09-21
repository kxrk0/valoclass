'use client'

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  Monitor, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  Wifi,
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Upload,
  Clock,
  Zap,
  Activity,
  Users,
  Globe,
  Settings,
  Terminal,
  FileText,
  Search,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface SystemMetrics {
  server: {
    status: 'operational' | 'warning' | 'error';
    uptime: string;
    load: number[];
    memory: {
      used: number;
      total: number;
      usage: number;
    };
    cpu: {
      usage: number;
      cores: number;
      model: string;
    };
    disk: {
      used: number;
      total: number;
      usage: number;
    };
  };
  database: {
    status: 'healthy' | 'warning' | 'error';
    connections: number;
    maxConnections: number;
    queryTime: string;
    size: string;
    backupStatus: 'completed' | 'running' | 'failed';
    lastBackup: string;
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'warning' | 'error';
    port?: number;
    uptime: string;
    memory?: number;
    cpu?: number;
  }>;
  network: {
    inbound: number;
    outbound: number;
    latency: string;
    requests: number;
    errors: number;
    responseTime: number;
  };
  security: {
    firewallStatus: 'active' | 'inactive' | 'warning';
    sslStatus: 'valid' | 'expired' | 'warning';
    sslExpiry: string;
    lastScan: string;
    threats: number;
    blockedIPs: number;
  };
}

const SystemMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { success, error: showError, warning } = useNotifications();

  // Mock data for demonstration
  const mockMetrics: SystemMetrics = {
    server: {
      status: 'operational',
      uptime: '15 days, 7 hours, 23 minutes',
      load: [1.2, 1.8, 2.1],
      memory: {
        used: 2.4,
        total: 8.0,
        usage: 30
      },
      cpu: {
        usage: 45,
        cores: 4,
        model: 'Intel Xeon E5-2680'
      },
      disk: {
        used: 125,
        total: 500,
        usage: 25
      }
    },
    database: {
      status: 'healthy',
      connections: 23,
      maxConnections: 100,
      queryTime: '12ms',
      size: '2.1GB',
      backupStatus: 'completed',
      lastBackup: '2 hours ago'
    },
    services: [
      { name: 'Next.js Frontend', status: 'running', port: 3000, uptime: '15 days', memory: 156, cpu: 12 },
      { name: 'Express API Server', status: 'running', port: 8000, uptime: '15 days', memory: 89, cpu: 8 },
      { name: 'WebSocket Server', status: 'running', port: 8001, uptime: '15 days', memory: 34, cpu: 3 },
      { name: 'MongoDB Database', status: 'running', port: 27017, uptime: '15 days', memory: 512, cpu: 15 },
      { name: 'Redis Cache', status: 'running', port: 6379, uptime: '15 days', memory: 45, cpu: 2 },
      { name: 'Email Service', status: 'warning', port: 587, uptime: '12 hours', memory: 23, cpu: 1 },
      { name: 'File Storage', status: 'running', port: 9000, uptime: '15 days', memory: 67, cpu: 4 },
      { name: 'Background Jobs', status: 'warning', uptime: '2 hours', memory: 78, cpu: 6 }
    ],
    network: {
      inbound: 1.2,
      outbound: 0.8,
      latency: '12ms',
      requests: 1847,
      errors: 3,
      responseTime: 145
    },
    security: {
      firewallStatus: 'active',
      sslStatus: 'valid',
      sslExpiry: '89 days',
      lastScan: '6 hours ago',
      threats: 0,
      blockedIPs: 234
    }
  };

  // Fetch metrics from API
  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      
      // For now, use mock data
      // In production, this would fetch from /api/admin/system/metrics
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMetrics(mockMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      showError('Error', 'Failed to fetch system metrics');
      setMetrics(mockMetrics); // Fallback to mock data
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh metrics
  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
      case 'running':
      case 'active':
      case 'valid':
      case 'completed':
        return { bg: 'bg-green-600', text: 'text-green-400', icon: CheckCircle };
      case 'warning':
        return { bg: 'bg-yellow-600', text: 'text-yellow-400', icon: AlertTriangle };
      case 'error':
      case 'stopped':
      case 'inactive':
      case 'expired':
      case 'failed':
        return { bg: 'bg-red-600', text: 'text-red-400', icon: XCircle };
      default:
        return { bg: 'bg-gray-600', text: 'text-gray-400', icon: Info };
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, progress, status }: any) => (
    <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
        </div>
      </div>
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      {progress !== undefined && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {status && (
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-2 h-2 ${getStatusColor(status).bg} rounded-full`}></div>
          <span className={`text-sm font-medium ${getStatusColor(status).text}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Monitor size={28} />
            System Monitoring
            <div className="flex items-center gap-2 text-sm font-normal">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Live</span>
            </div>
          </h1>
          <p className="text-gray-400">Real-time system health and performance monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              autoRefresh 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
            Auto Refresh
          </button>
          <button
            onClick={fetchMetrics}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Server Status"
          value="Operational"
          subtitle={`Uptime: ${metrics?.server.uptime}`}
          icon={Server}
          color="bg-green-600"
          status={metrics?.server.status}
        />
        <MetricCard
          title="CPU Usage"
          value={`${metrics?.server.cpu.usage}%`}
          subtitle={`${metrics?.server.cpu.cores} cores`}
          icon={Cpu}
          color="bg-blue-600"
          progress={metrics?.server.cpu.usage}
        />
        <MetricCard
          title="Memory Usage"
          value={`${metrics?.server.memory.used}GB`}
          subtitle={`of ${metrics?.server.memory.total}GB`}
          icon={MemoryStick}
          color="bg-purple-600"
          progress={metrics?.server.memory.usage}
        />
        <MetricCard
          title="Disk Usage"
          value={`${metrics?.server.disk.used}GB`}
          subtitle={`of ${metrics?.server.disk.total}GB`}
          icon={HardDrive}
          color="bg-yellow-600"
          progress={metrics?.server.disk.usage}
        />
      </div>

      {/* Services Status & Database Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Status */}
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity size={20} />
            Services Status
          </h3>
          <div className="space-y-3">
            {metrics?.services.map((service, index) => {
              const statusColors = getStatusColor(service.status);
              const StatusIcon = statusColors.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-all duration-200 cursor-pointer ${
                    selectedService === service.name ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${statusColors.bg} rounded-full`}></div>
                    <div>
                      <div className="text-white font-medium">{service.name}</div>
                      <div className="text-xs text-gray-400">
                        {service.port && `Port: ${service.port} • `}Uptime: {service.uptime}
                      </div>
                      {selectedService === service.name && (
                        <div className="text-xs text-gray-500 mt-1">
                          Memory: {service.memory}MB • CPU: {service.cpu}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${statusColors.text}`}>
                    <StatusIcon size={16} />
                    <span className="text-sm font-medium capitalize">{service.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Health */}
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Database size={20} />
            Database Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status</span>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="font-medium">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Connections</span>
              <span className="text-white font-medium">
                {metrics?.database.connections}/{metrics?.database.maxConnections}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Query Time</span>
              <span className="text-white font-medium">{metrics?.database.queryTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database Size</span>
              <span className="text-white font-medium">{metrics?.database.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Backup</span>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-white font-medium">{metrics?.database.lastBackup}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network Stats */}
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Wifi size={20} />
            Network Activity
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Download size={24} className="text-blue-400 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{metrics?.network.inbound} MB/s</div>
                <div className="text-gray-400 text-sm">Inbound</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Upload size={24} className="text-green-400 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{metrics?.network.outbound} MB/s</div>
                <div className="text-gray-400 text-sm">Outbound</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Latency</span>
                <span className="text-white font-medium">{metrics?.network.latency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Requests (last hour)</span>
                <span className="text-white font-medium">{metrics?.network.requests.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Response Time</span>
                <span className="text-white font-medium">{metrics?.network.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Errors</span>
                <span className={`font-medium ${metrics?.network.errors && metrics.network.errors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {metrics?.network.errors}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield size={20} />
            Security Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Firewall</span>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="font-medium capitalize">{metrics?.security.firewallStatus}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">SSL Certificate</span>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="font-medium capitalize">{metrics?.security.sslStatus}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">SSL Expiry</span>
              <span className="text-white font-medium">{metrics?.security.sslExpiry}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Security Scan</span>
              <span className="text-white font-medium">{metrics?.security.lastScan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Threats</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">{metrics?.security.threats}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Blocked IPs</span>
              <span className="text-white font-medium">{metrics?.security.blockedIPs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Load Chart */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Monitor size={20} />
          System Load Average
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {metrics?.server.load.map((load, index) => {
            const periods = ['1 minute', '5 minutes', '15 minutes'];
            const colors = ['from-green-500 to-green-600', 'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600'];
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${colors[index]} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold text-lg">{load}</span>
                </div>
                <div className="text-white font-medium">{periods[index]}</div>
                <div className="text-gray-400 text-sm">Load Average</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Zap size={20} />
          System Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
            <Database size={20} />
            <div>
              <div className="font-semibold">Backup Database</div>
              <div className="text-sm opacity-90">Create manual backup</div>
            </div>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
            <RotateCcw size={20} />
            <div>
              <div className="font-semibold">Restart Services</div>
              <div className="text-sm opacity-90">Restart all services</div>
            </div>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
            <Shield size={20} />
            <div>
              <div className="font-semibold">Security Scan</div>
              <div className="text-sm opacity-90">Run security check</div>
            </div>
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg text-left transition-all duration-200 flex items-center gap-3">
            <HardDrive size={20} />
            <div>
              <div className="font-semibold">Clean Cache</div>
              <div className="text-sm opacity-90">Clear system cache</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
