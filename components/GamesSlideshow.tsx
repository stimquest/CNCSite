"use client";

import React, { useState } from 'react';
import { SailingSimulator } from './SailingSimulator';
import { PriorityGame } from './PriorityGame';
import { Compass, Anchor, ChevronRight } from 'lucide-react';

const slides = [
    { id: 'intro', type: 'intro' },
    { id: 'sailing', type: 'game', title: 'Simulateur de Voile', desc: 'Maîtrise les allures et les amures', icon: '🌊' },
    { id: 'priority', type: 'game', title: 'Priorités en Mer', desc: 'Quiz RIPAM - Règles de route', icon: '⚓' },
];

export const GamesSlideshow: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const IntroSlide = () => (
        <div className="max-w-[1360px] w-full mx-auto bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 p-8 lg:p-14 items-center">
                {/* Left Content */}
                <div className="text-left">
                    <div className="inline-flex items-center gap-2 bg-turquoise/10 text-turquoise px-4 py-2 rounded-full mb-6">
                        <Compass size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Apprentissage Interactif</span>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black text-abysse mb-6 leading-tight">
                        Testez vos connaissances<br />
                        <span className="text-turquoise">nautiques</span>
                    </h3>

                    <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-lg">
                        Avant de prendre la barre, entraînez-vous ! Deux mini-jeux pour maîtriser les fondamentaux de la voile et les règles de priorité en mer.
                    </p>

                    <button
                        onClick={() => setActiveIndex(1)}
                        className="inline-flex items-center gap-2 bg-turquoise hover:bg-abysse text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-turquoise/30"
                    >
                        Commencer l'aventure <ChevronRight size={18} />
                    </button>

                    {/* Mini Games List */}
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-turquoise/30 transition-colors">
                            <span className="text-2xl">🌊</span>
                            <div>
                                <div className="font-bold text-abysse">Simulateur de Voile</div>
                                <div className="text-xs text-slate-400">Maîtrise les allures et le vent</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-turquoise/30 transition-colors">
                            <span className="text-2xl">⚓</span>
                            <div>
                                <div className="font-bold text-abysse">Priorités en Mer</div>
                                <div className="text-xs text-slate-400">Quiz complet sur les règles RIPAM</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative h-[340px] lg:h-[510px] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                    <img
                        src="/images/Games/illu_mini_Game2.jpeg"
                        alt="Illustration Mini Jeux"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-abysse/20 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* Navigation Placeholder - Keeps top alignment stable when nav is at bottom */}
            <div className={`h-8 transition-all duration-500 ${activeIndex === 0 ? 'hidden' : 'block'}`} />

            {/* Slides Container */}
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    <div className="w-full shrink-0 flex justify-center">
                        <IntroSlide />
                    </div>
                    <div className="w-full shrink-0 flex justify-center">
                        <SailingSimulator />
                    </div>
                    <div className="w-full shrink-0 flex justify-center">
                        <PriorityGame />
                    </div>
                </div>
            </div>

            {/* Navigation Pill - Moved to bottom for better ergonomics */}
            <div className={`flex justify-center mt-8 px-4 transition-all duration-500 ${activeIndex === 0 ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className="flex bg-abysse/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl gap-1">
                    <button
                        onClick={() => setActiveIndex(0)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 text-xs uppercase tracking-widest"
                    >
                        ← Accueil
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-1 self-center" />
                    {slides.filter(s => s.type === 'game').map((slide, i) => (
                        <button
                            key={slide.id}
                            onClick={() => setActiveIndex(i + 1)}
                            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeIndex === i + 1
                                ? 'bg-turquoise text-white shadow-lg shadow-turquoise/20'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="text-xl">{slide.icon}</span>
                            <div className="text-left">
                                <div className="text-[10px] font-black uppercase tracking-tight leading-none">{slide.title}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-6">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === i
                            ? 'bg-turquoise scale-125'
                            : 'bg-white/20 hover:bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
