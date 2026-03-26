# 📘 MANUEL DE GESTION DU SITE - C.N. COUTAINVILLE (LA BIBLE)

> **Référentiel pour le Chef de base, les Responsables et les Moniteurs.**
> Ce manuel centralise l'utilisation des 3 interfaces du club, classées de l'usage quotidien (métier) à l'usage annuel (structurel).
> **Dernière mise à jour : Mars 2026**

---

## 📑 TABLE DES MATIÈRES

1. [Vue d'ensemble de l'Écosystème](#1-vue-densemble-de-lécosystème)
2. [🟢 LE COCKPIT (Utilisation Quotidienne)](#2--le-cockpit-utilisation-quotidienne)
3. [🔵 LA PAGE ADMIN (Utilisation Hebdomadaire/Mensuelle)](#3--la-page-admin-utilisation-hebdomadairement-et-suivi)
4. [🟣 SANITY STUDIO (Mises à jour Saisonnières/Annuelles)](#4--sanity-studio-mises-à-jour-saisonnières-et-structurelles)
5. [⚙️ TECHNIQUE : Mails et Hébergement](#5-️-technique--mails-et-hébergement)

---

## 1. VUE D'ENSEMBLE DE L'ÉCOSYSTÈME

Le site web du C.N.C. a été développé sur-mesure pour s'adapter à vos besoins métiers. Il est divisé en **3 outils distincts** selon la récurrence de la tâche :

| Interface | Usage | À quoi ça sert ? | Accès |
| :--- | :--- | :--- | :--- |
| **1. Le Cockpit** | **Quotidien** | Confirmer les conditions météo du jour et ajuster les statuts des activités (Ouvert/Adapté/Annulé). | `[VOTRE_SITE.com]/cockpit` |
| **2. Page Admin** | **Hebdomadaire** | Créer les plannings (Stages, Char), imprimer les feuilles de présence, envoyer un message "Vigie Direct" sur l'accueil. | `[VOTRE_SITE.com]/admin` |
| **3. Sanity Studio** | **Saisonnier** | Modifier le texte "en dur" des pages d'accueil, l'histoire du club, les horaires annuels, ou gérer les écrans TV du Club House. | `[URL_DU_STUDIO]` |

> 🏷️ **Note sur OneSignal :** Cet outil de push a été retiré. **Le Cockpit (La Vigie) est l'unique source de vérité du club**. Les élèves doivent s'y fier.
> 🔑 **Mots de passe :** Les identifiants (Sanity, Admin) sont dans le **Gestionnaire de mots de passe Sécurisé**. Ne jamais partager le mot de passe "Base Nautique" par écrit aux élèves.

---

## 2. 🟢 LE COCKPIT (UTILISATION QUOTIDIENNE)

Le Cockpit est le "Tableau de bord météo" du C.N.C. Il contrôle les indicateurs de la Vigie Météo vus par le public.

* **Lien :** `[VOTRE_SITE.com]/cockpit`

### Le Rituel du Matin (Confirmation Obligatoire)
La sécurité avant tout : le système exige une confirmation humaine régulière pour garantir aux élèves que l'information n'est pas obsolète.
1. En haut du Cockpit, un grand bouton indique si le tableau a besoin d'être validé (S'il n'a pas été touché depuis 20 heures, une alerte orange clignote).
2. Cliquez sur le bouton vert **"Tout va bien — Confirmer les conditions"** chaque matin pour horodater la page publique.

### Mettre à jour les statuts (Ouvert / Adapté / Annulé)
* **Actions Groupées** : Vous pouvez cliquer sur "Tout → Oui" ou "Encadrées → Annulé" d'un simple clic pour gagner du temps lors d'un gros coup de vent.
* **Ajustement par Activité** : Pour chaque ligne (Char à voile, Moussaillons, Marche, etc.), vous pouvez :
   - Clic sur "OK" (Vert), "~" (Orange - Adapté), ou "✕" (Rouge - Annulé).
   - Cliquer dans le champ texte pour ajouter une précision vitale (Ex: *"Parcours abrité privilégié aujourd'hui"*).
   - **Astuce :** Cliquez sur les *"petites bulles de suggestions"* en dessous du champ (Ex: "+ Vent soutenu, séance dynamique") pour gagner du temps de frappe ! 

*Toute modification sur le Cockpit est instantanément répercutée sur l'accueil du site.*

---

## 3. 🔵 LA PAGE ADMIN (UTILISATION HEBDOMADAIRE ET SUIVI)

La page Admin est l'outil de back-office "métier" des chefs de base et des moniteurs, pensé spécifiquement pour le centre nautique.

* **Lien :** `[VOTRE_SITE.com]/admin`
* **Mot de passe :** *Sécurisé Base Nautique*

Elle dispose de plusieurs onglets en haut :

### A. Onglet "Booking Char" 🏁 (Usage : Moniteurs sur la plage)
1. Cet onglet liste toutes les activités et les inscrits **du jour** pour le Char à voile (et autres futures activités synchronisées).
2. Le moniteur s'en sert avec son smartphone pour faire l'appel.
3. Il voit les noms et **numéros de téléphone**. Il peut cliquer sur le numéro d'une personne en retard pour l'appeler directement depuis la plage.

### B. Onglets "Stages", "Char" et "Marche" 📅 (Usage : Chef de base)
Le constructeur de plannings ultra-rapide. Il remplace avantageusement Sanity pour ce travail répétitif.
1. **Création :** Cliquez sur la date ou "Nouvelle période".
2. **Pour les Stages :** 
   - Vous avez une grille avec les jours et les groupes (Mini-Mousses, Moussaillons, Perf...). 
   - Ajustez l'heure de début, la durée (ex: 3h) et le support (Optimist, Cata).
   - Renseigner l'organisation d'un "Raid" (Passe la colonne en orange).
3. **Mise en Ligne :** Cochez "En ligne" et cliquez sur "Enregistrer". Le planning public est créé.
4. **Impression (Le Bouton Magique) :** Cliquez sur **"Imprimer Le Mois"** ou **"Imprimer Semaine"** pour sortir la version PDF parfaite, prête à être épinglée sur le panneau physique du club.

### C. Onglet "Vigie Direct" 🔔 (Messages d'alerte)
S'il y a un message urgent à faire passer au-dessus des drapeaux météo :
1. Remplissez le Titre (ex: *Fermeture exceptionnelle ce midi*).
2. Tapez le corps du message.
3. Le message s'affichera publiquement sur la Vigie du site web.

---

## 4. 🟣 SANITY STUDIO (MISES À JOUR SAISONNIÈRES ET STRUCTURELLES)

Sanity n'est pas conçu pour les opérations du quotidien. C'est l'ossature du site.

* **Lien :** `[URL_DU_STUDIO]`

### A. Édition des Pages Fixes (Le Spot, Page Char à Voile, Tarifs)
1. Dans le menu de gauche, trouvez **"Pages Editoriales"**.
2. Cliquez sur la page souhaitée (Ex: *Char à Voile*).
3. Changez les grands textes, le lien de la **vidéo YouTube** de présentation, ou les questions de la FAQ (Foire Aux Questions).
4. Cliquez sur **"Publish"** en bas à droite.
> 🛡️ **Assurance Anti-Panique :** À droite du bouton Publish, l'icône Horloge permet de voir l'Historique et de **restaurer** le texte de la veille en cas de rature !

### B. Le Blog et les Actualités (Articles)
1. Allez dans **📝 Articles & Blog** et "Create New".
2. Générez le "Slug" (le lien URL) à partir du titre.
3. **Indispensable :** Mettez toujours une **Cover Image** (paysage) pour ne pas casser le design de l'accueil.
4. Si l'article concerne un événement à venir, remplissez **"Date Événement Agenda"** pour qu'il apparaisse dans la zone événementielle du site.

### C. Digital Signage (L'Écran du Club House)
Si une "TV" est affichée au mur de l'accueil :
1. Dans l'onglet **🖥️ Digital Signage**.
2. Créez des "Slides" (Diapositives). La télé tournera en boucle entre elles.
3. Créez une Slide "Image" pour annoncer les soldes à la boutique, ou "Météo" pour y projeter La Vigie du Cockpit en direct !

---

## 5. ⚙️ TECHNIQUE : MAILS ET HÉBERGEMENT

Informations réservées au webmaster et aux développeurs.

### Acheminement des Mails (Web3Forms / Resend)
- Lorsqu'un utilisateur remplit le `/contact`, c'est géré par Web3Forms de manière invisible pour bloquer les spams.
- Le mail atterrit directement sur la boîte mail du club. La seule maintenance est un éventuel renouvellement de la clé API (dans le `.env.local`).

### Hébergement et Code (Vercel & GitHub)
- Les serveurs Vercel font tourner le site (Liaison API Cockpit -> Sanity -> Frontend). 
- **INTERDIT AU PERSONNEL :** L'interface Vercel ne doit jamais être modifiée par les équipes administratives, sous peine de crash global des requêtes serveurs. Seul le développeur a autorité sur cette brique.

