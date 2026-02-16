"use client";

import React, { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { ActivityType } from '@/types';
import {
    Calendar, ChevronLeft, ChevronRight, Wind, Waves, Info,
    Sun, Anchor, Sailboat, LayoutGrid, Phone, CheckCircle2, Clock
} from 'lucide-react';

// Configuration visuelle des groupes (Voile)
const GROUP_CONFIG = [
    {
        id: 'miniMousses',
        label: 'Mini-Mousses',
        age: '5-7 ans',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        iconColor: 'bg-yellow-500'
    },
    {
        id: 'mousses',
        label: 'Moussaillons',
        age: '8-9 ans',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconColor: 'bg-orange-500'
    },
    {
        id: 'initiation',
        label: 'Initiation',
        age: '10-16 ans',
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        iconColor: 'bg-green-500'
    },
    {
        id: 'perfectionnement',
        label: 'Perfectionnement',
        age: '10-16 ans',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconColor: 'bg-blue-500'
    }
];

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

export const PlanningWidget: React.FC = () => {
    const { plannings, charPlannings, marchePlannings, isLoading } = useContent();
    const [activeTab, setActiveTab] = useState<'voile' | 'char' | 'marche'>('voile');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);

    // --- DATA PREPARATION ---
    const dataVoile = plannings || [];

    // Pour le char, la structure est un peu différente (PlanningCharAVoile contient des weeks[])
    // On va aplatir tout ça pour avoir une liste linéaire de semaines comme pour la voile
    const dataChar = React.useMemo(() => {
        if (!charPlannings) return [];
        return charPlannings.flatMap(p => p.weeks || []).sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateA - dateB;
        });
    }, [charPlannings]);

    const dataMarche = React.useMemo(() => {
        if (!marchePlannings) return [];
        return marchePlannings.flatMap(p => p.weeks || []).sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateA - dateB;
        });
    }, [marchePlannings]);

    const currentList = activeTab === 'voile' ? dataVoile : (activeTab === 'char' ? dataChar : dataMarche);
    const currentWeek: any = currentList[currentIdx];

    // --- HANDLERS ---
    const nextWeek = () => {
        if (currentList.length > 0) setCurrentIdx(prev => (prev + 1) % currentList.length);
    };

    const prevWeek = () => {
        if (currentList.length > 0) setCurrentIdx(prev => (prev - 1 + currentList.length) % currentList.length);
    };

    const handleTabChange = (tab: 'voile' | 'char' | 'marche') => {
        setActiveTab(tab);
        setCurrentIdx(0); // Reset to first week on tab switch
        setSelectedDayIdx(0); // Reset to first day
        setIsWeekSelectorOpen(false);
    };

    if (isLoading) return <div className="p-20 text-center font-black uppercase text-slate-300 animate-pulse">Chargement du planning...</div>;

    // --- RENDER TABLE VOILE ---
    const renderVoileTable = (week: any) => (
        <div className="flex flex-col gap-4">
            {/* Day Selector Mobile */}
            <div className="flex md:hidden bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                {week.days?.map((day: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDayIdx(i)}
                        className={`flex-1 min-w-[60px] py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedDayIdx === i ? 'bg-abysse text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {day.name?.slice(0, 3)}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto pb-4 md:block">
                <table className="w-full min-w-full md:min-w-[800px] border-separate border-spacing-1">
                    <thead className="hidden md:table-header-group">
                        <tr>
                            <th className="p-2 text-left w-48 bg-slate-100 rounded-xl">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Groupes</span>
                            </th>
                            {week.days?.map((day: any, i: number) => (
                                <th key={i} className="p-2 text-center bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="block text-abysse font-black text-sm uppercase">{(day.name || '---').slice(0, 3)}</span>
                                        <span className="text-[9px] font-bold text-slate-400">
                                            {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {GROUP_CONFIG.map((group) => (
                            <tr key={group.id} className="flex flex-col md:table-row mb-2 md:mb-0">
                                <td className={`p-3 rounded-xl border ${group.border} ${group.bg} shadow-sm md:table-cell mb-1 md:mb-0`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-lg ${group.iconColor} flex items-center justify-center text-white shadow-sm`}>
                                            <LayoutGrid size={16} />
                                        </div>
                                        <div>
                                            <span className={`block font-black uppercase italic text-xs ${group.text}`}>{group.label}</span>
                                            <span className="block text-[9px] font-bold opacity-40 uppercase">{group.age}</span>
                                        </div>
                                    </div>
                                </td>
                                {week.days?.map((day: any, dayIdx: number) => {
                                    const isVisible = dayIdx === selectedDayIdx;
                                    const session = (day as any)[group.id];
                                    let isRaid = false;
                                    if (day.raidTarget && day.raidTarget !== 'none') isRaid = day.raidTarget === group.id;
                                    else isRaid = (day as any).isRaidDay || (typeof session === 'string' && session.toLowerCase() === 'raid');

                                    let time = '--';
                                    let desc = null;

                                    if (typeof session === 'object') {
                                        time = session?.time || '--';
                                        desc = session?.description;
                                    } else {
                                        time = session || '--';
                                    }

                                    return (
                                        <td key={dayIdx} className={`p-1 ${isVisible ? 'block' : 'hidden'} md:table-cell`}>
                                            <div className={`rounded-xl h-full min-h-[50px] flex flex-col items-center justify-center text-center shadow-sm transition-colors ${isRaid ? 'bg-orange-500' : 'bg-white border border-slate-100 hover:border-turquoise/50 p-2'}`}>
                                                {isRaid ? (
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">RAID</span>
                                                ) : (
                                                    <>
                                                        <span className="text-[11px] font-black text-abysse leading-none">{time}</span>
                                                        {desc && <span className="text-[8px] font-bold text-slate-400 uppercase mt-1 line-clamp-1">{desc}</span>}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- RENDER TABLE CHAR (MODE HORIZONTAL) ---
    const renderCharTable = (week: any) => (
        <div className="flex flex-col gap-4">
            {/* Day Selector Mobile */}
            <div className="flex md:hidden bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                {week.days?.map((day: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDayIdx(i)}
                        className={`flex-1 min-w-[60px] py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedDayIdx === i ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {day.name?.slice(0, 3)}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-full md:min-w-[800px] border-separate border-spacing-1">
                    <thead className="hidden md:table-header-group">
                        <tr>
                            <th className="p-2 text-left w-32 bg-slate-100 rounded-xl">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Activité</span>
                            </th>
                            {week.days?.map((day: any, i: number) => (
                                <th key={i} className="p-2 text-center bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="block text-abysse font-black text-sm uppercase">{(day.name || '---').slice(0, 3)}</span>
                                        <span className="text-[9px] font-bold text-slate-400">
                                            {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="flex flex-col md:table-row">
                            <td className="p-3 rounded-xl border border-purple-200 bg-purple-50 shadow-sm align-top md:table-cell mb-1 md:mb-0">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-purple-500 flex items-center justify-center text-white shadow-sm">
                                        <Wind size={16} />
                                    </div>
                                    <div>
                                        <span className="block font-black uppercase italic text-xs text-purple-700">Roulage</span>
                                        <span className="block text-[9px] font-bold opacity-40 uppercase">Tous nvx</span>
                                    </div>
                                </div>
                            </td>
                            {week.days?.map((day: any, i: number) => {
                                const isVisible = i === selectedDayIdx;
                                const hasSessions = day.sessions && day.sessions.length > 0;
                                return (
                                    <td key={i} className={`p-1 align-top h-full ${isVisible ? 'block' : 'hidden'} md:table-cell`}>
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 h-full min-h-[50px] flex flex-col gap-2 shadow-sm hover:border-turquoise/50 transition-colors">
                                            {hasSessions ? (
                                                day.sessions.map((sess: any, idx: number) => (
                                                    <div key={idx} className="bg-purple-50 border border-purple-100 rounded-lg p-2 text-center">
                                                        <span className="block text-xs font-black text-purple-700 leading-none">{sess.time}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center opacity-30">
                                                    <span className="text-[10px] font-black text-slate-300">-</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- RENDER TABLE MARCHE (MODE HORIZONTAL) ---
    const renderMarcheTable = (week: any) => (
        <div className="flex flex-col gap-4">
            {/* Day Selector Mobile */}
            <div className="flex md:hidden bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                {week.days?.map((day: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDayIdx(i)}
                        className={`flex-1 min-w-[60px] py-2 rounded-xl text-[10px] font-black uppercase transition-all ${selectedDayIdx === i ? 'bg-turquoise text-abysse shadow-md' : 'text-slate-400'}`}
                    >
                        {day.name?.slice(0, 3)}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-full md:min-w-[800px] border-separate border-spacing-1">
                    <thead className="hidden md:table-header-group">
                        <tr>
                            <th className="p-2 text-left w-32 bg-slate-100 rounded-xl">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">Activité</span>
                            </th>
                            {week.days?.map((day: any, i: number) => (
                                <th key={i} className="p-2 text-center bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="block text-abysse font-black text-sm uppercase">{(day.name || '---').slice(0, 3)}</span>
                                        <span className="text-[9px] font-bold text-slate-400">
                                            {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="flex flex-col md:table-row">
                            <td className="p-3 rounded-xl border border-turquoise/20 bg-turquoise/5 shadow-sm align-top md:table-cell mb-1 md:mb-0">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-turquoise flex items-center justify-center text-white shadow-sm">
                                        <Waves size={16} />
                                    </div>
                                    <div>
                                        <span className="block font-black uppercase italic text-xs text-turquoise-700">Marche</span>
                                        <span className="block text-[9px] font-bold opacity-40 uppercase">Tous nvx</span>
                                    </div>
                                </div>
                            </td>
                            {week.days?.map((day: any, i: number) => {
                                const isVisible = i === selectedDayIdx;
                                const hasSessions = day.sessions && day.sessions.length > 0;
                                return (
                                    <td key={i} className={`p-1 align-top h-full ${isVisible ? 'block' : 'hidden'} md:table-cell`}>
                                        <div className="bg-white border border-slate-100 rounded-xl p-2 h-full min-h-[50px] flex flex-col gap-2 shadow-sm hover:border-turquoise/50 transition-colors">
                                            {hasSessions ? (
                                                day.sessions.map((sess: any, idx: number) => (
                                                    <div key={idx} className="bg-turquoise/5 border border-turquoise/10 rounded-lg p-2 text-center">
                                                        <span className="block text-xs font-black text-turquoise-700 leading-none">{sess.time}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center opacity-30">
                                                    <span className="text-[10px] font-black text-slate-300">-</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-4xl border border-slate-200 shadow-xl overflow-hidden font-sans flex flex-col h-full">

            {/* HEADER : TABS & NAV */}
            <div className="bg-abysse p-6 pb-0 flex flex-col gap-6 shrink-0">

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
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="hidden md:block">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter loading-none">
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
                                        <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Semaine {currentIdx + 1} / {currentList.length}</span>
                                        <span className="text-xs font-black text-white truncate max-w-[180px]">{currentWeek?.title}</span>
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
            <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
                {!currentWeek ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                        <Calendar size={48} className="mb-4" />
                        <span className="text-sm font-black uppercase tracking-widest">Aucun planning disponible</span>
                    </div>
                ) : (
                    activeTab === 'voile' ? renderVoileTable(currentWeek) :
                        activeTab === 'char' ? renderCharTable(currentWeek) :
                            renderMarcheTable(currentWeek)
                )}
            </div>

            {/* NO FOOTER : Clean look */}
        </div>
    );
};
