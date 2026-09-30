"use client";

import { useTides } from "../lib/hooks/useTides";
import { calculateThresholdCrossings, getRoundedCrossingWindow, TIDE_THRESHOLD_METERS } from "../lib/tide-utils";
import { format, startOfDay, addDays } from "date-fns";
import { useState } from "react";

export function AgonNavigationCard() {
  const [activeDay, setActiveDay] = useState<"today" | "tomorrow" | "after">("today");
  
  const now = Date.now();
  const startOfToday = startOfDay(now).getTime();
  const startOfAfterTomorrow = startOfDay(addDays(now, 2)).getTime();
  const endOfThreeDays = startOfDay(addDays(now, 3)).getTime();

  // Data Fetching: Extended range to catch overlapping tides (full cycle support)
  const fetchStart = startOfToday - 12 * 60 * 60 * 1000;
  const fetchEnd = endOfThreeDays + 12 * 60 * 60 * 1000;

  const { data: tides } = useTides(fetchStart, fetchEnd);

  if (!tides || tides.length === 0) return null;

  // Active Day boundaries
  const activeStart = activeDay === "today" ? startOfToday : 
                      activeDay === "tomorrow" ? startOfDay(addDays(now, 1)).getTime() : 
                      startOfAfterTomorrow;
  const activeEnd = activeDay === "today" ? startOfDay(addDays(now, 1)).getTime() : 
                    activeDay === "tomorrow" ? startOfAfterTomorrow : 
                    endOfThreeDays;

  const displayWindows = calculateThresholdCrossings(tides, TIDE_THRESHOLD_METERS)
    .filter((window) => window.start < activeEnd && window.end > activeStart);

  const formatFuzzy = (time: number) => {
    const { start, end } = getRoundedCrossingWindow(time);
    const roundedCenter = (start + end) / 2;
    const dayStartOfTime = startOfDay(roundedCenter).getTime();
    const dayDiff = Math.round((dayStartOfTime - activeStart) / (24 * 3600 * 1000));
    
    let label = "";
    if (dayDiff < 0) label = " (Hier)";
    if (dayDiff > 0) label = " (Dem.)";

    const d1 = format(start, "HH'h'mm");
    const d2 = format(end, "HH'h'mm");
    return `${d1} - ${d2}${label}`;
  };

  return (
    <div className="bg-white text-abysse p-6 rounded-2xl relative overflow-hidden border border-slate-200">
      <span className="material-symbols-outlined absolute -right-6 -top-6 text-slate-100 text-[120px]">water_lux</span>
      
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-[10px] font-black text-turquoise uppercase tracking-[0.2em] mb-1">Pointe d'Agon</p>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight mb-4">Mise à l'eau 5m</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {["today", "tomorrow", "after"].map((d) => (
              <button 
                key={d}
                onClick={() => setActiveDay(d as any)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border focus-visible:outline-2 focus-visible:outline-turquoise ${activeDay === d ? 'bg-abysse border-abysse text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {d === 'today' ? "Auj." : d === 'tomorrow' ? "Dem." : "Apr."}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {displayWindows.length > 0 ? (
            displayWindows.map((win, i) => (
              <div key={i} className="group border-l-2 border-turquoise/30 pl-4 py-1 hover:border-turquoise transition-colors">
                <div className="flex items-center gap-3 mb-3 text-slate-500">
                  <span className="material-symbols-outlined text-sm">water_lux</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Passage aux 5 mètres</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    <span className="text-xs block text-slate-500 font-semibold mb-1">Montée</span>
                    <span className="text-sm font-bold text-abysse">{formatFuzzy(win.start)}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    <span className="text-[8px] block text-slate-500 uppercase font-bold mb-1">Descente</span>
                    <span className="text-sm font-bold text-abysse">{formatFuzzy(win.end)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 font-medium italic">Pas de passage aux 5m ce jour.</p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">
            * Horaires de croisement du seuil 5m. <br/>
            Seuil local calibré à {TIDE_THRESHOLD_METERS.toFixed(2)} m (Regnéville).
          </p>
        </div>
      </div>
    </div>
  );
}
