
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const config = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9v7nk22c',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-02-05',
    token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
    useCdn: false,
};

if (!config.token) {
    console.error('Missing SANITY_API_TOKEN in .env.local');
    process.exit(1);
}

const client = createClient(config);

const SPIRIT_DATA = {
    spiritTitle: "L'Esprit du Club",
    spiritMessage: "Ressentez\nla force\ndu vent.",
    spiritDescription: "Entre dunes et grand large, choisissez votre façon de vivre la mer.",
    spiritCards: [
        {
            _key: 'spirit_nature',
            tag: 'Nature',
            title: 'Apprendre',
            description: "De l'éveil des sens à l'autonomie. L'école de voile pour les enfants de 5 à 12 ans.",
            buttonText: "Découvrir l'école",
            link: '/ecole-voile',
            iconName: 'Leaf',
            colorTheme: 'turquoise',
            imagePath: '/images/imgBank/Cata001.jpg'
        },
        {
            _key: 'spirit_sensation',
            tag: 'Sensation',
            title: 'Naviguer',
            description: "Adrénaline et vitesse. Stages catamarans, char à voile et glisse pour ados & adultes.",
            buttonText: "Voir les stages",
            link: '/activites?cat=Sensations',
            iconName: 'Zap',
            colorTheme: 'orange',
            imagePath: '/images/imgBank/Navigation.jpg'
        },
        {
            _key: 'spirit_exploration',
            tag: 'Exploration',
            title: "S'évader",
            description: "Louez un paddle ou un kayak, longez la côte à votre rythme. La liberté absolue.",
            buttonText: "Louer du matériel",
            link: '/activites',
            iconName: 'Compass',
            colorTheme: 'purple',
            imagePath: '/images/imgBank/paddlekayak.jpg'
        }
    ]
};

async function uploadImage(imagePath: string) {
    try {
        const fullPath = path.resolve(__dirname, '..', 'public', imagePath.replace(/^\//, ''));
        if (!fs.existsSync(fullPath)) {
            console.warn(`Image not found: ${fullPath}`);
            return null;
        }
        const buffer = fs.readFileSync(fullPath);
        const asset = await client.assets.upload('image', buffer, {
            filename: path.basename(imagePath)
        });
        console.log(`Uploaded ${imagePath} -> ${asset._id}`);
        return asset._id;
    } catch (error) {
        console.error(`Error uploading ${imagePath}:`, error);
        return null;
    }
}

async function migrate() {
    console.log('Starting migration for SPIRIT section...');

    try {
        // 1. Upload images first
        const cardsWithImages = await Promise.all(SPIRIT_DATA.spiritCards.map(async (card) => {
            const imageId = await uploadImage(card.imagePath);
            const { imagePath, ...rest } = card; // Remove local path
            return {
                ...rest,
                image: imageId ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } } : undefined
            };
        }));

        // 2. Prepare patch
        const patch = {
            spiritTitle: SPIRIT_DATA.spiritTitle,
            spiritMessage: SPIRIT_DATA.spiritMessage,
            spiritDescription: SPIRIT_DATA.spiritDescription,
            spiritCards: cardsWithImages
        };

        // 3. Update 'homePage' document
        // We assume 'homePage' ID is 'homePage' (singleton)
        await client.createIfNotExists({ _id: 'homePage', _type: 'homePage' });

        const result = await client
            .patch('homePage')
            .set(patch)
            .commit();

        console.log('Migration successful!', result);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();
