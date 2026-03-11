import React from 'react';
import { client, queries } from '@/lib/sanity';
import ClubClient from './ClubClient';

export const metadata = {
    title: 'Le Club - CNC Coutainville',
};

export const revalidate = 60;

export default async function ClubPage() {
    const clubData = await client.fetch(queries.clubPage).catch(() => null);

    return (
        <ClubClient initialClubData={clubData} />
    );
}
