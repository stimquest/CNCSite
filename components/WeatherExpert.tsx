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
        const interval = setInterval(fetchData, 60 * 60 * 1000);
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
    const count15 = 48; // 12 hours
    const indices15 = Array.from({ length: count15 }, (_, i) => startIdx15 + i).filter(idx => w15.time[idx]);

    // --- LOGIQUE SECTION 2 (HORAIRE) ---
    const startIdxHor = wHor.time.findIndex((t: string) => new Date(t) >= new Date(now.getTime() - 3600000));
    const indicesHor = Array.from({ length: wHor.time.length - startIdxHor }, (_, i) => startIdxHor + i);

    return (
        <div className="space-y-8 text-white font-sans">

            {/* Header / Meta */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter italic uppercase text-turquoise leading-none">Coutainville Expert</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Détail Haute Définition (1.3km) & Marine</p>
                </div>

                <div className="flex flex-wrap gap-6">
                    {weather.daily && (
                        <div className="text-[10px] font-black text-slate-400 flex gap-6 uppercase tracking-widest">
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <Sunrise size={14} className="text-yellow-500" />
                                {new Date(weather.daily.sunrise[0]).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <Sunset size={14} className="text-orange-500" />
                                {new Date(weather.daily.sunset[0]).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-3">
                        <Droplets size={14} />
                        <span className="text-[10px] font-black uppercase">Mer : {cHor.sea_surface_temperature[0]?.toFixed(1)}°C</span>
                    </div>
                </div>
            </div>

            {/* SECTION 1: 15 MIN */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                    <Zap size={18} className="text-turquoise" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Direct AROME HD (15min) — 12H</h3>
                </div>
                <div className="bg-abysse/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <div className="overflow-x-auto no-scrollbar scroll-smooth">
                        <table className="w-full border-spacing-px border-separate table-fixed">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 w-32 min-w-[128px] text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-white/5">Heure</th>
                                    {indices15.map(idx => {
                                        const d = new Date(w15.time[idx]);
                                        return (
                                            <th key={idx} className="w-12 min-w-[48px] text-center py-3 border-r border-white/5">
                                                {d.getMinutes() === 0 ? (
                                                    <span className="text-[10px] font-black">{d.getHours()}h</span>
                                                ) : (
                                                    <span className="text-[7px] text-slate-600 font-bold">{d.getMinutes()}</span>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Vent */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-slate-400 border-r border-white/5">Vent (nds)</td>
                                    {indices15.map(idx => {
                                        const speed = Math.round(w15.wind_speed_10m[idx]);
                                        const colors = getWindColor(speed);
                                        return (
                                            <td key={idx}
                                                style={{ backgroundColor: colors.bg, color: colors.text }}
                                                className="text-center py-2 text-[10px] font-black border-r border-white/5"
                                            >
                                                {speed}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Rafales */}
                                <tr className="hover:bg-white/5 transition-colors bg-orange-500/5">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-orange-400 border-r border-white/5">Rafales (nds)</td>
                                    {indices15.map(idx => {
                                        // On tente de récupérer la rafale en 15min, sinon on cherche dans l'horaire
                                        let gust = w15.wind_gusts_10m ? w15.wind_gusts_10m[idx] : null;

                                        if (gust === null || gust === undefined) {
                                            const timeStr = w15.time[idx].substring(0, 13) + ":00";
                                            const hIdx = wHor.time.findIndex((t: string) => t.startsWith(timeStr));
                                            gust = hIdx !== -1 ? wHor.wind_gusts_10m[hIdx] : null;
                                        }

                                        const val = gust !== null ? Math.round(gust) : '-';
                                        const colors = gust !== null ? getWindColor(Math.round(gust)) : { bg: 'transparent', text: 'inherit' };

                                        return (
                                            <td key={idx}
                                                style={{ backgroundColor: colors.bg, color: colors.text }}
                                                className="text-center py-2 text-[10px] font-black border-r border-white/5 opacity-90"
                                            >
                                                {val}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Dir */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-3 text-[9px] font-black uppercase text-slate-400 border-r border-white/5">Direction</td>
                                    {indices15.map(idx => (
                                        <td key={idx} className="text-center py-3 border-r border-white/5">
                                            <div style={{ transform: `rotate(${w15.wind_direction_10m[idx]}deg)` }} className="flex justify-center">
                                                <ArrowDown size={12} className="text-turquoise" />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {/* Vagues */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-cyan-400 border-r border-white/5">Vagues (m)</td>
                                    {indices15.map(idx => {
                                        const timeStr = w15.time[idx].substring(0, 14) + "00";
                                        const wIdx = wav.time.indexOf(timeStr);
                                        const val = wIdx !== -1 ? wav.wave_height[wIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-2 text-[10px] font-black text-cyan-400 bg-cyan-500/5 border-r border-white/5">
                                                {val ? val.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Précipitations */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-blue-400 border-r border-white/5">Pluie (%)</td>
                                    {indices15.map(idx => {
                                        const prob = w15.precipitation_probability[idx];
                                        return (
                                            <td key={idx} className={`text-center py-2 text-[10px] font-black border-r border-white/5 ${prob > 20 ? 'text-blue-400 bg-blue-500/5' : 'text-slate-600'}`}>
                                                {prob}%
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Temp */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-slate-400 border-r border-white/5">Air (°C)</td>
                                    {indices15.map(idx => (
                                        <td key={idx} className="text-center py-2 text-[10px] font-black text-slate-500 border-r border-white/5">
                                            {Math.round(w15.temperature_2m[idx])}°
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SECTION 2: TENDANCES 3 JOURS */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                    <Calendar size={18} className="text-turquoise" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Prévisions 3 Jours (Horaires)</h3>
                </div>
                <div className="bg-abysse/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <div className="overflow-x-auto no-scrollbar scroll-smooth">
                        <table className="w-full border-spacing-px border-separate table-fixed">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 w-32 min-w-[128px] text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-white/5">Jour / Heure</th>
                                    {indicesHor.map(idx => {
                                        const d = new Date(wHor.time[idx]);
                                        const isNewDay = d.getHours() === 0;
                                        return (
                                            <th key={idx} className={`w-12 min-w-[48px] text-center py-3 border-r border-white/5 ${isNewDay ? 'border-l-2 border-turquoise' : ''}`}>
                                                <div className="flex flex-col gap-1">
                                                    {isNewDay || idx === startIdxHor ? (
                                                        <span className="text-[7px] font-black text-turquoise">{d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}</span>
                                                    ) : null}
                                                    <span className="text-[10px] font-black">{d.getHours()}h</span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Vent */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-slate-400 border-r border-white/5">Vent (nds)</td>
                                    {indicesHor.map(idx => {
                                        const speed = Math.round(wHor.wind_speed_10m[idx]);
                                        const colors = getWindColor(speed);
                                        return (
                                            <td key={idx}
                                                style={{ backgroundColor: colors.bg, color: colors.text }}
                                                className="text-center py-2 text-[10px] font-black border-r border-white/5"
                                            >
                                                {speed}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Rafales */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-orange-400 border-r border-white/5">Rafales</td>
                                    {indicesHor.map(idx => {
                                        const gust = Math.round(wHor.wind_gusts_10m[idx]);
                                        const colors = getWindColor(gust);
                                        return (
                                            <td key={idx}
                                                style={{ backgroundColor: colors.bg, color: colors.text }}
                                                className="text-center py-2 text-[10px] font-black border-r border-white/5 opacity-80"
                                            >
                                                {gust}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Vagues */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-cyan-400 border-r border-white/5">Vagues (m)</td>
                                    {indicesHor.map(idx => {
                                        const timeStr = wHor.time[idx];
                                        const wIdx = wav.time.indexOf(timeStr);
                                        const wh = wIdx !== -1 ? wav.wave_height[wIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-2 text-[10px] font-black text-cyan-400 bg-cyan-500/5 border-r border-white/5">
                                                {wh ? wh.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Période */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-cyan-700 border-r border-white/5">Période (s)</td>
                                    {indicesHor.map(idx => {
                                        const timeStr = wHor.time[idx];
                                        const wIdx = wav.time.indexOf(timeStr);
                                        const wp = wIdx !== -1 ? wav.wave_period[wIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-2 text-[10px] font-black text-cyan-700/60 border-r border-white/5">
                                                {wp ? Math.round(wp) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                {/* Mer */}
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="sticky left-0 bg-slate-900/90 backdrop-blur-md z-20 px-4 py-2 text-[9px] font-black uppercase text-emerald-400 border-r border-white/5">Mer (°C)</td>
                                    {indicesHor.map(idx => {
                                        const timeStr = wHor.time[idx];
                                        const cIdx = cHor.time.indexOf(timeStr);
                                        const wt = cIdx !== -1 ? cHor.sea_surface_temperature[cIdx] : null;
                                        return (
                                            <td key={idx} className="text-center py-2 text-[10px] font-black text-emerald-400 bg-emerald-500/5 border-r border-white/5">
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
