import { defineType, defineField } from 'sanity';
import { Grid } from 'lucide-react';
import { IconPicker } from '../../components/IconPicker';

export const gridShowcase = defineType({
    name: 'gridShowcase',
    title: 'Grille (Ex: Événements Privés)',
    type: 'object',
    icon: Grid,
    fields: [
        defineField({ name: 'tag', type: 'string', title: 'Tag (Petit texte)' }),
        defineField({ name: 'titlePart1', type: 'string', title: 'Titre - Partie 1' }),
        defineField({ name: 'titlePart2', type: 'string', title: 'Titre - Partie 2 (Couleur)' }),
        
        defineField({
            name: 'cards',
            title: 'Cartes (Ex: EVG, Anniversaire, Famille)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string', title: 'Titre de la carte' },
                        { name: 'description', type: 'text', title: 'Description courte', rows: 3 },
                        { 
                            name: 'iconName', 
                            type: 'string', 
                            title: 'Icône',
                            components: {
                                input: IconPicker
                            }
                        },
                        {
                            name: 'colorTheme',
                            type: 'string',
                            title: 'Thème Couleur',
                            options: {
                                list: [
                                    { title: 'Orange', value: 'orange' },
                                    { title: 'Violet', value: 'purple' },
                                    { title: 'Turquoise', value: 'turquoise' }
                                ]
                            }
                        },
                        {
                            name: 'points',
                            title: 'Points Forts (Liste à puces)',
                            type: 'array',
                            of: [{ type: 'string' }]
                        },
                        { name: 'buttonText', type: 'string', title: 'Texte du Bouton' },
                        { name: 'buttonLink', type: 'string', title: 'Lien du Bouton' }
                    ]
                }
            ]
        }),
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
    ],
    preview: {
        select: { title: 'titlePart1' },
        prepare({ title }) {
            return {
                title: title || 'Grille (Événements)',
                media: Grid
            }
        }
    }
});
