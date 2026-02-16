"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import gsap from 'gsap';
import { useLenis } from './SmoothScroll';

interface PhotoWallGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    title?: string;
}

export const PhotoWallGallery: React.FC<PhotoWallGalleryProps> = ({
    isOpen,
    onClose,
    images,
    title = "Galerie CNC"
}) => {
    const wallRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { stop, start } = useLenis();

    // Scroll Lock logic - Now integrates with Lenis
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            stop(); // Stop Lenis smooth scrolling
        } else {
            document.body.style.overflow = '';
            start(); // Resume Lenis smooth scrolling
        }
        return () => {
            document.body.style.overflow = '';
            start();
        };
    }, [isOpen, stop, start]);

    // Intelligent mouse-panning logic
    useEffect(() => {
        if (!isOpen || selectedImage) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!wallRef.current) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate movement factor (-0.5 to 0.5)
            const xMove = (clientX / innerWidth) - 0.5;
            const yMove = (clientY / innerHeight) - 0.5;

            // Pan intensity (how much the wall moves)
            const xRange = 100; // pixels
            const yRange = 100; // pixels

            gsap.to(wallRef.current, {
                x: -xMove * xRange,
                y: -yMove * yRange,
                duration: 1.5,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isOpen, selectedImage]);

    // Handle key navigation in zoom mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, images]);

    const navigate = (direction: number) => {
        const nextIndex = (selectedIndex + direction + images.length) % images.length;
        setSelectedIndex(nextIndex);
        setSelectedImage(images[nextIndex]);
    };

    if (!isOpen) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-black font-sans p-10 md:p-20">

            {/* THE PHOTO WALL (Background Layer) */}
            <div
                ref={wallRef}
                className="relative z-0 flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-60 w-full max-w-7xl mx-auto"
            >
                {images.map((img, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                        className="relative w-40 h-40 md:w-64 md:h-64 shrink-0 overflow-hidden rounded-xl cursor-pointer group border border-white/5 shadow-2xl"
                        onClick={() => {
                            setSelectedImage(img);
                            setSelectedIndex(i);
                        }}
                    >
                        <img
                            src={img}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                    </motion.div>
                ))}
            </div>

            {/* OVERLAY UI */}
            <div className="absolute inset-0 z-10 pointer-events-none p-10 md:p-16 flex flex-col justify-between">
                <header className="flex justify-between items-start">
                    <div className="pointer-events-auto">
                        <h2 className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                            {title.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
                        </h2>
                        <div className="h-1 w-20 bg-turquoise mt-4" />
                    </div>

                    <button
                        onClick={onClose}
                        className="pointer-events-auto size-14 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
                    >
                        <X size={28} />
                    </button>
                </header>

                <footer className="flex justify-between items-end">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
                        Sélection Maritime // CNC 2026
                    </div>
                    <div className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                        Exploration Visuelle
                    </div>
                </footer>
            </div>

            {/* FULL-SCREEN ZOOM MODE */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12"
                    >
                        {/* Background Blurred Image */}
                        <div className="absolute inset-0 z-0">
                            <img src={selectedImage} className="w-full h-full object-cover blur-3xl opacity-20" alt="" />
                        </div>

                        {/* Controls */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                            className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors z-30"
                        >
                            <Minimize2 size={32} />
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="absolute left-8 text-white/40 hover:text-white transition-all transform hover:scale-120 z-30 hidden md:block"
                        >
                            <ChevronLeft size={64} strokeWidth={1} />
                        </button>

                        <button
                            onClick={() => navigate(1)}
                            className="absolute right-8 text-white/40 hover:text-white transition-all transform hover:scale-120 z-30 hidden md:block"
                        >
                            <ChevronRight size={64} strokeWidth={1} />
                        </button>

                        {/* Focused Image */}
                        <motion.div
                            key={selectedImage}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-8"
                        >
                            <img
                                src={selectedImage}
                                className="max-w-full max-h-[85%] object-contain rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.5)] cursor-zoom-out"
                                onClick={() => setSelectedImage(null)}
                                alt=""
                            />

                            <div className="text-center">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-2">
                                    IMAGE {selectedIndex + 1} / {images.length}
                                </p>
                                <h3 className="text-white text-xl font-bold uppercase tracking-widest">Capture Haute Résolution</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
