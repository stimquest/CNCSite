"use client";

/**
 * SmoothScroll — Provider léger sans Lenis.
 *
 * Lenis + l'inertie native du navigateur (trackpad macOS / Windows Precision)
 * créaient un double-lissage nauséeux. On utilise désormais le scroll natif
 * du navigateur, qui est parfaitement fluide sur tous les OS.
 *
 * L'API useLenis() est maintenue pour ne pas casser les consommateurs existants.
 * Les appels stop/start/scrollTo sont remplacés par des équivalents natifs.
 */

import React, { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface LenisContextType {
    lenis: null;
    stop: () => void;
    start: () => void;
}

const LenisContext = createContext<LenisContextType>({
    lenis: null,
    stop: () => {},
    start: () => {},
});

export const useLenis = () => useContext(LenisContext);

const ctxValue: LenisContextType = {
    lenis: null,
    stop: () => { document.documentElement.style.overflow = "hidden"; },
    start: () => { document.documentElement.style.overflow = ""; },
};

interface SmoothScrollProps {
    children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const pathname = usePathname();
    const wasPopState = useRef(false);

    // Track back/forward navigation
    useEffect(() => {
        const handlePopState = () => { wasPopState.current = true; };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    // Scroll to top or anchor on route change
    useEffect(() => {
        const timeout = setTimeout(() => {
            const hash = window.location.hash;
            if (hash) {
                const target = document.querySelector(hash);
                if (target) {
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                }
            } else if (!wasPopState.current) {
                window.scrollTo({ top: 0, behavior: "instant" });
            }
            wasPopState.current = false;
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]);

    // Intercept same-page anchor clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;
            const href = anchor.getAttribute("href");
            if (!href?.startsWith("#")) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
            }
            window.history.pushState(null, "", href);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <LenisContext.Provider value={ctxValue}>
            {children}
        </LenisContext.Provider>
    );
};
