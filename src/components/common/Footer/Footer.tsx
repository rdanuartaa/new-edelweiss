import React from 'react';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.scss';
import { BRAND } from '@/constants/brand';
import { ROUTES } from '@/constants/routes';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const footerClass = className ? `${styles.footer} ${className}` : styles.footer;
  return (
    <footer className={footerClass}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <img src={BRAND.LOGO_WHITE} alt={BRAND.NAME} />
          <p className={styles.brandDesc}>{BRAND.DESCRIPTION}</p>
        </div>

        <div className={styles.linksRow}>
          <div>
            <h4 className={styles.colTitle}>Navigasi</h4>
            <ul className={styles.linkList}>
              <li><Link href={ROUTES.HOME} className={styles.linkItem}>Beranda</Link></li>
              <li><Link href={ROUTES.PACKAGES} className={styles.linkItem}>Paket Tour</Link></li>
              <li><Link href={ROUTES.ARTICLES} className={styles.linkItem}>Artikel & Berita</Link></li>
              <li><Link href={ROUTES.SERVICES} className={styles.linkItem}>Layanan Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Destinasi Utama</h4>
            <ul className={styles.linkList}>
              <li><span className={styles.linkItem}>Lava Tour Semeru</span></li>
              <li><span className={styles.linkItem}>Gunung Bromo</span></li>
              <li><span className={styles.linkItem}>Air Terjun Tumpak Sewu</span></li>
              <li><span className={styles.linkItem}>Sumber Urip</span></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className={styles.colTitle}>Kontak & Alamat</h4>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <MapPin size={18} />
              <span>{BRAND.ADDRESS}</span>
            </li>
            <li className={styles.contactItem}>
              <Phone size={18} />
              <a href={`tel:${BRAND.PHONE.replace(/[^0-9+]/g, '')}`} className={styles.contactLink}>
                {BRAND.PHONE}
              </a>
            </li>
            <li className={styles.contactItem}>
              <a
                href={BRAND.SOCIALS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
                aria-label="Instagram Edelweiss Tour"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>{BRAND.SOCIALS.INSTAGRAM_HANDLE}</span>
              </a>
            </li>
            <li className={styles.contactItem}>
              <a
                href={BRAND.SOCIALS.TIKTOK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
                aria-label="TikTok Edelweiss Tour"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.78 4.54 6.16 6.16 0 0 0 1.95-4.53V8.81a8.28 8.28 0 0 0 4.86 1.57V6.93a4.85 4.85 0 0 1-1-.24z" />
                </svg>
                <span>{BRAND.SOCIALS.TIKTOK_HANDLE}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>&copy; {new Date().getFullYear()} {BRAND.NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
};
