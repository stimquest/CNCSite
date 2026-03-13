import { defineType, defineField } from 'sanity';
import { IconPicker } from '../components/IconPicker';

export const clubPole = defineType({
    name: 'clubPole',
    title: 'Pôle (Club à l\'année)',
    type: 'document',
    fields: [
        defineField({ name: 'title', type: 'string', title: 'Titre du Pôle' }),
        defineField({ 
            name: 'icon', 
            type: 'string', 
            title: 'Icône du Pôle (Style Lucide)',
            components: { input: IconPicker }
        }),
        defineField({
            name: 'order',
            type: 'number',
            title: 'Ordre d\'affichage',
            initialValue: 0
        }),
        defineField({
            name: 'activities',
            title: 'Activités',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'clubActivity' }] }]
        }),
    ],
    preview: { 
        select: { title: 'title', subtitle: 'icon' } 
    }
});
