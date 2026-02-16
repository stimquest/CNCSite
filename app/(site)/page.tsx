"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useContent } from '../../contexts/ContentContext';

import { Compass, Wind, Leaf, Zap, Users, ArrowRight, LifeBuoy, GraduationCap, Briefcase, Medal, Siren, CheckCircle2, Wifi, ShoppingBag, Image, Radio, Bird, Waves, Youtube, Play } from 'lucide-react';
import { PhotoWallGallery } from '../../components/PhotoWallGallery';
import { GamesSlideshow } from '../../components/GamesSlideshow';
import PillarStory from '../../components/PillarStory';
import PageNavigation from '../../components/PageNavigation';
import { SpotConditionsBento } from '../../components/SpotConditionsBento';
import { LogoComponent } from '../../components/Logo';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const HERO_IMAGES = [
    '/images/Hero/Ryan.jpg',
    '/images/Hero/SunriseCata.png',
    '/images/Hero/upscaled_char3.JPEG'
];

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const FEATURED_ACTIVITIES = [
    {
        id: 'char-a-voile',
        title: 'Le Char à Voile',
        tagline: 'Sensation de Vitesse Pure',
        desc: 'Glissez sur le sable à quelques centimètres du sol. Une activité unique accessible à tous sur l’immense plage de Coutainville.',
        image: 'https://images.unsplash.com/photo-1544411047-c491574abb46?q=80&w=2000',
        cta: 'Vivre l’expérience',
        link: '/activites',
        color: 'from-orange-500 to-red-600',
        label: 'Activité Phare'
    },
    {
        id: 'stages-ete',
        title: 'Stages Vacances',
        tagline: 'L’Aventure en Mer',
        desc: 'Du Optimist au Catamaran, nos moniteurs accueillent vos enfants pour une semaine de progression et de plaisir.',
        image: 'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=2000',
        cta: 'Réserver un stage',
        link: '/ecole-voile',
        color: 'from-turquoise to-blue-600',
        label: 'Saison en cours'
    },
    {
        id: 'longe-cote',
        title: 'Marche Aquatique',
        tagline: 'Bien-être & Énergie',
        desc: 'Une autre façon de vivre la mer. Renforcez votre corps tout en profitant du paysage exceptionnel de la côte normande.',
        image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000',
        cta: 'En savoir plus',
        link: '/activites',
        color: 'from-emerald-500 to-teal-600',
        label: 'Santé & Forme'
    }
];

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

