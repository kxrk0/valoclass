'use client'

import React, { useState, useEffect } from 'react';
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  Globe,
  Mail,
  Database,
  Zap,
  Bell,
  Lock,
  Users,
  FileText,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Server,
  Cloud,
  Key,
  Filter,
  Clock,
  Palette,
  Code,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    defaultUserRole: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    ipWhitelist: string[];
    rateLimitEnabled: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
  };
  content: {
    autoModerationEnabled: boolean;
    profanityFilterEnabled: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    contentApprovalRequired: boolean;
    maxLineupsPerUser: number;
    maxCrosshairsPerUser: number;
  };
  notifications: {
    emailNotificationsEnabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  integrations: {
    discordWebhookUrl: string;
    googleAnalyticsId: string;
    recaptchaSiteKey: string;
    recaptchaSecretKey: string;
    cloudinaryConfig: {
      cloudName: string;
      apiKey: string;
      apiSecret: string;
    };
  };
}

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'content' | 'notifications' | 'integrations'>('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const { success, error: showError, warning } = useNotifications();

  // Fetch current configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }

      const data = await response.json();
      setConfig(data.config);
      
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      // Use mock config for development
      setConfig({
        general: {
          siteName: 'ValoClass',
          siteDescription: 'Premier Valorant guides and community',
          maintenanceMode: false,
          registrationEnabled: true,
          emailVerificationRequired: true,
          defaultUserRole: 'USER'
        },
        security: {
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireTwoFactor: false,
          ipWhitelist: [],
          rateLimitEnabled: true,
          rateLimitRequests: 100,
          rateLimitWindow: 3600
        },
        content: {
          autoModerationEnabled: true,
          profanityFilterEnabled: true,
          maxFileSize: 10,
          allowedFileTypes: ['jpg', 'png', 'gif', 'mp4'],
          contentApprovalRequired: false,
          maxLineupsPerUser: 50,
          maxCrosshairsPerUser: 100
        },
        notifications: {
          emailNotificationsEnabled: true,
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUsername: '',
          smtpPassword: '',
          fromEmail: 'noreply@valoclass.com',
          fromName: 'ValoClass'
        },
        integrations: {
          discordWebhookUrl: '',
          googleAnalyticsId: '',
          recaptchaSiteKey: '',
          recaptchaSecretKey: '',
          cloudinaryConfig: {
            cloudName: '',
            apiKey: '',
            apiSecret: ''
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Save configuration
  const saveConfig = async () => {
    if (!config) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      success('Success', 'Settings saved successfully');
      setUnsavedChanges(false);
      
    } catch (err: any) {
      console.error('Error saving settings:', err);
      showError('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Update config
  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  // Update nested config
  const updateNestedConfig = (section: keyof SystemConfig, parentKey: string, key: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [parentKey]: {
          ...(prev![section] as any)[parentKey],
          [key]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw size={32} className="text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading system settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Zap }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Settings size={20} className="text-white" />
            </div>
            System Settings
          </h1>
          <p className="text-white/60">Configure system-wide settings and platform preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          {unsavedChanges && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
              <AlertTriangle size={16} />
              <span>Unsaved changes</span>
            </div>
          )}
          
          <button
            onClick={() => fetchConfig()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl transition-all duration-200 shadow-lg hover:scale-105"
          >
            <RefreshCw size={16} />
            Reset
          </button>
          
          <button
            onClick={saveConfig}
            disabled={saving || !unsavedChanges}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 shadow-lg shadow-green-500/25 hover:scale-105"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gradient-to-br from-white/5 via-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg">
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Site Name</label>
                  <input
                    type="text"
                    value={config.general.siteName}
                    onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Default User Role</label>
                  <select
                    value={config.general.defaultUserRole}
                    onChange={(e) => updateConfig('general', 'defaultUserRole', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Site Description</label>
                <textarea
                  value={config.general.siteDescription}
                  onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Maintenance Mode</div>
                    <div className="text-gray-400 text-sm">Disable site for maintenance</div>
                  </div>
                  <button
                    onClick={() => updateConfig('general', 'maintenanceMode', !config.general.maintenanceMode)}
                    className={`p-1 rounded-full transition-colors ${
                      config.general.maintenanceMode ? 'bg-red-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.general.maintenanceMode ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Registration</div>
                    <div className="text-gray-400 text-sm">Allow new user registration</div>
                  </div>
                  <button
                    onClick={() => updateConfig('general', 'registrationEnabled', !config.general.registrationEnabled)}
                    className={`p-1 rounded-full transition-colors ${
                      config.general.registrationEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.general.registrationEnabled ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Email Verification</div>
                    <div className="text-gray-400 text-sm">Require email verification</div>
                  </div>
                  <button
                    onClick={() => updateConfig('general', 'emailVerificationRequired', !config.general.emailVerificationRequired)}
                    className={`p-1 rounded-full transition-colors ${
                      config.general.emailVerificationRequired ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.general.emailVerificationRequired ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Session Timeout (seconds)</label>
                  <input
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Password Min Length</label>
                  <input
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Rate Limit Requests</label>
                  <input
                    type="number"
                    value={config.security.rateLimitRequests}
                    onChange={(e) => updateConfig('security', 'rateLimitRequests', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Rate Limit Window (seconds)</label>
                  <input
                    type="number"
                    value={config.security.rateLimitWindow}
                    onChange={(e) => updateConfig('security', 'rateLimitWindow', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Two-Factor Authentication</div>
                    <div className="text-gray-400 text-sm">Require 2FA for all users</div>
                  </div>
                  <button
                    onClick={() => updateConfig('security', 'requireTwoFactor', !config.security.requireTwoFactor)}
                    className={`p-1 rounded-full transition-colors ${
                      config.security.requireTwoFactor ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.security.requireTwoFactor ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Rate Limiting</div>
                    <div className="text-gray-400 text-sm">Enable API rate limiting</div>
                  </div>
                  <button
                    onClick={() => updateConfig('security', 'rateLimitEnabled', !config.security.rateLimitEnabled)}
                    className={`p-1 rounded-full transition-colors ${
                      config.security.rateLimitEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.security.rateLimitEnabled ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={config.content.maxFileSize}
                    onChange={(e) => updateConfig('content', 'maxFileSize', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Max Lineups per User</label>
                  <input
                    type="number"
                    value={config.content.maxLineupsPerUser}
                    onChange={(e) => updateConfig('content', 'maxLineupsPerUser', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Max Crosshairs per User</label>
                  <input
                    type="number"
                    value={config.content.maxCrosshairsPerUser}
                    onChange={(e) => updateConfig('content', 'maxCrosshairsPerUser', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Auto Moderation</div>
                    <div className="text-gray-400 text-sm">Automatically moderate content</div>
                  </div>
                  <button
                    onClick={() => updateConfig('content', 'autoModerationEnabled', !config.content.autoModerationEnabled)}
                    className={`p-1 rounded-full transition-colors ${
                      config.content.autoModerationEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.content.autoModerationEnabled ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Profanity Filter</div>
                    <div className="text-gray-400 text-sm">Filter inappropriate language</div>
                  </div>
                  <button
                    onClick={() => updateConfig('content', 'profanityFilterEnabled', !config.content.profanityFilterEnabled)}
                    className={`p-1 rounded-full transition-colors ${
                      config.content.profanityFilterEnabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.content.profanityFilterEnabled ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Content Approval</div>
                    <div className="text-gray-400 text-sm">Require manual approval</div>
                  </div>
                  <button
                    onClick={() => updateConfig('content', 'contentApprovalRequired', !config.content.contentApprovalRequired)}
                    className={`p-1 rounded-full transition-colors ${
                      config.content.contentApprovalRequired ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}
                  >
                    {config.content.contentApprovalRequired ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg mb-6">
                <div>
                  <div className="text-white font-medium">Email Notifications</div>
                  <div className="text-gray-400 text-sm">Enable email notification system</div>
                </div>
                <button
                  onClick={() => updateConfig('notifications', 'emailNotificationsEnabled', !config.notifications.emailNotificationsEnabled)}
                  className={`p-1 rounded-full transition-colors ${
                    config.notifications.emailNotificationsEnabled ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  {config.notifications.emailNotificationsEnabled ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} className="text-gray-400" />}
                </button>
              </div>

              {config.notifications.emailNotificationsEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">SMTP Host</label>
                      <input
                        type="text"
                        value={config.notifications.smtpHost}
                        onChange={(e) => updateConfig('notifications', 'smtpHost', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">SMTP Port</label>
                      <input
                        type="number"
                        value={config.notifications.smtpPort}
                        onChange={(e) => updateConfig('notifications', 'smtpPort', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">From Email</label>
                      <input
                        type="email"
                        value={config.notifications.fromEmail}
                        onChange={(e) => updateConfig('notifications', 'fromEmail', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">From Name</label>
                      <input
                        type="text"
                        value={config.notifications.fromName}
                        onChange={(e) => updateConfig('notifications', 'fromName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Discord Webhook URL</label>
                <input
                  type="url"
                  value={config.integrations.discordWebhookUrl}
                  onChange={(e) => updateConfig('integrations', 'discordWebhookUrl', e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={config.integrations.googleAnalyticsId}
                  onChange={(e) => updateConfig('integrations', 'googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">reCAPTCHA Site Key</label>
                  <input
                    type="text"
                    value={config.integrations.recaptchaSiteKey}
                    onChange={(e) => updateConfig('integrations', 'recaptchaSiteKey', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">reCAPTCHA Secret Key</label>
                  <input
                    type="password"
                    value={config.integrations.recaptchaSecretKey}
                    onChange={(e) => updateConfig('integrations', 'recaptchaSecretKey', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-4">Cloudinary Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Cloud Name</label>
                    <input
                      type="text"
                      value={config.integrations.cloudinaryConfig.cloudName}
                      onChange={(e) => updateNestedConfig('integrations', 'cloudinaryConfig', 'cloudName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">API Key</label>
                    <input
                      type="text"
                      value={config.integrations.cloudinaryConfig.apiKey}
                      onChange={(e) => updateNestedConfig('integrations', 'cloudinaryConfig', 'apiKey', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">API Secret</label>
                    <input
                      type="password"
                      value={config.integrations.cloudinaryConfig.apiSecret}
                      onChange={(e) => updateNestedConfig('integrations', 'cloudinaryConfig', 'apiSecret', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
