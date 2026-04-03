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
                stageStatuses[] { stageKey, status, message },
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
            await serverClient.createIfNotExists({
                _id: SINGLETON_ID,
                _type: 'spotSettings',
            });

            // Séparer les mises à jour standard des statuts de stages
            const { stageStatuses: newStageStatuses, ...standardPatch } = patch;

            const patchBuilder = serverClient
                .patch(SINGLETON_ID)
                .set({ ...standardPatch, lastPublishedAt: new Date().toISOString() });

            if (newStageStatuses !== undefined) {
                // stageStatuses est un tableau complet qu'on remplace entièrement
                patchBuilder.set({ stageStatuses: newStageStatuses });
            }

            await patchBuilder.commit();

            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
        }

        if (type === 'PATCH_STAGE') {
            // Mise à jour d'un seul stage dans le tableau stageStatuses
            // body: { type: 'PATCH_STAGE', stageKey, status?, message? }
            const { stageKey, status, message } = body;
            if (!stageKey) {
                return NextResponse.json({ error: 'stageKey requis' }, { status: 400 });
            }

            await serverClient.createIfNotExists({
                _id: SINGLETON_ID,
                _type: 'spotSettings',
            });

            // Récupérer le tableau actuel
            const current = await client.fetch(
                `*[_type == "spotSettings" && _id == $id][0] { stageStatuses[] { stageKey, status, message } }`,
                { id: SINGLETON_ID },
                { useCdn: false, cache: 'no-store' as RequestCache }
            );

            const currentStatuses: any[] = current?.stageStatuses || [];
            const existingIdx = currentStatuses.findIndex((s: any) => s.stageKey === stageKey);

            let updatedStatuses: any[];
            if (existingIdx >= 0) {
                updatedStatuses = currentStatuses.map((s: any) =>
                    s.stageKey === stageKey
                        ? { ...s, ...(status !== undefined ? { status } : {}), ...(message !== undefined ? { message } : {}) }
                        : s
                );
            } else {
                updatedStatuses = [
                    ...currentStatuses,
                    { _key: `stage-${stageKey}-${Date.now()}`, stageKey, status: status || 'OPEN', message: message || '' }
                ];
            }

            await serverClient
                .patch(SINGLETON_ID)
                .set({ stageStatuses: updatedStatuses, lastPublishedAt: new Date().toISOString() })
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
