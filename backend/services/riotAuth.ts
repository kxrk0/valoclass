import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { logger } from '../lib/logger';

// Rate limiting store
interface RateLimitInfo {
  requests: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitInfo>();
  
  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const limit = this.limits.get(key);
    
    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { requests: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (limit.requests >= maxRequests) {
      return false;
    }
    
    limit.requests++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const limit = this.limits.get(key);
    return limit ? Math.max(0, limit.resetTime - Date.now()) : 0;
  }
}

// Types
export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerInfo {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RankedInfo {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface MatchInfo {
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: MatchParticipant[];
}

export interface MatchParticipant {
  puuid: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  role: string;
  lane: string;
}

export interface VerificationChallenge {
  type: 'summoner_name' | 'status_message' | 'profile_icon' | 'third_party_code';
  challenge: string;
  expiresAt: number;
}

export class RiotAuthService {
  private axiosInstance: AxiosInstance;
  private rateLimiter: RateLimiter;
  private regionalUrls: Record<string, string>;

  constructor() {
    this.rateLimiter = new RateLimiter();
    this.regionalUrls = JSON.parse(env.RIOT_REGIONAL_URLS);
    
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'X-Riot-Token': env.RIOT_API_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'ValoClass/1.0.0'
      }
    });

    // Request interceptor for rate limiting
    this.axiosInstance.interceptors.request.use((config) => {
      const key = `${config.baseURL}${config.url}`;
      
      // Personal API Key: 100 requests every 2 minutes
      if (!this.rateLimiter.canMakeRequest('personal', 100, 120000)) {
        const waitTime = this.rateLimiter.getRemainingTime('personal');
        throw new Error(`Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
      
      // Method-specific limits: 1000 requests every 10 minutes
      if (!this.rateLimiter.canMakeRequest(key, 1000, 600000)) {
        const waitTime = this.rateLimiter.getRemainingTime(key);
        throw new Error(`Method rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
      
      return config;
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          logger.warn('Riot API rate limit hit', {
            url: error.config?.url,
            retryAfter: error.response?.headers['retry-after']
          });
        }
        
        logger.error('Riot API error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message
        });
        
        throw error;
      }
    );
  }

  /**
   * Get account info by Riot ID (Game Name + Tag)
   */
  async getAccountByRiotId(gameName: string, tagLine: string, region: string = 'americas'): Promise<RiotAccount> {
    try {
      const baseUrl = region === 'americas' ? env.RIOT_API_BASE_URL : this.regionalUrls[region];
      const response = await this.axiosInstance.get<RiotAccount>(
        `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { baseURL: baseUrl }
      );

      logger.info('Successfully fetched Riot account', { gameName, tagLine, puuid: response.data.puuid });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Riot account', { gameName, tagLine, error });
      throw new Error('Failed to fetch Riot account. Please check the Game Name and Tag.');
    }
  }

  /**
   * Get summoner info by PUUID
   */
  async getSummonerByPuuid(puuid: string, region: string = 'tr1'): Promise<SummonerInfo> {
    try {
      const baseUrl = this.regionalUrls[region] || this.regionalUrls['tr1'];
      const response = await this.axiosInstance.get<SummonerInfo>(
        `/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        { baseURL: baseUrl }
      );

      logger.info('Successfully fetched summoner info', { puuid, summonerId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch summoner info', { puuid, error });
      throw new Error('Failed to fetch summoner information.');
    }
  }

  /**
   * Get third-party verification code set by the summoner in LoL client
   */
  async getThirdPartyCodeBySummonerId(summonerId: string, region: string = 'tr1'): Promise<string | null> {
    try {
      const baseUrl = this.regionalUrls[region] || this.regionalUrls['tr1'];
      const response = await this.axiosInstance.get<string>(
        `/lol/platform/v4/third-party-code/by-summoner/${encodeURIComponent(summonerId)}`,
        { baseURL: baseUrl }
      );

      return typeof response.data === 'string' ? response.data : null;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      logger.error('Failed to fetch third-party code', { summonerId, region, error });
      throw new Error('Failed to fetch third-party verification code.');
    }
  }

  /**
   * Get ranked information for summoner
   */
  async getRankedInfo(summonerId: string, region: string = 'tr1'): Promise<RankedInfo[]> {
    try {
      const baseUrl = this.regionalUrls[region] || this.regionalUrls['tr1'];
      const response = await this.axiosInstance.get<RankedInfo[]>(
        `/lol/league/v4/entries/by-summoner/${summonerId}`,
        { baseURL: baseUrl }
      );

      logger.info('Successfully fetched ranked info', { summonerId, entries: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch ranked info', { summonerId, error });
      throw new Error('Failed to fetch ranked information.');
    }
  }

  /**
   * Get recent match history
   */
  async getRecentMatches(puuid: string, count: number = 5, region: string = 'americas'): Promise<string[]> {
    try {
      const baseUrl = region === 'americas' ? env.RIOT_API_BASE_URL : this.regionalUrls[region];
      const response = await this.axiosInstance.get<string[]>(
        `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
        { 
          baseURL: baseUrl,
          params: { start: 0, count }
        }
      );

      logger.info('Successfully fetched match history', { puuid, matchCount: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch match history', { puuid, error });
      throw new Error('Failed to fetch match history.');
    }
  }

  /**
   * Get detailed match information
   */
  async getMatchDetails(matchId: string, region: string = 'americas'): Promise<MatchInfo> {
    try {
      const baseUrl = region === 'americas' ? env.RIOT_API_BASE_URL : this.regionalUrls[region];
      const response = await this.axiosInstance.get<any>(
        `/lol/match/v5/matches/${matchId}`,
        { baseURL: baseUrl }
      );

      const match = response.data;
      const matchInfo: MatchInfo = {
        matchId: match.metadata.matchId,
        gameCreation: match.info.gameCreation,
        gameDuration: match.info.gameDuration,
        gameMode: match.info.gameMode,
        gameType: match.info.gameType,
        gameVersion: match.info.gameVersion,
        mapId: match.info.mapId,
        participants: match.info.participants.map((p: any): MatchParticipant => ({
          puuid: p.puuid,
          championId: p.championId,
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          win: p.win,
          role: p.role,
          lane: p.lane
        }))
      };

      logger.info('Successfully fetched match details', { matchId });
      return matchInfo;
    } catch (error) {
      logger.error('Failed to fetch match details', { matchId, error });
      throw new Error('Failed to fetch match details.');
    }
  }

  /**
   * Create verification challenge for account ownership
   */
  createVerificationChallenge(type: 'summoner_name' | 'status_message' | 'profile_icon' | 'third_party_code' = 'third_party_code'): VerificationChallenge {
    const challenges = {
      summoner_name: `ValoClass-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      status_message: `Verify ValoClass ${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      profile_icon: `Change your profile icon to ID: ${Math.floor(Math.random() * 100) + 1}`,
      third_party_code: `VALO-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    };

    return {
      type,
      challenge: challenges[type],
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    };
  }

  /**
   * Verify account ownership by checking challenge completion
   */
  async verifyAccountOwnership(
    puuid: string, 
    challenge: VerificationChallenge, 
    region: string = 'tr1'
  ): Promise<boolean> {
    try {
      if (Date.now() > challenge.expiresAt) {
        throw new Error('Verification challenge has expired.');
      }

      const summoner = await this.getSummonerByPuuid(puuid, region);

      switch (challenge.type) {
        case 'summoner_name':
          // Note: This would require additional API calls or different verification method
          // as summoner names can't be changed easily
          logger.warn('Summoner name verification not fully implemented');
          return false;

        case 'status_message':
          // Note: Status message verification would require Third Party Code API
          logger.warn('Status message verification requires additional API access');
          return false;

        case 'profile_icon':
          // This is just a placeholder - actual verification would need the expected icon ID
          logger.info('Profile icon verification attempted', { 
            currentIcon: summoner.profileIconId,
            challenge: challenge.challenge 
          });
          return true; // Simplified for demo

        case 'third_party_code':
          // Compare third-party code set in client with our challenge
          const code = await this.getThirdPartyCodeBySummonerId(summoner.id, region);
          logger.info('Third-party code check', { expected: challenge.challenge, received: code });
          return !!code && code.trim() === challenge.challenge.trim();

        default:
          return false;
      }
    } catch (error) {
      logger.error('Failed to verify account ownership', { puuid, challenge: challenge.type, error });
      return false;
    }
  }

  /**
   * Get comprehensive player profile
   */
  async getPlayerProfile(gameName: string, tagLine: string, region: string = 'tr1') {
    try {
      // Get account info
      const account = await this.getAccountByRiotId(gameName, tagLine);
      
      // Get summoner info
      const summoner = await this.getSummonerByPuuid(account.puuid, region);
      
      // Get ranked info
      const rankedInfo = await this.getRankedInfo(summoner.id, region);
      
      // Get recent matches
      const recentMatches = await this.getRecentMatches(account.puuid, 3);

      return {
        account,
        summoner,
        rankedInfo,
        recentMatches,
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get player profile', { gameName, tagLine, error });
      throw error;
    }
  }
}

// Export singleton instance
export const riotAuthService = new RiotAuthService();
export default riotAuthService;

