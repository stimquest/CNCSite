"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { Share2, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusDashboard } from '@/components/StatusDashboard';
import { FreshnessIndicator } from '@/components/FreshnessIndicator';
import { VigieInstallButton } from '@/components/VigieInstallButton';

// Groupes fixes (non-stages)
const FIXED_GROUPS = [
    { id: 'club-hebdo', label: 'Club Hebdo' },
    { id: 'char-voile', label: 'Char à Voile' },
    { id: 'marche-aquatique', label: 'Marche Aquatique' },
    { id: 'pratique-libre', label: 'Pratique Libre' },
];

const STORAGE_KEY = 'vigie-selected-groups';

const CATEGORY_CONFIG: Record<string, { dot: string; color: string; label: string }> = {
    alert: { dot: 'bg-amber-400', color: 'text-amber-600', label: 'Alerte' },
    weather: { dot: 'bg-cyan-400', color: 'text-cyan-600', label: 'Météo' },
    event: { dot: 'bg-purple-400', color: 'text-purple-600', label: 'Événement' },
    vibe: { dot: 'bg-emerald-400', color: 'text-emerald-600', label: 'Ambiance' },
    info: { dot: 'bg-slate-300', color: 'text-slate-400', label: 'Info' },
};

function relDate(iso: string) {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 3600000);
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diff < 1) return `à l'instant · ${time}`;
    if (diff < 24) return `il y a ${diff}h · ${time}`;
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) + ` · ${time}`;
}

