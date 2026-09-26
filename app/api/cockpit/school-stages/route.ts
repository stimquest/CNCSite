import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { getServerWriteClient } from '@/lib/sanity.server';

// Édition des fiches stages de la page École (schoolPage.stages[]).
// Protégé par proxy.ts (/api/cockpit/:path*).

const DOC_ID = 'schoolPage';
const DRAFT_ID = `drafts.${DOC_ID}`;

const STAGE_FIELDS = [
    '_key', 'id', 'title', 'officialName', 'age', 'price', 'hook', 'description', 'longDescription',
    'logistique', 'image', 'color', 'bgColor', 'pricingTiers', 'registrationUrl',
] as const;

const cleanStage = (input: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    for (const key of STAGE_FIELDS) {
        const value = input[key];
        if (value === undefined || value === null || value === '') continue;
        if (Array.isArray(value) && value.length === 0) continue;
        out[key] = value;
    }
    if (Array.isArray(out.logistique)) {
        out.logistique = (out.logistique as unknown[]).map((s) => String(s).trim()).filter(Boolean);
    }
    if (Array.isArray(out.pricingTiers)) {
        out.pricingTiers = (out.pricingTiers as Array<Record<string, unknown>>)
            .filter((t) => t?.label || t?.value)
            .map((t) => ({ _key: t._key || crypto.randomUUID().slice(0, 12), _type: 'object', label: t.label || '', value: t.value || '' }));
    }
    if (!out._key) out._key = crypto.randomUUID().slice(0, 12);
    return out;
};

export async function GET() {
    try {
        const serverClient = getServerWriteClient();
        const doc = await serverClient.fetch(`*[_id == $id][0]{
            _rev,
            stages[] { ..., "imageUrl": image.asset->url }
        }`, { id: DOC_ID });
        const hasDraft = !!(await serverClient.fetch(`defined(*[_id == $id][0]._id)`, { id: DRAFT_ID }));
        return NextResponse.json({ stages: doc?.stages || [], rev: doc?._rev || null, hasDraft });
    } catch (error) {
        console.error('School stages GET error', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const serverClient = getServerWriteClient();
        const { stages, rev } = await req.json();
        if (!Array.isArray(stages)) return NextResponse.json({ error: 'Stages manquants' }, { status: 400 });

        const cleaned = stages.map(cleanStage);
        const missing = cleaned.findIndex((s) => !s.officialName);
        if (missing >= 0) return NextResponse.json({ error: `Le stage n°${missing + 1} n'a pas de nom officiel` }, { status: 400 });

        let tx = serverClient.transaction().patch(DOC_ID, (p) => {
            const patch = p.set({ stages: cleaned });
            return rev ? patch.ifRevisionId(rev) : patch;
        });
        // Un brouillon Studio ouvert écraserait nos changements à sa publication : on le garde aligné.
        const draftExists = await serverClient.getDocument(DRAFT_ID);
        if (draftExists) tx = tx.patch(DRAFT_ID, (p) => p.set({ stages: cleaned }));

        try {
            await tx.commit();
        } catch (err) {
            const status = (err as { statusCode?: number }).statusCode;
            if (status === 409) {
                return NextResponse.json({ error: 'Les stages ont été modifiés ailleurs entre-temps. Rechargez avant d\'enregistrer.' }, { status: 409 });
            }
            throw err;
        }

        revalidatePath('/ecole-voile');
        revalidatePath('/activites');
        revalidatePath('/');
        const fresh = await serverClient.fetch(`*[_id == $id][0]{ _rev, stages[] { ..., "imageUrl": image.asset->url } }`, { id: DOC_ID });
        return NextResponse.json({ success: true, stages: fresh?.stages || [], rev: fresh?._rev || null });
    } catch (error) {
        console.error('School stages POST error', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
