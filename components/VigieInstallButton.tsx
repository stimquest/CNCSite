"use client";

import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

export const VigieInstallButton: React.FC = () => {
    const [prompt, setPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsPWA(true);
            return;
        }
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw-vigie.js', { scope: '/fil-info/' })
                .catch(() => {
                    navigator.serviceWorker.register('/sw-vigie.js').catch(() => {});
                });
        }

        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
        setIsIOS(ios);

        const handler = (e: Event) => {
            e.preventDefault();
            setPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleClick = async () => {
        if (prompt) {
            prompt.prompt();
            await prompt.userChoice;
            setPrompt(null);
        } else {
            setShowHint(h => !h);
        }
    };

    const hint = isIOS
        ? 'Appuyez sur Partager → "Sur l\'écran d\'accueil"'
        : 'Dans Chrome : cliquez sur l\'icône ⊕ dans la barre d\'adresse, ou le menu ⋮ → "Installer l\'application"';

    if (isPWA) return null;

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors bg-turquoise text-abysse hover:bg-white"
            >
                {isIOS ? <Smartphone size={12} /> : <Download size={12} />}
                Installer l'app
            </button>

            {showHint && (
                <div className="absolute right-0 top-10 w-72 bg-abysse border border-white/10 rounded-2xl p-4 z-50 shadow-2xl">
                    <p className="text-[11px] font-bold text-white/80 leading-relaxed">{hint}</p>
                    <button onClick={() => setShowHint(false)} className="mt-3 text-[10px] text-white/30 hover:text-white/70 transition-colors">
                        Fermer
                    </button>
                </div>
            )}
        </div>
    );
};
