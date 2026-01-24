"use client";

import React, { useState, useEffect } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { SignageSlideType } from '../../types';
import { TideChart } from '../../components/TideChart';
import { Wind, Anchor, X, QrCode } from 'lucide-react';

export const DigitalSignagePage: React.FC = () => {
  const { weather } = useContent();
  const [currentSlide, setCurrentSlide] = useState<SignageSlideType>(SignageSlideType.WEATHER);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATIONS = {
    [SignageSlideType.WEATHER]: 15000,
    [SignageSlideType.VIDEO]: 30000,
    [SignageSlideType.PROMO]: 15000,
    [SignageSlideType.PARTNERS]: 10000
  };

  const SEQUENCE = [
    SignageSlideType.WEATHER,
    SignageSlideType.VIDEO,
    SignageSlideType.PROMO,
    SignageSlideType.PARTNERS
  ];

  useEffect(() => {
    const duration = SLIDE_DURATIONS[currentSlide];
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        const currentIndex = SEQUENCE.indexOf(currentSlide);
        const nextIndex = (currentIndex + 1) % SEQUENCE.length;
        setCurrentSlide(SEQUENCE[nextIndex]);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="fixed inset-0 bg-background-dark text-white overflow-hidden font-sans">
      
      {/* Top Bar Progress */}
      <div className="absolute top-0 left-0 h-2 bg-turquoise z-50 transition-all ease-linear" style={{ width: `${progress}%` }} />

      {/* Visible Exit Button */}
      <button 
        onClick={() => window.location.hash = ''} 
        className="absolute top-6 right-6 z-50 px-5 py-3 bg-abysse/80 backdrop-blur-md border border-white/20 rounded-full hover:bg-red-600 hover:border-red-500 text-white transition-all shadow-2xl flex items-center gap-3 group"
      >
        <span className="text-xs font-black uppercase tracking-widest group-hover:hidden">Mode Écran</span>
        <span className="text-xs font-black uppercase tracking-widest hidden group-hover:inline">Fermer</span>
        <X size={18} />
      </button>

      {/* CONTENT LAYOUT */}
      <div className="h-full w-full">
        
        {/* === SLIDE 1: MÉTÉO LIVE === */}
        {currentSlide === SignageSlideType.WEATHER && (
          <div className="h-full grid grid-cols-12 p-16 gap-16 animate-in fade-in duration-700">
            {/* Main Metrics */}
            <div className="col-span-7 flex flex-col justify-center space-y-16">
              <div>
                <div className="flex items-start gap-4 mb-4">
                    <span className="px-4 py-2 rounded-lg border border-turquoise text-turquoise text-xl font-black uppercase tracking-widest animate-pulse">
                        Direct Plage Nord
                    </span>
                </div>
                <h1 className="text-[12rem] leading-none font-black text-white tracking-tighter">
                    {weather.temp}°
                </h1>
                <p className="text-5xl font-bold text-slate-400 mt-4 leading-tight">
                    {weather.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
                 <div className="flex items-center gap-8">
                    <div className="size-24 rounded-3xl bg-turquoise/20 flex items-center justify-center text-turquoise">
                        <Wind size={64} />
                    </div>
                    <div>
                        <p className="text-7xl font-black">{weather.windSpeed}<span className="text-3xl font-bold text-slate-500 ml-2">nds</span></p>
                        <p className="text-2xl font-bold text-turquoise uppercase tracking-widest mt-2">{weather.windDirection}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                     <div className="size-24 rounded-3xl bg-abysse border border-white/10 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-6xl">water_drop</span>
                     </div>
                     <div>
                        <p className="text-7xl font-black">14°<span className="text-3xl font-bold text-slate-500 ml-2">Eau</span></p>
                        <p className="text-2xl font-bold text-slate-400 uppercase tracking-widest mt-2">Combi 4/3mm</p>
                     </div>
                 </div>
              </div>
            </div>

            {/* Tide Panel */}
            <div className="col-span-5 bg-abysse rounded-[3rem] p-12 border border-white/10 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-turquoise/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-end mb-8 relative z-10">
                 <h2 className="text-4xl font-black uppercase italic">Marée</h2>
                 <span className="text-xl font-bold text-slate-400">Coeff <span className="text-white text-3xl ml-2">{weather.coefficient}</span></span>
              </div>
              
              <div className="flex-1 w-full relative z-10">
                <TideChart />
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8 relative z-10">
                 <div className="bg-background-dark/50 rounded-2xl p-6 text-center border border-white/5">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Basse Mer</p>
                    <p className="text-4xl font-black text-white">{weather.tideLow}</p>
                 </div>
                 <div className="bg-background-dark/50 rounded-2xl p-6 text-center border border-white/5">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Pleine Mer</p>
                    <p className="text-4xl font-black text-white">{weather.tideHigh}</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* === SLIDE 2: VIDEO IMMERSIVE === */}
        {currentSlide === SignageSlideType.VIDEO && (
          <div className="relative h-full w-full bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-abysse/90 via-transparent to-transparent z-10" />
            <img 
               src="https://images.unsplash.com/photo-1516126489370-179ee771ae35?q=80&w=2000&auto=format&fit=crop" 
               className="w-full h-full object-cover animate-in zoom-in-110 duration-[30s]" 
               alt="Action shot"
            />
            <div className="absolute bottom-24 left-16 z-20 max-w-4xl">
               <div className="flex items-center gap-6 mb-6">
                 <span className="px-4 py-2 bg-red-600 text-white font-black uppercase tracking-widest rounded animate-pulse">Live Cam</span>
                 <span className="text-2xl font-bold uppercase tracking-widest text-white/80">Plage Nord</span>
               </div>
               <h2 className="text-8xl font-black text-white uppercase italic leading-[0.9]">
                 Le spot est<br/><span className="text-turquoise">Magique</span>
               </h2>
            </div>
          </div>
        )}

        {/* === SLIDE 3: PROMO / ACTIVITÉ === */}
        {currentSlide === SignageSlideType.PROMO && (
          <div className="h-full flex items-center justify-center bg-abysse relative overflow-hidden p-16">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             
             <div className="max-w-[1600px] w-full grid grid-cols-2 gap-24 items-center relative z-10">
                <div className="space-y-12">
                  <span className="inline-block px-6 py-3 bg-turquoise text-white text-xl font-black uppercase tracking-widest rounded-full shadow-lg shadow-turquoise/20">
                     Offre Flash
                  </span>
                  <h2 className="text-[7rem] leading-[0.9] font-black uppercase italic text-white">
                    Stage<br/>Pâques
                  </h2>
                  <p className="text-4xl font-medium text-slate-300 leading-relaxed">
                    Il reste 3 places pour le stage Catamaran Ados de la semaine prochaine.
                  </p>
                  <div className="flex items-center gap-8 pt-8">
                     <div className="bg-white p-4 rounded-xl">
                        <QrCode size={100} className="text-abysse" />
                     </div>
                     <div>
                        <p className="text-xl font-bold text-turquoise uppercase tracking-widest mb-1">Scanner pour réserver</p>
                        <p className="text-sm text-slate-400">ou rdv à l'accueil</p>
                     </div>
                  </div>
                </div>
                <div className="aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl rotate-3">
                   <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
        )}

        {/* === SLIDE 4: PARTENAIRES === */}
        {currentSlide === SignageSlideType.PARTNERS && (
          <div className="h-full flex flex-col items-center justify-center bg-white text-abysse relative">
             <div className="absolute top-0 left-0 w-full h-32 bg-abysse flex items-center justify-center">
                <h2 className="text-3xl font-black uppercase tracking-[0.5em] text-white">Nos Partenaires Officiels</h2>
             </div>
             
             <div className="grid grid-cols-3 gap-32 items-center opacity-80 scale-110">
                {/* Mock Logos style grayscale */}
                <div className="text-5xl font-black text-slate-300 uppercase tracking-tighter">Region<br/>Normandie</div>
                <div className="text-5xl font-black text-slate-300 uppercase tracking-tighter">Département<br/>Manche</div>
                <div className="text-5xl font-black text-slate-300 uppercase tracking-tighter">Ville de<br/>Coutainville</div>
                <div className="text-5xl font-black text-slate-300 uppercase tracking-tighter">Crédit<br/>Mutuel</div>
                <div className="flex justify-center"><Anchor size={120} className="text-abysse" /></div>
                <div className="text-5xl font-black text-slate-300 uppercase tracking-tighter">North<br/>Sails</div>
             </div>

             <div className="absolute bottom-16 flex flex-col items-center gap-4">
               <p className="text-turquoise font-black uppercase tracking-widest text-xl">Rejoignez le Club des Partenaires</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DigitalSignagePage;