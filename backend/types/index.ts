// Backend-specific Types
import { Request } from 'express';

// Authentication Types
export interface AuthResponse {
  user: SafeUser;
  token: string;
  refreshToken?: string;
}

export interface SafeUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  riotId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// User Role Types
export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

// Database Model Types (matching Prisma schema)
export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  riotId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  crosshairs: DatabaseCrosshair[];
  lineups: DatabaseLineup[];
}

export interface DatabaseCrosshair {
  id: string;
  name: string;
  shareCode: string;
  settings: any; // JSON field
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: DatabaseUser;
  likes: DatabaseCrosshairLike[];
}

export interface DatabaseLineup {
  id: string;
  title: string;
  description: string;
  agent: string;
  ability: string;
  map: string;
  side: string;
  position: any; // JSON field
  instructions: string[];
  images: string[];
  videoUrl?: string;
  tags: string[];
  difficulty: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: DatabaseUser;
  likes: DatabaseLineupLike[];
}

export interface DatabaseCrosshairLike {
  id: string;
  userId: string;
  crosshairId: string;
  createdAt: Date;
  user: DatabaseUser;
  crosshair: DatabaseCrosshair;
}

export interface DatabaseLineupLike {
  id: string;
  userId: string;
  lineupId: string;
  createdAt: Date;
  user: DatabaseUser;
  lineup: DatabaseLineup;
}

// API Request/Response Types
export interface CreateCrosshairRequest {
  name: string;
  settings: any;
  isPublic: boolean;
}

export interface UpdateCrosshairRequest {
  name?: string;
  settings?: any;
  isPublic?: boolean;
}

export interface CreateLineupRequest {
  title: string;
  description: string;
  agent: string;
  ability: string;
  map: string;
  side: 'attacker' | 'defender';
  position: any;
  instructions: string[];
  images: string[];
  videoUrl?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UpdateLineupRequest {
  title?: string;
  description?: string;
  agent?: string;
  ability?: string;
  map?: string;
  side?: 'attacker' | 'defender';
  position?: any;
  instructions?: string[];
  images?: string[];
  videoUrl?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Riot API Types
export interface RiotAccountInfo {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotPlayerStats {
  currenttier: number;
  currenttierpatched: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  elo: number;
}

// Enhanced Riot Types
export interface RiotSummonerInfo {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotRankedInfo {
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

export interface RiotVerificationChallenge {
  type: 'summoner_name' | 'status_message' | 'profile_icon';
  challenge: string;
  expiresAt: number;
  userId: string;
  puuid: string;
  createdAt: number;
}

// API Request Types
export interface RiotSearchRequest {
  gameName: string;
  tagLine: string;
  region?: string;
}

export interface RiotVerificationStartRequest {
  puuid: string;
  verificationType?: 'summoner_name' | 'status_message' | 'profile_icon';
}

export interface RiotVerificationCompleteRequest {
  puuid: string;
  region?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Middleware Types
export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter Types
export interface CrosshairFilters {
  search?: string;
  createdBy?: string;
  isPublic?: boolean;
  orderBy?: 'createdAt' | 'likes' | 'name';
}

export interface LineupFilters {
  search?: string;
  agent?: string;
  map?: string;
  side?: 'attacker' | 'defender';
  difficulty?: 'easy' | 'medium' | 'hard';
  createdBy?: string;
  orderBy?: 'createdAt' | 'likes' | 'title';
}

// OAuth Types
export interface OAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface OAuthUserInfo {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}
