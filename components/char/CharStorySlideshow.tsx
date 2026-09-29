'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import styles from './CharStorySlideshow.module.css';

const SLIDE_DURATION_MS = 5000;

const slides = [
    {
        image: '/images/assets/01-avant-de-partir.webp',
        alt: 'Un moniteur explique les commandes à une personne installée dans un char à voile',
        label: 'Avant de partir',
        title: 'Quelques gestes, puis on part.',
        text: 'Le moniteur montre les commandes et explique comment le vent fait avancer le char.',
        tip: 'Repérez comment ralentir et vous arrêter.',
        align: 'right',
    },
    {
        image: '/images/assets/02-premiers-metres.webp',
        alt: 'Des chars à voile roulent sur la plage sous le regard du moniteur',
        label: 'Les premiers mètres',
        title: 'On apprend en roulant.',
        text: 'Un premier aller-retour permet de tester les gestes à votre rythme.',
        tip: 'Regardez loin devant pour tenir votre trajectoire.',
        align: 'left',
    },
    {
        image: '/images/assets/03-le-vent-prend-la-voile.webp',
        alt: 'Plusieurs pilotes avancent sur la plage dans leurs chars à voile',
        label: 'Le vent prend la voile',
        title: 'On ajuste. Le char répond.',
        text: 'La voile se remplit, le char accélère. Vous ajustez la direction et sentez sa réponse.',
        tip: 'Procédez par petits réglages.',
        align: 'left',
    },
    {
        image: '/images/assets/04-ca-file.webp',
        alt: 'Vue depuis un char à voile qui suit deux autres chars sur la plage',
        label: 'La glisse',
        title: 'La plage s’ouvre. Le char glisse.',
        text: 'Le vent tire dans la voile, le sable défile. La vitesse vient selon les conditions.',
        tip: 'Gardez vos distances avec les autres chars.',
        align: 'right',
    },
    {
        image: '/images/assets/05-on-prend-le-coup.webp',
        alt: 'Plusieurs chars à voile roulent sur la plage en fin de journée',
        label: 'On prend le coup',
        title: 'On prend le coup.',
        text: 'À chaque passage, les gestes deviennent plus naturels et la trajectoire plus fluide.',
        tip: 'Refaites un dernier passage à votre rythme.',
        align: 'left',
    },
] as const;

export default function CharStorySlideshow() {
    const [active, setActive] = useState(0);
    const [playing, setPlaying] = useState(false);
    const playbackChosen = useRef(false);
    const touchStartX = useRef<number | null>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);

    const collapse = useCallback(() => {
        if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
        setExpanded(false);
    }, []);

    const measureZoom = useCallback(() => {
        const frame = frameRef.current;
        if (!frame) return;
        // Measure the untransformed frame so repeated hovers never compound the zoom.
        const bounds = frame.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const leftSpace = Math.max(0, bounds.left - 16);
        const horizontalScale = 1 + leftSpace / bounds.width;
        const verticalScale = Math.max(1, (window.innerHeight - 120) / bounds.height);
        setZoomScale(Math.min(horizontalScale, verticalScale));
    }, []);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;
        const media = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const update = () => {
            if (!media.matches) collapse();
            measureZoom();
        };
        const observer = new ResizeObserver(update);
        observer.observe(frame);
        window.addEventListener('resize', update);
        media.addEventListener('change', update);
        update();
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
            media.removeEventListener('change', update);
            if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
        };
    }, [collapse, measureZoom]);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
            if (!playbackChosen.current) {
                playbackChosen.current = true;
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    setPlaying(true);
                }
            }
            observer.disconnect();
        }, { threshold: 0.5 });
        observer.observe(frame);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!playing) return;
        const timer = setTimeout(() => {
            setActive((index) => (index + 1) % slides.length);
        }, SLIDE_DURATION_MS);
        return () => clearTimeout(timer);
    }, [playing, active]);

    function show(index: number) {
        playbackChosen.current = true;
        setPlaying(false);
        setActive(Math.max(0, Math.min(slides.length - 1, index)));
    }

    return (
        <div
            ref={frameRef}
            className={styles.frame}
            onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
                measureZoom();
                if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
                hoverTimer.current = setTimeout(() => {
                    setExpanded(true);
                    hoverTimer.current = null;
                }, 150);
            }}
            onPointerLeave={collapse}
            onPointerCancel={collapse}
        >
        <section
            className={styles.stage}
            style={{ transform: expanded ? `scale(${zoomScale})` : 'scale(1)' }}
            aria-roledescription="diaporama"
            aria-label="Le déroulement d’une séance de char à voile"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    show(active + 1);
                } else if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    show(active - 1);
                }
            }}
            onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
            onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance = event.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(distance) > 55) show(active + (distance < 0 ? 1 : -1));
                touchStartX.current = null;
            }}
        >
            {slides.map((slide, index) => (
                <article
                    key={slide.image}
                    className={`${styles.slide} ${index === active ? styles.active : ''} ${slide.align === 'right' ? styles.right : ''}`}
                    aria-hidden={index !== active}
                    inert={index !== active}
                    aria-label={`${index + 1} sur ${slides.length} : ${slide.label}`}
                >
                    <div className={styles.photo}>
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            sizes="(min-width: 1280px) 58vw, 100vw"
                            priority={index === 0}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.story}>
                        <div className={styles.headingRow}>
                            <span className={styles.step}>Étape {String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(slides.length).padStart(2, '0')} · {slide.label}</span>
                            <span className={styles.rule} aria-hidden="true" />
                        </div>
                        <h2 className={styles.title}>{slide.title}</h2>
                        <p className={styles.description}>{slide.text}</p>
                        <p className={styles.tip}><span className={styles.tipLabel}>Le conseil</span>{slide.tip}</p>
                    </div>
                </article>
            ))}
            <div className={styles.controls}>
                <div className={styles.dots} aria-label="Choisir une étape">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.image}
                            type="button"
                            className={`${styles.dot} ${index === active ? styles.current : ''}`}
                            aria-label={`Étape ${index + 1} : ${slide.label}`}
                            aria-current={index === active ? 'step' : undefined}
                            onClick={() => show(index)}
                        >
                            {String(index + 1).padStart(2, '0')}
                            {index === active && playing && (
                                <span
                                    className={styles.tempo}
                                    style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    ))}
                </div>
                <button
                    className={styles.nav}
                    type="button"
                    aria-label={playing ? 'Mettre le diaporama en pause' : 'Lire le diaporama en boucle'}
                    title={playing ? 'Pause' : 'Lecture automatique · 5 secondes par diapo'}
                    onClick={() => {
                        playbackChosen.current = true;
                        setPlaying((value) => !value);
                    }}
                >
                    {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                </button>
            </div>
        </section>
        </div>
    );
}
