import React from 'react';
import SpotPageClient from '@/components/SpotPageClient';
import { client, queries } from '@/lib/sanity';

// Metadata configuration
export const metadata = {
  title: 'Le Spot | CNC - Agon-Coutainville',
  description: 'Météo, marées et webcam en direct sur le spot d\'Agon-Coutainville.',
};

// Next.js config for revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function SpotPage() {
    // Fetch non-live CMS data on the server
    const leSpotData = await client.fetch(queries.leSpotPage);

    return <SpotPageClient leSpotData={leSpotData} />;
}
