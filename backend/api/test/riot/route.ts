import { NextRequest, NextResponse } from 'next/server'
import { getRiotAccountByRiotId, validateRiotAPIKey } from '@/services/riotAPI'

export async function GET(request: NextRequest) {
  try {
    // API anahtarını test et
    const isValidKey = await validateRiotAPIKey()
    
    if (!isValidKey) {
      return NextResponse.json({ 
        error: 'Invalid Riot API Key',
        message: 'Please check your RIOT_API_KEY in environment variables'
      }, { status: 401 })
    }

    // Test account ile API'yi test et
    const testAccount = await getRiotAccountByRiotId('SomeTestUser', 'EUW')
    
    return NextResponse.json({
      message: 'Riot API Key is valid',
      apiKeyValid: true,
      testResult: testAccount ? 'Test account found' : 'Test account not found (this is normal)',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Riot API test error:', error)
    return NextResponse.json({
      error: 'Failed to test Riot API',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gameName, tagLine } = await request.json()

    if (!gameName || !tagLine) {
      return NextResponse.json({
        error: 'Missing parameters',
        message: 'gameName and tagLine are required'
      }, { status: 400 })
    }

    const account = await getRiotAccountByRiotId(gameName, tagLine)

    if (!account) {
      return NextResponse.json({
        error: 'Account not found',
        message: 'Riot account not found with the provided Riot ID'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      account: {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine
      }
    })

  } catch (error) {
    console.error('Riot ID lookup error:', error)
    return NextResponse.json({
      error: 'Failed to lookup Riot ID',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
