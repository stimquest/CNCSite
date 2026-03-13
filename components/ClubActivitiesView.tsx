"use client";

import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Clock, Info, Heart } from 'lucide-react';
import { SVG_MAP } from '@/constants/iconRegistry';

// 1. DÉFINITION DES CHEMINS SVG (DYNAMIQUE VIA REGISTRE)
// SVG_MAP est maintenant importé de @/constants/iconRegistry

const getSmartIllustration = (category?: string, title?: string, badge?: string) => {
    const text = (`${category || ''} ${title || ''} ${badge || ''}`).toLowerCase();
    if (text.includes('char')) return SVG_MAP.Char;
    if (text.includes('marche') || text.includes('longe')) return SVG_MAP.Marche;
    if (text.includes('multi')) return SVG_MAP.Multi;
    if (text.includes('adulte')) return SVG_MAP.PlancheAdulte;
    if (text.includes('jeune') && (text.includes('planche') || text.includes('windsurf'))) return SVG_MAP.PlancheJeune;
    if (text.includes('catamaran')) return SVG_MAP.Catamaran;
    if (text.includes('moussaillon') || text.includes('petit') || text.includes('optimist')) return SVG_MAP.Optimist;
    return SVG_MAP.Catamaran; // Fallback par défaut
};

// 2. RENDU DES ICÔNES LUCIDE DYNAMIQUES
const getIcon = (iconName: string, fallbackIcon: any) => {
    return (LucideIcons as any)[iconName] || fallbackIcon;
};

const getGridColsClass = (length: number) => {
    if (length === 1) return 'lg:grid-cols-1 lg:max-w-2xl lg:mx-auto';
    return 'lg:grid-cols-2';
};

const getSmartColorClass = (givenClass?: string, text?: string) => {
    if (givenClass && givenClass.includes('bg-')) return givenClass;
    const t = text?.toLowerCase() || '';
    if (t.includes('moussaillon') || t.includes('petit')) return 'bg-turquoise text-white';
    if (t.includes('loisir') || t.includes('jeune')) return 'bg-orange-500 text-white';
    if (t.includes('catamaran')) return 'bg-blue-500 text-white';
    if (t.includes('marche') || t.includes('longe')) return 'bg-emerald-500 text-white';
    if (t.includes('char')) return 'bg-orange-600 text-white';
    if (t.includes('adulte')) return 'bg-abysse text-white';
    return 'bg-turquoise text-white';
};

const formatHeroTitle = (title: string | undefined) => {
    if (!title) return "Le Club à l'année.";
    const parts = title.split('.');
    return parts.map((p, i) => (
        <span key={i} className={`block ${i === 1 ? 'text-transparent bg-clip-text bg-linear-to-br from-abysse via-abysse to-turquoise' : ''}`}>
            {p}{i === 0 && parts.length > 1 ? '.' : ''}
        </span>
    ));
};

