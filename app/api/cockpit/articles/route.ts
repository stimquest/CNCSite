import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { getServerWriteClient } from '@/lib/sanity.server';

// Accès protégé par proxy.ts (matcher /api/cockpit/:path*).

const EDITABLE_FIELDS = [
    'title', 'slug', 'category', 'publishedAt', 'coverImage', 'excerpt',
    'agendaDate', 'agendaTime', 'agendaBadge', 'body',
] as const;

const publishedIdOf = (id: string) => id.replace(/^drafts\./, '');
const draftIdOf = (id: string) => `drafts.${publishedIdOf(id)}`;

const pickFields = (input: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    for (const key of EDITABLE_FIELDS) {
        const value = input[key];
        if (value !== undefined && value !== null && value !== '') out[key] = value;
    }
    // L'URL d'image n'est qu'un champ d'affichage ajouté par la requête GET
    if (Array.isArray(out.body)) {
        out.body = out.body.map((block: Record<string, unknown>) => {
            if (block?._type !== 'image') return block;
            const { url: _url, ...rest } = block;
            return rest;
        });
    }
    return out;
};

const revalidateBlog = (slug?: string) => {
    revalidatePath('/');
    revalidatePath('/blog');
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin');
};

const ARTICLE_PROJECTION = `{
    ..., "coverImageUrl": coverImage.asset->url,
    body[] { ..., _type == "image" => { ..., "url": asset->url } }
}`;

// GET ?id=xxx → version brouillon si elle existe, sinon publiée.
// GET sans id → liste (brouillons inclus) pour l'admin.
export async function GET(req: Request) {
    try {
        const serverClient = getServerWriteClient();
        const id = new URL(req.url).searchParams.get('id');

        if (id) {
            const pubId = publishedIdOf(id);
            const [draft, published] = await Promise.all([
                serverClient.fetch(`*[_id == $id][0]${ARTICLE_PROJECTION}`, { id: draftIdOf(pubId) }),
                serverClient.fetch(`*[_id == $id][0]${ARTICLE_PROJECTION}`, { id: pubId }),
            ]);
            if (!draft && !published) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
            return NextResponse.json({ article: draft || published, hasDraft: !!draft, isPublished: !!published });
        }

        const all = await serverClient.fetch(`*[_type == "article"] | order(publishedAt desc) {
            _id, title, "slug": slug.current, category, publishedAt, "coverImage": coverImage.asset->url
        }`);
        const byId = new Map<string, { _id: string; hasDraft: boolean; isPublished: boolean } & Record<string, unknown>>();
        for (const doc of all as Array<{ _id: string } & Record<string, unknown>>) {
            const pubId = publishedIdOf(doc._id);
            const isDraft = doc._id.startsWith('drafts.');
            const existing = byId.get(pubId);
            const merged = {
                ...(existing || {}),
                ...(isDraft || !existing ? doc : {}),
                _id: pubId,
                hasDraft: (existing?.hasDraft ?? false) || isDraft,
                isPublished: (existing?.isPublished ?? false) || !isDraft,
            };
            byId.set(pubId, merged);
        }
        return NextResponse.json({ articles: [...byId.values()] });
    } catch (error) {
        console.error('Articles GET error', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const serverClient = getServerWriteClient();

        const { type, _id, article } = await req.json();

        if (type === 'SAVE_DRAFT' || type === 'PUBLISH') {
            if (!article || typeof article !== 'object') {
                return NextResponse.json({ error: 'Article manquant' }, { status: 400 });
            }
            const fields = pickFields(article);
            if (!fields.title) return NextResponse.json({ error: 'Le titre est obligatoire' }, { status: 400 });

            if (type === 'PUBLISH') {
                const missing = ['slug', 'category', 'publishedAt'].filter((k) => !fields[k]);
                if (missing.length) return NextResponse.json({ error: `Champs obligatoires manquants : ${missing.join(', ')}` }, { status: 400 });
            }

            const pubId = _id ? publishedIdOf(_id) : `article-${crypto.randomUUID()}`;
            const draftId = draftIdOf(pubId);

            if (type === 'SAVE_DRAFT') {
                await serverClient.createOrReplace({ _id: draftId, _type: 'article', ...fields });
                return NextResponse.json({ success: true, id: pubId });
            }

            await serverClient.transaction()
                .createOrReplace({ _id: pubId, _type: 'article', ...fields })
                .delete(draftId)
                .commit();
            revalidateBlog((fields.slug as { current?: string } | undefined)?.current);
            return NextResponse.json({ success: true, id: pubId });
        }

        if (type === 'DISCARD_DRAFT') {
            if (!_id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            await serverClient.delete(draftIdOf(_id));
            return NextResponse.json({ success: true });
        }

        if (type === 'UNPUBLISH') {
            if (!_id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            const pubId = publishedIdOf(_id);
            const published = await serverClient.getDocument(pubId);
            if (published) {
                const draft = await serverClient.getDocument(draftIdOf(pubId));
                await serverClient.transaction()
                    .createIfNotExists({ ...(draft || published), _id: draftIdOf(pubId) })
                    .delete(pubId)
                    .commit();
            }
            revalidateBlog();
            return NextResponse.json({ success: true });
        }

        if (type === 'DELETE') {
            if (!_id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
            const pubId = publishedIdOf(_id);
            await serverClient.transaction().delete(pubId).delete(draftIdOf(pubId)).commit();
            revalidateBlog();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
    } catch (error) {
        console.error('Articles POST error', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
