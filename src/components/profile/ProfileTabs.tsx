'use client'

import { useState } from 'react'
import { Target, Crosshair, Activity, Settings, Heart, BookOpen } from 'lucide-react'
import ProfileLineups from './ProfileLineups'
import ProfileCrosshairs from './ProfileCrosshairs'
import ProfileActivity from './ProfileActivity'
import ProfileSettings from './ProfileSettings'
import ProfileStats from './ProfileStats'

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('lineups')

  const tabs = [
    { id: 'lineups', label: 'Lineups', icon: Target, count: 23 },
    { id: 'crosshairs', label: 'Crosshairs', icon: Crosshair, count: 8 },
    { id: 'activity', label: 'Activity', icon: Activity, count: null },
    { id: 'stats', label: 'Stats', icon: BookOpen, count: null },
    { id: 'settings', label: 'Settings', icon: Settings, count: null }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lineups':
        return <ProfileLineups />
      case 'crosshairs':
        return <ProfileCrosshairs />
      case 'activity':
        return <ProfileActivity />
      case 'stats':
        return <ProfileStats />
      case 'settings':
        return <ProfileSettings />
      default:
        return <ProfileLineups />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="card p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ProfileTabs