"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_WEATHER, ACTIVITIES, STATUS_MESSAGE, CURRENT_STATUS } from '../constants';
import { Activity, WeatherData, SpotStatus } from '../types';
import { client, queries } from '../lib/sanity';
import { fetchRealtimeWeather } from '../lib/weather';

interface ContentState {
  weather: WeatherData;
  activities: Activity[];
  statusMessage: string;
  spotStatus: SpotStatus;
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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [statusMessage, setStatusMessage] = useState<string>(STATUS_MESSAGE);
  const [spotStatus, setSpotStatus] = useState<SpotStatus>(CURRENT_STATUS);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fonction unifiée de rafraichissement des données
  const refreshData = async () => {
    setIsLoading(true);
    
    // 1. Fetch Météo (API Externe)
    const weatherPromise = fetchRealtimeWeather()
      .then(data => {
        if (data) setWeather(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.warn("Météo live indisponible:", err));

    // 2. Fetch Sanity (Contenu Éditorial)
    const sanityPromise = (async () => {
      try {
         // Vérification basique
         const { projectId } = client.config();
         if (!projectId || projectId.includes('votre_project')) return;

         const [sanityActivities, sanitySettings] = await Promise.all([
           client.fetch(queries.activities),
           client.fetch(queries.settings)
         ]);

         if (sanityActivities?.length > 0) setActivities(sanityActivities);
         if (sanitySettings) {
           setSpotStatus(sanitySettings.spotStatus || spotStatus);
           setStatusMessage(sanitySettings.statusMessage || statusMessage);
         }
      } catch (err) {
        console.warn("Sanity indisponible:", err);
      }
    })();

    await Promise.all([weatherPromise, sanityPromise]);
    setLastUpdated(Date.now());
    setIsLoading(false);
  };

  useEffect(() => {
    // Chargement initial
    refreshData();

    // Check localStorage pour overrides admin locales
    const savedData = localStorage.getItem('CNC_CONTENT_DATA');
    if (savedData) {
      try {
        const parsed: ContentState & { timestamp: number } = JSON.parse(savedData);
        // On ne surcharge avec le local storage que si c'est récent (< 24h) ou si l'utilisateur est admin
        // Ici on applique simplement
        setWeather(parsed.weather);
        setActivities(parsed.activities);
        setStatusMessage(parsed.statusMessage);
        setSpotStatus(parsed.spotStatus);
        setLastUpdated(parsed.timestamp);
      } catch (e) {
        console.error("Erreur chargement données locales", e);
      }
    }
  }, []);

  const saveToLocal = () => {
    const data = {
      weather,
      activities,
      statusMessage,
      spotStatus,
      timestamp: Date.now()
    };
    localStorage.setItem('CNC_CONTENT_DATA', JSON.stringify(data));
    setLastUpdated(Date.now());
    alert("Données sauvegardées localement !");
  };

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
        setActivities(ACTIVITIES);
        setStatusMessage(STATUS_MESSAGE);
        setSpotStatus(CURRENT_STATUS);
        localStorage.removeItem('CNC_CONTENT_DATA');
        setLastUpdated(null);
        refreshData(); // Re-fetch API/Sanity frais
    }
  };

  return (
    <ContentContext.Provider value={{
      weather,
      activities,
      statusMessage,
      spotStatus,
      updateWeather,
      updateActivity,
      updateStatus,
      resetToDefaults,
      saveToLocal,
      refreshData,
      fetchFromSanity: refreshData, // Alias pour compatibilité
      lastUpdated,
      isLoading
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