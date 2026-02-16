
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SecondaryNav } from '@/components/SecondaryNav';
import { useContent } from '@/contexts/ContentContext';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Anchor,
  Sun,
  Wind,
  ArrowRight,
  Waves,
  Download,
  Info,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  LifeBuoy,
  Ship,
  Sparkles,
  Compass,
  ArrowDownCircle,
  Clock,
  Euro
} from 'lucide-react';

import { motion } from 'framer-motion';

// --- DATA: PLANNING ROWS ---
const PLANNING_ROWS = [
  {
    id: "miniMousses",
    title: "Mini-Mousses",
    age: "5-7 ans",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    icon: <Sun size={24} />,
    accessor: (day: any) => day.miniMousses
  },
  {
    id: "mousses",
    title: "Moussaillons",
    age: "8-9 ans",
    color: "text-turquoise",
    bgColor: "bg-turquoise",
    icon: <Anchor size={24} />,
    accessor: (day: any) => day.mousses
  },
  {
    id: "initiation",
    title: "Initiation",
    age: "10-16 ans",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    icon: <Wind size={24} />,
    accessor: (day: any) => day.initiation
  },
  {
    id: "perfectionnement",
    title: "Perfectionnement",
    age: "10-16 ans",
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    icon: <Waves size={24} />,
    accessor: (day: any) => day.perfectionnement
  }
];

