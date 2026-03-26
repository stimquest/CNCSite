"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
   return (
      <footer className="bg-abysse text-white py-16 md:py-24 mt-auto border-t-4 border-turquoise/20">
         <div className="max-w-400 mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

               {/* Brand - 4 columns */}
               <div className="lg:col-span-4">
                  <div className="flex items-center gap-4 mb-6">
                     <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">CNC2S</h2>
                  </div>
                  <p className="text-slate-400 max-w-sm font-medium leading-relaxed mb-6 text-sm md:text-base">
                     Club Nautique de Coutainville Sauvetage et Secourisme, école de référence sur la côte Ouest du Cotentin depuis 1929. Labellisé Ecole Française de Voile.
                  </p>
                  <div className="flex gap-4">
                     <a
                        href="https://www.facebook.com/profile.php?id=100064939500164&locale=fr_FR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-abysse hover:border-white transition-all"
                        title="Suivez-nous sur Facebook"
                     >
                        <Facebook size={20} />
                     </a>
                  </div>
               </div>

               {/* Sitemap Container - 2 columns on mobile */}
               <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">
                  {/* Sitemap: Le Club */}
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-6 md:mb-8">Le Club</h4>
                     <ul className="space-y-3 md:space-y-4 text-slate-300 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                        <li><Link href="/club" className="hover:text-white transition-colors">Notre Histoire</Link></li>
                        <li><Link href="/nature" className="hover:text-white transition-colors">Environnement</Link></li>
                        <li><Link href="/groupes-entreprises" className="hover:text-white transition-colors">Entreprises</Link></li>
                        <li><Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link></li>
                     </ul>
                  </div>

                  {/* Sitemap: Navigation */}
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-6 md:mb-8">Navigation</h4>
                     <ul className="space-y-3 md:space-y-4 text-slate-300 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                        <li><Link href="/activites" className="hover:text-white transition-colors">Activités & Stages</Link></li>
                        <li><Link href="/ecole-voile" className="hover:text-white transition-colors">École de Voile</Link></li>
                        <li><Link href="/le-spot" className="hover:text-white transition-colors">Le Spot en Direct</Link></li>
                        <li><Link href="/fil-info" className="hover:text-white transition-colors">La Vigie (Infos)</Link></li>
                        <li><Link href="/infos-pratiques" className="hover:text-white transition-colors">Infos Pratiques</Link></li>
                     </ul>
                  </div>

                  {/* Sitemap: Contact & Légal */}
                  <div className="col-span-2 md:col-span-1">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-6 md:mb-8">Contact</h4>
                     <ul className="space-y-3 md:space-y-4 text-slate-300 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                        <li className="normal-case tracking-normal font-medium italic text-slate-500 mb-4 md:mb-6 leading-relaxed text-xs">
                           104 rue des Dunes<br />
                           50230 Agon-Coutainville
                        </li>
                        <li><a href="tel:+33233471481" className="hover:text-white transition-colors">02 33 47 14 81</a></li>
                        <li><a href="mailto:contact@cncoutainville.fr" className="text-white hover:text-turquoise transition-colors underline underline-offset-8 decoration-turquoise/30">contact@cncoutainville.fr</a></li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-500">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <p>© 2026 Club Nautique de Coutainville. Tous droits réservés.</p>
                  <span className="hidden md:inline text-white/20">|</span>
                  <a href="https://artyzia.netlify.app" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors normal-case tracking-normal">
                     Création par <span className="font-bold text-slate-500 hover:text-white underline decoration-transparent hover:decoration-white/30 underline-offset-4 transition-all">Atyzia-Studio</span>
                  </a>
               </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4 items-center justify-center md:justify-end">
                   <Link href="/legal" className="hover:text-white transition-colors">Mentions Légales</Link>
                   <button
                      onClick={() => {
                         localStorage.removeItem('cnc_onboarded_v1');
                         window.dispatchEvent(new Event('cnc_reopen_guide'));
                      }}
                      className="hover:text-white transition-colors"
                   >
                      Guide
                   </button>
                   <Link href="/digital-signage" className="hidden md:inline-block text-abysse bg-white px-2 py-1 rounded hover:bg-turquoise hover:text-white transition-colors">Mode Écran</Link>
                   <Link href="/admin" className="text-slate-600 hover:text-white transition-colors">Admin</Link>
                </div>
            </div>
         </div>
      </footer>
   );
};
