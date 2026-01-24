import React from 'react';
import { Award, Shield, Users, Anchor, ChevronRight } from 'lucide-react';

export const School: React.FC = () => {
  const levels = [
    { title: "Mini-Moussaillons", age: "4-6 ans", desc: "Découverte sensorielle et ludique.", icon: "🦀" },
    { title: "Moussaillons", age: "6-8 ans", desc: "Premiers bords en Optimist.", icon: "⛵" },
    { title: "Matelots", age: "8-12 ans", desc: "Autonomie et technique.", icon: "🧭" },
    { title: "Chefs de Bord", age: "12+ ans", desc: "Perfectionnement et sensation.", icon: "🚤" },
  ];

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
          École de <span className="text-nautical-500">Voile</span>
        </h1>
        <p className="text-xl text-gray-400">
          Une pédagogie reconnue, labellisée FFVoile, pour accompagner vos enfants de la découverte à l'autonomie.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
           <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-300 flex items-center gap-2">
             <Shield size={16} className="text-nautical-500" /> Sécurité Optimale
           </span>
           <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-300 flex items-center gap-2">
             <Award size={16} className="text-nautical-500" /> Moniteurs Diplômés
           </span>
           <span className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-300 flex items-center gap-2">
             <Users size={16} className="text-nautical-500" /> Matériel Récent
           </span>
        </div>
      </div>

      {/* Cursus Steps */}
      <div className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-nautical-800 via-nautical-500 to-nautical-800 -translate-y-1/2 z-0" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {levels.map((lvl, index) => (
            <div key={index} className="bg-nautical-900 border border-white/10 rounded-2xl p-6 text-center hover:border-nautical-500/50 transition-colors group">
              <div className="w-16 h-16 mx-auto bg-nautical-800 rounded-full flex items-center justify-center text-3xl mb-4 border-4 border-nautical-900 group-hover:border-nautical-500 transition-colors shadow-xl">
                {lvl.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{lvl.title}</h3>
              <p className="text-nautical-300 text-sm font-bold uppercase tracking-wider mb-3">{lvl.age}</p>
              <p className="text-gray-400 text-sm">{lvl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reassurance Parents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/5 rounded-3xl p-8 md:p-12 border border-white/5">
        <div className="space-y-6">
          <h2 className="text-3xl font-display font-bold text-white">Parents, naviguez tranquilles</h2>
          <ul className="space-y-4">
             <li className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-nautical-500/20 flex items-center justify-center text-nautical-500 shrink-0"><Anchor size={18} /></div>
               <div>
                 <h4 className="font-bold text-white">Encadrement Certifié</h4>
                 <p className="text-sm text-gray-400">Chaque stage est encadré par un moniteur diplômé d'État ou fédéral.</p>
               </div>
             </li>
             <li className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-nautical-500/20 flex items-center justify-center text-nautical-500 shrink-0"><Shield size={18} /></div>
               <div>
                 <h4 className="font-bold text-white">Équipement Fourni</h4>
                 <p className="text-sm text-gray-400">Combinaisons isothermes désinfectées, gilets de sauvetage adaptés.</p>
               </div>
             </li>
          </ul>
          <button className="px-8 py-3 bg-white text-nautical-900 font-bold rounded-lg hover:bg-nautical-300 transition-colors mt-4">
            Pré-inscrire mon enfant
          </button>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
          <img src="https://picsum.photos/800/600?random=15" className="w-full h-full object-cover" alt="Enfants en optimist" />
        </div>
      </div>

    </div>
  );
};

export default School;