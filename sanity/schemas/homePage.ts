
import { defineField, defineType } from 'sanity';
import { Home, Image as ImageIcon, Briefcase, Users, Layout } from 'lucide-react';

export default defineType({
    name: 'homePage',
    title: 'Contenu Page Accueil',
    type: 'document',
    icon: Home,
    groups: [
        { name: 'hero', title: 'Hero Section', icon: Layout },
        { name: 'spirit', title: 'Esprit Club (Expérience CVC)', icon: Users },
        { name: 'activities', title: 'Activités à la Une', icon: ImageIcon },
        { name: 'focus', title: 'Focus Activités', icon: Briefcase },
        { name: 'partners', title: 'Partenaires', icon: Users },
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
            description: 'Images défilantes en fond d\'écran',
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
                        defineField({ name: 'iconName', title: 'Nom Icône Lucide', type: 'string' }),
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

        // FOCUS SECTIONS (Char, Glisse, Bien-être)
        defineField({
            name: 'focusChar',
            title: 'Section Focus : Char à Voile',
            type: 'object',
            group: 'focus',
            fields: [
                defineField({ name: 'title', title: 'Titre Principal', type: 'string', initialValue: 'Le Char' }),
                defineField({ name: 'highlightSuffix', title: 'Suffixe Coloré', type: 'string', initialValue: 'à Voile.' }),
                defineField({ name: 'tagline', title: 'Petit Titre (Tagline)', type: 'string', initialValue: 'Activité Phare' }),
                defineField({ name: 'subTagline', title: 'Sous-Tagline', type: 'string', initialValue: 'Sensation & Vitesse' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                defineField({ name: 'badgeValue', title: 'Valeur Badge (ex: 60+)', type: 'string' }),
                defineField({ name: 'badgeLabel', title: 'Label Badge', type: 'string' }),
                defineField({ name: 'images', title: 'Galerie Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
                defineField({ name: 'ctaButton', title: 'Bouton Action', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
                defineField({ name: 'infoButton', title: 'Bouton Info', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
            ],
            options: { collapsible: true, collapsed: true }
        }),

        defineField({
            name: 'focusGlisse',
            title: 'Section Focus : Glisse Extrême',
            type: 'object',
            group: 'focus',
            fields: [
                defineField({ name: 'title', title: 'Titre Principal', type: 'string', initialValue: 'Glisse' }),
                defineField({ name: 'highlightSuffix', title: 'Suffixe Coloré', type: 'string', initialValue: 'Extrême.' }),
                defineField({ name: 'tagline', title: 'Petit Titre (Tagline)', type: 'string', initialValue: 'Sensations Fortes' }),
                defineField({ name: 'subTagline', title: 'Sous-Tagline', type: 'string', initialValue: 'Wing, Kite & Funboard' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                defineField({ name: 'badgeValue', title: 'Valeur Badge', type: 'string', initialValue: 'Pure' }),
                defineField({ name: 'badgeLabel', title: 'Label Badge', type: 'string', initialValue: 'Énergie & Adrénaline' }),
                defineField({ name: 'images', title: 'Galerie Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
                defineField({ name: 'ctaButton', title: 'Bouton Action', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
                defineField({ name: 'infoButton', title: 'Bouton Info', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
            ],
            options: { collapsible: true, collapsed: true }
        }),

        defineField({
            name: 'focusBienEtre',
            title: 'Section Focus : Bien-être',
            type: 'object',
            group: 'focus',
            fields: [
                defineField({ name: 'title', title: 'Titre Principal', type: 'string', initialValue: 'Bien-être' }),
                defineField({ name: 'highlightSuffix', title: 'Suffixe Coloré', type: 'string', initialValue: '& Slow Tourisme.' }),
                defineField({ name: 'tagline', title: 'Petit Titre (Tagline)', type: 'string', initialValue: 'Slow Tourisme' }),
                defineField({ name: 'subTagline', title: 'Sous-Tagline', type: 'string', initialValue: 'Marche Aquatique, Kayak & Paddle' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                defineField({ name: 'badgeValue', title: 'Valeur Badge', type: 'string', initialValue: '100%' }),
                defineField({ name: 'badgeLabel', title: 'Label Badge', type: 'string', initialValue: 'Oxygène & Sérénité Locale' }),
                defineField({ name: 'images', title: 'Galerie Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
                defineField({ name: 'ctaButton', title: 'Bouton Action', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
                defineField({ name: 'infoButton', title: 'Bouton Info', type: 'object', fields: [{ name: 'text', type: 'string' }, { name: 'link', type: 'string' }] }),
            ],
            options: { collapsible: true, collapsed: true }
        }),

        // Featured Activities (The 3 cards at top)
        defineField({
            name: 'featuredActivities',
            title: 'Activités à la Une',
            type: 'array',
            group: 'activities',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Titre', type: 'string' }),
                        defineField({ name: 'tagline', title: 'Sous-titre', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
                        defineField({ name: 'ctaLabel', title: 'Bouton (Label)', type: 'string' }),
                        defineField({ name: 'ctaLink', title: 'Bouton (Lien)', type: 'string' }),
                        defineField({ name: 'badge', title: 'Badge', type: 'string' }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'tagline', media: 'image' },
                    },
                },
            ],
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
    ],
});
