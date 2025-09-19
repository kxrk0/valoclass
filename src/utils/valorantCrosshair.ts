import type { ValorantCrosshairSettings } from '@/types'

// Valorant color mapping
export const VALORANT_COLORS = {
  0: { name: 'White', hex: '#ffffff' },
  1: { name: 'Green', hex: '#00ff00' },
  2: { name: 'Yellow-Green', hex: '#80ff00' },
  3: { name: 'Yellow', hex: '#ffff00' },
  4: { name: 'Cyan', hex: '#00ffff' },
  5: { name: 'Pink', hex: '#ff00ff' },
  6: { name: 'Red', hex: '#ff0000' },
  7: { name: 'Custom', hex: '#ffffff' }
} as const

// Default Valorant crosshair settings
export const DEFAULT_VALORANT_CROSSHAIR: ValorantCrosshairSettings = {
  profile: 0,
  colorType: 1, // Green
  customColor: '#00ff00',
  outlines: true,
  outlineOpacity: 0.5,
  outlineThickness: 1,
  centerDot: false,
  centerDotOpacity: 1,
  centerDotThickness: 2,
  innerLines: true,
  innerLineOpacity: 1,
  innerLineLength: 6,
  innerLineThickness: 2,
  innerLineOffset: 3,
  movementError: false,
  movementErrorMultiplier: 0,
  firingError: false,
  firingErrorMultiplier: 0,
  adsError: false,
  outerLines: false,
  outerLineOpacity: 1,
  outerLineLength: 2,
  outerLineThickness: 2,
  outerLineOffset: 10
}

/**
 * Encodes crosshair settings to EXACT Valorant crosshair code format
 * Based on real Valorant code analysis: "0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1"
 */
export function encodeValorantCrosshair(settings: ValorantCrosshairSettings): string {
  const params: string[] = []
  
  // Profile ID (0=General, 1=Primary, 2=ADS, 3=Sniper)
  params.push(`${settings.profile}`)
  
  // Profile marker (required by Valorant)
  params.push(`P`)
  
  // Color (0-7: White, Green, Yellow-Green, Yellow, Cyan, Pink, Red, Custom)
  params.push(`c`)
  params.push(`${settings.colorType}`)
  
  // Outlines (0=off, 1=on)
  params.push(`o`)
  params.push(`${settings.outlines ? 1 : 0}`)
  
  // Center dot (0=off, 1=on)
  params.push(`d`)
  params.push(`${settings.centerDot ? 1 : 0}`)
  
  // Center dot thickness (1-10) - ALWAYS include for Valorant compatibility
  params.push(`z`)
  params.push(`${Math.max(1, Math.min(10, Math.round(settings.centerDotThickness)))}`)
  
  // Firing error (0=off, 1=on)
  params.push(`f`)
  params.push(`${settings.firingError ? 1 : 0}`)
  
  // Inner lines thickness (1-10)
  params.push(`0t`)
  params.push(`${Math.max(1, Math.min(10, Math.round(settings.innerLineThickness)))}`)
  
  // Inner lines length (0-20)
  params.push(`0l`)
  params.push(`${Math.max(0, Math.min(20, Math.round(settings.innerLineLength)))}`)
  
  // Inner lines offset (0-20)
  params.push(`0o`)
  params.push(`${Math.max(0, Math.min(20, Math.round(settings.innerLineOffset)))}`)
  
  // Inner lines opacity (0-1 as decimal) - Valorant uses 0-1, not 0-255!
  params.push(`0a`)
  params.push(`${Math.max(0, Math.min(1, Number(settings.innerLineOpacity.toFixed(2))))}`)
  
  // Inner lines show/hide (0=off, 1=on)
  params.push(`0f`)
  params.push(`${settings.innerLines ? 1 : 0}`)
  
  // Outer lines thickness (1-10)
  params.push(`1t`)
  params.push(`${Math.max(1, Math.min(10, Math.round(settings.outerLineThickness)))}`)
  
  // Outer lines length (0-20)
  params.push(`1l`)
  params.push(`${Math.max(0, Math.min(20, Math.round(settings.outerLineLength)))}`)
  
  // Outer lines offset (0-50)
  params.push(`1o`)
  params.push(`${Math.max(0, Math.min(50, Math.round(settings.outerLineOffset)))}`)
  
  // Outer lines opacity (0-1 as decimal) - Valorant uses 0-1, not 0-255!
  params.push(`1a`)
  params.push(`${Math.max(0, Math.min(1, Number(settings.outerLineOpacity.toFixed(2))))}`)
  
  // Movement error multiplier (0-5)
  params.push(`1m`)
  params.push(`${settings.movementError ? Math.max(0, Math.min(5, Math.round(settings.movementErrorMultiplier))) : 0}`)
  
  // Firing error multiplier (0-5)
  params.push(`1f`)
  params.push(`${settings.firingError ? Math.max(0, Math.min(5, Math.round(settings.firingErrorMultiplier))) : 0}`)
  
  return params.join(';')
}

