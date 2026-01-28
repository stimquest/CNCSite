"use client";

import { useTides } from "../lib/hooks/useTides";
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

  // Smoothed data for calculation
  const chartData = tides
    .map(t => ({ time: t.timestamp, height: Math.max(0, t.height) }))
    .sort((a, b) => a.time - b.time);

  const extremes = tides.filter((t) => t.type === "extreme");
  const highTides = extremes.filter(e => e.status === 'high');
  const threshold = 4.70; 
  const displayWindows = [];

  for (const pm of highTides) {
    // 1. Calculate Window for this PM
    let start = pm.timestamp;
    const pmIndex = chartData.findIndex(d => d.time === pm.timestamp);
    if (pmIndex === -1) continue;

    // Scan backwards from peak
    for (let i = pmIndex - 1; i >= 0; i--) {
      if (chartData[i].height < threshold) {
        start = chartData[i+1]?.time || chartData[i].time;
        break;
      }
      start = chartData[i].time;
    }
    
    let end = pm.timestamp;
    // Scan forwards from peak
    for (let i = pmIndex + 1; i < chartData.length; i++) {
      if (chartData[i].height < threshold) {
        end = chartData[i-1]?.time || chartData[i].time;
        break;
      }
      end = chartData[i].time;
    }

    if (end <= start) continue;

    // 2. Overlap condition: WindowStart < activeEnd AND WindowEnd > activeStart
    const overlapsDay = start < activeEnd && end > activeStart;

    if (overlapsDay) {
        displayWindows.push({ start, end, peak: { time: pm.timestamp, height: pm.height } });
    }
  }

  // Sort and deduplicate
  displayWindows.sort((a, b) => a.start - b.start);

  const formatFuzzy = (time: number) => {
    const dayStartOfTime = startOfDay(time).getTime();
    const dayDiff = Math.round((dayStartOfTime - activeStart) / (24 * 3600 * 1000));
    
    let label = "";
    if (dayDiff < 0) label = " (Hier)";
    if (dayDiff > 0) label = " (Dem.)";

    const d1 = format(time - 10 * 60 * 1000, "HH'h'mm");
    const d2 = format(time + 10 * 60 * 1000, "HH'h'mm");
    return `${d1} - ${d2}${label}`;
  };

  return (
    <div className="bg-abysse text-white p-10 rounded-[2rem] relative overflow-hidden shadow-2xl">
      <span className="material-symbols-outlined absolute -right-6 -top-6 text-white/5 text-[150px]">water_lux</span>
      
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-[10px] font-black text-turquoise uppercase tracking-[0.2em] mb-1">Pointe d'Agon</p>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">Mise à l'eau 5m</h3>
          
          <div className="flex gap-2 mb-8">
            {["today", "tomorrow", "after"].map((d) => (
              <button 
                key={d}
                onClick={() => setActiveDay(d as any)}
                className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all ${activeDay === d ? 'bg-turquoise border-turquoise text-abysse' : 'border-white/10 text-white/40 hover:text-white'}`}
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
                <div className="flex items-center gap-3 mb-3 text-white/40">
                  <span className="material-symbols-outlined text-sm">water_lux</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Passage aux 5 mètres</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                    <span className="text-[8px] block text-white/30 uppercase font-bold mb-1">Montée</span>
                    <span className="text-sm font-black text-white">{formatFuzzy(win.start)}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                    <span className="text-[8px] block text-white/30 uppercase font-bold mb-1">Descente</span>
                    <span className="text-sm font-black text-white">{formatFuzzy(win.end)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 font-medium italic">Pas de passage aux 5m ce jour.</p>
          )}
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
            * Horaires de croisement du seuil 5m. <br/>
            Basé sur correction 4.75m (Regnéville).
          </p>
        </div>
      </div>
    </div>
  );
}
