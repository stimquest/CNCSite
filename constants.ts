
import { Activity, ActivityCategory, SpotStatus, WeatherData } from './types';

export const APP_NAME = "CNC 2026";

export const CURRENT_STATUS: SpotStatus = SpotStatus.OPEN;
export const STATUS_MESSAGE = "Plan d'eau calme, idéal pour le Paddle";

export const MOCK_WEATHER: WeatherData = {
  temp: 18,
  windSpeed: 12,
  windDirection: 'NW',
  tideHigh: '14:30',
  tideLow: '08:15',
  coefficient: 84,
  description: 'Grand beau temps, brise thermique établie.'
};

export const TIDE_DATA = [
  { time: '06:00', height: 2.5 },
  { time: '08:00', height: 1.2 }, // Low
  { time: '10:00', height: 3.5 },
  { time: '12:00', height: 7.8 },
  { time: '14:30', height: 10.5 }, // High
  { time: '16:00', height: 8.2 },
  { time: '18:00', height: 4.5 },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'char-a-voile',
    title: 'Char à Voile',
    category: ActivityCategory.SENSATIONS,
    accroche: "Vitesse pure au ras du sable sur 10km de liberté.",
    experience: "Profitez des immenses plages de sable fin d'Agon-Coutainville pour découvrir des sensations de vitesse immédiates. Le char à voile est une activité de plein air par excellence qui permet de filer au gré du vent au ras du sol. Sur les 10 km de plage, on utilise la force du vent pour filer.",
    pedagogie: "Le pilotage est extrêmement intuitif. On utilise un palonnier au niveau des pieds pour diriger la roue avant et une écoute (corde) tenue à la main pour border la voile et capter la puissance du vent. Les moniteurs vous apprennent à gérer la trajectoire, à virer de bord et surtout à freiner en mettant le char face au vent. Apprentissage de la gestion du vent (propulsion), du virement de bord et de l'arrêt d'urgence.",
    description: "Le sport emblématique de Coutainville pour tous les amateurs de sensations.",
    logistique: [
      "Séance de 2h au total (30 min préparation + 1h30 roulage)",
      "Chaussures fermées OBLIGATOIRES (type baskets)",
      "Vêtements de sport (sable/humidité)",
      "Coupe-vent",
      "Gants vivement recommandés",
      "Casque fourni par le club"
    ],
    prices: [
      { label: "Séance Découverte (2h)", value: "45€" },
      { label: "Stage 3 jours", value: "120€" },
      { label: "Stage 5 jours", value: "185€" }
    ],
    minAge: 8,
    image: 'https://images.unsplash.com/photo-1519830842880-928929944634?q=80&w=1600',
    isTideDependent: true,
    planningNote: "Lundi 16 février:14h - 16h|Mardi 17 février:14h30 - 16h30|Mercredi 18 février:14h30 - 16h30|Jeudi 19 février:13h30 - 15h30|Vendredi 20 février:13h30 - 15h30|Lundi 23 février:15h30 - 17h30|Mardi 24 février:16h - 18h|Vendredi 27 février:10h - 12h|Lundi 02 mars:10h30 - 12h30|Mardi 03 mars:14h30 - 16h30|Jeudi 05 mars:16h - 18h|Vendredi 06 mars:13h30 - 15h30",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=2",
    duration: "2h",
    price: "45€"
  },
  {
    id: 'kite-surf',
    title: 'Kite Surf',
    category: ActivityCategory.SENSATIONS,
    accroche: "Domptez les éléments entre ciel et mer.",
    experience: "Glissez sur l'eau tracté par une aile. Une discipline spectaculaire qui demande de la technique et de la patience. École affiliée à l'AF Kite pour un apprentissage certifié. Liaison radio permanente avec le moniteur.",
    pedagogie: "L'enseignement est progressif. Étape 1 : Analyse de la zone de pratique et de la météo, puis pilotage de l'aile sur la plage (découverte de la fenêtre de vol). Étape 2 : Passage à l'eau pour la nage tractée. Étape 3 : Aborder le 'waterstart' (se lever sur la planche) et les premiers bords.",
    description: "École labellisée AF Kite avec liaison radio moniteur.",
    logistique: [
      "Dès 14 ans",
      "Licence AF Kite obligatoire (environ 24€)",
      "Savoir nager 50m minimum",
      "Sécurité optimisée par liaison radio",
      "Combinaison et matériel de sécurité fournis"
    ],
    prices: [
      { label: "Séance 3h", value: "110€" },
      { label: "Stage 3 séances", value: "310€" },
      { label: "Stage 5 séances", value: "480€" }
    ],
    minAge: 14,
    image: 'https://images.unsplash.com/photo-1544458514-6e6962cb1cb2?q=80&w=1600',
    isTideDependent: true,
    planningNote: "Activite saisonnière (Avril à Novembre). Séances de 3h dépendantes de la force du vent (12 à 25 nœuds) et de la marée (mi-marée préférée).",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=4",
    duration: "3h",
    price: "110€"
  },
  {
    id: 'wing-foil',
    title: 'Wing Foil',
    category: ActivityCategory.SENSATIONS,
    accroche: "Volez au-dessus de l'eau avec une liberté totale.",
    experience: "La toute dernière innovation nautique. Vous tenez une aile gonflable légère à bout de bras et vous évoluez sur une planche équipée d'un foil (une dérive avec une aile immergée) qui vous permet de voler au-dessus de l'eau dès que vous prenez de la vitesse. Sensations de liberté absolue.",
    pedagogie: "Apprentissage de la manipulation de l'aile sur la plage, puis équilibre sur une planche stable (sans foil au début) pour comprendre la propulsion. Enfin, travail sur le vol et la gestion de la hauteur avec le foil.",
    description: "Volez sur l'eau avec la révolution wingfoil.",
    logistique: [
      "Casque et gilet fournis",
      "Combinaison intégrale fournie",
      "Chaussons néoprène conseillés"
    ],
    prices: [
      { label: "Séance 2h", value: "95€" },
      { label: "Pack 3 séances", value: "260€" }
    ],
    minAge: 12,
    image: 'https://images.unsplash.com/photo-1612459957245-0d0458df8643?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Pratique d'Avril à Octobre. Nécessite un vent régulier. Séances calées sur les créneaux de pleine mer ou mi-marée selon les bancs de sable.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=9",
    duration: "2h",
    price: "95€"
  },
  {
    id: 'catamaran',
    title: 'Catamaran',
    category: ActivityCategory.VOILE,
    accroche: "Vitesse et équilibre sur deux coques.",
    experience: "Naviguer sur deux coques offre une stabilité et une vitesse incomparables. C'est le support idéal pour découvrir la côte et apprendre la voile de manière sportive. Le club dispose de Hobie Cat 10, 12, 14 et 16 pieds. Le choix du bateau se fait selon l'âge et le niveau des pratiquants.",
    pedagogie: "Maîtrise des différentes allures (près, portant, travers), apprentissage des manœuvres (virement de bord, empannage) et pour les plus expérimentés, utilisation du trapèze et du spinnaker.",
    description: "Flotte Hobie Cat adaptée à tous les âges et niveaux.",
    logistique: [
      "Savoir nager 25m avec gilet",
      "Chaussures fermées ou vieilles baskets",
      "Lunettes de soleil avec cordon"
    ],
    prices: [
      { label: "Séance 2h", value: "55€" },
      { label: "Stage 5 jours (3h par séance)", value: "215€" }
    ],
    minAge: 8,
    image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Stages pendant les vacances scolaires (Printemps, Été, Toussaint). École de voile les mercredis et samedis hors vacances. Navigation à pleine mer.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=1",
    duration: "2h",
    price: "55€"
  },
  {
    id: 'mini-mousses',
    title: 'Mini-Mousses',
    category: ActivityCategory.JEUNESSE,
    accroche: "L'éveil marin en douceur pour les petits.",
    experience: "Un premier contact avec la mer tout en douceur pour les plus jeunes (5-7 ans). L'objectif est de s'amuser et de découvrir le milieu marin sans appréhension.",
    pedagogie: "Les activités sont variées : séance en piscine face à la mer pour l'aisance aquatique, construction et vol de cerf-volant, pêche à pied pour découvrir l'estran (crabes, crevettes), et une première découverte de l'Optimist.",
    description: "Spécialement conçu pour l'éveil des 5-7 ans.",
    logistique: [
      "Uniquement pendant les vacances scolaires (Juillet/Août)",
      "Change complet obligatoire",
      "Goûter et gourde à prévoir",
      "Crème solaire déjà appliquée"
    ],
    prices: [
      { label: "Stage 5 demi-journées", value: "175€" }
    ],
    minAge: 5,
    image: 'https://images.unsplash.com/photo-1516686120803-03099958197c?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Stages de 5 jours, le matin (9h30-12h) ou l'après-midi (14h-16h30). Uniquement Juillet/Août.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=5",
    duration: "2h30",
    price: "175€"
  },
  {
    id: 'moussaillons',
    title: 'Moussaillons',
    category: ActivityCategory.JEUNESSE,
    accroche: "Le premier pas vers l'aventure maritime.",
    experience: "Pour les enfants de 7-8 ans qui ont déjà un pied marin ou qui veulent apprendre plus activement. C'est l'étape charnière vers l'autonomie.",
    pedagogie: "Initiation plus poussée à l'Optimist (direction, voile), découverte du char à voile (premiers roulages), paddle géant collectif et sorties en mer sur différents supports selon la météo.",
    description: "L'étape charnière vers l'autonomie pour les 7-8 ans.",
    logistique: [
      "7 à 8 ans uniquement",
      "Vêtements de rechange",
      "Chaussures d'eau obligatoire",
      "Goûter à prévoir"
    ],
    prices: [
      { label: "Stage 5 demi-journées", value: "175€" }
    ],
    minAge: 7,
    image: 'https://images.unsplash.com/photo-1596423736772-799a4e3df530?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Stages 5 jours pendant les vacances scolaires. Séances de 2h30 ou 3h selon la saison.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=5",
    duration: "3h",
    price: "175€"
  },
  {
    id: 'planche-a-voile',
    title: 'Planche à Voile',
    category: ActivityCategory.VOILE,
    accroche: "L'équilibre parfait entre la force et le vent.",
    experience: "Le windsurf classique. Le club propose du matériel moderne (planches larges et voiles légères) qui facilite énormément l'initiation.",
    pedagogie: "Apprendre à relever la voile au tire-veille, trouver l'équilibre, orienter la voile pour choisir sa direction, et réussir ses premiers virements de bord.",
    description: "Du débutant au funboard avec matériel moderne léger.",
    logistique: [
      "Combinaison fournie",
      "Savoir nager obligatoire",
      "Chaussons néoprène conseillés"
    ],
    prices: [
      { label: "Séance 2h", value: "45€" },
      { label: "Stage 5 jours", value: "185€" }
    ],
    minAge: 10,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Stages d'été et d'automne. Cours particuliers sur demande au printemps. Navigation à pleine mer.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=3",
    duration: "2h",
    price: "45€"
  },
  {
    id: 'trimaran',
    title: 'Trimaran',
    category: ActivityCategory.VOILE,
    accroche: "Navigation stable, rapide et collective.",
    experience: "Navigation stable, rapide et collective. Idéal pour découvrir la côte en famille sans se mouiller excessivement. Plateforme centrale sécurisante. Sorties découvertes encadrées par un skipper qualifié pendant la saison estivale (juillet/août).",
    pedagogie: "Découverte de la navigation côtière accompagnée par un skipper qualifié. Sensibilisation au milieu marin et aux réglages de base.",
    description: "Sorties découvertes encadrées par un skipper qualifié.",
    logistique: [
      "Capacité 6 personnes",
      "Gilet fourni",
      "Réservation conseillée 48h à l'avance",
      "Chaussures fermées"
    ],
    prices: [
      { label: "Séance collective 2h", value: "40€" },
      { label: "Sortie Privatisée", value: "180€" }
    ],
    minAge: 6,
    image: 'https://images.unsplash.com/photo-1563462058316-29a399f665e7?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Saison estivale (juillet/août). Accessible selon marées.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=1",
    duration: "2h",
    price: "40€"
  },
  {
    id: 'sup',
    title: 'Stand Up Paddle',
    category: ActivityCategory.BIEN_ETRE,
    accroche: "Balade silencieuse et renforcement postural.",
    experience: "Debout sur une grande planche, avancez à l'aide d'une pagaie. Balades tranquilles ou sportives le long de la digue. Location individuelle ou 'Paddle Géant' (jusqu'à 7 personnes sur la même planche).",
    pedagogie: "Gestion de l'équilibre, technique de rame (pagaie) et navigation en fonction du courant.",
    description: "Location individuelle ou Paddle Géant collectif.",
    logistique: [
      "Location 1h ou 2h",
      "Gilet obligatoire",
      "Pochette étanche fournie"
    ],
    prices: [
      { label: "1h Location", value: "15€" },
      { label: "2h Location", value: "25€" },
      { label: "Séance encadrée", value: "25€" }
    ],
    minAge: 10,
    image: 'https://images.unsplash.com/photo-1516972352862-26ebf7756f87?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Location possible d'Avril à Septembre. Pratique idéale à pleine mer par vent faible.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=6",
    duration: "1h",
    price: "15€"
  },
  {
    id: 'kayak',
    title: 'Kayak de Mer',
    category: ActivityCategory.BIEN_ETRE,
    accroche: "L'exploration côtière en toute simplicité.",
    experience: "Embarquez seul ou à deux pour explorer le littoral. Nos kayaks sont stables et auto-videurs pour une sécurité totale.",
    pedagogie: "Prise en main des pagaies doubles, gestion de la direction et sécurité en mer.",
    description: "Embarcations insubmersibles pour explorer le littoral.",
    logistique: [
      "Gilets de sauvetage fournis",
      "Prévoir une tenue qui ne craint pas l'eau",
      "Bidon étanche inclus",
      "Embarcation stable"
    ],
    prices: [
      { label: "1h Location", value: "15€" },
      { label: "2h Location", value: "25€" },
      { label: "Rando 2h", value: "30€" }
    ],
    minAge: 8,
    image: 'https://images.unsplash.com/photo-1541549467657-3f9f9d7c078d?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Location tous les jours en saison estivale. Hors saison : sur réservation. Accessible à pleine mer.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=6",
    duration: "1h",
    price: "15€"
  },
  {
    id: 'speed-sail',
    title: 'Speed Sail',
    category: ActivityCategory.SENSATIONS,
    accroche: "Le skate-voile ultra rapide des plages normandes.",
    experience: "Skate-board géant équipé d'une voile de planche à voile pour glisser sur le sable dur de Coutainville.",
    pedagogie: "Demande de l'équilibre mais offre une liberté de mouvement exceptionnelle. Nécessite un vent de travers régulier.",
    description: "Version terrestre de la glisse nautique sur sable dur.",
    logistique: [
      "Casque et protections fournis",
      "Chaussures fermées OBLIGATOIRES",
      "Gants vivement conseillés"
    ],
    prices: [
      { label: "Séance 1h30", value: "40€" }
    ],
    minAge: 12,
    image: 'https://images.unsplash.com/photo-1605218427360-363941852445?q=80&w=1600',
    isTideDependent: true,
    planningNote: "Pratique à marée basse uniquement. Créneaux selon l'horaire de la basse mer.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=2",
    duration: "1h30",
    price: "40€"
  },
  {
    id: 'cerf-volant',
    title: 'Cerf-Volant',
    category: ActivityCategory.JEUNESSE,
    accroche: "Maîtrisez les courants aériens depuis la plage.",
    experience: "Apprivoiser le vent depuis le sol. Technique de construction et pilotage acrobatique. Comprendre le vent en s'amusant.",
    pedagogie: "Compréhension de la fenêtre de vol, gestion de la tension des lignes et premières figures acrobatiques. Ateliers de construction pour les plus jeunes.",
    description: "Apprentissage du pilotage et ateliers construction.",
    logistique: [
      "Matériel fourni",
      "Casquette conseillée",
      "Activité de repli idéale"
    ],
    prices: [
      { label: "Séance pilotage 1h30", value: "25€" },
      { label: "Atelier construction", value: "15€" }
    ],
    minAge: 6,
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Indépendant de la marée, se pratique sur le haut de plage. Souvent intégré aux stages jeunes.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php",
    duration: "1h30",
    price: "25€"
  },
  {
    id: 'marche-aquatique',
    title: 'Longe-Côte',
    category: ActivityCategory.BIEN_ETRE,
    accroche: "Le fitness marin par excellence.",
    experience: "Fitness en milieu marin. On marche dans l'eau avec une immersion jusqu'à la taille. Excellent pour le renforcement musculaire et le cardio. Convivialité garantie été comme hiver.",
    pedagogie: "Travail de foulée dans l'eau, exercices de bras et gainage dynamique. Convivialité et oxygénation. Bienfaits de l'iode.",
    description: "Renforcement musculaire et cardio en immersion.",
    logistique: [
      "Combinaison et chaussons obligatoires (location possible)",
      "Certificat médical de non-contre indication recommandé",
      "Gants et bonnet conseillés en hiver"
    ],
    prices: [
      { label: "Séance", value: "15€" },
      { label: "Carte 10 séances", value: "120€" }
    ],
    minAge: 16,
    image: 'https://images.unsplash.com/photo-1516972352862-26ebf7756f87?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Toute l'année. Créneaux fixes (ex: Mardi 10h, Samedi 11h). Se pratique à mi-marée.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php?stagetype=7",
    duration: "1h",
    price: "15€"
  },
  {
    id: 'sauvetage',
    title: 'SAUVETAGE ET SECOURISME',
    category: ActivityCategory.SECURITE,
    accroche: "Apprendre à sauver en milieu maritime.",
    description: "Le Club Nautique de Coutainville – Sauvetage et Secourisme, affilié à la Fédération Française de Sauvetage et de Secourisme (FFSS), est dédié à la formation et à la sensibilisation aux gestes de premiers secours et au sauvetage aquatique. Nous avons pour mission de former le grand public, les bénévoles et les professionnels aux techniques de secourisme et de sauvetage.\n\nNous proposons plusieurs formations reconnues :\n✅ PSC1 (Prévention et Secours Civiques de niveau 1) : Formation accessible à tous pour apprendre les gestes de premiers secours.\n✅ PSE1 (Premiers Secours en Équipe de niveau 1) : Formation approfondie pour devenir secouriste et intervenir en équipe.\n✅ PSE2 (Premiers Secours en Équipe de niveau 2) : Formation complémentaire pour perfectionner ses compétences en secours d’urgence.\n✅ BNSSA (Brevet National de Sécurité et de Sauvetage Aquatique) : Formation permettant de devenir nageur sauveteur et de surveiller les plages et piscines.\n\nNos formations sont dispensées par des formateurs expérimentés et passionnés, dans un cadre pédagogique adapté à tous les niveaux.",
    experience: "💡 Pourquoi se former avec nous ?\n✔️ Un club affilié à la FFSS, gage de qualité et de reconnaissance nationale\n✔️ Une équipe de formateurs qualifiés et engagés\n✔️ Des mises en situation réalistes pour un apprentissage efficace\n✔️ Un engagement pour la prévention et la sécurité de tous",
    pedagogie: "Que vous soyez particulier, professionnel ou bénévole souhaitant s’engager dans le secourisme, le Club Nautique de Coutainville – Sauvetage et Secourisme vous accompagne pour acquérir les compétences essentielles qui peuvent sauver des vies.",
    logistique: [
      "Lieu : Club Nautique de Coutainville, Agon-Coutainville",
      "Ouvert à tous (selon formations)",
      "Formateurs diplômés FFSS",
      "Équipe engagée"
    ],
    prices: [
      { label: "Formation PSC1", value: "60€" },
      { label: "Formation BNSSA", value: "Sur devis" },
      { label: "Stage Sauvetage", value: "150€" }
    ],
    minAge: 14,
    image: 'https://images.unsplash.com/photo-1516686120803-03099958197c?q=80&w=1600',
    isTideDependent: false,
    planningNote: "Prochaines sessions : Selon calendrier annuel ou contact direct.",
    bookingUrl: "https://coutainville.axyomes.com/client/2-1.php",
    duration: "Variable",
    price: "Dès 60€"
  }
];
