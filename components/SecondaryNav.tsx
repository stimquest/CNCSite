"use client";

import React from 'react';

interface SecondaryNavProps {
    sections: { id: string; label: string }[];
}

export const SecondaryNav: React.FC<SecondaryNavProps> = ({ sections }) => {
    return (
        <nav className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100/50 overflow-x-auto no-scrollbar">
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-start md:justify-center gap-1 h-14">
                {sections.map((section, index) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="group relative px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-abysse transition-colors shrink-0"
                    >
                        {/* Animated underline */}
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-turquoise to-abysse rounded-full group-hover:w-3/4 transition-all duration-300"></span>

                        {/* Label */}
                        {section.label}

                        {/* Separator dot (except last) */}
                        {index < sections.length - 1 && (
                            <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 size-0.5 rounded-full bg-slate-200"></span>
                        )}
                    </a>
                ))}
            </div>
        </nav>
    );
};
