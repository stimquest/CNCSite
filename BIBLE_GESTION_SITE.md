# 📘 MANUEL DE GESTION DU SITE — C.N.C COUTAINVILLE

> **Dernière mise à jour : Avril 2026**
>
> Ce document s'adresse au **chef de base, aux responsables et aux moniteurs du club**.
> Pas besoin d'être informaticien pour s'en servir — chaque outil est expliqué simplement, avec des exemples concrets tirés du quotidien du club.

Ce document est divisé en deux parties :
- **PARTIE 1 — UTILISATION AU QUOTIDIEN** : tout ce que le personnel du club utilise pour faire tourner le site.
- **PARTIE 2 — TECHNIQUE** : réservée au développeur/webmaster (infrastructure, accès, variables).

---

# 📑 TABLE DES MATIÈRES

## Partie 1 — Utilisation au quotidien
1. [Vue d'ensemble — Les 3 outils du site](#1-vue-densemble--les-3-outils-du-site)
2. [Le Cockpit — Chaque matin avant la mise à l'eau](#2-le-cockpit--chaque-matin-avant-la-mise-à-leau)
3. [La Page Admin — Plannings, réservations et alertes](#3-la-page-admin--plannings-réservations-et-alertes)
4. [Sanity Studio — Modifier le contenu des pages](#4-sanity-studio--modifier-le-contenu-des-pages)
5. [La Vigie — Ce que voient les élèves sur leur téléphone](#5-la-vigie--ce-que-voient-les-élèves-sur-leur-téléphone)
6. [La page Le Spot — D'où viennent les données météo et marées](#6-la-page-le-spot--doù-viennent-les-données-météo-et-marées)

## Partie 2 — Technique (Dev/Webmaster)
7. [Accès et Comptes](#7-accès-et-comptes)
8. [Infrastructure & Hébergement](#8-infrastructure--hébergement)
9. [Variables d'environnement](#9-variables-denvironnement)
10. [Emails transactionnels (Resend)](#10-emails-transactionnels-resend)

---

# PARTIE 1 — UTILISATION AU QUOTIDIEN

## 1. VUE D'ENSEMBLE — LES 3 OUTILS DU SITE

Le site du CNC fonctionne avec **3 outils distincts**, pensés pour 3 fréquences d'utilisation différentes. Il est important de savoir lequel utiliser selon ce que vous voulez faire, pour ne pas perdre de temps.

| Outil | À quelle fréquence ? | Pour faire quoi ? | Adresse web |
| :--- | :--- | :--- | :--- |
| **🟢 Le Cockpit** | **Tous les matins** | Dire si les activités du jour sont confirmées, annulées ou adaptées selon la météo. | `cncoutainville.fr/admin` → onglet 🚀 Cockpit |
| **🔵 La Page Admin** | **En semaine / à la saison** | Gérer les réservations du Char, créer les plannings de stages, envoyer des messages d'urgence aux élèves. | `cncoutainville.fr/admin` |
| **🟣 Sanity Studio** | **En début/fin de saison** | Modifier les textes des pages du site, publier des articles de blog, mettre à jour les tarifs, gérer l'écran TV du club house. | `cncoutainville.sanity.studio` |

> 🔑 **Mots de passe :** Le mot de passe de la Page Admin est communiqué en interne par le chef de base. Ne jamais le transmettre par écrit aux élèves ou aux clients.

> ⚠️ **Important :** La page **La Vigie** (`cncoutainville.fr/fil-info`) est la seule page que les élèves doivent consulter pour connaître l'état des activités. C'est la source officielle du club.

---

## 2. LE COCKPIT — CHAQUE MATIN AVANT LA MISE À L'EAU

**Accès :** Page Admin (`cncoutainville.fr/admin`) → onglet **🚀 Cockpit** (tout à droite de la barre de navigation)

Le Cockpit est le tableau de bord météo du club. C'est ici que vous informez les élèves en temps réel de l'état des activités — est-ce que la session de char est confirmée ? Le stage Moussaillons se déroule-t-il normalement ? Y a-t-il un ajustement à faire à cause du vent ?

Tout ce que vous modifiez ici s'affiche **immédiatement** sur la page publique La Vigie, visible par tous les élèves sur leur téléphone.

---

### Le geste du matin — Confirmer les conditions

Chaque matin, le système vérifie si quelqu'un du club a validé les informations récemment. Si le tableau n'a pas été touché depuis plus de 20 heures, une **alerte orange** clignote en haut de la page pour signaler que les infos peuvent être périmées.

👉 **La première chose à faire chaque matin** : cliquer sur le grand bouton vert **"Tout va bien — Confirmer les conditions"**. Ce simple clic dit aux élèves "oui, quelqu'un a vérifié ce matin, les infos sont à jour". Même si rien n'a changé depuis la veille, ce geste est important pour la confiance des familles, des clients et des adhérents.  

Une fois confirmé, le bouton devient discret (fond vert pâle) et affiche l'heure de la dernière confirmation.

---

### Les 7 activités gérées — organisées en 2 colonnes

Le Cockpit gère **7 activités** réparties en deux groupes affichés côte à côte :

**Colonne gauche — Pratiques autonomes :**
- Sports Nautiques (voile libre, pratiquée de façon autonome par les pratiquants expérimentés)

**Colonne droite — Activités encadrées :**
- Char à Voile
- Marche Aquatique
- Mini-Mousses
- Moussaillons
- Initiation
- Perfectionnement

---

### Les statuts — des labels adaptés à chaque activité

Les boutons de statut ne sont pas identiques pour toutes les activités. Les **libellés s'adaptent** au type d'activité pour être plus précis :

| Activité | Vert (favorable) | Orange (adapté) | Rouge (arrêt) | Gris (absent) |
| :--- | :--- | :--- | :--- | :--- |
| **Sports Nautiques** | Favorables | Techniques (Exp.) | Déconseillée | — |
| **Stages** (Mini-Mousses, Moussaillons, Initiation, Perf) | Confirmée | Cond. techniques | Annulée | **Hors Période** |
| **Marche Aquatique** | Confirmée | Parcours adapté | Reportée | **Pas de séance** |
| **Char à Voile** | Confirmée | Cond. techniques | Annulée | **Hors Période** |

> Le statut **Hors Période / Pas de séance** (gris) est important : il indique que l'activité n'est simplement pas au programme ce jour-là — ni annulée, ni adaptée, juste absente. À utiliser pour les activités hors saison ou sans séance planifiée.

⚠️ **Quand vous changez le statut d'une activité, la note textuelle est automatiquement effacée.** C'est voulu : le message de la veille ne colle plus forcément au nouveau statut. Réécrivez une note si nécessaire.

---

### Ajouter ou modifier une note

Sous chaque activité, un champ texte permet d'ajouter une précision visible sur La Vigie (ex: *"Vent de Nord-Ouest soutenu, séance sur les chars légers uniquement"*).

**Les suggestions rapides** : des petites bulles de texte proposent des formulations toutes faites selon le statut choisi (ex: *"+ Vent soutenu, séance dynamique"*). Cliquez dessus pour les insérer en un clic — elles s'ajoutent à la fin du texte existant et sont enregistrées immédiatement.

**Effacer une note** : quand une note est présente, un bouton **"Effacer note"** (rouge pâle) apparaît à droite des suggestions. Cliquez dessus pour vider le champ en un clic.

---

### Les actions rapides — mettre à jour tout d'un coup

En haut du Cockpit, 6 boutons permettent de changer le statut de plusieurs activités en un seul clic :

**Ligne 1 — Tout basculer d'un coup :**
- *"Tout → Oui"* : toutes les activités passent en vert (conditions favorables).
- *"Tout → Adapté"* : toutes passent en orange (conditions techniques / adaptées).
- *"Tout → Non"* : toutes passent en rouge (annulé / déconseillé).

**Ligne 2 — Actions ciblées :**
- *"Autonomes → Déconseillée"* : uniquement les Sports Nautiques passent en rouge.
- *"Encadrées → Annulé"* : pratique en cas de gros coup de vent — annule toutes les activités encadrées d'un seul coup.
- *"Encadrées → Hors Saison"* : met toutes les activités encadrées en statut gris "Hors Période". À utiliser en dehors de la saison.

---

## 3. LA PAGE ADMIN — PLANNINGS, RÉSERVATIONS ET ALERTES

**Adresse :** `cncoutainville.fr/admin`

La Page Admin est l'outil de gestion "métier" du club. Elle permet de créer les plannings de stages, gérer les réservations du Char à voile, et envoyer des messages aux élèves. Elle est protégée par un mot de passe communiqué en interne.

Elle est organisée en plusieurs **onglets** en haut de la page.

---

### Onglet "Booking Char" 🏁 — Réservations et planning du Char à Voile

C'est l'outil central pour tout ce qui concerne le Char à Voile. Quand vous créez une session ici (date, heure, nombre de places), elle apparaît **automatiquement** dans le calendrier public du site — inutile de faire la mise à jour deux fois. Les réservations prises par téléphone sont ensuite saisies ici par le chef de base.

**Comment naviguer dans les sessions :**

Un **mini-calendrier** s'affiche à gauche. Cliquez sur une ligne de semaine pour afficher toutes les sessions de cette semaine dans le panneau central. Le panneau de détail à droite reste fixe pendant que vous faites défiler la liste — pratique sur tablette ou grand écran.

**Consulter les inscrits d'une session :**

Cliquez sur une session dans la liste centrale pour voir tous les inscrits : nom, numéro de téléphone, nombre de places, statut (confirmé, liste d'attente, annulé) et éventuelles notes. Sur smartphone, vous pouvez appuyer directement sur le numéro de téléphone d'un inscrit pour l'appeler depuis la plage.

**Modifier une réservation existante :**

À côté de chaque réservation, une icône crayon ✏️ permet d'ouvrir un formulaire d'édition directement dans la liste. Vous pouvez corriger le nom, le numéro, le nombre de places ou le statut sans quitter la page. Cliquez sur ✕ pour annuler la modification sans enregistrer.

**Ce que voient les clients sur le site public :**

Sur la page `/activites/char-a-voile`, les visiteurs voient un calendrier mensuel avec un point de couleur sur chaque jour où une session existe. Ils ne voient jamais le nombre exact de places restantes ni la mention "Complet" — uniquement "Disponible" (vert) ou "Très demandé" (orange) selon le taux de remplissage. L'objectif est de les encourager à appeler, même si la session est presque pleine, pour pouvoir leur proposer une autre activité.

---

### Onglets "Stages" et "Marche" 📅 — Plannings hebdomadaires

Ces onglets permettent de créer et gérer les plannings de stages (Mini-Mousses, Moussaillons, Initiation, Perfectionnement) et de Marche Aquatique, semaine par semaine.

**Comment créer un planning de semaine :**

1. Cliquez sur la date souhaitée ou sur le bouton "Nouvelle période".
2. Une grille apparaît avec les jours en colonnes (Lundi → Vendredi) et les groupes en lignes. Renseignez pour chaque case : l'heure de début, la durée de la séance et le support utilisé (Optimist, Catamaran, Char…).
3. Si la journée est organisée en "Raid" (sortie longue), cochez l'option correspondante — la colonne passe en orange pour le signaler visuellement.
4. Quand le planning est prêt, cochez **"En ligne"** puis cliquez sur **"Enregistrer"**. Le planning devient immédiatement visible sur le site public.

**Imprimer le planning :**

Les boutons **"Imprimer Le Mois"** et **"Imprimer Semaine"** génèrent une version PDF mise en page, prête à être imprimée et épinglée sur le tableau d'affichage physique du club.

> ⚠️ **Il n'y a plus d'onglet "Char" séparé.** Depuis la refonte, le planning du Char à Voile est entièrement géré depuis l'onglet "Booking Char" décrit ci-dessus. Les deux systèmes (réservations + planning public) sont désormais unifiés.

---

### Onglet "Vigie Direct" 🔔 — Messages urgents

Cet onglet permet d'envoyer rapidement un message qui s'affichera sur la page publique La Vigie, au-dessus des statuts météo. À utiliser pour des annonces urgentes ou importantes qui dépassent le simple statut d'une activité.

**Exemples d'utilisation :**
- *"Fermeture exceptionnelle vendredi après-midi — réunion de club"*
- *"Grande marée ce week-end — accès à la plage modifié"*
- *"Séance de rattrapage proposée samedi 14h pour le groupe Initiation"*

Pour envoyer un message :
1. Saisissez un titre court et percutant.
2. Rédigez le corps du message (quelques lignes suffisent).
3. Choisissez les groupes destinataires si le message ne concerne pas tout le monde (ex: uniquement les parents du groupe Mini-Mousses).
4. Cliquez sur "Publier". Le message apparaît immédiatement sur La Vigie.

> Pour les messages plus élaborés (avec image, lien, date d'expiration automatique), il vaut mieux passer par **Sanity Studio → 📰 Communication → La Vigie** (voir section suivante).

---

## 4. SANITY STUDIO — MODIFIER LE CONTENU DES PAGES

**Adresse :** `cncoutainville.sanity.studio`

**Connexion :** avec votre compte Google ou votre adresse email (invitation envoyée par le webmaster). Les comptes actifs sont : le chef de base et `contact@cncoutainville.fr`.

Sanity Studio est l'outil qui permet de modifier les **textes, images, tarifs et contenus éditoriaux** des pages du site. On y touche en général en début ou en fin de saison pour mettre à jour les informations, mais aussi pour publier des articles de blog ou envoyer des messages aux élèves.

**Comprendre comment ça marche en deux mots :** Sanity est comme un formulaire très avancé. Chaque page du site correspond à un formulaire avec des champs à remplir. Quand vous modifiez un champ et cliquez sur "Publish", la page du site est mise à jour en quelques secondes.

> 🛡️ **Vous avez le droit à l'erreur.** Sur n'importe quel document, l'icône **Horloge** à droite du bouton "Publish" affiche tout l'historique des modifications. Vous pouvez revenir à n'importe quelle version précédente en un clic. Ne jamais hésiter à modifier — rien n'est définitivement perdu.

---

### Comment s'y retrouver dans le menu

Le menu de gauche est organisé en 5 grandes sections. Voici comment les retenir facilement :

| Ce que je veux faire | Je vais dans… |
|---|---|
| Modifier le texte d'une page du site | **📄 Pages du Site** |
| Modifier une fiche activité (kayak, kite, char…) ou ses boutons de réservation | **⚓ Activités & Réservations** |
| Créer ou modifier un planning de stages | **📅 Plannings** |
| Publier un article, un événement, ou envoyer un message La Vigie | **📰 Communication** |
| Gérer les articles de la boutique | **🛍️ Boutique** |
| Gérer l'écran TV, les statuts météo avancés, la flotte, les espèces nature… | **⚙️ Configuration & Avancé** |

---

### 📄 PAGES DU SITE — Modifier les textes des pages

Chaque entrée de cette section correspond à une page du site. Cliquez dessus pour voir tous les champs modifiables, organisés en **onglets** en haut du formulaire.

---

#### Page d'Accueil (`cncoutainville.fr/`)

**Menu :** 📄 Pages du Site → Accueil

La page d'accueil est divisée en plusieurs sections, chacune dans son onglet :

- **Hero** : Le grand visuel en haut de page. Vous pouvez changer le titre principal, le sous-titre, les photos du diaporama de fond, et la vidéo YouTube qui tourne en arrière-plan.
- **Esprit Club** : La section de présentation du club avec les 3 cartes (texte + image + lien). C'est ici qu'on parle des valeurs, de l'histoire, de l'ambiance.
- **Focus Activités** : Le carrousel horizontal qui présente les activités phares (6 cartes maximum). Chaque carte a une couleur, un titre, une image et un bouton.
- **Campus Nautique** : Les chapitres qui racontent le campus, les installations, ce qu'on trouve sur place.
- **Partenaires** : Les logos des partenaires avec leurs liens. Ajouter, supprimer ou réorganiser les partenaires ici.
- **Immersion** : Les 4 grandes tuiles en bas de page ("Partez en mer", "Rejoignez le club"…) avec image et lien.

---

#### Page Club (`cncoutainville.fr/club`)

**Menu :** 📄 Pages du Site → Le Club

- **Hero** : Titre, sous-titre et image de la page. Les petits badges de statistiques (ex: "Fondée en 1978", "120 adhérents") sont éditables ici.
- **Identité & Valeurs** : La liste des valeurs du club avec icône et texte explicatif pour chacune.
- **Storytelling** : Les 4 grands chapitres narratifs qui racontent l'histoire et l'esprit du club, avec photos et citations.
- **L'Équipe** : Le bureau (membres avec photo), la liste du CA, et l'équipe professionnelle (moniteurs, chef de base).
- **Le Site** : Description des installations, équipements disponibles, image illustrative.
- **La Flotte** : Les fiches des bateaux se modifient via **⚙️ Configuration & Avancé → Bases de Données → La Flotte** (nom, description, stats vitesse/difficulté/adrénaline).
- **Agenda** : Le titre de la section agenda et l'appel aux bénévoles. Les événements eux-mêmes se créent dans **📰 Communication → Agenda**.
- **Souvenirs** : Les photos polaroid d'époque avec titre, année et décennie.

---

#### Page Activités (`cncoutainville.fr/activites`)

**Menu :** 📄 Pages du Site → Activités (structure page)

Cette entrée ne gère que la structure de la section "Club à l'année" (le programme d'octobre à juin). Pour modifier les fiches des activités individuelles (char, kayak, kite…), il faut aller dans **⚓ Activités & Réservations** (voir ci-dessous).

---

#### Fiches Activités — les accordéons de la page Activités

**Menu :** ⚓ Activités & Réservations → Fiches Activités → [nom de l'activité]

Sur la page `/activites`, chaque activité s'ouvre comme un accordéon quand on clique dessus. C'est le contenu de cet accordéon que vous modifiez ici. Chaque fiche activité contient :

- **Titre, catégorie, accroche** : le nom et la phrase d'accroche courte affichée sur la carte.
- **Description** : le texte principal qui décrit l'activité.
- **"Ce que vous allez vivre"** : texte enrichi avec mise en forme (gras, listes…) pour décrire l'expérience vécue par le participant.
- **Logistique** : liste de points pratiques (matériel fourni, ce qu'il faut amener…).
- **Prix** : le prix principal affiché sur la carte + grille tarifaire complète (si plusieurs formules).
- **Image et Galerie** : la photo principale et les photos secondaires.
- **Actions (boutons)** : les 1 à 3 boutons qui apparaissent sur la fiche (Stage, Réservation, Location). Pour chacun :
  - *Actif* : cocher pour afficher le bouton, décocher pour le masquer.
  - *Type d'action* : choisir "Lien direct" (renvoie vers une URL) ou "Message" (ouvre une fenêtre modale avec un texte).
  - *Modèle* : si vous choisissez "Message", vous pouvez utiliser un modèle pré-rédigé ou saisir un texte spécifique.

---

#### Modèles de réservation — les fenêtres de message

**Menu :** ⚓ Activités & Réservations → Modèles de Réservation

Quand un visiteur clique sur un bouton "Réserver" d'une activité configurée en mode "Message", une petite fenêtre s'ouvre avec un texte. Ce texte vient d'un **modèle de réservation**. C'est ici que vous les créez et modifiez.

Exemple typique : sur la fiche Kite Surf, le bouton "Réserver une séance" ouvre une fenêtre qui explique que les réservations se font par téléphone et affiche le numéro du club.

Chaque modèle a :
- **Titre interne** : uniquement pour vous retrouver dans la liste (ex: "KiteMessage"). Les visiteurs ne le voient pas.
- **Titre de la fenêtre** : le titre affiché en haut de la fenêtre modale (ex: "Réservation Kite").
- **Message** : le texte explicatif. Ce champ supporte la mise en forme et surtout les **liens cliquables** :

| Ce que je veux faire | Ce que je saisis | Ce que voit le visiteur |
|---|---|---|
| Numéro de téléphone cliquable | `tel:0233471481` | Un bouton avec icône téléphone, cliquable sur mobile |
| Lien vers un site externe | `https://afkite.com` | Texte souligné en turquoise avec flèche ↗, s'ouvre dans un nouvel onglet |
| Lien vers une autre page du site | `/activites?open=kayak` | Texte souligné en turquoise, navigation fluide |

> 💡 **Comment créer un lien dans le texte :** Sélectionnez le mot ou la phrase à rendre cliquable → cliquez sur l'icône 🔗 dans la barre d'outils → saisissez l'URL → validez. Pour un numéro de téléphone, saisissez `tel:` suivi du numéro sans espaces (ex: `tel:0233471481`).

---

#### Liens directs vers une activité

Depuis n'importe quel texte du site (article de blog, message Vigie, modale de réservation…), vous pouvez créer un lien qui ouvre directement la fiche d'une activité avec son accordéon déjà ouvert. La page défile automatiquement jusqu'à l'activité.

Le format est : `/activites?open=` suivi de l'identifiant de l'activité. Cet identifiant (appelé "slug") est visible dans Sanity sur la fiche de l'activité.

Exemples :
```
/activites?open=char-a-voile
/activites?open=kayak
/activites?open=kite-surf
/activites?open=marche-aquatique
```

On peut aussi filtrer par catégorie en même temps :
```
/activites?cat=Sensations&open=kayak
```

---

#### Page École de Voile (`cncoutainville.fr/ecole-voile`)

**Menu :** 📄 Pages du Site → École de Voile

C'est la page la plus riche en contenu éditorial. Elle est organisée en plusieurs onglets :

- **Hero** : Le grand visuel en haut. Les 2 petits badges flottants (ex: "Fondée en 1978", "FFVoile") sont modifiables ici — vous pouvez changer le texte et choisir une icône dans la liste.
- **Présentation** : Le texte d'introduction de l'école.
- **Stages & Parcours** : Cet onglet contient 4 sous-sections :
  - *Stages* : Les fiches des parcours (Mini-Mousses, Moussaillons, Catamaran, Planche). Chaque fiche a un titre "narratif" (accrocheur), un nom officiel, la tranche d'âge, le prix, une accroche, une description courte, une description longue, la liste logistique et la grille tarifaire.
  - *Formations Pro* : Les fiches CQP, PSC1 et autres formations professionnelles. Chaque fiche a un bouton de contact personnalisable : modifiez le texte du bouton ("S'inscrire", "Nous contacter"…) dans le champ `ctaLabel`, et le lien de destination dans `ctaUrl` (peut être une adresse email `mailto:...` ou un lien web).
  - *École à l'Année* : Les groupes du programme annuel (octobre → juin) avec les jours, tranches d'âge, prix et couleurs de chaque groupe.
  - *Note Tarifaire* : Le petit encadré de précision tarifaire affiché sous les cartes de l'école à l'année.
- **Infos Pratiques** : Le matériel fourni par le club (liste), ce que l'élève doit apporter (liste), et les consignes météo/sécurité.
- **SEO** : Le titre et la description qui apparaissent dans les résultats de recherche Google. À soigner pour le référencement.

---

#### Planning des stages hebdomadaires

**Menu :** 📅 Plannings → Stages — Planning Semaine

Chaque document dans cette section représente **une semaine de stages**. C'est ce qui alimente le tableau de planning affiché sur la page École de Voile.

Pour créer ou modifier la semaine d'une semaine :
1. Ouvrez le document de la semaine concernée (ou créez-en un nouveau).
2. La semaine est découpée en 5 jours (Lundi à Vendredi).
3. Pour chaque jour, renseignez les informations pour chaque groupe :
   - **Mini-Mousses et Moussaillons** : ces groupes ont un champ "Horaire" (ex: `9h00 - 11h00`), un champ "Activité" (optimist, catamaran, char, paddle…) et un champ "Description" libre. Pour marquer un créneau comme fermé, saisissez `FERMÉ` dans le champ horaire. Pour signaler qu'il est complet, saisissez `COMPLET`.
   - **Initiation et Perfectionnement** : pour ces groupes, il suffit de saisir l'horaire directement en texte (ex: `9h00 - 12h00`, ou `Raid` si c'est une journée raid).

---

#### Page Char à Voile (`cncoutainville.fr/activites/char-a-voile`)

**Menu :** 📄 Pages du Site → Char à Voile (page)

Cette page contient les informations éditoriales de présentation du Char à Voile :
- **Hero** : Le petit texte de catégorie ("Activité phare"), le titre de la page et la description d'introduction.
- **Média** : L'adresse URL de la vidéo YouTube à intégrer sur la page (copiez l'URL depuis YouTube).
- **Infos Pratiques** : L'âge minimum requis, la liste du matériel fourni par le club, et la liste de ce que le participant doit apporter.
- **FAQ** : Les questions fréquentes et leurs réponses, affichées en accordéon sur la page. Ajoutez, modifiez ou supprimez des questions ici.
- **Note météo** : Un court texte de réassurance affiché en bas de page pour rassurer les visiteurs sur la gestion des conditions météo.

> 💡 **Le planning et les réservations** du Char à Voile ne se gèrent **pas** depuis Sanity mais depuis la **Page Admin → onglet Booking Char**. Sanity ne gère que les textes de présentation de la page.

---

#### Page Le Spot (`cncoutainville.fr/le-spot`)

**Menu :** 📄 Pages du Site → Le Spot

Cette page ne contient que le Hero (titre, sous-titre, description et image de fond). Tout le reste (météo, marées, webcam) vient de sources automatiques — voir section 6 pour les détails.

---

#### Page Nature (`cncoutainville.fr/nature`)

**Menu :** 📄 Pages du Site → Nature

- **L'Estran** : Les informations sur les marées, le marnage, les fiches info de la zone.
- **Biodiversité** : Cette section affiche automatiquement toutes les espèces saisies dans la base de données nature (voir **⚙️ Configuration & Avancé → Bases de Données → Inventaire Nature**).
- **Pêche à Pied** : Tailles minimales de capture, outils autorisés, consignes de sécurité.
- **Points d'Observation** : Les points d'intérêt sur la carte interactive avec coordonnées GPS, photos et conseils.
- **Exploration** : Les cartes de la section "aller explorer" en bas de page.

Pour ajouter ou modifier une espèce dans l'inventaire : **⚙️ Configuration & Avancé → Bases de Données → Inventaire Nature**. Chaque espèce a un nom courant, un nom scientifique, une catégorie (faune, oiseau, flore, marin), une image, une description et des tags colorés.

---

#### Page Groupes & Séminaires (`cncoutainville.fr/groupes-entreprises`)

**Menu :** 📄 Pages du Site → Groupes & Séminaires

Cette page fonctionne avec un **constructeur de blocs** : vous assemblez des sections dans l'ordre de votre choix, comme des briques. Les sections disponibles sont :
- **Section Hero** : Le grand visuel d'en-tête avec titre, sous-titre, image et statistique de capacité.
- **Mise en avant 2 colonnes** : Une photo à gauche et une liste de points forts à droite avec un bouton d'action.
- **Grille événements** : Les cartes des types d'événements proposés (EVG, anniversaire, séminaire…) avec leurs boutons.
- **CTA Contact** : La bannière finale avec les boutons pour contacter le club.

---

#### Page Infos Pratiques (`cncoutainville.fr/infos-pratiques`)

**Menu :** 📄 Pages du Site → Infos Pratiques

- **Coordonnées** : Adresse postale, numéro de téléphone, adresse email du club.
- **Documents téléchargeables** : Les PDFs mis à disposition (règlement intérieur, programme de la saison, formulaires d'inscription…). Classés par catégorie (stages, club, compétition, tarifs).
- **Tarifs** : La grille tarifaire complète, organisée en 3 onglets (Stages, Séances & Cours, Locations) + le PDF de tarifs complet téléchargeable.

**Le Dico des Parents** (section de la page Infos Pratiques) se gère via **⚙️ Configuration & Avancé → Bases de Données → Dico des Parents**. Chaque entrée du dico : le mot technique (ex: "Empanner"), comment le prononcer, une phrase d'enfant typique, la crainte du parent face à ce mot, la vraie définition simple, et un mini-quiz à 3 réponses pour tester les parents.

---

### 📰 COMMUNICATION — Blog, Agenda et messages La Vigie

---

#### Publier un article de blog

**Menu :** 📰 Communication → Blog & Articles → Nouveau document

Un article de blog se compose de :
- **Titre** : Le titre de l'article, tel qu'il apparaîtra sur le site.
- **Slug (URL)** : L'adresse web de l'article (ex: `/blog/regates-juillet-2026`). Cliquez sur le bouton "Generate" à côté du champ pour le générer automatiquement depuis le titre — c'est plus simple et plus propre.
- **Catégorie** : actualités, environnement, navigation ou événements.
- **Date de publication** : La date affichée sur l'article.
- **Image de couverture** : **Obligatoire.** Sans image, la carte de l'article dans le blog sera cassée. Choisissez une photo en format paysage (plus large que haute).
- **Résumé** : Un court texte (200 caractères max) affiché sur les cartes du blog, avant d'ouvrir l'article. Rédigez-le comme une accroche.
- **Date Événement Agenda** : Si cet article concerne un événement à une date précise (une régate, une sortie club, une AG…), renseignez cette date. L'article apparaîtra alors aussi dans le calendrier d'événements du site, en plus du blog.
- **Corps de l'article** : Le texte complet. L'éditeur supporte les titres, les listes, les images avec légende, les citations, et les boutons d'action (CTA).

---

#### Créer un événement agenda (sans article)

**Menu :** 📰 Communication → Agenda → Nouveau document

Pour les événements ponctuels qui ne nécessitent pas un long article explicatif (une AG, une soirée de fin de saison, une date de régate), utilisez directement ce formulaire plus simple :
- **Titre** de l'événement.
- **Date** de début.
- **Badge** de catégorie (Régate, Événement, AG, Soirée…).
- **Horaire** (ex: "14h - 17h" ou "Toute la journée").
- **Description** courte.
- **Image** optionnelle.
- **Lien vers un article** : si vous avez aussi publié un article de blog sur cet événement, vous pouvez le lier ici.

---

#### Envoyer un message sur La Vigie

**Menu :** 📰 Communication → La Vigie — Messages d'alerte → Nouveau document

C'est la version "complète" de l'envoi de messages, avec plus d'options que le raccourci depuis la Page Admin. À utiliser quand vous voulez plus de contrôle (date d'expiration, image, épinglage…).

Chaque message a :
- **Titre** : Court et percutant. C'est ce que les élèves voient en premier.
- **Corps du message** : Le détail de l'information.
- **Catégorie** : Choisissez parmi Alerte (orange), Météo (cyan), Événement (violet), Ambiance (vert) ou Info (gris). La couleur aide les élèves à identifier rapidement le type d'information.
- **Groupes destinataires** : Par défaut "Tous". Vous pouvez restreindre à un groupe précis (ex: uniquement les inscrits au Char à Voile) — ils filtreront eux-mêmes leur Vigie, mais le ciblage aide à garder le fil propre.
- **Épingler** : Le message reste en tête de liste même si d'autres messages plus récents sont publiés. Utile pour une info importante qui doit rester visible plusieurs jours.
- **Lien externe** : Si le message renvoie vers un site externe (règles FFVoile, météo marine, Facebook…), ajoutez le lien ici. Un bouton "En savoir plus" apparaîtra automatiquement.
- **Date d'expiration** : Le message disparaît automatiquement à cette date et heure. Très pratique pour les messages de type "aujourd'hui la plage est fermée" — plus besoin de penser à supprimer manuellement.

---

### 🛍️ BOUTIQUE

**Menu :** 🛍️ Boutique → Articles / Occasions

**Articles** (nouveaux) : nom, prix, catégorie (Vêtements, Accessoires, Équipement), badge optionnel ("Best Seller", "Nouveau"…), description, image principale et image au survol (optionnelle — s'affiche quand la souris passe sur le produit).

**Occasions** : nom, prix, état de conservation (neuf / très bon état / bon état / à réviser), année, description, image.

---

### ⚙️ DIGITAL SIGNAGE — L'écran TV du Club House

**Menu :** ⚙️ Configuration & Avancé → Digital Signage — Écrans TV

**À quoi ça sert :** Si une télévision est installée dans l'accueil ou la salle de club, vous pouvez la connecter à l'adresse `cncoutainville.fr/digital-signage` pour qu'elle affiche en boucle des diapositives créées ici. C'est un outil de communication interne — annoncer des événements, afficher la météo en direct, remercier des partenaires…

**Comment afficher le contenu sur la TV :** Ouvrez un navigateur web sur la TV (ou sur un Chromecast/Fire Stick connecté à la TV), allez sur `cncoutainville.fr/digital-signage`. La boucle démarre automatiquement et tourne en continu. Pas besoin de rafraîchir — les nouvelles slides publiées dans Sanity apparaissent automatiquement.

**Les 3 types de diapositives disponibles :**

1. **Promo** — Pour mettre en avant une activité ou une offre :
   - Un petit texte de catégorie (ex: "Stage de la semaine")
   - Un titre principal
   - Une description
   - Une image de fond
   - Option QR code : si activée, un QR code s'affiche sur la slide pour renvoyer vers une URL (ex: la page de réservation).

2. **Partenaires** — Pour remercier ou présenter les partenaires du club :
   - Un titre (ex: "Nos partenaires")
   - Une liste de partenaires avec leur logo et leur nom.

3. **Info** — Pour afficher un message texte simple :
   - Un titre
   - Un message
   - Une catégorie de couleur (Alerte, Info, Événement, Ambiance) — même code couleur que La Vigie.

**Paramètres communs à toutes les slides :**
- **Durée d'affichage** : En millisecondes. 15000 = 15 secondes, 30000 = 30 secondes. Ajustez selon la quantité de texte à lire.
- **Ordre** : Numéro qui détermine l'ordre de passage dans la boucle. La slide n°1 passe en premier, puis la n°2, etc.
- **Actif** : Si décoché, la slide est mise en pause et ne s'affiche plus dans la boucle — sans être supprimée. Pratique pour désactiver temporairement une annonce périmée.

---

### ⚙️ PARAMÈTRES DU SPOT

**Menu :** ⚙️ Configuration & Avancé → Statut du Spot (Cockpit)

> ⚠️ **Ne pas modifier directement dans Sanity.** Ce document est la source de données du Cockpit. Toute modification doit passer par `cncoutainville.fr/cockpit`, qui met à jour ce document automatiquement. Modifier directement ici peut créer des incohérences. Réservé au dépannage par le webmaster.

---

## 5. LA VIGIE — CE QUE VOIENT LES ÉLÈVES SUR LEUR TÉLÉPHONE

**Adresse publique :** `cncoutainville.fr/fil-info`

La Vigie est la page que les élèves et les familles consultent pour savoir si leur activité est confirmée. Elle affiche en temps réel les statuts mis à jour depuis le Cockpit, ainsi que tous les messages publiés depuis la Page Admin ou Sanity.

---

### Les filtres — choisir quelles infos afficher

En haut de la page, une barre de filtres permet à chaque visiteur de ne voir que les informations qui le concernent. Les filtres sont **cumulatifs** : on peut activer "Char à Voile" et "Marche Aquatique" en même temps pour voir les messages des deux activités simultanément.

Le bouton **"Tout"** à gauche remet tous les filtres à zéro et affiche l'intégralité des messages.

**Mémorisation des choix :** Les filtres choisis sont mémorisés dans le navigateur du visiteur. La prochaine fois qu'il ouvre La Vigie sur le même appareil, ses filtres sont automatiquement restaurés. Un parent qui suit régulièrement les Mini-Mousses n'a pas à re-sélectionner son filtre à chaque visite.

---

### L'indicateur de disponibilité du Char à Voile

Sur la page du Char à Voile, le calendrier public n'affiche **jamais** la mention "Complet". C'est une décision du chef de base.

Le principe : plutôt que de décourager quelqu'un avec "Complet", on l'encourage à appeler — et on lui propose une autre activité si la session est effectivement pleine. Deux niveaux d'affichage :
- Badge **"Disponible"** (vert) : la session est remplie à moins de 60%.
- Badge **"Très demandé"** (orange) : la session est remplie à plus de 60% — ce qui donne envie d'appeler vite, sans pour autant clore la porte.

---

## 6. LA PAGE LE SPOT — D'OÙ VIENNENT LES DONNÉES MÉTÉO ET MARÉES

**Adresse :** `cncoutainville.fr/le-spot`

La page Le Spot affiche des informations en temps réel (météo, marées, webcam) qui sont récupérées automatiquement depuis des sources extérieures. Vous n'avez rien à saisir pour les faire fonctionner — mais il est utile de savoir d'où viennent ces données en cas de dysfonctionnement.

---

### La météo (vent, température, description)

- **Source :** Service Open-Meteo (`api.open-meteo.com`) — entièrement gratuit, sans inscription.
- **Ce qui s'affiche :** Température, vitesse du vent en nœuds, direction du vent (N, NE, SO…), description générale (Ciel dégagé, Pluie modérée…).
- **Localisation :** Coordonnées GPS d'Agon-Coutainville codées directement dans le site.
- **Maintenance :** Aucune. Si la météo ne s'affiche plus, c'est que le service Open-Meteo est temporairement indisponible — ça se résout tout seul.

---

### La courbe de marées (graphique + heures)

- **Source :** Service WorldTides (`worldtides.info`) — service payant avec un quota de crédits.
- **Ce qui s'affiche :** La courbe de hauteur d'eau sur 7 jours (avec un point toutes les 15 minutes) et les horaires des marées hautes/basses.
- **Important :** Ce service fonctionne avec des crédits prépayés. Si les crédits sont épuisés, la courbe disparaît de la page, mais le site ne plante pas — seul le graphique devient vide. Dans ce cas, contacter le webmaster pour recharger les crédits.

---

### Le coefficient de marée (le chiffre, ex: 95 ou 112)

- **Source :** Fichier de données statique du SHOM (Service Hydrographique et Océanographique de la Marine), intégré directement dans le site.
- **Ce qui s'affiche :** Le coefficient du jour.
- **Toujours disponible** — même si WorldTides est en panne, le coefficient s'affiche.
- **Maintenance annuelle :** Ce fichier de données couvre une année. Il doit être mis à jour chaque année par le webmaster avec les coefficients de l'année suivante (en octobre/novembre de l'année en cours). **À signaler au webmaster chaque automne.**

---

### La webcam

- **Source :** Flux vidéo Skaping (`skaping.com/coutances/agon-coutainville`).
- Intégrée directement dans la page. Si la webcam est déconnectée ou hors ligne, un écran noir s'affiche — contacter Skaping ou vérifier que la caméra est bien alimentée sur place.

---

---

# PARTIE 2 — TECHNIQUE (DEV / WEBMASTER)

*Cette partie est réservée au développeur et au webmaster. Elle ne concerne pas les moniteurs ni le chef de base.*

---

## 7. ACCÈS ET COMPTES

### Sanity CMS
- **Studio :** `cncoutainville.sanity.studio`
- **Gestionnaire du projet :** compte personnel du développeur (admin)
- **Utilisateurs invités :** chef de base + `contact@cncoutainville.fr`
- **Gestion des accès :** `sanity.io/manage` → projet CNC → Members

### Resend (emails transactionnels)
- **Compte créé avec :** `contact@cncoutainville.fr`
- **Dashboard :** `resend.com`
- Tous les formulaires du site utilisent Resend (contact, confirmations de réservation…). Web3Forms a été remplacé.

### Vercel (hébergement)
- **Géré par :** le développeur (compte personnel)
- **Dashboard :** `vercel.com`
- **⚠️ INTERDIT AU PERSONNEL :** Ne jamais modifier les paramètres Vercel (variables d'env, domaines, déploiements). Seul le développeur a autorité.

### GitHub (code source)
- **Dépôt :** public (open source)
- **Propriétaire :** compte personnel du développeur
- Tout le monde peut consulter le code. Les contributions passent par Pull Request.

---

## 8. INFRASTRUCTURE & HÉBERGEMENT

- **URL de production :** `cncoutainville.fr`
- **Hébergement :** Vercel (serverless, déploiement automatique à chaque push sur `main`)
- **CMS :** Sanity (API GROQ, CDN Sanity pour les images) — Project ID : `df7iwkkw`
- **Framework :** Next.js 14+ App Router
- **Flux de données :** Sanity → API GROQ → Next.js → Frontend public

### Déploiement
Tout push sur la branche `main` du dépôt GitHub déclenche automatiquement un déploiement sur Vercel. Pas d'intervention manuelle nécessaire.

---

## 9. VARIABLES D'ENVIRONNEMENT

Fichier `.env.local` à la racine du projet (non versionné sur GitHub).
À recréer lors d'un nouveau setup depuis le dashboard Vercel (Settings → Environment Variables).

| Variable | Service | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity | ID du projet Sanity (`df7iwkkw`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity | Dataset (`production`) |
| `SANITY_API_TOKEN` | Sanity | Token d'écriture (mutations Cockpit) |
| `RESEND_API_KEY` | Resend | Clé API pour l'envoi des emails |
| `WORLDTIDES_API_KEY` | WorldTides | Clé API pour la courbe de marées (Le Spot) |
| `ADMIN_PASSWORD` | Admin | Mot de passe de la page `/admin` |

> Les valeurs exactes sont dans le dashboard Vercel → projet CNC → Settings → Environment Variables.

---

## 10. EMAILS TRANSACTIONNELS (RESEND)

- **Compte :** `contact@cncoutainville.fr` sur `resend.com`
- **Domaine expéditeur :** `cncoutainville.fr` (vérifier que les enregistrements DNS sont configurés)
- **Clé API :** variable `RESEND_API_KEY` dans `.env.local` / Vercel
- **Renouvellement :** Si la clé expire → `resend.com` → API Keys → Create → mettre à jour dans Vercel → redéployer.
- **Tous les formulaires** du site passent par Resend : contact, confirmations de réservation Char, etc.
