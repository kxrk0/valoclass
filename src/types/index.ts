// Agent Types
export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  characterTags: string[];
  displayIcon: string;
  displayIconSmall: string;
  bustPortrait: string;
  fullPortrait: string;
  killfeedPortrait: string;
  background: string;
  role: AgentRole;
  abilities: Ability[];
}

export interface AgentRole {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
}

export interface Ability {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string;
}

// Crosshair Types
export interface Crosshair {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: ValorantCrosshairSettings;
  shareCode: string;
  valorantCode: string;
  tags: string[];
  likes: number;
  downloads: number;
  isPublic: boolean;
  featured: boolean;
  category: 'general' | 'primary' | 'ads' | 'sniper';
}

export interface ValorantCrosshairSettings {
  // Profile (0 = general, 1 = primary, 2 = ADS, 3 = sniper)
  profile: number;
  
  // Basic Settings
  colorType: number; // 0 = white, 1 = green, 2 = yellow-green, 3 = yellow, 4 = cyan, 5 = pink, 6 = red, 7 = custom
  customColor: string; // hex color for custom (colorType 7)
  
  // Outlines
  outlines: boolean;
  outlineOpacity: number; // 0-1
  outlineThickness: number; // 0-5
  
  // Center Dot
  centerDot: boolean;
  centerDotOpacity: number; // 0-1
  centerDotThickness: number; // 1-10
  
  // Inner Lines
  innerLines: boolean;
  innerLineOpacity: number; // 0-1
  innerLineLength: number; // 0-20
  innerLineThickness: number; // 1-10
  innerLineOffset: number; // 0-20
  
  // Movement Error (dynamic crosshair)
  movementError: boolean;
  movementErrorMultiplier: number; // 0-5
  
  // Firing Error (dynamic crosshair)
  firingError: boolean;
  firingErrorMultiplier: number; // 0-5
  
  // ADS (Aim Down Sight) specific
  adsError: boolean;
  
  // Outer Lines (for dynamic crosshair)
  outerLines: boolean;
  outerLineOpacity: number; // 0-1
  outerLineLength: number; // 0-20
  outerLineThickness: number; // 1-10
  outerLineOffset: number; // 5-50
}

// Legacy crosshair settings for backward compatibility
export interface CrosshairSettings {
  // All ValorantCrosshairSettings properties
  profile: number;
  colorType: number;
  customColor: string;
  
  // Outlines
  outlines: boolean;
  outlineOpacity: number;
  outlineThickness: number;
  
  // Center Dot
  centerDot: boolean;
  centerDotOpacity: number;
  centerDotThickness: number;
  
  // Inner Lines
  innerLines: boolean;
  innerLineOpacity: number;
  innerLineLength: number;
  innerLineThickness: number;
  innerLineOffset: number;
  
  // Movement Error (legacy as number)
  movementError: number; // deprecated, use movementErrorMultiplier and movementError boolean
  movementErrorMultiplier: number;
  
  // Firing Error (legacy as number)
  firingError: number; // deprecated, use firingErrorMultiplier and firingError boolean
  firingErrorMultiplier: number;
  
  // ADS (Aim Down Sight) specific
  adsError: boolean;
  
  // Outer Lines
  outerLines: boolean;
  outerLineOpacity: number;
  outerLineLength: number;
  outerLineThickness: number;
  outerLineOffset: number;
  
  // Legacy properties
  color: string; // deprecated, use colorType and customColor instead
}

export interface CrosshairPreset {
  id: string;
  name: string;
  description: string;
  settings: ValorantCrosshairSettings;
  valorantCode: string;
  category: 'pro' | 'popular' | 'custom';
  tags: string[];
  createdBy?: string;
}

export interface CrosshairProfile {
  general: ValorantCrosshairSettings;
  primary: ValorantCrosshairSettings;
  ads: ValorantCrosshairSettings;
  sniper: ValorantCrosshairSettings;
}

