"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange, placeholder }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt: any) => opt.value === value);

    return (
        <div ref={ref} className="flex-1 w-full bg-slate-50/50 rounded-2xl p-3 border border-slate-100 hover:border-turquoise/30 transition-colors group relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 cursor-pointer">{label}</label>
            <div className="flex items-center justify-between w-full">
                <span className={`text-sm font-bold ${value ? 'text-abysse' : 'text-slate-500'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className={`${isOpen ? 'text-turquoise' : 'text-slate-400 group-hover:text-turquoise'}`} />
                </motion.div>
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-60"
                    >
                        <ul className="py-2 max-h-60 overflow-y-auto">
                            {options.map((opt: any) => (
                                <li 
                                    key={String(opt.value)}
                                    onClick={(e) => { e.stopPropagation(); onChange(opt.value); setIsOpen(false); }}
                                    className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors ${value === opt.value ? 'bg-abysse text-white' : 'text-abysse hover:bg-turquoise/10 hover:text-turquoise'}`}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface ActivityFinderProps {
    age: number | null;
    category: string | null;
    format: string | null;
    resultCount: number;
    onChange: (next: { age?: number | null; category?: string | null; format?: string | null }) => void;
    onReset: () => void;
}

// Filtres appliqués immédiatement ; le bouton ne sert qu'à descendre vers les résultats.
export const ActivityFinder: React.FC<ActivityFinderProps> = ({ age, category, format, resultCount, onChange, onReset }) => {
    const hasFilters = age !== null || category !== null || format !== null;

    const scrollToResults = () => {
        const target = document.getElementById('activities-list');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollBy({ top: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto relative z-50 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] p-4 flex flex-col md:flex-row items-center gap-4"
            >
                {/* Age Selector : la valeur est l'âge le plus élevé de la tranche */}
                <CustomSelect 
                    label="Pour qui ? (Âge)"
                    placeholder="Tous les âges"
                    value={age}
                    onChange={(val: any) => onChange({ age: val })}
                    options={[
                        { value: null, label: 'Tous les âges' },
                        { value: 6, label: 'Petits (4-6 ans)' },
                        { value: 11, label: 'Enfants (7-11 ans)' },
                        { value: 15, label: 'Ados (12-15 ans)' },
                        { value: 18, label: 'Adultes (16+ ans)' },
                    ]}
                />

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-12 bg-slate-200/50"></div>

                {/* Category Selector */}
                <CustomSelect 
                    label="Quelle envie ?"
                    placeholder="Toutes les envies"
                    value={category}
                    onChange={(val: any) => onChange({ category: val })}
                    options={[
                        { value: null, label: 'Toutes les envies' },
                        { value: 'Voile', label: 'Naviguer (Voile & Cata)' },
                        { value: 'Sensations', label: 'Sensations (Kite, Wing, Char)' },
                        { value: 'Bien-être', label: 'Nature (Paddle, Kayak, Marche aquatique)' },
                        { value: 'Jeunesse', label: 'Enfants' },
                        { value: 'Sécurité', label: 'Sauvetage & secourisme' },
                    ]}
                />

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-12 bg-slate-200/50"></div>

                {/* Format Selector */}
                <CustomSelect 
                    label="Quel format ?"
                    placeholder="Tous les formats"
                    value={format}
                    onChange={(val: any) => onChange({ format: val })}
                    options={[
                        { value: null, label: 'Tous les formats' },
                        { value: 'reservation', label: 'Séance (à l’unité)' },
                        { value: 'stage', label: 'Stage (plusieurs jours)' },
                        { value: 'rental', label: 'Location / Libre' },
                    ]}
                />

                {/* Action Button */}
                <div className="w-full md:w-auto flex flex-col items-center gap-1">
                    <button 
                        onClick={scrollToResults}
                        className="w-full md:w-auto px-8 py-5 bg-linear-to-r from-abysse to-turquoise text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-turquoise/30 transition-all flex items-center justify-center gap-2 transform hover:scale-105 whitespace-nowrap"
                    >
                        <Search size={16} />
                        Voir {resultCount} résultat{resultCount > 1 ? 's' : ''}
                    </button>
                    {hasFilters && (
                        <button onClick={onReset} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-turquoise">
                            Réinitialiser
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
