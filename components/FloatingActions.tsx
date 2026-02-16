"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wind,
    Calendar,
    Mail,
    X,
    ArrowRight,
    Thermometer,
    CloudRain,
    Megaphone,
    Waves,
    Compass,
    Star,
    Check,
    AlertCircle,
    Info,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/contexts/ContentContext';
import { useTides } from '@/lib/hooks/useTides';
import { getNextCrossing } from '@/lib/tide-utils';
import { PlanningWidget } from './PlanningWidget';
import { useLenis } from './SmoothScroll';
import { ChevronUp } from 'lucide-react';

type ModalType = 'weather' | 'planning' | null;

export const FloatingActions: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const {
        weather,
        spotStatus, statusMessage,
        charStatus, charMessage,
        marcheStatus, marcheMessage,
        nautiqueStatus, nautiqueMessage
    } = useContent();
    const [isNavHovered, setIsNavHovered] = useState(false);

    // Récupération des marées pour les calculs précis (Prochain 5m, etc.)
    const { data: tides, coefficients } = useTides();
    const { stop, start } = useLenis();

    // Scroll Lock logic - Integrated with Lenis
    useEffect(() => {
        if (activeModal) {
            document.body.style.overflow = 'hidden';
            stop(); // Stop Lenis smooth scrolling
        } else {
            document.body.style.overflow = '';
            start(); // Resume Lenis smooth scrolling
        }
        return () => {
            document.body.style.overflow = '';
            start();
        };
    }, [activeModal, stop, start]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculs Marées Détaillés
    const now = Date.now();
    const todayStr = new Date().toDateString();

    // PROCHAINES MARÉES (Futures uniquement, triées par ordre chrono)
    const futureExtremes = tides?.filter(t => t.type === 'extreme' && t.timestamp > now).sort((a, b) => a.timestamp - b.timestamp) || [];
    const nextTide1 = futureExtremes[0];
    const nextTide2 = futureExtremes[1];

    // PROCHAIN PASSAGE 5M (Logique stricte : créneau de 20min autour du franchissement)
    const getNext5mDisplay = () => {
        if (!tides || tides.length === 0) return 'N/A';
        const nextWindow = getNextCrossing(tides);

        if (!nextWindow) return 'Pas de 5m';

        // Déterminer quel est le PROCHAIN franchissement (Montée ou Descente)
        let crossingTime = nextWindow.start;
        let label = " (Montée)";

        // Si on a dépassé la montée mais pas encore la descente, le prochain est la descente
        if (now > nextWindow.start && now < nextWindow.end) {
            crossingTime = nextWindow.end;
            label = " (Descente)";
        }

        // Formatage ±10min comme sur la page Spot
        const d1 = new Date(crossingTime - 10 * 60 * 1000);
        const d2 = new Date(crossingTime + 10 * 60 * 1000);

        const formatHm = (d: Date) => `${d.getHours()}h${d.getMinutes().toString().padStart(2, '0')}`;

        return `${formatHm(d1)} - ${formatHm(d2)}${label}`;
    };

    const next5mTime = getNext5mDisplay();

    const closeModal = () => setActiveModal(null);

    // Charger le script Windguru quand le modal météo est ouvert
    useEffect(() => {
        if (activeModal === 'weather') {
            const loadWindguru = () => {
                const arg = ["s=48404", "m=52", "mw=84", "uid=wg_fwdg_48404_52_1769697680205", "wj=knots", "tj=c", "waj=m", "tij=cm", "odh=3", "doh=23", "fhours=240", "hrsm=1", "vt=forecasts", "lng=fr", "p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,PWEN,SWELL1,TMP,CDC,APCP1s,RATING"];
                const scriptUrl = "https://www.windguru.cz/js/widget.php?" + (arg.join("&"));

                // 1. Nettoyage préventif : on supprime l'ancien script s'il traîne
                const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
                if (existingScript) existingScript.remove();

                // 2. Injection propre du nouveau script
                const script = document.createElement("script");
                script.src = scriptUrl;
                script.async = true;
                document.body.appendChild(script);
            };

            // Petit délai pour laisser le temps au DOM (div container) d'apparaître
            const timer = setTimeout(loadWindguru, 100);

            return () => {
                clearTimeout(timer);
                // Nettoyage final pour ne pas laisser de traces
                const arg = ["s=48404", "m=52", "mw=84", "uid=wg_fwdg_48404_52_1769697680205", "wj=knots", "tj=c", "waj=m", "tij=cm", "odh=3", "doh=23", "fhours=240", "hrsm=1", "vt=forecasts", "lng=fr", "p=WINDSPD,GUST,MWINDSPD,SMER,HTSGW,PERPW,DIRPW,PWEN,SWELL1,TMP,CDC,APCP1s,RATING"];
                const scriptUrl = "https://www.windguru.cz/js/widget.php?" + (arg.join("&"));
                const zombieScript = document.querySelector(`script[src="${scriptUrl}"]`);
                if (zombieScript) zombieScript.remove();
            };
        }
    }, [activeModal]);

    // Boutons de la barre flottante
    const ACTIONS = [
        {
            id: 'weather',
            icon: <Wind size={22} />,
            label: 'Météo & Windguru',
            onClick: () => setActiveModal('weather'),
            color: 'hover:bg-turquoise'
        },
        {
            id: 'planning',
            icon: <Calendar size={22} />,
            label: 'Plannings Stages',
            onClick: () => setActiveModal('planning'),
            color: 'hover:bg-orange-500'
        },
        {
            id: 'direct',
            icon: <Megaphone size={22} />,
            label: 'La Vigie',
            href: '/fil-info',
            color: 'hover:bg-turquoise'
        },
        {
            id: 'contact',
            icon: <Mail size={22} />,
            label: 'Contact direct',
            href: '/infos-pratiques',
            color: 'hover:bg-abysse'
        }
    ];

    return (
        <>
            {/* BARRE FLOTTANTE / TAB BAR MOBILE */}
            <div className="fixed bottom-4 left-4 right-4 md:right-6 md:left-auto md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-50">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-2 md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:shadow-none shadow-2xl flex flex-row md:flex-col gap-2 md:gap-4 items-center justify-around md:justify-center">
                    {ACTIONS.map((action) => (
                        action.href ? (
                            <Link
                                key={action.id}
                                href={action.href}
                                className={`group relative flex flex-col md:flex-row items-center justify-center size-12 md:size-14 bg-white/10 md:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-blue-900 shadow-xl transition-all duration-300 hover:scale-110 hover:text-white ${action.color}`}
                            >
                                {action.icon}
                                <span className="hidden md:group-hover:block absolute right-full mr-4 px-3 py-1 bg-abysse text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {action.label}
                                </span>
                                <span className="md:hidden text-[7px] font-black uppercase tracking-tighter mt-1 text-blue-900/60 group-hover:text-white">
                                    {action.id === 'weather' ? 'Météo' : action.id === 'planning' ? 'Planning' : action.id === 'direct' ? 'Vigie' : 'Contact'}
                                </span>
                            </Link>
                        ) : (
                            <button
                                key={action.id}
                                onClick={action.onClick}
                                className={`group relative flex flex-col md:flex-row items-center justify-center size-12 md:size-14 bg-white/10 md:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-blue-900 shadow-xl transition-all duration-300 hover:scale-110 hover:text-white ${action.color}`}
                            >
                                {action.icon}
                                <span className="hidden md:group-hover:block absolute right-full mr-4 px-3 py-1 bg-abysse text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {action.label}
                                </span>
                                <span className="md:hidden text-[7px] font-black uppercase tracking-tighter mt-1 text-blue-900/60 group-hover:text-white">
                                    {action.id === 'weather' ? 'Météo' : action.id === 'planning' ? 'Planning' : action.id === 'direct' ? 'Vigie' : 'Contact'}
                                </span>
                            </button>
                        )
                    ))}

                    {/* NAVIGATION INTELLIGENTE (Point Permanent) */}
                    <div
                        className="hidden md:flex flex-col items-center gap-4 mt-6"
                        onMouseEnter={() => setIsNavHovered(true)}
                        onMouseLeave={() => setIsNavHovered(false)}
                    >
                        <AnimatePresence>
                            {isNavHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    className="flex flex-col gap-3"
                                >
                                    <button
                                        onClick={() => window.history.back()}
                                        className="group relative flex items-center justify-center size-12 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-xl text-abysse shadow-xl transition-all duration-300 hover:scale-110 hover:bg-slate-100"
                                    >
                                        <ArrowRight size={20} className="rotate-180" />
                                        <span className="absolute right-full mr-4 px-3 py-1 bg-abysse text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                            Retour
                                        </span>
                                    </button>

                                    <button
                                        onClick={scrollToTop}
                                        className="group relative flex items-center justify-center size-12 bg-abysse/90 backdrop-blur-xl border border-white/20 rounded-xl text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-turquoise"
                                    >
                                        <ChevronUp size={20} />
                                        <span className="absolute right-full mr-4 px-3 py-1 bg-abysse text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                            Haut
                                        </span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Le Point (Trigger permanent) */}
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <div className={`size-3 rounded-full transition-all duration-500 cursor-help shadow-lg 
                                ${isNavHovered ? 'bg-turquoise scale-125 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : 'bg-slate-300 border border-slate-400/20'}
                            `} />
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest opacity-40">Nav</span>
                        </div>
                    </div>

                    {/* Scroll to top Mobile shortcut */}
                    <button
                        onClick={scrollToTop}
                        className="md:hidden flex items-center justify-center size-12 bg-white/5 border border-white/5 rounded-2xl text-blue-900 transition-all hover:bg-turquoise hover:text-white"
                    >
                        <ChevronUp size={20} />
                    </button>
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-abysse/40 backdrop-blur-sm"
                        />

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Header Modal */}
                            <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${activeModal === 'weather' ? 'bg-turquoise' : 'bg-orange-500'}`}>
                                        {activeModal === 'weather' ? <Wind size={24} /> : <Calendar size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-abysse uppercase italic tracking-tighter leading-none">
                                            {activeModal === 'weather' ? 'Météo & Windguru' : 'Planning des Stages'}
                                        </h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {activeModal === 'weather' ? 'Agon-Coutainville • Temps Réel' : 'Saison 2025/2026'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-abysse hover:border-abysse transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body Modal */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">

                                {activeModal === 'weather' && (
                                    <div className="space-y-8">
                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Carte 1 : Coefficient */}
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 text-blue-600">
                                                    <span className="material-symbols-outlined text-xl">water_ec</span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Coeff.</p>
                                                    <p className="text-sm font-black text-abysse">{weather.coefficient || coefficients?.coef_1 || '-'}</p>
                                                </div>
                                            </div>

                                            {/* Carte 2 : Prochaine Marée (Chronologique) */}
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 text-abysse">
                                                    <span className="material-symbols-outlined text-xl">
                                                        {nextTide1?.status === 'high' ? 'arrow_upward' : 'arrow_downward'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                        {nextTide1?.status === 'high' ? 'Pleine Mer' : 'Basse Mer'}
                                                    </p>
                                                    <p className="text-sm font-black text-abysse">
                                                        {nextTide1 ? new Date(nextTide1.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Carte 3 : Marée Suivante */}
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 text-slate-400">
                                                    <span className="material-symbols-outlined text-xl">
                                                        {nextTide2?.status === 'high' ? 'arrow_upward' : 'arrow_downward'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                        {nextTide2?.status === 'high' ? 'Pleine Mer' : 'Basse Mer'}
                                                    </p>
                                                    <p className="text-sm font-black text-abysse">
                                                        {nextTide2 ? new Date(nextTide2.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Carte 4 : Seuil 5m */}
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 text-turquoise">
                                                    <span className="material-symbols-outlined text-xl">water_lux</span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Créneau 5m</p>
                                                    <p className="text-sm font-black text-abysse">{next5mTime}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Windguru Iframe Widget */}
                                        <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[450px]">
                                            {/* Container spécifique pour le widget Windguru */}
                                            <div id="wg_fwdg_48404_52_1769697680205" className="w-full h-full rounded-2xl grayscale brightness-110"></div>

                                            <div className="absolute bottom-4 right-4 bg-abysse/80 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black text-turquoise uppercase tracking-widest border border-white/10 pointer-events-none">
                                                Widget Windguru Live
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeModal === 'planning' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <PlanningWidget />
                                    </div>
                                )}

                            </div>

                            {/* Footer Modal */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0">
                                <Link
                                    href="/infos-pratiques"
                                    onClick={closeModal}
                                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-abysse transition-colors"
                                >
                                    Voir toutes les infos pratiques <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