export const HomePage: React.FC = () => {
    const {
        weather, statusMessage, news, homeGallery, infoMessages,
        spotStatus,
        charStatus, charMessage,
        marcheStatus, marcheMessage,
        nautiqueStatus, nautiqueMessage,
        homePageData
    } = useContent();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [currentGlisseIndex, setCurrentGlisseIndex] = useState(0);
    const [currentWellbeingIndex, setCurrentWellbeingIndex] = useState(0);

    // Auto-advance slideshow
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const CHAR_IMAGES = homePageData?.focusChar?.images?.length ? homePageData.focusChar.images : [
        '/images/imgBank/Char001.jpg',
        '/images/imgBank/Char002.jpg',
        '/images/imgBank/Char003.jpg',
    ];

    const GLISSE_IMAGES = homePageData?.focusGlisse?.images?.length ? homePageData.focusGlisse.images : [
        'https://images.unsplash.com/photo-1598514983053-ec5507ad2ea4?q=80&w=2000', // Wingfolk
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=2000', // Kitesurf
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2000', // Windsurf
    ];

    const WELLBEING_IMAGES = homePageData?.focusBienEtre?.images?.length ? homePageData.focusBienEtre.images : [
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000', // Marche Aquatique
        '/images/imgBank/paddleKayak.jpg',
        '/images/imgBank/paddleGeant.jpg',
    ];

    useEffect(() => {
        const charTimer = setInterval(() => {
            setCurrentCharIndex((prev) => (prev + 1) % CHAR_IMAGES.length);
        }, 5000);
        const glisseTimer = setInterval(() => {
            setCurrentGlisseIndex((prev) => (prev + 1) % GLISSE_IMAGES.length);
        }, 5500);
        const wellbeingTimer = setInterval(() => {
            setCurrentWellbeingIndex((prev) => (prev + 1) % WELLBEING_IMAGES.length);
        }, 6000);
        return () => {
            clearInterval(charTimer);
            clearInterval(glisseTimer);
            clearInterval(wellbeingTimer);
        };
    }, []);

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
        // GSAP Hero Animations
        gsap.to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            delay: 0.2,
            ease: 'power4.out'
        });

        gsap.to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.8,
        });

        gsap.to('.hero-btn', {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 1,
        });

        // Sections appear with generic reveal if needed, but campus-card logic is removed 
        // as it was part of an older design.
    }, []);

    const galleryImages = useMemo(() => {
        if (!homeGallery?.images?.length) return [];
        return [...homeGallery.images].sort(() => Math.random() - 0.5);
    }, [homeGallery]);

    return (
        <div className="w-full">
            <PageNavigation />

            {/* HERO SECTION - LOGO GLASS EFFECT */}
            <section
                id="hero"
                className="relative h-screen w-full flex items-center justify-center overflow-hidden"
                style={{ perspective: '1500px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            >
                {/* Background Slideshow - Parallaxe & Ken Burns subtil restauré */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-abysse">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={HERO_IMAGES[currentHeroIndex]}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0, scale: 1.06 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 2.5, ease: "easeInOut" },
                                scale: { duration: 15, ease: "easeOut" }
                            }}
                            style={{
                                backgroundImage: `url('${HERO_IMAGES[currentHeroIndex]}')`,
                                backgroundSize: 'cover',
                                backgroundPositionX: 'center',
                                backgroundPositionY: photoYPos,
                            }}
                        />
                    </AnimatePresence>
                </div>

                {/* Overlay sombre pour le contraste (Texte blanc sur image) */}
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* SEPARATOR : REFINED WAVE (Plus de galbe, sans bouffer le bouton) */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 leading-0 overflow-hidden">

                    {/* Layer 1: Background Wave (Visibilité équilibrée gauche/droite) */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-[200%] h-[150px] md:h-[220px] opacity-40 z-0"
                        style={{ x: waveX1 }}
                    >
                        <svg className="w-full h-full fill-white/40" viewBox="0 0 2880 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,120 C480,250, 960,250, 1440,120 C1920,-10, 2400,-10, 2880,120 L2880,320 L0,320 Z" />
                        </svg>
                    </motion.div>

                    {/* Layer 2: Foreground Wave (Plus de courbe mais contenue) */}
                    <motion.div
                        className="relative w-full h-[140px] md:h-[200px]"
                        style={{ y: waveY2 }}
                    >
                        <svg className="w-full h-full fill-slate-50" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,180 C360,320 1080,40 1440,180 L1440,320 L0,320 Z" />
                        </svg>
                    </motion.div>
                </div>

                {/* Conteneur du Logo avec Tilt 3D */}
                <div className="relative z-20 w-full flex flex-col items-center justify-center -translate-y-12">
                    <motion.div
                        className="relative w-[85vw] h-[40vh] md:w-[60vw] md:h-[50vh] flex items-center justify-center"
                        animate={{
                            rotateX: mousePos.y * -15,
                            rotateY: mousePos.x * 15,
                        }}
                        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* 1. EFFET GLASS : Couche de flou masquée par le logo */}
                        <div
                            className="hero-logo-glass-layer logo-drop-shadow"
                            style={{
                                maskImage: "url('/images/logoWhite.png')",
                                WebkitMaskImage: "url('/images/logoWhite.png')"
                            }}
                        />

                        {/* 2. REFLET : Effet lumineux dynamique qui suit la souris */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{
                                background: `radial-gradient(circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                            }}
                            style={{
                                mixBlendMode: 'overlay',
                                maskImage: "url('/images/logoWhite.png')",
                                WebkitMaskImage: "url('/images/logoWhite.png')",
                                maskSize: 'contain',
                                maskPosition: 'center',
                                maskRepeat: 'no-repeat',
                            }}
                        />
                    </motion.div>

                    {/* Texte du Hero */}
                    <div className="flex flex-col items-center mt-12 hero-subtitle pointer-events-auto opacity-100">
                        <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm mb-6">
                            Club Nautique de Coutainville
                        </p>
                    </div>
                </div>
            </section>

            {/* NOUVELLE LIGNE : SPOT CONDITIONS BENTO */}
            <SpotConditionsBento />

            {/* SECTION : L'ESPRIT DU CLUB */}
            <section id="esprit-club" className="py-24 max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-turquoise animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expérience CNC</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl text-abysse">
                        {homePageData?.spirit?.title || "L'Esprit du Club"} <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise"></span>
                    </h2>
                </div>

                <div className="relative rounded-[3rem] overflow-hidden bg-abysse shadow-2xl flex flex-col md:flex-row h-[700px] md:h-[600px] group/container">

                    {/* 0. Le Message */}
                    <div className="absolute top-8 left-8 z-30 pointer-events-none md:max-w-xl">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9] drop-shadow-lg whitespace-pre-line">
                            {homePageData?.spirit?.message || "Ressentez\nla force\ndu vent."}
                        </h2>
                        <p className="text-slate-300 font-medium mt-4 text-sm md:text-base hidden md:block">
                            {homePageData?.spirit?.description || "Entre dunes et grand large, choisissez votre façon de vivre la mer."}
                        </p>
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
                        const hoverBg = card.colorTheme === 'orange' ? 'hover:bg-orange-500' : card.colorTheme === 'purple' ? 'hover:bg-purple-500' : 'hover:bg-turquoise';

                        return (
                            <Link key={idx} href={card.link || '#'} className="relative flex-1 group/panel hover:flex-2 transition-all duration-700 ease-in-out overflow-hidden cursor-pointer">
                                <div className="absolute inset-0 bg-black/40 group-hover/panel:bg-black/20 transition-colors z-10"></div>
                                <img
                                    src={card.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110"
                                    alt={card.title}
                                />

                                <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-linear-to-t from-abysse/90 via-abysse/40 to-transparent">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={`size-12 bg-white rounded-xl flex items-center justify-center ${themeColor} shadow-lg group-hover/panel:scale-110 transition-transform`}>
                                            {card.iconName === 'Leaf' && <Leaf size={24} />}
                                            {card.iconName === 'Zap' && <Zap size={24} />}
                                            {card.iconName === 'Compass' && <Compass size={24} />}
                                            {/* Fallback Icon if needed */}
                                            {!['Leaf', 'Zap', 'Compass'].includes(card.iconName) && <Leaf size={24} />}
                                        </div>
                                        <span className={`${themeColor} font-black uppercase tracking-[0.2em] text-xs`}>{card.tag}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic mb-2 group-hover/panel:text-3xl transition-all">{card.title}</h3>

                                    <div className="h-0 opacity-0 group-hover/panel:h-auto group-hover/panel:opacity-100 overflow-hidden transition-all duration-500 ease-out">
                                        <p className="text-slate-200 text-sm mb-4 leading-relaxed font-medium">
                                            {card.description}
                                        </p>
                                        <span className={`inline-flex items-center gap-2 bg-white text-abysse px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest ${hoverBg} hover:text-white transition-colors`}>
                                            {card.buttonText} <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                </div>
            </section>

            {/* SECTION : FOCUS ACTIVITÉ (Le Char à Voile) */}
            <section id="vitesse" className="py-12 max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="group relative overflow-hidden rounded-[3rem] bg-abysse shadow-2xl flex flex-col lg:flex-row min-h-[550px]">
                    {/* Contenu Texte */}
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

                        <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12 border-l-4 border-orange-500/30 pl-8 italic">
                            "{homePageData?.focusChar?.description || "Glissez sur le sable à quelques centimètres du sol. Une expérience unique, propulsée par la seule force du vent sur l'immense plage de Coutainville."}"
                        </p>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <Link href={homePageData?.focusChar?.ctaButton?.link || "/activites"} className="inline-flex items-center justify-center px-10 py-4 bg-orange-500 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg group/btn shadow-orange-500/20">
                                {homePageData?.focusChar?.ctaButton?.text || "Réserver une séance"} <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                            </Link>
                            <Link href={homePageData?.focusChar?.infoButton?.link || "/activites"} className="inline-flex items-center justify-center px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                                {homePageData?.focusChar?.infoButton?.text || "En savoir plus"}
                            </Link>
                        </div>
                    </div>

                    {/* Visuel Impactant - Slideshow */}
                    <div className="flex-1 relative overflow-hidden min-h-[400px] lg:min-h-auto">
                        <div className="absolute inset-0 z-0">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={CHAR_IMAGES[currentCharIndex]}
                                    src={CHAR_IMAGES[currentCharIndex]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt="Pratique du char à voile"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Sharp Vertical Accent */}
                        <div className="absolute inset-y-0 left-0 w-px bg-white/10 hidden lg:block z-20"></div>

                        {/* Mobile Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-abysse via-transparent to-transparent lg:hidden z-10"></div>

                        {/* Indicateurs Slideshow */}
                        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                            {CHAR_IMAGES.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentCharIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/30'}`}
                                />
                            ))}
                        </div>

                        {/* Badge de vitesse stylisé */}
                        <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 max-w-[180px]">
                            <span className="text-orange-500 font-black text-3xl block leading-none mb-1">{homePageData?.focusChar?.badgeValue || "60+"}</span>
                            <span className="text-white font-bold text-[10px] uppercase tracking-widest leading-tight block">{homePageData?.focusChar?.badgeLabel || "Km/h de sensations pures"}</span>
                        </div>
                    </div>
                </div>
            </section >

            {/* SECTION : FOCUS ACTIVITÉ (La Glisse Extrême) */}
            < section id="adrenaline" className="py-12 max-w-[1600px] mx-auto px-6 relative z-10" >
                <div className="group relative overflow-hidden rounded-[3rem] bg-abysse shadow-2xl flex flex-col lg:flex-row-reverse min-h-[550px]">
                    {/* Contenu Texte */}
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

                        <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12 border-l-4 border-blue-500/30 pl-8 italic">
                            "{homePageData?.focusGlisse?.description || "Dominez les éléments. Wingfoil, Kitesurf ou Windsurf : repoussez vos limites avec les moniteurs du club sur l'un des meilleurs spots de Normandie."}"
                        </p>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <Link href={homePageData?.focusGlisse?.ctaButton?.link || "/activites?cat=Sensations"} className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg group/btn shadow-blue-500/20">
                                {homePageData?.focusGlisse?.ctaButton?.text || "Découvrir la glisse"} <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                            </Link>
                            <Link href={homePageData?.focusGlisse?.infoButton?.link || "/le-spot"} className="inline-flex items-center justify-center px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                                {homePageData?.focusGlisse?.infoButton?.text || "Le Spot"}
                            </Link>
                        </div>
                    </div>

                    {/* Visuel Impactant - Slideshow */}
                    <div className="flex-1 relative overflow-hidden min-h-[400px] lg:min-h-auto">
                        <div className="absolute inset-0 z-0">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={GLISSE_IMAGES[currentGlisseIndex]}
                                    src={GLISSE_IMAGES[currentGlisseIndex]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt="Sports de glisse extrême"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Sharp Vertical Accent */}
                        <div className="absolute inset-y-0 right-0 w-px bg-white/10 hidden lg:block z-20"></div>

                        {/* Mobile Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-abysse via-transparent to-transparent lg:hidden z-10"></div>

                        {/* Indicateurs Slideshow */}
                        <div className="absolute bottom-6 left-8 flex gap-2 z-20">
                            {GLISSE_IMAGES.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentGlisseIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`}
                                />
                            ))}
                        </div>

                        {/* Badge technique stylisé */}
                        <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 max-w-[180px]">
                            <span className="text-blue-400 font-black text-3xl block leading-none mb-1">{homePageData?.focusGlisse?.badgeValue || "Pure"}</span>
                            <span className="text-white font-bold text-[10px] uppercase tracking-widest leading-tight block">{homePageData?.focusGlisse?.badgeLabel || "Énergie & Adrénaline"}</span>
                        </div>
                    </div>
                </div>
            </section >

            {/* SECTION : FOCUS ACTIVITÉ (Bien-être & Slow Tourisme) */}
            < section id="bien-etre" className="py-12 max-w-[1600px] mx-auto px-6 relative z-10" >
                <div className="group relative overflow-hidden rounded-[3rem] bg-abysse shadow-2xl flex flex-col lg:flex-row min-h-[550px]">
                    {/* Contenu Texte */}
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

                        <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12 border-l-4 border-emerald-500/30 pl-8 italic">
                            "{homePageData?.focusBienEtre?.description || "Prenez le temps de vivre. Entre marche aquatique revitalisante et balades contemplatives en kayak ou paddle, découvrez la côte normande sous un autre angle, au rythme des marées."}"
                        </p>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <Link href={homePageData?.focusBienEtre?.ctaButton?.link || "/activites?cat=Bien-être"} className="inline-flex items-center justify-center px-10 py-4 bg-emerald-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all shadow-lg group/btn shadow-emerald-500/20">
                                {homePageData?.focusBienEtre?.ctaButton?.text || "S'évader en mer"} <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                            </Link>
                            <Link href={homePageData?.focusBienEtre?.infoButton?.link || "/activites"} className="inline-flex items-center justify-center px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-sm">
                                {homePageData?.focusBienEtre?.infoButton?.text || "Voir les tarifs"}
                            </Link>
                        </div>
                    </div>

                    {/* Visuel Impactant - Slideshow */}
                    <div className="flex-1 relative overflow-hidden min-h-[400px] lg:min-h-auto">
                        <div className="absolute inset-0 z-0">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={WELLBEING_IMAGES[currentWellbeingIndex]}
                                    src={WELLBEING_IMAGES[currentWellbeingIndex]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt="Bien-être et slow tourisme au CNC"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Sharp Vertical Accent */}
                        <div className="absolute inset-y-0 left-0 w-px bg-white/10 hidden lg:block z-20"></div>

                        {/* Mobile Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-abysse via-transparent to-transparent lg:hidden z-10"></div>

                        {/* Indicateurs Slideshow */}
                        <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                            {WELLBEING_IMAGES.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentWellbeingIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-white/30'}`}
                                />
                            ))}
                        </div>

                        {/* Badge oxygène stylisé */}
                        <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 max-w-[180px]">
                            <span className="text-emerald-400 font-black text-3xl block leading-none mb-1">{homePageData?.focusBienEtre?.badgeValue || "100%"}</span>
                            <span className="text-white font-bold text-[10px] uppercase tracking-widest leading-tight block">{homePageData?.focusBienEtre?.badgeLabel || "Oxygène & Sérénité Locale"}</span>
                        </div>
                    </div>
                </div>
            </section >

            {/* --- PILLAR STORY --- */}
            < PillarStory />

            {/* --- SECTION : MINI-JEU PÉDAGOGIQUE --- */}
            < section id="pedagogie" className="py-24 bg-abysse relative z-10" >
                <div className="max-w-[1600px] mx-auto px-6">
                    <GamesSlideshow />
                </div>
            </section >

            <section className="max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="h-12"></div>
            </section>

            {/* --- NOUVEAU : LE CLUB EN IMMERSION (Shop & Galerie) --- */}
            <section className="py-24 max-w-[1600px] mx-auto px-6 relative z-10" id="immersion">
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-yellow-400"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Style & Souvenirs</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                        Le Club <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-yellow-500">en Immersion.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>
            </section>

            {/* --- SECTION : PARTENAIRES --- */}
            <section id="reseau" className="py-24 bg-slate-50 border-t border-slate-100" >
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="size-1.5 rounded-full bg-slate-300"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Réseau & Soutiens</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-abysse uppercase tracking-tighter italic">
                            Nos <span className="text-turquoise">Partenaires</span>
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
            < PhotoWallGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
                title={homeGallery?.title || "Galerie Photos"}
            />

        </div >
    );
};

export default HomePage;
