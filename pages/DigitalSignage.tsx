import React, { useState, useEffect } from 'react';
import { MOCK_WEATHER, TIDE_DATA } from '../constants';
import { SignageSlideType } from '../types';
import { TideChart } from '../components/TideChart';
import { Wind, Anchor, X } from 'lucide-react';

export const DigitalSignage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<SignageSlideType>(SignageSlideType.WEATHER);
  const [progress, setProgress] = useState(0);

  // Configuration for slide durations (ms)
  const SLIDE_DURATIONS = {
    [SignageSlideType.WEATHER]: 20000,
    [SignageSlideType.VIDEO]: 40000,
    [SignageSlideType.PROMO]: 30000,
    [SignageSlideType.PARTNERS]: 15000 // Reduced for demo
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
    <div className="fixed inset-0 bg-black text-white overflow-hidden cursor-none no-scrollbar">
      {/* Exit Button (Hidden unless hovered at top right, mainly for dev) */}
      <button 
        onClick={() => window.location.hash = ''} 
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 rounded-full hover:bg-red-500 opacity-0 hover:opacity-100 transition-opacity"
      >
        <X />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-nautical-500 z-50 transition-all ease-linear" style={{ width: `${progress}%` }} />

      {/* Slide Content */}
      <div className="h-full w-full">
        
        {/* SLIDE: WEATHER */}
        {currentSlide === SignageSlideType.WEATHER && (
          <div className="h-full grid grid-cols-2 p-12 gap-12 animate-in fade-in duration-1000">
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h1 className="text-8xl font-display font-bold text-white mb-2">{MOCK_WEATHER.temp}°</h1>
                <p className="text-4xl text-gray-400">{MOCK_WEATHER.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <Wind size={64} className="text-nautical-500" />
                <div>
                   <p className="text-6xl font-bold">{MOCK_WEATHER.windSpeed} <span className="text-3xl font-normal text-gray-500">NOEUDS</span></p>
                   <p className="text-2xl text-nautical-300 uppercase tracking-widest">{MOCK_WEATHER.windDirection} - RAFALES {MOCK_WEATHER.windSpeed + 8}</p>
                </div>
              </div>
            </div>
            <div className="bg-nautical-800/50 rounded-3xl p-8 border border-white/10 flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-4">MARÉES (Port de référence)</h2>
              <div className="flex-1">
                <TideChart />
              </div>
              <div className="flex justify-between text-2xl mt-4 px-4 font-mono">
                 <span>BM: {MOCK_WEATHER.tideLow}</span>
                 <span className="text-nautical-500">COEFF: {MOCK_WEATHER.coefficient}</span>
                 <span>PM: {MOCK_WEATHER.tideHigh}</span>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE: VIDEO */}
        {currentSlide === SignageSlideType.VIDEO && (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img 
               src="https://picsum.photos/1920/1080?random=10" 
               className="w-full h-full object-cover animate-in zoom-in-105 duration-[40s]" 
               alt="Drone view"
            />
            <div className="absolute bottom-12 left-12 z-20">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                 <span className="text-xl font-bold tracking-widest uppercase">Images du jour</span>
               </div>
               <h2 className="text-6xl font-display font-bold max-w-2xl leading-tight">Session Wingfoil au coucher du soleil</h2>
            </div>
          </div>
        )}

        {/* SLIDE: PROMO */}
        {currentSlide === SignageSlideType.PROMO && (
          <div className="h-full flex items-center justify-center bg-nautical-900 p-12">
             <div className="max-w-6xl w-full grid grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <span className="px-4 py-2 bg-nautical-500 text-nautical-900 font-bold uppercase tracking-wider rounded">Offre Spéciale</span>
                  <h2 className="text-7xl font-display font-bold">Stage d'été<br/><span className="text-nautical-300">Ouverture des inscriptions</span></h2>
                  <p className="text-2xl text-gray-400">Réservez avant le 30 avril et bénéficiez de -10% sur les stages Optimist et Catamaran.</p>
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden border-2 border-white/10 rotate-3">
                   <img src="https://picsum.photos/800/800?random=20" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
        )}

        {/* SLIDE: PARTNERS */}
        {currentSlide === SignageSlideType.PARTNERS && (
          <div className="h-full flex flex-col items-center justify-center bg-white text-nautical-900">
             <h2 className="text-3xl font-bold uppercase tracking-widest mb-20 text-nautical-300">Nos Partenaires</h2>
             <div className="grid grid-cols-3 gap-24 opacity-80">
                {/* Placeholders for logos */}
                <div className="w-64 h-32 bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl rounded">LOGO 01</div>
                <div className="w-64 h-32 bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl rounded">LOGO 02</div>
                <div className="w-64 h-32 bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl rounded">LOGO 03</div>
             </div>
             <div className="absolute bottom-12 flex items-center gap-2 text-nautical-900">
               <Anchor size={24} />
               <span className="font-display font-bold text-2xl">CNC 2026</span>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};