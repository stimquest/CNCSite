import React, { Suspense } from 'react';
import { client, queries } from '@/lib/sanity';
import ActivitiesClient from './ActivitiesClient';

export const metadata = {
    title: 'Activités & Stages - CNC Coutainville',
    description: 'Voile, char à voile, wingfoil, kitesurf, kayak et marche aquatique à Agon-Coutainville. Stages enfants et adultes, location et pratique libre sur la côte normande.',
};

export const revalidate = 60;

export default async function ActivitiesPage() {
    const [activities, activitiesData] = await Promise.all([
        client.fetch(queries.activities).catch(() => []),
        client.fetch(queries.activitiesPage).catch(() => null)
    ]);

    return (
        <Suspense fallback={<div className="min-h-screen bg-abysse flex items-center justify-center text-white">Chargement...</div>}>
            <ActivitiesClient initialActivities={activities || []} initialActivitiesData={activitiesData || null} />
        </Suspense>
    );
}
