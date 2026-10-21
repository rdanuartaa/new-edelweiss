'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BookOpen, HelpCircle } from 'lucide-react';
import styles from './BottomNav.module.scss';
import { ROUTES } from '@/constants/routes';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const items = [
    {
      label: 'Beranda',
      href: ROUTES.HOME,
      icon: <Home />,
      isActive: pathname === '/',
    },
    {
      label: 'Paket Tour',
      href: ROUTES.PACKAGES,
      icon: <Compass />,
      isActive: pathname.startsWith('/packages'),
    },
    {
      label: 'Artikel',
      href: ROUTES.ARTICLES,
      icon: <BookOpen />,
      isActive: pathname.startsWith('/articles'),
    },
    {
      label: 'Layanan',
      href: ROUTES.SERVICES,
      icon: <HelpCircle />,
      isActive: pathname.startsWith('/layanan'),
    },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.inner}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
