"use client";

import React from 'react';

interface YouTubeBackgroundProps {
    videoUrl: string;
}

function extractVideoId(url: string): string | null {
    // youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&#]+)/);
    if (watchMatch) return watchMatch[1];

    // youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
    if (shortMatch) return shortMatch[1];

    // youtube.com/embed/ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
    if (embedMatch) return embedMatch[1];

    return null;
}

export const YouTubeBackground: React.FC<YouTubeBackgroundProps> = ({ videoUrl }) => {
    const videoId = extractVideoId(videoUrl);

    if (!videoId) return null;

    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&vq=hd1080&start=0`;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <iframe
                src={embedUrl}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] md:w-[180%] md:h-[180%]"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                tabIndex={-1}
                aria-hidden="true"
                title="Hero background video"
            />
        </div>
    );
};
