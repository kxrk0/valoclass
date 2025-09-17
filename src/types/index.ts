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
  createdBy?: string;
  createdAt: Date;
  settings: CrosshairSettings;
  shareCode: string;
  likes: number;
  isPublic: boolean;
}

export interface CrosshairSettings {
  color: string;
  outlines: boolean;
  outlineOpacity: number;
  outlineThickness: number;
  centerDot: boolean;
  centerDotOpacity: number;
  centerDotThickness: number;
  innerLines: boolean;
  innerLineOpacity: number;
  innerLineLength: number;
  innerLineThickness: number;
  innerLineOffset: number;
  outerLines: boolean;
  outerLineOpacity: number;
  outerLineLength: number;
  outerLineThickness: number;
  outerLineOffset: number;
  movementError: number;
  firingError: number;
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
