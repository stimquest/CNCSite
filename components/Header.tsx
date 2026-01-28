"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SpotStatus } from '../types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '../contexts/ContentContext';

interface HeaderProps {
  // Removed props that are now handled via context/hooks
  status?: SpotStatus; 
}

export const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { spotStatus } = useContent();

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const NAV_ITEMS = [
    { label: 'Accueil', href: '/' },
    { label: 'Activités', href: '/activites' },
    { label: 'L\'École', href: '/ecole-voile' },
    { label: 'Le Club', href: '/club' },
    { label: 'Groupes', href: '/groupes-entreprises' },
    { label: 'Infos', href: '/infos-pratiques' },
  ];

  // Helper to check active state
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-20">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" onClick={handleNavClick} className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 bg-abysse text-white rounded-lg flex items-center justify-center shadow-lg group-hover:bg-turquoise transition-colors">
            <span className="material-symbols-outlined text-2xl">sailing</span>
          </div>
          <div className="leading-none">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-abysse">CNC</h2>
            <p className="text-[10px] font-bold tracking-[0.2em] text-turquoise uppercase">Coutainville</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`text-xs font-extrabold uppercase tracking-widest transition-colors ${
                isActive(item.href) ? 'text-turquoise' : 'text-abysse hover:text-turquoise'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/le-spot" onClick={handleNavClick} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
              Spot <span className="text-green-600">Ouvert</span>
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2 text-abysse" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 bg-abysse z-40 flex flex-col p-8 gap-6 animate-in slide-in-from-right duration-200">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="text-2xl font-black text-white uppercase tracking-tight"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