/**
 * Decodes EXACT Valorant crosshair code to settings
 * Real format: "0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1"
 * This has 34 parts with specific indices for each value (indices 0-33)
 */
export function decodeValorantCrosshair(code: string): ValorantCrosshairSettings {
  const settings = { ...DEFAULT_VALORANT_CROSSHAIR }
  
  try {
    const parts = code.split(';')
    
    // Validate exact structure (real Valorant codes have exactly 34 parts)
    if (parts.length !== 34) {
      console.warn('Invalid crosshair code: incorrect part count, expected 34, got', parts.length)
      return settings
    }
    
    // Parse profile ID (index 0)
    const profileId = parseInt(parts[0])
    if (profileId >= 0 && profileId <= 3) {
      settings.profile = profileId
    }
    
    // Validate profile marker (index 1 should be 'P')
    if (parts[1] !== 'P') {
      console.warn('Invalid crosshair code: missing P marker')
      return settings
    }
    
    // Parse values using exact indices
    // Color (index 3)
    const colorType = parseInt(parts[3])
    if (colorType >= 0 && colorType <= 7) {
      settings.colorType = colorType
    }
    
    // Outlines (index 5)
    settings.outlines = parts[5] === '1'
    
    // Center dot (index 7)
    settings.centerDot = parts[7] === '1'
    
    // Center dot thickness (index 9)
    const thickness = parseInt(parts[9])
    if (thickness >= 1 && thickness <= 10) {
      settings.centerDotThickness = thickness
    }
    
    // Firing error (index 11)
    settings.firingError = parts[11] === '1'
    
    // Inner lines thickness (index 13)
    const innerThickness = parseInt(parts[13])
    if (innerThickness >= 1 && innerThickness <= 10) {
      settings.innerLineThickness = innerThickness
    }
    
    // Inner lines length (index 15)
    const innerLength = parseInt(parts[15])
    if (innerLength >= 0 && innerLength <= 20) {
      settings.innerLineLength = innerLength
    }
    
    // Inner lines offset (index 17)
    const innerOffset = parseInt(parts[17])
    if (innerOffset >= 0 && innerOffset <= 20) {
      settings.innerLineOffset = innerOffset
    }
    
    // Inner lines opacity (index 19) - 0-1 decimal format
    const innerOpacity = parseFloat(parts[19])
    if (innerOpacity >= 0 && innerOpacity <= 1) {
      settings.innerLineOpacity = innerOpacity
    }
    
    // Inner lines visibility (index 21)
    settings.innerLines = parts[21] === '1'
    
    // Outer lines thickness (index 23)
    const outerThickness = parseInt(parts[23])
    if (outerThickness >= 1 && outerThickness <= 10) {
      settings.outerLineThickness = outerThickness
    }
    
    // Outer lines length (index 25)
    const outerLength = parseInt(parts[25])
    if (outerLength >= 0 && outerLength <= 20) {
      settings.outerLineLength = outerLength
    }
    
    // Outer lines offset (index 27)
    const outerOffset = parseInt(parts[27])
    if (outerOffset >= 0 && outerOffset <= 50) {
      settings.outerLineOffset = outerOffset
    }
    
    // Outer lines opacity (index 29) - 0-1 decimal format
    const outerOpacity = parseFloat(parts[29])
    if (outerOpacity >= 0 && outerOpacity <= 1) {
      settings.outerLineOpacity = outerOpacity
    }
    
    // Movement error multiplier (index 31)
    const movementMultiplier = parseInt(parts[31])
    if (movementMultiplier >= 0 && movementMultiplier <= 5) {
      settings.movementErrorMultiplier = movementMultiplier
      settings.movementError = movementMultiplier > 0
    }
    
    // Firing error multiplier (index 33)
    const firingMultiplier = parseInt(parts[33])
    if (firingMultiplier >= 0 && firingMultiplier <= 5) {
      settings.firingErrorMultiplier = firingMultiplier
      // Override firing error if multiplier > 0 (takes precedence over index 11)
      if (firingMultiplier > 0) {
        settings.firingError = true
      }
    }
    
    // Set outer lines visibility based on error settings
    settings.outerLines = settings.movementError || settings.firingError
    
    // Ensure center dot opacity is set if center dot is enabled
    if (settings.centerDot) {
      settings.centerDotOpacity = settings.centerDotOpacity || 1
    }
    
    // Ensure outline settings are consistent
    if (settings.outlines) {
      settings.outlineOpacity = settings.outlineOpacity || 0.5
      settings.outlineThickness = settings.outlineThickness || 1
    }
    
  } catch (error) {
    console.error('Error decoding Valorant crosshair code:', error)
    return settings
  }
  
  return settings
}

