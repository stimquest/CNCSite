import React from 'react';
import PrintClient from './PrintClient';
import { client, queries } from '@/lib/sanity';

type PrintType = 'stages' | 'char' | 'marche';

interface Props {
    params: Promise<{
        type: PrintType;
        id: string;
    }>;
}

export const metadata = {
  title: 'Impression Planning | CNC',
};

// Next.js config for caching
export const dynamic = 'force-dynamic';

export default async function PrintPage({ params }: Props) {
    const { type, id } = await params;

    // Fetch non-live CMS data on the server
    const [plannings, charPlannings, marchePlannings, stageDefinitions] = await Promise.all([
        client.fetch(queries.plannings),
        client.fetch(queries.charPlannings),
        client.fetch(queries.marchePlannings),
        client.fetch(`*[_type == "stageDefinition"] | order(order asc) { "key": key.current, label, isActive }`)
    ]);

    return (
        <PrintClient 
            stageDefinitions={stageDefinitions}
            type={type} 
            id={id} 
            plannings={plannings} 
            charPlannings={charPlannings} 
            marchePlannings={marchePlannings} 
        />
    );
}
