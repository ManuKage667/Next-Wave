export enum Position {
  GK = 'GK',
  CB = 'CB',
  LB = 'LB',
  RB = 'RB',
  CDM = 'CDM',
  CM = 'CM',
  CAM = 'CAM',
  LW = 'LW',
  RW = 'RW',
  ST = 'ST'
}

export interface Nationality {
  country: string;
  code: string; // ISO 2-letter code (e.g., 'FR', 'ES') for flags
}

export interface SeasonStat {
  season: string;
  club: string;
  competition: string;
  appearances: number;
  goals: number;
  assists: number;
}

export interface NationalStat {
  caps: number;
  goals: number;
  assists: number;
}

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: number; // in cm
  nationalities: Nationality[];
  strongFoot: 'Droit' | 'Gauche' | 'Ambidextre';
  
  // Position changes
  primaryPosition: Position;
  secondaryPositions: Position[];
  
  club: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  progressionArea: string; // Axe de progression
  videoUrl?: string; // YouTube embed URL
  uploadedVideo?: string; // Base64 string for local video file
  stats: PlayerStats;
  seasonStats: SeasonStat[];
  nationalStats: NationalStat; // New field for National Team
  potential: number; // 1 to 5 stars
  imageUrl?: string;
}

export const INITIAL_STATS: PlayerStats = {
  pace: 50,
  shooting: 50,
  passing: 50,
  dribbling: 50,
  defending: 50,
  physical: 50
};