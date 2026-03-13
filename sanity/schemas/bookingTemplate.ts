import { defineType, defineField } from 'sanity';

export const bookingTemplate = defineType({
  name: 'bookingTemplate',
  title: 'Modèle de réservation',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du modèle (Interne)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Nom utilisé pour choisir le modèle dans la liste (ex: "Location Kayak")'
    }),
    defineField({
      name: 'modalTitle',
      title: 'Titre de la fenêtre (Public)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Affiché en haut de la fenêtre modale (ex: "Location sur réservation")'
    }),
    defineField({
      name: 'content',
      title: 'Message',
      type: 'array',
      of: [{ 
        type: 'block', 
        styles: [], 
        lists: [], 
        marks: { 
          decorators: [
            { title: 'Gras', value: 'strong' }
          ] 
        } 
      }],
      validation: (Rule) => Rule.required(),
      description: 'Le texte explicatif qui s\'affichera dans la fenêtre'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'modalTitle'
    }
  }
});
