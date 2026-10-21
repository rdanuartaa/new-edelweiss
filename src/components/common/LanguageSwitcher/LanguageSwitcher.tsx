'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Globe, X, Search, Check, ChevronUp } from 'lucide-react';
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
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    hasMoved: false,
  });

  const getInitialPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 28, y: 500 };
    const isMobile = window.innerWidth <= 768;
    const defaultX = isMobile ? 16 : 28;
    const defaultY = isMobile ? window.innerHeight - 130 : window.innerHeight - 80;
    return { x: defaultX, y: Math.max(20, defaultY) };
  }, []);

  useEffect(() => {
    setPosition(getInitialPosition());
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return getInitialPosition();
        const btnW = buttonRef.current?.offsetWidth || 75;
        const btnH = buttonRef.current?.offsetHeight || 38;
        const clampedX = Math.max(10, Math.min(window.innerWidth - btnW - 10, prev.x));
        const clampedY = Math.max(10, Math.min(window.innerHeight - btnH - 10, prev.y));
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getInitialPosition]);

  useEffect(() => {
    const saved = localStorage.getItem('edelweiss_language');
    if (saved) {
      setSelectedLang(saved);
      return;
    }
    const match = document.cookie.match(/googtrans=\/id\/([^;]+)/);
    if (match && match[1] && match[1] !== 'id') {
      setSelectedLang(match[1]);
    }
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

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const currentX = position?.x ?? (buttonRef.current?.getBoundingClientRect().left || 28);
    const currentY = position?.y ?? (buttonRef.current?.getBoundingClientRect().top || 500);

    dragInfo.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
      hasMoved: false,
    };

    setIsSnapping(false);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragInfo.current.isDragging) return;
      const dx = moveEvent.clientX - dragInfo.current.startX;
      const dy = moveEvent.clientY - dragInfo.current.startY;

      if (!dragInfo.current.hasMoved && Math.hypot(dx, dy) > 5) {
        dragInfo.current.hasMoved = true;
      }

      if (dragInfo.current.hasMoved) {
        const btnW = buttonRef.current?.offsetWidth || 75;
        const btnH = buttonRef.current?.offsetHeight || 38;
        const isMobile = window.innerWidth <= 768;
        const bottomInset = isMobile ? 75 : 10;

        const nextX = Math.max(10, Math.min(window.innerWidth - btnW - 10, dragInfo.current.initX + dx));
        const nextY = Math.max(10, Math.min(window.innerHeight - btnH - bottomInset, dragInfo.current.initY + dy));
        setPosition({ x: nextX, y: nextY });
      }
    };

    const onPointerUp = () => {
      if (!dragInfo.current.isDragging) return;
      dragInfo.current.isDragging = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (!dragInfo.current.hasMoved) {
        setIsOpen(true);
        return;
      }

      const btnW = buttonRef.current?.offsetWidth || 75;
      const isMobile = window.innerWidth <= 768;
      const margin = isMobile ? 16 : 28;

      setPosition((prev) => {
        if (!prev) return null;
        const snapLeft = margin;
        const snapRight = window.innerWidth - btnW - margin;
        const midPoint = window.innerWidth / 2;
        const targetX = prev.x + btnW / 2 < midPoint ? snapLeft : snapRight;

        setIsSnapping(true);
        setTimeout(() => setIsSnapping(false), 360);

        return { x: targetX, y: prev.y };
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang.code);
    setIsOpen(false);

    const targetCode = lang.code;
    const host = window.location.hostname;

    if (targetCode === 'id') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      document.cookie = 'googtrans=/id/id; path=/;';
      localStorage.removeItem('edelweiss_language');
    } else {
      const transValue = `/id/${targetCode}`;
      document.cookie = `googtrans=${transValue}; path=/;`;
      document.cookie = `googtrans=${transValue}; path=/; domain=${host};`;
      localStorage.setItem('edelweiss_language', targetCode);
    }

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = targetCode === 'id' ? '' : targetCode;
      select.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  const handleResetLanguage = () => {
    const idOption = LANGUAGES.find((l) => l.code === 'id');
    if (idOption) {
      handleSelectLanguage(idOption);
    }
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const buttonStyle: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        bottom: 'auto',
        right: 'auto',
      }
    : {};

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />

      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        style={buttonStyle}
        className={`${styles.floatingBtn} ${isSnapping ? styles.snapping : ''}`}
        aria-label="Pilih Bahasa / Select Language"
      >
        <Globe size={16} className={styles.globeIcon} />
        <span className={styles.langText}>{currentOption.code.toUpperCase()}</span>
        <ChevronUp size={13} className={styles.chevronIcon} />
      </button>

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className={styles.modalCard} role="dialog" aria-modal="true">
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
                      <span className={styles.cardFlag}>{lang.flag}</span>
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
              {selectedLang !== 'id' && (
                <button
                  type="button"
                  onClick={handleResetLanguage}
                  className={styles.resetBtn}
                >
                  Reset ke Bahasa Indonesia
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
