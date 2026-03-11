import React from 'react';
import { client, queries } from '@/lib/sanity';
import NatureClient from './NatureClient';

export const metadata = {
    title: 'Nature - CNC Coutainville',
};

export const revalidate = 60;

export default async function NaturePage() {
    const natureData = await client.fetch(queries.naturePage).catch(() => null);

    return (
        <NatureClient initialNatureData={natureData} />
    );
}
