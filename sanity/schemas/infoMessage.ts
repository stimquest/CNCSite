import { defineType, defineField } from 'sanity';

export const infoMessage = defineType({
    name: 'infoMessage',
    title: 'La Vigie (Direct)',
    type: 'document',
    icon: () => '📢',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre du message',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Contenu du message',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Catégorie',
            type: 'string',
            options: {
                list: [
                    { title: '🚨 Alerte / Urgent', value: 'alert' },
                    { title: '🌦️ Météo / Conditions', value: 'weather' },
                    { title: 'ℹ️ Information', value: 'info' },
                    { title: '🎉 Événement', value: 'event' },
                    { title: '🤙 Ambiance / Vie du Club', value: 'vibe' },
                ],
            },
            initialValue: 'info',
        }),
        defineField({
            name: 'targetGroups',
            title: 'Groupes ciblés',
            description: 'Sélectionnez les groupes qui recevront la notification push.',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Tous les abonnés', value: 'all' },
                    { title: 'Stages - Mini-Mousses', value: 'stage-minimousses' },
                    { title: 'Stages - Moussaillons', value: 'stage-moussaillons' },
                    { title: 'Stages - Initiation', value: 'stage-initiation' },
                    { title: 'Stages - Perfectionnement', value: 'stage-perfectionnement' },
                    { title: 'Club Sportif', value: 'club-sportif' },
                    { title: 'Char à Voile', value: 'char-voile' },
                    { title: 'Glisses (Kite/Wing)', value: 'glisses' },
                ],
            },
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Date de publication',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'isPinned',
            title: 'Épinglé',
            description: 'Maintenir ce message en haut du fil.',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'sendPush',
            title: '🚀 Envoyer une Notification Push',
            description: 'Si activé, une notification sera envoyée via OneSignal lors de la publication.',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'externalLink',
            title: 'Lien Externe (Optionnel)',
            description: 'Lien vers un post Facebook ou une page de détail.',
            type: 'url',
        })
    ],
    preview: {
        select: {
            title: 'title',
            category: 'category',
            publishedAt: 'publishedAt',
            isPinned: 'isPinned',
            push: 'sendPush',
        },
        prepare({ title, category, publishedAt, isPinned, push }) {
            const date = new Date(publishedAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
            const icon = isPinned ? '📌' : (push ? '🚀' : '📝');
            return {
                title: `${icon} ${title}`,
                subtitle: `[${category}] - ${date}`,
            };
        },
    },
    orderings: [
        {
            title: 'Plus récents',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
});
