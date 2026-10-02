import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getServerWriteClient } from '@/lib/sanity.server';
import { editorialKind, normalizeEditorialDocument, plainText, type EditorialDate } from '@/lib/editorial';

// Access is protected by proxy.ts (/api/cockpit/:path*).
const publishedIdOf = (id: string) => id.replace(/^drafts\./, '');
const draftIdOf = (id: string) => `drafts.${publishedIdOf(id)}`;
const isEditorial = (doc: any) => doc && ['article', 'agendaEvent'].includes(doc._type);
const validId = (id: unknown): id is string => typeof id === 'string' && /^[A-Za-z0-9_.-]+$/.test(id) && !id.startsWith('versions.');
const validDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const PROJECTION = `{ ..., "coverImageUrl": coverImage.asset->url, "imageUrl": image.asset->url,
    body[] { ..., _type == "image" => { ..., "url": asset->url } } }`;

function revalidateEditorial(slug?: string) {
    for (const path of ['/', '/club', '/blog', '/admin', '/digital-signage', '/digital-signage/agenda']) revalidatePath(path);
    if (slug) revalidatePath(`/blog/${slug}`);
}

export async function GET(req: Request) {
    try {
        const client = getServerWriteClient();
        const id = new URL(req.url).searchParams.get('id');
        if (id) {
            if (!validId(id)) return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
            const [draft, published] = await Promise.all([
                client.fetch(`*[_id == $id][0]${PROJECTION}`, { id: draftIdOf(id) }, { perspective: 'raw' }),
                client.fetch(`*[_id == $id][0]${PROJECTION}`, { id: publishedIdOf(id) }, { perspective: 'raw' }),
            ]);
            if (!isEditorial(draft || published)) return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 });
            return NextResponse.json({ article: normalizeEditorialDocument(draft || published), hasDraft: !!draft, isPublished: !!published });
        }
        const docs = await client.fetch(`*[_type in ["article", "agendaEvent"]] | order(coalesce(publishedAt, startDate) desc) {
            _id, _type, title, contentType, archived, "slug": slug.current, category, publishedAt,
            agendaDates, agendaDate, agendaTime, agendaBadge, startDate, time, badge,
            "coverImage": coalesce(coverImage.asset->url, image.asset->url)
        }`, {}, { perspective: 'raw' });
        const byId = new Map<string, Record<string, any>>();
        for (const doc of docs) {
            const id = publishedIdOf(doc._id); const isDraft = doc._id.startsWith('drafts.'); const previous = byId.get(id);
            byId.set(id, {
                ...(previous || {}), ...(isDraft || !previous ? doc : {}), _id: id,
                contentType: editorialKind(isDraft || !previous ? doc : previous),
                hasDraft: (previous?.hasDraft || false) || isDraft,
                isPublished: (previous?.isPublished || false) || !isDraft,
            });
        }
        return NextResponse.json({ articles: [...byId.values()].map(doc => ({ ...doc, agendaDates: normalizeEditorialDocument(doc).agendaDates })) });
    } catch (error) {
        console.error('Editorial GET error', error);
        return NextResponse.json({ error: 'Impossible de charger les contenus' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const client = getServerWriteClient();
        const { type, _id, article } = await req.json();
        if (_id != null && !validId(_id)) return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
        const id = _id ? publishedIdOf(_id) : null;
        const [draft, published] = id ? await Promise.all([client.getDocument(draftIdOf(id)), client.getDocument(id)]) : [null, null];
        const existing: any = draft || published;
        if (id && !isEditorial(existing)) return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 });

        if (type === 'SAVE_DRAFT' || type === 'PUBLISH') {
            if (!article || typeof article !== 'object' || Array.isArray(article)) return NextResponse.json({ error: 'Contenu manquant' }, { status: 400 });
            const kind = article.contentType ?? editorialKind(existing || {});
            if (!['article', 'event'].includes(kind)) return NextResponse.json({ error: 'Choisissez un article ou un événement simple' }, { status: 400 });
            if (existing?._type === 'agendaEvent' && kind !== 'event') return NextResponse.json({ error: 'Ce contenu est un événement simple. Créez un article et associez-le à cet événement.' }, { status: 400 });
            if (typeof article.title !== 'string' || !article.title.trim()) return NextResponse.json({ error: 'Le titre est obligatoire' }, { status: 400 });
            const dates = article.agendaDates ?? normalizeEditorialDocument(article).agendaDates;
            if (!Array.isArray(dates) || dates.length > 100) return NextResponse.json({ error: 'Les dates d’agenda sont invalides (100 maximum)' }, { status: 400 });
            const keys = new Set<string>();
            const cleanDates: EditorialDate[] = [];
            for (const date of dates) {
                if (!date || !validDate(date.date) || (date.time != null && typeof date.time !== 'string') || (date.badge != null && typeof date.badge !== 'string')) return NextResponse.json({ error: 'Renseignez une date valide pour chaque événement' }, { status: 400 });
                const key = typeof date._key === 'string' && /^[A-Za-z0-9_-]+$/.test(date._key) ? date._key : crypto.randomUUID();
                if (keys.has(key)) return NextResponse.json({ error: 'Chaque date doit avoir un identifiant distinct' }, { status: 400 });
                keys.add(key); cleanDates.push({ _key: key, date: date.date, time: date.time || '', badge: date.badge || '', archived: date.archived === true });
            }
            if (type === 'PUBLISH' && kind === 'event' && cleanDates.length === 0) return NextResponse.json({ error: 'Un événement simple doit avoir au moins une date' }, { status: 400 });
            if (kind === 'article' && type === 'PUBLISH' && (!article.slug?.current || typeof article.slug.current !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug.current) || !['actualites', 'environnement', 'navigation', 'evenements'].includes(article.category) || !validDate(article.publishedAt))) return NextResponse.json({ error: 'Renseignez l’URL, la catégorie et la date de publication de l’article' }, { status: 400 });
            if (article.linkedArticleId) {
                if (!validId(article.linkedArticleId) || publishedIdOf(article.linkedArticleId) === id) return NextResponse.json({ error: 'Article associé invalide' }, { status: 400 });
                const linked: any = await client.getDocument(publishedIdOf(article.linkedArticleId));
                if (!linked || linked._type !== 'article' || editorialKind(linked) !== 'article') return NextResponse.json({ error: 'Choisissez un article publié pour le lien' }, { status: 400 });
            }
            const pubId = id || `article-${crypto.randomUUID()}`;
            const { _id: _oldId, _rev, _createdAt, _updatedAt, ...base } = existing || {};
            const fields: Record<string, any> = { ...base, _type: existing?._type || 'article', title: article.title.trim(), contentType: kind, agendaDates: cleanDates, archived: existing?.archived === true };
            for (const key of ['agendaDate', 'agendaTime', 'agendaBadge', 'startDate', 'time', 'badge']) delete fields[key];
            if (existing?._type === 'agendaEvent') {
                delete fields.contentType;
                const excerpt = typeof article.excerpt === 'string' ? article.excerpt : plainText(existing.description);
                fields.description = excerpt === plainText(existing.description) ? existing.description : [{ _type: 'block', _key: crypto.randomUUID(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: crypto.randomUUID(), marks: [], text: excerpt }] }];
                if (article.coverImage) fields.image = article.coverImage;
                const first = cleanDates[0];
                if (first) { fields.startDate = first.date; fields.time = first.time; fields.badge = first.badge; }
            } else {
                for (const key of ['slug', 'category', 'publishedAt', 'excerpt', 'coverImage']) {
                    if (article[key] != null && article[key] !== '') fields[key] = article[key]; else delete fields[key];
                }
                fields.body = Array.isArray(article.body) ? article.body.map((block: any) => {
                    if (block?._type !== 'image') return block; const { url, ...saved } = block; return saved;
                }) : [];
            }
            if (article.linkedArticleId) fields.articleRef = { _type: 'reference', _ref: publishedIdOf(article.linkedArticleId) }; else delete fields.articleRef;
            if (type === 'SAVE_DRAFT') {
                await client.createOrReplace({ ...fields, _id: draftIdOf(pubId) } as any);
            } else {
                await client.transaction().createOrReplace({ ...fields, _id: pubId } as any).delete(draftIdOf(pubId)).commit();
                revalidateEditorial(fields.slug?.current); if ((published as any)?.slug?.current !== fields.slug?.current) revalidateEditorial((published as any)?.slug?.current);
            }
            return NextResponse.json({ success: true, id: pubId });
        }
        if (!id) return NextResponse.json({ error: 'Identifiant manquant' }, { status: 400 });
        if (type === 'ARCHIVE' || type === 'RESTORE') {
            let transaction = client.transaction();
            for (const doc of [draft, published]) if (doc) transaction = transaction.patch(doc._id, { set: { archived: type === 'ARCHIVE' } });
            await transaction.commit(); revalidateEditorial((published as any)?.slug?.current);
            return NextResponse.json({ success: true });
        }
        if (type === 'DISCARD_DRAFT') {
            await client.delete(draftIdOf(id)); return NextResponse.json({ success: true });
        }
        if (type === 'UNPUBLISH') {
            if (published) await client.transaction().createIfNotExists({ ...(draft || published), _id: draftIdOf(id) } as any).delete(id).commit();
            revalidateEditorial((published as any)?.slug?.current); return NextResponse.json({ success: true });
        }
        if (type === 'DELETE') {
            await client.transaction().delete(id).delete(draftIdOf(id)).commit();
            revalidateEditorial((published as any)?.slug?.current); return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
    } catch (error) {
        console.error('Editorial POST error', error);
        return NextResponse.json({ error: 'Impossible d’enregistrer ce contenu' }, { status: 500 });
    }
}