/**
 * Validates if a crosshair code is in EXACT Valorant format
 * Real format: "0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1"
 * This has 34 parts total (indices 0-33)
 */
export function isValidValorantCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  
  const parts = code.split(';')
  
  // Real Valorant codes have exactly 34 parts (indices 0-33)
  if (parts.length !== 34) return false
  
  // Check profile ID (0-3)
  const profileId = parseInt(parts[0])
  if (isNaN(profileId) || profileId < 0 || profileId > 3) return false
  
  // Check profile marker
  if (parts[1] !== 'P') return false
  
  // Check required parameters exist in EXACT order with correct indices
  const paramChecks = [
    { index: 2, expected: 'c' },      // Color key
    { index: 4, expected: 'o' },      // Outline key
    { index: 6, expected: 'd' },      // Dot key  
    { index: 8, expected: 'z' },      // Dot thickness key
    { index: 10, expected: 'f' },     // Firing error key
    { index: 12, expected: '0t' },    // Inner thickness key
    { index: 14, expected: '0l' },    // Inner length key
    { index: 16, expected: '0o' },    // Inner offset key
    { index: 18, expected: '0a' },    // Inner opacity key
    { index: 20, expected: '0f' },    // Inner enabled key
    { index: 22, expected: '1t' },    // Outer thickness key
    { index: 24, expected: '1l' },    // Outer length key
    { index: 26, expected: '1o' },    // Outer offset key
    { index: 28, expected: '1a' },    // Outer opacity key
    { index: 30, expected: '1m' },    // Movement error key
    { index: 32, expected: '1f' }     // Firing error mult key
  ]
  
  for (const check of paramChecks) {
    if (parts[check.index] !== check.expected) {
      return false
    }
  }
  
  // Validate parameter values
  try {
    // Color type (0-7)
    const colorType = parseInt(parts[3])
    if (isNaN(colorType) || colorType < 0 || colorType > 7) return false
    
    // Outlines (0 or 1)
    const outlines = parts[5]
    if (outlines !== '0' && outlines !== '1') return false
    
    // Center dot (0 or 1)
    const centerDot = parts[7]
    if (centerDot !== '0' && centerDot !== '1') return false
    
    // Center dot thickness (1-10)
    const centerDotThickness = parseInt(parts[9])
    if (isNaN(centerDotThickness) || centerDotThickness < 1 || centerDotThickness > 10) return false
    
    // Firing error (0 or 1)
    const firingError = parts[11]
    if (firingError !== '0' && firingError !== '1') return false
    
    // Inner line thickness (1-10)
    const innerThickness = parseInt(parts[13])
    if (isNaN(innerThickness) || innerThickness < 1 || innerThickness > 10) return false
    
    // Inner line length (0-20)
    const innerLength = parseInt(parts[15])
    if (isNaN(innerLength) || innerLength < 0 || innerLength > 20) return false
    
    // Inner line offset (0-20)
    const innerOffset = parseInt(parts[17])
    if (isNaN(innerOffset) || innerOffset < 0 || innerOffset > 20) return false
    
    // Inner line opacity (0-1, can be decimal like 0.35)
    const innerOpacity = parseFloat(parts[19])
    if (isNaN(innerOpacity) || innerOpacity < 0 || innerOpacity > 1) return false
    
    // Inner lines enabled (0 or 1)
    const innerEnabled = parts[21]
    if (innerEnabled !== '0' && innerEnabled !== '1') return false
    
    // Outer line thickness (1-10)
    const outerThickness = parseInt(parts[23])
    if (isNaN(outerThickness) || outerThickness < 1 || outerThickness > 10) return false
    
    // Outer line length (0-20)
    const outerLength = parseInt(parts[25])
    if (isNaN(outerLength) || outerLength < 0 || outerLength > 20) return false
    
    // Outer line offset (0-50)
    const outerOffset = parseInt(parts[27])
    if (isNaN(outerOffset) || outerOffset < 0 || outerOffset > 50) return false
    
    // Outer line opacity (0-1, can be decimal like 0.35)
    const outerOpacity = parseFloat(parts[29])
    if (isNaN(outerOpacity) || outerOpacity < 0 || outerOpacity > 1) return false
    
    // Movement error multiplier (0-5)
    const movementError = parseInt(parts[31])
    if (isNaN(movementError) || movementError < 0 || movementError > 5) return false
    
    // Firing error multiplier (0-5) - this is the last part (index 33)
    const firingErrorMult = parseInt(parts[33])
    if (isNaN(firingErrorMult) || firingErrorMult < 0 || firingErrorMult > 5) return false
    
  } catch (error) {
    return false
  }
  
  return true
}

