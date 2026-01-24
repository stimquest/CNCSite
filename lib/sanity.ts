
import { createClient } from '@sanity/client';

/**
 * CONFIGURATION SANITY
 * ID Projet : 9v7nk22c
 */
export const client = createClient({
  projectId: '9v7nk22c', 
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-01',
});

/**
 * SCHÉMA CONTENU ÉDITORIAL :
 * 
 * 1. Type 'activity' :
 *    - title (string)
 *    - category (string)
 *    - description (text)
 *    - price (string)
 *    - image (image)
 *    - isTideDependent (boolean)
 * 
 * 2. Type 'spotSettings' (Gestion de crise / Message d'accueil) :
 *    - spotStatus (string - OPEN, RESTRICTED, CLOSED)
 *    - statusMessage (string)
 */

export const queries = {
  // Récupération des activités (Contenu froid/tiède)
  activities: `*[_type == "activity"]{
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
  
  // Récupération du statut manuel (Drapeau / Message sécurité)
  settings: `*[_type == "spotSettings"][0]{
    spotStatus,
    statusMessage
  }`
};
