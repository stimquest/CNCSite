import { NextResponse } from 'next/server';

import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [plannings, charSessions, marchePlannings, stageDefinitions] = await Promise.all([
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
                    raidStageKey,
                    stageSlots[] { _key, stageKey, time, activity, description }
                }
            }`),
            client.fetch(
                `*[_type == "charSession" && actif != false && date >= $today] | order(date asc) {
                    _id, date, heureDebut, heureFin
                }`,
                { today }
            ),
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
            client.fetch(`*[_type == "stageDefinition" && isActive == true] | order(order asc) {
                _id,
                "key": key.current,
                label, shortLabel, order, isActive, color
            }`),
        ]);

        return NextResponse.json({ plannings, charSessions, marchePlannings, stageDefinitions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
