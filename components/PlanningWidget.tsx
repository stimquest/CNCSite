"use client";

import React, { useState } from 'react';

import { ActivityType } from '@/types';
import {
    Calendar, ChevronLeft, ChevronRight, Wind, Waves, Info,
    Sun, Anchor, Sailboat, LayoutGrid, Phone, CheckCircle2, Clock
} from 'lucide-react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';

// Mapping couleur stageDefinition.color → classes Tailwind
const STAGE_COLOR_MAP: Record<string, { bg: string; text: string; border: string; iconColor: string }> = {
    yellow:    { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200',    iconColor: 'bg-yellow-500'  },
    turquoise: { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200',      iconColor: 'bg-turquoise'   },
    blue:      { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',      iconColor: 'bg-blue-500'    },
    purple:    { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',    iconColor: 'bg-purple-500'  },
    orange:    { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',    iconColor: 'bg-orange-500'  },
    rose:      { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',      iconColor: 'bg-rose-500'    },
};
const DEFAULT_COLORS = { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', iconColor: 'bg-slate-400' };

const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case 'piscine': return <Sun size={14} />;
        case 'optimist': return <Sailboat size={14} />;
        case 'catamaran': return <Anchor size={14} />;
        case 'paddle': return <Waves size={14} />;
        case 'char': return <Wind size={14} />;
        default: return <Waves size={14} />;
    }
};

const getActivityLabel = (type: string) => {
    switch (type) {
        case 'piscine': return 'Piscine / Volant';
        case 'optimist': return 'Optimist';
        case 'catamaran': return 'Catamaran';
        case 'paddle': return 'Paddle / Kayak';
        case 'char': return 'Char à voile';
        case 'planche': return 'Planche à voile';
        case 'kite': return 'Kite';
        case 'multiglisse': return 'Multiglisse';
        default: return type;
    }
};

import { client, queries } from '@/lib/sanity';

function findCurrentWeekIdx(list: any[]): number {
    const now = new Date();
    return list.findIndex(w => {
        if (!w.startDate || !w.endDate) return false;
        const end = new Date(w.endDate);
        end.setHours(23, 59, 59);
        return now >= new Date(w.startDate) && now <= end;
    });
}

export const PlanningWidget: React.FC = () => {
    const { stageDefinitions } = useLiveStatus();
    const [plannings, setPlannings] = useState<any[]>([]);
    const [charPlannings, setCharPlannings] = useState<any[]>([]);
    const [marchePlannings, setMarchePlannings] = useState<any[]>([]);
    const [charSessions, setCharSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'voile' | 'char' | 'marche'>('voile');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);

    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([
            client.fetch(queries.plannings),
            client.fetch(queries.charPlannings),
            client.fetch(queries.marchePlannings),
            client.fetch(queries.charSessionsPublic, { today: new Date().toISOString().split('T')[0] })
        ]).then(([p, c, m, cs]) => {
            setPlannings(p || []);
            setCharPlannings(c || []);
            setMarchePlannings(m || []);
            setCharSessions(cs || []);
            setIsLoading(false);
        }).catch(err => {
            console.error("Error fetching plannings widget", err);
            setIsLoading(false);
        });
    }, []);

    // --- DATA PREPARATION ---
    const today = React.useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

    const dataVoile = React.useMemo(() => {
        return (plannings || []).filter(w => !w.endDate || new Date(w.endDate) >= today);
    }, [plannings, today]);

    const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const dataChar = React.useMemo(() => {
        if (!charSessions.length) return [];
        const weekMap: Record<string, any> = {};
        charSessions.forEach(s => {
            const d = new Date(s.date);
            const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
            const ws = new Date(d); ws.setDate(d.getDate() + diff);
            const weekKey = ws.toISOString().split('T')[0];
            if (!weekMap[weekKey]) {
                const we = new Date(ws); we.setDate(ws.getDate() + 6);
                const fmt = (x: Date) => x.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                weekMap[weekKey] = {
                    title: `${fmt(ws)} — ${fmt(we)}`,
                    startDate: weekKey,
                    endDate: we.toISOString().split('T')[0],
                    days: Array.from({ length: 7 }, (_, i) => {
                        const dd = new Date(ws); dd.setDate(ws.getDate() + i);
                        return { name: DAYS_FR[i], date: dd.toISOString().split('T')[0], sessions: [] };
                    })
                };
            }
            const dayIdx = (new Date(s.date).getDay() + 6) % 7;
            weekMap[weekKey].days[dayIdx].sessions.push({ time: `${s.heureDebut} — ${s.heureFin}` });
        });
        return Object.keys(weekMap).sort().map(k => weekMap[k]);
    }, [charSessions]);

    const dataMarche = React.useMemo(() => {
        if (!marchePlannings) return [];
        return marchePlannings.flatMap(p => p.weeks || [])
            .filter(w => !w.endDate || new Date(w.endDate) >= today)
            .sort((a, b) => {
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                return dateA - dateB;
            });
    }, [marchePlannings, today]);

    const currentList = activeTab === 'voile' ? dataVoile : (activeTab === 'char' ? dataChar : dataMarche);

    // Positionner sur la semaine en cours quand les données arrivent
    React.useEffect(() => {
        if (isLoading) return;
        const idx = findCurrentWeekIdx(dataVoile);
        setCurrentIdx(idx); // Peut être -1 si pas de stage cette semaine
        setSelectedDayIdx(0);
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentWeek: any = currentIdx >= 0 ? currentList[currentIdx] : null;

    // --- HANDLERS ---
    const nextWeek = () => {
        if (currentList.length > 0) {
            setCurrentIdx(prev => {
                if (prev === -1) return 0;
                return (prev + 1) % currentList.length;
            });
        }
    };

    const prevWeek = () => {
        if (currentList.length > 0) {
            setCurrentIdx(prev => {
                if (prev === -1) return currentList.length - 1;
                return (prev - 1 + currentList.length) % currentList.length;
            });
        }
    };

    const handleTabChange = (tab: 'voile' | 'char' | 'marche') => {
        setActiveTab(tab);
        // Aller sur la semaine en cours pour l'onglet sélectionné
        const list = tab === 'voile' ? dataVoile : (tab === 'char' ? dataChar : dataMarche);
        const idx = findCurrentWeekIdx(list);
        setCurrentIdx(idx);
        setSelectedDayIdx(0);
        setIsWeekSelectorOpen(false);
    };

    if (isLoading) return <div className="p-20 text-center font-black uppercase text-slate-300 animate-pulse">Chargement du planning...</div>;

    // --- DAY TABS (shared) ---
    const renderDayTabs = (week: any, activeColor: string) => (
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar gap-0.5">
            {week.days?.map((day: any, i: number) => {
                const dateStr = day.date
                    ? new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                    : '';
                const isActive = selectedDayIdx === i;
                return (
                    <button
                        key={i}
                        onClick={() => setSelectedDayIdx(i)}
                        className={`flex-1 min-w-[52px] py-2.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition-all ${isActive ? `${activeColor} shadow-md` : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                        <span className="text-[10px] font-black uppercase leading-none">{day.name?.slice(0, 3)}</span>
                        <span className="text-[9px] font-bold opacity-70 leading-none">{dateStr}</span>
                    </button>
                );
            })}
        </div>
    );

    // --- RENDER VOILE ---
    const renderVoileTable = (week: any) => {
        const selectedDay = week.days?.[selectedDayIdx];
        const days = week.days || [];

        // Seuls les stages ayant au moins un horaire sur l'une des journées de la semaine
        const activeStages = stageDefinitions.filter((stage: any) =>
            days.some((day: any) =>
                (day.stageSlots || []).some((s: any) => s.stageKey === stage.key && s.time)
            )
        );

        if (activeStages.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Aucun horaire saisi pour cette semaine</p>
                </div>
            );
        }

        return (
            <>
                {/* MOBILE VIEW */}
                <div className="md:hidden flex flex-col gap-3">
                    {renderDayTabs(week, 'bg-abysse text-white')}
                    <div className="flex flex-col gap-1.5 pb-2">
                        {activeStages.map((stage: any) => {
                            const colors = STAGE_COLOR_MAP[stage.color || ''] ?? DEFAULT_COLORS;
                            const slot = (selectedDay?.stageSlots || []).find((s: any) => s.stageKey === stage.key);
                            const isRaid = selectedDay?.isRaidDay && (selectedDay?.raidStageKey || '').split(',').includes(stage.key);
                            const time = slot?.time;
                            if (!time && !isRaid) return null;
                            return (
                                <div key={stage.key} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isRaid ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`size-2.5 rounded-full ${colors.iconColor} shrink-0`} />
                                        <span className={`text-xs font-black uppercase ${colors.text}`}>{stage.shortLabel || stage.label}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5">
                                        {isRaid && <span className="text-[8px] font-black uppercase text-orange-500">Raid</span>}
                                        <span className="text-sm font-black leading-none text-abysse">{time}</span>
                                        {slot?.activity && <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">{getActivityLabel(slot.activity)}</span>}
                                    </div>
                                </div>
                            );
                        })}
                        {activeStages.every((stage: any) => {
                            const slot = (selectedDay?.stageSlots || []).find((s: any) => s.stageKey === stage.key);
                            return !slot?.time;
                        }) && (
                            <div className="p-4 rounded-xl border border-slate-100 bg-white text-center">
                                <span className="text-xs font-bold text-slate-300 uppercase">Pas de séance ce jour</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* DESKTOP VIEW (TABLE) */}
                <div className="hidden md:block overflow-x-auto pb-6 scroll-smooth -mx-2 px-2">
                    <table className="w-full text-left border-separate border-spacing-y-2 min-w-[850px]">
                        <thead>
                            <tr>
                                <th className="p-3 w-[150px]"></th>
                                {days.map((day: any, i: number) => (
                                    <th key={i} className={`p-2 text-center border-b-2 ${day.date === new Date().toISOString().split('T')[0] ? 'border-abysse' : 'border-slate-200'}`}>
                                        <p className="text-xs font-black uppercase text-slate-800 tracking-wider">{day.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                            {day.date ? new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeStages.map((stage: any) => {
                                const colors = STAGE_COLOR_MAP[stage.color || ''] ?? DEFAULT_COLORS;
                                return (
                                    <tr key={stage.key} className="bg-white hover:bg-slate-50 transition-colors">
                                        <td className="p-3 rounded-l-2xl border-y border-l border-slate-100 shadow-sm align-middle">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-3 rounded-full ${colors.iconColor} shrink-0`} />
                                                <span className={`text-[10px] lg:text-[11px] font-black uppercase ${colors.text} leading-tight`}>{stage.shortLabel || stage.label}</span>
                                            </div>
                                        </td>
                                        {days.map((day: any, i: number) => {
                                            const slot = (day?.stageSlots || []).find((s: any) => s.stageKey === stage.key);
                                            const isRaid = day?.isRaidDay && (day?.raidStageKey || '').split(',').includes(stage.key);
                                            const time = slot?.time;
                                            return (
                                                <td key={i} className={`p-2 border-y border-slate-100 text-center align-middle ${i === days.length - 1 ? 'border-r rounded-r-2xl' : ''} shadow-sm`}>
                                                    {time ? (
                                                        <div className={`mx-auto flex flex-col items-center justify-center p-2 rounded-xl transition-all max-w-[120px] ${isRaid ? 'bg-orange-50 border border-orange-200' : 'bg-slate-50 border border-slate-100'}`}>
                                                            {isRaid && <span className="text-[8px] font-black uppercase text-orange-500 mb-0.5">Raid</span>}
                                                            <span className="text-xs font-black text-abysse">{time}</span>
                                                            {slot?.activity && <span className="text-[8px] font-bold text-slate-400 mt-0.5 max-w-full truncate px-1 uppercase">{getActivityLabel(slot.activity)}</span>}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-200 select-none">—</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    // --- RENDER CHAR ---
    const renderCharDayContent = (day: any, isDesktop: boolean) => {
        const hasSessions = day?.sessions?.length > 0;
        if (!hasSessions) {
            return isDesktop ? <div className="h-[72px] border border-transparent shrink-0" /> : (
                <div className="p-4 rounded-xl border border-slate-100 bg-white text-center">
                    <span className="text-xs font-bold text-slate-300 uppercase">Pas de séance</span>
                </div>
            );
        }
        return day.sessions.map((sess: any, idx: number) => (
            isDesktop ? (
                <div key={idx} className="flex flex-col items-center justify-center shrink-0 h-[72px] p-2 rounded-xl border bg-white border-purple-100 gap-1 text-center">
                    <span className="text-[10px] md:text-[11px] font-black uppercase text-purple-700 leading-tight">Roulage</span>
                    <span className="text-[11px] md:text-xs font-black text-abysse leading-none bg-purple-50 px-2 py-1.5 rounded-md mt-0.5">{sess.time}</span>
                </div>
            ) : (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border bg-white border-purple-100 gap-2">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-purple-500 shrink-0" />
                        <span className="text-xs font-black uppercase text-purple-700">Roulage</span>
                    </div>
                    <span className="text-sm font-black text-abysse leading-none bg-purple-50 px-2 py-1 rounded-md">{sess.time}</span>
                </div>
            )
        ));
    };

    const renderCharTable = (week: any) => {
        const selectedDay = week.days?.[selectedDayIdx];
        return (
            <>
                {/* MOBILE VIEW */}
                <div className="md:hidden flex flex-col gap-3">
                    {renderDayTabs(week, 'bg-purple-500 text-white')}
                    <div className="flex flex-col gap-1.5 pb-2">
                        {renderCharDayContent(selectedDay, false)}
                    </div>
                </div>
                {/* DESKTOP VIEW */}
                <div className="hidden md:block overflow-x-auto pb-6 -mx-2 px-2 scroll-smooth">
                    <div className="grid grid-cols-7 gap-2 min-w-[850px] pb-2">
                        {week.days?.map((day: any, i: number) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className={`text-center pb-2 border-b-2 ${day.date === new Date().toISOString().split('T')[0] ? 'border-purple-500' : 'border-slate-200'}`}>
                                    <p className="text-xs font-black uppercase text-slate-800 tracking-wider">{day.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                        {day.date ? new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1.5 h-full">
                                    {renderCharDayContent(day, true)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };

    // --- RENDER MARCHE ---
    const renderMarcheDayContent = (day: any, isDesktop: boolean) => {
        const hasSessions = day?.sessions?.length > 0;
        if (!hasSessions) {
            return isDesktop ? <div className="h-[72px] border border-transparent shrink-0" /> : (
                <div className="p-4 rounded-xl border border-slate-100 bg-white text-center">
                    <span className="text-xs font-bold text-slate-300 uppercase">Pas de séance</span>
                </div>
            );
        }
        return day.sessions.map((sess: any, idx: number) => (
            isDesktop ? (
                <div key={idx} className="flex flex-col items-center justify-center shrink-0 h-[72px] p-2 rounded-xl border bg-white border-turquoise/30 gap-1 text-center">
                    <span className="text-[10px] md:text-[11px] font-black uppercase text-turquoise leading-tight">Marche</span>
                    <span className="text-[11px] md:text-xs font-black text-abysse leading-none bg-cyan-50 px-2 py-1.5 rounded-md mt-0.5">{sess.time}</span>
                </div>
            ) : (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border bg-white border-turquoise/30 gap-2">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-turquoise shrink-0" />
                        <span className="text-xs font-black uppercase text-turquoise">Marche</span>
                    </div>
                    <span className="text-sm font-black text-abysse leading-none bg-cyan-50 px-2 py-1 rounded-md">{sess.time}</span>
                </div>
            )
        ));
    };

    const renderMarcheTable = (week: any) => {
        const selectedDay = week.days?.[selectedDayIdx];
        return (
            <>
                {/* MOBILE VIEW */}
                <div className="md:hidden flex flex-col gap-3">
                    {renderDayTabs(week, 'bg-turquoise text-abysse')}
                    <div className="flex flex-col gap-1.5 pb-2">
                        {renderMarcheDayContent(selectedDay, false)}
                    </div>
                </div>
                {/* DESKTOP VIEW */}
                <div className="hidden md:block overflow-x-auto pb-6 -mx-2 px-2 scroll-smooth">
                    <div className="grid grid-cols-7 gap-2 min-w-[850px] pb-2">
                        {week.days?.map((day: any, i: number) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className={`text-center pb-2 border-b-2 ${day.date === new Date().toISOString().split('T')[0] ? 'border-turquoise' : 'border-slate-200'}`}>
                                    <p className="text-xs font-black uppercase text-slate-800 tracking-wider">{day.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                        {day.date ? new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1.5 h-full">
                                    {renderMarcheDayContent(day, true)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="w-full font-sans flex flex-col shrink-0">

            {/* HEADER : TABS & NAV */}
            <div className="bg-abysse p-4 md:p-6 pb-0 flex flex-col gap-4 md:gap-6 shrink-0">

                {/* TABS SWITCHER */}
                <div className="flex p-1 bg-slate-800/50 rounded-2xl border border-white/5 self-stretch md:self-start overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => handleTabChange('voile')}
                        className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'voile' ? 'bg-turquoise text-abysse shadow-lg scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Sailboat size={14} className="md:size-4" /> <span className="hidden xs:inline">Voile</span><span className="xs:hidden">Voile</span>
                    </button>
                    <button
                        onClick={() => handleTabChange('char')}
                        className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'char' ? 'bg-purple-500 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Wind size={14} className="md:size-4" /> Char
                    </button>
                    <button
                        onClick={() => handleTabChange('marche')}
                        className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'marche' ? 'bg-turquoise text-abysse shadow-lg scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Waves size={14} className="md:size-4" /> Marche
                    </button>
                </div>

                {/* NAVIGATION BAR */}
                <div className="flex items-center justify-between pb-4 md:pb-6 border-b border-white/10">
                    <div className="hidden md:block">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                            {activeTab === 'voile' ? 'Planning Hebdo' : activeTab === 'char' ? 'Sessions Roulage' : 'Marche Aquatique'}
                        </h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                            {activeTab === 'voile' ? 'Optimist • Catamaran • Planche' : activeTab === 'char' ? 'Loisir & Perfectionnement' : 'Bien-être & Santé'}
                        </p>
                    </div>

                    {/* WEEK SELECTOR (Advanced) */}
                    {currentList.length > 0 && (
                        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shadow-inner w-full md:w-auto">
                            <button onClick={prevWeek} className="size-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                                <ChevronLeft size={18} />
                            </button>

                            <div className="relative flex-1 md:w-[260px] px-2 text-center">
                                <button onClick={() => setIsWeekSelectorOpen(!isWeekSelectorOpen)} className="w-full flex items-center justify-center gap-2 py-1">
                                    <div className="flex flex-col items-center">
                                        <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            {currentIdx === -1 ? 'Semaine Actuelle' : `Semaine ${currentIdx + 1} / ${currentList.length}`}
                                        </span>
                                        <span className="text-xs font-black text-white truncate max-w-[180px]">
                                            {currentIdx === -1 ? "Pas de planning" : currentWeek?.title}
                                        </span>
                                    </div>
                                    <ChevronRight size={14} className={`text-slate-400 transition-transform duration-200 ${isWeekSelectorOpen ? 'rotate-90' : ''}`} />
                                </button>

                                {isWeekSelectorOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsWeekSelectorOpen(false)} />
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[280px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
                                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Choisir une semaine</span>
                                            </div>
                                            <div className="max-h-[220px] overflow-y-auto py-1">
                                                {findCurrentWeekIdx(currentList) === -1 && (
                                                    <button
                                                        onClick={() => { setCurrentIdx(-1); setIsWeekSelectorOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 text-xs font-bold flex items-center justify-between gap-2 transition-all ${currentIdx === -1
                                                            ? 'bg-abysse text-white'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <span className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black ${currentIdx === -1 ? 'bg-turquoise text-abysse' : 'bg-slate-100 text-slate-400'}`}>-</span>
                                                            <span className="truncate">Semaine en cours</span>
                                                        </span>
                                                        {currentIdx === -1 && <span className="text-turquoise text-[10px] font-black uppercase">Actuel</span>}
                                                    </button>
                                                )}
                                                {currentList.map((p, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => { setCurrentIdx(idx); setIsWeekSelectorOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 text-xs font-bold flex items-center justify-between gap-2 transition-all ${idx === currentIdx
                                                            ? 'bg-abysse text-white'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <span className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black ${idx === currentIdx ? 'bg-turquoise text-abysse' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</span>
                                                            <span className="truncate">{p.title}</span>
                                                        </span>
                                                        {idx === currentIdx && <span className="text-turquoise text-[10px] font-black uppercase">Actuel</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button onClick={nextWeek} className="size-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* BODY CONTENT */}
            <div className="bg-slate-50 p-4 md:p-6">
                {currentList.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-16">
                        <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Calendar size={28} className="text-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-widest text-slate-400">Aucun planning disponible</p>
                            <p className="text-xs text-slate-300 mt-1">Revenez prochainement</p>
                        </div>
                    </div>
                ) : currentIdx === -1 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-5">
                        <div className="size-16 rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center shadow-inner">
                            <Calendar size={28} className="text-slate-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm md:text-base font-black uppercase tracking-widest text-slate-500">Pas d'activité cette semaine</p>
                            <p className="text-[10px] md:text-xs text-slate-400 mt-2 font-bold uppercase tracking-wide">
                                Utilisez le sélecteur ou les flèches en haut pour voir les plannings à venir.
                            </p>
                        </div>
                        <button
                            onClick={nextWeek}
                            className="mt-4 px-6 py-2.5 bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-turquoise hover:text-abysse transition-colors flex items-center gap-2"
                        >
                            Semaine Prochaine <ChevronRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {activeTab === 'voile' ? renderVoileTable(currentWeek) :
                            activeTab === 'char' ? renderCharTable(currentWeek) :
                                renderMarcheTable(currentWeek)}
                    </div>
                )}
            </div>

            {/* NO FOOTER : Clean look */}
        </div>
    );
};
