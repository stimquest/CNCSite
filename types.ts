
export enum ActivityCategory {
  SENSATIONS = 'Sensations',
  VOILE = 'Voile',
  JEUNESSE = 'Jeunesse',
  BIEN_ETRE = 'Bien-être',
  SECURITE = 'Sécurité'
}

export enum SpotStatus {
  OPEN = 'OPEN',
  RESTRICTED = 'RESTRICTED',
  CLOSED = 'CLOSED'
}

export interface WeatherData {
  temp: number;
  windSpeed: number; // knots
  windDirection: string;
  tideHigh: string;
  tideLow: string;
  coefficient: number;
  description: string;
}

export interface ActivityPrice {
  label: string;
  value: string;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  description: string;
  experience?: string;
  pedagogie?: string;
  logistique: string[];
  price?: string; 
  prices: ActivityPrice[]; 
  image: string;
  isTideDependent: boolean;
  bookingUrl: string;
  duration: string;
  minAge: number;
  accroche: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  publishedAt: string;
}

export interface TeamMember {
  name: string;
  role: string;
  category: 'bureau' | 'pro';
  diplome?: string;
  image: string;
}

export interface FleetItem {
  id?: string;
  name: string;
  subtitle: string;
  description: string;
  gallery: string[];
  stats: {
     speed: number;
     difficulty: number;
     adrenaline: number;
  };
  crew: string;
}

export type ActivityType = 'piscine' | 'optimist' | 'paddle' | 'char' | 'catamaran';

// --- STAGES (WeeklyPlanning) ---
export interface KidSession {
  time: string;
  activity: ActivityType;
  description?: string;
}

export interface DayEntry {
  _key: string;
  name: string; // "Lundi", "Mardi"...
  date: string; // ISO Date "2025-07-07"
  isRaidDay: boolean;
  raidTarget?: 'none' | 'initiation' | 'perfectionnement' | 'mousses' | 'miniMousses';
  miniMousses?: KidSession;
  mousses?: KidSession;
  initiation?: string; // "14h-17h" ou "Raid"
  perfectionnement?: string; // "14h-17h" ou "Raid"
}

export interface WeeklyPlanning {
  _id?: string;
  _type: 'weeklyPlanning';
  title: string;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  days: DayEntry[];
  isPublished: boolean;
}

// --- CHAR A VOILE (PlanningChar) ---
export interface CharSession {
  time: string; // "14h - 16h"
  _key: string;
}

export interface CharDay {
  _key: string;
  name: string; // "Lundi"
  date: string; // ISO Date
  sessions: CharSession[];
}

export interface CharWeek {
  _key: string;
  title: string; // "Semaine du..."
  startDate: string;
  endDate: string;
  days: CharDay[];
}

export interface PlanningCharAVoile {
  _id?: string;
  _type: 'planningCharAVoile';
  title: string; // "Vacances Printemps"
  startDate: string;
  endDate: string;
  weeks: CharWeek[];
}


export interface HomeGallery {
  title: string;
  subtitle: string;
  images: string[];
}

export interface NavItem {
  label: string;
  hash: string;
}

export enum SignageSlideType {
  WEATHER = 'WEATHER',
  VIDEO = 'VIDEO',
  PROMO = 'PROMO',
  PARTNERS = 'PARTNERS'
}
