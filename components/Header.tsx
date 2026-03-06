"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import { SpotStatus } from '../types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoComponent } from './Logo';

interface HeaderProps {
  status?: SpotStatus;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/admin');
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

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
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
        gap: 24,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleNavClick}
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: isActive(item.href) ? '#00c2cb' : '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
            textDecoration: 'none',
          }}
        >
          {item.label}
        </Link>
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
