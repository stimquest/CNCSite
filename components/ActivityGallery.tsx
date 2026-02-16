"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityGalleryProps {
    images?: string[];
    defaultImage: string;
    alt: string;
}

export const ActivityGallery: React.FC<ActivityGalleryProps> = ({ images = [], defaultImage, alt }) => {
    // Handle the case where images might be null (default parameter only works for undefined)
    const galleryItems = (images && images.length > 0) ? images : [defaultImage];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-play for mobile or when not hovering
    useEffect(() => {
        if (galleryItems.length <= 1 || isHovering) return;

        // Desynchronize starts to avoid all galleries changing at once
        const initialDelay = Math.random() * 3000;
        let interval: NodeJS.Timeout;

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
            }, 5000 + Math.random() * 1000); // Slightly varied intervals too
        }, initialDelay);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [galleryItems.length, isHovering]);

    // Handle mouse movement for "scrubbing" effect on desktop
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || galleryItems.length <= 1) return;

        const { left, width } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const percentage = x / width;

        // Split width into equal zones for each image
        const newIndex = Math.floor(percentage * galleryItems.length);
        if (newIndex >= 0 && newIndex < galleryItems.length) {
            setCurrentIndex(newIndex);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden cursor-crosshair group/gallery"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
            }}
            onMouseMove={handleMouseMove}
        >
            <AnimatePresence>
                <motion.img
                    key={galleryItems[currentIndex]}
                    src={galleryItems[currentIndex]}
                    alt={`${alt} - ${currentIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
            </AnimatePresence>

            {/* Overlays for better contrast on badges */}
            <div className="absolute inset-0 bg-linear-to-t from-abysse/50 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-black/10 pointer-events-none" />

            {/* Progress Indicators (Minimal Dots) */}
            {galleryItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -track-x-1/2 -translate-x-1/2 flex gap-1.5 z-30 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-sm border border-white/5 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                    {galleryItems.map((_, idx) => (
                        <div
                            key={idx}
                            className={`size-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'bg-white w-4'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Hint for interactivity (Desktop only) */}
            {galleryItems.length > 1 && (
                <div className="absolute bottom-4 right-4 opacity-0 group-hover/gallery:opacity-100 transition-opacity hidden lg:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[8px] font-black text-white uppercase tracking-widest pointer-events-none">
                    <span className="animate-pulse">↔</span> Survolez pour explorer
                </div>
            )}
        </div>
    );
};

export default ActivityGallery;
