import { defineType, defineField } from 'sanity';

export const autoConditionsConfig = defineType({
    name: 'autoConditionsConfig',
    title: 'Config Auto-Conditions',
    type: 'document',
    icon: () => '🤖',
    // Singleton: prevent creating more than one
    fields: [
        defineField({
            name: 'enabled',
            title: 'Système automatique activé',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'checkHour',
            title: 'Heure du check (0-23)',
            type: 'number',
            initialValue: 8,
            validation: (Rule) => Rule.min(0).max(23),
        }),
        defineField({
            name: 'manualOverride',
            title: 'Override Manuel',
            description: 'Si activé, le chef de base a pris la main — l\'auto ne remplace plus.',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'lastCheck',
            title: 'Dernier check effectué',
            type: 'datetime',
        }),
        defineField({
            name: 'pendingResult',
            title: 'Résultat en attente de validation',
            description: 'Proposition auto non encore publiée. Visible dans l\'admin pour validation.',
            type: 'object',
            fields: [
                defineField({ name: 'checkedAt', title: 'Vérifié le', type: 'datetime' }),
                defineField({
                    name: 'weather',
                    title: 'Données météo brutes',
                    type: 'object',
                    fields: [
                        defineField({ name: 'windSpeed', title: 'Vent (nds)', type: 'number' }),
                        defineField({ name: 'gusts', title: 'Rafales (nds)', type: 'number' }),
                        defineField({ name: 'waveHeight', title: 'Houle (m)', type: 'number' }),
                        defineField({ name: 'wavePeriod', title: 'Période houle (s)', type: 'number' }),
                        defineField({ name: 'cape', title: 'CAPE (orage)', type: 'number' }),
                        defineField({ name: 'visibility', title: 'Visibilité (m)', type: 'number' }),
                        defineField({ name: 'waterTemp', title: 'Temp eau (°C)', type: 'number' }),
                    ],
                }),
                defineField({
                    name: 'results',
                    title: 'Résultats par activité',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'char',
                            title: 'Char à Voile',
                            type: 'object',
                            fields: [
                                defineField({ name: 'status', title: 'Statut', type: 'string' }),
                                defineField({ name: 'message', title: 'Message', type: 'string' }),
                                defineField({ name: 'causes', title: 'Causes', type: 'array', of: [{ type: 'string' }] }),
                            ],
                        }),
                        defineField({
                            name: 'nautique',
                            title: 'Sports Nautiques',
                            type: 'object',
                            fields: [
                                defineField({ name: 'status', title: 'Statut', type: 'string' }),
                                defineField({ name: 'message', title: 'Message', type: 'string' }),
                                defineField({ name: 'causes', title: 'Causes', type: 'array', of: [{ type: 'string' }] }),
                            ],
                        }),
                        defineField({
                            name: 'marche',
                            title: 'Marche Aquatique',
                            type: 'object',
                            fields: [
                                defineField({ name: 'status', title: 'Statut', type: 'string' }),
                                defineField({ name: 'message', title: 'Message', type: 'string' }),
                                defineField({ name: 'causes', title: 'Causes', type: 'array', of: [{ type: 'string' }] }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'activities',
            title: 'Configuration par activité',
            type: 'object',
            fields: [
                defineField({
                    name: 'char',
                    title: 'Char à Voile',
                    type: 'object',
                    fields: [
                        defineField({ name: 'enabled', title: 'Activé', type: 'boolean', initialValue: true }),
                        defineField({
                            name: 'thresholds',
                            title: 'Seuils',
                            type: 'object',
                            fields: [
                                defineField({ name: 'windClosedAbove', title: 'Vent — Fermer si >', type: 'number' }),
                                defineField({ name: 'windClosedBelow', title: 'Vent — Fermer si <', type: 'number' }),
                                defineField({ name: 'windRestrictedAbove', title: 'Vent — Restreindre si >', type: 'number' }),
                                defineField({ name: 'windRestrictedBelow', title: 'Vent — Restreindre si <', type: 'number' }),
                                defineField({ name: 'gustsRestrictedAbove', title: 'Rafales — Restreindre si >', type: 'number' }),
                                defineField({ name: 'gustsClosedAbove', title: 'Rafales — Fermer si >', type: 'number' }),
                                defineField({ name: 'waveHeightRestrictedAbove', title: 'Houle — Restreindre si >', type: 'number' }),
                                defineField({ name: 'waveHeightClosedAbove', title: 'Houle — Fermer si >', type: 'number' }),
                                defineField({ name: 'capeClosedAbove', title: 'CAPE — Fermer si >', type: 'number' }),
                            ],
                        }),
                        defineField({
                            name: 'messages',
                            title: 'Messages automatiques',
                            type: 'object',
                            fields: [
                                defineField({ name: 'ok', title: '✅ Conditions OK', type: 'string' }),
                                defineField({ name: 'wind_high', title: '💨 Vent fort', type: 'string' }),
                                defineField({ name: 'wind_low', title: '🍃 Vent faible', type: 'string' }),
                                defineField({ name: 'waves', title: '🌊 Houle', type: 'string' }),
                                defineField({ name: 'storm', title: '⚡ Orage', type: 'string' }),
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: 'nautique',
                    title: 'Sports Nautiques',
                    type: 'object',
                    fields: [
                        defineField({ name: 'enabled', title: 'Activé', type: 'boolean', initialValue: true }),
                        defineField({
                            name: 'thresholds',
                            title: 'Seuils',
                            type: 'object',
                            fields: [
                                defineField({ name: 'windClosedAbove', type: 'number', title: 'Vent — Fermer si >' }),
                                defineField({ name: 'windRestrictedAbove', type: 'number', title: 'Vent — Restreindre si >' }),
                                defineField({ name: 'gustsRestrictedAbove', type: 'number', title: 'Rafales — Restreindre si >' }),
                                defineField({ name: 'gustsClosedAbove', type: 'number', title: 'Rafales — Fermer si >' }),
                                defineField({ name: 'waveHeightRestrictedAbove', type: 'number', title: 'Houle — Restreindre si >' }),
                                defineField({ name: 'waveHeightClosedAbove', type: 'number', title: 'Houle — Fermer si >' }),
                                defineField({ name: 'capeClosedAbove', type: 'number', title: 'CAPE — Fermer si >' }),
                            ],
                        }),
                        defineField({
                            name: 'messages',
                            title: 'Messages automatiques',
                            type: 'object',
                            fields: [
                                defineField({ name: 'ok', type: 'string', title: '✅ Conditions OK' }),
                                defineField({ name: 'wind_high', type: 'string', title: '💨 Vent fort' }),
                                defineField({ name: 'waves', type: 'string', title: '🌊 Houle' }),
                                defineField({ name: 'storm', type: 'string', title: '⚡ Orage' }),
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: 'marche',
                    title: 'Marche Aquatique',
                    type: 'object',
                    fields: [
                        defineField({ name: 'enabled', title: 'Activé', type: 'boolean', initialValue: true }),
                        defineField({
                            name: 'thresholds',
                            title: 'Seuils',
                            type: 'object',
                            fields: [
                                defineField({ name: 'windClosedAbove', type: 'number', title: 'Vent — Fermer si >' }),
                                defineField({ name: 'windRestrictedAbove', type: 'number', title: 'Vent — Restreindre si >' }),
                                defineField({ name: 'waveHeightClosedAbove', type: 'number', title: 'Houle — Fermer si >' }),
                                defineField({ name: 'capeClosedAbove', type: 'number', title: 'CAPE — Fermer si >' }),
                                defineField({ name: 'waterTempClosedBelow', type: 'number', title: 'Eau — Fermer si <' }),
                                defineField({ name: 'waterTempRestrictedBelow', type: 'number', title: 'Eau — Restreindre si <' }),
                            ],
                        }),
                        defineField({
                            name: 'messages',
                            title: 'Messages automatiques',
                            type: 'object',
                            fields: [
                                defineField({ name: 'ok', type: 'string', title: '✅ Conditions OK' }),
                                defineField({ name: 'wind_high', type: 'string', title: '💨 Vent fort' }),
                                defineField({ name: 'waves', type: 'string', title: '🌊 Mer forte' }),
                                defineField({ name: 'cold', type: 'string', title: '🌡️ Eau froide' }),
                                defineField({ name: 'storm', type: 'string', title: '⚡ Orage' }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ],
    preview: {
        select: {
            enabled: 'enabled',
            lastCheck: 'lastCheck',
        },
        prepare({ enabled, lastCheck }) {
            const date = lastCheck ? new Date(lastCheck).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'jamais';
            return {
                title: `🤖 Auto-Conditions — ${enabled ? 'Actif' : 'Désactivé'}`,
                subtitle: `Dernier check : ${date}`,
            };
        },
    },
});
