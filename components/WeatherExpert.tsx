"use client";

import React, { useEffect, useState } from 'react';
import {
    Zap,
    Calendar,
    Sunrise,
    Sunset,
    Wind,
    Waves,
    Thermometer,
    ArrowDown,
    Droplets,
    Clock,
    RefreshCw
} from 'lucide-react';
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer as RC,
    ReferenceLine as RefLine,
} from 'recharts';

interface WeatherExpertData {
    weather: any;
    currents: any;
    waves: any;
    updatedAt: string;
}

export const WeatherExpert: React.FC = () => {
    const [data, setData] = useState<WeatherExpertData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/weather-expert');
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching expert weather:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 60 minutes
        const interval = setInterval(() => {
            if (!document.hidden) fetchData();
        }, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getWindColor = (knots: number) => {
        // Échelle basée sur l'image utilisateur (Windy/IWA/Beaufort style)
        if (knots <= 1) return { bg: '#7e00ff', text: '#ffffff' }; // 0nd: Violet
        if (knots <= 3) return { bg: '#6521ff', text: '#ffffff' }; // 2nd: Indigo
        if (knots <= 5) return { bg: '#2130ff', text: '#ffffff' }; // 4nd: Bleu foncé
        if (knots <= 7) return { bg: '#0060ff', text: '#ffffff' }; // 6nd: Bleu
        if (knots <= 9) return { bg: '#0099ff', text: '#ffffff' }; // 8nd: Bleu clair
        if (knots <= 11) return { bg: '#00ccff', text: '#004a48' }; // 10nd: Cyan ciel
        if (knots <= 13) return { bg: '#00ffff', text: '#004a48' }; // 12nd: Cyan pur
        if (knots <= 15) return { bg: '#15f7b8', text: '#004a3d' }; // 14nd: Turquoise
        if (knots <= 17) return { bg: '#15e378', text: '#004a25' }; // 16nd: Vert d'eau
        if (knots <= 19) return { bg: '#15db2a', text: '#0c4a00' }; // 18nd: Vert
        if (knots <= 21) return { bg: '#26e615', text: '#0c4a00' }; // 20nd: Vert clair
        if (knots <= 23) return { bg: '#84eb21', text: '#314a00' }; // 22nd: Limette
        if (knots <= 25) return { bg: '#d1f514', text: '#3c4a00' }; // 24nd: Jaune-Vert
        if (knots <= 27) return { bg: '#ffff00', text: '#4a4a00' }; // 26nd: Jaune
        if (knots <= 29) return { bg: '#ffdf00', text: '#4a4100' }; // 28nd: Jaune d'or
        if (knots <= 31) return { bg: '#ffc000', text: '#ffffff' }; // 30nd: Ambre
        if (knots <= 33) return { bg: '#ff9f00', text: '#ffffff' }; // 32nd: Orange clair
        if (knots <= 35) return { bg: '#ff7f00', text: '#ffffff' }; // 34nd: Orange
        if (knots <= 37) return { bg: '#ff5f00', text: '#ffffff' }; // 36nd: Orange foncé
        if (knots <= 39) return { bg: '#ff3f00', text: '#ffffff' }; // 38nd: Rouge-Orange
        if (knots <= 41) return { bg: '#ff1f00', text: '#ffffff' }; // 40nd: Rouge clair
        if (knots <= 43) return { bg: '#df1b00', text: '#ffffff' }; // 42nd: Rouge
        if (knots <= 45) return { bg: '#bf1700', text: '#ffffff' }; // 44nd: Rouge mat
        if (knots <= 47) return { bg: '#9f1300', text: '#ffffff' }; // 46nd: Rouge foncé
        if (knots <= 49) return { bg: '#7f0f00', text: '#ffffff' }; // 48nd: Bordeaux
        return { bg: '#bf2170', text: '#ffffff' }; // 50nd+: Rose/Violet violent
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 bg-abysse/50 rounded-[3rem] border border-white/10 animate-pulse">
            <RefreshCw className="animate-spin text-turquoise mb-4" size={40} />
            <p className="text-turquoise font-black uppercase tracking-widest text-xs">Chargement AROME HD...</p>
        </div>
    );

    if (!data) return null;

    const { weather, currents, waves, updatedAt } = data;
    const w15 = weather.minutely_15;
    const wHor = weather.hourly;
    const cHor = currents.hourly;
    const wav = waves.hourly;
    const now = new Date();

    // --- LOGIQUE SECTION 1 (15 MIN) ---
    const startIdx15 = w15.time.findIndex((t: string) => new Date(t) >= now);
    const count15 = 32; // 8 heures × 4 points/h
    const indices15 = Array.from({ length: count15 }, (_, i) => startIdx15 + i).filter(idx => w15.time[idx]);

    // --- LOGIQUE SECTION 2 (HORAIRE) ---
    const startIdxHor = wHor.time.findIndex((t: string) => new Date(t) >= new Date(now.getTime() - 3600000));
    const indicesHor = Array.from({ length: wHor.time.length - startIdxHor }, (_, i) => startIdxHor + i);

    return (
        <div className="space-y-8 text-white font-sans">

            {/* Header / Meta */}
            <div className="flex items-center justify-between gap-4 px-4 flex-wrap">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter italic uppercase text-turquoise leading-none">Coutainville Expert</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Détail Haute Définition (1.3km) & Marine</p>
                </div>

                <div className="flex items-center gap-3">
                    {weather.daily && (
                        <>
                            <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                                <Sunrise size={17} className="text-yellow-500 shrink-0" />
                                <span className="text-sm font-black text-abysse">
                                    {new Date(weather.daily.sunrise[0]).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </span>
                            <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                                <Sunset size={17} className="text-orange-500 shrink-0" />
                                <span className="text-sm font-black text-abysse">
                                    {new Date(weather.daily.sunset[0]).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </span>
                        </>
                    )}
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2">
                        <Droplets size={17} className="shrink-0" />
                        <span className="text-sm font-black">Mer {cHor.sea_surface_temperature[0]?.toFixed(1)}°C</span>
                    </div>
                </div>
            </div>

            {/* SECTION 1: AROME HD 15MIN — GRAPHIQUES & DÉTAILS */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                    <Zap size={22} className="text-turquoise" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-abysse">Direct AROME HD (1.3km)</h3>
                </div>

                {(() => {
                    const chartData15 = indices15.map(idx => {
                        const d = new Date(w15.time[idx]);
                        const h = d.getHours();
                        const m = d.getMinutes();
                        const timeStrFull = w15.time[idx].substring(0, 14) + '00';
                        const wIdx = wav.time.indexOf(timeStrFull);
                        let gust = w15.wind_gusts_10m ? w15.wind_gusts_10m[idx] : null;
                        if (gust === null || gust === undefined) {
                            const ts = w15.time[idx].substring(0, 13) + ':00';
                            const hIdx = wHor.time.findIndex((t: string) => t.startsWith(ts));
                            gust = hIdx !== -1 ? wHor.wind_gusts_10m[hIdx] : null;
                        }
                        return {
                            time: d.getTime(),
                            label: `${h}:${m === 0 ? '00' : '30'}`,
                            isHour: m === 0,
                            vent: Math.round(w15.wind_speed_10m[idx]),
                            rafales: gust !== null ? Math.round(gust) : null,
                            direction: w15.wind_direction_10m?.[idx] ?? null,
                            waveHeight: wIdx !== -1 ? wav.wave_height[wIdx] : null,
                            waveDir: wIdx !== -1 ? wav.wave_direction[wIdx] : null,
                            wavePeriod: wIdx !== -1 ? wav.wave_period[wIdx] : null,
                            tempAir: w15.temperature_2m?.[idx] ?? null,
                        };
                    });

                    // Une colonne de données toutes les 30min
                    const hdDetails = chartData15.filter((_, i) => i % 2 === 0);

                    const CHART_H = 240;
                    const ROW_H = 46;

                    const tooltipStyle = { backgroundColor: '#0c1458', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
                    const labelStyle = { color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.15em' };

                    const LABEL_BG = 'bg-[#060c20]/95 backdrop-blur-md';
                    const CELL = 'flex-1 flex items-center justify-center border-r border-white/5 text-sm font-black';

                    return (
                        <div className="bg-abysse rounded-4xl border border-white/10 shadow-2xl overflow-hidden">

                            {/* Header légende (pas paddinné comme avant) */}
                            <div className="flex items-center gap-8 px-8 pt-8 pb-2">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Vent &amp; Rafales (nds)</span>
                                <span className="flex items-center gap-2 text-[10px] font-black text-turquoise"><span className="size-2.5 rounded-sm bg-turquoise inline-block" /> Vent</span>
                                <span className="flex items-center gap-2 text-[10px] font-black text-orange-400"><span className="size-2.5 rounded-sm bg-orange-400 inline-block" /> Rafales</span>
                            </div>

                            {/* LAYOUT PRINCIPAL: sticky labels | scrollable chart+données */}
                            <div className="flex">

                                {/* COLONNE LABELS — sticky à gauche */}
                                <div className={`sticky left-0 z-30 ${LABEL_BG} border-r border-white/10 shrink-0 w-36`}>
                                    {/* Zone correspondant à la hauteur du chart (CHART_H + padding top 8px) */}
                                    <div style={{ height: CHART_H + 8 }} />
                                    {/* Lignes de labels */}
                                    {[
                                        { label: 'Vent (kts)', color: 'text-slate-400' },
                                        { label: 'Rafales', color: 'text-orange-400' },
                                        { label: 'Direction', color: 'text-slate-500' },
                                        { label: 'Vagues (m)', color: 'text-cyan-400' },
                                        { label: 'Dir. vagues', color: 'text-cyan-700' },
                                        { label: 'Période (s)', color: 'text-slate-400' },
                                        { label: 'Temp Air', color: 'text-amber-300' },
                                    ].map(({ label, color }, i) => (
                                        <div key={i} style={{ height: ROW_H }} className={`flex items-center px-4 border-t border-white/10 text-xs font-black whitespace-nowrap ${color}`}>
                                            {label}
                                        </div>
                                    ))}
                                </div>

                                {/* ZONE PLEIN ÉCRAN: chart + lignes de données */}
                                <div className="flex-1 min-w-0">
                                    <div>

                                        {/* CHART — 100% de la zone, s'aligne avec les colonnes flex */}
                                        <RC width="100%" height={CHART_H}>
                                            <AreaChart data={chartData15} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="gradVent2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#00e5cc" stopOpacity={0.65} />
                                                        <stop offset="100%" stopColor="#00e5cc" stopOpacity={0.05} />
                                                    </linearGradient>
                                                    <linearGradient id="gradRafales2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#fb923c" stopOpacity={0.45} />
                                                        <stop offset="100%" stopColor="#fb923c" stopOpacity={0.02} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                                <XAxis
                                                    dataKey="label"
                                                    tick={({ x, y, payload, index }) => {
                                                        const pt = chartData15[index];
                                                        return (
                                                            <text x={x} y={(y as number) + 12} textAnchor="middle"
                                                                fill={pt?.isHour ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.28)'}
                                                                fontSize={pt?.isHour ? 13 : 9}
                                                                fontWeight="bold">
                                                                {payload.value}
                                                            </text>
                                                        );
                                                    }}
                                                    axisLine={false} tickLine={false} interval={1}
                                                />
                                                <YAxis tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} width={32} />
                                                <RechartsTooltip contentStyle={tooltipStyle} labelStyle={labelStyle} formatter={(v: any, n?: string) => [`${v} nds`, n === 'vent' ? 'Vent' : 'Rafales']} labelFormatter={() => ''} />
                                                <Area type="monotone" dataKey="rafales" stroke="#fb923c" strokeWidth={2} fill="url(#gradRafales2)" dot={false} animationDuration={1200} />
                                                <Area type="monotone" dataKey="vent" stroke="#00e5cc" strokeWidth={3} fill="url(#gradVent2)" dot={{ r: 2, fill: '#00e5cc', strokeWidth: 0 }} activeDot={{ r: 5 }} animationDuration={1200} />
                                            </AreaChart>
                                        </RC>

                                        {/* LIGNES DE DONNÉES — chaque div de largeur COL_W */}

                                        {/* Vent */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => {
                                                const c = getWindColor(pt.vent);
                                                return <div key={i} style={{ backgroundColor: c.bg, color: c.text }} className={CELL}>{pt.vent}</div>;
                                            })}
                                        </div>

                                        {/* Rafales */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => {
                                                const c = getWindColor(pt.rafales || 0);
                                                return <div key={i} style={{ backgroundColor: `${c.bg}BB`, color: c.text }} className={CELL}>{pt.rafales ?? '-'}</div>;
                                            })}
                                        </div>

                                        {/* Direction */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => (
                                                <div key={i} className={CELL + ' bg-white/2'}>
                                                    {pt.direction != null
                                                        ? <div style={{ transform: `rotate(${pt.direction}deg)` }}><ArrowDown size={14} className="text-turquoise" /></div>
                                                        : <span className="text-slate-700">—</span>}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Vagues */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => (
                                                <div key={i} className={CELL + ' text-cyan-400 bg-cyan-500/5'}>
                                                    {pt.waveHeight ? pt.waveHeight.toFixed(1) : '-'}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Dir. vagues */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => (
                                                <div key={i} className={CELL}>
                                                    {pt.waveDir != null
                                                        ? <div style={{ transform: `rotate(${pt.waveDir}deg)` }} className="opacity-60"><ArrowDown size={12} className="text-cyan-600" /></div>
                                                        : <span className="text-slate-700">—</span>}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Période */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => (
                                                <div key={i} className={CELL + ' text-slate-400'}>
                                                    {pt.wavePeriod ? Math.round(pt.wavePeriod) : '-'}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Temp Air */}
                                        <div style={{ height: ROW_H }} className="flex border-t border-white/10">
                                            {hdDetails.map((pt, i) => (
                                                <div key={i} className={CELL + ' text-amber-300'}>
                                                    {pt.tempAir != null ? `${Math.round(pt.tempAir)}°` : '-'}
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* SECTION 2: TENDANCES 3 JOURS */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                    <Calendar size={18} className="text-turquoise" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-abysse">Prévisions 3 Jours (Horaires)</h3>
                </div>
                <div className="bg-abysse/80 backdrop-blur-xl rounded-4xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="overflow-x-auto no-scrollbar scroll-smooth">
                        <table className="w-full border-separate border-spacing-0 table-fixed">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 w-32 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-left border-r border-white/10 shadow-xl">3 Jours</th>
                                    {indicesHor.map(idx => {
                                        const d = new Date(wHor.time[idx]);
                                        const isNewDay = d.getHours() === 0;
                                        return (
                                            <th key={idx} className={`w-16 min-w-[64px] text-center py-4 border-r border-white/5 ${isNewDay ? 'border-l-4 border-turquoise shadow-[4px_0_0_-2px_rgba(0,229,204,0.3)]' : ''}`}>
                                                <div className="flex flex-col gap-1">
                                                    {isNewDay || idx === startIdxHor ? (
                                                        <span className="text-[10px] font-black text-turquoise">{d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}</span>
                                                    ) : <span className="h-[12px]" />}
                                                    <span className="text-sm font-black">{d.getHours()}h:00</span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="text-sm font-black tracking-tight uppercase">
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-slate-400 border-r border-white/10">Vent (kts)</td>
                                    {indicesHor.map(idx => {
                                        const speed = Math.round(wHor.wind_speed_10m[idx]);
                                        const colors = getWindColor(speed);
                                        return (
                                            <td key={idx}
                                                style={{ backgroundColor: colors.bg, color: colors.text }}
                                                className="text-center py-3 border-r border-white/5"
                                            >
                                                {speed}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Rafales */}
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-orange-400/80 border-r border-white/10">Rafales</td>
                                    {indicesHor.map(idx => {
                                        const gust = Math.round(wHor.wind_gusts_10m[idx]);
                                        const colors = getWindColor(gust);
                                        return (
                                            <td key={idx}
                                                style={{ backgroundColor: `${colors.bg}CC`, color: colors.text }}
                                                className="text-center py-3 border-r border-white/5"
                                            >
                                                {gust}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Direction */}
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-4 text-slate-400 border-r border-white/10">Direction</td>
                                    {indicesHor.map(idx => (
                                        <td key={idx} className="text-center py-4 border-r border-white/5 bg-white/2">
                                            {wHor.wind_direction_10m?.[idx] != null ? (
                                                <div style={{ transform: `rotate(${wHor.wind_direction_10m[idx]}deg)` }} className="flex justify-center">
                                                    <ArrowDown size={14} className="text-turquoise" />
                                                </div>
                                            ) : '-'}
                                        </td>
                                    ))}
                                </tr>
                                {/* Vagues */}
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-cyan-400 border-r border-white/10">Vagues (m)</td>
                                    {indicesHor.map(idx => {
                                        const timeStr = wHor.time[idx];
                                        const wIdx = wav.time.indexOf(timeStr);
                                        const wh = wIdx !== -1 ? wav.wave_height[wIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-3 border-r border-white/5 text-cyan-400 bg-cyan-500/5">
                                                {wh ? wh.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Dir Vagues */}
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-4 text-cyan-700 border-r border-white/10">Dir. Vagues</td>
                                    {indicesHor.map(idx => {
                                        const timeStr = wHor.time[idx];
                                        const wIdx = wav.time.indexOf(timeStr);
                                        const wd = wIdx !== -1 ? wav.wave_direction?.[wIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-4 border-r border-white/5">
                                                {wd != null ? (
                                                    <div style={{ transform: `rotate(${wd}deg)` }} className="flex justify-center opacity-70">
                                                        <ArrowDown size={12} className="text-cyan-600" />
                                                    </div>
                                                ) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Période — affichée seulement si des données existent */}
                                {indicesHor.some(idx => { const wIdx = wav.time.indexOf(wHor.time[idx]); return wIdx !== -1 && wav.wave_period[wIdx] != null; }) && (
                                    <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                        <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-slate-400 border-r border-white/10">Période (s)</td>
                                        {indicesHor.map(idx => {
                                            const timeStr = wHor.time[idx];
                                            const wIdx = wav.time.indexOf(timeStr);
                                            const wp = wIdx !== -1 ? wav.wave_period[wIdx] : null;
                                            return (
                                                <td key={idx} className="text-center py-3 border-r border-white/5 text-slate-400">
                                                    {wp ? Math.round(wp) : '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )}
                                {/* Pluie */}
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-blue-400 border-r border-white/10">Pluie (%)</td>
                                    {indicesHor.map(idx => {
                                        const prob = wHor.precipitation_probability?.[idx];
                                        const hasRain = prob != null && prob > 20;
                                        return (
                                            <td key={idx} className={`text-center py-3 border-r border-white/5 font-black text-sm ${hasRain ? 'text-blue-400 bg-blue-500/8' : 'text-slate-400'
                                                }`}>
                                                {prob != null ? `${prob}%` : '—'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Air */}
                                <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-slate-500 border-r border-white/10">Air (°C)</td>
                                    {indicesHor.map(idx => {
                                        const temp = wHor.temperature_2m?.[idx];
                                        return (
                                            <td key={idx} className="text-center py-3 border-r border-white/5 text-slate-400">
                                                {temp != null ? `${Math.round(temp)}°` : '—'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Mer */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-950/90 backdrop-blur-md z-30 px-4 py-3 text-emerald-400 border-r border-white/10">Mer (°C)</td>
                                    {indicesHor.map(idx => {
                                        const timeStr = wHor.time[idx];
                                        const cIdx = cHor.time.indexOf(timeStr);
                                        const wt = cIdx !== -1 ? cHor.sea_surface_temperature[cIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-3 border-r border-white/5 text-emerald-400 bg-emerald-500/5">
                                                {wt ? wt.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer / Legend */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 px-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 italic pb-8">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-turquoise" />
                    Actualisé : {new Date(updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-turquoise rounded-full"></div>
                    Vent AROME HD
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-orange-500 rounded-full"></div>
                    Rafales HD
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 bg-cyan-500 rounded-full"></div>
                    Vagues (Marine-API)
                </div>
            </div>
        </div>
    );
};
