import React from 'react';
import { client, queries } from '@/lib/sanity';
import InfosClient from './InfosClient';

export const metadata = {
    title: 'Informations Pratiques - CNC Coutainville',
};

export const revalidate = 60;

export default async function Page() {
    const infosData = await client.fetch(queries.infosPage).catch(() => null);

    return (
        <InfosClient initialData={infosData} />
    );
}
