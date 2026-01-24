

"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Wind, 
  Waves, 
  Anchor, 
  Sun,
  MapPin,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  XCircle,
  Layout,
  ArrowRight,
  Info
} from 'lucide-react';

// --- JEU DE DONNÉES ---

const weeklyScheduleData = {
  weeks: [
    {
      weekLabel: "Semaine du 7 au 11 juillet 2025",
      days: [
        {
          day: "Lundi 7",
          miniMousses: { time: "10h - 12h", activity: "piscine", label: "Piscine / Cerf-volant" },
          mousses: { time: "14h - 16h", activity: "optimist", label: "Optimist" },
          initiation: "8h - 11h",
          perfectionnement: "13h - 16h"
        },
        {
          day: "Mardi 8",
          miniMousses: { time: "13h - 15h", activity: "piscine", label: "Piscine / Cerf-volant" },
          mousses: { time: "9h - 11h", activity: "catamaran", label: "Catamaran" },
          initiation: "8h30 - 11h30",
          perfectionnement: "14h15 - 17h15"
        },
        {
          day: "Mercredi 9",
          miniMousses: { time: "10h - 12h", activity: "optimist", label: "Optimist mare de l'Essay" },
          mousses: { time: "14h30 - 16h30", activity: "paddle", label: "Paddle / Kayak" },
          initiation: "9h15 - 12h15",
          perfectionnement: "15h15 - 18h15"
        },
        {
          day: "Jeudi 10",
          miniMousses: { time: "16h - 18h", activity: "paddle", label: "Paddle / Trimaran" },
          mousses: { time: "9h30 - 11h30", activity: "optimist", label: "Optimist" },
          initiation: "9h45 - 12h45",
          perfectionnement: "16h - 19h"
        },
        {
          day: "Vendredi 11",
          miniMousses: { time: "13h - 15h", activity: "char", label: "Char à voile" },
          mousses: { time: "10h - 12h", activity: "char", label: "Char à voile" },
          initiation: "10h30 - 13h30",
          perfectionnement: "16h45 - 19h45"
        }
      ]
    },
    {
      weekLabel: "Semaine du 14 au 18 juillet 2025",
      days: [
        {
          day: "Lundi 14",
          miniMousses: { time: "10h - 12h", activity: "piscine", label: "Piscine / Cerf-volant" },
          mousses: { time: "15h - 17h", activity: "catamaran", label: "Catamaran" },
          initiation: "12h15 - 15h15",
          perfectionnement: "18h45 - 21h45"
        },
        {
          day: "Mardi 15",
          miniMousses: { time: "13h - 15h", activity: "piscine", label: "Piscine / Cerf-volant" },
          mousses: { time: "9h - 11h", activity: "optimist", label: "Optimist" },
          initiation: "7h30 - 10h30",
          perfectionnement: "13h - 16h"
        },
        {
          day: "Mercredi 16",
          miniMousses: { time: "16h30 - 18h30", activity: "char", label: "Char à voile" },
          mousses: { time: "13h30 - 15h30", activity: "char", label: "Char à voile" },
          initiation: "8h - 11h",
          perfectionnement: "13h45 - 16h45"
        },
        {
          day: "Jeudi 17",
          miniMousses: { time: "15h - 17h", activity: "paddle", label: "Paddle / Trimaran" },
          mousses: { time: "10h - 12h", activity: "paddle", label: "Paddle / Kayak" },
          initiation: "Raid",
          perfectionnement: "Raid",
          isRaid: true
        },
        {
          day: "Vendredi 18",
          miniMousses: { time: "10h - 12h", activity: "optimist", label: "Optimist mare de l'Essay" },
          mousses: { time: "14h - 16h", activity: "optimist", label: "Optimist" },
          initiation: "8h30 - 16h",
          perfectionnement: "9h15 - 16h45",
          isRaid: true
        }
      ]
    }
  ]
};

