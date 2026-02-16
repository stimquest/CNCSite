import { defineType, defineField } from 'sanity';

export const vibeMessage = defineType({
    name: 'vibeMessage',
    title: 'Messages Vibe Check',
    type: 'document',
    icon: () => '🤙',
    fields: [
        defineField({
            name: 'title',
            title: 'Titre du Vibe (ex: "Session Glisse !")',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Message / Sous-titre',
            type: 'text',
            rows: 2,
            description: 'Petit texte d\'accroche ou conseil.',
        }),
        defineField({
            name: 'conditionType',
            title: 'Type de Condition Principale',
            type: 'string',
            options: {
                list: [
                    { title: 'Défaut (Toujours valide si rien d\'autre)', value: 'default' },
                    { title: 'Vent Fort (> 15 nds)', value: 'wind_high' },
                    { title: 'Vent Léger (< 10 nds)', value: 'wind_low' },
                    { title: 'Grand Soleil', value: 'sunny' },
                    { title: 'Marée Haute', value: 'tide_high' },
                    { title: 'Marée Basse (Char à voile)', value: 'tide_low' },
                    { title: 'Tempête / Mauvais temps', value: 'storm' },
                ],
            },
            initialValue: 'default',
        }),
        defineField({
            name: 'minWind',
            title: 'Vent Minimum (Noeuds) - Optionnel',
            type: 'number',
        }),
        defineField({
            name: 'maxWind',
            title: 'Vent Maximum (Noeuds) - Optionnel',
            type: 'number',
        }),
        defineField({
            name: 'windDirection',
            title: 'Direction du Vent (Optionnel)',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Nord', value: 'N' },
                    { title: 'Nord-Est', value: 'NE' },
                    { title: 'Est', value: 'E' },
                    { title: 'Sud-Est', value: 'SE' },
                    { title: 'Sud', value: 'S' },
                    { title: 'Sud-Ouest', value: 'SO' },
                    { title: 'Ouest', value: 'O' },
                    { title: 'Nord-Ouest', value: 'NO' },
                ]
            }
        }),
        defineField({
            name: 'priority',
            title: 'Priorité (1-100)',
            type: 'number',
            description: 'Si plusieurs messages correspondent, celui avec la plus haute priorité s\'affiche. 100 = Urgent/Top.',
            initialValue: 50,
        }),
        defineField({
            name: 'isActive',
            title: 'Actif',
            type: 'boolean',
            initialValue: true,
        })
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'conditionType',
            active: 'isActive'
        },
        prepare({ title, subtitle, active }) {
            return {
                title: title,
                subtitle: `${active ? '🟢' : '🔴'} [${subtitle}]`,
            }
        }
    }
});
