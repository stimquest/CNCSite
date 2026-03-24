import { defineType, defineField } from 'sanity';

export const charAVoilePage = defineType({
    name: 'charAVoilePage',
    title: 'Page Char à Voile',
    type: 'document',
    fields: [
        defineField({
            name: 'seo',
            title: 'SEO & Meta',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre de la page (Balise Title)' },
                { name: 'description', type: 'text', title: 'Meta Description', rows: 3 },
            ]
        }),
        defineField({
            name: 'hero',
            title: 'En-tête (Hero)',
            type: 'object',
            fields: [
                { name: 'tag', type: 'string', title: 'Badge (ex: 🏁 Char à Voile)' },
                { name: 'title', type: 'string', title: 'Titre Principal' },
                { name: 'description', type: 'text', title: 'Description courte', rows: 3 },
            ]
        }),
        defineField({
            name: 'media',
            title: 'Média Principal',
            type: 'object',
            fields: [
                { 
                    name: 'videoUrl', 
                    type: 'url', 
                    title: 'URL de la vidéo',
                    description: 'Lien d\'intégration YouTube (ex: https://www.youtube.com/embed/...)' 
                },
            ]
        }),
        defineField({
            name: 'practicalInfos',
            title: 'Informations Pratiques',
            type: 'object',
            fields: [
                { name: 'ageMin', type: 'string', title: 'Texte Âge minimum' },
                { name: 'equipment', type: 'string', title: 'Texte Équipement fourni' },
                { name: 'toBring', type: 'string', title: 'Texte À prévoir' },
            ]
        }),
        defineField({
            name: 'faq',
            title: 'F.A.Q',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string', title: 'Question' },
                        { name: 'answer', type: 'text', title: 'Réponse' }
                    ],
                    preview: {
                        select: { title: 'question', subtitle: 'answer' }
                    }
                }
            ]
        }),
        defineField({
            name: 'weatherNote',
            title: 'Note de Réassurance Météo',
            type: 'text',
            description: 'S\'affiche sous le calendrier',
            rows: 3
        })
    ],
    preview: {
        select: { title: 'hero.title' },
        prepare(selection) {
            return {
                title: selection.title || 'Page Char à Voile',
                subtitle: 'Configuration de la page et SEO'
            };
        }
    }
});
