"use client";

import { useTides } from "../lib/hooks/useTides";
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


  const isShowingToday = activeDay === "today";
  const currentTide = chartData.reduce((prev, curr) => 
    Math.abs(curr.time - now) < Math.abs(prev.time - now) ? curr : prev
  , chartData[0]);

  // Calculate crossing points and peaks for labels on the curve (Sync with SHOM screenshot style)
  const threshold = 4.80;
  const graphLabels: { time: number; height: number; type: 'rising' | 'falling' | 'peak' }[] = [];

  // 1. Add Peaks (High Tides) that are relevant
  extremesInRange
    .filter(e => e.status === 'high' && e.height >= 4.0) // Show peaks above 4m
    .forEach(e => {
      graphLabels.push({ time: e.timestamp, height: e.height, type: 'peak' });
    });

  // 2. Add Crossing points if not too close to a peak
  for (let i = 1; i < chartData.length; i++) {
    const prev = chartData[i-1];
    const curr = chartData[i];
    
    // Crossing detection: Always pick the point that is "Safe" (at or above threshold)
    // for navigational consistency with the AgonCard windows.
    let added = null;
    if (prev.height < threshold && curr.height >= threshold) {
      // Rising: pick the first point that reaches or exceeds the threshold
      added = { time: curr.time, height: curr.height, type: 'rising' as const };
    } else if (prev.height > threshold && curr.height <= threshold) {
      // Falling: pick the last point that was still above the threshold
      added = { time: prev.time, height: prev.height, type: 'falling' as const };
    }

    if (added) {
      // Don't add if there's already a peak label very close (within 30 mins)
      const tooClose = graphLabels.some(l => l.type === 'peak' && Math.abs(l.time - added!.time) < 30 * 60 * 1000);
      if (!tooClose) {
        graphLabels.push(added);
      }
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Premium Day Selector */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {["today", "tomorrow", "after"].map((d) => (
          <button 
            key={d}
            onClick={() => setActiveDay(d as any)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDay === d ? 'bg-abysse text-white shadow-xl' : 'text-slate-400 hover:text-abysse'}`}
          >
            {d === 'today' ? "Aujourd'hui" : d === 'tomorrow' ? "Demain" : "Après-Demain"}
          </button>
        ))}
      </div>

      {/* Main Chart Card - Abysse Style */}
      <div className="relative h-[450px] md:h-[550px] bg-abysse rounded-[3rem] p-6 md:p-12 border border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden group">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 80, right: 30, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id="premiumOceanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFA500" />
                <stop offset="15%" stopColor="#FFFF00" />
                <stop offset="35%" stopColor="#00FFCC" />
                <stop offset="60%" stopColor="#00CCFF" />
                <stop offset="100%" stopColor="#0000FF" />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={[targetStart, targetEnd]}
              tickFormatter={(t) => format(t, "HH'h'")}
              stroke="white"
              stopOpacity={0.1}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 'bold' }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              domain={[0, 12]}
              stroke="white"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val}m`}
            />

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

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
              stroke="#fff" 
              strokeWidth={2}
              fillOpacity={0.9} 
              fill="url(#premiumOceanGradient)" 
              animationDuration={2000}
            />

            <ReferenceLine 
              y={threshold} 
              stroke="rgba(0, 255, 204, 0.2)" 
              strokeWidth={1}
              strokeDasharray="10 5" 
              label={({ viewBox }) => (
                <text x={viewBox.width + viewBox.x - 20} y={viewBox.y - 12} fill="rgba(0, 255, 204, 0.4)" fontSize={9} fontWeight="black" textAnchor="end" className="uppercase tracking-[0.2em]">Seuil {threshold}m</text>
              )} 
            />

            {/* Labels on the curve (SHOM Style) */}
            {graphLabels.map((label, idx) => (
              <ReferenceLine 
                key={idx}
                x={label.time} 
                stroke="transparent"
                label={({ viewBox }) => {
                  const yPos = viewBox.height - (label.height / 12) * viewBox.height + viewBox.y;
                  const isPeak = label.type === 'peak';
                  return (
                    <g>
                      <circle cx={viewBox.x} cy={yPos} r={isPeak ? 6 : 4} fill={isPeak ? "#FFA500" : "#fff"} />
                      <g transform={`translate(${viewBox.x - 40}, ${yPos - (isPeak ? 40 : 35)})`}>
                        <rect width="80" height="22" rx="4" fill={isPeak ? "rgba(255,165,0,0.9)" : "rgba(0,0,0,0.8)"} />
                        <text x="40" y="14" fill={isPeak ? "#000" : "#fff"} fontSize="10" fontWeight="black" textAnchor="middle">
                          {format(label.time, "HH:mm")} - {label.height.toFixed(2)}m
                        </text>
                        {/* Little triangle pointer */}
                        <path d="M 35 22 L 40 28 L 45 22 Z" fill={isPeak ? "rgba(255,165,0,0.9)" : "rgba(0,0,0,0.8)"} />
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
                  const yPos = viewBox.height - (currentTide.height / 12) * viewBox.height + viewBox.y;
                  return (
                    <g>
                      <circle cx={viewBox.x} cy={yPos} r="10" fill="#FFA500" stroke="#fff" strokeWidth="4" />
                      <circle cx={viewBox.x} cy={yPos} r="20" fill="#FFA500" fillOpacity="0.2" className="animate-pulse" />
                    </g>
                  );
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

        <div className="absolute top-12 left-12 space-y-4">
            <h4 className="text-white font-black text-4xl italic uppercase tracking-tighter leading-none">Coutainville</h4>
            <div className="flex gap-2 items-center bg-black/20 p-2 rounded-xl border border-white/5 backdrop-blur-md">
                <span className="text-[9px] font-black text-white/40 px-2 uppercase tracking-widest">Échelle (m)</span>
                {[0, 2, 4, 6, 8, 10, 12].map((v, i) => (
                    <div key={i} className="w-8 h-5 flex items-center justify-center text-[9px] font-black text-white rounded-[4px]" style={{ backgroundColor: ["#0000FF", "#0099FF", "#00FFFF", "#00FF66", "#CCFF00", "#FFFF00", "#FFA500"][i] }}>
                        {v}
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
}
