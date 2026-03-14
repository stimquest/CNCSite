'use client';

import { useState, useEffect } from 'react';
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

// On force une isolation totale pour éviter que React 19 ne compare le DOM du Studio 
// avec ce qu'il imagine être du HTML valide (Sanity Studio ayant des bugs d'imbrication p > div).
export default function StudioPage() {
  const [showStudio, setShowStudio] = useState(false);

  useEffect(() => {
    // On attend un petit délai pour être SÛR que Next.js a fini son cycle d'hydratation de base
    const timer = setTimeout(() => setShowStudio(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!showStudio) {
    return null;
  }

  return <NextStudio config={config} />;
}
