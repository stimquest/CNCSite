"use client";

import { useEffect, useRef } from "react";

/**
 * Halftone "lumière sur l'eau" : les houles modulent taille, opacité et teinte des points.
 * Creux bleu ciel, crêtes cyan puis presque blanches, avec de brefs scintillements
 * là où deux ondes se croisent. Fusion additive pour éclaircir la vidéo comme un reflet.
 */

// Palette du creux vers la crête : bleu ciel → cyan → reflet blanc
const TROUGH = [125, 200, 245]; // bleu ciel
const MID = [70, 215, 240]; // cyan
const GLINT = [235, 252, 255]; // reflet

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;

const colorFor = (light: number) =>
  light < 0.6 ? mix(TROUGH, MID, light / 0.6) : mix(MID, GLINT, (light - 0.6) / 0.4);
export function WaveHalftone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lastTime = 0;
    let elapsed = 0;
    let dots: { x: number; y: number; size: number; edge: number; phase: number }[] = [];

    const paint = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      const t = elapsed / 1000;
      for (const dot of dots) {
        // Curved fronts travel diagonally, with a slower secondary swell.
        const wave = Math.sin(dot.x / 150 + dot.y / 88 - t * 0.65
          + 0.75 * Math.sin(dot.x / 270 - t * 0.18));
        const swell = Math.sin(dot.y / 190 - dot.x / 310 - t * 0.3);
        const crest = (wave * 0.75 + swell * 0.25 + 1) / 2;
        // Scintillement : onde courte et rapide, ne ressort qu'au sommet des crêtes
        const ripple = Math.sin(dot.x / 23 - dot.y / 31 + t * 2.1 + dot.phase);
        const glint = Math.pow(Math.max(0, ripple), 8) * crest * crest;
        const light = Math.min(1, crest * 0.8 + glint * 0.9);
        const radius = dot.size * (0.45 + crest * 0.95 + glint * 0.35);
        context.fillStyle = colorFor(light);
        context.globalAlpha = dot.edge * Math.min(1, 0.1 + crest * 0.6 + glint * 0.5);
        context.beginPath();
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    };

    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden || motionPreference.matches) return;
      if (!lastTime) lastTime = time;
      if (time - lastTime >= 1000 / 30) {
        elapsed += Math.min(time - lastTime, 100);
        lastTime = time;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };

    const syncAnimation = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      paint();
      if (visible && !document.hidden && !motionPreference.matches) {
        frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      ({ width, height } = canvas.getBoundingClientRect());
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      dots = [];
      const step = width < 768 ? 17 : 20;
      for (let row = 0, y = 0; y < height; row++, y += step) {
        for (let column = 0, x = (row % 2) * step / 2; x < width; column++, x += step) {
          const seed = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
          const variation = seed - Math.floor(seed);
          if (variation < 0.12) continue;
          const distance = Math.hypot((x / width - 0.5) / 0.64, (y / height - 0.48) / 0.59);
          const edge = Math.max(0, Math.min(1, (distance - 0.24) / 0.65));
          const bottomFade = Math.min(1, (1 - y / height) / 0.1);
          dots.push({ x, y, size: 2 + variation * 2.8, edge: edge * edge * bottomFade, phase: variation * 6.28 });
        }
      }
      paint();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    motionPreference.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    resize();
    syncAnimation();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionPreference.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[3] h-full w-full pointer-events-none" />;
}
