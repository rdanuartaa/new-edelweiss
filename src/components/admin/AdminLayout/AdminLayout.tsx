'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, BookOpen, ExternalLink, LogOut, ArrowLeft } from 'lucide-react';
import styles from './AdminLayout.module.scss';
import { ROUTES } from '@/constants/routes';
import { BRAND } from '@/constants/brand';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ConfirmModal } from '@/components/common/ConfirmModal/ConfirmModal';

interface AdminLayoutProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  backHref,
  backLabel,
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    {
      label: 'Paket Tour',
      href: ROUTES.ADMIN.PACKAGES,
      icon: <Compass size={19} />,
      isActive: pathname.startsWith('/admin/packages') || pathname === '/admin',
    },
    {
      label: 'Artikel & Berita',
      href: ROUTES.ADMIN.ARTICLES,
      icon: <BookOpen size={19} />,
      isActive: pathname.startsWith('/admin/articles'),
    },
  ];

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
    router.replace(ROUTES.ADMIN.LOGIN);
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const userEmail = user?.email || 'admin@edelweisstour.com';
  const userName = (user?.user_metadata?.name as string) || 'Admin Edelweiss';

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src={BRAND.LOGO_WHITE} alt={BRAND.NAME} />
          <span className={styles.portalBadge}>Admin Panel</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href={ROUTES.HOME} target="_blank" className={styles.footerAction}>
            <ExternalLink size={18} />
            <span>Lihat Website</span>
          </Link>

          <button
            type="button"
            className={`${styles.footerAction} ${styles.logout}`}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={18} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarHeadingGroup}>
            {backHref && (
              <Link href={backHref} className={styles.topbarBackLink} title={backLabel || 'Kembali'}>
                <ArrowLeft size={18} />
                <span>{backLabel || 'Kembali'}</span>
              </Link>
            )}
            <h1 className={styles.topbarTitle}>{title}</h1>
          </div>

          <div className={styles.topbarUser}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userEmail}>{userEmail}</span>
            </div>

            <div className={styles.userAvatar} title={userEmail}>
              {userInitial}
            </div>

            <button
              type="button"
              className={styles.topbarLogout}
              onClick={() => setShowLogoutConfirm(true)}
              title="Keluar Akun"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className={styles.bodyContent}>{children}</div>

        <nav className={styles.mobileBottomBar} aria-label="Navigasi Bawah Admin">
          <Link
            href={ROUTES.ADMIN.PACKAGES}
            className={`${styles.bottomNavItem} ${
              pathname.startsWith('/admin/packages') || pathname === '/admin' ? styles.active : ''
            }`}
          >
            <Compass size={20} />
            <span>Paket Tour</span>
          </Link>

          <Link
            href={ROUTES.ADMIN.ARTICLES}
            className={`${styles.bottomNavItem} ${
              pathname.startsWith('/admin/articles') ? styles.active : ''
            }`}
          >
            <BookOpen size={20} />
            <span>Artikel</span>
          </Link>

          <Link
            href={ROUTES.HOME}
            target="_blank"
            className={styles.bottomNavItem}
          >
            <ExternalLink size={20} />
            <span>Website</span>
          </Link>

          <button
            type="button"
            className={`${styles.bottomNavItem} ${styles.logout}`}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </nav>
      </main>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah kamu yakin ingin keluar dari akun administrator?"
        confirmText="Keluar"
        cancelText="Batal"
        isLoading={isLoggingOut}
      />
    </div>
  );
};
