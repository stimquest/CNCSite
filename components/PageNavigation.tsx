'use client';

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const SECTIONS = [
    { id: 'hero', label: 'Évasion', number: '01', isDark: true },
    { id: 'dashboard', label: 'Pilotage', number: '02', isDark: false },
    { id: 'esprit-club', label: 'L\'Esprit', number: '03', isDark: false },
    { id: 'focus', label: 'Les Focus', number: '04', isDark: true },
    { id: 'agenda', label: 'Agenda', number: '05', isDark: false },
    { id: 'institution', label: 'Académie', number: '06', isDark: false },
    { id: 'pedagogie', label: 'Apprendre', number: '07', isDark: true },
    { id: 'dico-parents', label: 'Le Dico', number: '08', isDark: false },
    { id: 'immersion', label: 'Immersion', number: '09', isDark: false }
];

const PageNavigation = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isDarkBg, setIsDarkBg] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const triggers = SECTIONS.map(section => {
            return ScrollTrigger.create({
                trigger: `#${section.id}`,
                start: "top 40%",
                end: "bottom 40%",
                onToggle: (self) => {
                    if (self.isActive) {
                        setActiveSection(section.id);
                        setIsDarkBg(section.isDark);
                    }
                }
            });
        });

        return () => {
            triggers.forEach(t => t.kill());
        };
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Dynamic colors based on background
    const textColor = isDarkBg ? 'text-white/40' : 'text-slate-900/40';
    const textColorActive = isDarkBg ? 'text-white' : 'text-slate-900';
    const textColorHover = isDarkBg ? 'group-hover:text-white/70' : 'group-hover:text-slate-900/70';
    const borderColor = isDarkBg ? 'border-white/10' : 'border-slate-900/10';

    return (
        <div
            className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-100 hidden lg:flex pointer-events-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Vertical "Sommaire" label */}
            <div
                className={`flex items-center justify-center cursor-pointer transition-all duration-500 ${isHovered ? 'opacity-0 w-0' : 'opacity-100 w-6'
                    }`}
            >
                <span
                    className={`text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap transition-colors duration-500 ${textColor}`}
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                >
                    Sommaire
                </span>
            </div>

            {/* Expandable Menu - Clean, no glass effect */}
            <nav
                className={`flex flex-col gap-5 pl-6 border-l ${borderColor} transition-all duration-500 ease-out origin-left ${isHovered
                    ? 'opacity-100 scale-x-100 translate-x-0'
                    : 'opacity-0 scale-x-0 -translate-x-4 pointer-events-none'
                    }`}
            >
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollTo(section.id)}
                        className="group flex flex-col items-start text-left transition-all duration-300"
                    >
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-0.5 transition-colors duration-300 ${activeSection === section.id
                            ? 'text-turquoise'
                            : `${textColor} ${textColorHover}`
                            }`}>
                            {section.number}
                        </span>
                        <span className={`text-[11px] font-bold tracking-tight transition-all duration-300 whitespace-nowrap ${activeSection === section.id
                            ? `${textColorActive} translate-x-1`
                            : `${textColor} ${textColorHover}`
                            }`}>
                            {section.label}
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default PageNavigation;
