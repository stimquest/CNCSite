'use client';

import { useEffect, useState } from 'react';

export default function BackgroundParallax() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Ajustez le diviseur pour changer la vitesse du parallax (plus grand = plus lent)
      setOffset(window.scrollY * 0.2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[-1]"
      style={{
        top: '-100%',
        left: '-100%',
        width: '300%',
        height: '300%',
        backgroundImage: 'url("/images/LogoCNC_Simple.svg"), url("/images/LogoCNC_Simple.svg")',
        backgroundRepeat: 'repeat, repeat',
        backgroundPosition: '0 0, 500px 500px',
        backgroundSize: '1000px 1000px',
        opacity: 0.2,
        transform: `rotate(-20deg) translateY(${offset}px)`,
        willChange: 'transform',
      }}
    />
  );
}
