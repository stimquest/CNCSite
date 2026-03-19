"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from './SmoothScroll';
import { 
    X, 
    Wind, 
    Wifi, 
    Navigation, 
    Timer, 
    Zap,
    Map
} from 'lucide-react';

interface CharDiscoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CharDiscoveryModal: React.FC<CharDiscoveryModalProps> = ({ isOpen, onClose }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { stop, start } = useLenis();

    // Focus & Scroll Lock Management
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            stop();
            return () => {
                document.body.style.overflow = '';
                start();
            };
        }
    }, [isOpen, stop, start]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-abysse/95 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Découverte du char à voile"
                        className="relative w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-[32px] md:rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10"
                        onTouchMove={e => e.stopPropagation()}
                    >
                        {/* Close Button UI */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 z-100 size-10 rounded-full bg-slate-100 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center text-abysse shadow-lg"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Column: Brand/Visual */}
                        <div className="w-full md:w-[34%] lg:w-[32%] h-50 sm:h-60 md:h-auto relative shrink-0">
                            <img 
                                src="/images/imgBank/Char003.jpg" 
                                alt="Char à Voile" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-abysse/90 via-abysse/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[3px] px-4 py-1.5 rounded-full mb-4">
                                    <Wind size={12} className="text-orange-500" />
                                    <span>Découverte</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black text-white italic uppercase leading-none tracking-tighter">
                                    Le vent <br /><span className="text-orange-500">pour moteur.</span>
                                </h3>
                            </div>
                        </div>

                        {/* Right Column: Scrollable Content Side */}
                        <div className="flex-1 flex flex-col min-h-0 relative bg-slate-50">
                            {/* The Scrollable Zone with Focus Capture */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12 lg:px-12 lg:py-14"
                                style={{ overscrollBehavior: 'contain' }}
                                onTouchMove={e => e.stopPropagation()}
                            >
                                <div className="max-w-2xl mx-auto space-y-10 md:space-y-12">
                                    <header>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px w-8 bg-orange-500" />
                                            <span className="text-orange-600 font-bold uppercase tracking-[0.4em] text-[10px]">C'est quoi le char à voile ?</span>
                                        </div>
                                        <h2 className="text-abysse font-black text-3xl lg:text-4xl italic uppercase tracking-tighter mb-6 leading-tight">
                                            La plage est <br />votre circuit.
                                        </h2>
                                        <p className="text-slate-600 font-medium leading-relaxed lg:text-lg italic border-l-4 border-orange-500/20 pl-6">
                                            Imaginez un petit kart léger, propulsé uniquement par une voile. Sans moteur, sans bruit, vous filez sur le sable à la seule force du vent. C'est accessible à tous, dès les premières minutes.
                                        </p>
                                    </header>

                                    <div className="grid gap-10">
                                        <div className="group">
                                            <h4 className="text-abysse font-black uppercase tracking-widest text-[11px] mb-3 flex items-center gap-3">
                                                <div className="size-2 rounded-full bg-orange-500" />
                                                Direction : Facile, avec les pieds
                                            </h4>
                                            <p className="text-slate-500 leading-relaxed text-sm lg:text-base">
                                                Vous pilotez allongé ou assis confortablement. Pour tourner, rien de plus simple : vous poussez avec vos pieds sur une barre (le palonnier) à l'avant du char. À gauche pour aller à gauche, à droite pour aller à droite. Comme un vélo, mais au sol !
                                            </p>
                                        </div>

                                        <div className="group">
                                            <h4 className="text-abysse font-black uppercase tracking-widest text-[11px] mb-3 flex items-center gap-3">
                                                <div className="size-2 rounded-full bg-orange-500" />
                                                Vitesse : Tout est dans la corde
                                            </h4>
                                            <p className="text-slate-500 leading-relaxed text-sm lg:text-base">
                                                Pour accélérer, vous tirez sur une corde (l'écoute) pour orienter la voile face au vent. Plus vous tirez, plus vous accélérez. Pour ralentir ou vous arrêter, il suffit de lâcher la corde ! C'est vous qui maîtrisez la puissance à chaque instant.
                                            </p>
                                        </div>

                                        <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 shadow-sm">
                                            <h4 className="text-orange-600 font-black uppercase tracking-widest text-[10px] mb-3 flex items-center gap-3">
                                                <Zap size={14} fill="currentColor" />
                                                Sensations Garanties
                                            </h4>
                                            <p className="text-slate-700 leading-relaxed text-sm lg:text-base font-medium">
                                                Le frisson vient quand le vent forcit : le char peut alors se pencher légèrement sur deux roues. Pas de panique ! Lâchez un peu de corde et le char se repose instantanément. C'est ce petit jeu avec l'équilibre qui rend le sport aussi addictif.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Altitude Zéro Section */}
                                    <section className="bg-slate-900 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-2xl group/alt">
                                        <div className="absolute inset-0 bg-linear-to-br from-turquoise/10 to-transparent opacity-50" />
                                        <div className="relative z-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-turquoise/20 flex items-center justify-center text-turquoise border border-turquoise/30">
                                                        <Wifi size={20} className="animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-turquoise font-black uppercase tracking-[0.3em] text-[8px]">Innovation CNC</h5>
                                                        <p className="text-white/30 text-[7px] uppercase font-bold tracking-widest">Horizon 2026</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-white font-black italic text-lg uppercase tracking-tighter">Altitude</span>
                                                    <span className="text-turquoise font-black italic text-lg uppercase tracking-tighter">Zéro</span>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl lg:text-3xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                                                Le char à voile <br /><span className="text-turquoise">2.0 arrive.</span>
                                            </h3>
                                            <p className="text-white/60 text-sm mb-8 leading-relaxed">
                                                Nous préparons <span className="text-white font-bold italic">Sandpilot</span> : un système de balises GPS pour mesurer votre vitesse, faire des rallyes entre amis et comparer vos trajectoires directement sur votre smartphone.
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { icon: Timer, label: "Top Vitesse" },
                                                    { icon: Map, label: "Parcours GPS" },
                                                    { icon: Navigation, label: "Défis amis" },
                                                    { icon: Zap, label: "Stats live" }
                                                ].map((mod, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                                                        <mod.icon size={14} className="text-turquoise" />
                                                        <span className="text-white text-[8px] font-black uppercase tracking-widest">{mod.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
