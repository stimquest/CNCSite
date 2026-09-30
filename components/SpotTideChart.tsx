"use client";

import { useTides } from "../lib/hooks/useTides";
import { calculateThresholdCrossings, getRoundedCrossingWindow, TIDE_THRESHOLD_METERS } from "../lib/tide-utils";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { format, startOfDay, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

export function SpotTideChart() {
  const [activeDay, setActiveDay] = useState<"today" | "tomorrow" | "after">("today");
  
  const now = Date.now();
  const startOfToday = startOfDay(now).getTime();
  const startOfTomorrow = startOfDay(addDays(now, 1)).getTime();
  const startOfAfterTomorrow = startOfDay(addDays(now, 2)).getTime();
  const endOfThreeDays = startOfDay(addDays(now, 3)).getTime();

  const { data: tides } = useTides(startOfToday, endOfThreeDays);

  if (tides === undefined) {
    return <div className="h-80 flex items-center justify-center text-white/30 bg-abysse rounded-[3rem] border border-white/5 shadow-2xl uppercase font-black tracking-widest text-[10px]">Chargement...</div>;
  }

  if (tides.length === 0) {
    return <div className="h-80 flex items-center justify-center text-white/30 bg-abysse rounded-[3rem] border border-white/5 shadow-2xl uppercase font-black tracking-widest text-[10px]">Indisponible</div>;
  }

  // Filter for chart display
  const targetStart = activeDay === "today" ? startOfToday : 
                    activeDay === "tomorrow" ? startOfTomorrow : 
                    startOfAfterTomorrow;
  const targetEnd = activeDay === "today" ? startOfTomorrow : 
                  activeDay === "tomorrow" ? startOfAfterTomorrow : 
                  endOfThreeDays;

  // Intelligent merge for a perfect sinusoid hitting the peaks
  const extremesInRange = tides.filter((t) => t.type === "extreme" && t.timestamp >= targetStart && t.timestamp <= targetEnd);
  const heightsInRange = tides.filter((t) => t.type === "height" && t.timestamp >= targetStart && t.timestamp <= targetEnd);

  const chartData = [
    ...extremesInRange.map(e => ({ time: e.timestamp, height: Math.max(0, e.height) })),
    ...heightsInRange
      .filter(h => !extremesInRange.some(e => Math.abs(e.timestamp - h.timestamp) < 10 * 60 * 1000))
      .map(h => ({ time: h.timestamp, height: Math.max(0, h.height) }))
  ].sort((a, b) => a.time - b.time);

  // Keep enough headroom for spring-tide peaks and their labels.
  const highestHeight = Math.max(0, ...chartData.map((point) => point.height));
  const chartMaxHeight = Math.max(12, Math.ceil(highestHeight + 3));


  const isShowingToday = activeDay === "today";
  const currentTide = chartData.reduce((prev, curr) => 
    Math.abs(curr.time - now) < Math.abs(prev.time - now) ? curr : prev
  , chartData[0]);

  // Calculate crossing points and peaks for labels on the curve (Sync with SHOM screenshot style)
  const threshold = TIDE_THRESHOLD_METERS;
  const graphLabels: { time: number; height: number; type: 'rising' | 'falling' | 'peak' }[] = [];

  // 1. Add Peaks (High Tides) that are relevant
  extremesInRange
    .filter(e => e.status === 'high' && e.height >= 4.0) // Show peaks above 4m
    .forEach(e => {
      graphLabels.push({ time: e.timestamp, height: e.height, type: 'peak' });
    });

  // Use the same interpolated crossings as the navigation card.
  for (const window of calculateThresholdCrossings(tides, threshold)) {
    if (window.start >= targetStart && window.start <= targetEnd) {
      graphLabels.push({ time: window.start, height: threshold, type: 'rising' });
    }
    if (window.end >= targetStart && window.end <= targetEnd) {
      graphLabels.push({ time: window.end, height: threshold, type: 'falling' });
    }
  }

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Premium Day Selector */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {["today", "tomorrow", "after"].map((d) => (
          <button 
            key={d}
            type="button"
            aria-pressed={activeDay === d}
            onClick={() => setActiveDay(d as any)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold focus-visible:outline-2 focus-visible:outline-turquoise ${activeDay === d ? 'bg-abysse text-white' : 'text-slate-600 hover:text-abysse'}`}
          >
            {d === 'today' ? "Aujourd'hui" : d === 'tomorrow' ? "Demain" : "Après-Demain"}
          </button>
        ))}
      </div>

      {/* Main Chart Card - Abysse Style */}
      <div className="relative h-[320px] md:h-[360px] bg-white rounded-2xl p-3 md:p-5 border border-slate-200 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 45, right: 24, left: -15, bottom: 8 }}>
            <defs>
              <linearGradient id="premiumOceanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00a9ce" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00a9ce" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={[targetStart, targetEnd]}
              tickFormatter={(t) => format(t, "HH'h'")}
              stroke="white"
              stopOpacity={0.1}
              tick={{ fill: '#607687', fontSize: 11, fontWeight: 'bold' }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              domain={[0, chartMaxHeight]}
              stroke="white"
              tick={{ fill: '#607687', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val}m`}
            />

            <CartesianGrid strokeDasharray="3 4" stroke="#e2e8f0" vertical={false} />

            <Tooltip 
              contentStyle={{ backgroundColor: '#0c1458', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}
              itemStyle={{ color: '#fff', fontWeight: 'black', fontSize: '14px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: 'bold' }}
              labelFormatter={(t) => format(t, "eeee d MMMM - HH:mm", { locale: fr })}
              formatter={(value: number | undefined) => [value ? `${value.toFixed(2)}m` : '', 'Hauteur']}
            />

            <Area 
              type="monotone" 
              dataKey="height" 
              stroke="#009bb8"
              strokeWidth={2}
              fillOpacity={0.9} 
              fill="url(#premiumOceanGradient)" 
              isAnimationActive={false}
            />

            <ReferenceLine 
              y={threshold} 
              stroke="#94b5c3"
              strokeWidth={1}
              strokeDasharray="10 5" 
              label={({ viewBox }) => (
                <text x={viewBox.width + viewBox.x - 20} y={viewBox.y - 12} fill="#607687" fontSize={10} textAnchor="end">Seuil {threshold} m</text>
              )} 
            />

            {/* Labels on the curve (SHOM Style) */}
            {graphLabels.map((label, idx) => (
              <ReferenceLine 
                key={idx}
                x={label.time} 
                stroke="transparent"
                label={({ viewBox }) => {
                  const yPos = viewBox.height - (label.height / chartMaxHeight) * viewBox.height + viewBox.y;
                  const isPeak = label.type === 'peak';
                  const badgeWidth = isPeak ? 80 : 104;
                  const badgeText = isPeak
                    ? `${format(label.time, "HH:mm")} - ${label.height.toFixed(2)}m`
                    : (() => {
                        const crossingWindow = getRoundedCrossingWindow(label.time);
                        return `${format(crossingWindow.start, "HH:mm")}–${format(crossingWindow.end, "HH:mm")}`;
                      })();
                  return (
                    <g>
                      <circle cx={viewBox.x} cy={yPos} r={isPeak ? 6 : 4} fill={isPeak ? "#FFA500" : "#fff"} />
                      <g transform={`translate(${viewBox.x - badgeWidth / 2}, ${yPos - (isPeak ? 40 : 35)})`}>
                        <rect width={badgeWidth} height="22" rx="4" fill={isPeak ? "rgba(255,165,0,0.9)" : "rgba(0,0,0,0.8)"} />
                        <text x={badgeWidth / 2} y="14" fill={isPeak ? "#000" : "#fff"} fontSize="10" fontWeight="black" textAnchor="middle">
                          {badgeText}
                        </text>
                        {/* Little triangle pointer */}
                        <path d={`M ${badgeWidth / 2 - 5} 22 L ${badgeWidth / 2} 28 L ${badgeWidth / 2 + 5} 22 Z`} fill={isPeak ? "rgba(255,165,0,0.9)" : "rgba(0,0,0,0.8)"} />
                      </g>
                    </g>
                  );
                }}
              />
            ))}

            {isShowingToday && now >= targetStart && now <= targetEnd && currentTide && (
              <ReferenceLine 
                x={now} 
                stroke="transparent"
                label={({ viewBox }) => {
                  const yPos = viewBox.height - (currentTide.height / chartMaxHeight) * viewBox.height + viewBox.y;
                  return (
                    <g>
                      <circle cx={viewBox.x} cy={yPos} r="10" fill="#FFA500" stroke="#fff" strokeWidth="4" />
                      <circle cx={viewBox.x} cy={yPos} r="20" fill="#FFA500" fillOpacity="0.15" />
                    </g>
                  );
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}
