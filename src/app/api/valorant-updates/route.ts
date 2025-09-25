import { NextRequest, NextResponse } from 'next/server'
import { valorantWebScraper } from '@/services/valorantWebScraper'

// Valorant Updates API endpoint - Now using real web scraping with language support
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const lang = searchParams.get('lang') || 'en'
    
    // Language detection from Accept-Language header if not provided
    const language = (lang === 'tr' ? 'tr' : 'en') as 'en' | 'tr'
    const acceptLanguage = request.headers.get('accept-language') || ''
    const detectedLang = acceptLanguage.includes('tr') && !searchParams.get('lang') ? 'tr' : language
    
    console.log(`🔄 API: Fetching real Valorant updates from official site (${detectedLang})...`)
    
    let updates
    const sourceUrl = detectedLang === 'tr' 
      ? 'playvalorant.com/tr-tr/news/game-updates'
      : 'playvalorant.com/en-us/news/game-updates'
    
    if (search) {
      updates = await valorantWebScraper.searchUpdates(search, detectedLang)
      console.log(`🔍 API: Found ${updates.length} updates for search: "${search}" (${detectedLang})`)
    } else if (category) {
      updates = await valorantWebScraper.getUpdatesByCategory(category, detectedLang)
      console.log(`📂 API: Found ${updates.length} updates for category: "${category}" (${detectedLang})`)
    } else {
      updates = await valorantWebScraper.scrapeUpdates(detectedLang)
      console.log(`📋 API: Found ${updates.length} total updates (${detectedLang})`)
    }
    
    return NextResponse.json({
      success: true,
      updates: updates,
      lastUpdated: new Date().toISOString(),
      count: updates.length,
      source: sourceUrl,
      language: detectedLang
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
    const { forceUpdate, language } = body
    
    // Language detection
    const detectedLang = (language === 'tr' ? 'tr' : 'en') as 'en' | 'tr'
    const sourceUrl = detectedLang === 'tr' 
      ? 'playvalorant.com/tr-tr/news/game-updates'
      : 'playvalorant.com/en-us/news/game-updates'

    if (forceUpdate) {
      console.log(`🔄 API: Manual refresh triggered - fetching fresh data from official site (${detectedLang})`)
      
      // Force refresh cache and get fresh data
      const updates = await valorantWebScraper.refreshData(detectedLang)
      
      console.log(`✅ API: Successfully refreshed ${updates.length} updates from ${sourceUrl}`)
      
      return NextResponse.json({
        success: true,
        message: 'Updates refreshed successfully from official source',
        updates: updates,
        lastUpdated: new Date().toISOString(),
        count: updates.length,
        source: sourceUrl,
        language: detectedLang
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
