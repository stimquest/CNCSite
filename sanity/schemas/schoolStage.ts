import { defineType, defineField } from 'sanity';

export const schoolStage = defineType({
    name: 'schoolStage',
    title: 'Stages (École de Voile)',
    type: 'document',
    icon: () => '🎓',
    fields: [
        defineField({
            name: 'id',
            title: 'Identifiant Unique (Slug)',
            type: 'string',
            description: 'Utilisé pour le matching dans le code (ex: "mini-mousses", "moussaillons", "catamaran")',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Titre',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Sous-titre',
            type: 'string',
        }),
        defineField({
            name: 'age',
            title: 'Public / Age',
            type: 'string',
            description: 'Ex: "5-7 ans", "Dès 8 ans"',
        }),
        defineField({
            name: 'price',
            title: 'Prix affiché',
            type: 'string',
            description: 'Ex: "163 €", "Dès 183 €"',
        }),
        defineField({
            name: 'priceDetail',
            title: 'Détail Prix',
            type: 'string',
            description: 'Ex: "/semaine (tout inclus)"',
        }),
        defineField({
            name: 'description',
            title: 'Description Complète',
            type: 'text',
            rows: 6,
        }),
        defineField({
            name: 'pricingTiers',
            title: 'Grille Tarifs (Optionnel)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Libellé' },
                        { name: 'price', type: 'string', title: 'Prix' },
                    ]
                }
            ]
        }),
        defineField({
            name: 'gallery',
            title: 'Galerie Photos',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        // UI Helpers usually kept in code, but can be overridden here if needed
    ],
});
