
"use client";

import React from 'react';
import { 
  Building2, 
  PartyPopper, 
  ArrowRight, 
  Briefcase, 
  Mail, 
  MonitorPlay, 
  Wifi, 
  Coffee,
  CheckCircle2
} from 'lucide-react';

export const GroupesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-32">
      
      {/* PISTE B : DASHBOARD CONTEXTUEL GROUPES */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 md:p-16 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 text-abysse font-black uppercase tracking-[0.3em] text-[10px] mb-6 italic">
                        <Briefcase size={12} className="text-turquoise" /> Séminaires & Événements
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-abysse uppercase italic tracking-tighter leading-[0.85] mb-8">
                        Vivre le<br/><span className="text-turquoise">Collectif.</span>
                    </h1>
                    <p className="text-xl font-medium text-slate-400 max-w-xl leading-relaxed">
                        Des solutions sur-mesure pour vos séminaires, teambuildings ou événements privés face au large.
                    </p>
                </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-abysse text-white rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacité</p>
                        <span className="px-3 py-1 bg-turquoise rounded text-[9px] font-black uppercase">Modulable</span>
                    </div>
                    <div className="relative z-10 mt-6">
                        <p className="text-7xl font-black tracking-tighter italic">120<span className="text-2xl text-slate-400 ml-2">pers</span></p>
                        <p className="text-sm font-bold text-slate-400 mt-2">Salle de conférence vue mer & Espace extérieur</p>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 flex flex-col justify-between">
                    <div className="flex gap-2 text-turquoise"><Wifi size={16} /><Coffee size={16} /><MonitorPlay size={16} /></div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Équipement</p>
                        <p className="text-xl font-black text-abysse uppercase italic">Full-Tech</p>
                    </div>
                </div>

                <div className="bg-turquoise text-white rounded-[2rem] p-6 flex flex-col justify-between group cursor-pointer hover:bg-abysse transition-all shadow-lg shadow-turquoise/20">
                    <Mail size={24} />
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-widest">Devis</p>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEGMENTATION */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[3rem] p-12 shadow-card border border-slate-100 hover:scale-[1.02] transition-all group">
                <div className="size-16 bg-abysse rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-turquoise transition-colors shadow-lg"><Building2 size={32} /></div>
                <h2 className="text-3xl font-black text-abysse uppercase italic mb-4">Entreprises</h2>
                <p className="text-slate-500 font-medium mb-8">Pour vos séminaires et teambuildings. Féderez vos équipes dans un cadre exceptionnel.</p>
                <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="text-turquoise" size={18} /> Salle de réunion vue mer</li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="text-turquoise" size={18} /> Challenges sportifs & Teambuilding</li>
                </ul>
                <button className="w-full py-5 rounded-2xl bg-slate-50 text-abysse font-black uppercase tracking-widest text-[10px] hover:bg-abysse hover:text-white transition-colors border border-slate-200 shadow-sm">Demander un devis personnalisé</button>
            </div>
            <div className="bg-white rounded-[3rem] p-12 shadow-card border border-slate-100 hover:scale-[1.02] transition-all group">
                <div className="size-16 bg-turquoise rounded-2xl flex items-center justify-center text-white mb-8 group-hover:bg-abysse transition-colors shadow-lg"><PartyPopper size={32} /></div>
                <h2 className="text-3xl font-black text-abysse uppercase italic mb-4">Événements Privés</h2>
                <p className="text-slate-500 font-medium mb-8">Week-ends en famille, anniversaires ou EVG/EVJF. Des souvenirs gravés face au large.</p>
                <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="text-turquoise" size={18} /> Activités fun & sensations</li>
                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="text-turquoise" size={18} /> Formules défis collectifs</li>
                </ul>
                <button className="w-full py-5 rounded-2xl bg-slate-50 text-abysse font-black uppercase tracking-widest text-[10px] hover:bg-turquoise hover:text-white transition-colors border border-slate-200 shadow-sm">Voir nos offres groupe</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default GroupesPage;
