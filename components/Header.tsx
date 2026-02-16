"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SpotStatus } from '../types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '../contexts/ContentContext';
import { LogoComponent } from './Logo';

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
    { label: 'Le Spot', href: '/le-spot' },
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" onClick={handleNavClick} className="flex items-center gap-3 shrink-0 group">
            <LogoComponent className="h-12 w-auto text-abysse fill-current transition-colors group-hover:text-turquoise" />
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`text-xs font-extrabold uppercase tracking-widest transition-colors ${isActive(item.href) ? 'text-turquoise' : 'text-abysse hover:text-turquoise'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Empty spacer / Mobile Toggle */}
        <div className="flex-1 flex justify-end">
          <button className="lg:hidden p-2 text-abysse" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-abysse z-40 flex flex-col p-8 gap-6 animate-in slide-in-from-right duration-200">
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
        )
      }
    </header >
  );
};
