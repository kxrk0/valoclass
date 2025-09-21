import { NextRequest, NextResponse } from 'next/server'
import { valorantWebScraper } from '@/services/valorantWebScraper'

// Valorant Updates API endpoint - Now using real web scraping
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    console.log('🔄 API: Fetching real Valorant updates from official site...')
    
    let updates
    
    if (search) {
      updates = await valorantWebScraper.searchUpdates(search)
      console.log(`🔍 API: Found ${updates.length} updates for search: "${search}"`)
    } else if (category) {
      updates = await valorantWebScraper.getUpdatesByCategory(category)
      console.log(`📂 API: Found ${updates.length} updates for category: "${category}"`)
    } else {
      updates = await valorantWebScraper.scrapeUpdates()
      console.log(`📋 API: Found ${updates.length} total updates`)
    }
    
    return NextResponse.json({
      success: true,
      updates: updates,
      lastUpdated: new Date().toISOString(),
      count: updates.length,
      source: 'playvalorant.com/en-us/news/game-updates'
    })
  } catch (error) {
    console.error('❌ API Error fetching Valorant updates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch updates from official source',
        updates: [],
        count: 0,
        source: 'fallback'
      },
      { status: 500 }
    )
  }
}


// POST endpoint to manually trigger update refresh from official site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { forceUpdate } = body

    if (forceUpdate) {
      console.log('🔄 API: Manual refresh triggered - fetching fresh data from official site')
      
      // Force refresh cache and get fresh data
      const updates = await valorantWebScraper.refreshData()
      
      console.log(`✅ API: Successfully refreshed ${updates.length} updates from playvalorant.com`)
      
      return NextResponse.json({
        success: true,
        message: 'Updates refreshed successfully from official source',
        updates: updates,
        lastUpdated: new Date().toISOString(),
        count: updates.length,
        source: 'playvalorant.com/en-us/news/game-updates'
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid request - forceUpdate parameter required'
    }, { status: 400 })
  } catch (error) {
    console.error('❌ API Error in POST /api/valorant-updates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh updates from official source',
        source: 'error'
      },
      { status: 500 }
    )
  }
}
