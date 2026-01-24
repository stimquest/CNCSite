
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
  category: ActivityCategory;
  accroche: string;
  description: string; // Utilisé pour le texte général ou Sauvetage
  experience?: string;
  pedagogie?: string;
  logistique: string[];
  prices: ActivityPrice[];
  minAge: number;
  image: string;
  isTideDependent: boolean;
  planningNote?: string;
  bookingUrl: string;
  duration: string;
  price: string;
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
