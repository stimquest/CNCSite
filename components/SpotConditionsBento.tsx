"use client";

import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { Wind, Waves, Thermometer, Info, ChevronRight, Navigation, Eye, Bell, Calendar, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

/**
 * Extracts specific keywords from activity messages to display as tags
 */
const extractTags = (message: string) => {
    if (!message) return [];

    const tags: { key: string, label: string, icon: string }[] = [];
    const msgLower = message.toLowerCase();

    const tagData = [
        { key: 'vent fort', label: 'Vent fort', icon: '💨' },
        { key: 'vent faible', label: 'Vent faible', icon: '🌬' },
        { key: 'clapot', label: 'Clapot', icon: '🌊' },
        { key: 'pluie', label: 'Pluie', icon: '🌧' },
        { key: 'rafale', label: 'Rafales', icon: '⚠️' },
        { key: 'marée basse', label: 'Marée basse', icon: '⛵' },
        { key: 'marée haute', label: 'Marée haute', icon: '🌊' },
    ];

    tagData.forEach(tag => {
        if (msgLower.includes(tag.key)) {
            tags.push(tag);
        }
    });

    return tags;
};

const translateStatus = (status: string) => {
    const s = status?.toUpperCase();
    const map: Record<string, string> = {
        // 🟢 Activité ouverte
        'IDEAL': 'Activité ouverte',
        'FAVORABLE': 'Activité ouverte',
        'OPEN': 'Activité ouverte',

        // 🟡 Activité ouverte avec adaptation
        'VARIABLE': 'Activité ouverte avec adaptation',
        'RESTRICTED': 'Activité ouverte avec adaptation',

        // 🔴 Activité suspendue
        'CRITICAL': 'Activité suspendue',
        'COMPROMISED': 'Activité suspendue',
        'CLOSED': 'Activité suspendue'
    };
    return map[s] || 'Activité suspendue';
};

const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (['IDEAL', 'FAVORABLE', 'OPEN'].includes(s)) return 'text-emerald-500 font-black';
    if (['VARIABLE', 'RESTRICTED'].includes(s)) return 'text-amber-500 font-black';
    if (['CRITICAL', 'COMPROMISED', 'CLOSED'].includes(s)) return 'text-rose-600 font-black';
    return 'text-slate-500 font-black';
};

const getCardinal = (angle: number) => {
    const directions = ['NORD', 'NORD-EST', 'EST', 'SUD-EST', 'SUD', 'SUD-OUEST', 'OUEST', 'NORD-OUEST'];
    return directions[Math.round(angle / 45) % 8];
};

