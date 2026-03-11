import { defineType, defineField } from 'sanity';
import { Layers } from 'lucide-react';

export const groupsPage = defineType({
    name: 'groupsPage',
    title: 'Page Groupes & Séminaires',
    type: 'document',
    icon: Layers,
    fields: [
        defineField({
            name: 'title',
            title: 'Titre de la page (Interne)',
            type: 'string',
            initialValue: 'Page Groupes'
        }),
        defineField({
            name: 'pageBuilder',
            title: 'Constructeur de Page',
            type: 'array',
            of: [
                { type: 'heroSection' },
                { type: 'twoColumnsFeature' },
                { type: 'gridShowcase' },
                { type: 'ctaContact' }
            ]
        })
    ],
    preview: {
        select: { title: 'title' },
        prepare({ title }) {
            return {
                title: title || 'Page Groupes',
                subtitle: 'Page Builder',
                media: Layers
            }
        }
    }
});
