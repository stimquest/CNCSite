import { defineType, defineField } from 'sanity';

export const charBooking = defineType({
  name: 'charBooking',
  title: 'Char à Voile — Réservation',
  type: 'document',
  icon: () => '📋',
  orderings: [
    {
      title: 'Date de création (récent)',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    }
  ],
  fields: [
    defineField({
      name: 'session',
      title: 'Session',
      type: 'reference',
      to: [{ type: 'charSession' }],
      validation: Rule => Rule.required(),
      description: 'Session char à voile concernée'
    }),
    defineField({
      name: 'clientNom',
      title: 'Nom du client',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'clientTel',
      title: 'Téléphone',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'nbPlaces',
      title: 'Nombre de places',
      type: 'number',
      initialValue: 1,
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'statut',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: '✅ Confirmé', value: 'confirme' },
          { title: '⏳ Liste d\'attente', value: 'liste_attente' },
          { title: '❌ Annulé', value: 'annule' }
        ],
        layout: 'radio'
      },
      initialValue: 'confirme',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2
    }),
    // Future Stripe integration — nullable for now
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
      description: 'Réservé pour la future intégration Stripe (empreinte bancaire)',
      readOnly: true
    })
  ],
  preview: {
    select: {
      clientNom: 'clientNom',
      clientTel: 'clientTel',
      nbPlaces: 'nbPlaces',
      statut: 'statut',
      sessionDate: 'session.date',
      sessionDebut: 'session.heureDebut'
    },
    prepare({ clientNom, clientTel, nbPlaces, statut, sessionDate, sessionDebut }) {
      const statusIcon = statut === 'confirme' ? '✅' : statut === 'annule' ? '❌' : '⏳';
      const d = sessionDate ? new Date(sessionDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—';
      return {
        title: `${clientNom ?? 'Client'} · ${nbPlaces}p`,
        subtitle: `${statusIcon} ${d} ${sessionDebut ?? ''} · 📞 ${clientTel ?? '—'}`,
        media: () => '📋'
      };
    }
  }
});
