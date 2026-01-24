"use client";

import React from 'react';
import { useContent } from '../../../contexts/ContentContext';
import { TideChart } from '../../../components/TideChart';
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
           <h1 className="text-5xl md:text-7xl font-black text-abysse tracking-tighter leading-none mb-4">
             LE SPOT <br/><span className="text-turquoise">LIVE</span>
           </h1>
           <p className="text-slate-500 text-lg">Sécurité, Météo et Webcam en temps réel.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surveillance</span>
              <span className="text-abysse font-bold">11h00 - 19h00</span>
           </div>
           <div className="w-px h-8 bg-slate-100 mx-2"></div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drapeau</span>
              <div className="flex items-center gap-2">
                 <span className={`w-3 h-3 rounded-full ${getStatusBg()}`}></span>
                 <span className={`${getStatusColor()} font-bold uppercase text-sm`}>{getStatusLabel()}</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Weather (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Webcam */}
            <div className="rounded-[2rem] overflow-hidden bg-abysse relative aspect-video shadow-2xl">
               <img src="https://picsum.photos/1200/800" alt="Webcam" className="w-full h-full object-cover opacity-90" />
               <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md animate-pulse">Live</span>
               </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <span className="material-symbols-outlined text-slate-400 mb-4 text-2xl">air</span>
                    <span className="block text-3xl font-black text-abysse tracking-tighter mb-1">{weather.windSpeed}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Noeuds {weather.windDirection}</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <span className="material-symbols-outlined text-turquoise mb-4 text-2xl">water_drop</span>
                    <span className="block text-3xl font-black text-abysse tracking-tighter mb-1">14°</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temp. Eau</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Marée (Coeff {weather.coefficient})</span>
                    <div className="h-16 w-full">
                        <TideChart />
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Security (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-abysse text-white p-10 rounded-[2rem] relative overflow-hidden">
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