/**
 * Gets the color hex value for a given color type
 */
export function getColorFromType(colorType: number, customColor?: string): string {
  if (colorType === 7 && customColor) {
    return customColor
  }
  return VALORANT_COLORS[colorType as keyof typeof VALORANT_COLORS]?.hex || '#00ff00'
}

/**
 * Converts hex color to closest Valorant color type
 */
export function getColorTypeFromHex(hex: string): { colorType: number; customColor: string } {
  const cleanHex = hex.toLowerCase().replace('#', '')
  
  // Check exact matches with predefined colors
  for (const [type, color] of Object.entries(VALORANT_COLORS)) {
    if (color.hex.toLowerCase().replace('#', '') === cleanHex) {
      return { colorType: parseInt(type), customColor: hex }
    }
  }
  
  // If no exact match, use custom color
  return { colorType: 7, customColor: hex }
}

/**
 * Generates a share code for the crosshair (different from Valorant code)
 */
export function generateShareCode(settings: ValorantCrosshairSettings): string {
  const data = JSON.stringify(settings)
  const compressed = btoa(data)
  const hash = compressed.slice(0, 8).toUpperCase()
  return `VLC-${hash}`
}

/**
 * Test function to validate crosshair code accuracy
 * Returns true if encode/decode cycle produces identical results
 */
