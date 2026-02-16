import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Définition simplifiée pour éviter les erreurs de modules internes
type SanityImageSource = any;

/**
 * CONFIGURATION SANITY
 * Project ID: 9v7nk22c
 * Dataset: production
 */
export const client = createClient({
  projectId: '9v7nk22c',
  dataset: 'production',
  useCdn: false, // Désactiver le CDN pour éviter les problèmes de cache (temporaire ou définitif pour ce site à faible trafic)
  apiVersion: '2024-03-15',
  // Pas de token ici pour éviter les coûts API inutiles
});

// ... (skip to queries)

// Page Nature (Avec projection intelligente : on garde les titres du singleton, mais on remplit la liste avec les documents natureEntity)
naturePage: `*[_type == "naturePage"][0] {
      ...,
      "hero": { ..., "heroImage": hero.heroImage.asset->url },
      "estran": {
          ...,
          "cards": estran.cards[] { ..., "iconName": iconName }
      },
      "habitants": {
          "tag": habitants.tag,
          "title": habitants.title,
          "subtitle": habitants.subtitle,
          "list": *[_type == "natureEntity"] | order(name asc) {
              name,
              scientificName,
              "image": image.asset->url,
              tags,
              tagColor,
              description
          }
      },
      "peche": { ... },
      "observations": observations[]{
          ...,
          "images": images[].asset->url
      },
      "exploration": {
          ...,
          "cards": exploration.cards[]{
             ...,
             "image": image.asset->url
          }
      }
  }`

export const writeClient = createClient({
  projectId: '9v7nk22c',
  dataset: 'production',
  useCdn: false, // Jamais de CDN pour l'écriture
  apiVersion: '2024-03-15',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || '',
});

// Image URL Builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * REQUÊTES GROQ
 */
export const queries = {
  // Récupération des activités
  activities: `*[_type == "activity" && !(_id in path('drafts.**'))] | order(order asc, title asc) {
    id,
    title,
    category,
    description,
    accroche,
    price,
    "prices": prices[]{ label, value },
    "image": image.asset->url,
    isTideDependent,
    bookingUrl,
    duration,
    minAge,
    pedagogie,
    experience,
    logistique,
    planningNote
  }`,

  // Récupération du statut du spot (exclure les brouillons pour éviter le rollback)
  settings: `*[_type == "spotSettings" && !(_id in path('drafts.**'))][0]{
    spotStatus,
    statusMessage,
    alertMessage,
    lastUpdated,
    charStatus,
    charMessage,
    marcheStatus,
    marcheMessage,
    nautiqueStatus,
    nautiqueMessage
  }`,

  // Flash Info (News)
  news: `*[_type == "news"] | order(publishedAt desc)[0...5] {
    _id,
    title,
    category,
    date,
    publishedAt
  }`,

  // Équipe (Team Members)
  team: `*[_type == "teamMember"] | order(order asc, name asc) {
    name,
    role,
    category,
    diplome,
    "image": image.asset->url
  }`,

  // Flotte (Fleet Items)
  fleet: `*[_type == "fleetItem"] | order(name asc) {
    id,
    name,
    subtitle,
    description,
    "gallery": gallery[].asset->url,
    stats,
    crew
  }`,

  // Plannings
  // Plannings Stages
  plannings: `*[_type == "weeklyPlanning"] | order(weekLabel asc) {
    _id,
    weekLabel,
    days[]{
      day,
      isRaidDay,
      miniMousses { time, activity, label },
      mousses { time, activity, label },
      initiation,
      perfectionnement
    },
    isPublished
  }`,

  // Plannings Char à Voile
  charPlannings: `*[_type == "planningCharAVoile"] | order(periodLabel asc) {
    _id,
    periodLabel,
    weeks[]{
      weekLabel,
      days[]{
        day,
        sessions[]{ time }
      }
    }
  }`,

  // Page Nature (Avec projection intelligente : on garde les titres du singleton, mais on remplit la liste avec les documents natureEntity)
  naturePage: `*[_type == "naturePage"][0] {
      ...,
      "hero": { ..., "heroImage": hero.heroImage.asset->url },
      "estran": {
          ...,
          "cards": estran.cards[] { ..., "iconName": iconName }
      },
      "habitants": {
          "tag": habitants.tag,
          "title": habitants.title,
          "subtitle": habitants.subtitle,
          "list": *[_type == "natureEntity"] | order(name asc) {
              name,
              scientificName,
              "image": image.asset->url,
              tags,
              tagColor,
              description
          }
      },
      "peche": { ... },
      "observations": observations[]{
          ...,
          "images": images[].asset->url
      },
      "exploration": {
          ...,
          "cards": exploration.cards[]{
             ...,
             "image": cardImage.asset->url
          }
      }
  }`
};
