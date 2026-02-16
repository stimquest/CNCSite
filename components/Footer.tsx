"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
   const pathname = usePathname();

   const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
      // If we are on the page of the anchor, scroll to it. 
      // For typical Next.js apps with hash links works if on same page.
      // But here we are migrating hash routing -> real routing.
      // So links like #activites are now /activites.
      // BUT wait, footer links in App.tsx were #activites.
      // If they link to section #activites on Home page? 
      // No, the original App.tsx routed #activites to ActivitiesPage.
      // So these are real pages now.
   };

   return (
      <footer className="bg-abysse text-white py-20 mt-auto">
         <div className="max-w-[1600px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

               {/* Brand - 4 columns */}
               <div className="lg:col-span-4">
                  <div className="flex items-center gap-4 mb-6">
                     <h2 className="text-4xl font-black uppercase tracking-tighter text-white">CNC</h2>
                  </div>
                  <p className="text-slate-400 max-w-sm font-medium leading-relaxed mb-6">
                     Club Nautique de Coutainville, école de référence sur la côte Ouest du Cotentin depuis 1978. Labellisé Ecole Française de Voile.
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

               {/* Sitemap: Le Club - 2 columns */}
               <div className="lg:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-8">Le Club</h4>
                  <ul className="space-y-4 text-slate-400 font-bold text-xs uppercase tracking-wider">
                     <li><Link href="/club" className="hover:text-white transition-colors">Notre Histoire</Link></li>
                     <li><Link href="/nature" className="hover:text-white transition-colors">Espace Nature</Link></li>
                     <li><Link href="/groupes-entreprises" className="hover:text-white transition-colors">Entreprises</Link></li>
                     <li><Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link></li>
                  </ul>
               </div>

               {/* Sitemap: Navigation - 3 columns */}
               <div className="lg:col-span-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-8">Navigation</h4>
                  <ul className="space-y-4 text-slate-400 font-bold text-xs uppercase tracking-wider">
                     <li><Link href="/activites" className="hover:text-white transition-colors">Activités & Stages</Link></li>
                     <li><Link href="/ecole-voile" className="hover:text-white transition-colors">École de Voile</Link></li>
                     <li><Link href="/le-spot" className="hover:text-white transition-colors">Le Spot en Direct</Link></li>
                     <li><Link href="/fil-info" className="hover:text-white transition-colors">La Vigie (Infos)</Link></li>
                     <li><Link href="/infos-pratiques" className="hover:text-white transition-colors">Infos Pratiques</Link></li>
                  </ul>
               </div>

               {/* Sitemap: Contact & Légal - 3 columns */}
               <div className="lg:col-span-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise mb-8">Contact</h4>
                  <ul className="space-y-4 text-slate-400 font-bold text-xs uppercase tracking-wider">
                     <li className="normal-case tracking-normal font-medium italic text-slate-500 mb-6 leading-relaxed">
                        Plage Nord<br />
                        50230 Agon-Coutainville
                     </li>
                     <li><a href="mailto:contact@cnc-voile.fr" className="text-white hover:text-turquoise transition-colors underline underline-offset-8 decoration-turquoise/30">contact@cnc-voile.fr</a></li>
                  </ul>
               </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-500">
               <p>© 2026 Club Nautique de Coutainville. Tous droits réservés.</p>
               <div className="flex gap-8">
                  <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                  <Link href="/digital-signage" className="text-abysse bg-white px-2 py-1 rounded hover:bg-turquoise hover:text-white transition-colors">Mode Écran</Link>
                  <Link href="/admin" className="text-slate-600 hover:text-white transition-colors">Admin</Link>
               </div>
            </div>
         </div>
      </footer>
   );
};
