import { defineType, defineField } from 'sanity';

export const news = defineType({
  name: 'news',
  title: 'Actualités (Flash Info)',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de l\'actualité',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Sport', value: 'Sport' },
          { title: 'Club', value: 'Club' },
          { title: 'Matériel', value: 'Matériel' },
          { title: 'Événement', value: 'Événement' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date relative',
      type: 'string',
      description: 'Ex: "Il y a 2h", "Hier", "15 Mars"',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication (tri)',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
