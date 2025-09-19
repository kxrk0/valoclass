import { NextRequest, NextResponse } from 'next/server'
import type { SharedCrosshair } from '@/types'

// In-memory storage for demo (replace with actual database when Prisma is ready)
// This will simulate a real database with proper CRUD operations
let communityCrosshairs: SharedCrosshair[] = []

// Initialize with some sample data
const initializeSampleData = (): SharedCrosshair[] => {
  const authors = ['TenZ', 'ShahZam', 'Sick', 'dapr', 'zombs', 'ScreaM', 'Mixwell', 'cNed', 'Derke', 'Chronicle']
  const names = ['Pro Style', 'Clutch Master', 'Precision', 'Classic', 'Dynamic', 'Minimal', 'Bold', 'Sharp', 'Clean', 'Steady']
  const tags = ['precise', 'dynamic', 'minimal', 'pro', 'classic', 'modern', 'small', 'large', 'colorful', 'clean']
  const categories = ['general', 'primary', 'ads', 'sniper'] as const

  return Array.from({ length: 50 }, (_, i) => ({
    id: `crosshair-${i + 1}`,
    name: `${names[i % names.length]} ${Math.floor(Math.random() * 100) + 1}`,
    description: i % 3 === 0 ? 'Perfect for competitive play with excellent visibility and precision aiming.' : undefined,
    author: authors[i % authors.length],
    authorId: `user-${i % authors.length}`,
    settings: {
      profile: 0,
      colorType: Math.floor(Math.random() * 8),
      customColor: '#ff0000',
      outlines: Math.random() > 0.5,
      outlineOpacity: Math.random(),
      outlineThickness: Math.floor(Math.random() * 5) + 1,
      centerDot: Math.random() > 0.5,
      centerDotOpacity: 1,
      centerDotThickness: Math.floor(Math.random() * 10) + 1,
      innerLines: Math.random() > 0.3,
      innerLineOpacity: Math.random(),
      innerLineLength: Math.floor(Math.random() * 20),
      innerLineThickness: Math.floor(Math.random() * 10) + 1,
      innerLineOffset: Math.floor(Math.random() * 20),
      movementError: Math.random() > 0.7,
      movementErrorMultiplier: Math.floor(Math.random() * 5),
      firingError: Math.random() > 0.7,
      firingErrorMultiplier: Math.floor(Math.random() * 5),
      adsError: false,
      outerLines: Math.random() > 0.8,
      outerLineOpacity: Math.random(),
      outerLineLength: Math.floor(Math.random() * 20),
      outerLineThickness: Math.floor(Math.random() * 10) + 1,
      outerLineOffset: Math.floor(Math.random() * 45) + 5
    },
    valorantCode: '0;P;c;1;o;1;d;0;z;1;f;0;0t;1;0l;4;0o;2;0a;1;0f;1;1t;3;1l;2;1o;6;1a;1;1m;1;1f;1',
    category: categories[i % categories.length],
    tags: tags.slice(0, Math.floor(Math.random() * 4) + 1),
    likes: Math.floor(Math.random() * 1000) + 10,
    downloads: Math.floor(Math.random() * 5000) + 50,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
    featured: Math.random() > 0.9,
    region: ['NA', 'EU', 'APAC', 'BR'][Math.floor(Math.random() * 4)],
    rank: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'][Math.floor(Math.random() * 9)]
  }))
}

// Initialize sample data on first load
if (communityCrosshairs.length === 0) {
  communityCrosshairs = initializeSampleData()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '24')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filtered = [...communityCrosshairs]

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(crosshair =>
        crosshair.name.toLowerCase().includes(searchLower) ||
        crosshair.author.toLowerCase().includes(searchLower) ||
        crosshair.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        crosshair.description?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(crosshair => crosshair.category === category)
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Paginate
    const total = filtered.length
    const paginatedResults = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      crosshairs: paginatedResults,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      stats: {
        totalCrosshairs: communityCrosshairs.length,
        totalLikes: communityCrosshairs.reduce((sum, c) => sum + c.likes, 0),
        totalDownloads: communityCrosshairs.reduce((sum, c) => sum + c.downloads, 0)
      }
    })
  } catch (error) {
    console.error('Error fetching community crosshairs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crosshairs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, tags, settings, valorantCode, isPublic, category } = body

    if (!name || !settings || !valorantCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newCrosshair: SharedCrosshair = {
      id: `crosshair-${Date.now()}`,
      name,
      description,
      author: 'Anonymous User', // In real app, get from auth
      authorId: 'user-anonymous',
      settings,
      valorantCode,
      category: category || 'general',
      tags: tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      likes: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: isPublic !== false,
      featured: false
    }

    communityCrosshairs.unshift(newCrosshair)

    return NextResponse.json({
      success: true,
      crosshair: newCrosshair,
      message: 'Crosshair shared successfully!'
    })
  } catch (error) {
    console.error('Error sharing crosshair:', error)
    return NextResponse.json(
      { error: 'Failed to share crosshair' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const crosshairIndex = communityCrosshairs.findIndex(c => c.id === id)
    if (crosshairIndex === -1) {
      return NextResponse.json(
        { error: 'Crosshair not found' },
        { status: 404 }
      )
    }

    const crosshair = communityCrosshairs[crosshairIndex]

    switch (action) {
      case 'like':
        crosshair.likes += 1
        break
      case 'unlike':
        crosshair.likes = Math.max(0, crosshair.likes - 1)
        break
      case 'download':
        crosshair.downloads += 1
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    crosshair.updatedAt = new Date().toISOString()
    communityCrosshairs[crosshairIndex] = crosshair

    return NextResponse.json({
      success: true,
      crosshair,
      message: `Crosshair ${action}d successfully!`
    })
  } catch (error) {
    console.error('Error updating crosshair:', error)
    return NextResponse.json(
      { error: 'Failed to update crosshair' },
      { status: 500 }
    )
  }
}
