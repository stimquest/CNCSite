import React from 'react';
import MultiPrintClient from './MultiPrintClient';
import { client, queries } from '@/lib/sanity';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = {
  title: 'Impression Plannings Multiples | CNC',
};

// Next.js config for caching
export const revalidate = 60; // 60 seconds

export default async function MultiPrintPage({ searchParams }: Props) {
    const params = await searchParams;
    
    // Extract type and ids from query: ?type=stages&ids=id1,id2,id3
    const type = params.type as string;
    const idsString = params.ids as string;

    // Fetch non-live CMS data on the server
    const [plannings, charPlannings, marchePlannings] = await Promise.all([
        client.fetch(queries.plannings),
        client.fetch(queries.charPlannings),
        client.fetch(queries.marchePlannings)
    ]);

    return (
        <MultiPrintClient 
            type={type} 
            idsString={idsString} 
            plannings={plannings} 
            charPlannings={charPlannings} 
            marchePlannings={marchePlannings} 
        />
    );
}
