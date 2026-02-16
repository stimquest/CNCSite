
export enum ActivityCategory {
  SENSATIONS = 'Sensations',
  VOILE = 'Voile',
  JEUNESSE = 'Jeunesse',
  BIEN_ETRE = 'Bien-être',
  SECURITE = 'Sécurité'
}

export enum SpotStatus {
  IDEAL = 'IDEAL',
  FAVORABLE = 'FAVORABLE',
  VARIABLE = 'VARIABLE',
  CRITICAL = 'CRITICAL',
  COMPROMISED = 'COMPROMISED',
  OPEN = 'OPEN',  // Legacy/Global
  RESTRICTED = 'RESTRICTED', // Legacy/Global
  CLOSED = 'CLOSED' // Legacy/Global
}

export interface TideData {
  timestamp: number;
  type: "height" | "extreme";
  height: number;
  status?: string;
}

export interface TideCoefficients {
  date: string;
  coef_1: number | null;
  coef_2: number | null;
}

export interface WeatherData {
  temp: number;
  windSpeed: number; // knots
  windDirection: string;
  tideHigh: string;
  tideLow: string;
  coefficient: number;
  description: string;
  waterTemp?: number;
  dominantWind?: string;
  gusts?: number;
  windBearing?: number;
  trend?: 'rising' | 'falling' | 'stable';
  weatherCode?: number;
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
  experience?: string | any[];
  pedagogie?: string;
  logistique: string[];
  price?: string;
  prices: ActivityPrice[];
  image: string;
  gallery?: string[];
  isTideDependent: boolean;
  bookingUrl: string;
  duration: string;
  minAge: number;
  accroche: string;
  planningNote?: string;
  actions?: {
    stage?: {
      isActive: boolean;
      type: 'link' | 'modal';
      url?: string;
      message?: any[];
    };
    reservation?: {
      isActive: boolean;
      type: 'link' | 'modal';
      url?: string;
      message?: any[];
    };
    rental?: {
      isActive: boolean;
      type: 'link' | 'modal';
      url?: string;
      message?: any[];
    };
  };
}

