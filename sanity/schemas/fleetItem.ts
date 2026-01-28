import { defineType, defineField } from 'sanity';

export const fleetItem = defineType({
  name: 'fleetItem',
  title: 'La Flotte (Bateaux)',
  type: 'document',
  icon: () => '⛵',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du support',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      description: 'Ex: "La Référence", "Vitesse Pure"',
    }),
    defineField({
      name: 'description',
      title: 'Description Longue',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie d\'images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'stats',
      title: 'Statistiques (0-100)',
      type: 'object',
      fields: [
        { name: 'speed', title: 'Vitesse', type: 'number' },
        { name: 'difficulty', title: 'Difficulté', type: 'number' },
        { name: 'adrenaline', title: 'Adrénaline', type: 'number' },
      ],
    }),
    defineField({
      name: 'crew',
      title: 'Équipage',
      type: 'string',
      description: 'Ex: "Solo", "2-3 pers."',
    }),
  ],
});
