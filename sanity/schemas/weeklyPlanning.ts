import { defineType, defineField, defineArrayMember } from 'sanity';

const activityOptions = [
  { title: 'Piscine / Cerf-volant', value: 'piscine' },
  { title: 'Optimist', value: 'optimist' },
  { title: 'Catamaran', value: 'catamaran' },
  { title: 'Paddle / Kayak', value: 'paddle' },
  { title: 'Char à voile', value: 'char' },
];

export const weeklyPlanning = defineType({
  name: 'weeklyPlanning',
  title: 'Stages - Planning Hebdomadaire',
  type: 'document',
  icon: () => '📅',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la semaine',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'endDate',
      title: 'Date de fin',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
        name: 'days',
        title: 'Jours de la semaine',
        description: '5 jours par défaut (Lun-Ven). Ajoutez Samedi/Dimanche si besoin.',
        type: 'array',
        validation: Rule => Rule.required().min(5).max(7),
        of: [
          defineArrayMember({
            type: 'object',
            name: 'dayEntry',
            fields: [
              { 
                name: 'name',
                title: 'Nom du jour',
                type: 'string', // Lundi, Mardi...
                initialValue: 'Lundi'
              },
              {
                name: 'date',
                title: 'Date',
                type: 'date',
                validation: Rule => Rule.required()
              },
              { name: 'isRaidDay', title: 'Journée Raid ?', type: 'boolean', initialValue: false },
              {
                name: 'raidTarget',
                title: 'Cible du Raid',
                type: 'string',
                options: {
                  list: [
                    { title: 'Aucun', value: 'none' },
                    { title: 'Initiation', value: 'initiation' },
                    { title: 'Perfectionnement', value: 'perfectionnement' },
                    { title: 'Moussaillons', value: 'mousses' },
                    { title: 'Mini-Mousses', value: 'miniMousses' }
                  ],
                  layout: 'radio'
                },
                initialValue: 'none'
              },
              
              // MINI MOUSSES
              {
                name: 'miniMousses',
                title: 'Mini-Mousses',
                type: 'object',
                fields: [
                  { name: 'time', title: 'Horaire', type: 'string' },
                  { name: 'activity', title: 'Activité', type: 'string', options: { list: activityOptions } },
                  { name: 'description', title: 'Description', type: 'string' }
                ]
              },
  
              // MOUSSES
              {
                name: 'mousses',
                title: 'Moussaillons',
                type: 'object',
                fields: [
                  { name: 'time', title: 'Horaire', type: 'string' },
                  { name: 'activity', title: 'Activité', type: 'string', options: { list: activityOptions } },
                  { name: 'description', title: 'Description', type: 'string' }
                ]
              },
  
              // INITIATION
              {
                name: 'initiation',
                title: 'Initiation',
                type: 'string',
                description: 'Format: "HHhMM - HHhMM" OU "Raid"'
              },
  
              // PERFECTIONNEMENT
              {
                name: 'perfectionnement',
                title: 'Perfectionnement',
                type: 'string',
                 description: 'Format: "HHhMM - HHhMM" OU "Raid"'
              }
            ],
            preview: {
                select: { title: 'name', subtitle: 'date' }
            }
          })
        ]
      }),
    defineField({
      name: 'isPublished',
      title: 'Publié',
      type: 'boolean',
      initialValue: true,
    })
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startDate'
    },
    prepare({ title, date }) {
      return {
        title: title,
        subtitle: date
      }
    }
  }
});