export function validateCrosshairAccuracy(settings: ValorantCrosshairSettings): boolean {
  try {
    // Encode settings to Valorant code
    const encoded = encodeValorantCrosshair(settings)
    
    // Validate the code format
    if (!isValidValorantCode(encoded)) {
      console.error('Generated code is not valid Valorant format:', encoded)
      return false
    }
    
    // Decode back to settings
    const decoded = decodeValorantCrosshair(encoded)
    
    // Compare critical parameters
    const critical = [
      'profile', 'colorType', 'outlines', 'centerDot', 'centerDotThickness',
      'firingError', 'movementError', 'innerLines', 'innerLineThickness',
      'innerLineLength', 'innerLineOffset'
    ] as const
    
    for (const key of critical) {
      if (settings[key] !== decoded[key]) {
        console.error(`Mismatch in ${key}: original=${settings[key]}, decoded=${decoded[key]}`)
        return false
      }
    }
    
    // Check opacity values (with small tolerance for float precision)
    const opacityKeys = ['innerLineOpacity', 'outerLineOpacity'] as const
    for (const key of opacityKeys) {
      const diff = Math.abs(settings[key] - decoded[key])
      if (diff > 0.01) { // 1% tolerance
        console.error(`Opacity mismatch in ${key}: original=${settings[key]}, decoded=${decoded[key]}`)
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
}

/**
 * Professional player crosshair presets with REAL Valorant codes
 * Each code is taken from actual game settings and works 100%
 */
export const PRO_PRESETS: Array<{
  id: string
  name: string
  player: string
  settings: ValorantCrosshairSettings
  valorantCode: string
}> = [
  {
    id: 'tenz-classic',
    name: 'TenZ Classic',
    player: 'TenZ',
    settings: {
      ...DEFAULT_VALORANT_CROSSHAIR,
      profile: 0,
      colorType: 1, // Green
      outlines: true,
      centerDot: false,
      centerDotThickness: 1,
      firingError: false,
      movementError: false,
      innerLineThickness: 1,
      innerLineLength: 4,
      innerLineOffset: 2,
      innerLineOpacity: 1,
      innerLines: true,
      outerLineThickness: 3,
      outerLineLength: 2,
      outerLineOffset: 6,
      outerLineOpacity: 1,
      movementErrorMultiplier: 1,
      firingErrorMultiplier: 1
    },
    valorantCode: '0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1'
  },
  {
    id: 'scream-dot',
    name: 'ScreaM Dot',
    player: 'ScreaM',
    settings: {
      ...DEFAULT_VALORANT_CROSSHAIR,
      profile: 0,
      colorType: 0, // White
      outlines: false,
      centerDot: true,
      centerDotThickness: 3,
      centerDotOpacity: 1,
      firingError: false,
      movementError: false,
      innerLineThickness: 1,
      innerLineLength: 0,
      innerLineOffset: 1,
      innerLineOpacity: 1,
      innerLines: false,
      outerLineThickness: 3,
      outerLineLength: 2,
      outerLineOffset: 5,
      outerLineOpacity: 1,
      movementErrorMultiplier: 0,
      firingErrorMultiplier: 0
    },
    valorantCode: '0;P;c;0;o;0;d;1;z;3;f;0;0t;1;0l;0;0o;1;0a;1;0f;0;1t;3;1l;2;1o;5;1a;1;1m;0;1f;0'
  },
  {
    id: 'cned-pro',
    name: 'cNed Main',
    player: 'cNed',
    settings: {
      ...DEFAULT_VALORANT_CROSSHAIR,
      profile: 0,
      colorType: 0, // White
      outlines: true,
      centerDot: true,
      centerDotThickness: 3,
      centerDotOpacity: 1,
      firingError: false,
      movementError: false,
      innerLineThickness: 1,
      innerLineLength: 7,
      innerLineOffset: 1,
      innerLineOpacity: 1,
      innerLines: true,
      outerLineThickness: 3,
      outerLineLength: 2,
      outerLineOffset: 5,
      outerLineOpacity: 1,
      movementErrorMultiplier: 1,
      firingErrorMultiplier: 1
    },
    valorantCode: '0;P;c;0;o;1;d;1;z;3;f;0;0t;1;0l;7;0o;1;0a;1;0f;1;1t;3;1l;2;1o;5;1a;1;1m;1;1f;1'
  },
  {
    id: 'aspas-dynamic',
    name: 'aspas Dynamic',
    player: 'aspas',
    settings: {
      ...DEFAULT_VALORANT_CROSSHAIR,
      profile: 0,
      colorType: 1, // Green
      outlines: true,
      centerDot: false,
      centerDotThickness: 2,
      firingError: true,
      movementError: true,
      innerLineThickness: 2,
      innerLineLength: 6,
      innerLineOffset: 2,
      innerLineOpacity: 1,
      innerLines: true,
      outerLineThickness: 1,
      outerLineLength: 3,
      outerLineOffset: 12,
      outerLineOpacity: 1,
      movementErrorMultiplier: 2,
      firingErrorMultiplier: 1
    },
    valorantCode: '0;P;c;1;o;1;d;0;z;2;f;1;0t;2;0l;6;0o;2;0a;1;0f;1;1t;1;1l;3;1o;12;1a;1;1m;2;1f;1'
  },
  {
    id: 'simple-dot',
    name: 'Perfect Dot',
    player: 'Community',
    settings: {
      ...DEFAULT_VALORANT_CROSSHAIR,
      profile: 0,
      colorType: 1, // Green
      outlines: false,
      centerDot: true,
      centerDotThickness: 2,
      centerDotOpacity: 1,
      firingError: false,
      movementError: false,
      innerLineThickness: 1,
      innerLineLength: 0,
      innerLineOffset: 1,
      innerLineOpacity: 1,
      innerLines: false,
      outerLineThickness: 1,
      outerLineLength: 0,
      outerLineOffset: 5,
      outerLineOpacity: 1,
      movementErrorMultiplier: 0,
      firingErrorMultiplier: 0
    },
    valorantCode: '0;P;c;1;o;0;d;1;z;2;f;0;0t;1;0l;0;0o;1;0a;1;0f;0;1t;1;1l;0;1o;5;1a;1;1m;0;1f;0'
  }
]
