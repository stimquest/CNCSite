import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { client } from '@/lib/sanity';
import { getServerWriteClient } from '@/lib/sanity.server';

export const dynamic = 'force-dynamic';

const SINGLETON_ID = 'singleton-spot-settings';

const NO_CACHE_HEADERS = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Vercel-CDN-Cache-Control': 'no-store',
    'CDN-Cache-Control': 'no-store',
    'Surrogate-Control': 'no-store',
    'Expires': '0',
    'Pragma': 'no-cache'
};

export async function GET() {
    try {
        const data = await client.fetch(
            `*[_type == "spotSettings" && _id == $id][0] {
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
            { id: SINGLETON_ID },
            { useCdn: false, cache: 'no-store' as RequestCache }
        );

        if (!data) {
            console.warn('[cockpit/direct GET] Document introuvable :', SINGLETON_ID);
            return NextResponse.json({ error: 'Document not found' }, { status: 404, headers: NO_CACHE_HEADERS });
        }

        return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
    } catch (error: any) {
        console.error('[cockpit/direct GET] Erreur :', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const serverClient = getServerWriteClient();
        const body = await req.json();
        const { type, patch } = body;

        if (type === 'PATCH') {
            // 1. Crée le document s'il n'existe pas encore (published, pas draft)
            await serverClient.createIfNotExists({
                _id: SINGLETON_ID,
                _type: 'spotSettings',
            });

            // 2. Met à jour les champs
            await serverClient
                .patch(SINGLETON_ID)
                .set({ ...patch, lastPublishedAt: new Date().toISOString() })
                .commit();

            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
        }

        if (type === 'CONFIRM') {
            await serverClient.createIfNotExists({
                _id: SINGLETON_ID,
                _type: 'spotSettings',
            });

            await serverClient
                .patch(SINGLETON_ID)
                .set({ lastConfirmedAt: new Date().toISOString() })
                .commit();

            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
        }

        return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    } catch (error: any) {
        console.error('[cockpit/direct POST] Erreur :', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
