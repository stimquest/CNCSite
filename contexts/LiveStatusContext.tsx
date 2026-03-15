"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_WEATHER, CURRENT_STATUS, STATUS_MESSAGE } from '../constants';
import { WeatherData, SpotStatus, TideData, VibeMessage } from '../types';
import { fetchRealtimeWeather } from '../lib/weather';

interface LiveStatusState {
  weather: WeatherData;
  tides: TideData[];
  
  spotStatus: SpotStatus;
  statusMessage: string;
  charStatus: SpotStatus;
  charMessage: string;
  charTags: string[];
  marcheStatus: SpotStatus;
  marcheMessage: string;
  marcheTags: string[];
  nautiqueStatus: SpotStatus;
  nautiqueMessage: string;
  nautiqueTags: string[];
  
  stagesMiniMoussesStatus: SpotStatus;
  stagesMiniMoussesMessage: string;
  stagesMoussaillonsStatus: SpotStatus;
  stagesMoussaillonsMessage: string;
  stagesInitiationStatus: SpotStatus;
  stagesInitiationMessage: string;
  stagesPerfStatus: SpotStatus;
  stagesPerfMessage: string;

  lastPublishedAt: string | null;
  lastConfirmedAt: string | null;
  
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const LiveStatusContext = createContext<LiveStatusState | undefined>(undefined);

export const LiveStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [tides, setTides] = useState<TideData[]>([]);
  const [spotStatus, setSpotStatus] = useState<SpotStatus>(CURRENT_STATUS);
  const [statusMessage, setStatusMessage] = useState<string>(STATUS_MESSAGE);

