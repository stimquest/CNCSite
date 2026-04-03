/**
 * migrate-stages.mjs
 *
 * Ce script :
 * 1. Crée les 6 documents stageDefinition dans Sanity
 * 2. Migre les 3 documents weeklyPlanning (old format → stageSlots[])
 * 3. Migre spotSettings (8 champs fixes → stageStatuses[])
 *
 * Usage : node scripts/migrate-stages.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'df7iwkkw',
  dataset: 'production',
  apiVersion: '2024-03-15',
  token: 'skKf9o96iissLxzjVESiPfJntZFEulI4l0hK6XfzFzTNHw9O3r51kokDHC4DJ3mk5UB2J30jovqRSNanQmusRRrr69zj2EWBM5wuSXfylXUrn4Mqf1FDNVV09K09iCfIcyDQCcWG6tufNYE2bqalKcKacRGFYYhReEiCh9lGYwzy75rgX52b',
  useCdn: false,
});

// ─── 1. Définition des 6 stages ─────────────────────────────────────────────

const STAGE_DEFINITIONS = [
  {
    _id: 'stage-def-mini-mousses',
    _type: 'stageDefinition',
    key: { _type: 'slug', current: 'mini-mousses' },
    label: 'Mini-Mousses',
    shortLabel: 'Mini-M.',
    vigieGroupId: 'stage-minimousses',
    order: 1,
    isActive: true,
    planningType: 'kid',
    color: 'yellow',
  },
  {
    _id: 'stage-def-moussaillons',
    _type: 'stageDefinition',
    key: { _type: 'slug', current: 'moussaillons' },
    label: 'Moussaillons',
    shortLabel: 'Moussaillons',
    vigieGroupId: 'stage-moussaillons',
    order: 2,
    isActive: true,
    planningType: 'kid',
    color: 'turquoise',
  },
  {
    _id: 'stage-def-initiation',
    _type: 'stageDefinition',
    key: { _type: 'slug', current: 'initiation' },
    label: 'Initiation',
    shortLabel: 'Initiation',
    vigieGroupId: 'stage-initiation',
    order: 3,
    isActive: true,
    planningType: 'simple',
    color: 'blue',
  },
  {
    _id: 'stage-def-perfectionnement',
    _type: 'stageDefinition',
    key: { _type: 'slug', current: 'perfectionnement' },
    label: 'Perfectionnement',
    shortLabel: 'Perf.',
    vigieGroupId: 'stage-perfectionnement',
    order: 4,
    isActive: true,
    planningType: 'simple',
    color: 'purple',
  },
  {
    _id: 'stage-def-multiglisse',
    _type: 'stageDefinition',
    key: { _type: 'slug', current: 'multiglisse' },
    label: 'Multiglisse',
    shortLabel: 'Multiglisse',
    vigieGroupId: 'stage-multiglisse',
    order: 5,
    isActive: true,
    planningType: 'simple',
    color: 'orange',
  },
  {
    _id: 'stage-def-kite',
    _type: 'stageDefinition',
    key: { _type: 'slug', current: 'kite' },
    label: 'Kite',
    shortLabel: 'Kite',
    vigieGroupId: 'stage-kite',
    order: 6,
    isActive: true,
    planningType: 'simple',
    color: 'rose',
  },
];

// ─── 2. Mapping ancien format → nouveau ─────────────────────────────────────

function migrateDay(oldDay) {
  const slots = [];

  // mini-mousses (old field: miniMousses)
  if (oldDay.miniMousses) {
    slots.push({
      _key: `slot-mini-mousses-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      stageKey: 'mini-mousses',
      time: oldDay.miniMousses.time || '',
      activity: oldDay.miniMousses.activity || 'optimist',
      description: oldDay.miniMousses.description || '',
    });
  }

  // moussaillons (old field: mousses)
  if (oldDay.mousses) {
    slots.push({
      _key: `slot-moussaillons-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      stageKey: 'moussaillons',
      time: oldDay.mousses.time || '',
      activity: oldDay.mousses.activity || 'optimist',
      description: oldDay.mousses.description || '',
    });
  }

  // initiation
  if (oldDay.initiation) {
    slots.push({
      _key: `slot-initiation-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      stageKey: 'initiation',
      time: oldDay.initiation,
    });
  }

  // perfectionnement
  if (oldDay.perfectionnement) {
    slots.push({
      _key: `slot-perfectionnement-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      stageKey: 'perfectionnement',
      time: oldDay.perfectionnement,
    });
  }

  // multiglisse and kite — empty slots (to be filled later by the admin)
  slots.push({
    _key: `slot-multiglisse-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    stageKey: 'multiglisse',
    time: '',
  });
  slots.push({
    _key: `slot-kite-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    stageKey: 'kite',
    time: '',
  });

  return {
    _key: oldDay._key,
    name: oldDay.name,
    date: oldDay.date,
    isRaidDay: oldDay.isRaidDay || false,
    raidStageKey: oldDay.raidTarget && oldDay.raidTarget !== 'none'
      ? (oldDay.raidTarget === 'mousses' ? 'moussaillons' : oldDay.raidTarget === 'miniMousses' ? 'mini-mousses' : oldDay.raidTarget)
      : '',
    stageSlots: slots,
  };
}

// ─── 3. Migration spotSettings ───────────────────────────────────────────────

function buildStageStatuses(oldSettings) {
  return [
    {
      _key: 'status-mini-mousses',
      stageKey: 'mini-mousses',
      status: oldSettings.stagesMiniMoussesStatus || 'OPEN',
      message: oldSettings.stagesMiniMoussesMessage || '',
    },
    {
      _key: 'status-moussaillons',
      stageKey: 'moussaillons',
      status: oldSettings.stagesMoussaillonsStatus || 'OPEN',
      message: oldSettings.stagesMoussaillonsMessage || '',
    },
    {
      _key: 'status-initiation',
      stageKey: 'initiation',
      status: oldSettings.stagesInitiationStatus || 'OPEN',
      message: oldSettings.stagesInitiationMessage || '',
    },
    {
      _key: 'status-perfectionnement',
      stageKey: 'perfectionnement',
      status: oldSettings.stagesPerfStatus || 'OPEN',
      message: oldSettings.stagesPerfMessage || '',
    },
    {
      _key: 'status-multiglisse',
      stageKey: 'multiglisse',
      status: 'INACTIVE',
      message: '',
    },
    {
      _key: 'status-kite',
      stageKey: 'kite',
      status: 'INACTIVE',
      message: '',
    },
  ];
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Migration stages — début\n');

  // 1. Créer les stageDefinition
  console.log('📋 Étape 1 : Création des stageDefinition...');
  for (const def of STAGE_DEFINITIONS) {
    await client.createOrReplace(def);
    console.log(`  ✅ ${def.label} (${def._id})`);
  }

  // 2. Migrer les weeklyPlanning
  console.log('\n📅 Étape 2 : Migration des weeklyPlanning...');
  const plannings = await client.fetch(
    `*[_type == "weeklyPlanning"] | order(startDate asc) { _id, _rev, title, startDate, endDate, isPublished, days[] }`
  );

  for (const planning of plannings) {
    const migratedDays = (planning.days || []).map(migrateDay);
    await client
      .patch(planning._id)
      .set({ days: migratedDays })
      .commit();
    console.log(`  ✅ ${planning.title} (${planning._id}) — ${migratedDays.length} jours migrés`);
  }

  // 3. Migrer spotSettings
  console.log('\n⚙️  Étape 3 : Migration spotSettings...');
  const SINGLETON_ID = 'singleton-spot-settings';
  const settings = await client.fetch(
    `*[_type == "spotSettings" && _id == $id][0]`,
    { id: SINGLETON_ID }
  );

  if (settings) {
    const stageStatuses = buildStageStatuses(settings);
    await client
      .patch(SINGLETON_ID)
      .set({ stageStatuses })
      // Supprimer les anciens champs fixes
      .unset([
        'stagesMiniMoussesStatus', 'stagesMiniMoussesMessage',
        'stagesMoussaillonsStatus', 'stagesMoussaillonsMessage',
        'stagesInitiationStatus', 'stagesInitiationMessage',
        'stagesPerfStatus', 'stagesPerfMessage',
      ])
      .commit();
    console.log(`  ✅ spotSettings migré — ${stageStatuses.length} statuts de stages`);
  } else {
    console.log('  ⚠️  spotSettings introuvable — création avec valeurs par défaut...');
    await client.createOrReplace({
      _id: SINGLETON_ID,
      _type: 'spotSettings',
      spotStatus: 'OPEN',
      stageStatuses: buildStageStatuses({}),
    });
    console.log('  ✅ spotSettings créé');
  }

  console.log('\n🎉 Migration terminée avec succès !');
  console.log('\nProchaines étapes :');
  console.log('  → Vérifier les stageDefinitions dans Sanity Studio');
  console.log('  → Saisir les horaires Multiglisse et Kite dans la Page Admin → Stages');
  console.log('  → Déployer le site pour que les changements de code prennent effet');
}

main().catch(err => {
  console.error('❌ Erreur migration:', err);
  process.exit(1);
});