export const SpotConditionsBento: React.FC = () => {
    const {
        weather, currentVibe,
        charStatus, charMessage, charTags,
        marcheStatus, marcheMessage, marcheTags,
        nautiqueStatus, nautiqueMessage, nautiqueTags,
        news
    } = useContent();

    const activityData = [
        { label: 'Char à Voile', status: charStatus, msg: charMessage, tags: charTags, icon: <Wind size={14} /> },
        { label: 'Sports Nautiques', status: nautiqueStatus, msg: nautiqueMessage, tags: nautiqueTags, icon: <ChevronRight size={14} /> },
        { label: 'Marche Aquatique', status: marcheStatus, msg: marcheMessage, tags: marcheTags, icon: <Waves size={14} /> }
    ];

    // Navigation icon points 45° (NE) by default. To point South (where North wind goes), we need 135°.
    // Meteorological wind bearing (FROM) + 135 = Blowing TO direction for this icon.
    const windRotation = (weather.windBearing || 0) + 135;

    return (
        <section className="max-w-[1600px] mx-auto px-6 pt-14 pb-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* Left: Weather Metrics (Col 1/12) */}
                <div className="lg:col-span-1 flex flex-row lg:flex-col justify-between lg:justify-start gap-4 relative z-10 shrink-0 border-r border-abysse/5 pr-4">
                    {/* Wind Surgical Display */}
                    <div className="flex flex-col group -mt-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-abysse/40 block mb-0.5">Vent</span>
                        <div className="flex flex-col">
                            <div className="flex items-baseline leading-none">
                                <span className="text-5xl font-black text-abysse italic tracking-tighter tabular-nums">{weather.windSpeed}</span>
                                <span className="ml-1 text-[10px] font-black text-abysse/30 uppercase italic">NDS</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <motion.div animate={{ rotate: windRotation }} className="text-turquoise transition-all">
                                    <Navigation size={12} fill="currentColor" strokeWidth={3} />
                                </motion.div>
                                <span className="text-[9px] font-black italic text-abysse/60 whitespace-nowrap">
                                    {getCardinal(weather.windBearing || 0)} <span className="text-abysse/20 ml-0.5">{weather.windBearing || 0}°</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Gusts */}
                    <div className="flex flex-col group border-t border-abysse/5 pt-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-abysse/40 block">Rafales</span>
                        <div className="flex items-baseline leading-none">
                            <span className="text-2xl font-black text-abysse italic tracking-tighter tabular-nums">{weather.gusts || weather.windSpeed + 5}</span>
                            <span className="ml-1 text-[8px] font-bold text-abysse/30 uppercase italic">NDS</span>
                        </div>
                    </div>

                    {/* Water Temp */}
                    <div className="flex flex-col group border-t border-abysse/5 pt-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-abysse/40 block">Eau</span>
                        <div className="flex items-baseline leading-none">
                            <span className="text-2xl font-black text-abysse italic tracking-tighter tabular-nums">{weather.waterTemp || 12}</span>
                            <span className="ml-1 text-[8px] font-bold text-abysse/30 uppercase italic">°C</span>
                        </div>
                    </div>
                </div>

                {/* Middle-Left: Activity Statuses (Col 4/12) */}
                <div className="lg:col-span-4 space-y-2 px-2 border-r border-abysse/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-abysse/40 block mb-3">Conditions de pratique</span>
                    <div className="space-y-4">
                        {activityData.map((act, idx) => {
                            const statusColor = getStatusColor(act.status);
                            return (
                                <div key={idx} className="group/item flex flex-col gap-1 transition-all duration-300">
                                    <div className="flex items-center justify-between border-b border-abysse/10 pb-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-abysse/25 italic">{act.label}</span>
                                        <div className="size-1.5 rounded-full overflow-hidden">
                                            <div className={`w-full h-full animate-pulse transition-all ${statusColor.replace('text-', 'bg-').split(' ')[0]}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className={`text-[15px] leading-none tracking-tighter italic uppercase ${statusColor}`}>
                                            {translateStatus(act.status)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-abysse/50 font-bold leading-snug uppercase tracking-wide">
                                        {act.msg || "Analyse en cours..."}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Middle-Right: Flash Infos (Col 4/12) */}
                <div className="lg:col-span-4 px-2 flex flex-col h-full border-r border-abysse/5">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-turquoise animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-abysse/40">Flash Infos</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[220px]">
                        {news && news.length > 0 ? (
                            news.slice(0, 15).map((msg, idx) => {
                                const isLatest = idx < 3;
                                return (
                                    <div
                                        key={msg._id}
                                        className={`transition-all duration-300 border-b border-abysse/5 pb-3 last:border-0 ${isLatest ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-[0.2em] border ${isLatest ? 'bg-turquoise/5 border-turquoise/20 text-turquoise' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                                {msg.category}
                                            </span>
                                            <span className="text-[8px] font-black text-abysse/20 whitespace-nowrap shrink-0 italic uppercase tracking-wider">
                                                {msg.date || (msg.publishedAt ? formatDistanceToNow(new Date(msg.publishedAt), { addSuffix: true, locale: fr }) : '')}
                                            </span>
                                        </div>
                                        <div className="mb-0.5">
                                            <h4 className={`text-[12px] font-black uppercase italic leading-tight tracking-tighter ${isLatest ? 'text-abysse' : 'text-abysse/70'}`}>
                                                {msg.title}
                                            </h4>
                                        </div>
                                        {msg.content && (
                                            <p className={`text-[10px] leading-snug font-bold uppercase tracking-wide line-clamp-2 ${isLatest ? 'text-abysse/40' : 'text-abysse/30'}`}>
                                                {msg.content}
                                            </p>
                                        )}
                                        {msg.externalLink && (
                                            <a
                                                href={msg.externalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-black text-turquoise hover:gap-2 transition-all uppercase tracking-widest italic"
                                            >
                                                Plus d'infos <ChevronRight size={10} />
                                            </a>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 italic gap-2 py-8">
                                <Info size={20} className="opacity-20" />
                                <span className="text-[10px] font-medium tracking-widest uppercase">Aucun message</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Live Cam (Col 3/12) */}
                <div className="lg:col-span-3 p-0 relative group/live flex flex-col transition-all h-full">
                    <div className="relative flex-1 group rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[220px] aspect-video lg:aspect-auto">
                        <img
                            src="/images/imgBank/CamLive.png"
                            className="w-full h-full object-cover group-hover/live:scale-105 transition-transform duration-2000"
                            alt="Live Cam"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SpotConditionsBento;
