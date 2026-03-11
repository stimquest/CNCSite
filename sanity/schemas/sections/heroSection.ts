import { defineType, defineField } from 'sanity';
import { LayoutTemplate } from 'lucide-react';

export const heroSection = defineType({
    name: 'heroSection',
    title: 'Section Hero (En-tête)',
    type: 'object',
    icon: LayoutTemplate,
    fields: [
        defineField({ name: 'tagText', type: 'string', title: 'Petit texte en haut (Tag)' }),
        defineField({ name: 'title', type: 'string', title: 'Titre Principal' }),
        defineField({ name: 'subtitle', type: 'string', title: 'Sous-titre (Couleur/Gras)' }),
        defineField({ name: 'heroImage', type: 'image', title: 'Image de fond', options: { hotspot: true } }),
        defineField({
            name: 'colorTheme',
            title: 'Thème Couleur',
            type: 'string',
            description: 'Couleur d\'accentuation pour cette section',
            options: {
                list: [
                    { title: 'Bleu Turquoise (Défaut)', value: 'turquoise' },
                    { title: 'Sable (Scolaires)', value: 'sable' },
                    { title: 'Corail (Evénements)', value: 'corail' },
                ],
                layout: 'radio',
            },
            initialValue: 'turquoise'
        }),
        
        defineField({
            name: 'stats',
            title: 'Statistique Principale (ex: Capacité)',
            type: 'object',
            fields: [
                { name: 'label', type: 'string', title: 'Label (ex: Capacité)' },
                { name: 'value', type: 'string', title: 'Valeur (ex: 120)' },
                { name: 'unit', type: 'string', title: 'Unité (ex: pers.)' },
                { name: 'subtext', type: 'string', title: 'Texte descriptif court' }
            ]
        }),
        defineField({
            name: 'servicesText',
            title: 'Bloc Services Rapides',
            type: 'object',
            fields: [
                { name: 'label', type: 'string', title: 'Label (ex: Services)' },
                { name: 'mainText', type: 'string', title: 'Texte Principal (ex: Full-Tech)' },
                { name: 'subtext', type: 'string', title: 'Texte secondaire' }
            ]
        })
    ],
    preview: {
        select: { title: 'title', subtitle: 'subtitle', media: 'heroImage' },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Hero Section',
                subtitle: subtitle,
                media
            }
        }
    }
});
