import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9v7nk22c',
  dataset: 'production',
  apiVersion: '2024-03-01',
  token: 'skkRRG7TdeZsapsyDOYBMDR3xitKHTzFw9Xv4o3Sk4CPzMK7LRHKtV8mxRi2768mIEBhJdTzBHry8EwQNuoBT03R5FRg0YOAXhUEXZrUrGtNqHwBZmfnWBITW2C0kSHaSk6FjfJRV4Ov4HlXrX9mzkQkF8jLJ8TFwL4xNPv4Gnpsm9JAymxl',
  useCdn: false,
});

const ACTIVITIES = [
  {
    id: 'char-a-voile',
    title: 'Char à Voile',
    category: 'GLISSE',
    description: "Le sport emblématique de Coutainville pour tous les amateurs de sensations.",
    experience: "Profitez des immenses plages de sable fin d'Agon-Coutainville pour découvrir des sensations de vitesse immédiates.",
    pedagogie: "Le pilotage est extrêmement intuitif. On utilise un palonnier au niveau des pieds.",
    logistique: "Séance de 2h au total (30 min préparation + 1h30 roulage)",
    price: "45€",
    isTideDependent: true,
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=2",
    duration: "2h",
    minAge: 8
  },
  {
    id: 'kite-surf',
    title: 'Kite Surf',
    category: 'GLISSE',
    description: "École labellisée AF Kite avec liaison radio moniteur.",
    experience: "Glissez sur l'eau tracté par une aile. Une discipline spectaculaire qui demande de la technique et de la patience.",
    pedagogie: "L'enseignement est progressif. Étape 1 : Analyse de la zone de pratique et de la météo.",
    logistique: "Dès 14 ans, Licence AF Kite obligatoire, Savoir nager 50m minimum",
    price: "110€",
    isTideDependent: true,
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=4",
    duration: "3h",
    minAge: 14
  },
  {
      id: 'catamaran',
      title: 'Catamaran',
      category: 'VOILE',
      description: "Flotte Hobie Cat adaptée à tous les âges et niveaux.",
      experience: "Naviguer sur deux coques offre une stabilité et une vitesse incomparables.",
      pedagogie: "Maîtrise des différentes allures (près, portant, travers).",
      logistique: "Savoir nager 25m avec gilet, Chaussures fermées",
      price: "55€",
      isTideDependent: false,
      bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=1",
      duration: "2h",
      minAge: 8
  }
];

const TEAM = [
    { name: "Jean-Pierre Marin", role: "Président", category: "bureau", order: 1 },
    { name: "Marie Loic", role: "Trésorière", category: "bureau", order: 2 },
    { name: "Paul Dubreuil", role: "Secrétaire", category: "bureau", order: 3 },
    { name: "Sophie Mer", role: "Resp. Sportif", category: "bureau", order: 4 },
    { name: "Thomas Lechef", role: "Chef de Base", category: "pro", diplome: "BPJEPS Voile & Char", order: 5 },
    { name: "Sarah Voile", role: "Monitrice Cata", category: "pro", diplome: "CQP AMV", order: 6 },
    { name: "Lucas Wind", role: "Moniteur Char", category: "pro", diplome: "BPJEPS Char à Voile", order: 7 }
];

const FLEET = [
    {
      name: 'Catamaran',
      subtitle: 'La Référence',
      description: "Du Topaz 10 pour l'initiation au Hobie Cat 16 pour la performance.",
      stats: { speed: 95, difficulty: 60, adrenaline: 90 },
      crew: "Solo / Double"
    },
    {
      name: 'Char à Voile',
      subtitle: 'Vitesse Pure',
      description: "Pilotez au ras du sable. Accélération immédiate dès 8 ans.",
      stats: { speed: 85, difficulty: 40, adrenaline: 80 },
      crew: "Monoplace"
    }
];

async function migrate() {
    console.log("🚀 Lancement de la migration...");

    // 1. Activités
    for (const act of ACTIVITIES) {
        console.log(`📦 Import activité : ${act.title}`);
        await client.createOrReplace({
            _id: `activity-${act.id}`,
            _type: 'activity',
            ...act
        });
    }

    // 2. Équipe
    for (const member of TEAM) {
        console.log(`👥 Import équipe : ${member.name}`);
        await client.create({
            _type: 'teamMember',
            ...member
        });
    }

    // 3. Flotte
    for (const item of FLEET) {
        console.log(`⛵ Import flotte : ${item.name}`);
        await client.create({
            _type: 'fleetItem',
            ...item
        });
    }

    // 4. Initial Spot Settings
    console.log("🚩 Configuration du Spot...");
    await client.createIfNotExists({
        _id: 'singleton-spot-settings',
        _type: 'spotSettings',
        spotStatus: 'OPEN',
        statusMessage: "Plan d'eau calme, idéal pour le Paddle",
        lastUpdated: new Date().toISOString()
    });

    console.log("✅ Migration terminée !");
}

migrate().catch(console.error);
