import { defineType, defineField } from 'sanity';
import { Binoculars } from 'lucide-react';

export const natureEntity = defineType({
    name: 'natureEntity',
    title: 'Inventaire Nature (Espèces)',
    type: 'document',
    icon: Binoculars as any,
    fields: [
        defineField({
            name: 'name',
            title: 'Nom courant',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'scientificName',
            title: 'Nom scientifique',
            type: 'string',
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: 'Faune (Mammifère)', value: 'faune' },
                    { title: 'Oiseau', value: 'oiseau' },
                    { title: 'Flore', value: 'flore' },
                    { title: 'Invertébré / Marin', value: 'marin' },
                ],
                layout: 'radio'
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true }
        }),
        defineField({
            name: 'description',
            title: 'Description courte',
            type: 'text',
            rows: 3
        }),
        defineField({
            name: 'tags',
            title: 'Tags (ex: Espèce Protégée, Visible marée basse)',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'tagColor',
            title: 'Couleur du Tag Principal',
            type: 'string',
            options: {
                list: [
                    { title: 'Turquoise (Défaut)', value: 'text-turquoise' },
                    { title: 'Orange (Alerte)', value: 'text-orange-500' },
                    { title: 'Vert (Flore)', value: 'text-green-500' },
                    { title: 'Bleu (Marin)', value: 'text-blue-400' },
                ]
            }
        })
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'scientificName',
            media: 'image'
        }
    }
});