export const FilInfoClient: React.FC<{ infoMessages: any[] }> = ({ infoMessages }) => {
    const { lastPublishedAt, lastConfirmedAt, stageDefinitions } = useLiveStatus();

    // Groupes stages dérivés dynamiquement des stageDefinitions Sanity
    const stageGroups = stageDefinitions.map(s => ({ id: s.vigieGroupId, label: s.shortLabel || s.label }));
    const GROUPS = [...FIXED_GROUPS.slice(0, 2), ...stageGroups, ...FIXED_GROUPS.slice(2)];
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

    // Restore from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSelectedGroups(new Set(parsed));
                }
            }
        } catch (_) {}
    }, []);

    const toggleGroup = (id: string) => {
        setSelectedGroups(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch (_) {}
            return next;
        });
    };

    const clearAll = () => {
        setSelectedGroups(new Set());
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    };

    const filteredMessages = useMemo(() => {
        if (!infoMessages) return [];
        if (selectedGroups.size === 0) return infoMessages;
        return infoMessages.filter(m =>
            m.targetGroups?.includes('all') ||
            m.targetGroups?.some((g: string) => selectedGroups.has(g))
        );
    }, [infoMessages, selectedGroups]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* HEADER */}
            <header className="bg-abysse pt-32 pb-14 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-turquoise/10 to-transparent pointer-events-none" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <span className="size-2 bg-turquoise rounded-full animate-pulse shadow-[0_0_12px_rgba(45,212,191,0.5)]" />
                            <span className="text-turquoise text-[10px] font-black uppercase tracking-[0.35em]">La Vigie Direct</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl text-white leading-none mb-3">
                        La <span className="text-turquoise">Vigie.</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                        Alertes météo, état des activités et actus du club en temps réel.
                    </p>
                </div>
            </header>

            {/* FILTRES — sticky, toutes tailles */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-100 overflow-x-auto no-scrollbar">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-1">
                    {/* Bouton Tout (reset) */}
                    <button
                        onClick={clearAll}
                        className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${selectedGroups.size === 0 ? 'bg-abysse text-white shadow-sm' : 'text-slate-400 hover:text-slate-700 bg-transparent'}`}
                    >
                        Tout
                    </button>

                    {GROUPS.map(g => {
                        const isSelected = selectedGroups.has(g.id);
                        const isStage = g.id.startsWith('stage-');
                        const isChar = g.id === 'char-voile';

                        let colorClasses = 'text-slate-500 hover:text-slate-800 bg-transparent';
                        if (isSelected) {
                            if (isStage) colorClasses = 'bg-turquoise text-white shadow-sm';
                            else if (isChar) colorClasses = 'bg-orange-500 text-white shadow-sm';
                            else colorClasses = 'bg-abysse text-white shadow-sm';
                        } else {
                            if (isStage) colorClasses = 'text-turquoise hover:bg-turquoise/10';
                            else if (isChar) colorClasses = 'text-orange-500 hover:bg-orange-500/10';
                        }

                        return (
                            <button
                                key={g.id}
                                onClick={() => toggleGroup(g.id)}
                                className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${colorClasses}`}
                            >
                                {g.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* LAYOUT PRINCIPAL : sidebar gauche + feed droite sur desktop */}
            <div className="max-w-6xl mx-auto px-4 py-8 lg:flex lg:gap-8 lg:items-start">

                {/* SIDEBAR — sticky sur desktop, empilé sur mobile */}
                <aside className="lg:w-96 lg:shrink-0 lg:sticky lg:top-16 space-y-4 mb-6 lg:mb-0">
                    <StatusDashboard />
                    <FreshnessIndicator
                        lastPublishedAt={lastPublishedAt}
                        lastConfirmedAt={lastConfirmedAt}
                        showBanner
                    />
                </aside>

                {/* FEED */}
                <div className="flex-1 min-w-0 space-y-4">

                    {/* Compteur + dernière mise à jour */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
                            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                        </span>
                        {lastPublishedAt && (() => {
                            const latest = [lastPublishedAt, lastConfirmedAt].filter(Boolean) as string[];
                            const date = new Date(Math.max(...latest.map(d => new Date(d).getTime())));
                            return (
                                <span className="text-[9px] text-slate-400 font-medium">
                                    Mis à jour · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    {' '}le {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </span>
                            );
                        })()}
                        <div className="flex-1 h-px bg-slate-200 hidden sm:block" />
                    </div>

                    {/* Messages */}
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {filteredMessages.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-16 text-center px-6"
                                >
                                    <Clock size={28} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-sm font-black uppercase italic tracking-widest text-slate-300">
                                        Aucun message pour ce groupe
                                    </p>
                                    <button
                                        onClick={clearAll}
                                        className="mt-3 text-[10px] font-bold text-turquoise uppercase underline tracking-widest"
                                    >
                                        Voir tout
                                    </button>
                                </motion.div>
                            ) : (
                                filteredMessages.map((msg, idx) => {
                                    const cat = CATEGORY_CONFIG[msg.category] ?? CATEGORY_CONFIG.info;
                                    return (
                                        <motion.article
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className={`flex gap-3 px-5 py-4 hover:bg-slate-50/70 transition-colors
                                                ${idx < filteredMessages.length - 1 ? 'border-b border-slate-100' : ''}
                                                ${msg.isPinned ? 'border-l-2 border-l-turquoise' : ''}
                                            `}
                                        >
                                            {/* Dot catégorie */}
                                            <span className={`shrink-0 mt-1.75 size-2 rounded-full ${cat.dot}`} />

                                            {/* Contenu */}
                                            <div className="flex-1 min-w-0">
                                                {/* Méta : catégorie · heure */}
                                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                    {msg.isPinned && (
                                                        <span className="text-[9px] font-black uppercase text-turquoise tracking-widest">Épinglé ·</span>
                                                    )}
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${cat.color}`}>
                                                        {cat.label}
                                                    </span>
                                                    <span className="text-slate-200">·</span>
                                                    <time className="text-[10px] text-slate-400 font-medium" dateTime={msg.publishedAt}>
                                                        {relDate(msg.publishedAt)}
                                                    </time>
                                                </div>

                                                {/* Titre */}
                                                <h3 className="text-[15px] font-black text-abysse tracking-tight leading-snug mb-1.5">
                                                    {msg.title}
                                                </h3>

                                                {/* Corps */}
                                                {msg.content && (
                                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                                        {msg.content}
                                                    </p>
                                                )}

                                                {/* Lien externe */}
                                                {msg.externalLink && (
                                                    <a
                                                        href={msg.externalLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-400 hover:text-turquoise transition-colors uppercase tracking-wider"
                                                    >
                                                        {msg.externalLink.includes('facebook')
                                                            ? <><ExternalLink size={11} /> Voir sur Facebook</>
                                                            : <><ExternalLink size={11} /> En savoir plus</>
                                                        }
                                                    </a>
                                                )}
                                            </div>

                                            {/* Bouton share */}
                                            <button
                                                onClick={async () => {
                                                    if (navigator.share) {
                                                        try { await navigator.share({ title: `CNC - ${msg.title}`, text: msg.content, url: window.location.href }); } catch (_) { }
                                                    } else {
                                                        try { await navigator.clipboard.writeText(`${msg.title}\n${msg.content}`); } catch (_) { }
                                                    }
                                                }}
                                                className="shrink-0 size-7 flex items-center justify-center text-slate-200 hover:text-turquoise transition-colors self-start mt-0.5"
                                                aria-label="Partager"
                                            >
                                                <Share2 size={13} />
                                            </button>
                                        </motion.article>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col items-center py-6 gap-4">
                        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.35em]">
                            Fin du journal de bord
                        </p>
                        <VigieInstallButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilInfoClient;
