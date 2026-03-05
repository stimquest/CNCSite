import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const serverClient = createClient({
    projectId: 'df7iwkkw',
    dataset: 'production',
    apiVersion: '2024-03-15',
    useCdn: false, // Always bypass CDN for fresh data
    token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || '',
});

export async function GET() {
    try {
        const [plannings, charPlannings, marchePlannings] = await Promise.all([
            serverClient.fetch(`*[_type == "weeklyPlanning"] | order(startDate asc) {
                _id,
                title,
                startDate,
                endDate,
                days[] {
                    _key,
                    name,
                    date,
                    isRaidDay,
                    raidTarget,
                    miniMousses { time, activity, description },
                    mousses { time, activity, description },
                    initiation,
                    perfectionnement
                }
            }`),
            serverClient.fetch(`*[_type == "planningCharAVoile"] | order(startDate asc) {
                _id,
                title,
                startDate,
                endDate,
                weeks[] {
                    _key,
                    title,
                    startDate,
                    endDate,
                    days[] {
                        _key,
                        name,
                        date,
                        sessions[] { _key, time }
                    }
                }
            }`),
            serverClient.fetch(`*[_type == "planningMarche"] | order(startDate asc) {
                _id,
                title,
                startDate,
                endDate,
                weeks[] {
                    _key,
                    title,
                    startDate,
                    endDate,
                    days[] {
                        _key,
                        name,
                        date,
                        sessions[] { _key, time }
                    }
                }
            }`),
        ]);

        return NextResponse.json({ plannings, charPlannings, marchePlannings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
