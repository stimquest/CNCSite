import React from 'react';
import FilInfoClient from '@/components/FilInfoClient';
import { client, queries } from '@/lib/sanity';

export const metadata = {
  title: 'Fil Info | CNC - La Vigie',
  description: 'Alertes météo, état des activités et actualités du Club Nautique de Coutainville en direct.',
};

export const revalidate = 60; // Revalidate every minute

export default async function FilInfoPage() {
    const infoMessages = await client.fetch(queries.infoMessages);

    return <FilInfoClient infoMessages={infoMessages} />;
}
