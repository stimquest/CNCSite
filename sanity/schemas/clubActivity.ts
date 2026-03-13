import { defineType, defineField } from 'sanity';
import { SANITY_ICON_OPTIONS } from '../../constants/iconRegistry';

export const clubActivity = defineType({
    name: 'clubActivity',
    title: 'Activité (Club à l\'année)',
    type: 'document',
    fields: [
        defineField({ name: 'title', type: 'string', title: 'Titre' }),
        defineField({ name: 'category', type: 'string', title: 'Catégorie' }),
        defineField({ name: 'badge', type: 'string', title: 'Badge (ex: Catamaran)' }),
        defineField({ name: 'age', type: 'string', title: 'Âge' }),
        defineField({ name: 'price', type: 'string', title: 'Prix' }),
        defineField({ name: 'schedule', type: 'string', title: 'Horaire' }),
        defineField({ name: 'description', type: 'text', title: 'Description', rows: 2 }),
        defineField({
            name: 'icon', 
            type: 'string', 
            title: 'Illustration SVG',
            options: {
                list: SANITY_ICON_OPTIONS
            }
        }),
        defineField({ 
            name: 'colorClass', 
            type: 'string', 
            title: 'Thème de Couleur',
            options: {
                list: [
                    { title: 'Brise Matinale (Ciel Clair)', value: 'bg-sky-300' },
                    { title: 'Grand Large (Ciel Profond)', value: 'bg-sky-600' },
                    { title: 'Lagon CNC (Turquoise)', value: 'bg-turquoise' },
                    { title: 'Abysse CNC (Bleu Marine)', value: 'bg-abysse' },
                    { title: 'Sable Doux (Champagne)', value: 'bg-sand-200' },
                    { title: 'Dune de Sable (Doré)', value: 'bg-sand-400' },
                    { title: 'Soleil Couchant (Ambre)', value: 'bg-amber-500' },
                    { title: 'Cristal (Eau Marais)', value: 'bg-teal-500' },
                    { title: 'Horizon (Indigo)', value: 'bg-indigo-500' },
                    { title: 'Rouge Phare (Lighthouse)', value: 'bg-red-600' },
                ]
            }
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'category' }
    }
});
