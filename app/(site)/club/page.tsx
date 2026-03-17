import React from 'react';
import { client, queries } from '@/lib/sanity';
import ClubClient from './ClubClient';

export const metadata = {
    title: 'Le Club - CNC Coutainville',
    description: 'Découvrez le Club Nautique de Coutainville : notre histoire, notre équipe, notre flotte et nos valeurs depuis 1978. Rejoignez une communauté de passionnés de la mer.',
};

export const revalidate = 60;

export default async function ClubPage() {
    const clubData = await client.fetch(queries.clubPage).catch(() => null);

    return (
        <ClubClient initialClubData={clubData} />
    );
}
