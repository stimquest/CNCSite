"use client";

import React, { useState, useMemo } from 'react';
import { 
  Anchor, 
  Wind, 
  Waves, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Euro,
  GraduationCap,
  Clock,
  Calendar,
  Info,
  Compass
} from 'lucide-react';
import { ACTIVITIES } from '../../../constants';
import { Activity, ActivityCategory } from '../../../types';
import { useContent } from '../../../contexts/ContentContext';

export const ActivitiesPage: React.FC = () => {
  const { weather } = useContent();
  const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'TOUTES'>('TOUTES');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    return ACTIVITIES.filter(a => activeFilter === 'TOUTES' || a.category === activeFilter);
  }, [activeFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      
      {/* 1. HERO HEADER (STYLE ÉCOLE - DARK) */}
      <section className="pt-32 pb-20 px-6 bg-abysse text-white">
        <div className="max-w-[1400px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-turquoise mb-8">
                <Compass size={16} />
                <span>Saison 2026</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                Catalogue<br/><span className="text-turquoise">Activités.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-4xl mx-auto">
                De l'initiation au perfectionnement, découvrez toutes nos formules pour naviguer à Coutainville. Char, Voile, Kayak et bien plus.
            </p>
        </div>
      </section>

      {/* 2. BARRE DE FILTRES (STICKY) */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap justify-center gap-2 md:gap-4">
            {['TOUTES', 'Sensations', 'Voile', 'Jeunesse', 'Bien-être', 'Sécurité'].map((cat) => (
            <button
                key={cat}
                onClick={() => setActiveFilter(cat as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeFilter === cat 
                    ? 'bg-abysse text-white border-abysse shadow-lg scale-105' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-turquoise hover:text-turquoise hover:bg-slate-50'
                }`}
            >
                {cat}
            </button>
            ))}
        </div>
      </section>

      {/* LISTE DES ACTIVITÉS */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 space-y-8">
        {filteredActivities.map((activity) => {
            const isExpanded = expandedId === activity.id;

            return (
                <div 
                    key={activity.id} 
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg"
                >
                    {/* TOP PART : MAIN CARD */}
                    <div className="flex flex-col lg:flex-row">
                        
                        {/* IMAGE (35%) */}
                        <div className="relative lg:w-[35%] min-h-[300px] lg:min-h-[380px]">
                            <img 
                                src={activity.image} 
                                alt={activity.title} 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-abysse/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10"></div>
                            
                            {/* BADGES */}
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                <span className="bg-white text-abysse px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {activity.minAge} ans et +
                                </span>
                                <span className="bg-turquoise text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {activity.category}
                                </span>
                            </div>
                        </div>

                        {/* CONTENT (65%) */}
                        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                            
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                {/* Text Info */}
                                <div className="flex-1">
                                    <h2 className="text-3xl md:text-4xl font-black text-abysse uppercase italic tracking-tighter mb-3">
                                        {activity.title}
                                    </h2>
                                    <p className="text-turquoise text-xs font-black uppercase tracking-widest mb-6 leading-relaxed">
                                        "{activity.accroche}"
                                    </p>
                                    <p className="text-slate-600 font-medium text-sm leading-loose mb-6 text-justify">
                                        {activity.experience || activity.description}
                                    </p>
                                    {/* Quick Info Line */}
                                    <div className="flex items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><Clock size={14} /> {activity.duration}</span>
                                        <span className="flex items-center gap-2"><Calendar size={14} /> Saison 2026</span>
                                    </div>
                                </div>

                                {/* Actions Column */}
                                <div className="flex flex-col gap-3 min-w-[200px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                    <a href={activity.bookingUrl} target="_blank" className="w-full py-4 bg-abysse text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-turquoise transition-colors flex items-center justify-center gap-2 shadow-lg">
                                        <Calendar size={14} /> Apprendre (Stage)
                                    </a>
                                    <a href={activity.bookingUrl} target="_blank" className="w-full py-4 bg-turquoise text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-abysse transition-colors flex items-center justify-center gap-2 shadow-md">
                                        <Wind size={14} /> Réserver Séance
                                    </a>
                                    <a href={activity.bookingUrl} target="_blank" className="w-full py-4 bg-white text-abysse border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-turquoise hover:text-turquoise transition-colors flex items-center justify-center gap-2">
                                        <Anchor size={14} /> Louer
                                    </a>
                                    
                                    <button 
                                        onClick={() => toggleExpand(activity.id)}
                                        className="mt-auto pt-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-turquoise flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {isExpanded ? 'Masquer' : 'Détails & Tarifs'} 
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EXPANDABLE DETAILS PANEL */}
                    <div 
                        className={`grid transition-all duration-500 ease-in-out bg-slate-50 ${
                            isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                    >
                        <div className="overflow-hidden">
                            <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                                
                                {/* COL 1: LA FLOTTE */}
                                <div>
                                    <h4 className="flex items-center gap-3 text-sm font-black text-abysse uppercase tracking-widest mb-6">
                                        <Anchor size={18} className="text-turquoise" /> La Flotte
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="text-xs text-slate-600 font-medium leading-relaxed">
                                            <span className="block font-bold text-abysse mb-1">• Matériel Récent</span>
                                            Renouvelé tous les 3 ans pour garantir sécurité et performance.
                                        </li>
                                        <li className="text-xs text-slate-600 font-medium leading-relaxed">
                                            <span className="block font-bold text-abysse mb-1">• Adapté au niveau</span>
                                            Du support stable pour l'initiation au modèle sport pour la vitesse.
                                        </li>
                                        <li className="text-xs text-slate-600 font-medium leading-relaxed">
                                            <span className="block font-bold text-abysse mb-1">• Sécurité</span>
                                            Bateaux de sécurité toujours sur l'eau et liaison radio.
                                        </li>
                                    </ul>
                                </div>

                                {/* COL 2: PÉDAGOGIE */}
                                <div>
                                    <h4 className="flex items-center gap-3 text-sm font-black text-abysse uppercase tracking-widest mb-6">
                                        <GraduationCap size={18} className="text-turquoise" /> Pédagogie
                                    </h4>
                                    <div className="text-xs text-slate-600 font-medium leading-relaxed text-justify">
                                        {activity.pedagogie ? activity.pedagogie : "Une progression individualisée grâce au livret de voile FFV. Nos moniteurs diplômés vous accompagnent vers l'autonomie en validant vos niveaux techniques."}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[9px] font-bold text-slate-500 uppercase">Niveau 1</span>
                                        <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[9px] font-bold text-slate-500 uppercase">Niveau 2</span>
                                        <span className="bg-white border border-slate-200 px-2 py-1 rounded text-[9px] font-bold text-slate-500 uppercase">Niveau 3</span>
                                    </div>
                                </div>

                                {/* COL 3: TARIFS */}
                                <div>
                                    <h4 className="flex items-center gap-3 text-sm font-black text-abysse uppercase tracking-widest mb-6">
                                        <Euro size={18} className="text-turquoise" /> Tarifs 2026
                                    </h4>
                                    <ul className="space-y-3">
                                        {activity.prices.map((price, idx) => (
                                            <li key={idx} className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                                                <span className="text-xs font-bold text-slate-500 uppercase">{price.label}</span>
                                                <span className="text-sm font-black text-abysse">{price.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-3 text-[10px] text-slate-400 italic leading-tight">
                                        * Les tarifs stages incluent la licence et l'adhésion temporaire.
                                    </p>
                                </div>

                                {/* COL 4: PRATIQUE */}
                                <div>
                                    <h4 className="flex items-center gap-3 text-sm font-black text-abysse uppercase tracking-widest mb-6">
                                        <CheckCircle2 size={18} className="text-turquoise" /> Pratique
                                    </h4>
                                    <ul className="space-y-2">
                                        {activity.logistique.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <div className="mt-1 size-1.5 rounded-full bg-turquoise shrink-0"></div>
                                                <span className="text-xs font-medium text-slate-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {activity.isTideDependent && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-2">
                                            <Waves size={16} className="text-blue-500 shrink-0" />
                                            <p className="text-[10px] font-bold text-blue-800 leading-tight">
                                                Activité dépendante de la marée. Horaires variables.
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            );
        })}
      </section>

    </div>
  );
};

export default ActivitiesPage;
