"use client";

import Link from 'next/link';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import {
    Anchor,
    Users,
    History,
    Trophy,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    Camera,
    MapPin,
    UserCheck,
    Building,
    Accessibility,
    Download,
    Quote,
    Megaphone,
    LifeBuoy,
    CheckCircle2,
    GraduationCap,
    ShieldCheck,
    Leaf,
    Compass,
    Zap,
    Sprout,
    Sparkles,
    Waves,
    Wind,
    Clock,
    X
} from 'lucide-react';
import * as AllLucideIcons from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { SecondaryNav } from '@/components/SecondaryNav';
import { PageHero } from '@/components/PageHero';
import { ActivityGallery } from '@/components/ActivityGallery';

import { AgendaSection, AgendaEvent } from '@/types';

const RenderText = ({ content, className, fallback = null }: { content: string | any[] | undefined, className?: string, fallback?: React.ReactNode }) => {
    if (!content) return fallback ? <div className={className}>{fallback}</div> : null;
    if (typeof content === 'string') {
        return <div className={className}>{content}</div>;
    }
    return (
        <div className={`prose prose-slate max-w-none ${className}`}>
            <PortableText value={content} />
        </div>
    );
};

// --- ICON RESOLVER ---
const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
    History, Users, Anchor, Trophy, GraduationCap, Accessibility, ShieldCheck, Leaf, Compass, Zap, Sprout, Sparkles,
    Camera, MapPin, UserCheck, Building, Download, Quote, Megaphone, LifeBuoy, CheckCircle2
};

const resolveIcon = (name?: string, fallback?: React.FC<{ size?: number }>) => {
    if (!name) return fallback || null;
    if (ICON_MAP[name]) return ICON_MAP[name];
    const DynamicIcon = (AllLucideIcons as any)[name];
    if (DynamicIcon) return DynamicIcon;
    return fallback || null;
};

// --- FALLBACK DATA ---
const FALLBACK_HERO_STATS = [
    { label: 'Depuis', value: '1978', sublabel: 'Héritage marin', iconName: 'History', style: 'solid' as const },
    { label: 'Communauté', value: '450 Adhérents', sublabel: 'Une grande famille', iconName: 'Users', style: 'glass' as const },
];

const FALLBACK_VALUES = [
    { title: "Transmission", description: "Un savoir-faire pédagogique reconnu pour accompagner chaque marin, du débutant à l'expert.", iconName: "GraduationCap" },
    { title: "Inclusion", description: "Le label \"Tourisme & Handicap\" au cœur de notre identité, pour que la mer soit accessible à tous.", iconName: "Accessibility" },
    { title: "Engagement", description: "Une gestion associative responsable et une sensibilisation permanente à la protection du littoral.", iconName: "ShieldCheck" }
];

const FALLBACK_STORYTELLING = [
    { chapterLabel: 'Chapitre I', title: "L'Appel du", highlightText: 'Large.', quote: '"Depuis 1978, notre cœur bat au rythme des marées. Une institution née de la passion pure."', image: '/images/imgBank/CataPharePointeAgon.jpg' },
    { chapterLabel: 'Chapitre II', title: 'Vibration', highlightText: 'Brute.', quote: '"Le sel sur la peau, le vent qui siffle. Ici, on fusionne avec les éléments."', image: '/images/imgBank/naviguer.jpg' },
    { chapterLabel: 'Chapitre III', title: 'Cap sur', highlightText: 'L\'Avenir.', quote: '"Un sillage durable, inclusif et audacieux. Rejoignez The Club Nautique de Coutainville."', image: '/images/imgBank/Sauvetage.jpg', isFinalChapter: true },
];

const FALLBACK_TEAM = {
    tag: "L'Humain avant tout",
    title: "Une Équipe D'Experts",
    boardMembers: [
        { name: "Jean-Pierre Marin", role: "Président", image: "https://i.pravatar.cc/150?u=jp" },
        { name: "Marie Loic", role: "Trésorière" },
        { name: "Paul Dubreuil", role: "Secrétaire" },
    ],
    proTeam: [
        { name: "Sophie Mer", role: "Chef de Base", image: "https://i.pravatar.cc/150?u=sophie" },
        { name: "Thomas Vent", role: "Second de Base", image: "https://i.pravatar.cc/150?u=thomas" },
        { name: "Lucie Glisse", role: "Monitrice", image: "https://i.pravatar.cc/150?u=lucie" },
        { name: "Marc Flot", role: "Équipier", image: "https://i.pravatar.cc/150?u=marc" },
    ],
    caMembers: ["Emmanuel COIFTIER", "Brice LAVARENNE", "Annabelle TANDEO"]
};

const FALLBACK_SITE = {
    title: "Un Balcon sur la Mer",
    description: "Notre bâtiment, entièrement rénové, offre des conditions d'accueil optimales. Tout est pensé pour votre confort.",
    facilities: ["Club-House panoramique", "Accès direct plage", "Vestiaires chauffés", "Cale privée sécurisée"],
    image: "https://images.unsplash.com/photo-1516126489370-179ee771ae35?q=80&w=1200",
    imageCaption: "Vue Imprenable",
    imageSublabel: "Face aux Îles Chausey"
};