export interface SharedCrosshair {
  id: string;
  name: string;
  description?: string;
  author: string;
  authorId?: string;
  settings: ValorantCrosshairSettings;
  valorantCode: string;
  category: 'general' | 'primary' | 'ads' | 'sniper';
  tags: string[];
  likes: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  featured?: boolean;
  region?: string;
  rank?: string;
}

// Lineup Types
export interface Lineup {
  id: string;
  title: string;
  description: string;
  agent: string;
  ability: string;
  map: string;
  side: 'attacker' | 'defender';
  position: LineupPosition;
  instructions: string[];
  images: string[];
  videoUrl?: string;
  createdBy: string;
  createdAt: Date;
  tags: string[];
  likes: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LineupPosition {
  x: number;
  y: number;
  angle: number;
  description: string;
}

// Map Types
export interface Map {
  uuid: string;
  displayName: string;
  coordinates: string;
  displayIcon: string;
  listViewIcon: string;
  splash: string;
  stylizedDevName: string;
  premierBackgroundImage: string;
  tacticalDescription: string;
  callouts: Callout[];
}

export interface Callout {
  regionName: string;
  superRegionName: string;
  location: {
    x: number;
    y: number;
  };
}

// User Types
export interface User {
  id: string;
  username: string;
  avatar?: string;
  riotId?: string;
  joinDate: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  newLineups: boolean;
  crosshairUpdates: boolean;
}

export interface UserStats {
  lineupsCreated: number;
  crosshairsCreated: number;
  totalLikes: number;
  joinDate: Date;
}

// Player Stats Types
export interface PlayerStats {
  puuid: string;
  gameName: string;
  tagLine: string;
  card: PlayerCard;
  accountLevel: number;
  currenttier: number;
  currenttierpatched: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  elo: number;
  region: string;
  updated_at: string;
}

export interface PlayerCard {
  small: string;
  large: string;
  wide: string;
  id: string;
}

export interface MatchHistory {
  data: Match[];
  status: number;
  name: string;
  tag: string;
  results: {
    total: number;
    returned: number;
    before: number;
    after: number;
  };
}

export interface Match {
  meta: MatchMeta;
  stats: MatchStats;
  teams: {
    red: Team;
    blue: Team;
  };
}

export interface MatchMeta {
  id: string;
  map: {
    id: string;
    name: string;
  };
  version: string;
  mode: string;
  started_at: string;
  season: {
    id: string;
    short: string;
  };
  region: string;
  cluster: string;
}

export interface MatchStats {
  puuid: string;
  team: string;
  level: number;
  character: {
    id: string;
    name: string;
  };
  tier: number;
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  shots: {
    head: number;
    body: number;
    leg: number;
  };
  damage: {
    made: number;
    received: number;
  };
}

export interface Team {
  has_won: boolean;
  rounds_won: number;
  rounds_lost: number;
  players: TeamPlayer[];
}

export interface TeamPlayer {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  level: number;
  character: {
    id: string;
    name: string;
  };
  currenttier: number;
  currenttier_patched: string;
  player_card: {
    id: string;
    small: string;
    large: string;
    wide: string;
  };
  player_title: {
    id: string;
    title: string;
  };
  party_id: string;
  session_playtime: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  assets: {
    card: {
      small: string;
      large: string;
      wide: string;
    };
    agent: {
      small: string;
      full: string;
      bust: string;
      killfeed: string;
    };
  };
  behaviour: {
    afk_rounds: number;
    friendly_fire: {
      incoming: number;
      outgoing: number;
    };
    rounds_in_spawn: number;
  };
  platform: {
    type: string;
    os: {
      name: string;
      version: string;
    };
  };
  ability_casts: {
    c_cast: number;
    q_cast: number;
    e_cast: number;
    x_cast: number;
  };
  stats: MatchStats;
  economy: {
    spent: {
      overall: number;
      average: number;
    };
    loadout_value: {
      overall: number;
      average: number;
    };
  };
  damage_made: number;
  damage_received: number;
}

// API Response Types
export interface ApiResponse<T> {
  status: number;
  data: T;
  error?: string;
}