// Données restructurées par semaine pour le Char à Voile
const charAVoileWeeks = [
  {
    weekLabel: "Semaine du 16 au 22 Février",
    title: "Vacances d'Hiver - Zone B/C",
    sessions: [
      { day: "LUN", num: "16", month: "Fév", time: "14h00 - 16h00" },
      { day: "MAR", num: "17", month: "Fév", time: "14h30 - 16h30" },
      { day: "MER", num: "18", month: "Fév", time: "14h30 - 16h30" },
      { day: "JEU", num: "19", month: "Fév", time: "13h30 - 15h30" },
      { day: "VEN", num: "20", month: "Fév", time: "13h30 - 15h30" }
    ]
  },
  {
    weekLabel: "Semaine du 23 Fév au 1 Mars",
    title: "Vacances d'Hiver - Zone A/B/C",
    sessions: [
      { day: "LUN", num: "23", month: "Fév", time: "15h30 - 17h30" },
      { day: "MAR", num: "24", month: "Fév", time: "16h00 - 18h00" },
      { day: "VEN", num: "27", month: "Fév", time: "10h00 - 12h00" }
    ]
  },
  {
    weekLabel: "Semaine du 2 au 8 Mars",
    title: "Vacances d'Hiver - Zone A",
    sessions: [
      { day: "LUN", num: "02", month: "Mar", time: "10h30 - 12h30", double: true, time2: "13h30 - 15h30" },
      { day: "MAR", num: "03", month: "Mar", time: "14h30 - 16h30" },
      { day: "JEU", num: "05", month: "Mar", time: "16h00 - 18h00" },
      { day: "VEN", num: "06", month: "Mar", time: "13h30 - 15h30" }
    ]
  }
];


const locationsData = {
  weeks: [
    {
      weekLabel: "Semaine du 14 au 20 juillet 2025",
      days: [
        { 
          day: "Lundi 14", 
          slots: [
            { time: "9h - 12h", equipment: "Catamaran", available: true },
            { time: "14h - 17h", equipment: "Paddle", available: true },
            { time: "17h - 19h", equipment: "Optimist", available: false }
          ]
        },
        { 
          day: "Mardi 15", 
          slots: [
            { time: "10h - 13h", equipment: "Planche à voile", available: true },
            { time: "15h - 18h", equipment: "Catamaran", available: true }
          ]
        },
        { 
          day: "Mercredi 16", 
          slots: [
            { time: "9h - 12h", equipment: "Paddle", available: true },
            { time: "14h - 17h", equipment: "Kayak", available: true },
            { time: "18h - 20h", equipment: "Catamaran", available: false }
          ]
        },
        { 
          day: "Jeudi 17", 
          slots: [
            { time: "8h - 11h", equipment: "Optimist", available: true },
            { time: "14h - 17h", equipment: "Planche à voile", available: true }
          ]
        },
        { 
          day: "Vendredi 18", 
          slots: [
            { time: "10h - 13h", equipment: "Catamaran", available: true },
            { time: "15h - 18h", equipment: "Paddle", available: true }
          ]
        },
        { 
          day: "Samedi 19", 
          slots: [
            { time: "9h - 12h", equipment: "Tout équipement", available: true },
            { time: "14h - 17h", equipment: "Tout équipement", available: true }
          ]
        },
        { 
          day: "Dimanche 20", 
          slots: [
            { time: "10h - 13h", equipment: "Tout équipement", available: true },
            { time: "15h - 18h", equipment: "Tout équipement", available: true }
          ]
        }
      ]
    }
  ]
};

