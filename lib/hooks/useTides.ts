import { useState, useEffect } from 'react';

export interface TideData {
  timestamp: number;
  type: "height" | "extreme";
  height: number;
  status?: string;
}

export interface Coefficients {
  date: string;
  coef_1: number | null;
  coef_2: number | null;
}

const CALIBRATION = {
  HEIGHT: 0.0,
  TIME: -20, // minutes
};

let globalPromise: Promise<{ tides: TideData[], coefficients: Coefficients | null }> | null = null;
let globalResult: { tides: TideData[], coefficients: Coefficients | null } | null = null;

export function useTides(from?: number, to?: number) {
  const [tides, setTides] = useState<TideData[] | undefined>(globalResult?.tides || undefined);
  const [coeffs, setCoeffs] = useState<Coefficients | null>(globalResult?.coefficients || null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!globalPromise) {
          globalPromise = fetch('/api/tides').then(res => {
            if (!res.ok) throw new Error('Failed to fetch tides');
            return res.json();
          });
        }

        const result = await globalPromise;
        globalResult = result;
        setCoeffs(result.coefficients);

        const timeShift = CALIBRATION.TIME * 60 * 1000;
        let processed = result.tides.map((t: any) => ({
          ...t,
          timestamp: t.timestamp + timeShift,
          height: t.height + CALIBRATION.HEIGHT
        }));

        if (from !== undefined && to !== undefined) {
          processed = processed.filter((t: any) => t.timestamp >= from && t.timestamp <= to);
        }

        setTides(processed);
      } catch (err: any) {
        console.error("useTides error:", err);
        setError(err);
      }
    }

    fetchData();
  }, [from, to]);

  return { data: tides, coefficients: coeffs, error };
}
