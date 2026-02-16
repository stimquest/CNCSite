'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const CHAPTERS = [
    {
        id: 'education',
        label: "L'Éducation",
        title: "Académie",
        titleSpan: "Nautique.",
        proof: "On forme des marins, pas des touristes.",
        desc: "Un parcours pédagogique structuré et labellisé par la FFVoile. Des Mini-Mousses de 4 ans jusqu'au CQP Initiateur professionnel — le CNC est une vraie école, avec une vraie exigence.",
        image: "/images/imgBank/minimousse.jpg",
        link: "/ecole-voile",
        linkLabel: "Découvrir l'École",
        accentClass: 'text-turquoise',
        borderClass: 'border-turquoise/30 hover:bg-turquoise hover:text-white',
        dotColor: 'var(--color-turquoise)',
    },
    {
        id: 'environnement',
        label: "L'Environnement",
        title: "La Pointe",
        titleSpan: "d'Agon.",
        proof: "Gardiens d'un site classé Natura 2000.",
        desc: "Notre plan d'eau n'est pas un décor. C'est un écosystème vivant — phoques veau-marins, oiseaux migrateurs, prés-salés. Le CNC assume une mission environnementale à chaque sortie.",
        image: "/images/imgBank/pointAgon.jpg",
        link: "/nature",
        linkLabel: "Explorer le site",
        accentClass: 'text-emerald-500',
        borderClass: 'border-emerald-500/30 hover:bg-emerald-500 hover:text-white',
        dotColor: '#10b981',
    },
    {
        id: 'expertise',
        label: "L'Expertise",
        title: "Sauvetage &",
        titleSpan: "Formation Pro.",
        proof: "Centre de formation agréé BNSSA.",
        desc: "Au-delà du loisir, le CNC forme les professionnels de la mer. Formations BNSSA, sécurité maritime, premiers secours — un rôle public que peu de clubs assument.",
        image: "/images/imgBank/Secourisme.jpg",
        link: "/ecole-voile",
        linkLabel: "En savoir plus",
        accentClass: 'text-orange-500',
        borderClass: 'border-orange-500/30 hover:bg-orange-500 hover:text-white',
        dotColor: '#f97316',
    },
    {
        id: 'communaute',
        label: "La Communauté",
        title: "Une Grande",
        titleSpan: "Famille.",
        proof: "50+ ans de transmission entre générations.",
        desc: "Le CNC vit parce que des bénévoles le portent, saison après saison. Régatiers, familles, anciens, nouveaux — une tribu soudée par la mer et les valeurs du partage.",
        image: "/images/imgBank/beneTracteur.jpg",
        link: "/club",
        linkLabel: "Rencontrer le Club",
        accentClass: 'text-[#014d86]',
        borderClass: 'border-[#014d86]/30 hover:bg-[#014d86] hover:text-white',
        dotColor: '#014d86',
    }
];

const PillarStory = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Simple crossfade for images
        CHAPTERS.forEach((_, i) => {
            const img = imagesRef.current[i];
            if (!img) return;
            gsap.to(img, {
                opacity: i === activeIndex ? 1 : 0,
                duration: 0.5,
                ease: 'power2.inOut',
                scale: i === activeIndex ? 1 : 1.05
            });
        });
    }, [activeIndex]);

    return (
        <section id="institution" className="relative w-full bg-slate-50 py-24 md:py-32 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6">

                {/* Section header */}
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-turquoise"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Campus Nautique</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                        Plus qu'un Club, <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">une Institution.</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 lg:gap-24 px-2">

                    {/* LEFT: Dynamic Image Showcase */}
                    <div className="w-full lg:w-[50%] order-2 lg:order-1 flex">
                        <div className="relative w-full h-full min-h-[500px] rounded-[2rem] overflow-hidden bg-slate-200 shadow-2xl shadow-slate-400/20">
                            {CHAPTERS.map((ch, i) => (
                                <div
                                    key={ch.id}
                                    ref={el => { imagesRef.current[i] = el; }}
                                    className="absolute inset-0 transition-transform duration-700 ease-out"
                                    style={{ opacity: i === 0 ? 1 : 0 }}
                                >
                                    <img
                                        src={ch.image}
                                        alt={ch.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Subtle overlay gradient to blend with background */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Interactive Accordion */}
                    <div className="w-full lg:w-[35%] order-1 lg:order-2">
                        <div className="flex flex-col border-t border-slate-200">
                            {CHAPTERS.map((ch, i) => {
                                const isActive = activeIndex === i;
                                return (
                                    <div
                                        key={ch.id}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        onClick={() => setActiveIndex(i)}
                                        className="group py-6 md:py-8 cursor-pointer transition-all duration-300 border-b border-slate-200"
                                    >
                                        {/* Accordion Header */}
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors duration-300 ${ch.accentClass}`}>
                                                    {ch.label}
                                                </span>
                                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase italic tracking-tighter leading-none transition-all duration-300 text-abysse">
                                                    {ch.title} <span className={ch.accentClass}>{ch.titleSpan}</span>
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Accordion Content */}
                                        <div
                                            className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="pt-6">
                                                    <p className="text-slate-400 text-sm font-semibold italic mb-4">
                                                        {ch.proof}
                                                    </p>
                                                    <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-xl mb-8">
                                                        {ch.desc}
                                                    </p>
                                                    <Link
                                                        href={ch.link}
                                                        className={`group/btn inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 w-fit border ${ch.accentClass} ${ch.borderClass}`}
                                                    >
                                                        {ch.linkLabel} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default PillarStory;
