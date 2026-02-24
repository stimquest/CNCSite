'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config'; // chemin relatif pour éviter les conflits d'alias Turbopack

export default function StudioPage() {
  return <NextStudio config={config} />;
}
