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
    Sparkles,
    Waves
} from 'lucide-react';

import { motion } from 'framer-motion';
import { SecondaryNav } from '@/components/SecondaryNav';
import { PageHero } from '@/components/PageHero';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useCmsContent } from '@/contexts/ContentContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// --- ICON RESOLVER ---
const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
    History, Users, Anchor, Trophy, GraduationCap, Accessibility, ShieldCheck, Leaf, Compass, Zap, Sprout, Sparkles,
    Camera, MapPin, UserCheck, Building, Download, Quote, Megaphone, LifeBuoy, CheckCircle2
};

const resolveIcon = (name?: string, fallback?: React.FC<{ size?: number }>) => {
    if (name && ICON_MAP[name]) return ICON_MAP[name];
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
    { chapterLabel: 'Chapitre III', title: 'Cœur de', highlightText: 'Transmission.', quote: '"Au CNC, le savoir se transmet comme un héritage précieux. Nous formons les capitaines de demain."', image: '/images/imgBank/minimousse.jpg' },
    { chapterLabel: '', title: 'Écrire', highlightText: '', quote: '"Un sillage durable, inclusif et audacieux."', image: '/images/imgBank/Sauvetage.jpg', isFinalChapter: true },
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
    ]
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

// --- NAVIGATION ANCRES ---
const SECTIONS = [
    { id: 'identity', label: 'Identité' },
    { id: 'team', label: 'L\'Équipe' },
    { id: 'site', label: 'Le Site' },
    { id: 'fleet', label: 'La Flotte' },
    { id: 'life', label: 'Vie du Club' },
];

const ClubPage: React.FC = () => {
    const { clubData } = useCmsContent();

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

    // --- GSAP ANIMATIONS ---
    const storytellerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (storytelling.length < 2) return;

        const ctx = gsap.context(() => {
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

            // Dynamic chapters (skip first one which is visible by default)
            storytelling.forEach((_, idx) => {
                if (idx === 0) return;
                const time = idx * 1.5;
                tl.to(`.story-bg-${idx}`, { opacity: 0, duration: 1 }, time)
                    .to(`.story-bg-${idx + 1}`, { opacity: 1, scale: 1, duration: 1 }, time)
                    .to(`.story-step-${idx}`, { opacity: 0, y: -100, filter: 'blur(10px)', duration: 0.8 }, time)
                    .to(`.story-step-${idx + 1}`, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, time + 0.2)
                    .to(`.story-dot-${idx}`, { backgroundColor: 'transparent', duration: 0.5 }, time)
                    .to(`.story-dot-${idx + 1}`, { backgroundColor: '#14F1C8', duration: 0.5 }, time + 0.2);

                if (idx === 1) {
                    tl.to('.story-hint', { opacity: 0, duration: 0.5 }, 0.5);
                }
            });
        }, storytellerRef);
        return () => ctx.revert();
    }, [storytelling]);

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
                {heroStats.map((stat, i) => {
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
                    <p className="text-slate-600 text-lg font-medium max-w-2xl leading-relaxed">
                        {hero?.description || "Au Club Nautique de Coutainville (CNC), notre passion pour la mer s'exprime à travers un projet associatif solide et une vision moderne du nautisme."}
                    </p>
                </div>

                <div className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((val, idx) => {
                            const IconComp = resolveIcon(val.iconName);
                            return (
                                <div key={idx} className="bg-slate-50 p-10 rounded-4xl border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                    <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-lg mb-6 group-hover:bg-abysse group-hover:text-white transition-colors">
                                        {IconComp && <IconComp size={28} />}
                                    </div>
                                    <h4 className="text-2xl text-abysse mb-3">{val.title}</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        {val.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* BLOCK 2: L'ÉPOPÉE CNC (STORYTELLING GSAP - FULL-SCREEN IMMERSIVE) */}
            <div id="storyteller" ref={storytellerRef} className="relative w-full min-h-[500vh]">
                <div className="story-pin-container" ref={pinContainerRef}>
                    <div className="h-screen w-full relative overflow-hidden bg-abysse">
                        {/* Background Images Layer */}
                        <div className="absolute inset-0 z-0">
                            {storytelling.map((ch, idx) => (
                                <img
                                    key={idx}
                                    src={ch.image || ''}
                                    className={`story-bg-${idx + 1} absolute inset-0 w-full h-full object-cover ${idx === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                                    alt={ch.chapterLabel || `Chapter ${idx + 1}`}
                                />
                            ))}

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-linear-to-b from-abysse/90 via-abysse/30 to-abysse z-10"></div>
                            <div className="absolute inset-0 bg-radial-at-c from-transparent to-abysse/60 z-10"></div>
                        </div>

                        {/* Centered Content Track */}
                        <div className="relative z-20 w-full h-full flex items-center justify-center">
                            {storytelling.map((ch, idx) => (
                                <div
                                    key={idx}
                                    className={`story-step-${idx + 1} absolute text-center px-6 max-w-5xl ${idx > 0 ? 'opacity-0 translate-y-24' : ''}`}
                                >
                                    {ch.isFinalChapter ? (
                                        <>
                                            <Sparkles className="text-turquoise mx-auto mb-8" size={48} />
                                            <h3 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.75] mb-10">
                                                {ch.title} <br />L'Avenir.
                                            </h3>
                                            <p className="text-slate-300 text-2xl md:text-4xl font-medium italic max-w-4xl mx-auto mb-16">
                                                {ch.quote}
                                            </p>
                                            <Link href={storytellingCta.link} className="inline-flex items-center gap-4 bg-turquoise text-abysse px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-2xl">
                                                {storytellingCta.label} <ArrowRight size={18} />
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-turquoise font-black uppercase tracking-[0.4em] text-[10px] py-2 px-4 border border-turquoise/30 rounded-full mb-8 inline-block">{ch.chapterLabel}</span>
                                            <h3 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10">
                                                {ch.title} <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">{ch.highlightText}</span>
                                            </h3>
                                            <p className="text-slate-300 text-xl md:text-3xl font-medium italic max-w-3xl mx-auto leading-relaxed">
                                                {ch.quote}
                                            </p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Side Progress Dots */}
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6">
                            {storytelling.map((_, idx) => (
                                <div key={idx} className={`story-dot-${idx + 1} size-3 rounded-full border-2 border-white/20 transition-all duration-500`} />
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
                                {teamData.boardMembers.map((member, i) => (
                                    <div key={i} className="group relative bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <div className="size-20 mx-auto mb-4 relative">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white group-hover:border-turquoise transition-colors" />
                                            ) : (
                                                <div className="w-full h-full rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white group-hover:border-turquoise transition-all">
                                                    <span className="text-xl font-black text-slate-400 group-hover:text-turquoise transition-colors">
                                                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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

                    {/* --- L'ÉQUIPE SPORTIVE --- */}
                    {teamData.proTeam && teamData.proTeam.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <Waves size={24} className="text-turquoise" />
                                <h3 className="text-2xl font-black text-abysse uppercase italic tracking-tighter">L'Équipe Sportive & Opérationnelle</h3>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {teamData.proTeam.map((member, i) => (
                                    <div key={i} className="group relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
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
            </section>

            {/* 5. LE SITE */}
            <section id="site" className="py-16 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="w-12 h-1 bg-turquoise mb-6"></div>
                        <h2 className="text-3xl md:text-4xl text-abysse leading-none mb-6">{siteData.title}</h2>
                        <p className="text-slate-600 font-medium leading-relaxed mb-8 text-lg">
                            {siteData.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {siteData.facilities.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 font-black text-abysse text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 size={16} className="text-turquoise" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative rounded-4xl overflow-hidden shadow-2xl h-[600px] border-8 border-white">
                        <img src={siteData.image || ''} className="w-full h-full object-cover" />
                        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur px-6 py-4 rounded-2xl shadow-xl">
                            <span className="text-abysse font-black text-xs uppercase italic block">{siteData.imageCaption}</span>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{siteData.imageSublabel}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FLOTTE */}
            <section id="fleet" className="mb-20 px-6 max-w-[1600px] mx-auto text-center">
                <h2 className="text-3xl md:text-4xl text-abysse mb-12">{fleetTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {fleetItems.slice(0, 3).map((fleet, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-4xl overflow-hidden border border-slate-100 group">
                            <div className="h-64 overflow-hidden">
                                <img src={fleet.gallery?.[0] || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={fleet.name} />
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
                <h2 className="text-4xl md:text-6xl mb-8">{ctaData.title} <span className="text-turquoise">{ctaData.highlightText}</span></h2>
                <Link href={ctaData.buttonLink} className="inline-flex items-center gap-4 bg-turquoise text-abysse px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all shadow-2xl">
                    {ctaData.buttonLabel} <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    );
};

export default ClubPage;
