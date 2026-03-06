import { defineType, defineField } from 'sanity';
import { IconPicker } from '../components/IconPicker';

export const clubPage = defineType({
    name: 'clubPage',
    title: 'Contenu Page Club',
    type: 'document',
    groups: [
        { name: 'hero', title: '🏠 Hero' },
        { name: 'identity', title: '🎯 Identité & Valeurs' },
        { name: 'storytelling', title: '📖 Storytelling' },
        { name: 'team', title: '👥 L\'Équipe' },
        { name: 'site', title: '🏗️ Le Site' },
        { name: 'fleet', title: '⛵ La Flotte' },
        { name: 'cta', title: '🚀 CTA Final' },
    ],
    fields: [
        // ═══════════════════════════════════════
        // HERO SECTION
        // ═══════════════════════════════════════
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            group: 'hero',
            fields: [
                { name: 'title', type: 'string', title: 'Titre (ligne 1)', description: 'Ex: "Bienvenue au"' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre (ligne 2, en dégradé)', description: 'Ex: "Club Nautique."' },
                { name: 'description', type: 'text', title: 'Description (section Identité)' },
                { name: 'heroImage', type: 'image', title: 'Image de fond (Hero)', options: { hotspot: true } },
            ],
        }),
        defineField({
            name: 'heroStats',
            title: 'Badges Statistiques (Hero)',
            type: 'array',
            group: 'hero',
            description: 'Les badges affichés dans le hero (ex: "Depuis 1978", "450 Adhérents")',
            of: [
                {
                    type: 'object',
                    title: 'Badge',
                    fields: [
                        { name: 'label', type: 'string', title: 'Label supérieur', description: 'Ex: "Depuis", "Communauté"' },
                        { name: 'value', type: 'string', title: 'Valeur principale', description: 'Ex: "1978", "450 Adhérents"' },
                        { name: 'sublabel', type: 'string', title: 'Sous-label', description: 'Ex: "Héritage marin", "Une grande famille"' },
                        defineField({
                            name: 'iconName',
                            type: 'string',
                            title: 'Icône (Lucide)',
                            description: 'Ex: "History", "Users"',
                            components: { input: IconPicker }
                        }),
                        { name: 'style', type: 'string', title: 'Style visuel', options: { list: [{ title: 'Carte blanche (solide)', value: 'solid' }, { title: 'Carte transparente (glass)', value: 'glass' }] } },
                    ],
                    preview: {
                        select: { title: 'value', subtitle: 'label' }
                    }
                }
            ]
        }),

        // ═══════════════════════════════════════
        // IDENTITÉ & VALEURS
        // ═══════════════════════════════════════
        defineField({
            name: 'identityTitle',
            title: 'Titre section Identité',
            type: 'string',
            group: 'identity',
            description: 'Ex: "Notre Projet : L\'Horizon pour Tous"',
        }),
        defineField({
            name: 'values',
            title: 'Valeurs (Blocs)',
            type: 'array',
            group: 'identity',
            of: [
                {
                    type: 'object',
                    title: 'Valeur',
                    fields: [
                        { name: 'title', type: 'string', title: 'Titre' },
                        { name: 'description', type: 'text', title: 'Description' },
                        defineField({
                            name: 'iconName',
                            type: 'string',
                            title: 'Icône (Lucide)',
                            description: 'Ex: GraduationCap, Accessibility, ShieldCheck',
                            components: { input: IconPicker }
                        }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'description' }
                    }
                }
            ]
        }),

        // ═══════════════════════════════════════
        // STORYTELLING (GSAP Chapters)
        // ═══════════════════════════════════════
        defineField({
            name: 'storytelling',
            title: 'Chapitres Storytelling',
            type: 'array',
            group: 'storytelling',
            description: 'Les 4 chapitres de la section immersive avec scroll GSAP',
            of: [
                {
                    type: 'object',
                    title: 'Chapitre',
                    fields: [
                        { name: 'chapterLabel', type: 'string', title: 'Label du chapitre', description: 'Ex: "Chapitre I"' },
                        { name: 'title', type: 'string', title: 'Titre principal', description: 'Ex: "L\'Appel du"' },
                        { name: 'highlightText', type: 'string', title: 'Texte en surbrillance (dégradé)', description: 'Ex: "Large."' },
                        { name: 'quote', type: 'text', title: 'Citation / Texte', description: 'Le texte en italique sous le titre' },
                        { name: 'image', type: 'image', title: 'Image de fond', options: { hotspot: true } },
                        { name: 'isFinalChapter', type: 'boolean', title: 'Chapitre final ?', description: 'Si oui, affiche un bouton CTA au lieu du format standard' },
                    ],
                    preview: {
                        select: { title: 'chapterLabel', subtitle: 'title' }
                    }
                }
            ]
        }),
        defineField({
            name: 'storytellingCta',
            title: 'Bouton CTA Storytelling (dernier chapitre)',
            type: 'object',
            group: 'storytelling',
            fields: [
                { name: 'label', type: 'string', title: 'Label du bouton', description: 'Ex: "Nous Rejoindre"' },
                { name: 'link', type: 'string', title: 'Lien', description: 'Ex: "/infos-pratiques"' },
            ]
        }),

        // ═══════════════════════════════════════
        // L'ÉQUIPE
        // ═══════════════════════════════════════
        defineField({
            name: 'team',
            title: 'Section Équipe',
            type: 'object',
            group: 'team',
            fields: [
                { name: 'tag', type: 'string', title: 'Tag supérieur', description: 'Ex: "L\'Humain avant tout"' },
                { name: 'title', type: 'string', title: 'Titre', description: 'Ex: "Une Équipe D\'Experts"' },
                {
                    name: 'boardMembers',
                    type: 'array',
                    title: 'Le Bureau (Association)',
                    description: 'Membres élus de l\'association. La photo est optionnelle.',
                    of: [
                        {
                            type: 'object',
                            title: 'Membre du Bureau',
                            fields: [
                                { name: 'name', type: 'string', title: 'Nom' },
                                { name: 'role', type: 'string', title: 'Rôle' },
                                { name: 'image', type: 'image', title: 'Photo (optionnelle)', options: { hotspot: true } },
                            ],
                            preview: {
                                select: { title: 'name', subtitle: 'role', media: 'image' }
                            }
                        }
                    ]
                },
                {
                    name: 'proTeam',
                    type: 'array',
                    title: 'L\'Équipe Sportive (Opérationnelle)',
                    description: 'Salariés, moniteurs et encadrants. Photo recommandée.',
                    of: [
                        {
                            type: 'object',
                            title: 'Membre de l\'Équipe',
                            fields: [
                                { name: 'name', type: 'string', title: 'Nom' },
                                { name: 'role', type: 'string', title: 'Rôle' },
                                { name: 'image', type: 'image', title: 'Photo', options: { hotspot: true } },
                            ],
                            preview: {
                                select: { title: 'name', subtitle: 'role', media: 'image' }
                            }
                        }
                    ]
                }
            ]
        }),

        // ═══════════════════════════════════════
        // LE SITE
        // ═══════════════════════════════════════
        defineField({
            name: 'site',
            title: 'Section Le Site',
            type: 'object',
            group: 'site',
            fields: [
                { name: 'title', type: 'string', title: 'Titre', description: 'Ex: "Un Balcon sur la Mer"' },
                { name: 'description', type: 'text', title: 'Description' },
                {
                    name: 'facilities',
                    type: 'array',
                    title: 'Liste des installations',
                    description: 'Ex: "Club-House panoramique", "Accès direct plage"',
                    of: [{ type: 'string' }]
                },
                { name: 'image', type: 'image', title: 'Photo du site', options: { hotspot: true } },
                { name: 'imageCaption', type: 'string', title: 'Légende image', description: 'Ex: "Vue Imprenable"' },
                { name: 'imageSublabel', type: 'string', title: 'Sous-légende image', description: 'Ex: "Face aux Îles Chausey"' },
            ]
        }),

        // ═══════════════════════════════════════
        // LA FLOTTE
        // ═══════════════════════════════════════
        defineField({
            name: 'fleet',
            title: 'Section La Flotte',
            type: 'object',
            group: 'fleet',
            fields: [
                { name: 'title', type: 'string', title: 'Titre', description: 'Ex: "L\'Armada du CNC"' },
                {
                    name: 'items',
                    type: 'array',
                    title: 'Embarcations',
                    of: [
                        {
                            type: 'object',
                            title: 'Embarcation',
                            fields: [
                                { name: 'name', type: 'string', title: 'Nom' },
                                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                                { name: 'description', type: 'text', title: 'Description' },
                                { name: 'crew', type: 'string', title: 'Équipage', description: 'Ex: "Solo / Double", "1-8 pers"' },
                                {
                                    name: 'gallery',
                                    type: 'array',
                                    title: 'Galerie photos',
                                    of: [{ type: 'image', options: { hotspot: true } }]
                                },
                                {
                                    name: 'stats',
                                    type: 'object',
                                    title: 'Statistiques',
                                    fields: [
                                        { name: 'speed', type: 'number', title: 'Vitesse (0-100)' },
                                        { name: 'difficulty', type: 'number', title: 'Difficulté (0-100)' },
                                        { name: 'adrenaline', type: 'number', title: 'Adrénaline (0-100)' },
                                    ]
                                }
                            ],
                            preview: {
                                select: { title: 'name', subtitle: 'subtitle', media: 'gallery.0' }
                            }
                        }
                    ]
                }
            ]
        }),

        // ═══════════════════════════════════════
        // CTA FINAL
        // ═══════════════════════════════════════
        defineField({
            name: 'cta',
            title: 'Section CTA Final',
            type: 'object',
            group: 'cta',
            fields: [
                { name: 'title', type: 'string', title: 'Titre', description: 'Ex: "Envie de"' },
                { name: 'highlightText', type: 'string', title: 'Texte en surbrillance', description: 'Ex: "Naviguer ?"' },
                { name: 'buttonLabel', type: 'string', title: 'Label du bouton', description: 'Ex: "Nous Rejoindre"' },
                { name: 'buttonLink', type: 'string', title: 'Lien du bouton', description: 'Ex: "/infos-pratiques"' },
            ]
        }),
    ],
});
