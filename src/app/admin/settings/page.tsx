import { Metadata } from 'next'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { AdminSocketProvider } from '@/contexts/AdminSocketContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { 
  Settings, 
  Globe, 
  Shield, 
  Mail, 
  Bell, 
  Users,
  Database,
  Key,
  Palette,
  Zap,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  Info
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Settings - Admin Dashboard',
  description: 'Configure platform settings and preferences',
  robots: { index: false, follow: false }
}

function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const [settings, setSettings] = React.useState({
    general: {
      siteName: 'ValoClass',
      siteDescription: 'The ultimate Valorant community platform',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      requireEmailVerification: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      reportNotifications: true,
      userRegistrations: true,
      contentModeration: true,
      systemAlerts: true
    },
    content: {
      autoModeration: true,
      requireApproval: false,
      maxFileSize: 10,
      allowedFileTypes: ['jpg', 'png', 'gif', 'mp4'],
      featuredContentLimit: 50
    },
    api: {
      rateLimit: 1000,
      apiVersion: 'v1',
      enableCors: true,
      allowedOrigins: ['localhost:3000', 'valoclass.com'],
      webhooksEnabled: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'content', label: 'Content', icon: Database },
    { id: 'api', label: 'API', icon: Key }
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    // API call to save settings
    console.log('Saving settings:', settings);
    // Show success notification
  };

  const resetToDefaults = () => {
    // Reset to default settings
    console.log('Resetting to defaults');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Site Name</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Maintenance Mode</label>
            <p className="text-gray-400 text-sm">Temporarily disable the site for maintenance</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">User Registration</label>
            <p className="text-gray-400 text-sm">Allow new users to register accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.registrationEnabled}
              onChange={(e) => updateSetting('general', 'registrationEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Email Verification Required</label>
            <p className="text-gray-400 text-sm">Require email verification for new accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.emailVerificationRequired}
              onChange={(e) => updateSetting('general', 'emailVerificationRequired', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Min Password Length</label>
          <input
            type="number"
            min="6"
            max="128"
            value={settings.security.passwordMinLength}
            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Session Timeout (hours)</label>
          <input
            type="number"
            min="1"
            max="168"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Max Login Attempts</label>
        <input
          type="number"
          min="1"
          max="20"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <p className="text-gray-400 text-sm mt-1">Number of failed login attempts before temporary lockout</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Require Special Characters</label>
            <p className="text-gray-400 text-sm">Passwords must contain special characters</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.requireSpecialChars}
              onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Two-Factor Authentication</label>
            <p className="text-gray-400 text-sm">Enable 2FA for admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.enableTwoFactor}
              onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Email Notifications</label>
            <p className="text-gray-400 text-sm">Send admin notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Report Notifications</label>
            <p className="text-gray-400 text-sm">Get notified of new user reports</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.reportNotifications}
              onChange={(e) => updateSetting('notifications', 'reportNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">User Registrations</label>
            <p className="text-gray-400 text-sm">Notify when new users register</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.userRegistrations}
              onChange={(e) => updateSetting('notifications', 'userRegistrations', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Content Moderation</label>
            <p className="text-gray-400 text-sm">Notify of content requiring moderation</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.contentModeration}
              onChange={(e) => updateSetting('notifications', 'contentModeration', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">System Alerts</label>
            <p className="text-gray-400 text-sm">Critical system notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Max File Size (MB)</label>
        <input
          type="number"
          min="1"
          max="100"
          value={settings.content.maxFileSize}
          onChange={(e) => updateSetting('content', 'maxFileSize', parseInt(e.target.value))}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Featured Content Limit</label>
        <input
          type="number"
          min="10"
          max="200"
          value={settings.content.featuredContentLimit}
          onChange={(e) => updateSetting('content', 'featuredContentLimit', parseInt(e.target.value))}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <p className="text-gray-400 text-sm mt-1">Maximum number of featured items on homepage</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Auto Moderation</label>
            <p className="text-gray-400 text-sm">Automatically flag inappropriate content</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.content.autoModeration}
              onChange={(e) => updateSetting('content', 'autoModeration', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Require Approval</label>
            <p className="text-gray-400 text-sm">All content must be approved before publishing</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.content.requireApproval}
              onChange={(e) => updateSetting('content', 'requireApproval', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Rate Limit (requests/hour)</label>
          <input
            type="number"
            min="100"
            max="10000"
            value={settings.api.rateLimit}
            onChange={(e) => updateSetting('api', 'rateLimit', parseInt(e.target.value))}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">API Version</label>
          <select
            value={settings.api.apiVersion}
            onChange={(e) => updateSetting('api', 'apiVersion', e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="v1">v1</option>
            <option value="v2">v2 (Beta)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Enable CORS</label>
            <p className="text-gray-400 text-sm">Allow cross-origin requests</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.api.enableCors}
              onChange={(e) => updateSetting('api', 'enableCors', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-white font-medium">Webhooks Enabled</label>
            <p className="text-gray-400 text-sm">Allow webhook integrations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.api.webhooksEnabled}
              onChange={(e) => updateSetting('api', 'webhooksEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'content': return renderContentSettings();
      case 'api': return renderApiSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
          <p className="text-gray-400">Configure system preferences and behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <RefreshCw size={16} />
            Reset to Defaults
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#FF4654] to-[#FF6B7A] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-[#242738] to-[#2A2D47] rounded-xl border border-gray-600/50 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || Settings, { size: 20 })}
                {tabs.find(tab => tab.id === activeTab)?.label} Settings
              </h3>
              <div className="w-full h-px bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600"></div>
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-600/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-semibold mb-2">Important Notice</h4>
            <p className="text-yellow-200 text-sm">
              Changes to these settings can significantly affect your platform's behavior. 
              Please review all modifications carefully before saving. Some changes may require a server restart to take effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add React import
import * as React from 'react';

import SystemSettings from '@/components/admin/SystemSettings'

export default function AdminSettingsPage() {
  return (
    <NotificationProvider>
      <AdminAuthGuard>
        <AdminSocketProvider>
          <AdminLayout>
            <SystemSettings />
          </AdminLayout>
        </AdminSocketProvider>
      </AdminAuthGuard>
    </NotificationProvider>
  )
}
