"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
    X,
    Heart,
    Phone,
    ExternalLink
} from 'lucide-react';
import { Activity, ActivityCategory } from '../../../types';

import { motion, AnimatePresence } from 'framer-motion';
import { ActivityGallery } from '../../../components/ActivityGallery';
import { PortableText } from '@portabletext/react';
import { PageHero } from '@/components/PageHero';
import ClubActivitiesView from '@/components/ClubActivitiesView';
import { ActivityFinder } from '../../../components/ActivityFinder';
import Link from 'next/link';

interface ActivitiesClientProps {
    initialActivities: Activity[];
    initialActivitiesData: any;
}

const modalPortableTextComponents = {
    marks: {
        link: ({ value, children }: any) => {
            const href: string = value?.href || '';
            const isTel = href.startsWith('tel:');
            const isExternal = href.startsWith('http');
            if (isTel) {
                return (
                    <a
                        href={href}
                        className="inline-flex items-center gap-2 font-black text-abysse hover:text-turquoise transition-colors"
                    >
                        <Phone size={14} className="shrink-0" />
                        {children}
                    </a>
                );
            }
            if (isExternal) {
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-turquoise underline underline-offset-2 hover:text-abysse transition-colors"
                    >
                        {children}
                        <ExternalLink size={12} className="shrink-0" />
                    </a>
                );
            }
            return (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 font-bold text-turquoise underline underline-offset-2 hover:text-abysse transition-colors"
                >
                    {children}
                </Link>
            );
        },
        strong: ({ children }: any) => <strong className="font-black text-abysse">{children}</strong>,
    },
    block: {
        normal: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
    },
};

