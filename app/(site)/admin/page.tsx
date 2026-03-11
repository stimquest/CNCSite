import React from 'react';
import AdminClient from './AdminClient';
import { client, queries } from '@/lib/sanity';

export const metadata = {
  title: 'CNC Admin Control',
};

// Force dynamic to always get the latest plannings
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    // Fetch non-live CMS data on the server
    const [plannings, charPlannings, marchePlannings] = await Promise.all([
        client.fetch(queries.plannings),
        client.fetch(queries.charPlannings),
        client.fetch(queries.marchePlannings)
    ]);

    return (
        <AdminClient 
            plannings={plannings || []} 
            charPlannings={charPlannings || []} 
            marchePlannings={marchePlannings || []} 
        />
    );
}