const FALLBACK_FLEET_DATA = [
    {
        name: 'Catamaran', subtitle: 'La Référence', crew: "Solo / Double",
        gallery: ['https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2000&auto=format&fit=crop'],
        stats: { speed: 95, difficulty: 60, adrenaline: 90 },
        description: "Du Topaz 10 pour l'initiation au Hobie Cat 16 pour la performance.",
    },
    {
        name: 'Char à Voile', subtitle: 'Vitesse Pure', crew: "Monoplace",
        gallery: ['https://images.unsplash.com/photo-1620658408066-89b531405a8b?q=80&w=2000&auto=format&fit=crop'],
        stats: { speed: 85, difficulty: 40, adrenaline: 80 },
        description: "Pilotez au ras du sable. Accélération immédiate dès 8 ans.",
    },
    {
        name: 'Wing & Kite', subtitle: 'Nouvelle Vague', crew: "Solo",
        gallery: ['https://images.unsplash.com/photo-1612459957245-0d0458df8643?q=80&w=2000&auto=format&fit=crop'],
        stats: { speed: 70, difficulty: 95, adrenaline: 100 },
        description: "Voler au-dessus de l'eau. Matériel F-One & Duotone.",
    },
];

const FALLBACK_AGENDA: AgendaEvent[] = [
    { title: 'Régate Départementale', startDate: '2026-07-12', badge: 'Compétition', time: '09:00 - 17:00', image: '/images/imgBank/Cata001.jpg', description: "Une journée intense de compétition pour tous les niveaux. Inscriptions sur place." },
    { title: 'Barbecue du Club', startDate: '2026-07-15', badge: 'Adhérents', time: 'À partir de 19:30', description: "Moment de convivialié partagé sur la terrasse du club. Apportez vos grillades !" },
    { title: 'Sortie aux Îles', startDate: '2026-07-22', badge: 'Plaisance', time: '10:00 - 18:00', description: "Navigation groupée vers les îles Chausey. Briefing à 9h30." },
    { title: 'Nettoyage littoral', startDate: '2026-07-28', badge: 'Écologie', time: '14:00 - 16:00', image: '/images/imgBank/Navigation.jpg', description: "Action citoyenne pour préserver notre terrain de jeu. Gants fournis." },
    { title: 'Fête de la Mer', startDate: '2026-08-05', badge: 'Événement', time: 'Toute la journée', description: "Grande parade nautique, stands et concerts en soirée. Ouvert à tous." },
    { title: 'Stage Perf', startDate: '2026-08-10', badge: 'Voile', time: '09:30 - 16:30', description: "Perfectionnement en Catamaran pour les ados. Niveau 3 requis." },
];

const FALLBACK_VOLUNTEERING = {
    title: "Devenez Bénévole",
    text: "Le club a besoin de vous ! Participez à l'organisation de nos événements et moments festifs.",
    buttonLabel: "S'engager",
    buttonLink: "/infos-pratiques"
};

