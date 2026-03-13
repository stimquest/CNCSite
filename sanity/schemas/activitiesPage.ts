import { defineType, defineField } from 'sanity';
import { SANITY_ICON_OPTIONS } from '../../constants/iconRegistry';
import { IconPicker } from '../components/IconPicker';

export const activitiesPage = defineType({
    name: 'activitiesPage',
    title: 'Contenu Page Activités',
    type: 'document',
    preview: {
        select: { title: 'hero.title', subtitle: 'hero.subtitle', media: 'hero.heroImage' },
        prepare(selection) {
            const { title, subtitle, media } = selection;
            return {
                title: title || 'Page Activités',
                subtitle: subtitle || 'Configuration générale',
                media: media
            };
        }
    },
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                { name: 'heroImage', type: 'image', title: 'Image de fond (Hero)', options: { hotspot: true } },
            ],
        }),
        defineField({
            name: 'yearlyClub',
            title: 'Club à l\'année',
            type: 'object',
            fields: [
                {
                    name: 'intro',
                    title: 'Introduction',
                    type: 'object',
                    fields: [
                        { name: 'tag', type: 'string', title: 'Tag (ex: Esprit Associatif)' },
                        { name: 'title', type: 'string', title: 'Titre' },
                        { name: 'descLine1', type: 'text', title: 'Description Ligne 1', rows: 2 },
                        { name: 'descLine2', type: 'text', title: 'Description Ligne 2 (Italique)', rows: 2 },
                    ]
                },
                {
                    name: 'poles',
                    title: 'Pôles (Sections)',
                    type: 'array',
                    of: [{ type: 'reference', to: [{ type: 'clubPole' }] }]
                },
                {
                    name: 'weatherInfo',
                    title: 'Info Météo (Repli)',
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Titre' },
                        { name: 'description', type: 'text', title: 'Description' },
                    ]
                },
                {
                    name: 'footer',
                    title: 'Pied de page (CTA)',
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Titre' },
                        { name: 'description', type: 'text', title: 'Description' },
                        { name: 'buttonText', type: 'string', title: 'Texte bouton' },
                        { name: 'buttonPhone', type: 'string', title: 'Numéro de téléphone' },
                        { name: 'bgImage', type: 'image', title: 'Image de fond', options: { hotspot: true } },
                    ]
                }
            ]
        })
    ],
});
