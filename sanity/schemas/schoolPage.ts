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
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
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
                { name: 'title', type: 'string', title: 'Titre' },
                { name: 'content', type: 'text', title: 'Texte de présentation' },
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
                    { name: 'step', type: 'string', title: 'Numéro d\'étape (ex: 01)' },
                    { name: 'phase', type: 'string', title: 'Phase (ex: L\'Éveil)' },
                    { name: 'title', type: 'string', title: 'Titre narratif' },
                    { name: 'officialName', type: 'string', title: 'Nom officiel du stage' },
                    { name: 'age', type: 'string', title: 'Tranche d\'âge' },
                    { name: 'hook', type: 'string', title: 'Accroche (Citation)' },
                    { name: 'description', type: 'text', title: 'Description courte (Colonnes)' },
                    { name: 'longDescription', type: 'text', title: 'Description longue (Détails)' },
                    { name: 'logistique', type: 'array', title: 'Logistique & Pratique', of: [{ type: 'string' }] },
                    { name: 'image', type: 'image', title: 'Image d\'illustration' },
                    { name: 'color', type: 'string', title: 'Couleur du texte (ex: text-orange-500)' },
                    { name: 'bgColor', type: 'string', title: 'Couleur de fond (ex: bg-orange-500)' },
                    defineField({
                        name: 'iconName',
                        type: 'string',
                        title: 'Icône (Lucide)',
                        components: { input: IconPicker }
                    }),
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
                ]
            }]
        }),

        // PRACTICAL INFO
        defineField({
            name: 'practicalInfo',
            title: 'Informations Pratiques',
            type: 'object',
            group: 'practical',
            fields: [
                { name: 'title', type: 'string', title: 'Titre Section' },
                { name: 'subtitle', type: 'string', title: 'Sous-titre Section' },
                { name: 'description', type: 'text', title: 'Description courte' },
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
                { name: 'description', type: 'text', title: 'Texte' },
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
