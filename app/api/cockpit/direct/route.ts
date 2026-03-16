import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { client } from '@/lib/sanity';
import { getServerWriteClient } from '@/lib/sanity.server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SINGLETON_ID = 'singleton-spot-settings';

export async function GET() {
    try {
        const data = await client.fetch(
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
        const serverClient = getServerWriteClient();
        const body = await req.json();
        const { type, patch } = body;

        // On récupère d'abord l'ID réel du document pour être sûr de patcher le bon
        const settings = await client.fetch(`*[_type == "spotSettings" && !(_id in path('drafts.**'))][0] { _id }`, {}, { useCdn: false });
        const targetId = settings?._id || SINGLETON_ID;

        if (type === 'PATCH') {
            await serverClient.patch(targetId).set({
                ...patch,
                lastPublishedAt: new Date().toISOString()
            }).commit();
            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true });
        }

        if (type === 'CONFIRM') {
            // Chef de base confirms all is OK without changing any status
            await serverClient.patch(targetId).set({
                lastConfirmedAt: new Date().toISOString()
            }).commit();
            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error: any) {
        console.error('Direct Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
