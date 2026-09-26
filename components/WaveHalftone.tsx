"use client";

import { useEffect, useRef } from "react";

/** White halftone: travelling swells modulate dot size and opacity. */
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
    let dots: { x: number; y: number; size: number; edge: number }[] = [];

    const paint = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#fff";
      const t = elapsed / 1000;
      for (const dot of dots) {
        // Curved fronts travel diagonally, with a slower secondary swell.
        const wave = Math.sin(dot.x / 150 + dot.y / 88 - t * 0.65
          + 0.75 * Math.sin(dot.x / 270 - t * 0.18));
        const swell = Math.sin(dot.y / 190 - dot.x / 310 - t * 0.3);
        const crest = (wave * 0.75 + swell * 0.25 + 1) / 2;
        const radius = dot.size * (0.45 + crest * 0.95);
        context.globalAlpha = dot.edge * (0.12 + crest * 0.65);
        context.beginPath();
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
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
          dots.push({ x, y, size: 2 + variation * 2.8, edge: edge * edge * bottomFade });
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
