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
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Voile', value: 'VOILE' },
          { title: 'Glisse', value: 'GLISSE' },
          { title: 'Plage', value: 'PLAGE' },
          { title: 'Location', value: 'LOCATION' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'string',
      description: 'Ex: "35€" ou "À partir de 25€"',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      name: 'pedagogie',
      title: 'Pédagogie',
      type: 'text',
      rows: 2,
      description: 'Approche pédagogique de l\'activité',
    }),
    defineField({
      name: 'experience',
      title: 'Expérience',
      type: 'text',
      rows: 2,
      description: 'Ce que le participant va vivre',
    }),
    defineField({
      name: 'logistique',
      title: 'Logistique',
      type: 'text',
      rows: 2,
      description: 'Informations pratiques (équipement fourni, etc.)',
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
