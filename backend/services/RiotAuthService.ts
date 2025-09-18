import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { env } from '../config/env';
import { logger } from '../lib/logger';

// ===== TYPE DEFINITIONS =====
export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface ValorantRank {
  tier: number;
  tierName: string;
  division: string;
  leaderboardRank?: number;
  competitivePoints: number;
}

export interface PlayerMatchHistory {
  matchId: string;
  gameStart: number;
  teamId: 'Red' | 'Blue';
  characterId: string;
  kills: number;
  deaths: number;
  assists: number;
  won: boolean;
}

export interface RiotProfile {
  account: RiotAccount;
  rank?: ValorantRank;
  recentMatches?: PlayerMatchHistory[];
  accountLevel?: number;
  region: string;
}

export interface AuthResult {
  success: boolean;
  profile?: RiotProfile;
  token?: string;
  error?: string;
  message: string;
}

// ===== RATE LIMITING =====
class SimpleRateLimiter {
  private requests: number = 0;
  private resetTime: number = 0;
  private readonly maxRequests: number = 90; // Personal API key limit
  private readonly windowMs: number = 120000; // 2 minutes

  canMakeRequest(): boolean {
    const now = Date.now();
    
    if (now > this.resetTime) {
      this.requests = 0;
      this.resetTime = now + this.windowMs;
    }

    if (this.requests >= this.maxRequests) {
      return false;
    }

    this.requests++;
    return true;
  }

  getWaitTime(): number {
    return Math.max(0, this.resetTime - Date.now());
  }
}

// ===== MAIN SERVICE CLASS =====
export class RiotAuthService {
  private readonly client: AxiosInstance;
  private readonly rateLimiter: SimpleRateLimiter;
  private readonly baseUrls = {
    americas: 'https://americas.api.riotgames.com',
    asia: 'https://asia.api.riotgames.com', 
    europe: 'https://europe.api.riotgames.com',
    // Regional endpoints
    na1: 'https://na1.api.riotgames.com',
    euw1: 'https://euw1.api.riotgames.com',
    eune1: 'https://eune1.api.riotgames.com',
    tr1: 'https://tr1.api.riotgames.com',
    kr: 'https://kr.api.riotgames.com',
    jp1: 'https://jp1.api.riotgames.com'
  };

