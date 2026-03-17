"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
    Clock,
    RefreshCw,
    Shield,
    Check,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Play,
    Bell,
    Printer,
    Zap
} from 'lucide-react';
import { Activity, SpotStatus, WeeklyPlanning, PlanningCharAVoile, PlanningMarche, ActivityType, CharWeek, CharDay, CharSession } from '@/types';
import Link from 'next/link';

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

import { useRouter } from 'next/navigation';

interface Props {
    plannings: WeeklyPlanning[];
    charPlannings: PlanningCharAVoile[];
    marchePlannings: PlanningMarche[];
}

export default function AdminClient({ plannings, charPlannings, marchePlannings }: Props) {
    const router = useRouter();
    const refreshData = async () => {
        router.refresh();
    };

    const [activeTab, setActiveTab] = useState<'STAGES' | 'CHAR' | 'MARCHE' | 'VIGIE'>('STAGES');
    const [isSaving, setIsSaving] = useState(false);

    // --- VIGIE STATE ---
    const [vigieMsg, setVigieMsg] = useState({
        title: '',
        content: '',
        category: 'info',
        targetGroups: ['all'],
        isPinned: false,
        externalLink: '',
        expiresAt: '',
    });

    // SELECTORS
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date())); // Selected Monday
    const [selectedStage, setSelectedStage] = useState<WeeklyPlanning | null>(null);
    const [selectedCharPeriod, setSelectedCharPeriod] = useState<PlanningCharAVoile | null>(null);
    const [selectedMarchePeriod, setSelectedMarchePeriod] = useState<PlanningMarche | null>(null);
    const [expandedActivity, setExpandedActivity] = useState<string | null>(null);


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
            mousses: { time: '10h - 13h', activity: 'optimist' as ActivityType, description: '' },
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
                mousses: { time: '10h - 13h', activity: 'optimist' as ActivityType, description: '' },
                initiation: '14h - 17h',
                perfectionnement: '14h - 17h'
            };

            currentDays.push(newDay);
            currentDays.sort((a, b) => a.date.localeCompare(b.date));
            setSelectedStage({ ...selectedStage, days: currentDays });
        }
    };


    const upsertPlanning = async (document: WeeklyPlanning | PlanningCharAVoile | PlanningMarche) => {
        const res = await fetch('/api/cockpit/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'UPSERT_PLANNING',
                document,
                touchTimestamp: true,
            }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(data?.error || 'Erreur sauvegarde planning');
        }

        return data;
    };

    const deletePlanning = async (_id: string) => {
        const res = await fetch('/api/cockpit/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'DELETE_PLANNING',
                _id,
                touchTimestamp: true,
            }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(data?.error || 'Erreur suppression planning');
        }

        return data;
    };

    const saveStage = async () => {
        if (!selectedStage) return;
        setIsSaving(true);
        try {
            const doc = { ...selectedStage, _type: 'weeklyPlanning' as const };
            await upsertPlanning(doc);
            await refreshData();
            alert("Planning enregistré !");
        } catch (err) { console.error(err); alert("Erreur sauvegarde"); }
        finally { setIsSaving(false); }
    };

    const deleteStage = async () => {
        if (!selectedStage?._id || !confirm("Supprimer ce planning ?")) return;
        setIsSaving(true);
        try {
            await deletePlanning(selectedStage._id);
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
            const doc = { ...selectedCharPeriod, _type: 'planningCharAVoile' as const };
            await upsertPlanning(doc);
            await refreshData();
            alert("Planning Char enregistré !");
        } catch (err) { console.error(err); alert("Erreur sauvegarde"); }
        finally { setIsSaving(false); }
    };

    const deleteCharPeriod = async () => {
        if (!selectedCharPeriod?._id) return;
        if (!confirm("Supprimer cette période ?")) return;
        setIsSaving(true);
        try {
            await deletePlanning(selectedCharPeriod._id);
            setSelectedCharPeriod(null);
            await refreshData();
        } catch (err) { console.error(err); } finally { setIsSaving(false); }
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
            const doc = { ...selectedMarchePeriod, _type: 'planningMarche' as const };
            await upsertPlanning(doc);
            await refreshData();
            alert("Planning Marche enregistré !");
        } catch (err) { console.error(err); alert("Erreur sauvegarde Marche"); }
        finally { setIsSaving(false); }
    };

    const deleteMarchePeriod = async () => {
        if (!selectedMarchePeriod?._id) return;
        if (!confirm("Supprimer cette période ?")) return;
        setIsSaving(true);
        try {
            await deletePlanning(selectedMarchePeriod._id);
            setSelectedMarchePeriod(null);
            await refreshData();
        } catch (err) { console.error(err); } finally { setIsSaving(false); }
    }


    // --- VIGIE HANDLERS ---
    const [testPushId, setTestPushId] = useState('');
    const [isTestingPush, setIsTestingPush] = useState(false);

    const handleTestPush = async () => {
        if (!testPushId) return alert("Entrez votre User ID (vu dans la console F12)");
        setIsTestingPush(true);
        try {
            const res = await fetch('/api/cockpit/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'TEST_PUSH',
                    patch: {
                        targetId: testPushId,
                        title: "Test de Liaison Directe",
                        content: "Si vous recevez ceci, la clé API REST et l'App ID sont corrects."
                    }
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Test envoyé ! Vérifiez votre mobile.\nInfo Serveur AppID: ${data.debug?.serverAppId}\nRéponse: ${JSON.stringify(data.response)}`);
            } else {
                alert(`Erreur: ${data.error || 'Inconnue'}\nInfo Debug: ${JSON.stringify(data.debug)}`);
            }
        } catch (e) {
            console.error(e);
            alert("Erreur réseau");
        } finally {
            setIsTestingPush(false);
        }
    };

    const handleSendVigie = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vigieMsg.title || !vigieMsg.content) return alert("Titre et contenu obligatoires");
        setIsSaving(true);
        try {
            const res = await fetch('/api/cockpit/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'CREATE_INFO',
                    patch: {
                        ...vigieMsg,
                        externalLink: vigieMsg.externalLink ? vigieMsg.externalLink : undefined,
                        publishedAt: new Date().toISOString(),
                        expiresAt: vigieMsg.expiresAt ? new Date(vigieMsg.expiresAt).toISOString() : undefined,
                    }
                })
            });
            if (res.ok) {
                alert("Message publié avec succès !");
                setVigieMsg({
                    title: '',
                    content: '',
                    category: 'info',
                    targetGroups: ['all'],
                    isPinned: false,
                    externalLink: '',
                    expiresAt: '',
                });
                refreshData();
            } else {
                alert("Erreur lors de la publication");
            }
        } catch (e) {
            console.error(e);
            alert("Erreur réseau");
        } finally {
            setIsSaving(false);
        }
    };


    // --- RENDER DASHBOARD ---
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            <div className="flex flex-col flex-1">

                {/* HEADER */}
                <header className="bg-white border-b border-slate-200 h-20 sticky top-0 z-50">
                    <div className="max-w-400 mx-auto px-6 h-full flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-abysse">CNC <span className="text-turquoise">CONTROL</span></h2>
                            <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                                <button onClick={() => setActiveTab('STAGES')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STAGES' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Stages</button>
                                <button onClick={() => setActiveTab('CHAR')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CHAR' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Char à Voile</button>
                                <button onClick={() => setActiveTab('MARCHE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'MARCHE' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Marche</button>
<button onClick={() => setActiveTab('VIGIE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeTab === 'VIGIE' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}><Bell size={12} /> Vigie Direct</button>
                                <Link href="/cockpit" target="_blank" className="ml-2 px-4 py-2 rounded-lg bg-turquoise/10 text-turquoise hover:bg-turquoise/20 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5">
                                    🚀 Cockpit
                                </Link>
                            </nav>
                        </div>
                        {isSaving && <span className="text-[10px] font-black text-turquoise animate-pulse uppercase">Sauvegarde...</span>}
                    </div>
                </header>

                <main className="flex-1 w-full max-w-400 mx-auto p-6 md:p-10">
                    {/* (Editor content will stay as is, but now it's inside a no-print parent) */}


                    {/* TAB: STAGES */}
                    {activeTab === 'STAGES' && (
                        <div className="flex flex-col xl:flex-row gap-6">

                            {/* SIDEBAR: LISTING (NO PRINT) */}
                            <div className="xl:w-72 shrink-0 flex flex-col gap-4 no-print">
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                                    <h3 className="text-sm font-black uppercase text-abysse mb-3 px-1">Plannings</h3>
                                    <div className="space-y-1 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
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
                                    <div className="h-full min-h-75 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-4xl bg-white/50">
                                        <CalendarDays size={40} className="mb-3 opacity-30" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">Sélectionnez ou créez un planning</p>
                                    </div>
                                ) : (
                                    <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
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
                                            <div className="flex gap-2 no-print">
                                                {selectedStage && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                const currentMonth = new Date(selectedDate).getMonth();
                                                                const currentYear = new Date(selectedDate).getFullYear();
                                                                const currentMonthIds = plannings
                                                                    .filter(p => {
                                                                        const tempStart = new Date(p.startDate);
                                                                        const tempEnd = new Date(addDays(p.startDate, 4)); // Friday
                                                                        return (tempStart.getMonth() === currentMonth && tempStart.getFullYear() === currentYear) ||
                                                                            (tempEnd.getMonth() === currentMonth && tempEnd.getFullYear() === currentYear);
                                                                    })
                                                                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                                                    .map(p => p._id)
                                                                    .filter(id => id !== undefined);

                                                                if (currentMonthIds.length > 0) {
                                                                    window.open(`/print/multi?type=stages&ids=${currentMonthIds.join(',')}`, '_blank');
                                                                } else {
                                                                    alert("Aucun planning trouvé pour ce mois.");
                                                                }
                                                            }}
                                                            className="px-6 py-3 bg-turquoise/10 text-turquoise-700 border border-turquoise/20 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-turquoise/20 transition-all shadow-sm flex items-center gap-2"
                                                            title="Imprimer tout le mois"
                                                        >
                                                            <Printer size={16} /> Le Mois
                                                        </button>
                                                        <button
                                                            onClick={() => window.open(`/print/stages/${selectedStage._id}`, '_blank')}
                                                            className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                                                            title="Imprimer cette semaine"
                                                        >
                                                            <Printer size={16} /> Semaine
                                                        </button>
                                                    </>
                                                )}
                                                {selectedStage._id && <button onClick={deleteStage} className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>}
                                                <button onClick={saveStage} disabled={isSaving} className="px-6 py-3 bg-abysse text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-turquoise transition-all shadow-md flex items-center gap-2"><Save size={16} /> Enregistrer</button>
                                            </div>
                                        </div>

                                        {/* COMPACT TABLE GRID */}
                                        <div className="overflow-x-auto -mx-4 px-4 pb-4">
                                            <div className="min-w-200 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
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
                                                                                    const defaultDur = group.id === 'miniMousses' ? 2 : 3;
                                                                                    const newRange = calculateTimeRange(e.target.value, defaultDur);
                                                                                    (nd[dIdx] as any)[group.id].time = newRange;
                                                                                    setSelectedStage({ ...selectedStage, days: nd });
                                                                                }}
                                                                                className="w-16 p-1 bg-white border border-slate-100 rounded text-[9px] font-bold outline-none focus:border-turquoise"
                                                                            >
                                                                                <option value="">Début</option>
                                                                                {START_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                                            </select>
                                                                            <select
                                                                                value={(() => {
                                                                                    const parts = (session?.time || '').split(' - ');
                                                                                    if (parts.length < 2) return group.id === 'miniMousses' ? '2' : '3';
                                                                                    return String(parseInt(parts[1].split('h')[0]) - parseInt(parts[0].split('h')[0]));
                                                                                })()}
                                                                                onChange={(e) => {
                                                                                    const start = (session?.time || '').split(' - ')[0] || '14h00';
                                                                                    const nd = [...selectedStage.days];
                                                                                    (nd[dIdx] as any)[group.id].time = calculateTimeRange(start, parseInt(e.target.value));
                                                                                    setSelectedStage({ ...selectedStage, days: nd });
                                                                                }}
                                                                                className="w-12 p-1 bg-turquoise/10 border border-turquoise/20 rounded text-[9px] font-black text-turquoise-700 outline-none focus:border-turquoise"
                                                                            >
                                                                                {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d}h</option>)}
                                                                            </select>

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
                                                                                <select
                                                                                    value={(() => {
                                                                                        const parts = (value || '').split(' - ');
                                                                                        if (parts.length < 2) return '3';
                                                                                        return String(parseInt(parts[1].split('h')[0]) - parseInt(parts[0].split('h')[0]));
                                                                                    })()}
                                                                                    onChange={(e) => {
                                                                                        const start = (value || '').split(' - ')[0] || '14h00';
                                                                                        const nd = [...selectedStage.days];
                                                                                        (nd[dIdx] as any)[group.id] = calculateTimeRange(start, parseInt(e.target.value));
                                                                                        setSelectedStage({ ...selectedStage, days: nd });
                                                                                    }}
                                                                                    className="w-12 p-1 bg-abysse/10 border border-abysse/20 rounded text-[9px] font-black text-abysse outline-none focus:border-abysse"
                                                                                >
                                                                                    {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d}h</option>)}
                                                                                </select>
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
                            <div className="lg:w-80 shrink-0 space-y-4 no-print">
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
                                            <div className="flex items-start gap-4 no-print">
                                                {selectedCharPeriod && <button onClick={() => window.open(`/print/char/${selectedCharPeriod._id}`, '_blank')} className="px-6 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-md flex items-center gap-2"><Printer size={20} /> Imprimer</button>}
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
                            <div className="lg:w-80 shrink-0 space-y-4 no-print">
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
                                            <div className="flex items-start gap-4 no-print">
                                                {selectedMarchePeriod && <button onClick={() => window.open(`/print/marche/${selectedMarchePeriod._id}`, '_blank')} className="px-6 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-md flex items-center gap-2"><Printer size={20} /> Imprimer</button>}
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
                    {/* TAB: VIGIE DIRECT */}
                    {activeTab === 'VIGIE' && (
                        <div className="max-w-2xl mx-auto no-print">
                            <div className="bg-white p-8 md:p-12 rounded-4xl shadow-xl border border-slate-200">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-turquoise/10 text-turquoise rounded-2xl">
                                        <Bell size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic text-abysse tracking-tighter">Vigie Direct</h3>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Diffuser une info ou une alerte en temps réel</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSendVigie} className="space-y-8">
                                    <div className="space-y-6">
                                        {/* Titre */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Titre du Message</label>
                                            <input
                                                type="text"
                                                value={vigieMsg.title}
                                                onChange={(e) => setVigieMsg({ ...vigieMsg, title: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-turquoise focus:ring-4 ring-turquoise/5 font-bold text-abysse transition-all"
                                                placeholder="Ex: Alerte Vent Fort"
                                            />
                                        </div>

                                        {/* Contenu */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Contenu</label>
                                            <textarea
                                                rows={4}
                                                value={vigieMsg.content}
                                                onChange={(e) => setVigieMsg({ ...vigieMsg, content: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-turquoise focus:ring-4 ring-turquoise/5 font-medium text-abysse transition-all"
                                                placeholder="Décrivez l'info ou l'alerte..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Catégorie */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Catégorie</label>
                                                <select
                                                    value={vigieMsg.category}
                                                    onChange={(e) => setVigieMsg({ ...vigieMsg, category: e.target.value })}
                                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-turquoise font-bold text-abysse appearance-none"
                                                >
                                                    <option value="info">ℹ️ Information</option>
                                                    <option value="alert">🚨 Alerte / Urgent</option>
                                                    <option value="weather">🌦️ Météo / Conditions</option>
                                                    <option value="event">🎉 Événement</option>
                                                    <option value="vibe">🤙 Ambiance / Vie du Club</option>
                                                </select>
                                            </div>

                                            {/* Lien Externe */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Lien (Optionnel)</label>
                                                <input
                                                    type="url"
                                                    value={vigieMsg.externalLink}
                                                    onChange={(e) => setVigieMsg({ ...vigieMsg, externalLink: e.target.value })}
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-turquoise font-medium text-abysse"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        {/* Groupes Cibles */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Groupes Ciblés</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'all', label: 'Tout le club' },
                                                    { id: 'stage-minimousses', label: 'Mini-Mousses' },
                                                    { id: 'stage-moussaillons', label: 'Moussaillons' },
                                                    { id: 'stage-initiation', label: 'Initiation' },
                                                    { id: 'stage-perfectionnement', label: 'Perf' },
                                                    { id: 'club-sportif', label: 'Club Sportif' },
                                                    { id: 'char-voile', label: 'Char à Voile' },
                                                    { id: 'glisses', label: 'Glisses' },
                                                ].map(group => (
                                                    <label key={group.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${vigieMsg.targetGroups.includes(group.id) ? 'bg-turquoise/5 border-turquoise/30 text-abysse' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={vigieMsg.targetGroups.includes(group.id)}
                                                            onChange={(e) => {
                                                                const newGroups = e.target.checked
                                                                    ? [...vigieMsg.targetGroups, group.id]
                                                                    : vigieMsg.targetGroups.filter(id => id !== group.id);
                                                                setVigieMsg({ ...vigieMsg, targetGroups: newGroups });
                                                            }}
                                                            className="size-4 accent-turquoise"
                                                        />
                                                        <span className="text-[10px] font-black uppercase tracking-tight">{group.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expiration */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Expiration (Optionnel)</label>
                                            <input
                                                type="datetime-local"
                                                value={vigieMsg.expiresAt}
                                                onChange={(e) => setVigieMsg({ ...vigieMsg, expiresAt: e.target.value })}
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-turquoise font-medium text-abysse"
                                            />
                                            <p className="text-[9px] text-slate-400 px-1">
                                                Laisser vide = auto ·
                                                {vigieMsg.category === 'info' || vigieMsg.category === 'event' ? ' 30 jours (Info/Événement)' : ' 7 jours (Alerte/Météo/Vibe)'}
                                            </p>
                                        </div>

                                        {/* Toggles */}
                                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                                            <label className={`flex-1 flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${vigieMsg.isPinned ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                                <div className="flex items-center gap-3">
                                                    <Anchor size={18} className={vigieMsg.isPinned ? 'text-amber-500' : 'text-slate-400'} />
                                                    <span className={`text-[11px] font-black uppercase ${vigieMsg.isPinned ? 'text-amber-700' : 'text-slate-500'}`}>Épingler en haut</span>
                                                </div>
                                                <input type="checkbox" checked={vigieMsg.isPinned} onChange={e => setVigieMsg({ ...vigieMsg, isPinned: e.target.checked })} className="size-5 accent-amber-500" />
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-5 bg-abysse text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-turquoise transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                                        Publier le message sur La Vigie
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
