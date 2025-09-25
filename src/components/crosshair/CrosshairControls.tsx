'use client'

import { ChangeEvent } from 'react'
import type { ValorantCrosshairSettings } from '@/types'
import { VALORANT_COLORS, getColorFromType } from '@/utils/valorantCrosshair'
import { Palette, Crosshair, Target, Zap } from 'lucide-react'

interface CrosshairControlsProps {
  settings: ValorantCrosshairSettings
  updateSetting: (key: keyof ValorantCrosshairSettings, value: string | number | boolean) => void
  profile?: 'general' | 'primary' | 'ads' | 'sniper'
}

const CrosshairControls = ({ settings, updateSetting, profile = 'general' }: CrosshairControlsProps) => {
  const handleRangeChange = (key: keyof ValorantCrosshairSettings) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    updateSetting(key, value)
  }

  const handleCheckboxChange = (key: keyof ValorantCrosshairSettings) => (e: ChangeEvent<HTMLInputElement>) => {
    updateSetting(key, e.target.checked)
  }

  const handleSelectChange = (key: keyof ValorantCrosshairSettings) => (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    updateSetting(key, value)
  }

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSetting('customColor', e.target.value)
    if (settings.colorType !== 7) {
      updateSetting('colorType', 7) // Set to custom when user picks a color
    }
  }

  // Modern Section Component - Valorant Style
  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-gray-800/20 backdrop-blur-10 border border-gray-700/30 rounded-xl p-4 mb-4">
      <h3 className="font-semibold text-base mb-4 text-white flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  // Modern Slider - Like Valorant
  const Slider = ({ 
    label, 
    value, 
    min, 
    max, 
    step = 1, 
    onChange,
    unit = ''
  }: {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    unit?: string
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-xs text-yellow-400 font-mono bg-gray-900/50 px-2 py-1 rounded">
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer"
        />
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-yellow-400 to-red-400 rounded-lg pointer-events-none"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-600 rounded-full shadow-lg pointer-events-none"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>
    </div>
  )

  // Toggle Switch - Valorant Style
  const Toggle = ({ label, checked, onChange, disabled = false }: {
    label: string
    checked: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
  }) => (
    <label className="flex items-center justify-between cursor-pointer">
      <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${
          checked && !disabled ? 'bg-gradient-to-r from-yellow-400 to-red-400' : 'bg-gray-600'
        } ${disabled ? 'opacity-50' : ''}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${
            checked && !disabled ? 'translate-x-5' : 'translate-x-1'
          }`} />
        </div>
      </div>
    </label>
  )

  // Dropdown - Valorant Style
  const Dropdown = ({ label, value, options, onChange }: {
    label: string
    value: number
    options: { value: number; label: string }[]
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="space-y-0">
      {/* GENERAL - Exactly like Valorant's layout */}
      <Section title="GENERAL" icon={<Palette size={18} className="text-yellow-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown
            label="Color"
            value={settings.colorType}
            onChange={handleSelectChange('colorType')}
            options={Object.entries(VALORANT_COLORS).map(([value, color]) => ({
              value: parseInt(value),
              label: color.name
            }))}
          />
          
          <Toggle
            label="Show Spectated Player's Crosshair"
            checked={false}
            onChange={() => {}}
            disabled={true}
          />
          
          <Toggle
            label="Disable Crosshair"
            checked={false}
            onChange={() => {}}
            disabled={true}
          />
        </div>
        
        {settings.colorType === 7 && (
          <div className="pt-4 border-t border-gray-700/30">
            <label className="text-sm font-medium text-gray-300 block mb-2">Custom Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.customColor}
                onChange={handleColorChange}
                className="w-12 h-8 rounded-lg border border-gray-600 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={settings.customColor}
                onChange={(e) => updateSetting('customColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                placeholder="#00ff00"
              />
            </div>
          </div>
        )}
      </Section>

      {/* PRIMARY - Like Valorant's Primary section */}
      <Section title="PRIMARY" icon={<Crosshair size={18} className="text-yellow-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <Toggle
            label="Show Inner Lines"
            checked={settings.innerLines}
            onChange={handleCheckboxChange('innerLines')}
          />
          
          <Toggle
            label="Show Outlines"
            checked={settings.outlines}
            onChange={handleCheckboxChange('outlines')}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Slider
            label="Inner Line Opacity"
            value={settings.innerLineOpacity}
            min={0}
            max={1}
            step={0.01}
            onChange={handleRangeChange('innerLineOpacity')}
          />
          
          <Slider
            label="Inner Line Length"
            value={settings.innerLineLength}
            min={0}
            max={20}
            onChange={handleRangeChange('innerLineLength')}
          />
          
          <Slider
            label="Inner Line Thickness"
            value={settings.innerLineThickness}
            min={1}
            max={10}
            onChange={handleRangeChange('innerLineThickness')}
          />
          
          <Slider
            label="Inner Line Offset"
            value={settings.innerLineOffset}
            min={0}
            max={20}
            onChange={handleRangeChange('innerLineOffset')}
          />
        </div>
        
        {settings.outlines && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700/30">
            <Slider
              label="Outline Opacity"
              value={settings.outlineOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('outlineOpacity')}
            />
            <Slider
              label="Outline Thickness"
              value={settings.outlineThickness}
              min={1}
              max={3}
              onChange={handleRangeChange('outlineThickness')}
            />
          </div>
        )}
      </Section>

      {/* CENTER DOT - Like Valorant */}
      <Section title="CENTER DOT" icon={<Target size={18} className="text-yellow-400" />}>
        <div className="mb-4">
          <Toggle
            label="Show Center Dot"
            checked={settings.centerDot}
            onChange={handleCheckboxChange('centerDot')}
          />
        </div>
        
        {settings.centerDot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Slider
              label="Center Dot Opacity"
              value={settings.centerDotOpacity}
              min={0}
              max={1}
              step={0.01}
              onChange={handleRangeChange('centerDotOpacity')}
            />
            <Slider
              label="Center Dot Thickness"
              value={settings.centerDotThickness}
              min={1}
              max={10}
              onChange={handleRangeChange('centerDotThickness')}
            />
          </div>
        )}
      </Section>

      {/* ERROR - Valorant's Error section */}
      <Section title="ERROR" icon={<Zap size={18} className="text-yellow-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <Toggle
            label="Movement Error"
            checked={settings.movementError}
            onChange={handleCheckboxChange('movementError')}
          />
          
          <Toggle
            label="Firing Error"
            checked={settings.firingError}
            onChange={handleCheckboxChange('firingError')}
          />
        </div>
        
        {(settings.movementError || settings.firingError) && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Slider
                label="Outer Line Opacity"
                value={settings.outerLineOpacity}
                min={0}
                max={1}
                step={0.01}
                onChange={handleRangeChange('outerLineOpacity')}
              />
              
              <Slider
                label="Outer Line Length"
                value={settings.outerLineLength}
                min={0}
                max={20}
                onChange={handleRangeChange('outerLineLength')}
              />
              
              <Slider
                label="Outer Line Thickness"
                value={settings.outerLineThickness}
                min={1}
                max={10}
                onChange={handleRangeChange('outerLineThickness')}
              />
              
              <Slider
                label="Outer Line Offset"
                value={settings.outerLineOffset}
                min={0}
                max={50}
                onChange={handleRangeChange('outerLineOffset')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700/30">
              {settings.movementError && (
                <Slider
                  label="Movement Error Multiplier"
                  value={settings.movementErrorMultiplier}
                  min={0}
                  max={5}
                  onChange={handleRangeChange('movementErrorMultiplier')}
                />
              )}
              
              {settings.firingError && (
                <Slider
                  label="Firing Error Multiplier"
                  value={settings.firingErrorMultiplier}
                  min={0}
                  max={5}
                  onChange={handleRangeChange('firingErrorMultiplier')}
                />
              )}
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}

export default CrosshairControls