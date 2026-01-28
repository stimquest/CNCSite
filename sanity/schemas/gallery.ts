import { defineType, defineField } from 'sanity';

export const gallery = defineType({
  name: 'homeGallery',
  title: 'Galerie Accueil',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la Galerie',
      type: 'string',
      initialValue: "L'Album Photo",
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      initialValue: 'Souvenirs 2024',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texte alternatif',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Légende',
            }
          ]
        }
      ],
      validation: (Rule) => Rule.min(1).max(20),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
    },
    prepare({ title, images }) {
      return {
        title: title || 'Galerie sans titre',
        subtitle: `${images?.length || 0} image(s)`,
        media: images?.[0],
      };
    },
  },
});
