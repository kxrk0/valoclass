'use client'

import { ChangeEvent } from 'react'
import type { CrosshairSettings } from '@/types'

interface CrosshairControlsProps {
  settings: CrosshairSettings
  updateSetting: (key: keyof CrosshairSettings, value: string | number | boolean) => void
}

const CrosshairControls = ({ settings, updateSetting }: CrosshairControlsProps) => {
  const handleRangeChange = (key: keyof CrosshairSettings) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    updateSetting(key, value)
  }

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSetting('color', e.target.value)
  }

  const handleCheckboxChange = (key: keyof CrosshairSettings) => (e: ChangeEvent<HTMLInputElement>) => {
    updateSetting(key, e.target.checked)
  }

  const ControlGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div 
      className="rounded-xl p-3"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <h4 className="font-semibold text-sm mb-3 text-yellow-400/90">{title}</h4>
      <div className="space-y-3">
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
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-medium text-gray-300">{label}</label>
        <span className="text-xs text-yellow-400 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-1.5 bg-gray-800/50 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f0db4f 0%, #f0db4f ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`
        }}
      />
    </div>
  )

  const CheckboxControl = ({ 
    label, 
    checked, 
    onChange 
  }: {
    label: string
    checked: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
  }) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 text-yellow-500 bg-gray-800/50 border-gray-600 rounded focus:ring-yellow-500/50 focus:ring-1"
      />
      <label className="text-xs font-medium text-gray-300">{label}</label>
    </div>
  )

  const colorPresets = [
    { name: 'Green', value: '#00ff00' },
    { name: 'Cyan', value: '#00ffff' },
    { name: 'Yellow', value: '#ffff00' },
    { name: 'Red', value: '#ff0000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Pink', value: '#ff00ff' },
  ]

  return (
    <div className="space-y-3">
      {/* Color Settings */}
      <ControlGroup title="Color & Style">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.color}
              onChange={handleColorChange}
              className="w-8 h-6 rounded border border-gray-600 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={settings.color}
              onChange={handleColorChange}
              className="flex-1 px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-xs font-mono"
            />
          </div>
          <div className="flex gap-1 mt-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateSetting('color', preset.value)}
                className="w-6 h-6 rounded border border-gray-600 transition-all duration-200"
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        <CheckboxControl
          label="Enable Outlines"
          checked={settings.outlines}
          onChange={handleCheckboxChange('outlines')}
        />

        {settings.outlines && (
          <div className="grid grid-cols-2 gap-2">
            <SliderControl
              label="Outline Opacity"
              value={settings.outlineOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('outlineOpacity')}
            />
            <SliderControl
              label="Outline Thickness"
              value={settings.outlineThickness}
              min={0}
              max={5}
              onChange={handleRangeChange('outlineThickness')}
            />
          </div>
        )}
      </ControlGroup>

      {/* Center Dot */}
      <ControlGroup title="Center Dot">
        <CheckboxControl
          label="Show Center Dot"
          checked={settings.centerDot}
          onChange={handleCheckboxChange('centerDot')}
        />

        {settings.centerDot && (
          <div className="grid grid-cols-2 gap-2">
            <SliderControl
              label="Dot Opacity"
              value={settings.centerDotOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('centerDotOpacity')}
            />
            <SliderControl
              label="Dot Size"
              value={settings.centerDotThickness}
              min={1}
              max={10}
              onChange={handleRangeChange('centerDotThickness')}
            />
          </div>
        )}
      </ControlGroup>

      {/* Inner Lines */}
      <ControlGroup title="Inner Lines">
        <CheckboxControl
          label="Show Inner Lines"
          checked={settings.innerLines}
          onChange={handleCheckboxChange('innerLines')}
        />

        {settings.innerLines && (
          <div className="grid grid-cols-2 gap-2">
            <SliderControl
              label="Line Opacity"
              value={settings.innerLineOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('innerLineOpacity')}
            />
            <SliderControl
              label="Line Length"
              value={settings.innerLineLength}
              min={0}
              max={20}
              onChange={handleRangeChange('innerLineLength')}
            />
            <SliderControl
              label="Line Thickness"
              value={settings.innerLineThickness}
              min={1}
              max={10}
              onChange={handleRangeChange('innerLineThickness')}
            />
            <SliderControl
              label="Center Gap"
              value={settings.innerLineOffset}
              min={0}
              max={20}
              onChange={handleRangeChange('innerLineOffset')}
            />
          </div>
        )}
      </ControlGroup>

      {/* Outer Lines */}
      <ControlGroup title="Outer Lines">
        <CheckboxControl
          label="Show Outer Lines"
          checked={settings.outerLines}
          onChange={handleCheckboxChange('outerLines')}
        />

        {settings.outerLines && (
          <div className="grid grid-cols-2 gap-2">
            <SliderControl
              label="Line Opacity"
              value={settings.outerLineOpacity}
              min={0}
              max={1}
              step={0.1}
              onChange={handleRangeChange('outerLineOpacity')}
            />
            <SliderControl
              label="Line Length"
              value={settings.outerLineLength}
              min={0}
              max={20}
              onChange={handleRangeChange('outerLineLength')}
            />
            <SliderControl
              label="Line Thickness"
              value={settings.outerLineThickness}
              min={1}
              max={10}
              onChange={handleRangeChange('outerLineThickness')}
            />
            <SliderControl
              label="Distance from Center"
              value={settings.outerLineOffset}
              min={5}
              max={50}
              onChange={handleRangeChange('outerLineOffset')}
            />
          </div>
        )}
      </ControlGroup>

      {/* Error Settings */}
      <ControlGroup title="Dynamic Crosshair">
        <div className="grid grid-cols-2 gap-2">
          <SliderControl
            label="Movement Error"
            value={settings.movementError}
            min={0}
            max={5}
            step={0.1}
            onChange={handleRangeChange('movementError')}
          />
          <SliderControl
            label="Firing Error"
            value={settings.firingError}
            min={0}
            max={5}
            step={0.1}
            onChange={handleRangeChange('firingError')}
          />
        </div>
        <div className="text-xs text-gray-500">
          Controls crosshair expansion when moving or shooting
        </div>
      </ControlGroup>
    </div>
  )
}

export default CrosshairControls
