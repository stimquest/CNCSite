
"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Anchor,
  Sun,
  Wind,
  ArrowRight,
  Waves,
  Info,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  Calendar,
  Map,
  Trophy,
  Ship,
  LifeBuoy
} from 'lucide-react';

// --- DATA: PLANNING & SEMAINES ---
// Structure stricte avec start/end pour les horaires

const PLANNING_WEEKS = [
  {
    id: 1,
    label: "Semaine du 7 au 11 Juillet",
    coefficient: 85,
    tide: "Matin",
    days: [
      {
        name: "Lundi 07",
        mini: { start: "09:30", end: "12:00", activity: "Piscine", icon: "pool" },
        mousse: { start: "09:30", end: "12:00", activity: "Optimist", icon: "boat" },
        initiation: { start: "14:00", end: "17:00", isRaid: false },
        perf: { start: "14:00", end: "17:00", isRaid: false }
      },
      {
        name: "Mardi 08",
        mini: { start: "09:30", end: "12:00", activity: "Char à Voile", icon: "wind" },
        mousse: { start: "09:30", end: "12:00", activity: "Catamaran", icon: "cata" },
        initiation: { start: "14:30", end: "17:30", isRaid: false },
        perf: { start: "14:30", end: "17:30", isRaid: false }
      },
      {
        name: "Mercredi 09",
        mini: { start: "09:30", end: "12:00", activity: "Pêche à pied", icon: "fish" },
        mousse: { start: "09:30", end: "12:00", activity: "Paddle", icon: "sup" },
        initiation: { start: "15:00", end: "18:00", isRaid: false },
        perf: { start: "10:00", end: "17:00", isRaid: true, label: "Raid Chausey" } 
      },
      {
        name: "Jeudi 10",
        mini: { start: "09:30", end: "12:00", activity: "Cerf-Volant", icon: "kite" },
        mousse: { start: "09:30", end: "12:00", activity: "Char à Voile", icon: "wind" },
        initiation: { start: "15:30", end: "18:30", isRaid: false },
        perf: { start: "15:30", end: "18:30", isRaid: false }
      },
      {
        name: "Vendredi 11",
        mini: { start: "09:30", end: "12:00", activity: "Optimist Mer", icon: "boat" },
        mousse: { start: "09:30", end: "12:00", activity: "Chasse Trésor", icon: "map" },
        initiation: { start: "16:00", end: "19:00", isRaid: false },
        perf: { start: "16:00", end: "19:00", isRaid: false }
      }
    ]
  },
  {
    id: 2,
    label: "Semaine du 14 au 18 Juillet",
    coefficient: 45,
    tide: "Après-midi",
    days: [
      {
        name: "Lundi 14",
        mini: { start: "14:00", end: "16:30", activity: "Piscine", icon: "pool" },
        mousse: { start: "14:00", end: "16:30", activity: "Optimist Lac", icon: "boat" },
        initiation: { start: "09:30", end: "12:30", isRaid: false },
        perf: { start: "09:30", end: "12:30", isRaid: false }
      },
      {
        name: "Mardi 15",
        mini: { start: "14:00", end: "16:30", activity: "Cata Cool", icon: "cata" },
        mousse: { start: "14:00", end: "16:30", activity: "Char à Voile", icon: "wind" },
        initiation: { start: "10:00", end: "13:00", isRaid: false },
        perf: { start: "10:00", end: "13:00", isRaid: false }
      },
      {
        name: "Mercredi 16",
        mini: { start: "14:00", end: "16:30", activity: "Cerf-Volant", icon: "kite" },
        mousse: { start: "14:00", end: "16:30", activity: "Kayak Fun", icon: "sup" },
        initiation: { start: "09:00", end: "17:00", isRaid: true, label: "Raid Ecréhou" }, 
        perf: { start: "10:30", end: "13:30", isRaid: false }
      },
      {
        name: "Jeudi 17",
        mini: { start: "14:00", end: "16:30", activity: "Château Sable", icon: "map" },
        mousse: { start: "14:00", end: "16:30", activity: "Optimist Mer", icon: "boat" },
        initiation: { start: "11:00", end: "14:00", isRaid: false },
        perf: { start: "11:00", end: "14:00", isRaid: false }
      },
      {
        name: "Vendredi 18",
        mini: { start: "14:00", end: "16:30", activity: "Olympiades", icon: "trophy" },
        mousse: { start: "14:00", end: "16:30", activity: "Régate", icon: "trophy" },
        initiation: { start: "11:30", end: "14:30", isRaid: false },
        perf: { start: "11:30", end: "14:30", isRaid: false }
      }
    ]
  }
];


