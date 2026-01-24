import React from 'react';
import { MapPin, FileText, HelpCircle, Download } from 'lucide-react';

export const Practical: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-16">
      <h1 className="text-4xl font-display font-bold text-white text-center">Infos Pratiques</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact & Map */}
        <div className="space-y-8">
           <div className="bg-nautical-800 p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-nautical-500" /> Nous trouver
              </h2>
              <p className="text-gray-300 mb-4">
                120 rue des Dunes<br/>
                50230 Agon-Coutainville<br/>
                Normandie, France
              </p>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-white/5 flex items-center justify-center relative group">
                 <img src="https://picsum.photos/800/400?grayscale" className="opacity-50 w-full h-full object-cover" />
                 <span className="absolute text-sm font-bold text-white bg-black/50 px-3 py-1 rounded">Carte Interactive (Google Maps)</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="block text-gray-500 uppercase text-xs">Juillet / Août</span>
                   <span className="text-white">9h - 19h (7j/7)</span>
                 </div>
                 <div>
                   <span className="block text-gray-500 uppercase text-xs">Hors Saison</span>
                   <span className="text-white">Mer. & Sam. 14h-18h</span>
                 </div>
              </div>
           </div>

           <div className="bg-nautical-800 p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="text-nautical-500" /> Documents & Tarifs
              </h2>
              <div className="space-y-3">
                 <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
                   <span className="text-gray-300 group-hover:text-white">Grille Tarifaire 2026 (PDF)</span>
                   <Download size={16} className="text-nautical-500" />
                 </button>
                 <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
                   <span className="text-gray-300 group-hover:text-white">Fiche Sanitaire de Liaison</span>
                   <Download size={16} className="text-nautical-500" />
                 </button>
                 <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
                   <span className="text-gray-300 group-hover:text-white">Règlement Intérieur</span>
                   <Download size={16} className="text-nautical-500" />
                 </button>
              </div>
           </div>
        </div>

        {/* FAQ */}
        <div>
           <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <HelpCircle className="text-nautical-500" /> Questions Fréquentes
           </h2>
           <div className="space-y-4">
             {[
               { q: "À partir de quel âge peut-on naviguer ?", a: "Dès 4 ans au Jardin des Mers. Pour le char à voile, à partir de 8 ans." },
               { q: "Faut-il savoir nager ?", a: "Oui, un test d'aisance aquatique (25m) est obligatoire pour toutes les activités nautiques (sauf Char à voile)." },
               { q: "Que dois-je apporter ?", a: "Maillot de bain, serviette, crème solaire, lunettes attachées et vieilles baskets. La combinaison est fournie." },
               { q: "Que se passe-t-il s'il n'y a pas de vent ?", a: "Les moniteurs adaptent la séance : théorie, nœuds, paddle ou jeux de plage. La séance n'est pas remboursée mais remplacée." }
             ].map((item, i) => (
               <div key={i} className="bg-nautical-900 border border-white/5 rounded-xl p-5">
                 <h3 className="font-bold text-white mb-2">{item.q}</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Practical;