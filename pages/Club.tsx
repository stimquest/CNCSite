import React from 'react';
import { Calendar, Users, Trophy, HeartHandshake } from 'lucide-react';

export const Club: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-16">
      
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
           <h1 className="text-4xl md:text-6xl font-display font-bold text-white">L'Esprit <span className="text-nautical-500">Club</span></h1>
           <p className="text-xl text-gray-400">
             Plus qu'une école de voile, le CNC est une famille de passionnés depuis 1965. Rejoignez une communauté vibrante tournée vers la mer.
           </p>
           <div className="grid grid-cols-2 gap-6 pt-6">
             <div className="bg-nautical-800 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-bold text-white mb-1">450</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Adhérents</div>
             </div>
             <div className="bg-nautical-800 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Bénévoles</div>
             </div>
           </div>
        </div>
        <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
           <img src="https://picsum.photos/800/600?random=22" className="w-full h-full object-cover" alt="Club house" />
        </div>
      </div>

      {/* Why Join */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
           <Trophy className="text-nautical-500 mb-4" size={32} />
           <h3 className="text-xl font-bold text-white mb-2">Compétition</h3>
           <p className="text-gray-400">Intégrez nos équipes sportives (Catamaran, Planche) et représentez Coutainville sur les régates.</p>
        </div>
        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
           <HeartHandshake className="text-nautical-500 mb-4" size={32} />
           <h3 className="text-xl font-bold text-white mb-2">Convivialité</h3>
           <p className="text-gray-400">BBQ du vendredi soir, régates saucisson, soirées du club. L'ambiance à terre compte autant que sur l'eau.</p>
        </div>
        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
           <Calendar className="text-nautical-500 mb-4" size={32} />
           <h3 className="text-xl font-bold text-white mb-2">Navigation à l'année</h3>
           <p className="text-gray-400">Profitez du matériel du club toute l'année (hors juillet-août) avec la formule "Navigation Libre".</p>
        </div>
      </div>

      {/* Pricing Table (Simplified) */}
      <div className="bg-nautical-800 border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Cotisations Annuelles 2026</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm uppercase">
                <th className="py-4 px-4">Formule</th>
                <th className="py-4 px-4">Jeunes (-18)</th>
                <th className="py-4 px-4">Adultes</th>
                <th className="py-4 px-4">Famille</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 font-bold">Adhésion Simple</td>
                <td className="py-4 px-4">40€</td>
                <td className="py-4 px-4">60€</td>
                <td className="py-4 px-4">120€</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 font-bold">Licence Sportive (Compétition)</td>
                <td className="py-4 px-4">150€</td>
                <td className="py-4 px-4">220€</td>
                <td className="py-4 px-4">-</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-4 px-4 font-bold">Navigation Libre (Matériel Club)</td>
                <td className="py-4 px-4">280€</td>
                <td className="py-4 px-4">350€</td>
                <td className="py-4 px-4">700€</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
           <button className="px-8 py-3 bg-nautical-500 text-nautical-900 font-bold rounded-lg hover:bg-white transition-colors">
             Adhérer en ligne
           </button>
        </div>
      </div>

    </div>
  );
};

export default Club;