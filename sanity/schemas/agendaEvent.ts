import { defineType, defineField } from 'sanity';

const basicRichText = {
    type: 'array',
    of: [
        {
            type: 'block',
            styles: [{ title: 'Normal', value: 'normal' }],
            lists: [{ title: 'Puces', value: 'bullet' }],
            marks: {
                decorators: [
                    { title: 'Gras', value: 'strong' },
                    { title: 'Italique', value: 'em' },
                ],
                annotations: [
                    {
                        name: 'link', type: 'object', title: 'Lien',
                        fields: [{ name: 'href', type: 'url', title: 'URL' }],
                    },
                ],
            },
        },
    ],
};

export const agendaEvent = defineType({
    name: 'agendaEvent',
    title: 'Agenda',
    type: 'document',
    fields: [
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
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'startDate',
            title: 'Date',
            type: 'date',
            options: { dateFormat: 'YYYY-MM-DD' },
            hidden: ({ document }) => Array.isArray(document?.agendaDates),
            validation: (Rule) => Rule.custom((value, context) => Array.isArray(context.document?.agendaDates) || value ? true : 'Date obligatoire'),
        }),
        defineField({
            name: 'badge',
            title: 'Badge / Catégorie',
            type: 'string',
            description: 'Ex: Régate, Événement, AG, Soirée…',
        }),
        defineField({
            name: 'time',
            title: 'Heure / Durée',
            type: 'string',
            description: 'Ex: 14h - 17h, Toute la journée…',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            ...basicRichText,
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'articleRef',
            title: 'Article de blog associé (optionnel)',
            type: 'reference',
            to: [{ type: 'article' }],
            description: 'Si renseigné, la carte affichera un lien "Lire l\'article".',
        }),
    ],
    orderings: [
        {
            title: 'Date (prochains)',
            name: 'startDateAsc',
            by: [{ field: 'startDate', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            date: 'startDate',
            badge: 'badge',
            media: 'image',
        },
        prepare({ title, date, badge, media }) {
            const formatted = date
                ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';
            return {
                title,
                subtitle: [badge, formatted].filter(Boolean).join(' · '),
                media,
            };
        },
    },
});
