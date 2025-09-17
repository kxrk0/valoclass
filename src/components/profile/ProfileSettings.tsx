'use client'

import { useState } from 'react'
import { Save, Eye, EyeOff, Bell, Shield, Trash2, Upload } from 'lucide-react'

const ProfileSettings = () => {
  const [settings, setSettings] = useState({
    profile: {
      username: 'ValoPlayer',
      email: 'user@valoclass.com',
      bio: 'Immortal 2 Jett main. Love creating lineups and sharing strategies.',
      location: 'Los Angeles, CA',
      website: 'https://twitch.tv/valoplayer',
      riotId: 'ValoPlayer#NA1'
    },
    privacy: {
      profileVisibility: 'public',
      showStats: true,
      showActivity: true,
      allowMessages: 'everyone'
    },
    notifications: {
      email: true,
      inApp: true,
      newLineups: true,
      crosshairUpdates: true,
      weeklyDigest: false,
      marketing: false
    },
    security: {
      twoFactor: false,
      loginNotifications: true,
      sessionTimeout: '7d'
    }
  })

  const [activeSection, setActiveSection] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success toast
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'account', label: 'Account', icon: '⚙️' }
  ]

  const renderProfileSection = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-white">Profile Information</h3>
      
      {/* Avatar Upload */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
            {settings.profile.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Profile Picture</h4>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-sm">
                <Upload size={14} />
                Upload New
              </button>
              <button className="btn btn-secondary text-sm text-red-400">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={settings.profile.username}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, username: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, email: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={settings.profile.bio}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profile: { ...prev.profile, bio: e.target.value }
            }))}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={settings.profile.location}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, location: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
            <input
              type="url"
              value={settings.profile.website}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, website: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Riot ID</label>
          <input
            type="text"
            value={settings.profile.riotId}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              profile: { ...prev.profile, riotId: e.target.value }
            }))}
            placeholder="PlayerName#TAG"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
          />
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-white">Privacy Settings</h3>
      
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              privacy: { ...prev.privacy, profileVisibility: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-red-500"
          >
            <option value="public">Public</option>
            <option value="followers">Followers Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Show Statistics</div>
              <div className="text-sm text-gray-400">Display your stats on your profile</div>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, showStats: !prev.privacy.showStats }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy.showStats ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.privacy.showStats ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Show Activity</div>
              <div className="text-sm text-gray-400">Display your recent activity</div>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, showActivity: !prev.privacy.showActivity }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy.showActivity ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.privacy.showActivity ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-white">Notification Preferences</h3>
      
      <div className="card space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-sm text-gray-400">
                {key === 'email' && 'Receive notifications via email'}
                {key === 'inApp' && 'Show notifications in the app'}
                {key === 'newLineups' && 'Notify about new lineups from followed users'}
                {key === 'crosshairUpdates' && 'Updates about crosshair features'}
                {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                {key === 'marketing' && 'Product updates and announcements'}
              </div>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [key]: !value }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-white">Security Settings</h3>
      
      <div className="card space-y-6">
        <div>
          <h4 className="font-medium text-white mb-4">Password</h4>
          <button className="btn btn-secondary">
            Change Password
          </button>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium text-white">Two-Factor Authentication</div>
              <div className="text-sm text-gray-400">Add an extra layer of security</div>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                security: { ...prev.security, twoFactor: !prev.security.twoFactor }
              }))}
              className={`btn ${settings.security.twoFactor ? 'btn-secondary' : 'btn-primary'}`}
            >
              {settings.security.twoFactor ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAccountSection = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl text-white">Account Management</h3>
      
      <div className="card space-y-6">
        <div>
          <h4 className="font-medium text-white mb-2">Export Data</h4>
          <p className="text-gray-400 text-sm mb-4">Download all your data including lineups, crosshairs, and activity.</p>
          <button className="btn btn-secondary">
            Export My Data
          </button>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h4 className="font-medium text-red-400 mb-2">Danger Zone</h4>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-2">Deactivate your account temporarily</p>
              <button className="btn btn-secondary text-orange-400">
                Deactivate Account
              </button>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Permanently delete your account and all data</p>
              <button className="btn btn-secondary text-red-400">
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection()
      case 'privacy': return renderPrivacySection()
      case 'notifications': return renderNotificationsSection()
      case 'security': return renderSecuritySection()
      case 'account': return renderAccountSection()
      default: return renderProfileSection()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Settings</h2>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings