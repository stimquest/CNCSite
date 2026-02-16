"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Trees, Bird, Waves, Map as MapIcon,
    Compass, Wind, Info, Heart,
    ArrowRight, Anchor, Navigation,
    Binoculars, Camera, Shield, Eye,
    Sparkles, ChevronRight, ChevronLeft, AlertCircle, Package, Trophy,
    Ruler, Hammer, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ObservationPoint } from '../../../components/NatureMap';
import { useContent } from '@/contexts/ContentContext';

// Helper to get Lucide icon from string name
const getIconByName = (name: string, size = 24) => {
    switch (name.toLowerCase()) {
        case 'waves': return <Waves size={size} />;
        case 'package': return <Package size={size} />;
        case 'shieldalert': return <ShieldAlert size={size} />;
        case 'ruler': return <Ruler size={size} />;
        case 'hammer': return <Hammer size={size} />;
        case 'binoculars': return <Binoculars size={size} />;
        case 'anchor': return <Anchor size={size} />;
        case 'trees': return <Trees size={size} />;
        case 'bird': return <Bird size={size} />;
        case 'compass': return <Compass size={size} />;
        case 'navigation': return <Navigation size={size} />;
        case 'camera': return <Camera size={size} />;
        case 'shield': return <Shield size={size} />;
        case 'eye': return <Eye size={size} />;
        case 'sparkles': return <Sparkles size={size} />;
        case 'trophy': return <Trophy size={size} />;
        default: return <Info size={size} />;
    }
};

const getObservationIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'faune': return <Binoculars size={20} className="text-turquoise" />;
        case 'patrimoine': return <Anchor size={20} className="text-abysse" />;
        case 'flore': return <Trees size={20} className="text-green-600" />;
        case 'oiseaux': return <Bird size={20} className="text-orange-500" />;
        default: return <MapIcon size={20} className="text-slate-400" />;
    }
};

// Register GSAP (Safe for client-side)
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Import dynamique de la carte pour éviter les erreurs SSR de Leaflet
const NatureMap = dynamic(() => import('../../../components/NatureMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-[3.5rem]">
        <MapIcon className="text-slate-300 animate-bounce" size={48} />
    </div>
});

// --- FALLBACK DATA ---
const FALLBACK_OBSERVATIONS: ObservationPoint[] = [
    {
        id: 'phoques',
        title: 'Colonie de Phoques',
        type: 'Faune',
        icon: <Binoculars size={20} className="text-turquoise" />,
        desc: "Une colonie de phoques veau-marin réside au cœur du havre. Ils sont particulièrement visibles à marée basse sur les bancs de sable.",
        tip: "L'observation doit se faire à plus de 300m pour ne pas perturber leur repos. Utilisez des jumelles !",
        position: [49.021, -1.564],
        images: [
            "https://images.unsplash.com/photo-1547035160-2647c093a778?q=80&w=800",
            "https://images.unsplash.com/photo-1621508202501-9f9392211462?q=80&w=800",
            "https://images.unsplash.com/photo-1590009628045-81498b9a9d70?q=80&w=800"
        ]
    }
];

const FALLBACK_HABITANTS = [
    {
        name: "Le Phoque Veau-Marin",
        scientificName: "Phoca vitulina",
        image: "https://images.unsplash.com/photo-1547035160-2647c093a778?q=80&w=800",
        tags: ["★ Espèce Protégée", "• Bancs de sable"],
        tagColor: "text-turquoise",
        description: "Emblème local du havre. Il ne faut jamais tenter de les approcher directement, surtout lorsqu'ils se reposent sur les bancs de sable à marée basse."
    }
];

export const NaturePage: React.FC = () => {
    const { natureData, isLoading } = useContent();
    const [activePoint, setActivePoint] = useState<ObservationPoint | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const estranRef = useRef<HTMLDivElement>(null);
    const biodivRef = useRef<HTMLDivElement>(null);
    const exploreRef = useRef<HTMLElement>(null);
    const exploreWrapperRef = useRef<HTMLDivElement>(null);

    // Transform observations from Sanity to ObservationPoint
    const observations: ObservationPoint[] = React.useMemo(() => {
        if (!natureData?.observations) return FALLBACK_OBSERVATIONS;
        return natureData.observations.map(obs => ({
            id: obs.id,
            title: obs.title,
            type: obs.type,
            desc: obs.description,
            tip: obs.tip,
            position: [obs.coordinates.lat, obs.coordinates.lng],
            images: obs.images,
            icon: getObservationIcon(obs.type)
        }));
    }, [natureData?.observations]);

    const habitants = natureData?.habitants?.list || FALLBACK_HABITANTS;

    // Reset slide when point changes
    useEffect(() => {
        setCurrentSlide(0);
    }, [activePoint?.id]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // General Fade In for Sections
            const sections = gsap.utils.toArray<HTMLElement>(".educational-section");
            sections.forEach(section => {
                gsap.from(section.children, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out"
                });
            });

            // Specific Grid Animation for Biodiv
            const bioCards = gsap.utils.toArray<HTMLElement>(biodivRef.current?.querySelectorAll(".bio-card") || []);
            bioCards.forEach((card, idx) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: 'play none none reverse'
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });

            // Exploration Section Parallax & Content Reveal
            const cards = gsap.utils.toArray<HTMLElement>(".exploration-card");
            cards.forEach((card, i) => {
                const img = card.querySelector("img");
                const content = card.querySelector(".z-10");

                // Background Parallax
                gsap.fromTo(img,
                    { scale: 1.3, opacity: 0.4 },
                    {
                        scale: 1,
                        opacity: 0.7,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "top top",
                            scrub: true
                        }
                    }
                );

                // Content Reveal
                gsap.fromTo(content,
                    { y: 100, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 40%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        });
        return () => ctx.revert();
    }, [natureData]);

    return (
        <div className="w-full font-sans bg-white pb-24">
            {/* 1. HERO SECTION */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={natureData?.hero?.heroImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2500"}
                        className="w-full h-full object-cover"
                        alt="Pointe d'Agon"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-abysse/30 via-transparent to-white"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-white/20 mb-8 inline-block shadow-2xl">
                            Espace Naturel Protégé
                        </span>
                        <h1 className="text-6xl md:text-8xl text-white drop-shadow-2xl mb-8 leading-[0.85]">
                            {natureData?.hero?.title || "La Pointe d'Agon"}
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            {natureData?.hero?.description || "Là où la terre s'efface devant la mer. Un sanctuaire de dunes et d'estuaire, sauvage et préservé."}
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* 2. LE PHÉNOMÈNE DES MARÉES (Educational - GSAP Pinned) */}
            {/* 2. L'ESTRAN : COMPRENDRE LES MARÉES */}
            {/* 2. L'ESTRAN : COMPRENDRE LES MARÉES */}
            <section className="py-24 bg-white educational-section" ref={estranRef}>
                <div className="container mx-auto px-6 max-w-[1300px]">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        {/* Title Column */}
                        <div className="md:w-1/3 sticky top-32">
                            <span className="text-turquoise text-xs font-black uppercase tracking-widest mb-4 block">
                                {natureData?.estran?.tag || "Phénomène Naturel"}
                            </span>
                            <h2 className="text-4xl md:text-5xl text-abysse mb-8 leading-[0.9]">
                                {natureData?.estran?.title || "La Respiration du Littoral"}
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mb-10">
                                {natureData?.estran?.description || "Coutainville est le théâtre de l'un des plus grands marnages du monde. Comprendre ce mouvement perpétuel est la première étape de l'observation."}
                            </p>

                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Waves size={80} className="text-abysse" />
                                </div>
                                <span className="text-6xl font-black text-abysse block mb-2">{natureData?.estran?.marnageValue || "13m"}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{natureData?.estran?.marnageLabel || "Différence de hauteur d'eau max."}</span>
                            </div>
                        </div>

                        {/* Content Column (Grid) */}
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 md:col-span-2 group hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-500">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 text-abysse shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                        <Waves size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl text-abysse mb-3">Zone Intertidale</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Lorsque la mer se retire, elle découvre l'estran sur plusieurs kilomètres. Ce n'est pas un désert, mais une zone de chasse et de nourrissage intense pour la faune. Les "criches" (chenaux de drainage) restent en eau et servent de refuge.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-500">
                                <div className="mb-6 text-abysse w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-lg text-abysse mb-3">La Laisse de Mer</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Ce cordon d'algues n'est pas "sale". En se décomposant, il nourrit les invertébrés (puces de mer) qui nourrissent eux-mêmes les oiseaux. Il piège aussi le sable et consolide la dune.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all duration-500">
                                <div className="mb-6 text-orange-600 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                    <ShieldAlert size={24} />
                                </div>
                                <h3 className="text-lg text-abysse mb-3">Prudence !</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    La marée remonte vite. La règle : dès que la mer "étale" (cesse de descendre), on commence à remonter vers la côte.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. BIODIVERSITÉ (Inventaire Naturaliste - GRID, no scroll) */}
            {/* 3. BIODIVERSITÉ (Inventaire Naturaliste - HORIZONTAL MASONRY) */}
            <section className="py-24 bg-abysse text-white overflow-hidden" ref={biodivRef}>
                <div className="container mx-auto px-6 max-w-[1700px]"> {/* Trait d'union pour largeur max */}
                    <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                        <div>
                            <span className="text-turquoise text-xs font-black uppercase tracking-widest mb-2 block">
                                {natureData?.habitants?.tag || "Inventaire du Vivant"}
                            </span>
                            <h2 className="text-4xl md:text-6xl">
                                {natureData?.habitants?.title || "Habitants des Lieux"}
                            </h2>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 animate-pulse">
                                Glisser pour explorer
                            </span>
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                                <ArrowRight size={20} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Masonry Container 
                        Height increased to ~1100px to avoid gaps/holes in layout.
                    */}
                    <div
                        className="flex flex-col flex-wrap content-start h-[90vh] min-h-[1100px] gap-8 overflow-x-auto overflow-y-hidden pb-8 cursor-grab active:cursor-grabbing scrollbar-hide px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onMouseDown={(e) => {
                            const slider = e.currentTarget;
                            let isDown = true;
                            let startX = e.pageX - slider.offsetLeft;
                            let scrollLeft = slider.scrollLeft;

                            const onMouseLeave = () => { isDown = false; };
                            const onMouseUp = () => { isDown = false; };
                            const onMouseMove = (e: MouseEvent) => {
                                if (!isDown) return;
                                e.preventDefault();
                                const x = e.pageX - slider.offsetLeft;
                                const walk = (x - startX) * 2;
                                slider.scrollLeft = scrollLeft - walk;
                            };

                            slider.addEventListener('mouseleave', onMouseLeave);
                            slider.addEventListener('mouseup', onMouseUp);
                            slider.addEventListener('mousemove', onMouseMove as any);

                            slider.onmouseup = () => {
                                slider.removeEventListener('mouseleave', onMouseLeave);
                                slider.removeEventListener('mouseup', onMouseUp);
                                slider.removeEventListener('mousemove', onMouseMove as any);
                                slider.onmouseup = null;
                            };
                        }}
                    >
                        {habitants.map((specie, idx) => (
                            <div
                                key={idx}
                                className="bio-card w-[320px] md:w-[420px] shrink-0 bg-white/5 border border-white/10 rounded-[2.5rem] p-5 hover:bg-white/10 transition-all duration-500 hover:border-turquoise/30 group select-none"
                            >
                                <div className={`relative rounded-[2rem] overflow-hidden mb-5 bg-white/5 ${idx % 3 === 0 ? 'h-72' : idx % 2 === 0 ? 'h-56' : 'h-64'}`}>
                                    <img
                                        src={specie.image}
                                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        alt={specie.name}
                                        loading="lazy"
                                        draggable={false}
                                    />
                                    <div className="absolute top-3 left-3 bg-abysse/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide text-white border border-white/20">
                                        {specie.scientificName}
                                    </div>
                                </div>
                                <div className="px-1 pb-1">
                                    <h3 className="text-lg text-white mb-2 group-hover:text-turquoise transition-colors font-bold leading-tight">
                                        {specie.name}
                                    </h3>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-3 flex flex-wrap gap-2">
                                        {specie.tags?.map((tag, tIdx) => (
                                            <span key={tIdx} className={`px-1.5 py-0.5 rounded bg-white/5 ${tIdx === 0 ? specie.tagColor : ""}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-300 leading-snug opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3">
                                        {specie.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PÊCHE À PIED DURABLE (Table/List Layout) */}
            {/* 4. PÊCHE À PIED DURABLE (Glass Style) */}
            <section className="py-24 bg-linear-to-b from-slate-50 to-white border-y border-slate-200">
                <div className="container mx-auto px-6 max-w-[1300px]">
                    <div className="flex items-end gap-6 mb-12">
                        <div className="bg-turquoise/10 p-3 rounded-2xl text-turquoise">
                            <Ruler size={32} />
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1 block">{natureData?.peche?.tag || "Pratique Responsable"}</span>
                            <h2 className="text-4xl md:text-5xl text-abysse">
                                {natureData?.peche?.title || "La Pêche à Pied"}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-slate-50 to-transparent z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 relative z-10">
                            {/* Item 1 */}
                            <div className="p-10 hover:bg-slate-50/50 transition-colors">
                                <h4 className="text-abysse mb-6 text-lg">Tailles Minimales</h4>
                                <ul className="text-sm text-slate-600 space-y-4 font-medium">
                                    {(natureData?.peche?.sizes || [
                                        { label: 'Coque', value: '3 cm' },
                                        { label: 'Palourde', value: '4 cm' },
                                        { label: 'Huitre', value: '5 cm' },
                                        { label: 'Moule', value: '4 cm' }
                                    ]).map((size, idx) => (
                                        <li key={idx} className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span>{size.label}</span>
                                            <span className="bg-abysse text-white px-3 py-1 rounded-full text-xs font-bold">{size.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Item 2 */}
                            <div className="p-10 hover:bg-slate-50/50 transition-colors">
                                <h4 className="text-abysse mb-6 text-lg">Outils & Gestes</h4>
                                <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                                    {natureData?.peche?.toolsDescription || "Les râteaux sont strictement interdits car ils détruisent l'habitat."}
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                                            <Hammer size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase text-slate-400">Gratte</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-700 opacity-50 grayscale">
                                            <div className="relative">
                                                <Package size={20} />
                                                <div className="absolute inset-0 border-t-2 border-red-700 -rotate-45 top-1/2"></div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase text-slate-400 line-through">Râteau</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="p-10 bg-linear-to-br from-orange-50 to-white">
                                <div className="flex items-center gap-3 mb-6 text-orange-600">
                                    <ShieldAlert size={28} />
                                    <h4 className="text-orange-800 mb-6 text-lg">{natureData?.peche?.securityTitle || "Sécurité"}</h4>
                                </div>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {natureData?.peche?.securityDescription || "La marée remonte à la vitesse d'un cheval au galop."}
                                </p>
                                <a href="https://maree.info/43" target="_blank" rel="noopener noreferrer" className="mt-6 bg-white p-4 rounded-xl border border-orange-100 shadow-sm text-xs font-bold text-orange-800 flex items-center gap-3 hover:bg-orange-50 hover:border-orange-200 transition-all group">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">⚠</span>
                                    <span>{natureData?.peche?.securityTip || "Consultez toujours les horaires de marée le jour même."}</span>
                                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </a>

                                <a href="https://www.pecheapied-loisir.fr" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-orange-600 transition-colors group">
                                    <span>Guide & Bonnes Pratiques</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CARTE (Clean layout) */}
            <section className="py-20 bg-white" id="map">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <h2 className="text-2xl text-abysse mb-8 flex items-center gap-4">
                        <MapIcon size={24} />
                        Carte des Observations
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                        <div className="lg:col-span-8 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative z-0">
                            <NatureMap observations={observations} onSelectPoint={setActivePoint} activePointId={activePoint?.id} />
                        </div>
                        <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col overflow-y-auto">
                            {activePoint ? (
                                <div className="animate-fade-in">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-turquoise mb-2">{activePoint.type}</div>
                                    <h3 className="text-xl text-abysse mb-4">{activePoint.title}</h3>

                                    {activePoint.images && activePoint.images.length > 0 && (
                                        <div className="rounded-lg overflow-hidden mb-4 aspect-video">
                                            <img src={activePoint.images[0]} className="w-full h-full object-cover" alt={activePoint.title} />
                                        </div>
                                    )}

                                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                        {activePoint.desc}
                                    </p>

                                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-500 italic mt-auto">
                                        <span className="font-bold not-italic text-abysse block mb-1">Le Conseil :</span>
                                        {activePoint.tip}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                                    <Binoculars size={32} className="mb-3 opacity-50" />
                                    <p className="text-sm font-medium">Sélectionnez un point<br />sur la carte</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. EXPLORATION FOOTER (Minimalist) */}
            {/* 6. EXPLORATION IMMERSIVE (Vertical Stacking Cards) */}
            <section className="relative bg-abysse" ref={exploreRef}>
                {/* Header of the section */}
                <div className="py-24 text-center px-4 relative z-0">
                    <span className="text-turquoise text-sm font-black uppercase tracking-[0.3em] mb-4 block animate-pulse">
                        {natureData?.exploration?.tag || "Passer à l'action"}
                    </span>
                    <h2 className="text-4xl md:text-6xl text-white mb-6 relative inline-block">
                        {natureData?.exploration?.title || "Explorer le Havre"}
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-turquoise transform -skew-x-12"></span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        {natureData?.exploration?.description || "Le CNC vous propose une flotte complète pour découvrir la zone."}
                    </p>
                </div>

                {(natureData?.exploration?.cards && natureData.exploration.cards.length > 0 ? natureData.exploration.cards : [
                    {
                        title: "Canoë",
                        subtitle: "Kayak",
                        description: "L'approche furtive par excellence. Glissez sans bruit vers les bancs de sable pour observer les phoques sans les déranger.",
                        image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2500",
                        features: ["Solo ou Duo", "Accessible à tous", "Idéal marée haute"],
                        buttonText: "Louer un Kayak",
                        buttonLink: "/club"
                    },
                    {
                        title: "Stand Up",
                        subtitle: "Paddle",
                        description: "Une perspective unique sur le havre. Debout sur l'eau, profitez d'une visibilité parfaite sur les fonds marins et la lisière des dunes.",
                        image: "https://images.unsplash.com/photo-1516972352862-26ebf7756f87?q=80&w=2500",
                        features: ["Équilibre & Yoga", "Location 1h/2h", "Paddle Géant dispo"],
                        buttonText: "Réserver un Paddle",
                        buttonLink: "/club"
                    },
                    {
                        title: "Marche",
                        subtitle: "Aquatique",
                        description: "Le fitness marin par excellence. Une immersion totale pour tonifier son corps tout en profitant des bienfaits de l'iode normand.",
                        image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000",
                        features: ["Santé & Cardio", "Toute l'année", "Accompagnement expert"],
                        buttonText: "Planning Marche",
                        buttonLink: "/infos-pratiques"
                    }
                ]).map((card, idx) => {
                    // Fallback images if Sanity image is not yet uploaded
                    const fallbackImages = [
                        "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2500",
                        "https://images.unsplash.com/photo-1516972352862-26ebf7756f87?q=80&w=2500",
                        "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000"
                    ];
                    const displayImage = card.image || fallbackImages[idx] || fallbackImages[0];

                    return (
                        <div key={idx} className="exploration-card sticky top-0 h-screen flex items-center justify-center overflow-hidden border-t border-white/10 bg-black shadow-[0_-50px_100px_rgba(0,0,0,0.5)]" style={{ zIndex: 10 + idx }}>
                            <div className="absolute inset-0">
                                <img src={displayImage} className="w-full h-full object-cover opacity-85 scale-105" alt={card.title} />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10"></div>
                            </div>
                            <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className={idx % 2 === 0 ? "md:order-1" : "md:order-2 md:text-right"}>
                                    <h3 className="text-7xl md:text-9xl text-white mb-4 opacity-10">0{idx + 1}.</h3>
                                    <h2 className="text-5xl md:text-7xl text-white mb-6 leading-[0.9]">
                                        {card.title}<br /><span className="text-turquoise">{card.subtitle}</span>
                                    </h2>
                                    <p className={`text-xl text-slate-200 font-medium leading-relaxed mb-8 max-w-md ${idx % 2 !== 0 ? 'ml-auto' : ''}`}>
                                        {card.description}
                                    </p>
                                    <ul className={`space-y-3 mb-10 text-sm font-bold uppercase tracking-widest text-slate-400 ${idx % 2 !== 0 ? 'flex flex-col items-end' : ''}`}>
                                        {card.features?.map((feat, fIdx) => (
                                            <li key={fIdx} className="flex items-center gap-3">
                                                {idx % 2 !== 0 && feat}
                                                <span className="w-2 h-2 rounded-full bg-turquoise"></span>
                                                {idx % 2 === 0 && feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={card.buttonLink} className={`inline-block px-8 py-4 ${idx === 1 ? 'bg-transparent border-2 border-white text-white' : idx === 2 ? 'bg-turquoise text-abysse' : 'bg-white text-abysse'} rounded-full font-black uppercase tracking-widest hover:bg-turquoise hover:text-white transition-all transform hover:scale-105 shadow-xl`}>
                                        {card.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

        </div>
    );
};

export default NaturePage;
