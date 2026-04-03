import { defineType, defineField } from 'sanity';

/**
 * Définit un stage de l'école de voile.
 * C'est la source de vérité pour : Cockpit, Vigie, Planning Admin, Page École de Voile.
 * Ajouter un document ici = le stage apparaît automatiquement partout.
 */
export const stageDefinition = defineType({
  name: 'stageDefinition',
  title: 'Définition de Stage',
  type: 'document',
  icon: () => '🏄',
  orderings: [
    {
      title: 'Ordre d\'affichage',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  fields: [
    defineField({
      name: 'key',
      title: 'Clé technique (unique)',
      type: 'slug',
      description: 'Identifiant unique du stage. Ne jamais modifier après création.',
      options: { source: 'label' },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'label',
      title: 'Nom affiché',
      type: 'string',
      description: 'Ex: "Mini-Mousses", "Multiglisse", "Kite"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'shortLabel',
      title: 'Nom court (Cockpit)',
      type: 'string',
      description: 'Version courte pour affichage compact. Ex: "Mini-M.", "Multiglisse"',
    }),
    defineField({
      name: 'vigieGroupId',
      title: 'ID groupe Vigie',
      type: 'string',
      description: 'Identifiant du filtre dans la Vigie. Ex: "stage-minimousses". Ne pas changer après création.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Les stages s\'affichent dans cet ordre (plus petit = en premier).',
      validation: Rule => Rule.required().integer().positive()
    }),
    defineField({
      name: 'isActive',
      title: 'Actif',
      type: 'boolean',
      description: 'Si décoché, le stage disparaît du Cockpit, de la Vigie et des plannings.',
      initialValue: true
    }),
    defineField({
      name: 'planningType',
      title: 'Type de planning',
      type: 'string',
      description: '"kid" = horaire + choix activité (Optimist, Cata…). "simple" = texte libre (ex: horaires marée-dépendants).',
      options: {
        list: [
          { title: 'Kid — horaire + activité + description', value: 'kid' },
          { title: 'Simple — texte libre', value: 'simple' }
        ],
        layout: 'radio'
      },
      initialValue: 'simple',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'color',
      title: 'Couleur (Tailwind)',
      type: 'string',
      description: 'Classe de couleur Tailwind pour l\'icône/badge. Ex: "yellow", "turquoise", "blue", "purple", "orange", "rose"',
      options: {
        list: [
          { title: 'Jaune', value: 'yellow' },
          { title: 'Turquoise', value: 'turquoise' },
          { title: 'Bleu', value: 'blue' },
          { title: 'Violet', value: 'purple' },
          { title: 'Orange', value: 'orange' },
          { title: 'Rose', value: 'rose' },
          { title: 'Vert', value: 'green' },
          { title: 'Cyan', value: 'cyan' },
        ],
        layout: 'radio'
      },
      initialValue: 'blue'
    }),
  ],
  preview: {
    select: {
      label: 'label',
      order: 'order',
      isActive: 'isActive',
      planningType: 'planningType'
    },
    prepare({ label, order, isActive, planningType }) {
      return {
        title: `${isActive ? '✅' : '⏸️'} ${label}`,
        subtitle: `Ordre ${order} · planning ${planningType}`
      };
    }
  }
});
