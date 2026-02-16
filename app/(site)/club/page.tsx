"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
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
    Sparkles
} from 'lucide-react';

import { motion } from 'framer-motion';
import { SecondaryNav } from '@/components/SecondaryNav';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useContent } from '@/contexts/ContentContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// --- DATA FLOTTE ---
const FLEET_DATA = [
    {
        id: 'cata',
        name: 'Catamaran',
        subtitle: 'La Référence',
        gallery: [
            'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=2000&auto=format&fit=crop'
        ],
        stats: { speed: 95, difficulty: 60, adrenaline: 90 },
        description: "Du Topaz 10 pour l'initiation au Hobie Cat 16 pour la performance.",
        crew: "Solo / Double"
    },
    {
        id: 'char',
        name: 'Char à Voile',
        subtitle: 'Vitesse Pure',
        gallery: [
            'https://images.unsplash.com/photo-1620658408066-89b531405a8b?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519830842880-928929944634?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1605218427360-363941852445?q=80&w=2000&auto=format&fit=crop'
        ],
        stats: { speed: 85, difficulty: 40, adrenaline: 80 },
        description: "Pilotez au ras du sable. Accélération immédiate dès 8 ans.",
        crew: "Monoplace"
    },
    {
        id: 'wing',
        name: 'Wing & Kite',
        subtitle: 'Nouvelle Vague',
        gallery: [
            'https://images.unsplash.com/photo-1612459957245-0d0458df8643?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1544458514-6e6962cb1cb2?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1628173429871-3f0e01764491?q=80&w=2000&auto=format&fit=crop'
        ],
        stats: { speed: 70, difficulty: 95, adrenaline: 100 },
        description: "Voler au-dessus de l'eau. Matériel F-One & Duotone.",
        crew: "Solo"
    },
    {
        id: 'windsurf',
        name: 'Windsurf',
        subtitle: 'L\'Originale',
        gallery: [
            'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596423736772-799a4e3df530?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1473663175406-03c6237227d8?q=80&w=2000&auto=format&fit=crop'
        ],
        stats: { speed: 75, difficulty: 70, adrenaline: 85 },
        description: "Le contact pur avec les éléments. Du Funboard au Foil.",
        crew: "Solo"
    },
    {
        id: 'collectif',
        name: 'Habitables',
        subtitle: 'Esprit Équipage',
        gallery: [
            'https://images.unsplash.com/photo-1563462058316-29a399f665e7?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2000&auto=format&fit=crop'
        ],
        stats: { speed: 45, difficulty: 30, adrenaline: 40 },
        description: "Trimaran Magnum 21 pour découvrir le large en famille.",
        crew: "4-6 pers"
    },
    {
        id: 'paddles',
        name: 'Paddles',
        subtitle: 'Exploration',
        gallery: [
            'https://images.unsplash.com/photo-1541549467657-3f9f9d7c078d?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1516972352862-26ebf7756f87?q=80&w=2000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1655857202720-3054c728e02d?q=80&w=2000&auto=format&fit=crop'
        ],
        stats: { speed: 20, difficulty: 20, adrenaline: 30 },
        description: "Balade au fil de l'eau. Kayaks, SUP et Paddle Géant XXL.",
        crew: "1-8 pers"
    }
];

// --- NAVIGATION ANCRES ---
const SECTIONS = [
    { id: 'identity', label: 'Identité' },
    { id: 'team', label: 'L\'Équipe' },
    { id: 'site', label: 'Le Site' },
    { id: 'fleet', label: 'La Flotte' },
    { id: 'life', label: 'Vie du Club' },
];

