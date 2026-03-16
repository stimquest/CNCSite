"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLiveStatus } from '../contexts/LiveStatusContext';

import { Compass, Wind, Leaf, Zap, Users, ArrowRight, LifeBuoy, GraduationCap, Briefcase, Medal, Siren, CheckCircle2, Wifi, ShoppingBag, Image, Radio, Bird, Waves, Youtube, Play, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoWallGallery } from '../components/PhotoWallGallery';
import { GamesSlideshow } from '../components/GamesSlideshow';
import PillarStory from '../components/PillarStory';
import { YouTubeBackground } from '../components/YouTubeBackground';
import PageNavigation from '../components/PageNavigation';
import { StatusDashboard } from '@/components/StatusDashboard';
import { FreshnessIndicator } from '@/components/FreshnessIndicator';
import { SpotConditionsBento } from '../components/SpotConditionsBento';
import { LogoComponent } from '../components/Logo';
import { DicoParents } from '../components/DicoParents';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { CharDiscoveryModal } from './CharDiscoveryModal';

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
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const HERO_IMAGES = [
    '/images/Hero/Ryan.webp',
    '/images/Hero/SunriseCata.webp',
    '/images/Hero/upscaled_char3.JPEG'
];

const CATEGORY_CONFIG: Record<string, { dot: string; color: string; label: string }> = {
    alert: { dot: 'bg-amber-400', color: 'text-amber-600', label: 'Alerte' },
    weather: { dot: 'bg-cyan-400', color: 'text-cyan-600', label: 'Météo' },
    event: { dot: 'bg-purple-400', color: 'text-purple-600', label: 'Événement' },
    vibe: { dot: 'bg-emerald-400', color: 'text-emerald-600', label: 'Ambiance' },
    info: { dot: 'bg-slate-300', color: 'text-slate-400', label: 'Info' },
};

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const PARTNERS = [
    { name: 'Région Normandie', logo: '/images/partenaires/Normandie.jpg', link: 'https://www.normandie.fr/' },
    { name: 'Département de la Manche', logo: '/images/partenaires/Manche.jpg', link: 'https://www.manche.fr/' },
    { name: 'Coutances Mer et Bocage', logo: '/images/partenaires/coutances.png', link: 'https://www.coutancesmeretbocage.fr/' },
    { name: 'Agon-Coutainville', logo: '/images/partenaires/coutainville.png', link: 'https://www.agoncoutainville.fr/' },
    { name: 'FFV', logo: '/images/partenaires/ffv.jpg', link: 'https://www.ffvoile.fr/' },
    { name: 'FFCV', logo: '/images/partenaires/ffcv.png', link: 'https://www.ffcv.org/' },
    { name: 'Agence Nationale du Sport', logo: '/images/partenaires/ANS.jpg', link: 'https://www.agencedusport.fr/' },
    { name: 'Union Européenne', logo: '/images/partenaires/FinanceUE.png', link: 'https://european-union.europa.eu/' },
    { name: '1 Jeune 1 Solution', logo: '/images/partenaires/1jeune1solution.jpg', link: 'https://www.1jeune1solution.gouv.fr/' },
    { name: 'Famille Plus', logo: '/images/partenaires/famillePlus.jpg', link: 'https://www.familleplus.fr/' },
    { name: 'FFSS', logo: '/images/partenaires/ffss.jpg', link: 'https://www.ffss.fr/' },
    { name: 'Tourisme & Handicap', logo: '/images/partenaires/tourismeHandicap.jpg', link: 'https://www.tourisme-handicaps.org/' },
];

const HeroCarouselItem = ({ image, isActive, photoYPos }: { image: string, isActive: boolean, photoYPos: any }) => (
    <AnimatePresence mode="popLayout">
        {isActive && (
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    opacity: { duration: 2.5, ease: "easeInOut" },
                    scale: { duration: 15, ease: "easeOut" }
                }}
                style={{
                    backgroundImage: `url('${image}')`,
                    backgroundSize: 'cover',
                    backgroundPositionX: 'center',
                    backgroundPositionY: photoYPos,
                }}
            />
        )}
    </AnimatePresence>
);

