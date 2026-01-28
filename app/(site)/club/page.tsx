"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Anchor, 
  Users, 
  History, 
  Trophy, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Camera,
  MapPin,
  UserCheck,
  Building,
  Accessibility,
  Download,
  Quote,
  Megaphone,
  LifeBuoy,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Leaf,
  Compass,
  Zap,
  Sprout
} from 'lucide-react';

// --- DATA FLOTTE (Conservée à l'identique) ---
const FLEET_DATA = [
    {
      id: 'cata',
      name: 'Catamaran',
      subtitle: 'La Référence',
      gallery: [
        'https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=2000&auto=format&fit=crop'
      ],
      stats: { speed: 95, difficulty: 60, adrenaline: 90 },
      description: "Du Topaz 10 pour l'initiation au Hobie Cat 16 pour la performance.",
      crew: "Solo / Double"
    },
    {
      id: 'char',
      name: 'Char à Voile',
      subtitle: 'Vitesse Pure',
      gallery: [
        'https://images.unsplash.com/photo-1620658408066-89b531405a8b?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519830842880-928929944634?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605218427360-363941852445?q=80&w=2000&auto=format&fit=crop'
      ],
      stats: { speed: 85, difficulty: 40, adrenaline: 80 },
      description: "Pilotez au ras du sable. Accélération immédiate dès 8 ans.",
      crew: "Monoplace"
    },
    {
      id: 'wing',
      name: 'Wing & Kite',
      subtitle: 'Nouvelle Vague',
      gallery: [
        'https://images.unsplash.com/photo-1612459957245-0d0458df8643?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544458514-6e6962cb1cb2?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1628173429871-3f0e01764491?q=80&w=2000&auto=format&fit=crop'
      ],
      stats: { speed: 70, difficulty: 95, adrenaline: 100 },
      description: "Voler au-dessus de l'eau. Matériel F-One & Duotone.",
      crew: "Solo"
    },
    {
      id: 'windsurf',
      name: 'Windsurf',
      subtitle: 'L\'Originale',
      gallery: [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596423736772-799a4e3df530?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473663175406-03c6237227d8?q=80&w=2000&auto=format&fit=crop'
      ],
      stats: { speed: 75, difficulty: 70, adrenaline: 85 },
      description: "Le contact pur avec les éléments. Du Funboard au Foil.",
      crew: "Solo"
    },
    {
      id: 'collectif',
      name: 'Habitables',
      subtitle: 'Esprit Équipage',
      gallery: [
        'https://images.unsplash.com/photo-1563462058316-29a399f665e7?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2000&auto=format&fit=crop'
      ],
      stats: { speed: 45, difficulty: 30, adrenaline: 40 },
      description: "Trimaran Magnum 21 pour découvrir le large en famille.",
      crew: "4-6 pers"
    },
    {
      id: 'paddles',
      name: 'Paddles',
      subtitle: 'Exploration',
      gallery: [
        'https://images.unsplash.com/photo-1541549467657-3f9f9d7c078d?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516972352862-26ebf7756f87?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1655857202720-3054c728e02d?q=80&w=2000&auto=format&fit=crop'
      ],
      stats: { speed: 20, difficulty: 20, adrenaline: 30 },
      description: "Balade au fil de l'eau. Kayaks, SUP et Paddle Géant XXL.",
      crew: "1-8 pers"
    }
  ];

// --- NAVIGATION ANCRES ---
const SECTIONS = [
  { id: 'identity', label: 'Identité' },
  { id: 'team', label: 'L\'Équipe' },
  { id: 'site', label: 'Le Site' },
  { id: 'fleet', label: 'La Flotte' },
  { id: 'life', label: 'Vie du Club' },
];

