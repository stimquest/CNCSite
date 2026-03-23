import { defineType, defineField } from 'sanity';

export const charSession = defineType({
  name: 'charSession',
  title: 'Char à Voile — Session',
  type: 'document',
  icon: () => '🏁',
  orderings: [
    {
      title: 'Date croissante',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    },
    {
      title: 'Date décroissante',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    }
  ],
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: Rule => Rule.required(),
      description: 'Date de la session (liée à la marée)'
    }),
    defineField({
      name: 'heureDebut',
      title: 'Heure de début',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Ex: 10h30',
      placeholder: '10h30'
    }),
    defineField({
      name: 'heureFin',
      title: 'Heure de fin',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Ex: 12h30',
      placeholder: '12h30'
    }),
    defineField({
      name: 'capaciteMax',
      title: 'Capacité maximale',
      type: 'number',
      initialValue: 8,
      validation: Rule => Rule.required().min(1).max(50)
    }),
    defineField({
      name: 'notes',
      title: 'Notes internes',
      type: 'text',
      rows: 2,
      description: 'Conditions, infos marée, remarques...'
    }),
    defineField({
      name: 'actif',
      title: 'Session active (visible publiquement)',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      date: 'date',
      heureDebut: 'heureDebut',
      heureFin: 'heureFin',
      capaciteMax: 'capaciteMax',
      actif: 'actif'
    },
    prepare({ date, heureDebut, heureFin, capaciteMax, actif }) {
      const d = date ? new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';
      return {
        title: `${d} · ${heureDebut ?? '?'} – ${heureFin ?? '?'}`,
        subtitle: `${capaciteMax ?? '?'} places${actif === false ? ' · 🔒 Masquée' : ''}`,
        media: () => '🏁'
      };
    }
  }
});
