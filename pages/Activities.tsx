import React, { useState } from 'react';
import { ACTIVITIES, MOCK_WEATHER } from '../constants';
import { ActivityCategory } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { Wind, Waves, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Activities: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'ALL'>('ALL');
  const [tideFilter, setTideFilter] = useState(false);

  // Mock logic: If tide is Low, Sand Yachting is open.
  const isLowTide = true; 

  const filteredActivities = ACTIVITIES.filter(a => {
    const matchesCategory = activeFilter === 'ALL' || a.category === activeFilter;
    const matchesTide = tideFilter ? (a.isTideDependent ? isLowTide : true) : true;
    return matchesCategory && matchesTide;
  });

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      
      {/* Header & Conditions Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            Catalogue<br /><span className="text-nautical-500">Activités</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Initiez-vous au char à voile, domptez le vent en catamaran ou explorez la côte en kayak. Réservation en ligne via Axyomes.
          </p>
        </div>

        {/* Quick Conditions Card */}
        <div className="bg-nautical-800/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-nautical-300 uppercase tracking-wider mb-4">Conditions du jour</h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Wind size={18} />
                  <span>Vent</span>
                </div>
                <span className="font-bold text-white">{MOCK_WEATHER.windSpeed} nds {MOCK_WEATHER.windDirection}</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Waves size={18} />
                  <span>Marée</span>
                </div>
                <span className="font-bold text-emerald-400">Basse (Idéal Char)</span>
             </div>
             <div className="pt-3 border-t border-white/5 mt-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 size={16} />
                  <span>Toutes activités ouvertes</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="sticky top-20 z-30 bg-nautical-900/95 backdrop-blur-xl py-4 -mx-4 px-4 border-y border-white/5 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-2 md:pb-0">
            <button 
              onClick={() => setActiveFilter('ALL')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === 'ALL' ? 'bg-white text-nautical-900 shadow-lg shadow-white/10' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Tout voir
            </button>
            {Object.values(ActivityCategory).map(category => (
              <button 
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === category ? 'bg-white text-nautical-900 shadow-lg shadow-white/10' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <input 
                type="checkbox" 
                checked={tideFilter}
                onChange={(e) => setTideFilter(e.target.checked)}
                className="hidden"
              />
              <span className={`text-sm font-medium transition-colors ${tideFilter ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>Compatible maintenant</span>
              <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${tideFilter ? 'bg-nautical-500' : 'bg-white/10 group-hover:bg-white/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${tideFilter ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5 duration-500">
        {filteredActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
          <AlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Aucune activité disponible</h3>
          <p className="text-gray-400 mb-6">Essayez de modifier vos filtres.</p>
          <button 
             onClick={() => {setActiveFilter('ALL'); setTideFilter(false);}}
             className="px-6 py-2 bg-nautical-500 text-nautical-900 rounded-lg text-sm font-bold hover:bg-white transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
};

export default Activities;