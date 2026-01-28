"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_WEATHER, ACTIVITIES, STATUS_MESSAGE, CURRENT_STATUS } from '../constants';
import { Activity, WeatherData, SpotStatus, NewsItem, TeamMember, FleetItem, WeeklyPlanning, PlanningCharAVoile, HomeGallery } from '../types';
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
  homeGallery: HomeGallery | null;
}

interface ContentContextType extends ContentState {
  updateWeather: (data: WeatherData) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  updateStatus: (status: SpotStatus, message: string) => void;
  resetToDefaults: () => void;
  saveToLocal: () => void;
  refreshData: () => Promise<void>;
  fetchFromSanity: () => Promise<void>;
  lastUpdated: number | null;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const queries = {
    activities: `*[_type == "activity"] {
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
        isTideDependent,
        bookingUrl,
        duration,
        minAge,
        accroche
    }`,
    settings: `*[_type == "siteSettings"][0] {
        spotStatus,
        statusMessage
    }`,
    news: `*[_type == "news"] | order(publishedAt desc) {
        _id,
        title,
        category,
        "date": publishedAt,
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
    homeGallery: `*[_type == "homeGallery"][0] {
        title,
        subtitle,
        "images": images[].asset->url
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
  const [homeGallery, setHomeGallery] = useState<HomeGallery | null>(null);
  
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshData = async () => {
    setIsLoading(true);
    
    const weatherPromise = fetchRealtimeWeather()
      .then(data => { if (data) setWeather(prev => ({ ...prev, ...data })); })
      .catch(() => {}); // Erreur déjà gérée dans fetchRealtimeWeather

    const sanityPromise = (async () => {
      try {
         const { projectId } = client.config();
         if (!projectId) return;

         const [
           sanityActivities, 
           sanitySettings, 
           sanityNews, 
           sanityTeam,            sanityFleet,
           sanityPlannings,
           sanityCharPlannings,
           sanityGallery
         ] = await Promise.all([
           client.fetch(queries.activities),
           client.fetch(queries.settings),
           client.fetch(queries.news),
           client.fetch(queries.team),
           client.fetch(queries.fleet),
           client.fetch(queries.plannings),
           client.fetch(queries.charPlannings),
           client.fetch(queries.homeGallery)
         ]);

         if (sanityActivities?.length > 0) setActivities(sanityActivities);
         if (sanitySettings) {
           setSpotStatus(sanitySettings.spotStatus || spotStatus);
           setStatusMessage(sanitySettings.statusMessage || statusMessage);
         }
         if (sanityNews?.length > 0) setNews(sanityNews);
         if (sanityTeam?.length > 0) setTeam(sanityTeam);
         if (sanityFleet?.length > 0) setFleet(sanityFleet);
          if (sanityPlannings?.length > 0) setPlannings(sanityPlannings);
          if (sanityCharPlannings?.length > 0) setCharPlannings(sanityCharPlannings);
          if (sanityGallery) setHomeGallery(sanityGallery);

      } catch (err) {
        console.warn("Sanity indisponible:", err);
      }
    })();

    await Promise.all([weatherPromise, sanityPromise]);
    setLastUpdated(Date.now());
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
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
    if(confirm("Réinitialiser toutes les données ?")) {
        setWeather(MOCK_WEATHER);
        refreshData();
    }
  };

  const saveToLocal = () => {
    const data = { weather, activities, statusMessage, spotStatus, news, team, fleet, plannings, charPlannings, timestamp: Date.now() };
    localStorage.setItem('CNC_CONTENT_DATA', JSON.stringify(data));
    setLastUpdated(Date.now());
    alert("Données sauvegardées !");
  };

  return (
    <ContentContext.Provider value={{
      weather, activities, statusMessage, spotStatus, news, team, fleet, plannings, charPlannings, homeGallery,
      updateWeather, updateActivity, updateStatus, resetToDefaults,
      saveToLocal, refreshData, fetchFromSanity: refreshData,
      lastUpdated, isLoading
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};