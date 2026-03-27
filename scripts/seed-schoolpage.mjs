/**
 * Seed Sanity schoolPage — proFormations + ecoleAnnee.groups
 * Tous les champs description/detail utilisent basicRichText (blocs PortableText)
 * Usage: node scripts/seed-schoolpage.mjs
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'df7iwkkw',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-15',
  useCdn: false,
});

// ─── Helper : convertit un texte plain en bloc PortableText ──────────────────
// Chaque paragraphe séparé par \n\n devient un bloc distinct.
function toBlocks(text) {
  return text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((para, i) => ({
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text: para.trim(), marks: [] }],
    }));
}

// ─── Formations Professionnelles ─────────────────────────────────────────────
const proFormations = [
  {
    _key: 'cqp-initiateur',
    officialName: 'CQP Initiateur Voile',
    label: "Diplôme d'État",
    target: 'Passionné de voile dès 16 ans',
    duration: 'Formation longue — sur saison',
    price: 'Sur devis',
    description: toBlocks(
      "Le CQP Initiateur Voile permet d'encadrer sous la responsabilité d'un moniteur diplômé. Formation en situation à Agon-Coutainville, Hauteville-sur-Mer et Barneville-Carteret (CPCO)."
    ),
    conditions: [
      '16 ans minimum',
      'Niveau 4 FFVoile',
      'PSC1 / Secourisme',
      'Permis bateau côtier',
      'Licence FFVoile valide',
    ],
    accentColor: 'bg-abysse',
    color: 'text-abysse',
  },
  {
    _key: 'psc1',
    officialName: 'Formation PSC1 / Recyclage',
    label: 'Secourisme',
    target: 'Moniteurs & Bénévoles',
    duration: '1 journée',
    price: 'Nous contacter',
    description: toBlocks(
      'Formation aux gestes de premiers secours (PSC1) et recyclage pour les moniteurs et bénévoles du club. Prérequis pour le CQP Initiateur.'
    ),
    conditions: [
      'Ouvert à tous',
      'Prérequis CQP Initiateur',
      'Recyclage recommandé tous les 2 ans',
    ],
    accentColor: 'bg-rose-600',
    color: 'text-rose-600',
  },
  {
    _key: 'wingfoil-expert',
    officialName: 'Wingfoil Expert Pro',
    label: 'Stage Immersion 3 jours',
    target: 'Titulaires BPJEPS / BE minimum',
    duration: '3 jours intensifs',
    price: 'Sur devis',
    description: toBlocks(
      "Le Wingfoil n'est plus une tendance, c'est un incontournable. Votre structure est-elle prête à prendre de la hauteur ?\n\nForts de 5 ans d'expertise de terrain, nous accompagnons les moniteurs et responsables de clubs dans la maîtrise et l'enseignement de cette discipline. Notre valeur ajoutée : une analyse technique et stratégique fine, forgée par notre statut d'évaluateurs N4 et N5 FFV."
    ),
    conditions: [
      'BPJEPS ou BE minimum',
      'Pratique Wingfoil confirmée',
      'Responsables de clubs bienvenus',
    ],
    accentColor: 'bg-turquoise',
    color: 'text-turquoise',
  },
];

// ─── École à l'Année ──────────────────────────────────────────────────────────
const ecoleAnnee = {
  sectionTitle: 'Octobre → Juin',
  sectionSubtitle: 'Mercredis (enfants 6-11 ans) · Samedis (jeunes & adultes)',
  sectionDescription: toBlocks(
    "Vous habitez dans le coin ou à proximité ? L'école à l'année, c'est le rythme du club : on revient chaque semaine, on progresse dans la durée, on intègre un groupe de son niveau. C'est ici que naissent les vrais navigateurs."
  ),
  groups: [
    {
      _key: 'petits-mousses',
      title: 'Petits Mousses',
      age: '6 à 8 ans',
      jour: 'Chaque mercredi',
      activite: 'Catamaran',
      detail: toBlocks(
        "Horaires calés sur les marées. En cas de mauvaise météo : char à voile, pêche à pied ou course d'orientation dans les dunes."
      ),
      price: '115 €',
      priceSuffix: '+ licence + adhésion',
      accentColor: 'bg-orange-500',
      color: 'text-orange-500',
      iconName: 'Sun',
    },
    {
      _key: 'mousses',
      title: 'Mousses',
      age: '8 à 11 ans',
      jour: 'Chaque mercredi',
      activite: 'Catamaran',
      detail: toBlocks(
        "Horaires calés sur les marées. En cas de mauvaise météo : char à voile, pêche à pied ou course d'orientation dans les dunes."
      ),
      price: '115 €',
      priceSuffix: '+ licence + adhésion',
      accentColor: 'bg-turquoise',
      color: 'text-turquoise',
      iconName: 'Anchor',
    },
    {
      _key: 'loisirs-jeunes',
      title: 'Loisirs Jeunes',
      age: '12 à 15 ans',
      jour: 'Chaque samedi',
      activite: 'Catamaran F1 ou Planche à voile',
      detail: toBlocks(
        'Horaires variables selon les marées. Groupes constitués par âge et par niveau. Navigation en mer sur le spot de Coutainville.'
      ),
      price: '170 €',
      priceSuffix: '+ licence + adhésion',
      accentColor: 'bg-blue-600',
      color: 'text-blue-600',
      iconName: 'Wind',
    },
    {
      _key: 'loisirs-adultes',
      title: 'Loisirs Adultes',
      age: 'À partir de 16 ans',
      jour: 'Chaque samedi',
      activite: 'Catamaran Topaz 16 ou Planche',
      detail: toBlocks(
        "Horaires variables. Sans vent ? Kayaks et stand-up paddles disponibles. Une bonne raison de passer chaque samedi au bord de l'eau."
      ),
      price: '185 € / 175 €',
      priceSuffix: '(cata / planche) + licence + adhésion',
      accentColor: 'bg-slate-800',
      color: 'text-slate-900',
      iconName: 'Ship',
    },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  const doc = await client.fetch(`*[_type == "schoolPage"][0]{ _id }`);

  if (!doc?._id) {
    console.error('❌  Aucun document schoolPage trouvé dans Sanity.');
    console.error('    Crée-en un depuis le studio (même vide) avant de lancer ce script.');
    process.exit(1);
  }

  console.log(`📄  Document trouvé : ${doc._id}`);
  console.log('⏳  Patch en cours…');

  await client.patch(doc._id).set({ proFormations, ecoleAnnee }).commit();

  console.log('✅  Seed terminé avec succès !');
  console.log(`    • ${proFormations.length} formations pro injectées (basicRichText)`);
  console.log(`    • ${ecoleAnnee.groups.length} groupes école à l'année injectés (basicRichText)`);
}

run().catch((err) => {
  console.error('❌  Erreur :', err.message);
  process.exit(1);
});
