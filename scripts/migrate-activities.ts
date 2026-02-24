/**
 * Script de migration des activités vers Sanity
 * Exécuter avec: npx tsx scripts/migrate-activities.ts
 */

import { createClient } from '@sanity/client';
import { ACTIVITIES } from '../constants';
import { readFileSync } from 'fs';

// Charger le token depuis .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const tokenMatch = envContent.match(/NEXT_PUBLIC_SANITY_WRITE_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

if (!token) {
    console.error('❌ Token Sanity non trouvé dans .env.local');
    process.exit(1);
}

const client = createClient({
    projectId: 'df7iwkkw',
    dataset: 'production',
    apiVersion: '2024-03-15',
    token: token,
    useCdn: false,
});

async function migrateActivities() {
    console.log('🚀 Début de la migration des activités...\n');

    for (const activity of ACTIVITIES) {
        console.log(`📦 Migration: ${activity.title}`);

        try {
            // Créer ou mettre à jour le document via upsert
            await client.createOrReplace({
                _id: `activity-${activity.id}`,
                _type: 'activity',
                id: activity.id,
                title: activity.title,
                category: activity.category,
                accroche: activity.accroche,
                description: activity.description,
                experience: activity.experience || null,
                pedagogie: activity.pedagogie || null,
                logistique: activity.logistique || [],
                price: activity.price || null,
                prices: activity.prices?.map((p, i) => ({
                    _key: `price-${i}`,
                    label: p.label,
                    value: p.value
                })) || [],
                isTideDependent: activity.isTideDependent,
                bookingUrl: activity.bookingUrl,
                duration: activity.duration,
                minAge: activity.minAge,
                planningNote: activity.planningNote || null,
                // Note: l'image devra être uploadée manuellement dans Sanity
            });

            console.log(`   ✅ OK`);
        } catch (error: any) {
            console.error(`   ❌ Erreur:`, error?.message || error);
        }
    }

    console.log('\n✨ Migration terminée !');
    console.log('⚠️  N\'oublie pas d\'ajouter les images manuellement dans Sanity Studio.');
}

migrateActivities();