const HeroLogo = ({ homePageData }: { homePageData: any }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        const x = ((clientX - left) / width - 0.5) * 2;
        const y = ((clientY - top) / height - 0.5) * 2;
        setMousePos({ x, y });
    };

    return (
        <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            style={{ perspective: '1500px' }}
        >
            {/* Tilted Logo */}
            <motion.div
                className="relative w-[85vw] h-[35vh] md:w-[60vw] md:h-[50vh] flex items-center justify-center"
                animate={{
                    rotateX: mousePos.y * -15,
                    rotateY: mousePos.x * 15,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div
                    className="hero-logo-glass-layer logo-drop-shadow"
                    style={{
                        maskImage: "url('/images/LogoCNC2S.png')",
                        WebkitMaskImage: "url('/images/LogoCNC2S.png')"
                    }}
                />
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: `radial-gradient(circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                    }}
                    style={{
                        mixBlendMode: 'overlay',
                        maskImage: "url('/images/LogoCNC2S.png')",
                        WebkitMaskImage: "url('/images/LogoCNC2S.png')",
                        maskPosition: 'center',
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain'
                    }}
                />
            </motion.div>

            {/* Static Text - Now properly positioned under the logo */}
            <div className="flex flex-col items-center mt-8 md:mt-12 hero-subtitle pointer-events-none text-center">
                <RenderText
                    content={homePageData?.hero?.title}
                    className="text-white font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm"
                    fallback="Club Nautique de Coutainville"
                />
                <RenderText
                    content={homePageData?.hero?.subtitle}
                    className="text-white font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm mt-2 opacity-80"
                    fallback="Sauvetage et Secourisme"
                />
            </div>
        </div>
    );
};

export default function HomePageClient({ homePageData, dicoWords, homeGallery, infoMessages, upcomingEvents = [] }: any) {
    const {
        weather, statusMessage,
        spotStatus, lastPublishedAt, lastConfirmedAt,
        charStatus, charMessage, nautiqueStatus, nautiqueMessage,
        marcheStatus, marcheMessage,
        stagesMiniMoussesStatus, stagesMiniMoussesMessage,
        stagesMoussaillonsStatus, stagesMoussaillonsMessage,
        stagesInitiationStatus, stagesInitiationMessage,
        stagesPerfStatus, stagesPerfMessage
    } = useLiveStatus();

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [currentGlisseIndex, setCurrentGlisseIndex] = useState(0);
    const [currentWellbeingIndex, setCurrentWellbeingIndex] = useState(0);
    const [isCharModalOpen, setIsCharModalOpen] = useState(false);
    const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
    const [focusX, setFocusX] = useState(0);
    const focusWheelLockRef = useRef(false);
    const focusSectionRef = useRef<HTMLDivElement>(null);
    const focusSnapLockRef = useRef(false);

    const touchStartRef = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStartRef.current - touchEnd;
        if (Math.abs(diff) > 40) { // Seuil de 40px pour déclencher le slide
            if (diff > 0) navigateFocus(Math.min(2, currentFocusIndex + 1));
            else navigateFocus(Math.max(0, currentFocusIndex - 1));
        }
    };

    const FOCUS_CARD_VW = 0.65;
    const FOCUS_CARD_GAP = 24;

    const navigateFocus = (index: number) => {
        setCurrentFocusIndex(index);
        const vwRatio = window.innerWidth < 1024 ? 0.85 : 0.65;
        const cardWidth = window.innerWidth * vwRatio + FOCUS_CARD_GAP;
        setFocusX(-index * cardWidth);
    };

    const handleFocusWheel = (e: React.WheelEvent) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.5) return;
        if (focusWheelLockRef.current) return;
        focusWheelLockRef.current = true;
        setTimeout(() => { focusWheelLockRef.current = false; }, 700);
        if (e.deltaX > 20) navigateFocus(Math.min(2, currentFocusIndex + 1));
        else if (e.deltaX < -20) navigateFocus(Math.max(0, currentFocusIndex - 1));
    };

    useEffect(() => {
        const section = focusSectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.25 && !focusSnapLockRef.current) {
                    focusSnapLockRef.current = true;
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => { focusSnapLockRef.current = false; }, 1200);
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const CHAR_IMAGES = homePageData?.focusChar?.images?.length ? homePageData.focusChar.images : [
        '/images/imgBank/Char001.jpg',
        '/images/imgBank/Char002.jpg',
        '/images/imgBank/Char003.jpg',
    ];

    const GLISSE_IMAGES = homePageData?.focusGlisse?.images?.length ? homePageData.focusGlisse.images : [
        'https://images.unsplash.com/photo-1598514983053-ec5507ad2ea4?q=80&w=2000',
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=2000',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2000',
    ];

    const WELLBEING_IMAGES = homePageData?.focusBienEtre?.images?.length ? homePageData.focusBienEtre.images : [
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000',
        '/images/imgBank/paddleKayak.jpg',
        '/images/imgBank/paddleGeant.jpg',
    ];

    useEffect(() => {
        const heroTimer = setInterval(() => setCurrentHeroIndex(p => (p + 1) % HERO_IMAGES.length), 6000);
        const charTimer = setInterval(() => setCurrentCharIndex(p => (p + 1) % CHAR_IMAGES.length), 5000);
        const glisseTimer = setInterval(() => setCurrentGlisseIndex(p => (p + 1) % GLISSE_IMAGES.length), 5500);
        const wellbeingTimer = setInterval(() => setCurrentWellbeingIndex(p => (p + 1) % WELLBEING_IMAGES.length), 6000);

        return () => {
            clearInterval(heroTimer);
            clearInterval(charTimer);
            clearInterval(glisseTimer);
            clearInterval(wellbeingTimer);
        };
    }, [CHAR_IMAGES.length, GLISSE_IMAGES.length, WELLBEING_IMAGES.length]);

    // Scroll Parallax for Waves & Photos
    const { scrollY } = useScroll();
    const waveX1 = useTransform(scrollY, [0, 1000], ["0%", "-33%"]);
    const waveY2 = useTransform(scrollY, [0, 500], [0, 30]);
    // Balayage vertical du point focal (exploite la hauteur de l'image HD)
    const photoYPos = useTransform(scrollY, [0, 1500], ["20%", "80%"]);

    // State for Mouse Interactions (Tilt, Transparency, Blur)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        const x = ((clientX - left) / width - 0.5) * 2;
        const y = ((clientY - top) / height - 0.5) * 2;
        setMousePos({ x, y });
    };

    const scrollToSpot = () => {
        const spotSection = document.getElementById('esprit-club');
        if (spotSection) {
            spotSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.8,
            });
        });

        return () => ctx.revert();
    }, []);

    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    useEffect(() => {
        if (!homeGallery?.images?.length) return;
        setGalleryImages([...homeGallery.images].sort(() => Math.random() - 0.5));
    }, [homeGallery]);

    return (
        <div className="w-full">
            <PageNavigation />

            {/* HERO SECTION - LOGO GLASS EFFECT */}
            <section
                id="hero"
                className="relative h-svh w-full flex items-center justify-center overflow-hidden"
            >
                {/* Background: Video or Slideshow */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-abysse">
                    {homePageData?.hero?.videoUrl ? (
                        <YouTubeBackground videoUrl={homePageData.hero.videoUrl} />
                    ) : (
                        HERO_IMAGES.map((img, idx) => (
                            <HeroCarouselItem
                                key={img}
                                image={img}
                                isActive={idx === currentHeroIndex}
                                photoYPos={photoYPos}
                            />
                        ))
                    )}
                </div>

                {/* Overlay sombre pour le contraste (Texte blanc sur image) */}
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* SEPARATOR : REFINED WAVE (Plus de galbe, sans bouffer le bouton) */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 leading-0 overflow-hidden">
                    <motion.div
                        className="absolute bottom-0 left-0 w-[200%] h-[150px] md:h-[220px] opacity-40 z-0"
                        style={{ x: waveX1 }}
                    >
                        <svg className="w-full h-full fill-white/40" viewBox="0 0 2880 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,120 C480,250, 960,250, 1440,120 C1920,-10, 2400,-10, 2880,120 L2880,320 L0,320 Z" />
                        </svg>
                    </motion.div>

                    <motion.div
                        className="relative w-full h-[140px] md:h-[200px]"
                        style={{ y: waveY2 }}
                    >
                        <svg className="w-full h-full fill-slate-50" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,180 C360,320 1080,40 1440,180 L1440,320 L0,320 Z" />
                        </svg>
                    </motion.div>
                </div>

                <HeroLogo homePageData={homePageData} />
            </section>

            {/* BENTO ACCUEIL — Unifié façon "Centre de Contrôle" (Air & Glass) */}
            <section id="dashboard" className="max-w-[1600px] mx-auto px-6 pt-10 pb-4 relative z-10">
                <div className="bg-white relative overflow-hidden rounded-[2rem] shadow-[0_8px_32px_rgba(0,43,73,0.05)] border border-abysse/10">

                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch relative z-10">

                        {/* COL 1-4 : Le Spot / Météo (Image brute avec lettrage très contrasté) */}
                        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-abysse/10 p-6 lg:p-8 flex flex-col justify-between group h-full min-h-[220px] relative overflow-hidden bg-black">
                            {/* Image brute sans le filtre bleu abysse envahissant */}
                            <img src={homePageData?.hero?.spotImage || "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=800"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1500" alt="Le Spot" />
                            {/* Dégradé noir neutre uniquement en bas pour garantir la lisibilité des données du vent */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                            {/* Léger assombrissement en haut pour le titre Le Spot */}
                            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/60 to-transparent opacity-50" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none drop-shadow-md">Le <br />Spot.</h3>
                                    <Link href="/le-spot" className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg hover:scale-110">
                                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>

                                {/* Data Footer */}
                                <div className="mt-8 flex items-end justify-between">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-turquoise mb-1 block">Live Météo</span>
                                        <div className="flex flex-wrap items-end gap-2">
                                            <div className="flex items-baseline leading-none">
                                                <span className="text-5xl lg:text-5xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-lg">{weather.windSpeed || "--"}</span>
                                                <span className="ml-1 text-[10px] font-black text-white/70 uppercase italic">NDS</span>
                                            </div>

                                            <div className="flex gap-2">
                                                <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 text-white flex items-center gap-1.5 h-6">
                                                    <motion.div animate={{ rotate: (weather.windBearing || 0) + 135 }} className="text-turquoise">
                                                        <Navigation size={10} fill="currentColor" strokeWidth={3} />
                                                    </motion.div>
                                                    <span className="text-[9px] font-black italic">
                                                        {['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.round((weather.windBearing || 0) / 45) % 8] || "--"}
                                                    </span>
                                                </div>
                                                <div className="bg-orange-500/20 backdrop-blur-sm px-2 py-1 rounded-md border border-orange-500/30 text-orange-400 flex items-center h-6">
                                                    <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Raf. {weather.gusts || (weather.windSpeed ? weather.windSpeed + 5 : "--")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COL 5-8 : Programme du jour (Texte sombre pour contraste élevé) */}
                        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-abysse/10 p-6 lg:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-abysse/50">Programme du jour</span>
                                    <Link href="/fil-info" className="text-[9px] font-black text-abysse uppercase tracking-widest hover:text-turquoise transition-colors">La Vigie →</Link>
                                </div>
                                {(() => {
                                    const activites = [
                                        { label: 'Char à Voile', status: charStatus, msg: charMessage, category: 'encadree' as const },
                                        { label: 'Sports Nautiques', status: nautiqueStatus, msg: nautiqueMessage, category: 'autonome_voile' as const },
                                        { label: 'Marche Aqa.', status: marcheStatus, msg: marcheMessage, category: 'marche' as const },
                                    ];
                                    const stages = [
                                        { label: 'Mini-Mousses', status: stagesMiniMoussesStatus, msg: stagesMiniMoussesMessage, category: 'encadree' as const },
                                        { label: 'Moussaillons', status: stagesMoussaillonsStatus, msg: stagesMoussaillonsMessage, category: 'encadree' as const },
                                        { label: 'Initiation', status: stagesInitiationStatus, msg: stagesInitiationMessage, category: 'encadree' as const },
                                        { label: 'Perf.', status: stagesPerfStatus, msg: stagesPerfMessage, category: 'encadree' as const },
                                    ];
                                    const getActCfg = (s: string, category: 'encadree' | 'autonome_voile' | 'marche') => {
                                        let label = '';
                                        if (s === 'INACTIVE') {
                                            const inactiveLabel = category === 'marche' ? 'Pas de séance' : 'Hors Période';
                                            return { dot: 'bg-abysse/10 border border-abysse/20', label: inactiveLabel, color: 'text-abysse/40' };
                                        }
                                        if (s === 'OPEN' || s === 'IDEAL' || s === 'FAVORABLE') {
                                            if (category === 'autonome_voile') label = 'Favorables';
                                            else label = 'Confirmée';
                                            return { dot: 'bg-emerald-500', label, color: 'text-emerald-700' };
                                        }
                                        if (s === 'RESTRICTED' || s === 'VARIABLE') {
                                            if (category === 'autonome_voile') label = 'Techniques';
                                            else if (category === 'marche') label = 'Adaptée';
                                            else label = 'Cond. tech.';
                                            return { dot: 'bg-amber-500', label, color: 'text-amber-700' };
                                        }
                                        if (category === 'autonome_voile') label = 'Déconseillée';
                                        else if (category === 'marche') label = 'Reportée';
                                        else label = 'Annulée';
                                        return { dot: 'bg-rose-500', label, color: 'text-rose-700' };
                                    };
                                    const ActivityCard = ({ act }: { act: { label: string; status: string; msg?: string; category: 'encadree' | 'autonome_voile' | 'marche' } }) => {
                                        const cfg = getActCfg(act.status, act.category);
                                        return (
                                            <div className="flex flex-col gap-0.5 pb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-abysse/60">{act.label}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`size-2 rounded-full shrink-0 ${cfg.dot}`} />
                                                    <span className={`text-[12px] font-black uppercase italic leading-none tracking-tight truncate ${cfg.color}`}>{cfg.label}</span>
                                                </div>
                                            </div>
                                        );
                                    };
                                    return (
                                        <div className="flex flex-col gap-5">
                                            {/* Groupe 1 : Activités libres */}
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-2 border-b border-abysse/10 pb-4">
                                                {activites.map((act, i) => <ActivityCard key={i} act={act} />)}
                                            </div>
                                            {/* Groupe 2 : Stages */}
                                            <div>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                                                    {stages.map((act, i) => <ActivityCard key={i} act={act} />)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            {lastPublishedAt && (
                                <div className="mt-4 pt-4 border-t border-abysse/10">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex size-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-turquoise opacity-75"></span>
                                            <span className="relative inline-flex rounded-full size-2 bg-turquoise"></span>
                                        </span>
                                        <span className="text-[9px] text-abysse/40 font-bold tracking-widest uppercase">
                                            MàJ: {new Date(lastPublishedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <FreshnessIndicator
                                        lastPublishedAt={lastPublishedAt}
                                        lastConfirmedAt={lastConfirmedAt}
                                        showBanner
                                    />
                                </div>
                            )}
                        </div>

                        {/* COL 9-12 : Flash Infos (Esthétique d'écran de bord, listes de logs) */}
                        <div className="lg:col-span-4 p-6 lg:p-8 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-abysse animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-abysse/50">Livre de Bord</span>
                                </div>
                                <Link href="/fil-info" className="text-[9px] font-black text-abysse uppercase tracking-widest hover:text-turquoise transition-colors">Tous les logs →</Link>
                            </div>

                            <div className="flex-1 flex flex-col justify-start">
                                {infoMessages && infoMessages.length > 0 ? (
                                    <div className="flex flex-col">
                                        {infoMessages.slice(0, 3).map((msg: any, idx: number) => {
                                            const catColors: Record<string, string> = {
                                                alert: 'text-amber-600',
                                                weather: 'text-cyan-600',
                                                event: 'text-purple-600',
                                                vibe: 'text-emerald-600',
                                            };
                                            const colorClass = catColors[msg.category || ''] || 'text-abysse/50';
                                            const catLabel = msg.category ? (CATEGORY_CONFIG[msg.category]?.label || msg.category) : 'Info';

                                            return (
                                                <Link href="/fil-info" key={msg._id} className="block group border-b border-abysse/10 last:border-0 relative">
                                                    {/* Hover highlight indicator */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-turquoise group-hover:h-full transition-all duration-300" />

                                                    <div className="py-3.5 pl-3 transition-colors group-hover:bg-white/30 rounded-r-lg">
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${colorClass}`}>
                                                                {catLabel}
                                                            </span>
                                                            {msg.publishedAt && (
                                                                <span className="text-[9px] text-abysse/40 font-bold tracking-widest uppercase">
                                                                    {new Date(msg.publishedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-[13px] font-bold text-abysse/90 leading-snug group-hover:text-abysse transition-colors line-clamp-2">
                                                            {msg.title}
                                                        </h4>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex-1 rounded-xl border border-dashed border-abysse/20 text-center flex items-center justify-center min-h-[150px]">
                                        <p className="text-[10px] text-abysse/30 font-black italic uppercase tracking-widest">Aucune info récente</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION : L'ESPRIT DU CLUB */}
            <section id="esprit-club" className="py-24 max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-turquoise animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expérience CNC</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                        {homePageData?.spirit?.titlePart1 || "L'Esprit"} <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">{homePageData?.spirit?.titlePart2 || "du Club."}</span>
                    </h2>
                </div>

                <div className="relative rounded-[3rem] overflow-hidden bg-abysse shadow-2xl flex flex-col md:flex-row h-[700px] md:h-[600px] group/container">

                    {/* 0. Le Message - Hidden on Mobile */}
                    <div className="absolute top-8 left-8 z-30 pointer-events-none md:max-w-xl hidden md:block">
                        <RenderText
                            content={homePageData?.spirit?.message}
                            className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9] drop-shadow-lg whitespace-pre-line"
                            fallback="Ressentez\nla force\ndu vent."
                        />
                        <RenderText
                            content={homePageData?.spirit?.description}
                            className="text-slate-300 font-medium mt-4 text-sm md:text-base hidden md:block"
                            fallback="Entre dunes et grand large, choisissez votre façon de vivre la mer."
                        />
                    </div>

                    {/* CARTES DYNAMIQUES */}
                    {(homePageData?.spirit?.cards || [
                        {
                            tag: 'Nature',
                            title: 'Apprendre',
                            description: "De l'éveil des sens à l'autonomie. L'école de voile pour les enfants de 5 à 12 ans.",
                            buttonText: "Découvrir l'école",
                            link: '/ecole-voile',
                            iconName: 'Leaf',
                            colorTheme: 'turquoise',
                            image: '/images/imgBank/Cata001.jpg'
                        },
                        {
                            tag: 'Sensation',
                            title: 'Naviguer',
                            description: "Adrénaline et vitesse. Stages catamarans, char à voile et glisse pour ados & adultes.",
                            buttonText: "Voir les stages",
                            link: '/activites?cat=Sensations',
                            iconName: 'Zap',
                            colorTheme: 'orange',
                            image: '/images/imgBank/Navigation.jpg'
                        },
                        {
                            tag: 'Exploration',
                            title: "S'évader",
                            description: "Louez un paddle ou un kayak, longez la côte à votre rythme. La liberté absolue.",
                            buttonText: "Louer du matériel",
                            link: '/activites',
                            iconName: 'Compass',
                            colorTheme: 'purple',
                            image: '/images/imgBank/paddlekayak.jpg'
                        }
                    ]).map((card: any, idx: number) => {
                        // Color Theme Helper
                        const themeColor = card.colorTheme === 'orange' ? 'text-orange-500' : card.colorTheme === 'purple' ? 'text-purple-500' : 'text-turquoise';
                        const hoverBg = card.colorTheme === 'orange' ? 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white' :
                            card.colorTheme === 'purple' ? 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white' :
                                'border-turquoise text-turquoise hover:bg-turquoise hover:text-abysse';
                        const hoverText = card.colorTheme === 'orange' ? 'text-orange-400' : card.colorTheme === 'purple' ? 'text-purple-400' : 'text-turquoise';

                        return (
                            <div
                                key={idx}
                                className="group/panel relative flex-1 hover:flex-2 transition-all duration-700 ease-in-out overflow-hidden md:cursor-pointer flex flex-col focus-within:flex-3"
                                tabIndex={0}
                            >
                                <div className="absolute inset-0 bg-black/50 group-hover/panel:bg-black/20 group-focus-within/panel:bg-black/20 transition-colors z-10 duration-500"></div>
                                <img
                                    src={card.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110 group-focus-within/panel:scale-110"
                                    alt={card.title}
                                />

                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 bg-linear-to-t from-abysse via-abysse/60 to-transparent flex flex-col justify-end h-full md:h-auto">
                                    <div className="flex items-center gap-3 md:gap-4 mb-2 translate-y-2 group-hover/panel:translate-y-0 group-focus-within/panel:translate-y-0 transition-transform duration-300">
                                        <div className={`size-10 md:size-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center ${themeColor} shadow-lg shrink-0`}>
                                            {card.iconName === 'Leaf' && <Leaf size={20} />}
                                            {card.iconName === 'Zap' && <Zap size={20} />}
                                            {card.iconName === 'Compass' && <Compass size={20} />}
                                            {!['Leaf', 'Zap', 'Compass'].includes(card.iconName) && <Leaf size={20} />}
                                        </div>
                                        <span className={`${themeColor} font-black uppercase tracking-[0.2em] text-[10px] md:text-xs`}>{card.tag}</span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-1 md:mb-2 group-hover/panel:text-3xl group-focus-within/panel:text-3xl group-focus-within/panel:mb-3 transition-all">
                                        {card.title}
                                    </h3>

                                    {/* Contenu extensible : Révélé au survol (desktop) OU au focus (mobile) */}
                                    <div className="grid grid-rows-[0fr] group-hover/panel:grid-rows-[1fr] group-focus-within/panel:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                                        <div className="overflow-hidden">
                                            <RenderText
                                                content={card.description}
                                                className={`text-slate-200 text-xs md:text-sm mb-4 leading-relaxed font-medium mt-2`}
                                            />
                                            <Link href={card.link || '#'} className={`w-full md:w-auto inline-flex justify-center items-center gap-2 bg-transparent border-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors mb-2 md:mb-0 ${hoverBg}`}>
                                                {card.buttonText} <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Overlay cliquable (mobile seulement) pour prendre le focus quand on touche n'importe où sur la carte */}
                                <div className="absolute inset-0 z-10 md:hidden cursor-pointer"></div>
                            </div>
                        );
                    })}

                </div>
            </section>

            {/* GROUPE FOCUS : Carrousel style Apple */}
            <div id="focus" ref={focusSectionRef} className="bg-sky-50 py-12">
                <section className="relative z-10">
                    {/* Header */}
                    <div className="max-w-[1600px] mx-auto px-6 mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-2 rounded-full bg-orange-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Activités phares</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                            Vibrez au rythme <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">des Marées.</span>
                        </h2>
                    </div>

                    {/* Carousel — overflow-hidden full-width, flex aligné sur max-w-[1600px] mx-auto px-6 */}
                    <div className="overflow-hidden" onWheel={handleFocusWheel}>
                        <div className="max-w-[1600px] mx-auto pl-6">
                            <motion.div
                                id="focus-slider"
                                className="flex gap-6 will-change-transform"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                style={{
                                    transform: `translateX(${focusX}px)`,
                                    transition: 'transform 0.65s cubic-bezier(0.32, 0.72, 0, 1)',
                                }}
                            >
                                {/* Carte 1 — Char à Voile */}
                                <div
                                    id="vitesse"
                                    className="shrink-0 w-[85vw] lg:w-[65vw] group relative overflow-hidden rounded-[3rem] bg-abysse ring-1 ring-white/15 flex flex-col lg:flex-row min-h-[500px] lg:min-h-[550px]"
                                    style={{ opacity: currentFocusIndex === 0 ? 1 : 0.5, transform: currentFocusIndex === 0 ? 'scale(1)' : 'scale(0.97)', transition: 'opacity 0.4s, transform 0.4s' }}
                                >
                                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center z-20 relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                <Zap size={24} fill="currentColor" />
                                            </div>
                                            <div>
                                                <span className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] block">{homePageData?.focusChar?.tagline || "Activité Phare"}</span>
                                                <span className="text-slate-400 font-medium text-[9px] uppercase tracking-widest">{homePageData?.focusChar?.subTagline || "Sensation & Vitesse"}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-8">
                                            {homePageData?.focusChar?.title || "Le Char"} <br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-500 to-red-600">{homePageData?.focusChar?.highlightSuffix || "à Voile."}</span>
                                        </h2>
                                        <RenderText
                                            content={homePageData?.focusChar?.description}
                                            className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12 border-l-4 border-orange-500/30 pl-8 italic"
                                            fallback="Glissez sur le sable à quelques centimètres du sol. Une expérience unique, propulsée par la seule force du vent sur l'immense plage de Coutainville."
                                        />
                                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                            <Link href={homePageData?.focusChar?.ctaButton?.link || "/activites"} className="inline-flex items-center justify-center px-8 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-orange-600 transition-all shadow-lg group/btn shadow-orange-500/20">
                                                {homePageData?.focusChar?.ctaButton?.text || "Réserver une séance"} <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                            <button onClick={() => setIsCharModalOpen(true)} className="inline-flex items-center justify-center px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                                                {homePageData?.focusChar?.infoButton?.text || "En savoir plus"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-none h-[280px] md:h-[350px] lg:h-auto lg:flex-1 relative overflow-hidden">
                                        <div className="absolute inset-0 z-0">
                                            <AnimatePresence mode="popLayout">
                                                <motion.img key={CHAR_IMAGES[currentCharIndex]} src={CHAR_IMAGES[currentCharIndex]} initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1.08 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: 6, ease: "linear" } }} className="absolute inset-0 w-full h-full object-cover" alt="Char à voile" />
                                            </AnimatePresence>
                                        </div>
                                        <div className="absolute inset-y-0 left-0 w-px bg-white/10 hidden lg:block z-20"></div>
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-abysse via-transparent to-transparent lg:hidden z-10"></div>
                                        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                                            {CHAR_IMAGES.map((_: any, idx: number) => (<div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentCharIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/30'}`} />))}
                                        </div>
                                        <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 max-w-[180px]">
                                            <span className="text-orange-500 font-black text-3xl block leading-none mb-1">{homePageData?.focusChar?.badgeValue || "60+"}</span>
                                            <span className="text-white font-bold text-[10px] uppercase tracking-widest leading-tight block">{homePageData?.focusChar?.badgeLabel || "Km/h de sensations pures"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Carte 2 — Glisse Extrême */}
                                <div
                                    id="adrenaline"
                                    className="shrink-0 w-[85vw] lg:w-[65vw] group relative overflow-hidden rounded-[3rem] bg-abysse ring-1 ring-white/15 flex flex-col lg:flex-row-reverse min-h-[500px] lg:min-h-[550px]"
                                    style={{ opacity: currentFocusIndex === 1 ? 1 : 0.5, transform: currentFocusIndex === 1 ? 'scale(1)' : 'scale(0.97)', transition: 'opacity 0.4s, transform 0.4s' }}
                                >
                                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center z-20 relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                <Wind size={24} fill="currentColor" className="text-blue-500" />
                                            </div>
                                            <div>
                                                <span className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] block">{homePageData?.focusGlisse?.tagline || "Sensations Fortes"}</span>
                                                <span className="text-slate-400 font-medium text-[9px] uppercase tracking-widest">{homePageData?.focusGlisse?.subTagline || "Wing, Kite & Funboard"}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-8">
                                            {homePageData?.focusGlisse?.title || "Glisse"} <br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-500 to-purple-600">{homePageData?.focusGlisse?.highlightSuffix || "Extrême."}</span>
                                        </h2>
                                        <RenderText
                                            content={homePageData?.focusGlisse?.description}
                                            className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12 border-l-4 border-blue-500/30 pl-8 italic"
                                            fallback="Dominez les éléments. Wingfoil, Kitesurf ou Windsurf : repoussez vos limites avec les moniteurs du club sur l'un des meilleurs spots de Normandie."
                                        />
                                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                            <Link href={homePageData?.focusGlisse?.ctaButton?.link || "/activites?cat=Sensations"} className="inline-flex items-center justify-center px-8 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-blue-500 transition-all shadow-lg group/btn shadow-blue-500/20">
                                                {homePageData?.focusGlisse?.ctaButton?.text || "Découvrir la glisse"} <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                            <Link href={homePageData?.focusGlisse?.infoButton?.link || "/le-spot"} className="inline-flex items-center justify-center px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                                                {homePageData?.focusGlisse?.infoButton?.text || "Le Spot"}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex-none h-[280px] md:h-[350px] lg:h-auto lg:flex-1 relative overflow-hidden">
                                        <div className="absolute inset-0 z-0">
                                            <AnimatePresence mode="popLayout">
                                                <motion.img key={GLISSE_IMAGES[currentGlisseIndex]} src={GLISSE_IMAGES[currentGlisseIndex]} initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1.08 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: 6.5, ease: "linear" } }} className="absolute inset-0 w-full h-full object-cover" alt="Glisse extrême" />
                                            </AnimatePresence>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 w-px bg-white/10 hidden lg:block z-20"></div>
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-abysse via-transparent to-transparent lg:hidden z-10"></div>
                                        <div className="absolute bottom-6 left-8 flex gap-2 z-20">
                                            {GLISSE_IMAGES.map((_: any, idx: number) => (<div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentGlisseIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`} />))}
                                        </div>
                                        <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 max-w-[180px]">
                                            <span className="text-blue-400 font-black text-3xl block leading-none mb-1">{homePageData?.focusGlisse?.badgeValue || "Pure"}</span>
                                            <span className="text-white font-bold text-[10px] uppercase tracking-widest leading-tight block">{homePageData?.focusGlisse?.badgeLabel || "Énergie & Adrénaline"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Carte 3 — Bien-être & Slow Tourisme */}
                                <div
                                    id="bien-etre"
                                    className="shrink-0 w-[85vw] lg:w-[65vw] group relative overflow-hidden rounded-[3rem] bg-abysse ring-1 ring-white/15 flex flex-col lg:flex-row min-h-[500px] lg:min-h-[550px]"
                                    style={{ opacity: currentFocusIndex === 2 ? 1 : 0.5, transform: currentFocusIndex === 2 ? 'scale(1)' : 'scale(0.97)', transition: 'opacity 0.4s, transform 0.4s' }}
                                >
                                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center z-20 relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                <Waves size={24} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] block">{homePageData?.focusBienEtre?.tagline || "Slow Tourisme"}</span>
                                                <span className="text-slate-400 font-medium text-[9px] uppercase tracking-widest">{homePageData?.focusBienEtre?.subTagline || "Marche Aquatique, Kayak & Paddle"}</span>
                                            </div>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-8">
                                            {homePageData?.focusBienEtre?.title || "Bien-être"} <br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-600">{homePageData?.focusBienEtre?.highlightSuffix || "& Slow Tourisme."}</span>
                                        </h2>
                                        <RenderText
                                            content={homePageData?.focusBienEtre?.description}
                                            className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12 border-l-4 border-emerald-500/30 pl-8 italic"
                                            fallback="Prenez le temps de vivre. Entre marche aquatique revitalisante et balades en kayak ou paddle, découvrez la côte normande au rythme des marées."
                                        />
                                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                            <Link href={homePageData?.focusBienEtre?.ctaButton?.link || "/activites?cat=Bien-être"} className="inline-flex items-center justify-center px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-emerald-500 transition-all shadow-lg group/btn shadow-emerald-500/20">
                                                {homePageData?.focusBienEtre?.ctaButton?.text || "S'évader en mer"} <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                            <Link href={homePageData?.focusBienEtre?.infoButton?.link || "/activites"} className="inline-flex items-center justify-center px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                                                {homePageData?.focusBienEtre?.infoButton?.text || "Voir les tarifs"}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex-none h-[280px] md:h-[350px] lg:h-auto lg:flex-1 relative overflow-hidden">
                                        <div className="absolute inset-0 z-0">
                                            <AnimatePresence mode="popLayout">
                                                <motion.img key={WELLBEING_IMAGES[currentWellbeingIndex]} src={WELLBEING_IMAGES[currentWellbeingIndex]} initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1.08 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }} className="absolute inset-0 w-full h-full object-cover" alt="Bien-être slow tourisme" />
                                            </AnimatePresence>
                                        </div>
                                        <div className="absolute inset-y-0 left-0 w-px bg-white/10 hidden lg:block z-20"></div>
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-abysse via-transparent to-transparent lg:hidden z-10"></div>
                                        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                                            {WELLBEING_IMAGES.map((_: any, idx: number) => (<div key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === currentWellbeingIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-white/30'}`} />))}
                                        </div>
                                        <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 max-w-[180px]">
                                            <span className="text-emerald-400 font-black text-3xl block leading-none mb-1">{homePageData?.focusBienEtre?.badgeValue || "100%"}</span>
                                            <span className="text-white font-bold text-[10px] uppercase tracking-widest leading-tight block">{homePageData?.focusBienEtre?.badgeLabel || "Oxygène & Sérénité Locale"}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Flèches — bottom right, style Apple */}
                    <div className="max-w-[1600px] mx-auto px-6 mt-5 flex justify-end gap-3">
                        <button
                            onClick={() => navigateFocus(Math.max(0, currentFocusIndex - 1))}
                            disabled={currentFocusIndex === 0}
                            className="size-11 rounded-full bg-abysse/10 border border-abysse/20 hover:bg-abysse/20 flex items-center justify-center text-abysse disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => navigateFocus(Math.min(2, currentFocusIndex + 1))}
                            disabled={currentFocusIndex === 2}
                            className="size-11 rounded-full bg-abysse/10 border border-abysse/20 hover:bg-abysse/20 flex items-center justify-center text-abysse disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </section>
            </div>

            {/* --- SECTION : AGENDA / ÉVÉNEMENTS --- */}
            <section id="agenda" className="py-24 relative z-10 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-turquoise/10 rounded-full blur-[120px] translate-x-1/2" />
                    <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-abysse/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-[1600px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        {/* Title part */}
                        <div className="lg:w-1/3 pt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-2 rounded-full bg-turquoise animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-turquoise">Le Calendrier</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none mb-6">
                                Prochains <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">Événements.</span>
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-sm">
                                Restez au courant des régates, soirées et moments forts de la vie du club.
                            </p>
                            <Link
                                href="/club#life"
                                className="group/btn relative inline-flex items-center gap-4 bg-abysse text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest overflow-hidden transition-all shadow-xl hover:shadow-turquoise/20"
                            >
                                <span className="relative z-10">Voir tout l'agenda</span>
                                <ArrowRight size={16} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-linear-to-r from-turquoise to-cyan-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                            </Link>
                        </div>

                        {/* Events list */}
                        <div className="lg:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.slice(0, 3).map((event: any, idx: number) => {
                                const eventDate = new Date(event.startDate);
                                return (
                                    <div
                                        key={idx}
                                        className="group/card relative bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-4xl shadow-[0_15px_40px_rgba(0,43,73,0.08)] transition-all duration-500 hover:shadow-2xl hover:bg-white hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            {/* Date Float Badge */}
                                            <div className="bg-abysse px-4 py-2.5 rounded-2xl shadow-lg text-center min-w-[65px] group-hover/card:bg-turquoise transition-colors duration-500">
                                                <span className="block text-[10px] font-black text-turquoise uppercase tracking-widest leading-none mb-1 group-hover/card:text-abysse">
                                                    {eventDate.toLocaleDateString('fr-FR', { month: 'short' })}
                                                </span>
                                                <span className="block text-2xl font-black text-white leading-none italic group-hover/card:text-abysse">
                                                    {eventDate.getDate()}
                                                </span>
                                            </div>

                                            {/* Image Badge / Thumbnail */}
                                            <div className="size-16 rounded-2xl overflow-hidden border-2 border-white shadow-md rotate-3 group-hover/card:rotate-0 transition-all duration-500">
                                                <img
                                                    src={event.image || "/images/imgBank/CataPharePointeAgon.jpg"}
                                                    className="w-full h-full object-cover"
                                                    alt={event.title}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            {event.badge && (
                                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-turquoise/10 text-turquoise rounded-full mb-2 inline-block">
                                                    {event.badge}
                                                </span>
                                            )}
                                            <h4 className="text-xl font-black text-abysse mb-1 leading-tight group-hover/card:text-turquoise transition-colors">
                                                {event.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <Wind size={12} className="text-turquoise" />
                                                {event.time || 'Toute la journée'}
                                            </p>
                                        </div>

                                        <RenderText
                                            content={event.description}
                                            className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed mb-4"
                                        />

                                        {/* Accent line */}
                                        <div className="h-1 w-8 bg-turquoise/20 rounded-full group-hover/card:w-full group-hover/card:bg-turquoise transition-all duration-500" />
                                    </div>
                                );
                            })}

                            {upcomingEvents.length === 0 && (
                                <div className="col-span-full py-20 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-abysse/10">
                                    <div className="size-16 bg-abysse/5 rounded-full flex items-center justify-center mx-auto mb-6 text-abysse/20">
                                        <Bird size={32} />
                                    </div>
                                    <p className="text-abysse/40 font-black italic uppercase tracking-[0.3em] text-xs">
                                        Aucun événement programmé
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PILLAR STORY --- */}
            <PillarStory campusData={homePageData?.campus} />

            {/* --- SECTION : MINI-JEU PÉDAGOGIQUE (desktop only) --- */}
            <section id="pedagogie" className="hidden md:block py-24 bg-abysse relative z-10">
                <div className="max-w-[1600px] mx-auto px-6">
                    <GamesSlideshow />
                </div>
            </section>

            {/* --- SECTION : LE DICO DES PARENTS --- */}
            <section id="dico-parents" className="py-24 bg-slate-50 relative z-10">
                <div className="max-w-[1600px] mx-auto px-6">
                    {dicoWords && dicoWords.length > 0 ? (
                        <DicoParents dicoWords={dicoWords} />
                    ) : (
                        <DicoParents /> // Fallback temp if not loaded
                    )}
                </div>
            </section>

            {/* --- NOUVEAU : LE CLUB EN IMMERSION (Shop & Galerie) --- */}
            <section className="py-24 max-w-[1600px] mx-auto px-6 relative z-10" id="immersion">
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-yellow-400"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Style & Souvenirs</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                        {homePageData?.immersion?.titlePart1 || homePageData?.immersion?.titlePart2 ? (
                            <>{homePageData.immersion.titlePart1} <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-yellow-500">{homePageData.immersion.titlePart2}</span></>
                        ) : (
                            <>Le Club <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-yellow-500">en Immersion.</span></>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {homePageData?.immersion?.cards && homePageData.immersion.cards.length > 0 ? (
                        homePageData.immersion.cards.map((card: any, idx: number) => {
                            const icons: Record<string, any> = { Radio, ShoppingBag, Play, Briefcase };
                            const IconComponent = icons[card.iconName as string] || Radio;
                            const colorClass = {
                                blue: 'text-blue-400',
                                yellow: 'text-yellow-400',
                                turquoise: 'text-turquoise',
                                red: 'text-red-600',
                                violet: 'text-purple-400',
                                gray: 'text-slate-400'
                            }[card.iconColor as string] || 'text-white';

                            const btnBgClass = {
                                blue: 'hover:bg-blue-400',
                                yellow: 'bg-yellow-400 hover:bg-white',
                                turquoise: 'hover:bg-turquoise',
                                red: 'bg-red-600 hover:bg-red-500',
                                violet: 'hover:bg-purple-500',
                                gray: 'hover:bg-slate-500'
                            }[card.iconColor as string] || 'bg-white hover:bg-blue-400';

                            const btnTextClass = (card.iconColor === 'yellow' || card.iconColor === 'red') ? 'text-slate-900 group-hover:text-white' : 'text-slate-900 hover:text-white';
                            // Special case for the original yellow button which had text-slate-900
                            const isOriginalYellow = card.iconColor === 'yellow';
                            const isOriginalRed = card.iconColor === 'red';

                            const isPlayCard = card.iconName === 'Play';
                            const CardContainer = isPlayCard ? 'div' : Link;

                            return (
                                <CardContainer
                                    key={idx}
                                    href={isPlayCard ? undefined : (card.link || "#")}
                                    className="group relative h-[380px] rounded-[2rem] overflow-hidden bg-abysse border border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl"
                                >
                                    <img src={card.image || "/images/imgBank/CataPharePointeAgon.jpg"} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt={card.titlePart1} />
                                    <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/40 to-transparent z-10" />

                                    <div className="absolute inset-0 p-6 flex flex-col z-20">
                                        <div className="size-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 mb-auto">
                                            <IconComponent size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                                                {card.titlePart1} <span className={colorClass}>{card.titlePart2}</span>
                                            </h3>
                                            <p className="text-slate-300 text-sm font-medium mb-4 line-clamp-2">
                                                {card.description}
                                            </p>
                                            {isPlayCard ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); setIsGalleryOpen(true); }}
                                                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-turquoise hover:text-white transition-all shadow-lg"
                                                    >
                                                        <Image size={12} /> Photos
                                                    </button>
                                                    <a
                                                        href="https://www.youtube.com/@clubnautiquedecoutainville"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg"
                                                    >
                                                        <Youtube size={12} /> Vidéos
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${btnBgClass} ${isOriginalYellow || isOriginalRed ? 'text-slate-900 group-hover:text-white' : 'bg-white text-slate-900 hover:text-white'}`}>
                                                    {card.buttonText} <ArrowRight size={12} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContainer>
                            );
                        })
                    ) : (
                        <>
                            {/* TUILE : LA VIGIE (NEWS/LIVE) */}
                            <Link href="/fil-info" className="group relative h-[380px] rounded-[2rem] overflow-hidden bg-abysse border border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl">
                                <img src="/images/imgBank/CataPharePointeAgon.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="La Vigie Direct" />
                                <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/40 to-transparent z-10" />

                                <div className="absolute inset-0 p-6 flex flex-col z-20">
                                    <div className="size-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 mb-auto">
                                        <Radio size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">La Vigie <span className="text-blue-400">Live</span></h3>
                                        <p className="text-slate-300 text-sm font-medium mb-4 line-clamp-2">
                                            Alertes météo et infos de dernière minute.
                                        </p>
                                        <span className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-lg">
                                            Fil d'info <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* TUILE : BOUTIQUE (CNC SHOP) */}
                            <Link href="/boutique" className="group relative h-[380px] rounded-[2rem] overflow-hidden bg-abysse border border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl">
                                <img src="/images/imgBank/naviguer.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="Boutique CNC" />
                                <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/40 to-transparent z-10" />

                                <div className="absolute inset-0 p-6 flex flex-col z-20">
                                    <div className="size-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 mb-auto">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Boutique <span className="text-yellow-400">CNC</span></h3>
                                        <p className="text-slate-300 text-sm font-medium mb-4 line-clamp-2">
                                            Sweats, t-shirts et accessoires aux couleurs du club.
                                        </p>
                                        <span className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
                                            La collection <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* TUILE : GALERIE MÉDIAS */}
                            <div className="group relative h-[380px] rounded-[2rem] overflow-hidden bg-abysse border border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl cursor-pointer">
                                <img src="/images/imgBank/Navigation.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt="Galerie Médias" />
                                <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/40 to-transparent z-10" />

                                <div className="absolute inset-0 p-6 flex flex-col z-20">
                                    <div className="size-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 mb-auto">
                                        <Play size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Galerie <span className="text-turquoise">Médias</span></h3>
                                        <p className="text-slate-300 text-sm font-medium mb-4 line-clamp-2">
                                            Photos et vidéos des plus beaux moments du spot.
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsGalleryOpen(true)}
                                                className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-turquoise hover:text-white transition-all shadow-lg"
                                            >
                                                <Image size={12} /> Photos
                                            </button>
                                            <a
                                                href="https://www.youtube.com/@clubnautiquedecoutainville"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg"
                                            >
                                                <Youtube size={12} /> Vidéos
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TUILE : SÉMINAIRES & ÉVÉNEMENTS */}
                            <Link href="/groupes-entreprises" className="group relative h-[380px] rounded-[2rem] overflow-hidden bg-abysse border border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl">
                                <img src="/images/imgBank/Secourisme.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt="Séminaires entreprises" />
                                <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/40 to-transparent z-10" />

                                <div className="absolute inset-0 p-6 flex flex-col z-20">
                                    <div className="size-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 mb-auto">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Séminaires <span className="text-slate-400">&</span> Events</h3>
                                        <p className="text-slate-300 text-sm font-medium mb-4 line-clamp-2">
                                            Teambuilding, CODIR et formations face à la mer.
                                        </p>
                                        <span className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-turquoise hover:text-white transition-all shadow-lg">
                                            Brochure Pro <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* --- SECTION : PARTENAIRES --- */}
            <section id="reseau" className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="size-1.5 rounded-full bg-slate-300"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Réseau & Soutiens</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                            Nos <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">Partenaires.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
                        {PARTNERS.map((partner, idx) => (
                            <a
                                key={idx}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group grayscale hover:grayscale-0 transition-all duration-500 flex flex-col items-center"
                                title={partner.name}
                            >
                                <div className="h-16 md:h-20 w-32 md:w-40 flex items-center justify-center mb-2 transform group-hover:scale-110 transition-transform duration-500">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {partner.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>


            {/* --- PHOTO WALL GALLERY --- */}
            <PhotoWallGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
                title={homeGallery?.title || "Galerie Photos"}
            />

            {/* MODALS */}
            <CharDiscoveryModal isOpen={isCharModalOpen} onClose={() => setIsCharModalOpen(false)} />
        </div>
    );
}
