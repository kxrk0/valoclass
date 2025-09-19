'use client'

import { ChangeEvent } from 'react'
import type { ValorantCrosshairSettings } from '@/types'
import { VALORANT_COLORS, getColorFromType } from '@/utils/valorantCrosshair'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

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

  const ControlGroup = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) => (
    <div 
      className="rounded-xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <h4 className="font-semibold text-base mb-4 text-yellow-400/90 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h4>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const SliderControl = ({ 
    label, 
    value, 
    min, 
    max, 
    step = 1, 
    onChange,
    unit = '',
    description
  }: {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    unit?: string
    description?: string
  }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-200">{label}</label>
        <span className="text-sm text-yellow-400 font-mono bg-black/20 px-2 py-1 rounded">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-800/50 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #f0db4f 0%, #f0db4f ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`
        }}
      />
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )


  const SelectControl = ({
    label,
    value,
    options,
    onChange,
    description
  }: {
    label: string
    value: number
    options: { value: number; label: string }[]
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    description?: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-500/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )

  const colorOptions = Object.entries(VALORANT_COLORS).map(([value, color]) => ({
    value: parseInt(value),
    label: color.name
  }))

  return (
    <div className="space-y-4">
      {/* Color & Appearance */}
      <ControlGroup title="Color & Appearance" icon="🎨">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectControl
            label="Color Type"
            value={settings.colorType}
            options={colorOptions}
            onChange={handleSelectChange('colorType')}
            description="Choose from Valorant's preset colors or use custom"
          />
          
          {settings.colorType === 7 && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Custom Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.customColor}
                  onChange={handleColorChange}
                  className="w-12 h-10 rounded border border-gray-600 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.customColor}
                  onChange={handleColorChange}
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-sm font-mono"
                />
              </div>
            </div>
          )}
          
          {settings.colorType !== 7 && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Color Preview</label>
              <div 
                className="w-full h-10 rounded border border-gray-600"
                style={{ backgroundColor: getColorFromType(settings.colorType, settings.customColor) }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleSwitch
          label="Enable Outlines"
          checked={settings.outlines}
          onChange={handleCheckboxChange('outlines')}
          description="Black outline around crosshair for better visibility"
        />

          {settings.outlines && (
            <>
              <SliderControl
                label="Outline Opacity"
                value={settings.outlineOpacity}
                min={0}
                max={1}
                step={0.1}
                onChange={handleRangeChange('outlineOpacity')}
                description="Transparency of the outline"
              />
              <SliderControl
                label="Outline Thickness"
                value={settings.outlineThickness}
                min={0}
                max={5}
                onChange={handleRangeChange('outlineThickness')}
                description="Thickness of the outline"
              />
            </>
          )}
        </div>
      </ControlGroup>

      {/* Center Dot */}
      <ControlGroup title="Center Dot" icon="⚫">
        <ToggleSwitch
          label="Show Center Dot"
          checked={settings.centerDot}
          onChange={handleCheckboxChange('centerDot')}
          description="Small dot in the center of crosshair"
        />

        {settings.centerDot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SliderControl
              label="Dot Opacity"
              value={settings.centerDotOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('centerDotOpacity')}
              description="Transparency of the center dot"
            />
            <SliderControl
              label="Dot Size"
              value={settings.centerDotThickness}
              min={1}
              max={10}
              onChange={handleRangeChange('centerDotThickness')}
              description="Size of the center dot"
            />
          </div>
        )}
      </ControlGroup>

      {/* Inner Lines */}
      <ControlGroup title="Inner Lines" icon="✚">
        <ToggleSwitch
          label="Show Inner Lines"
          checked={settings.innerLines}
          onChange={handleCheckboxChange('innerLines')}
          description="Main crosshair lines"
        />

        {settings.innerLines && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SliderControl
              label="Line Opacity"
              value={settings.innerLineOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('innerLineOpacity')}
              description="Transparency of inner lines"
            />
            <SliderControl
              label="Line Length"
              value={settings.innerLineLength}
              min={0}
              max={20}
              onChange={handleRangeChange('innerLineLength')}
              description="Length of crosshair lines"
            />
            <SliderControl
              label="Line Thickness"
              value={settings.innerLineThickness}
              min={1}
              max={10}
              onChange={handleRangeChange('innerLineThickness')}
              description="Thickness of crosshair lines"
            />
            <SliderControl
              label="Center Gap"
              value={settings.innerLineOffset}
              min={0}
              max={20}
              onChange={handleRangeChange('innerLineOffset')}
              description="Gap between lines and center"
            />
          </div>
        )}
      </ControlGroup>

      {/* Dynamic Crosshair */}
      <ControlGroup title="Dynamic Crosshair" icon="🎯">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            label="Movement Error"
            checked={settings.movementError}
            onChange={handleCheckboxChange('movementError')}
            description="Crosshair expands when moving"
          />
          
          <ToggleSwitch
            label="Firing Error"
            checked={settings.firingError}
            onChange={handleCheckboxChange('firingError')}
            description="Crosshair expands when shooting"
          />
        </div>

        {(settings.movementError || settings.firingError) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.movementError && (
              <SliderControl
                label="Movement Error Multiplier"
                value={settings.movementErrorMultiplier}
                min={0}
                max={5}
                step={0.1}
                onChange={handleRangeChange('movementErrorMultiplier')}
                description="How much crosshair expands when moving"
              />
            )}
            
            {settings.firingError && (
              <SliderControl
                label="Firing Error Multiplier"
                value={settings.firingErrorMultiplier}
                min={0}
                max={5}
                step={0.1}
                onChange={handleRangeChange('firingErrorMultiplier')}
                description="How much crosshair expands when shooting"
              />
            )}
          </div>
        )}
      </ControlGroup>

      {/* Outer Lines (Dynamic) */}
      {(settings.movementError || settings.firingError) && (
        <ControlGroup title="Outer Lines (Dynamic)" icon="⊕">
          <ToggleSwitch
            label="Show Outer Lines"
            checked={settings.outerLines}
            onChange={handleCheckboxChange('outerLines')}
            description="Additional lines that appear during movement/firing"
          />

          {settings.outerLines && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SliderControl
                label="Outer Line Opacity"
                value={settings.outerLineOpacity}
                min={0}
                max={1}
                step={0.1}
                onChange={handleRangeChange('outerLineOpacity')}
                description="Transparency of outer lines"
              />
              <SliderControl
                label="Outer Line Length"
                value={settings.outerLineLength}
                min={0}
                max={20}
                onChange={handleRangeChange('outerLineLength')}
                description="Length of outer lines"
              />
              <SliderControl
                label="Outer Line Thickness"
                value={settings.outerLineThickness}
                min={1}
                max={10}
                onChange={handleRangeChange('outerLineThickness')}
                description="Thickness of outer lines"
              />
              <SliderControl
                label="Distance from Center"
                value={settings.outerLineOffset}
                min={5}
                max={50}
                onChange={handleRangeChange('outerLineOffset')}
                description="Distance of outer lines from center"
              />
            </div>
          )}
        </ControlGroup>
      )}

      {/* Profile-specific Settings */}
      {profile === 'ads' && (
        <ControlGroup title="ADS Settings" icon="🔍">
          <ToggleSwitch
            label="ADS Error"
            checked={settings.adsError}
            onChange={handleCheckboxChange('adsError')}
            description="Enable error when aiming down sights"
          />
        </ControlGroup>
      )}
    </div>
  )
}

export default CrosshairControls