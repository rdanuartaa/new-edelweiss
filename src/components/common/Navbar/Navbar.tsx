'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageCircle, Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { BRAND } from '@/constants/brand';
import { Button } from '@/components/ui/Button/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [stickyState, setStickyState] = useState<'normal' | 'prepared' | 'sticky'>('normal');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 140) {
        setStickyState('sticky');
      } else if (scrollY > 60) {
        setStickyState('prepared');
      } else {
        setStickyState('normal');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${ROUTES.PACKAGES}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getHeaderClass = () => {
    if (stickyState === 'sticky') {
      return 'header-main header-sticky is-sticky';
    }
    if (stickyState === 'prepared') {
      return 'header-main header-sticky';
    }
    return 'header-main header-transparent';
  };

  const navItems = [
    { label: 'Beranda', href: ROUTES.HOME },
    { label: 'Paket Tour', href: ROUTES.PACKAGES },
    { label: 'Artikel & Berita', href: ROUTES.ARTICLES },
    { label: 'Layanan Kami', href: ROUTES.SERVICES },
  ];

  return (
    <header className={getHeaderClass()}>
      <div className="container">
        <div className="header-inner">
          <Link href={ROUTES.HOME} className="logo-container">
            <img src={BRAND.LOGO_WHITE} alt={BRAND.NAME} />
          </Link>

          <form onSubmit={handleSearch} className="mobile-search-form">
            <input
              type="text"
              placeholder="Cari Lava Tour, wisata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <Search className="mobile-search-icon" />
          </form>

          <div className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}

            <form onSubmit={handleSearch} className="nav-search-wrap">
              <input
                type="text"
                placeholder="Cari wisata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nav-search-input"
              />
              <Search className="search-icon" />
            </form>

            <a href={BRAND.SOCIALS.WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="secondary" leftIcon={<MessageCircle size={16} />}>
                Hubungi WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
