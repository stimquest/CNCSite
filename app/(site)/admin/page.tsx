"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '@/contexts/ContentContext';
import {
    Save,
    Trash2,
    Plus,
    CalendarDays,
    Waves,
    Anchor,
    Wind,
    Sun,
    Ship,
    Zap,
    Clock,
    RefreshCw,
    Shield,
    Check,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Play
} from 'lucide-react';
import { Activity, SpotStatus, WeeklyPlanning, PlanningCharAVoile, PlanningMarche, ActivityType, CharWeek, CharDay, CharSession, AutoConditionsConfig, ActivityThresholds, ActivityMessages } from '@/types';
import { client, writeClient } from '@/lib/sanity';

// --- CONSTANTS ---
const ACTIVITY_OPTIONS: { label: string, value: ActivityType }[] = [
    { label: 'Piscine / Cerf-volant', value: 'piscine' },
    { label: 'Optimist', value: 'optimist' },
    { label: 'Catamaran', value: 'catamaran' },
    { label: 'Paddle / Kayak', value: 'paddle' },
    { label: 'Char à voile', value: 'char' },
];

const DAYS_STAGES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const DAYS_CHAR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// --- UTILS ---
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return formatDate(d);
};
// Helper to get formatted date for local display
const toFRDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

const calculateTimeRange = (start: string, duration: number) => {
    const match = start.match(/(\d+)h(\d+)/);
    if (!match) return start;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const endH = h + duration;
    const format = (v: number) => v < 10 ? `0${v}` : v;
    return `${format(h)}h${format(m)} - ${format(endH)}h${format(m)}`;
};
const START_HOURS = Array.from({ length: 14 }, (_, i) => {
    const h = i + 7;
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return [`${hStr}h00`, `${hStr}h15`, `${hStr}h30`, `${hStr}h45`];
}).flat();

