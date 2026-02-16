"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Anchor,
    Wind,
    Waves,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Euro,
    GraduationCap,
    Clock,
    Calendar,
    Info,
    Compass,
    Sparkles,
    Users,
    X
} from 'lucide-react';
import { Activity, ActivityCategory } from '../../../types';
import { useContent } from '../../../contexts/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityGallery } from '../../../components/ActivityGallery';
import { PortableText } from '@portabletext/react';

const ActivitiesPageContent: React.FC = () => {
    const { activities, activitiesData } = useContent();
    const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'TOUTES'>('TOUTES');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // -- DEEP LINKING SUPPORT --
    useEffect(() => {
        const catParam = searchParams.get('cat');
        if (catParam) {
            // Check if it's a valid category or 'TOUTES'
            const validCats = ['TOUTES', 'Sensations', 'Voile', 'Jeunesse', 'Bien-être', 'Sécurité'];
            if (validCats.includes(catParam)) {
                setActiveFilter(catParam as any);
            }
        }
    }, [searchParams]);

    const filteredActivities = useMemo(() => {
        return activities.filter(a => activeFilter === 'TOUTES' || a.category === activeFilter);
    }, [activeFilter, activities]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const hero = activitiesData?.hero;
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: any[] }>({
        isOpen: false,
        title: '',
        message: []
    });

    const handleAction = (activity: Activity, action: any, label: string) => {
        if (!action || action.type === 'link') {
            const url = action?.url || activity.bookingUrl;
            if (url) window.open(url, '_blank');
        } else if (action.type === 'modal') {
            setModalConfig({
                isOpen: true,
                title: label,
                message: action.message || [{ _type: 'block', children: [{ _type: 'span', text: "Contactez le club pour plus d'informations." }] }]
            });
        }
    };

    const ActionButton = ({ activity, type, icon: Icon, label }: { activity: Activity, type: 'stage' | 'reservation' | 'rental', icon: any, label: string }) => {
        const config = activity.actions?.[type];
        const isActive = config ? config.isActive : true;

        return (
            <button
                disabled={!isActive}
                onClick={() => isActive && handleAction(activity, config, label)}
                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${isActive
                    ? 'bg-slate-50 text-abysse border-slate-200 hover:border-turquoise hover:text-turquoise cursor-pointer'
                    : 'bg-slate-100/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-60'
                    }`}
            >
                <Icon size={14} /> {label}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* MESSAGE MODAL */}
            <AnimatePresence>
                {modalConfig.isOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                            className="absolute inset-0 bg-abysse/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-turquoise/10 text-turquoise rounded-xl flex items-center justify-center">
                                        <Info size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-abysse uppercase italic tracking-tighter">
                                        {modalConfig.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                    className="size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-abysse transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="text-slate-600 font-medium leading-relaxed mb-8 prose prose-slate prose-sm text-justify">
                                <PortableText value={modalConfig.message} />
                            </div>
                            <button
                                onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                className="w-full py-4 bg-abysse text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-turquoise transition-all"
                            >
                                Compris
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 1. HERO HEADER - IMMERSIF */}
            <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-abysse">
                <div className="absolute inset-0 z-0">
                    <img
                        src={hero?.heroImage || "https://images.unsplash.com/photo-1513326738677-b93060cf2c0b?q=80&w=2000"}
                        className="w-full h-full object-cover opacity-50 scale-105"
                        alt="Water Activities"
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
                            <span className="text-[9px] font-black uppercase tracking-widest text-turquoise flex items-center gap-2">
                                <Compass size={14} /> Saison en cours
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.8]"
                        >
                            {hero?.title || "Catalogue"} <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">
                                {hero?.subtitle || "Activités."}
                            </span>
                        </motion.h1>
                    </div>
                </div>
            </section>

            {/* 2. BARRE DE FILTRES (STICKY) */}
            <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-4">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-center gap-2 md:gap-4">
                    {['TOUTES', 'Sensations', 'Voile', 'Jeunesse', 'Bien-être', 'Sécurité'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat as any)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat
                                ? 'bg-abysse text-white border-abysse shadow-lg scale-105'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-turquoise hover:text-turquoise hover:bg-slate-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* LISTE DES ACTIVITÉS */}
            <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 space-y-8">
                {filteredActivities.map((activity) => {
                    const isExpanded = expandedId === activity.id;

                    return (
                        <div
                            key={activity.id}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg"
                        >
                            {/* TOP PART : MAIN CARD */}
                            <div className="flex flex-col lg:flex-row">

                                {/* IMAGE (35%) */}
                                <div className="relative lg:w-[35%] min-h-[300px] lg:min-h-[380px]">
                                    <ActivityGallery
                                        images={activity.gallery}
                                        defaultImage={activity.image}
                                        alt={activity.title}
                                    />

                                    {/* BADGES */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* AGE BADGE - DISCREET CORNER GLASS (Balanced Contrast) */}
                                        <div className="absolute top-0 left-0">
                                            <div className="bg-abysse/25 backdrop-blur-md text-white px-5 py-4 rounded-br-2xl border-b border-r border-white/20 flex flex-col items-center">
                                                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/80 mb-1 leading-none">
                                                    À partir de
                                                </span>
                                                <span className="text-2xl font-black italic tracking-tighter leading-none">
                                                    {activity.minAge} ans
                                                </span>
                                            </div>
                                        </div>

                                        {/* CATEGORY BADGE - TOP RIGHT */}
                                        <div className="absolute top-6 right-6">
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                {activity.category}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT (65%) */}
                                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">

                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        {/* Text Info */}
                                        <div className="flex-1">
                                            <h2 className="text-2xl md:text-3xl text-abysse mb-3">
                                                {activity.title}
                                            </h2>
                                            <p className="text-turquoise text-xs font-black uppercase tracking-widest mb-6 leading-relaxed">
                                                "{activity.accroche}"
                                            </p>
                                            <div className="text-slate-600 font-medium text-sm leading-loose mb-6 text-justify prose prose-slate prose-sm max-w-none">
                                                {activity.experience ? (
                                                    Array.isArray(activity.experience)
                                                        ? <PortableText value={activity.experience} />
                                                        : <p>{activity.experience}</p>
                                                ) : (
                                                    <p>{activity.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions Column */}
                                        <div className="flex flex-col gap-3 min-w-[220px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                            {/* SECONDARY ACTIONS: IDENTICAL STYLE (Light) - NOW AT TOP */}
                                            <ActionButton activity={activity} type="stage" icon={Calendar} label="S'inscrire en Stage" />
                                            <ActionButton activity={activity} type="reservation" icon={Wind} label="Réserver Séance" />
                                            <ActionButton activity={activity} type="rental" icon={Anchor} label="Louer le matériel" />

                                            <div className="h-px bg-slate-100 my-2"></div>

                                            {/* PRIMARY ACTION: DETAILS (PROMINENT - SITE TURQUOISE) - NOW AT BOTTOM */}
                                            <button
                                                onClick={() => toggleExpand(activity.id)}
                                                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${isExpanded
                                                    ? 'bg-abysse text-white'
                                                    : 'bg-turquoise text-white hover:bg-abysse shadow-turquoise/20'
                                                    }`}
                                            >
                                                {isExpanded ? 'Masquer les infos' : 'Voir Détails & Tarifs'}
                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* EXPANDABLE DETAILS PANEL */}
                            <div
                                className={`grid transition-all duration-500 ease-in-out bg-slate-50 ${isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                                        {/* COL 1: LA FLOTTE */}
                                        <div>
                                            <h4 className="flex items-center gap-3 text-sm text-abysse mb-6">
                                                <Anchor size={18} className="text-turquoise" /> La Flotte
                                            </h4>
                                            <ul className="space-y-3">
                                                <li className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    <span className="block font-bold text-abysse mb-1">• Matériel Récent</span>
                                                    Renouvelé tous les 3 ans pour garantir sécurité et performance.
                                                </li>
                                                <li className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    <span className="block font-bold text-abysse mb-1">• Adapté au niveau</span>
                                                    Du support stable pour l'initiation au modèle sport pour la vitesse.
                                                </li>
                                                <li className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    <span className="block font-bold text-abysse mb-1">• Sécurité</span>
                                                    Bateaux de sécurité toujours sur l'eau et liaison radio.
                                                </li>
                                            </ul>
                                        </div>

                                        {/* COL 2: PÉDAGOGIE */}
                                        <div>
                                            <h4 className="flex items-center gap-3 text-sm text-abysse mb-6">
                                                <GraduationCap size={18} className="text-turquoise" /> Pédagogie
                                            </h4>
                                            <div className="text-xs text-slate-600 font-medium leading-relaxed text-justify">
                                                {activity.pedagogie ? activity.pedagogie : "Une progression individualisée grâce au livret de voile FFV. Nos moniteurs diplômés vous accompagnent vers l'autonomie en validant vos niveaux techniques."}
                                            </div>
                                        </div>

                                        {/* COL 3: TARIFS */}
                                        <div>
                                            <h4 className="flex items-center gap-3 text-sm text-abysse mb-6">
                                                <Euro size={18} className="text-turquoise" /> Tarifs
                                            </h4>
                                            <ul className="space-y-3">
                                                {(activity.prices || []).map((price, idx) => (
                                                    <li key={idx} className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                                                        <span className="text-xs font-bold text-slate-500 uppercase">{price.label}</span>
                                                        <span className="text-sm font-black text-abysse">{price.value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="mt-3 text-[10px] text-slate-400 italic leading-tight">
                                                * Les tarifs stages incluent la licence et l'adhésion temporaire.
                                            </p>
                                        </div>

                                        {/* COL 4: PRATIQUE */}
                                        <div>
                                            <h4 className="flex items-center gap-3 text-sm text-abysse mb-6">
                                                <CheckCircle2 size={18} className="text-turquoise" /> Pratique
                                            </h4>
                                            <ul className="space-y-2">
                                                {(activity.logistique || []).map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <div className="mt-1 size-1.5 rounded-full bg-turquoise shrink-0"></div>
                                                        <span className="text-xs font-medium text-slate-600">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {activity.isTideDependent && (
                                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-2">
                                                    <Waves size={16} className="text-blue-500 shrink-0" />
                                                    <p className="text-[10px] font-bold text-blue-800 leading-tight">
                                                        Activité dépendante de la marée. Horaires variables.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </section>

        </div>
    );
};

export const ActivitiesPage: React.FC = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-abysse flex items-center justify-center text-white">Chargement...</div>}>
            <ActivitiesPageContent />
        </Suspense>
    );
};

export default ActivitiesPage;