const ActivitiesClient: React.FC<ActivitiesClientProps> = ({ initialActivities, initialActivitiesData }) => {
    const activities = initialActivities;
    const activitiesData = initialActivitiesData;
    const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'TOUTES'>('TOUTES');
    const [viewMode, setViewMode] = useState<'activities' | 'club'>('activities');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchAge, setSearchAge] = useState<number | null>(null);
    const [searchFormat, setSearchFormat] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // -- DEEP LINKING SUPPORT --
    useEffect(() => {
        const modeParam = searchParams.get('mode');
        if (modeParam === 'club') {
            setViewMode('club');
            return;
        }

        const catParam = searchParams.get('cat');
        if (catParam) {
            const catMap: Record<string, string> = {
                'bien-etre': 'Bien-être',
                'bien-être': 'Bien-être',
                'securite': 'Sécurité',
                'sécurité': 'Sécurité',
                'toutes': 'TOUTES'
            };
            const normalizedParam = catParam.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const validCats = ['TOUTES', 'Sensations', 'Voile', 'Jeunesse', 'Bien-être', 'Sécurité'];
            const exactMatch = validCats.find(c => c === catParam);
            if (exactMatch) { setActiveFilter(exactMatch as any); return; }
            const mappedMatch = catMap[catParam.toLowerCase()];
            if (mappedMatch) { setActiveFilter(mappedMatch as any); return; }
            const fuzzyMatch = validCats.find(c =>
                c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedParam
            );
            if (fuzzyMatch) { setActiveFilter(fuzzyMatch as any); }
        }

        const openParam = searchParams.get('open');
        if (openParam) {
            setExpandedId(openParam);
            // Scroll vers l'activité après le rendu
            setTimeout(() => {
                const el = document.getElementById(openParam);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }, [searchParams]);

    const filteredActivities = useMemo(() => {
        let result = activities;
        
        if (activeFilter !== 'TOUTES') {
            result = result.filter(a => a.category === activeFilter);
        }
        
        if (searchAge) {
            result = result.filter(a => {
                const minReq = a.minAge || 0;

                // Si l'utilisateur est trop jeune
                if (minReq > searchAge) return false;

                // Si c'est une activité explicitement orientée "très jeunes" (Jardin des mers, Mini-mousses)
                // On évite de les montrer aux ados/adultes.
                // Règle: Si searchAge >= minReq + 4 pour les catégories Jeunesse, on exclut.
                if (a.category === 'Jeunesse') {
                    if (searchAge >= minReq + 4) return false;
                }
                
                // Sécurité forte pour ne rien montrer en "Jeunesse" aux vrais adultes.
                if (searchAge >= 16 && a.category === 'Jeunesse') return false;
                
                return true;
            });
        }
        
        if (searchFormat) {
            result = result.filter(a => {
                const config = a.actions?.[searchFormat as 'stage' | 'reservation' | 'rental'];
                const isActive = config ? config.isActive : true; // Par défaut True comme défini dans Sanity et le composant ActionButton.
                return isActive !== false; // Uniquement si ce n'est pas explicitement désactivé
            });
        }
        
        return result;
    }, [activeFilter, activities, searchAge, searchFormat]);

    const handleSearch = (age: number | null, category: string | null, format: string | null) => {
        setSearchAge(age);
        setSearchFormat(format);
        if (category) {
            setActiveFilter(category as any);
        } else if (age !== null && activeFilter === 'TOUTES') {
            // garder tous les filtres si juste on cherche par age
        }
        setViewMode('activities');
    };

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
            const template = action.template;
            setModalConfig({
                isOpen: true,
                title: template?.modalTitle || label,
                message: template?.content || action.message || [{ _type: 'block', children: [{ _type: 'span', text: "Contactez le club pour plus d'informations." }] }]
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
                                <PortableText value={modalConfig.message} components={modalPortableTextComponents} />
                            </div>
                            <button
                                onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                className="w-full py-4 bg-abysse text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-turquoise transition-all"
                            >
                                Fermer
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 1. HERO HEADER */}
            <PageHero
                image={hero?.heroImage || "https://images.unsplash.com/photo-1513326738677-b93060cf2c0b?q=80&w=2000"}
                imageAlt="Water Activities"
                tagIcon={<Compass size={14} />}
                tagText="Saison en cours"
                title={hero?.title || "Catalogue"}
                subtitle={hero?.subtitle || "Activités."}
            />

            {/* 2. BARRE DE FILTRES (STICKY) */}
            <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-4">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-center items-center gap-2 md:gap-4">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {['TOUTES', 'Sensations', 'Voile', 'Jeunesse', 'Bien-être', 'Sécurité'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setViewMode('activities');
                                    setActiveFilter(cat as any);
                                }}
                                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${viewMode === 'activities' && activeFilter === cat
                                    ? 'bg-abysse text-white border-abysse shadow-lg scale-105'
                                    : 'bg-white text-slate-400 border-slate-100 hover:border-turquoise hover:text-turquoise hover:bg-slate-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>

                    <button
                        onClick={() => setViewMode('club')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 relative overflow-hidden group ${viewMode === 'club'
                            ? 'bg-linear-to-r from-abysse to-turquoise text-white border-transparent shadow-xl scale-105'
                            : 'bg-white text-abysse border-slate-200 hover:border-turquoise transition-all'
                            }`}
                    >
                        Le Club à l'année
                        {viewMode !== 'club' && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-turquoise group-hover:w-full transition-all"></span>
                        )}
                    </button>
                </div>
            </section>

            {/* 1.5 ACTIVITY FINDER ENGINE */}
            <div className="relative z-30 max-w-[1400px] mx-auto px-4 md:px-6 py-8">
                 <ActivityFinder onSearch={handleSearch} />
            </div>

            {/* 3. CONTENT AREA */}
            <section id="activities-list" className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 scroll-mt-24">
                <AnimatePresence mode="wait">
                    {viewMode === 'club' ? (
                        <motion.div
                            key="club-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <ClubActivitiesView data={activitiesData?.yearlyClub} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="activities-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {filteredActivities.map((activity) => {
                                const isExpanded = expandedId === activity.id;
                                return (
                                    <div
                                        key={activity.id}
                                        id={activity.id}
                                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="relative lg:w-[35%] min-h-[300px] lg:min-h-[380px]">
                                                <ActivityGallery
                                                    images={activity.gallery}
                                                    defaultImage={activity.image}
                                                    alt={activity.title}
                                                />
                                                <div className="absolute inset-0 pointer-events-none">
                                                    <div className="absolute top-0 left-0">
                                                        <div className="bg-abysse/25 backdrop-blur-md text-white px-5 py-4 rounded-br-2xl border-b border-r border-white/20 flex flex-col items-center">
                                                            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/80 mb-1 leading-none">À partir de</span>
                                                            <span className="text-2xl font-black italic tracking-tighter leading-none">{activity.minAge} ans</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-6 right-6">
                                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{activity.category}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                                                <div className="flex flex-col lg:flex-row justify-between gap-8">
                                                    <div className="flex-1">
                                                        <h2 className="text-2xl md:text-3xl text-abysse mb-3">{activity.title}</h2>
                                                        <p className="text-turquoise text-xs font-black uppercase tracking-widest mb-6 leading-relaxed">"{activity.accroche}"</p>
                                                        <div className="text-slate-600 font-medium text-sm leading-loose mb-6 text-justify prose prose-slate prose-sm max-w-none">
                                                            {activity.experience ? (
                                                                Array.isArray(activity.experience) ? <PortableText value={activity.experience} /> : <p>{activity.experience}</p>
                                                            ) : <p>{activity.description}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3 min-w-[220px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                                        <ActionButton activity={activity} type="stage" icon={Calendar} label="S'inscrire en Stage" />
                                                        <ActionButton activity={activity} type="reservation" icon={Wind} label="Réserver Séance" />
                                                        <ActionButton activity={activity} type="rental" icon={Anchor} label="Louer le matériel" />
                                                        <div className="h-px bg-slate-100 my-2"></div>
                                                        <button
                                                            onClick={() => toggleExpand(activity.id)}
                                                            className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${isExpanded ? 'bg-abysse text-white' : 'bg-turquoise text-white hover:bg-abysse shadow-turquoise/20'}`}
                                                        >
                                                            {isExpanded ? 'Masquer les infos' : 'Voir Détails & Tarifs'}
                                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`grid transition-all duration-500 ease-in-out bg-slate-50 ${isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                                                    <div>
                                                        <h4 className="flex items-center gap-3 text-sm text-abysse mb-6"><GraduationCap size={18} className="text-turquoise" /> Pédagogie</h4>
                                                        <div className="text-sm text-slate-600 font-medium leading-relaxed text-justify">{activity.pedagogie || "Une progression individualisée grâce au livret de voile FFV."}</div>
                                                    </div>
                                                    <div>
                                                        <h4 className="flex items-center gap-3 text-sm text-abysse mb-6"><Euro size={18} className="text-turquoise" /> Tarifs</h4>
                                                        <ul className="space-y-3">
                                                            {(activity.prices || []).map((price, idx) => (
                                                                <li key={idx} className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                                                                    <span className="text-xs font-bold text-slate-500 uppercase">{price.label}</span>
                                                                    <span className="text-sm font-black text-abysse">{price.value}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="flex items-center gap-3 text-sm text-abysse mb-6"><CheckCircle2 size={18} className="text-turquoise" /> Pratique</h4>
                                                        <ul className="space-y-2">
                                                            {(activity.logistique || []).map((item, idx) => (
                                                                <li key={idx} className="flex items-start gap-2">
                                                                    <div className="mt-1 size-1.5 rounded-full bg-turquoise shrink-0"></div>
                                                                    <span className="text-xs font-medium text-slate-600">{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default ActivitiesClient;
