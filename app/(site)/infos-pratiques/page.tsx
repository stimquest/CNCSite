"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { WeeklyPlanning, DayEntry, ActivityType } from '@/types';
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, Wind, Waves, MapPin, Phone, Mail, Download, Info,
  Sun, Anchor, Sailboat, LayoutGrid, Zap, HeartHandshake, FileText, CheckCircle2, ArrowRight, GraduationCap
} from 'lucide-react';

// Configuration visuelle des groupes
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
    switch(type) {
        case 'piscine': return <Sun size={14} />;
        case 'optimist': return <Sailboat size={14} />;
        case 'catamaran': return <Anchor size={14} />;
        case 'paddle': return <Waves size={14} />;
        case 'char': return <Wind size={14} />;
        default: return <Waves size={14} />;
    }
};

const getIconBg = (type: ActivityType) => {
    switch(type) {
        case 'piscine': return 'bg-yellow-400 text-white';
        case 'optimist': return 'bg-blue-400 text-white';
        case 'catamaran': return 'bg-indigo-400 text-white';
        case 'paddle': return 'bg-cyan-400 text-white';
        case 'char': return 'bg-purple-400 text-white';
        default: return 'bg-slate-400 text-white';
    }
};

const formatDayDate = (startDate: string, dayIndex: number) => {
    if (!startDate) return { name: "", day: "" };
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return {
        name: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date),
        day: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
    };
};

