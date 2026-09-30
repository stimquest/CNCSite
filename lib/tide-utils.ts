import { TideData } from "@/types";

export interface TideWindow {
    start: number;
    end: number;
    peak: { time: number, height: number };
}

// Regnéville level used as the local equivalent of the Pointe d'Agon 5 m mark.
export const TIDE_THRESHOLD_METERS = 4.75;
const CROSSING_WINDOW_HALF_WIDTH_MS = 10 * 60 * 1000;
const ROUNDING_STEP_MS = 5 * 60 * 1000;

export function getRoundedCrossingWindow(time: number) {
    const roundedCenter = Math.round(time / ROUNDING_STEP_MS) * ROUNDING_STEP_MS;
    return {
        start: roundedCenter - CROSSING_WINDOW_HALF_WIDTH_MS,
        end: roundedCenter + CROSSING_WINDOW_HALF_WIDTH_MS,
    };
}

function interpolateThresholdTime(
    before: { time: number; height: number },
    after: { time: number; height: number },
    threshold: number,
) {
    const heightRange = after.height - before.height;
    if (heightRange === 0) return before.time;

    const ratio = (threshold - before.height) / heightRange;
    return before.time + ratio * (after.time - before.time);
}

/**
 * Calcul les créneaux de passage aux 5m (ou autre seuil)
 * Basé sur la logique validée de AgonNavigationCard
 */
export function calculateThresholdCrossings(tides: TideData[], threshold: number = TIDE_THRESHOLD_METERS): TideWindow[] {
    if (!tides || tides.length === 0) return [];

    // Préparation des données lissées comme sur la page Spot
    const chartData = tides
        .map(t => ({ time: t.timestamp, height: Math.max(0, t.height) }))
        .sort((a, b) => a.time - b.time);

    const extremes = tides.filter((t) => t.type === "extreme");
    const highTides = extremes.filter(e => e.status === 'high');
    const windows: TideWindow[] = [];

    for (const pm of highTides) {
        // 1. Point de départ par défaut = le pic
        let start = pm.timestamp;
        const pmIndex = chartData.findIndex(d => d.time === pm.timestamp);
        if (pmIndex === -1) continue;

        // 2. Scan arrière (Montée)
        for (let i = pmIndex - 1; i >= 0; i--) {
            if (chartData[i].height < threshold) {
                // Interpolate between adjacent samples instead of snapping to the 15-minute grid.
                start = interpolateThresholdTime(chartData[i], chartData[i + 1], threshold);
                break;
            }
            start = chartData[i].time;
        }

        let end = pm.timestamp;
        // 3. Scan avant (Descente)
        for (let i = pmIndex + 1; i < chartData.length; i++) {
            if (chartData[i].height < threshold) {
                end = interpolateThresholdTime(chartData[i - 1], chartData[i], threshold);
                break;
            }
            end = chartData[i].time;
        }

        // Si la marée haute ne débouche pas sur un créneau valide (hauteur < seuil), on ignore
        if (end <= start) continue;

        windows.push({ start, end, peak: { time: pm.timestamp, height: pm.height } });
    }

    // Tri chronologique
    return windows.sort((a, b) => a.start - b.start);
}

/**
 * Trouve le prochain créneau à venir par rapport à maintenant
 */
export function getNextCrossing(tides: TideData[]): TideWindow | null {
    const windows = calculateThresholdCrossings(tides);
    const now = Date.now();

    // Le prochain créneau qui n'est pas encore fini
    return windows.find(w => w.end > now) || null;
}
