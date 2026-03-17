import React from 'react';
import { client, queries } from '@/lib/sanity';
import NatureClient from './NatureClient';

export const metadata = {
    title: 'Nature & Environnement - CNC Coutainville',
    description: 'Découvrez la faune et la flore du littoral normand autour du spot de Coutainville : estran, espèces marines, pêche à pied et observations naturalistes.',
};

export const revalidate = 60;

export default async function NaturePage() {
    const natureData = await client.fetch(queries.naturePage).catch(() => null);

    return (
        <NatureClient initialNatureData={natureData} />
    );
}
