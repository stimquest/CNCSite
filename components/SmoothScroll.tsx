"use client";

import React, { createContext, useContext, ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

interface LenisContextType {
    lenis: Lenis | null;
    stop: () => void;
    start: () => void;
}

const LenisContext = createContext<LenisContextType | null>(null);

export const useLenis = () => {
    const context = useContext(LenisContext);
    if (!context) {
        // Return a no-op version if used outside provider (e.g. during SSR or in Studio)
        return { lenis: null, stop: () => { }, start: () => { } };
    }
    return context;
};

interface SmoothScrollProps {
    children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);
    const [contextValue, setContextValue] = useState<LenisContextType>({
        lenis: null,
        stop: () => { },
        start: () => { }
    });

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Expose stop/start functions via context
        setContextValue({
            lenis: lenis,
            stop: () => lenis.stop(),
            start: () => lenis.start()
        });

        lenis.on("scroll", ScrollTrigger.update);

        const handleTicker = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(handleTicker);

        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(handleTicker);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    const wasPopState = useRef(false);

    // Track back/forward navigation globally
    useEffect(() => {
        const handlePopState = () => {
            wasPopState.current = true;
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Handle route changes: Reset scroll to top ONLY on new navigations (not back/forward)
    useEffect(() => {
        // We use a small timeout to let Next.js complete the layout change
        const timeout = setTimeout(() => {
            if (!wasPopState.current) {
                if (lenisRef.current) {
                    lenisRef.current.scrollTo(0, { immediate: true });
                }
                window.scrollTo(0, 0);
            }
            // Ensure ScrollTrigger is refreshed for the new page layout
            ScrollTrigger.refresh();
            // Reset for the next navigation
            wasPopState.current = false;
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <LenisContext.Provider value={contextValue}>
            {children}
        </LenisContext.Provider>
    );
};
