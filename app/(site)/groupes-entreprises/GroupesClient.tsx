"use client";

import React from 'react';
import {
    Building2,
    PartyPopper,
    ArrowRight,
    Briefcase,
    Mail,
    MonitorPlay,
    Wifi,
    Coffee,
    CheckCircle2,
    Target,
    Users,
    Waves,
    Users2,
    Calendar,
    Utensils,
    Presentation,
    Zap,
    Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { GroupContactModal } from '@/components/GroupContactModal';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useState } from 'react';

interface GroupesClientProps {
    initialGroupsData: any;
}

const GroupesClient: React.FC<GroupesClientProps> = ({ initialGroupsData }) => {
    const pageBuilder = initialGroupsData?.pageBuilder || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState("");
    const [modalCategory, setModalCategory] = useState<'private' | 'school'>('private');

    // Helper function to resolve color classes based on the chosen theme
    const getThemeColors = (themeName: string = 'turquoise') => {
        switch (themeName) {
            case 'sable':
                return {
                    text: 'text-orange-500', 
                    gradientText: 'text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500',
                    bg: 'bg-orange-500',
                    border: 'border-orange-500',
                    lightBg: 'bg-orange-500/10',
                    groupHoverBg: 'group-hover:bg-orange-500',
                };
            case 'corail':
                return {
                    text: 'text-rose-500', 
                    gradientText: 'text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-orange-500',
                    bg: 'bg-rose-500',
                    border: 'border-rose-500',
                    lightBg: 'bg-rose-500/10',
                    groupHoverBg: 'group-hover:bg-rose-500',
                };
            case 'turquoise':
            default:
                return {
                    text: 'text-turquoise',
                    gradientText: 'text-transparent bg-clip-text bg-linear-to-r from-turquoise to-blue-500',
                    bg: 'bg-turquoise',
                    border: 'border-turquoise',
                    lightBg: 'bg-turquoise/10',
                    groupHoverBg: 'group-hover:bg-turquoise',
                };
        }
    };

    const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, activityName?: string) => {
        if (href.startsWith("#reservation") || href.startsWith("#contact")) {
            e.preventDefault();
            if (activityName) setSelectedActivity(activityName);
            
            // Allow triggering the school theme via URL hash (e.g. #reservation-school)
            if (href.includes("-school")) {
                setModalCategory('school');
            } else {
                setModalCategory('private');
            }
            
            setIsModalOpen(true);
        }
    };

    // Fallback if no pageBuilder items
    if (!pageBuilder || pageBuilder.length === 0) {
        return (
            <div className="min-h-screen bg-white font-sans selection:bg-turquoise selection:text-white flex items-center justify-center">
                <p className="text-slate-400">La page est en cours de construction dans Sanity...</p>
            </div>
        );
    }

    const heroSection = pageBuilder.find((block: any) => block._type === 'heroSection');

    const renderHero = () => {
        if (!heroSection) return null;
        return (
            <PageHero
                key={heroSection._key || 'hero'}
                image={heroSection.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000"}
                imageAlt={heroSection.title || "Hero"}
                tagIcon={<Users size={14} />}
                tagText={heroSection.tagText || "Scolaires • ACM • Entreprises • Privés"}
                title={heroSection.title || "Vivre l'Expérience"}
                subtitle={heroSection.subtitle || "De l'Équipage."}
            >
                {heroSection.stats && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-80">
                        <div className="size-16 rounded-2xl bg-abysse flex items-center justify-center text-white shadow-lg shrink-0">
                            <Users size={32} />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{heroSection.stats.label || "Capacité"}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-abysse tracking-tighter">{heroSection.stats.value || "120"}</span>
                                <span className="text-lg font-bold text-slate-400 uppercase italic">{heroSection.stats.unit || "pers."}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{heroSection.stats.subtext || "Infrastructure modulable"}</p>
                        </div>
                    </div>
                )}

                {heroSection.servicesText && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-70">
                        <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                            <Compass size={32} />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{heroSection.servicesText.label || "Infrastructures"}</p>
                            <p className="text-3xl font-black text-white uppercase italic leading-none">{heroSection.servicesText.mainText || "Confort & Vue"}</p>
                            <p className="text-[10px] text-white/60 font-bold mt-1 uppercase italic">{heroSection.servicesText.subtext || "Vestiaires • Douches • Réunion"}</p>
                        </div>
                    </div>
                )}
            </PageHero>
        );
    };

    // Build anchor ID map from block types
    const getAnchorId = (block: any, blockType: string) => {
        if (block.anchorId) return block.anchorId;
        switch (blockType) {
            case 'twoColumnsFeature': return 'entreprises';
            case 'gridShowcase': return 'particuliers';
            case 'ctaContact': return 'contact';
            default: return undefined;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-turquoise selection:text-white">
            {renderHero()}
            
            {pageBuilder.map((block: any, index: number) => {
                if (block._type === 'heroSection') return null; // Already rendered at top

                const key = block._key || `section-${index}`;
                const theme = getThemeColors(block.colorTheme);

                switch (block._type) {
                    case 'twoColumnsFeature':
                        return (
                            <section id={getAnchorId(block, block._type)} key={key} className="container mx-auto px-6 max-w-375 relative z-20 py-24 scroll-mt-20">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-8 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden group">
                                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                                            <div className="relative overflow-hidden min-h-75">
                                                <img
                                                    src={block.mainImage || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200"}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                    alt={block.titlePart1 || "Mise en avant"}
                                                />
                                                <div className="absolute inset-0 bg-abysse/10"></div>
                                            </div>
                                            <div className="p-10 md:p-14 flex flex-col justify-center">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className={`size-1.5 rounded-full ${theme.bg}`}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">{block.tag || "Cohésion & Nautisme"}</span>
                                                </div>
                                                <h2 className="text-4xl text-abysse leading-none mb-6">
                                                    {block.titlePart1 || "Séminaires"} <br />
                                                    <span className={theme.gradientText}>{block.titlePart2 || "Haute définition."}</span>
                                                </h2>
                                                <p className="text-slate-600 font-medium leading-relaxed mb-8 whitespace-pre-line">
                                                    {block.description || "Offrez à vos collaborateurs un cadre stimulant face à la mer."}
                                                </p>
                                                {block.features && (
                                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                                        {block.features.map((feat: any, idx: number) => {
                                                            return (
                                                                <div key={idx} className="flex items-center gap-3">
                                                                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-abysse">
                                                                        <DynamicIcon name={feat.iconName || 'Wifi'} size={16} />
                                                                    </div>
                                                                    <span className="text-xs font-bold text-abysse uppercase tracking-tight">{feat.text}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                                {block.buttonText && (
                                                    <Link
                                                        href={block.buttonLink || "#reservation"}
                                                        onClick={(e) => handleActionClick(e, block.buttonLink || "#reservation", block.titlePart1 || "")}
                                                        className={`inline-flex items-center justify-center gap-3 bg-abysse text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] ${theme.groupHoverBg} transition-all shadow-lg w-fit`}
                                                    >
                                                        {block.buttonText} <ArrowRight size={16} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {block.sideCard && (
                                        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
                                            <img
                                                src={block.sideCard.image || "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=800"}
                                                className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-110"
                                                alt={block.sideCard.title || "Teambuilding"}
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-abysse via-abysse/50 to-transparent"></div>

                                            <div className="relative z-10">
                                                <div className={`size-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center ${theme.text} mb-8`}>
                                                    <Target size={28} />
                                                </div>
                                                <h3 className="text-3xl text-white leading-none mb-4 whitespace-pre-line">{block.sideCard.title || "Challenge\nTeambuilding."}</h3>
                                                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                                    {block.sideCard.description || "Rallye nautique en catamaran, défis en kayak, ou grand prix de char à voile..."}
                                                </p>
                                            </div>

                                            <div className="relative z-10 pt-8 mt-12 border-t border-white/10 flex items-center justify-between">
                                                <span className={`${theme.text} font-black uppercase tracking-widest text-[10px]`}>{block.sideCard.bottomText || "6 à 80 participants"}</span>
                                                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                                    <Zap size={18} fill="currentColor" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );

                    case 'gridShowcase':
                        return (
                            <section id={getAnchorId(block, block._type)} key={key} className="py-24 bg-slate-50 overflow-hidden relative scroll-mt-20">
                                <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                                    <Compass size={400} className="text-abysse rotate-12" />
                                </div>

                                <div className="container mx-auto px-6 max-w-350 relative z-10">
                                    <div className="mb-16">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`size-2 rounded-full ${theme.bg} animate-pulse`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{block.tag || "Partager des émotions"}</span>
                                        </div>
                                        <h2 className="text-5xl md:text-6xl text-abysse leading-none">
                                            {block.titlePart1 || "Événements"} <span className={theme.gradientText}>{block.titlePart2 || "Privés."}</span>
                                        </h2>
                                    </div>

                                    {block.cards && block.cards.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {block.cards.map((card: any, idx: number) => {
                                                const ThemeConfig = {
                                                    orange: {
                                                        bg: 'bg-orange-50', text: 'text-orange-500', groupHoverBg: 'group-hover:bg-orange-500', icon: 'Zap'
                                                    },
                                                    purple: {
                                                        bg: 'bg-purple-50', text: 'text-purple-500', groupHoverBg: 'group-hover:bg-purple-500', icon: 'PartyPopper'
                                                    },
                                                    turquoise: {
                                                        bg: 'bg-turquoise/10', text: 'text-turquoise', groupHoverBg: 'group-hover:bg-turquoise', icon: 'Users2'
                                                    }
                                                };
                                                const theme = ThemeConfig[(card.colorTheme as keyof typeof ThemeConfig) || 'orange'] || ThemeConfig.orange;
                                                const iconNameToUse = card.iconName || theme.icon;

                                                return (
                                                    <div key={idx} className="bg-white p-10 rounded-4xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-all group">
                                                        <div className={`size-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-8 shadow-sm ${theme.groupHoverBg} group-hover:text-white transition-all`}>
                                                            <DynamicIcon name={iconNameToUse} size={28} />
                                                        </div>
                                                        <h3 className="text-2xl text-abysse mb-4">{card.title || "Carte"}</h3>
                                                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                                            {card.description}
                                                        </p>
                                                        {card.points && card.points.length > 0 && (
                                                            <ul className="space-y-3 mb-10">
                                                                {card.points.map((pt: string, pIdx: number) => (
                                                                    <li key={pIdx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                                                        <CheckCircle2 size={16} className={theme.text} /> {pt}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        {card.buttonText && (
                                                            <Link 
                                                                href={card.buttonLink || "#reservation"} 
                                                                onClick={(e) => handleActionClick(e, card.buttonLink || "#reservation", card.title || "")}
                                                                className={`w-full py-4 rounded-2xl bg-slate-50 text-abysse font-black uppercase tracking-widest text-[9px] ${theme.groupHoverBg} hover:text-white transition-all border border-slate-100 flex items-center justify-center gap-2`}
                                                            >
                                                                {card.buttonText} <ArrowRight size={14} />
                                                            </Link>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>
                        );

                    case 'ctaContact':
                        return (
                            <section key={key} className="py-32 container mx-auto px-6 max-w-300">
                                <div className="bg-abysse rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center shadow-[0_50px_100px_-20px_rgba(0,43,73,0.4)]">
                                    <img
                                        src={block.bgImage || "https://images.unsplash.com/photo-1519741497674-6113881432c6?q=80&w=1600"}
                                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                                        alt={block.titlePart1 || "Contact"}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-b from-abysse/50 to-abysse"></div>

                                    <div className="relative z-10">
                                        <span className={`${theme.text} font-black uppercase tracking-[0.4em] text-[10px] mb-8 block`}>{block.tag || "Projet sur-mesure"}</span>
                                        <h2 className="text-4xl md:text-6xl text-white leading-none mb-10 max-w-3xl">
                                            {block.titlePart1 || "Prêt à créer votre propre"} <br />
                                            <span className={theme.gradientText}>{block.titlePart2 || "Événement ?"}</span>
                                        </h2>
                                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                            {block.primaryButton && (
                                                <Link
                                                    href={block.primaryButton.link || "#reservation"}
                                                    onClick={(e) => handleActionClick(e, block.primaryButton.link || "#reservation")}
                                                    className={`px-10 py-5 bg-white ${theme.text} rounded-full font-black uppercase tracking-widest text-xs hover:bg-abysse hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3`}
                                                >
                                                    <Mail size={18} /> {block.primaryButton.text || "Demande de Devis"}
                                                </Link>
                                            )}
                                            {block.secondaryButton && (
                                                <a
                                                    href={block.secondaryButton.link || "tel:0233471481"}
                                                    className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-abysse transition-all flex items-center justify-center gap-3"
                                                >
                                                    <span className="material-symbols-outlined text-lg">{block.secondaryButton.iconName || "phone_in_talk"}</span> {block.secondaryButton.text || "02 33 47 14 81"}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );

                    default:
                        return null;
                }
            })}
            {/* Modal de Contact/Réservation */}
            <GroupContactModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                defaultActivity={selectedActivity}
                category={modalCategory}
            />
        </div>
    );
};

export default GroupesClient;
