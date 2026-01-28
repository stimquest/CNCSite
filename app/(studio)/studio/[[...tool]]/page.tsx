'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config'; // Utilisation de l'alias global @/ pour éviter les erreurs de chemin relatif

export default function StudioPage() {
  return <NextStudio config={config} />;
}
