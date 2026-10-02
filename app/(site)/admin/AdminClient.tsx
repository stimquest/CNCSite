"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import {
    Save,
    Trash2,
    Plus,
    CalendarDays,
    Waves,
    Wind,
    Sun,
    Ship,
    Clock,
    Shield,
    Check,
    AlertTriangle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Play,
    Bell,
    Printer,
    Zap,
    Copy,
    Monitor,
} from 'lucide-react';
import { Activity, SpotStatus, WeeklyPlanning, PlanningCharAVoile, PlanningMarche, ActivityType, CharWeek, CharDay, CharSession, StageDefinition, StageSlot } from '@/types';
import { CharSessionDoc } from '@/types';
import Link from 'next/link';
import CharBookingAdmin from '@/components/admin/CharBookingAdmin';
import ControlDashboard, { type ControlTab, type CharMode, type ControlAction } from '@/components/admin/ControlDashboard';

import CockpitClient from '@/components/admin/CockpitClient';
import VigieClient from '@/components/admin/VigieClient';
import FrenchWeekDatePicker from '@/components/admin/FrenchWeekDatePicker';
import StagePlanningGrid from '@/components/admin/StagePlanningGrid';
import ArticleManager from './ArticleEditor';
import SchoolStagesEditor from '@/components/admin/SchoolStagesEditor';
import ActivityPricingManager from '@/components/admin/ActivityPricingManager';
import ShopManager from '@/components/admin/ShopManager';
import SignageManager from '@/components/admin/SignageManager';
import adminStyles from './AdminClient.module.css';
import { parisToday } from '@/lib/editorial';

// --- CONSTANTS ---
const ACTIVITY_OPTIONS: { label: string, value: ActivityType }[] = [
    { label: 'Piscine / Cerf-volant', value: 'piscine' },
    { label: 'Optimist', value: 'optimist' },
    { label: 'Catamaran', value: 'catamaran' },
    { label: 'Paddle / Kayak', value: 'paddle' },
    { label: 'Char à voile', value: 'char' },
    { label: 'Planche à voile', value: 'planche' },
    { label: 'Kite', value: 'kite' },
    { label: 'Multiglisse', value: 'multiglisse' },
];

const DAYS_STAGES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const DAYS_CHAR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// --- UTILS ---
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const getWeekMondayDate = (date = new Date()) => {
    const monday = new Date(date);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
    return formatDate(monday);
};
const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return formatDate(d);
};
// Helper to get formatted date for local display
const toFRDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