export default function AdminPage() {
    const {
        plannings, charPlannings, marchePlannings, refreshData
    } = useContent();

    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState<'STAGES' | 'CHAR' | 'MARCHE' | 'CONDITIONS'>('STAGES');
    const [isSaving, setIsSaving] = useState(false);

    // --- AUTO CONDITIONS STATE ---
    const [autoConfig, setAutoConfig] = useState<AutoConditionsConfig | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [checkResult, setCheckResult] = useState<any>(null);
    const [conditionsSaved, setConditionsSaved] = useState(false);

    // SELECTORS
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date())); // Selected Monday
    const [selectedStage, setSelectedStage] = useState<WeeklyPlanning | null>(null);
    const [selectedCharPeriod, setSelectedCharPeriod] = useState<PlanningCharAVoile | null>(null);
    const [selectedMarchePeriod, setSelectedMarchePeriod] = useState<PlanningMarche | null>(null);
    const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

    // AUTH
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'CNC2026') {
            setIsAuthorized(true);
            if (typeof window !== 'undefined') localStorage.setItem('CNC_ADMIN_SESSION', 'true');
        } else { alert("Mot de passe incorrect"); }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('CNC_ADMIN_SESSION') === 'true') {
            setIsAuthorized(true);
        }
    }, []);

    // --- AUTO CONDITIONS: FETCH CONFIG ---
    const fetchAutoConfig = useCallback(async () => {
        try {
            const res = await fetch('/api/cockpit/auto-check');
            const data = await res.json();
            if (data && !data.error) setAutoConfig(data);
        } catch (e) { console.error('Failed to fetch auto-config', e); }
    }, []);

    useEffect(() => {
        if (isAuthorized) fetchAutoConfig();
    }, [isAuthorized, fetchAutoConfig]);

    // --- AUTO CONDITIONS: SAVE CONFIG ---
    const saveAutoConfig = async () => {
        if (!autoConfig) return;
        setIsSaving(true);
        try {
            await fetch('/api/cockpit/auto-check', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(autoConfig)
            });
            setConditionsSaved(true);
            setTimeout(() => setConditionsSaved(false), 2000);
        } catch (e) { console.error(e); alert('Erreur sauvegarde config'); }
        finally { setIsSaving(false); }
    };

    // --- AUTO CONDITIONS: FORCE CHECK ---
    const forceAutoCheck = async () => {
        setIsChecking(true);
        setCheckResult(null);
        try {
            const res = await fetch('/api/cockpit/auto-check', { method: 'POST' });
            const data = await res.json();
            setCheckResult(data);
            await fetchAutoConfig();
        } catch (e) { console.error(e); setCheckResult({ error: 'Erreur réseau' }); }
        finally { setIsChecking(false); }
    };

    // --- AUTO CONDITIONS: HELPERS ---
    const updateThreshold = (actKey: 'char' | 'nautique' | 'marche', criteria: keyof ActivityThresholds, field: string, value: number) => {
        if (!autoConfig) return;
        const updated = { ...autoConfig };
        const activity = updated.activities[actKey];
        if (!activity.thresholds[criteria]) activity.thresholds[criteria] = {};
        (activity.thresholds[criteria] as any)[field] = value;
        setAutoConfig(updated);
    };

    const updateMessage = (actKey: 'char' | 'nautique' | 'marche', msgKey: keyof ActivityMessages, value: string) => {
        if (!autoConfig) return;
        const updated = { ...autoConfig };
        updated.activities[actKey].messages[msgKey] = value;
        setAutoConfig(updated);
    };

    // Helper to render weather value
    const formatWeatherValue = (val: number | undefined, unit: string) => val !== undefined ? `${Math.round(val)} ${unit}` : '-';

    // --- RENDER HELPERS ---
    const renderThresholdInput = (actKey: 'char' | 'nautique' | 'marche', criteria: keyof ActivityThresholds, field: string, label: string, unit: string) => {
        const val = (autoConfig?.activities[actKey].thresholds[criteria] as any)?.[field];
        return (
            <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{label}</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
                    <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => updateThreshold(actKey, criteria, field, parseFloat(e.target.value))}
                        className="w-full bg-transparent text-xs font-black text-abysse outline-none"
                        placeholder="-"
                    />
                    <span className="text-[9px] font-bold text-slate-400">{unit}</span>
                </div>
            </div>
        );
    };


    // --- HANDLERS: STAGES ---

    // Called when user picks a date in the specialized picker
    const handleStageDateSelect = (dateVal: string) => {
        if (!dateVal) return;
        // Force date to Monday if not already
        const d = new Date(dateVal);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(d.setDate(diff));
        const mondayStr = formatDate(monday);

        setSelectedDate(mondayStr);

        // Check if planning exists for this start date
        const existing = plannings.find(p => p.startDate === mondayStr);
        if (existing) {
            setSelectedStage({ ...existing }); // Clone to edit
        } else {
            // Initialize New Week (Mon-Fri default)
            initNewStage(mondayStr);
        }
    };

    const initNewStage = (startDate: string) => {
        const days = DAYS_STAGES.map((name, i) => ({
            _key: `day-${i}-${Date.now()}`,
            name,
            date: addDays(startDate, i),
            isRaidDay: false,
            raidTarget: 'none' as const,
            miniMousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
            mousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
            initiation: '14h - 17h',
            perfectionnement: '14h - 17h'
        }));

        setSelectedStage({
            _type: 'weeklyPlanning',
            title: `Semaine du ${toFRDate(startDate)}`,
            startDate: startDate,
            endDate: addDays(startDate, 6), // Week covers 7 days technically
            days: days, // Only 5 initially
            isPublished: true
        });
    };

    const toggleDay = (dayIndex: number) => { // 5 = Sat, 6 = Sun
        if (!selectedStage) return;
        const currentDays = [...selectedStage.days];
        const targetDate = addDays(selectedStage.startDate, dayIndex);

        // Check if day exists using date
        const existsIdx = currentDays.findIndex(d => d.date === targetDate);

        if (existsIdx >= 0) {
            // Remove it
            currentDays.splice(existsIdx, 1);
            // Sort by date just in case
            currentDays.sort((a, b) => a.date.localeCompare(b.date));
            setSelectedStage({ ...selectedStage, days: currentDays });
        } else {
            // Add it
            const name = dayIndex === 5 ? "Samedi" : "Dimanche";
            const newDay = {
                _key: `day-ext-${dayIndex}-${Date.now()}`,
                name,
                date: targetDate,
                isRaidDay: false,
                raidTarget: 'none' as const,
                miniMousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
                mousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
                initiation: '14h - 17h',
                perfectionnement: '14h - 17h'
            };

            currentDays.push(newDay);
            currentDays.sort((a, b) => a.date.localeCompare(b.date));
            setSelectedStage({ ...selectedStage, days: currentDays });
        }
    };



    const saveStage = async () => {
        if (!selectedStage) return;
        setIsSaving(true);
        try {
            const doc = { ...selectedStage, _type: 'weeklyPlanning' };
            if (selectedStage._id) await writeClient.createOrReplace({ ...doc, _id: selectedStage._id! });
            else await writeClient.create(doc);

            await refreshData();
            alert("Planning enregistré !");
        } catch (err) { console.error(err); alert("Erreur sauvegarde"); }
        finally { setIsSaving(false); }
    };

    const deleteStage = async () => {
        if (!selectedStage?._id || !confirm("Supprimer ce planning ?")) return;
        setIsSaving(true);
        try {
            await writeClient.delete(selectedStage._id);
            setSelectedStage(null);
            await refreshData();
        } catch (err) { console.error(err); } finally { setIsSaving(false); }
    };


    // --- HANDLERS: CHAR A VOILE ---
    const createNewCharPeriod = () => {
        const today = formatDate(new Date());
        const newPeriod: PlanningCharAVoile = {
            _type: 'planningCharAVoile',
            title: "Nouvelle Période",
            startDate: today,
            endDate: addDays(today, 14),
            weeks: []
        };
        setSelectedCharPeriod(newPeriod);
    };

    const addCharWeek = () => {
        if (!selectedCharPeriod) return;

        // Auto-determine start date based on last week or period start
        let start = selectedCharPeriod.startDate;
        if (selectedCharPeriod.weeks.length > 0) {
            const lastWeek = selectedCharPeriod.weeks[selectedCharPeriod.weeks.length - 1];
            start = addDays(lastWeek.startDate, 7);
        }

        const newWeek: CharWeek = {
            _key: `week-${Date.now()}`,
            title: "Nouvelle Semaine",
            startDate: start,
            endDate: addDays(start, 6),
            days: DAYS_CHAR.map((name, i) => ({
                _key: `cday-${i}-${Date.now()}`,
                name,
                date: addDays(start, i),
                sessions: []
            }))
        };
        setSelectedCharPeriod({
            ...selectedCharPeriod,
            weeks: [...selectedCharPeriod.weeks, newWeek]
        });
    };

    const saveCharPeriod = async () => {
        if (!selectedCharPeriod) return;
        setIsSaving(true);
        try {
            const doc = { ...selectedCharPeriod, _type: 'planningCharAVoile' };
            if (selectedCharPeriod._id) {
                await writeClient.createOrReplace({ ...doc, _id: selectedCharPeriod._id! });
            }
            else await writeClient.create(doc);
            await refreshData();
            alert("Planning Char enregistré !");
        } catch (err) { console.error(err); alert("Erreur sauvegarde"); }
        finally { setIsSaving(false); }
    };

    const deleteCharPeriod = async () => {
        if (!selectedCharPeriod?._id) return;
        if (!confirm("Supprimer cette période ?")) return;
        try {
            await writeClient.delete(selectedCharPeriod._id);
            setSelectedCharPeriod(null);
            await refreshData();
        } catch (err) { console.error(err); }
    }

    // --- HANDLERS: MARCHE AQUATIQUE ---
    const createNewMarchePeriod = () => {
        const today = formatDate(new Date());
        const newPeriod: PlanningMarche = {
            _type: 'planningMarche',
            title: "Nouvelle Période Marche",
            startDate: today,
            endDate: addDays(today, 14),
            weeks: []
        };
        setSelectedMarchePeriod(newPeriod);
    };

    const addMarcheWeek = () => {
        if (!selectedMarchePeriod) return;

        let start = selectedMarchePeriod.startDate;
        if (selectedMarchePeriod.weeks.length > 0) {
            const lastWeek = selectedMarchePeriod.weeks[selectedMarchePeriod.weeks.length - 1];
            start = addDays(lastWeek.startDate, 7);
        }

        const newWeek: CharWeek = {
            _key: `week-m-${Date.now()}`,
            title: "Nouvelle Semaine Marche",
            startDate: start,
            endDate: addDays(start, 6),
            days: DAYS_CHAR.map((name, i) => ({
                _key: `mday-${i}-${Date.now()}`,
                name,
                date: addDays(start, i),
                sessions: []
            }))
        };
        setSelectedMarchePeriod({
            ...selectedMarchePeriod,
            weeks: [...selectedMarchePeriod.weeks, newWeek]
        });
    };

    const saveMarchePeriod = async () => {
        if (!selectedMarchePeriod) return;
        setIsSaving(true);
        try {
            const doc = { ...selectedMarchePeriod, _type: 'planningMarche' };
            if (selectedMarchePeriod._id) {
                await writeClient.createOrReplace({ ...doc, _id: selectedMarchePeriod._id! });
            }
            else await writeClient.create(doc);
            await refreshData();
            alert("Planning Marche enregistré !");
        } catch (err) { console.error(err); alert("Erreur sauvegarde Marche"); }
        finally { setIsSaving(false); }
    };

    const deleteMarchePeriod = async () => {
        if (!selectedMarchePeriod?._id) return;
        if (!confirm("Supprimer cette période ?")) return;
        try {
            await writeClient.delete(selectedMarchePeriod._id);
            setSelectedMarchePeriod(null);
            await refreshData();
        } catch (err) { console.error(err); }
    }


    // --- RENDER LOGIN ---
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-abysse flex items-center justify-center p-6 italic">
                <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl">
                    <h1 className="text-2xl font-black text-abysse uppercase text-center mb-8">Admin CVC</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-center" placeholder="CODE" />
                        <button className="w-full py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all">Accéder</button>
                    </form>
                </div>
            </div>
        );
    }

    // --- RENDER DASHBOARD ---
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 h-20 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-abysse">CNC <span className="text-turquoise">CONTROL</span></h2>
                        <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setActiveTab('STAGES')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STAGES' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Stages</button>
                            <button onClick={() => setActiveTab('CHAR')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CHAR' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Char à Voile</button>
                            <button onClick={() => setActiveTab('MARCHE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MARCHE' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Marche</button>
                            <button onClick={() => setActiveTab('CONDITIONS')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeTab === 'CONDITIONS' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}><Zap size={12} /> Conditions Auto</button>
                        </nav>
                    </div>
                    {isSaving && <span className="text-[10px] font-black text-turquoise animate-pulse uppercase">Sauvegarde...</span>}
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-10">


                {/* TAB: STAGES */}
                {activeTab === 'STAGES' && (
                    <div className="flex flex-col xl:flex-row gap-6">

                        {/* SIDEBAR: LISTING */}
                        <div className="xl:w-72 shrink-0 flex flex-col gap-4">
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                                <h3 className="text-sm font-black uppercase text-abysse mb-3 px-1">Plannings</h3>
                                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(plannings || []).map(p => (
                                        <button
                                            key={p._id}
                                            onClick={() => {
                                                setSelectedDate(p.startDate);
                                                setSelectedStage({ ...p });
                                            }}
                                            className={`w-full text-left p-2.5 rounded-xl transition-all border ${selectedStage?._id === p._id ? 'bg-turquoise/10 border-turquoise/30 text-turquoise shadow-sm' : 'border-transparent hover:bg-slate-50 text-slate-500'}`}
                                        >
                                            <span className="block font-bold text-[11px] uppercase truncate">{p.title}</span>
                                            <span className="block text-[9px] opacity-60">Du {new Date(p.startDate).toLocaleDateString()}</span>
                                        </button>
                                    ))}
                                    {plannings.length === 0 && <p className="text-[10px] text-slate-400 italic text-center py-4">Aucun planning</p>}
                                </div>
                            </div>

                            <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100 italic">
                                <h4 className="font-black text-orange-800 text-[10px] uppercase mb-1">Nouveau Planning</h4>
                                <input
                                    type="date"
                                    value={selectedDate || ''}
                                    onChange={(e) => handleStageDateSelect(e.target.value)}
                                    className="w-full p-2 bg-white border border-orange-200 rounded-lg font-bold text-orange-900 text-xs outline-none focus:ring-2 ring-orange-100"
                                />
                            </div>
                        </div>

                        {/* MAIN EDITOR */}
                        <div className="flex-1 min-w-0">
                            {!selectedStage ? (
                                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                                    <CalendarDays size={40} className="mb-3 opacity-30" />
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Sélectionnez ou créez un planning</p>
                                </div>
                            ) : (
                                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                        <div className="flex-1 space-y-2">
                                            <input type="text" value={selectedStage.title || ''} onChange={(e) => setSelectedStage({ ...selectedStage, title: e.target.value })} className="w-full bg-transparent text-2xl font-black uppercase italic text-abysse outline-none focus:text-turquoise border-b border-transparent focus:border-slate-100" placeholder="Nom de la période..." />
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Du {new Date(selectedStage.startDate).toLocaleDateString()} au {new Date(selectedStage.endDate).toLocaleDateString()}
                                                </span>
                                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-2 py-1 rounded-md border border-slate-100 hover:bg-slate-100 transition-colors">
                                                    <input type="checkbox" checked={selectedStage.isPublished || false} onChange={(e) => setSelectedStage({ ...selectedStage, isPublished: e.target.checked })} className="size-3.5 accent-turquoise -mt-px" />
                                                    <span className="text-[9px] font-black uppercase text-slate-500">En ligne</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {selectedStage._id && <button onClick={deleteStage} className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>}
                                            <button onClick={saveStage} disabled={isSaving} className="px-6 py-3 bg-abysse text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-turquoise transition-all shadow-md flex items-center gap-2"><Save size={16} /> Enregistrer</button>
                                        </div>
                                    </div>

                                    {/* COMPACT TABLE GRID */}
                                    <div className="overflow-x-auto -mx-4 px-4 pb-4">
                                        <div className="min-w-[800px] border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                            {/* HEADER ROW */}
                                            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(120px,1fr))] bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                                                <div className="p-3 font-black text-[10px] uppercase text-slate-400 flex items-center">Groupe / Jour</div>
                                                {selectedStage.days?.map((day, dIdx) => (
                                                    <div key={dIdx} className="p-3 border-l border-slate-100">
                                                        <div className="font-black text-[11px] uppercase text-abysse leading-tight">{day.name}</div>
                                                        <div className="text-[9px] font-bold text-slate-400">{new Date(day.date).getDate()} {new Date(day.date).toLocaleDateString('fr-FR', { month: 'short' })}</div>

                                                        {/* RAID SELECTOR SMALL */}
                                                        <select
                                                            value={day.raidTarget || 'none'}
                                                            onChange={(e) => {
                                                                const nd = [...selectedStage.days];
                                                                nd[dIdx].raidTarget = e.target.value as any;
                                                                nd[dIdx].isRaidDay = e.target.value !== 'none';
                                                                setSelectedStage({ ...selectedStage, days: nd });
                                                            }}
                                                            className={`mt-2 w-full bg-white px-1.5 py-1 rounded text-[9px] font-black uppercase outline-none border transition-colors ${day.raidTarget !== 'none' ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-400'}`}
                                                        >
                                                            <option value="none">Pas de Raid</option>
                                                            <option value="miniMousses">Raid Mini</option>
                                                            <option value="mousses">Raid Moussaillons</option>
                                                            <option value="initiation">Raid Initation</option>
                                                            <option value="perfectionnement">Raid Perf</option>
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* GROUP ROWS */}
                                            {[
                                                { id: 'miniMousses', label: 'Mini-Mousses', color: 'yellow', icon: Sun },
                                                { id: 'mousses', label: 'Moussaillons', color: 'turquoise', icon: Ship },
                                                { id: 'initiation', label: 'Initiation', color: 'blue', icon: Wind },
                                                { id: 'perfectionnement', label: 'Perfectionnement', color: 'purple', icon: Waves }
                                            ].map((group) => (
                                                <div key={group.id} className="grid grid-cols-[180px_repeat(auto-fit,minmax(120px,1fr))] border-b border-slate-50 last:border-0 group">
                                                    <div className="p-3 bg-slate-50/30 flex items-center gap-2 border-r border-slate-50">
                                                        <div className={`p-1.5 rounded-lg bg-${group.color}-50 text-${group.color}-500 shadow-sm`}>
                                                            <group.icon size={14} />
                                                        </div>
                                                        <span className="font-black text-[10px] uppercase tracking-tighter text-slate-600">{group.label}</span>
                                                    </div>

                                                    {selectedStage.days.map((day, dIdx) => {
                                                        const isRaid = day.raidTarget === group.id;

                                                        if (group.id === 'miniMousses' || group.id === 'mousses') {
                                                            const session = (day as any)[group.id];
                                                            return (
                                                                <div key={dIdx} className={`p-2 border-l border-slate-50 space-y-1.5 transition-colors ${isRaid ? 'bg-orange-50/50' : 'hover:bg-slate-50/30'}`}>
                                                                    <div className="flex gap-1">
                                                                        <select
                                                                            value={(session?.time || '').split(' - ')[0]}
                                                                            onChange={(e) => {
                                                                                const nd = [...selectedStage.days];
                                                                                const newRange = calculateTimeRange(e.target.value, 3);
                                                                                (nd[dIdx] as any)[group.id].time = newRange;
                                                                                setSelectedStage({ ...selectedStage, days: nd });
                                                                            }}
                                                                            className="w-16 p-1 bg-white border border-slate-100 rounded text-[9px] font-bold outline-none focus:border-turquoise"
                                                                        >
                                                                            <option value="">Début</option>
                                                                            {START_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                                        </select>
                                                                        <div className="flex gap-0.5">
                                                                            {[2, 3, 4].map(d => (
                                                                                <button
                                                                                    key={d}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const start = (session?.time || '').split(' - ')[0] || "14h00";
                                                                                        const nd = [...selectedStage.days];
                                                                                        (nd[dIdx] as any)[group.id].time = calculateTimeRange(start, d);
                                                                                        setSelectedStage({ ...selectedStage, days: nd });
                                                                                    }}
                                                                                    className={`px-1 rounded text-[8px] font-black transition-colors ${(session?.time || '').includes(` - `) && (parseInt((session?.time || '').split(' - ')[1].split('h')[0]) - parseInt((session?.time || '').split(' - ')[0].split('h')[0]) === d) ? 'bg-turquoise text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                                                >
                                                                                    {d}h
                                                                                </button>
                                                                            ))}
                                                                        </div>

                                                                        <select value={session?.activity || 'optimist'} onChange={(e) => {
                                                                            const nd = [...selectedStage.days]; (nd[dIdx] as any)[group.id].activity = e.target.value; setSelectedStage({ ...selectedStage, days: nd });
                                                                        }} className="flex-1 p-1.5 bg-white border border-slate-100 rounded text-[9px] font-bold outline-none focus:border-turquoise" title="Activité">
                                                                            {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label.split(' / ')[0]}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <input type="text" value={session?.description || ''} onChange={(e) => {
                                                                        const nd = [...selectedStage.days]; (nd[dIdx] as any)[group.id].description = e.target.value; setSelectedStage({ ...selectedStage, days: nd });
                                                                    }} className="w-full p-1.5 bg-white border border-slate-100 rounded text-[9px] outline-none focus:border-turquoise" placeholder="Desc..." title="Description" />
                                                                </div>
                                                            );
                                                        } else {
                                                            const value = (day as any)[group.id];
                                                            return (
                                                                <div key={dIdx} className={`p-2 border-l border-slate-50 transition-colors ${isRaid ? 'bg-orange-50/50' : 'hover:bg-slate-50/30'}`}>
                                                                    <div className="flex flex-col gap-1.5 mt-1">
                                                                        <div className="flex items-center gap-1">
                                                                            <select
                                                                                value={(value || '').split(' - ')[0]}
                                                                                onChange={(e) => {
                                                                                    const nd = [...selectedStage.days];
                                                                                    (nd[dIdx] as any)[group.id] = calculateTimeRange(e.target.value, 3);
                                                                                    setSelectedStage({ ...selectedStage, days: nd });
                                                                                }}
                                                                                className="flex-1 p-1 bg-white border border-slate-100 rounded text-[10px] font-bold outline-none focus:border-turquoise"
                                                                            >
                                                                                <option value="">Début</option>
                                                                                {START_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                                            </select>
                                                                            <div className="flex gap-0.5">
                                                                                {[2, 3, 4].map(d => (
                                                                                    <button
                                                                                        key={d}
                                                                                        onClick={() => {
                                                                                            const start = (value || '').split(' - ')[0] || "14h00";
                                                                                            const nd = [...selectedStage.days];
                                                                                            (nd[dIdx] as any)[group.id] = calculateTimeRange(start, d);
                                                                                            setSelectedStage({ ...selectedStage, days: nd });
                                                                                        }}
                                                                                        className={`px-2 py-1 rounded text-[9px] font-black transition-colors ${(value || '').includes(` - `) && (parseInt((value || '').split(' - ')[1].split('h')[0]) - parseInt((value || '').split(' - ')[0].split('h')[0]) === d) ? 'bg-abysse text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                                                    >
                                                                                        {d}h
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* WEEKEND TOGGLES COMPACT */}
                                    <div className="flex gap-3 justify-center mt-6 pt-6 border-t border-slate-50">
                                        {[5, 6].map(offset => {
                                            const targetDate = addDays(selectedStage.startDate, offset);
                                            const isPresent = selectedStage.days.some(d => d.date === targetDate);
                                            const dayName = offset === 5 ? "Samedi" : "Dimanche";
                                            return (
                                                <button
                                                    key={offset}
                                                    onClick={() => toggleDay(offset)}
                                                    className={`px-4 py-2 rounded-lg border font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${isPresent ? 'bg-red-50 border-red-100 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-turquoise hover:text-turquoise'}`}
                                                >
                                                    {isPresent ? <Trash2 size={12} /> : <Plus size={12} />}
                                                    {isPresent ? `Retirer ${dayName}` : `Ajouter ${dayName}`}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: CHAR A VOILE */}
                {activeTab === 'CHAR' && (
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="lg:w-[320px] shrink-0 space-y-4">
                            <button onClick={createNewCharPeriod} className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-abysse transition-all shadow-md flex items-center justify-center gap-2"><Plus size={18} /> Nouvelle Période</button>
                            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                {(charPlannings || []).map((period) => (
                                    <button key={period._id} onClick={() => setSelectedCharPeriod({ ...period })} className={`w-full p-5 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all ${selectedCharPeriod?._id === period._id ? 'bg-slate-50 border-l-4 border-l-orange-500 pl-4' : ''}`}>
                                        <span className="block font-black text-abysse uppercase tracking-tighter line-clamp-1">{period.title}</span>
                                        <span className="block text-[10px] text-slate-400 mt-1 italic">{new Date(period.startDate).toLocaleDateString()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {selectedCharPeriod && (
                                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200">
                                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-slate-100 pb-10">
                                        <div className="flex-1 space-y-4">
                                            <input type="text" value={selectedCharPeriod.title || ''} onChange={(e) => setSelectedCharPeriod({ ...selectedCharPeriod, title: e.target.value })} className="w-full p-2 bg-transparent text-3xl font-black uppercase italic text-abysse outline-none focus:text-turquoise border-b border-transparent focus:border-slate-200" placeholder="Label Période" />
                                            <div className="flex items-center gap-6">
                                                <input type="date" value={selectedCharPeriod.startDate || ''} onChange={(e) => setSelectedCharPeriod({ ...selectedCharPeriod, startDate: e.target.value })} className="font-bold text-abysse" />
                                                <span className="text-slate-300">-</span>
                                                <input type="date" value={selectedCharPeriod.endDate || ''} onChange={(e) => setSelectedCharPeriod({ ...selectedCharPeriod, endDate: e.target.value })} className="font-bold text-abysse" />
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            {selectedCharPeriod._id && <button onClick={deleteCharPeriod} className="p-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>}
                                            <button onClick={saveCharPeriod} disabled={isSaving} className="px-8 py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-xl flex items-center gap-2"><Save size={20} /> Enregistrer</button>
                                        </div>
                                    </div>

                                    <div className="space-y-16">
                                        {(selectedCharPeriod.weeks || []).map((week, wIdx) => (
                                            <div key={wIdx} className="bg-slate-50 rounded-4xl p-8 border border-slate-100">
                                                <div className="flex flex-col md:flex-row gap-6 mb-8">
                                                    <div className="bg-orange-500 text-white rounded-lg px-3 py-1 text-xs font-black uppercase tracking-widest w-fit">Semaine {wIdx + 1}</div>
                                                    <input type="text" value={week.title} onChange={(e) => {
                                                        const nw = [...selectedCharPeriod.weeks];
                                                        nw[wIdx].title = e.target.value;
                                                        setSelectedCharPeriod({ ...selectedCharPeriod, weeks: nw });
                                                    }} className="flex-1 bg-transparent text-xl font-black italic text-abysse outline-none border-b border-dashed border-slate-300 focus:border-orange-500" placeholder="Label semaine" />

                                                    {/* Date Control for Week */}
                                                    <input type="date" value={week.startDate || ''} onChange={(e) => {
                                                        const newStart = e.target.value;
                                                        const nw = [...selectedCharPeriod.weeks];
                                                        nw[wIdx].startDate = newStart;
                                                        nw[wIdx].endDate = addDays(newStart, 6);
                                                        // Correct days dates
                                                        nw[wIdx].days = nw[wIdx].days.map((d, i) => ({ ...d, date: addDays(newStart, i) }));
                                                        setSelectedCharPeriod({ ...selectedCharPeriod, weeks: nw });
                                                    }} className="font-bold text-abysse bg-transparent" />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {week.days.map((day, dIdx) => (
                                                        <div key={dIdx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="font-black text-sm uppercase text-abysse">{day.name}</span>
                                                                <span className="text-[10px] text-slate-400">{new Date(day.date).getDate()}</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {day.sessions.map((sess, sIdx) => (
                                                                    <div key={sIdx} className="flex gap-2">
                                                                        <input type="text" value={sess.time || ''} onChange={(e) => {
                                                                            const nw = [...selectedCharPeriod.weeks];
                                                                            nw[wIdx].days[dIdx].sessions[sIdx].time = e.target.value;
                                                                            setSelectedCharPeriod({ ...selectedCharPeriod, weeks: nw });
                                                                        }} className="flex-1 bg-slate-50 p-2 rounded text-xs font-bold text-center" />
                                                                        <button onClick={() => {
                                                                            const nw = [...selectedCharPeriod.weeks];
                                                                            nw[wIdx].days[dIdx].sessions.splice(sIdx, 1);
                                                                            setSelectedCharPeriod({ ...selectedCharPeriod, weeks: nw });
                                                                        }} className="text-red-300 hover:text-red-500 px-1"><Trash2 size={12} /></button>
                                                                    </div>
                                                                ))}
                                                                <button onClick={() => {
                                                                    const nw = [...selectedCharPeriod.weeks];
                                                                    nw[wIdx].days[dIdx].sessions.push({ time: "14h - 16h", _key: Date.now().toString() });
                                                                    setSelectedCharPeriod({ ...selectedCharPeriod, weeks: nw });
                                                                }} className="w-full py-2 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase hover:bg-orange-100 transition-colors">+ Session</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <button onClick={addCharWeek} className="w-full py-6 border-2 border-dashed border-slate-300 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                                            <Plus size={20} /> Ajouter une semaine
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: MARCHE AQUATIQUE */}
                {activeTab === 'MARCHE' && (
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="lg:w-[320px] shrink-0 space-y-4">
                            <button onClick={createNewMarchePeriod} className="w-full py-4 bg-turquoise text-white rounded-xl font-black uppercase tracking-widest hover:bg-abysse transition-all shadow-md flex items-center justify-center gap-2"><Plus size={18} /> Nouvelle Période</button>
                            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                {(marchePlannings || []).map((period) => (
                                    <button key={period._id} onClick={() => setSelectedMarchePeriod({ ...period })} className={`w-full p-5 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all ${selectedMarchePeriod?._id === period._id ? 'bg-slate-50 border-l-4 border-l-turquoise pl-4' : ''}`}>
                                        <span className="block font-black text-abysse uppercase tracking-tighter line-clamp-1">{period.title}</span>
                                        <span className="block text-[10px] text-slate-400 mt-1 italic">{new Date(period.startDate).toLocaleDateString()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            {selectedMarchePeriod && (
                                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200">
                                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-slate-100 pb-10">
                                        <div className="flex-1 space-y-4">
                                            <input type="text" value={selectedMarchePeriod.title || ''} onChange={(e) => setSelectedMarchePeriod({ ...selectedMarchePeriod, title: e.target.value })} className="w-full p-2 bg-transparent text-3xl font-black uppercase italic text-abysse outline-none focus:text-turquoise border-b border-transparent focus:border-slate-200" placeholder="Label Période" />
                                            <div className="flex items-center gap-6">
                                                <input type="date" value={selectedMarchePeriod.startDate || ''} onChange={(e) => setSelectedMarchePeriod({ ...selectedMarchePeriod, startDate: e.target.value })} className="font-bold text-abysse" />
                                                <span className="text-slate-300">-</span>
                                                <input type="date" value={selectedMarchePeriod.endDate || ''} onChange={(e) => setSelectedMarchePeriod({ ...selectedMarchePeriod, endDate: e.target.value })} className="font-bold text-abysse" />
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            {selectedMarchePeriod._id && <button onClick={deleteMarchePeriod} className="p-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>}
                                            <button onClick={saveMarchePeriod} disabled={isSaving} className="px-8 py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-xl flex items-center gap-2"><Save size={20} /> Enregistrer</button>
                                        </div>
                                    </div>

                                    <div className="space-y-16">
                                        {(selectedMarchePeriod.weeks || []).map((week: CharWeek, wIdx: number) => (
                                            <div key={wIdx} className="bg-slate-50 rounded-4xl p-8 border border-slate-100">
                                                <div className="flex flex-col md:flex-row gap-6 mb-8">
                                                    <div className="bg-turquoise text-white rounded-lg px-3 py-1 text-xs font-black uppercase tracking-widest w-fit">Semaine {wIdx + 1}</div>
                                                    <input type="text" value={week.title} onChange={(e) => {
                                                        const nw = [...selectedMarchePeriod.weeks];
                                                        nw[wIdx].title = e.target.value;
                                                        setSelectedMarchePeriod({ ...selectedMarchePeriod, weeks: nw });
                                                    }} className="flex-1 bg-transparent text-xl font-black italic text-abysse outline-none border-b border-dashed border-slate-300 focus:border-turquoise" placeholder="Label semaine" />

                                                    {/* Date Control for Week */}
                                                    <input type="date" value={week.startDate || ''} onChange={(e) => {
                                                        const newStart = e.target.value;
                                                        const nw = [...selectedMarchePeriod.weeks];
                                                        nw[wIdx].startDate = newStart;
                                                        nw[wIdx].endDate = addDays(newStart, 6);
                                                        nw[wIdx].days = nw[wIdx].days.map((d: CharDay, i: number) => ({ ...d, date: addDays(newStart, i) }));
                                                        setSelectedMarchePeriod({ ...selectedMarchePeriod, weeks: nw });
                                                    }} className="font-bold text-abysse bg-transparent" />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {week.days.map((day: CharDay, dIdx: number) => (
                                                        <div key={dIdx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="font-black text-sm uppercase text-abysse">{day.name}</span>
                                                                <span className="text-[10px] text-slate-400">{new Date(day.date).getDate()}</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {day.sessions.map((sess: CharSession, sIdx: number) => (
                                                                    <div key={sIdx} className="flex gap-2">
                                                                        <input type="text" value={sess.time || ''} onChange={(e) => {
                                                                            const nw = [...selectedMarchePeriod.weeks];
                                                                            nw[wIdx].days[dIdx].sessions[sIdx].time = e.target.value;
                                                                            setSelectedMarchePeriod({ ...selectedMarchePeriod, weeks: nw });
                                                                        }} className="flex-1 bg-slate-50 p-2 rounded text-xs font-bold text-center" />
                                                                        <button onClick={() => {
                                                                            const nw = [...selectedMarchePeriod.weeks];
                                                                            nw[wIdx].days[dIdx].sessions.splice(sIdx, 1);
                                                                            setSelectedMarchePeriod({ ...selectedMarchePeriod, weeks: nw });
                                                                        }} className="text-red-300 hover:text-red-500 px-1"><Trash2 size={12} /></button>
                                                                    </div>
                                                                ))}
                                                                <button onClick={() => {
                                                                    const nw = [...selectedMarchePeriod.weeks];
                                                                    nw[wIdx].days[dIdx].sessions.push({ time: "09h - 10h", _key: Date.now().toString() });
                                                                    setSelectedMarchePeriod({ ...selectedMarchePeriod, weeks: nw });
                                                                }} className="w-full py-2 bg-turquoise/10 text-turquoise rounded-lg text-[10px] font-black uppercase hover:bg-turquoise/20 transition-colors">+ Session</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <button onClick={addMarcheWeek} className="w-full py-6 border-2 border-dashed border-slate-300 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:border-turquoise hover:text-turquoise hover:bg-turquoise/5 transition-all flex items-center justify-center gap-2">
                                            <Plus size={20} /> Ajouter une semaine
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: CONDITIONS AUTO */}
                {activeTab === 'CONDITIONS' && autoConfig && (
                    <div className="space-y-6 max-w-[1200px]">

                        {/* HEADER PANEL */}
                        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase italic text-abysse tracking-tighter flex items-center gap-3">
                                        <Zap size={24} className="text-turquoise" /> Pilotage Automatique
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                        Évaluation météo multi-critères (Vent, Houle, Orages...)
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {conditionsSaved && <span className="text-[10px] font-black text-emerald-500 uppercase animate-pulse">✓ Sauvegardé</span>}
                                    <button onClick={saveAutoConfig} disabled={isSaving} className="px-6 py-3 bg-abysse text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-turquoise transition-all shadow-md flex items-center gap-2">
                                        <Save size={16} /> Enregistrer
                                    </button>
                                </div>
                            </div>

                            {/* GLOBAL CONTROLS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                                {/* Enable/Disable */}
                                <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100">
                                    <div className={`p-2.5 rounded-xl ${autoConfig.enabled ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-200 text-slate-400'} transition-colors`}>
                                        <Zap size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Système Auto</span>
                                        <span className={`text-sm font-black uppercase ${autoConfig.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {autoConfig.enabled ? 'Activé' : 'Désactivé'}
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={autoConfig.enabled} onChange={(e) => setAutoConfig({ ...autoConfig, enabled: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>

                                {/* Check Hour */}
                                <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100">
                                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500">
                                        <Clock size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Heure du check</span>
                                        <select
                                            value={autoConfig.checkHour}
                                            onChange={(e) => setAutoConfig({ ...autoConfig, checkHour: parseInt(e.target.value) })}
                                            className="mt-1 bg-transparent font-black text-abysse text-sm outline-none cursor-pointer"
                                        >
                                            {Array.from({ length: 24 }, (_, i) => (
                                                <option key={i} value={i}>{i < 10 ? `0${i}` : i}h00</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Manual Override */}
                                <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100">
                                    <div className={`p-2.5 rounded-xl ${autoConfig.manualOverride ? 'bg-amber-50 text-amber-500' : 'bg-slate-200 text-slate-400'} transition-colors`}>
                                        <Shield size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Reprise Manuelle</span>
                                        <span className={`text-sm font-black uppercase ${autoConfig.manualOverride ? 'text-amber-600' : 'text-slate-400'}`}>
                                            {autoConfig.manualOverride ? 'Chef de base' : 'Automatique'}
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={autoConfig.manualOverride} onChange={(e) => setAutoConfig({ ...autoConfig, manualOverride: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* FORCE CHECK + STATUS */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-black uppercase text-abysse tracking-wider flex items-center gap-2">
                                        <RefreshCw size={16} className="text-turquoise" /> Dernier Check
                                    </h4>
                                    {autoConfig.lastCheck ? (
                                        <p className="text-[11px] text-slate-400 font-bold mt-1">
                                            {new Date(autoConfig.lastCheck).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
                                        </p>
                                    ) : (
                                        <p className="text-[11px] text-slate-400 italic mt-1">Aucun check effectué</p>
                                    )}
                                </div>
                                <button
                                    onClick={forceAutoCheck}
                                    disabled={isChecking}
                                    className="px-6 py-3 bg-turquoise text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-abysse transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isChecking ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                                    {isChecking ? 'Analyse en cours...' : 'Forcer le check maintenant'}
                                </button>
                            </div>

                            {/* Check Result Display */}
                            {(checkResult || autoConfig.lastCheckResult) && (
                                <div className="mt-6 space-y-4">
                                    {(checkResult?.weather || autoConfig.lastCheckResult?.weather) && (
                                        <div className="flex flex-wrap gap-2 justify-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            {[
                                                { label: 'Vent (8h-18h)', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).wind, 'nds') },
                                                { label: 'Rafales', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).gusts, 'nds') },
                                                { label: 'Houle', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).waveHeight, 'm') },
                                                { label: 'Période', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).wavePeriod, 's') },
                                                { label: 'Orage (CAPE)', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).cape, '') },
                                                { label: 'Visibilité', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).visibility, 'm') },
                                                { label: 'Eau', val: formatWeatherValue((checkResult?.weather || autoConfig.lastCheckResult?.weather).waterTemp, '°C') },
                                            ].map((m, i) => (
                                                <div key={i} className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-center">
                                                    <span className="block text-[9px] font-black uppercase text-slate-400">{m.label}</span>
                                                    <span className="block text-xs font-black text-abysse">{m.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ACTIVITY CONFIG CARDS - SIMPLIFIED UI */}
                        <div className="space-y-4">
                            {([
                                { key: 'char' as const, label: 'Char à Voile', icon: Wind, color: 'orange' },
                                { key: 'nautique' as const, label: 'Sports Nautiques', icon: Anchor, color: 'blue' },
                                { key: 'marche' as const, label: 'Marche Aquatique', icon: Waves, color: 'turquoise' }
                            ]).map(({ key, label, icon: Icon, color }) => {
                                const activity = autoConfig.activities[key];
                                // Determine current computed status from check result
                                const currentStatus = checkResult?.results?.[key]?.status || autoConfig.lastCheckResult?.[key]?.status || 'UNKNOWN';

                                return (
                                    <div key={key} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${expandedActivity === key ? 'border-turquoise shadow-md ring-1 ring-turquoise/20' : 'border-slate-200 hover:border-turquoise/50'}`}>

                                        {/* HEADER - SUMMARY */}
                                        <div
                                            className="p-5 flex items-center justify-between cursor-pointer"
                                            onClick={() => setExpandedActivity(expandedActivity === key ? null : key)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-500`}>
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black uppercase italic text-abysse tracking-tighter">{label}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {checkResult?.results?.[key] || autoConfig.lastCheckResult?.[key] ? (
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${currentStatus === 'OPEN' ? 'bg-emerald-100 text-emerald-600' :
                                                                currentStatus === 'RESTRICTED' ? 'bg-orange-100 text-orange-600' :
                                                                    checkResult?.results?.[key]?.status === 'CLOSED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                {currentStatus === 'OPEN' ? 'OUVERT' : currentStatus === 'RESTRICTED' ? 'RESTREINT' : 'FERMÉ'}
                                                            </span>
                                                        ) : <span className="text-[10px] text-slate-400">Aucune donnée</span>}

                                                        {/* Show simplified cause if restricted/closed */}
                                                        {((checkResult?.results?.[key]?.causes?.length || 0) > 0 || (autoConfig.lastCheckResult?.[key]?.causes?.length || 0) > 0) && (
                                                            <span className="text-[10px] font-bold text-slate-400">
                                                                via {(checkResult?.results?.[key]?.causes || autoConfig.lastCheckResult?.[key]?.causes || []).join(', ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100" onClick={e => e.stopPropagation()}>
                                                    <span className={`text-[10px] font-black uppercase ${activity.enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {activity.enabled ? 'Actif' : 'Inactif'}
                                                    </span>
                                                    <div className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={activity.enabled} onChange={(e) => {
                                                            const updated = { ...autoConfig };
                                                            updated.activities[key] = { ...activity, enabled: e.target.checked };
                                                            setAutoConfig(updated);
                                                        }} className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-slate-400 hover:text-turquoise transition-colors">
                                                    {expandedActivity === key ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* EXPANDED CONTENT - EDIT MODE */}
                                        {expandedActivity === key && (
                                            <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50">
                                                {/* INSTRUCTION */}
                                                <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                                                    💡 Configurez ici les seuils qui déclenchent automatiquement les statuts <strong>RESTREINT</strong> ou <strong>FERMÉ</strong>.
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    {/* 1. SEUILS METEO */}
                                                    <div className="space-y-6">
                                                        <h5 className="text-xs font-black uppercase text-slate-400 border-b border-slate-200 pb-2 mb-4">Critères d'évaluation</h5>

                                                        {/* WIND */}
                                                        {activity.thresholds.wind && (
                                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                                                    <Wind size={16} className="text-slate-400" />
                                                                    <span className="text-xs font-black uppercase text-abysse">Vent Moyen</span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {renderThresholdInput(key, 'wind', 'closedBelow', 'Fermer si <', 'nds')}
                                                                    {renderThresholdInput(key, 'wind', 'restrictedBelow', 'Restreindre si <', 'nds')}
                                                                    {renderThresholdInput(key, 'wind', 'restrictedAbove', 'Restreindre si >', 'nds')}
                                                                    {renderThresholdInput(key, 'wind', 'closedAbove', 'Fermer si >', 'nds')}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* GUSTS */}
                                                        {activity.thresholds.gusts && (
                                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                                                    <Wind size={16} className="text-slate-400" />
                                                                    <span className="text-xs font-black uppercase text-abysse">Rafales</span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {renderThresholdInput(key, 'gusts', 'restrictedAbove', 'Restreindre si >', 'nds')}
                                                                    {renderThresholdInput(key, 'gusts', 'closedAbove', 'Fermer si >', 'nds')}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* WAVES */}
                                                        {(activity.thresholds.waveHeight || activity.thresholds.wavePeriod) && (
                                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                                                    <Waves size={16} className="text-slate-400" />
                                                                    <span className="text-xs font-black uppercase text-abysse">État de la mer</span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {activity.thresholds.waveHeight && renderThresholdInput(key, 'waveHeight', 'restrictedAbove', 'Restreindre (Houle) >', 'm')}
                                                                    {activity.thresholds.waveHeight && renderThresholdInput(key, 'waveHeight', 'closedAbove', 'Fermer (Houle) >', 'm')}
                                                                    {activity.thresholds.wavePeriod && renderThresholdInput(key, 'wavePeriod', 'restrictedAbove', 'Restreindre (Période) >', 's')}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* SECURITY (CAPE, VISIBILITY, TEMP) */}
                                                        {(activity.thresholds.cape || activity.thresholds.visibility || activity.thresholds.waterTemp) && (
                                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                                                    <AlertTriangle size={16} className="text-slate-400" />
                                                                    <span className="text-xs font-black uppercase text-abysse">Sécurité & Confirmés</span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {activity.thresholds.cape && renderThresholdInput(key, 'cape', 'closedAbove', 'Fermer si Orage (CAPE) >', '')}
                                                                    {activity.thresholds.visibility && renderThresholdInput(key, 'visibility', 'closedBelow', 'Fermer si Visibilité <', 'm')}
                                                                    {activity.thresholds.waterTemp && renderThresholdInput(key, 'waterTemp', 'closedBelow', 'Fermer si Eau <', '°C')}
                                                                    {activity.thresholds.waterTemp && renderThresholdInput(key, 'waterTemp', 'restrictedBelow', 'Restreindre si Eau <', '°C')}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 2. MESSAGES AUTOMATIQUES */}
                                                    <div className="space-y-6">
                                                        <h5 className="text-xs font-black uppercase text-slate-400 border-b border-slate-200 pb-2 mb-4">Messages Automatiques</h5>
                                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                                                            {Object.entries(activity.messages).map(([msgKey, msgVal]) => (
                                                                <div key={msgKey} className="space-y-1">
                                                                    <div className="flex justify-between items-center">
                                                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                                            {msgKey === 'ok' ? '✅ Conditions Idéales (OPEN)' :
                                                                                msgKey === 'storm' ? '⚡ Alerte Orage (CLOSED)' :
                                                                                    msgKey === 'wind_high' ? '💨 Vent Fort (CLOSED)' :
                                                                                        msgKey === 'wind_low' ? '🍃 Vent Faible' :
                                                                                            msgKey === 'waves' ? '🌊 Houle / Vagues' :
                                                                                                msgKey.replace('_', ' ')}
                                                                        </label>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={msgVal as string}
                                                                        onChange={(e) => updateMessage(key, msgKey as any, e.target.value)}
                                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-abysse focus:border-turquoise focus:ring-1 focus:ring-turquoise/20 outline-none transition-all"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
