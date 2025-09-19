'use client'

import { ChangeEvent } from 'react'

interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
}

const ToggleSwitch = ({ 
  label, 
  checked, 
  onChange, 
  description,
  disabled = false 
}: ToggleSwitchProps) => {
  return (
    <div className={`${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-200 cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            id={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
              checked 
                ? 'bg-gradient-to-r from-yellow-400 to-red-400' 
                : 'bg-gray-600'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                checked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default ToggleSwitch
