// Riot Games API Service
const RIOT_API_KEY = process.env.RIOT_API_KEY || 'RGAPI-c8b0dfbe-aab0-470b-911e-ce40139d7d5e'

export interface RiotAccount {
  puuid: string
  gameName: string
  tagLine: string
}

export interface RiotProfile {
  puuid: string
  gameName: string
  tagLine: string
  region: string
  accountLevel?: number
}

export interface ValorantRank {
  tier: number
  tierName: string
  division: number
  rank: number
  elo: number
}

// Riot Account API - PUUID ile account bilgilerini al
export async function getRiotAccountByPuuid(puuid: string, region: string = 'europe'): Promise<RiotAccount | null> {
  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch Riot account: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Riot account:', error)
    return null
  }
}

// Riot Account API - Riot ID ile account bilgilerini al
export async function getRiotAccountByRiotId(gameName: string, tagLine: string, region: string = 'europe'): Promise<RiotAccount | null> {
  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch Riot account: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Riot account by Riot ID:', error)
    return null
  }
}

// Valorant API - Player data
export async function getValorantPlayerData(puuid: string, region: string = 'eu'): Promise<any> {
  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch Valorant data: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Valorant player data:', error)
    return null
  }
}

// Valorant API - Player MMR (rank)
export async function getValorantPlayerMMR(puuid: string, region: string = 'eu'): Promise<ValorantRank | null> {
  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/val/ranked/v1/leaderboards/by-act/latest?puuid=${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch Valorant MMR: ${response.status}`)
    }

    const data = await response.json()
    
    // Rank tier names
    const rankTiers = [
      'Unranked', 'Iron', 'Bronze', 'Silver', 'Gold', 
      'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'
    ]

    return {
      tier: data.tier || 0,
      tierName: rankTiers[data.tier] || 'Unranked',
      division: data.leaderboardRank || 0,
      rank: data.rankedRating || 0,
      elo: data.rankedRating || 0
    }
  } catch (error) {
    console.error('Error fetching Valorant MMR:', error)
    return null
  }
}

// League of Legends API - Summoner data
export async function getLeaguePlayerData(puuid: string, region: string = 'euw1'): Promise<any> {
  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Failed to fetch League data: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching League player data:', error)
    return null
  }
}

// Comprehensive player profile
export async function getPlayerProfile(puuid: string): Promise<RiotProfile | null> {
  try {
    const account = await getRiotAccountByPuuid(puuid)
    if (!account) return null

    const valorantData = await getValorantPlayerData(puuid)
    const leagueData = await getLeaguePlayerData(puuid)

    return {
      puuid: account.puuid,
      gameName: account.gameName,
      tagLine: account.tagLine,
      region: 'europe',
      accountLevel: leagueData?.summonerLevel || undefined
    }
  } catch (error) {
    console.error('Error fetching comprehensive player profile:', error)
    return null
  }
}

// Validate Riot API Key
export async function validateRiotAPIKey(): Promise<boolean> {
  try {
    const response = await fetch(
      'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/TestUser/EUW',
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    )

    // 401 = Invalid API key, 404 = Valid API key but user not found
    return response.status !== 401
  } catch (error) {
    console.error('Error validating Riot API key:', error)
    return false
  }
}
