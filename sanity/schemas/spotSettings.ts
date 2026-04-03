import { defineType, defineField } from 'sanity';

export const spotSettings = defineType({
  name: 'spotSettings',
  title: 'Paramètres du Spot',
  type: 'document',
  icon: () => '🚩',
  fields: [
    defineField({
      name: 'spotStatus',
      title: 'Statut du Spot',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Activité ouverte', value: 'OPEN' },
          { title: '🟡 Activité ouverte avec adaptation', value: 'RESTRICTED' },
          { title: '🔴 Activité suspendue', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'statusMessage',
      title: 'Message de statut',
      type: 'text',
      rows: 2,
      description: 'Message affiché sur le site (ex: "Conditions idéales !" ou "Mer formée, navigation déconseillée")',
    }),
    defineField({
      name: 'alertMessage',
      title: 'Message d\'alerte (optionnel)',
      type: 'text',
      rows: 2,
      description: 'Message d\'urgence affiché en bannière (laisser vide si pas d\'alerte)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Dernière mise à jour',
      type: 'datetime',
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
    }),

    // --- STATUS PAR ACTIVITÉ ---
    defineField({
      name: 'charStatus',
      title: 'Statut Char à Voile',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Confirmée', value: 'OPEN' },
          { title: '🟡 Confirmée – conditions techniques', value: 'RESTRICTED' },
          { title: '🔴 Annulée', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'charMessage',
      title: 'Note Char à Voile',
      type: 'string',
      description: 'Ex: Annulé faute de vent',
    }),
    defineField({
      name: 'charTags',
      title: 'Tags Char à Voile',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'marcheStatus',
      title: 'Statut Marche Aquatique',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Activité confirmée', value: 'OPEN' },
          { title: '🟡 Parcours adapté aux conditions', value: 'RESTRICTED' },
          { title: '🔴 Sortie reportée', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'marcheMessage',
      title: 'Note Marche Aquatique',
      type: 'string',
      description: 'Ex: Annulé (mer forte)',
    }),
    defineField({
      name: 'marcheTags',
      title: 'Tags Marche Aquatique',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'nautiqueStatus',
      title: 'Statut École de Voile / Location',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Conditions favorables', value: 'OPEN' },
          { title: '🟡 Conditions techniques – pratiquants expérimentés', value: 'RESTRICTED' },
          { title: '🔴 Sortie déconseillée', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'nautiqueMessage',
      title: 'Note Voile',
      type: 'string',
    }),
    defineField({
      name: 'nautiqueTags',
      title: 'Tags Voile',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // --- STAGES (dynamique) ---
    // Les statuts sont indexés par la clé du stage (stageDefinition.key.current)
    // Exemple : [{ stageKey: 'mini-mousses', status: 'OPEN', message: '' }, ...]
    defineField({
      name: 'stageStatuses',
      title: 'Statuts des Stages',
      description: 'Géré automatiquement par le Cockpit. Ne pas modifier directement.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stageStatus',
          fields: [
            {
              name: 'stageKey',
              title: 'Clé du stage',
              type: 'string',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'status',
              title: 'Statut',
              type: 'string',
              options: {
                list: [
                  { title: '🟢 Confirmée', value: 'OPEN' },
                  { title: '🟡 Cond. techniques', value: 'RESTRICTED' },
                  { title: '🔴 Annulée', value: 'CLOSED' },
                  { title: '⚪ Hors Période', value: 'INACTIVE' },
                ],
                layout: 'radio'
              },
              initialValue: 'OPEN'
            },
            {
              name: 'message',
              title: 'Note',
              type: 'string'
            }
          ],
          preview: {
            select: { stageKey: 'stageKey', status: 'status', message: 'message' },
            prepare({ stageKey, status, message }: any) {
              const emoji = status === 'OPEN' ? '🟢' : status === 'RESTRICTED' ? '🟡' : status === 'INACTIVE' ? '⚪' : '🔴';
              return { title: `${emoji} ${stageKey}`, subtitle: message || '' };
            }
          }
        }
      ]
    }),

    defineField({
      name: 'lastPublishedAt',
      title: 'Dernière mise à jour (chef de base)',
      description: 'Mis à jour à chaque modification de statut via le cockpit.',
      type: 'datetime',
    }),
    defineField({
      name: 'lastConfirmedAt',
      title: 'Dernière confirmation (chef de base)',
      description: 'Mis à jour quand le chef de base confirme que tout est OK sans changement.',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      status: 'spotStatus',
      message: 'statusMessage',
    },
    prepare({ status, message }) {
      const statusEmoji = status === 'OPEN' ? '🟢' : status === 'RESTRICTED' ? '🟡' : '🔴';
      return {
        title: `${statusEmoji} Statut: ${status || 'Non défini'}`,
        subtitle: message || 'Aucun message',
      };
    },
  },
});