export interface NewsItem {
  _id: string;
  title: string;
  category: string;
  content?: string;
  externalLink?: string;
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

export interface MerchItem {
  _id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  hoverImage?: string;
  category: string;
  badge?: string;
}

export interface OccazItem {
  _id: string;
  name: string;
  price: string;
  condition: string;
  year: string;
  description: string;
  image: string;
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
  isPublished?: boolean;
  days: DayEntry[];
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

export interface PlanningMarche {
  _id?: string;
  _type: 'planningMarche';
  title: string;
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
  PROMO = 'PROMO',
  PARTNERS = 'PARTNERS',
  INFO = 'INFO'
}

export interface SignageSlide {
  _id: string;
  title: string;
  type: 'promo' | 'partners' | 'info';
  duration: number;
  order: number;
  isActive: boolean;
  promoContent?: {
    tag?: string;
    title?: string;
    description?: string;
    image?: string;
    showQrCode?: boolean;
  };
  partnersContent?: {
    title?: string;
    list?: { name: string; logo: string }[];
  };
  infoContent?: {
    title?: string;
    message?: string;
    category?: 'alert' | 'info' | 'event' | 'vibe';
  };
}

export interface InfoMessage {
  _id: string;
  title: string;
  content: string;
  category: 'alert' | 'weather' | 'info' | 'event' | 'vibe';
  targetGroups: string[];
  publishedAt: string;
  isPinned: boolean;
  externalLink?: string;
  sendPush?: boolean;
}

export interface VibeMessage {
  _id: string;
  title: string;
  subtitle: string;
  conditionType: 'default' | 'wind_high' | 'wind_low' | 'sunny' | 'tide_high' | 'tide_low' | 'storm';
  minWind?: number;
  maxWind?: number;
  windDirection?: string[];
  priority: number;
  isActive: boolean;
}

export interface PageHero {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
}

export interface ClubPageData {
  hero: PageHero;
  values: { title: string; description: string; iconName: string; }[];
  vision: { title: string; description: string; }[];
  managerQuote: string;
  facilities: string[];
  handicapLabel: string;
  membershipPrices: { label: string; price: string; }[];
  licensePrices: { label: string; price: string; }[];
}

export interface GroupsPageData {
  hero: PageHero;
  capacity: number;
  seminars: { title: string; description: string; features: string[]; };
  privateEvents: { title: string; description: string; features: string[]; };
}

export interface ActivitiesPageData {
  hero: PageHero;
}

export interface LeSpotPageData {
  hero: PageHero;
}

export interface NaturePageData {
  hero: PageHero;
  estran: {
    tag: string;
    title: string;
    description: string;
    marnageValue: string;
    marnageLabel: string;
    cards: {
      title: string;
      description: string;
      iconName: string;
      color: string;
    }[];
  };
  habitants: {
    tag: string;
    title: string;
    subtitle: string;
    list: {
      name: string;
      scientificName: string;
      image: string;
      tags: string[];
      tagColor: string;
      description: string;
      category?: string;
    }[];
  };
  peche: {
    tag: string;
    title: string;
    sizes: { label: string; value: string; }[];
    toolsDescription: string;
    securityTitle: string;
    securityDescription: string;
    securityTip: string;
  };
  observations: {
    id: string;
    title: string;
    type: string;
    description: string;
    tip: string;
    coordinates: { lat: number; lng: number; };
    images: string[];
  }[];
  exploration: {
    tag: string;
    title: string;
    description: string;
    cards: {
      title: string;
      subtitle: string;
      description: string;
      image: string;
      features: string[];
      buttonText: string;
      buttonLink: string;
    }[];
  };
}

// --- AUTO CONDITIONS ---
export interface ActivityThresholds {
  wind?: { closedBelow?: number; restrictedBelow?: number; restrictedAbove?: number; closedAbove?: number };
  gusts?: { restrictedAbove?: number; closedAbove?: number };
  waveHeight?: { restrictedAbove?: number; closedAbove?: number };
  wavePeriod?: { restrictedAbove?: number; closedAbove?: number };
  cape?: { closedAbove?: number };
  visibility?: { closedBelow?: number; restrictedBelow?: number };
  waterTemp?: { restrictedBelow?: number; closedBelow?: number };
}

export interface ActivityMessages {
  wind_low?: string; wind_high?: string;
  wind_restricted_low?: string; wind_restricted_high?: string;
  waves?: string; storm?: string; visibility?: string;
  waterTemp?: string; ok: string;
}

export interface AutoConditionActivity {
  enabled: boolean;
  thresholds: ActivityThresholds;
  messages: ActivityMessages;
}

export interface AutoConditionsConfig {
  enabled: boolean;
  checkHour: number;
  lastCheck: string | null;
  lastCheckResult: Record<string, { status: string; message: string; tags?: string[]; causes?: string[]; details?: any }> | null;
  manualOverride: boolean;
  activities: {
    char: AutoConditionActivity;
    nautique: AutoConditionActivity;
    marche: AutoConditionActivity;
  };
}

export interface FocusSection {
  title: string;
  highlightSuffix: string;
  tagline: string;
  subTagline: string;
  description: string;
  badgeValue: string;
  badgeLabel: string;
  images: any[]; // Using any[] for Sanity image objects for now, or define Image
  ctaButton: { text: string; link: string };
  infoButton: { text: string; link: string };
}

export interface HomePageData {
  hero: {
    title: string;
    images: string[];
  };
  spirit: {
    title: string;
    message: string;
    description: string;
    cards: {
      tag: string;
      title: string;
      description: string;
      image: string;
      link: string;
      buttonText: string;
      iconName: string;
      colorTheme: 'turquoise' | 'orange' | 'purple';
    }[];
  };
  featuredActivities: {
    title: string;
    tagline: string;
    description: string;
    image: string;
    ctaLabel: string;
    ctaLink: string;
    badge: string;
  }[];
  partners: {
    name: string;
    logo: string;
    link: string;
  }[];
  focusChar?: FocusSection;
  focusGlisse?: FocusSection;
  focusBienEtre?: FocusSection;
}
