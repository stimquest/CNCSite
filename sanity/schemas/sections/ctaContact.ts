import { defineType, defineField } from 'sanity';
import { MessageSquare } from 'lucide-react';

export const ctaContact = defineType({
    name: 'ctaContact',
    title: 'Appel à l\'Action (Contact / Fin de page)',
    type: 'object',
    icon: MessageSquare,
    fields: [
        defineField({ name: 'tag', type: 'string', title: 'Tag' }),
        defineField({ name: 'titlePart1', type: 'string', title: 'Titre - Ligne 1' }),
        defineField({ name: 'titlePart2', type: 'string', title: 'Titre - Ligne 2 (Couleur)' }),
        defineField({ name: 'bgImage', type: 'image', title: 'Image de Fond', options: { hotspot: true } }),
        
        defineField({
            name: 'primaryButton',
            title: 'Bouton Principal',
            type: 'object',
            fields: [
                { name: 'text', type: 'string', title: 'Texte' },
                { name: 'link', type: 'string', title: 'Lien' }
            ]
        }),
        defineField({
            name: 'secondaryButton',
            title: 'Bouton Secondaire (Ex: Téléphone)',
            type: 'object',
            fields: [
                { name: 'text', type: 'string', title: 'Texte' },
                { name: 'link', type: 'string', title: 'Lien' },
                { name: 'iconName', type: 'string', title: 'Icon (phone_in_talk)' }
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
                title: title || 'Appel à l\'action',
                subtitle: 'Section Contact',
                media: MessageSquare
            }
        }
    }
});
