export interface SignageTimelineItem {
  _key: string;
  source: 'weather' | 'agenda' | 'slide';
  slideId?: string;
  duration: number;
}

export interface SignageSettings {
  weatherEnabled: boolean;
  agendaEnabled: boolean;
  customEnabled: boolean;
  weatherDuration: number;
  agendaDuration: number;
  timeline?: SignageTimelineItem[];
}

export const SIGNAGE_SETTINGS_ID = 'signage-settings';
export const DEFAULT_SIGNAGE_SETTINGS: SignageSettings = {
  weatherEnabled: true,
  agendaEnabled: true,
  customEnabled: true,
  weatherDuration: 20000,
  agendaDuration: 25000,
};

export function normalizeSignageSettings(value?: Partial<SignageSettings> | null): SignageSettings {
  const duration = (input: unknown, fallback: number) => typeof input === 'number' && Number.isFinite(input)
    ? Math.max(5000, Math.min(120000, Math.round(input / 1000) * 1000)) : fallback;
  return {
    weatherEnabled: typeof value?.weatherEnabled === 'boolean' ? value.weatherEnabled : true,
    agendaEnabled: typeof value?.agendaEnabled === 'boolean' ? value.agendaEnabled : true,
    customEnabled: typeof value?.customEnabled === 'boolean' ? value.customEnabled : true,
    weatherDuration: duration(value?.weatherDuration, 20000),
    agendaDuration: duration(value?.agendaDuration, 25000),
    ...(Array.isArray(value?.timeline) ? { timeline: value.timeline.filter(item => item && typeof item._key === 'string'
      && ['weather', 'agenda', 'slide'].includes(item.source) && Number.isInteger(item.duration)
      && item.duration >= 1000 && item.duration <= 600000
      && (item.source !== 'slide' || typeof item.slideId === 'string')) } : {}),
  };
}

export function buildSignageSequence<T extends { type: string; duration: number; isActive: boolean; order: number; _id?: string }>(slides: T[], settings: SignageSettings) {
  const result: { key: string; type: string; duration: number; data?: T }[] = [];
  if (settings.timeline) {
    settings.timeline.forEach(item => {
      if (item.source === 'slide') {
        const slide = slides.find(slide => slide._id === item.slideId && slide.isActive);
        if (slide) result.push({ key: item._key, type: slide.type.toUpperCase(), duration: item.duration, data: slide });
      } else {
        result.push({ key: item._key, type: item.source === 'weather' ? 'WEATHER' : 'AGENDA', duration: item.duration });
      }
    });
    return result;
  }
  const weather = (key: string) => { if (settings.weatherEnabled) result.push({ key, type: 'WEATHER', duration: settings.weatherDuration }); };
  const agenda = (key: string) => { if (settings.agendaEnabled) result.push({ key, type: 'AGENDA', duration: settings.agendaDuration }); };
  const active = settings.customEnabled ? slides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order) : [];
  if (!active.length) {
    weather('weather');
    agenda('agenda');
    return result;
  }
  active.forEach((slide, index) => {
    weather(`weather-${slide._id || index}`);
    result.push({ key: slide._id || `custom-${index}`, type: slide.type.toUpperCase(), duration: Math.max(5000, slide.duration || 15000), data: slide });
    if ((index + 1) % 2 === 0) agenda(`agenda-${index}`);
  });
  if (!result.some(item => item.type === 'AGENDA')) agenda('agenda');
  return result;
}
