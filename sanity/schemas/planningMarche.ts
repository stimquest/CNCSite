import { defineType, defineField, defineArrayMember } from 'sanity';

export const planningMarche = defineType({
    name: 'planningMarche',
    title: 'Marche Aquatique - Planning',
    type: 'document',
    icon: () => '🚶‍♂️',
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
            title: 'Titre de la Période',
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
            name: 'weeks',
            title: 'Liste des Semaines',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'weekEntry',
                    title: 'Semaine',
                    fields: [
                        {
                            name: 'title',
                            title: 'Titre Semaine',
                            type: 'string',
                            validation: Rule => Rule.required()
                        },
                        { name: 'startDate', title: 'Début', type: 'date', validation: Rule => Rule.required() },
                        { name: 'endDate', title: 'Fin', type: 'date', validation: Rule => Rule.required() },
                        {
                            name: 'days',
                            title: '7 Jours',
                            type: 'array',
                            validation: Rule => Rule.required().min(7).max(7),
                            of: [
                                defineArrayMember({
                                    type: 'object',
                                    name: 'dayEntry',
                                    fields: [
                                        { name: 'name', title: 'Nom', type: 'string' },
                                        { name: 'date', title: 'Date', type: 'date', validation: Rule => Rule.required() },
                                        {
                                            name: 'sessions',
                                            title: 'Sessions',
                                            type: 'array',
                                            of: [{
                                                type: 'object',
                                                fields: [{ name: 'time', type: 'string', title: 'Horaire' }]
                                            }]
                                        }
                                    ],
                                    preview: { select: { title: 'name', subtitle: 'date' } }
                                })
                            ]
                        }
                    ],
                    preview: {
                        select: { title: 'title' }
                    }
                })
            ]
        })
    ],
    preview: {
        select: {
            title: 'title'
        }
    }
});
