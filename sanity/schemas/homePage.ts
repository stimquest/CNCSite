
import { defineField, defineType } from 'sanity';
import { Home, Image as ImageIcon, Briefcase, Users, Layout, GraduationCap } from 'lucide-react';
import { IconPicker } from '../components/IconPicker';

export default defineType({
    name: 'homePage',
    title: 'Contenu Page Accueil',
    type: 'document',
    icon: Home,
    groups: [
        { name: 'hero', title: 'Hero Section', icon: Layout },
        { name: 'spirit', title: 'Esprit Club (Expérience CVC)', icon: Users },
        { name: 'focus', title: 'Focus Activités', icon: Briefcase },
        { name: 'campus', title: 'Campus Nautique', icon: GraduationCap },
        { name: 'partners', title: 'Partenaires', icon: Users },
        { name: 'immersion', title: 'Club en Immersion', icon: ImageIcon },
    ],
    fields: [
        defineField({
            name: 'heroTitle',
            title: 'Titre Principal (Hero)',
            type: 'string',
            group: 'hero',
            initialValue: 'Club Nautique de Coutainville',
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Sous-titre (Hero)',
            type: 'string',
            group: 'hero',
            initialValue: 'Sauvetage et Secourisme',
            description: 'S\'affiche sous le titre principal (ex: Statut réglementaire)',
        }),
        defineField({
            name: 'heroImages',
            title: 'Images du Diaporama (Hero)',
            type: 'array',
            group: 'hero',
            of: [{ type: 'image', options: { hotspot: true } }],
            description: 'Images défilantes en fond d\'écran (ignorées si une vidéo YouTube est définie)',
        }),
        defineField({
            name: 'heroVideoUrl',
            title: 'Vidéo YouTube (Fond Hero)',
            type: 'url',
            group: 'hero',
            description: 'Collez l\'URL YouTube ici pour remplacer le diaporama par une vidéo en fond. Laissez vide pour garder les images.',
            validation: Rule => Rule.uri({ scheme: ['https'] }).custom((url) => {
                if (!url) return true;
                if (url.includes('youtube.com') || url.includes('youtu.be')) return true;
                return 'L\'URL doit être une vidéo YouTube valide';
            }),
        }),

        // SPIRIT SECTION (Esprit Club)
        defineField({
            name: 'spiritTitle',
            title: 'Titre Section Esprit',
            type: 'string',
            group: 'spirit',
            initialValue: "L'Esprit du Club",
        }),
        defineField({
            name: 'spiritMessage',
            title: 'Message Principal (Titre Artiste)',
            type: 'text',
            rows: 3,
            group: 'spirit',
            description: 'Ex: "Ressentez la force du vent..."',
        }),
        defineField({
            name: 'spiritDescription',
            title: 'Description Principale',
            type: 'text',
            rows: 2,
            group: 'spirit',
            description: 'Ex: "Entre dunes et grand large..."',
        }),
        defineField({
            name: 'spiritCards',
            title: 'Cartes Esprit (3 max)',
            type: 'array',
            group: 'spirit',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'tag', title: 'Tag (Petit titre)', type: 'string' }),
                        defineField({ name: 'title', title: 'Grand Titre (Verbe)', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                        defineField({ name: 'image', title: 'Image de fond', type: 'image', options: { hotspot: true } }),
                        defineField({ name: 'link', title: 'Lien du bouton', type: 'string' }),
                        defineField({ name: 'buttonText', title: 'Texte du bouton', type: 'string' }),
                        defineField({
                            name: 'iconName',
                            title: 'Icône (Lucide)',
                            type: 'string',
                            components: { input: IconPicker }
                        }),
                        defineField({
                            name: 'colorTheme',
                            title: 'Thème Couleur',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Turquoise (Nature/École)', value: 'turquoise' },
                                    { title: 'Orange (Sensation/Sport)', value: 'orange' },
                                    { title: 'Violet (Exploration/Balade)', value: 'purple' },
                                ]
                            }
                        }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'tag', media: 'image' },
                    },
                },
            ],
            validation: Rule => Rule.max(3).warning('Idéalement 3 cartes pour respecter le design.'),
        }),

        // SPOT SECTION
        defineField({
            name: 'spotImage',
            title: 'Image de Fond Tuile "Le Spot"',
            type: 'image',
            group: 'hero', // Adding to hero group for simplicity as it's top level, or create a 'spot' group
            options: { hotspot: true },
            description: 'Image de fond pour la tuile de droite sur la grille d\'accueil',
        }),

        defineField({
            name: 'focusCards',
            title: 'Cartes Activités Phares (Carrousel Horizontal)',
            type: 'array',
            group: 'focus',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'cardType',
                            title: 'Type de Carte',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Standard (Activité)', value: 'standard' },
                                    { title: 'Bannière / CTA Promo', value: 'cta' }
                                ]
                            },
                            initialValue: 'standard',
                        }),
                        defineField({
                            name: 'themeColor',
                            title: 'Thème Couleur Principal',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Orange (Sensation)', value: 'orange' },
                                    { title: 'Bleu (Nautisme)', value: 'blue' },
                                    { title: 'Turquoise / Océan', value: 'turquoise' },
                                    { title: 'Émeraude / Nature', value: 'emerald' },
                                    { title: 'Violet / Détente', value: 'purple' },
                                ]
                            },
                            initialValue: 'orange',
                        }),
                        defineField({ name: 'title', title: 'Titre Principal', type: 'string' }),
                        defineField({ name: 'highlightSuffix', title: 'Suffixe Coloré', type: 'string' }),
                        defineField({ name: 'tagline', title: 'Petit Titre (Tagline)', type: 'string' }),
                        defineField({ name: 'subTagline', title: 'Sous-Tagline', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                        defineField({ name: 'badgeValue', title: 'Valeur Badge (ex: 60+)', type: 'string', hidden: ({parent}) => parent?.cardType === 'cta' }),
                        defineField({ name: 'badgeLabel', title: 'Label Badge', type: 'string', hidden: ({parent}) => parent?.cardType === 'cta' }),
                        defineField({ name: 'images', title: 'Galerie Images (côté droit)', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
                        defineField({ name: 'ctaButton', title: 'Bouton Action', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
                        defineField({ name: 'infoButton', title: 'Bouton Secondaire', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'tagline',
                            media: 'images.0'
                        }
                    }
                }
            ],
            validation: Rule => Rule.max(6).warning('Attention, trop de cartes forceront l\'utilisateur à scroller beaucoup.'),
        }),

        // Campus Nautique (Institution)
        defineField({
            name: 'campus',
            title: 'Campus Nautique (Institution)',
            type: 'object',
            group: 'campus',
            fields: [
                defineField({ name: 'tagline', title: 'Petit Titre (Tagline)', type: 'string', initialValue: 'Campus Nautique' }),
                defineField({ name: 'titlePart1', title: 'Titre - Partie 1', type: 'string', initialValue: "Plus qu'un Club," }),
                defineField({ name: 'titlePart2', title: 'Titre - Partie 2 (Couleur)', type: 'string', initialValue: 'une Institution.' }),
                defineField({
                    name: 'chapters',
                    title: 'Chapitres',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'label', title: 'Label', type: 'string' }),
                                defineField({ name: 'title', title: 'Titre', type: 'string' }),
                                defineField({ name: 'titleSpan', title: 'Titre (Couleur)', type: 'string' }),
                                defineField({ name: 'proof', title: 'Preuve (Court)', type: 'string' }),
                                defineField({ name: 'desc', title: 'Description', type: 'text', rows: 3 }),
                                defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
                                defineField({ name: 'link', title: 'Lien', type: 'string' }),
                                defineField({ name: 'linkLabel', title: 'Texte du Lien', type: 'string' }),
                                defineField({
                                    name: 'themeColor',
                                    title: 'Couleur',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Turquoise', value: 'turquoise' },
                                            { title: 'Émeraude', value: 'emerald' },
                                            { title: 'Orange', value: 'orange' },
                                            { title: 'Bleu Marine', value: 'blue' }
                                        ]
                                    }
                                })
                            ],
                            preview: {
                                select: { title: 'title', subtitle: 'label', media: 'image' },
                            }
                        }
                    ]
                })
            ]
        }),

        // Partners
        defineField({
            name: 'partners',
            title: 'Partenaires',
            type: 'array',
            group: 'partners',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'name', title: 'Nom', type: 'string' }),
                        defineField({ name: 'logo', title: 'Logo', type: 'image' }),
                        defineField({ name: 'link', title: 'Lien', type: 'url' }),
                    ],
                    preview: {
                        select: { title: 'name', media: 'logo' },
                    },
                },
            ],
        }),
        
        // IMMERSION SECTION
        defineField({
            name: 'immersionTitlePart1',
            title: 'Titre Section Immersion - Partie 1',
            type: 'string',
            group: 'immersion',
            initialValue: 'Le Club',
        }),
        defineField({
            name: 'immersionTitlePart2',
            title: 'Titre Section Immersion - Partie 2 (Couleur)',
            type: 'string',
            group: 'immersion',
            initialValue: 'en Immersion.',
        }),
        defineField({
            name: 'immersionCards',
            title: 'Tuiles Immersion',
            type: 'array',
            group: 'immersion',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'titlePart1', title: 'Titre - Partie 1', type: 'string' }),
                        defineField({ name: 'titlePart2', title: 'Titre - Partie 2 (Couleur)', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
                        defineField({ name: 'image', title: 'Image de fond', type: 'image', options: { hotspot: true } }),
                        defineField({ name: 'link', title: 'Lien du bouton', type: 'string' }),
                        defineField({ name: 'buttonText', title: 'Texte du bouton', type: 'string' }),
                        defineField({
                            name: 'iconName',
                            title: 'Icône (Lucide)',
                            type: 'string',
                            components: { input: IconPicker }
                        }),
                        defineField({
                            name: 'iconColor',
                            title: 'Couleur de l\'icône/bouton (facultatif)',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Bleu', value: 'blue' },
                                    { title: 'Jaune', value: 'yellow' },
                                    { title: 'Turquoise', value: 'turquoise' },
                                    { title: 'Rouge', value: 'red' },
                                    { title: 'Violet', value: 'violet' },
                                    { title: 'Gris', value: 'gray' },
                                ]
                            }
                        }),
                    ],
                    preview: {
                        select: { title: 'titlePart1', subtitle: 'description', media: 'image' },
                    },
                }
            ],
            validation: Rule => Rule.max(4),
        }),
    ],
});
