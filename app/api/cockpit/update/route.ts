import { NextResponse } from 'next/server';

import { client } from '@/lib/sanity';
import { getServerWriteClient } from '@/lib/sanity.server';

const SINGLETON_ID = 'singleton-spot-settings';
type PlanningDocumentType = 'weeklyPlanning' | 'planningCharAVoile' | 'planningMarche';
type PlanningDocument = { _type: PlanningDocumentType; _id?: string } & Record<string, unknown>;

const ALLOWED_PLANNING_TYPES = new Set(['weeklyPlanning', 'planningCharAVoile', 'planningMarche']);

const touchPlanningsTimestamp = async (serverClient: ReturnType<typeof getServerWriteClient>) => {
    await serverClient.patch(SINGLETON_ID).set({ planningsLastUpdatedAt: new Date().toISOString() }).commit();
};

export async function POST(req: Request) {
    try {
        const serverClient = getServerWriteClient();
        const body = await req.json();
        const { type, patch, _id = SINGLETON_ID, document, touchTimestamp = false } = body;

        if (type === 'PATCH') {
            await serverClient.patch(_id).set(patch).commit();
            return NextResponse.json({ success: true });
        }

        if (type === 'CREATE_INFO') {
            const result = await serverClient.create({
                _type: 'infoMessage',
                ...patch
            });
            return NextResponse.json({ success: true, id: result._id });
        }

        if (type === 'UPSERT_PLANNING') {
            if (!document || typeof document !== 'object' || !ALLOWED_PLANNING_TYPES.has((document as { _type?: string })._type || '')) {
                return NextResponse.json({ error: 'Invalid planning document' }, { status: 400 });
            }

            const planningDocument = document as PlanningDocument;
            const result = planningDocument._id
                ? await serverClient.createOrReplace(planningDocument as PlanningDocument & { _id: string })
                : await serverClient.create(planningDocument);

            if (touchTimestamp) {
                await touchPlanningsTimestamp(serverClient);
            }

            return NextResponse.json({ success: true, id: result._id });
        }

        if (type === 'DELETE_PLANNING') {
            if (typeof _id !== 'string' || !_id.trim()) {
                return NextResponse.json({ error: 'Invalid planning id' }, { status: 400 });
            }

            const existing = await client.fetch<{ _type?: string } | null>(`*[_id == $id][0]{ _type }`, { id: _id }, { useCdn: false });

            if (!existing?._type || !ALLOWED_PLANNING_TYPES.has(existing._type)) {
                return NextResponse.json({ error: 'Planning not found' }, { status: 404 });
            }

            await serverClient.delete(_id);

            if (touchTimestamp) {
                await touchPlanningsTimestamp(serverClient);
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    } catch (error: any) {
        console.error('Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
