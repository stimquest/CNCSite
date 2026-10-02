import { defineType, defineField, defineArrayMember } from 'sanity';

export const article = defineType({
    name: 'article',
    title: 'Articles & Blog',
    type: 'document',
    fields: [
        defineField({ name: 'contentType', title: 'Type de contenu', type: 'string', initialValue: 'article', options: { list: [{ title: 'Article de blog', value: 'article' }, { title: 'Événement simple', value: 'event' }], layout: 'radio' } }),
        defineField({ name: 'archived', title: 'Archivé', type: 'boolean', initialValue: false, description: 'Conservé dans les archives, masqué des listes publiques.' }),
        defineField({
            name: 'agendaDates', title: 'Dates dans l’agenda', type: 'array',
            of: [{ type: 'object', name: 'agendaOccurrence', title: 'Date', fields: [
                { name: 'date', title: 'Date', type: 'date', validation: (Rule) => Rule.required() },
                { name: 'time', title: 'Horaire / durée', type: 'string' },
                { name: 'badge', title: 'Badge', type: 'string' },
                { name: 'archived', title: 'Date archivée', type: 'boolean', initialValue: false },
            ], preview: { select: { title: 'date', subtitle: 'time' } } }],
        }),
        defineField({ name: 'articleRef', title: 'Article associé à cet événement', type: 'reference', to: [{ type: 'article' }], hidden: ({ document }) => document?.contentType !== 'event' }),

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
            hidden: ({ document }) => document?.contentType === 'event',
            validation: (Rule) => Rule.custom((value, context) => context.document?.contentType === 'event' || value ? true : 'Champ obligatoire pour un article'),
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
            hidden: ({ document }) => document?.contentType === 'event',
            validation: (Rule) => Rule.custom((value, context) => context.document?.contentType === 'event' || value ? true : 'Champ obligatoire pour un article'),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date de publication',
            type: 'date',
            options: { dateFormat: 'YYYY-MM-DD' },
            hidden: ({ document }) => document?.contentType === 'event',
            validation: (Rule) => Rule.custom((value, context) => context.document?.contentType === 'event' || value ? true : 'Champ obligatoire pour un article'),
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
            validation: (Rule) => Rule.custom((value, context) => !value || value.length <= (context.document?.contentType === 'event' ? 2000 : 200) ? true : 'Description trop longue'),
        }),
        // ── Agenda optionnel ──────────────────────────────────────────
        defineField({
            name: 'agendaDate',
            title: 'Date de l\'événement (optionnel)',
            type: 'date',
            options: { dateFormat: 'YYYY-MM-DD' },
            description: 'Ancienne date unique. Utilisez désormais Dates dans l’agenda.',
            hidden: ({ document }) => Array.isArray(document?.agendaDates),
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
            hidden: ({ document }) => document?.contentType === 'event',
            title: 'Contenu de l\'article',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'Normal (Centré)', value: 'normal_center' },
                        { title: 'Normal (Droite)', value: 'normal_right' },
                        { title: 'Normal (Justifié)', value: 'normal_justify' },
                        { title: 'Titre H2', value: 'h2' },
                        { title: 'Titre H2 (Centré)', value: 'h2_center' },
                        { title: 'Titre H3', value: 'h3' },
                        { title: 'Titre H3 (Centré)', value: 'h3_center' },
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
                }),
                defineArrayMember({
                    type: 'image',
                    title: 'Image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Légende',
                        },
                        {
                            name: 'layout',
                            type: 'string',
                            title: 'Mise en page',
                            options: {
                                list: [
                                    { title: 'Classique (centré)', value: 'center' },
                                    { title: 'Pleine largeur', value: 'full' },
                                    { title: 'Flottant à Gauche', value: 'left' },
                                    { title: 'Flottant à Droite', value: 'right' }
                                ],
                                layout: 'radio'
                            }
                        }
                    ],
                }),
                defineArrayMember({
                    type: 'ctaBlock',
                }),
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
