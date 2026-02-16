"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem('CNC_COOKIE_CONSENT');
        if (!consent) {
            // Afficher après un court délai
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('CNC_COOKIE_CONSENT', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('CNC_COOKIE_CONSENT', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-100 md:left-auto md:right-8 md:max-w-sm"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-5">
                        {/* HEADER */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-abysse text-turquoise rounded-xl flex items-center justify-center shadow-lg">
                                    <Cookie size={20} />
                                </div>
                                <h3 className="font-black uppercase tracking-widest text-abysse text-xs italic">
                                    Navigation & <span className="text-turquoise">Privacité</span>
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-slate-300 hover:text-abysse transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* CONTENT */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                Pour vous offrir la meilleure expérience marine (notifications de La Vigie, météo en temps réel), nous utilisons quelques cookies sécurisés. Pas de pub, promis ! 🤙
                            </p>
                            <Link
                                href="/legal"
                                className="text-[9px] font-black uppercase text-turquoise flex items-center gap-1 hover:gap-2 transition-all"
                            >
                                En savoir plus <ChevronRight size={10} />
                            </Link>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleDecline}
                                className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Refuser
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-2 py-3 bg-abysse text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={14} /> J'accepte
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
