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
          { title: '🟢 Ouvert', value: 'OPEN' },
          { title: '🟡 Restreint', value: 'RESTRICTED' },
          { title: '🔴 Fermé', value: 'CLOSED' },
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
