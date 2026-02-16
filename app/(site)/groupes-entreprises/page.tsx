"use client";

import React from 'react';
import {
    Building2,
    PartyPopper,
    ArrowRight,
    Briefcase,
    Mail,
    MonitorPlay,
    Wifi,
    Coffee,
    CheckCircle2,
    Target,
    Users,
    Waves,
    Users2,
    Calendar,
    Utensils,
    Presentation,
    Zap,
    Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import Link from 'next/link';

export const GroupesPage: React.FC = () => {
    const { groupsData } = useContent();

    const hero = groupsData?.hero;

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-turquoise selection:text-white">

            {/* HERO SECTION - IMMERSIF & STATS */}
            <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-abysse">
                <div className="absolute inset-0 z-0">
                    <img
                        src={hero?.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000"}
                        className="w-full h-full object-cover opacity-50 scale-105"
                        alt="Corporate Retreat"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-abysse/80 via-abysse/40 to-white"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 max-w-[1400px] mt-20">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8"
                        >
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <Briefcase size={14} className="text-turquoise" /> Séminaires • Teambuilding • Privé
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.8] mb-12"
                        >
                            {hero?.title || "Vivre le"} <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">{hero?.subtitle || "Collectif."}</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-[320px]">
                                <div className="size-16 rounded-2xl bg-abysse flex items-center justify-center text-white shadow-lg shrink-0">
                                    <Users size={32} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Capacité</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-abysse tracking-tighter">{groupsData?.capacity || "120"}</span>
                                        <span className="text-lg font-bold text-slate-400 uppercase italic">pers.</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Infrastructure modulable</p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-[280px]">
                                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <Presentation size={32} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Services</p>
                                    <p className="text-3xl font-black text-white uppercase italic leading-none">Full-Tech</p>
                                    <p className="text-[10px] text-white/60 font-bold mt-1 uppercase italic">Fibre • Visio • Traiteur</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 1: ENTREPRISES - SÉMINAIRES */}
            <section className="container mx-auto px-6 max-w-[1500px] -mt-20 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Grande Carte Entreprise */}
                    <div className="lg:col-span-8 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden group">
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            <div className="relative overflow-hidden min-h-[300px]">
                                <img
                                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    alt="Seminar room"
                                />
                                <div className="absolute inset-0 bg-abysse/10"></div>
                            </div>
                            <div className="p-10 md:p-14 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="size-1.5 rounded-full bg-turquoise"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Business x Nautisme</span>
                                </div>
                                <h2 className="text-4xl text-abysse leading-none mb-6">
                                    Séminaires <br />
                                    <span className="text-turquoise">Haute définition.</span>
                                </h2>
                                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                                    Offrez à vos collaborateurs un cadre stimulant face à la mer. Une salle de 100m² équipée des dernières technologies pour vos réunions, CODIR et formations.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-abysse">
                                            <Wifi size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-abysse uppercase tracking-tight">Fibre Pro</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-abysse">
                                            <Utensils size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-abysse uppercase tracking-tight">Pause Café</span>
                                    </div>
                                </div>
                                <Link
                                    href="/infos-pratiques"
                                    className="inline-flex items-center justify-center gap-3 bg-abysse text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-turquoise transition-all shadow-lg w-fit"
                                >
                                    Demander un devis <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Carte Teambuilding Verticale */}
                    <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
                        <img
                            src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-110"
                            alt="Teambuilding"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-abysse via-abysse/50 to-transparent"></div>

                        <div className="relative z-10">
                            <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-turquoise mb-8">
                                <Target size={28} />
                            </div>
                            <h3 className="text-3xl text-white leading-none mb-4">Challenge <br />Teambuilding.</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                Rallye nautique en catamaran, défis en kayak, ou grand prix de char à voile... Ressoudez vos équipes par le sport et la stratégie.
                            </p>
                        </div>

                        <div className="relative z-10 pt-8 mt-12 border-t border-white/10 flex items-center justify-between">
                            <span className="text-turquoise font-black uppercase tracking-widest text-[10px]">6 à 80 participants</span>
                            <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <Zap size={18} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: ÉVÉNEMENTS PRIVÉS */}
            <section className="py-24 bg-slate-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                    <Compass size={400} className="text-abysse rotate-12" />
                </div>

                <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-2 rounded-full bg-orange-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Pour les Particuliers</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl text-abysse leading-none">
                            Événements <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Privés.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* EVG / EVJF */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:translate-y-[-8px] transition-all group">
                            <div className="size-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-8 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-2xl text-abysse mb-4">EVG / EVJF</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                Une journée mémorable entre amis. Défis sur l'eau, adrénaline et fun garantis pour le/la futur(e) marié(e).
                            </p>
                            <ul className="space-y-3 mb-10">
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-orange-500" /> Challenge Cata ou Char à voile
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-orange-500" /> Espace détente & Terrasse
                                </li>
                            </ul>
                            <Link href="/infos-pratiques" className="w-full py-4 rounded-2xl bg-slate-50 text-abysse font-black uppercase tracking-widest text-[9px] hover:bg-orange-500 hover:text-white transition-all border border-slate-100 flex items-center justify-center gap-2">
                                Réserver mon créneau <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* ANNIVERSAIRES */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:translate-y-[-8px] transition-all group">
                            <div className="size-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-8 shadow-sm group-hover:bg-purple-500 group-hover:text-white transition-all">
                                <PartyPopper size={28} />
                            </div>
                            <h3 className="text-2xl text-abysse mb-4">Anniversaires</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                Soufflez vos bougies face au havre. Formules ludiques pour les enfants ou soirées élégantes pour les plus grands.
                            </p>
                            <ul className="space-y-3 mb-10">
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-purple-500" /> Animations nautiques encadrées
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-purple-500" /> Privatisation de la salle
                                </li>
                            </ul>
                            <Link href="/infos-pratiques" className="w-full py-4 rounded-2xl bg-slate-50 text-abysse font-black uppercase tracking-widest text-[9px] hover:bg-purple-500 hover:text-white transition-all border border-slate-100 flex items-center justify-center gap-2">
                                Étudier mon projet <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* COUSINADES / FAMILLE */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:translate-y-[-8px] transition-all group">
                            <div className="size-14 rounded-2xl bg-turquoise/10 text-turquoise flex items-center justify-center mb-8 shadow-sm group-hover:bg-turquoise group-hover:text-white transition-all">
                                <Users2 size={28} />
                            </div>
                            <h3 className="text-2xl text-abysse mb-4">Famille</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                Réunissez votre tribu autour d'activités accessibles à tous : balade en kayak, paddle géant ou découverte du havre.
                            </p>
                            <ul className="space-y-3 mb-10">
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-turquoise" /> Flotte adaptée tous âges
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <CheckCircle2 size={16} className="text-turquoise" /> Souvenirs inoubliables
                                </li>
                            </ul>
                            <Link href="/infos-pratiques" className="w-full py-4 rounded-2xl bg-slate-50 text-abysse font-black uppercase tracking-widest text-[9px] hover:bg-turquoise hover:text-white transition-all border border-slate-100 flex items-center justify-center gap-2">
                                Nous contacter <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION CTA : CONTACT DIRECT */}
            <section className="py-32 container mx-auto px-6 max-w-[1200px]">
                <div className="bg-abysse rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center shadow-[0_50px_100px_-20px_rgba(0,43,73,0.4)]">
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-6113881432c6?q=80&w=1600"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                        alt="Contact groups"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-abysse/50 to-abysse"></div>

                    <div className="relative z-10">
                        <span className="text-turquoise font-black uppercase tracking-[0.4em] text-[10px] mb-8 block">Projet sur-mesure</span>
                        <h2 className="text-4xl md:text-6xl text-white leading-none mb-10 max-w-3xl">
                            Prêt à créer votre propre <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">Événement ?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/infos-pratiques"
                                className="px-10 py-5 bg-white text-abysse rounded-full font-black uppercase tracking-widest text-xs hover:bg-turquoise hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
                            >
                                <Mail size={18} /> Demande de Devis
                            </Link>
                            <a
                                href="tel:0233471481"
                                className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-abysse transition-all flex items-center justify-center gap-3"
                            >
                                <span className="material-symbols-outlined text-lg">phone_in_talk</span> 02 33 47 14 81
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GroupesPage;
