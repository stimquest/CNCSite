import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9v7nk22c',
  dataset: 'production',
  apiVersion: '2024-03-01',
  token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
  useCdn: false,
});

// --- TOUTES LES ACTIVITÉS (depuis constants.ts) ---
const ALL_ACTIVITIES = [
  { id: 'char-a-voile', title: 'Char à Voile', category: 'GLISSE', price: "45€", minAge: 8, duration: "2h", isTideDependent: true },
  { id: 'kite-surf', title: 'Kite Surf', category: 'GLISSE', price: "110€", minAge: 14, duration: "3h", isTideDependent: true },
  { id: 'wing-foil', title: 'Wing Foil', category: 'GLISSE', price: "95€", minAge: 12, duration: "2h", isTideDependent: false },
  { id: 'catamaran', title: 'Catamaran', category: 'VOILE', price: "55€", minAge: 8, duration: "2h", isTideDependent: false },
  { id: 'mini-mousses', title: 'Mini-Mousses', category: 'PLAGE', price: "175€", minAge: 5, duration: "2h30", isTideDependent: false },
  { id: 'moussaillons', title: 'Moussaillons', category: 'PLAGE', price: "175€", minAge: 7, duration: "3h", isTideDependent: false },
  { id: 'planche-a-voile', title: 'Planche à Voile', category: 'VOILE', price: "45€", minAge: 10, duration: "2h", isTideDependent: false },
  { id: 'trimaran', title: 'Trimaran', category: 'VOILE', price: "40€", minAge: 6, duration: "2h", isTideDependent: false },
  { id: 'sup', title: 'Stand Up Paddle', category: 'LOCATION', price: "15€", minAge: 10, duration: "1h", isTideDependent: false },
  { id: 'kayak', title: 'Kayak de Mer', category: 'LOCATION', price: "15€", minAge: 8, duration: "1h", isTideDependent: false },
  { id: 'speed-sail', title: 'Speed Sail', category: 'GLISSE', price: "40€", minAge: 12, duration: "1h30", isTideDependent: true },
  { id: 'cerf-volant', title: 'Cerf-Volant', category: 'PLAGE', price: "25€", minAge: 6, duration: "1h30", isTideDependent: false },
  { id: 'marche-aquatique', title: 'Longe-Côte', category: 'VOILE', price: "15€", minAge: 16, duration: "1h", isTideDependent: false },
  { id: 'sauvetage', title: 'Sauvetage et Secourisme', category: 'VOILE', price: "Dès 60€", minAge: 14, duration: "Variable", isTideDependent: false }
];

// --- TOUTE LA FLOTTE (depuis club/page.tsx) ---
const ALL_FLEET = [
  { id: 'cata', name: 'Catamaran', subtitle: 'La Référence', stats: { speed: 95, difficulty: 60, adrenaline: 90 }, crew: "Solo / Double" },
  { id: 'char', name: 'Char à Voile', subtitle: 'Vitesse Pure', stats: { speed: 85, difficulty: 40, adrenaline: 80 }, crew: "Monoplace" },
  { id: 'wing', name: 'Wing & Kite', subtitle: 'Nouvelle Vague', stats: { speed: 70, difficulty: 95, adrenaline: 100 }, crew: "Solo" },
  { id: 'windsurf', name: 'Windsurf', subtitle: 'L\'Originale', stats: { speed: 75, difficulty: 70, adrenaline: 85 }, crew: "Solo" },
  { id: 'collectif', name: 'Habitables', subtitle: 'Esprit Équipage', stats: { speed: 45, difficulty: 30, adrenaline: 40 }, crew: "4-6 pers" },
  { id: 'paddles', name: 'Paddles', subtitle: 'Exploration', stats: { speed: 20, difficulty: 20, adrenaline: 30 }, crew: "1-8 pers" }
];

// --- LES ACTUALITÉS (depuis le Bento Grid de l'accueil) ---
const INITIAL_NEWS = [
  { id: 'news-1', title: "Victoire de l'équipe au Grand Prix !", category: "Sport", date: "Il y a 2h" },
  { id: 'news-2', title: "Soirée Moules-Frites : Inscriptions", category: "Club", date: "Hier" },
  { id: 'news-3', title: "Arrivée des nouvelles combinaisons", category: "Matériel", date: "Il y a 2j" }
];

async function fullMigration() {
    console.log("🚀 Lancement de la migration COMPLÈTE...");

    // 1. Activités
    for (const act of ALL_ACTIVITIES) {
        console.log(`📦 Activité : ${act.title}`);
        await client.createOrReplace({
            _id: `activity-${act.id}`,
            _type: 'activity',
            ...act,
            description: act.description || "Description à compléter dans le Studio."
        });
    }

    // 2. Flotte
    for (const item of ALL_FLEET) {
        console.log(`⛵ Flotte : ${item.name}`);
        await client.createOrReplace({
            _id: `fleet-${item.id}`,
            _type: 'fleetItem',
            ...item,
            description: "Détails techniques à compléter dans le Studio."
        });
    }

    // 3. News
    for (const news of INITIAL_NEWS) {
        console.log(`📰 News : ${news.title}`);
        await client.createOrReplace({
            _id: news.id,
            _type: 'news',
            ...news,
            publishedAt: new Date().toISOString()
        });
    }

    console.log("✅ Toutes les données ont été injectées !");
}

fullMigration().catch(console.error);
