import { defineType, defineField, defineArrayMember } from 'sanity';

const activityOptions = [
  { title: 'Piscine / Cerf-volant', value: 'piscine' },
  { title: 'Optimist', value: 'optimist' },
  { title: 'Catamaran', value: 'catamaran' },
  { title: 'Paddle / Kayak', value: 'paddle' },
  { title: 'Char à voile', value: 'char' },
  { title: 'Planche à voile', value: 'planche' },
  { title: 'Kite', value: 'kite' },
  { title: 'Multiglisse', value: 'multiglisse' },
];

export const weeklyPlanning = defineType({
  name: 'weeklyPlanning',
  title: 'Stages - Planning Hebdomadaire',
  type: 'document',
  icon: () => '📅',
  orderings: [
    {
      title: 'Date croissante',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }]
    },
    {
      title: 'Date décroissante',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }]
    }
  ],
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
      name: 'isPublished',
      title: 'En ligne',
      type: 'boolean',
      initialValue: false
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
              type: 'string',
              initialValue: 'Lundi'
            },
            {
              name: 'date',
              title: 'Date',
              type: 'date',
              validation: Rule => Rule.required()
            },
            {
              name: 'isRaidDay',
              title: 'Journée Raid ?',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'raidStageKey',
              title: 'Stage concerné par le Raid',
              type: 'string',
              description: 'Clé du stage qui part en raid ce jour (ex: "initiation", "perfectionnement")',
            },
            {
              name: 'stageSlots',
              title: 'Créneaux par stage',
              description: 'Un créneau par stage actif. Laisser vide si un stage n\'a pas séance ce jour.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'stageSlot',
                  fields: [
                    {
                      name: 'stageKey',
                      title: 'Stage',
                      type: 'string',
                      description: 'Clé du stage (ex: mini-mousses, moussaillons, initiation…)',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'time',
                      title: 'Horaire',
                      type: 'string',
                      description: 'Ex: "10h - 12h", "Raid", "FERMÉ", "COMPLET"'
                    },
                    {
                      name: 'activity',
                      title: 'Activité',
                      type: 'string',
                      options: { list: activityOptions }
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'string'
                    }
                  ],
                  preview: {
                    select: { stageKey: 'stageKey', time: 'time', activity: 'activity' },
                    prepare({ stageKey, time, activity }) {
                      return {
                        title: stageKey,
                        subtitle: [time, activity].filter(Boolean).join(' · ')
                      };
                    }
                  }
                })
              ]
            }
          ],
          preview: {
            select: { title: 'name', subtitle: 'date' }
          }
        })
      ]
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startDate',
      published: 'isPublished'
    },
    prepare({ title, date, published }) {
      return {
        title: `${published ? '🟢' : '⚪'} ${title}`,
        subtitle: date
      };
    }
  }
});