const PlanningWidget: React.FC = () => {
    const { plannings, isLoading } = useContent();
    const [currentIdx, setCurrentIdx] = useState(0);

    const filtered = (plannings || []).filter(p => p.isPublished !== false);
    const plan = filtered[currentIdx];

    if (isLoading) return <div className="p-20 text-center font-black uppercase text-slate-300 animate-pulse">Chargement de la structure...</div>;

    return (
        <div className="bg-white rounded-4xl border border-slate-200 shadow-xl overflow-hidden font-sans">
            
            <div className="bg-abysse p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="size-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                        <Calendar size={28} className="text-turquoise" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter">Planning Hebdo</h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Saison Stages 2025/2026</p>
                    </div>
                </div>
                
                {filtered.length > 1 && (
                    <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-inner">
                        <button onClick={() => setCurrentIdx(v => Math.max(0, v-1))} disabled={currentIdx === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-20 transition-all"><ChevronLeft/></button>
                        <div className="px-6 flex flex-col items-center justify-center min-w-[200px]">
                            <span className="text-xs font-black uppercase italic">{plan?.title || 'Stages'}</span>
                            <span className="text-[10px] font-bold text-turquoise">Semaine {currentIdx + 1} / {filtered.length}</span>
                        </div>
                        <button onClick={() => setCurrentIdx(v => Math.min(filtered.length-1, v+1))} disabled={currentIdx === filtered.length-1} className="p-2 text-slate-400 hover:text-white disabled:opacity-20 transition-all"><ChevronRight/></button>
                    </div>
                )}
            </div>

            <div className="p-4 md:p-8 bg-slate-50 overflow-x-auto">
                {!plan ? (
                    <div className="py-20 text-center text-slate-300 italic uppercase font-black tracking-widest">Aucun planning disponible</div>
                ) : (
                    <table className="w-full min-w-[1000px] border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="p-4 text-left w-64 bg-slate-100 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Groupes d'âge</span>
                                </th>
                                {plan.days?.map((day, i) => (
                                    <th key={i} className="p-4 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="block text-abysse font-black text-xl italic">{day.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {GROUP_CONFIG.map((group) => (
                                <tr key={group.id}>
                                    <td className={`p-6 rounded-2xl border ${group.border} ${group.bg} shadow-sm group`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-xl ${group.iconColor} flex items-center justify-center text-white shadow-lg`}>
                                                <LayoutGrid size={20} />
                                            </div>
                                            <div>
                                                <span className={`block font-black uppercase italic text-sm ${group.text}`}>{group.label}</span>
                                                <span className="block text-[10px] font-bold opacity-40 uppercase tracking-widest">{group.age}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {plan.days?.map((day, dayIdx) => {
                                        // Specific Handling for KID Groups (Objects)
                                        if (group.id === 'miniMousses' || group.id === 'mousses') {
                                            const session = (day as any)[group.id];
                                            
                                            let isRaid = false;
                                            if (day.raidTarget && day.raidTarget !== 'none') {
                                                isRaid = day.raidTarget === group.id;
                                            } else {
                                                isRaid = day.isRaidDay; // Fallback for legacy
                                            }

                                            return (
                                                <td key={dayIdx} className={`p-4 rounded-2xl border border-white bg-white shadow-sm text-center relative overflow-hidden group/cell hover:border-turquoise/30 transition-all ${isRaid ? 'bg-orange-50 border-orange-200' : ''}`}>
                                                    {isRaid ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">RAID</div>
                                                            <span className="text-xs font-black text-orange-900">{session?.time || 'Journée'}</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="block text-xs font-black text-abysse mb-2">{session?.time || '--'}</span>
                                                            {session?.activity && (
                                                                <div className="inline-flex flex-col items-center gap-2">
                                                                    <div className={`p-2 rounded-lg ${getIconBg(session.activity)} shadow-sm`}>
                                                                        {getActivityIcon(session.activity)}
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none max-w-[100px]">{session.description || '...'}</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            );
                                        } 
                                        // Specific Handling for ADULT Groups (Strings)
                                        else {
                                            const val = (day as any)[group.id]; // String: "14h - 17h" or "Raid"
                                            
                                            let isRaid = false;
                                            if (day.raidTarget && day.raidTarget !== 'none') {
                                                isRaid = day.raidTarget === group.id;
                                            } else {
                                                isRaid = val?.toLowerCase() === 'raid' || day.isRaidDay;
                                            }
                                            
                                            return (
                                                <td key={dayIdx} className={`p-4 rounded-2xl border border-white bg-white shadow-sm text-center transition-all ${isRaid ? 'bg-orange-50 border-orange-200' : ''}`}>
                                                    {isRaid ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">RAID</div>
                                                            <span className="text-xs font-black text-orange-900">{val === 'Raid' ? 'Journée' : val}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-black text-abysse">{val || '--'}</span>
                                                    )}
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-slate-900 p-8 md:p-12 text-white/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex gap-4">
                    <div className="size-10 rounded-xl bg-turquoise/20 flex items-center justify-center text-turquoise shrink-0"><Info size={20}/></div>
                    <div>
                        <h4 className="text-white font-black uppercase italic text-xs mb-2">Initiation & Perfectionnement</h4>
                        <p className="text-[10px] leading-relaxed font-medium">Groupes destinés aux navigateurs de 10 à 16 ans. L'initiation pose les bases, le perfectionnement travaille la vitesse et la technique de régate.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="size-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0"><Wind size={20}/></div>
                    <div>
                        <h4 className="text-white font-black uppercase italic text-xs mb-2">Séances de rattrapage</h4>
                        <p className="text-[10px] leading-relaxed font-medium font-sans">En cas de conditions météo défavorables empêchant la sortie sur l'eau, des séances théoriques ou activités alternatives (Paddle, Kayak) sont organisées.</p>
                    </div>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-turquoise mb-4">Besoin d'aide ?</p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-turquoise flex items-center justify-center text-abysse"><Phone size={18}/></div>
                        <span className="text-white font-black italic">02 33 47 14 81</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PricingWidget: React.FC = () => {
    const [activePricingTab, setActivePricingTab] = useState<'stages' | 'decouverte' | 'rentals' | 'yearly'>('stages');

    return (
        <section id="pricing" className="py-24">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-turquoise font-black uppercase tracking-widest text-xs mb-2 block">Saison 2025</span>
                        <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter mb-4">Tarifs & Formules</h2>
                        <p className="text-slate-600 font-medium text-lg">Choisissez votre support et votre rythme de pratique.</p>
                    </div>
                    <button className="group flex items-center gap-3 bg-white hover:bg-abysse hover:text-white text-abysse px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg border border-slate-100">
                        <FileText size={18} className="text-turquoise group-hover:text-white transition-colors" /> 
                        Télécharger la grille (PDF)
                    </button>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit mx-auto">
                    {[
                        { id: 'stages', label: 'Stages Été', icon: <Calendar size={14} /> },
                        { id: 'decouverte', label: 'Découverte', icon: <Zap size={14} /> },
                        { id: 'rentals', label: 'Locations & Cours', icon: <Clock size={14} /> },
                        { id: 'yearly', label: 'Club à l\'Année', icon: <HeartHandshake size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePricingTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                                activePricingTab === tab.id 
                                ? 'bg-abysse text-white shadow-lg' 
                                : 'text-slate-400 hover:text-abysse hover:bg-slate-50'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* 1. STAGES NAUTIQUES ÉTÉ */}
                    {activePricingTab === 'stages' && (
                    <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-abysse via-turquoise to-abysse"></div>
                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                                <h3 className="text-3xl font-black text-abysse uppercase italic flex items-center gap-4">
                                    <span className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse shadow-inner border border-slate-100"><Calendar size={28}/></span>
                                    1. Stages Nautiques Été
                                </h3>
                                <div className="flex items-center gap-3 bg-green-50 px-5 py-3 rounded-xl border border-green-100">
                                    <CheckCircle2 size={18} className="text-green-600" />
                                    <span className="text-green-800 text-xs font-black uppercase tracking-widest">
                                        Adhésion & Licence Incluses (Sem 1)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto rounded-3xl border border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest">
                                            <th className="py-6 pl-8 w-1/3">Support</th>
                                            <th className="py-6">Âge</th>
                                            <th className="py-6 text-right">1ère Semaine</th>
                                            <th className="py-6 pr-8 text-right text-turquoise">2ème Semaine (-5%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold text-slate-600">
                                        {[
                                            { name: "Mini Mousses", age: "5-7 ans", p1: "168 €", p2: "129 €" },
                                            { name: "Moussaillons", age: "7-8 ans", p1: "173 €", p2: "134 €" },
                                            { name: "Catamaran 10 pieds", age: "8-9 ans", p1: "188 €", p2: "148 €" },
                                            { name: "Catamaran 12 pieds", age: "10-12 ans", p1: "188 €", p2: "148 €" },
                                            { name: "Catamaran 14 pieds", age: "13-15 ans", p1: "208 €", p2: "167 €" },
                                            { name: "Catamaran 16 pieds", age: "16 ans et +", p1: "238 €", p2: "196 €" },
                                            { name: "Planche à voile", age: "14 ans et +", p1: "188 €", p2: "148 €" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors group">
                                                <td className="py-5 pl-8 text-abysse text-base font-black group-hover:text-turquoise transition-colors">{row.name}</td>
                                                <td className="py-5"><span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 shadow-sm">{row.age}</span></td>
                                                <td className="py-5 text-right text-lg font-black text-abysse">{row.p1}</td>
                                                <td className="py-5 pr-8 text-right text-lg font-black text-slate-400 group-hover:text-turquoise transition-colors">{row.p2}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 flex items-start gap-3 opacity-70">
                                <Info size={16} className="text-slate-400 mt-0.5" />
                                <p className="text-xs text-slate-500 font-medium italic max-w-2xl">
                                    Les tarifs de la première semaine incluent l'adhésion (20 €) et la licence FFV (14 €). La réduction s'applique sur la même personne pour une deuxième semaine consécutive ou non.
                                </p>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* 2. SÉANCES DÉCOUVERTE */}
                    {activePricingTab === 'decouverte' && (
                    <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden relative">
                        <div className="p-8 md:p-12">
                            <h3 className="text-3xl font-black text-abysse uppercase italic mb-10 flex items-center gap-4">
                                <span className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse shadow-inner border border-slate-100"><Zap size={28}/></span>
                                2. Séances Découverte
                            </h3>
                            
                            <div className="overflow-x-auto rounded-3xl border border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest">
                                            <th className="py-6 pl-8 w-1/2">Prestation</th>
                                            <th className="py-6">Détails</th>
                                            <th className="py-6 pr-8 text-right">Tarif</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold text-slate-600">
                                        {[
                                            { name: "Char à Voile", detail: "2h | dès 8 ans", price: "35 €" },
                                            { name: "Trimaran Été", detail: "2h | dès 5 ans (+adulte)", price: "35 €" },
                                            { name: "Catamaran Été", detail: "2h | dès 8 ans", price: "35 €" },
                                            { name: "Marche Aquatique", detail: "1h | dès 14 ans", price: "10 €" },
                                            { name: "Speed Sail", detail: "1h30 | dès 14 ans", price: "50 €" },
                                            { name: "Kitesurf (Unité)", detail: "Séance (max 3 pers)", price: "140 €" },
                                            { name: "Wing Foil (Séance)", detail: "Dès 14 ans", price: "130 €" },
                                            { name: "Wing Foil (3 Séances)", detail: "Dès 14 ans", price: "330 €" },
                                            { name: "Wing Foil (5 Séances)", detail: "Dès 14 ans", price: "500 €" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors group">
                                                <td className="py-5 pl-8 text-abysse text-base font-black group-hover:text-turquoise transition-colors">{row.name}</td>
                                                <td className="py-5"><span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 shadow-sm">{row.detail}</span></td>
                                                <td className="py-5 pr-8 text-right text-lg font-black text-abysse">{row.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* 3. LOCATIONS & 4. COURS */}
                    {activePricingTab === 'rentals' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LOCATIONS */}
                        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-4xl p-8 md:p-10 shadow-lg">
                            <h3 className="text-2xl font-black text-abysse uppercase italic mb-8 flex items-center gap-4">
                                <span className="size-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><Clock size={24}/></span>
                                3. Locations
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <th className="pb-4 pl-4">Support</th>
                                            <th className="pb-4 text-center">1h</th>
                                            <th className="pb-4 text-center">1h30</th>
                                            <th className="pb-4 text-center">2h</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold text-slate-700">
                                        {[
                                            { name: "Kayak Simple", h1: "15 €", h15: "-", h2: "25 €" },
                                            { name: "Kayak Double", h1: "20 €", h15: "-", h2: "35 €" },
                                            { name: "Stand Up Paddle", h1: "15 €", h15: "-", h2: "-" },
                                            { name: "Paddle Géant (Collectif)", h1: "80 €", h15: "-", h2: "-" },
                                            { separator: true },
                                            { name: "Catamaran Loisir 14'", h1: "-", h15: "45 €", h2: "-" },
                                            { name: "Catamaran Sportif 16'", h1: "-", h15: "70 €", h2: "-" },
                                            { separator: true },
                                            { name: "Planche Débutant", h1: "-", h15: "35 €", h2: "-" },
                                            { name: "Planche Perf.", h1: "-", h15: "45 €", h2: "-" },
                                            { name: "Option Foil", h1: "-", h15: "+25 €", h2: "-" },
                                        ].map((row, i) => (
                                            (row as any).separator ? 
                                            <tr key={i}><td colSpan={4}><div className="h-px bg-slate-100 my-3"></div></td></tr> :
                                            <tr key={i} className="hover:bg-slate-50 transition-colors rounded-lg">
                                                <td className="py-3 pl-4 font-black text-abysse">{(row as any).name}</td>
                                                <td className="py-3 text-center text-slate-500">{(row as any).h1}</td>
                                                <td className="py-3 text-center text-slate-500">{(row as any).h15}</td>
                                                <td className="py-3 text-center text-slate-500">{(row as any).h2}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Option Combinaison :</span> 
                                <span className="text-sm font-black text-abysse">5 €</span>
                            </div>
                        </div>

                        {/* COURS PARTICULIERS */}
                        <div className="bg-white rounded-4xl p-10 flex flex-col justify-center relative shadow-sm border border-slate-100">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-4">
                                    <span className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse shadow-inner border border-slate-100"><GraduationCap size={24}/></span>
                                    4. Cours Particuliers
                                </h3>
                                <div className="space-y-6">
                                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-abysse text-lg uppercase italic">Prestation Moniteur</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Par heure</p>
                                        </div>
                                        <p className="text-3xl font-black text-abysse">40 €</p>
                                    </div>
                                    <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-abysse text-lg uppercase italic">Frais Matériel</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engin de sécurité inclus</p>
                                        </div>
                                        <p className="text-3xl font-black text-abysse">20 €</p>
                                    </div>
                                </div>
                                <button className="w-full mt-10 bg-abysse text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-turquoise transition-all flex items-center justify-center gap-3">
                                    Réserver un créneau <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* 5. CLUB A L'ANNEE (NEW) */}
                    {activePricingTab === 'yearly' && (
                    <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden relative">
                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                                <h3 className="text-3xl font-black text-abysse uppercase italic flex items-center gap-4">
                                    <span className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse shadow-inner border border-slate-100"><HeartHandshake size={28}/></span>
                                    5. Club à l'Année
                                </h3>
                                <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-xl border border-blue-100">
                                    <Info size={18} className="text-blue-600" />
                                    <span className="text-blue-800 text-[10px] font-black uppercase tracking-widest">
                                        Adhésion & Licence Incluses
                                    </span>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto rounded-3xl border border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-widest">
                                            <th className="py-6 pl-8">Discipline</th>
                                            <th className="py-6">Public</th>
                                            <th className="py-6">Horaires indicatifs</th>
                                            <th className="py-6 pr-8 text-right">Année</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold text-slate-600">
                                        {[
                                            { title: "Char à Voile", age: "11 ans et +", schedule: "Samedis (Sept à Juin)", price: "264 €" },
                                            { title: "Multi-activité", age: "8-11 ans", schedule: "Mercredis PM", price: "164.50 €" },
                                            { title: "Planche à voile", age: "14 ans et +", schedule: "Pratique régulière", price: "253.50 €" },
                                            { title: "Catamaran 11-15", age: "11-15 ans", schedule: "Samedis (Sept à Juin)", price: "219.50 €" },
                                            { title: "Catamaran Ados", age: "13-17 ans", schedule: "Samedis (Sept-Déc & Mars-Juin)", price: "222 €" },
                                            { title: "Catamaran Adultes", age: "18 ans +", schedule: "Samedis (Sept-Déc & Mars-Juin)", price: "273 €" },
                                            { title: "Marche Aquatique", age: "14 ans et +", schedule: "Mercredis & Samedis", price: "122 €" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/80 transition-colors group">
                                                <td className="py-5 pl-8 text-abysse text-base font-black group-hover:text-turquoise transition-colors">{row.title}</td>
                                                <td className="py-5"><span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500 shadow-sm">{row.age}</span></td>
                                                <td className="py-5 text-slate-500">{row.schedule}</td>
                                                <td className="py-5 pr-8 text-right text-lg font-black text-abysse">{row.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export const InfosPratiquesPage: React.FC = () => {
    // MAP
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).L && mapRef.current && !mapInstance.current) {
            const L = (window as any).L;
            const map = L.map(mapRef.current).setView([49.030384, -1.595904], 17);
            L.tileLayer('https://data.geopf.fr/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM&LAYER={ignLayer}&STYLE={style}&FORMAT={format}&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
                ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS', style: 'normal', format: 'image/jpeg', attribution: '© IGN'
            }).addTo(map);
            const icon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] });
            L.marker([49.030384, -1.595904], { icon }).addTo(map).bindPopup('<b>CVC Coutainville</b>').openPopup();
            mapInstance.current = map;
        }
        return () => { if (mapInstance.current) mapInstance.current.remove(); };
    }, []);

    return (
        <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto font-sans">
            <h1 className="text-6xl md:text-8xl font-black text-abysse tracking-tighter leading-none mb-12 text-center italic">CONTACT & <span className="text-turquoise">INFOS</span></h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col">
                    <h2 className="text-2xl font-black text-abysse uppercase italic mb-8">Nous trouver</h2>
                    <div className="space-y-6">
                        <div className="flex gap-6"><div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-turquoise shrink-0"><MapPin /></div><div><p className="text-abysse font-bold text-lg">Plage Nord</p><p className="text-slate-500 font-medium italic">120 rue des Dunes<br/>50230 Agon-Coutainville</p></div></div>
                        <div className="flex gap-6"><div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-turquoise shrink-0"><Phone /></div><p className="text-abysse font-bold text-lg py-1">02 33 47 14 81</p></div>
                        <div className="flex gap-6"><div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-turquoise shrink-0"><Mail /></div><p className="text-abysse font-bold text-lg py-1 uppercase scale-x-90 origin-left">contact@cvcoutainville.com</p></div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl"><span className="block text-slate-400 text-[9px] font-black uppercase mb-1">Juillet / Août</span><span className="text-abysse font-bold uppercase italic">9h - 19h (7j/7)</span></div>
                        <div className="bg-slate-50 p-4 rounded-xl"><span className="block text-slate-400 text-[9px] font-black uppercase mb-1">Hors Saison</span><span className="text-abysse font-bold uppercase italic">Mer. & Sam. 14h-18h</span></div>
                    </div>
                    <div className="h-[300px] w-full rounded-3xl overflow-hidden border border-slate-200 mt-auto"><div ref={mapRef} className="w-full h-full"></div></div>
                </div>
                <div className="bg-abysse p-10 rounded-[3rem] text-white h-fit relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-turquoise/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Documents</h2>
                        <div className="space-y-4">
                            {['Grille Tarifaire 2026 (PDF)', 'Fiche Sanitaire', 'Règlement Intérieur'].map((doc, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-turquoise/20 rounded-2xl transition-all border border-white/5 group shadow-lg"><span className="font-bold text-sm uppercase tracking-widest">{doc}</span><Download size={18} className="group-hover:translate-y-1 transition-transform" /></button>
                            ))}
                        </div>
                        <div className="mt-12 rounded-3xl overflow-hidden grayscale opacity-30 h-48 border border-white/5"><img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800" className="object-cover w-full h-full" alt="Club" /></div>
                    </div>
                </div>
            </div>
            <div className="mb-24"><PlanningWidget /></div>
            <div className="mb-24"><PricingWidget /></div>
        </div>
    );
};

export default InfosPratiquesPage;
