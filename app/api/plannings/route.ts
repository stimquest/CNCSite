import { NextResponse } from 'next/server';

import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const [plannings, charPlannings, marchePlannings] = await Promise.all([
            client.fetch(`*[_type == "weeklyPlanning"] | order(startDate asc) {
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
            client.fetch(`*[_type == "planningCharAVoile"] | order(startDate asc) {
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
            client.fetch(`*[_type == "planningMarche"] | order(startDate asc) {
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