const ClubPage: React.FC = () => {
    const { clubData } = useContent();

    // --- STATES FLOTTE ---
    const [activeFleetIndex, setActiveFleetIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        setCurrentImageIndex(0);
        setIsAutoPlay(true);
    }, [activeFleetIndex]);

    useEffect(() => {
        if (isAutoPlay) {
            autoPlayRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => {
                    const max = FLEET_DATA[activeFleetIndex].gallery.length;
                    return (prev + 1) % max;
                });
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlay, activeFleetIndex]);

    const nextImage = () => {
        setIsAutoPlay(false);
        const max = FLEET_DATA[activeFleetIndex].gallery.length;
        setCurrentImageIndex((prev) => (prev + 1) % max);
    };

    const prevImage = () => {
        setIsAutoPlay(false);
        const max = FLEET_DATA[activeFleetIndex].gallery.length;
        setCurrentImageIndex((prev) => (prev - 1 + max) % max);
    };

    const currentFleet = FLEET_DATA[activeFleetIndex];
    const hero = clubData?.hero;

    // --- GSAP ANIMATIONS ---
    const storytellerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main Storytelling Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: storytellerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    pin: pinContainerRef.current,
                    anticipatePin: 1
                }
            });

            // BG Image Transitions
            tl.to('.story-bg-1', { scale: 1.1, duration: 2, ease: "none" }, 0);

            // Chapter 2
            tl.to('.story-bg-1', { opacity: 0, duration: 1 }, 1)
                .to('.story-bg-2', { opacity: 1, scale: 1, duration: 1 }, 1)
                .to('.story-step-1', { opacity: 0, y: -100, filter: 'blur(10px)', duration: 0.8 }, 1)
                .to('.story-step-2', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 1.2)
                .to('.story-dot-1', { backgroundColor: 'transparent', duration: 0.5 }, 1)
                .to('.story-dot-2', { backgroundColor: '#14F1C8', duration: 0.5 }, 1.2)
                .to('.story-hint', { opacity: 0, duration: 0.5 }, 0.5);

            // Chapter 3
            tl.to('.story-bg-2', { opacity: 0, duration: 1 }, 2.5)
                .to('.story-bg-3', { opacity: 1, scale: 1, duration: 1 }, 2.5)
                .to('.story-step-2', { opacity: 0, y: -100, filter: 'blur(10px)', duration: 0.8 }, 2.5)
                .to('.story-step-3', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 2.7)
                .to('.story-dot-2', { backgroundColor: 'transparent', duration: 0.5 }, 2.5)
                .to('.story-dot-3', { backgroundColor: '#14F1C8', duration: 0.5 }, 2.7);

            // Chapter 4 (Finale)
            tl.to('.story-bg-3', { opacity: 0, duration: 1 }, 4)
                .to('.story-bg-4', { opacity: 1, scale: 1, duration: 1 }, 4)
                .to('.story-step-3', { opacity: 0, y: -100, filter: 'blur(10px)', duration: 0.8 }, 4)
                .to('.story-step-4', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, 4.2)
                .to('.story-dot-3', { backgroundColor: 'transparent', duration: 0.5 }, 4)
                .to('.story-dot-4', { backgroundColor: '#14F1C8', duration: 0.5 }, 4.2);

        }, storytellerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full font-sans bg-white pb-32">

            {/* 1. HERO HEADER - IMMERSIF */}
            <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-abysse">
                <div className="absolute inset-0 z-0">
                    <img
                        src={hero?.heroImage || "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=2000"}
                        className="w-full h-full object-cover opacity-50 scale-110"
                        alt="Sailing Club"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-abysse/80 via-abysse/40 to-white"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 max-w-[1400px] mt-20">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6"
                        >
                            <span className="text-turquoise text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Anchor size={14} /> Association Loi 1901
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.8] mb-12"
                        >
                            {hero?.title || "Bienvenue au"} <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">{hero?.subtitle || "Club Nautique."}</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-[280px]">
                                <div className="size-16 rounded-2xl bg-abysse flex items-center justify-center text-white shadow-lg shrink-0">
                                    <History size={32} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Depuis</p>
                                    <p className="text-4xl font-black text-abysse tracking-tighter">1978</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Héritage marin</p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-[280px]">
                                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                                    <Users size={32} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Communauté</p>
                                    <p className="text-3xl font-black text-white uppercase italic leading-none">450 Adhérents</p>
                                    <p className="text-[10px] text-white/60 font-bold mt-1 uppercase italic">Une grande famille</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. MENU SECONDAIRE STICKY */}
            <SecondaryNav sections={SECTIONS} />

            {/* 3. IDENTITÉ & VALEURS */}
            <section id="identity" className="py-16 px-6 max-w-[1400px] mx-auto">
                <div className="mb-12">
                    <div className="w-16 h-1 bg-turquoise rounded-full mb-6"></div>
                    <h2 className="text-3xl md:text-4xl text-abysse mb-6 leading-[0.9]">
                        Notre Projet :<br />L'Horizon pour Tous
                    </h2>
                    <p className="text-slate-600 text-lg font-medium max-w-2xl leading-relaxed">
                        {hero?.description || "Au Club Nautique de Coutainville (CNC), notre passion pour la mer s’exprime à travers un projet associatif solide et une vision moderne du nautisme."}
                    </p>
                </div>

                <div className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(clubData?.values || [
                            { title: "Transmission", description: "Un savoir-faire pédagogique reconnu pour accompagner chaque marin, du débutant à l'expert.", iconName: "GraduationCap" },
                            { title: "Inclusion", description: "Le label \"Tourisme & Handicap\" au cœur de notre identité, pour que la mer soit accessible à tous.", iconName: "Accessibility" },
                            { title: "Engagement", description: "Une gestion associative responsable et une sensibilisation permanente à la protection du littoral.", iconName: "ShieldCheck" }
                        ]).map((val, idx) => (
                            <div key={idx} className="bg-slate-50 p-10 rounded-4xl border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-lg mb-6 group-hover:bg-abysse group-hover:text-white transition-colors">
                                    {val.iconName === 'GraduationCap' && <GraduationCap size={28} />}
                                    {val.iconName === 'Accessibility' && <Accessibility size={28} />}
                                    {val.iconName === 'ShieldCheck' && <ShieldCheck size={28} />}
                                </div>
                                <h4 className="text-2xl text-abysse mb-3">{val.title}</h4>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {val.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOCK 2: L'ÉPOPÉE CNC (STORYTELLING GSAP - FULL-SCREEN IMMERSIVE) */}
            <div id="storyteller" ref={storytellerRef} className="relative w-full min-h-[500vh]">
                <div className="story-pin-container" ref={pinContainerRef}>
                    <div className="h-screen w-full relative overflow-hidden bg-abysse">
                        {/* Background Images Layer */}
                        <div className="absolute inset-0 z-0">
                            <img src="/images/imgBank/CataPharePointeAgon.jpg" className="story-bg-1 absolute inset-0 w-full h-full object-cover opacity-100 scale-100" alt="Héritage" />
                            <img src="/images/imgBank/naviguer.jpg" className="story-bg-2 absolute inset-0 w-full h-full object-cover opacity-0 scale-110" alt="Sensation" />
                            <img src="/images/imgBank/minimousse.jpg" className="story-bg-3 absolute inset-0 w-full h-full object-cover opacity-0 scale-110" alt="Transmission" />
                            <img src="/images/imgBank/Sauvetage.jpg" className="story-bg-4 absolute inset-0 w-full h-full object-cover opacity-0 scale-110" alt="Avenir" />

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-linear-to-b from-abysse/90 via-abysse/30 to-abysse z-10"></div>
                            <div className="absolute inset-0 bg-radial-at-c from-transparent to-abysse/60 z-10"></div>
                        </div>

                        {/* Centered Content Track */}
                        <div className="relative z-20 w-full h-full flex items-center justify-center">

                            {/* Step 1: L'Héritage */}
                            <div className="story-step-1 absolute text-center px-6 max-w-5xl">
                                <span className="text-turquoise font-black uppercase tracking-[0.4em] text-[10px] py-2 px-4 border border-turquoise/30 rounded-full mb-8 inline-block">Chapitre I</span>
                                <h3 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10">
                                    L'Appel du <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">Large.</span>
                                </h3>
                                <p className="text-slate-300 text-xl md:text-3xl font-medium italic max-w-3xl mx-auto leading-relaxed">
                                    "Depuis 1978, notre cœur bat au rythme des marées. Une institution née de la passion pure."
                                </p>
                            </div>

                            {/* Step 2: L'Ame */}
                            <div className="story-step-2 absolute opacity-0 text-center px-6 max-w-5xl translate-y-24">
                                <span className="text-turquoise font-black uppercase tracking-[0.4em] text-[10px] py-2 px-4 border border-turquoise/30 rounded-full mb-8 inline-block">Chapitre II</span>
                                <h3 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10">
                                    Vibration <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">Brute.</span>
                                </h3>
                                <p className="text-slate-300 text-xl md:text-3xl font-medium italic max-w-3xl mx-auto leading-relaxed">
                                    "Le sel sur la peau, le vent qui siffle. Ici, on fusionne avec les éléments."
                                </p>
                            </div>

                            {/* Step 3: La Famille */}
                            <div className="story-step-3 absolute opacity-0 text-center px-6 max-w-5xl translate-y-24">
                                <span className="text-turquoise font-black uppercase tracking-[0.4em] text-[10px] py-2 px-4 border border-turquoise/30 rounded-full mb-8 inline-block">Chapitre III</span>
                                <h3 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10">
                                    Cœur de <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">Transmission.</span>
                                </h3>
                                <p className="text-slate-300 text-xl md:text-3xl font-medium italic max-w-3xl mx-auto leading-relaxed">
                                    "Au CNC, le savoir se transmet comme un héritage précieux. Nous formons les capitaines de demain."
                                </p>
                            </div>

                            {/* Step 4: Vision Finale */}
                            <div className="story-step-4 absolute opacity-0 text-center px-6 max-w-5xl translate-y-24">
                                <Sparkles className="text-turquoise mx-auto mb-8" size={48} />
                                <h3 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.75] mb-10">
                                    Écrire <br />L'Avenir.
                                </h3>
                                <p className="text-slate-300 text-2xl md:text-4xl font-medium italic max-w-4xl mx-auto mb-16">
                                    "Un sillage durable, inclusif et audacieux."
                                </p>
                                <Link href="/infos-pratiques" className="inline-flex items-center gap-4 bg-turquoise text-abysse px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-2xl">
                                    Nous Rejoindre <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Side Progress Dots */}
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={`story-dot-${s} size-3 rounded-full border-2 border-white/20 transition-all duration-500`} />
                            ))}
                        </div>

                        {/* Bottom Scroll Hint */}
                        <div className="story-hint absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Scroller</span>
                            <div className="w-px h-12 bg-linear-to-b from-turquoise to-transparent animate-bounce"></div>
                        </div>
                    </div>
                    {/* Final design roundness only on the very bottom transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-white rounded-t-[3rem] z-50"></div>
                </div>
            </div>

            {/* 4. ÉQUIPE */}
            <section id="team" className="py-24 px-6 bg-white">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                        <div>
                            <span className="text-turquoise font-black uppercase tracking-widest text-[9px] mb-3 block">L'Humain avant tout</span>
                            <h2 className="text-3xl md:text-4xl text-abysse leading-none">Une Équipe<br />D'Experts</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {[
                            { name: "Jean-Pierre Marin", role: "Président", img: "https://i.pravatar.cc/150?u=jp" },
                            { name: "Marie Loic", role: "Trésorière", img: "https://i.pravatar.cc/150?u=marie" },
                            { name: "Paul Dubreuil", role: "Secrétaire", img: "https://i.pravatar.cc/150?u=paul" },
                            { name: "Sophie Mer", role: "Resp. Sportif", img: "https://i.pravatar.cc/150?u=sophie" },
                        ].map((member, i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center hover:shadow-xl transition-all group">
                                <div className="size-24 mx-auto rounded-full overflow-hidden mb-6 border-4 border-slate-50 group-hover:border-turquoise transition-colors shadow-inner">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h5 className="text-abysse text-xl leading-tight mb-2">{member.name}</h5>
                                <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-100 text-[9px] font-black text-turquoise uppercase tracking-widest hover:bg-turquoise hover:text-white transition-all">
                                    {member.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. LE SITE */}
            <section id="site" className="py-16 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="w-12 h-1 bg-turquoise mb-6"></div>
                        <h2 className="text-3xl md:text-4xl text-abysse leading-none mb-6">Un Balcon<br />sur la Mer</h2>
                        <p className="text-slate-600 font-medium leading-relaxed mb-8 text-lg">
                            Notre bâtiment, entièrement rénové, offre des conditions d'accueil optimales. Tout est pensé pour votre confort.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {["Club-House panoramique", "Accès direct plage", "Vestiaires chauffés", "Cale privée sécurisée"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 font-black text-abysse text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 size={16} className="text-turquoise" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative rounded-4xl overflow-hidden shadow-2xl h-[600px] border-8 border-white">
                        <img src="https://images.unsplash.com/photo-1516126489370-179ee771ae35?q=80&w=1200" className="w-full h-full object-cover" />
                        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur px-6 py-4 rounded-2xl shadow-xl">
                            <span className="text-abysse font-black text-xs uppercase italic block">Vue Imprenable</span>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Face aux Îles Chausey</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FLOTTE (Simplified for build) */}
            <section id="fleet" className="mb-20 px-6 max-w-[1600px] mx-auto text-center">
                <h2 className="text-3xl md:text-4xl text-abysse mb-12">L'Armada du CNC</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FLEET_DATA.slice(0, 3).map((fleet) => (
                        <div key={fleet.id} className="bg-slate-50 rounded-4xl overflow-hidden border border-slate-100 group">
                            <div className="h-64 overflow-hidden">
                                <img src={fleet.gallery[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={fleet.name} />
                            </div>
                            <div className="p-8">
                                <h4 className="text-2xl text-abysse mb-2">{fleet.name}</h4>
                                <p className="text-slate-500 text-sm italic">{fleet.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 10. CTA */}
            <section className="py-24 bg-abysse text-white text-center">
                <h2 className="text-4xl md:text-6xl mb-8">Envie de <span className="text-turquoise">Naviguer ?</span></h2>
                <Link href="/infos-pratiques" className="inline-flex items-center gap-4 bg-turquoise text-abysse px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-2xl">
                    Nous Rejoindre <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    );
};

export default ClubPage;
