import React from 'react';
import { client, queries } from '@/lib/sanity';
import { expandAgendaEvents } from '@/lib/editorial';
import ClubClient from './ClubClient';

export const metadata = {
    title: 'Le Club - CNC Coutainville',
    description: 'Découvrez le Club Nautique de Coutainville : notre histoire, notre équipe, notre flotte et nos valeurs depuis 1978. Rejoignez une communauté de passionnés de la mer.',
};

export const revalidate = 60;

export default async function ClubPage() {
    const clubData = await client.fetch(queries.clubPage).catch(() => null);

    if (clubData?.agenda) clubData.agenda.events = expandAgendaEvents(clubData.agenda.events || []);

    return (
        <ClubClient initialClubData={clubData} />
    );
}
