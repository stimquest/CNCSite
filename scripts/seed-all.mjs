/**
 * SEED COMPLET - Club Nautique de Coutainville
 * seed-all.mjs
 * 
 * Pousse TOUTES les données hardcodées dans le nouveau projet Sanity.
 * 
 * Couverture :
 *  ✅ HomePage (hero, spirit, focusChar, focusGlisse, focusBienEtre, featured, partners)
 *  ✅ weeklyPlanning (planning Voile - exemple Semaine Hiver)
 *  ✅ planningCharAVoile (Char à Voile - exemple Février/Mars)
 *  ✅ planningMarche (Marche Aquatique - exemple)
 *  ✅ Merch Items (Boutique : 2 produits par défaut)
 * 
 * Usage: node scripts/seed-all.mjs
 */

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

// ─── HELPERS ────────────────────────────────────────────────────────────────

function log(label, msg = '') {
    console.log(`  ✅ Created: ${label} ${msg}`);
}
function skip(label) {
    console.log(`  ⏭  Skipped (already exists): ${label}`);
}
function section(title) {
    console.log(`\n📦 ${title}\n${'─'.repeat(50)}`);
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

async function seedHomePage() {
    section('Home Page (Singleton)');
    const existing = await client.fetch(`*[_type == "homePage"][0]`);
    if (existing) { skip('homePage'); return; }

    await client.createOrReplace({
        _id: 'homePage',
        _type: 'homePage',
        heroTitle: 'Club Nautique de Coutainville',
        heroSubtitle: 'Sauvetage et Secourisme',
        spiritTitle: "L'Esprit du Club",
        spiritMessage: "Ressentez\nla force\ndu vent.",
        spiritDescription: "Entre dunes et grand large, choisissez votre façon de vivre la mer.",
        spiritCards: [
            {
                _key: 'card-nature',
                tag: 'Nature',
                title: 'Apprendre',
                description: "De l'éveil des sens à l'autonomie. L'école de voile pour les enfants de 5 à 12 ans.",
                buttonText: "Découvrir l'école",
                link: '/ecole-voile',
                iconName: 'Leaf',
                colorTheme: 'turquoise',
            },
            {
                _key: 'card-sensation',
                tag: 'Sensation',
                title: 'Naviguer',
                description: "Adrénaline et vitesse. Stages catamarans, char à voile et glisse pour ados & adultes.",
                buttonText: "Voir les stages",
                link: '/activites?cat=Sensations',
                iconName: 'Zap',
                colorTheme: 'orange',
            },
            {
                _key: 'card-exploration',
                tag: 'Exploration',
                title: "S'évader",
                description: "Louez un paddle ou un kayak, longez la côte à votre rythme. La liberté absolue.",
                buttonText: "Louer du matériel",
                link: '/activites',
                iconName: 'Compass',
                colorTheme: 'purple',
            },
        ],
        featuredActivities: [
            {
                _key: 'feat-char',
                title: 'Le Char à Voile',
                tagline: 'Sensation de Vitesse Pure',
                description: "Glissez sur le sable à quelques centimètres du sol. Une activité unique accessible à tous sur l'immense plage de Coutainville.",
                ctaLabel: "Vivre l'expérience",
                ctaLink: '/activites',
                badge: 'Activité Phare',
            },
            {
                _key: 'feat-stages',
                title: 'Stages Vacances',
                tagline: "L'Aventure en Mer",
                description: "Du Optimist au Catamaran, nos moniteurs accueillent vos enfants pour une semaine de progression et de plaisir.",
                ctaLabel: 'Réserver un stage',
                ctaLink: '/ecole-voile',
                badge: 'Saison en cours',
            },
            {
                _key: 'feat-marche',
                title: 'Marche Aquatique',
                tagline: 'Bien-être & Énergie',
                description: "Une autre façon de vivre la mer. Renforcez votre corps tout en profitant du paysage exceptionnel de la côte normande.",
                ctaLabel: 'En savoir plus',
                ctaLink: '/activites',
                badge: 'Santé & Forme',
            },
        ],
        partners: [
            { _key: 'p-normandie', name: 'Région Normandie', link: 'https://www.normandie.fr/' },
            { _key: 'p-manche', name: 'Département de la Manche', link: 'https://www.manche.fr/' },
            { _key: 'p-coutances', name: 'Coutances Mer et Bocage', link: 'https://www.coutancesmeretbocage.fr/' },
            { _key: 'p-agon', name: 'Agon-Coutainville', link: 'https://www.agoncoutainville.fr/' },
            { _key: 'p-ffv', name: 'FFV', link: 'https://www.ffvoile.fr/' },
            { _key: 'p-ffcv', name: 'FFCV', link: 'https://www.ffcv.org/' },
            { _key: 'p-ans', name: 'Agence Nationale du Sport', link: 'https://www.agencedusport.fr/' },
            { _key: 'p-ue', name: 'Union Européenne', link: 'https://european-union.europa.eu/' },
            { _key: 'p-1j1s', name: '1 Jeune 1 Solution', link: 'https://www.1jeune1solution.gouv.fr/' },
            { _key: 'p-famille', name: 'Famille Plus', link: 'https://www.familleplus.fr/' },
            { _key: 'p-ffss', name: 'FFSS', link: 'https://www.ffss.fr/' },
            { _key: 'p-thandi', name: 'Tourisme & Handicap', link: 'https://www.tourisme-handicaps.org/' },
        ],
        focusChar: {
            title: 'Le Char',
            highlightSuffix: 'à Voile.',
            tagline: 'Activité Phare',
            subTagline: 'Sensation & Vitesse',
            description: "Glissez sur le sable à quelques centimètres du sol. Une expérience unique, propulsée par la seule force du vent sur l'immense plage de Coutainville.",
            badgeValue: '60+',
            badgeLabel: 'Km/h de sensations pures',
            ctaButton: { text: 'Réserver une séance', link: '/activites' },
            infoButton: { text: 'En savoir plus', link: '/activites' },
        },
        focusGlisse: {
            title: 'Glisse',
            highlightSuffix: 'Extrême.',
            tagline: 'Sensations Fortes',
            subTagline: 'Wing, Kite & Funboard',
            description: "Dominez les éléments. Wingfoil, Kitesurf ou Windsurf : repoussez vos limites avec les moniteurs du club sur l'un des meilleurs spots de Normandie.",
            badgeValue: 'Pure',
            badgeLabel: 'Énergie & Adrénaline',
            ctaButton: { text: 'Découvrir la glisse', link: '/activites?cat=Sensations' },
            infoButton: { text: 'Le Spot', link: '/le-spot' },
        },
        focusBienEtre: {
            title: 'Bien-être',
            highlightSuffix: '& Slow Tourisme.',
            tagline: 'Slow Tourisme',
            subTagline: 'Marche Aquatique, Kayak & Paddle',
            description: "Prenez le temps de vivre. Entre marche aquatique revitalisante et balades contemplatives en kayak ou paddle, découvrez la côte normande sous un autre angle, au rythme des marées.",
            badgeValue: '100%',
            badgeLabel: 'Oxygène & Sérénité Locale',
            ctaButton: { text: "S'évader en mer", link: "/activites?cat=Bien-être" },
            infoButton: { text: 'Voir les tarifs', link: '/activites' },
        },
    });
    log('homePage (singleton complet)');
}

// ─── PLANNING VOILE (Weekly) ──────────────────────────────────────────────────

async function seedPlanningVoile() {
    section('Planning Voile (weeklyPlanning)');
    const existing = await client.fetch(`*[_type == "weeklyPlanning"] { _id }`);
    if (existing.length > 0) { skip(`${existing.length} planning(s) voile déjà présents`); return; }

    // Semaine de démonstration : vacances de février 2026
    const semaines = [
        {
            title: 'Vacances Hiver – Sem. 1 (16-21 fév.)',
            startDate: '2026-02-16',
            endDate: '2026-02-21',
            days: [
                { _key: 'd1', name: 'Lundi', date: '2026-02-16', isRaidDay: false, miniMousses: { time: '14h-16h30', activity: 'piscine', description: 'Aisance aquatique' }, mousses: { time: '14h-16h30', activity: 'optimist', description: 'Découverte Optimist' }, initiation: '14h-16h30', perfectionnement: '9h30-12h30' },
                { _key: 'd2', name: 'Mardi', date: '2026-02-17', isRaidDay: false, miniMousses: { time: '9h30-12h', activity: 'piscine', description: 'Cerf-volant' }, mousses: { time: '9h30-12h', activity: 'catamaran', description: '' }, initiation: '14h-16h30', perfectionnement: '14h-16h30' },
                { _key: 'd3', name: 'Mercredi', date: '2026-02-18', isRaidDay: false, miniMousses: { time: '9h30-12h', activity: 'char', description: 'Char à voile' }, mousses: { time: '9h30-12h', activity: 'char', description: 'Char à voile' }, initiation: 'Char 9h30-12h', perfectionnement: 'Char 9h30-12h' },
                { _key: 'd4', name: 'Jeudi', date: '2026-02-19', isRaidDay: false, miniMousses: { time: '14h-16h30', activity: 'piscine', description: 'Jeux nautiques' }, mousses: { time: '14h-16h30', activity: 'optimist', description: 'Régate' }, initiation: '14h-16h30', perfectionnement: '14h-16h30' },
                { _key: 'd5', name: 'Vendredi', date: '2026-02-20', isRaidDay: true, miniMousses: { time: '--', activity: 'optimist', description: '' }, mousses: { time: 'RAID', activity: 'catamaran', description: 'Raid côtier' }, initiation: 'RAID', perfectionnement: 'RAID' },
            ],
        },
        {
            title: 'Vacances Hiver – Sem. 2 (23-28 fév.)',
            startDate: '2026-02-23',
            endDate: '2026-02-28',
            days: [
                { _key: 'd1', name: 'Lundi', date: '2026-02-23', isRaidDay: false, miniMousses: { time: '14h-16h30', activity: 'piscine', description: '' }, mousses: { time: '14h-16h30', activity: 'optimist', description: '' }, initiation: '14h-16h30', perfectionnement: '9h30-12h30' },
                { _key: 'd2', name: 'Mardi', date: '2026-02-24', isRaidDay: false, miniMousses: { time: '9h30-12h', activity: 'catamaran', description: '' }, mousses: { time: '9h30-12h', activity: 'catamaran', description: '' }, initiation: '14h-16h30', perfectionnement: '14h-16h30' },
                { _key: 'd3', name: 'Mercredi', date: '2026-02-25', isRaidDay: false, miniMousses: { time: '9h30-12h', activity: 'char', description: '' }, mousses: { time: '9h30-12h', activity: 'char', description: '' }, initiation: 'Char', perfectionnement: 'Char' },
                { _key: 'd4', name: 'Jeudi', date: '2026-02-26', isRaidDay: false, miniMousses: { time: '14h-16h30', activity: 'piscine', description: '' }, mousses: { time: '14h-16h30', activity: 'optimist', description: '' }, initiation: '14h-16h30', perfectionnement: '14h-16h30' },
                { _key: 'd5', name: 'Vendredi', date: '2026-02-27', isRaidDay: true, miniMousses: { time: '--', activity: 'optimist', description: '' }, mousses: { time: 'RAID', activity: 'catamaran', description: '' }, initiation: 'RAID', perfectionnement: 'RAID' },
            ],
        },
    ];

    for (const sem of semaines) {
        await client.create({ _type: 'weeklyPlanning', ...sem });
        log(sem.title);
    }
}

// ─── PLANNING CHAR À VOILE ────────────────────────────────────────────────────

async function seedPlanningChar() {
    section('Planning Char à Voile (planningCharAVoile)');
    const existing = await client.fetch(`*[_type == "planningCharAVoile"] { _id }`);
    if (existing.length > 0) { skip(`${existing.length} planning(s) char déjà présents`); return; }

    const charPlanning = {
        _type: 'planningCharAVoile',
        title: 'Char à Voile – Vacances Hiver 2026',
        startDate: '2026-02-16',
        endDate: '2026-02-27',
        weeks: [
            {
                _key: 'w1',
                title: 'Semaine 1',
                startDate: '2026-02-16',
                endDate: '2026-02-20',
                days: [
                    { _key: 'd1', name: 'Lundi', date: '2026-02-16', sessions: [{ _key: 's1', time: '14h00 - 16h00' }] },
                    { _key: 'd2', name: 'Mardi', date: '2026-02-17', sessions: [{ _key: 's1', time: '14h30 - 16h30' }] },
                    { _key: 'd3', name: 'Mercredi', date: '2026-02-18', sessions: [{ _key: 's1', time: '14h30 - 16h30' }] },
                    { _key: 'd4', name: 'Jeudi', date: '2026-02-19', sessions: [{ _key: 's1', time: '13h30 - 15h30' }] },
                    { _key: 'd5', name: 'Vendredi', date: '2026-02-20', sessions: [{ _key: 's1', time: '13h30 - 15h30' }] },
                ],
            },
            {
                _key: 'w2',
                title: 'Semaine 2',
                startDate: '2026-02-23',
                endDate: '2026-02-27',
                days: [
                    { _key: 'd1', name: 'Lundi', date: '2026-02-23', sessions: [{ _key: 's1', time: '15h30 - 17h30' }] },
                    { _key: 'd2', name: 'Mardi', date: '2026-02-24', sessions: [{ _key: 's1', time: '16h00 - 18h00' }] },
                    { _key: 'd3', name: 'Mercredi', date: '2026-02-25', sessions: [] },
                    { _key: 'd4', name: 'Jeudi', date: '2026-02-26', sessions: [] },
                    { _key: 'd5', name: 'Vendredi', date: '2026-02-27', sessions: [{ _key: 's1', time: '10h00 - 12h00' }] },
                ],
            },
        ],
    };

    await client.create(charPlanning);
    log('Planning Char à Voile – Vacances Hiver 2026');
}

// ─── PLANNING MARCHE AQUATIQUE ────────────────────────────────────────────────

async function seedPlanningMarche() {
    section('Planning Marche Aquatique (planningMarche)');
    const existing = await client.fetch(`*[_type == "planningMarche"] { _id }`);
    if (existing.length > 0) { skip(`${existing.length} planning(s) marche déjà présents`); return; }

    const marchePlanning = {
        _type: 'planningMarche',
        title: 'Marche Aquatique – Hiver 2026',
        startDate: '2026-01-06',
        endDate: '2026-03-31',
        weeks: [
            {
                _key: 'w1',
                title: 'Semaine type (Jan-Mars)',
                startDate: '2026-01-06',
                endDate: '2026-01-10',
                days: [
                    { _key: 'd1', name: 'Mardi', date: '2026-01-07', sessions: [{ _key: 's1', time: '10h00 - 11h00' }] },
                    { _key: 'd2', name: 'Samedi', date: '2026-01-11', sessions: [{ _key: 's1', time: '11h00 - 12h00' }] },
                ],
            },
        ],
    };

    await client.create(marchePlanning);
    log('Planning Marche Aquatique – Hiver 2026');
}

// ─── MERCH (Boutique) ─────────────────────────────────────────────────────────

async function seedMerch() {
    section('Boutique / Merch Items');
    const existing = await client.fetch(`*[_type == "merchItem"] { _id }`);
    if (existing.length > 0) { skip(`${existing.length} items boutique déjà présents`); return; }

    const items = [
        {
            _type: 'merchItem',
            name: 'Sweat CNC 2026',
            price: '45€',
            description: 'Sweat à capuche brodé aux couleurs du Club Nautique de Coutainville. Coupe unisexe.',
            category: 'Textile',
            badge: 'Nouveau',
        },
        {
            _type: 'merchItem',
            name: 'T-Shirt CNC Logo',
            price: '25€',
            description: 'T-shirt 100% coton biologique avec le logo CNC brodé sur la poitrine.',
            category: 'Textile',
            badge: null,
        },
        {
            _type: 'merchItem',
            name: 'Casquette CNC',
            price: '20€',
            description: "Casquette de voile imperméable avec le blason CNC brodé. Protection UV 50+.",
            category: 'Accessoires',
            badge: null,
        },
    ];

    for (const item of items) {
        await client.create(item);
        log(item.name);
    }
}

// ─── SPOT SETTINGS (déjà créé par le premier seed mais on vérifie) ─────────────

async function seedSpotSettings() {
    section('Spot Settings');
    const existing = await client.fetch(`*[_type == "spotSettings"][0]`);
    if (existing) { skip('SpotSettings (déjà présent)'); return; }

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
    log('SpotSettings (singleton)');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🚀 Seed complet → Sanity Project: ${client.config().projectId}\n`);

    await seedHomePage();
    await seedPlanningVoile();
    await seedPlanningChar();
    await seedPlanningMarche();
    await seedMerch();
    await seedSpotSettings();

    console.log('\n✨ Seed terminé avec succès !\n');
}

main().catch(err => {
    console.error('❌ Seed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
});
