"use client";

import React, { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { 
  Save, 
  Trash2,
  Plus, 
  CalendarDays,
  Waves, 
  Anchor, 
  Wind, 
  Sun,
  Ship
} from 'lucide-react';
import { SpotStatus, WeeklyPlanning, PlanningCharAVoile, ActivityType, CharWeek, CharDay } from '@/types';
import { client } from '@/lib/sanity';

// --- CONSTANTS ---
const ACTIVITY_OPTIONS: {label: string, value: ActivityType}[] = [
  { label: 'Piscine / Cerf-volant', value: 'piscine' },
  { label: 'Optimist', value: 'optimist' },
  { label: 'Catamaran', value: 'catamaran' },
  { label: 'Paddle / Kayak', value: 'paddle' },
  { label: 'Char à voile', value: 'char' },
];

const DAYS_STAGES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const DAYS_CHAR = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// --- UTILS ---
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return formatDate(d);
};
// Helper to get formatted date for local display
const toFRDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

export const AdminPage: React.FC = () => {
  const { 
    spotStatus, statusMessage, updateStatus,
    plannings, charPlannings, refreshData 
  } = useContent();

  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'STATUS' | 'STAGES' | 'CHAR'>('STATUS');
  const [isSaving, setIsSaving] = useState(false);
  
  // SELECTORS
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date())); // Selected Monday
  const [selectedStage, setSelectedStage] = useState<WeeklyPlanning | null>(null);
  const [selectedCharPeriod, setSelectedCharPeriod] = useState<PlanningCharAVoile | null>(null);

  // AUTH
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CNC2026') {
      setIsAuthorized(true);
      if (typeof window !== 'undefined') localStorage.setItem('CNC_ADMIN_SESSION', 'true');
    } else { alert("Mot de passe incorrect"); }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('CNC_ADMIN_SESSION') === 'true') {
        setIsAuthorized(true);
    }
  }, []);

  // --- HANDLERS: SPOT STATUS ---
  const handleUpdateSpot = async (status: SpotStatus, message: string) => {
    setIsSaving(true);
    try {
        await client.patch('singleton-spot-settings').set({ spotStatus: status, statusMessage: message }).commit();
        updateStatus(status, message);
        alert("Statut mis à jour !");
    } catch (err) { alert("Erreur Sanity"); } finally { setIsSaving(false); }
  };

  // --- HANDLERS: STAGES ---
  
  // Called when user picks a date in the specialized picker
  const handleStageDateSelect = (dateVal: string) => {
      // Force date to Monday if not already
      const d = new Date(dateVal);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(d.setDate(diff));
      const mondayStr = formatDate(monday);
      
      setSelectedDate(mondayStr);

      // Check if planning exists for this start date
      const existing = plannings.find(p => p.startDate === mondayStr);
      if (existing) {
          setSelectedStage({...existing}); // Clone to edit
      } else {
          // Initialize New Week (Mon-Fri default)
          initNewStage(mondayStr);
      }
  };

  const initNewStage = (startDate: string) => {
      const days = DAYS_STAGES.map((name, i) => ({
        _key: `day-${i}-${Date.now()}`,
        name,
        date: addDays(startDate, i),
        isRaidDay: false,
        raidTarget: 'none' as const,
        miniMousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
        mousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
        initiation: '14h - 17h',
        perfectionnement: '14h - 17h'
      }));

      setSelectedStage({
          _type: 'weeklyPlanning',
          title: `Semaine du ${toFRDate(startDate)}`,
          startDate: startDate,
          endDate: addDays(startDate, 6), // Week covers 7 days technically
          days: days, // Only 5 initially
          isPublished: true
      });
  };

  const toggleDay = (dayIndex: number) => { // 5 = Sat, 6 = Sun
      if (!selectedStage) return;
      const currentDays = [...selectedStage.days];
      const targetDate = addDays(selectedStage.startDate, dayIndex);
      
      // Check if day exists using date
      const existsIdx = currentDays.findIndex(d => d.date === targetDate);

      if (existsIdx >= 0) {
          // Remove it
          currentDays.splice(existsIdx, 1);
          // Sort by date just in case
          currentDays.sort((a,b) => a.date.localeCompare(b.date));
          setSelectedStage({...selectedStage, days: currentDays});
      } else {
          // Add it
          const name = dayIndex === 5 ? "Samedi" : "Dimanche";
          const newDay = {
            _key: `day-ext-${dayIndex}-${Date.now()}`,
            name,
            date: targetDate,
            isRaidDay: false,
            raidTarget: 'none' as const,
            miniMousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
            mousses: { time: '10h - 12h', activity: 'optimist' as ActivityType, description: '' },
            initiation: '14h - 17h',
            perfectionnement: '14h - 17h'
          };
          
          currentDays.push(newDay);
          currentDays.sort((a,b) => a.date.localeCompare(b.date));
          setSelectedStage({...selectedStage, days: currentDays});
      }
  };



  const saveStage = async () => {
    if (!selectedStage) return;
    setIsSaving(true);
    try {
        const doc = { ...selectedStage, _type: 'weeklyPlanning' };
        if (selectedStage._id) await client.createOrReplace({ ...doc, _id: selectedStage._id! });
        else await client.create(doc);
        
        await refreshData();
        alert("Planning enregistré !");
    } catch (err) { console.error(err); alert("Erreur sauvegarde"); } 
    finally { setIsSaving(false); }
  };

  const deleteStage = async () => {
    if (!selectedStage?._id || !confirm("Supprimer ce planning ?")) return;
    setIsSaving(true);
    try {
        await client.delete(selectedStage._id);
        setSelectedStage(null);
        await refreshData();
    } catch(err) { console.error(err); } finally { setIsSaving(false); }
  };


  // --- HANDLERS: CHAR A VOILE ---
  const createNewCharPeriod = () => {
    const today = formatDate(new Date());
    const newPeriod: PlanningCharAVoile = {
        _type: 'planningCharAVoile',
        title: "Nouvelle Période",
        startDate: today,
        endDate: addDays(today, 14),
        weeks: []
    };
    setSelectedCharPeriod(newPeriod);
  };

  const addCharWeek = () => {
    if (!selectedCharPeriod) return;
    
    // Auto-determine start date based on last week or period start
    let start = selectedCharPeriod.startDate;
    if (selectedCharPeriod.weeks.length > 0) {
        const lastWeek = selectedCharPeriod.weeks[selectedCharPeriod.weeks.length - 1];
        start = addDays(lastWeek.startDate, 7);
    }

    const newWeek: CharWeek = {
        _key: `week-${Date.now()}`,
        title: "Nouvelle Semaine",
        startDate: start,
        endDate: addDays(start, 6),
        days: DAYS_CHAR.map((name, i) => ({
            _key: `cday-${i}-${Date.now()}`,
            name,
            date: addDays(start, i),
            sessions: []
        }))
    };
    setSelectedCharPeriod({
        ...selectedCharPeriod,
        weeks: [...selectedCharPeriod.weeks, newWeek]
    });
  };

  const saveCharPeriod = async () => {
    if (!selectedCharPeriod) return;
    setIsSaving(true);
    try {
        const doc = { ...selectedCharPeriod, _type: 'planningCharAVoile' };
        if (selectedCharPeriod._id) {
             await client.createOrReplace({ ...doc, _id: selectedCharPeriod._id! });
        }
        else await client.create(doc);
        await refreshData();
        alert("Planning Char enregistré !");
    } catch (err) { console.error(err); alert("Erreur sauvegarde"); } 
    finally { setIsSaving(false); }
  };

  const deleteCharPeriod = async () => {
      if (!selectedCharPeriod?._id) return;
      if (!confirm("Supprimer cette période ?")) return;
      try {
          await client.delete(selectedCharPeriod._id);
          setSelectedCharPeriod(null);
          await refreshData();
      } catch(err) { console.error(err); }
  }


  // --- RENDER LOGIN ---
  if (!isAuthorized) {
    return (
        <div className="min-h-screen bg-abysse flex items-center justify-center p-6 italic">
            <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl">
                <h1 className="text-2xl font-black text-abysse uppercase text-center mb-8">Admin CVC</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-center" placeholder="CODE" />
                    <button className="w-full py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all">Accéder</button>
                </form>
            </div>
        </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 h-20 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-abysse">CNC <span className="text-turquoise">CONTROL</span></h2>
                    <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setActiveTab('STATUS')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STATUS' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Spot</button>
                        <button onClick={() => setActiveTab('STAGES')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STAGES' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Stages</button>
                        <button onClick={() => setActiveTab('CHAR')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CHAR' ? 'bg-white text-abysse shadow-sm' : 'text-slate-400'}`}>Char à Voile</button>
                    </nav>
                </div>
                {isSaving && <span className="text-[10px] font-black text-turquoise animate-pulse uppercase">Sauvegarde...</span>}
            </div>
        </header>

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-10">
            
            {/* TAB: STATUS */}
            {activeTab === 'STATUS' && (
                <div className="bg-white p-10 rounded-4xl shadow-sm border border-slate-200 max-w-2xl">
                    <h3 className="text-xl font-black uppercase italic text-abysse mb-8">Statut du Plan d'eau</h3>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[{id:'OPEN',c:'bg-green-500',l:'OUVERT'}, {id:'RESTRICTED',c:'bg-orange-500',l:'RESTREINT'}, {id:'CLOSED',c:'bg-red-500',l:'FERMÉ'}].map(s=>(
                            <button key={s.id} onClick={()=>handleUpdateSpot(s.id as any, statusMessage || '')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${spotStatus === s.id ? 'border-abysse bg-slate-50 shadow-inner' : 'border-slate-100 grayscale'}`}>
                                <div className={`size-3 rounded-full ${s.c}`}></div>
                                <span className="font-black text-[10px] tracking-widest">{s.l}</span>
                            </button>
                        ))}
                    </div>
                    <textarea value={statusMessage || ''} onChange={(e)=>updateStatus(spotStatus, e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[120px] font-medium text-abysse mb-6" placeholder="Infos météo..." />
                    <button onClick={()=>handleUpdateSpot(spotStatus, statusMessage || '')} className="w-full py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-lg flex items-center justify-center gap-2"><Save size={18}/> Mettre à jour</button>
                </div>
            )}

            {/* TAB: STAGES */}
            {activeTab === 'STAGES' && (
                <div className="flex flex-col xl:flex-row gap-8">
                    
                    {/* SIDEBAR: LISTING */}
                    <div className="xl:w-80 shrink-0 flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                             <h3 className="text-lg font-black uppercase text-abysse mb-4">Plannings</h3>
                             <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {(plannings || []).map(p => (
                                    <button 
                                        key={p._id} 
                                        onClick={() => {
                                            setSelectedDate(p.startDate);
                                            setSelectedStage({...p});
                                        }}
                                        className={`w-full text-left p-3 rounded-xl transition-all border border-transparent ${selectedStage?._id === p._id ? 'bg-turquoise/10 border-turquoise text-turquoise' : 'hover:bg-slate-50 hover:border-slate-200 text-slate-500'}`}
                                    >
                                        <span className="block font-black text-xs uppercase">{p.title}</span>
                                        <span className="block text-[10px] opacity-70">Du {new Date(p.startDate).toLocaleDateString()}</span>
                                    </button>
                                ))}
                                {plannings.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">Aucun planning</p>}
                             </div>
                        </div>
                        
                        <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                             <h4 className="font-black text-orange-800 text-sm uppercase mb-2">Nouveau Planning</h4>
                             <p className="text-[10px] text-orange-600/80 mb-4">Sélectionnez un Lundi pour commencer une nouvelle semaine.</p>
                             <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => handleStageDateSelect(e.target.value)} 
                                className="w-full p-3 bg-white border border-orange-200 rounded-xl font-bold text-orange-900 text-sm outline-none focus:ring-2 ring-orange-200"
                            />
                        </div>
                    </div>

                    {/* MAIN EDITOR */}
                    <div className="flex-1">
                        {!selectedStage ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem]">
                                <CalendarDays size={48} className="mb-4 opacity-50"/>
                                <p className="font-bold uppercase tracking-widest text-sm">Sélectionnez ou créez un planning</p>
                            </div>
                        ) : (
                        <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-slate-100 pb-10">
                                <div className="flex-1 space-y-4">
                                    <input type="text" value={selectedStage.title || ''} onChange={(e)=>setSelectedStage({...selectedStage, title: e.target.value})} className="w-full p-2 bg-transparent text-3xl font-black uppercase italic text-abysse outline-none focus:text-turquoise border-b border-transparent focus:border-slate-200" placeholder="Semaine du..." />
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-500">
                                            Du {new Date(selectedStage.startDate).toLocaleDateString()} au {new Date(selectedStage.endDate).toLocaleDateString()}
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                            <input type="checkbox" checked={selectedStage.isPublished || false} onChange={(e)=>setSelectedStage({...selectedStage, isPublished: e.target.checked})} className="size-4 accent-turquoise" />
                                            <span className="text-[10px] font-black uppercase text-slate-500">Publié en ligne</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {selectedStage._id && <button onClick={deleteStage} className="p-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>}
                                    <button onClick={saveStage} disabled={isSaving} className="px-8 py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-xl flex items-center gap-2"><Save size={20} /> Enregistrer</button>
                                </div>
                            </div>

                            {/* DAYS GRID */}
                            <div className="space-y-12">
                                {selectedStage.days?.map((day, dIdx) => (
                                    <div key={dIdx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-baseline gap-3">
                                                <h4 className="text-xl font-black uppercase italic text-abysse">{day.name}</h4>
                                                <span className="text-xs font-bold text-slate-400">{new Date(day.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase text-slate-400">Raid :</span>
                                                <select 
                                                    value={day.raidTarget || 'none'} 
                                                    onChange={(e)=>{
                                                        const nd = [...selectedStage.days];
                                                        nd[dIdx].raidTarget = e.target.value as any;
                                                        // Auto-sync legacy boolean
                                                        nd[dIdx].isRaidDay = e.target.value !== 'none';
                                                        setSelectedStage({...selectedStage, days: nd});
                                                    }} 
                                                    className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold shadow-sm outline-none focus:border-orange-500"
                                                >
                                                    <option value="none">Non</option>
                                                    <option value="miniMousses">Mini-Mousses</option>
                                                    <option value="mousses">Moussaillons</option>
                                                    <option value="initiation">Initiation</option>
                                                    <option value="perfectionnement">Perfectionnement</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* KIDS SESSIONS */}
                                            {['miniMousses', 'mousses'].map((kidGroup) => {
                                                const session = (day as any)[kidGroup];
                                                const isRaid = day.raidTarget === kidGroup;
                                                return (
                                                    <div key={kidGroup} className={`p-5 rounded-2xl border shadow-sm transition-all ${isRaid ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Sun size={14} className={kidGroup === 'miniMousses' ? 'text-yellow-500' : 'text-turquoise'}/>
                                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isRaid ? 'text-orange-600' : ''}`}>{kidGroup} {isRaid && '(RAID)'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2">
                                                                <input type="text" value={session?.time || ''} onChange={(e)=>{
                                                                    const nd=[...selectedStage.days]; (nd[dIdx] as any)[kidGroup].time=e.target.value; setSelectedStage({...selectedStage, days:nd});
                                                                }} className="w-1/3 p-2 bg-white/50 rounded text-xs font-bold text-center" placeholder="00h-00h" />
                                                                <select value={session?.activity || 'optimist'} onChange={(e)=>{
                                                                    const nd=[...selectedStage.days]; (nd[dIdx] as any)[kidGroup].activity=e.target.value; setSelectedStage({...selectedStage, days:nd});
                                                                }} className="flex-1 p-2 bg-white/50 rounded text-xs font-bold">
                                                                    {ACTIVITY_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                                                                </select>
                                                            </div>
                                                            <input type="text" value={session?.description || ''} onChange={(e)=>{
                                                                const nd=[...selectedStage.days]; (nd[dIdx] as any)[kidGroup].description=e.target.value; setSelectedStage({...selectedStage, days:nd});
                                                            }} className="w-full p-2 bg-white/50 rounded text-xs" placeholder="Description courte..." />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* ADULT SESSIONS */}
                                            <div className={`p-5 rounded-2xl border shadow-sm ${day.raidTarget === 'initiation' ? 'bg-orange-50 border-orange-200' : 'bg-white border-blue-100'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Wind size={14} className="text-blue-500"/>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${day.raidTarget === 'initiation' ? 'text-orange-600' : 'text-blue-600'}`}>Initiation {day.raidTarget === 'initiation' && '(RAID)'}</span>
                                                </div>
                                                <input type="text" value={day.initiation || ''} onChange={(e)=>{
                                                    const nd=[...selectedStage.days]; nd[dIdx].initiation=e.target.value; setSelectedStage({...selectedStage, days:nd});
                                                }} className="w-full p-2 bg-white/50 rounded text-xs font-bold" placeholder="14h00 - 17h00" />
                                            </div>
                                            <div className={`p-5 rounded-2xl border shadow-sm ${day.raidTarget === 'perfectionnement' ? 'bg-orange-50 border-orange-200' : 'bg-white border-purple-100'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Waves size={14} className="text-purple-500"/>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${day.raidTarget === 'perfectionnement' ? 'text-orange-600' : 'text-purple-600'}`}>Perfectionnement {day.raidTarget === 'perfectionnement' && '(RAID)'}</span>
                                                </div>
                                                <input type="text" value={day.perfectionnement || ''} onChange={(e)=>{
                                                    const nd=[...selectedStage.days]; nd[dIdx].perfectionnement=e.target.value; setSelectedStage({...selectedStage, days:nd});
                                                }} className="w-full p-2 bg-white/50 rounded text-xs font-bold" placeholder="14h00 - 17h00"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* WEEKEND TOGGLES */}
                                <div className="flex gap-4 justify-center pt-8 border-t border-slate-200 border-dashed">
                                    {[5, 6].map(offset => {
                                        const targetDate = addDays(selectedStage.startDate, offset);
                                        const isPresent = selectedStage.days.some(d => d.date === targetDate);
                                        const dayName = offset === 5 ? "Samedi" : "Dimanche";
                                        
                                        return (
                                            <button 
                                                key={offset}
                                                onClick={() => toggleDay(offset)}
                                                className={`px-6 py-3 rounded-xl border-2 font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${isPresent ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'bg-white border-slate-200 text-slate-400 hover:border-turquoise hover:text-turquoise'}`}
                                            >
                                                {isPresent ? <Trash2 size={14}/> : <Plus size={14}/>}
                                                {isPresent ? `Retirer ${dayName}` : `Ajouter ${dayName}`}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: CHAR A VOILE */}
            {activeTab === 'CHAR' && (
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-[320px] shrink-0 space-y-4">
                        <button onClick={createNewCharPeriod} className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-abysse transition-all shadow-md flex items-center justify-center gap-2"><Plus size={18} /> Nouvelle Période</button>
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            {(charPlannings || []).map((period) => (
                                <button key={period._id} onClick={() => setSelectedCharPeriod({...period})} className={`w-full p-5 text-left border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all ${selectedCharPeriod?._id === period._id ? 'bg-slate-50 border-l-4 border-l-orange-500 pl-4' : ''}`}>
                                    <span className="block font-black text-abysse uppercase tracking-tighter line-clamp-1">{period.title}</span>
                                    <span className="block text-[10px] text-slate-400 mt-1 italic">{new Date(period.startDate).toLocaleDateString()}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                         {selectedCharPeriod && (
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200">
                                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-slate-100 pb-10">
                                    <div className="flex-1 space-y-4">
                                        <input type="text" value={selectedCharPeriod.title || ''} onChange={(e)=>setSelectedCharPeriod({...selectedCharPeriod, title: e.target.value})} className="w-full p-2 bg-transparent text-3xl font-black uppercase italic text-abysse outline-none focus:text-turquoise border-b border-transparent focus:border-slate-200" placeholder="Label Période" />
                                        <div className="flex items-center gap-6">
                                            <input type="date" value={selectedCharPeriod.startDate || ''} onChange={(e)=>setSelectedCharPeriod({...selectedCharPeriod, startDate: e.target.value})} className="font-bold text-abysse"/>
                                            <span className="text-slate-300">-</span>
                                            <input type="date" value={selectedCharPeriod.endDate || ''} onChange={(e)=>setSelectedCharPeriod({...selectedCharPeriod, endDate: e.target.value})} className="font-bold text-abysse"/>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        {selectedCharPeriod._id && <button onClick={deleteCharPeriod} className="p-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>}
                                        <button onClick={saveCharPeriod} disabled={isSaving} className="px-8 py-4 bg-abysse text-white rounded-xl font-black uppercase tracking-widest hover:bg-turquoise transition-all shadow-xl flex items-center gap-2"><Save size={20} /> Enregistrer</button>
                                    </div>
                                </div>

                                <div className="space-y-16">
                                    {(selectedCharPeriod.weeks || []).map((week, wIdx) => (
                                        <div key={wIdx} className="bg-slate-50 rounded-4xl p-8 border border-slate-100">
                                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                                <div className="bg-orange-500 text-white rounded-lg px-3 py-1 text-xs font-black uppercase tracking-widest w-fit">Semaine {wIdx + 1}</div>
                                                <input type="text" value={week.title} onChange={(e)=>{
                                                    const nw = [...selectedCharPeriod.weeks];
                                                    nw[wIdx].title = e.target.value;
                                                    setSelectedCharPeriod({...selectedCharPeriod, weeks: nw});
                                                }} className="flex-1 bg-transparent text-xl font-black italic text-abysse outline-none border-b border-dashed border-slate-300 focus:border-orange-500" placeholder="Label semaine"/>
                                                
                                                {/* Date Control for Week */}
                                                <input type="date" value={week.startDate || ''} onChange={(e)=>{
                                                     const newStart = e.target.value;
                                                     const nw = [...selectedCharPeriod.weeks];
                                                     nw[wIdx].startDate = newStart;
                                                     nw[wIdx].endDate = addDays(newStart, 6);
                                                     // Correct days dates
                                                     nw[wIdx].days = nw[wIdx].days.map((d, i) => ({...d, date: addDays(newStart, i)}));
                                                     setSelectedCharPeriod({...selectedCharPeriod, weeks: nw});
                                                }} className="font-bold text-abysse bg-transparent" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {week.days.map((day, dIdx) => (
                                                    <div key={dIdx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="font-black text-sm uppercase text-abysse">{day.name}</span>
                                                            <span className="text-[10px] text-slate-400">{new Date(day.date).getDate()}</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {day.sessions.map((sess, sIdx) => (
                                                                <div key={sIdx} className="flex gap-2">
                                                                    <input type="text" value={sess.time || ''} onChange={(e)=>{
                                                                        const nw = [...selectedCharPeriod.weeks];
                                                                        nw[wIdx].days[dIdx].sessions[sIdx].time = e.target.value;
                                                                        setSelectedCharPeriod({...selectedCharPeriod, weeks: nw});
                                                                    }} className="flex-1 bg-slate-50 p-2 rounded text-xs font-bold text-center" />
                                                                    <button onClick={()=>{
                                                                        const nw = [...selectedCharPeriod.weeks];
                                                                        nw[wIdx].days[dIdx].sessions.splice(sIdx, 1);
                                                                        setSelectedCharPeriod({...selectedCharPeriod, weeks: nw});
                                                                    }} className="text-red-300 hover:text-red-500 px-1"><Trash2 size={12}/></button>
                                                                </div>
                                                            ))}
                                                            <button onClick={()=>{
                                                                const nw = [...selectedCharPeriod.weeks];
                                                                nw[wIdx].days[dIdx].sessions.push({ time: "14h - 16h", _key: Date.now().toString() });
                                                                setSelectedCharPeriod({...selectedCharPeriod, weeks: nw});
                                                            }} className="w-full py-2 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase hover:bg-orange-100 transition-colors">+ Session</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <button onClick={addCharWeek} className="w-full py-6 border-2 border-dashed border-slate-300 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                                        <Plus size={20} /> Ajouter une semaine
                                    </button>
                                </div>
                            </div>
                         )}
                    </div>
                </div>
            )}

        </main>
    </div>
  );
};

export default AdminPage;