# Char à Voile — Booking Module

## Goal
Remplacer le planning char à voile actuel (basé semaines/jours) par un système de sessions individuelles avec gestion des réservations côté admin et un planning public calendrier + liste.

## Architecture
- **2 nouveaux schémas Sanity** : `charSession` + `charBooking`
- **L'ancien schema** `planningCharAVoile` est conservé pour compatibilité (peut être déprécié plus tard)
- **Admin** : nouvel onglet `BOOKING` dans AdminClient.tsx
- **Public** : nouvelle page `/activites/char-a-voile/planning` (ou section dans la page existante)
- **API** : extension de `/api/cockpit/update` pour créer/modifier des bookings

## Tasks

- [x] T1: Créer `sanity/schemas/charSession.ts` — session individuelle (date, heureDebut, heureFin, capaciteMax, notes, actif) → Vérifié: fichier créé + TypeCheck ok
- [x] T2: Créer `sanity/schemas/charBooking.ts` — réservation (session ref, clientNom, clientTel, nbPlaces, statut, notes, stripePaymentIntentId) → Vérifié: fichier créé + TypeCheck ok
- [x] T3: Enregistrer les 2 schémas dans `sanity/schemas/index.ts` et `sanity/studioStructure.ts` → Vérifié: les types apparaissent dans le Studio
- [x] T4: Ajouter types TS dans `types.ts` — `CharSessionDoc`, `CharBookingDoc` → Vérifié: compilation sans erreur
- [x] T5: Ajouter onglet `BOOKING` dans `AdminClient.tsx` — create/list/edit sessions + voir les bookings par session + créer une réservation manuelle → Vérifié: UI admin fonctionnelle
- [x] T6: Étendre `/api/cockpit/update` pour supporter `CREATE_CHAR_SESSION`, `UPDATE_CHAR_SESSION`, `DELETE_CHAR_SESSION`, `CREATE_CHAR_BOOKING`, `UPDATE_CHAR_BOOKING` → Vérifié: API répond sur chaque action
- [x] T7: Créer composant `CharPlanningPublic` — vue calendrier (mois avec jours actifs en surbrillance) + vue liste (prochaines sessions avec places dispo)  → Vérifié: rendu correct en local
- [x] T8: Intégrer le composant dans la page publique char à voile (`/activites/char-a-voile`) → Vérifié: visible en production

## Notes
- `stripePaymentIntentId` nullable dès maintenant — Stripe prévu dans une future itération
- Les places dispo = `session.capaciteMax - sum(bookings where statut=confirmé, nbPlaces)`
- Le calcul des dispo se fait via GROQ dans le fetch server (pas de client-side)
- L'ancien onglet CHAR dans AdminClient reste intact (ne pas casser)

## Done When
- [ ] Un admin peut créer une session char (date, heures, capacité), voir les réservations liées, et saisir une résa manuelle
- [ ] Un visiteur voit le calendrier mensuel des sessions + liste avec places dispo
- [ ] Aucune erreur TypeScript
