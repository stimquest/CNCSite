"use client";

import React, { useState, useMemo } from 'react';
import { useContent } from '@/contexts/ContentContext';
import {
    Bell,
    Filter,
    Clock,
    AlertTriangle,
    Info,
    Calendar,
    Wind,
    Share2,
    ExternalLink,
    ChevronRight,
    Zap,
    Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoMessage } from '@/types';
import { useOneSignal } from '@/components/OneSignalProvider';

// Groupes disponibles pour le filtrage
const GROUPS = [
    { id: 'all', label: 'Tout le club', color: 'bg-slate-900', icon: <Info size={14} /> },
    { id: 'stage-minimousses', label: 'Mini-Mousses', color: 'bg-orange-500', icon: <Zap size={14} /> },
    { id: 'stage-moussaillons', label: 'Moussaillons', color: 'bg-turquoise', icon: <Wind size={14} /> },
    { id: 'stage-initiation', label: 'Initiation', color: 'bg-blue-500', icon: <Wind size={14} /> },
    { id: 'stage-perfectionnement', label: 'Perf', color: 'bg-purple-500', icon: <Wind size={14} /> },
    { id: 'club-sportif', label: 'Club Sportif', color: 'bg-indigo-500', icon: <Zap size={14} /> },
    { id: 'char-voile', label: 'Char à Voile', color: 'bg-amber-600', icon: <Zap size={14} /> },
    { id: 'glisses', label: 'Glisses', color: 'bg-emerald-500', icon: <Wind size={14} /> },
];

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    switch (category) {
        case 'alert':
            return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-200"><AlertTriangle size={10} /> Alerte</span>;
        case 'weather':
            return <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-cyan-200"><Wind size={10} /> Météo</span>;
        case 'event':
            return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-purple-200"><Calendar size={10} /> Événement</span>;
        case 'vibe':
            return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-200"><Zap size={10} /> Vibe</span>;
        default:
            return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-slate-200"><Info size={10} /> Info</span>;
    }
};

