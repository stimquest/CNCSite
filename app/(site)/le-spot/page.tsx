"use client";

import React, { useState, useEffect } from 'react';
import { useContent } from '../../../contexts/ContentContext';
import { SpotTideChart } from '../../../components/SpotTideChart';
import { AgonNavigationCard } from '../../../components/AgonNavigationCard';
import { WeatherExpert } from '../../../components/WeatherExpert';
import { SpotStatus } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wind,
    Waves,
    Navigation,
    Eye,
    ArrowRight,
    Droplets,
    Activity,
    Compass,
    AlertTriangle,
    Info
} from 'lucide-react';
import Link from 'next/link';

export const SpotPage: React.FC = () => {
    const {
        weather,
        statusMessage,
        leSpotData
    } = useContent();

    const hero = leSpotData?.hero;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-turquoise selection:text-white">

            {/* HERO SECTION */}
            <section className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden bg-abysse">
                <div className="absolute inset-0 z-0">
                    <img
                        src={hero?.heroImage || "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000"}
                        className="w-full h-full object-cover opacity-40 scale-105"
                        alt="Spot Background"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-abysse/90 via-abysse/50 to-slate-50"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 max-w-[1400px] flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8"
                    >
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <Activity size={14} className="text-turquoise" /> Temps Réel • Agon-Coutainville
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.8] mb-8"
                    >
                        {hero?.title || "Le"} <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white pt-4 block">{hero?.subtitle || "Spot."}</span>
                    </motion.h1>

                    {(hero?.description || statusMessage) && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/40 text-sm font-medium italic max-w-md"
                        >
                            "{hero?.description || statusMessage}"
                        </motion.p>
                    )}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden lg:block">
                    <ArrowRight size={32} className="rotate-90 text-white" />
                </div>
            </section>

            {/* MAIN CONTENT */}
            <main className="container mx-auto px-6 max-w-[1600px] pt-12 relative z-20 pb-32">


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* COLONNE GAUCHE (8) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* 1. MÉTÉO EXPERTE (Arome HD) */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 md:p-12">
                                <WeatherExpert />
                            </div>
                        </div>

                        {/* 2. MARÉES DÉTAILLÉES */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-1.5 rounded-full bg-turquoise"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Onde de Marée</span>
                                        </div>
                                        <h2 className="text-4xl text-abysse leading-none">Mouvements<br />des Eaux.</h2>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                        <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-turquoise">
                                            <Droplets size={20} />
                                        </div>
                                        <div className="pr-4">
                                            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">Eau</span>
                                            <span className="text-lg font-black text-abysse">14.2°C</span>
                                        </div>
                                    </div>
                                </div>
                                <SpotTideChart />
                            </div>
                        </div>
                    </div>

                    {/* COLONNE DROITE (4) - SIDEBAR INTERACTIVE */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            {/* WEBCAM CARD */}
                            <div className="bg-abysse rounded-[2.5rem] overflow-hidden relative aspect-4/3 shadow-2xl group border border-slate-900">
                                <img
                                    src="https://picsum.photos/800/600?grayscale"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                    alt="Live Webcam"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-transparent to-transparent"></div>

                                <div className="absolute top-6 left-6 flex items-center gap-3">
                                    <div className="bg-red-600 px-3 py-1.5 rounded text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        <span className="size-2 bg-white rounded-full animate-pulse"></span> DIRECT
                                    </div>
                                    <span className="text-white text-[10px] font-black tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 uppercase">Plage Nord</span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="size-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30">
                                        <Eye size={24} />
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8">
                                    <p className="text-white text-2xl mb-1 leading-none">Webcam Live</p>
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Vue panoramique sur le havre</p>
                                </div>
                            </div>

                            {/* AGON WINDOWS */}
                            <AgonNavigationCard />

                            {/* SAFETY RULES CARD */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-turquoise/10 transition-colors">
                                    <Compass size={180} strokeWidth={1} />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="size-1.5 rounded-full bg-red-500"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Règles du Spot</span>
                                    </div>

                                    <h3 className="text-3xl text-abysse leading-none mb-10">Sécurité &<br />Navigation.</h3>

                                    <div className="space-y-6 mb-10">
                                        <div className="flex gap-6 items-start group/item">
                                            <span className="text-turquoise font-black text-xl italic leading-none pt-1">01.</span>
                                            <div>
                                                <p className="text-abysse font-black uppercase text-xs tracking-tight mb-1">Gilet & Équipement</p>
                                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Le port du gilet de sauvetage est obligatoire pour toutes les embarcations légères.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-6 items-start group/item">
                                            <span className="text-turquoise font-black text-xl italic leading-none pt-1">02.</span>
                                            <div>
                                                <p className="text-abysse font-black uppercase text-xs tracking-tight mb-1">Chenal Traversier</p>
                                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Vitesse limitée à 5 nœuds. Priorité absolue aux zones de baignade.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-6 items-start group/item">
                                            <span className="text-turquoise font-black text-xl italic leading-none pt-1">03.</span>
                                            <div>
                                                <p className="text-abysse font-black uppercase text-xs tracking-tight mb-1">Marée & Courants</p>
                                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">Attention au courant de jusant dans le havre (sortie vers le large). Redoutable par gros coeff.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center animate-pulse shadow-sm">
                                                <AlertTriangle size={20} />
                                            </div>
                                            <div>
                                                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Urgence Mer</span>
                                                <span className="text-2xl font-black text-abysse leading-none">196</span>
                                            </div>
                                        </div>
                                        <Info size={24} className="text-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SpotPage;
