"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  ChevronLeft, ChevronRight, ChevronDown, GraduationCap, Anchor, Sun, Wind,
  ArrowRight, Waves, Download, CheckCircle2, AlertTriangle,
  Calendar, LifeBuoy, Ship, Sparkles, Compass, ArrowDownCircle,
  Clock, MapPin, BookOpen, Shield, Hand
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PortableText } from '@portabletext/react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface EcoleVoileClientProps {
  initialSchoolPageData: any;
  initialPlannings: any[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RenderText = ({ content, className, fallback = null }: {
  content: string | any[] | undefined;
  className?: string;
  fallback?: React.ReactNode;
}) => {
  if (!content || (Array.isArray(content) && content.length === 0)) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  if (typeof content === 'string') {
    const paragraphs = content.split(/\n\n+/).filter(Boolean);
    if (paragraphs.length <= 1) return <p className={`whitespace-pre-line ${className}`}>{content}</p>;
    return (
      <div className={className}>
        {paragraphs.map((p, i) => <p key={i} className="mb-2 last:mb-0 whitespace-pre-line">{p}</p>)}
      </div>
    );
  }

  // Custom components for PortableText to have full control instead of "prose" overrides
  const components = {
    block: {
      normal: ({ children }: any) => <p className="mb-3 last:mb-0">{children}</p>,
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-black text-abysse">{children}</strong>,
      em: ({ children }: any) => <em className="italic">{children}</em>,
      link: ({ children, value }: any) => (
        <a href={value.href} className="text-turquoise underline font-bold" target="_blank" rel="noreferrer">
          {children}
        </a>
      ),
    },
  };

  return (
    <div className={className}>
      <PortableText value={content} components={components} />
    </div>
  );
};


const PLANNING_ROWS = [
  { id: "miniMousses", title: "Mini-Mousses", age: "5-7 ans", color: "text-orange-500", bgColor: "bg-orange-500", icon: <Sun size={24} />, accessor: (day: any) => day.miniMousses },
  { id: "mousses", title: "Moussaillons", age: "8-9 ans", color: "text-turquoise", bgColor: "bg-turquoise", icon: <Anchor size={24} />, accessor: (day: any) => day.mousses },
  { id: "initiation", title: "Initiation", age: "10-16 ans", color: "text-blue-500", bgColor: "bg-blue-500", icon: <Wind size={24} />, accessor: (day: any) => day.initiation },
  { id: "perfectionnement", title: "Perfectionnement", age: "10-16 ans", color: "text-purple-500", bgColor: "bg-purple-500", icon: <Waves size={24} />, accessor: (day: any) => day.perfectionnement },
];

// ─── DATA: Stages Vacances ────────────────────────────────────────────────────

const STAGES_VACANCES = [
  {
    id: "mini-mousses",
    title: "Les Petits Pas",
    officialName: "Mini-Mousses",
    age: "5-7 ans",
    hook: "Apprivoiser l'eau, un jeu d'enfant.",
    description: `Le voyage commence ici. Pour les plus petits, la mer est un terrain de jeu intimidant but fascinant. Notre approche privilégie l'immersion douce.

Tout commence dans la sécurité rassurante de notre bassin marin. Entre deux éclaboussures, on apprend à flotter, à diriger un petit bateau, et surtout à ne plus avoir peur. C'est le temps de la découverte pluri-activités : un jour moussaillon sur un Optimist, le lendemain pilote de char à voile ou dompteur de cerf-volant.`,
    longDescription: `Proposé uniquement en Juillet et Août, ce stage inclut des séances de natation dispensées par la Fédération Française de Natation dans le bassin présent à l'école de voile.

Le programme est riche et varié : deux séances de deux heures du Lundi au Vendredi. Le stage est modulable : l'activité est choisie la veille en fonction du groupe et de la météo. L'effectif est limité à 8 enfants avec un matériel spécialement adapté aux plus petits.`,
    price: "163 €",
    pricingTiers: [{ label: "Stage Semaine (Tout Inclus)", value: "163 €" }],
    logistique: ["Gilet de sauvetage fourni", "Combinaison adaptée fournie", "Bassin marin sécurisé", "Carnet de voile offert"],
    image: "/images/imgBank/minimousse.jpg",
    color: "text-orange-500", bgColor: "bg-orange-500",
  },
  {
    id: "moussaillons",
    title: "Le Cap vers l'Horizon",
    officialName: "Moussaillons",
    age: "6-9 ans",
    hook: "De la mare au rivage, l'aventure s'agrandit.",
    description: `L'enfant grandit, son terrain de jeu aussi. On quitte la protection du bassin pour les eaux calmes de la mare de L'Essay. C'est là, sans vagues ni courants, que l'on prend véritablement les commandes de son Optimist.

Une fois les bases acquises, la mer nous appelle. Du mardi au vendredi, le rivage de Coutainville devient notre domaine. On apprend à lire le vent, à sentir la glisse sur un trimaran ou à filer sur le sable en char à voile. Chaque jour est une nouvelle histoire de mer adaptée aux éléments.`,
    longDescription: `Le stage se déroule en Juillet et Août. Le lundi matin est consacré à la prise en main sur plan d'eau intérieur pour une sécurité totale.

Le reste de la semaine, les séances de 2h permettent une progression ludique vers l'autonomie. Toujours à la carte selon la météo : Optimist, Trimaran, Catamaran ou Chars à voile. 8 enfants maximum par moniteur.`,
    price: "168 €",
    pricingTiers: [{ label: "Stage Semaine (Tout Inclus)", value: "168 €" }],
    logistique: ["Initiation sur lac incluse", "Matériel sécurisé FFV", "Passage de niveaux", "Combinaison fournie"],
    image: "/images/imgBank/moussaillon.jpg",
    color: "text-turquoise", bgColor: "bg-turquoise",
  },
  {
    id: "catamaran",
    title: "Dompter le Vent",
    officialName: "Stage Catamaran",
    age: "Dès 8 ans",
    hook: "Vitesse, équipe et adrénaline salée.",
    description: `C'est le passage aux choses sérieuses. Le catamaran, c'est la vitesse pure et le partage. On ne navigue plus seul, on fait partie d'un équipage.

On apprend l'équilibre dynamique, le réglage fin des voiles et la coordination parfaite. Du petit 10 pieds pour les juniors aux puissants 16 pieds pour les adultes, chaque support est une promesse de sensations. On ne subit plus le vent, on l'utilise pour voler au-dessus des vagues de la Manche.`,
    longDescription: `Stage de référence pour ados et adultes. 5 demi-journées (lundi au vendredi) with des séances de 3h.
Supports adaptés :
- 10/12 pieds : Initiation jeunes
- 14/16 pieds : Perf et adultes
Le tarif inclut systématiquement le passeport voile et l'adhésion club.`,
    price: "Dès 183 €",
    pricingTiers: [
      { label: "Cata 10-12 pieds (8-12 ans)", value: "183 €" },
      { label: "Cata 14 pieds (13-15 ans)", value: "203 €" },
      { label: "Cata 16 pieds (Adultes)", value: "233 €" },
    ],
    logistique: ["Bateaux de sécurité dédiés", "Liaison radio permanente", "Matériel renouvelé régulièrement", "Licence FFV comprise"],
    image: "/images/imgBank/Cata001.jpg",
    color: "text-blue-600", bgColor: "bg-blue-600",
  },
  {
    id: "planche",
    title: "L'Équilibre Pur",
    officialName: "Stage Planche",
    age: "Dès 10 ans",
    hook: "Faire corps avec les éléments.",
    description: `Ici, l'aventure devient personnelle. La planche à voile, c'est le dialogue direct entre votre corps, le vent et l'eau. C'est l'école de la persévérance et de la récompense immédiate.

Après les premières chutes riches d'enseignement, vient le moment magique : la planche se stabilise, la voile prend le vent, et vous glissez en silence. De l'apprentissage des manœuvres de base au funboard spectaculaire, nous vous accompagnons vers une liberté totale sur l'eau.`,
    longDescription: `Accessible dès 10 ans. Matériel récent F-One et Duotone. Boards larges pour débuter, voiles légères pour les jeunes.
5 séances de 3h du lundi au vendredi. Progression individualisée validée sur livret FFV.`,
    price: "183 €",
    pricingTiers: [{ label: "Stage Semaine (Tout Inclus)", value: "183 €" }],
    logistique: ["Planches larges haute stabilité", "Gréements légers spécial jeunes", "Encadrement expert", "Combinaison renforcée"],
    image: "/images/imgBank/WindsurfandKite.jpg",
    color: "text-purple-500", bgColor: "bg-purple-500",
  },
];

// ─── DATA: Formations Professionnelles ───────────────────────────────────────

const PRO_FORMATIONS_FALLBACK = [
  {
    id: "cqp-initiateur",
    officialName: "CQP Initiateur Voile",
    label: "Diplôme d'État",
    target: "Passionné de voile dès 16 ans",
    duration: "Formation longue — sur saison",
    price: "Sur devis",
    description: `Le CQP Initiateur Voile permet d'encadrer sous la responsabilité d'un moniteur diplômé. Formation en situation à Agon-Coutainville, Hauteville-sur-Mer et Barneville-Carteret (CPCO).`,
    conditions: ["16 ans minimum", "Niveau 4 FFVoile", "PSC1 / Secourisme", "Permis bateau côtier", "Licence FFVoile valide"],
    image: "/images/imgBank/Secourisme.jpg",
    color: "text-abysse",
    accentColor: "bg-abysse",
  },
  {
    id: "psc1",
    officialName: "Formation PSC1 / Recyclage",
    label: "Secourisme",
    target: "Moniteurs & Bénévoles",
    duration: "1 journée",
    price: "Nous contacter",
    description: `Formation aux gestes de premiers secours (PSC1) et recyclage pour les moniteurs et bénévoles du club. Prérequis pour le CQP Initiateur.`,
    conditions: ["Ouvert à tous", "Prérequis CQP Initiateur", "Recyclage recommandé tous les 2 ans"],
    image: "/images/imgBank/Secourisme.jpg",
    color: "text-rose-600",
    accentColor: "bg-rose-600",
  },
  {
    id: "wingfoil-expert",
    officialName: "Wingfoil Expert Pro",
    label: "Stage Immersion 3 jours",
    target: "Titulaires BPJEPS / BE minimum",
    duration: "3 jours intensifs",
    price: "Sur devis",
    description: `Le Wingfoil n'est plus une tendance, c'est un incontournable. Votre structure est-elle prête à prendre de la hauteur ? Forts de 5 ans d'expertise de terrain, nous accompagnons les moniteurs et responsables de clubs dans la maîtrise et l'enseignement de cette discipline. Notre valeur ajoutée : une analyse technique et stratégique fine, forgée par notre statut d'évaluateurs N4 et N5 FFV.`,
    conditions: ["BPJEPS ou BE minimum", "Pratique Wingfoil confirmée", "Responsables de clubs bienvenus"],
    image: "/images/imgBank/WindsurfandKite.jpg",
    color: "text-turquoise",
    accentColor: "bg-turquoise",
  },
];

// ─── DATA: École à l'Année ─────────────────────────────────────────────────

const ANNEE_GROUPS = [
  {
    id: "petits-mousses",
    title: "Petits Mousses",
    age: "6 à 8 ans",
    jour: "Chaque mercredi",
    activite: "Catamaran",
    detail: "Horaires calés sur les marées. En cas de mauvaise météo : char à voile, pêche à pied ou course d'orientation dans les dunes.",
    price: "115 €",
    priceSuffix: "+ licence + adhésion",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    accentColor: "bg-orange-500",
    icon: <Sun size={20} />,
  },
  {
    id: "mousses",
    title: "Mousses",
    age: "8 à 11 ans",
    jour: "Chaque mercredi",
    activite: "Catamaran",
    detail: "Horaires calés sur les marées. En cas de mauvaise météo : char à voile, pêche à pied ou course d'orientation dans les dunes.",
    price: "115 €",
    priceSuffix: "+ licence + adhésion",
    color: "text-turquoise",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    accentColor: "bg-turquoise",
    icon: <Anchor size={20} />,
  },
  {
    id: "loisirs-jeunes",
    title: "Loisirs Jeunes",
    age: "12 à 15 ans",
    jour: "Chaque samedi",
    activite: "Catamaran F1 ou Planche à voile",
    detail: "Horaires variables selon les marées. Groupes constitués par âge et par niveau. Navigation en mer sur le spot de Coutainville.",
    price: "170 €",
    priceSuffix: "+ licence + adhésion",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    accentColor: "bg-blue-600",
    icon: <Wind size={20} />,
  },
  {
    id: "loisirs-adultes",
    title: "Loisirs Adultes",
    age: "À partir de 16 ans",
    jour: "Chaque samedi",
    activite: "Catamaran Topaz 16 ou Planche",
    detail: "Horaires variables. Sans vent ? Kayaks et stand-up paddles disponibles. Une bonne raison de passer chaque samedi au bord de l'eau.",
    price: "185 € / 175 €",
    priceSuffix: "(cata / planche) + licence + adhésion",
    color: "text-slate-900",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    accentColor: "bg-slate-800",
    icon: <Ship size={20} />,
  },
];


// ─── Component: Stages Vacances avec cards + overlay ─────────────────────────

// ─── Stages Vacances : grille + overlay ──────────────────────────────────────

const StagesVacancesGrid = ({ items }: { items: any[] }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = items.find(i => (i._key || i.id) === selectedKey);
  const descScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  // Check both top and bottom overflow on every scroll event
  const checkScroll = React.useCallback(() => {
    const el = descScrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 4;
    setCanScrollUp(el.scrollTop > 8);
    setCanScrollDown(hasOverflow && el.scrollTop + el.clientHeight < el.scrollHeight - 8);
  }, []);

  React.useEffect(() => {
    const el = descScrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const t = setTimeout(checkScroll, 80);
    return () => clearTimeout(t);
  }, [selectedKey, checkScroll]);

  return (
    <>
      {/* Grille 4 colonnes desktop, 2 mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, index) => (
          <div key={item._key || item.id || index} onClick={() => setSelectedKey(item._key || item.id || String(index))}
            className="relative rounded-2xl overflow-hidden aspect-square shadow-md cursor-pointer group"
          >
            <img src={item.image} alt={item.officialName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

            {/* Gradient fort sur le bas */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

            {/* Badge en haut : nom + âge — Micro-Split centered at top */}
            <div className="absolute top-3 md:top-5 left-0 right-0 flex flex-col items-center gap-1 px-2 pointer-events-none">
              {/* Mobile : empilé */}
              <div className="md:hidden flex flex-col items-center gap-1">
                <div className={`${item.bgColor} text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow uppercase tracking-widest`}>
                  {item.age}
                </div>
                <div className={`bg-white ${item.color} text-[9px] font-black px-2.5 py-0.5 rounded-full shadow uppercase tracking-tight text-center`}>
                  <RenderText content={item.officialName} className="m-0! p-0!" />
                </div>
              </div>
              {/* Desktop : pill horizontal */}
              <div className="hidden md:inline-flex items-center bg-white rounded-full shadow-lg overflow-hidden h-9">
                <div className={`${item.bgColor} text-white text-[10px] font-black px-3.5 h-full flex items-center uppercase tracking-widest`}>
                  {item.age}
                </div>
                <div className={`${item.color} bg-white text-sm font-black px-4 h-full flex items-center uppercase tracking-tight`}>
                  <RenderText content={item.officialName} className="m-0! p-0!" />
                </div>
              </div>
            </div>

            {/* Bas : Titre + Prix + Accroche */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col gap-1.5 md:gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-end justify-between gap-1">
                  <h3 className="text-sm md:text-lg font-black text-white tracking-tighter leading-none uppercase">
                    <RenderText content={item.title} />
                  </h3>
                  <span className="text-xs md:text-sm font-black text-white/80 shrink-0">{item.price}</span>
                </div>
                <RenderText content={item.hook} className="hidden md:block text-[11px] md:text-xs text-white/60 italic leading-tight line-clamp-2" />
              </div>
            </div>

            {/* Hint tap — mobile uniquement — Icône animée discrète */}
            <div className="absolute md:hidden inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.5, 0.2] 
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="text-white bg-black/10 rounded-full p-4 backdrop-blur-xs"
              >
                <Hand size={30} strokeWidth={1} />
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay animé */}
      <AnimatePresence>
        {selected && (
          <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-90 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedKey(null)}
              />

              <motion.div
                key="overlay"
                initial={{ opacity: 0, scale: 0.93, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed z-100 inset-x-3 top-16 bottom-20 md:inset-x-28 md:inset-y-12 lg:inset-x-52 lg:inset-y-14 rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col md:flex-row"
              >
                {/* Bouton fermer */}
                  <button
                    onClick={() => setSelectedKey(null)}
                  className="absolute top-4 right-10 z-10 p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all shadow-md group"
                  aria-label="Fermer"
                >
                  <LucideIcons.X size={24} className="transition-transform group-hover:rotate-90" />
                </button>

              {/* Image */}
              <div className="relative shrink-0 h-52 md:h-auto md:w-1/2">
                <img src={selected.image} alt={selected.officialName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent md:bg-linear-to-r md:from-black/20 md:to-transparent" />
              </div>

              {/* ─────────────────────────────────────────────────────────
                  MOBILE : tout le contenu dans un seul bloc qui scroll
              ───────────────────────────────────────────────────────── */}
              <div className="md:hidden flex-1 overflow-y-auto flex flex-col min-h-0">
                <div className="p-5 flex flex-col gap-4">
                  {/* Badge + Titre */}
                  <div>
                    <div className="inline-flex items-center bg-white rounded-full shadow-xl overflow-hidden h-9 mb-4 border border-slate-100">
                      <div className={`${selected.bgColor} text-white text-[9px] font-black px-5 h-full flex items-center uppercase tracking-widest`}>{selected.age}</div>
                      <div className={`${selected.color} bg-white text-xs font-black px-5 h-full flex items-center uppercase tracking-tight`}>
                        <RenderText content={selected.officialName} className="m-0! p-0!" />
                      </div>
                    </div>
                    <h2 className="text-base font-black text-abysse tracking-tighter leading-tight uppercase mb-1">
                      <RenderText content={selected.title} />
                    </h2>
                    <RenderText content={selected.hook} className="text-slate-400 text-[13px] italic block mb-2" />
                  </div>
                  {/* Description */}
                  <RenderText content={selected.description} className="text-slate-600 text-[13px] font-medium leading-relaxed" />
                  {selected.longDescription && (
                    <RenderText content={selected.longDescription} className="text-slate-500 text-[13px] italic leading-relaxed border-l-4 border-slate-200 pl-4" />
                  )}
                  {/* Inclus */}
                  {selected.logistique?.length > 0 && (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {selected.logistique.map((log: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                          <CheckCircle2 size={12} className="text-turquoise shrink-0" />{log}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Tarifs */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">Tarif</p>
                    {selected.pricingTiers?.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {selected.pricingTiers.map((tier: any, i: number) => (
                          <div key={i} className="flex justify-between items-center py-2 first:pt-0">
                            <span className="text-[12px] font-bold text-slate-600">{tier.label}</span>
                            <span className={`text-lg font-black tracking-tighter ${selected.color}`}>{tier.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-black tracking-tighter ${selected.color}`}>{selected.price || "— €"}</span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">/ semaine</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* CTA fixé visuellement en bas de la zone de scroll */}
                <div className="px-5 pb-5 pt-2">
                  <a href="https://coutainville.axyomes.com/" target="_blank"
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl ${selected.bgColor} text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-md`}
                    onClick={e => e.stopPropagation()}>
                    S'inscrire <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────
                  DESKTOP : 3 zones — Header fixe / Description scroll / Footer fixe
              ───────────────────────────────────────────────────────── */}
              <div className="hidden md:flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* Zone 1 : Header */}
                <div className="shrink-0 px-8 pt-8 pb-3">
                  <div className="inline-flex items-center bg-white rounded-full shadow-xl overflow-hidden h-11 mb-5 border border-slate-100">
                    <div className={`${selected.bgColor} text-white text-[10px] font-black px-6 h-full flex items-center uppercase tracking-widest`}>{selected.age}</div>
                    <div className={`${selected.color} bg-white text-sm font-black px-7 h-full flex items-center uppercase tracking-tight`}>
                      <RenderText content={selected.officialName} className="m-0! p-0!" />
                    </div>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black text-abysse tracking-tighter leading-tight uppercase mb-1">
                    <RenderText content={selected.title} />
                  </h2>
                  <RenderText content={selected.hook} className="text-slate-400 text-[13px] italic" />
                </div>

                {/* Zone 2 : Description (scrollable) + double fondu haut/bas */}
                <div
                  className="relative flex-1 min-h-0 border-y border-slate-100"
                  onWheel={e => {
                    e.stopPropagation();
                    descScrollRef.current?.scrollBy({ top: e.deltaY, behavior: 'auto' });
                  }}
                >
                  <div
                    ref={descScrollRef}
                    onScroll={checkScroll}
                    className="h-full overflow-y-auto px-8 py-4 flex flex-col gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                  >
                    <RenderText content={selected.description} className="text-slate-600 text-base font-medium leading-relaxed" />
                    {selected.longDescription && (
                      <RenderText content={selected.longDescription} className="text-slate-500 text-sm italic leading-relaxed border-l-4 border-slate-200 pl-4" />
                    )}
                  </div>

                  {/* Fondu HAUT — apparaît quand on a scrollé vers le bas */}
                  <AnimatePresence>
                    {canScrollUp && (
                      <motion.div
                        key="fade-top"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, transparent 100%)' }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Fondu BAS + chevron pulsé — apparaît quand il reste du contenu */}
                  <AnimatePresence>
                    {canScrollDown && (
                      <motion.div
                        key="fade-bottom"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none flex items-end justify-center pb-2"
                        style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 60%, transparent 100%)' }}
                      >
                        <motion.div
                          animate={{ y: [0, 3, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ChevronDown size={16} className="text-slate-300" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Zone 3 : Footer fixe */}
                <div className="shrink-0 flex flex-col">
                  <div className="px-8 py-4 flex flex-col gap-3">
                    {selected.logistique?.length > 0 && (
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {selected.logistique.map((log: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                            <CheckCircle2 size={11} className="text-turquoise shrink-0" />{log}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">Tarif</p>
                      {selected.pricingTiers?.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {selected.pricingTiers.map((tier: any, i: number) => (
                            <div key={i} className="flex justify-between items-center py-2 first:pt-0">
                              <span className="text-[12px] font-bold text-slate-600">{tier.label}</span>
                              <span className={`text-lg font-black tracking-tighter ${selected.color}`}>{tier.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-black tracking-tighter ${selected.color}`}>{selected.price || "— €"}</span>
                          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">/ semaine</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-100 bg-white">
                    <a href="https://coutainville.axyomes.com/" target="_blank"
                      className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl ${selected.bgColor} text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-md`}
                      onClick={e => e.stopPropagation()}>
                      S'inscrire <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EcoleVoileClient: React.FC<EcoleVoileClientProps> = ({ initialSchoolPageData, initialPlannings }) => {
  const schoolPageData = initialSchoolPageData;
  const stages = schoolPageData?.stages?.length ? schoolPageData.stages : STAGES_VACANCES;
  const proFormations = schoolPageData?.proFormations?.length ? schoolPageData.proFormations : PRO_FORMATIONS_FALLBACK;
  const anneeGroups = schoolPageData?.ecoleAnnee?.groups?.length ? schoolPageData.ecoleAnnee.groups : ANNEE_GROUPS;
  const ecoleAnneeData = schoolPageData?.ecoleAnnee;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false);

  const plannings = React.useMemo(() => {
    if (!initialPlannings?.length) return [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return [...initialPlannings]
      .filter(w => !w.endDate || new Date(w.endDate) >= today)
      .sort((a, b) => (new Date(a.startDate || 0).getTime()) - (new Date(b.startDate || 0).getTime()));
  }, [initialPlannings]);

  const currentWeek = plannings?.[currentWeekIndex];
  const nextWeek = () => setCurrentWeekIndex(prev => (prev + 1) % plannings.length);
  const prevWeek = () => setCurrentWeekIndex(prev => (prev - 1 + plannings.length) % plannings.length);

  const [selectedProKey, setSelectedProKey] = useState<string | null>(null);
  const selectedPro = proFormations.find((f: any) => (f.id || f._key || f.officialName) === selectedProKey);
  const proScrollRef = React.useRef<HTMLDivElement>(null);
  const [canProScrollDown, setCanProScrollDown] = useState(false);
  const [canProScrollUp, setCanProScrollUp] = useState(false);

  const checkProScroll = React.useCallback(() => {
    const el = proScrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 4;
    setCanProScrollUp(el.scrollTop > 8);
    setCanProScrollDown(hasOverflow && el.scrollTop + el.clientHeight < el.scrollHeight - 8);
  }, []);

  React.useEffect(() => {
    const el = proScrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const t = setTimeout(checkProScroll, 80);
    return () => clearTimeout(t);
  }, [selectedProKey, checkProScroll]);


  return (
    <div className="w-full font-sans bg-white">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <PageHero
        image={schoolPageData?.hero?.image || "/images/imgBank/CataPharePointeAgon.jpg"}
        imageAlt="École de voile Coutainville"
        tagIcon={<GraduationCap size={14} />}
        tagText={schoolPageData?.hero?.tagText || "Stages & École de Voile"}
        title={schoolPageData?.hero?.title || "Apprendre"}
        subtitle={schoolPageData?.hero?.subtitle || "la Mer."}
      >
        {schoolPageData?.heroBadges?.length > 0 ? (
          schoolPageData.heroBadges.map((badge: any, index: number) => {
            const isFirst = index === 0;
            const IconComponent = (LucideIcons as any)[badge.iconName] || Anchor;
            
            return (
              <div 
                key={index} 
                className={isFirst 
                  ? "bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-75"
                  : "bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-75"
                }
              >
                <div className={isFirst
                  ? "size-16 rounded-2xl bg-abysse flex items-center justify-center text-white shadow-lg shrink-0"
                  : "size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0"
                }>
                  <IconComponent size={32} />
                </div>
                <div className="text-left">
                  <p className={isFirst ? "text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1" : "text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1"}>
                    {badge.label}
                  </p>
                  <p className={isFirst ? "text-4xl font-black text-abysse tracking-tighter" : "text-2xl font-black text-white uppercase italic leading-none"}>
                    {badge.value}
                  </p>
                  <p className={isFirst ? "text-[10px] text-slate-400 font-bold mt-1 uppercase" : "text-[10px] text-white/60 font-bold mt-1 uppercase italic"}>
                    {badge.sublabel}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          // FALLBACK : GARDER LES VALEURS PAR DÉFAUT SI VIDE DANS SANITY
          <>
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-75">
              <div className="size-16 rounded-2xl bg-abysse flex items-center justify-center text-white shadow-lg shrink-0">
                <Anchor size={32} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Fondée en</p>
                <p className="text-4xl font-black text-abysse tracking-tighter">1929</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Savoir-faire local</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-75">
              <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Label</p>
                <p className="text-2xl font-black text-white uppercase italic leading-none">Qualité FFV</p>
                <p className="text-[10px] text-white/60 font-bold mt-1 uppercase italic">Moniteurs diplômés d'État</p>
              </div>
            </div>
          </>
        )}
      </PageHero>

      {/* ─── INTRO NARRATIVE ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="w-16 h-1.5 bg-turquoise mx-auto rounded-full" />
            <div className="prose prose-slate max-w-none text-center prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:text-abysse prose-h2:leading-tight prose-h2:font-black prose-h2:tracking-tighter prose-h2:italic prose-p:text-lg md:prose-p:text-xl prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-abysse prose-strong:font-black">
              {schoolPageData?.intro?.title && (
                <h2 className="not-prose text-2xl md:text-4xl text-abysse leading-tight font-black tracking-tighter italic mb-8">
                  {schoolPageData.intro.title}
                </h2>
              )}
              <RenderText content={schoolPageData?.intro?.content} />
            </div>
          </motion.div>
        </div>
      </section>


      {/* ─── BLOC 1 : STAGES VACANCES ─────────────────────────────────────── */}
      <section id="stages-vacances" className="scroll-mt-20 bg-cyan-50 border-y border-cyan-100">

        {/* Header du bloc */}
        <div className="py-12 px-6">
          <div className="max-w-350 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="size-14 bg-turquoise rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                <Sun size={26} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-turquoise text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                  ● Stages Vacances Scolaires
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-abysse tracking-tighter leading-tight">Vacances scolaires</h2>
                <p className="text-slate-500 font-bold text-sm mt-1">5 jours · Été · Pâques · Toussaint · Encadrement diplômé FFVoile</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 max-w-sm leading-relaxed border-l-4 border-turquoise pl-5">
              Juillet et Août principalement, mais aussi à Pâques et à la Toussaint. Vous avez une semaine ? C'est suffisant pour faire ses premiers bords et rentrer avec un vrai carnet de progression — pas juste une initiation touristique.
            </div>
          </div>
        </div>

        {/* Grille de cartes */}
        <div className="px-4 lg:px-16 xl:px-32 pb-10">
          <StagesVacancesGrid items={stages} />

          {/* Note tarifaire */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-slate-600 uppercase tracking-wide mb-1">
                {schoolPageData?.tarifNote?.title || 'Tarifs indicatifs'}
              </p>
              <RenderText
                content={schoolPageData?.tarifNote?.description}
                className="text-xs text-slate-500 font-medium leading-relaxed"
                fallback="Les tarifs affichés sont donnés à titre indicatif (base 2022/2023). Les tarifs en cours et les modalités d'inscription sont disponibles directement à l'accueil du club ou sur Axyomes pour la licence FFVoile."
              />
              <a
                href={schoolPageData?.tarifNote?.ctaUrl || 'https://coutainville.axyomes.com/'}
                target="_blank"
                className="inline-flex items-center gap-2 mt-3 text-[10px] font-black text-turquoise uppercase tracking-widest hover:underline"
              >
                {schoolPageData?.tarifNote?.ctaLabel || 'Prendre sa licence sur Axyomes'} <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOC PRO : FORMATIONS PROFESSIONNELLES ────────────────────────── */}
      <section id="formations-pro" className="scroll-mt-20 bg-abysse border-y border-abysse/80">

        {/* Header — même structure que les deux autres sections */}
        <div className="py-16 px-6">
          <div className="max-w-350 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="size-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                <GraduationCap size={26} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                  ● Pôle Expertise & Formation
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter leading-tight">Formations Professionnelles</h2>
                <p className="text-white/50 font-bold text-sm mt-1">Moniteurs · Éducateurs · Responsables de structures</p>
              </div>
            </div>
            <div className="text-sm text-white/60 max-w-sm leading-relaxed border-l-4 border-white/20 pl-5">
              Des formations conçues par des professionnels du terrain. Forts de 5 ans d'expertise, nous accompagnons les moniteurs et responsables de clubs dans la maîtrise de leur discipline.
            </div>
          </div>
        </div>

        {/* Cards — slide mobile, grille desktop — même padding que stages vacances */}
        <div className="px-4 lg:px-16 xl:px-32 pb-20">
          <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory no-scrollbar">
            {proFormations.map((f: any) => (
              <div key={f._key || f.id || f.officialName}
                onClick={() => setSelectedProKey(f._key || f.id || f.officialName)}
                className="group snap-start shrink-0 w-[72vw] md:w-auto relative aspect-3/4 md:aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xl"
              >
                {/* Image plein fond */}
                <img src={f.image} alt={f.officialName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                {/* Dégradé sombre bas (plus dense que les tuiles vacances) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/10" />

                {/* Badge type — haut gauche */}
                <div className={`absolute top-4 left-4 ${f.accentColor || 'bg-abysse'} text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow`}>
                  {f.label}
                </div>

                {/* Durée — haut droite (desktop only) */}
                <div className="hidden md:flex absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide items-center gap-1">
                  <Clock size={9} /> {f.duration}
                </div>

                {/* Contenu bas */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                  <span className={`${f.color || 'text-turquoise'} text-[9px] font-black uppercase tracking-widest`}>
                    {f.target}
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter leading-tight">
                    {f.officialName}
                  </h3>
                  <div className="hidden md:flex flex-wrap gap-1.5 mt-1">
                    {(f.conditions || []).slice(0, 3).map((c: string, i: number) => (
                      <span key={i} className="text-[8px] font-black text-white/50 bg-white/10 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 pt-3 border-t border-white/10">
                    <span className={`${f.color || 'text-turquoise'} font-black text-sm`}>{f.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OVERLAY FORMATIONS PRO ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPro && (
          <>
            <motion.div
              key="pro-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-90 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedProKey(null)}
            />
            <motion.div
              key="pro-overlay"
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed z-100 inset-x-3 top-16 bottom-20 md:inset-x-28 md:inset-y-12 lg:inset-x-52 lg:inset-y-14 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Bouton fermer */}
              <button onClick={() => setSelectedProKey(null)}
                className="absolute top-4 right-10 z-10 p-2.5 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all shadow-md group"
                aria-label="Fermer">
                <LucideIcons.X size={24} className="transition-transform group-hover:rotate-90" />
              </button>

              {/* Image */}
              <div className="relative shrink-0 h-52 md:h-auto md:w-1/2">
                <img src={selectedPro.image} alt={selectedPro.officialName} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent md:bg-linear-to-r md:from-slate-900/20 md:to-transparent" />
              </div>

              {/* MOBILE : bloc unique scrollable */}
              <div className="md:hidden flex-1 overflow-y-auto flex flex-col min-h-0">
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <div className={`inline-flex items-center ${selectedPro.accentColor || 'bg-abysse'} text-white text-[9px] font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest`}>
                      {selectedPro.label}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${selectedPro.color || 'text-turquoise'} text-[10px] font-black uppercase tracking-widest`}>{selectedPro.target}</span>
                      <span className="text-slate-600 text-[10px]">·</span>
                      <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1"><Clock size={9} /> {selectedPro.duration}</span>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tighter leading-tight uppercase mb-1">{selectedPro.officialName}</h2>
                  </div>
                  <RenderText content={selectedPro.description} className="text-slate-300 text-[13px] font-medium leading-relaxed" />
                  {selectedPro.conditions?.length > 0 && (
                    <ul className="grid grid-cols-1 gap-1.5">
                      {selectedPro.conditions.map((c: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                          <CheckCircle2 size={12} className={`${selectedPro.color || 'text-turquoise'} shrink-0`} />{c}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Tarif</p>
                    <span className={`text-2xl font-black tracking-tighter ${selectedPro.color || 'text-turquoise'}`}>{selectedPro.price}</span>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2">
                  <a href={selectedPro.ctaUrl || 'mailto:contact@cncoutainville.fr'}
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl ${selectedPro.accentColor || 'bg-turquoise'} text-white font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-md`}
                    onClick={e => e.stopPropagation()}>
                    {selectedPro.ctaLabel || 'Nous contacter'} <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* DESKTOP : header fixe / description scroll / footer fixe */}
              <div className="hidden md:flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* Zone 1 : Header */}
                <div className="shrink-0 px-8 pt-8 pb-3">
                  <div className={`inline-flex items-center ${selectedPro.accentColor || 'bg-abysse'} text-white text-[10px] font-black px-5 py-1.5 rounded-full mb-5 uppercase tracking-widest`}>
                    {selectedPro.label}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${selectedPro.color || 'text-turquoise'} text-[10px] font-black uppercase tracking-widest`}>{selectedPro.target}</span>
                    <span className="text-slate-600 text-[10px]">·</span>
                    <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1"><Clock size={10} /> {selectedPro.duration}</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tighter leading-tight uppercase">{selectedPro.officialName}</h2>
                </div>

                {/* Zone 2 : Description scrollable */}
                <div
                  className="relative flex-1 min-h-0 border-y border-slate-700"
                  onWheel={e => { e.stopPropagation(); proScrollRef.current?.scrollBy({ top: e.deltaY, behavior: 'auto' }); }}
                >
                  <div
                    ref={proScrollRef}
                    onScroll={checkProScroll}
                    className="h-full overflow-y-auto px-8 py-4 flex flex-col gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                  >
                    <RenderText content={selectedPro.description} className="text-slate-300 text-base font-medium leading-relaxed" />
                    {selectedPro.conditions?.length > 0 && (
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2">
                        {selectedPro.conditions.map((c: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                            <CheckCircle2 size={11} className={`${selectedPro.color || 'text-turquoise'} shrink-0`} />{c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Fondu HAUT */}
                  <AnimatePresence>
                    {canProScrollUp && (
                      <motion.div key="pro-fade-top" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                        className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to bottom, rgb(15,23,42) 0%, transparent 100%)' }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Fondu BAS + chevron pulsé */}
                  <AnimatePresence>
                    {canProScrollDown && (
                      <motion.div key="pro-fade-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                        className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none flex items-end justify-center pb-2"
                        style={{ background: 'linear-gradient(to top, rgb(15,23,42) 0%, rgba(15,23,42,0.6) 60%, transparent 100%)' }}
                      >
                        <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                          <ChevronDown size={16} className="text-slate-500" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Zone 3 : Footer fixe */}
                <div className="shrink-0 px-8 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Tarif</p>
                    <span className={`text-3xl font-black tracking-tighter ${selectedPro.color || 'text-turquoise'}`}>{selectedPro.price}</span>
                  </div>
                  <a href="mailto:contact@cncoutainville.fr"
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl ${selectedPro.accentColor || 'bg-turquoise'} text-white font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-lg`}
                    onClick={e => e.stopPropagation()}>
                    Nous contacter <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── BLOC 2 : ÉCOLE À L'ANNÉE ─────────────────────────────────────── */}
      <section id="ecole-annee" className="scroll-mt-20 bg-white border-b border-slate-100">

        {/* Header du bloc */}
        <div className="py-12 px-6">
          <div className="max-w-350 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="size-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                <Calendar size={26} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                  ● École à l'Année
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-abysse tracking-tighter leading-tight">{ecoleAnneeData?.sectionTitle || 'Octobre → Juin'}</h2>
                <p className="text-slate-500 font-bold text-sm mt-1">{ecoleAnneeData?.sectionSubtitle || 'Mercredis (enfants 6-11 ans) · Samedis (jeunes & adultes)'}</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 max-w-sm leading-relaxed border-l-4 border-blue-500 pl-5">
              <RenderText content={ecoleAnneeData?.sectionDescription} fallback="Vous habitez dans le coin ou à proximité ? L'école à l'année, c'est le rythme du club : on revient chaque semaine, on progresse dans la durée, on intègre un groupe de son niveau. C'est ici que naissent les vrais navigateurs." />
            </div>
          </div>
        </div>

        {/* Cards des 4 groupes */}
        <div className="px-4 lg:px-16 xl:px-32 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {anneeGroups.map((group: any, i: number) => {
              const GroupIcon = group.iconName ? ((LucideIcons as any)[group.iconName] || LucideIcons.Anchor) : null;
              return (
              <motion.div
                key={group._key || group.id || i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
              >
                {/* Barre accent top */}
                <div className={`h-1.5 ${group.accentColor}`} />

                <div className="p-7 flex flex-col gap-5 flex-1">
                  {/* Header : icône + titre + prix */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`size-12 ${group.accentColor} rounded-2xl flex items-center justify-center text-white shadow-md shrink-0`}>
                        {GroupIcon ? <GroupIcon size={20} /> : group.icon}
                      </div>
                      <div>
                        <h3 className={`text-xl font-black ${group.color} tracking-tight leading-tight`}>{group.title}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{group.age}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-2xl font-black ${group.color} tracking-tighter leading-none`}>{group.price}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 max-w-25 text-right leading-tight">{group.priceSuffix}</p>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <Calendar size={13} className={`${group.color} shrink-0`} />
                      <span className="text-sm font-black text-abysse">{group.jour}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wind size={13} className={`${group.color} shrink-0`} />
                      <span className="text-sm font-bold text-slate-700">{group.activite}</span>
                    </div>
                    <RenderText content={group.detail} className="text-xs text-slate-500 leading-relaxed font-medium pl-5" />
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LA MÉTHODE CNC ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-abysse text-white relative overflow-hidden">
        <div className="absolute -top-40 -left-40 size-80 bg-turquoise/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-40 -right-40 size-80 bg-blue-500/10 rounded-full blur-[80px]" />

        <div className="max-w-350 mx-auto relative z-10">
          <div className="text-center mb-14">
            <div className="w-16 h-1 bg-turquoise mx-auto rounded-full mb-6" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4">La Méthode CNC</h2>
            <p className="text-slate-400 text-base font-medium max-w-xl mx-auto leading-relaxed">Ce qui se passe ici ne ressemble pas à ce qui se passe ailleurs. Et c'est voulu.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-4xl p-10 hover:bg-white/10 transition-all group">
              <div className="size-14 bg-turquoise rounded-2xl flex items-center justify-center text-abysse mb-8 shadow-xl">
                <MapPin size={26} />
              </div>
              <h3 className="text-xl font-black mb-4 leading-tight">Le spot, pas un plan d'eau</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Nos moniteurs connaissent chaque mètre carré du rivage de Coutainville. Ils vous apprennent à lire <strong className="text-white">les marées de la Manche</strong>, à anticiper les courants de la pointe d'Agon, à choisir son mouillage en fonction du vent du large. Une école enracinée dans son territoire.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-4xl p-10 hover:bg-white/10 transition-all group">
              <div className="size-14 bg-turquoise rounded-2xl flex items-center justify-center text-abysse mb-8 shadow-xl">
                <Shield size={26} />
              </div>
              <h3 className="text-xl font-black mb-4 leading-tight">Label FFVoile depuis 1929</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Tous nos moniteurs sont <strong className="text-white">diplômés d'État</strong>. La progression est validée sur carnet de voile officiel. La sécurité suit les protocoles de la Fédération Française de Voile. Ce n'est pas une école de loisirs, c'est une vraie filière d'apprentissage.
              </p>
            </div>

            <div className="bg-turquoise text-abysse rounded-4xl p-10 shadow-2xl relative overflow-hidden">
              <Sparkles size={64} className="opacity-10 absolute -top-4 -right-4" />
              <div className="size-14 bg-abysse rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl">
                <BookOpen size={26} />
              </div>
              <h3 className="text-xl font-black mb-4 leading-tight">Une progression visible</h3>
              <p className="text-abysse/70 text-sm font-medium leading-relaxed">
                On rentre Mini-Mousse. On ressort avec un niveau validé, des automatismes, une confiance. Chaque étape est documentée : le carnet de voile suit l'enfant d'une saison à l'autre. Les parents voient la progression. L'enfant la ressent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRATIQUE : MATÉRIEL & MÉTÉO ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-350 mx-auto">
          <div className="text-center mb-14">
            <span className="text-turquoise text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Le Sac de Bord</span>
            <h2 className="text-3xl md:text-5xl text-abysse font-black tracking-tighter leading-none">Prêt pour Le Grand Saut ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] hover:shadow-lg transition-all group">
              <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-abysse mb-8 shadow-md border border-slate-100 group-hover:bg-abysse group-hover:text-white transition-colors">
                <LifeBuoy size={28} />
              </div>
              <h3 className="text-xl text-abysse font-black mb-6">Matériel Fourni</h3>
              <ul className="space-y-4">
                {["Combinaisons intégrales", "Gilets de sauvetage", "Harnais de trapèze", "Coupe-vent"].map((it, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <CheckCircle2 size={16} className="text-turquoise shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] hover:shadow-lg transition-all group">
              <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-abysse mb-8 shadow-md border border-slate-100 group-hover:bg-abysse group-hover:text-white transition-colors">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl text-abysse font-black mb-6">À Prévoir</h3>
              <ul className="space-y-4">
                {["Maillot de bain", "Chaussures fermées sacrifiables", "Crème solaire & Lunettes", "Serviette & Rechange"].map((it, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <span className="text-turquoise font-black text-xs shrink-0">{i + 1}.</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-abysse text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <AlertTriangle size={64} className="opacity-10 absolute -top-4 -right-4" />
              <h3 className="text-xl font-black mb-6">Météo & Sécurité</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                La mer décide toujours. En cas de tempête, la séance est maintenue à terre (théorie, nœuds, matelotage) ou reportée. La sécurité prime sur le programme — et c'est aussi ça qu'on apprend.
              </p>
              <div className="p-5 bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest leading-loose">
                <Compass size={18} className="mb-2" />
                École labellisée FFVoile depuis 1929.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLANNING DES STAGES ─────────────────────────────────────────── */}
      <section id="planning" className="py-20 px-6 bg-white border-t border-slate-100 scroll-mt-24">
        <div className="max-w-350 mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-turquoise">
                <Calendar size={14} /> <span>Logistique</span>
              </div>
              <h2 className="text-4xl md:text-5xl text-abysse font-black tracking-tighter leading-none">Planning des Stages</h2>
              <p className="text-slate-400 text-sm font-bold mt-2">Disponibilités semaine par semaine pour les stages de vacances (juillet & août)</p>
            </div>

            {plannings && plannings.length > 0 && (
              <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm min-w-80">
                <button onClick={prevWeek} className="size-12 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400 hover:text-abysse">
                  <ChevronLeft size={20} />
                </button>
                <div className="relative flex-1 px-4 text-center">
                  <button onClick={() => setIsWeekSelectorOpen(!isWeekSelectorOpen)} className="w-full flex items-center justify-center gap-2">
                    <div>
                      <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Semaine {currentWeekIndex + 1} / {plannings.length}</span>
                      <span className="text-sm font-black text-abysse">{currentWeek?.title}</span>
                    </div>
                    <ChevronRight size={14} className={`text-slate-400 transition-transform duration-200 ${isWeekSelectorOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isWeekSelectorOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsWeekSelectorOpen(false)} />
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-70 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sélectionner une semaine</span>
                        </div>
                        <div className="max-h-55 overflow-y-auto py-1">
                          {plannings.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setCurrentWeekIndex(idx); setIsWeekSelectorOpen(false); }}
                              className={`w-full text-left px-4 py-3 text-xs font-bold flex items-center justify-between gap-2 transition-all ${idx === currentWeekIndex ? 'bg-abysse text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black ${idx === currentWeekIndex ? 'bg-turquoise text-abysse' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</span>
                                <span className="truncate">{p.title}</span>
                              </span>
                              {idx === currentWeekIndex && <span className="text-turquoise text-[10px] font-black uppercase">Actuel</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button onClick={nextWeek} className="size-12 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400 hover:text-abysse">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {currentWeek && (
            <div className="bg-slate-50 rounded-[3rem] p-4 md:p-8 border border-slate-100 shadow-inner overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-250 border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white rounded-xl border border-slate-100">Stage</th>
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map(d => (
                        <th key={d} className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white rounded-xl border border-slate-100">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PLANNING_ROWS.map(row => (
                      <tr key={row.id}>
                        <td className="p-4 bg-white rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className={`size-9 ${row.bgColor} rounded-lg flex items-center justify-center text-white shadow-sm`}>{row.icon}</div>
                            <div>
                              <div className={`text-xs font-black ${row.color}`}>{row.title}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.age}</div>
                            </div>
                          </div>
                        </td>
                        {(currentWeek.days ?? []).slice(0, 5).map((dayData: any, i: number) => {
                          const raw = dayData ? row.accessor(dayData) : undefined;
                          const timeStr = raw && typeof raw === 'object' ? raw.time : (raw as string | undefined);
                          const activity = raw && typeof raw === 'object' ? raw.activity : undefined;
                          const isFull = timeStr === 'COMPLET' || timeStr === 'Full';
                          const isClosed = timeStr === 'FERMÉ' || timeStr === 'N/A';
                          return (
                            <td key={i} className="p-2">
                              <div className={`h-14 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${isFull ? 'bg-rose-50 border-rose-100 text-rose-500' : isClosed ? 'bg-slate-50 border-slate-100 text-slate-300' : `bg-white border-slate-100 ${row.color} hover:border-slate-200`}`}>
                                <span className="text-[10px] font-black uppercase tracking-tighter">{timeStr || 'OUVERT'}</span>
                                {activity && !isFull && !isClosed && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{activity}</span>}
                                {!timeStr && !isFull && !isClosed && <div className={`size-1.5 ${row.bgColor} rounded-full animate-pulse`} />}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-350 mx-auto text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Besoin de conseils ?</p>
            <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:contact@cncoutainville.fr" className="px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-abysse font-black text-xs transition-all border border-slate-100 inline-block">contact@cncoutainville.fr</a>
                <a href="tel:0233471486" className="px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-abysse font-black text-xs transition-all border border-slate-100 inline-block">02 33 47 14 86</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default EcoleVoileClient;
