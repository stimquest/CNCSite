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
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-03-15',
  // TOKEN D'ÉCRITURE : Uniquement présent côté serveur ou injecté via .env
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
  activities: `*[_type == "activity"] | order(title asc) {
    id,
    title,
    category,
    description,
    price,
    "image": image.asset->url,
    isTideDependent,
    bookingUrl,
    duration,
    minAge,
    pedagogie,
    experience,
    logistique
  }`,

  // Récupération du statut du spot
  settings: `*[_type == "spotSettings"][0]{
    spotStatus,
    statusMessage,
    alertMessage,
    lastUpdated
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
  }`
};
