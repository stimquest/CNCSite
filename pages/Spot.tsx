import React from 'react';
import { TideChart } from '../components/TideChart';
import { MOCK_WEATHER } from '../constants';
import { AlertTriangle, Phone, Flag, LifeBuoy, ShieldCheck } from 'lucide-react';

export const Spot: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <h1 className="text-4xl font-display font-bold text-white">Le Spot <span className="text-nautical-500">& Sécurité</span></h1>
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 border px-3 py-1 rounded-full border-white/10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Surveillance Active (11h-19h)
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Weather Technicals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Metrics */}
          <div className="bg-nautical-800 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-nautical-500 rounded-sm"></span>
              Données Temps Réel
            </h2>
            <div className="h-64 mb-6">
              <TideChart />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
               <div className="bg-nautical-900/50 p-4 rounded-lg border border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vent Moyen</p>
                 <p className="text-2xl font-bold font-display text-white">{MOCK_WEATHER.windSpeed} <span className="text-sm font-sans font-normal text-gray-400">nds</span></p>
               </div>
               <div className="bg-nautical-900/50 p-4 rounded-lg border border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Rafales</p>
                 <p className="text-2xl font-bold font-display text-white">{MOCK_WEATHER.windSpeed + 5} <span className="text-sm font-sans font-normal text-gray-400">nds</span></p>
               </div>
               <div className="bg-nautical-900/50 p-4 rounded-lg border border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Direction</p>
                 <p className="text-2xl font-bold font-display text-white">{MOCK_WEATHER.windDirection}</p>
               </div>
               <div className="bg-nautical-900/50 p-4 rounded-lg border border-white/5">
                 <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Coefficient</p>
                 <p className="text-2xl font-bold font-display text-nautical-300">{MOCK_WEATHER.coefficient}</p>
               </div>
            </div>
          </div>

          {/* Webcam Widget */}
          <div className="bg-nautical-800 border border-white/10 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">Webcam Live HD</h2>
                <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Direct</span>
             </div>
             <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
               <img src="https://picsum.photos/1200/800" alt="Webcam feed" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Col: Safety & Zones */}
        <div className="space-y-6">
           
           {/* Flag Status */}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-16 h-12 bg-green-500 rounded shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center">
                    <Flag className="text-nautical-900" size={24} fill="currentColor" />
                 </div>
                 <span className="text-xs font-bold text-green-500 uppercase">Verte</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Baignade Surveillée</h3>
                <p className="text-sm text-gray-400">Conditions idéales. Zone surveillée active face au poste de secours.</p>
              </div>
           </div>

           {/* Safety Rules */}
           <div className="bg-nautical-800 border border-white/10 rounded-2xl p-6">
             <div className="flex items-start gap-3 mb-6 pb-6 border-b border-white/5">
               <AlertTriangle className="text-nautical-300 shrink-0" />
               <div>
                 <h3 className="text-lg font-bold text-white">Règles d'Or</h3>
                 <p className="text-xs text-gray-500">Applicables à tous les usagers</p>
               </div>
             </div>
             
             <ul className="space-y-4">
               <li className="flex gap-4">
                 <LifeBuoy size={20} className="text-gray-500 shrink-0" />
                 <div>
                   <span className="block text-white font-medium text-sm">Gilet obligatoire</span>
                   <span className="text-xs text-gray-500">Pour toute sortie nautique (Voile, Kayak, Paddle).</span>
                 </div>
               </li>
               <li className="flex gap-4">
                 <ShieldCheck size={20} className="text-gray-500 shrink-0" />
                 <div>
                   <span className="block text-white font-medium text-sm">Chenal traversier</span>
                   <span className="text-xs text-gray-500">Interdit à la baignade. Réservé aux entrées/sorties de bateaux.</span>
                 </div>
               </li>
             </ul>

             <div className="mt-6 pt-6 border-t border-white/5">
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
                 <div>
                   <p className="text-xs text-red-400 font-bold uppercase mb-1">Urgence en mer</p>
                   <p className="text-sm text-white">CROSS Jobourg</p>
                 </div>
                 <div className="flex items-center gap-2 text-white font-display font-bold text-2xl">
                   <Phone size={20} />
                   196
                 </div>
               </div>
             </div>
           </div>

           {/* Visual Map Placeholder (Abstract) */}
           <div className="bg-nautical-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Plan du plan d'eau</h3>
              <div className="aspect-square w-full bg-[#0f1729] rounded-lg relative border border-white/5 p-4">
                {/* Simplified Map Visualization */}
                <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-[#1e293b] border-l border-white/5 flex items-center justify-center text-[10px] text-gray-600 writing-vertical">PLAGE</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-nautical-500/30 rounded-full flex items-center justify-center text-center p-2">
                  <span className="text-[10px] text-nautical-500 font-bold">ZONE<br/>EVOLUTION<br/>VOILE</span>
                </div>
                <div className="absolute bottom-4 right-1/4 w-full h-8 bg-green-500/10 border-y border-green-500/30 flex items-center justify-center">
                   <span className="text-[9px] text-green-500 font-bold tracking-widest">BAIGNADE SURVEILLÉE</span>
                </div>
                <div className="absolute top-4 right-1/4 w-full h-8 bg-yellow-500/10 border-y border-yellow-500/30 flex items-center justify-center">
                   <span className="text-[9px] text-yellow-500 font-bold tracking-widest">CHENAL</span>
                </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Spot;