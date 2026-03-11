import React from 'react';
import { client, queries } from '@/lib/sanity';
import EcoleVoileClient from './EcoleVoileClient';

export const metadata = {
    title: 'École de Voile - CNC Coutainville',
};

export const revalidate = 60;

export default async function EcoleVoilePage() {
    const [schoolPageData, plannings] = await Promise.all([
        client.fetch(queries.schoolPage).catch(() => null),
        client.fetch(queries.plannings).catch(() => [])
    ]);

    return (
        <EcoleVoileClient initialSchoolPageData={schoolPageData} initialPlannings={plannings} />
    );
}
