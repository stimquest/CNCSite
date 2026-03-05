import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const serverClient = createClient({
    projectId: 'df7iwkkw',
    dataset: 'production',
    apiVersion: '2024-03-15',
    token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || '',
    useCdn: false,
});

const SINGLETON_ID = 'singleton-spot-settings';

export async function GET() {
    try {
        const data = await serverClient.fetch(
            `*[_type == "spotSettings" && !(_id in path('drafts.**'))][0] {
                spotStatus, statusMessage,
                charStatus, charMessage, charTags,
                marcheStatus, marcheMessage, marcheTags,
                nautiqueStatus, nautiqueMessage, nautiqueTags,
                stagesMiniMoussesStatus, stagesMiniMoussesMessage,
                stagesMoussaillonsStatus, stagesMoussaillonsMessage,
                stagesInitiationStatus, stagesInitiationMessage,
                stagesPerfStatus, stagesPerfMessage,
                lastPublishedAt, lastConfirmedAt, planningsLastUpdatedAt
            }`,
            {},
            { useCdn: false }
        );
        if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, patch } = body;

        if (type === 'PATCH') {
            await serverClient.patch(SINGLETON_ID).set({
                ...patch,
                lastPublishedAt: new Date().toISOString()
            }).commit();
            return NextResponse.json({ success: true });
        }

        if (type === 'CONFIRM') {
            // Chef de base confirms all is OK without changing any status
            await serverClient.patch(SINGLETON_ID).set({
                lastConfirmedAt: new Date().toISOString()
            }).commit();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error: any) {
        console.error('Direct Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
