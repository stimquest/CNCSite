export type EditorialKind = 'article' | 'event';
export interface EditorialDate {
    _key: string;
    date: string;
    time?: string;
    badge?: string;
    archived?: boolean;
}

export function parisToday(now = new Date()): string {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const part = (type: string) => parts.find(value => value.type === type)?.value || '';
    return `${part('year')}-${part('month')}-${part('day')}`;
}

export function editorialKind(doc: { _type?: string; contentType?: string }): EditorialKind {
    return doc._type === 'agendaEvent' || doc.contentType === 'event' ? 'event' : 'article';
}

export function editorialDates(doc: { agendaDates?: EditorialDate[]; agendaDate?: string; agendaTime?: string; agendaBadge?: string; startDate?: string; time?: string; badge?: string }): EditorialDate[] {
    if (Array.isArray(doc.agendaDates)) return doc.agendaDates;
    const date = doc.agendaDate || doc.startDate;
    return date ? [{ _key: 'legacy-date', date, time: doc.agendaTime || doc.time || '', badge: doc.agendaBadge || doc.badge || '' }] : [];
}

export function plainText(value: unknown): string {
    if (typeof value === 'string') return value;
    if (!Array.isArray(value)) return '';
    return value.map(block => (block?.children || []).map((child: { text?: string }) => child.text || '').join('')).filter(Boolean).join('\n');
}

export function normalizeEditorialDocument(doc: Record<string, any>) {
    return {
        ...doc,
        contentType: editorialKind(doc),
        archived: doc.archived === true,
        agendaDates: editorialDates(doc),
        excerpt: doc._type === 'agendaEvent' ? plainText(doc.description) : doc.excerpt || '',
        coverImage: doc._type === 'agendaEvent' ? doc.image : doc.coverImage,
        coverImageUrl: doc.coverImageUrl || doc.imageUrl,
        linkedArticleId: doc.articleRef?._ref || '',
    };
}

export interface AgendaSource {
    _id?: string;
    _type?: string;
    contentType?: string;
    title?: string;
    archived?: boolean;
    agendaDates?: EditorialDate[];
    startDate?: string;
    time?: string;
    badge?: string;
    description?: string | any[];
    image?: string;
    articleSlug?: string;
    agendaDate?: string;
    agendaTime?: string;
    agendaBadge?: string;
}

export function expandAgendaEvents(docs: AgendaSource[], today = parisToday()) {
    return docs.filter(doc => !doc.archived).flatMap(doc =>
        editorialDates(doc).filter(date => !date.archived && /^\d{4}-\d{2}-\d{2}$/.test(date.date) && date.date >= today).map(date => ({
            _key: `${doc._id || 'event'}-${date._key}`,
            title: doc.title,
            startDate: date.date,
            time: date.time || '',
            badge: date.badge || '',
            description: doc.description,
            image: doc.image,
            articleSlug: doc.articleSlug,
        }))
    ).sort((a, b) => a.startDate.localeCompare(b.startDate) || a.time.localeCompare(b.time));
}
