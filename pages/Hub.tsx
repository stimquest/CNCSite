import React from 'react';
import { Building2, GraduationCap, Heart, Check, Calendar, ArrowRight } from 'lucide-react';

export const Hub: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-24">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
          Le Hub <span className="text-nautical-300">Vie & Business</span>
        </h1>
        <p className="text-xl text-gray-400">
          Centre Laurent Bourgnon : Un espace hybride pour travailler, apprendre et se ressourcer face à la mer.
        </p>
      </div>

      {/* SECTION 1: SÉMINAIRES (B2B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 group">
          <div className="absolute inset-0 bg-nautical-900/20 group-hover:bg-transparent transition-colors duration-500" />
          <img 
            src="https://picsum.photos/800/600?random=10" 
            alt="Salle de séminaire vue mer" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Capacité : 80 pers.</span>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-nautical-500">
            <Building2 size={32} />
            <h2 className="text-3xl font-display font-bold text-white">Espace Séminaires</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Sortez du cadre habituel. Organisez vos réunions, teambuildings et événements d'entreprise avec une vue imprenable sur Jersey. Équipement high-tech (Écrans 4K, Fibre, Sonorisation).
          </p>
          
          <ul className="space-y-4">
            {[
              "Salle modulable 'Archipel' (120m²)",
              "Formules Traiteur & Pauses café",
              "Pack 'Travail + Char à Voile'"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-nautical-800 border border-nautical-500 flex items-center justify-center">
                  <Check size={12} className="text-nautical-500" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <button className="w-full sm:w-auto px-8 py-4 bg-white text-nautical-900 font-bold rounded-lg hover:bg-nautical-300 transition-colors flex items-center justify-center gap-2">
            <span>Demander un devis</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* SECTION 2: FORMATIONS (Permis & Secourisme) */}
      <div className="bg-nautical-800/50 rounded-3xl p-8 md:p-12 border border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-3 text-nautical-500">
            <GraduationCap size={32} />
            <h2 className="text-3xl font-display font-bold text-white">Pôle Formation</h2>
          </div>
          <div className="flex gap-2">
             <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">Agrément FFVoile</span>
             <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">Centre FFSS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Permis */}
          <div className="bg-nautical-900 p-6 rounded-2xl border border-white/5 hover:border-nautical-500/30 transition-colors group cursor-pointer">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nautical-300">Permis Bateau</h3>
            <p className="text-sm text-gray-400 mb-6">Côtier & Hauturier. Formation théorique en salle et pratique en baie de Sienne.</p>
            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-4">
              <span>Prochaine session : 12 Mai</span>
              <span className="text-white font-bold">350€</span>
            </div>
          </div>

          {/* Card Secourisme */}
          <div className="bg-nautical-900 p-6 rounded-2xl border border-white/5 hover:border-nautical-500/30 transition-colors group cursor-pointer">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nautical-300">Secourisme (PSC1 / PSE1)</h3>
            <p className="text-sm text-gray-400 mb-6">Apprenez les gestes qui sauvent avec nos formateurs diplômés d'État.</p>
            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-4">
              <span>Prochaine session : 24 Juin</span>
              <span className="text-white font-bold">60€</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BIEN-ÊTRE (Planning) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3 text-nautical-500">
            <Heart size={32} />
            <h2 className="text-3xl font-display font-bold text-white">Bien-être &<br/>Santé</h2>
          </div>
          <p className="text-gray-400">
            Prolongez les bienfaits de la mer. Des séances douces accessibles à tous, encadrées par des professionnels, directement sur la terrasse panoramique ou en salle.
          </p>
        </div>

        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <Calendar size={16} /> Planning Hebdomadaire
          </h3>
          <div className="space-y-3">
             {[
               { day: "Lundi", time: "09h00 - 10h00", activity: "Yoga Vinyasa", coach: "Sarah", spot: "Terrasse" },
               { day: "Mercredi", time: "18h30 - 19h30", activity: "Pilates", coach: "Marc", spot: "Salle Archipel" },
               { day: "Samedi", time: "10h00 - 11h30", activity: "Longe Côte & Renfo", coach: "Julie", spot: "Plage" },
             ].map((slot, idx) => (
               <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-nautical-900/50 p-4 rounded-lg hover:bg-nautical-800 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <span className="w-16 text-sm font-bold text-nautical-300">{slot.day}</span>
                    <span className="text-sm text-gray-400 font-mono">{slot.time}</span>
                  </div>
                  <div className="flex items-center justify-between sm:gap-8 flex-1 sm:justify-end">
                    <div>
                      <span className="block text-white font-medium">{slot.activity}</span>
                      <span className="text-xs text-gray-500">avec {slot.coach} • {slot.spot}</span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-nautical-900 transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hub;