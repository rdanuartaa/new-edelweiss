'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Globe, X, Search, Check, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import styles from './LanguageSwitcher.module.scss';
import { LANGUAGES, LanguageOption } from '@/constants/languages';

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean; includedLanguages: string },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export const LanguageSwitcher: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/id\/([^;]+)/);
    if (match && match[1] && match[1] !== 'id') {
      setSelectedLang(match[1]);
      localStorage.setItem('edelweiss_language', match[1]);
      return;
    }

    const saved = localStorage.getItem('edelweiss_language');
    if (saved && saved !== 'id') {
      setSelectedLang(saved);
      return;
    }

    setSelectedLang('id');
    localStorage.removeItem('edelweiss_language');
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'id',
            includedLanguages: 'id,en,de,zh-CN,ja,ko,ar,th,vi,ms,hi,tl',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const sanitizeBody = () => {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      const frames = document.querySelectorAll(
        'iframe.skiptranslate, iframe[id*=":1.container"], .VIpgJd-ZVi9od-ORHb-OEVmcd, body > .skiptranslate'
      );
      frames.forEach((el) => {
        const h = el as HTMLElement;
        h.style.setProperty('display', 'none', 'important');
        h.style.setProperty('visibility', 'hidden', 'important');
      });
    };

    sanitizeBody();
    const observer = new MutationObserver(sanitizeBody);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'], childList: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentOption = useMemo(() => {
    return LANGUAGES.find((lang) => lang.code === selectedLang) ?? LANGUAGES[0];
  }, [selectedLang]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const clearGoogtransCookies = () => {
    const host = window.location.hostname;
    const domainParts = host.split('.');
    const names = ['googtrans'];

    names.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;

      if (domainParts.length >= 2) {
        const rootDomain = domainParts.slice(-2).join('.');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
      }
    });

    localStorage.removeItem('edelweiss_language');
  };

  const setGoogtransCookie = (langCode: string) => {
    const host = window.location.hostname;
    const domainParts = host.split('.');
    const val = `/id/${langCode}`;

    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=${host};`;
    document.cookie = `googtrans=${val}; path=/; domain=.${host};`;

    if (domainParts.length >= 2) {
      const rootDomain = domainParts.slice(-2).join('.');
      document.cookie = `googtrans=${val}; path=/; domain=.${rootDomain};`;
    }

    localStorage.setItem('edelweiss_language', langCode);
  };

  const handleSelectLanguage = (lang: LanguageOption) => {
    setIsOpen(false);

    if (lang.code === 'id') {
      clearGoogtransCookies();
      setSelectedLang('id');
      window.location.reload();
      return;
    }

    if (lang.code === selectedLang) {
      return;
    }

    setSelectedLang(lang.code);
    setGoogtransCookie(lang.code);
    window.location.reload();
  };

  const handleToggleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />

      <button
        type="button"
        onClick={handleToggleOpen}
        className={styles.floatingBtn}
        aria-label="Pilih Bahasa / Select Language"
        aria-expanded={isOpen}
      >
        <span className={styles.langText}>{currentOption.code.slice(0, 2).toUpperCase()}</span>
        <ChevronUp
          size={14}
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.headerTextGroup}>
                <div className={styles.headerTitleRow}>
                  <Globe size={20} className={styles.globeIcon} />
                  <h3 className={styles.modalTitle}>Pilih Bahasa / Language</h3>
                </div>
                <p className={styles.modalSubtitle}>
                  Choose language for Edelweiss Tour & Travel
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Cari bahasa / Search (e.g. English, Japan, Deutsch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.langList}>
              {filteredLanguages.map((lang) => {
                const isActive = lang.code === selectedLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang)}
                    className={`${styles.langCard} ${isActive ? styles.active : ''}`}
                  >
                    <div className={styles.langCardLeft}>
                      <Image
                        src={lang.flagIcon}
                        alt={lang.name}
                        width={28}
                        height={20}
                        className={styles.cardFlagImg}
                        unoptimized
                      />
                      <div className={styles.cardNames}>
                        <span className={styles.nativeName}>{lang.nativeName}</span>
                        <span className={styles.subName}>{lang.name}</span>
                      </div>
                    </div>
                    {isActive && <Check size={18} className={styles.checkIcon} />}
                  </button>
                );
              })}
            </div>

            <div className={styles.modalFooter}>
              <p className={styles.footerNote}>
                Didukung penerjemahan instan multi-bahasa
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
