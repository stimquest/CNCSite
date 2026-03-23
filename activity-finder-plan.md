# Plan : Module de Recommandation d'Activités (Activity Finder)

## 📌 Objectif
Créer un outil de recherche interactif type "Booking" ou "Airbnb" pour permettre aux visiteurs (notamment les vacanciers) de trouver immédiatement les activités adaptées à leurs critères (âge des enfants, envies).

## 📍 Emplacement
- Sur la **Page d'Accueil** (Hero section ou juste en dessous).
- Sur la page **Activités/Stages**.

## 🎨 UX / UI Design (Air & Glass)
Un panneau horizontal en "Glassmorphism" contenant :
1. **Un sélecteur d'âge** : "Pour qui ?" (Menu déroulant : 4-6 ans, 7-11 ans, 12-15 ans, 16+ ans, Adultes/Famille).
2. **Un sélecteur d'envie / niveau** : "Quelle envie ?" (Découverte, Sensations fortes, Navigation autonome).
3. **Un bouton d'action** : "Trouver mon stage ->".

*Quand l'utilisateur clique sur le bouton :*
Le composant révèle (en dessous) les **cartes d'activités recommandées**, filtrées intelligemment depuis les données du CMS Sanity.

## ⚙️ Logique Technique
- **Composant Client (`"use client"`)** : `<ActivityFinder />`
- **Données (`Sanity`)** : Utilisation du champ existant `minAge`, `category`, et `prix` dans le schéma `activity.ts`.
- **Filtres de recommandation** :
  - Si l'âge sélectionné est 6 ans -> Filtre les activités où `minAge <= 6`.
  - Si "Découverte" -> Met en avant les stages comme le Jardin des Mers ou l'Optimist.
- **Affichage des résultats** : Réutilisation du composant existant des cartes d'activités, mais présentées sous forme de "Recommandations pour vous".

## 🚀 Étapes d'implémentation (4 Phases)

1. **Phase 1 : Extraction des données**
   - S'assurer que la requête Sanity ramène bien `minAge`, `prix` et `category` pour alimenter le moteur.
2. **Phase 2 : Création du composant UI (Recherche)**
   - Composant React avec TailwindCSS (Glassmorphism, inputs stylisés).
3. **Phase 3 : Logique de filtrage (React State)**
   - Gestion des états (âge, envie) et fonction de filtrage sur la liste des activités.
4. **Phase 4 : Affichage des recommandations**
   - Rendu conditionnel et animations (Framer Motion) pour afficher les résultats de manière fluide.
