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
          { title: '🟢 Ouverte', value: 'OPEN' },
          { title: '🟡 Adaptée', value: 'RESTRICTED' },
          { title: '🔴 Suspendue', value: 'CLOSED' },
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
          { title: '🟢 Ouverte', value: 'OPEN' },
          { title: '🟡 Adaptée', value: 'RESTRICTED' },
          { title: '🔴 Suspendue', value: 'CLOSED' },
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
          { title: '🟢 Ouverte', value: 'OPEN' },
          { title: '🟡 Adaptée', value: 'RESTRICTED' },
          { title: '🔴 Suspendue', value: 'CLOSED' },
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

    // --- STAGES ---
    defineField({
      name: 'stagesMiniMoussesStatus',
      title: 'Statut Stages Mini-Mousses (5-7 ans)',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Maintenu', value: 'OPEN' },
          { title: '🟡 Adapté', value: 'RESTRICTED' },
          { title: '🔴 Annulé', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'stagesMiniMoussesMessage',
      title: 'Note Mini-Mousses',
      type: 'string',
      description: 'Ex: Annulé — vent trop fort',
    }),

    defineField({
      name: 'stagesMoussaillonsStatus',
      title: 'Statut Stages Moussaillons (8-9 ans)',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Maintenu', value: 'OPEN' },
          { title: '🟡 Adapté', value: 'RESTRICTED' },
          { title: '🔴 Annulé', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'stagesMoussaillonsMessage',
      title: 'Note Moussaillons',
      type: 'string',
    }),

    defineField({
      name: 'stagesInitiationStatus',
      title: 'Statut Stages Initiation (10-16 ans)',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Maintenu', value: 'OPEN' },
          { title: '🟡 Adapté', value: 'RESTRICTED' },
          { title: '🔴 Annulé', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'stagesInitiationMessage',
      title: 'Note Initiation',
      type: 'string',
    }),

    defineField({
      name: 'stagesPerfStatus',
      title: 'Statut Stages Perfectionnement (10-16 ans)',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Maintenu', value: 'OPEN' },
          { title: '🟡 Adapté', value: 'RESTRICTED' },
          { title: '🔴 Annulé', value: 'CLOSED' },
        ],
        layout: 'radio',
      },
      initialValue: 'OPEN',
    }),
    defineField({
      name: 'stagesPerfMessage',
      title: 'Note Perfectionnement',
      type: 'string',
    }),

    defineField({
      name: 'lastPublishedAt',
      title: 'Dernière publication (chef de base)',
      description: 'Mis à jour automatiquement à chaque publication via le cockpit ou l\'admin.',
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
