"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotStatus } from '../types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoComponent } from './Logo';

interface HeaderProps {
  status?: SpotStatus;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/admin');
  };

  const NAV_GROUPS = [
    { label: 'Accueil', href: '/' },
    {
      label: 'Découvrir',
      subItems: [
        { label: 'Le Spot', href: '/le-spot' },
        { label: 'L\'Environnement', href: '/nature' },
        { label: 'Le Blog', href: '/blog' },
      ]
    },
    {
      label: 'L\'École',
      href: '/ecole-voile',
      subItems: [
        { label: 'Présentation', href: '/ecole-voile' },
        { label: 'Stages Vacances', href: '/ecole-voile#stages-vacances' },
        { label: 'Formations Pro', href: '/ecole-voile#formations-pro' },
        { label: 'École à l\'Année', href: '/ecole-voile#ecole-annee' },
        { label: 'Planning & Dispos', href: '/ecole-voile#planning' },
      ]
    },
    { label: 'Activités', href: '/activites' },
    {
      label: 'Groupes',
      href: '/groupes-entreprises',
      subItems: [
        { label: 'Scolaires & ACM', href: '/groupes-entreprises#scolaires' },
        { label: 'Entreprises', href: '/groupes-entreprises#entreprises' },
        { label: 'Particuliers', href: '/groupes-entreprises#particuliers' },
      ]
    },
    {
      label: 'Le Club',
      subItems: [
        { label: 'Le Club', href: '/club' },
        { label: 'Infos Pratiques', href: '/infos-pratiques' },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const isGroupActive = (group: any) => {
    if (group.href && isActive(group.href)) return true;
    if (group.subItems?.some((si: any) => isActive(si.href))) return true;
    return false;
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Portal menu so it escapes header's backdrop-blur stacking context
  const mobileMenu = isMenuOpen && mounted ? createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        top: 64,
        zIndex: 9999,
        backgroundColor: '#002B49',
        display: 'flex',
        flexDirection: 'column',
        padding: 32,
        gap: 16,
        overflowY: 'auto'
      }}
    >
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-4 mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-turquoise/50 border-b border-white/10 pb-2">
            {group.label}
          </div>
          <div className="flex flex-col gap-4 pl-2">
            {group.subItems ? (
              group.subItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="text-xl font-black text-white uppercase tracking-tighter no-underline flex items-center gap-3"
                  style={{ color: isActive(item.href) ? '#00c2cb' : '#ffffff' }}
                >
                  {item.label}
                  {isActive(item.href) && <div className="size-1.5 rounded-full bg-turquoise" />}
                </Link>
              ))
            ) : (
              <Link
                href={group.href!}
                onClick={handleNavClick}
                className="text-xl font-black text-white uppercase tracking-tighter no-underline"
                style={{ color: isActive(group.href!) ? '#00c2cb' : '#ffffff' }}
              >
                {group.label}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">

          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              onClick={handleNavClick}
              onDoubleClick={handleLogoDoubleClick}
              className="flex items-center gap-3 shrink-0 group"
            >
              <LogoComponent className="h-10 w-auto text-abysse fill-current transition-colors group-hover:text-turquoise" />
            </Link>
          </div>

          {/* Center: Desktop Nav with Grouping and Dropdowns */}
          <nav className="hidden lg:flex items-center justify-center gap-4">
            {NAV_GROUPS.map((group) => (
              <div
                key={group.label}
                className="relative h-16 flex items-center"
                onMouseEnter={() => group.subItems && handleMouseEnter(group.label)}
                onMouseLeave={handleMouseLeave}
              >
                {group.href ? (
                  <Link
                    href={group.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                      isGroupActive(group) ? 'text-turquoise' : 'text-abysse hover:bg-slate-50'
                    }`}
                  >
                    {group.label}
                    {group.subItems && <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                      isGroupActive(group) ? 'text-turquoise' : 'text-abysse hover:bg-slate-50'
                    }`}
                  >
                    {group.label}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === group.label && group.subItems && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-0 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden p-2 flex flex-col z-50"
                    >
                      {group.subItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleNavClick}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                            isActive(item.href) ? 'bg-turquoise/10 text-turquoise' : 'text-slate-600 hover:bg-slate-50 hover:text-abysse'
                          }`}
                        >
                          {item.label}
                          {isActive(item.href) && <div className="size-1.5 rounded-full bg-turquoise" />}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right: Mobile Toggle */}
          <div className="flex-1 flex justify-end">
            <button
              className="lg:hidden p-2 text-abysse"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              style={{ position: 'relative', zIndex: 10000 }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenu}
    </>
  );
};
