import React from 'react';
import { Play, Wind, Navigation, Thermometer, Video, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { MOCK_WEATHER, STATUS_MESSAGE } from '../constants';
import { TideChart } from '../components/TideChart';

export const Home: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-[60vh] min-h-[400px] border border-white/10 group">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          alt="Mer"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center mb-6 cursor-pointer hover:bg-white/20 transition-all hover:scale-110">
            <Play fill="white" className="ml-1" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-2">
            Prendre le large<br/>à Coutainville
          </h1>
          <p className="text-nautical-300 tracking-widest text-sm md:text-base uppercase">
            Club Nautique &bull; École de Voile &bull; Point Plage
          </p>
          <div className="mt-8 flex gap-4">
            <button onClick={() => window.location.hash = '#activities'} className="px-6 py-3 bg-nautical-500 text-nautical-900 font-bold rounded-lg hover:bg-white transition-colors">
              Réserver
            </button>
            <button onClick={() => window.location.hash = '#spot'} className="px-6 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
              Le Spot
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tile 1: Weather (Large) */}
        <div className="md:col-span-2 bg-nautical-800/50 backdrop-blur border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-bold text-nautical-300 uppercase tracking-wider mb-1">Météo en direct</h2>
              <p className="text-3xl font-display font-bold text-white">{MOCK_WEATHER.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end text-white">
                <Wind size={20} />
                <span className="text-2xl font-bold">{MOCK_WEATHER.windSpeed} <span className="text-sm font-normal text-gray-400">nds</span> {MOCK_WEATHER.windDirection}</span>
              </div>
              <div className="flex items-center gap-2 justify-end text-gray-400 mt-1">
                <Thermometer size={16} />
                <span>{MOCK_WEATHER.temp}°C</span>
              </div>
            </div>
          </div>
          <div className="h-48 w-full mt-4">
            <TideChart />
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>BM: {MOCK_WEATHER.tideLow}</span>
              <span>Coef: {MOCK_WEATHER.coefficient}</span>
              <span>PM: {MOCK_WEATHER.tideHigh}</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Social / Actu (New) */}
        <div className="bg-white text-nautical-900 rounded-2xl p-6 relative overflow-hidden group">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-sm font-bold text-nautical-500 uppercase tracking-wider">Actualités</h2>
             <div className="flex gap-2">
               <Instagram size={18} className="cursor-pointer hover:text-nautical-500" />
               <Facebook size={18} className="cursor-pointer hover:text-nautical-500" />
             </div>
           </div>
           
           <div className="space-y-4">
             <div className="border-l-2 border-nautical-500 pl-3">
               <span className="text-xs text-gray-500 font-mono">Il y a 2h</span>
               <p className="font-bold text-sm leading-tight mt-1">Victoire de l'équipe CNC au Grand Prix de la Manche ! 🏆 Bravo à tous.</p>
             </div>
             <div className="border-l-2 border-gray-200 pl-3">
               <span className="text-xs text-gray-500 font-mono">Hier</span>
               <p className="font-medium text-sm leading-tight mt-1 text-gray-600">Ouverture des inscriptions pour les stages de Pâques. Places limitées.</p>
             </div>
           </div>
           
           <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
             <button className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:text-nautical-500 transition-colors">
               Voir le blog <ArrowRight size={12} />
             </button>
           </div>
        </div>

        {/* Tile 3: Webcam */}
        <div className="bg-black border border-white/5 rounded-2xl overflow-hidden relative group" onClick={() => window.location.hash = '#spot'}>
           <img src="https://picsum.photos/600/400?grayscale" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity cursor-pointer" alt="Webcam" />
           <div className="absolute top-4 left-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-xs font-bold text-white tracking-wider">LIVE CAM</span>
           </div>
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Video className="text-white" size={32} />
           </div>
        </div>

        {/* Tile 4: Status / Fast Access */}
        <div className="md:col-span-2 bg-nautical-900 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-nautical-500 uppercase tracking-wider mb-1">Le spot maintenant</h2>
            <p className="text-xl font-medium text-white">{STATUS_MESSAGE}</p>
          </div>
          <button onClick={() => window.location.hash = '#activities'} className="px-6 py-3 bg-white text-nautical-900 rounded-lg font-bold text-sm hover:bg-nautical-300 transition-colors shadow-lg">
            Réserver un créneau
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;