const ClubPage: React.FC = () => {
  // --- STATES FLOTTE ---
  const [activeFleetIndex, setActiveFleetIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsAutoPlay(true);
  }, [activeFleetIndex]);

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => {
          const max = FLEET_DATA[activeFleetIndex].gallery.length;
          return (prev + 1) % max;
        });
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, activeFleetIndex]);

  const nextImage = () => {
    setIsAutoPlay(false);
    const max = FLEET_DATA[activeFleetIndex].gallery.length;
    setCurrentImageIndex((prev) => (prev + 1) % max);
  };

  const prevImage = () => {
    setIsAutoPlay(false);
    const max = FLEET_DATA[activeFleetIndex].gallery.length;
    setCurrentImageIndex((prev) => (prev - 1 + max) % max);
  };

  const currentFleet = FLEET_DATA[activeFleetIndex];

  return (
    <div className="w-full font-sans bg-white overflow-x-hidden">

        {/* 1. HERO HEADER (Style École) */}
        <section className="pt-32 pb-20 px-6 bg-abysse text-white">
            <div className="max-w-[1400px] mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-turquoise mb-8">
                    <Anchor size={16} />
                    <span>Association Loi 1901</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                    Bienvenue au<br/><span className="text-turquoise">Club Nautique.</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-4xl mx-auto">
                    Depuis 1965, le CVC fait vivre la passion de la mer à Coutainville. Plus qu'un club, une famille tournée vers le large.
                </p>
            </div>
        </section>

        {/* 2. MENU SECONDAIRE STICKY */}
        <nav className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
           <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center gap-8 md:gap-12 min-w-max h-16">
              {SECTIONS.map((section) => (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`} 
                    className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-turquoise transition-colors"
                  >
                    {section.label}
                  </a>
              ))}
           </div>
        </nav>

        {/* 3. IDENTITÉ & VALEURS (NEW CONTENT) */}
        <section id="identity" className="py-24 px-6 max-w-[1400px] mx-auto">
            
            {/* Header Projet */}
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-abysse uppercase italic tracking-tighter mb-8 leading-[0.9]">
                    Notre Projet :<br/>L'Horizon pour Tous
                </h2>
                <p className="text-slate-600 text-xl font-medium max-w-4xl mx-auto leading-relaxed">
                    Au Club Nautique de Coutainville (CNC), notre passion pour la mer s’exprime à travers un projet associatif solide et une vision moderne du nautisme. Nous croyons que la navigation est bien plus qu'une technique : c'est un art de vivre.
                </p>
            </div>

            {/* BLOCK 1: LES FONDATIONS */}
            <div className="mb-24">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-12 text-center flex items-center justify-center gap-4">
                    <span className="w-12 h-px bg-slate-200"></span>
                    Nos Fondations
                    <span className="w-12 h-px bg-slate-200"></span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Transmission */}
                    <div className="bg-slate-50 p-10 rounded-4xl border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-lg mb-6 group-hover:bg-abysse group-hover:text-white transition-colors">
                            <GraduationCap size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-abysse uppercase italic mb-4">La Transmission</h4>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Un savoir-faire pédagogique reconnu pour accompagner chaque marin, du débutant à l'expert.
                        </p>
                    </div>

                    {/* Inclusion */}
                    <div className="bg-slate-50 p-10 rounded-4xl border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-lg mb-6 group-hover:bg-abysse group-hover:text-white transition-colors">
                            <Accessibility size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-abysse uppercase italic mb-4">L'Inclusion</h4>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Le label "Tourisme & Handicap" au cœur de notre identité, pour que la mer soit accessible à tous, sans exception.
                        </p>
                    </div>

                    {/* Respect */}
                    <div className="bg-slate-50 p-10 rounded-4xl border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-lg mb-6 group-hover:bg-abysse group-hover:text-white transition-colors">
                            <ShieldCheck size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-abysse uppercase italic mb-4">Le Respect</h4>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            Une gestion associative responsable et une sensibilisation permanente à la protection de notre littoral.
                        </p>
                    </div>
                </div>
            </div>

            {/* BLOCK 2: NOUVELLES DIMENSIONS (DARK) */}
            <div className="bg-abysse rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-turquoise/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-turquoise text-xs font-black uppercase tracking-widest mb-4">
                        Une Nouvelle Expérience
                    </span>
                    <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Cap sur l'Émotion</h3>
                    <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
                        Sous l'impulsion de notre équipe technique, le CNC réinvente votre pratique autour de trois nouvelles dimensions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    
                    {/* Nature */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-3 mb-4 text-green-400">
                            <Sprout size={28} />
                            <span className="font-black uppercase tracking-widest text-sm">Nature</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Plongez au cœur de l'écosystème marin. Nos sorties sont conçues pour une immersion totale dans l'environnement sauvage. Observer, comprendre et naviguer en harmonie.
                        </p>
                    </div>

                    {/* Exploration */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-3 mb-4 text-purple-400">
                            <Compass size={28} />
                            <span className="font-black uppercase tracking-widest text-sm">Exploration</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Repoussez vos limites. Nous ne restons pas au bord de la plage : nous vous emmenons découvrir des zones privilégiées, des bancs de sable aux vues sur Chausey.
                        </p>
                    </div>

                    {/* Sensation */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-3 mb-4 text-orange-400">
                            <Zap size={28} />
                            <span className="font-black uppercase tracking-widest text-sm">Sensation</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Vibrer, glisser, accélérer. L'accent sur l'adrénaline. Grâce à un matériel performant et des conseils experts, ressentez la force du vent dès les premiers bords.
                        </p>
                    </div>
                </div>

                {/* Quote Chef de Base */}
                <div className="mt-16 bg-white/5 rounded-2xl p-8 md:p-10 border border-white/10 flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="shrink-0 size-20 bg-turquoise rounded-full flex items-center justify-center text-abysse shadow-lg border-4 border-abysse">
                        <Quote size={32} />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg md:text-xl font-medium text-white italic leading-relaxed mb-4">
                            "Notre mission est de transformer chaque sortie en mer en un souvenir inoubliable. En alliant le respect de la nature à la soif d'exploration et à la recherche de sensations, nous offrons un nautisme vivant et authentique."
                        </p>
                        <div>
                            <span className="block font-black text-turquoise uppercase tracking-widest text-xs">L'avis du Chef de Base</span>
                            <span className="block text-slate-400 text-sm">Thomas Lechef</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. UNE ÉQUIPE À VOTRE SERVICE */}
        <section id="team" className="py-24 px-6 bg-slate-50 border-y border-slate-200">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                         <span className="text-turquoise font-black uppercase tracking-widest text-xs mb-2 block">L'Humain avant tout</span>
                         <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter leading-none">
                            Une Équipe<br/>Passionnée
                         </h2>
                    </div>
                    <p className="text-slate-600 font-medium max-w-md">
                        Le club fonctionne grâce à l'alliance parfaite entre des bénévoles engagés et des professionnels qualifiés.
                    </p>
                </div>

                {/* Le Bureau (Bénévoles) */}
                <div className="mb-20">
                    <h3 className="flex items-center gap-3 text-2xl font-black text-abysse uppercase italic mb-8">
                        <Users className="text-turquoise" /> Le Bureau Bénévole
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Jean-Pierre Marin", role: "Président", img: "https://i.pravatar.cc/150?u=jp" },
                            { name: "Marie Loic", role: "Trésorière", img: "https://i.pravatar.cc/150?u=marie" },
                            { name: "Paul Dubreuil", role: "Secrétaire", img: "https://i.pravatar.cc/150?u=paul" },
                            { name: "Sophie Mer", role: "Resp. Sportif", img: "https://i.pravatar.cc/150?u=sophie" },
                        ].map((member, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center hover:scale-105 transition-transform">
                                <div className="size-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-slate-50">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold text-abysse text-lg leading-tight">{member.name}</p>
                                <p className="text-xs font-bold text-turquoise uppercase tracking-widest mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Les Pros (Staff) */}
                <div>
                    <h3 className="flex items-center gap-3 text-2xl font-black text-abysse uppercase italic mb-8">
                        <UserCheck className="text-turquoise" /> L'Équipe Professionnelle
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                            { name: "Thomas Lechef", role: "Chef de Base", diplome: "BPJEPS Voile & Char", img: "https://i.pravatar.cc/150?u=thomas" },
                            { name: "Sarah Voile", role: "Monitrice Cata", diplome: "CQP AMV", img: "https://i.pravatar.cc/150?u=sarah" },
                            { name: "Lucas Wind", role: "Moniteur Char", diplome: "BPJEPS Char à Voile", img: "https://i.pravatar.cc/150?u=lucas" },
                        ].map((staff, i) => (
                            <div key={i} className="bg-abysse p-6 rounded-3xl shadow-lg flex items-center gap-6 group hover:bg-turquoise transition-colors">
                                <div className="size-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20">
                                    <img src={staff.img} alt={staff.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-xl">{staff.name}</p>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1 group-hover:text-white/80">{staff.role}</p>
                                    <span className="inline-block px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white border border-white/10">
                                        {staff.diplome}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 5. UN SITE D'EXCEPTION & ACCESSIBILITÉ */}
        <section id="site" className="py-24 px-6 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                <div className="order-2 lg:order-1">
                    <span className="text-turquoise font-black uppercase tracking-widest text-xs mb-2 block">Infrastructures</span>
                    <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter leading-none mb-6">
                        Un Balcon<br/>sur la Mer
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed mb-6 text-lg">
                        Notre bâtiment, entièrement rénové, offre des conditions d'accueil optimales. Des vestiaires chauffés aux salles de cours équipées, tout est pensé pour votre confort.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 font-bold text-abysse">
                            <Building size={20} className="text-turquoise" /> Club-House panoramique vue Chausey
                        </li>
                        <li className="flex items-center gap-3 font-bold text-abysse">
                            <MapPin size={20} className="text-turquoise" /> Accès direct à la plage (cale privée)
                        </li>
                        <li className="flex items-center gap-3 font-bold text-abysse">
                            <CheckCircle2 size={20} className="text-turquoise" /> Vestiaires et douches chaudes
                        </li>
                    </ul>
                </div>
                <div className="order-1 lg:order-2 relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px] group">
                    <img src="https://images.unsplash.com/photo-1516126489370-179ee771ae35?q=80&w=1200" alt="Club House" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-6 py-3 rounded-xl border border-white shadow-lg">
                        <span className="text-abysse font-black text-sm uppercase">Vue sur les Îles Chausey</span>
                    </div>
                </div>
            </div>

            {/* Accessibilité */}
            <div className="bg-turquoise text-white rounded-[3rem] p-12 relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row items-start gap-12">
                    <div className="lg:w-1/3">
                        <div className="flex items-center gap-3 mb-6">
                            <Accessibility size={40} />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Accessibilité</h2>
                        </div>
                        <p className="font-medium text-white/90 text-lg leading-relaxed">
                            La mer pour tous n'est pas qu'un slogan. Le CVC est labellisé "Tourisme & Handicap" et dispose d'équipements adaptés pour accueillir les personnes à mobilité réduite.
                        </p>
                    </div>
                    
                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                            <div className="mb-4 text-3xl">♿️</div>
                            <h4 className="font-black uppercase mb-2">Locaux Adaptés</h4>
                            <p className="text-sm text-white/80">Rampes d'accès, vestiaires et sanitaires aux normes PMR.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                            <div className="mb-4 text-3xl">⛵️</div>
                            <h4 className="font-black uppercase mb-2">Matériel Spécifique</h4>
                            <p className="text-sm text-white/80">Flotte de Hansa 303 et Tiralo pour la mise à l'eau.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                            <div className="mb-4 text-3xl">🎓</div>
                            <h4 className="font-black uppercase mb-2">Encadrement Formé</h4>
                            <p className="text-sm text-white/80">Moniteurs qualifiés Handi-Voile pour une pratique sécurisée.</p>
                        </div>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-40 bg-white/10 blur-[80px] rounded-full pointer-events-none"></div>
            </div>
        </section>

        {/* 6. LA FLOTTE (MODULE EXISTANT CONSERVÉ) */}
        <section id="fleet" className="mb-24 px-6 max-w-[1600px] mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none text-center mb-6">
               L'Armada du CNC
            </h2>
            <p className="text-center text-slate-500 font-medium max-w-2xl mx-auto mb-12">
                Qualité et sécurité avant tout. Notre matériel est renouvelé régulièrement pour vous garantir les meilleures sensations sur l'eau, que vous soyez débutant ou expert.
            </p>

            <div className="relative rounded-[3rem] overflow-hidden h-[750px] shadow-2xl group border border-slate-900 bg-abysse">
                {/* --- IMAGE LAYER --- */}
                {FLEET_DATA.map((fleet, fIndex) => (
                    fIndex === activeFleetIndex && (
                        <div key={fleet.id} className="absolute inset-0 animate-in fade-in duration-500">
                             {fleet.gallery.map((imgUrl, imgIndex) => (
                                 <div 
                                    key={imgIndex} 
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                        currentImageIndex === imgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    }`}
                                 >
                                    <img src={imgUrl} className="w-full h-full object-cover" alt={`${fleet.name} ${imgIndex}`} />
                                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent"></div>
                                 </div>
                             ))}
                        </div>
                    )
                ))}

                {/* --- UI LAYER --- */}
                <div className="absolute inset-0 z-20 pointer-events-none flex">
                    {/* LEFT SIDEBAR */}
                    <div className="w-[85%] md:w-[25%] h-full bg-slate-900/20 backdrop-blur-2xl border-r border-white/10 p-8 flex flex-col pointer-events-auto">
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            <p className="text-[10px] font-bold text-turquoise uppercase tracking-[0.2em] mb-4 opacity-80">Flotte 2026</p>
                            {FLEET_DATA.map((fleet, index) => (
                                <button 
                                    key={fleet.id}
                                    onClick={() => setActiveFleetIndex(index)}
                                    className={`text-left transition-all duration-500 group/btn flex items-center justify-between ${
                                        activeFleetIndex === index ? 'opacity-100 translate-x-4' : 'opacity-40 hover:opacity-100 hover:translate-x-2'
                                    }`}
                                >
                                    <div>
                                        <span className={`block font-black uppercase italic leading-none transition-all ${activeFleetIndex === index ? 'text-4xl text-white' : 'text-xl text-white'}`}>
                                            {fleet.name}
                                        </span>
                                        {activeFleetIndex === index && (
                                            <span className="block text-turquoise text-[10px] font-bold uppercase tracking-widest mt-2 animate-in fade-in slide-in-from-left-2 duration-500">
                                                {fleet.subtitle}
                                            </span>
                                        )}
                                    </div>
                                    {activeFleetIndex === index && <div className="w-1.5 h-12 bg-turquoise rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                        <div className="mt-auto pt-8 border-t border-white/10 animate-in slide-in-from-bottom-5 duration-700 key={activeFleetIndex}">
                            <p className="text-slate-300 text-xs leading-relaxed font-medium mb-6 line-clamp-4">{currentFleet.description}</p>
                            <div className="flex gap-4 mb-6">
                                <div className="flex flex-col items-center">
                                    <div className="size-10 rounded-full border border-white/20 flex items-center justify-center text-white text-xs font-bold mb-1">{currentFleet.stats.speed}</div>
                                    <span className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">Vit.</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="size-10 rounded-full border border-white/20 flex items-center justify-center text-white text-xs font-bold mb-1">{currentFleet.stats.adrenaline}</div>
                                    <span className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">Fun</span>
                                </div>
                                <div className="flex flex-col items-center ml-auto">
                                   <button onClick={() => setIsAutoPlay(!isAutoPlay)} className="size-10 rounded-full bg-white text-abysse flex items-center justify-center hover:bg-turquoise hover:text-white transition-colors">
                                      {isAutoPlay ? <Pause size={14} /> : <Play size={14} />}
                                   </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT AREA */}
                    <div className="flex-1 relative pointer-events-none">
                        <div className="absolute top-8 right-8 pointer-events-auto">
                           <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                                <Camera size={16} className="text-white/70" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{currentImageIndex + 1} / {FLEET_DATA[activeFleetIndex].gallery.length}</span>
                           </div>
                        </div>
                        <div className="absolute inset-y-0 left-0 w-24 hover:bg-linear-to-r hover:from-black/20 hover:to-transparent transition-all cursor-pointer pointer-events-auto flex items-center justify-start group" onClick={prevImage}>
                             <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="text-white" size={48} /></div>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-24 hover:bg-linear-to-l hover:from-black/20 hover:to-transparent transition-all cursor-pointer pointer-events-auto flex items-center justify-end group" onClick={nextImage}>
                             <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="text-white" size={48} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 7. VIE DU CLUB (AGENDA) */}
        <section id="life" className="py-24 px-6 bg-slate-50 border-y border-slate-200">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                     <span className="text-turquoise font-black uppercase tracking-widest text-xs mb-2 block">Agenda & Convivialité</span>
                     <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter leading-none mb-6">
                        La Vie au Club
                     </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Agenda */}
                    <div className="lg:col-span-2 space-y-4">
                        {[
                            { date: "12 Juillet", title: "Régate de Bassin", type: "Compétition", desc: "Ouvert à tous les supports. Inscription 9h." },
                            { date: "14 Juillet", title: "Soirée Moules-Frites", type: "Social", desc: "Le grand classique du club. Réservation obligatoire." },
                            { date: "15 Août", title: "Raid Chausey", type: "Aventure", desc: "Pour les confirmés. Traversée vers l'archipel." },
                        ].map((evt, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 group hover:border-turquoise transition-colors">
                                <div className="bg-slate-100 rounded-xl p-4 text-center min-w-[100px] group-hover:bg-abysse group-hover:text-white transition-colors">
                                    <span className="block font-black text-sm uppercase">{evt.date.split(' ')[1]}</span>
                                    <span className="block text-2xl font-black">{evt.date.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <span className="inline-block px-2 py-1 bg-turquoise/10 text-turquoise rounded text-[10px] font-black uppercase mb-2">{evt.type}</span>
                                    <h4 className="text-xl font-black text-abysse uppercase italic">{evt.title}</h4>
                                    <p className="text-slate-500 text-sm mt-1">{evt.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Volunteer Call */}
                    <div className="bg-abysse text-white p-10 rounded-4xl flex flex-col justify-center text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <Megaphone className="mx-auto mb-6 text-turquoise" size={48} />
                            <h3 className="text-2xl font-black uppercase italic mb-4">Devenez Bénévole</h3>
                            <p className="text-slate-300 font-medium mb-8">
                                Le club a besoin de vous ! Participez à l'organisation des régates ou à la vie quotidienne de l'asso.
                            </p>
                            <button className="bg-white text-abysse px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-turquoise hover:text-white transition-all shadow-lg">
                                Je m'implique
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-32 bg-white/5 blur-[60px] rounded-full pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>

        {/* 8. TARIFS & ADHÉSION - REDESIGN CONTRASTE */}

        {/* 9. TÉMOIGNAGES */}
        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
            <div className="max-w-4xl mx-auto text-center">
                <Quote size={48} className="text-turquoise mx-auto mb-8 opacity-50" />
                <h2 className="text-3xl font-black text-abysse uppercase italic mb-12">Ils aiment le club</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <p className="text-slate-600 italic mb-6 leading-relaxed">"Mes enfants ont appris la voile ici il y a 10 ans, et maintenant ils sont moniteurs. Une ambiance familiale unique."</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="size-10 rounded-full bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?u=a" alt="Avatar" /></div>
                            <div className="text-left">
                                <p className="font-bold text-abysse text-sm">Sophie L.</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">Maman de stagiaires</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <p className="text-slate-600 italic mb-6 leading-relaxed">"Le spot est incroyable pour le char à voile. Les équipements sont top et l'équipe super accueillante."</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="size-10 rounded-full bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?u=b" alt="Avatar" /></div>
                            <div className="text-left">
                                <p className="font-bold text-abysse text-sm">Marc D.</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">Adhérent depuis 5 ans</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 10. CTA FINAL */}
        <section className="py-20 px-6 bg-abysse text-white text-center">
             <div className="max-w-2xl mx-auto">
                 <h2 className="text-4xl font-black uppercase italic mb-6">Envie de nous rejoindre ?</h2>
                 <p className="text-slate-300 text-lg mb-10">
                     Que ce soit pour un stage d'été ou pour naviguer toute l'année, le CNC vous ouvre ses portes.
                 </p>
                 <Link href="/infos-pratiques" className="inline-flex items-center gap-3 bg-white text-abysse px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-turquoise hover:text-white transition-all shadow-xl hover:scale-105 duration-300">
                    Contactez-nous <ArrowRight size={20} />
                 </Link>
             </div>
        </section>

    </div>
  );
};

export default ClubPage;
