import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
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
  Activity
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'System Status - Admin Dashboard',
  description: 'Monitor system health and performance metrics',
  robots: { index: false, follow: false }
}

function SystemPage() {
  const [refreshing, setRefreshing] = React.useState(false);

  const systemMetrics = {
    server: {
      status: 'operational',
      uptime: '15 days, 7 hours',
      load: [1.2, 1.8, 2.1], // 1m, 5m, 15m
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
      { name: 'API Server', status: 'running', port: 8000, uptime: '15 days' },
      { name: 'WebSocket Server', status: 'running', port: 8001, uptime: '15 days' },
      { name: 'Redis Cache', status: 'running', port: 6379, uptime: '15 days' },
      { name: 'Email Service', status: 'running', port: 587, uptime: '15 days' },
      { name: 'File Storage', status: 'running', port: 9000, uptime: '15 days' },
      { name: 'Background Jobs', status: 'warning', port: null, uptime: '2 hours' }
    ],
    network: {
      inbound: 1.2, // MB/s
      outbound: 0.8, // MB/s
      latency: '12ms',
      requests: 1847
    },
    security: {
      firewallStatus: 'active',
      sslStatus: 'valid',
      sslExpiry: '89 days',
      lastScan: '6 hours ago',
      threats: 0
    }
  };

  const refreshMetrics = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
      case 'running':
      case 'active':
      case 'valid':
        return { bg: 'bg-green-600', text: 'text-green-400', icon: CheckCircle };
      case 'warning':
        return { bg: 'bg-yellow-600', text: 'text-yellow-400', icon: AlertTriangle };
      case 'error':
      case 'down':
        return { bg: 'bg-red-600', text: 'text-red-400', icon: XCircle };
      default:
        return { bg: 'bg-gray-600', text: 'text-gray-400', icon: Info };
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, progress }: any) => (
    <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
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
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Database size={28} />
            System Status
          </h1>
          <p className="text-gray-400">Monitor system health and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={refreshMetrics}
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
          subtitle={`Uptime: ${systemMetrics.server.uptime}`}
          icon={Server}
          color="bg-green-600"
        />
        <MetricCard
          title="CPU Usage"
          value={`${systemMetrics.server.cpu.usage}%`}
          subtitle={`${systemMetrics.server.cpu.cores} cores`}
          icon={Cpu}
          color="bg-blue-600"
          progress={systemMetrics.server.cpu.usage}
        />
        <MetricCard
          title="Memory Usage"
          value={`${systemMetrics.server.memory.used}GB`}
          subtitle={`of ${systemMetrics.server.memory.total}GB`}
          icon={MemoryStick}
          color="bg-purple-600"
          progress={systemMetrics.server.memory.usage}
        />
        <MetricCard
          title="Disk Usage"
          value={`${systemMetrics.server.disk.used}GB`}
          subtitle={`of ${systemMetrics.server.disk.total}GB`}
          icon={HardDrive}
          color="bg-yellow-600"
          progress={systemMetrics.server.disk.usage}
        />
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] p-6 rounded-xl border border-gray-600/50">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity size={20} />
            Services Status
          </h3>
          <div className="space-y-4">
            {systemMetrics.services.map((service, index) => {
              const statusColors = getStatusColor(service.status);
              const StatusIcon = statusColors.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${statusColors.bg} rounded-full`}></div>
                    <div>
                      <div className="text-white font-medium">{service.name}</div>
                      <div className="text-xs text-gray-400">
                        {service.port && `Port: ${service.port} • `}Uptime: {service.uptime}
                      </div>
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

        {/* Database Status */}
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
                {systemMetrics.database.connections}/{systemMetrics.database.maxConnections}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Query Time</span>
              <span className="text-white font-medium">{systemMetrics.database.queryTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database Size</span>
              <span className="text-white font-medium">{systemMetrics.database.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Backup</span>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-white font-medium">{systemMetrics.database.lastBackup}</span>
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
                <div className="text-white font-bold text-lg">{systemMetrics.network.inbound} MB/s</div>
                <div className="text-gray-400 text-sm">Inbound</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Upload size={24} className="text-green-400 mx-auto mb-2" />
                <div className="text-white font-bold text-lg">{systemMetrics.network.outbound} MB/s</div>
                <div className="text-gray-400 text-sm">Outbound</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Latency</span>
                <span className="text-white font-medium">{systemMetrics.network.latency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Requests (last hour)</span>
                <span className="text-white font-medium">{systemMetrics.network.requests.toLocaleString()}</span>
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
                <span className="font-medium capitalize">{systemMetrics.security.firewallStatus}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">SSL Certificate</span>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={16} />
                <span className="font-medium capitalize">{systemMetrics.security.sslStatus}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">SSL Expiry</span>
              <span className="text-white font-medium">{systemMetrics.security.sslExpiry}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Security Scan</span>
              <span className="text-white font-medium">{systemMetrics.security.lastScan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Threats</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">{systemMetrics.security.threats}</span>
              </div>
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
          {systemMetrics.server.load.map((load, index) => {
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
            <RefreshCw size={20} />
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
}

// Add React import
import * as React from 'react';

export default function AdminSystemPage() {
  return (
    <NotificationProvider>
      <AdminSocketProvider>
        <AdminLayout>
          <SystemPage />
        </AdminLayout>
      </AdminSocketProvider>
    </NotificationProvider>
  )
}
