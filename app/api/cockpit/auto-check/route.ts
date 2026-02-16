import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'auto-conditions.json');
const COCKPIT_PATH = path.join(process.cwd(), 'data', 'cockpit.json');

// Agon-Coutainville coordinates
const LAT = 49.043;
const LON = -1.593;

const readJSON = (filePath: string) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch { return null; }
};

const writeJSON = (filePath: string, data: any) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

/**
 * GET — Read auto-conditions config
 */
export async function GET() {
    const config = readJSON(CONFIG_PATH);
    if (!config) return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    return NextResponse.json(config);
}

/**
 * POST — Execute auto-check: fetch weather, evaluate thresholds, update cockpit
 */
export async function POST() {
    try {
        const config = readJSON(CONFIG_PATH);
        if (!config) return NextResponse.json({ error: 'Config not found' }, { status: 404 });

        if (config.manualOverride) {
            return NextResponse.json({ success: false, reason: 'Manuel override actif.', manualOverride: true });
        }

        if (!config.enabled) {
            return NextResponse.json({ success: false, reason: 'Système automatique désactivé.' });
        }

        // 1. Fetch Forecast (Wind, Gusts, CAPE, Visibility) + Marine (Waves, WaterTemp)
        // Forecast: hourly wind/gusts/cape/visibility
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=wind_speed_10m,wind_gusts_10m,cape,visibility&wind_speed_unit=kn&timezone=auto&forecast_days=1`;

        // Marine: hourly waves/temp
        const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&hourly=wave_height,wave_period,sea_surface_temperature&timezone=auto&forecast_days=1`;

        const [forecastRes, marineRes] = await Promise.all([fetch(forecastUrl), fetch(marineUrl)]);

        if (!forecastRes.ok || !marineRes.ok) throw new Error('Erreur API Météo');

        const forecastData = await forecastRes.json();
        const marineData = await marineRes.json();

        const fHourly = forecastData.hourly;
        const mHourly = marineData.hourly;

        // 2. Extract Data (Max/Min/Avg between 8h and 18h)
        const hours: number[] = [];
        for (let i = 8; i <= 18; i++) hours.push(i);

        const getStats = (arr: number[]) => {
            const values = hours.map(h => arr[h]);
            return {
                max: Math.max(...values),
                min: Math.min(...values),
                avg: values.reduce((a, b) => a + b, 0) / values.length // approximate
            };
        };

        const weather = {
            wind: getStats(fHourly.wind_speed_10m).max, // Max wind (knots)
            gusts: getStats(fHourly.wind_gusts_10m).max, // Max gusts (knots)
            cape: getStats(fHourly.cape).max, // Max CAPE
            visibility: getStats(fHourly.visibility).min, // Min visibility (meters)
            waveHeight: getStats(mHourly.wave_height).max, // Max wave height (m)
            wavePeriod: getStats(mHourly.wave_period).max, // Max wave period (s)
            waterTemp: getStats(mHourly.sea_surface_temperature).min // Min water temp (°C) // conservative
        };

        // 3. Evaluate Rules per Activity
        const results: Record<string, any> = {};
        const cockpit = readJSON(COCKPIT_PATH) || {};

        const activityFieldMap: Record<string, any> = {
            char: { status: 'charStatus', message: 'charMessage', tags: 'charTags' },
            nautique: { status: 'nautiqueStatus', message: 'nautiqueMessage', tags: 'nautiqueTags' },
            marche: { status: 'marcheStatus', message: 'marcheMessage', tags: 'marcheTags' }
        };

        // Helper to evaluate a single numeric threshold
        const evalMetric = (val: number, thresholds: any, metricName: string) => {
            if (!thresholds) return null;
            // Order: CLOSED rules first, then RESTRICTED
            if (thresholds.closedBelow !== undefined && val < thresholds.closedBelow) return 'CLOSED';
            if (thresholds.closedAbove !== undefined && val > thresholds.closedAbove) return 'CLOSED';

            if (thresholds.restrictedBelow !== undefined && val < thresholds.restrictedBelow) return 'RESTRICTED';
            if (thresholds.restrictedAbove !== undefined && val > thresholds.restrictedAbove) return 'RESTRICTED';

            return null; // OK
        };

        for (const [key, activity] of Object.entries(config.activities as Record<string, any>)) {
            if (!activity.enabled) continue;

            const t = activity.thresholds || {};
            const m = activity.messages || {};
            const causes: string[] = [];
            let worstStatus = 'OPEN'; // Default

            // Check criteria
            const statuses = [
                { type: 'wind', status: evalMetric(weather.wind, t.wind, 'wind'), msg: 'wind' },
                { type: 'gusts', status: evalMetric(weather.gusts, t.gusts, 'gusts'), msg: 'wind' }, // gusts share wind msg
                { type: 'waves', status: evalMetric(weather.waveHeight, t.waveHeight, 'waves'), msg: 'waves' },
                { type: 'period', status: evalMetric(weather.wavePeriod, t.wavePeriod, 'period'), msg: 'waves' },
                { type: 'cape', status: evalMetric(weather.cape, t.cape, 'cape'), msg: 'storm' },
                { type: 'visibility', status: evalMetric(weather.visibility, t.visibility, 'visibility'), msg: 'visibility' },
                { type: 'waterTemp', status: evalMetric(weather.waterTemp, t.waterTemp, 'waterTemp'), msg: 'waterTemp' }
            ];

            // Determine worst status and collect causes
            for (const s of statuses) {
                if (s.status === 'CLOSED') {
                    worstStatus = 'CLOSED';
                    causes.push(s.msg);
                } else if (s.status === 'RESTRICTED' && worstStatus !== 'CLOSED') {
                    worstStatus = 'RESTRICTED';
                    causes.push(s.msg);
                }
            }

            // Select message
            let message = m.ok;
            let tags: string[] = [];

            if (worstStatus === 'CLOSED') {
                if (causes.includes('storm')) { message = m.storm || "Orage"; tags.push("Orage"); }
                else if (causes.includes('wind')) { message = m.wind_high || "Vent fort"; tags.push("Vent fort"); }
                else if (causes.includes('waves')) { message = m.waves || "Houle"; tags.push("Vagues"); }
                else if (causes.includes('visibility')) { message = m.visibility || "Visibilité"; tags.push("Brouillard"); }
                else if (causes.includes('waterTemp')) { message = m.waterTemp || "Froid"; tags.push("Froid"); }
            } else if (worstStatus === 'RESTRICTED') {
                if (causes.includes('wind')) {
                    // Check if low or high wind
                    if (t.wind?.restrictedBelow && weather.wind < t.wind.restrictedBelow) {
                        message = m.wind_restricted_low || "Vent faible";
                        tags.push("Vent faible");
                    } else {
                        message = m.wind_restricted_high || "Vent fort";
                        tags.push("Vent fort");
                    }
                }
                else if (causes.includes('waves')) { message = m.waves || "Houle"; tags.push("Vagues"); }
                else if (causes.includes('visibility')) { message = m.visibility || "Visibilité"; tags.push("Brume"); }
                else if (causes.includes('waterTemp')) { message = m.waterTemp || "Eau froide"; tags.push("Eau froide"); }
            } else if (weather.wind < (t.wind?.restrictedBelow || 5)) {
                // Special case: conditions are OPEN but wind is low -> triggers "wind_low" message if defined
                if (m.wind_low && weather.wind < (t.wind?.closedBelow || 0)) {
                    // already closed
                } else if (m.wind_low) {
                    message = m.wind_low;
                    tags.push("Vent faible");
                }
            }

            // Update Cockpit
            const fields = activityFieldMap[key];
            cockpit[fields.status] = worstStatus;
            cockpit[fields.message] = message;
            cockpit[fields.tags] = Array.from(new Set(tags)); // Unique tags

            results[key] = {
                status: worstStatus,
                message: message,
                tags: cockpit[fields.tags],
                causes: Array.from(new Set(causes))
            };
        }

        // Update cockpit
        cockpit.lastUpdated = new Date().toISOString();
        writeJSON(COCKPIT_PATH, cockpit);

        // Update config
        config.lastCheck = new Date().toISOString();
        config.lastCheckResult = {
            weather, // Store full weather data used
            ...results
        };
        writeJSON(CONFIG_PATH, config);

        return NextResponse.json({ success: true, weather, results });

    } catch (error: any) {
        console.error('Auto-check error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PATCH — Update auto-conditions config
 */
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const currentConfig = readJSON(CONFIG_PATH) || {};

        const updatedConfig = { ...currentConfig, ...body };
        writeJSON(CONFIG_PATH, updatedConfig);

        return NextResponse.json({ success: true, config: updatedConfig });
    } catch (error: any) {
        console.error('Auto-conditions config update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
