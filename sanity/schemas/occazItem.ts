import { defineType, defineField } from 'sanity';

export const occazItem = defineType({
    name: 'occazItem',
    title: 'Boutique - Occasions',
    type: 'document',
    icon: () => '🏷️',
    fields: [
        defineField({
            name: 'name',
            title: 'Nom de l\'article',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Prix',
            type: 'string',
            description: 'Ex: "2 800 €"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'condition',
            title: 'État',
            type: 'string',
            options: {
                list: [
                    { title: 'État neuf', value: 'État neuf' },
                    { title: 'Très bon état', value: 'Très bon état' },
                    { title: 'Bon état', value: 'Bon état' },
                    { title: 'À réviser', value: 'À réviser' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'year',
            title: 'Année',
            type: 'string',
            description: 'Ex: "2018"',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Photo de l\'article',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
});
