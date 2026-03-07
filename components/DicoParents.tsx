"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Gamepad2, Star, CheckCircle2, XCircle, ArrowRight, RotateCcw, Medal, ChevronLeft, ChevronRight, MessageSquareQuote, GraduationCap } from 'lucide-react';

import { DicoWord } from '../types';

// Reusable Flip Card Component (The Dico)
const DicoCard = ({ item }: { item: DicoWord }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative h-[280px] w-full perspective-1000 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Recto */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 flex flex-col overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all hover:border-turquoise/30"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="absolute top-5 right-5 text-slate-100 group-hover:text-slate-200 transition-colors">
                        <MessageSquareQuote size={48} strokeWidth={1.5} />
                    </div>

                    <h3 className="relative z-10 text-2xl font-black text-abysse italic tracking-tighter mb-auto text-center mt-2 group-hover:text-turquoise transition-colors">{item.word}</h3>

                    <div className="relative z-10 flex flex-col items-center gap-2 my-auto px-2 text-center">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#00E5FF]">Parole de moussaillon :</span>
                        <p className="text-[15px] font-medium text-slate-600 italic leading-snug">
                            "{item.childQuote}"
                        </p>
                    </div>

                    <div className="relative z-10 mt-auto flex w-full justify-end items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-turquoise bg-turquoise/10 px-4 py-2 rounded-full transition-colors group-hover:bg-turquoise group-hover:text-abysse">
                            La traduction →
                        </span>
                    </div>
                </div>

                {/* Verso */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] bg-abysse border border-slate-700 shadow-2xl p-6 flex flex-col justify-center gap-5 overflow-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-2 block">Crainte du parent :</span>
                        <p className="text-slate-200 text-sm font-medium italic border-l-2 border-rose-500/50 pl-3 leading-snug">
                            "{item.parentFear}"
                        </p>
                    </div>

                    <div className="px-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-turquoise mb-2 block">Réalité du ponton :</span>
                        <p className="text-white text-sm font-medium leading-relaxed">
                            {item.reality}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


// Mini-game Component (Le Traducteur de Ponton)
const TranslatorGame = ({ dicoWords }: { dicoWords: DicoWord[] }) => {
    const [questions, setQuestions] = useState<DicoWord[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'end'>('intro');

    // Pour l'animation feedback
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Initialisation
    const startNewGame = () => {
        // Mélanger et prendre 5 mots au hasard
        const shuffled = [...dicoWords].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5));
        setScore(0);
        setCurrentQIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setGameState('playing');
    };

    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswer !== null) return; // Prevent double click
        setSelectedAnswer(answerIndex);

        const currentQ = questions[currentQIndex];

        if (answerIndex === currentQ.correctAnswerIdx) {
            setScore(prev => prev + 1);
        }

        setShowExplanation(true);
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setGameState('end');
        }
    };

    // Vues du jeu
    if (gameState === 'intro') {
        return (
            <div className="w-full bg-slate-50 border border-slate-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-inner min-h-[500px]">
                <div className="size-20 bg-abysse text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl transform rotate-3">
                    <Gamepad2 size={40} />
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter mb-4">
                    Le Traducteur <br /> de <span className="text-turquoise">Ponton</span>
                </h3>
                <p className="text-lg text-slate-500 font-medium max-w-lg mb-8">
                    Votre enfant parle un dialecte marin étrange ? Testez vos connaissances et tentez de devenir un <strong>Parent Skipper</strong> en 5 questions.
                </p>
                <button
                    onClick={startNewGame}
                    className="inline-flex items-center justify-center px-10 py-5 bg-turquoise text-abysse rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-turquoise/20"
                >
                    Commencer le Test <ArrowRight size={18} className="ml-2" />
                </button>
            </div>
        );
    }

    if (gameState === 'end') {
        const isPerfect = score === questions.length;
        const resultMsg = isPerfect ? "Parent Skipper !" : (score >= 3 ? "Marin d'eau douce..." : "Touriste égaré...");

        return (
            <div className="w-full bg-abysse text-white rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[500px]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544411047-c491574abb46?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-linear-to-t from-abysse via-abysse/90 to-transparent"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`size-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${isPerfect ? 'bg-yellow-400 text-abysse' : 'bg-slate-700 text-white'}`}>
                        {isPerfect ? <Medal size={48} /> : <GraduationCap size={48} />}
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-turquoise mb-2">Résultat Final</span>
                    <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
                        {score} / {questions.length}
                    </h3>
                    <p className="text-2xl font-black text-white italic mb-8">{resultMsg}</p>

                    <button
                        onClick={startNewGame}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-abysse rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-lg"
                    >
                        <RotateCcw size={16} className="mr-2" /> Rejouer
                    </button>
                </div>
            </div>
        );
    }

    const q = questions[currentQIndex];

    return (
        <div className="w-full bg-white border border-slate-100 rounded-[3rem] p-6 lg:p-12 shadow-xl min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Niveau Parent
                </span>
                <div className="flex gap-2">
                    {questions.map((_, idx) => (
                        <div key={idx} className={`h-2 rounded-full transition-all ${idx < currentQIndex ? 'w-4 bg-slate-300' : idx === currentQIndex ? 'w-8 bg-turquoise' : 'w-2 bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col justify-center">
                <div className="mb-8 text-center bg-slate-50 p-6 lg:p-10 rounded-3xl border border-slate-100 relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 size-12 bg-abysse text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                        <MessageSquareQuote size={20} />
                    </div>
                    <p className="text-xl lg:text-2xl font-black text-abysse italic tracking-tight leading-snug">
                        "{q.childQuote}"
                    </p>
                    <span className="block mt-4 text-xs font-black uppercase tracking-wider text-turquoise">Que veut dire "{q.word}" ?</span>
                </div>

                <div className="space-y-3">
                    {q.quizAnswers.map((ans, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === q.correctAnswerIdx;
                        const showStatus = showExplanation;

                        let styleClass = "bg-white border-slate-200 text-slate-600 hover:border-turquoise hover:shadow-md";

                        if (showStatus) {
                            if (isCorrect) styleClass = "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm";
                            else if (isSelected) styleClass = "bg-rose-50 border-rose-200 text-rose-800";
                            else styleClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                        } else if (isSelected) {
                            styleClass = "bg-abysse border-abysse text-white shadow-lg scale-[1.02]";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full p-4 lg:p-5 rounded-2xl border-2 text-left font-medium text-sm lg:text-base transition-all duration-300 flex items-center justify-between group ${styleClass}`}
                            >
                                <span className={showStatus && isCorrect ? "font-bold" : ""}>{ans}</span>
                                {showStatus && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0 ml-3" />}
                                {showStatus && isSelected && !isCorrect && <XCircle className="text-rose-500 shrink-0 ml-3" />}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-6 bg-slate-50 rounded-2xl border border-slate-200"
                        >
                            <div className="flex-1 text-center sm:text-left">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedAnswer === q.correctAnswerIdx ? 'text-emerald-500' : 'text-rose-500'} mb-1 block`}>
                                    {selectedAnswer === q.correctAnswerIdx ? "Bien vu ! " : "Raté... "}
                                </span>
                                <p className="text-sm font-medium text-slate-700">
                                    {q.reality}
                                </p>
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center px-6 py-3 bg-abysse text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
                            >
                                Suivant <ChevronRight size={16} className="ml-1" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


export const DicoParents = ({ dicoWords = [] }: { dicoWords?: DicoWord[] }) => {
    const [viewMode, setViewMode] = useState<'dico' | 'game'>('dico');
    const [dicoPage, setDicoPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Initialisation et écoute de la taille de fenêtre pour ajuster la pagination
    useEffect(() => {
        const updateLayout = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setItemsPerPage(1); // Mobile: 1 carte (très compact) ou 2, restons sur 1 ou 2 au choix. Mettons 2 (1 col, 2 rows)
            } else if (width < 1024) {
                setItemsPerPage(4); // Tablette: 2 cols, 2 rows
            } else {
                setItemsPerPage(8); // Desktop: 4 cols, 2 rows
            }
        };

        // Exécuter une fois au montage
        updateLayout();

        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    // S'assurer qu'on change `itemsPerPage` à 2 sur mobile pour que ça prenne 2 lignes
    useEffect(() => {
        const updateLayout = () => {
            const width = window.innerWidth;
            if (width < 640) setItemsPerPage(2); // Mobile: 2 cartes à la fois
            else if (width < 1024) setItemsPerPage(4);
            else setItemsPerPage(8);
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    const totalPages = Math.ceil(dicoWords.length / itemsPerPage);
    const currentItems = dicoWords.slice(dicoPage * itemsPerPage, (dicoPage + 1) * itemsPerPage);

    const nextPage = () => setDicoPage(p => (p + 1) % totalPages);
    const prevPage = () => setDicoPage(p => (p - 1 + totalPages) % totalPages);

    return (
        <div className="w-full">
            {/* Header / Toggle */}
            <div className="mb-12 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-rose-400"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lexique</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none max-w-xl">
                        Le Dico <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-rose-400">des Parents.</span>
                    </h2>
                </div>

                {/* Toggle Button */}
                <div className="bg-slate-100 p-1.5 rounded-full inline-flex self-start md:self-end">
                    <button
                        onClick={() => setViewMode('dico')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'dico' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <BookOpen size={16} /> Le Dico Rapide
                    </button>
                    <button
                        onClick={() => setViewMode('game')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'game' ? 'bg-turquoise text-abysse shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Gamepad2 size={16} /> Le Jeu
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {viewMode === 'dico' ? (
                        <motion.div
                            key="dico-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Contrôles Haut de grille et Grille paginée */}
                            <div className="relative w-full min-h-[580px] px-0 md:px-16 flex items-center">

                                {/* Bouton Gauche (Desktop seulement) */}
                                <button
                                    onClick={prevPage}
                                    className="absolute left-0 z-10 hidden md:flex size-14 bg-white rounded-full shadow-lg items-center justify-center text-abysse hover:bg-turquoise transition-colors border border-slate-100"
                                >
                                    <ChevronLeft size={28} />
                                </button>

                                <div className="w-full relative overflow-hidden overflow-visible-md px-4 md:px-0">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={dicoPage}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                                        >
                                            {currentItems.map(item => (
                                                <div key={item._id} className="w-full">
                                                    <DicoCard item={item} />
                                                </div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Bouton Droite (Desktop seulement) */}
                                <button
                                    onClick={nextPage}
                                    className="absolute right-0 z-10 hidden md:flex size-14 bg-white rounded-full shadow-lg items-center justify-center text-abysse hover:bg-turquoise transition-colors border border-slate-100"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>

                            {/* Indicateurs de page (Points) - Visible Mobile/Desktop */}
                            <div className="flex gap-2 mt-8">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setDicoPage(idx)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${dicoPage === idx ? 'w-8 bg-turquoise' : 'w-2.5 bg-slate-200 hover:bg-slate-300'}`}
                                        aria-label={`Aller à la page ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="game-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TranslatorGame dicoWords={dicoWords} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
