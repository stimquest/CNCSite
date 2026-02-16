import { NextResponse } from 'next/server';

const LAT = 49.043;
const LON = -1.593;

// Cette ligne indique à Next.js de mettre en cache la réponse de cette route pendant 15 minutes
export const revalidate = 900;

export async function GET() {
    try {


        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=sunrise,sunset,weather_code&hourly=temperature_2m,wind_gusts_10m,wind_speed_10m&models=arome_france_hd&minutely_15=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=3&wind_speed_unit=kn`;
        const currentsUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=sea_surface_temperature,ocean_current_velocity,ocean_current_direction&models=meteofrance_currents&forecast_days=3&timezone=auto`;
        const wavesUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=wave_height,wave_direction,wave_period,wave_peak_period&models=meteofrance_wave&forecast_days=3&timezone=auto`;

        // Les appels fetch sont aussi mis en cache individuellement par Next.js
        const [weather, currents, waves] = await Promise.all([
            fetch(weatherUrl, { next: { revalidate: 900 } }).then(r => r.json()),
            fetch(currentsUrl, { next: { revalidate: 900 } }).then(r => r.json()),
            fetch(wavesUrl, { next: { revalidate: 900 } }).then(r => r.json())
        ]);

        const data = {
            weather,
            currents,
            waves,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
            }
        });
    } catch (error) {
        console.error('WeatherExpert API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
