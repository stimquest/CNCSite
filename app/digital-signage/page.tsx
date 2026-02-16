"use client";

import React, { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { SignageSlideType } from '@/types';
import { SignageTideChart } from '@/components/SignageTideChart';
import { Wind, Anchor, X, QrCode, Waves, Thermometer, MapPin, Info } from 'lucide-react';
import { SignageSlide } from '@/types';

interface SequenceItem {
  type: string;
  duration: number;
  data?: SignageSlide;
}

export const DigitalSignagePage: React.FC = () => {
  const { weather, signageSlides } = useContent();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Dynamic sequence: Start with Weather, then all Sanity slides
  const SEQUENCE: SequenceItem[] = [
    { type: 'WEATHER', duration: 15000 },
    ...signageSlides.map(slide => ({
      type: slide.type.toUpperCase(),
      duration: slide.duration || 15000,
      data: slide
    }))
  ];

  const currentSlide = SEQUENCE[currentSlideIndex];

  useEffect(() => {
    if (!currentSlide) return;

    const duration = currentSlide.duration;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        const nextIndex = (currentSlideIndex + 1) % SEQUENCE.length;
        setCurrentSlideIndex(nextIndex);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentSlideIndex, SEQUENCE.length, currentSlide]);

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 bg-background-dark text-white overflow-hidden font-sans">

      {/* Top Bar Progress */}
      <div className="absolute top-0 left-0 h-2 bg-turquoise z-50 transition-all ease-linear" style={{ width: `${progress}%` }} />

      {/* Visible Exit Button */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute bottom-6 right-6 z-50 size-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/20 text-white/20 hover:text-white transition-all flex items-center justify-center group"
      >
        <X size={20} />
      </button>

      {/* CONTENT LAYOUT */}
      <div className="h-full w-full">

        {/* === SLIDE: MÉTÉO LIVE === */}
        {currentSlide.type === 'WEATHER' && (
          <div className="h-full grid grid-cols-12 p-8 gap-8 animate-in fade-in duration-700 items-center">
            {/* Main Metrics */}
            <div className="col-span-6 flex flex-col justify-center space-y-8 pl-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-turquoise/10 border border-turquoise/20 text-turquoise text-lg font-black uppercase tracking-[0.2em]">
                    <MapPin size={20} /> Agon
                  </span>
                  <div className="size-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">LIVE DIRECT</span>
                </div>
                <div className="flex items-center gap-8">
                  <h1 className="text-[6rem] leading-none font-black text-white tracking-tighter">
                    {weather.temp}<span className="text-3xl text-slate-500 ml-1 italic">°</span>
                  </h1>
                  <div className="space-y-0">
                    <p className="text-4xl font-black text-white uppercase italic tracking-tight leading-none">
                      {weather.description}
                    </p>
                    <p className="text-base font-bold text-slate-500 uppercase tracking-widest">Ciel & Visibilité</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 border-l-2 border-turquoise/20 pl-8 py-1">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-2xl bg-turquoise/10 border border-turquoise/20 flex items-center justify-center text-turquoise">
                    <Wind size={40} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-[4rem] font-black leading-none tracking-tighter text-white">
                        {weather.dominantWind?.split(' ')[1]?.split('-')[0] || weather.windSpeed}
                      </p>
                      <span className="text-xl font-black text-slate-600 italic">NDS</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="px-4 py-1.5 bg-turquoise text-abysse rounded-lg font-black text-lg italic uppercase">
                        {weather.dominantWind?.split(' ')[0] || weather.windDirection}
                      </div>
                      <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                        {weather.dominantWind?.split(' ')[1] ? `Rafales ${weather.dominantWind.split(' ')[1].split('-')[1]} nds` : 'Vent moyen'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Waves size={40} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-[4rem] font-black leading-none tracking-tighter text-white">
                        {weather.waterTemp || '14'}
                      </p>
                      <span className="text-xl font-black text-slate-600 italic">°EAU</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-black text-lg italic uppercase">
                        MER
                      </div>
                      <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                        Manche Ouest
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tide Panel - Perfectly balanced 6/6 & Slimmer */}
            <div className="col-span-6 bg-abysse/30 rounded-3xl border border-white/5 flex flex-col shadow-2xl relative overflow-hidden h-[70vh] mx-4 self-center">
              <div className="absolute top-0 right-0 p-48 bg-turquoise/5 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none mb-1">VIGIE</h2>
                    <h3 className="text-xl font-bold uppercase text-turquoise/50 tracking-[0.2em]">MARÉE</h3>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                    <div className="size-2.5 bg-turquoise rounded-full animate-ping"></div>
                    <span className="text-sm font-black text-white uppercase tracking-widest">FLUX LIVE</span>
                  </div>
                </div>

                <div className="flex-1 w-full relative z-10">
                  <SignageTideChart />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === SLIDE: PROMO / ACTIVITÉ (Sanity) === */}
        {currentSlide.type === 'PROMO' && currentSlide.data?.promoContent && (
          <div className="h-full flex items-center justify-center bg-abysse relative overflow-hidden p-16 animate-in fade-in duration-700">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-10" />

            {currentSlide.data.promoContent.image && (
              <img
                src={currentSlide.data.promoContent.image}
                className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
                alt=""
              />
            )}

            <div className="max-w-[1600px] w-full grid grid-cols-2 gap-24 items-center relative z-20">
              <div className="space-y-12">
                {currentSlide.data.promoContent.tag && (
                  <span className="inline-block px-6 py-3 bg-turquoise text-white text-xl font-black uppercase tracking-widest rounded-full shadow-lg shadow-turquoise/20">
                    {currentSlide.data.promoContent.tag}
                  </span>
                )}
                <h2 className="text-[7rem] leading-[0.9] font-black uppercase italic text-white text-balance">
                  {currentSlide.data.promoContent.title?.split(' ').map((word: string, i: number) => (
                    <React.Fragment key={i}>{word}{i === 0 ? <br /> : ' '}</React.Fragment>
                  ))}
                </h2>
                <p className="text-4xl font-medium text-slate-300 leading-relaxed max-w-2xl">
                  {currentSlide.data.promoContent.description}
                </p>
                <div className="flex items-center gap-8 pt-8">
                  {currentSlide.data.promoContent.showQrCode && (
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                      <QrCode size={100} className="text-abysse" />
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-bold text-turquoise uppercase tracking-widest mb-1">Scanner pour découvrir</p>
                    <p className="text-sm text-slate-400">ou rdv à l'accueil du club</p>
                  </div>
                </div>
              </div>
              <div className="aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl rotate-3">
                <img
                  src={currentSlide.data.promoContent.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop"}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </div>
        )}

        {/* === SLIDE: PARTENAIRES (Sanity) === */}
        {currentSlide.type === 'PARTNERS' && currentSlide.data?.partnersContent && (
          <div className="h-full flex flex-col items-center justify-center bg-white text-abysse relative animate-in fade-in duration-700">
            <div className="absolute top-0 left-0 w-full h-32 bg-abysse flex items-center justify-center">
              <h2 className="text-3xl font-black uppercase tracking-[0.5em] text-white">
                {currentSlide.data.partnersContent.title || 'Nos Partenaires Officiels'}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-x-32 gap-y-16 items-center opacity-80 scale-110 p-24">
              {currentSlide.data.partnersContent.list?.map((partner: any, i: number) => (
                <div key={i} className="flex flex-col items-center justify-center space-y-4">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="text-4xl font-black text-slate-300 uppercase tracking-tighter text-center">{partner.name}</div>
                  )}
                </div>
              ))}
              {/* Fallback anchor logo if list is empty */}
              {(!currentSlide.data.partnersContent.list || currentSlide.data.partnersContent.list.length === 0) && (
                <div className="col-span-3 flex justify-center opacity-20">
                  <Anchor size={200} className="text-abysse" />
                </div>
              )}
            </div>

            <div className="absolute bottom-16 flex flex-col items-center gap-4">
              <p className="text-turquoise font-black uppercase text-xl tracking-[0.3em]">CVC • Soutien & Engagement</p>
            </div>
          </div>
        )}

        {/* === SLIDE: INFO (Sanity) === */}
        {currentSlide.type === 'INFO' && currentSlide.data?.infoContent && (
          <div className={`h-full flex items-center justify-center relative overflow-hidden p-16 animate-in slide-in-from-bottom duration-700 ${currentSlide.data.infoContent.category === 'alert' ? 'bg-red-950' :
            currentSlide.data.infoContent.category === 'vibe' ? 'bg-purple-950' :
              currentSlide.data.infoContent.category === 'event' ? 'bg-abysse' : 'bg-slate-900'
            }`}>
            <div className="absolute top-0 right-0 p-96 bg-white/5 blur-[120px] rounded-full" />

            <div className="max-w-6xl w-full space-y-12 relative z-10 text-center">
              <div className="flex justify-center">
                <div className={`size-32 rounded-3xl flex items-center justify-center shadow-2xl ${currentSlide.data.infoContent.category === 'alert' ? 'bg-red-500 text-white' :
                  currentSlide.data.infoContent.category === 'vibe' ? 'bg-purple-500 text-white' :
                    currentSlide.data.infoContent.category === 'event' ? 'bg-turquoise text-abysse' : 'bg-blue-500 text-white'
                  }`}>
                  <Info size={64} strokeWidth={2.5} />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-8xl font-black uppercase italic tracking-tighter text-white">
                  {currentSlide.data.infoContent.title}
                </h2>
                <div className={`h-2 w-48 mx-auto rounded-full ${currentSlide.data.infoContent.category === 'alert' ? 'bg-red-500' :
                  currentSlide.data.infoContent.category === 'vibe' ? 'bg-purple-500' :
                    currentSlide.data.infoContent.category === 'event' ? 'bg-turquoise' : 'bg-blue-500'
                  }`} />
              </div>

              <p className="text-5xl font-medium text-slate-200 leading-tight text-balance">
                {currentSlide.data.infoContent.message}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DigitalSignagePage;