import { defineType, defineField } from 'sanity';
import { Columns } from 'lucide-react';
import { IconPicker } from '../../components/IconPicker';

export const twoColumnsFeature = defineType({
    name: 'twoColumnsFeature',
    title: 'Mise en avant (2 Colonnes - Ex: Séminaires)',
    type: 'object',
    icon: Columns,
    fields: [
        defineField({ name: 'tag', type: 'string', title: 'Tagline (Petit texte)' }),
        defineField({ name: 'titlePart1', type: 'string', title: 'Titre - Partie 1' }),
        defineField({ name: 'titlePart2', type: 'string', title: 'Titre - Partie 2 (Couleur)' }),
        defineField({ name: 'description', type: 'text', title: 'Description longue', rows: 4 }),
        
        defineField({
            name: 'features',
            title: 'Mini caractéristiques (Icône + Texte)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'iconName', 
                            type: 'string', 
                            title: 'Icône',
                            components: {
                                input: IconPicker
                            }
                        },
                        { name: 'text', type: 'string', title: 'Texte' }
                    ]
                }
            ]
        }),
        
        defineField({
            name: 'buttonText',
            title: 'Texte Bouton Action',
            type: 'string'
        }),
        defineField({
            name: 'buttonLink',
            title: 'Lien Bouton Action',
            type: 'string',
        }),
        
        defineField({ name: 'mainImage', type: 'image', title: 'Image Principale Grande', options: { hotspot: true } }),
        
        defineField({
            name: 'sideCard',
            title: 'Carte latérale (Ex: Teambuilding)',
            type: 'object',
            fields: [
                { name: 'image', type: 'image', title: 'Image de fond', options: { hotspot: true } },
                { name: 'title', type: 'string', title: 'Titre de la carte' },
                { name: 'description', type: 'text', title: 'Description', rows: 3 },
                { name: 'bottomText', type: 'string', title: 'Texte en bas (ex: 6 à 80 participants)' }
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
        select: { title: 'titlePart1', subtitle: 'titlePart2' },
        prepare({ title, subtitle }) {
            return {
                title: title ? `${title} ${subtitle || ''}` : 'Mise en avant (2 Cols)',
                subtitle: 'Bloc Séminaires',
                media: Columns
            }
        }
    }
});
