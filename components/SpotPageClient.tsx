"use client";

import React from 'react';
import { useLiveStatus } from '@/contexts/LiveStatusContext';
import { SpotTideChart } from '@/components/SpotTideChart';
import { AgonNavigationCard } from '@/components/AgonNavigationCard';
import { WeatherExpert } from '@/components/WeatherExpert';
import { Compass, AlertTriangle, Activity, Info } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const SpotPageClient: React.FC<{ leSpotData: any }> = ({ leSpotData }) => {
    const { statusMessage } = useLiveStatus();
    const hero = leSpotData?.hero;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-turquoise selection:text-white">

            {/* HERO SECTION */}
            <PageHero
                image={hero?.heroImage || "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2000"}
                imageAlt="Spot Background"
                tagIcon={<Activity size={14} />}
                tagText="Temps Réel • Agon-Coutainville"
                title={hero?.title || "Le"}
                subtitle={hero?.subtitle || "Spot."}
                description={hero?.description || statusMessage}
                size="compact"
                bottomColor="slate"
            />

            {/* MAIN CONTENT */}
            <main className="container mx-auto px-6 max-w-[1600px] pt-12 relative z-20 pb-32">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* COLONNE GAUCHE (8) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. MÉTÉO EXPERTE (Arome HD) */}
                        <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 md:p-12">
                                <WeatherExpert />
                            </div>
                        </div>

                        {/* 2. MARÉES DÉTAILLÉES */}
                        <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-1.5 rounded-full bg-turquoise"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Onde de Marée</span>
                                        </div>
                                        <h2 className="text-4xl text-abysse leading-none">Mouvements des Eaux.</h2>
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
                            <div className="bg-abysse rounded-4xl overflow-hidden relative aspect-4/3 lg:aspect-video shadow-2xl border border-slate-900">
                                <iframe
                                    src="https://www.skaping.com/coutances/agon-coutainville/video"
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="autoplay; fullscreen"
                                    title="Live Webcam Agon-Coutainville"
                                />
                            </div>

                            {/* AGON WINDOWS */}
                            <AgonNavigationCard />

                            {/* SAFETY RULES CARD */}
                            <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
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

export default SpotPageClient;
