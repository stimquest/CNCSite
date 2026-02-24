// Script de seed : pousse les activités hardcodées dans le nouveau projet Sanity
// Usage: node scripts/seed-sanity.mjs

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'df7iwkkw',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-15',
    token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});

const ACTIVITIES = [
    {
        id: 'char-a-voile',
        title: 'Char à Voile',
        category: 'sensations',
        accroche: "Vitesse pure au ras du sable sur 10km de liberté.",
        experience: "Profitez des immenses plages de sable fin d'Agon-Coutainville pour découvrir des sensations de vitesse immédiates.",
        pedagogie: "Le pilotage est extrêmement intuitif. On utilise un palonnier au niveau des pieds pour diriger la roue avant et une écoute (corde) tenue à la main pour border la voile et capter la puissance du vent.",
        description: "Le sport emblématique de Coutainville pour tous les amateurs de sensations.",
        logistique: ["Séance de 2h au total (30 min préparation + 1h30 roulage)", "Chaussures fermées OBLIGATOIRES (type baskets)", "Vêtements de sport (sable/humidité)", "Coupe-vent", "Gants vivement recommandés", "Casque fourni par le club"],
        prices: [{ label: "Séance Découverte (2h)", value: "45€" }, { label: "Stage 3 jours", value: "120€" }, { label: "Stage 5 jours", value: "185€" }],
        minAge: 8,
        isTideDependent: true,
        planningNote: "Lundi 16 février:14h - 16h|Mardi 17 février:14h30 - 16h30|Mercredi 18 février:14h30 - 16h30",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=2",
        duration: "2h",
        price: "45€",
        order: 1
    },
    {
        id: 'kite-surf',
        title: 'Kite Surf',
        category: 'sensations',
        accroche: "Domptez les éléments entre ciel et mer.",
        experience: "Glissez sur l'eau tracté par une aile. Une discipline spectaculaire qui demande de la technique et de la patience.",
        pedagogie: "L'enseignement est progressif : phase plage, puis eau, puis waterstart.",
        description: "École labellisée AF Kite avec liaison radio moniteur.",
        logistique: ["Dès 14 ans", "Licence AF Kite obligatoire (environ 24€)", "Savoir nager 50m minimum", "Sécurité optimisée par liaison radio", "Combinaison et matériel de sécurité fournis"],
        prices: [{ label: "Séance 3h", value: "110€" }, { label: "Stage 3 séances", value: "310€" }, { label: "Stage 5 séances", value: "480€" }],
        minAge: 14,
        isTideDependent: true,
        planningNote: "Activite saisonnière (Avril à Novembre). Séances de 3h dépendantes de la force du vent (12 à 25 nœuds).",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=4",
        duration: "3h",
        price: "110€",
        order: 2
    },
    {
        id: 'wing-foil',
        title: 'Wing Foil',
        category: 'sensations',
        accroche: "Volez au-dessus de l'eau avec une liberté totale.",
        experience: "La toute dernière innovation nautique. Vous tenez une aile gonflable légère à bout de bras et vous évoluez sur une planche équipée d'un foil.",
        pedagogie: "Apprentissage de la manipulation de l'aile sur la plage, puis équilibre sur une planche stable, enfin travail sur le vol avec le foil.",
        description: "Volez sur l'eau avec la révolution wingfoil.",
        logistique: ["Casque et gilet fournis", "Combinaison intégrale fournie", "Chaussons néoprène conseillés"],
        prices: [{ label: "Séance 2h", value: "95€" }, { label: "Pack 3 séances", value: "260€" }],
        minAge: 12,
        isTideDependent: false,
        planningNote: "Pratique d'Avril à Octobre. Nécessite un vent régulier.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=9",
        duration: "2h",
        price: "95€",
        order: 3
    },
    {
        id: 'catamaran',
        title: 'Catamaran',
        category: 'voile',
        accroche: "Vitesse et équilibre sur deux coques.",
        experience: "Naviguer sur deux coques offre une stabilité et une vitesse incomparables. Flotte Hobie Cat 10, 12, 14 et 16 pieds.",
        pedagogie: "Maîtrise des différentes allures, apprentissage des manœuvres (virement de bord, empannage) et pour les plus expérimentés, utilisation du trapèze et du spinnaker.",
        description: "Flotte Hobie Cat adaptée à tous les âges et niveaux.",
        logistique: ["Savoir nager 25m avec gilet", "Chaussures fermées ou vieilles baskets", "Lunettes de soleil avec cordon"],
        prices: [{ label: "Séance 2h", value: "55€" }, { label: "Stage 5 jours (3h par séance)", value: "215€" }],
        minAge: 8,
        isTideDependent: false,
        planningNote: "Stages pendant les vacances scolaires. École de voile les mercredis et samedis hors vacances.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=1",
        duration: "2h",
        price: "55€",
        order: 4
    },
    {
        id: 'mini-mousses',
        title: 'Mini-Mousses',
        category: 'jeunesse',
        accroche: "L'éveil marin en douceur pour les petits.",
        experience: "Un premier contact avec la mer tout en douceur pour les plus jeunes (5-7 ans).",
        pedagogie: "Séance en piscine, construction de cerf-volant, pêche à pied et première découverte de l'Optimist.",
        description: "Spécialement conçu pour l'éveil des 5-7 ans.",
        logistique: ["Uniquement pendant les vacances scolaires (Juillet/Août)", "Change complet obligatoire", "Goûter et gourde à prévoir", "Crème solaire déjà appliquée"],
        prices: [{ label: "Stage 5 demi-journées", value: "175€" }],
        minAge: 5,
        isTideDependent: false,
        planningNote: "Stages de 5 jours, le matin (9h30-12h) ou l'après-midi (14h-16h30). Uniquement Juillet/Août.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=5",
        duration: "2h30",
        price: "175€",
        order: 5
    },
    {
        id: 'moussaillons',
        title: 'Moussaillons',
        category: 'jeunesse',
        accroche: "Le premier pas vers l'aventure maritime.",
        experience: "Pour les enfants de 7-8 ans qui ont déjà un pied marin ou qui veulent apprendre plus activement.",
        pedagogie: "Initiation à l'Optimist, char à voile, paddle géant collectif.",
        description: "L'étape charnière vers l'autonomie pour les 7-8 ans.",
        logistique: ["7 à 8 ans uniquement", "Vêtements de rechange", "Chaussures d'eau obligatoire", "Goûter à prévoir"],
        prices: [{ label: "Stage 5 demi-journées", value: "175€" }],
        minAge: 7,
        isTideDependent: false,
        planningNote: "Stages 5 jours pendant les vacances scolaires. Séances de 2h30 ou 3h selon la saison.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=5",
        duration: "3h",
        price: "175€",
        order: 6
    },
    {
        id: 'planche-a-voile',
        title: 'Planche à Voile',
        category: 'voile',
        accroche: "L'équilibre parfait entre la force et le vent.",
        experience: "Le windsurf classique avec du matériel moderne (planches larges et voiles légères).",
        pedagogie: "Apprendre à relever la voile, trouver l'équilibre, orienter et réussir ses premiers virements de bord.",
        description: "Du débutant au funboard avec matériel moderne léger.",
        logistique: ["Combinaison fournie", "Savoir nager obligatoire", "Chaussons néoprène conseillés"],
        prices: [{ label: "Séance 2h", value: "45€" }, { label: "Stage 5 jours", value: "185€" }],
        minAge: 10,
        isTideDependent: false,
        planningNote: "Stages d'été et d'automne. Cours particuliers sur demande au printemps.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=3",
        duration: "2h",
        price: "45€",
        order: 7
    },
    {
        id: 'trimaran',
        title: 'Trimaran',
        category: 'voile',
        accroche: "Navigation stable, rapide et collective.",
        experience: "Navigation stable, rapide et collective. Idéal pour découvrir la côte en famille. Sorties découvertes encadrées par un skipper.",
        pedagogie: "Découverte de la navigation côtière accompagnée par un skipper qualifié.",
        description: "Sorties découvertes encadrées par un skipper qualifié.",
        logistique: ["Capacité 6 personnes", "Gilet fourni", "Réservation conseillée 48h à l'avance", "Chaussures fermées"],
        prices: [{ label: "Séance collective 2h", value: "40€" }, { label: "Sortie Privatisée", value: "180€" }],
        minAge: 6,
        isTideDependent: false,
        planningNote: "Saison estivale (juillet/août). Accessible selon marées.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=1",
        duration: "2h",
        price: "40€",
        order: 8
    },
    {
        id: 'sup',
        title: 'Stand Up Paddle',
        category: 'bien-etre',
        accroche: "Balade silencieuse et renforcement postural.",
        experience: "Debout sur une grande planche, avancez à l'aide d'une pagaie. Balades tranquilles ou sportives. Location individuelle ou 'Paddle Géant' (jusqu'à 7 personnes).",
        pedagogie: "Gestion de l'équilibre, technique de rame et navigation en fonction du courant.",
        description: "Location individuelle ou Paddle Géant collectif.",
        logistique: ["Location 1h ou 2h", "Gilet obligatoire", "Pochette étanche fournie"],
        prices: [{ label: "1h Location", value: "15€" }, { label: "2h Location", value: "25€" }, { label: "Séance encadrée", value: "25€" }],
        minAge: 10,
        isTideDependent: false,
        planningNote: "Location possible d'Avril à Septembre. Pratique idéale à pleine mer par vent faible.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=6",
        duration: "1h",
        price: "15€",
        order: 9
    },
    {
        id: 'kayak',
        title: 'Kayak de Mer',
        category: 'bien-etre',
        accroche: "L'exploration côtière en toute simplicité.",
        experience: "Embarquez seul ou à deux pour explorer le littoral. Kayaks stables et auto-videurs.",
        pedagogie: "Prise en main des pagaies doubles, gestion de la direction et sécurité en mer.",
        description: "Embarcations insubmersibles pour explorer le littoral.",
        logistique: ["Gilets de sauvetage fournis", "Prévoir une tenue qui ne craint pas l'eau", "Bidon étanche inclus", "Embarcation stable"],
        prices: [{ label: "1h Location", value: "15€" }, { label: "2h Location", value: "25€" }, { label: "Rando 2h", value: "30€" }],
        minAge: 8,
        isTideDependent: false,
        planningNote: "Location tous les jours en saison estivale. Hors saison : sur réservation.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=6",
        duration: "1h",
        price: "15€",
        order: 10
    },
    {
        id: 'speed-sail',
        title: 'Speed Sail',
        category: 'sensations',
        accroche: "Le skate-voile ultra rapide des plages normandes.",
        experience: "Skate-board géant équipé d'une voile de planche à voile pour glisser sur le sable dur de Coutainville.",
        pedagogie: "Demande de l'équilibre mais offre une liberté de mouvement exceptionnelle. Nécessite un vent de travers régulier.",
        description: "Version terrestre de la glisse nautique sur sable dur.",
        logistique: ["Casque et protections fournis", "Chaussures fermées OBLIGATOIRES", "Gants vivement conseillés"],
        prices: [{ label: "Séance 1h30", value: "40€" }],
        minAge: 12,
        isTideDependent: true,
        planningNote: "Pratique à marée basse uniquement.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=2",
        duration: "1h30",
        price: "40€",
        order: 11
    },
    {
        id: 'cerf-volant',
        title: 'Cerf-Volant',
        category: 'jeunesse',
        accroche: "Maîtrisez les courants aériens depuis la plage.",
        experience: "Apprivoiser le vent depuis le sol. Technique de construction et pilotage acrobatique.",
        pedagogie: "Compréhension de la fenêtre de vol, gestion de la tension des lignes et premières figures acrobatiques.",
        description: "Apprentissage du pilotage et ateliers construction.",
        logistique: ["Matériel fourni", "Casquette conseillée", "Activité de repli idéale"],
        prices: [{ label: "Séance pilotage 1h30", value: "25€" }, { label: "Atelier construction", value: "15€" }],
        minAge: 6,
        isTideDependent: false,
        planningNote: "Indépendant de la marée, se pratique sur le haut de plage.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php",
        duration: "1h30",
        price: "25€",
        order: 12
    },
    {
        id: 'marche-aquatique',
        title: 'Marche Aquatique',
        category: 'bien-etre',
        accroche: "Le fitness marin par excellence.",
        experience: "Fitness en milieu marin. On marche dans l'eau avec une immersion jusqu'à la taille. Excellent pour le renforcement musculaire et le cardio.",
        pedagogie: "Travail de foulée dans l'eau, exercices de bras et gainage dynamique.",
        description: "Renforcement musculaire et cardio en immersion.",
        logistique: ["Combinaison et chaussons obligatoires (location possible)", "Certificat médical de non-contre indication recommandé", "Gants et bonnet conseillés en hiver"],
        prices: [{ label: "Séance", value: "15€" }, { label: "Carte 10 séances", value: "120€" }],
        minAge: 16,
        isTideDependent: false,
        planningNote: "Toute l'année. Créneaux fixes. Se pratique à mi-marée.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=7",
        duration: "1h",
        price: "15€",
        order: 13
    },
    {
        id: 'sauvetage',
        title: 'SAUVETAGE ET SECOURISME',
        category: 'securite',
        accroche: "Apprendre à sauver en milieu maritime.",
        experience: "Club affilié FFSS, dédié à la formation et à la sensibilisation aux gestes de premiers secours et au sauvetage aquatique.",
        pedagogie: "Formations dispensées par des formateurs expérimentés dans un cadre pédagogique adapté à tous les niveaux.",
        description: "Formations PSC1, PSE1, PSE2 et BNSSA dispensées par des formateurs certifiés FFSS.",
        logistique: ["Lieu : Club Nautique de Coutainville", "Ouvert à tous (selon formations)", "Formateurs diplômés FFSS"],
        prices: [{ label: "Formation PSC1", value: "60€" }, { label: "Formation BNSSA", value: "Sur devis" }, { label: "Stage Sauvetage", value: "150€" }],
        minAge: 14,
        isTideDependent: false,
        planningNote: "Prochaines sessions : Selon calendrier annuel ou contact direct.",
        bookingUrl: "https://coutainville.axyomes.com/client/2-1.php",
        duration: "Variable",
        price: "Dès 60€",
        order: 14
    }
];

