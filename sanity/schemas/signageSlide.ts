import { defineField, defineType } from 'sanity';
import { Monitor, Image as ImageIcon, Info, Users } from 'lucide-react';

export const signageSlide = defineType({
    name: 'signageSlide',
    title: 'Digital Signage - Diapositives',
    type: 'document',
    icon: Monitor,
    fields: [
        defineField({
            name: 'title',
            title: 'Titre de la diapo (Interne)',
            type: 'string',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Type de contenu',
            type: 'string',
            options: {
                list: [
                    { title: 'Promotion / Activité', value: 'promo' },
                    { title: 'Partenaires', value: 'partners' },
                    { title: 'Information / Message', value: 'info' },
                ],
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'duration',
            title: 'Durée d\'affichage (ms)',
            type: 'number',
            description: '15000 = 15 secondes',
            initialValue: 15000,
        }),
        defineField({
            name: 'order',
            title: 'Ordre de passage',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'isActive',
            title: 'Activée',
            type: 'boolean',
            initialValue: true,
        }),

        // PROMO FIELDS
        defineField({
            name: 'promoContent',
            title: 'Contenu Promotion',
            type: 'object',
            hidden: ({ document }) => document?.type !== 'promo',
            fields: [
                defineField({ name: 'tag', title: 'Tag (ex: Offre Flash)', type: 'string' }),
                defineField({ name: 'title', title: 'Titre Principal', type: 'string' }),
                defineField({ name: 'description', title: 'Description / Message', type: 'text', rows: 3 }),
                defineField({ name: 'image', title: 'Image de fond', type: 'image', options: { hotspot: true } }),
                defineField({ name: 'showQrCode', title: 'Afficher QR Code', type: 'boolean', initialValue: true }),
            ],
        }),

        // PARTNERS FIELDS
        defineField({
            name: 'partnersContent',
            title: 'Contenu Partenaires',
            type: 'object',
            hidden: ({ document }) => document?.type !== 'partners',
            fields: [
                defineField({ name: 'title', title: 'Titre Section', type: 'string', initialValue: 'Nos Partenaires Officiels' }),
                defineField({
                    name: 'list',
                    title: 'Liste des partenaires',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                { name: 'name', type: 'string', title: 'Nom' },
                                { name: 'logo', type: 'image', title: 'Logo' },
                            ],
                            preview: {
                                select: { title: 'name', media: 'logo' },
                            },
                        },
                    ],
                }),
            ],
        }),

        // INFO FIELDS
        defineField({
            name: 'infoContent',
            title: 'Contenu Information',
            type: 'object',
            hidden: ({ document }) => document?.type !== 'info',
            fields: [
                defineField({ name: 'title', title: 'Titre Information', type: 'string' }),
                defineField({ name: 'message', title: 'Message', type: 'text', rows: 4 }),
                defineField({
                    name: 'category',
                    title: 'Catégorie / Style',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Alerte (Rouge)', value: 'alert' },
                            { title: 'Info (Bleu)', value: 'info' },
                            { title: 'Event (Turquoise)', value: 'event' },
                            { title: 'Vibe (Violet)', value: 'vibe' },
                        ]
                    }
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            type: 'type',
            active: 'isActive'
        },
        prepare({ title, type, active }: any) {
            const types: Record<string, string> = {
                promo: 'Promotion',
                partners: 'Partenaires',
                info: 'Information'
            }
            return {
                title: title || 'Sans titre',
                subtitle: `${types[type] || type} | ${active ? 'Activé' : 'Désactivé'}`,
            }
        }
    }
});
