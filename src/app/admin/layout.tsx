'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { ROUTES } from '@/constants/routes';

const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();

  const isLoginPage = pathname === ROUTES.ADMIN.LOGIN;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isLoginPage) {
      router.replace(ROUTES.ADMIN.LOGIN);
    } else if (isAuthenticated && isLoginPage) {
      router.replace(ROUTES.ADMIN.PACKAGES);
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
          gap: 16,
          color: '#64748B',
          fontSize: '0.95rem',
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#63AB45',
            borderRadius: '50%',
            animation: 'adminSpin 0.8s linear infinite',
          }}
        />
        <span>Memeriksa otentikasi admin...</span>
        <style jsx>{`
          @keyframes adminSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminRouteGuard>{children}</AdminRouteGuard>
    </AdminAuthProvider>
  );
}