  const [charStatus, setCharStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [charMessage, setCharMessage] = useState('');
  const [charTags, setCharTags] = useState<string[]>([]);
  const [marcheStatus, setMarcheStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [marcheMessage, setMarcheMessage] = useState('');
  const [marcheTags, setMarcheTags] = useState<string[]>([]);
  const [nautiqueStatus, setNautiqueStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [nautiqueMessage, setNautiqueMessage] = useState('');
  const [nautiqueTags, setNautiqueTags] = useState<string[]>([]);

  const [stagesMiniMoussesStatus, setStagesMiniMoussesStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [stagesMiniMoussesMessage, setStagesMiniMoussesMessage] = useState('');
  const [stagesMoussaillonsStatus, setStagesMoussaillonsStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [stagesMoussaillonsMessage, setStagesMoussaillonsMessage] = useState('');
  const [stagesInitiationStatus, setStagesInitiationStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [stagesInitiationMessage, setStagesInitiationMessage] = useState('');
  const [stagesPerfStatus, setStagesPerfStatus] = useState<SpotStatus>(SpotStatus.OPEN);
  const [stagesPerfMessage, setStagesPerfMessage] = useState('');
  
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [lastConfirmedAt, setLastConfirmedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    const directPromise = fetch('/api/cockpit/direct', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          if (data.spotStatus) setSpotStatus(data.spotStatus);
          if (data.statusMessage !== undefined) setStatusMessage(data.statusMessage);
          if (data.charStatus) setCharStatus(data.charStatus);
          if (data.charMessage !== undefined) setCharMessage(data.charMessage);
          if (data.marcheStatus) setMarcheStatus(data.marcheStatus);
          if (data.marcheMessage !== undefined) setMarcheMessage(data.marcheMessage);
          if (data.nautiqueStatus) setNautiqueStatus(data.nautiqueStatus);
          if (data.nautiqueMessage !== undefined) setNautiqueMessage(data.nautiqueMessage);
          if (data.stagesMiniMoussesStatus) setStagesMiniMoussesStatus(data.stagesMiniMoussesStatus);
          if (data.stagesMiniMoussesMessage !== undefined) setStagesMiniMoussesMessage(data.stagesMiniMoussesMessage);
          if (data.stagesMoussaillonsStatus) setStagesMoussaillonsStatus(data.stagesMoussaillonsStatus);
          if (data.stagesMoussaillonsMessage !== undefined) setStagesMoussaillonsMessage(data.stagesMoussaillonsMessage);
          if (data.stagesInitiationStatus) setStagesInitiationStatus(data.stagesInitiationStatus);
          if (data.stagesInitiationMessage !== undefined) setStagesInitiationMessage(data.stagesInitiationMessage);
          if (data.stagesPerfStatus) setStagesPerfStatus(data.stagesPerfStatus);
          if (data.stagesPerfMessage !== undefined) setStagesPerfMessage(data.stagesPerfMessage);
          if (data.lastPublishedAt) setLastPublishedAt(data.lastPublishedAt);
          if (data.lastConfirmedAt) setLastConfirmedAt(data.lastConfirmedAt);
        }
      })
      .catch(e => console.warn('Direct status fetch failed:', e));

    const weatherPromise = fetchRealtimeWeather()
      .catch(() => null)
      .then(async (data) => {
        if (!data) return;
        
        try {
          const tideRes = await fetch('/api/tides');
          const tideData = await tideRes.json();
          let tideInfo = {};

          if (tideData.coefficients) {
            tideInfo = { ...tideInfo, coefficient: tideData.coefficients.coef_1 || tideData.coefficients.coef_2 || 0 };
          }
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
              tideInfo = { ...tideInfo, tideHigh: new Date(nextHigh.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
            }
            if (nextLow) {
              tideInfo = { ...tideInfo, tideLow: new Date(nextLow.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
            }
          }
          setWeather(prev => ({ ...prev, ...data, ...tideInfo }));
        } catch (e) {
          console.error("Error fetching tides", e);
          setWeather(prev => ({ ...prev, ...data }));
        }
      });

    const expertWeatherPromise = fetch('/api/weather-expert')
      .then(r => r.json())
      .catch(() => null)
      .then(expertData => {
        if (!expertData || expertData.error) return;
        const now = new Date();
        const hourIdx = now.getHours();
        const waterTemp = expertData.currents?.hourly?.sea_surface_temperature?.[hourIdx];
        const airTemp = expertData.weather?.hourly?.temperature_2m?.[hourIdx];
        const times = expertData.weather?.minutely_15?.time || [];
        const w15 = expertData.weather?.minutely_15;

        let currentIdx = times.findIndex((t: string) => new Date(t) > now);
        if (currentIdx === -1) currentIdx = 0;
        if (currentIdx > 0) currentIdx -= 1;

        if (times[currentIdx]) {
          const currentWind = Math.round(w15.wind_speed_10m[currentIdx]);
          const currentGust = Math.round(w15.wind_gusts_10m[currentIdx]);
          const currentDirDeg = w15.wind_direction_10m[currentIdx];
          const di = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
          const dominantDir = di[Math.round(currentDirDeg / 45) % 8];

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
      });

    await Promise.all([directPromise, weatherPromise, expertWeatherPromise]).catch(() => {});
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
    
    let interval: NodeJS.Timeout;
    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetch('/api/cockpit/direct', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
              if (data && !data.error) {
                if (data.spotStatus) setSpotStatus(data.spotStatus);
                if (data.statusMessage !== undefined) setStatusMessage(data.statusMessage);
                if (data.charStatus) setCharStatus(data.charStatus);
                if (data.marcheStatus) setMarcheStatus(data.marcheStatus);
                if (data.nautiqueStatus) setNautiqueStatus(data.nautiqueStatus);
                if (data.stagesMiniMoussesStatus) setStagesMiniMoussesStatus(data.stagesMiniMoussesStatus);
                if (data.stagesMoussaillonsStatus) setStagesMoussaillonsStatus(data.stagesMoussaillonsStatus);
                if (data.stagesInitiationStatus) setStagesInitiationStatus(data.stagesInitiationStatus);
                if (data.stagesPerfStatus) setStagesPerfStatus(data.stagesPerfStatus);
                if (data.lastPublishedAt) setLastPublishedAt(data.lastPublishedAt);
                if (data.lastConfirmedAt) setLastConfirmedAt(data.lastConfirmedAt);
              }
            }).catch(() => {});
        }
      }, 30000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
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
  }, [refreshData]);

  const value = useMemo(() => ({
    weather,
    tides,
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
    nautiqueTags,
    stagesMiniMoussesStatus,
    stagesMiniMoussesMessage,
    stagesMoussaillonsStatus,
    stagesMoussaillonsMessage,
    stagesInitiationStatus,
    stagesInitiationMessage,
    stagesPerfStatus,
    stagesPerfMessage,
    lastPublishedAt,
    lastConfirmedAt,
    isLoading,
    refreshData,
  }), [
    weather, tides, spotStatus, statusMessage, charStatus, charMessage, charTags,
    marcheStatus, marcheMessage, marcheTags, nautiqueStatus, nautiqueMessage, nautiqueTags,
    stagesMiniMoussesStatus, stagesMiniMoussesMessage, stagesMoussaillonsStatus, stagesMoussaillonsMessage,
    stagesInitiationStatus, stagesInitiationMessage, stagesPerfStatus, stagesPerfMessage,
    lastPublishedAt, lastConfirmedAt, isLoading, refreshData
  ]);

  return (
    <LiveStatusContext.Provider value={value}>
      {children}
    </LiveStatusContext.Provider>
  );
};

export const useLiveStatus = () => {
  const context = useContext(LiveStatusContext);
  if (context === undefined) {
    throw new Error('useLiveStatus must be used within a LiveStatusProvider');
  }
  return context;
};
