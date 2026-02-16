"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_WEATHER, ACTIVITIES, STATUS_MESSAGE, CURRENT_STATUS } from '../constants';
import { Activity, WeatherData, SpotStatus, NewsItem, TeamMember, FleetItem, WeeklyPlanning, PlanningCharAVoile, PlanningMarche, HomeGallery, MerchItem, OccazItem, InfoMessage, TideData, VibeMessage, ClubPageData, GroupsPageData, ActivitiesPageData, LeSpotPageData, NaturePageData, HomePageData, SignageSlide } from '../types';
import { client } from '../lib/sanity';
import { fetchRealtimeWeather } from '../lib/weather';

interface ContentState {
  weather: WeatherData;
  activities: Activity[];
  statusMessage: string;
  spotStatus: SpotStatus;
  news: NewsItem[];
  team: TeamMember[];
  fleet: FleetItem[];
  plannings: WeeklyPlanning[];
  charPlannings: PlanningCharAVoile[];
  marchePlannings: PlanningMarche[];
  homeGallery: HomeGallery | null;
  merchItems: MerchItem[];
  occazItems: OccazItem[];
  infoMessages: InfoMessage[];
  tides: TideData[];

  charStatus: SpotStatus;
  charMessage: string;
  charTags: string[];

  marcheStatus: SpotStatus;
  marcheMessage: string;
  marcheTags: string[];

  nautiqueStatus: SpotStatus;
  nautiqueMessage: string;
  nautiqueTags: string[];

  vibeMessages: VibeMessage[];
  clubData: ClubPageData | null;
  groupsData: GroupsPageData | null;
  activitiesData: ActivitiesPageData | null;
  leSpotData: LeSpotPageData | null;
  natureData: NaturePageData | null;
  homePageData: HomePageData | null;
  signageSlides: SignageSlide[];
}

interface ContentContextType extends ContentState {
  currentVibe: VibeMessage | null;
  updateWeather: (data: WeatherData) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  updateStatus: (status: SpotStatus, message: string) => void;

  setSpotStatus: React.Dispatch<React.SetStateAction<SpotStatus>>;
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;

  setCharStatus: React.Dispatch<React.SetStateAction<SpotStatus>>;
  setCharMessage: React.Dispatch<React.SetStateAction<string>>;
  setCharTags: React.Dispatch<React.SetStateAction<string[]>>;

  setMarcheStatus: React.Dispatch<React.SetStateAction<SpotStatus>>;
  setMarcheMessage: React.Dispatch<React.SetStateAction<string>>;
  setMarcheTags: React.Dispatch<React.SetStateAction<string[]>>;

  setNautiqueStatus: React.Dispatch<React.SetStateAction<SpotStatus>>;
  setNautiqueMessage: React.Dispatch<React.SetStateAction<string>>;
  setNautiqueTags: React.Dispatch<React.SetStateAction<string[]>>;

