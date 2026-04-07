import { NextResponse } from 'next/server';

const LAT = 49.043;
const LON = -1.593;

export const revalidate = 300;

export async function GET() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&wind_speed_unit=kn`;
        const response = await fetch(url, { next: { revalidate: 300 } });
        if (!response.ok) throw new Error(`open-meteo ${response.status}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Weather API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
