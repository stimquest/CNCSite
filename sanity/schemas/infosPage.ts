import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'infosPage',
  title: 'Infos Pratiques',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', title: 'Titre Hero', type: 'string' }),
    defineField({ name: 'heroSubtitle', title: 'Sous-titre Hero', type: 'text' }),
    defineField({ name: 'address', title: 'Adresse', type: 'text' }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),

    defineField({
      name: 'documents',
      title: 'Documents utiles',
      type: 'array',
      of: [{
        type: 'object',
        name: 'documentItem',
        title: 'Document',
        fields: [
          { name: 'title', title: 'Titre', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          {
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
              list: [
                { title: 'Stages & Mineurs', value: 'stages' },
                { title: 'Vie du Club', value: 'club' },
                { title: 'Compétition', value: 'competition' },
                { title: 'Tarifs', value: 'tarifs' },
              ],
            },
          },
          { name: 'file', title: 'Fichier PDF', type: 'file' },
        ],
        preview: { select: { title: 'title', subtitle: 'category' } },
      }],
    }),

    defineField({
      name: 'pricing',
      title: 'Tarifs',
      type: 'object',
      fields: [
        {
          name: 'eyebrow',
          title: 'Sur-titre de la section',
          type: 'string',
          description: 'Petit texte affiché au-dessus du titre principal (ex : Informations tarifaires)',
        },
        { name: 'title', title: 'Titre de la section', type: 'string' },
        { name: 'pricingFile', title: 'PDF Complet (optionnel)', type: 'file' },

        // ── ONGLET 1 : STAGES ─────────────────────────────────────────────
        {
          name: 'stages',
          title: 'Onglet — Stages nautiques',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Nom de l\'onglet',
              type: 'string',
              description: 'Affiché sur le bouton (ex: "Stage Vacances")',
            },
            {
              name: 'note',
              title: 'Note (ex: Tarifs incluant l\'adhésion…)',
              type: 'string',
            },
            {
              name: 'rows',
              title: 'Lignes',
              type: 'array',
              of: [{
                type: 'object',
                name: 'stageItem',
                fields: [
                  { name: 'activity', title: 'Activité', type: 'string' },
                  { name: 'ages', title: 'Âges', type: 'string' },
                  { name: 'price1', title: '1ère semaine', type: 'string' },
                  { name: 'price2', title: '2ème semaine (−5%)', type: 'string' },
                ],
                preview: { select: { title: 'activity', subtitle: 'ages' } },
              }],
            },
          ],
        },

        // ── ONGLET 2 : SÉANCES & COURS ────────────────────────────────────
        {
          name: 'courses',
          title: 'Onglet — Séances & Cours',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Nom de l\'onglet',
              type: 'string',
              description: 'Affiché sur le bouton (ex: "Séances & Cours")',
            },
            {
              name: 'rows',
              title: 'Lignes',
              type: 'array',
              of: [{
                type: 'object',
                name: 'courseItem',
                fields: [
                  { name: 'activity', title: 'Activité', type: 'string' },
                  { name: 'duration', title: 'Durée', type: 'string' },
                  { name: 'details', title: 'Précisions', type: 'string' },
                  { name: 'price', title: 'Tarif', type: 'string' },
                ],
                preview: { select: { title: 'activity', subtitle: 'price' } },
              }],
            },
          ],
        },

        // ── ONGLET 3 : LOCATIONS ──────────────────────────────────────────
        {
          name: 'locations',
          title: 'Onglet — Locations',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Nom de l\'onglet',
              type: 'string',
              description: 'Affiché sur le bouton (ex: "Locations")',
            },
            {
              name: 'rows',
              title: 'Lignes',
              type: 'array',
              of: [{
                type: 'object',
                name: 'locationItem',
                fields: [
                  { name: 'support', title: 'Support', type: 'string' },
                  { name: 'type', title: 'Type', type: 'string' },
                  { name: 'duration', title: 'Durée', type: 'string' },
                  { name: 'price', title: 'Tarif', type: 'string' },
                ],
                preview: { select: { title: 'support', subtitle: 'price' } },
              }],
            },
          ],
        },

        // ── NOTE DE BAS DE PAGE ───────────────────────────────────────────
        {
          name: 'footerNote',
          title: 'Notes de bas de page',
          type: 'array',
          of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] }],
        },
      ],
    }),
  ],
})
