"use client";

import React from 'react';
import { useContent } from '../../../contexts/ContentContext';
import { SpotTideChart } from '../../../components/SpotTideChart';
import { AgonNavigationCard } from '../../../components/AgonNavigationCard';
import { SpotStatus } from '../../../types';

export const SpotPage: React.FC = () => {
  const { weather, spotStatus } = useContent();

  const getStatusColor = () => {
    switch (spotStatus) {
      case SpotStatus.OPEN: return 'text-green-600';
      case SpotStatus.RESTRICTED: return 'text-orange-500';
      case SpotStatus.CLOSED: return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  const getStatusBg = () => {
     switch (spotStatus) {
      case SpotStatus.OPEN: return 'bg-green-500';
      case SpotStatus.RESTRICTED: return 'bg-orange-500';
      case SpotStatus.CLOSED: return 'bg-red-600';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = () => {
     switch (spotStatus) {
      case SpotStatus.OPEN: return 'Vert';
      case SpotStatus.RESTRICTED: return 'Orange';
      case SpotStatus.CLOSED: return 'Rouge';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-200 pb-12">
        <div>
           <h1 className="text-5xl md:text-7xl font-black text-abysse tracking-tighter leading-none mb-4 uppercase italic">
             LE SPOT <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-abysse to-turquoise">EN DIRECT</span>
           </h1>
           <p className="text-slate-500 text-lg font-medium">Conditions météo et marées à Coutainville.</p>
        </div>
        <div className="flex items-center gap-6 px-8 py-6 bg-white rounded-3xl border border-slate-100 shadow-xl">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Surveillance</span>
              <span className="text-abysse font-black text-xl italic uppercase">11h - 19h</span>
           </div>
           <div className="w-px h-12 bg-slate-100"></div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status Bassin</span>
              <div className="flex items-center gap-3">
                 <span className={`w-4 h-4 rounded-full ${getStatusBg()} animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.2)]`}></span>
                 <span className={`${getStatusColor()} font-black uppercase text-lg italic tracking-tighter`}>{getStatusLabel()}</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Weather & Tides (8 cols) */}
        <div className="lg:col-span-8 space-y-16">
            
            {/* Webcam Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="size-2 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Webcam Live</span>
                </div>
                <div className="rounded-[3rem] overflow-hidden bg-abysse relative aspect-video shadow-2xl group border border-slate-200">
                    <img src="https://picsum.photos/1200/800?grayscale" alt="Webcam" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-8 left-8">
                        <span className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">En Direct</span>
                    </div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-2xl font-black italic tracking-tighter mb-1 uppercase">Plage Nord</p>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-none">Vue sur l'archipel des Écréhou</p>
                    </div>
                </div>
            </div>

            {/* Tide Section - PREMIUIM */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-2 rounded-full bg-turquoise animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mouvements des Eaux</span>
                        </div>
                        <h2 className="text-4xl font-black text-abysse uppercase italic tracking-tighter">Cycle de <span className="text-turquoise">Marée</span></h2>
                    </div>
                </div>

                <SpotTideChart />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-turquoise/10 group-hover:text-turquoise transition-colors">
                        <span className="material-symbols-outlined text-3xl">air</span>
                    </div>
                    <span className="block text-5xl font-black text-abysse tracking-tighter mb-2 italic">{weather.windSpeed}<span className="text-xl text-slate-400 ml-1 tracking-normal not-italic uppercase">nds</span></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitesse du Vent ({weather.windDirection})</span>
                </div>
                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-turquoise/10 group-hover:text-turquoise transition-colors">
                        <span className="material-symbols-outlined text-3xl">thermostat</span>
                    </div>
                    <span className="block text-5xl font-black text-abysse tracking-tighter mb-2 italic">14°<span className="text-xl text-slate-400 ml-1 tracking-normal not-italic uppercase">c</span></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Température de l'Eau</span>
                </div>
                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group lg:col-span-1 col-span-2">
                    <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-turquoise/10 group-hover:text-turquoise transition-colors">
                        <span className="material-symbols-outlined text-3xl">device_thermostat</span>
                    </div>
                    <span className="block text-5xl font-black text-abysse tracking-tighter mb-2 italic">{weather.temp}°<span className="text-xl text-slate-400 ml-1 tracking-normal not-italic uppercase">c</span></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Température de l'Air</span>
                </div>
            </div>
        </div>

        {/* Right: Security & Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
            <AgonNavigationCard />
            
            <div className="bg-abysse text-white p-10 rounded-[2rem] relative overflow-hidden shadow-2xl">
                <span className="material-symbols-outlined absolute -right-6 -top-6 text-white/5 text-[150px]">verified_user</span>
                <h3 className="text-2xl font-bold mb-8 relative z-10">Règles d'Or</h3>
                <ul className="space-y-6 relative z-10">
                    <li className="flex gap-4">
                        <span className="text-turquoise font-bold">01.</span>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">Gilet de sauvetage obligatoire pour toute activité nautique.</p>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-turquoise font-bold">02.</span>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">Respectez le chenal traversier. Baignade interdite dans la zone voile.</p>
                    </li>
                    <li className="flex gap-4">
                        <span className="text-turquoise font-bold">03.</span>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">Navigation interdite dans la zone de baignade surveillée.</p>
                    </li>
                </ul>
                <div className="mt-10 pt-8 border-t border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Urgence Secours</p>
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-red-500 text-3xl">phone_in_talk</span>
                        <span className="text-3xl font-black">196</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SpotPage;
