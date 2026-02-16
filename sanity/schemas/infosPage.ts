
import { defineField, defineType } from 'sanity';
import { Info, MapPin, FileText, Phone, Mail } from 'lucide-react';

export default defineType({
    name: 'infosPage',
    title: 'Contenu Page Infos',
    type: 'document',
    icon: Info,
    groups: [
        { name: 'hero', title: 'Hero Section' },
        { name: 'contact', title: 'Contact & Accès' },
        { name: 'documents', title: 'Documents' },
    ],
    fields: [
        // HERO
        defineField({
            name: 'heroTitle',
            title: 'Titre Principal (Hero)',
            type: 'string',
            group: 'hero',
            initialValue: "L'Escale Logistique.",
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Sous-titre (Hero)',
            type: 'text',
            rows: 3,
            group: 'hero',
            initialValue: "Besoin d'un renseignement, d'un document ou de nous trouver sur la côte ?",
        }),

        // CONTACT
        defineField({
            name: 'address',
            title: 'Adresse Postale',
            type: 'text',
            rows: 3,
            group: 'contact',
            initialValue: "Plage Nord, 120 rue des Dunes\n50230 Agon-Coutainville",
        }),
        defineField({
            name: 'phone',
            title: 'Téléphone',
            type: 'string',
            group: 'contact',
            initialValue: "02 33 47 14 81",
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            group: 'contact',
            initialValue: "contact@cncoutainville.fr",
        }),

        // DOCUMENTS
        defineField({
            name: 'documents',
            title: 'Documents à Télécharger',
            type: 'array',
            group: 'documents',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Titre', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'string' }),
                        defineField({
                            name: 'category',
                            title: 'Catégorie',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Stages & Mineurs', value: 'stages' },
                                    { title: 'Vie du Club', value: 'club' },
                                    { title: 'Compétition', value: 'competition' },
                                    { title: 'Tarifs', value: 'tarifs' },
                                ]
                            }
                        }),
                        defineField({ name: 'file', title: 'Fichier (PDF)', type: 'file' }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'category' }
                    },
                },
            ],
        }),
    ],
});
