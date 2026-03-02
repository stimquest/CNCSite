"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
    /** Background image URL */
    image: string;
    imageAlt?: string;
    /** Icon component to render in the badge */
    tagIcon: React.ReactNode;
    /** Text to display in the badge */
    tagText: string;
    /** Title line 1 (white text) */
    title: string;
    /** Title line 2 (turquoise → white gradient) */
    subtitle: string;
    /** Optional italic description below the title */
    description?: string;
    /** Optional stat cards / content below title */
    children?: React.ReactNode;
    /** Height variant */
    size?: 'default' | 'compact';
    /** Color the bottom fades into */
    bottomColor?: 'white' | 'slate';
}

export const PageHero: React.FC<PageHeroProps> = ({
    image,
    imageAlt = 'Hero background',
    tagIcon,
    tagText,
    title,
    subtitle,
    description,
    children,
    size = 'default',
    bottomColor = 'white',
}) => {
    const heightClass = size === 'compact'
        ? 'h-[55vh] min-h-[450px]'
        : 'h-[80vh] min-h-[600px]';

    const bottomColorHex = bottomColor === 'slate' ? '#f8fafc' : '#ffffff';

    return (
        <section className={`relative ${heightClass} w-full flex items-center justify-center overflow-hidden bg-abysse`}>
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src={image} className="w-full h-full object-cover scale-105" alt={imageAlt} />
                <div className="absolute inset-0" style={{
                    background: `linear-gradient(to bottom,
                        rgba(0,43,73,0.55) 0%,
                        rgba(0,43,73,0.50) 35%,
                        rgba(0,43,73,0.40) 55%,
                        rgba(0,43,73,0.25) 70%,
                        ${bottomColorHex} 100%)`
                }} />
            </div>

            {/* Content */}
            <div className={`relative z-10 container mx-auto px-6 max-w-[1400px] ${size === 'default' ? 'mt-20' : ''}`}>
                <div className="flex flex-col items-center text-center">

                    {/* Badge — always same style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8 flex items-center gap-2"
                    >
                        <span className="text-turquoise flex items-center">{tagIcon}</span>
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">{tagText}</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.8] mb-12"
                    >
                        {title} <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">
                            {subtitle}
                        </span>
                    </motion.h1>

                    {/* Description */}
                    {description && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/70 text-sm font-medium italic max-w-md mb-8"
                        >
                            &ldquo;{description}&rdquo;
                        </motion.p>
                    )}

                    {/* Stat cards */}
                    {children && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            {children}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};
