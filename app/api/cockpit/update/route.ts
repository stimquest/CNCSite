import { revalidatePath } from 'next/cache';
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

const revalidateCharPages = () => {
    revalidatePath('/activites');
    revalidatePath('/activites/char-a-voile');
    revalidatePath('/admin');
};

export async function POST(req: Request) {
    try {
        const serverClient = getServerWriteClient();
        const body = await req.json();
        const { type, patch, _id = SINGLETON_ID, document, touchTimestamp = false } = body;

        if (type === 'PATCH') {
            await serverClient.patch(_id).set(patch).commit();
            revalidatePath('/');
            revalidatePath('/fil-info');
            revalidatePath('/cockpit');
            return NextResponse.json({ success: true });
        }

        if (type === 'CREATE_INFO') {
            const result = await serverClient.create({
                _type: 'infoMessage',
                ...patch
            });
            revalidatePath('/');
            revalidatePath('/fil-info');
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
            revalidatePath('/');
            revalidatePath('/plannings');
            revalidatePath('/activites');
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
            revalidatePath('/');
            revalidatePath('/plannings');
            revalidatePath('/activites');
            return NextResponse.json({ success: true });
        }

        if (type === 'UPSERT_AGENDA') {
            if (!document || typeof document !== 'object' || (document as { _type?: string })._type !== 'agendaEvent') {
                return NextResponse.json({ error: 'Invalid agenda document' }, { status: 400 });
            }
            const result = (document as { _id?: string })._id
                ? await serverClient.createOrReplace(document as any)
                : await serverClient.create(document as any);
            revalidatePath('/');
            revalidatePath('/admin');
            return NextResponse.json({ success: true, id: result._id });
        }

        if (type === 'DELETE_AGENDA') {
            if (typeof _id !== 'string' || !_id.trim()) {
                return NextResponse.json({ error: 'Invalid agenda id' }, { status: 400 });
            }
            await serverClient.delete(_id);
            revalidatePath('/');
            revalidatePath('/admin');
            return NextResponse.json({ success: true });
        }

        // --- CHAR SESSION ---

        if (type === 'CREATE_CHAR_SESSION') {
            const { date, heureDebut, heureFin, capaciteMax, notes, actif } = patch ?? {};
            if (!date || !heureDebut || !heureFin || !capaciteMax) {
                return NextResponse.json({ error: 'Champs obligatoires manquants (date, heureDebut, heureFin, capaciteMax)' }, { status: 400 });
            }
            const result = await serverClient.create({
                _type: 'charSession',
                date, heureDebut, heureFin, capaciteMax,
                notes: notes ?? '',
                actif: actif ?? true,
            });
            revalidateCharPages();
            return NextResponse.json({ success: true, id: result._id });
        }

        if (type === 'UPDATE_CHAR_SESSION') {
            if (!_id || _id === SINGLETON_ID) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            await serverClient.patch(_id).set(patch).commit();
            revalidateCharPages();
            return NextResponse.json({ success: true });
        }

        if (type === 'DELETE_CHAR_SESSION') {
            if (!_id || _id === SINGLETON_ID) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            // Cascade: delete associated bookings first
            const bookings = await client.fetch<{ _id: string }[]>(
                `*[_type == "charBooking" && session._ref == $sessionId]{ _id }`,
                { sessionId: _id },
                { useCdn: false }
            );
            for (const b of bookings) {
                await serverClient.delete(b._id);
            }
            await serverClient.delete(_id);
            revalidateCharPages();
            return NextResponse.json({ success: true });
        }

        // --- CHAR BOOKING ---

        if (type === 'CREATE_CHAR_BOOKING') {
            const { sessionId, clientNom, clientTel, nbPlaces, statut, notes } = patch ?? {};
            if (!sessionId || !clientNom || !clientTel || !nbPlaces) {
                return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
            }
            const result = await serverClient.create({
                _type: 'charBooking',
                session: { _type: 'reference', _ref: sessionId },
                clientNom,
                clientTel,
                nbPlaces,
                statut: statut ?? 'confirme',
                notes: notes ?? '',
            });
            revalidateCharPages();
            return NextResponse.json({ success: true, id: result._id });
        }

        if (type === 'UPDATE_CHAR_BOOKING') {
            if (!_id || _id === SINGLETON_ID) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            await serverClient.patch(_id).set(patch).commit();
            revalidateCharPages();
            return NextResponse.json({ success: true });
        }

        if (type === 'DELETE_CHAR_BOOKING') {
            if (!_id || _id === SINGLETON_ID) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            await serverClient.delete(_id);
            revalidateCharPages();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    } catch (error: any) {
        console.error('Cockpit API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
