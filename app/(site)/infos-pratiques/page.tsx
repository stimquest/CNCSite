import React from 'react';
import { client, queries } from '@/lib/sanity';
import InfosClient from './InfosClient';

export const metadata = {
    title: 'Infos & Contact - CNC Coutainville',
    description: 'Tarifs, documents utiles, horaires et contact du Club Nautique de Coutainville. Toutes les informations pratiques pour rejoindre le CNC.',
};

export const revalidate = 60;

export default async function Page() {
    const infosData = await client.fetch(queries.infosPage).catch(() => null);

    return (
        <InfosClient initialData={infosData} />
    );
}