  constructor() {
    this.rateLimiter = new SimpleRateLimiter();
    
    this.client = axios.create({
      timeout: 15000,
      headers: {
        'X-Riot-Token': env.RIOT_API_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'ValoClass/2.0 (https://valoclass.com)',
        'Accept': 'application/json'
      }
    });

    // Request interceptor for rate limiting
    this.client.interceptors.request.use((config) => {
      if (!this.rateLimiter.canMakeRequest()) {
        const waitTime = Math.ceil(this.rateLimiter.getWaitTime() / 1000);
        throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        
        logger.error('Riot API Error', {
          status,
          url,
          message: error.message,
          data: error.response?.data
        });

        switch (status) {
          case 400:
            throw new Error('Invalid request. Please check your input.');
          case 401:
            throw new Error('Unauthorized. Invalid API key.');
          case 403:
            throw new Error('Forbidden. Access denied.');
          case 404:
            throw new Error('Player not found. Please check Game Name and Tag.');
          case 429:
            const retryAfter = error.response?.headers['retry-after'];
            throw new Error(`Rate limited. Try again in ${retryAfter || '60'} seconds.`);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error('Riot services are temporarily unavailable. Please try again later.');
          default:
            throw new Error('Failed to connect to Riot services.');
        }
      }
    );
  }

  // ===== CORE API METHODS =====

  /**
   * Search for a Riot account by Game Name and Tag Line
   */
  async searchAccount(gameName: string, tagLine: string): Promise<RiotAccount> {
    this.validateInputs(gameName, tagLine);

    try {
      const response = await this.client.get<RiotAccount>(
        `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { baseURL: this.baseUrls.americas }
      );

      const account = response.data;
      
      if (!account.puuid || !account.gameName || !account.tagLine) {
        throw new Error('Invalid account data received from Riot API.');
      }

      logger.info('Account found successfully', { 
        gameName: account.gameName, 
        tagLine: account.tagLine,
        puuid: account.puuid
      });

      return account;
    } catch (error) {
      logger.warn('Account search failed', { gameName, tagLine, error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Get basic Valorant profile information
   * Note: Limited public endpoints available for Valorant
   */
  async getPlayerProfile(account: RiotAccount, region: string = 'tr1'): Promise<RiotProfile> {
    try {
      // For now, return basic profile with account info
      // In future, add rank and match history when endpoints become available
      const profile: RiotProfile = {
        account,
        region,
        accountLevel: 1, // Default, actual level requires different endpoint
        // rank: undefined, // Requires competitive API access
        // recentMatches: undefined // Requires match API access
      };

      logger.info('Profile created', { 
        puuid: account.puuid,
        region 
      });

      return profile;
    } catch (error) {
      logger.warn('Profile creation failed', { 
        puuid: account.puuid, 
        error: (error as Error).message 
      });
      throw new Error('Failed to create player profile');
    }
  }

  /**
   * Authenticate user with Riot credentials
   * This is a simplified auth flow - in production you'd integrate with your user system
   */
  async authenticatePlayer(gameName: string, tagLine: string, region: string = 'tr1'): Promise<AuthResult> {
    try {
      logger.info('Starting Riot authentication', { gameName, tagLine, region });

      // Step 1: Search for account
      const account = await this.searchAccount(gameName, tagLine);

      // Step 2: Get profile data
      const profile = await this.getPlayerProfile(account, region);

      // Step 3: Generate session token (simplified)
      const token = this.generateSessionToken(profile);

      logger.info('Authentication successful', { 
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine
      });

      return {
        success: true,
        profile,
        token,
        message: `Welcome, ${account.gameName}#${account.tagLine}! 🎮`
      };

    } catch (error) {
      const errorMessage = (error as Error).message;
      
      logger.error('Authentication failed', { 
        gameName, 
        tagLine, 
        region,
        error: errorMessage 
      });

      return {
        success: false,
        error: errorMessage,
        message: 'Authentication failed'
      };
    }
  }

  /**
   * Validate account search (without authentication)
   */
  async validateAccount(gameName: string, tagLine: string): Promise<{ success: boolean; account?: RiotAccount; error?: string }> {
    try {
      const account = await this.searchAccount(gameName, tagLine);
      return {
        success: true,
        account
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // ===== HELPER METHODS =====

  private validateInputs(gameName: string, tagLine: string): void {
    if (!gameName || !tagLine) {
      throw new Error('Game Name and Tag Line are required');
    }

    if (typeof gameName !== 'string' || typeof tagLine !== 'string') {
      throw new Error('Game Name and Tag Line must be strings');
    }

    if (gameName.length < 3 || gameName.length > 16) {
      throw new Error('Game Name must be between 3-16 characters');
    }

    if (tagLine.length < 2 || tagLine.length > 5) {
      throw new Error('Tag Line must be between 2-5 characters');
    }

    // Basic format validation
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(gameName)) {
      throw new Error('Game Name contains invalid characters');
    }

    if (!/^[a-zA-Z0-9]+$/.test(tagLine)) {
      throw new Error('Tag Line can only contain letters and numbers');
    }
  }

  private generateSessionToken(profile: RiotProfile): string {
    // Simplified token generation - in production use proper JWT
    const tokenData = {
      puuid: profile.account.puuid,
      gameName: profile.account.gameName,
      tagLine: profile.account.tagLine,
      region: profile.region,
      timestamp: Date.now()
    };

    // In production: return JWT.sign(tokenData, secret)
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }

  // ===== STATIC HELPERS =====

  static isValidRegion(region: string): boolean {
    const validRegions = ['americas', 'asia', 'europe', 'na1', 'euw1', 'eune1', 'tr1', 'kr', 'jp1'];
    return validRegions.includes(region);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[^\w\s\-_.]/g, '');
  }
}

// Export singleton instance
export const riotAuthService = new RiotAuthService();
export default riotAuthService;
