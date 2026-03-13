import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_DIR = path.join(__dirname, '../public/images/icons');
const REGISTRY_PATH = path.join(__dirname, '../constants/iconRegistry.ts');

/**
 * Mappe les noms de fichiers vers des noms d'affichage lisibles
 */
const NAME_MAPPING = {
    'icoOprimiste': 'Optimist',
    'icoCata': 'Catamaran',
    'icoPavJeune': 'PlancheJeune',
    'icoPavAdulte': 'PlancheAdulte',
    'icoChar': 'Char',
    'icoPaddle': 'Paddle',
    'icoKayak': 'Kayak',
    'icoMarche': 'Marche',
    'icoMulti': 'Multi'
};

/**
 * Titres pour Sanity
 */
const SANITY_TITLES = {
    'Optimist': 'Optimist',
    'Catamaran': 'Catamaran',
    'PlancheJeune': 'Planche Jeune',
    'PlancheAdulte': 'Planche Adulte',
    'Char': 'Char à Voile',
    'Paddle': 'Paddle',
    'Kayak': 'Kayak',
    'Marche': 'Marche Aquatique',
    'Multi': 'Multi-activité'
};

function syncIcons() {
    console.log('--- Synchronisation des Icônes SVG ---');
    
    if (!fs.existsSync(ICON_DIR)) {
        console.error('Erreur: Dossier d\'icônes introuvable:', ICON_DIR);
        return;
    }

    const files = fs.readdirSync(ICON_DIR).filter(f => f.endsWith('.svg'));
    console.log(`Détection de ${files.length} icônes.`);

    let svgMapEntries = [];
    let sanityOptions = [];

    files.forEach(file => {
        const baseName = path.basename(file, '.svg');
        const key = NAME_MAPPING[baseName] || baseName;
        const title = SANITY_TITLES[key] || key;
        const filePath = `/images/icons/${file}`;

        svgMapEntries.push(`    '${key}': '${filePath}'`);
        sanityOptions.push(`    { title: '${title}', value: '${key}' }`);
    });

    const registryContent = `/**
 * REGISTRE CENTRAL DES ICÔNES SVG
 * Ce fichier est généré automatiquement par scripts/sync-icons.js
 * NE PAS MODIFIER MANUELLEMENT.
 */

export const SVG_MAP: Record<string, string> = {
${svgMapEntries.join(',\n')},
    // Alias de compatibilité
    'Anchor': '/images/icons/icoCata.svg',
    'Wind': '/images/icons/icoPavAdulte.svg',
    'Waves': '/images/icons/icoMarche.svg',
    'Zap': '/images/icons/icoChar.svg',
    'Compass': '/images/icons/icoCata.svg'
};

export const SANITY_ICON_OPTIONS = [
${sanityOptions.join(',\n')}
];
`;

    fs.writeFileSync(REGISTRY_PATH, registryContent);
    console.log(`Registre mis à jour avec succès dans ${REGISTRY_PATH}`);
}

syncIcons();
