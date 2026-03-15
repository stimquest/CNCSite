"use client";

import React, { useEffect, useState } from 'react';
import { ArrowDown, RefreshCw, Zap } from 'lucide-react';

interface ExpertData {
  weather: any;
  waves: any;
  updatedAt: string;
}

const COLS = 16; // 8h × 2 points/h (toutes les 30 min)

const getWindColor = (knots: number): { bg: string; text: string } => {
  if (knots <= 5)  return { bg: '#2130ff', text: '#ffffff' };
  if (knots <= 9)  return { bg: '#0099ff', text: '#ffffff' };
  if (knots <= 11) return { bg: '#00ccff', text: '#004a48' };
  if (knots <= 13) return { bg: '#00ffff', text: '#004a48' };
  if (knots <= 15) return { bg: '#15f7b8', text: '#004a3d' };
  if (knots <= 17) return { bg: '#15e378', text: '#004a25' };
  if (knots <= 19) return { bg: '#15db2a', text: '#0c4a00' };
  if (knots <= 23) return { bg: '#84eb21', text: '#314a00' };
  if (knots <= 27) return { bg: '#ffff00', text: '#4a4a00' };
  if (knots <= 31) return { bg: '#ffc000', text: '#ffffff' };
  if (knots <= 35) return { bg: '#ff7f00', text: '#ffffff' };
  if (knots <= 39) return { bg: '#ff3f00', text: '#ffffff' };
  if (knots <= 43) return { bg: '#df1b00', text: '#ffffff' };
  return             { bg: '#bf2170', text: '#ffffff' };
};

