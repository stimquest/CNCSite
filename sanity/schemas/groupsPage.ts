import { defineType, defineField } from 'sanity';

export const groupsPage = defineType({
    name: 'groupsPage',
    title: 'Contenu Page Groupes',
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
            name: 'capacity',
            title: 'Capacité Max (Pers)',
            type: 'number'
        }),
        defineField({
            name: 'seminars',
            title: 'Offre Entreprises',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'description', type: 'text', title: 'Description' },
                { name: 'features', type: 'array', of: [{ type: 'string' }] }
            ]
        }),
        defineField({
            name: 'privateEvents',
            title: 'Offre Privée',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'description', type: 'text', title: 'Description' },
                { name: 'features', type: 'array', of: [{ type: 'string' }] }
            ]
        })
    ],
});