export const FilInfoPage: React.FC = () => {
    const { infoMessages, isLoading } = useContent();
    const { subscribeToGroup, unsubscribeFromGroup, unsubscribeAll, activeTags, isSubscribed } = useOneSignal();
    const [selectedGroup, setSelectedGroup] = useState('all');

    const filteredMessages = useMemo(() => {
        if (!infoMessages) return [];
        if (selectedGroup === 'all') return infoMessages;
        return infoMessages.filter(msg => msg.targetGroups?.includes(selectedGroup) || msg.targetGroups?.includes('all'));
    }, [infoMessages, selectedGroup]);

    if (isLoading && !infoMessages?.length) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="size-12 rounded-full border-4 border-turquoise/20 border-t-turquoise animate-spin mb-4" />
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">Connexion au direct...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">

            {/* HEADER */}
            <header className="bg-abysse pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-turquoise/10 to-transparent pointer-events-none" />
                <div className="max-w-2xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="size-3 bg-turquoise rounded-full animate-pulse shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                        <span className="text-turquoise text-[10px] font-black uppercase tracking-[0.4em]">La Vigie Direct</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl text-white leading-none mb-4"
                    >
                        La <span className="text-turquoise">Vigie.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-sm font-medium leading-relaxed max-w-md"
                    >
                        Suivez la vie du club en temps réel : alertes météo, retards de stages, photos de sessions et actus urgentes.
                    </motion.p>
                </div>
            </header>

            {/* FILTERS */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm overflow-x-auto no-scrollbar py-4 px-6">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 shrink-0 pr-2 border-r border-slate-100">
                        <Filter size={12} /> Filtres
                    </div>
                    <div className="flex gap-2 shrink-0">
                        {GROUPS.map(group => (
                            <button
                                key={group.id}
                                onClick={() => setSelectedGroup(group.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedGroup === group.id
                                    ? 'bg-abysse text-white shadow-xl scale-105'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {group.icon}
                                {group.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FEED */}
            <main className="max-w-2xl mx-auto p-6 space-y-8 mt-8">

                {/* ONESIGNAL CALL TO ACTION */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-turquoise/10 border border-turquoise/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm"
                >
                    <div className="size-14 bg-turquoise rounded-2xl flex items-center justify-center text-abysse shadow-lg shrink-0">
                        <Bell size={28} className="animate-bounce" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-abysse text-sm mb-1 tracking-tight">
                            {selectedGroup === 'all' ? 'Alerte Globale du Club' : `Alertes : ${GROUPS.find(g => g.id === selectedGroup)?.label}`}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            {selectedGroup === 'all'
                                ? 'Recevez toutes les annonces majeures sur votre écran.'
                                : `Recevez uniquement les infos du groupe ${GROUPS.find(g => g.id === selectedGroup)?.label}.`}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const isGroupSubbed = activeTags[`group_${selectedGroup}`] === "true";
                            if (isGroupSubbed) unsubscribeFromGroup(selectedGroup);
                            else subscribeToGroup(selectedGroup);
                        }}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all flex items-center gap-2 ${activeTags[`group_${selectedGroup}`] === "true"
                            ? 'bg-green-500 text-white'
                            : 'bg-abysse text-white'
                            }`}
                    >
                        {activeTags[`group_${selectedGroup}`] === "true" ? '🔔 Abonné' : '🔔 M\'abonner'}
                    </button>
                </motion.div>

                <div className="relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
                    <div className="absolute left-8 top-4 bottom-4 w-px bg-slate-200 md:hidden" />

                    <div className="space-y-12 relative">
                        <AnimatePresence mode='popLayout'>
                            {filteredMessages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-20 text-center"
                                >
                                    <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <Clock size={40} />
                                    </div>
                                    <p className="text-slate-400 font-black uppercase italic tracking-widest">Aucun message pour le moment</p>
                                    <button onClick={() => setSelectedGroup('all')} className="mt-4 text-turquoise text-[10px] font-bold uppercase underline">Voir tout le club</button>
                                </motion.div>
                            ) : (
                                filteredMessages.map((msg, idx) => (
                                    <motion.div
                                        key={msg._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                    >
                                        {/* Timeline Marker */}
                                        <div className="absolute left-4 md:left-1/2 top-8 -translate-x-1/2 z-10 flex flex-col items-center">
                                            <div className={`size-4 rounded-full border-4 border-white shadow-md
                                            ${msg.category === 'alert' ? 'bg-amber-500' : ''}
                                            ${msg.category === 'weather' ? 'bg-cyan-500' : ''}
                                            ${msg.category === 'event' ? 'bg-purple-500' : ''}
                                            ${msg.category === 'vibe' ? 'bg-emerald-500' : ''}
                                            ${!msg.category || msg.category === 'info' ? 'bg-slate-400' : ''}
                                        `} />
                                            <div className="mt-2 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100 text-[8px] font-black text-slate-400 whitespace-nowrap">
                                                {new Date(msg.publishedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        {/* Message Card */}
                                        <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:pr-4' : 'md:pl-4'}`}>
                                            <article
                                                className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:translate-y-[-2px] transition-all duration-500 
                                                ${msg.category === 'alert' ? 'border-t-4 border-t-amber-500' : ''}
                                                ${msg.category === 'weather' ? 'border-t-4 border-t-cyan-500' : ''}
                                                ${msg.category === 'event' ? 'border-t-4 border-t-purple-500' : ''}
                                                ${msg.category === 'vibe' ? 'border-t-4 border-t-emerald-500' : ''}
                                                ${msg.isPinned ? 'ring-2 ring-turquoise ring-offset-4 ring-offset-slate-50' : ''}`}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <CategoryBadge category={msg.category} />
                                                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest md:hidden flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(msg.publishedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl text-abysse leading-tight mb-3 group-hover:text-turquoise transition-colors">
                                                    {msg.title}
                                                </h3>

                                                <div className="text-slate-600 text-xs font-medium leading-relaxed mb-6 line-clamp-4 group-hover:line-clamp-none transition-all">
                                                    {msg.content}
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                                                    <div className="flex flex-wrap gap-1.5 text-[8px] font-bold text-slate-400">
                                                        {new Date(msg.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {msg.externalLink && (
                                                            <a
                                                                href={msg.externalLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-turquoise hover:text-white transition-all shadow-sm"
                                                            >
                                                                {msg.externalLink.includes('facebook') ? <Facebook size={14} /> : <ExternalLink size={14} />}
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={async () => {
                                                                const shareData = {
                                                                    title: `CNC - ${msg.title}`,
                                                                    text: msg.content,
                                                                    url: window.location.href,
                                                                };
                                                                if (navigator.share) {
                                                                    try { await navigator.share(shareData); } catch (e) { }
                                                                } else {
                                                                    try {
                                                                        await navigator.clipboard.writeText(`${msg.title}\n${msg.content}\n${window.location.href}`);
                                                                        // Minimal logic to avoid a full state for just one toast
                                                                        const btn = document.activeElement as HTMLElement;
                                                                        if (btn) {
                                                                            const originalInner = btn.innerHTML;
                                                                            btn.innerHTML = '<span class="text-[8px] font-bold">Copié !</span>';
                                                                            setTimeout(() => { btn.innerHTML = originalInner; }, 2000);
                                                                        }
                                                                    } catch (e) { }
                                                                }
                                                            }}
                                                            className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-abysse hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Share2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* FOOTER TIP & UNSUBSCRIBE */}
                <div className="py-20 text-center border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8">Fin du journal de bord</p>

                    {isSubscribed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 max-w-sm mx-auto shadow-xl"
                        >
                            <h5 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Gestion des alertes</h5>
                            <button
                                onClick={unsubscribeAll}
                                className="w-full py-4 rounded-xl border border-slate-100 text-[10px] font-black uppercase text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all"
                            >
                                Désactiver toutes les notifications
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FilInfoPage;
