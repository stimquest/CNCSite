"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

import { MOCK_WEATHER } from '@/constants';
import { client } from '@/lib/sanity';
import { fetchRealtimeWeather } from '@/lib/weather';
import { SignageSlide, TideData, WeatherData } from '@/types';

interface SignageContentContextType {
  weather: WeatherData;
  tides: TideData[];
  signageSlides: SignageSlide[];
}

const SIGNAGE_SLIDES_QUERY = `*[_type == "signageSlide" && isActive == true] | order(order asc) {
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
}`;

const SignageContentContext = createContext<SignageContentContextType | undefined>(undefined);

const getDir = (deg: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return directions[Math.round(deg / 45) % 8];
};

export const SignageContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [tides, setTides] = useState<TideData[]>([]);
  const [signageSlides, setSignageSlides] = useState<SignageSlide[]>([]);

  const refreshData = React.useCallback(async () => {
    try {
      await Promise.all([
        fetchRealtimeWeather()
          .then((data) => {
            if (!data) return;
            setWeather(prev => ({ ...prev, ...data }));
          })
          .catch(() => { }),

        fetch('/api/tides')
          .then(res => res.json())
          .then((tideData) => {
            if (!tideData || tideData.error) return;

            let tideInfo: Partial<WeatherData> = {};

            if (tideData.coefficients) {
              tideInfo.coefficient = tideData.coefficients.coef_1 || tideData.coefficients.coef_2 || 0;
            }

            if (tideData.tides) {
              setTides(tideData.tides);

              const now = Date.now();
              const todayStr = new Date().toDateString();
              const dayExtremes = tideData.tides.filter((t: TideData) =>
                t.type === 'extreme' && new Date(t.timestamp).toDateString() === todayStr
              );

              const nextHigh = dayExtremes.find((t: TideData) => t.status === 'high' && t.timestamp > now)
                || dayExtremes.find((t: TideData) => t.status === 'high');
              const nextLow = dayExtremes.find((t: TideData) => t.status === 'low' && t.timestamp > now)
                || dayExtremes.find((t: TideData) => t.status === 'low');

              if (nextHigh) {
                tideInfo.tideHigh = new Date(nextHigh.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              }
              if (nextLow) {
                tideInfo.tideLow = new Date(nextLow.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              }
            }

            setWeather(prev => ({ ...prev, ...tideInfo }));
          })
          .catch(e => console.error('Signage tides fetch failed', e)),

        fetch('/api/weather-expert')
          .then(res => res.json())
          .then((expertData) => {
            if (!expertData || expertData.error) return;

            const now = new Date();
            const hourIdx = now.getHours();
            const waterTemp = expertData.currents?.hourly?.sea_surface_temperature?.[hourIdx];
            const airTemp = expertData.weather?.hourly?.temperature_2m?.[hourIdx];
            const times = expertData.weather?.minutely_15?.time || [];
            const w15 = expertData.weather?.minutely_15;

            let currentIdx = times.findIndex((t: string) => new Date(t) > now);
            if (currentIdx === -1) currentIdx = 0;
            if (currentIdx > 0) currentIdx = currentIdx - 1;

            if (!times[currentIdx]) return;

            const currentWind = Math.round(w15.wind_speed_10m[currentIdx]);
            const currentGust = Math.round(w15.wind_gusts_10m[currentIdx]);
            const currentDirDeg = w15.wind_direction_10m[currentIdx];
            const dominantDir = getDir(currentDirDeg);

            let trend: 'rising' | 'falling' | 'stable' = 'stable';
            const futureIdx = currentIdx + 12;
            if (times[futureIdx]) {
              const futureWind = Math.round(w15.wind_speed_10m[futureIdx]);
              if (futureWind > currentWind + 2) trend = 'rising';
              else if (futureWind < currentWind - 2) trend = 'falling';
            }

            // Wave data (hourly)
            const waveHeight = expertData.waves?.hourly?.wave_height?.[hourIdx];
            const waveDirDeg = expertData.waves?.hourly?.wave_direction?.[hourIdx];
            const wavePeriod = expertData.waves?.hourly?.wave_period?.[hourIdx];

            setWeather(prev => ({
              ...prev,
              temp: airTemp ? Math.round(airTemp) : prev.temp,
              waterTemp: waterTemp ? Math.round(waterTemp) : prev.waterTemp,
              dominantWind: `${dominantDir} ${currentWind} -${currentGust} nds`,
              windSpeed: currentWind,
              windDirection: dominantDir,
              gusts: currentGust,
              windBearing: currentDirDeg,
              trend,
              weatherCode: expertData.weather?.daily?.weather_code?.[0],
              waveHeight: waveHeight != null ? Math.round(waveHeight * 10) / 10 : prev.waveHeight,
              waveDirection: waveDirDeg != null ? getDir(waveDirDeg) : prev.waveDirection,
              wavePeriod: wavePeriod != null ? Math.round(wavePeriod) : prev.wavePeriod,
              sunrise: expertData.weather?.daily?.sunrise?.[0]
                ? new Date(expertData.weather.daily.sunrise[0]).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                : prev.sunrise,
              sunset: expertData.weather?.daily?.sunset?.[0]
                ? new Date(expertData.weather.daily.sunset[0]).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                : prev.sunset,
            }));
          })
          .catch(e => console.error('Signage expert weather fetch failed', e)),

        (async () => {
          try {
            const { projectId } = client.config();
            if (!projectId) return;
            const slides = await client.fetch<SignageSlide[]>(SIGNAGE_SLIDES_QUERY);
            if (slides) setSignageSlides(slides);
          } catch (err) {
            console.warn('Signage slides unavailable:', err);
          }
        })(),
      ]);
    } catch (err) {
      console.warn('Signage content refresh failed:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      if (!document.hidden) refreshData();
    }, 30000); // Rafraîchir toutes les 30s
    return () => clearInterval(interval);
  }, [refreshData]);

  const value = React.useMemo<SignageContentContextType>(() => ({
    weather,
    tides,
    signageSlides,
  }), [weather, tides, signageSlides]);

  return (
    <SignageContentContext.Provider value={value}>
      {children}
    </SignageContentContext.Provider>
  );
};

export const useSignageContent = () => {
  const value = useContext(SignageContentContext);

  if (value === undefined) {
    throw new Error('useSignageContent must be used within a SignageContentProvider');
  }

  return value;
};