"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSignageContent } from '@/contexts/SignageContentContext';
import { SignageAromeTable } from '@/components/SignageAromeTable';
import {
  Wind, Anchor, X, QrCode, Waves, Thermometer, MapPin, Info,
  TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, Sunrise, Sunset
} from 'lucide-react';
import { SignageSlide } from '@/types';

interface SequenceItem {
  type: string;
  duration: number;
  data?: SignageSlide;
}

// ── Persistent sidebar ────────────────────────────────────────────────────────
const SignageSidebar: React.FC = () => {
  const { weather } = useSignageContent();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const trendIcon =
    weather.trend === 'rising' ? <TrendingUp size={16} className="text-orange-300" /> :
    weather.trend === 'falling' ? <TrendingDown size={16} className="text-emerald-300" /> :
    <Minus size={16} className="text-white/30" />;

  const trendLabel =
    weather.trend === 'rising' ? <span className="text-orange-300">Hausse</span> :
    weather.trend === 'falling' ? <span className="text-emerald-300">Baisse</span> :
    <span className="text-white/30">Stable</span>;

  return (
    <aside className="col-span-2 h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #001828 0%, #002B49 60%, #00192F 100%)' }}>

      {/* Turquoise left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-turquoise to-transparent opacity-60" />

      <div className="flex flex-col gap-3 p-4 h-full">

        {/* Header + clock */}
        <div className="text-center pt-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={11} className="text-turquoise" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-turquoise/80">Agon-Coutainville</span>
            <div className="size-1.5 bg-red-400 rounded-full animate-pulse" />
          </div>
          <p className="text-[2.6rem] font-black text-white tracking-tight tabular-nums leading-none">
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px] font-bold text-turquoise/50 uppercase tracking-widest mt-1">
            {now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>

        <div className="border-t border-turquoise/15" />

        {/* VENT */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,169,206,0.08)', border: '1px solid rgba(0,169,206,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Wind size={11} className="text-turquoise" strokeWidth={2.5} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-turquoise/70">Vent</p>
            <div className="ml-auto flex items-center gap-1">
              {trendIcon}
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="px-2 py-0.5 bg-turquoise text-abysse rounded-md font-black text-sm italic uppercase">
              {weather.windDirection}
            </div>
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{weather.windSpeed}</span>
            <span className="text-xs font-bold text-white/40">nds</span>
          </div>
          <p className="text-[10px] font-bold text-white/40 mt-1">
            Rafales <span className="text-white/70 font-black">{weather.gusts ?? '–'}</span> nds
            {' • '}{trendLabel}
          </p>
        </div>

        {/* HOULE */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Waves size={11} className="text-blue-300" strokeWidth={2.5} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300/70">État de la mer</p>
          </div>
          <div className="flex items-baseline gap-1.5">
            {weather.waveDirection && (
              <div className="px-2 py-0.5 bg-blue-500 text-white rounded-md font-black text-sm italic uppercase">
                {weather.waveDirection}
              </div>
            )}
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{weather.waveHeight ?? '–'}</span>
            <span className="text-xs font-bold text-white/40">m</span>
            {weather.wavePeriod && (
              <span className="text-[10px] font-bold text-white/40 ml-auto">{weather.wavePeriod}s</span>
            )}
          </div>
        </div>

        <div className="border-t border-turquoise/15" />

        {/* MARÉE */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Anchor size={11} className="text-turquoise/60" strokeWidth={2.5} />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-turquoise/60">Marée</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                <ArrowUp size={9} className="text-turquoise" />
                <p className="text-[8px] font-black text-white/40 uppercase tracking-wider">PM</p>
              </div>
              <p className="text-sm font-black text-white">{weather.tideHigh || '–:––'}</p>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                <ArrowDown size={9} className="text-blue-300" />
                <p className="text-[8px] font-black text-white/40 uppercase tracking-wider">BM</p>
              </div>
              <p className="text-sm font-black text-white">{weather.tideLow || '–:––'}</p>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,169,206,0.12)', border: '1px solid rgba(0,169,206,0.25)' }}>
              <p className="text-[8px] font-black text-turquoise/60 uppercase tracking-wider mb-0.5">Coef.</p>
              <p className="text-sm font-black text-turquoise">{weather.coefficient || '–'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-turquoise/15" />

        {/* SOLEIL */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(253,224,71,0.06)', border: '1px solid rgba(253,224,71,0.15)' }}>
            <Sunrise size={14} className="text-yellow-300 shrink-0" />
            <div>
              <p className="text-[8px] font-black text-yellow-300/50 uppercase tracking-wider">Lever</p>
              <p className="text-base font-black text-white">{weather.sunrise ?? '–:––'}</p>
            </div>
          </div>
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.18)' }}>
            <Sunset size={14} className="text-orange-300 shrink-0" />
            <div>
              <p className="text-[8px] font-black text-orange-300/50 uppercase tracking-wider">Coucher</p>
              <p className="text-base font-black text-white">{weather.sunset ?? '–:––'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-turquoise/15" />

        {/* TEMPÉRATURES */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Thermometer size={14} className="text-orange-200 shrink-0" />
            <div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-wider">Air</p>
              <p className="text-lg font-black text-white leading-none">{weather.temp}<span className="text-xs text-white/30">°</span></p>
            </div>
          </div>
          <div className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Waves size={14} className="text-blue-200 shrink-0" />
            <div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-wider">Eau</p>
              <p className="text-lg font-black text-white leading-none">{weather.waterTemp ?? '–'}<span className="text-xs text-white/30">°</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-1">
          <p className="text-[9px] font-black text-turquoise/30 uppercase tracking-[0.3em]">CNC • Agon</p>
        </div>

      </div>
    </aside>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export const DigitalSignagePage: React.FC = () => {
  const { signageSlides } = useSignageContent();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const SEQUENCE = useMemo((): SequenceItem[] => {
    const weatherSlide: SequenceItem = { type: 'WEATHER', duration: 20000 };
    if (signageSlides.length === 0) return [weatherSlide];
    // Interleave: MÉTÉO → slide A → MÉTÉO → slide B → …
    const result: SequenceItem[] = [];
    signageSlides.forEach(slide => {
      result.push(weatherSlide);
      result.push({
        type: slide.type.toUpperCase(),
        duration: Math.max(slide.duration || 15000, 5000),
        data: slide,
      });
    });
    return result;
  }, [signageSlides]);

  // Ref pour que le callback du timer lise toujours la dernière longueur de séquence
  // sans que SEQUENCE soit une dépendance de l'effect (évite les intervals en double)
  const sequenceLengthRef = useRef(SEQUENCE.length);
  useEffect(() => { sequenceLengthRef.current = SEQUENCE.length; }, [SEQUENCE]);

  const currentSlide = SEQUENCE[currentSlideIndex] || SEQUENCE[0];

  useEffect(() => {
    if (!currentSlide) return;
    const duration = currentSlide.duration;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(timer);
        setProgress(0);
        setCurrentSlideIndex(i => (i + 1) % sequenceLengthRef.current);
      } else {
        setProgress((elapsed / duration) * 100);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [currentSlideIndex]); // SEQUENCE volontairement absent : on lit sa longueur via ref

  if (!currentSlide) return null;

  return (
    <div
      className="fixed inset-0 text-white overflow-hidden font-sans grid grid-cols-12"
      style={{ background: 'linear-gradient(135deg, #001E35 0%, #002B49 50%, #003A5C 100%)' }}
    >
      {/* Subtle ambient glow top-left */}
      <div className="absolute top-0 left-0 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,169,206,0.12) 0%, transparent 70%)' }} />
      {/* Subtle ambient glow bottom-right of slide area */}
      <div className="absolute bottom-0 left-[30%] w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,169,206,0.07) 0%, transparent 70%)' }} />

      {/* Top progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-turquoise z-50 transition-all ease-linear shadow-[0_0_12px_rgba(0,169,206,0.8)]"
        style={{ width: `${progress * 0.834}%` }} />

      {/* Exit button */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute bottom-4 left-4 z-50 size-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <X size={14} className="text-white/30 hover:text-white transition-colors" />
      </button>

      {/* ── Slide content (10/12 ≈ 85%) ── */}
      <div className="col-span-10 h-full overflow-hidden relative">

        {/* MÉTÉO AROME HD */}
        {currentSlide.type === 'WEATHER' && (
          <div className="h-full flex flex-col p-6 gap-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
                  Météo <span className="text-turquoise">Prochaines heures</span>
                </h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] mt-0.5">
                  AROME HD 1.3km · Agon-Coutainville · Manche Ouest
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(0,169,206,0.1)', border: '1px solid rgba(0,169,206,0.25)' }}>
                <div className="size-2 bg-turquoise rounded-full animate-ping" />
                <span className="text-xs font-black text-turquoise uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <SignageAromeTable />
            </div>
          </div>
        )}

        {/* PROMO */}
        {currentSlide.type === 'PROMO' && currentSlide.data?.promoContent && (
          <div className="h-full relative overflow-hidden animate-in fade-in duration-700">
            {/* Image fond floutée */}
            {currentSlide.data.promoContent.image && (
              <img src={currentSlide.data.promoContent.image}
                className="absolute inset-0 w-full h-full object-cover opacity-10 scale-110 blur-md"
                alt="" />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(0,18,34,0.98) 45%, rgba(0,43,73,0.5) 100%)' }} />

            {/* Contenu */}
            <div className="relative z-10 h-full flex items-center gap-16 px-14">

              {/* Texte — occupe l'espace disponible */}
              <div className="flex-1 space-y-8">
                {currentSlide.data.promoContent.tag && (
                  <span className="inline-block px-5 py-2 bg-turquoise text-abysse text-base font-black uppercase tracking-widest rounded-full">
                    {currentSlide.data.promoContent.tag}
                  </span>
                )}
                <h2 className="text-[6rem] leading-[0.88] font-black uppercase italic text-white tracking-tight">
                  {currentSlide.data.promoContent.title}
                </h2>
                {currentSlide.data.promoContent.description && (
                  <p className="text-2xl font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {currentSlide.data.promoContent.description}
                  </p>
                )}
                {currentSlide.data.promoContent.showQrCode && (
                  <div className="flex items-center gap-5 pt-4">
                    <div className="bg-white p-3 rounded-xl shadow-2xl shrink-0">
                      <QrCode size={80} className="text-abysse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-turquoise uppercase tracking-widest mb-1">Scanner pour découvrir</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>ou rdv à l'accueil du club</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo dans un cadre légèrement de biais */}
              <div className="shrink-0 w-[45%] h-[70%] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] rotate-2"
                style={{ border: '2px solid rgba(0,169,206,0.35)' }}>
                <img
                  src={currentSlide.data.promoContent.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop"}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

            </div>
          </div>
        )}

        {/* PARTENAIRES */}
        {currentSlide.type === 'PARTNERS' && currentSlide.data?.partnersContent && (
          <div className="h-full flex flex-col items-center justify-center relative animate-in fade-in duration-700 p-10">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-black uppercase italic text-white tracking-tighter">
                {currentSlide.data.partnersContent.title || 'Nos Partenaires Officiels'}
              </h2>
              <div className="h-0.5 w-24 bg-turquoise mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-3 gap-x-16 gap-y-10 items-center w-full max-w-3xl">
              {currentSlide.data.partnersContent.list?.map((partner: any, i: number) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="h-20 w-auto object-contain brightness-0 invert opacity-80" />
                  ) : (
                    <div className="text-2xl font-black text-white/60 uppercase tracking-tighter text-center">{partner.name}</div>
                  )}
                </div>
              ))}
              {(!currentSlide.data.partnersContent.list || currentSlide.data.partnersContent.list.length === 0) && (
                <div className="col-span-3 flex justify-center">
                  <Anchor size={120} className="text-turquoise/20" />
                </div>
              )}
            </div>
            <p className="absolute bottom-8 text-turquoise/40 font-black uppercase text-xs tracking-[0.4em]">CNC · Soutien & Engagement</p>
          </div>
        )}

        {/* INFO */}
        {currentSlide.type === 'INFO' && currentSlide.data?.infoContent && (() => {
          const cat = currentSlide.data.infoContent.category;
          const accentColor =
            cat === 'alert' ? '#ef4444' :
            cat === 'vibe' ? '#a855f7' :
            cat === 'event' ? '#00A9CE' : '#3b82f6';
          const bgColor =
            cat === 'alert' ? 'rgba(127,29,29,0.5)' :
            cat === 'vibe' ? 'rgba(59,7,100,0.5)' :
            cat === 'event' ? 'rgba(0,43,73,0.7)' : 'rgba(15,23,42,0.6)';
          return (
            <div className="h-full flex items-center justify-center relative overflow-hidden p-12 animate-in slide-in-from-bottom duration-700"
              style={{ background: bgColor }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 70% 20%, ${accentColor}18 0%, transparent 60%)` }} />
              <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
                <div className="flex justify-center">
                  <div className="size-20 rounded-2xl flex items-center justify-center shadow-2xl"
                    style={{ background: accentColor }}>
                    <Info size={40} strokeWidth={2.5} className={cat === 'event' ? 'text-abysse' : 'text-white'} />
                  </div>
                </div>
                <div>
                  <h2 className="text-7xl font-black uppercase italic tracking-tighter text-white">
                    {currentSlide.data.infoContent.title}
                  </h2>
                  <div className="h-1 w-24 mx-auto rounded-full mt-4" style={{ background: accentColor }} />
                </div>
                <p className="text-4xl font-medium text-white/80 leading-tight text-balance">
                  {currentSlide.data.infoContent.message}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Persistent sidebar (2/12 ≈ 15%) ── */}
      <SignageSidebar />

    </div>
  );
};

export default DigitalSignagePage;
