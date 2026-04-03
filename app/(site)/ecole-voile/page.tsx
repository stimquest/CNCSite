import React from 'react';
import { client, queries } from '@/lib/sanity';
import EcoleVoileClient from './EcoleVoileClient';

export const metadata = {
    title: 'Stages & École de Voile — CNC Coutainville',
    description: 'Stages de voile (juillet & août) et école à l\'année (mercredis & samedis) à Agon-Coutainville. Mini-Mousses, Moussaillons, Catamaran, Planche à Voile, de 5 à 16 ans et adultes.',
};

export const revalidate = 0;

const noCache = { useCdn: false, cache: 'no-store' as RequestCache };

export default async function EcoleVoilePage() {
    const [schoolPageData, plannings, stageDefinitions] = await Promise.all([
        client.fetch(queries.schoolPage).catch(() => null),
        client.fetch(queries.plannings, {}, noCache).catch(() => []),
        client.fetch(queries.stageDefinitions, {}, noCache).catch(() => []),
    ]);

    return (
        <EcoleVoileClient
            initialSchoolPageData={schoolPageData}
            initialPlannings={plannings}
            initialStageDefinitions={stageDefinitions}
        />
    );
}