// --- COMPOSANT MODULE PLANNING ---
const PlanningWidget: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'STAGES' | 'CHAR' | 'LOC'>('STAGES');
    const [currentWeekIdx, setCurrentWeekIdx] = useState(0);

    const getActivityIcon = (type: string) => {
        if(type.includes('piscine')) return <Waves size={14} className="text-blue-500" />;
        if(type.includes('optimist')) return <Anchor size={14} className="text-orange-500" />;
        if(type.includes('char')) return <Wind size={14} className="text-purple-500" />;
        if(type.includes('catamaran')) return <Wind size={14} className="text-teal-500" />;
        return <Sun size={14} className="text-yellow-500" />;
    };

    // Configuration des lignes pour le mode pivot (Y = Activités)
    const ACTIVITY_ROWS = [
        { 
            id: 'miniMousses', 
            label: 'Mini-Mousses', 
            age: '5-7 ans',
            color: 'text-orange-500', 
            bg: 'bg-orange-50', 
            borderColor: 'border-orange-100',
            icon: <Sun size={20} /> 
        },
        { 
            id: 'mousses', 
            label: 'Moussaillons', 
            age: '7-9 ans',
            color: 'text-turquoise', 
            bg: 'bg-cyan-50', 
            borderColor: 'border-cyan-100',
            icon: <Anchor size={20} /> 
        },
        { 
            id: 'initiation', 
            label: 'Initiation', 
            age: '10-14 ans',
            color: 'text-blue-500', 
            bg: 'bg-blue-50', 
            borderColor: 'border-blue-100',
            icon: <Wind size={20} /> 
        },
        { 
            id: 'perfectionnement', 
            label: 'Perf.', 
            age: '14+ ans',
            color: 'text-purple-500', 
            bg: 'bg-purple-50', 
            borderColor: 'border-purple-100',
            icon: <Waves size={20} /> 
        }
    ];

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Header / Tabs */}
            <div className="bg-abysse p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Calendar size={24} className="text-turquoise" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic leading-none">Planning</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Saison 2025/2026</p>
                    </div>
                </div>
                
                <div className="flex bg-slate-900/50 p-1.5 rounded-xl backdrop-blur-sm border border-white/10 overflow-x-auto max-w-full">
                    <button 
                        onClick={() => { setActiveTab('STAGES'); setCurrentWeekIdx(0); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'STAGES' ? 'bg-turquoise text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Stages Été
                    </button>
                    <button 
                        onClick={() => { setActiveTab('CHAR'); setCurrentWeekIdx(0); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'CHAR' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Char à Voile
                    </button>
                    <button 
                        onClick={() => { setActiveTab('LOC'); setCurrentWeekIdx(0); }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'LOC' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Locations
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 bg-slate-50 min-h-[400px]">
                
                {/* --- VUE STAGES --- */}
                {activeTab === 'STAGES' && (
                    <div className="animate-in fade-in duration-300">
                        {/* Nav Semaine */}
                        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <button 
                                onClick={() => setCurrentWeekIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentWeekIdx === 0}
                                className="size-10 rounded-full bg-slate-50 hover:bg-turquoise hover:text-white disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 transition-colors flex items-center justify-center text-slate-400"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-abysse font-black uppercase italic text-lg text-center">
                                {weeklyScheduleData.weeks[currentWeekIdx].weekLabel}
                            </span>
                            <button 
                                onClick={() => setCurrentWeekIdx(prev => Math.min(weeklyScheduleData.weeks.length - 1, prev + 1))}
                                disabled={currentWeekIdx === weeklyScheduleData.weeks.length - 1}
                                className="size-10 rounded-full bg-slate-50 hover:bg-turquoise hover:text-white disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 transition-colors flex items-center justify-center text-slate-400"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Table Responsive (Transposed) */}
                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                            <table className="w-full min-w-[800px] border-collapse">
                                <thead>
                                    <tr>
                                        {/* Coin vide ou Label */}
                                        <th className="p-4 w-[200px] text-left bg-slate-50/50 sticky left-0 z-10 border-b border-slate-200">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activités</span>
                                        </th>
                                        {/* Jours en Colonnes (X) */}
                                        {weeklyScheduleData.weeks[currentWeekIdx].days.map((day, idx) => (
                                            <th key={idx} className="p-4 min-w-[140px] text-center border-b border-slate-200 bg-white">
                                                <span className="block font-black text-abysse text-sm">{day.day}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Activités en Lignes (Y) */}
                                    {ACTIVITY_ROWS.map((row) => (
                                        <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-white transition-colors group">
                                            {/* Header de Ligne */}
                                            <td className={`p-4 sticky left-0 z-10 ${row.bg} border-r ${row.borderColor} group-hover:bg-white transition-colors`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-10 rounded-xl bg-white flex items-center justify-center ${row.color} shadow-sm shrink-0`}>
                                                        {row.icon}
                                                    </div>
                                                    <div>
                                                        <span className={`block font-black text-xs uppercase tracking-wider ${row.color}`}>{row.label}</span>
                                                        <span className="block text-[9px] font-bold text-slate-400 uppercase mt-0.5">{row.age}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cellules de Données */}
                                            {weeklyScheduleData.weeks[currentWeekIdx].days.map((day, dIdx) => {
                                                const cellData = (day as any)[row.id];
                                                const isRaid = (day as any).isRaid && (row.id === 'initiation' || row.id === 'perfectionnement');

                                                // Cas Spécial : Journée Raid
                                                if (isRaid) {
                                                    return (
                                                        <td key={dIdx} className="p-4 bg-yellow-50 text-center border-l border-white/50">
                                                            <div className="flex flex-col items-center justify-center gap-1 p-2 bg-white/60 rounded-lg border border-yellow-200">
                                                                <Sun size={16} className="text-yellow-500 animate-spin-slow" />
                                                                <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Journée Raid</span>
                                                            </div>
                                                        </td>
                                                    );
                                                }

                                                // Cas Normal : Objet (Mini/Mousse) ou String (Init/Perf)
                                                if (!cellData) return <td key={dIdx} className="p-4 bg-slate-50/20 border-l border-slate-50"></td>;

                                                if (typeof cellData === 'object') {
                                                    return (
                                                        <td key={dIdx} className="p-4 text-center border-l border-slate-50">
                                                            <span className="block text-xs font-bold text-slate-600 mb-1.5">{cellData.time}</span>
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100 max-w-full">
                                                                {getActivityIcon(cellData.activity)}
                                                                <span className="text-[9px] font-bold text-slate-500 uppercase truncate max-w-[100px]" title={cellData.label}>
                                                                    {cellData.activity}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                }

                                                return (
                                                    <td key={dIdx} className="p-4 text-center border-l border-slate-50">
                                                        <span className="text-xs font-bold text-slate-600">{cellData}</span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- VUE CHAR À VOILE (REMASTERISÉE) --- */}
                {activeTab === 'CHAR' && (
                    <div className="animate-in fade-in duration-500 space-y-12">
                        {charAVoileWeeks.map((week, idx) => (
                            <div key={idx} className="relative">
                                {/* Header Semaine */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-abysse uppercase italic leading-none mb-1">
                                            {week.weekLabel}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{week.title}</span>
                                    </div>
                                </div>

                                {/* Grille des Séances Type "Agenda/Tickets" */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {week.sessions.map((session, sIdx) => (
                                        <div key={sIdx} className={`bg-white rounded-2xl border flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                                            (session as any).double ? 'border-orange-500/30' : 'border-slate-200'
                                        }`}>
                                            
                                            {/* Top Strip */}
                                            <div className={`h-1.5 w-full ${(session as any).double ? 'bg-orange-500' : 'bg-slate-200 group-hover:bg-orange-400'}`}></div>

                                            <div className="p-5 flex flex-col h-full">
                                                {/* Date Block */}
                                                <div className="flex items-baseline gap-1 mb-4">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{session.day}</span>
                                                    <span className="text-3xl font-black text-abysse">{session.num}</span>
                                                    <span className="text-xs font-bold text-abysse uppercase">{session.month}</span>
                                                </div>

                                                {/* Time & Info */}
                                                <div className="mt-auto space-y-3">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Clock size={16} className="text-orange-500" />
                                                        <span className="text-sm font-bold">{session.time}</span>
                                                    </div>
                                                    
                                                    {/* Double Séance Badge */}
                                                    {(session as any).double && (
                                                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-2">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="size-2 rounded-full bg-orange-500 animate-pulse"></span>
                                                                <span className="text-[9px] font-black uppercase text-orange-600 tracking-widest">2ème Créneau</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-orange-800 block pl-4">{(session as any).time2}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Button (Hover) */}
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-bold uppercase text-slate-400">8 places</span>
                                                    <ArrowRight size={16} className="text-orange-500" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-4 text-orange-800 text-sm font-medium">
                            <Info size={20} className="shrink-0" />
                            <p>Les horaires de char à voile dépendent de la marée basse. Merci d'arriver 15 minutes avant le début de la séance.</p>
                        </div>
                    </div>
                )}

                {/* --- VUE LOCATIONS --- */}
                {activeTab === 'LOC' && (
                    <div className="animate-in fade-in duration-300">
                        {/* Nav Semaine (Identique Stages mais pour Locations) */}
                        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <button className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 cursor-not-allowed">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-abysse font-black uppercase italic text-lg text-center">
                                {locationsData.weeks[0].weekLabel}
                            </span>
                            <button className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 cursor-not-allowed">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {locationsData.weeks[0].days.map((day, dIdx) => (
                                <div key={dIdx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                    <h4 className="font-black text-abysse text-lg mb-4 border-b border-slate-100 pb-2">{day.day}</h4>
                                    <div className="space-y-3">
                                        {day.slots.map((slot, sIdx) => (
                                            <div key={sIdx} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    {slot.available ? (
                                                        <CheckCircle2 size={14} className="text-green-500" />
                                                    ) : (
                                                        <XCircle size={14} className="text-red-400" />
                                                    )}
                                                    <span className={`font-medium ${slot.available ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                                                        {slot.equipment}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded text-xs">{slot.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export const InfosPratiquesPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Check if L is available (loaded from CDN in index.html)
    if (typeof window !== 'undefined' && (window as any).L && mapRef.current && !mapInstance.current) {
        const L = (window as any).L;
        
        // Coordonnées CNC Coutainville: 49.030384, -1.595904
        const map = L.map(mapRef.current).setView([49.030384, -1.595904], 17);

        // Couche Satellite IGN (ORTHOIMAGERY.ORTHOPHOTOS)
        L.tileLayer('https://data.geopf.fr/wmts?'+
            '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM'+
            '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}'+
            '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
            {
	            ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS',
	            style: 'normal',
	            format: 'image/jpeg',
	            service: 'WMTS',
                attribution: 'Carte © IGN/Geoplateforme'
        }).addTo(map);

        // Icône personnalisée pour éviter les soucis de chemin d'assets par défaut de Leaflet
        const icon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        L.marker([49.030384, -1.595904], { icon: icon }).addTo(map)
            .bindPopup('<div class="text-center"><b class="text-abysse">CVC Coutainville</b><br/>Le Spot</div>')
            .openPopup();

        mapInstance.current = map;
    }

    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto">
      
      <h1 className="text-5xl md:text-7xl font-black text-abysse tracking-tighter leading-none mb-16 text-center">
        CONTACT & <span className="text-turquoise">INFOS</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
         
         {/* Contact Info + MAP */}
         <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-card flex flex-col">
            <h2 className="text-2xl font-black text-abysse uppercase italic mb-8">Nous trouver</h2>
            <div className="space-y-6">
                <div className="flex gap-6">
                    <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-turquoise shrink-0">
                        <MapPin />
                    </div>
                    <div>
                        <p className="text-abysse font-bold text-lg">Plage Nord</p>
                        <p className="text-slate-500 font-medium">120 rue des Dunes<br/>50230 Agon-Coutainville</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-turquoise shrink-0">
                        <Phone />
                    </div>
                    <p className="text-abysse font-bold text-lg py-1">02 33 47 14 81</p>
                </div>
                <div className="flex gap-6">
                    <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-turquoise shrink-0">
                        <Mail />
                    </div>
                    <p className="text-abysse font-bold text-lg py-1">contact@cvcoutainville.com</p>
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-xl">
                   <span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Juillet / Août</span>
                   <span className="text-abysse font-bold">9h - 19h (7j/7)</span>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl">
                   <span className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Hors Saison</span>
                   <span className="text-abysse font-bold">Mer. & Sam. 14h-18h</span>
                 </div>
            </div>

            {/* MAP CONTAINER */}
            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner mt-auto relative z-0">
                <div ref={mapRef} className="w-full h-full z-0"></div>
            </div>
         </div>

         {/* Documents */}
         <div className="bg-abysse p-10 rounded-[2rem] border border-slate-100 shadow-card text-white h-fit">
            <h2 className="text-2xl font-black uppercase italic mb-8">Documents</h2>
            <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-turquoise rounded-xl transition-colors text-left group">
                   <span className="font-bold">Grille Tarifaire 2026 (PDF)</span>
                   <Download />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-turquoise rounded-xl transition-colors text-left group">
                   <span className="font-bold">Fiche Sanitaire de Liaison</span>
                   <Download />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-turquoise rounded-xl transition-colors text-left group">
                   <span className="font-bold">Règlement Intérieur</span>
                   <Download />
                 </button>
            </div>
            
            <div className="mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop" className="rounded-2xl border border-white/10" alt="Club ambience" />
            </div>
         </div>

      </div>

      {/* --- NOUVEAU MODULE PLANNING --- */}
      <div className="mb-24">
         <PlanningWidget />
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
         <h2 className="text-3xl font-black text-abysse uppercase italic text-center mb-12">Questions Fréquentes</h2>
         <div className="grid gap-6">
             {[
               { q: "À partir de quel âge peut-on naviguer ?", a: "Dès 4 ans au Jardin des Mers. Pour le char à voile, à partir de 8 ans." },
               { q: "Faut-il savoir nager ?", a: "Oui, un test d'aisance aquatique (25m) est obligatoire pour toutes les activités nautiques (sauf Char à voile)." },
               { q: "Que dois-je apporter ?", a: "Maillot de bain, serviette, crème solaire, lunettes attachées et vieilles baskets. La combinaison est fournie." },
               { q: "Que se passe-t-il s'il n'y a pas de vent ?", a: "Les moniteurs adaptent la séance : théorie, nœuds, paddle ou jeux de plage. La séance n'est pas remboursée mais remplacée." }
             ].map((item, i) => (
               <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                 <h3 className="text-lg font-black text-abysse mb-2 flex items-center gap-3">
                    <span className="text-turquoise text-2xl">?</span> {item.q}
                 </h3>
                 <p className="text-slate-500 font-medium leading-relaxed pl-6 border-l-2 border-slate-100">{item.a}</p>
               </div>
             ))}
         </div>
      </div>

    </div>
  );
};

export default InfosPratiquesPage;