const ClubCard = ({ category, title, age, price, schedule, description, icon: iconKey, badge, colorClass: userColorClass }: any) => {
    const colorClass = getSmartColorClass(userColorClass, `${category} ${title} ${badge}`);
    // On récupère le chemin du SVG : 1. Choix manuel précis, 2. Alias de compatibilité, 3. Détection intelligente
    const illustration = (iconKey && SVG_MAP[iconKey]) || getSmartIllustration(category, title, badge);
    const bgColorClass = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-turquoise';
    // On extrait le nom de la couleur (ex: turquoise, sky-500) à partir de la classe bg-
    const colorBase = bgColorClass.replace('bg-', '');
    
    // Logique pour le texte du badge : si la couleur est très claire, on utilise une version foncée
    // Sinon on utilise la couleur elle-même
    let textColorClass = `text-${colorBase}`;
    if (colorBase.includes('-')) {
        const [name, weight]:any = colorBase.split('-');
        if (parseInt(weight) < 500) {
            textColorClass = `text-${name}-900`;
        }
    } else if (colorBase === 'sand') { // Cas particulier pour notre couleur sand
        textColorClass = 'text-sand-900';
    }
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden h-full flex flex-col"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-3xl opacity-[0.08] ${bgColorClass}`}></div>

            <div className="flex flex-col md:flex-row gap-6 mb-8 relative z-10">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {category && <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg bg-${colorBase}/15 ${textColorClass} backdrop-blur-sm`}>{category}</span>}
                        {badge && <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-400">{badge}</span>}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-abysse uppercase italic tracking-tighter leading-[0.85] mb-4">{title}</h3>
                    {age && <div className="flex items-center gap-2 mb-6"><span className="h-px w-4 bg-slate-200"></span><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{age}</p></div>}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Clock size={12} className="mt-1 text-slate-300" />
                            <p className="text-[11px] font-bold text-slate-700 leading-snug">{schedule}</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Info size={12} className="mt-1 text-slate-300" />
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">{description}</p>
                        </div>
                    </div>
                </div>

                {illustration && (
                    <div className="flex items-center justify-center md:justify-end md:w-2/5">
                        <div 
                            className={`w-36 h-36 md:w-48 md:h-48 transition-all group-hover:scale-110 duration-500 ${bgColorClass}`}
                            style={{
                                maskImage: `url(${illustration})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
                                WebkitMaskImage: `url(${illustration})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center',
                            }}
                        ></div>
                    </div>
                )}
            </div>

            <div className="pt-8 border-t border-slate-50 mt-auto relative z-10 flex items-end justify-between">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Cotisation</span>
                   <p className="text-[8px] text-slate-300 uppercase tracking-widest">HORS LICENCE & ADHÉSION</p>
                </div>
                <span className="text-4xl font-black text-abysse italic tracking-tighter">{price}</span>
            </div>
        </motion.div>
    );
};

const ClubActivitiesView = ({ data }: { data?: any }) => {
    const fallback = {
        intro: { 
            tag: "Esprit Associatif", 
            title: "Le Club. à l'année.",
            descLine1: "L'école de voile est une association Loi 1901 gérée par des bénévoles passionnés.",
            descLine2: "Venez nous retrouver à la Pointe d'Agon !"
        },
        sections: [
            {
                title: "Pôle Voile",
                icon: "Anchor",
                cards: [
                    { category: "Voile", title: "Petits Mousses", age: "6-8 ans", price: "115€", schedule: "Tous les mercredis", description: "Bases de l'Optimist.", icon: "Optimist", badge: "Optimist" },
                    { category: "Voile", title: "Les Mousses", age: "8-11 ans", price: "115€", schedule: "Tous les mercredis", description: "Naviguer en Mer.", icon: "Catamaran", badge: "Catamaran" },
                    { category: "Loisirs", title: "Jeunes", age: "12-15 ans", price: "170€", schedule: "Tous les samedis", description: "Planche à voile.", icon: "PlancheJeune" },
                    { category: "Loisirs", title: "Adultes", age: "Adultes", price: "185€", schedule: "Tous les samedis", description: "Perfectionnement.", icon: "PlancheAdulte" }
                ]
            },
            {
                title: "Pôle Char à Voile",
                icon: "Zap",
                cards: [
                    { category: "Char", title: "Jeunes Char", price: "180€", schedule: "Tous les samedis", description: "Vitesse sur sable.", icon: "Char" },
                    { category: "Char", title: "Adultes Char", price: "185€", schedule: "Tous les samedis", description: "Sensation Char.", icon: "Char" }
                ]
            },
            {
                title: "Pôle Marche Aquatique",
                icon: "Waves",
                cards: [
                    { category: "Marche", title: "La Tribu Marche", price: "102€", schedule: "Mercredi & Samedi", description: "Sorties revitalisantes.", icon: "Marche" }
                ]
            }
        ],
        footer: {
            title: "Prêt à nous rejoindre ?",
            description: "Les inscriptions à l'année se font directement au club.",
            buttonText: "Appeler le club",
            buttonPhone: "0233471481"
        }
    };

    const content = (data && data.poles && data.poles.length > 0) ? data : fallback;

    return (
        <div className="space-y-24">
            <header className="max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-turquoise/10 text-turquoise rounded-full">
                    <Heart size={16} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{content.intro?.tag}</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-abysse uppercase italic tracking-tighter leading-[0.9] drop-shadow-xl">
                    {formatHeroTitle(content.intro?.title)}
                </h2>
                <div className="space-y-4 text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                    <p>{content.intro?.descLine1}</p>
                    {content.intro?.descLine2 && <p className="text-sm text-slate-400 italic">{content.intro.descLine2}</p>}
                </div>
            </header>

            <div className="space-y-40">
                {content.poles?.map((pole: any, idx: number) => {
                    const PoleIcon = getIcon(pole.icon, LucideIcons.Anchor);
                    return (
                        <div key={idx} className="space-y-20">
                            <div className="flex flex-col items-center gap-6 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-turquoise/5 blur-[60px] rounded-full"></div>
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
                                    <div className="bg-white px-8 py-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm z-10">
                                        <div className="size-10 rounded-xl bg-abysse text-white flex items-center justify-center">
                                            <PoleIcon size={20} />
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-black text-abysse uppercase italic tracking-tighter">
                                            {pole.title}
                                        </h3>
                                    </div>
                                    <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
                                </div>
                            </div>
                            
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridColsClass(pole.activities?.length)} gap-10`}>
                                {pole.activities?.map((activity: any, aIdx: number) => (
                                    <ClubCard key={aIdx} {...activity} />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {content.footer && (
                    <footer className="footer-premium bg-abysse text-white rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544411047-c491574abb46?q=80&w=2000')] bg-cover"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-center">
                                <div className="size-20 bg-turquoise/20 text-turquoise rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                                    <LucideIcons.Users size={40} />
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                                {content.footer.title}
                            </h3>
                            <p className="text-slate-400 font-medium max-w-xl mx-auto">{content.footer.description}</p>
                            <a href={`tel:${content.footer.buttonPhone || '0233471481'}`} className="inline-flex items-center justify-center px-10 py-5 bg-white text-abysse rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                                {content.footer.buttonText || "Appeler le club"}
                            </a>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default ClubActivitiesView;
