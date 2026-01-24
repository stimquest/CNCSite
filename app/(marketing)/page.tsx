"use client";

import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { TideChart } from '../../components/TideChart';
import { Compass, Leaf, Zap, Users, ArrowRight, Anchor, Gauge, Activity, ChevronRight, ChevronLeft, Pause, Play, Camera, Wind, Sparkles, Map, Building2, LifeBuoy, Award, GraduationCap, CheckCircle2, Siren, Briefcase, Medal, Wifi, MonitorPlay, Coffee, Projector, Binoculars, ShoppingBag, Film, Images, X, Sun, Radio, Clock, Calendar, Rss, Newspaper, Megaphone } from 'lucide-react';
import Link from 'next/link';

export const HomePage: React.FC = () => {
  const { weather, statusMessage } = useContent();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // State pour l'effet de parallaxe et 3D
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    
    // Normaliser entre -1 et 1
    const x = (clientX / width - 0.5) * 2; 
    const y = (clientY / height - 0.5) * 2;
    
    setMousePos({ x, y });
  };

  const scrollToDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- LOGIQUE MOOD DU SPOT ---
  const getSpotMood = () => {
    if (weather.windSpeed > 18) return {
      title: "Mode Turbulences",
      desc: "Ça moutonne sévère ! Sortez les petites toiles. Session Kitesurf & Wing réservée aux experts.",
      icon: "🌪️",
      gradient: "from-purple-500 to-indigo-600"
    };
    if (weather.windSpeed < 8 && weather.temp > 18) return {
      title: "Dolce Vita",
      desc: "Plan d'eau miroir. Le moment rêvé pour une rando Paddle vers les bouchots ou un café en terrasse.",
      icon: "☀️",
      gradient: "from-orange-400 to-pink-500"
    };
    if (weather.windSpeed < 8) return {
      title: "Calme Plat",
      desc: "Pas un souffle d'air. Idéal pour l'initiation des tout-petits ou le Yoga sur paddle.",
      icon: "🧘",
      gradient: "from-blue-400 to-cyan-300"
    };
    return {
      title: "Conditions Royales",
      desc: "La brise parfaite. Ni trop fort, ni trop mou. Le catamaran va filer tout seul !",
      icon: "⛵",
      gradient: "from-turquoise to-teal-500"
    };
  };

  const mood = getSpotMood();

  // --- DATA GALERIE ---
  const galleryImages = [
    "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1200",
    "https://images.unsplash.com/photo-1620658408066-89b531405a8b?q=80&w=1200",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
    "https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=1200"
  ];

  return (
    <div className="w-full">
      
      {/* HERO SECTION - REFINED TEXT MASK */}
      <section 
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-abysse"
        onMouseMove={handleMouseMove}
        style={{ perspective: '1000px' }}
      >
        {/* 1. Background Image (Parallax Inverse) - Sombre pour contraste */}
        <div 
            className="absolute inset-0 w-full h-full scale-110 pointer-events-none"
            style={{
                transform: `translate3d(${-mousePos.x * 20}px, ${-mousePos.y * 20}px, 0)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <img 
                src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=3000&auto=format&fit=crop" 
                alt="Ocean Background" 
                className="w-full h-full object-cover brightness-[0.6]" 
            />
        </div>

        {/* 2. Overlay Dégradé pour lisibilité max */}
        <div className="absolute inset-0 bg-gradient-to-b from-abysse/60 via-transparent to-abysse z-10 pointer-events-none"></div>
        
        {/* 3. 3D Tilt Container */}
        <div 
            className="relative z-20 flex flex-col items-center justify-center text-center"
            style={{
                transform: `rotateX(${mousePos.y * 5}deg) rotateY(${-mousePos.x * 5}deg)`,
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* TEXTE MASQUE : CNC */}
            {/* La texture interne bouge (backgroundPosition) pour créer l'effet fenêtre */}
            <h1 
                className="font-black leading-[0.8] tracking-tighter select-none m-0 p-0"
                style={{
                    fontSize: '25vw', // Très gros
                    // Texture Eau Cristalline très claire
                    backgroundImage: "url('https://images.unsplash.com/photo-1560264357-8d9202250f21?q=80&w=2000&auto=format&fit=crop')",
                    backgroundSize: '150%',
                    backgroundPosition: `${50 + (mousePos.x * 25)}% ${50 + (mousePos.y * 25)}%`,
                    
                    // Masquage Webkit obligatoire
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    
                    // Drop shadow sur le conteneur du texte pour le détacher du fond
                    filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
                }}
            >
                CNC
            </h1>

            {/* Elements flottants au premier plan (3D translateZ) */}
            <div 
                className="space-y-8 mt-[-2vw]" // Remonte un peu sous le texte
                style={{ transform: 'translateZ(50px)' }}
            >
                <p className="text-white/90 font-bold uppercase tracking-[0.5em] text-sm md:text-xl drop-shadow-lg flex items-center justify-center gap-4">
                    <span className="hidden md:block w-12 h-px bg-white/50"></span>
                    Club Nautique Coutainville
                    <span className="hidden md:block w-12 h-px bg-white/50"></span>
                </p>
                
                <button 
                    onClick={scrollToDashboard}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-abysse transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                >
                    <span className="flex items-center gap-3">
                        Plonger dans l'expérience
                        <ArrowRight size={16} className="group-hover:rotate-90 transition-transform" />
                    </span>
                </button>
            </div>
        </div>
      </section>

      {/* DASHBOARD BENTO GRID - CADRE LUMINEUX */}
      <main id="dashboard" className="max-w-[1500px] mx-auto px-4 sm:px-6 py-20 relative z-30">
        
        {/* LE CADRE "CONSOLE" - ÉPURÉ & LUMINEUX */}
        <div className="relative bg-white/40 backdrop-blur-xl rounded-[3rem] p-6 md:p-10 border border-white/60 shadow-[0_0_60px_-15px_rgba(0,169,206,0.15)] ring-1 ring-white/50 overflow-hidden">
            
            {/* Décoration d'arrière plan très subtile */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-turquoise/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

            {/* HEADER DU DASHBOARD (SIMPLIFIÉ) */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Système Live CVC</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase tracking-tighter italic leading-none">
                        Cockpit <span className="text-transparent bg-clip-text bg-gradient-to-r from-abysse to-turquoise">Numérique</span>
                    </h2>
                </div>
                
                {/* Status Badge - Allégé */}
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur px-5 py-3 rounded-2xl border border-white shadow-sm">
                   <div className="flex flex-col items-end">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Statut Spot</span>
                       <span className="text-sm font-black text-green-600 uppercase flex items-center gap-2">
                           <CheckCircle2 size={16} /> Ouvert
                       </span>
                   </div>
                </div>
            </div>

            {/* LA GRILLE BENTO - REORGANISÉE */}
            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-5 relative z-10">
                
                {/* 1. WEATHER STATION (Gauche, Hauteur 2) */}
                <div className="col-span-12 lg:col-span-6 row-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-turquoise/10 text-turquoise rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl">air</span>
                            </div>
                            <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Station Locale</p>
                            <h3 className="text-2xl font-black text-abysse italic uppercase">Conditions</h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-abysse">14:45</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Live</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 my-6">
                        <div className="border-r border-slate-100 pr-4">
                            <p className="text-7xl font-black text-abysse tracking-tighter leading-none">
                                {weather.windSpeed}<span className="text-2xl text-slate-400 ml-1 tracking-normal">nds</span>
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                            <span className="material-symbols-outlined text-turquoise rotate-[-45deg] font-bold">arrow_upward</span>
                            <p className="text-xs font-black text-turquoise uppercase tracking-widest">{weather.windDirection}</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">thermostat</span>
                            <p className="text-2xl font-black text-abysse">{weather.temp}°C <span className="text-xs text-slate-400 uppercase font-bold block">Air</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-turquoise">water_drop</span>
                            <p className="text-2xl font-black text-abysse">14°C <span className="text-xs text-slate-400 uppercase font-bold block">Eau</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 relative overflow-hidden h-36 border border-slate-100">
                    <div className="flex justify-between items-end h-full relative z-10 pb-2 px-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Basse</p>
                            <p className="text-xs font-bold text-abysse">{weather.tideLow}</p>
                        </div>
                        <div className="text-center pb-6">
                            <p className="text-[10px] font-black text-turquoise uppercase mb-1">Coeff</p>
                            <p className="text-4xl font-black text-turquoise tracking-tighter">{weather.coefficient}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pleine</p>
                            <p className="text-xs font-bold text-abysse">{weather.tideHigh}</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-50">
                        <TideChart />
                    </div>
                    </div>
                </div>

                {/* 2. MOOD DU SPOT (Droite Haut, Hauteur 1) */}
                <div className={`col-span-12 lg:col-span-6 row-span-1 rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br ${mood.gradient} text-white shadow-lg flex flex-col justify-center group`}>
                    <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl pointer-events-none group-hover:scale-110 transition-transform duration-500">{mood.icon}</div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={18} className="animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest opacity-90">Vibe Check</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none mb-3">
                            "{mood.title}"
                        </h3>
                        <p className="font-medium text-white/90 text-sm md:text-base leading-relaxed max-w-md line-clamp-2">
                            {mood.desc}
                        </p>
                    </div>
                </div>

                {/* 3. CINÉMA (Droite Bas, Hauteur 1, Format 16/9) */}
                <div className="col-span-12 lg:col-span-6 row-span-1 bg-black rounded-3xl overflow-hidden relative group cursor-pointer shadow-md border border-white/10 flex items-end">
                    <div className="absolute inset-0 opacity-70 group-hover:opacity-50 transition-opacity">
                        <img src="https://images.unsplash.com/photo-1495554605052-6c3e9cb19ea3?q=80&w=1200" className="w-full h-full object-cover" alt="Drone" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-6 left-6">
                        <div className="size-10 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                            <Film size={18} />
                        </div>
                    </div>

                    <div className="relative z-10 p-6 w-full flex items-end justify-between">
                        <div>
                            <p className="text-turquoise font-black uppercase tracking-widest text-[10px] mb-1">Ciné-Club</p>
                            <h3 className="text-2xl font-black text-white uppercase italic leading-none">
                                Coutainville<br/>Vue du Ciel.
                            </h3>
                        </div>
                        <div className="size-12 rounded-full bg-white text-abysse flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                            <Play size={16} fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* 4. WEBCAM (Gauche, Largeur 8) */}
                <div className="col-span-12 lg:col-span-8 row-span-2 relative overflow-hidden rounded-3xl bg-slate-900 group cursor-pointer border border-slate-200 shadow-md" onClick={() => window.location.hash = '#le-spot'}>
                    <img 
                        alt="Webcam Plage Nord" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
                        src="https://picsum.photos/1200/800?grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                        <div className="bg-red-600 px-3 py-1.5 rounded text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 shadow-lg">
                            <span className="size-2 bg-white rounded-full animate-pulse"></span> Live
                        </div>
                        <span className="text-white text-xs font-bold tracking-tight bg-black/30 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">Plage Nord</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border-2 border-white/50 group-hover:bg-turquoise group-hover:border-turquoise transition-all group-hover:scale-110">
                            <span className="material-symbols-outlined text-4xl fill-current ml-1">play_arrow</span>
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <p className="text-white text-xl font-bold italic mb-1">{weather.description}</p>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Archipel des Écréhou visible</p>
                    </div>
                </div>

                {/* 5. FAUNE & FLORE (Droite, Largeur 4) */}
                <div className="col-span-12 lg:col-span-4 row-span-2 bg-slate-50 rounded-3xl p-6 border border-slate-200 relative overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md transition-shadow">
                    <img src="https://images.unsplash.com/photo-1547035160-2647c093a778?q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-110" alt="Phoque" />
                    <div className="absolute inset-0 bg-gradient-to-t from-abysse/90 via-abysse/20 to-transparent"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg border border-green-500">
                            <Binoculars size={12} /> Nature
                        </span>
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider bg-black/30 px-2 py-1 rounded">
                            Hier 16h45
                        </span>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <h3 className="text-2xl font-black text-white uppercase italic mb-2 leading-tight">
                            Alerte<br/>Phoques !
                        </h3>
                        <p className="text-slate-300 text-xs font-medium mb-6 line-clamp-2">
                            Un veau marin a été aperçu près de la cale sud à marée haute. Gardez vos distances (50m).
                        </p>
                        <button className="w-full py-3 bg-white text-abysse rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-turquoise hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg">
                            <Map size={14} /> J'ai vu un animal
                        </button>
                    </div>
                </div>

                {/* 6. GALERIE (Gauche, Hauteur 2) */}
                <div className="col-span-12 lg:col-span-6 row-span-2 bg-white rounded-3xl p-2 border border-slate-100 shadow-sm hover:shadow-md overflow-hidden flex flex-col cursor-pointer group transition-shadow" onClick={() => setIsGalleryOpen(true)}>
                    <div className="flex-1 grid grid-cols-2 gap-2 p-2 relative">
                        {galleryImages.slice(0, 3).map((img, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-square first:row-span-2 first:aspect-auto">
                                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery" />
                                <div className="absolute inset-0 bg-abysse/0 group-hover:bg-abysse/10 transition-colors"></div>
                            </div>
                        ))}
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                                <Images size={18} className="text-abysse" />
                                <span className="font-black text-abysse uppercase tracking-widest text-xs">Ouvrir la Galerie</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 flex justify-between items-center bg-white relative z-10">
                        <div>
                            <h3 className="text-lg font-black text-abysse uppercase italic">L'Album Photo</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Souvenirs 2024</p>
                        </div>
                        <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-turquoise group-hover:text-white transition-colors">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>

                {/* 7. FLASH INFO / RSS (3 items, redesign contrasté) */}
                <div className="col-span-12 lg:col-span-6 row-span-1 bg-slate-100 rounded-3xl p-6 relative overflow-hidden group border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-abysse">
                            <div className="size-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-red-500">
                                <Rss size={16} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">Dernières News</span>
                        </div>
                        <span className="text-[9px] font-bold bg-white px-2 py-1 rounded text-slate-400 border border-slate-100">Live Feed</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-3 justify-center">
                        {/* News Item 1 */}
                        <div className="bg-white p-3 rounded-xl border-l-4 border-l-red-500 shadow-sm flex items-start gap-3 hover:translate-x-1 transition-transform cursor-pointer group/item">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Sport</span>
                                    <span className="text-[9px] font-bold text-slate-400">Il y a 2h</span>
                                </div>
                                <h4 className="text-sm font-bold text-abysse truncate group-hover/item:text-red-500 transition-colors">Victoire de l'équipe au Grand Prix !</h4>
                            </div>
                        </div>

                        {/* News Item 2 */}
                        <div className="bg-white p-3 rounded-xl border-l-4 border-l-abysse shadow-sm flex items-start gap-3 hover:translate-x-1 transition-transform cursor-pointer group/item">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black text-abysse uppercase tracking-widest">Club</span>
                                    <span className="text-[9px] font-bold text-slate-400">Hier</span>
                                </div>
                                <h4 className="text-sm font-bold text-abysse truncate group-hover/item:text-turquoise transition-colors">Soirée Moules-Frites : Inscriptions</h4>
                            </div>
                        </div>

                        {/* News Item 3 */}
                        <div className="bg-white p-3 rounded-xl border-l-4 border-l-turquoise shadow-sm flex items-start gap-3 hover:translate-x-1 transition-transform cursor-pointer group/item">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[9px] font-black text-turquoise uppercase tracking-widest">Matériel</span>
                                    <span className="text-[9px] font-bold text-slate-400">Il y a 2j</span>
                                </div>
                                <h4 className="text-sm font-bold text-abysse truncate group-hover/item:text-turquoise transition-colors">Arrivée des nouvelles combinaisons</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 8. PLANNING (Réduit - Demi taille) */}
                <Link href="/infos-pratiques" className="col-span-12 md:col-span-6 lg:col-span-3 row-span-1 bg-white rounded-3xl p-6 relative overflow-hidden group cursor-pointer border border-slate-200 shadow-md hover:shadow-lg hover:border-turquoise transition-all flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-turquoise">
                            <Calendar size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Agenda</span>
                        </div>
                        <h3 className="text-2xl font-black text-abysse uppercase italic leading-none mb-2">
                            Planning<br/>Hebdo.
                        </h3>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <div className="size-12 rounded-full bg-slate-50 text-abysse flex items-center justify-center shadow-sm group-hover:bg-turquoise group-hover:text-white transition-all">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>

                {/* 9. BOUTIQUE (Réduit - Demi taille) */}
                <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-1 bg-yellow-400 rounded-3xl p-6 relative overflow-hidden group cursor-pointer border border-yellow-500 shadow-md hover:scale-[1.02] transition-transform flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-abysse">
                            <ShoppingBag size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Shop</span>
                        </div>
                        <h3 className="text-2xl font-black text-abysse uppercase italic leading-none mb-2">
                            Style<br/>Marin.
                        </h3>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <div className="size-12 rounded-full bg-white/20 text-abysse flex items-center justify-center shadow-sm group-hover:bg-white transition-all">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                    
                    <div className="absolute -right-4 -bottom-8 opacity-10 text-abysse rotate-12 pointer-events-none">
                        <ShoppingBag size={80} />
                    </div>
                </div>

            </div>
        </div>

      </main>

      {/* --- LE MANIFESTE --- */}
      <section className="mb-32 max-w-[1500px] mx-auto px-6">
        {/* Le reste des sections (Manifeste, Piliers...) reste inchangé, juste repositionné dans le flux */}
            <div className="relative rounded-[3rem] overflow-hidden bg-abysse shadow-2xl flex flex-col md:flex-row h-[700px] md:h-[600px] border border-slate-900 group/container">
                
                {/* 0. Le Message */}
                <div className="absolute top-8 left-8 z-30 pointer-events-none md:max-w-md">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9] drop-shadow-lg">
                        Ressentez<br/>la force<br/>du vent.
                    </h2>
                    <p className="text-slate-300 font-medium mt-4 text-sm md:text-base hidden md:block">
                        Entre dunes et grand large, choisissez votre façon de vivre la mer.
                    </p>
                </div>

                {/* 1. PANEL : NATURE (Kids/École) */}
                <Link href="/ecole-voile" className="relative flex-1 group/panel hover:flex-[2] transition-all duration-700 ease-in-out overflow-hidden border-b md:border-b-0 md:border-r border-white/10 cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 group-hover/panel:bg-black/20 transition-colors z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1596423736772-799a4e3df530?q=80&w=1200&auto=format&fit=crop" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110" 
                        alt="Enfants Nature" 
                    />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-abysse/90 via-abysse/40 to-transparent">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-12 bg-white rounded-xl flex items-center justify-center text-turquoise shadow-lg group-hover/panel:scale-110 transition-transform">
                                <Leaf size={24} />
                            </div>
                            <span className="text-turquoise font-black uppercase tracking-[0.2em] text-xs">Nature</span>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase italic mb-2 group-hover/panel:text-4xl transition-all">Apprendre</h3>
                        
                        <div className="h-0 opacity-0 group-hover/panel:h-auto group-hover/panel:opacity-100 overflow-hidden transition-all duration-500 ease-out">
                            <p className="text-slate-200 text-sm mb-4 leading-relaxed font-medium">
                                De l'éveil des sens à l'autonomie. L'école de voile pour les enfants de 5 à 12 ans.
                            </p>
                            <span className="inline-flex items-center gap-2 bg-white text-abysse px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-turquoise hover:text-white transition-colors">
                                Découvrir l'école <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* 2. PANEL : SENSATION (Adultes/Sport) */}
                <Link href="/activites" className="relative flex-1 group/panel hover:flex-[2] transition-all duration-700 ease-in-out overflow-hidden border-b md:border-b-0 md:border-r border-white/10 cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 group-hover/panel:bg-black/20 transition-colors z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1200&auto=format&fit=crop" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110" 
                        alt="Catamaran Sport" 
                    />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-abysse/90 via-abysse/40 to-transparent">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-lg group-hover/panel:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <span className="text-orange-500 font-black uppercase tracking-[0.2em] text-xs">Sensation</span>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase italic mb-2 group-hover/panel:text-4xl transition-all">Naviguer</h3>
                        
                        <div className="h-0 opacity-0 group-hover/panel:h-auto group-hover/panel:opacity-100 overflow-hidden transition-all duration-500 ease-out">
                            <p className="text-slate-200 text-sm mb-4 leading-relaxed font-medium">
                                Adrénaline et vitesse. Stages catamarans, char à voile et glisse pour ados & adultes.
                            </p>
                            <span className="inline-flex items-center gap-2 bg-white text-abysse px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-colors">
                                Voir les stages <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                </Link>

                {/* 3. PANEL : EXPLORATION (Location/Balade) */}
                <Link href="/activites" className="relative flex-1 group/panel hover:flex-[2] transition-all duration-700 ease-in-out overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 group-hover/panel:bg-black/20 transition-colors z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1541549467657-3f9f9d7c078d?q=80&w=1200&auto=format&fit=crop" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/panel:scale-110" 
                        alt="Kayak Exploration" 
                    />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-abysse/90 via-abysse/40 to-transparent">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-12 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-lg group-hover/panel:scale-110 transition-transform">
                                <Compass size={24} />
                            </div>
                            <span className="text-purple-500 font-black uppercase tracking-[0.2em] text-xs">Exploration</span>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase italic mb-2 group-hover/panel:text-4xl transition-all">S'évader</h3>
                        
                        <div className="h-0 opacity-0 group-hover/panel:h-auto group-hover/panel:opacity-100 overflow-hidden transition-all duration-500 ease-out">
                            <p className="text-slate-200 text-sm mb-4 leading-relaxed font-medium">
                                Louez un paddle ou un kayak, longez la côte à votre rythme. La liberté absolue.
                            </p>
                            <span className="inline-flex items-center gap-2 bg-white text-abysse px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-colors">
                                Louer du matériel <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                </Link>

            </div>
        </section>

        {/* --- NOUVEAU : INSTITUTIONNEL (STACK LAYOUT - PROPRE) --- */}
        <section className="mb-32 max-w-[1400px] mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-abysse uppercase italic tracking-tighter leading-[0.9] mb-6">
                 Plus qu'un Club, <br/>Un <span className="text-turquoise">Campus Nautique.</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                 Au Club Nautique de Coutainville, nous ne faisons pas que naviguer. Nous formons les marins de demain, nous éduquons les plus jeunes et nous accueillons les entreprises. Trois piliers, une même excellence.
              </p>
           </div>

           <div className="space-y-24">
               
               {/* PILIER 1 : FORMATION & SECOURISME (HERO DARK) */}
               <div className="relative group overflow-hidden rounded-[3rem] bg-abysse border border-slate-900 shadow-2xl">
                   <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                       <div className="relative h-[300px] lg:h-auto overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-abysse/20 to-abysse/80 lg:to-abysse mix-blend-multiply z-10"></div>
                           <img src="https://images.unsplash.com/photo-1558488551-4018a6f881aa?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sauvetage" />
                       </div>
                       <div className="p-12 lg:p-20 flex flex-col justify-center relative z-20">
                           <div className="flex items-center gap-4 mb-8">
                               <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center text-turquoise border border-white/10 backdrop-blur-md">
                                   <LifeBuoy size={32} />
                               </div>
                               <div>
                                   <span className="text-turquoise font-black uppercase tracking-[0.2em] text-xs block mb-1">Pôle Expertise</span>
                                   <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Formation &<br/>Secourisme</h3>
                               </div>
                           </div>
                           <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10 border-l-2 border-turquoise pl-6">
                               Transformez votre passion en métier. Le CNC est un centre de formation agréé pour les futurs professionnels de la mer. Devenez Nageur Sauveteur ou Moniteur de Voile.
                           </p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                               <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                                   <Medal size={20} className="text-yellow-400" />
                                   <span className="text-white font-bold text-sm">Diplômes d'État (BPJEPS)</span>
                               </div>
                               <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                                   <Siren size={20} className="text-red-400" />
                                   <span className="text-white font-bold text-sm">Secourisme (BNSSA/PSE)</span>
                               </div>
                           </div>
                           <Link href="/ecole-voile" className="inline-flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs group/link hover:text-turquoise transition-colors w-fit">
                               Découvrir nos cursus <ArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                           </Link>
                       </div>
                   </div>
               </div>

               {/* PILIER 2 : ACADÉMIE (LIGHT & CLEAN) */}
               <div className="relative group overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-xl">
                   <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[450px]">
                       <div className="p-12 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
                           <div className="flex items-center gap-4 mb-6">
                               <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-abysse border border-slate-100">
                                   <GraduationCap size={28} />
                               </div>
                               <h3 className="text-3xl md:text-4xl font-black text-abysse uppercase italic tracking-tighter">Académie Nautique</h3>
                           </div>
                           <p className="text-slate-600 font-medium leading-relaxed mb-8">
                               L'école de référence de la Côte Ouest. Une pédagogie structurée et labellisée "École Française de Voile" pour accompagner vos enfants dès 4 ans vers l'autonomie.
                           </p>
                           <ul className="space-y-4 mb-10">
                               <li className="flex items-center gap-3 text-abysse font-bold text-sm">
                                   <CheckCircle2 size={18} className="text-turquoise" /> Label EFV & Coachs diplômés
                               </li>
                               <li className="flex items-center gap-3 text-abysse font-bold text-sm">
                                   <CheckCircle2 size={18} className="text-turquoise" /> Jardin des Mers (4-6 ans)
                               </li>
                               <li className="flex items-center gap-3 text-abysse font-bold text-sm">
                                   <CheckCircle2 size={18} className="text-turquoise" /> Flotte récente & Sécurité
                               </li>
                           </ul>
                           <Link href="/ecole-voile" className="inline-flex items-center justify-center px-8 py-4 bg-slate-50 text-abysse rounded-xl font-black uppercase tracking-widest text-xs hover:bg-abysse hover:text-white transition-all w-fit">
                               Programme École
                           </Link>
                       </div>
                       <div className="relative h-[300px] lg:h-auto overflow-hidden order-1 lg:order-2">
                            <img src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Enfants voile" />
                       </div>
                   </div>
               </div>

               {/* PILIER 3 : BUSINESS (GREY TECH) */}
               <div className="relative group overflow-hidden rounded-[3rem] bg-slate-100 border border-slate-200 shadow-xl">
                   <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                       <div className="relative h-[300px] lg:h-auto overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" className="w-full h-full object-cover" alt="Meeting room" />
                           <div className="absolute inset-0 bg-abysse/10"></div>
                       </div>
                       <div className="p-12 lg:p-20 flex flex-col justify-center">
                           <div className="flex items-center gap-4 mb-6">
                               <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-abysse shadow-sm">
                                   <Briefcase size={28} />
                               </div>
                               <h3 className="text-3xl md:text-4xl font-black text-abysse uppercase italic tracking-tighter">Espace Pro &<br/>Séminaires</h3>
                           </div>
                           <p className="text-slate-600 font-medium leading-relaxed mb-10">
                               Un cadre inspirant pour vos équipes. Organisez vos séminaires, CODIR et teambuildings face à la mer dans un espace tout équipé.
                           </p>
                           
                           {/* INFOS UTILES BUSINESS */}
                           <div className="grid grid-cols-2 gap-4 mb-10">
                              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                                  <Wifi size={20} className="text-slate-400" />
                                  <div className="leading-tight">
                                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Connexion</span>
                                      <span className="block text-xs font-bold text-abysse">Fibre Pro</span>
                                  </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                                  <MonitorPlay size={20} className="text-slate-400" />
                                  <div className="leading-tight">
                                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Visio</span>
                                      <span className="block text-xs font-bold text-abysse">Écran 85"</span>
                                  </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                                  <Users size={20} className="text-slate-400" />
                                  <div className="leading-tight">
                                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Capacité</span>
                                      <span className="block text-xs font-bold text-abysse">10 à 80 pers.</span>
                                  </div>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                                  <Coffee size={20} className="text-slate-400" />
                                  <div className="leading-tight">
                                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Services</span>
                                      <span className="block text-xs font-bold text-abysse">Traiteur & Café</span>
                                  </div>
                              </div>
                           </div>

                           <Link href="/groupes-entreprises" className="inline-flex items-center gap-2 text-abysse font-black uppercase tracking-widest text-xs border-b-2 border-abysse pb-1 hover:text-turquoise hover:border-turquoise transition-colors w-fit">
                               Télécharger la brochure Pro <ArrowRight size={14} />
                           </Link>
                       </div>
                   </div>
               </div>

           </div>
        </section>

        {/* --- CTA CLUB --- */}
        <section className="mb-32 max-w-[1400px] mx-auto px-6">
           <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative shadow-lg">
              {/* Background Element */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-turquoise/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="relative z-10 max-w-xl">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 bg-abysse text-white rounded-full flex items-center justify-center shadow-lg">
                       <Users size={24} />
                    </div>
                    <span className="font-bold text-abysse uppercase tracking-widest text-sm">Association Loi 1901</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-abysse uppercase italic tracking-tighter leading-[0.9] mb-6">
                    Plus qu'une école,<br/> <span className="text-turquoise">Une Famille.</span>
                 </h2>
                 <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10">
                    Rejoignez une communauté de passionnés. Régates, barbecues, entraide et convivialité... Devenez membre du CNC et vivez la mer autrement, toute l'année.
                 </p>
                 <Link href="/club" className="inline-flex items-center gap-3 bg-abysse text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-xl group/btn">
                    Rejoindre le Club <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
              </div>

              {/* Visual Element (Mosaic or Abstract) */}
              <div className="relative z-10 w-full md:w-1/3 aspect-square rotate-3 group-hover:rotate-0 transition-transform duration-700">
                 <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000" className="w-full h-full object-cover rounded-[2rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 border-4 border-white" alt="Club Life" />
              </div>
           </div>
        </section>

      {/* --- GALLERY MODAL --- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-300">
          <div className="p-6 flex justify-between items-center text-white">
             <h3 className="text-xl font-black uppercase italic tracking-widest">Galerie CNC</h3>
             <button onClick={() => setIsGalleryOpen(false)} className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
               <X size={20} />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1600px] mx-auto">
                {galleryImages.map((img, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden cursor-zoom-in group" onClick={() => setSelectedImage(img)}>
                     <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* --- FULLSCREEN IMAGE OVERLAY --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in zoom-in-95 duration-200" onClick={() => setSelectedImage(null)}>
           <img src={selectedImage} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Full view" />
           <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-white hover:text-black transition-colors">
              <X size={32} />
           </button>
        </div>
      )}

    </div>
  );
};

export default HomePage;
