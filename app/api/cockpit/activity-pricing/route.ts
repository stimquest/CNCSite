import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { getServerWriteClient } from '@/lib/sanity.server';

type PricingSection = 'courses' | 'locations' | 'hidden';
type PricingMode = PricingSection | 'mixed';
type PriceInput = {
    _key?: string;
    label?: string;
    value?: string;
    pricingSection?: PricingSection;
    duration?: string;
    details?: string;
};

const activityProjection = `{
    _id, _rev, id, title, category, price, duration, pricingMode, pricingLastConfirmedAt,
    "prices": prices[]{ _key, label, value, pricingSection, duration, details }
}`;

const cleanText = (value: unknown, maxLength = 240) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const cleanPrices = (prices: unknown, pricingMode: PricingMode): Array<Record<string, string>> => {
    if (!Array.isArray(prices) || prices.length > 30) throw new Error('Grille tarifaire invalide');
    if (prices.length === 0) throw new Error('Ajoutez au moins une ligne tarifaire avant de confirmer');
    return prices.map((raw, index) => {
        const price = (raw || {}) as PriceInput;
        const label = cleanText(price.label, 100);
        const value = cleanText(price.value, 80);
        if (!label || !value) throw new Error(`Le tarif n°${index + 1} doit avoir un libellé et un montant`);
        const forcedSection = pricingMode === 'mixed' ? price.pricingSection : pricingMode;
        if (!['courses', 'locations', 'hidden'].includes(forcedSection || '')) {
            throw new Error(`Choisissez où afficher le tarif n°${index + 1}`);
        }
        const pricingSection = forcedSection as PricingSection;
        return {
            _key: cleanText(price._key, 80) || crypto.randomUUID().slice(0, 12),
            _type: 'object',
            label,
            value,
            pricingSection,
            duration: cleanText(price.duration, 100),
            details: cleanText(price.details, 240),
        };
    });
};

export async function GET() {
    try {
        const serverClient = getServerWriteClient();
        const activities = await serverClient.fetch(`*[_type == "activity" && !(_id in path("drafts.**"))] | order(order asc, title asc) ${activityProjection}`);
        return NextResponse.json({ activities: activities || [] });
    } catch (error) {
        console.error('Activity pricing GET error', error);
        return NextResponse.json({ error: 'Impossible de charger les tarifs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const serverClient = getServerWriteClient();
        const body = await request.json();
        const activity = body?.activity as Record<string, unknown> | undefined;
        const id = cleanText(activity?._id, 200);
        const rev = cleanText(activity?._rev, 200);
        const price = cleanText(activity?.price, 80);
        const pricingMode = cleanText(activity?.pricingMode, 20) as PricingMode;
        if (!id || !price) return NextResponse.json({ error: 'Activité ou prix principal manquant' }, { status: 400 });
        if (!['courses', 'locations', 'mixed', 'hidden'].includes(pricingMode)) {
            return NextResponse.json({ error: 'Choisissez le mode tarifaire de l’activité' }, { status: 400 });
        }

        const existing = await serverClient.getDocument(id);
        if (!existing || existing._type !== 'activity') return NextResponse.json({ error: 'Activité introuvable' }, { status: 404 });

        const prices = cleanPrices(activity?.prices, pricingMode);
        const pricingLastConfirmedAt = new Date().toISOString();
        const fields = { price, pricingMode, prices, pricingLastConfirmedAt };
        let transaction = serverClient.transaction().patch(id, patch => {
            const next = patch.set(fields);
            return rev ? next.ifRevisionId(rev) : next;
        });

        const draftId = `drafts.${id}`;
        if (await serverClient.getDocument(draftId)) transaction = transaction.patch(draftId, patch => patch.set(fields));

        try {
            await transaction.commit();
        } catch (error) {
            if ((error as { statusCode?: number }).statusCode === 409) {
                return NextResponse.json({ error: 'Ces tarifs ont été modifiés ailleurs. Rechargez avant d’enregistrer.' }, { status: 409 });
            }
            throw error;
        }

        revalidatePath('/activites');
        revalidatePath('/infos-pratiques');
        revalidatePath('/admin');
        const saved = await serverClient.fetch(`*[_id == $id][0] ${activityProjection}`, { id });
        return NextResponse.json({ success: true, activity: saved });
    } catch (error) {
        console.error('Activity pricing POST error', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Impossible d’enregistrer les tarifs' }, { status: 500 });
    }
}
