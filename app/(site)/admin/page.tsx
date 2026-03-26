import React from 'react';
import AdminClient from './AdminClient';
import { client, queries } from '@/lib/sanity';

export const metadata = {
  title: 'CNC Admin Control',
};

// Force dynamic to always get the latest plannings
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const [plannings, marchePlannings, charSessions, agendaEvents, articles] = await Promise.all([
        client.fetch(queries.plannings),
        client.fetch(queries.marchePlannings),
        client.fetch(queries.charSessions),
        client.fetch(queries.adminAgendaEvents),
        client.fetch(queries.articles),
    ]);

    return (
        <AdminClient 
            plannings={plannings || []} 
            marchePlannings={marchePlannings || []} 
            charSessions={charSessions || []}
            agendaEvents={agendaEvents || []}
            articles={articles || []}
        />
    );
}
