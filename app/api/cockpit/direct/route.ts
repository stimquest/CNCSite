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
            `*[_type == "spotSettings" && !(_id in path('drafts.**'))] | order(_updatedAt desc)[0] {
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
            {
                useCdn: false,
                cache: 'no-store' as RequestCache,
            }
        );
        if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Vercel-CDN-Cache-Control': 'no-store',
                'CDN-Cache-Control': 'no-store',
                'Surrogate-Control': 'no-store',
                'Expires': '0',
                'Pragma': 'no-cache'
            }
        });
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
        const settings = await client.fetch(
            `*[_type == "spotSettings" && !(_id in path('drafts.**'))] | order(_updatedAt desc)[0] { _id }`,
            {},
            { useCdn: false, cache: 'no-store' as RequestCache }
        );
        const targetId = settings?._id || SINGLETON_ID;

        if (type === 'PATCH') {
            await serverClient.transaction()
                .createIfNotExists({ _id: targetId, _type: 'spotSettings' })
                .patch(targetId, p => p.set({ ...patch, lastPublishedAt: new Date().toISOString() }))
                .commit();
            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true });
        }

        if (type === 'CONFIRM') {
            await serverClient.transaction()
                .createIfNotExists({ _id: targetId, _type: 'spotSettings' })
                .patch(targetId, p => p.set({ lastConfirmedAt: new Date().toISOString() }))
                .commit();
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
