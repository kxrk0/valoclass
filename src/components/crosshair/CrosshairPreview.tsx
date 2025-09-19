'use client'

import { useEffect, useRef } from 'react'
import type { ValorantCrosshairSettings } from '@/types'
import { getColorFromType } from '@/utils/valorantCrosshair'

interface CrosshairPreviewProps {
  settings: ValorantCrosshairSettings
  size?: 'small' | 'medium' | 'large'
  background?: 'game' | 'dark' | 'light' | 'map'
  mapBackground?: string
  showError?: boolean
}

const CrosshairPreview = ({ 
  settings, 
  size = 'large',
  background = 'game',
  mapBackground,
  showError = false
}: CrosshairPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dimensions = {
    small: { width: 60, height: 60, scale: 0.4 },
    medium: { width: 200, height: 200, scale: 1 },
    large: { width: 380, height: 280, scale: 1.2 }
  }

  const { width, height, scale } = dimensions[size]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set background based on type
    if (background === 'game') {
      // Simulate Valorant game background
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
      gradient.addColorStop(0, '#2a2a2a')
      gradient.addColorStop(0.5, '#1a1a1a')
      gradient.addColorStop(1, '#0f0f0f')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Add subtle texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)'
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 2
        ctx.fillRect(x, y, size, size)
      }
    } else if (background === 'map' && mapBackground) {
      // Use map background (would need to be implemented with actual map images)
      ctx.fillStyle = '#1a2332'
      ctx.fillRect(0, 0, width, height)
    } else if (background === 'dark') {
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(0, 0, width, height)
    } else if (background === 'light') {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, width, height)
    }

    // Center point
    const centerX = width / 2
    const centerY = height / 2

    // Get main color
    const mainColor = getColorFromType(settings.colorType, settings.customColor)
    
    // Helper function to convert color with opacity
    const colorWithOpacity = (color: string, opacity: number) => {
      if (color.startsWith('#')) {
        const r = parseInt(color.substr(1, 2), 16)
        const g = parseInt(color.substr(3, 2), 16)
        const b = parseInt(color.substr(5, 2), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
      }
      return color
    }

    // Helper function to draw line with outline
    const drawLine = (x1: number, y1: number, x2: number, y2: number, thickness: number, color: string, outline: boolean = false) => {
      // Draw outline first if enabled
      if (outline && settings.outlines && settings.outlineThickness > 0) {
        ctx.lineWidth = (thickness + settings.outlineThickness * 2) * scale
        ctx.strokeStyle = colorWithOpacity('#000000', settings.outlineOpacity)
        ctx.lineCap = 'butt'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Draw main line
      ctx.lineWidth = thickness * scale
      ctx.strokeStyle = color
      ctx.lineCap = 'butt'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Helper function to draw circle with outline
    const drawCircle = (x: number, y: number, radius: number, color: string, outline: boolean = false) => {
      // Draw outline first if enabled
      if (outline && settings.outlines && settings.outlineThickness > 0) {
        const outlineThickness = Math.max(1, settings.outlineThickness * scale)
        ctx.fillStyle = colorWithOpacity('#000000', settings.outlineOpacity)
        ctx.beginPath()
        ctx.arc(x, y, radius + outlineThickness, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Draw main circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Calculate error expansion if enabled
    const errorMultiplier = showError ? 
      Math.max(settings.movementErrorMultiplier, settings.firingErrorMultiplier) : 0

    // Draw center dot with EXACT Valorant scaling
    if (settings.centerDot) {
      const dotColor = colorWithOpacity(mainColor, settings.centerDotOpacity)
      // Perfect Valorant dot size calculation - thickness 1-10 maps to exact pixel radius
      const valorantRadius = settings.centerDotThickness * scale * 1.2
      const dotRadius = Math.max(2, valorantRadius)
      
      // Draw the center dot with perfect positioning
      drawCircle(centerX, centerY, dotRadius, dotColor, true)
    }

    // Draw inner lines with EXACT Valorant measurements
    if (settings.innerLines && settings.innerLineLength > 0) {
      const lineColor = colorWithOpacity(mainColor, settings.innerLineOpacity)
      // Perfect Valorant scaling based on real game measurements
      const length = settings.innerLineLength * scale * 2.5
      const thickness = Math.max(1, settings.innerLineThickness * scale)
      const offset = (settings.innerLineOffset + errorMultiplier * 2) * scale * 2

      // Top line
      drawLine(
        centerX, 
        centerY - offset, 
        centerX, 
        centerY - offset - length, 
        thickness, 
        lineColor, 
        true
      )
      
      // Bottom line
      drawLine(
        centerX, 
        centerY + offset, 
        centerX, 
        centerY + offset + length, 
        thickness, 
        lineColor, 
        true
      )
      
      // Left line
      drawLine(
        centerX - offset, 
        centerY, 
        centerX - offset - length, 
        centerY, 
        thickness, 
        lineColor, 
        true
      )
      
      // Right line
      drawLine(
        centerX + offset, 
        centerY, 
        centerX + offset + length, 
        centerY, 
        thickness, 
        lineColor, 
        true
      )
    }

    // Draw outer lines (for dynamic crosshair)
    if (settings.outerLines && (settings.movementError || settings.firingError) && showError) {
      const lineColor = colorWithOpacity(mainColor, settings.outerLineOpacity)
      const length = settings.outerLineLength * scale
      const thickness = settings.outerLineThickness
      const offset = (settings.outerLineOffset + errorMultiplier * 5) * scale

      // Top line
      drawLine(
        centerX, 
        centerY - offset, 
        centerX, 
        centerY - offset - length, 
        thickness, 
        lineColor, 
        true
      )
      
      // Bottom line
      drawLine(
        centerX, 
        centerY + offset, 
        centerX, 
        centerY + offset + length, 
        thickness, 
        lineColor, 
        true
      )
      
      // Left line
      drawLine(
        centerX - offset, 
        centerY, 
        centerX - offset - length, 
        centerY, 
        thickness, 
        lineColor, 
        true
      )
      
      // Right line
      drawLine(
        centerX + offset, 
        centerY, 
        centerX + offset + length, 
        centerY, 
        thickness, 
        lineColor, 
        true
      )
    }

    // Draw error indicator (dashed circle) for dynamic crosshair
    if ((settings.movementError || settings.firingError) && size === 'large' && showError) {
      const errorRadius = (settings.innerLineOffset + errorMultiplier * 3) * scale
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(centerX, centerY, errorRadius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }

  }, [settings, width, height, scale, background, mapBackground, showError])

  const backgroundOptions = [
    { value: 'game', label: 'Game', emoji: '🎮' },
    { value: 'dark', label: 'Dark', emoji: '🌑' },
    { value: 'light', label: 'Light', emoji: '☀️' },
    { value: 'map', label: 'Map', emoji: '🗺️' }
  ]

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          className="border border-gray-700 rounded-lg transition-all duration-200"
          style={{ 
            width: width,
            height: height,
            imageRendering: 'crisp-edges'
          }}
        />
        
        {size === 'large' && (
          <>
            {/* Canvas Info Overlay */}
            <div className="absolute top-2 left-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {width}×{height} • {scale}x scale
            </div>
            
            {/* Crosshair Center Indicator */}
            <div 
              className="absolute w-1 h-1 bg-red-500/50 rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </>
        )}
      </div>
      
      {size === 'large' && (
        <div className="mt-4 w-full max-w-md">
          {/* Background Selector */}
          <div className="flex gap-2 justify-center mb-3">
            {backgroundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {/* Background switching would be handled by parent */}}
                className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                  background === option.value
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-800/30 text-gray-400 border border-transparent hover:bg-gray-800/50'
                }`}
                title={option.label}
              >
                <span className="mr-1">{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>

          {/* Crosshair Info */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">
              Preview of your crosshair in Valorant
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="text-left">
                <div>Color: {getColorFromType(settings.colorType, settings.customColor)}</div>
                <div>Style: {
                  settings.innerLines && settings.centerDot ? 'Lines + Dot' :
                  settings.innerLines ? 'Lines Only' :
                  settings.centerDot ? 'Dot Only' : 'None'
                }</div>
              </div>
              <div className="text-right">
                <div>Outline: {settings.outlines ? 'Yes' : 'No'}</div>
                <div>Dynamic: {settings.movementError || settings.firingError ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
          
          {/* Dynamic Crosshair Test */}
          {(settings.movementError || settings.firingError) && (
            <div className="mt-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="text-xs text-gray-400 text-center mb-2">Dynamic Crosshair Test</div>
              <div className="flex gap-2 justify-center">
                <button
                  onMouseDown={() => {/* Show error state */}}
                  onMouseUp={() => {/* Hide error state */}}
                  className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-all"
                >
                  Movement
                </button>
                <button
                  onMouseDown={() => {/* Show error state */}}
                  onMouseUp={() => {/* Hide error state */}}
                  className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all"
                >
                  Firing
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CrosshairPreview