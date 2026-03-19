"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Wind, Map, Calendar, ArrowRight, X } from 'lucide-react';

const STORAGE_KEY = 'cnc_onboarded_v1';

const STEPS = [
    {
        id: 'intro',
        type: 'intro',
    },
    {
        id: 'vigie',
        icon: Radio,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        accentColor: 'bg-orange-500',
        tag: 'Communication directe',
        title: 'La Vigie',
        description: "L'équipe du CNC vous parle en direct. Annulation de stage, changement d'horaire, météo du jour, infos de dernière minute — tout arrive ici, en temps réel.",
        details: [
            "Infos sur vos stages et séances",
            "Alertes météo et conditions de mer",
            "Actus et messages du club",
            "Disponible en app sur votre téléphone",
        ],
        cta: { label: 'Ouvrir La Vigie', href: '/fil-info' },
    },
    {
        id: 'spot',
        icon: Wind,
        color: 'text-turquoise',
        bgColor: 'bg-turquoise/10',
        borderColor: 'border-turquoise/20',
        accentColor: 'bg-turquoise',
        tag: 'Météo & Conditions',
        title: 'Le Spot',
        description: "Avant de sortir, consultez les conditions réelles du spot. Vent, météo marine, état de la mer — toutes les données pour pratiquer en toute connaissance de cause.",
        details: [
            "Vent en temps réel (direction & force)",
            "Prévisions météo locales",
            "Bulletin météo marine",
            "Conditions de navigation du jour",
        ],
        cta: { label: 'Voir le Spot', href: '/le-spot' },
    },
    {
        id: 'plannings',
        icon: Calendar,
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/20',
        accentColor: 'bg-violet-500',
        tag: 'Organisation',
        title: 'Les Plannings',
        description: "Retrouvez les horaires et dates de tous vos stages et séances semaine par semaine. Voile, char à voile, marche aquatique — tout le programme du club, organisé et clair.",
        details: [
            "Planning de la semaine en cours",
            "Prochaines dates de stages",
            "Horaires par activité",
            "Stages Minimousses, Moussaillons, Initiation...",
        ],
        cta: { label: 'Voir les Plannings', href: '/infos-pratiques' },
    },
    {
        id: 'nature',
        icon: Map,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        accentColor: 'bg-emerald-500',
        tag: 'Environnement',
        title: 'La Pointe d\'Agon',
        description: "Vous pratiquez dans l'un des sites naturels les plus remarquables de Normandie. Découvrez la faune, la flore et les phénomènes naturels qui font la richesse de votre terrain de jeu.",
        details: [
            "Inventaire de la biodiversité locale",
            "Comprendre les marées et l'estran",
            "Pêche à pied responsable",
            "Espèces protégées à observer",
        ],
        cta: { label: 'Découvrir le site', href: '/nature' },
    },
];

interface WelcomeGuideProps {
    forceOpen?: boolean;
    onClose?: () => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ forceOpen = false, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        if (forceOpen) {
            setStep(0);
            setIsOpen(true);
            return;
        }
        const alreadySeen = localStorage.getItem(STORAGE_KEY);
        if (!alreadySeen) {
            const t = setTimeout(() => setIsOpen(true), 1200);
            return () => clearTimeout(t);
        }
    }, [forceOpen]);

    useEffect(() => {
        const handler = () => { setStep(0); setIsOpen(true); };
        window.addEventListener('cnc_reopen_guide', handler);
        return () => window.removeEventListener('cnc_reopen_guide', handler);
    }, []);

    const close = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setIsOpen(false);
        onClose?.();
    };

    const goNext = () => {
        if (step < STEPS.length - 1) {
            setDirection(1);
            setStep(s => s + 1);
        } else {
            close();
        }
    };

    const goPrev = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(s => s - 1);
        }
    };

    const currentStep = STEPS[step];
    const isIntro = currentStep.type === 'intro';
    const isLast = step === STEPS.length - 1;
    const toolSteps = STEPS.filter(s => s.type !== 'intro');
    const toolIndex = isIntro ? -1 : toolSteps.findIndex(s => s.id === currentStep.id);

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="absolute inset-0 bg-abysse/50 backdrop-blur-sm"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-4xl overflow-hidden shadow-2xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={close}
                            className="absolute top-5 right-5 z-10 size-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        >
                            <X size={16} />
                        </button>

                        {/* Progress dots */}
                        {!isIntro && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {toolSteps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === toolIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Step content */}
                        <div className="overflow-hidden">
                            <AnimatePresence custom={direction} mode="wait">
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                                >
                                    {isIntro ? (
                                        /* ---- INTRO SCREEN ---- */
                                        <div className="flex flex-col items-center justify-center text-center px-10 py-16">
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 rounded-full bg-turquoise/20 blur-2xl scale-150" />
                                                <img src="/images/LogoCNC_W.svg" alt="CNC" className="relative size-24 drop-shadow-2xl" />
                                            </div>
                                            <p className="text-turquoise text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                                                Bienvenue au CNC
                                            </p>
                                            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                                                Le site a<br />
                                                <span className="text-turquoise">4 outils pour vous.</span>
                                            </h2>
                                            <p className="text-slate-400 leading-relaxed mb-10 max-w-sm">
                                                En tant que pratiquant, voici ce que vous pouvez utiliser au quotidien pour suivre vos activités, les conditions et les infos du club.
                                            </p>
                                            <button
                                                onClick={goNext}
                                                className="inline-flex items-center gap-3 bg-white text-abysse px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-turquoise hover:text-white transition-all"
                                            >
                                                Découvrir <ArrowRight size={16} />
                                            </button>
                                            <button onClick={close} className="mt-5 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors">
                                                Passer
                                            </button>
                                        </div>
                                    ) : (
                                        /* ---- TOOL SCREEN ---- */
                                        (() => {
                                            const s = currentStep as typeof STEPS[1];
                                            const Icon = s.icon!;
                                            return (
                                                <div className="px-8 pt-16 pb-8">
                                                    {/* Icon + tag */}
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className={`size-11 rounded-xl ${s.bgColor} border ${s.borderColor} flex items-center justify-center`}>
                                                            <Icon size={20} className={s.color} />
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.35em] ${s.color}`}>
                                                            {s.tag}
                                                        </span>
                                                    </div>

                                                    {/* Title + description */}
                                                    <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                                        {s.title}
                                                    </h2>
                                                    <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                                                        {s.description}
                                                    </p>

                                                    {/* Detail bullets */}
                                                    <ul className="space-y-2 mb-8">
                                                        {s.details!.map((detail, i) => (
                                                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                                                <div className={`size-1.5 rounded-full shrink-0 ${s.accentColor}`} />
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-between gap-4">
                                                        <button
                                                            onClick={goPrev}
                                                            className="text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors"
                                                        >
                                                            ← Retour
                                                        </button>
                                                        <button
                                                            onClick={goNext}
                                                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-black uppercase tracking-widest text-xs transition-all border border-white/10"
                                                        >
                                                            {isLast ? 'Terminer' : 'Suivant'} <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Hook to trigger the guide from the footer link
export function useReopenGuide() {
    const reopen = () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    };
    return reopen;
}