async function seedActivities() {
    console.log(`\n🚀 Seeding ${ACTIVITIES.length} activities into Sanity project: ${client.config().projectId}\n`);

    // Check for existing activities to avoid duplicates
    const existing = await client.fetch(`*[_type == "activity"] { id }`);
    const existingIds = new Set(existing.map(a => a.id));

    let created = 0;
    let skipped = 0;

    for (const activity of ACTIVITIES) {
        if (existingIds.has(activity.id)) {
            console.log(`  ⏭  Skipped (already exists): ${activity.title}`);
            skipped++;
            continue;
        }

        await client.create({
            _type: 'activity',
            ...activity,
        });

        console.log(`  ✅ Created: ${activity.title}`);
        created++;
    }

    console.log(`\n✨ Done! Created: ${created}, Skipped: ${skipped}\n`);
}

// Also create the spotSettings singleton if it doesn't exist
async function seedSpotSettings() {
    const existing = await client.fetch(`*[_type == "spotSettings"][0]`);
    if (!existing) {
        await client.createOrReplace({
            _id: 'singleton-spot-settings',
            _type: 'spotSettings',
            spotStatus: 'open',
            statusMessage: "Plan d'eau calme, idéal pour le Paddle",
            charStatus: 'open',
            charMessage: '',
            marcheStatus: 'open',
            marcheMessage: '',
            nautiqueStatus: 'open',
            nautiqueMessage: '',
        });
        console.log('  ✅ Created: SpotSettings singleton\n');
    } else {
        console.log('  ⏭  Skipped (already exists): SpotSettings\n');
    }
}

async function main() {
    await seedActivities();
    await seedSpotSettings();
}

main().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
