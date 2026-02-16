"use client";

import React, { useMemo } from 'react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    ReferenceLine,
    CartesianGrid
} from "recharts";
import { format, startOfDay, addDays } from "date-fns";
import { useContent } from "@/contexts/ContentContext";

export function SignageTideChart() {
    const { tides, weather } = useContent();
    const now = Date.now();
    const todayStart = startOfDay(now).getTime();
    const todayEnd = addDays(todayStart, 1).getTime();

    const chartData = useMemo(() => {
        if (!tides || tides.length === 0) return [];

        // Filtre les données pour aujourd'hui
        return tides
            .filter(t => t.timestamp >= todayStart && t.timestamp <= todayEnd)
            .map(t => ({
                time: t.timestamp,
                height: Math.max(0, t.height),
                isExtreme: t.type === 'extreme'
            }))
            .sort((a, b) => a.time - b.time);
    }, [tides, todayStart, todayEnd]);

    if (chartData.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-white/5 rounded-[3rem] animate-pulse">
                <span className="text-xl font-black uppercase tracking-[0.5em] text-white/20 italic">Initialisation Marée...</span>
            </div>
        );
    }

    const currentHeight = chartData.reduce((prev, curr) =>
        Math.abs(curr.time - now) < Math.abs(prev.time - now) ? curr : prev
        , chartData[0]).height;

    return (
        <div className="h-full w-full relative group">
            {/* Background Grid - Very subtle */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="h-full w-full grid grid-rows-6 border-b border-white/10">
                    {[...Array(6)].map((_, i) => <div key={i} className="border-t border-white/5 w-full" />)}
                </div>
            </div>

            <div className="absolute inset-0 z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 100, right: 0, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="signageOcean" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00FFCC" stopOpacity={0.8} />
                                <stop offset="50%" stopColor="#00CCFF" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#0000FF" stopOpacity={0.1} />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="15" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[todayStart, todayEnd]}
                            hide
                        />

                        <YAxis
                            domain={[0, 20]}
                            hide
                        />

                        <Area
                            type="monotone"
                            dataKey="height"
                            stroke="#00FFCC"
                            strokeWidth={4}
                            fill="url(#signageOcean)"
                            isAnimationActive={true}
                            animationDuration={2000}
                            className="drop-shadow-[0_0_20px_rgba(0,255,204,0.3)]"
                        />

                        {/* Current Time Indicator Line */}
                        <ReferenceLine
                            x={now}
                            stroke="#FFA500"
                            strokeWidth={2}
                            strokeDasharray="10 8"
                        />

                        {/* Current Height Dot */}
                        <ReferenceLine
                            x={now}
                            stroke="transparent"
                            label={({ viewBox }) => {
                                const yPos = viewBox.height - (currentHeight / 20) * viewBox.height + viewBox.y;
                                return (
                                    <g>
                                        <circle cx={viewBox.x} cy={yPos} r="12" fill="#FFA500" stroke="#fff" strokeWidth="4" />
                                        <circle cx={viewBox.x} cy={yPos} r="25" fill="#FFA500" fillOpacity="0.1" className="animate-pulse" />
                                    </g>
                                );
                            }}
                        />

                        {/* Peaks Labels (High/Low) - Automatic detection */}
                        {chartData.filter(d => d.isExtreme).map((extreme, idx) => (
                            <ReferenceLine
                                key={idx}
                                x={extreme.time}
                                stroke="transparent"
                                label={({ viewBox }) => {
                                    const yPos = viewBox.height - (extreme.height / 20) * viewBox.height + viewBox.y;
                                    const isHigh = extreme.height > 6;
                                    return (
                                        <g transform={`translate(${viewBox.x}, ${yPos + (isHigh ? -40 : 40)})`}>
                                            <text
                                                fill="#fff"
                                                fontSize="18"
                                                fontWeight="900"
                                                textAnchor="middle"
                                                className="uppercase italic tracking-tighter"
                                            >
                                                {format(extreme.time, "HH:mm")}
                                            </text>
                                            <text
                                                y="18"
                                                fill="rgba(255,255,255,0.4)"
                                                fontSize="12"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                className="uppercase tracking-widest"
                                            >
                                                {extreme.height.toFixed(1)}m
                                            </text>
                                        </g>
                                    );
                                }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Hero Labels Overlay - Adjusted for no overlap & Scaled Down */}
            <div className="absolute top-6 left-0 right-0 flex justify-between px-8 z-20">
                <div className="bg-abysse/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5 space-y-1 shadow-2xl">
                    <h4 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] leading-none">Coefficient</h4>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-turquoise tabular-nums leading-none">
                            {weather.coefficient || '--'}
                        </span>
                    </div>
                </div>

                <div className="bg-abysse/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5 text-right space-y-1 shadow-2xl">
                    <h4 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] leading-none">Hauteur Live</h4>
                    <p className="text-4xl font-black text-white tabular-nums leading-none">
                        {currentHeight.toFixed(2)}<span className="text-xl text-slate-500 ml-1">m</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
