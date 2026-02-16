import { defineType, defineField } from 'sanity';

export const activity = defineType({
  name: 'activity',
  title: 'Activité',
  type: 'document',
  icon: () => '⛵',
  fields: [
    defineField({
      name: 'id',
      title: 'Identifiant unique',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Ex: char-a-voile, marche-aquatique'
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Plus le nombre est petit, plus l\'activité apparaît en haut (1 = première)',
      initialValue: 99,
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Sensations', value: 'Sensations' },
          { title: 'Voile', value: 'Voile' },
          { title: 'Jeunesse', value: 'Jeunesse' },
          { title: 'Bien-être', value: 'Bien-être' },
          { title: 'Sécurité', value: 'Sécurité' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accroche',
      title: 'Accroche',
      type: 'string',
      description: 'Phrase d\'accroche courte (ex: "Vitesse pure au ras du sable")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'experience',
      title: 'Expérience',
      type: 'array',
      of: [{ type: 'block', styles: [], lists: [], marks: { decorators: [{ title: 'Gras', value: 'strong' }] } }],
      description: 'Ce que le participant va vivre',
    }),
    defineField({
      name: 'pedagogie',
      title: 'Pédagogie',
      type: 'text',
      rows: 3,
      description: 'Approche pédagogique de l\'activité',
    }),
    defineField({
      name: 'logistique',
      title: 'Logistique',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Liste d\'informations pratiques (une par ligne)',
    }),
    defineField({
      name: 'price',
      title: 'Prix principal',
      type: 'string',
      description: 'Prix affiché en résumé (ex: "45€")',
    }),
    defineField({
      name: 'prices',
      title: 'Grille tarifaire',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'value', title: 'Prix', type: 'string' }
        ]
      }],
      description: 'Détail des tarifs (séance, stage...)',
    }),
    defineField({
      name: 'image',
      title: 'Image Principale',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie d\'images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Images supplémentaires pour le défilement (2 à 4 recommandées)'
    }),
    defineField({
      name: 'isTideDependent',
      title: 'Dépend de la marée ?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Lien de réservation',
      type: 'url',
    }),
    defineField({
      name: 'actions',
      title: 'Actions & Boutons',
      type: 'object',
      fields: [
        {
          name: 'stage',
          title: 'S\'inscrire en Stage',
          type: 'object',
          fields: [
            { name: 'isActive', title: 'Actif', type: 'boolean', initialValue: true },
            { name: 'type', title: 'Type d\'action', type: 'string', options: { list: [{ title: 'Lien', value: 'link' }, { title: 'Message (Modal)', value: 'modal' }] }, initialValue: 'link' },
            { name: 'url', title: 'Lien Axyomes/Externe', type: 'url', hidden: ({ parent }: any) => parent?.type !== 'link' },
            {
              name: 'message',
              title: 'Message Modal',
              type: 'array',
              of: [{ type: 'block', styles: [], lists: [], marks: { decorators: [{ title: 'Gras', value: 'strong' }] } }],
              hidden: ({ parent }: any) => parent?.type !== 'modal'
            }
          ]
        },
        {
          name: 'reservation',
          title: 'Réserver Séance',
          type: 'object',
          fields: [
            { name: 'isActive', title: 'Actif', type: 'boolean', initialValue: true },
            { name: 'type', title: 'Type d\'action', type: 'string', options: { list: [{ title: 'Lien', value: 'link' }, { title: 'Message (Modal)', value: 'modal' }] }, initialValue: 'link' },
            { name: 'url', title: 'Lien de réservation', type: 'url', hidden: ({ parent }: any) => parent?.type !== 'link' },
            {
              name: 'message',
              title: 'Message Modal',
              type: 'array',
              of: [{ type: 'block', styles: [], lists: [], marks: { decorators: [{ title: 'Gras', value: 'strong' }] } }],
              hidden: ({ parent }: any) => parent?.type !== 'modal'
            }
          ]
        },
        {
          name: 'rental',
          title: 'Louer le Matériel',
          type: 'object',
          fields: [
            { name: 'isActive', title: 'Actif', type: 'boolean', initialValue: true },
            { name: 'type', title: 'Type d\'action', type: 'string', options: { list: [{ title: 'Lien', value: 'link' }, { title: 'Message (Modal)', value: 'modal' }] }, initialValue: 'link' },
            { name: 'url', title: 'Lien de location', type: 'url', hidden: ({ parent }: any) => parent?.type !== 'link' },
            {
              name: 'message',
              title: 'Message Modal',
              type: 'array',
              of: [{ type: 'block', styles: [], lists: [], marks: { decorators: [{ title: 'Gras', value: 'strong' }] } }],
              hidden: ({ parent }: any) => parent?.type !== 'modal'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Ex: "2h", "1 semaine"',
    }),
    defineField({
      name: 'minAge',
      title: 'Âge minimum',
      type: 'number',
    }),
    defineField({
      name: 'planningNote',
      title: 'Note planning',
      type: 'text',
      rows: 2,
      description: 'Infos sur les créneaux (ex: "Stages pendant vacances scolaires")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
});
