import { defineType, defineField } from 'sanity';

export const merchItem = defineType({
    name: 'merchItem',
    title: 'Boutique - Articles',
    type: 'document',
    icon: () => '👕',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom du produit',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Prix',
            type: 'string',
            description: 'Ex: "45 €"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Vêtements', value: 'Vêtements' },
                    { title: 'Accessoires', value: 'Accessoires' },
                    { title: 'Équipement', value: 'Équipement' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'badge',
            title: 'Badge (Optionnel)',
            type: 'string',
            description: 'Ex: "Best Seller", "Nouveau"',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Photo du produit',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'hoverImage',
            title: 'Photo au survol (Optionnelle)',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
});
