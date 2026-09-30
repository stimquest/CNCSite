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

        if (type === 'UPDATE_INFO') {
            if (!_id || _id === SINGLETON_ID) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            await serverClient.patch(_id).set(patch).commit();
            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true });
        }

        if (type === 'DELETE_INFO') {
            if (!_id || _id === SINGLETON_ID) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            await serverClient.delete(_id);
            revalidatePath('/');
            revalidatePath('/fil-info');
            return NextResponse.json({ success: true });
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

        if (type === 'UPSERT_SHOP_ITEM') {
            if (!document || typeof document !== 'object') {
                return NextResponse.json({ error: 'Article boutique invalide' }, { status: 400 });
            }

            const item = document as Record<string, any>;
            const itemType = item._type;
            if (itemType !== 'merchItem' && itemType !== 'occazItem') {
                return NextResponse.json({ error: 'Type d’article invalide' }, { status: 400 });
            }
            if (typeof item.name !== 'string' || !item.name.trim() || typeof item.price !== 'string' || !item.price.trim()) {
                return NextResponse.json({ error: 'Le nom et le prix sont obligatoires' }, { status: 400 });
            }
            if (typeof item.image?.asset?._ref !== 'string') {
                return NextResponse.json({ error: 'La photo principale est obligatoire' }, { status: 400 });
            }

            const fields: Record<string, unknown> = {
                name: item.name.trim(),
                price: item.price.trim(),
                description: typeof item.description === 'string' ? item.description : '',
                image: { _type: 'image', asset: { _type: 'reference', _ref: item.image.asset._ref } },
            };

            if (itemType === 'merchItem') {
                const categories = ['Vêtements', 'Accessoires', 'Équipement'];
                if (!categories.includes(item.category)) {
                    return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 });
                }
                fields.category = item.category;
                fields.badge = typeof item.badge === 'string' ? item.badge : '';
                fields.hoverImage = typeof item.hoverImage?.asset?._ref === 'string'
                    ? { _type: 'image', asset: { _type: 'reference', _ref: item.hoverImage.asset._ref } }
                    : null;
            } else {
                const conditions = ['État neuf', 'Très bon état', 'Bon état', 'À réviser'];
                if (!conditions.includes(item.condition)) {
                    return NextResponse.json({ error: 'État invalide' }, { status: 400 });
                }
                fields.condition = item.condition;
                fields.year = typeof item.year === 'string' ? item.year : '';
            }

            let savedId: string;
            if (typeof item._id === 'string' && item._id.trim()) {
                const existing = await serverClient.getDocument(item._id);
                if (!existing || existing._type !== itemType) {
                    return NextResponse.json({ error: 'Article boutique introuvable' }, { status: 404 });
                }
                await serverClient.patch(item._id).set(fields).commit();
                savedId = item._id;
            } else {
                const result = await serverClient.create({ _type: itemType, ...fields });
                savedId = result._id;
            }

            revalidatePath('/boutique');
            revalidatePath('/admin');
            return NextResponse.json({ success: true, id: savedId });
        }

        if (type === 'DELETE_SHOP_ITEM') {
            if (typeof _id !== 'string' || !['merchItem', 'occazItem'].includes(body.itemType)) {
                return NextResponse.json({ error: 'Article boutique invalide' }, { status: 400 });
            }
            const existing = await serverClient.getDocument(_id);
            if (!existing || existing._type !== body.itemType) {
                return NextResponse.json({ error: 'Article boutique introuvable' }, { status: 404 });
            }
            await serverClient.delete(_id);
            revalidatePath('/boutique');
            revalidatePath('/admin');
            return NextResponse.json({ success: true });
        }

        if (type === 'UPSERT_SIGNAGE_SLIDE') {
            if (!document || typeof document !== 'object') {
                return NextResponse.json({ error: 'Diapositive invalide' }, { status: 400 });
            }
            const slide = document as Record<string, any>;
            if (slide._type !== 'signageSlide' || !['promo', 'partners', 'info'].includes(slide.type)) {
                return NextResponse.json({ error: 'Type de diapositive invalide' }, { status: 400 });
            }
            if (typeof slide.title !== 'string' || !slide.title.trim()) {
                return NextResponse.json({ error: 'Le nom interne est obligatoire' }, { status: 400 });
            }

            const duration = Number(slide.duration);
            const order = Number(slide.order);
            if (!Number.isFinite(duration) || duration < 5000 || duration > 120000 || !Number.isInteger(order) || order < 0) {
                return NextResponse.json({ error: 'Durée ou position invalide' }, { status: 400 });
            }

            const fields: Record<string, unknown> = {
                title: slide.title.trim(),
                type: slide.type,
                duration,
                order,
                isActive: !!slide.isActive,
            };
            const unset: string[] = [];

            if (slide.type === 'promo') {
                const promo = slide.promoContent || {};
                const imageAssetId = promo.imageAssetId || promo.image?.asset?._ref;
                fields.promoContent = {
                    tag: typeof promo.tag === 'string' ? promo.tag : '',
                    title: typeof promo.title === 'string' ? promo.title : '',
                    description: typeof promo.description === 'string' ? promo.description : '',
                    showQrCode: !!promo.showQrCode,
                    ...(typeof imageAssetId === 'string' ? { image: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } } : {}),
                };
                if (typeof promo.title !== 'string' || !promo.title.trim()) {
                    return NextResponse.json({ error: 'Le titre de la promotion est obligatoire' }, { status: 400 });
                }
                unset.push('partnersContent', 'infoContent');
            } else if (slide.type === 'partners') {
                const partners = slide.partnersContent || {};
                const list = Array.isArray(partners.list) ? partners.list : [];
                const cleanList = list.filter((partner: any) => typeof partner.name === 'string' && partner.name.trim()).map((partner: any) => {
                    const logoAssetId = partner.logoAssetId || partner.logo?.asset?._ref;
                    return {
                        _type: 'object',
                        _key: typeof partner._key === 'string' ? partner._key : crypto.randomUUID().replace(/-/g, ''),
                        name: partner.name.trim(),
                        ...(typeof logoAssetId === 'string' ? { logo: { _type: 'image', asset: { _type: 'reference', _ref: logoAssetId } } } : {}),
                    };
                });
                if (!cleanList.length) return NextResponse.json({ error: 'Ajoute au moins un partenaire' }, { status: 400 });
                fields.partnersContent = {
                    title: typeof partners.title === 'string' ? partners.title : 'Nos partenaires officiels',
                    list: cleanList,
                };
                unset.push('promoContent', 'infoContent');
            } else {
                const info = slide.infoContent || {};
                const categories = ['alert', 'info', 'event', 'vibe'];
                if (typeof info.message !== 'string' || !info.message.trim() || !categories.includes(info.category)) {
                    return NextResponse.json({ error: 'Message ou style invalide' }, { status: 400 });
                }
                fields.infoContent = {
                    title: typeof info.title === 'string' ? info.title : '',
                    message: info.message,
                    category: info.category,
                };
                unset.push('promoContent', 'partnersContent');
            }

            let savedId: string;
            if (typeof slide._id === 'string' && slide._id.trim()) {
                const existing = await serverClient.getDocument(slide._id);
                if (!existing || existing._type !== 'signageSlide') {
                    return NextResponse.json({ error: 'Diapositive introuvable' }, { status: 404 });
                }
                await serverClient.patch(slide._id).set(fields as any).unset(unset).commit();
                savedId = slide._id;
            } else {
                const result = await serverClient.create({ _type: 'signageSlide', ...fields } as any);
                savedId = result._id;
            }

            revalidatePath('/digital-signage');
            revalidatePath('/admin');
            return NextResponse.json({ success: true, id: savedId });
        }

        if (type === 'DELETE_SIGNAGE_SLIDE') {
            if (typeof _id !== 'string' || !_id.trim()) {
                return NextResponse.json({ error: 'Identifiant de diapositive invalide' }, { status: 400 });
            }
            const existing = await serverClient.getDocument(_id);
            if (!existing || existing._type !== 'signageSlide') {
                return NextResponse.json({ error: 'Diapositive introuvable' }, { status: 404 });
            }
            await serverClient.delete(_id);
            revalidatePath('/digital-signage');
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
