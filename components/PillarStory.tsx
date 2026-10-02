'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import styles from './PillarStory.module.css';

const CHAPTERS = [
    {
        id: 'education',
        label: "Apprendre dans la durée",
        audience: "Enfants, jeunes et adultes",
        title: "L’école",
        titleSpan: "à l’année.",
        proof: "Progresser au fil des séances.",
        desc: "Retrouver son groupe chaque semaine, prendre confiance et progresser en voile. Les mercredis pour les enfants, les samedis pour les jeunes et les adultes : un rendez-vous régulier avec la mer.",
        image: "/images/imgBank/minimousse.jpg",
        link: "/ecole-voile#ecole-annee",
        linkLabel: "Découvrir l’école à l’année",
        accentClass: 'text-turquoise',
        borderClass: 'border-turquoise/30 hover:bg-turquoise hover:text-white',
        dotColor: 'var(--color-turquoise)',
    },
    {
        id: 'environnement',
        label: "Comprendre le littoral",
        audience: "Pour les curieux de nature",
        title: "La Pointe",
        titleSpan: "d'Agon.",
        proof: "Observer pour mieux préserver.",
        desc: "Comprendre les marées, reconnaître les habitants de l’estran et découvrir les bons gestes sur le littoral. La Pointe d’Agon est aussi un terrain d’observation et d’apprentissage.",
        image: "/images/imgBank/pointAgon.jpg",
        link: "/nature#estran",
        linkLabel: "Découvrir l’estran et sa biodiversité",
        accentClass: 'text-emerald-500',
        borderClass: 'border-emerald-500/30 hover:bg-emerald-500 hover:text-white',
        dotColor: '#10b981',
    },
    {
        id: 'expertise',
        label: "Transmettre et secourir",
        audience: "Futurs encadrants, moniteurs et bénévoles",
        title: "Formation &",
        titleSpan: "secourisme.",
        proof: "Se former pour encadrer et intervenir.",
        desc: "Devenir initiateur voile, développer ses compétences de moniteur ou apprendre les gestes de premiers secours. Retrouvez les formations proposées par le club et leurs conditions d’accès.",
        image: "/images/imgBank/Secourisme.jpg",
        link: "/ecole-voile#formations-pro",
        linkLabel: "Voir les formations et les prérequis",
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

interface PillarStoryProps {
    campusData?: any;
    compact?: boolean;
}

const PillarStory = ({ campusData, compact = false }: PillarStoryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
    const compactRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!compact || !compactRef.current) return;
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (preference.matches) return;
        const animations: Animation[] = [];
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                if (preference.matches) return;
                animations.push(entry.target.animate([
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                ], {
                    duration: 450,
                    delay: Number((entry.target as HTMLElement).dataset.campusReveal || 0) * 70,
                    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
                    fill: 'backwards',
                }));
            });
        }, { threshold: 0.15 });
        compactRef.current.querySelectorAll('[data-campus-reveal]').forEach(el => observer.observe(el));
        const stop = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
        preference.addEventListener('change', stop);
        return () => {
            observer.disconnect();
            animations.forEach(animation => animation.cancel());
            preference.removeEventListener('change', stop);
        };
    }, [compact]);

    const displayChapters = campusData?.chapters?.length ? campusData.chapters.map((ch: any, i: number) => {
        const theme = ch.themeColor || 'turquoise';
        let accentClass = 'text-turquoise';
        let borderClass = 'border-turquoise/30 hover:bg-turquoise hover:text-white';
        let dotColor = 'var(--color-turquoise)';
        
        if (theme === 'emerald') {
            accentClass = 'text-emerald-500';
            borderClass = 'border-emerald-500/30 hover:bg-emerald-500 hover:text-white';
            dotColor = '#10b981';
        } else if (theme === 'orange') {
            accentClass = 'text-orange-500';
            borderClass = 'border-orange-500/30 hover:bg-orange-500 hover:text-white';
            dotColor = '#f97316';
        } else if (theme === 'blue') {
            accentClass = 'text-[#014d86]';
            borderClass = 'border-[#014d86]/30 hover:bg-[#014d86] hover:text-white';
            dotColor = '#014d86';
        }

        return {
            id: `chapter-${i}`,
            label: ch.label || '',
            audience: ch.audience || '',
            title: ch.title || '',
            titleSpan: ch.titleSpan || '',
            proof: ch.proof || '',
            desc: ch.desc || '',
            image: ch.image || '/images/imgBank/minimousse.jpg',
            link: ch.link || '#',
            linkLabel: ch.linkLabel || 'Découvrir',
            accentClass,
            borderClass,
            dotColor
        };
    }) : CHAPTERS;

    useEffect(() => {
        if (compact) return;
        // Simple crossfade for images
        displayChapters.forEach((_: any, i: number) => {
            const img = imagesRef.current[i];
            if (!img) return;
            gsap.to(img, {
                opacity: i === activeIndex ? 1 : 0,
                duration: 0.5,
                ease: 'power2.inOut',
                scale: i === activeIndex ? 1 : 1.05
            });
        });
    }, [activeIndex, compact]);

    if (compact) return (
        <section ref={compactRef} id="institution" aria-labelledby="campus-title" className="scroll-mt-24 bg-white py-12 md:py-16">
            <div className="mx-auto max-w-400 px-5 md:px-6">
                <div data-campus-reveal="0" className="mb-8 flex flex-wrap items-end justify-between gap-5">
                    <div className="max-w-3xl">
                        <h2 id="campus-title" className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-abysse">{campusData?.compactTitle || 'Un campus ouvert sur la mer'}</h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{campusData?.intro || 'Au CNC, la mer est aussi un lieu d’apprentissage : pratiquer toute l’année, comprendre le littoral et se former pour transmettre.'}</p>
                    </div>
                    <Link href="/club#identity" className="md:mr-16 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-abysse rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise">Découvrir l’association <ArrowRight size={16} /></Link>
                </div>
                <div className="grid gap-8 md:grid-cols-3 md:gap-8">
                    {displayChapters.filter((ch: any) => ch.link?.split('#')[0] !== '/club').slice(0, 3).map((ch: any, index: number) => (
                        <article data-campus-reveal={index + 1} key={ch.id} className={styles.chapter}>
                            <Link href={ch.link} className={`${styles.card} group flex flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise`}>
                                <div className="h-48 w-full overflow-hidden rounded-xl md:h-44 lg:h-56">
                                    <img src={ch.image} alt="" loading="lazy" className={`${styles.image} h-full w-full object-cover`} />
                                </div>
                                <div className="min-w-0 flex flex-1 flex-col pt-5">
                                    <p className={`mb-2 text-xs font-bold ${ch.accentClass}`}>{ch.label}</p>
                                    <h3 className="text-lg lg:text-xl font-black uppercase italic leading-tight text-abysse">{ch.title} <span className={ch.accentClass}>{ch.titleSpan}</span></h3>
                                    {ch.audience && <p className="mt-3 text-sm font-semibold text-abysse">{ch.audience}</p>}
                                    <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-600">{ch.desc}</p>
                                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-abysse group-hover:text-turquoise">{ch.linkLabel} <ArrowRight size={14} className={`${styles.arrow} shrink-0`} /></span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
                <aside data-campus-reveal="4" aria-labelledby="play-title" className={styles.playInvite}>
                    <div className={styles.playArtwork}>
                        <img src="/images/Games/illu_mini_Game2.jpeg" alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className={styles.playCopy}>
                        <p className={styles.playEyebrow}>Mini-jeux & dico des parents</p>
                        <h3 id="play-title" className={styles.playTitle}>Qui a le pied marin ?</h3>
                        <p className={styles.playDescription}>Prenez la barre du simulateur, testez vos réflexes en mer et décodez les mots des moussaillons. Des jeux et un dico pour s’amuser, même les pieds au sec.</p>
                        <div className={styles.playActions}>
                            <Link href="/apprendre" className={styles.playButton}>À moi de jouer ! <ArrowRight size={18} className={styles.arrow} /></Link>
                            <span className={styles.playNote}>À partager en famille, petits et grands.</span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );

    return (
        <section id="institution" className="relative w-full bg-slate-50 py-24 md:py-32 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6">

                {/* Section header */}
                <div className="mb-12 px-2">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-turquoise"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{campusData?.tagline || "Campus Nautique"}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                        {campusData?.titlePart1 || "Plus qu'un Club,"} <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">{campusData?.titlePart2 || "une Institution."}</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 lg:gap-24 px-2">

                    {/* LEFT: Dynamic Image Showcase (Hidden on Mobile) */}
                    <div className="hidden lg:flex w-full lg:w-[50%] order-2 lg:order-1">
                        <div className="relative w-full h-full min-h-[500px] rounded-[2rem] overflow-hidden bg-slate-200 shadow-2xl shadow-slate-400/20">
                            {displayChapters.map((ch: any, i: number) => (
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
                            {displayChapters.map((ch: any, i: number) => {
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
