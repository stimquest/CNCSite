import { defineType, defineField } from 'sanity';

export const article = defineType({
    name: 'article',
    title: 'Articles & Blog',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            description: 'Généré automatiquement depuis le titre. Ex: /blog/salon-de-loccaz',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Actualités du Club', value: 'actualites' },
                    { title: 'Environnement & Nature', value: 'environnement' },
                    { title: 'Navigation & Technique', value: 'navigation' },
                    { title: 'Événements & Sorties', value: 'evenements' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date de publication',
            type: 'date',
            options: { dateFormat: 'YYYY-MM-DD' },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'coverImage',
            title: 'Image de couverture',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'excerpt',
            title: 'Résumé court',
            type: 'text',
            rows: 2,
            description: 'Affiché sur la carte dans le blog et dans l\'agenda. 1-2 phrases.',
            validation: (Rule) => Rule.max(200),
        }),
        // ── Agenda optionnel ──────────────────────────────────────────
        defineField({
            name: 'agendaDate',
            title: 'Date de l\'événement (optionnel)',
            type: 'date',
            options: { dateFormat: 'YYYY-MM-DD' },
            description: 'Si renseigné, cet article apparaît aussi dans l\'agenda.',
        }),
        defineField({
            name: 'agendaTime',
            title: 'Heure / Durée (optionnel)',
            type: 'string',
            description: 'Ex: 9h - 12h, Toute la journée…',
            hidden: ({ document }) => !document?.agendaDate,
        }),
        defineField({
            name: 'agendaBadge',
            title: 'Badge agenda (optionnel)',
            type: 'string',
            description: 'Ex: Régate, Événement, AG…',
            hidden: ({ document }) => !document?.agendaDate,
        }),
        // ─────────────────────────────────────────────────────────────
        defineField({
            name: 'body',
            title: 'Contenu de l\'article',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'Titre H2', value: 'h2' },
                        { title: 'Titre H3', value: 'h3' },
                        { title: 'Citation', value: 'blockquote' },
                    ],
                    lists: [
                        { title: 'Puces', value: 'bullet' },
                        { title: 'Numérotée', value: 'number' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Gras', value: 'strong' },
                            { title: 'Italique', value: 'em' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Lien',
                                fields: [
                                    { name: 'href', type: 'url', title: 'URL' },
                                    {
                                        name: 'blank',
                                        type: 'boolean',
                                        title: 'Ouvrir dans un nouvel onglet',
                                        initialValue: true,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'image',
                    title: 'Image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Légende',
                        },
                    ],
                },
            ],
        }),
    ],
    orderings: [
        {
            title: 'Date de publication (récent)',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
            media: 'coverImage',
            date: 'publishedAt',
        },
        prepare({ title, subtitle, media, date }) {
            const categories: Record<string, string> = {
                actualites: 'Actualités',
                environnement: 'Environnement',
                navigation: 'Navigation',
                evenements: 'Événements',
            };
            return {
                title,
                subtitle: `${categories[subtitle] ?? subtitle} — ${date ?? ''}`,
                media,
            };
        },
    },
});
