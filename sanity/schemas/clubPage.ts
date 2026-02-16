import { defineType, defineField } from 'sanity';

export const clubPage = defineType({
    name: 'clubPage',
    title: 'Contenu Page Club',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                { name: 'description', type: 'text', title: 'Description' },
                { name: 'heroImage', type: 'image', title: 'Image de fond (Hero)' },
            ],
        }),
        defineField({
            name: 'values',
            title: 'Valeurs (Blocs)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    title: 'Valeur',
                    fields: [
                        { name: 'title', type: 'string', title: 'Titre' },
                        { name: 'description', type: 'text', title: 'Description' },
                        { name: 'iconName', type: 'string', title: 'Nom Icône (Lucide)' },
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'description' }
                    }
                }
            ]
        }),
        defineField({
            name: 'vision',
            title: 'Vision 2026',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Titre' },
                        { name: 'description', type: 'text', title: 'Description' },
                    ]
                }
            ]
        }),
        defineField({
            name: 'managerQuote',
            title: 'Citation Chef de Base',
            type: 'text'
        }),
        defineField({
            name: 'facilities',
            title: 'Installations (Checklist)',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'handicapLabel',
            title: 'Infos Handicap / Accessibilité',
            type: 'text'
        }),
        defineField({
            name: 'membershipPrices',
            title: 'Tarifs Adhésion',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Libellé' },
                        { name: 'price', type: 'string', title: 'Prix' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'licensePrices',
            title: 'Tarifs Licences',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Libellé' },
                        { name: 'price', type: 'string', title: 'Prix' }
                    ]
                }
            ]
        })
    ],
});