  resetToDefaults: () => void;
  saveToLocal: () => void;
  refreshData: () => Promise<void>;
  fetchFromSanity: () => Promise<void>;
  lastUpdated: number | null;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const queries = {
  activities: `*[_type == "activity" && !(_id in path('drafts.**'))] | order(order asc, title asc) {
        id,
        title,
        category,
        description,
        pedagogie,
        experience,
        logistique,
        price,
        "prices": prices[]{ label, value },
        "image": image.asset->url,
        "gallery": gallery[].asset->url,
        isTideDependent,
        bookingUrl,
        duration,
        minAge,
        accroche,
        planningNote,
        actions
    }`,
  settings: `*[_type == "spotSettings"][0] {
        spotStatus,
        statusMessage,
        charStatus,
        charMessage,
        charTags,
        marcheStatus,
        marcheMessage,
        marcheTags,
        nautiqueStatus,
        nautiqueMessage,
        nautiqueTags
    }`,
  news: `*[_type == "news"] | order(publishedAt desc) {
        _id,
        title,
        category,
        content,
        externalLink,
        date,
        publishedAt
    }`,
  team: `*[_type == "teamMember"] {
        name,
        role,
        category,
        diplome,
        "image": image.asset->url
    }`,
  fleet: `*[_type == "fleetItem"] {
        id,
        name,
        subtitle,
        description,
        "gallery": gallery[].asset->url,
        stats,
        crew
    }`,
  plannings: `*[_type == "weeklyPlanning"] | order(startDate asc) {
        _id,
        title,
        startDate,
        endDate,
        days[] {
            _key,
            name,
            date,
            isRaidDay,
            miniMousses { time, activity, description },
            mousses { time, activity, description },
            initiation,
            perfectionnement
        }
    }`,
  charPlannings: `*[_type == "planningCharAVoile"] | order(startDate asc) {
        _id,
        title,
        startDate,
        endDate,
        weeks[] {
            _key,
            title,
            startDate,
            endDate,
            days[] {
                _key,
                name,
                date,
                sessions[] {
                    _key,
                    time
                }
            }
        }
    }`,
  marchePlannings: `*[_type == "planningMarche"] | order(startDate asc) {
        _id,
        title,
        startDate,
        endDate,
        weeks[] {
            _key,
            title,
            startDate,
            endDate,
            days[] {
                _key,
                name,
                date,
                sessions[] {
                    _key,
                    time
                }
            }
        }
    }`,
  homeGallery: `* [_type == "homeGallery"][0] {
  title,
    subtitle,
    "images": images[].asset -> url
} `,
  merchItems: `* [_type == "merchItem"] {
  _id,
    name,
    price,
    description,
    category,
    badge,
    "image": image.asset -> url
} `,
  occazItems: `* [_type == "occazItem"] {
  _id,
    name,
    price,
    condition,
    year,
    description,
    "image": image.asset -> url
} `,
  infoMessages: `* [_type == "infoMessage"] | order(publishedAt desc) {
  _id,
    title,
    content,
    category,
    isPinned,
    externalLink,
    publishedAt
} `,
  vibeMessages: `* [_type == "vibeMessage" && isActive == true] | order(priority desc) {
  _id,
    title,
    subtitle,
    conditionType,
    minWind,
    maxWind,
    windDirection,
    priority,
    isActive
} `,
  clubPage: `*[_type == "clubPage"][0] {
    "hero": { 
      "title": hero.title, 
      "subtitle": hero.subtitle, 
      "description": hero.description, 
      "heroImage": hero.heroImage.asset->url 
    },
    values,
    vision,
    managerQuote,
    facilities,
    handicapLabel,
    membershipPrices,
    licensePrices
  }`,
  homePage: `*[_type == "homePage"][0] {
    "hero": { 
      "title": heroTitle,
      "images": heroImages[].asset->url
    },
    "spirit": {
      "title": spiritTitle,
      "message": spiritMessage,
      "description": spiritDescription,
      "cards": spiritCards[] {
        tag,
        title,
        description,
        "image": image.asset->url,
        link,
        buttonText,
        iconName,
        colorTheme
      }
    },
    "featuredActivities": featuredActivities[] {
        title, tagline, description, "image": image.asset->url, ctaLabel, ctaLink, badge
    },
    "partners": partners[] { name, "logo": logo.asset->url, link },
    "focusChar": focusChar {
        title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel,
        "images": images[].asset->url, ctaButton, infoButton
    },
    "focusGlisse": focusGlisse {
        title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel,
        "images": images[].asset->url, ctaButton, infoButton
    },
    "focusBienEtre": focusBienEtre {
        title, highlightSuffix, tagline, subTagline, description, badgeValue, badgeLabel,
        "images": images[].asset->url, ctaButton, infoButton
    }
  }`,
  groupsPage: `*[_type == "groupsPage"][0] {
    "hero": { 
      "title": hero.title, 
      "subtitle": hero.subtitle, 
      "description": hero.description, 
      "heroImage": hero.heroImage.asset->url 
    },
    capacity,
    seminars,
    privateEvents
  }`,
  activitiesPage: `* [_type == "activitiesPage"][0] {
        hero { title, subtitle, "heroImage": heroImage.asset -> url }
} `,
  leSpotPage: `*[_type == "leSpotPage"][0] {
        hero { title, subtitle, "heroImage": heroImage.asset->url }
    }`,
  naturePage: `*[_type == "naturePage"][0] {
        hero { title, subtitle, description, "heroImage": heroImage.asset->url },
        estran {
            tag, title, description, marnageValue, marnageLabel,
            cards[] { title, description, iconName, color }
        },
        "habitants": {
            "tag": habitants.tag,
            "title": habitants.title,
            "subtitle": habitants.subtitle,
            "list": *[_type == "natureEntity"] | order(name asc) {
                name, scientificName, "image": image.asset->url, tags, tagColor, description, category
            }
        },
        peche {
            tag, title, sizes[] { label, value },
            toolsDescription, securityTitle, securityDescription, securityTip
        },
        observations[] {
            id, title, type, description, tip,
            coordinates { lat, lng },
            "images": images[].asset->url
        },
        exploration {
            tag, title, description,
            cards[] {
                title, subtitle, description, "image": cardImage.asset->url,
                features, buttonText, buttonLink
            }
        }
    }`,
  signageSlides: `*[_type == "signageSlide" && isActive == true] | order(order asc) {
    _id, title, type, duration, order, isActive,
    promoContent {
      tag, title, description, showQrCode,
      "image": image.asset->url
    },
    partnersContent {
      title,
      list[] { name, "logo": logo.asset->url }
    },
    infoContent {
      title, message, category
    }
  }`
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [statusMessage, setStatusMessage] = useState<string>(STATUS_MESSAGE);
  const [spotStatus, setSpotStatus] = useState<SpotStatus>(CURRENT_STATUS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [plannings, setPlannings] = useState<WeeklyPlanning[]>([]);
  const [charPlannings, setCharPlannings] = useState<PlanningCharAVoile[]>([]);
  const [marchePlannings, setMarchePlannings] = useState<PlanningMarche[]>([]);
  const [homeGallery, setHomeGallery] = useState<HomeGallery | null>(null);
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [occazItems, setOccazItems] = useState<OccazItem[]>([]);
  const [infoMessages, setInfoMessages] = useState<InfoMessage[]>([]);
  const [tides, setTides] = useState<TideData[]>([]);

  const [charStatus, setCharStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [charMessage, setCharMessage] = useState('');
  const [charTags, setCharTags] = useState<string[]>([]);

  const [marcheStatus, setMarcheStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [marcheMessage, setMarcheMessage] = useState('');
  const [marcheTags, setMarcheTags] = useState<string[]>([]);

  const [nautiqueStatus, setNautiqueStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [nautiqueMessage, setNautiqueMessage] = useState('');
  const [nautiqueTags, setNautiqueTags] = useState<string[]>([]);

  const [vibeMessages, setVibeMessages] = useState<VibeMessage[]>([]);
  const [clubData, setClubData] = useState<ClubPageData | null>(null);
  const [groupsData, setGroupsData] = useState<GroupsPageData | null>(null);
  const [activitiesData, setActivitiesData] = useState<ActivitiesPageData | null>(null);
  const [leSpotData, setLeSpotData] = useState<LeSpotPageData | null>(null);
  const [natureData, setNatureData] = useState<NaturePageData | null>(null);
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [signageSlides, setSignageSlides] = useState<SignageSlide[]>([]);

  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshData = async () => {
    setIsLoading(true);

    // FETCH DIRECT STATUS (BYPASS SANITY)
    const directPromise = fetch('/api/cockpit/direct')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSpotStatus(data.spotStatus);
          setStatusMessage(data.statusMessage);
          setCharStatus(data.charStatus);
          setCharMessage(data.charMessage);
          // Tags are currently only in Sanity, not in the direct cockpit.json local file
          setMarcheStatus(data.marcheStatus);
          setMarcheMessage(data.marcheMessage);
          setNautiqueStatus(data.nautiqueStatus);
          setNautiqueMessage(data.nautiqueMessage);
          return data;
        }
      })
      .catch(e => console.warn("Direct status fetch failed:", e));

    const weatherPromise = fetchRealtimeWeather()
      .then(async (data) => {
        if (!data) return;

        // Fetch local tides to enrich weather data
        // Circuit breaker: stop fetching tides if we have too many errors (e.g. no credits)
        const MAX_TIDE_ERRORS = 3;
        const tideErrorCount = parseInt(sessionStorage.getItem('CNC_TIDE_ERROR_COUNT') || '0');

        if (tideErrorCount < MAX_TIDE_ERRORS) {
          try {
            const tideRes = await fetch('/api/tides');
            const tideData = await tideRes.json();

            if (tideData.error) {
              console.warn("WorldTides API returned an error, incrementing error count.");
              sessionStorage.setItem('CNC_TIDE_ERROR_COUNT', (tideErrorCount + 1).toString());
            } else {
              // Reset error count on success
              sessionStorage.setItem('CNC_TIDE_ERROR_COUNT', '0');
            }

            let tideInfo = {};

            // 1. Get Coefficient
            if (tideData.coefficients) {
              tideInfo = {
                ...tideInfo,
                coefficient: tideData.coefficients.coef_1 || tideData.coefficients.coef_2 || 0
              };
            }

            // 2. Get High/Low times for today
            if (tideData.tides) {
              setTides(tideData.tides);
              const now = Date.now();
              const todayStr = new Date().toDateString();
              const daysTides = tideData.tides.filter((t: any) =>
                t.type === 'extreme' && new Date(t.timestamp).toDateString() === todayStr
              );

              const nextHigh = daysTides.find((t: any) => t.status === 'high' && t.timestamp > now) || daysTides.find((t: any) => t.status === 'high');
              const nextLow = daysTides.find((t: any) => t.status === 'low' && t.timestamp > now) || daysTides.find((t: any) => t.status === 'low');

              if (nextHigh) {
                tideInfo = {
                  ...tideInfo,
                  tideHigh: new Date(nextHigh.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                };
              }
              if (nextLow) {
                tideInfo = {
                  ...tideInfo,
                  tideLow: new Date(nextLow.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                };
              }
            }

            setWeather(prev => ({ ...prev, ...data, ...tideInfo }));
          } catch (e) {
            console.error("Error fetching tides for weather context", e);
            sessionStorage.setItem('CNC_TIDE_ERROR_COUNT', (tideErrorCount + 1).toString());
            setWeather(prev => ({ ...prev, ...data }));
          }
        } else {
          // If too many errors, just use static coefficients if we want, or do nothing
          console.warn("WorldTides API retry limit reached. Skipping tide fetch.");
          setWeather(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => { }); // Erreur déjà gérée

    const expertWeatherPromise = fetch('/api/weather-expert')
      .then(r => r.json())
      .then(expertData => {
        if (!expertData || expertData.error) return;

        // Extract current water temp and air temp from expert data
        const now = new Date();
        const hourIdx = now.getHours();
        const waterTemp = expertData.currents?.hourly?.sea_surface_temperature?.[hourIdx];
        const airTemp = expertData.weather?.hourly?.temperature_2m?.[hourIdx];

        // Calculate dominant wind from AROME HD minutely data
        const times = expertData.weather?.minutely_15?.time || [];
        const w15 = expertData.weather?.minutely_15;

        // Find the first index in the future (or current 15m slot)
        let currentIdx = times.findIndex((t: string) => new Date(t) > now);
        if (currentIdx === -1) currentIdx = 0;
        if (currentIdx > 0) currentIdx = currentIdx - 1;

        if (times[currentIdx]) {
          const currentWind = Math.round(w15.wind_speed_10m[currentIdx]);
          const currentGust = Math.round(w15.wind_gusts_10m[currentIdx]);
          const currentDirDeg = w15.wind_direction_10m[currentIdx];

          const getDir = (deg: number) => {
            const di = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
            return di[Math.round(deg / 45) % 8];
          };
          const dominantDir = getDir(currentDirDeg);

          let trend: 'rising' | 'falling' | 'stable' = 'stable';
          const futureIdx = currentIdx + 12;
          if (times[futureIdx]) {
            const futureWind = Math.round(w15.wind_speed_10m[futureIdx]);
            if (futureWind > currentWind + 2) trend = 'rising';
            else if (futureWind < currentWind - 2) trend = 'falling';
          }

          setWeather(prev => ({
            ...prev,
            temp: airTemp ? Math.round(airTemp) : prev.temp,
            waterTemp: waterTemp ? Math.round(waterTemp) : prev.waterTemp,
            dominantWind: `${dominantDir} ${currentWind} -${currentGust} nds`,
            windSpeed: currentWind,
            windDirection: dominantDir,
            gusts: currentGust,
            windBearing: currentDirDeg,
            trend: trend,
            weatherCode: expertData.weather?.daily?.weather_code?.[0]
          }));
        }
      })
      .catch(e => console.error("Expert weather fetch failed", e));

    const sanityPromise = (async () => {
      try {
        const { projectId } = client.config();
        if (!projectId) return;

        const [
          sanityActivities,
          sanitySettings,
          sanityNews,
          sanityTeam,
          sanityFleet,
          sanityPlannings,
          sanityCharPlannings,
          sanityMarchePlannings,
          sanityGallery,
          sanityMerch,
          sanityOccaz,
          sanityInfoMessages,
          sanityVibeMessages,
          sanityClub,
          sanityHomePage,
          sanityGroups,
          sanityActivitiesPage,
          sanityLeSpotPage,
          sanityNaturePage,
          sanitySignageSlides
        ] = await Promise.all([
          client.fetch(queries.activities),
          client.fetch(queries.settings, {}, { useCdn: false }),
          client.fetch(queries.news),
          client.fetch(queries.team),
          client.fetch(queries.fleet),
          client.fetch(queries.plannings),
          client.fetch(queries.charPlannings),
          client.fetch(queries.marchePlannings),
          client.fetch(queries.homeGallery),
          client.fetch(queries.merchItems),
          client.fetch(queries.occazItems),
          client.fetch(queries.infoMessages),
          client.fetch(queries.vibeMessages),
          client.fetch(queries.clubPage),
          client.fetch(queries.homePage),
          client.fetch(queries.groupsPage),
          client.fetch(queries.activitiesPage),
          client.fetch(queries.leSpotPage),
          client.fetch(queries.naturePage),
          client.fetch(queries.signageSlides)
        ]);

        if (sanityActivities?.length > 0) setActivities(sanityActivities);
        if (sanitySettings) {
          setSpotStatus(prev => sanitySettings.spotStatus || prev);
          setStatusMessage(prev => sanitySettings.statusMessage || prev);

          setCharStatus(prev => sanitySettings.charStatus || prev);
          setCharMessage(prev => sanitySettings.charMessage || prev);
          setCharTags(prev => sanitySettings.charTags || []);

          setMarcheStatus(prev => sanitySettings.marcheStatus || prev);
          setMarcheMessage(prev => sanitySettings.marcheMessage || prev);
          setMarcheTags(prev => sanitySettings.marcheTags || []);

          setNautiqueStatus(prev => sanitySettings.nautiqueStatus || prev);
          setNautiqueMessage(prev => sanitySettings.nautiqueMessage || prev);
          setNautiqueTags(prev => sanitySettings.nautiqueTags || []);
        }
        if (sanityNews?.length > 0) setNews(sanityNews);
        if (sanityTeam?.length > 0) setTeam(sanityTeam);
        if (sanityFleet?.length > 0) setFleet(sanityFleet);
        if (sanityPlannings) setPlannings(sanityPlannings);
        if (sanityCharPlannings) setCharPlannings(sanityCharPlannings);
        if (sanityMarchePlannings) setMarchePlannings(sanityMarchePlannings);
        if (sanityGallery) setHomeGallery(sanityGallery);
        if (sanityMerch?.length > 0) setMerchItems(sanityMerch);
        if (sanityOccaz?.length > 0) setOccazItems(sanityOccaz);
        if (sanityInfoMessages?.length > 0) setInfoMessages(sanityInfoMessages);
        if (sanityVibeMessages?.length > 0) setVibeMessages(sanityVibeMessages);
        if (sanityClub) setClubData(sanityClub);
        if (sanityGroups) setGroupsData(sanityGroups);
        if (sanityActivitiesPage) setActivitiesData(sanityActivitiesPage);
        if (sanityLeSpotPage) setLeSpotData(sanityLeSpotPage);
        if (sanityNaturePage) {
          setNatureData(sanityNaturePage);
        }
        if (sanityHomePage) setHomePageData(sanityHomePage);
        if (sanitySignageSlides) setSignageSlides(sanitySignageSlides);

      } catch (err) {
        console.warn("Sanity indisponible:", err);
      }
    })();

    await Promise.all([directPromise, weatherPromise, expertWeatherPromise, sanityPromise]);
    setLastUpdated(Date.now());
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();

    let interval: NodeJS.Timeout;

    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetch('/api/cockpit/direct')
            .then(res => res.json())
            .then(data => {
              if (data && !data.error) {
                setSpotStatus(data.spotStatus);
                setCharStatus(data.charStatus);
                setMarcheStatus(data.marcheStatus);
                setNautiqueStatus(data.nautiqueStatus);
              }
            })
            .catch(() => { });
        }
      }, 300000); // 5 minutes
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Fast refresh on focus for direct cockpit data
        fetch('/api/cockpit/direct')
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) {
              setSpotStatus(data.spotStatus);
              setCharStatus(data.charStatus);
              setMarcheStatus(data.marcheStatus);
              setNautiqueStatus(data.nautiqueStatus);
            }
          }).catch(() => { });
        startPolling();
      } else {
        if (interval) clearInterval(interval);
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const updateWeather = (data: WeatherData) => setWeather(data);
  const updateActivity = (id: string, data: Partial<Activity>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };
  const updateStatus = (status: SpotStatus, message: string) => {
    setSpotStatus(status);
    setStatusMessage(message);
  };

  const resetToDefaults = () => {
    if (confirm("Réinitialiser toutes les données ?")) {
      setWeather(MOCK_WEATHER);
      refreshData();
    }
  };

  const saveToLocal = () => {
    const data = { weather, activities, statusMessage, spotStatus, news, team, fleet, plannings, charPlannings, merchItems, occazItems, timestamp: Date.now() };
    localStorage.setItem('CNC_CONTENT_DATA', JSON.stringify(data));
    setLastUpdated(Date.now());
    alert("Données sauvegardées !");
  };

  const currentVibe = React.useMemo(() => {
    if (!vibeMessages || vibeMessages.length === 0) return null;

    const matched = vibeMessages.filter(vibe => {
      if (vibe.conditionType === 'wind_high' && weather.windSpeed < 15) return false;
      if (vibe.conditionType === 'wind_low' && weather.windSpeed > 10) return false;
      if (vibe.conditionType === 'sunny' && weather.weatherCode && weather.weatherCode > 3) return false;
      if (vibe.minWind !== undefined && weather.windSpeed < vibe.minWind) return false;
      if (vibe.maxWind !== undefined && weather.windSpeed > vibe.maxWind) return false;
      if (vibe.windDirection && vibe.windDirection.length > 0) {
        if (!vibe.windDirection.includes(weather.windDirection)) return false;
      }
      return true;
    });

    return matched[0] || vibeMessages.find(v => v.conditionType === 'default') || null;
  }, [vibeMessages, weather]);

  return (
    <ContentContext.Provider value={{
      weather, activities, statusMessage, spotStatus, news, team, fleet, plannings, charPlannings, marchePlannings, homeGallery,
      merchItems, occazItems, infoMessages, tides,
      charStatus, charMessage, charTags,
      marcheStatus, marcheMessage, marcheTags,
      nautiqueStatus, nautiqueMessage, nautiqueTags,
      vibeMessages, currentVibe,
      clubData, groupsData, activitiesData, leSpotData, natureData, homePageData,
      updateWeather, updateActivity, updateStatus,
      setSpotStatus, setStatusMessage,
      setCharStatus, setCharMessage, setCharTags,
      setMarcheStatus, setMarcheMessage, setMarcheTags,
      setNautiqueStatus, setNautiqueMessage, setNautiqueTags,
      resetToDefaults,
      saveToLocal, refreshData, fetchFromSanity: refreshData,
      lastUpdated, isLoading,
      signageSlides
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};