
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9v7nk22c';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN;

if (!token) {
    console.error('❌ Missing SANITY_API_TOKEN or NEXT_PUBLIC_SANITY_WRITE_TOKEN');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-02-14',
});

// Mock browser globals for unist-util-is inside sanity client if needed (workaround)
// But usually simple script works.

async function uploadImage(imagePathOrUrl: string) {
    try {
        let buffer: Buffer;
        let filename: string;

        if (imagePathOrUrl.startsWith('http')) {
            console.log(`⬇️ Downloading ${imagePathOrUrl}...`);
            const res = await fetch(imagePathOrUrl);
            if (!res.ok) throw new Error(`Kind of issue downloading ${imagePathOrUrl}`);
            const arrayBuffer = await res.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
            filename = path.basename(new URL(imagePathOrUrl).pathname) || 'image.jpg';
        } else {
            // Local file
            // path is relative to public/ from current script location?
            // script is in scripts/, public is one level up
            const publicPath = path.join(__dirname, '..', 'public', imagePathOrUrl.startsWith('/') ? imagePathOrUrl.slice(1) : imagePathOrUrl);
            console.log(`📂 Reading local file ${publicPath}...`);
            if (!fs.existsSync(publicPath)) {
                console.error(`❌ File not found: ${publicPath}`);
                return null;
            }
            buffer = fs.readFileSync(publicPath);
            filename = path.basename(publicPath);
        }

        console.log(`⬆️ Uploading ${filename} to Sanity...`);
        const asset = await client.assets.upload('image', buffer, {
            filename: filename,
        });
        console.log(`✅ Uploaded: ${asset._id}`);
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id,
            },
        };

    } catch (error) {
        console.error(`❌ Error uploading ${imagePathOrUrl}:`, error);
        return null;
    }
}

// Data from page.tsx
const CHAR_IMAGES = [
    '/images/imgBank/Char001.jpg',
    '/images/imgBank/Char002.jpg',
    '/images/imgBank/Char003.jpg',
];

const GLISSE_IMAGES = [
    'https://images.unsplash.com/photo-1598514983053-ec5507ad2ea4?q=80&w=2000',
    'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=2000',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2000',
];

const WELLBEING_IMAGES = [
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000',
    '/images/imgBank/paddleKayak.jpg',
    '/images/imgBank/paddleGeant.jpg',
];

async function migrate() {
    console.log('🚀 Starting Focus Sections migration...');

    // 1. Upload Images
    console.log('\n--- Uploading Char Images ---');
    const charAssets = [];
    for (const img of CHAR_IMAGES) {
        const asset = await uploadImage(img);
        if (asset) charAssets.push(asset);
    }

    console.log('\n--- Uploading Glisse Images ---');
    const glisseAssets = [];
    for (const img of GLISSE_IMAGES) {
        const asset = await uploadImage(img);
        if (asset) glisseAssets.push(asset);
    }

    console.log('\n--- Uploading Bien-être Images ---');
    const wellbeingAssets = [];
    for (const img of WELLBEING_IMAGES) {
        const asset = await uploadImage(img);
        if (asset) wellbeingAssets.push(asset);
    }

    // 2. Prepare Data
    const focusChar = {
        title: 'Le Char',
        highlightSuffix: 'à Voile.',
        tagline: 'Activité Phare',
        subTagline: 'Sensation & Vitesse',
        description: "Glissez sur le sable à quelques centimètres du sol. Une expérience unique, propulsée par la seule force du vent sur l'immense plage de Coutainville.",
        badgeValue: '60+',
        badgeLabel: 'Km/h de sensations pures',
        images: charAssets,
        ctaButton: { text: 'Réserver une séance', link: '/activites' },
        infoButton: { text: 'En savoir plus', link: '/activites' }
    };

    const focusGlisse = {
        title: 'Glisse',
        highlightSuffix: 'Extrême.',
        tagline: 'Sensations Fortes',
        subTagline: 'Wing, Kite & Funboard',
        description: "Dominez les éléments. Wingfoil, Kitesurf ou Windsurf : repoussez vos limites avec les moniteurs du club sur l'un des meilleurs spots de Normandie.",
        badgeValue: 'Pure',
        badgeLabel: 'Énergie & Adrénaline',
        images: glisseAssets,
        ctaButton: { text: 'Découvrir la glisse', link: '/activites?cat=Sensations' },
        infoButton: { text: 'Le Spot', link: '/le-spot' }
    };

    const focusBienEtre = {
        title: 'Bien-être',
        highlightSuffix: '& Slow Tourisme.',
        tagline: 'Slow Tourisme',
        subTagline: 'Marche Aquatique, Kayak & Paddle',
        description: "Prenez le temps de vivre. Entre marche aquatique revitalisante et balades contemplatives en kayak ou paddle, découvrez la côte normande sous un autre angle, au rythme des marées.",
        badgeValue: '100%',
        badgeLabel: 'Oxygène & Sérénité Locale',
        images: wellbeingAssets,
        ctaButton: { text: "S'évader en mer", link: '/activites?cat=Bien-être' },
        infoButton: { text: 'Voir les tarifs', link: '/activites' }
    };

    // 3. Update Sanity
    console.log('\n💾 Updating homePage document...');
    try {
        await client
            .patch('homePage')
            .set({
                focusChar,
                focusGlisse,
                focusBienEtre
            })
            .commit();
        console.log('✅ Migration successful! homePage updated.');
    } catch (err) {
        console.error('❌ Error submitting to Sanity:', err);
    }
}

migrate();
