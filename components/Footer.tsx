"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
               
               {/* Brand */}
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="size-10 bg-turquoise rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">sailing</span>
                     </div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter">CVC</h2>
                  </div>
                  <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                     Club de Voile de Coutainville, l'école de référence sur la côte Ouest du Cotentin depuis 1965. Labellisé Ecole Française de Voile.
                  </p>
                  <div className="flex gap-4 mt-8">
                    <a href="#" className="size-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-turquoise transition-colors">
                        <span className="material-symbols-outlined text-lg">public</span>
                    </a>
                     <a href="#" className="size-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-turquoise transition-colors">
                        <span className="material-symbols-outlined text-lg">mail</span>
                     </a>
                  </div>
               </div>

               {/* Links */}
               <div>
                  <h4 className="text-lg font-black uppercase mb-6">Activités</h4>
                  <ul className="space-y-4 text-slate-400 font-bold text-sm uppercase tracking-wider">
                     <li><Link href="/activites" className="hover:text-turquoise transition-colors">Voile légère</Link></li>
                     <li><Link href="/activites" className="hover:text-turquoise transition-colors">Char à voile</Link></li>
                     <li><Link href="/activites" className="hover:text-turquoise transition-colors">Paddle & Kayak</Link></li>
                     <li><Link href="/activites" className="hover:text-turquoise transition-colors">Marche Aquatique</Link></li>
                  </ul>
               </div>

               {/* Contact */}
               <div>
                  <h4 className="text-lg font-black uppercase mb-6">Contact</h4>
                  <p className="text-slate-400 font-medium mb-2">Plage Nord, 50230 Agon-Coutainville</p>
                  <p className="text-slate-400 font-medium mb-4">02 33 47 14 81</p>
                  <a href="mailto:contact@cvc.com" className="text-turquoise font-black uppercase text-xs tracking-widest border-b border-turquoise pb-1 hover:text-white hover:border-white transition-colors">
                     Nous écrire
                  </a>
               </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-500">
               <p>© 2024 Club Voile Coutainville. Tous droits réservés.</p>
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