// Configuration des Lignes du Planning (Indépendant du catalogue)
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

// --- DATA: NIVEAUX D'ENSEIGNEMENT OFFICIELS ---
const SCHOOL_LEVELS = [
  {
    id: "mini-mousses",
    title: "Mini-Mousses",
    age: "5-7 ans",
    subtitle: "Pluri-activité & Aisance",
    price: "163 €",
    priceDetail: "/semaine (tout inclus)",
    description: `Le stage Mini-Mousses est spécialement conçu pour que les 5/7 ans puissent découvrir les activités nautiques et véliques à leur rythme.
    
    Proposé uniquement en Juillet et Août, ce stage inclut des séances de natation dispensées par la Fédération Française de Natation dans le bassin présent à l'école de voile. C'est une sécurité indispensable pour appréhender la mer sereinement.
    
    Le programme est riche et varié : deux séances de deux heures du Lundi au Vendredi. Le stage est modulable : l'activité est choisie la veille en fonction du groupe et de la météo parmi toutes les activités proposées : Natation, Optimist, Trimaran, Catamaran, Chars à voile ou Cerf volant.
    
    Les cours sont encadrés par des moniteurs diplômés en voile et chars à voile. L'effectif du groupe est limité à huit enfants pour permettre un apprentissage optimum. Le matériel est spécialement adapté aux plus petits (chars à voile enfant, bateau collectif, optimist).`,
    gallery: [
      "https://images.unsplash.com/photo-1596423736772-799a4e3df530?q=80&w=1600",
      "https://images.unsplash.com/photo-1516686120803-03099958197c?q=80&w=1600",
      "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=1600"
    ],
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500",
    icon: <Sun size={24} />
  },
  {
    id: "moussaillons",
    title: "Moussaillons",
    age: "6-9 ans",
    subtitle: "Découverte & Autonomie",
    price: "168 €",
    priceDetail: "/semaine (tout inclus)",
    description: `Le stage Moussaillons est l'étape suivante, conçu pour les 6-9 ans. Il se déroule également en Juillet et Août.
    
    Une particularité importante de ce stage : le Lundi matin, la séance d'Optimist se déroule sur la mare de L’Essay (plan d’eau intérieur) situé devant le Centre équestre d’Agon Coutainville. Cela permet une prise en main du bateau en toute sécurité, sans vagues ni courants.
    
    Ensuite, du mardi au vendredi, place à l'aventure avec une séance de 2h par jour sur des activités variées. Comme pour les plus petits, le programme est "à la carte" et adapté la veille selon la météo : Optimist, Trimaran, Catamaran, Chars à voile ou Cerf volant.
    
    L'objectif est que les enfants se fassent plaisir tout en progressant vers l'autonomie. L'effectif est limité à 8 enfants par moniteur diplômé.`,
    gallery: [
      "https://images.unsplash.com/photo-1562677765-a8775df50b4e?q=80&w=1600",
      "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1600",
      "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1600"
    ],
    color: "text-turquoise",
    bgColor: "bg-turquoise",
    borderColor: "border-turquoise",
    icon: <Anchor size={24} />
  },
  {
    id: "catamaran",
    title: "Catamaran",
    age: "Dès 8 ans",
    subtitle: "Vitesse & Équipe",
    price: "Dès 183 €",
    priceDetail: "/semaine (tout inclus)",
    description: `Le stage de référence pour les enfants dès 8 ans, les adolescents et les adultes. Que ce soit pour de l'initiation ou du perfectionnement, le catamaran offre des sensations de vitesse immédiates.
    
    Le stage se compose de 5 demi-journées (du lundi au vendredi) avec des séances de 3h. Nous adaptons le support à la morphologie et à l'âge des pratiquants : Catamaran 10 pieds pour les plus jeunes, jusqu'au puissant 16 pieds pour les adultes.
    
    Les tarifs incluent la licence voile stage ponctuel FFV (12€) et l'adhésion (20€).`,
    pricingTiers: [
        { label: "Cata 10 pieds (8-9 ans)", price: "183€/pers" },
        { label: "Cata 12 pieds (10-12 ans)", price: "183€/pers" },
        { label: "Cata 14 pieds (13-15 ans)", price: "203€/pers" },
        { label: "Cata 16 pieds (16+ ans)", price: "233€/pers" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600",
      "https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=1600",
      "https://images.unsplash.com/photo-1563462058316-29a399f665e7?q=80&w=1600"
    ],
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-600",
    icon: <Wind size={24} />
  },
  {
    id: "planche",
    title: "Planche à Voile",
    age: "Dès 10 ans",
    subtitle: "Équilibre & Glisse",
    price: "183 €",
    priceDetail: "/semaine (tout inclus)",
    description: `Pour tous, adultes et ados à partir de 14 ans. De l’initiation au funboard, nous possédons du matériel récent et adapté à tous les niveaux (planches larges et stables pour débuter, flotteurs plus techniques pour progresser).
    
    Le stage se déroule sur 5 demi-journées (du lundi au vendredi) avec des séances de 3h. C'est le support roi pour ressentir la force du vent dans les mains et travailler son équilibre.
    
    Le tarif inclut le passeport voile et l'adhésion au club.`,
    gallery: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1600",
      "https://images.unsplash.com/photo-1473663175406-03c6237227d8?q=80&w=1600",
      "https://images.unsplash.com/photo-1628173429871-3f0e01764491?q=80&w=1600"
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    borderColor: "border-purple-500",
    icon: <Waves size={24} />
  }
];

// --- UTILS: ICON MAPPING ---
const getActivityIcon = (type: string) => {
    switch(type) {
        case 'piscine': return <LifeBuoy size={16} />;
        case 'optimist': return <Ship size={16} />;
        case 'catamaran': return <Anchor size={16} />;
        case 'paddle': return <Waves size={16} />;
        case 'char': return <Wind size={16} />;
        default: return <Sun size={16} />;
    }
};

// --- COMPOSANT : SLIDER PHOTO ---
const PhotoSlider: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group overflow-hidden bg-slate-200">
      {/* Images */}
      {images.map((img, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <img src={img} alt={`${title} ${idx}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Overlay léger pour contraste boutons */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <button 
          onClick={prev}
          className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-abysse transition-all shadow-lg"
        >
            <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-abysse transition-all shadow-lg"
        >
            <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// --- PAGE PRINCIPALE ---
import { useContent } from '@/contexts/ContentContext';

export const EcoleVoilePage: React.FC = () => {
  const { plannings, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState('all');
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const visibleLevels = activeTab === 'all' 
    ? SCHOOL_LEVELS 
    : SCHOOL_LEVELS.filter(l => (l as any).id === activeTab);

  const currentWeek = plannings?.[currentWeekIndex];

  const nextWeek = () => {
    if (!plannings) return;
    setCurrentWeekIndex(prev => (prev + 1) % plannings.length);
  };

  const prevWeek = () => {
    if (!plannings) return;
    setCurrentWeekIndex(prev => (prev - 1 + plannings.length) % plannings.length);
  };

  // HELPER FOR TIME FORMATTING
  const renderTime = (timeStr: string) => {
      if (!timeStr) return null;
      const parts = timeStr.split(' - ');
      if (parts.length === 2) {
          return (
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-white tracking-tighter leading-none">{parts[0]}</span>
                <span className="text-lg font-medium text-white/30">-</span>
                <span className="text-lg font-bold text-white/60">{parts[1]}</span>
            </div>
          );
      }
      return <div className="text-2xl font-black text-white mb-2">{timeStr}</div>;
  };

  if (isLoading && !plannings?.length) return <div className="min-h-screen bg-abysse flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Chargement...</div>;

  return (
    <div className="w-full font-sans bg-white overflow-x-hidden">
      
      {/* 1. HERO HEADER */}
      <section className="pt-32 pb-20 px-6 bg-abysse text-white">
        <div className="max-w-[1400px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-turquoise mb-8">
                <GraduationCap size={16} />
                <span>École Française de Voile</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                L'École de<br/><span className="text-turquoise">La Mer.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-4xl mx-auto">
                Apprendre la voile à Coutainville, c'est découvrir l'autonomie et le respect des éléments. Une pédagogie adaptée à chaque âge.
            </p>
        </div>
      </section>

      {/* NAVIGATION ONGLETS (STICKY) */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-y border-slate-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 overflow-x-auto no-scrollbar">
           <div className="flex gap-4 py-4 justify-start md:justify-center min-w-max">
              
              {/* Onglet TOUS */}
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-4 p-3 pr-6 rounded-2xl border-2 transition-all duration-300 ${
                  activeTab === 'all' 
                  ? 'bg-abysse text-white border-abysse shadow-xl scale-100' 
                  : 'bg-white text-slate-400 border-transparent hover:bg-slate-50 opacity-70 hover:opacity-100 scale-95'
                }`}
              >
                  <div className={`size-12 rounded-xl flex items-center justify-center shadow-lg ${activeTab === 'all' ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <LayoutGrid size={24} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs text-left">Vue<br/>D'ensemble</span>
              </button>

              {/* Onglets STAGES */}
              {SCHOOL_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setActiveTab(level.id)}
                  className={`flex items-center gap-4 p-3 pr-6 rounded-2xl border-2 transition-all duration-300 ${
                    activeTab === level.id 
                    ? 'bg-white border-transparent shadow-xl scale-100 ring-1 ring-slate-100' 
                    : 'bg-white border-transparent hover:bg-slate-50 opacity-60 hover:opacity-100 scale-95'
                  }`}
                >
                   <div className={`size-12 rounded-xl flex items-center justify-center text-white shadow-lg ${level.bgColor}`}>
                      {level.icon}
                   </div>
                   <div className="text-left">
                      <span className={`block text-[10px] font-black uppercase tracking-widest ${activeTab === level.id ? level.color : 'text-slate-400'}`}>
                          {level.age}
                      </span>
                      <span className={`block text-sm font-black italic tracking-tighter leading-none ${activeTab === level.id ? 'text-abysse' : 'text-slate-50'}`}>
                          {level.title}
                      </span>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* 2. SECTIONS "CHAPITRES" POUR CHAQUE STAGE (FILTRÉES) */}
      <div className="flex flex-col min-h-[50vh]">
         {visibleLevels.map((level, index) => (
           <section 
             key={level.id} 
             className={`py-24 px-6 border-b border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
           >
             <div className="max-w-[1600px] mx-auto">
               <div className={`flex flex-col xl:flex-row gap-16 items-start`}>
                 
                 {/* COLONNE VISUELLE (40%) */}
                 <div className={`w-full xl:w-[45%] shrink-0 ${index % 2 === 1 ? 'xl:order-2' : ''}`}>
                    <div className="sticky top-40">
                        <div className="h-[400px] md:h-[600px] rounded-4xl overflow-hidden shadow-2xl relative">
                            <PhotoSlider images={level.gallery} title={level.title} />
                            
                            {/* Badge Age */}
                            <div className="absolute top-8 left-8 z-20">
                                <div className={`px-6 py-3 rounded-xl ${level.bgColor} text-white shadow-lg`}>
                                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Public</span>
                                    <span className="block text-2xl font-black italic">{level.age}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* COLONNE ÉDITORIALE (60%) */}
                 <div className="w-full xl:w-[55%] flex flex-col gap-8">
                    
                    {/* En-tête de section */}
                    <div className="border-l-4 border-slate-200 pl-8 py-2">
                        <div className={`flex items-center gap-3 ${level.color} mb-2`}>
                            {level.icon}
                            <span className="font-black uppercase tracking-[0.2em] text-sm">{level.subtitle}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-abysse uppercase italic tracking-tighter leading-none">
                            {level.title}
                        </h2>
                    </div>

                    {/* TEXTE NARRATIF */}
                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose text-justify font-medium whitespace-pre-line">
                        {level.description}
                    </div>

                    {/* GRILLE TARIFAIRE SPÉCIFIQUE */}
                    {(level as any).pricingTiers && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {(level as any).pricingTiers.map((tier: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
                                    <span className="text-sm font-bold text-slate-600">{tier.label}</span>
                                    <span className="text-lg font-black text-abysse">{tier.price}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Zone de bas de page : Prix & CTA */}
                    <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Tarif Semaine</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-abysse tracking-tighter">{level.price}</span>
                                <span className="text-xs font-bold text-turquoise max-w-[120px] leading-tight block">{level.priceDetail}</span>
                            </div>
                        </div>

                        <a 
                           href="https://coutainville.axyomes.com/" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className={`group px-10 py-5 rounded-2xl ${level.bgColor} text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl flex items-center gap-4 w-full md:w-auto justify-center`}
                        >
                           Réserver
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                 </div>

               </div>
             </div>
           </section>
         ))}
      </div>

      {/* 3. SECTION INFOS PRATIQUES (Fixe, toujours visible) */}
      <section className="py-24 px-6 bg-slate-100">
          <div className="max-w-[1600px] mx-auto">
             <div className="flex items-center gap-4 mb-12">
                 <div className="size-16 bg-abysse text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Info size={32} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter leading-none">
                    Infos Pratiques <br/>& Logistique
                 </h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* BLOC 1 : CONDITIONS METEO */}
                <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-black text-turquoise uppercase tracking-widest mb-6 flex items-center gap-3">
                        <AlertTriangle size={24} /> Conditions Particulières
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                        En cas de mauvaises conditions météo, la première séance est prise en charge à terre (cours théorique, matelotage etc…). 
                        Si les conditions ne s’améliorent pas, la deuxième séance est reportée au samedi.
                    </p>
                </div>

                {/* BLOC 2 : EQUIPEMENT FOURNI */}
                <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-black text-turquoise uppercase tracking-widest mb-6 flex items-center gap-3">
                        <CheckCircle2 size={24} /> Equipement Fourni
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed mb-4">
                        Le Club Nautique de Coutainville fournit pour la durée du stage :
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 font-bold text-abysse">
                            <div className="size-2 bg-abysse rounded-full"></div> Le gilet de sauvetage
                        </li>
                        <li className="flex items-center gap-3 font-bold text-abysse">
                            <div className="size-2 bg-abysse rounded-full"></div> La combinaison (manches courtes, jambes longues)
                        </li>
                    </ul>
                </div>

                {/* BLOC 3 : A PRÉVOIR */}
                <div className="bg-abysse text-white p-8 rounded-4xl shadow-lg relative overflow-hidden">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 relative z-10">
                        À Prévoir
                    </h3>
                    <ul className="space-y-4 relative z-10">
                        <li className="flex items-start gap-4">
                            <span className="text-turquoise font-bold">01.</span>
                            <span className="font-medium text-slate-300">Un maillot de bain et un T-shirt à mettre sous la combinaison.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-turquoise font-bold">02.</span>
                            <span className="font-medium text-slate-300">Une serviette de bain.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-turquoise font-bold">03.</span>
                            <span className="font-medium text-slate-300">Une paire de chaussures ne craignant pas l’eau.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-turquoise font-bold">04.</span>
                            <span className="font-medium text-slate-300">Crème solaire et lunettes de soleil attachées.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="text-turquoise font-bold">05.</span>
                            <span className="font-medium text-slate-300">Un short de bain (à mettre par dessus la combinaison).</span>
                        </li>
                    </ul>
                    {/* Décoration */}
                    <div className="absolute top-0 right-0 p-32 bg-turquoise/10 blur-[80px] rounded-full pointer-events-none"></div>
                </div>

             </div>
          </div>
      </section>

      {/* 4. PLANNING & DISPONIBILITÉS (DARK GLASS DESIGN) */}
      <section className="py-24 px-4 md:px-6 bg-abysse text-white relative overflow-hidden">
         {/* Background Fx */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-turquoise/5 rounded-full blur-[150px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
         
         <div className="max-w-[1600px] mx-auto relative z-10">
            
            {/* Header Planning */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-turquoise mb-6">
                    <Calendar size={14} />
                    <span>Saison 2025</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 text-white">
                   PLANNING
                </h2>
                <p className="text-slate-400 font-medium max-w-xl mx-auto">
                    Nos stages sont rythmés par la marée. Sélectionnez une semaine pour voir le programme détaillé jour par jour.
                </p>
            </div>

            {/* Week Selector */}
            {plannings && plannings.length > 0 && (
                <div className="flex items-center justify-center gap-6 mb-16">
                    <button 
                        onClick={prevWeek}
                        className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-turquoise hover:border-turquoise hover:text-abysse transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-12 py-6 text-center min-w-[340px] backdrop-blur-md shadow-2xl">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Semaine sélectionnée</span>
                        <span className="block text-2xl font-black italic">{currentWeek?.title}</span>
                    </div>

                    <button 
                        onClick={nextWeek}
                        className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-turquoise hover:border-turquoise hover:text-abysse transition-all group"
                    >
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* THE GRID */}
            {currentWeek && (
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[1200px]">
                   
                   {/* Grid Headers */}
                   <div className="grid grid-cols-6 gap-6 mb-6">
                       <div className="col-span-1"></div> {/* Spacer for Row Labels */}
                       {currentWeek.days.map((day, i) => (
                           <div key={i} className="text-center pb-4 border-b border-white/5">
                               <span className="text-sm font-black uppercase tracking-widest text-slate-400">{day.name}</span>
                               <span className="block text-[10px] font-bold text-slate-500 mt-1">{new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                           </div>
                       ))}
                   </div>

                   {/* LOOP THOUGH PLANNING ROWS */}
                   {PLANNING_ROWS.map((row) => {
                       return (
                         <div key={row.id} className="grid grid-cols-6 gap-6 mb-6 group/row">
                             
                             {/* Colonne de gauche : CARD ARCHITECTURALE */}
                             <div className={`col-span-1 ${row.bgColor} rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300`}>
                                 <div>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1 block">{row.age}</span>
                                     <span className="text-2xl font-black italic text-white uppercase leading-none">{row.title}</span>
                                 </div>
                                 <div className="text-white/80">
                                    {row.icon}
                                 </div>
                                 <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-white/20 to-transparent pointer-events-none"></div>
                             </div>

                             {/* Cases Jours : DARK GLASS + ACCENT BORDER */}
                             {currentWeek.days.map((day, dayIdx) => {
                                 const data = row.accessor(day);
                                 if (data === undefined) return <div key={dayIdx} className="bg-white/5 rounded-2xl"></div>;

                                 // CASE DATA: Is it an object (Kids) or string (Adults)?
                                 const isObject = typeof data === 'object';
                                 const timeStr = isObject ? data?.time : data;
                                 const activityLabel = isObject ? data?.activity : null;
                                 const detailLabel = isObject ? data?.description : null;
                                 const isRaid = timeStr === 'Raid' || day.isRaidDay;

                                 return (
                                     <div key={dayIdx} className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-center border border-white/5 hover:bg-white/10 transition-colors group/cell overflow-hidden ${isRaid ? 'bg-yellow-500/10 border-yellow-500/30' : ''}`}>
                                         
                                         <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${isRaid ? 'bg-yellow-500' : row.bgColor}`}></div>

                                         <div className="pl-4 relative z-10">
                                             {isRaid && (
                                                 <span className="inline-block px-2 py-0.5 rounded bg-yellow-500 text-abysse text-[9px] font-black uppercase tracking-widest mb-2">
                                                     Événement
                                                 </span>
                                             )}
                                             
                                             {renderTime(timeStr)}
                                             
                                             {activityLabel && (
                                                 <div className={`text-[10px] font-bold uppercase tracking-widest truncate ${isRaid ? 'text-yellow-400' : row.color}`}>
                                                     {activityLabel}
                                                 </div>
                                             )}
                                             
                                             {detailLabel && (
                                                 <div className="text-[9px] text-white/40 uppercase tracking-widest truncate">
                                                     {detailLabel}
                                                 </div>
                                             )}

                                             {!isObject && !isRaid && (
                                                 <div className={`text-[10px] font-bold uppercase tracking-widest truncate ${row.color}`}>
                                                     {row.title}
                                                 </div>
                                             )}
                                         </div>

                                         <div className={`absolute -right-4 -bottom-4 opacity-[0.03] text-white scale-150 group-hover/cell:scale-125 transition-transform duration-500 rotate-12`}>
                                             {activityLabel ? getActivityIcon(activityLabel as any) : row.icon}
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                       );
                   })}

                </div>
             </div>
            )}
            
            <div className="mt-12 flex justify-center">
                <a href="https://coutainville.axyomes.com/" target="_blank" className="bg-white text-abysse px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-turquoise hover:text-white transition-all shadow-xl shadow-white/5 flex items-center gap-4 hover:scale-105 duration-300">
                    Réserver ma place <ArrowRight size={20} />
                </a>
            </div>

         </div>
      </section>

    </div>
  );
};

export default EcoleVoilePage;

