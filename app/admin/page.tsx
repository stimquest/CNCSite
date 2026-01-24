"use client";

import React, { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { Save, RotateCcw, Download, ArrowLeft } from 'lucide-react';
import { SpotStatus } from '../../types';

export const AdminPage: React.FC = () => {
  const { 
    weather, updateWeather, 
    activities, updateActivity,
    statusMessage, spotStatus, updateStatus,
    saveToLocal, resetToDefaults, lastUpdated 
  } = useContent();

  const [activeTab, setActiveTab] = useState<'GENERAL' | 'ACTIVITIES'>('GENERAL');

  const exportConfig = () => {
    const data = JSON.stringify({ weather, activities, statusMessage, spotStatus }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cnc-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      
      {/* Top Bar */}
      <div className="bg-abysse text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => window.location.hash = ''} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft />
             </button>
             <h1 className="text-xl font-black uppercase tracking-widest">Admin CNC</h1>
             {lastUpdated && <span className="text-xs bg-turquoise text-white px-2 py-1 rounded">Dernière modif locale : {new Date(lastUpdated).toLocaleTimeString()}</span>}
          </div>
          <div className="flex gap-3">
             <button onClick={resetToDefaults} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40 text-xs font-bold uppercase tracking-widest transition-colors">
               <RotateCcw size={16} /> Reset
             </button>
             <button onClick={exportConfig} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-colors">
               <Download size={16} /> Export JSON
             </button>
             <button onClick={saveToLocal} className="flex items-center gap-2 px-6 py-2 bg-turquoise text-white rounded hover:bg-white hover:text-abysse text-xs font-bold uppercase tracking-widest transition-colors shadow-lg">
               <Save size={16} /> Sauvegarder
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
           <button 
             onClick={() => setActiveTab('GENERAL')}
             className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'GENERAL' ? 'bg-abysse text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-white/50'}`}
           >
             Météo & Status
           </button>
           <button 
             onClick={() => setActiveTab('ACTIVITIES')}
             className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'ACTIVITIES' ? 'bg-abysse text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-white/50'}`}
           >
             Catalogue Activités ({activities.length})
           </button>
        </div>

        {activeTab === 'GENERAL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Status Widget */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-abysse mb-6 uppercase italic">État du Spot</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Statut Global</label>
                    <select 
                      value={spotStatus}
                      onChange={(e) => updateStatus(e.target.value as SpotStatus, statusMessage)}
                      className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold text-abysse focus:ring-turquoise focus:border-turquoise"
                    >
                      <option value={SpotStatus.OPEN}>OUVERT (Vert)</option>
                      <option value={SpotStatus.RESTRICTED}>RESTREINT (Orange)</option>
                      <option value={SpotStatus.CLOSED}>FERMÉ (Rouge)</option>
                    </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message d'accueil</label>
                     <textarea 
                       value={statusMessage}
                       onChange={(e) => updateStatus(spotStatus, e.target.value)}
                       className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 min-h-[100px] font-medium"
                     />
                  </div>
                </div>
             </div>

             {/* Weather Widget */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-abysse mb-6 uppercase italic">Météo Manuelle</h2>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Temp (°C)</label>
                     <input 
                       type="number" 
                       value={weather.temp}
                       onChange={(e) => updateWeather({...weather, temp: parseInt(e.target.value)})}
                       className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vent (Noeuds)</label>
                     <input 
                       type="number" 
                       value={weather.windSpeed}
                       onChange={(e) => updateWeather({...weather, windSpeed: parseInt(e.target.value)})}
                       className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Direction</label>
                     <input 
                       type="text" 
                       value={weather.windDirection}
                       onChange={(e) => updateWeather({...weather, windDirection: e.target.value})}
                       className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Coeff Marée</label>
                     <input 
                       type="number" 
                       value={weather.coefficient}
                       onChange={(e) => updateWeather({...weather, coefficient: parseInt(e.target.value)})}
                       className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                     />
                   </div>
                   <div className="col-span-2">
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description Courte</label>
                     <input 
                       type="text" 
                       value={weather.description}
                       onChange={(e) => updateWeather({...weather, description: e.target.value})}
                       className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                     />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'ACTIVITIES' && (
          <div className="grid grid-cols-1 gap-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-slate-100 shrink-0 relative group">
                    <img src={activity.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-white text-xs font-bold uppercase">Changer Image</span>
                    </div>
                 </div>
                 
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Titre</label>
                       <input 
                         type="text" 
                         value={activity.title}
                         onChange={(e) => updateActivity(activity.id, { title: e.target.value })}
                         className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-bold text-abysse"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prix</label>
                       <input 
                         type="text" 
                         value={activity.price}
                         onChange={(e) => updateActivity(activity.id, { price: e.target.value })}
                         className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-bold text-abysse"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Durée</label>
                       <input 
                         type="text" 
                         value={activity.duration}
                         onChange={(e) => updateActivity(activity.id, { duration: e.target.value })}
                         className="w-full p-2 rounded border border-slate-200 bg-slate-50 font-bold text-abysse"
                       />
                    </div>
                    <div className="md:col-span-4">
                       <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                       <input 
                         type="text" 
                         value={activity.description}
                         onChange={(e) => updateActivity(activity.id, { description: e.target.value })}
                         className="w-full p-2 rounded border border-slate-200 bg-slate-50 text-sm"
                       />
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;