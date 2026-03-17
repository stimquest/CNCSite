import React from 'react';
import { client, queries } from '@/lib/sanity';
import GroupesClient from './GroupesClient';

export const metadata = {
    title: 'Groupes et Séminaires - CNC Coutainville',
    description: "Séminaires et événements d'entreprise au Club Nautique de Coutainville. Team building nautique, journées thématiques et privatisation du site face aux îles Chausey.",
};

export const revalidate = 60;

export default async function GroupesPage() {
    const groupsData = await client.fetch(queries.groupsPage).catch(() => null);

    return (
        <GroupesClient initialGroupsData={groupsData} />
    );
}
