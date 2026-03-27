import { defineType, defineField } from 'sanity';
import { IconPicker } from '../components/IconPicker';

export default defineType({
    name: 'schoolPage',
    title: 'Contenu Page Ecole',
    type: 'document',
    groups: [
        { name: 'hero', title: 'Héro' },
        { name: 'intro', title: 'Présentation' },
        { name: 'stages', title: 'Stages & Parcours' },
        { name: 'practical', title: 'Infos Pratiques' },
        { name: 'seo', title: 'SEO' },
    ],
    preview: {
        prepare() {
            return {
                title: 'Contenu Page École',
                subtitle: 'Gestion globale de la page'
            }
        }
    },
    fields: [
        // HERO SECTION
        defineField({
            name: 'hero',
            type: 'object',
            group: 'hero',
            fields: [
                { name: 'title', type: 'text', rows: 2, title: 'Titre' },
                { name: 'subtitle', type: 'text', rows: 2, title: 'Sous-titre' },
                { name: 'tagText', type: 'string', title: 'Texte du Badge' },
                { name: 'image', type: 'image', title: 'Image de fond' },
            ]
        }),
        defineField({
            name: 'intro',
            type: 'object',
            title: 'Section Présentation (Intro)',
            group: 'intro',
            fields: [
                { name: 'title', type: 'text', rows: 2, title: 'Titre' },
                { name: 'content', type: 'basicRichText', title: 'Texte de présentation' },
            ]
        }),
        defineField({
            name: 'heroBadges',
            type: 'array',
            title: 'Badges Flottants (Hero)',
            group: 'hero',
            validation: Rule => Rule.max(2),
            of: [{
                type: 'object',
                fields: [
                    { name: 'label', type: 'string', title: 'Libellé (ex: Fondée en)' },
                    { name: 'value', type: 'string', title: 'Valeur (ex: 1978)' },
                    { name: 'sublabel', type: 'string', title: 'Sous-libellé' },
                    defineField({
                        name: 'iconName',
                        type: 'string',
                        title: 'Icône (Lucide)',
                        components: { input: IconPicker }
                    }),
                    {
                        name: 'style',
                        type: 'string',
                        title: 'Style visuel',
                        options: { list: [{ title: 'Plein (Blanc)', value: 'solid' }, { title: 'Verre (Glassmorphism)', value: 'glass' }] }
                    },
                ]
            }]
        }),
        defineField({
            name: 'stages',
            type: 'array',
            title: 'Stages (Parcours Narratif)',
            group: 'stages',
            of: [{
                type: 'object',
                fields: [
                    { name: 'id', type: 'string', title: 'ID unique (slug)' },
                    { name: 'title', type: 'text', rows: 2, title: 'Titre narratif' },
                    { name: 'officialName', type: 'string', title: 'Nom officiel du stage' },
                    { name: 'age', type: 'string', title: 'Tranche d\'âge' },
                    { name: 'price', type: 'string', title: 'Prix (ex: 165€)' },
                    { name: 'hook', type: 'text', rows: 3, title: 'Accroche (Citation)' },
                    { name: 'description', type: 'basicRichText', title: 'Description courte (Colonnes)' },
                    { name: 'longDescription', type: 'basicRichText', title: 'Description longue (Détails)' },
                    { name: 'logistique', type: 'array', title: 'Logistique & Pratique', of: [{ type: 'string' }] },
                    { name: 'image', type: 'image', title: 'Image d\'illustration' },
                    { name: 'color', type: 'string', title: 'Couleur du texte (ex: text-orange-500)' },
                    { name: 'bgColor', type: 'string', title: 'Couleur de fond (ex: bg-orange-500)' },
                    {
                        name: 'pricingTiers',
                        type: 'array',
                        title: 'Grille Tarifaire',
                        of: [{
                            type: 'object',
                            fields: [
                                { name: 'label', type: 'string', title: 'Libellé du tarif' },
                                { name: 'value', type: 'string', title: 'Prix' },
                            ]
                        }]
                    }
                ],
                preview: {
                    select: {
                        title: 'officialName',
                        subtitle: 'title',
                        media: 'image'
                    }
                }
            }]
        }),

        defineField({
            name: 'proFormations',
            title: 'Formations Professionnelles',
            type: 'array',
            group: 'stages',
            of: [{
                type: 'object',
                fields: [
                    { name: 'officialName', type: 'string', title: 'Nom de la formation' },
                    { name: 'label', type: 'string', title: 'Badge (ex: Stage Immersion 3 jours)' },
                    { name: 'target', type: 'string', title: 'Public cible (ex: Titulaires BPJEPS / BE)' },
                    { name: 'duration', type: 'string', title: 'Durée (ex: 3 jours intensifs)' },
                    { name: 'price', type: 'string', title: 'Tarif (ex: Sur devis)' },
                    { name: 'description', type: 'text', rows: 4, title: 'Description' },
                    {
                        name: 'conditions',
                        type: 'array',
                        title: 'Conditions / Prérequis',
                        of: [{ type: 'string' }]
                    },
                    { name: 'image', type: 'image', title: 'Image' },
                    { name: 'accentColor', type: 'string', title: 'Couleur accent (classe Tailwind bg-*)', description: 'Ex: bg-turquoise, bg-abysse, bg-rose-600' },
                    { name: 'color', type: 'string', title: 'Couleur texte (classe Tailwind text-*)', description: 'Ex: text-turquoise, text-abysse, text-rose-600' },
                ],
                preview: {
                    select: { title: 'officialName', subtitle: 'target' }
                }
            }]
        }),

        defineField({
            name: 'ecoleAnnee',
            title: "École à l'Année",
            type: 'object',
            group: 'stages',
            fields: [
                { name: 'sectionTitle', type: 'string', title: 'Titre de section (ex: Octobre → Juin)' },
                { name: 'sectionSubtitle', type: 'string', title: 'Sous-titre (jours / tranches d\'âge)' },
                { name: 'sectionDescription', type: 'text', rows: 3, title: 'Texte descriptif (colonne droite du header)' },
                {
                    name: 'groups',
                    type: 'array',
                    title: 'Groupes / Niveaux',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'title', type: 'string', title: 'Nom du groupe (ex: Petits Mousses)' },
                            { name: 'age', type: 'string', title: 'Tranche d\'âge (ex: 6 à 8 ans)' },
                            { name: 'jour', type: 'string', title: 'Jour (ex: Chaque mercredi)' },
                            { name: 'activite', type: 'string', title: 'Activité principale' },
                            { name: 'detail', type: 'text', rows: 3, title: 'Détail / note complémentaire' },
                            { name: 'price', type: 'string', title: 'Prix (ex: 115 €)' },
                            { name: 'priceSuffix', type: 'string', title: 'Suffixe prix (ex: + licence + adhésion)' },
                            { name: 'accentColor', type: 'string', title: 'Couleur accent (bg-*)', description: 'Ex: bg-orange-500, bg-turquoise, bg-blue-600' },
                            { name: 'color', type: 'string', title: 'Couleur texte (text-*)', description: 'Ex: text-orange-500, text-turquoise, text-blue-600' },
                            defineField({
                                name: 'iconName',
                                type: 'string',
                                title: 'Icône (Lucide)',
                                components: { input: IconPicker }
                            }),
                        ],
                        preview: {
                            select: { title: 'title', subtitle: 'age' }
                        }
                    }]
                }
            ]
        }),

        defineField({
            name: 'tarifNote',
            title: "Note Tarifaire (sous les cartes école à l'année)",
            type: 'object',
            group: 'stages',
            fields: [
                { name: 'title', type: 'string', title: 'Titre (ex: Tarifs indicatifs)' },
                { name: 'description', type: 'text', rows: 4, title: 'Texte explicatif' },
                { name: 'ctaLabel', type: 'string', title: 'Texte du lien CTA' },
                { name: 'ctaUrl', type: 'url', title: 'URL du lien CTA' },
            ]
        }),

        defineField({
            name: 'practicalInfo',
            title: 'Informations Pratiques',
            type: 'object',
            group: 'practical',
            fields: [
                { name: 'title', type: 'string', title: 'Titre Section' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre Section' },
                { name: 'description', type: 'basicRichText', title: 'Description courte' },
            ]
        }),
        defineField({
            name: 'equipmentProvided',
            title: 'Matériel Fourni',
            type: 'array',
            group: 'practical',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'toBring',
            title: 'À Prévoir',
            type: 'array',
            group: 'practical',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'safetyInfo',
            title: 'Météo & Sécurité',
            type: 'object',
            group: 'practical',
            fields: [
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'description', type: 'basicRichText', title: 'Texte' },
                { name: 'footerText', type: 'string', title: 'Texte de pied (Label FFV)' },
            ]
        }),

        // SEO
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            group: 'seo',
            fields: [
                { name: 'metaTitle', type: 'string', title: 'Meta Title' },
                { name: 'metaDescription', type: 'text', title: 'Meta Description' },
            ]
        }),
    ],
});
