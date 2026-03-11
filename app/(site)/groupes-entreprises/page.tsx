import React from 'react';
import { client, queries } from '@/lib/sanity';
import GroupesClient from './GroupesClient';

export const metadata = {
    title: 'Groupes et Séminaires - CNC Coutainville',
};

export const revalidate = 60;

export default async function GroupesPage() {
    const groupsData = await client.fetch(queries.groupsPage).catch(() => null);

    return (
        <GroupesClient initialGroupsData={groupsData} />
    );
}
