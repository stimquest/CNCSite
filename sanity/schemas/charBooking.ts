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
          { title: '🔎 À valider', value: 'a_valider' },
          { title: '⏳ Prévenir si une place se libère', value: 'liste_attente' },
          { title: '❌ Annulé', value: 'annule' }
        ],
        layout: 'radio'
      },
      initialValue: 'confirme',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'motifSuivi',
      title: 'Motif du suivi',
      type: 'string',
      options: {
        list: [
          { title: 'Nombre final à confirmer', value: 'nombre_a_confirmer' },
          { title: 'Organisation ou matériel à vérifier', value: 'organisation_a_verifier' },
          { title: 'Conditions météo à confirmer', value: 'meteo_a_confirmer' },
          { title: 'Demande particulière à valider', value: 'demande_speciale' },
          { title: 'Surbooking à régulariser', value: 'surbooking_a_regulariser' },
          { title: 'Prévenir si une place se libère', value: 'place_a_liberer' }
        ]
      },
      hidden: ({ parent }) => !['a_valider', 'liste_attente'].includes(parent?.statut)
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2
    }),
    defineField({
      name: 'todo',
      title: 'Demande particulière / à faire',
      type: 'text',
      rows: 2,
      description: 'Suivi interne pour un grand groupe ou une demande spéciale.'
    }),
    defineField({
      name: 'todoDone',
      title: 'Demande traitée',
      type: 'boolean',
      initialValue: false
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
      const statusIcon = statut === 'confirme' ? '✅' : statut === 'annule' ? '❌' : statut === 'a_valider' ? '🔎' : '⏳';
      const d = sessionDate ? new Date(sessionDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—';
      return {
        title: `${clientNom ?? 'Client'} · ${nbPlaces}p`,
        subtitle: `${statusIcon} ${d} ${sessionDebut ?? ''} · 📞 ${clientTel ?? '—'}`,
        media: () => '📋'
      };
    }
  }
});