// --- DATA: NIVEAUX D'ENSEIGNEMENT (STORYTELLING VERSION) ---
const SCHOOL_STORY = [
  {
    id: "mini-mousses",
    step: "01",
    phase: "L'Éveil",
    title: "Les Petits Pas",
    officialName: "Mini-Mousses",
    age: "5-7 ans",
    hook: "Apprivoiser l'eau, un jeu d'enfant.",
    description: `Le voyage commence ici. Pour les plus petits, la mer est un terrain de jeu intimidant mais fascinant. Notre approche privilégie l'immersion douce. 
    
    Tout commence dans la sécurité rassurante de notre bassin marin. Entre deux éclaboussures, on apprend à flotter, à diriger un petit bateau, et surtout à ne plus avoir peur. C'est le temps de la découverte pluri-activités : un jour moussaillon sur un Optimist, le lendemain pilote de char à voile ou dompteur de cerf-volant.`,
    longDescription: `Proposé uniquement en Juillet et Août, ce stage inclut des séances de natation dispensées par la Fédération Française de Natation dans le bassin présent à l'école de voile. 
    
    Le programme est riche et varié : deux séances de deux heures du Lundi au Vendredi. Le stage est modulable : l'activité est choisie la veille en fonction du groupe et de la météo. L'effectif est limité à 8 enfants avec un matériel spécialement adapté aux plus petits.`,
    price: "163 €",
    prices: [{ label: "Stage Semaine (Tout Inclus)", value: "163 €" }],
    logistique: ["Gilet de sauvetage fourni", "Combinaison adaptée fournie", "Bassin marin sécurisé", "Carnet de voile offert"],
    image: "/images/imgBank/minimousse.jpg",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    icon: <Sun size={24} />
  },
  {
    id: "moussaillons",
    step: "02",
    phase: "L'Exploration",
    title: "Le Cap vers l'Horizon",
    officialName: "Moussaillons",
    age: "6-9 ans",
    hook: "De la mare au rivage, l'aventure s'agrandit.",
    description: `L'enfant grandit, son terrain de jeu aussi. On quitte la protection du bassin pour les eaux calmes de la mare de L’Essay. C'est là, sans vagues ni courants, que l'on prend véritablement les commandes de son Optimist.
    
    Une fois les bases acquises, la mer nous appelle. Du mardi au vendredi, le rivage de Coutainville devient notre domaine. On apprend à lire le vent, à sentir la glisse sur un trimaran ou à filer sur le sable en char à voile. Chaque jour est une nouvelle histoire de mer adaptée aux éléments.`,
    longDescription: `Le stage se déroule en Juillet et Août. Le lundi matin est consacré à la prise en main sur plan d'eau intérieur pour une sécurité totale. 
    
    Le reste de la semaine, les séances de 2h permettent une progression ludique vers l'autonomie. Toujours à la carte selon la météo : Optimist, Trimaran, Catamaran ou Chars à voile. 8 enfants maximum par moniteur.`,
    price: "168 €",
    prices: [{ label: "Stage Semaine (Tout Inclus)", value: "168 €" }],
    logistique: ["Initiation sur lac incluse", "Matériel sécurisé FFV", "Passage de niveaux", "Combinaison fournie"],
    image: "/images/imgBank/moussaillon.jpg",
    color: "text-turquoise",
    bgColor: "bg-turquoise",
    icon: <Anchor size={24} />
  },
  {
    id: "catamaran",
    step: "03",
    phase: "La Puissance",
    title: "Dompter le Vent",
    officialName: "Stage Catamaran",
    age: "Dès 8 ans",
    hook: "Vitesse, équipe et adrénaline salée.",
    description: `C'est le passage aux choses sérieuses. Le catamaran, c'est la vitesse pure et le partage. On ne navigue plus seul, on fait partie d'un équipage. 
    
    On apprend l'équilibre dynamique, le réglage fin des voiles et la coordination parfaite. Du petit 10 pieds pour les juniors aux puissants 16 pieds pour les adultes, chaque support est une promesse de sensations. On ne subit plus le vent, on l'utilise pour voler au-dessus des vagues de la Manche.`,
    longDescription: `Stage de référence pour ados et adultes. 5 demi-journées (lundi au vendredi) avec des séances de 3h. 
    Supports adaptés :
    - 10/12 pieds : Initiation jeunes
    - 14/16 pieds : Perf et adultes
    Le tarif inclut systématiquement le passeport voile et l'adhésion club.`,
    price: "Dès 183 €",
    prices: [
      { label: "Cata 10-12 pieds (8-12 ans)", value: "183 €" },
      { label: "Cata 14 pieds (13-15 ans)", value: "203 €" },
      { label: "Cata 16 pieds (Adultes)", value: "233 €" }
    ],
    logistique: ["Bateaux de sécurité dédiés", "Liaison radio permanente", "Matériel renouvelé régulièrement", "Licence FFV comprise"],
    image: "/images/imgBank/Cata001.jpg",
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    icon: <Wind size={24} />
  },
  {
    id: "planche",
    step: "04",
    phase: "La Maîtrise",
    title: "L'Équilibre Pur",
    officialName: "Stage Planche",
    age: "Dès 10 ans",
    hook: "Faire corps avec les éléments.",
    description: `Ici, l'aventure devient personnelle. La planche à voile, c'est le dialogue direct entre votre corps, le vent et l'eau. C'est l'école de la persévérance et de la récompense immédiate.
    
    Après les premières chutes riches d'enseignement, vient le moment magique : la planche se stabilise, la voile prend le vent, et vous glissez en silence. De l'apprentissage des manoeuvres de base au funboard spectaculaire, nous vous accompagnons vers une liberté totale sur l'eau.`,
    longDescription: `Accessible dès 10 ans. Matériel récent F-One et Duotone. Boards larges pour débuter, voiles légères pour les jeunes. 
    5 séances de 3h du lundi au vendredi. Progression individualisée validée sur livret FFV.`,
    price: "183 €",
    prices: [{ label: "Stage Semaine (Tout Inclus)", value: "183 €" }],
    logistique: ["Planches larges haute stabilité", "Gréements légers spécial jeunes", "Encadrement expert", "Combinaison renforcée"],
    image: "/images/imgBank/WindsurfandKite.jpg",
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    icon: <Waves size={24} />
  },
  {
    id: "formation",
    step: "05",
    phase: "La Transmission",
    title: "Partager l'Horizon",
    officialName: "CQP Initiateur",
    age: "Dès 16 ans",
    hook: "Transmettez votre passion, devenez moniteur.",
    description: `Vous avez dompté le vent et maîtrisé la glisse. L'heure est venue de passer de l'autre côté de la barre. Le CQP Initiateur Voile est l'étape ultime de votre parcours à Coutainville : apprendre à enseigner, à sécuriser et à inspirer les futurs navigateurs.
    
    Au sein du Centre Permanent de la Côte Ouest (CPCO), cette formation vous plonge dans la réalité du métier de moniteur en partenariat avec les clubs de Hauteville et Barneville-Carteret. Un mélange de théorie et de pratique intensive pour faire de votre passion une compétence reconnue.`,
    longDescription: `Le CQP Initiateur Voile permet d’encadrer sous la responsabilité d’un moniteur diplômé. 
    Formation en situation à Agon-Coutainville, Hauteville sur mer et Barneville-Carteret (CPCO). 
    
    Conditions d'accès : 16 ans min, Niveau 4 FFVoile, PSC1, Permis Bateau Côtier.
    Pour toute question sur le PSC1 (secourisme) ou le recyclage, contactez-nous par mail à contact@cncoutainville.fr`,
    price: "Frais Pédago : Nous contacter",
    prices: [
      { label: "CQP Initiateur Voile", value: "Sur Devis" },
      { label: "Formation PSC1 / Recyclage", value: "Nous contacter" }
    ],
    logistique: [
      "Avoir 16 ans minimum",
      "Niveau 4 FFVoile (ou équivalent)",
      "PSC1 / Diplôme Secourisme",
      "Permis bateau option côtière",
      "Licence FFVoile valide"
    ],
    image: "/images/imgBank/Secourisme.jpg",
    color: "text-slate-900",
    bgColor: "bg-slate-900",
    icon: <GraduationCap size={24} />
  }
];