// Normalise un horaire du type "10h - 12h" -> "10h00 - 12h00" pour compat dropdown.
// Gère aussi les formats déjà corrects et les minutes non padées ("9h5" -> "09h05").
const normalizeTimePiece = (s: string): string => {
    const trimmed = s.trim();
    const m = trimmed.match(/^(\d+)h(\d*)$/);
    if (!m) return trimmed;
    const h = parseInt(m[1]);
    const min = (m[2] || '00').padStart(2, '0');
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}h${min}`;
};
const normalizeTimeFormat = (time: string | undefined): string => {
    if (!time) return '';
    if (time.includes(' - ')) {
        const [start, end] = time.split(' - ');
        return `${normalizeTimePiece(start)} - ${normalizeTimePiece(end)}`;
    }
    return normalizeTimePiece(time);
};
const normalizeWeeklyPlanning = (p: WeeklyPlanning): WeeklyPlanning => ({
    ...p,
    days: (p.days || []).map(day => ({
        ...day,
        stageSlots: (day.stageSlots || []).map(slot => ({
            ...slot,
            time: normalizeTimeFormat(slot.time),
        })),
    })),
});
import { useRouter } from 'next/navigation';

interface InfoMessage {
    _id: string;
    title: string;
    content: string;
    category: string;
    isPinned: boolean;
    targetGroups: string[];
    externalLink?: string;
    publishedAt: string;
    expiresAt?: string;
}

interface Props {
    plannings: WeeklyPlanning[];
    marchePlannings: PlanningMarche[];
    charSessions: CharSessionDoc[];
    articles: any[];
    infoMessages: InfoMessage[];
    merchItems: any[];
    occazItems: any[];
    signageSlides: any[];
}

export default function AdminClient({ plannings, marchePlannings, charSessions, articles, infoMessages, merchItems, occazItems, signageSlides }: Props) {
    const router = useRouter();
    const refreshData = async () => {
        router.refresh();
    };

    const { stageDefinitions } = useLiveStatus();

    const [activeTab, setActiveTab] = useState<ControlTab>('HOME');
    const [openNavMenu, setOpenNavMenu] = useState<'activities' | 'communication' | null>(null);
    const controlNavRef = useRef<HTMLElement>(null);
    const navCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [charInitialMode, setCharInitialMode] = useState<CharMode>('reserve');
    const [charInitialSessionId, setCharInitialSessionId] = useState<string | undefined>();
    const [charInitialBookingId, setCharInitialBookingId] = useState<string | undefined>();
    const [charInitialDate, setCharInitialDate] = useState<string | undefined>();
    const [dashboardAction, setDashboardAction] = useState<ControlAction | null>(null);
    const [cockpitDirty, setCockpitDirty] = useState(false);
    // Quitter le Cockpit avec des modifications non publiées : on demande confirmation (le brouillon est alors abandonné).
    const goTab = (tab: typeof activeTab) => {
        if (tab !== activeTab && activeTab === 'COCKPIT' && cockpitDirty && !window.confirm('Des modifications ne sont pas publiées. Quitter sans les publier ?')) return;
        setDashboardAction(null);
        setActiveTab(tab);
    };
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingArticle, setIsEditingArticle] = useState(false);

    useEffect(() => {
        if (!openNavMenu) return;

        const clearCloseTimer = () => {
            if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
            navCloseTimerRef.current = null;
        };
        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!controlNavRef.current?.contains(event.target as Node)) {
                clearCloseTimer();
                setOpenNavMenu(null);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            const trigger = controlNavRef.current?.querySelector<HTMLElement>(`[data-menu-trigger="${openNavMenu}"]`);
            clearCloseTimer();
            setOpenNavMenu(null);
            requestAnimationFrame(() => trigger?.focus());
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
            if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
            navCloseTimerRef.current = null;
        };
    }, [openNavMenu]);

    const handleMenuPointerEnter = (event: React.PointerEvent<HTMLElement>, menu: 'activities' | 'communication') => {
        if (event.pointerType !== 'mouse') return;
        if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
        navCloseTimerRef.current = null;
        setOpenNavMenu(menu);
    };

    const handleMenuPointerLeave = (event: React.PointerEvent<HTMLElement>, menu: 'activities' | 'communication') => {
        if (event.pointerType !== 'mouse') return;
        if (navCloseTimerRef.current) clearTimeout(navCloseTimerRef.current);
        navCloseTimerRef.current = setTimeout(() => {
            setOpenNavMenu(current => current === menu ? null : current);
            navCloseTimerRef.current = null;
        }, 220);
    };

    const handleMenuTrigger = (event: React.MouseEvent<HTMLElement>, menu: 'activities' | 'communication') => {
        event.preventDefault();
        const keyboardActivation = event.detail === 0;
        const hoverDevice = window.matchMedia('(hover: hover)').matches;
        if (hoverDevice && !keyboardActivation) {
            setOpenNavMenu(menu);
            return;
        }
        setOpenNavMenu(current => current === menu ? null : menu);
    };

    // SELECTORS
    const currentWeekStart = getWeekMondayDate();
    const [selectedDate, setSelectedDate] = useState<string>(currentWeekStart);
    const [selectedStage, setSelectedStage] = useState<WeeklyPlanning | null>(() => {
        const currentWeek = plannings.find(planning => planning.startDate === currentWeekStart);
        return currentWeek ? normalizeWeeklyPlanning(currentWeek) : null;
    });

    const [selectedMarchePeriod, setSelectedMarchePeriod] = useState<PlanningMarche | null>(null);
    const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

    const openDashboardTool = (tab: ControlTab, mode: CharMode = 'reserve', planning?: WeeklyPlanning, sessionId?: string, bookingId?: string, date?: string) => {
        if (tab === 'CHAR') { setCharInitialMode(mode); setCharInitialSessionId(sessionId); setCharInitialBookingId(bookingId); setCharInitialDate(date); }
        if (planning) { setSelectedDate(planning.startDate); setSelectedStage(normalizeWeeklyPlanning(planning)); }
        goTab(tab);
        window.scrollTo({ top: 0, behavior: 'auto' });
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
            setSelectedStage(normalizeWeeklyPlanning(existing));
        } else {
            // Initialize New Week (Mon-Fri default)
            initNewStage(mondayStr);
        }
    };

    // Ne pas pré-créer de slots : ils seront créés à la volée par updateSlot()
    // uniquement pour les stages auxquels l'admin renseigne réellement un horaire.
    const buildDefaultSlots = (): StageSlot[] => [];

    const initNewStage = (startDate: string) => {
        const days = DAYS_STAGES.map((name, i) => ({
            _key: `day-${i}-${Date.now()}`,
            name,
            date: addDays(startDate, i),
            isRaidDay: false,
            raidStageKey: '',
            stageSlots: buildDefaultSlots()
        }));

        setSelectedStage({
            _type: 'weeklyPlanning',
            title: `Semaine du ${toFRDate(startDate)}`,
            startDate: startDate,
            endDate: addDays(startDate, 6),
            days: days,
            isPublished: false
        });
    };

    const previousStageForCopy = selectedStage && !selectedStage._id
        ? [...plannings]
            .filter(planning => planning.startDate < selectedStage.startDate)
            .sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
        : undefined;

    const copyPreviousStage = () => {
        if (!selectedStage || selectedStage._id || !previousStageForCopy) return;
        const previousStart = Date.parse(`${previousStageForCopy.startDate}T00:00:00Z`);
        const copiedDays = (previousStageForCopy.days || []).map((day, index) => {
            const offset = Math.round((Date.parse(`${day.date}T00:00:00Z`) - previousStart) / 86400000);
            return {
                ...day,
                _key: `day-copy-${index}-${Date.now()}`,
                date: addDays(selectedStage.startDate, offset),
                stageSlots: (day.stageSlots || []).map((slot, slotIndex) => ({
                    ...slot,
                    _key: `slot-copy-${index}-${slotIndex}-${Date.now()}`,
                })),
            };
        });

        setSelectedStage({
            ...selectedStage,
            title: `Semaine du ${toFRDate(selectedStage.startDate)}`,
            endDate: addDays(selectedStage.startDate, 6),
            days: copiedDays,
            isPublished: false,
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
                raidStageKey: '',
                stageSlots: buildDefaultSlots()
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

    const clearAllSlots = () => {
        if (!selectedStage) return;
        if (!confirm("Vider TOUS les créneaux de cette semaine ? (irréversible avant sauvegarde)")) return;
        const clearedDays = selectedStage.days.map(day => ({ ...day, stageSlots: [] }));
        setSelectedStage({ ...selectedStage, days: clearedDays });
    };

    const saveStage = async () => {
        if (!selectedStage) return;
        setIsSaving(true);
        try {
            // Nettoyage : on ne garde QUE les slots avec un horaire réel
            const cleanedDays = selectedStage.days.map(day => ({
                ...day,
                stageSlots: (day.stageSlots || []).filter(s => typeof s.time === 'string' && s.time.trim() !== ''),
            }));

            // --- DIAGNOSTIC : voir exactement ce qui part dans Sanity ---
            console.log('[SAVE] Slots envoyés à Sanity :');
            cleanedDays.forEach(day => {
                console.log(`  ${day.name}:`, day.stageSlots.map(s => `${s.stageKey}=${s.time}`).join(', ') || '(vide)');
            });
            // --- FIN DIAGNOSTIC ---

            const doc = { ...selectedStage, days: cleanedDays, _type: 'weeklyPlanning' as const };
            const saved = await upsertPlanning(doc);
            setSelectedStage({ ...doc, _id: saved.id });
            await refreshData();
            alert("Planning enregistré !");
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? `Erreur sauvegarde : ${err.message}` : "Erreur sauvegarde");
        }
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


    // --- HANDLERS: MARCHE AQUATIQUE ---
    const createNewMarchePeriod = () => {
        const today = parisToday();
        const newPeriod: PlanningMarche = {
            _type: 'planningMarche',
            title: "Nouvelle Période Marche",
            startDate: today,
            endDate: addDays(today, 14),
            weeks: []
        };
        setSelectedMarchePeriod(newPeriod);
    };

    const runDashboardAction = (action: ControlAction) => {
        const destinations: Record<ControlAction, ControlTab> = {
            'take-call': 'CHAR', 'new-session': 'CHAR', 'new-stage-week': 'STAGES',
            'new-message': 'DASHBOARD', 'new-article': 'AGENDA', 'new-event': 'AGENDA',
            'new-slide': 'SIGNAGE', 'new-marche-period': 'MARCHE',
        };
        openDashboardTool(destinations[action], action === 'new-session' ? 'plan' : 'reserve');
        setDashboardAction(action);
        if (action === 'new-stage-week') {
            let startDate = getWeekMondayDate();
            while (plannings.some(planning => planning.startDate === startDate)) startDate = addDays(startDate, 7);
            setSelectedDate(startDate); initNewStage(startDate);
        }
        if (action === 'new-marche-period') createNewMarchePeriod();
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


    // --- TEST PUSH ---
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

    // --- RENDER DASHBOARD ---
    return (
        <div className={`${adminStyles.root} min-h-screen bg-slate-100 flex flex-col font-sans`}>
            <div className="flex flex-col flex-1">

                {/* HEADER */}
                <header className="bg-white border-b border-slate-200 sticky top-16 z-40 py-3 md:py-0 md:h-20">
                    <div className="max-w-400 mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 w-full">
                            <div className="flex items-center justify-between w-full md:w-auto shrink-0">
                                <h2 data-dashboard-display className="text-xl md:text-2xl font-black uppercase tracking-tighter text-abysse">CNC <span className="text-turquoise">CONTROL</span></h2>
                                {isSaving && <span className="text-[10px] font-black text-turquoise animate-pulse uppercase md:hidden">Sauvegarde...</span>}
                            </div>
                            <nav ref={controlNavRef} className={adminStyles.controlNav} aria-label="Navigation CNC Control">
                                <button onClick={() => { setOpenNavMenu(null); goTab('HOME'); }} className={`${adminStyles.navItem} ${activeTab === 'HOME' ? adminStyles.navActive : ''}`}><Monitor size={14} /> Tableau de bord</button>
                                <button onClick={() => { setOpenNavMenu(null); goTab('COCKPIT'); }} className={`${adminStyles.navItem} ${adminStyles.navCockpit} ${activeTab === 'COCKPIT' ? adminStyles.navCockpitActive : ''}`}><Zap size={14} /> Cockpit</button>
                                <button onClick={() => { setOpenNavMenu(null); setCharInitialMode('reserve'); setCharInitialSessionId(undefined); setCharInitialBookingId(undefined); setCharInitialDate(undefined); goTab('CHAR'); }} className={`${adminStyles.navItem} ${activeTab === 'CHAR' ? adminStyles.navActive : ''}`}><Ship size={14} /> Réservations char</button>

                                <details className={adminStyles.navGroup} open={openNavMenu === 'activities'} onPointerEnter={event => handleMenuPointerEnter(event, 'activities')} onPointerLeave={event => handleMenuPointerLeave(event, 'activities')}>
                                    <summary data-menu-trigger="activities" aria-expanded={openNavMenu === 'activities'} onClick={event => handleMenuTrigger(event, 'activities')} className={`${adminStyles.navSummary} ${['STAGES', 'FICHES', 'PRICING', 'MARCHE'].includes(activeTab) ? adminStyles.navParentActive : ''}`}>
                                        <Waves size={14} />
                                        <span>{activeTab === 'STAGES' ? 'Activités · Stages' : activeTab === 'FICHES' ? 'Activités · Fiches' : activeTab === 'PRICING' ? 'Activités · Tarifs' : activeTab === 'MARCHE' ? 'Activités · Marche' : 'Activités'}</span>
                                        <ChevronDown size={13} className={adminStyles.navChevron} />
                                    </summary>
                                    <div onPointerEnter={event => handleMenuPointerEnter(event, 'activities')} className={adminStyles.navMenu}>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('STAGES'); }} className={activeTab === 'STAGES' ? adminStyles.navSubActive : ''}><strong>Planning des stages</strong><small>Organiser les semaines et créneaux</small></button>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('FICHES'); }} className={activeTab === 'FICHES' ? adminStyles.navSubActive : ''}><strong>Fiches stages</strong><small>Gérer les contenus de présentation</small></button>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('PRICING'); }} className={activeTab === 'PRICING' ? adminStyles.navSubActive : ''}><strong>Activités & tarifs</strong><small>Contrôler les montants affichés</small></button>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('MARCHE'); }} className={activeTab === 'MARCHE' ? adminStyles.navSubActive : ''}><strong>Marche aquatique</strong><small>Planning et séances</small></button>
                                    </div>
                                </details>

                                <details className={adminStyles.navGroup} open={openNavMenu === 'communication'} onPointerEnter={event => handleMenuPointerEnter(event, 'communication')} onPointerLeave={event => handleMenuPointerLeave(event, 'communication')}>
                                    <summary data-menu-trigger="communication" aria-expanded={openNavMenu === 'communication'} onClick={event => handleMenuTrigger(event, 'communication')} className={`${adminStyles.navSummary} ${['DASHBOARD', 'AGENDA', 'SIGNAGE'].includes(activeTab) ? adminStyles.navParentActive : ''}`}>
                                        <Bell size={14} />
                                        <span>{activeTab === 'DASHBOARD' ? 'Communication · Vigie' : activeTab === 'AGENDA' ? 'Communication · Agenda' : activeTab === 'SIGNAGE' ? 'Communication · Écran' : 'Communication'}</span>
                                        <ChevronDown size={13} className={adminStyles.navChevron} />
                                    </summary>
                                    <div onPointerEnter={event => handleMenuPointerEnter(event, 'communication')} className={`${adminStyles.navMenu} ${adminStyles.navMenuRight}`}>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('DASHBOARD'); }} className={activeTab === 'DASHBOARD' ? adminStyles.navSubActive : ''}><strong>Vigie</strong><small>Messages et informations prioritaires</small></button>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('AGENDA'); }} className={activeTab === 'AGENDA' ? adminStyles.navSubActive : ''}><strong>Blog & Agenda</strong><small>Articles et événements</small></button>
                                        <button onClick={() => { setOpenNavMenu(null); goTab('SIGNAGE'); }} className={activeTab === 'SIGNAGE' ? adminStyles.navSubActive : ''}><strong>Écran</strong><small>Diapositives diffusées au club</small></button>
                                    </div>
                                </details>
                            </nav>
                        </div>
                        {isSaving && <span className="hidden md:block text-[10px] font-black text-turquoise animate-pulse uppercase shrink-0 ml-4">Sauvegarde...</span>}
                    </div>
                </header>

                <main className="flex-1 w-full max-w-400 mx-auto px-4 md:px-6 py-6 md:py-8">
                    {activeTab === 'HOME' && <ControlDashboard plannings={plannings} marchePlannings={marchePlannings} sessions={charSessions} messages={infoMessages} articles={articles} slides={signageSlides} onNavigate={openDashboardTool} onRefresh={refreshData} onAction={runDashboardAction} />}
                    {/* (Editor content will stay as is, but now it's inside a no-print parent) */}

                    {/* TAB: COCKPIT */}
                    {activeTab === 'COCKPIT' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <CockpitClient onDirtyChange={setCockpitDirty} />
                        </div>
                    )}


                    {/* TAB: STAGES */}
                    {activeTab === 'STAGES' && <header data-admin-page-header><h2 data-admin-page-title>Planning des stages</h2></header>}
                    {activeTab === 'STAGES' && (
                        <div className="flex flex-col xl:flex-row gap-6">

                            {/* SIDEBAR: LISTING (NO PRINT) */}
                            <div className="xl:w-72 shrink-0 flex flex-col gap-4 no-print">
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                                    <h3 className="text-sm font-black uppercase text-abysse mb-3 px-1">Plannings</h3>
                                    <div className="space-y-1 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                                        {[...(plannings || [])].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(p => (
                                            <button
                                                key={p._id}
                                                onClick={() => {
                                                    setSelectedDate(p.startDate);
                                                    setSelectedStage(normalizeWeeklyPlanning(p));
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
                                    <h4 className="font-black text-orange-800 text-[10px] uppercase mb-3">Nouveau planning</h4>
                                    <FrenchWeekDatePicker value={selectedDate} onChange={handleStageDateSelect} />
                                    {previousStageForCopy && (
                                        <button
                                            onClick={copyPreviousStage}
                                            className="mt-3 w-full py-2.5 px-3 bg-white border border-orange-200 rounded-lg text-orange-800 text-[10px] font-black uppercase tracking-wide hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Copy size={13} /> Reprendre les horaires précédents
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* MAIN EDITOR */}
                            <div className="flex-1 min-w-0">
                                {!selectedStage ? (
                                    <div className="h-full min-h-75 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-4xl bg-white/50">
                                        <CalendarDays size={40} className="mb-3 opacity-30" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">Aucun planning pour cette semaine</p>
                                        <button
                                            onClick={() => initNewStage(selectedDate)}
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-abysse px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-turquoise"
                                        >
                                            <Plus size={14} /> Créer le planning de la semaine
                                        </button>
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
                                                <button onClick={clearAllSlots} className="px-4 py-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-500 hover:text-white transition-all shadow-sm font-black uppercase text-xs tracking-widest flex items-center gap-2" title="Vider tous les créneaux de la semaine"><Zap size={14} /> Tout vider</button>
                                                {selectedStage._id && <button onClick={deleteStage} className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>}
                                                <button onClick={saveStage} disabled={isSaving} className="px-6 py-3 bg-abysse text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-turquoise transition-all shadow-md flex items-center gap-2"><Save size={16} /> Enregistrer</button>
                                            </div>
                                        </div>

                                        <StagePlanningGrid
                                            key={selectedStage._id || selectedStage.startDate}
                                            planning={selectedStage}
                                            stages={stageDefinitions}
                                            activities={ACTIVITY_OPTIONS}
                                            onChange={setSelectedStage}
                                        />

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


                    {/* TAB: MARCHE AQUATIQUE */}
                    {activeTab === 'MARCHE' && <header data-admin-page-header><h2 data-admin-page-title>Marche aquatique</h2></header>}
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
                    {/* TAB: CHAR À VOILE (Pilotage quotidien) + VIGIE */}
                    {(activeTab === 'DASHBOARD' || activeTab === 'CHAR') && (
                        <div className="flex flex-col xl:flex-row gap-8 items-start">
                            {/* DASHBOARD GAUCHE (Booking) */}
                            {activeTab === 'CHAR' && <div className="flex-1 w-full min-w-0">
                                <CharBookingAdmin sessions={charSessions ?? []} onRefresh={refreshData} initialMode={charInitialMode} initialSessionId={charInitialSessionId} initialBookingId={charInitialBookingId} initialDate={charInitialDate} initialCreate={dashboardAction === 'new-session'} />
                            </div>}

                            {/* VIGIE */}
                            {activeTab === 'DASHBOARD' && <div className="w-full no-print"><VigieClient messages={infoMessages} onRefresh={refreshData} initialCompose={dashboardAction === 'new-message'} /></div>}
                        </div>
                    )}

                    {/* TAB: FICHES STAGES (page École) */}
                    {activeTab === 'FICHES' && <SchoolStagesEditor />}

                    {activeTab === 'PRICING' && <ActivityPricingManager />}

                    {/* TAB: DIGITAL SIGNAGE */}
                    {activeTab === 'SIGNAGE' && <SignageManager slides={signageSlides || []} initialCreate={dashboardAction === 'new-slide'} />}

                    {/* TAB: AGENDA & BLOG */}
                    {activeTab === 'AGENDA' && (
                        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2">
                            <ArticleManager initialArticles={articles || []} onEditingChange={setIsEditingArticle} initialCreate={dashboardAction === 'new-article' ? 'article' : dashboardAction === 'new-event' ? 'event' : undefined} />
                            {!isEditingArticle && <ShopManager merchItems={merchItems || []} occazItems={occazItems || []} />}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
