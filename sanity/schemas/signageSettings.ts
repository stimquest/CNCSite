import { defineField, defineType } from 'sanity';

export const signageSettings = defineType({
  name: 'signageSettings',
  title: 'Réglages de diffusion écran',
  type: 'document',
  fields: [
    defineField({ name: 'timeline', title: 'Timeline de diffusion', type: 'array', of: [{ type: 'object', fields: [
      defineField({ name: 'source', title: 'Contenu', type: 'string', options: { list: ['weather', 'agenda', 'slide'] } }),
      defineField({ name: 'slideId', title: 'Identifiant diapo', type: 'string' }),
      defineField({ name: 'duration', title: 'Durée (millisecondes)', type: 'number', validation: rule => rule.required().integer().min(1000).max(600000) }),
    ] }] }),
    defineField({ name: 'weatherEnabled', title: 'Diffuser la météo', type: 'boolean', initialValue: true }),
    defineField({ name: 'agendaEnabled', title: 'Diffuser l’agenda', type: 'boolean', initialValue: true }),
    defineField({ name: 'customEnabled', title: 'Diffuser les diapos personnalisées', type: 'boolean', initialValue: true }),
    defineField({ name: 'weatherDuration', title: 'Durée météo (millisecondes)', type: 'number', initialValue: 20000, validation: rule => rule.required().integer().min(5000).max(120000) }),
    defineField({ name: 'agendaDuration', title: 'Durée agenda (millisecondes)', type: 'number', initialValue: 25000, validation: rule => rule.required().integer().min(5000).max(120000) }),
  ],
  preview: { prepare: () => ({ title: 'Diffusion écran du club' }) },
});