// --- COMPOSANT : STORY SECTION ---
const StorySection: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div id={item.id} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-1/2 h-full bg-slate-50 -z-10 hidden lg:block opacity-50`}></div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>

          {/* Visual Column */}
          <div className="w-full lg:w-1/2 group">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-4/3">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl border border-white/40 flex flex-col min-w-[140px]">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Public</span>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-2xl md:text-3xl font-black ${item.color} uppercase italic tracking-tighter leading-none`}>
                      {item.age}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-abysse font-black uppercase italic tracking-tight leading-none">
                    {item.officialName}
                  </span>
                </div>
                <div className={`size-12 md:size-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${item.bgColor} border-2 border-white/20 shrink-0`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-4 mb-8">
              <span className={`text-6xl font-black ${item.color} opacity-20 tracking-tighter leading-none`}>{item.step}</span>
              <div className="w-12 h-1 bg-turquoise rounded-full"></div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{item.phase}</span>
            </div>

            <h2 className="text-4xl md:text-6xl text-abysse leading-[0.85] mb-6">
              {item.title}
            </h2>

            <p className="text-turquoise text-lg font-black uppercase tracking-widest mb-8 leading-tight">
              "{item.hook}"
            </p>

            <div className="text-slate-600 text-lg font-medium leading-relaxed text-justify mb-10 whitespace-pre-line">
              {item.description}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[11px] transition-all ${isExpanded ? 'bg-abysse border-abysse text-white' : 'bg-white border-slate-100 text-abysse hover:border-turquoise hover:text-turquoise shadow-sm'}`}
              >
                {isExpanded ? 'Masquer les détails' : 'Fiche Technique & Tarifs'}
                {isExpanded ? <ChevronLeft className="rotate-90" size={16} /> : <ArrowDownCircle size={16} />}
              </button>

              <a
                href="https://coutainville.axyomes.com/"
                target="_blank"
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl ${item.bgColor} text-white font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-${item.bgColor}/20`}
              >
                Réserver ce stage <ArrowRight size={16} />
              </a>
            </div>

            {/* Technical Detail Panel (Expandable) */}
            <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-10' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="flex items-center gap-3 text-turquoise text-[10px] mb-6 border-b border-white/10 pb-3">
                        <Euro size={16} /> Tarifs
                      </h4>
                      <div className="space-y-4">
                        {item.prices.map((p: any, i: number) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase">{p.label}</span>
                            <span className="text-lg font-black text-white">{p.value}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-[9px] text-slate-500 italic leading-tight">
                        * Les tarifs incluent systématiquement la licence FFV, l'adhésion au club et le prêt du matériel complet.
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-3 text-turquoise text-[10px] mb-6 border-b border-white/10 pb-3">
                        <LifeBuoy size={16} /> Logistique & Pratique
                      </h4>
                      <ul className="space-y-3">
                        {item.logistique.map((log: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-300">
                            <div className="size-1.5 rounded-full bg-turquoise"></div>
                            {log}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                          {item.longDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGE PRINCIPALE ---
export const EcoleVoilePage: React.FC = () => {
  const { plannings: rawPlannings, isLoading } = useContent();
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false);

  // Tri chronologique par startDate (sécurité côté client)
  const plannings = React.useMemo(() => {
    if (!rawPlannings?.length) return [];
    return [...rawPlannings].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateA - dateB;
    });
  }, [rawPlannings]);

  const currentWeek = plannings?.[currentWeekIndex];

  const nextWeek = () => { if (plannings) setCurrentWeekIndex(prev => (prev + 1) % plannings.length); };
  const prevWeek = () => { if (plannings) setCurrentWeekIndex(prev => (prev - 1 + plannings.length) % plannings.length); };

  if (isLoading && !plannings?.length) return (
    <div className="min-h-screen bg-abysse flex flex-col items-center justify-center text-white text-center p-6">
      <div className="relative size-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-turquoise/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-turquoise border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass size={48} className="text-turquoise" />
        </div>
      </div>
      <p className="font-black uppercase tracking-[0.3em] text-sm">Chargement du journal de bord...</p>
    </div>
  );

  return (
    <div className="w-full font-sans bg-white">

      {/* 1. HERO HEADER - IMMERSIF */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-abysse">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/imgBank/CataPharePointeAgon.jpg"
            className="w-full h-full object-cover opacity-50 scale-105"
            alt="Sailing School"
          />
          <div className="absolute inset-0 bg-linear-to-b from-abysse/80 via-abysse/40 to-white"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-[1400px] mt-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8"
            >
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <GraduationCap size={14} className="text-turquoise" /> École Française de Voile
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.8] mb-12"
            >
              L'École de <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-turquoise to-white">La Mer.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex items-center gap-8 border border-slate-100 min-w-[300px]">
                <div className="size-16 rounded-2xl bg-abysse flex items-center justify-center text-white shadow-lg shrink-0">
                  <Anchor size={32} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Fondée en</p>
                  <p className="text-4xl font-black text-abysse tracking-tighter">1978</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Savoir-faire historique</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 flex items-center gap-8 min-w-[300px]">
                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={32} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Label</p>
                  <p className="text-2xl font-black text-white uppercase italic leading-none">Qualité FFV</p>
                  <p className="text-[10px] text-white/60 font-bold mt-1 uppercase italic">Stages tous niveaux</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MENU SECONDAIRE STICKY (Style Harmonisé) */}
      <SecondaryNav sections={[
        { id: 'mini-mousses', label: '5-7 ans' },
        { id: 'moussaillons', label: '8-9 ans' },
        { id: 'catamaran', label: 'Catamaran' },
        { id: 'planche', label: 'Planche' },
        { id: 'formation', label: 'Formation' },
        { id: 'planning', label: 'Planning' },
      ]} />

      <div className="relative z-20"></div>

      {/* 2. THE NARRATIVE JOURNEY */}
      <section className="relative bg-white">
        {/* The Connector line (Journey Line) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-linear-to-b from-turquoise/0 via-turquoise to-turquoise/0 hidden lg:block opacity-20"></div>

        {SCHOOL_STORY.map((item, index) => (
          <StorySection key={item.id} item={item} index={index} />
        ))}
      </section>

      {/* 3. PRACTICAL INFO GRID */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute -top-40 -left-40 size-96 bg-turquoise/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -right-40 size-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-turquoise text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Le Sac de Bord</span>
              <h2 className="text-4xl md:text-6xl leading-none">
                Prêt pour<br />Le Grand Saut ?
              </h2>
            </div>
            <div className="max-w-xs text-slate-400 text-sm font-medium leading-relaxed border-l-2 border-turquoise pl-6">
              Nous nous occupons de la technique, vous apportez l'enthousiasme. Voici tout ce qu'il faut savoir avant d'embarquer.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Equipt Provided */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-all group">
              <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-abysse mb-8 shadow-xl group-hover:bg-turquoise group-hover:text-white transition-colors">
                <LifeBuoy size={32} />
              </div>
              <h3 className="text-2xl mb-6">Matériel Fourni</h3>
              <ul className="space-y-4">
                {["Combinaisons intégrales", "Gilets de sauvetage", "Harnais de trapèze", "Coupe-vent"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-bold text-sm tracking-wide">
                    <CheckCircle2 size={18} className="text-turquoise" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* To Bring */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-all group">
              <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-abysse mb-8 shadow-xl group-hover:bg-turquoise group-hover:text-white transition-colors">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl mb-6">À Prévoir</h3>
              <ul className="space-y-4">
                {[
                  "Maillot de bain",
                  "Chaussures fermées sacrifiables",
                  "Crème solaire & Lunettes",
                  "Serviette & Rechange"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-bold text-sm tracking-wide">
                    <span className="text-turquoise font-black text-xs">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety/Weather */}
            <div className="bg-turquoise text-abysse p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <AlertTriangle size={64} className="opacity-10 absolute -top-4 -right-4" />
              <h3 className="text-2xl mb-6">Météo & Sécurité</h3>
              <p className="font-bold leading-relaxed mb-8">
                La mer décide toujours. En cas de tempête, la séance est maintenue à terre (théorie, noeuds, matelotage) ou reportée au samedi.
              </p>
              <div className="p-6 bg-abysse/10 rounded-2xl border border-abysse/10 font-black text-[10px] uppercase tracking-widest leading-loose">
                <Compass size={20} className="mb-2" />
                École labellisée Fédération Française de Voile depuis 1978.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLANNING & DISPO (COMPACT AT BOTTOM) */}
      <section id="planning" className="py-24 px-6 bg-white border-t border-slate-100 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-turquoise">
                <Calendar size={14} /> <span>Logistique</span>
              </div>
              <h2 className="text-4xl md:text-5xl text-abysse leading-none">
                Le Planning des Stages
              </h2>
            </div>

            {/* Week Selector */}
            {plannings && plannings.length > 0 && (
              <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm min-w-[320px]">
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
                      {/* Backdrop to close on click outside */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsWeekSelectorOpen(false)} />
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[280px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        {/* Header with current position indicator */}
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sélectionner une semaine</span>
                        </div>
                        {/* Scrollable list with max 5 visible items */}
                        <div className="max-h-[220px] overflow-y-auto py-1">
                          {plannings.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setCurrentWeekIndex(idx); setIsWeekSelectorOpen(false); }}
                              className={`w-full text-left px-4 py-3 text-xs font-bold flex items-center justify-between gap-2 transition-all ${idx === currentWeekIndex
                                ? 'bg-abysse text-white'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                              <span className="flex items-center gap-3">
                                <span className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black ${idx === currentWeekIndex ? 'bg-turquoise text-abysse' : 'bg-slate-100 text-slate-400'
                                  }`}>{idx + 1}</span>
                                <span className="truncate">{p.title}</span>
                              </span>
                              {idx === currentWeekIndex && <span className="text-turquoise text-[10px] font-black uppercase">Actuel</span>}
                            </button>
                          ))}
                        </div>
                        {/* Footer with navigation hint */}
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-medium">
                          <ChevronLeft size={10} /> Utilisez les flèches pour naviguer <ChevronRight size={10} />
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

          {/* Table Design Vertical-Friendly */}
          {currentWeek && (
            <div className="bg-slate-50 rounded-[3rem] p-4 md:p-8 border border-slate-100 shadow-inner overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[1000px] border-separate border-spacing-2">
                  <thead>
                    <tr>
                      <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-200">Parcours</th>
                      {currentWeek.days.map((day, i) => (
                        <th key={i} className="p-6 text-center border-b-2 border-slate-200">
                          <div className="text-xs font-black text-abysse uppercase tracking-widest mb-1">{day.name}</div>
                          <div className="text-[10px] font-bold text-slate-400">{new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="before:block before:h-4">
                    {PLANNING_ROWS.map((row) => (
                      <tr key={row.id} className="group">
                        <td className={`p-4 rounded-2xl ${row.bgColor} text-white shadow-lg`}>
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center">{React.cloneElement(row.icon as React.ReactElement<any>, { size: 18 })}</div>
                            <div>
                              <div className="text-[8px] font-black uppercase tracking-widest opacity-60">{row.age}</div>
                              <div className="text-sm font-black italic uppercase leading-none">{row.title}</div>
                            </div>
                          </div>
                        </td>
                        {currentWeek.days.map((day, dayIdx) => {
                          const data = row.accessor(day);
                          const timeStr = typeof data === 'object' ? data?.time : data;
                          const activity = typeof data === 'object' ? data?.activity : row.title;
                          if (!data) return <td key={dayIdx} className="bg-white/40 rounded-2xl"></td>;
                          return (
                            <td key={dayIdx} className="bg-white rounded-2xl p-6 border border-slate-100 group-hover:border-slate-300 transition-all text-center">
                              <div className="flex items-center justify-center gap-2 mb-2 text-abysse">
                                <Clock size={14} className="text-slate-300" />
                                <span className="text-xs font-black tracking-tighter">{timeStr}</span>
                              </div>
                              <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${row.color}`}>
                                {activity}
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

          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-abysse p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-turquoise/10 to-transparent"></div>
            <div className="relative z-10">
              <h4 className="text-2xl text-white mb-2">Prêt à Larguer les Amarres ?</h4>
              <p className="text-slate-400 text-sm font-bold mb-6">Inscrivez-vous directement sur notre plateforme Axyomes ou téléchargez les documents papier.</p>
              <div className="flex flex-wrap gap-4">
                <a href="https://coutainville.axyomes.com/" target="_blank" className="relative z-10 flex items-center gap-4 bg-turquoise text-abysse px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl">
                  Accéder aux inscriptions <ArrowRight size={20} />
                </a>
                <a href="/infos-pratiques#documents-stages" className="relative z-10 flex items-center gap-4 bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-abysse transition-all">
                  Documents d'inscription (PDF) <Download size={18} className="text-turquoise" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER PADDING */}
      <div className="h-32 bg-white"></div>
    </div>
  );
};

export default EcoleVoilePage;