const FALLBACK_SOUVENIRS = [
    { id: 1, image: '/images/imgBank/CataPharePointeAgon.jpg', title: 'Régate d\'été', date: '1974', decade: '1970' },
    { id: 2, image: '/images/imgBank/EcoleVoile.jpg', title: 'École de voile', date: '2023', decade: '2020' },
    { id: 3, image: '/images/imgBank/naviguer.jpg', title: 'Soirée au ponton', date: '2022', decade: '2020' },
    { id: 4, image: '/images/imgBank/Sauvetage.jpg', title: 'Coupe d\'Automne', date: '2021', decade: '2020' },
    { id: 5, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200', title: 'Matinée au port', date: '2020', decade: '2020' },
    { id: 6, image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?q=80&w=1200', title: 'Équipage vainqueur', date: '1984', decade: '1980' },
    { id: 7, image: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1200', title: 'Croisière aux îles', date: '1978', decade: '1970' },
    { id: 8, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200', title: 'Journée carénage', date: '1995', decade: '1990' },
    { id: 9, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200', title: 'Session Matinale', date: '1988', decade: '1980' },
];

const DECADES = [
    { label: 'Hasard', value: 'all' },
    { label: '70s', value: '70s' },
    { label: '80s', value: '80s' },
    { label: '90s', value: '90s' },
    { label: '00s', value: '00s' },
    { label: '10s', value: '10s' },
    { label: '20s', value: '20s' },
];

// --- NAVIGATION ANCRES ---
const SECTIONS = [
    { id: 'identity', label: 'Identité' },
    { id: 'life', label: 'Vie du Club' },
    { id: 'souvenirs', label: 'Souvenirs' },
    { id: 'team', label: 'L\'Équipe' },
    { id: 'site', label: 'Le Site' },
    { id: 'fleet', label: 'La Flotte' },
];

interface ClubClientProps {
    initialClubData: any;
}

const ClubClient: React.FC<ClubClientProps> = ({ initialClubData }) => {
    const clubData = initialClubData;

    // Resolve data with fallbacks
    const hero = clubData?.hero;
    const heroStats = clubData?.heroStats || FALLBACK_HERO_STATS;
    const identityTitle = clubData?.identityTitle || "Notre Projet :\nL'Horizon pour Tous";
    const values = clubData?.values || FALLBACK_VALUES;
    const storytelling = clubData?.storytelling || FALLBACK_STORYTELLING;
    const storytellingCta = clubData?.storytellingCta || { label: 'Nous Rejoindre', link: '/infos-pratiques' };
    const teamData = clubData?.team || FALLBACK_TEAM;
    const siteData = clubData?.site || FALLBACK_SITE;
    const fleetTitle = clubData?.fleet?.title || "L'Armada du CNC";
    const fleetItems = clubData?.fleet?.items || FALLBACK_FLEET_DATA;
    const ctaData = clubData?.cta || { title: 'Envie de', highlightText: 'Naviguer ?', buttonLabel: 'Nous Rejoindre', buttonLink: '/infos-pratiques' };

    // Agenda State
    const agendaData: AgendaSection = clubData?.agenda || {
        title: "Nos prochains",
        highlightText: "rendez-vous",
        description: "Le club vit toute l'année. Ne manquez pas nos événements phares, régates et moments de convivialité.",
        events: FALLBACK_AGENDA,
        volunteering: FALLBACK_VOLUNTEERING
    };
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [hasScroll, setHasScroll] = useState(false);
    const eventsScrollRef = useRef<HTMLDivElement>(null);

    const filteredAgendaEvents = useMemo(() => {
        const events = [...agendaData.events]
            .filter((e: AgendaEvent) => !e.isVolunteerCard && e.startDate)
            .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

        const now = new Date();
        const currentYearMonth = now.toISOString().slice(0, 7);

        // Always show all upcoming events (from the current month onwards)
        return events.filter(e => e.startDate!.slice(0, 7) >= currentYearMonth);
    }, [agendaData.events]);

    const uniqueMonths = useMemo(() => {
        return Array.from(new Set(
            filteredAgendaEvents.map((e: AgendaEvent) => e.startDate!.slice(0, 7))
        )) as string[];
    }, [filteredAgendaEvents]);

    // Handle URL Hash Scroll
    useEffect(() => {
        const handleHashScroll = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    // Slight delay to ensure dynamic content is rendered and layout is stable
                    setTimeout(() => {
                        const headerOffset = 100; // Account for sticky header + spacing
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                        });
                    }, 100);
                }
            }
        };

        // Run on mount
        handleHashScroll();

        // Also listen for hash changes
        window.addEventListener('hashchange', handleHashScroll);
        return () => window.removeEventListener('hashchange', handleHashScroll);
    }, []);

    // Set initial month and handle scroll
    useEffect(() => {
        if (uniqueMonths.length > 0) {
            // Set initial selected month to the first upcoming month if not set
            if (!selectedMonth || !uniqueMonths.includes(selectedMonth)) {
                const now = new Date();
                const currentYM = now.toISOString().slice(0, 7);
                const initial = uniqueMonths.find(m => m >= currentYM) || uniqueMonths[0];
                setSelectedMonth(initial);
            } else if (eventsScrollRef.current) {
                // If a month is selected and the scroll container is ready, scroll to it
                const container = eventsScrollRef.current;
                const targetElement = container.querySelector(`[data-month="${selectedMonth}"]`) as HTMLElement;

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop;
                    container.scrollTo({ top: Math.max(0, offsetTop - 40), behavior: 'smooth' });
                }
            }
        } else if (!selectedMonth) {
            const now = new Date();
            setSelectedMonth(now.toISOString().slice(0, 7));
        }
    }, [uniqueMonths, selectedMonth]);

    useEffect(() => {
        const checkScroll = () => {
            if (eventsScrollRef.current) {
                const { scrollHeight, clientHeight } = eventsScrollRef.current;
                setHasScroll(scrollHeight > clientHeight);
            }
        };

        checkScroll();
        const timer = setTimeout(checkScroll, 100);
        window.addEventListener('resize', checkScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkScroll);
        };
    }, [filteredAgendaEvents]);

    // Souvenirs State
    const souvenirsData = clubData?.souvenirs || { title: "Souvenirs", highlightText: "du Club", description: "Revivez les moments magiques et l'histoire de notre communauté nautique à travers les époques.", items: FALLBACK_SOUVENIRS };
    const [activeDecade, setActiveDecade] = useState('all');
    const [souvenirs, setSouvenirs] = useState<any[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const sourceItems = souvenirsData.items || [];
        const filtered = activeDecade === 'all'
            ? [...sourceItems]
            : sourceItems.filter((s: any) => s.decade === activeDecade);

        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setSouvenirs(shuffled.slice(0, 6));
    }, [activeDecade, clubData]);

    const shuffleSouvenirs = () => {
        const sourceItems = souvenirsData.items || [];
        const filtered = activeDecade === 'all'
            ? [...sourceItems]
            : sourceItems.filter((s: any) => s.decade === activeDecade);

        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setSouvenirs(shuffled.slice(0, 6));
    };

    return (
        <div className="w-full font-sans bg-white pb-32">

            {/* 1. HERO HEADER */}
            <PageHero
                image={hero?.heroImage || "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=2000"}
                imageAlt="Sailing Club"
                tagIcon={<Anchor size={14} />}
                tagText="Association Loi 1901"
                title={hero?.title || "Bienvenue au"}
                subtitle={hero?.subtitle || "Club Nautique."}
            >
                {heroStats.map((stat: any, i: number) => {
                    const IconComp = resolveIcon(stat.iconName);
                    const isSolid = stat.style === 'solid';
                    return (
                        <div key={i} className={isSolid
                            ? "bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-[280px]"
                            : "bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-[280px]"
                        }>
                            <div className={`size-16 rounded-2xl flex items-center justify-center shrink-0 ${isSolid ? 'bg-abysse text-white shadow-lg' : 'bg-white/10 text-white'}`}>
                                {IconComp && <IconComp size={32} />}
                            </div>
                            <div className="text-left">
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${isSolid ? 'text-slate-400' : 'text-white/40'}`}>{stat.label}</p>
                                <p className={isSolid
                                    ? "text-4xl font-black text-abysse tracking-tighter"
                                    : "text-3xl font-black text-white uppercase italic leading-none"
                                }>{stat.value}</p>
                                <p className={`text-[10px] font-bold mt-1 uppercase ${isSolid ? 'text-slate-400' : 'text-white/60 italic'}`}>{stat.sublabel}</p>
                            </div>
                        </div>
                    );
                })}
            </PageHero>

            {/* 2. MENU SECONDAIRE STICKY */}
            <SecondaryNav sections={SECTIONS} />

            {/* 3. IDENTITÉ & VALEURS */}
            <section id="identity" className="py-16 px-6 max-w-[1400px] mx-auto">
                <div className="mb-12">
                    <div className="w-16 h-1 bg-turquoise rounded-full mb-6"></div>
                    <h2 className="text-3xl md:text-4xl text-abysse mb-6 leading-[0.9] whitespace-pre-line">
                        {identityTitle}
                    </h2>
                    <RenderText
                        content={hero?.description}
                        className="text-slate-600 text-lg font-medium max-w-2xl leading-relaxed"
                        fallback="Au Club Nautique de Coutainville (CNC), notre passion pour la mer s'exprime à travers un projet associatif solide et une vision moderne du nautisme."
                    />
                </div>

                <div className="mb-24">
                    <div className={`grid grid-cols-1 ${values.length === 1 ? 'md:grid-cols-1 max-w-4xl mx-auto' : values.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-3'} gap-8`}>
                        {values.map((val: any, idx: number) => {
                            const IconComp = resolveIcon(val.iconName);
                            return (
                                <div key={idx} className="bg-slate-50 p-8 md:p-12 rounded-4xl border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                    {IconComp && (
                                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-lg mb-8 group-hover:bg-abysse group-hover:text-white transition-colors">
                                            <IconComp size={32} />
                                        </div>
                                    )}
                                    <h4 className="text-3xl font-black italic tracking-tight uppercase text-abysse mb-6">{val.title}</h4>
                                    <RenderText content={val.description} className="text-slate-600 font-medium leading-relaxed prose-lg" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* BLOCK 2: LA VIE DU CLUB (AGENDA & BÉNÉVOLAT) */}
            <section id="life" className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-bl from-turquoise/5 to-transparent pointer-events-none" />

                <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

                        {/* Left Column: Intro & Volunteering CTA */}
                        <div className="lg:col-span-1 space-y-8">
                            <div id="agenda-title-zone">
                                <span className="text-turquoise font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Événements</span>
                                <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter mb-4 leading-tight">
                                    {agendaData.title} <br />
                                    <span className="text-turquoise">{agendaData.highlightText}</span>
                                </h2>
                                <RenderText content={agendaData.description} className="text-slate-500 text-sm md:text-base font-medium leading-relaxed" />
                            </div>

                            {/* MONTH NAVIGATOR — under title */}
                            {(() => {
                                const now = new Date();
                                const currentYM = now.toISOString().slice(0, 7);
                                const idx = uniqueMonths.indexOf(selectedMonth);
                                const effectiveIdx = idx !== -1 ? idx : Math.max(0, uniqueMonths.findIndex(m => m >= currentYM));

                                const goToPrev = () => { if (idx > 0) setSelectedMonth(uniqueMonths[idx - 1]); };
                                const goToNext = () => { if (idx < uniqueMonths.length - 1) setSelectedMonth(uniqueMonths[idx + 1]); };
                                const getLabel = () => {
                                    const ym = uniqueMonths[idx] || selectedMonth || currentYM;
                                    try {
                                        const [y, m] = ym.split('-');
                                        return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                                    } catch (e) { return ym; }
                                };

                                return (
                                    <div className="flex items-center bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
                                        <button
                                            onClick={goToPrev}
                                            disabled={idx <= 0}
                                            className={`px-4 py-4 transition-all border-r border-slate-100 ${idx > 0 ? 'text-abysse hover:bg-slate-50 hover:text-turquoise' : 'text-slate-200 cursor-default'}`}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex-1 py-3 px-4 flex flex-col items-center select-none">
                                            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-turquoise mb-0.5">Calendrier</span>
                                            <span className="text-sm font-black uppercase italic text-abysse tracking-tight">{getLabel()}</span>
                                            <div className="flex gap-1 mt-2">
                                                {uniqueMonths.map((m, i) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setSelectedMonth(m)}
                                                        className={`h-1 rounded-full transition-all duration-300 ${idx === i ? 'bg-turquoise w-4' : 'bg-slate-200 w-1 hover:bg-slate-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={goToNext}
                                            disabled={idx >= uniqueMonths.length - 1}
                                            className={`px-4 py-4 transition-all border-l border-slate-100 ${idx < uniqueMonths.length - 1 ? 'text-abysse hover:bg-slate-50 hover:text-turquoise' : 'text-slate-200 cursor-default'}`}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                );
                            })()}

                            {/* Compact Volunteering Card - Left Aligned */}
                            {(agendaData.volunteering || FALLBACK_VOLUNTEERING) && (
                                <div className="bg-abysse p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-turquoise/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="bg-white/5 size-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 mb-4">
                                        <Megaphone size={20} className="text-turquoise" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <h4 className="text-lg font-black text-white italic uppercase tracking-tight">
                                            {agendaData.volunteering?.title || "Devenez Bénévole"}
                                        </h4>
                                        <p className="text-white/60 text-xs font-medium leading-relaxed">
                                            {agendaData.volunteering?.text || "Le club a besoin de vous ! Participez à l'organisation de nos événements et moments festifs."}
                                        </p>
                                        <Link
                                            href={agendaData.volunteering?.buttonLink || "/infos-pratiques"}
                                            className="inline-block bg-turquoise text-abysse px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors w-full text-center"
                                        >
                                            {agendaData.volunteering?.buttonLabel || "S'engager"}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Cards + Anchor Scrollbar */}
                        <div className="lg:col-span-2 relative h-[700px]">

                            {/* SCROLLABLE AREA */}
                            <div id="scrollable-area" className="relative h-full">

                                {/* ANCHOR SCROLLBAR — centered on the column divider */}
                                {hasScroll && (
                                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 hidden md:block z-40 pointer-events-none">
                                        {/* Track line */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200" />

                                        {/* Anchor thumb — draggable */}
                                        <div
                                            id="anchor-thumb"
                                            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                const container = document.getElementById('events-scroll');
                                                const thumbEl = e.currentTarget;
                                                const trackEl = document.getElementById('scrollable-area');
                                                if (!container || !trackEl) return;

                                                const thumbSize = 64;
                                                const trackHeight = trackEl.offsetHeight - thumbSize;
                                                const startY = e.clientY;
                                                const startTop = parseFloat(thumbEl.style.top || '0');

                                                const onMove = (ev: MouseEvent) => {
                                                    const newTop = Math.min(trackHeight, Math.max(0, startTop + ev.clientY - startY));
                                                    thumbEl.style.top = `${newTop}px`;
                                                    const scrollMax = container.scrollHeight - container.offsetHeight;
                                                    container.scrollTop = (newTop / trackHeight) * scrollMax;
                                                };
                                                const onUp = () => {
                                                    document.body.style.cursor = '';
                                                    window.removeEventListener('mousemove', onMove);
                                                    window.removeEventListener('mouseup', onUp);
                                                };
                                                document.body.style.cursor = 'grabbing';
                                                window.addEventListener('mousemove', onMove);
                                                window.addEventListener('mouseup', onUp);
                                            }}
                                        >
                                            <div className="bg-abysse text-turquoise size-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-transform group relative">
                                                <span className="absolute inset-0 rounded-full bg-turquoise/20 animate-ping" />
                                                <Anchor size={26} className="group-hover:rotate-12 transition-transform relative z-10" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* EVENTS LIST */}
                                <div
                                    id="events-scroll"
                                    ref={eventsScrollRef}
                                    className="h-[700px] overflow-y-auto pb-10"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                                    onScroll={(e) => {
                                        const el = e.currentTarget;
                                        const scrollMax = el.scrollHeight - el.offsetHeight;
                                        if (scrollMax <= 0) return;
                                        const thumbEl = document.getElementById('anchor-thumb');
                                        const trackEl = document.getElementById('scrollable-area');
                                        if (!thumbEl || !trackEl) return;
                                        const trackHeight = trackEl.offsetHeight - 64;
                                        thumbEl.style.top = `${Math.round((el.scrollTop / scrollMax) * trackHeight)}px`;
                                    }}
                                >
                                    {filteredAgendaEvents.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 pt-1 pb-24">
                                            {filteredAgendaEvents.map((item: AgendaEvent, i: number) => {
                                                const dateObj = new Date(item.startDate!);
                                                const day = dateObj.getDate().toString();
                                                const monthLabel = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
                                                const isRight = i % 2 !== 0;
                                                const monthYM = item.startDate!.slice(0, 7);

                                                return (
                                                    <div key={item._key || i} data-month={monthYM} className={`relative ${isRight ? 'md:mt-28' : ''}`}>
                                                        <div className={`absolute top-8 size-2.5 rounded-full bg-turquoise/40 border-2 border-white shadow hidden md:block
                                                            ${isRight ? '-left-10 -translate-x-1/2' : '-right-10 translate-x-1/2'}`}
                                                        />

                                                        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group
                                                            ${i % 4 === 0 ? 'md:rotate-1' : i % 4 === 2 ? 'md:-rotate-1' : ''}`}>
                                                            <div className="p-6">
                                                                <div className="flex items-start gap-4 mb-4">
                                                                    <div className="bg-abysse rounded-xl w-14 h-14 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-abysse/20">
                                                                        <span className="text-xl font-black text-white leading-none">{day}</span>
                                                                        <span className="text-[8px] font-bold text-turquoise uppercase tracking-widest">{monthLabel}</span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-base font-black text-abysse uppercase italic leading-tight group-hover:text-turquoise transition-colors tracking-tighter">{item.title}</h3>
                                                                        <div className="flex items-center gap-1.5 mt-1">
                                                                            <Clock size={11} className="text-turquoise/60 shrink-0" />
                                                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{item.time}</span>
                                                                        </div>
                                                                    </div>
                                                                    {item.badge && (
                                                                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-turquoise bg-turquoise/5 px-2 py-1 rounded border border-turquoise/10 shrink-0">
                                                                            {item.badge}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="flex gap-4 items-start">
                                                                    <div className="flex-1 min-w-0">
                                                                        {item.description && (
                                                                            <div className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                                                                                <RenderText content={item.description} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {item.image && (
                                                                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-24 gap-4">
                                            <Anchor size={40} className="text-slate-200" />
                                            <p className="text-slate-400 font-black italic uppercase tracking-widest text-sm">Aucun événement ce mois-ci</p>
                                            <button
                                                onClick={() => {
                                                    const now = new Date();
                                                    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
                                                }}
                                                className="text-turquoise font-bold text-[11px] uppercase tracking-widest border-b border-turquoise/30 hover:border-turquoise transition-colors"
                                            >
                                                Revenir au mois en cours
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* BLOCK 3: SOUVENIRS DU CLUB (MAGAZINE GRID) */}
            <section id="souvenirs" className="py-24 px-6 bg-white relative overflow-hidden">

                <div className="max-w-[1400px] mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="text-turquoise font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Archives & Communauté</span>
                        <h2 className="text-4xl md:text-6xl font-black text-abysse uppercase italic tracking-tighter mb-4">
                            {souvenirsData.title} <span className="text-turquoise">{souvenirsData.highlightText}</span>
                        </h2>
                        <RenderText content={souvenirsData.description} className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed text-sm" />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <div className="flex flex-wrap justify-center gap-2">
                            {DECADES.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setActiveDecade(d.value)}
                                    className={`px-4 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest transition-all ${activeDecade === d.value
                                        ? 'bg-abysse text-turquoise shadow-lg shadow-abysse/20 -translate-y-0.5'
                                        : 'bg-white/80 text-slate-400 hover:bg-white hover:shadow-sm border border-slate-200/60'
                                        }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                        <div className="hidden sm:block w-px h-5 bg-slate-300/40" />
                        <button
                            onClick={shuffleSouvenirs}
                            className="group flex items-center gap-2 bg-white/80 border border-slate-200/60 px-4 py-2 rounded-full shadow-sm hover:shadow-lg hover:bg-abysse hover:border-abysse transition-all duration-300"
                        >
                            <Camera size={13} className="text-turquoise group-hover:text-turquoise transition-colors" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-turquoise transition-colors">Piocher au hasard</span>
                        </button>
                    </div>

                    {/* Magazine Grid */}
                    {souvenirs.length > 0 ? (
                        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-5 md:gap-6">
                            {souvenirs.slice(0, isMobile ? 3 : souvenirs.length).map((pic, idx) => {
                                const ROTS = [-1.5, 1, -0.5, 1.5, -1, 0.8];
                                const rot = ROTS[idx % ROTS.length];

                                return (
                                    <motion.div
                                        key={pic.id + '-' + activeDecade + '-' + idx}
                                        initial={{ opacity: 0, y: 40, rotate: rot * 2 }}
                                        animate={{ opacity: 1, y: 0, rotate: rot }}
                                        whileHover={{ scale: 1.04, rotate: 0, zIndex: 50, transition: { duration: 0.25, ease: 'easeOut' } }}
                                        transition={{ delay: idx * 0.07, type: 'spring', stiffness: 90, damping: 18 }}
                                        onClick={() => setSelectedPhoto(pic)}
                                        className="group relative cursor-zoom-in w-full sm:w-auto"
                                        style={{ zIndex: idx + 1 }}
                                    >
                                        {/* Polaroid card */}
                                        <div className="bg-white p-2.5 pb-10 shadow-lg shadow-slate-400/20 border border-slate-200/80 hover:shadow-xl hover:shadow-slate-400/30 transition-shadow duration-400">
                                            <div className="relative aspect-10/8 overflow-hidden bg-slate-100">
                                                <img
                                                    src={pic.image}
                                                    alt={pic.title}
                                                    className="w-full h-full object-cover filter sepia-[0.15] contrast-[1.05] saturate-[0.85] group-hover:sepia-0 group-hover:saturate-[1.05] group-hover:contrast-100 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] pointer-events-none" />
                                            </div>
                                            {/* Caption with year in text */}
                                            <div className="pt-2.5 px-1.5 text-center">
                                                <p className="font-['Swanky_and_Moo_Moo',cursive] text-lg md:text-xl text-abysse/75 leading-tight">
                                                    {pic.title}{pic.date ? `, ${pic.date}` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tape effect on hover */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-yellow-200/60 backdrop-blur-sm border border-yellow-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-1" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <Camera size={32} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium italic">Aucun souvenir pour cette période...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. ÉQUIPE */}
            < section id="team" className="py-24 px-6 bg-white" >
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-16">
                        <span className="text-turquoise font-black uppercase tracking-widest text-[9px] mb-3 block">{teamData.tag}</span>
                        <h2 className="text-3xl md:text-5xl text-abysse leading-none mb-6">{teamData.title}</h2>
                    </div>

                    {/* --- LE BUREAU --- */}
                    {teamData.boardMembers && teamData.boardMembers.length > 0 && (
                        <div className="mb-24">
                            <div className="flex items-center gap-4 mb-8">
                                <Users size={24} className="text-turquoise" />
                                <h3 className="text-2xl font-black text-abysse uppercase italic tracking-tighter">Le Bureau de l'Association</h3>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {teamData.boardMembers.map((member: any, i: number) => (
                                    <div key={i} className="group relative bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <div className="size-20 mx-auto mb-4 relative">
                                            {member.image ? (
                                                <img src={typeof member.image === 'string' ? member.image : urlFor(member.image).url()} alt={member.name} className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white group-hover:border-turquoise transition-colors" />
                                            ) : (
                                                <div className="w-full h-full rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white group-hover:border-turquoise transition-all">
                                                    <span className="text-xl font-black text-slate-400 group-hover:text-turquoise transition-colors">
                                                        {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <h5 className="text-abysse font-bold text-base leading-tight mb-1">{member.name}</h5>
                                            <p className="text-[10px] font-black text-turquoise uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- LE CONSEIL D'ADMINISTRATION --- */}
                    {teamData.caMembers && teamData.caMembers.length > 0 && (
                        <div className="mb-24">
                            <div className="flex items-center gap-4 mb-6">
                                <Users size={16} className="text-slate-300" />
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Conseil d'Administration</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {teamData.caMembers.map((member: string, i: number) => (
                                    <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-abysse font-bold text-sm hover:bg-white hover:border-turquoise hover:shadow-md transition-all cursor-default">
                                        {member}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- L'ÉQUIPE SPORTIVE --- */}
                    {teamData.proTeam && teamData.proTeam.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <Waves size={24} className="text-turquoise" />
                                <h3 className="text-2xl font-black text-abysse uppercase italic tracking-tighter">L'Équipe Sportive & Opérationnelle</h3>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {teamData.proTeam.map((member: any, i: number) => (
                                    <div key={i} className="group relative aspect-4/5 rounded-4xl overflow-hidden shadow-lg border border-slate-100">
                                        {member.image ? (
                                            <img src={typeof member.image === 'string' ? member.image : urlFor(member.image).url()} alt={member.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="absolute inset-0 bg-slate-200" />
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-abysse via-abysse/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                                            <p className="text-turquoise font-black uppercase tracking-[0.2em] text-[10px] mb-2">{member.role}</p>
                                            <h5 className="text-2xl font-black uppercase italic tracking-tighter">{member.name}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section >

            {/* 5. LE SITE */}
            <section id="site" className="py-24 px-6 relative overflow-hidden bg-white">
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                        {/* Left Content */}
                        <div className="w-full lg:w-5/12 space-y-8">
                            <div>
                                <span className="text-turquoise font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Infrastructures</span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-abysse leading-none uppercase italic tracking-tighter mb-6">
                                    {typeof siteData.title === 'string' ? (
                                        <>
                                            {siteData.title.split(' ').slice(0, -2).join(' ')} <br />
                                            <span className="text-turquoise">{siteData.title.split(' ').slice(-2).join(' ')}</span>
                                        </>
                                    ) : siteData.title}
                                </h2>
                                <div className="w-16 h-1.5 bg-turquoise rounded-full mb-8"></div>
                                <div className="text-slate-500 font-medium leading-relaxed text-sm lg:text-base whitespace-pre-line prose prose-slate">
                                    {typeof siteData.description === 'string' ? (
                                        <p>{siteData.description}</p>
                                    ) : (
                                        <PortableText value={siteData.description as any} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-6 border-t border-slate-100">
                                {siteData.facilities?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="bg-turquoise/10 p-1.5 rounded-full shrink-0 mt-0.5 group-hover:bg-turquoise transition-colors">
                                            <CheckCircle2 size={14} className="text-turquoise group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="font-bold text-abysse text-[11px] uppercase tracking-wider leading-snug pt-1">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Image Container - Asymmetric and floating */}
                        <div className="w-full lg:w-7/12 relative">
                            {/* Decorative background element */}
                            <div className="absolute -inset-4 md:-inset-8 bg-slate-50 rounded-[3rem] -z-10 transform rotate-2"></div>

                            <div className="relative aspect-4/3 w-full rounded-4xl overflow-hidden shadow-2xl border-12 border-white group">
                                <img
                                    src={siteData.image || ''}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    alt="Club Nautique Coutainville"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-abysse/80 via-transparent to-transparent opacity-60"></div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-abysse size-12 rounded-xl flex items-center justify-center shrink-0">
                                            <MapPin size={24} className="text-turquoise" />
                                        </div>
                                        <div>
                                            <span className="text-abysse font-black text-sm uppercase italic block tracking-tight">{siteData.imageCaption}</span>
                                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{siteData.imageSublabel}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Accent dots */}
                            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 hidden lg:flex flex-col gap-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="size-2 rounded-full bg-slate-200"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FLOTTE */}
            < section id="fleet" className="py-24 px-6 max-w-[1400px] mx-auto" >
                <div className="text-center mb-16">
                    <span className="text-turquoise font-black uppercase tracking-[0.3em] text-[10px] py-2 px-4 border border-turquoise/30 rounded-full mb-6 inline-block">Le Matériel</span>
                    <h2 className="text-4xl md:text-6xl font-black text-abysse uppercase italic tracking-tighter mb-4">{fleetTitle}</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">Découvrez les supports de navigation qui vous feront vibrer, sélectionnés pour allier sensations, sécurité et performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {fleetItems?.map((fleet: any, idx: number) => (
                        <div key={idx} className="group relative bg-white rounded-4xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                            {/* Image Header with ActivityGallery */}
                            <div className="relative h-72 lg:h-80 shrink-0 w-full bg-slate-100 overflow-hidden">
                                {fleet.gallery && fleet.gallery.length > 0 ? (
                                    <ActivityGallery
                                        images={fleet.gallery}
                                        defaultImage={fleet.gallery[0]}
                                        alt={fleet.name}
                                    />
                                ) : (
                                    <img src={fleet.gallery?.[0] || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={fleet.name} />
                                )}

                                <div className="absolute inset-0 bg-linear-to-t from-abysse/80 via-transparent to-transparent pointer-events-none" />

                                {/* Top Badge: Crew */}
                                <div className="absolute top-6 left-6 z-10">
                                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm shadow-abysse/10">
                                        <Users size={12} className="text-turquoise" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-abysse">
                                            {fleet.crew || "Non défini"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Block */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <span className="text-turquoise font-black uppercase tracking-widest text-[10px] mb-2 block">{fleet.subtitle}</span>
                                    <h3 className="text-3xl font-black text-abysse uppercase tracking-tighter italic leading-none">{fleet.name}</h3>
                                </div>

                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                                    {fleet.description}
                                </p>

                                {/* Stats Block (Bars) */}
                                {fleet.stats && (
                                    <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
                                        <div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-slate-400 flex items-center gap-2"><Wind size={12} className="text-abysse" /> Vitesse</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-linear-to-r from-turquoise/50 to-turquoise rounded-full transition-all duration-1000 ease-out" style={{ width: `${fleet.stats.speed || 0}%` }} />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-slate-400 flex items-center gap-2"><Anchor size={12} className="text-blue-500" /> Technicité</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out delay-100" style={{ width: `${fleet.stats.difficulty || 0}%` }} />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-slate-400 flex items-center gap-2"><Zap size={12} className="text-orange-500" /> Adrénaline</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-linear-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out delay-200" style={{ width: `${fleet.stats.adrenaline || 0}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* 10. CTA */}
            <section className="py-24 bg-abysse text-white text-center">
                <h2 className="text-4xl md:text-6xl mb-8">{ctaData.title} <span className="text-turquoise">{ctaData.highlightText}</span></h2>
                <Link href={ctaData.buttonLink} className="inline-flex items-center gap-4 bg-turquoise text-abysse px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-2xl">
                    {ctaData.buttonLabel} <ArrowRight size={18} />
                </Link>
            </section >

            {/* LIGHTBOX / MODAL */}
            <AnimatePresence>
                {
                    selectedPhoto && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPhoto(null)}
                            className="fixed inset-0 z-100 bg-abysse/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                        >
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                className="absolute top-8 right-8 text-white/50 hover:text-turquoise transition-colors"
                                onClick={() => setSelectedPhoto(null)}
                            >
                                <X size={40} />
                            </motion.button>

                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative max-w-5xl w-full bg-white p-4 pb-16 md:p-6 md:pb-24 shadow-2xl rounded-sm transform rotate-1"
                            >
                                <div className="relative aspect-auto max-h-[70vh] overflow-hidden rounded-xs">
                                    <img
                                        src={selectedPhoto.image}
                                        alt={selectedPhoto.title}
                                        className="w-full h-full object-contain bg-slate-50"
                                    />
                                </div>
                                <div className="absolute bottom-6 left-0 w-full text-center px-6">
                                    <h3 className="font-['Swanky_and_Moo_Moo',cursive] text-4xl md:text-6xl text-abysse leading-none">
                                        {selectedPhoto.title}{selectedPhoto.date ? `, ${selectedPhoto.date}` : ''}
                                    </h3>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );
};
export default ClubClient;
