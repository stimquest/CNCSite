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
            validation: (Rule) => Rule.required(),
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
