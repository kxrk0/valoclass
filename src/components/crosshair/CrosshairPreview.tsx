'use client'

import { useEffect, useRef } from 'react'
import type { CrosshairSettings } from '@/types'

interface CrosshairPreviewProps {
  settings: CrosshairSettings
  size?: 'small' | 'medium' | 'large'
  background?: 'game' | 'dark' | 'light'
}

const CrosshairPreview = ({ 
  settings, 
  size = 'large',
  background = 'game'
}: CrosshairPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dimensions = {
    small: { width: 60, height: 60, scale: 0.5 },
    medium: { width: 200, height: 200, scale: 1 },
    large: { width: 400, height: 300, scale: 1.5 }
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

    // Set background
    if (background === 'game') {
      // Simulate game background with some texture
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
      gradient.addColorStop(0, '#1a1a1a')
      gradient.addColorStop(1, '#0a0a0a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Add some noise/texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        ctx.fillRect(x, y, 1, 1)
      }
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

    // Helper function to draw line with outline
    const drawLine = (x1: number, y1: number, x2: number, y2: number, thickness: number, color: string, outline: boolean = false) => {
      if (outline && settings.outlines) {
        // Draw outline first
        ctx.lineWidth = thickness + (settings.outlineThickness * 2 * scale)
        ctx.strokeStyle = `rgba(0, 0, 0, ${settings.outlineOpacity})`
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
      if (outline && settings.outlines) {
        // Draw outline first
        ctx.fillStyle = `rgba(0, 0, 0, ${settings.outlineOpacity})`
        ctx.beginPath()
        ctx.arc(x, y, radius + (settings.outlineThickness * scale), 0, 2 * Math.PI)
        ctx.fill()
      }

      // Draw main circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Parse color with opacity
    const parseColor = (color: string, opacity: number) => {
      if (color.startsWith('#')) {
        const r = parseInt(color.substr(1, 2), 16)
        const g = parseInt(color.substr(3, 2), 16)
        const b = parseInt(color.substr(5, 2), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
      }
      return color
    }

    const mainColor = parseColor(settings.color, 1)

    // Draw center dot
    if (settings.centerDot) {
      const dotColor = parseColor(settings.color, settings.centerDotOpacity)
      const dotRadius = (settings.centerDotThickness / 2) * scale
      drawCircle(centerX, centerY, dotRadius, dotColor, true)
    }

    // Draw inner lines
    if (settings.innerLines) {
      const lineColor = parseColor(settings.color, settings.innerLineOpacity)
      const length = settings.innerLineLength * scale
      const thickness = settings.innerLineThickness * scale
      const offset = settings.innerLineOffset * scale

      // Top line
      drawLine(centerX, centerY - offset, centerX, centerY - offset - length, thickness, lineColor, true)
      // Bottom line
      drawLine(centerX, centerY + offset, centerX, centerY + offset + length, thickness, lineColor, true)
      // Left line
      drawLine(centerX - offset, centerY, centerX - offset - length, centerY, thickness, lineColor, true)
      // Right line
      drawLine(centerX + offset, centerY, centerX + offset + length, centerY, thickness, lineColor, true)
    }

    // Draw outer lines
    if (settings.outerLines) {
      const lineColor = parseColor(settings.color, settings.outerLineOpacity)
      const length = settings.outerLineLength * scale
      const thickness = settings.outerLineThickness * scale
      const offset = settings.outerLineOffset * scale

      // Top line
      drawLine(centerX, centerY - offset, centerX, centerY - offset - length, thickness, lineColor, true)
      // Bottom line
      drawLine(centerX, centerY + offset, centerX, centerY + offset + length, thickness, lineColor, true)
      // Left line
      drawLine(centerX - offset, centerY, centerX - offset - length, centerY, thickness, lineColor, true)
      // Right line
      drawLine(centerX + offset, centerY, centerX + offset + length, centerY, thickness, lineColor, true)
    }

    // Draw movement/firing error indicators (optional)
    if (settings.movementError > 0 || settings.firingError > 0) {
      const errorRadius = Math.max(settings.movementError, settings.firingError) * 10 * scale
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.arc(centerX, centerY, errorRadius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }

  }, [settings, width, height, scale, background])

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-700 rounded-lg"
          style={{ 
            width: width,
            height: height,
            imageRendering: 'crisp-edges'
          }}
        />
        {size === 'large' && (
          <div className="absolute top-2 left-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
            {width}×{height}
          </div>
        )}
      </div>
      
      {size === 'large' && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-400 mb-2">
            This is how your crosshair will look in-game
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Color: {settings.color}</span>
            <span>Style: {settings.innerLines ? 'Lines' : ''}{settings.centerDot ? ' + Dot' : ''}</span>
            <span>Outline: {settings.outlines ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrosshairPreview
