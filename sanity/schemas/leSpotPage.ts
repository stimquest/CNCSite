import { defineType, defineField } from 'sanity';

export const leSpotPage = defineType({
    name: 'leSpotPage',
    title: 'Contenu Page Le Spot',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                { name: 'heroImage', type: 'image', title: 'Image de fond (Hero)' },
            ],
        }),
    ],
});
