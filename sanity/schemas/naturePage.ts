import { defineType, defineField } from 'sanity';

export const naturePage = defineType({
    name: 'naturePage',
    title: 'Contenu Page Nature',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                { name: 'description', type: 'text', title: 'Description' },
                { name: 'heroImage', type: 'image', title: 'Image de fond (Hero)' },
            ],
        }),
        defineField({
            name: 'estran',
            title: 'Section L\'Estran (Marées)',
            type: 'object',
            fields: [
                { name: 'tag', type: 'string', title: 'Tag (ex: Phénomène Naturel)' },
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'description', type: 'text', title: 'Description' },
                {
                    name: 'marnageValue',
                    type: 'string',
                    title: 'Valeur Marnage (ex: 13m)'
                },
                {
                    name: 'marnageLabel',
                    type: 'string',
                    title: 'Libellé Marnage'
                },
                {
                    name: 'cards',
                    title: 'Cartes d\'information',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                { name: 'title', type: 'string', title: 'Titre' },
                                { name: 'description', type: 'text', title: 'Description' },
                                { name: 'iconName', type: 'string', title: 'Nom Icône (Lucide)' },
                                { name: 'color', type: 'string', title: 'Couleur (ex: text-abysse, text-orange-600)' },
                            ]
                        }
                    ]
                }
            ]
        }),
        defineField({
            name: 'habitants',
            title: 'Section Habitants (Biodiversité)',
            type: 'object',
            fields: [
                { name: 'tag', type: 'string', title: 'Tag' },
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'subtitle', type: 'text', title: 'Sous-titre' },
                {
                    name: 'note',
                    type: 'string',
                    title: 'Note pour les éditeurs',
                    readOnly: true,
                    initialValue: '⚠️ La liste des espèces est maintenant gérée dans le menu "Inventaire Nature" à gauche.'
                }
            ]
        }),
        defineField({
            name: 'peche',
            title: 'Section Pêche à Pied',
            type: 'object',
            fields: [
                { name: 'tag', type: 'string', title: 'Tag' },
                { name: 'title', type: 'string', title: 'Titre' },
                {
                    name: 'sizes',
                    title: 'Tailles Minimales',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                { name: 'label', type: 'string', title: 'Espèce' },
                                { name: 'value', type: 'string', title: 'Taille' },
                            ]
                        }
                    ]
                },
                {
                    name: 'toolsDescription',
                    title: 'Description Outils',
                    type: 'text'
                },
                {
                    name: 'securityTitle',
                    title: 'Titre Sécurité',
                    type: 'string'
                },
                {
                    name: 'securityDescription',
                    title: 'Description Sécurité',
                    type: 'text'
                },
                {
                    name: 'securityTip',
                    title: 'Conseil Sécurité',
                    type: 'string'
                }
            ]
        }),
        defineField({
            name: 'observations',
            title: 'Points d\'Observation (Carte)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'id', type: 'string', title: 'ID (unique, sans espaces)' },
                        { name: 'title', type: 'string', title: 'Titre' },
                        {
                            name: 'type',
                            type: 'string',
                            title: 'Type (Faune, Patrimoine, Flore)'
                        },
                        { name: 'description', type: 'text', title: 'Description' },
                        { name: 'tip', type: 'text', title: 'Conseil' },
                        {
                            name: 'coordinates',
                            title: 'Coordonnées (GPS)',
                            type: 'object',
                            fields: [
                                { name: 'lat', type: 'number', title: 'Latitude' },
                                { name: 'lng', type: 'number', title: 'Longitude' },
                            ]
                        },
                        {
                            name: 'images',
                            title: 'Images',
                            type: 'array',
                            of: [{ type: 'image' }]
                        }
                    ]
                }
            ]
        }),
        defineField({
            name: 'exploration',
            title: 'Section Exploration (Footer)',
            type: 'object',
            fields: [
                defineField({ name: 'tag', type: 'string', title: 'Tag' }),
                defineField({ name: 'title', type: 'string', title: 'Titre' }),
                defineField({ name: 'description', type: 'text', title: 'Description' }),
                defineField({
                    name: 'cards',
                    title: 'Cartes d\'exploration',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            name: 'explorationCard',
                            title: 'Carte Exploration',
                            fields: [
                                defineField({ name: 'title', type: 'string', title: 'Titre' }),
                                defineField({ name: 'subtitle', type: 'string', title: 'Sous-titre' }),
                                defineField({ name: 'description', type: 'text', title: 'Description' }),
                                defineField({
                                    name: 'cardImage',
                                    type: 'image',
                                    title: 'Photo (Upload)',
                                    options: { hotspot: true },
                                    readOnly: false // Explicitly allow editing
                                }),
                                defineField({
                                    name: 'features',
                                    type: 'array',
                                    title: 'Caractéristiques',
                                    of: [{ type: 'string' }]
                                }),
                                defineField({ name: 'buttonText', type: 'string', title: 'Texte bouton' }),
                                defineField({ name: 'buttonLink', type: 'string', title: 'Lien bouton' }),
                            ]
                        }
                    ],
                    validation: Rule => Rule.max(3),
                })
            ]
        })
    ],
});
