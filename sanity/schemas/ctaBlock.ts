import { defineType, defineField } from 'sanity';

export const ctaBlock = defineType({
    name: 'ctaBlock',
    type: 'object',
    title: 'Bouton d\'Action (CTA)',
    fields: [
        defineField({
            name: 'text',
            type: 'string',
            title: 'Texte du bouton',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'url',
            type: 'url',
            title: 'Lien (URL)',
            validation: (Rule) => Rule.uri({ allowRelative: true }).required(),
        }),
        defineField({
            name: 'style',
            type: 'string',
            title: 'Style',
            options: {
                list: [
                    { title: 'Primaire (Abysse)', value: 'primary' },
                    { title: 'Secondaire (Turquoise)', value: 'secondary' },
                    { title: 'Contour (Outline)', value: 'outline' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'alignment',
            type: 'string',
            title: 'Alignement',
            options: {
                list: [
                    { title: 'Gauche', value: 'left' },
                    { title: 'Centre', value: 'center' },
                    { title: 'Droite', value: 'right' },
                ],
                layout: 'radio',
            },
        }),
    ],
    preview: {
        select: {
            title: 'text',
        },
        prepare(selection) {
            return {
                title: selection.title ? `Bouton: ${selection.title}` : 'Bouton sans texte',
            };
        },
    },
});
