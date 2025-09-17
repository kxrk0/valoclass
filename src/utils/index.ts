import { clsx, type ClassValue } from 'clsx'

// Utility function for conditional classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format numbers with proper separators
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format dates relative to now
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }
  
  return date.toLocaleDateString()
}

// Validate Riot ID format
export function validateRiotId(riotId: string): { isValid: boolean; gameName?: string; tagLine?: string; error?: string } {
  if (!riotId || !riotId.includes('#')) {
    return { isValid: false, error: 'Riot ID must include # symbol' }
  }
  
  const parts = riotId.split('#')
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid Riot ID format' }
  }
  
  const [gameName, tagLine] = parts
  
  if (!gameName || gameName.length < 3 || gameName.length > 16) {
    return { isValid: false, error: 'Game name must be 3-16 characters' }
  }
  
  if (!tagLine || tagLine.length < 3 || tagLine.length > 5) {
    return { isValid: false, error: 'Tag line must be 3-5 characters' }
  }
  
  return { isValid: true, gameName, tagLine }
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Copy to clipboard utility
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackErr) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Handle storage errors silently
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // Handle storage errors silently
    }
  }
}

// URL utilities
export function createShareUrl(type: 'crosshair' | 'lineup', id: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://valoclass.com'
  return `${baseUrl}/${type}s/${id}`
}

// Image utilities
export function optimizeImageUrl(url: string, width?: number, quality = 75): string {
  // This would integrate with your image optimization service
  if (!url) return ''
  
  // For development, return as-is
  if (url.startsWith('/')) {
    return url
  }
  
  // Add optimization parameters for external images
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  params.set('q', quality.toString())
  
  return `${url}?${params.toString()}`
}

// Agent role utilities
export function getAgentRoleColor(role: string): string {
  switch (role.toLowerCase()) {
    case 'duelist':
      return 'text-red-400'
    case 'initiator':
      return 'text-blue-400'
    case 'controller':
      return 'text-purple-400'
    case 'sentinel':
      return 'text-green-400'
    default:
      return 'text-gray-400'
  }
}

// Rank utilities
export function getRankInfo(tier: number): { name: string; color: string; division?: number } {
  if (tier >= 24) return { name: 'Radiant', color: 'text-red-400' }
  if (tier >= 21) return { name: 'Immortal', color: 'text-purple-400', division: tier - 20 }
  if (tier >= 15) return { name: 'Diamond', color: 'text-blue-400', division: tier - 14 }
  if (tier >= 9) return { name: 'Platinum', color: 'text-cyan-400', division: tier - 8 }
  if (tier >= 3) return { name: 'Gold', color: 'text-yellow-400', division: tier - 2 }
  if (tier >= 1) return { name: 'Silver', color: 'text-gray-400', division: tier }
  return { name: 'Bronze', color: 'text-orange-400', division: tier + 3 }
}

// Performance utilities
export function measurePerformance(name: string) {
  if (typeof window === 'undefined') return () => {}
  
  const start = performance.now()
  return () => {
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
  }
}
