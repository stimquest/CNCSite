"use client";

import React, { useState, useEffect, useRef } from 'react';

interface YouTubeBackgroundProps {
    videoUrl: string;
}

function extractVideoId(url: string): string | null {
    const watchMatch = url.match(/[?&]v=([^&#]+)/);
    if (watchMatch) return watchMatch[1];
    const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
    if (shortMatch) return shortMatch[1];
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
    if (embedMatch) return embedMatch[1];
    return null;
}

// Phase 1 : photo seule
// Phase 2 : iframe injectée, loader visible, photo toujours là
// Phase 3 : vidéo révélée, photo et loader disparaissent
type Phase = 'photo' | 'loading' | 'video';

export const YouTubeBackground: React.FC<YouTubeBackgroundProps> = ({ videoUrl }) => {
    const videoId = extractVideoId(videoUrl);
    const [phase, setPhase] = useState<Phase>('photo');
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const addTimer = (fn: () => void, delay: number) => {
        const t = setTimeout(fn, delay);
        timersRef.current.push(t);
        return t;
    };

    useEffect(() => {
        if (!videoId) return;

        const inject = () => {
            // Injecter l'iframe après LCP
            addTimer(() => setPhase('loading'), 2500);
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(inject, { timeout: 3000 });
        } else {
            inject();
        }

        return () => timersRef.current.forEach(clearTimeout);
    }, [videoId]);

    const handleIframeLoad = () => {
        // L'iframe YouTube est chargée — 300ms suffisent pour le premier rendu
        addTimer(() => setPhase('video'), 200);
    };

    if (!videoId) return null;

    const embedUrl = [
        `https://www.youtube-nocookie.com/embed/${videoId}`,
        '?autoplay=1',
        '&mute=1',
        '&loop=1',
        `&playlist=${videoId}`,
        '&controls=0',
        '&showinfo=0',
        '&modestbranding=1',
        '&rel=0',
        '&playsinline=1',
        '&disablekb=1',
        '&fs=0',
        '&iv_load_policy=3',
        '&enablejsapi=0',
        '&start=0',
    ].join('');

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">

            {/* Iframe YouTube — toujours dans le DOM une fois injectée */}
            {phase !== 'photo' && (
                <iframe
                    src={embedUrl}
                    onLoad={handleIframeLoad}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550%] h-[120%] md:w-[130%] md:h-[130%] min-h-full min-w-full scale-110"
                    style={{ border: 0, pointerEvents: 'none', zIndex: 1 }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen={false}
                    tabIndex={-1}
                    aria-hidden="true"
                    title="Hero background video"
                />
            )}

            {/* Photo placeholder — couvre l'iframe jusqu'à la phase video */}
            <img
                src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: phase === 'video' ? 0 : 1,
                    transition: phase === 'video' ? 'opacity 1.8s ease' : 'none',
                    zIndex: 2,
                }}
            />

            {/* Loader — visible uniquement en phase loading */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
                style={{
                    zIndex: 3,
                    opacity: phase === 'loading' ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                }}
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                    Chargement
                </span>
                <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="size-1.5 rounded-full bg-white/50"
                            style={{ animation: `ytloader 1.2s ease-in-out ${i * 0.2}s infinite` }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes ytloader {
                    0%, 100% { opacity: 0.2; transform: scale(0.7); }
                    50%       { opacity: 1;   transform: scale(1.3); }
                }
            `}</style>

        </div>
    );
};
