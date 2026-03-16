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

export const YouTubeBackground: React.FC<YouTubeBackgroundProps> = ({ videoUrl }) => {
    const videoId = extractVideoId(videoUrl);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!videoId) return;

        // Delayed facade: inject iframe only after LCP has settled
        // requestIdleCallback ensures we don't compete with critical rendering
        const load = () => {
            timerRef.current = setTimeout(() => setIframeLoaded(true), 2500);
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(load, { timeout: 3000 });
        } else {
            load();
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [videoId]);

    if (!videoId) return null;

    // Params optimisés: pas de vq=hd (laisse YouTube décider), enablejsapi=0
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
            {/* Thumbnail placeholder visible tant que l'iframe n'est pas chargée */}
            <img
                src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: iframeLoaded ? 0 : 1,
                    transition: 'opacity 1.5s ease',
                }}
            />

            {/* Iframe injectée après délai — ne bloque pas le LCP */}
            {iframeLoaded && (
                <iframe
                    src={embedUrl}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550%] h-[120%] md:w-[130%] md:h-[130%] min-h-full min-w-full scale-110"
                    style={{ border: 0, opacity: 1, pointerEvents: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen={false}
                    tabIndex={-1}
                    aria-hidden="true"
                    title="Hero background video"
                />
            )}
        </div>
    );
};
