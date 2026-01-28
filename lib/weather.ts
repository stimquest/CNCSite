
import { WeatherData } from "../types";

// Coordonnées Agon-Coutainville
const LAT = 49.043;
const LON = -1.593;

// Conversion degrés -> Point cardinal
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return directions[Math.round(degrees / 45) % 8];
};

// Interprétation code WMO (Code météo standard)
const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: "Ciel dégagé",
    1: "Légèrement voilé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brume",
    48: "Brume givrante",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    61: "Pluie faible",
    63: "Pluie modérée",
    65: "Pluie forte",
    71: "Neige faible",
    73: "Neige modérée",
    75: "Neige forte",
    95: "Orage",
    96: "Orage avec grêle"
  };
  return codes[code] || "Variable";
};

export const fetchRealtimeWeather = async (): Promise<Partial<WeatherData> | null> => {
  try {
    // Appel API Open-Meteo (Gratuit, sans clé)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&wind_speed_unit=kn`
    );

    if (!response.ok) throw new Error('Erreur météo');

    const data = await response.json();
    const current = data.current;

    return {
      temp: Math.round(current.temperature_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: getWindDirection(current.wind_direction_10m),
      description: getWeatherDescription(current.weather_code)
    };
  } catch (error) {
    // Éviter de polluer la console si c'est une erreur réseau classique
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn("Météo : Impossible de contacter l'API (Problème réseau ou CORS)");
    } else {
      console.error("Erreur fetch météo:", error);
    }
    return null;
  }
};