export const SignageAromeTable: React.FC = () => {
  const [data, setData] = useState<ExpertData | null>(null);

  useEffect(() => {
    fetch('/api/weather-expert')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return (
    <div className="h-full flex items-center justify-center gap-3">
      <RefreshCw size={24} className="animate-spin text-turquoise" />
      <span className="text-xs font-black uppercase tracking-widest text-turquoise/60">AROME HD…</span>
    </div>
  );

  const { weather, waves } = data;
  const w15 = weather?.minutely_15;
  const wav = waves?.hourly;

  if (!w15) return null;

  const now = new Date();
  const startIdx = w15.time.findIndex((t: string) => new Date(t) >= now);
  if (startIdx === -1) return null;

  // Prendre COLS points espacés de 2 (= toutes les 30 min)
  const points = Array.from({ length: COLS }, (_, i) => {
    const idx = startIdx + i * 2;
    if (!w15.time[idx]) return null;
    const d = new Date(w15.time[idx]);
    // Trouver l'heure correspondante dans les données horaires waves
    const hourStr = w15.time[idx].substring(0, 14) + '00';
    const wIdx = wav?.time?.indexOf(hourStr) ?? -1;
    return {
      label: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isHour: d.getMinutes() === 0,
      wind: Math.round(w15.wind_speed_10m[idx]),
      gust: w15.wind_gusts_10m?.[idx] != null ? Math.round(w15.wind_gusts_10m[idx]) : null,
      dir: w15.wind_direction_10m?.[idx] ?? null,
      waveH: wIdx !== -1 ? wav.wave_height?.[wIdx] : null,
      waveP: wIdx !== -1 ? wav.wave_period?.[wIdx] : null,
      temp: w15.temperature_2m?.[idx] != null ? Math.round(w15.temperature_2m[idx]) : null,
    };
  }).filter(Boolean) as NonNullable<ReturnType<typeof Array.from<any>>>[];

  // Styles partagés
  const cellBase = "flex items-center justify-center font-black text-lg border-r border-white/8";
  const labelBase = "flex items-center px-4 text-xs font-black uppercase tracking-[0.2em] border-b border-white/8 border-r border-turquoise/20 shrink-0";
  const LABEL_W = "w-28";
  const ROW_H = "h-12";

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <Zap size={16} className="text-turquoise" />
        <span className="text-xs font-black uppercase tracking-[0.25em] text-turquoise/70">AROME HD · Prochaines 8 heures</span>
        <span className="ml-auto text-[10px] font-bold text-white/20 uppercase tracking-widest">
          màj {new Date(data.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(0,169,206,0.12)' }}>

        {/* Time header row */}
        <div className={`flex ${ROW_H} border-b border-turquoise/20`}
          style={{ background: 'rgba(0,169,206,0.06)' }}>
          <div className={`${LABEL_W} ${labelBase} text-turquoise/50`}>Heure</div>
          {points.map((pt, i) => (
            <div key={i} className={`${cellBase} flex-1 ${pt.isHour ? 'text-white' : 'text-white/40'}`}
              style={{ fontSize: pt.isHour ? '1rem' : '0.75rem' }}>
              {pt.label}
            </div>
          ))}
        </div>

        {/* VENT */}
        <div className={`flex ${ROW_H} border-b border-white/8`}>
          <div className={`${LABEL_W} ${labelBase} text-turquoise/60`}>Vent <span className="text-white/30 ml-1 normal-case">nds</span></div>
          {points.map((pt, i) => {
            const c = getWindColor(pt.wind);
            return (
              <div key={i} className={`${cellBase} flex-1 text-xl`}
                style={{ background: c.bg, color: c.text }}>
                {pt.wind}
              </div>
            );
          })}
        </div>

        {/* RAFALES */}
        <div className={`flex ${ROW_H} border-b border-white/8`}>
          <div className={`${LABEL_W} ${labelBase} text-orange-400/70`}>Rafales <span className="text-white/30 ml-1 normal-case">nds</span></div>
          {points.map((pt, i) => {
            if (pt.gust == null) return <div key={i} className={`${cellBase} flex-1 text-white/20`}>–</div>;
            const c = getWindColor(pt.gust);
            return (
              <div key={i} className={`${cellBase} flex-1 text-xl`}
                style={{ background: `${c.bg}99`, color: c.text }}>
                {pt.gust}
              </div>
            );
          })}
        </div>

        {/* DIRECTION */}
        <div className={`flex ${ROW_H} border-b border-white/8`} style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className={`${LABEL_W} ${labelBase} text-white/30`}>Direction</div>
          {points.map((pt, i) => (
            <div key={i} className={`${cellBase} flex-1`}>
              {pt.dir != null
                ? <div style={{ transform: `rotate(${pt.dir}deg)` }}>
                    <ArrowDown size={18} className="text-turquoise" />
                  </div>
                : <span className="text-white/20">–</span>}
            </div>
          ))}
        </div>

        {/* HOULE */}
        <div className={`flex ${ROW_H} border-b border-white/8`} style={{ background: 'rgba(6,182,212,0.04)' }}>
          <div className={`${LABEL_W} ${labelBase} text-cyan-400/70`}>Houle <span className="text-white/30 ml-1 normal-case">m</span></div>
          {points.map((pt, i) => (
            <div key={i} className={`${cellBase} flex-1 text-cyan-300`}>
              {pt.waveH != null ? pt.waveH.toFixed(1) : <span className="text-white/20">–</span>}
            </div>
          ))}
        </div>

        {/* PÉRIODE */}
        <div className={`flex ${ROW_H} border-b border-white/8`}>
          <div className={`${LABEL_W} ${labelBase} text-white/30`}>Période <span className="text-white/20 ml-1 normal-case">s</span></div>
          {points.map((pt, i) => (
            <div key={i} className={`${cellBase} flex-1 text-white/50`}>
              {pt.waveP != null ? Math.round(pt.waveP) : <span className="text-white/20">–</span>}
            </div>
          ))}
        </div>

        {/* TEMP AIR */}
        <div className={`flex ${ROW_H}`}>
          <div className={`${LABEL_W} ${labelBase} text-amber-300/70 border-b-0`}>Temp air <span className="text-white/30 ml-1 normal-case">°C</span></div>
          {points.map((pt, i) => (
            <div key={i} className={`${cellBase} flex-1 text-amber-200 border-b-0`}>
              {pt.temp != null ? `${pt.temp}°` : <span className="text-white/20">–</span>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
