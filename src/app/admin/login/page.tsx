'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import styles from './page.module.scss';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ROUTES } from '@/constants/routes';
import { BRAND } from '@/constants/brand';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(ROUTES.ADMIN.PACKAGES);
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Harap isi email dan password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const result = await login(email, password);

    if (result.error) {
      setErrorMessage(
        result.error.includes('Invalid login credentials')
          ? 'Email atau password salah. Silakan coba lagi.'
          : result.error
      );
      setIsSubmitting(false);
      return;
    }

    router.replace(ROUTES.ADMIN.PACKAGES);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <img src={BRAND.LOGO_BLACK} alt={BRAND.NAME} className={styles.logoImage} />
          <div>
            <span className={styles.badge}>Portal Admin</span>
          </div>
          <h1 className={styles.title}>Masuk Admin</h1>
          <p className={styles.subtitle}>Kelola paket tour dan artikel Edelweiss</p>
        </div>

        {errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="admin-email">
              Email Administrator
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="admin-email"
                type="email"
                required
                className={styles.inputField}
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="admin-password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                className={styles.inputField}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <Link href={ROUTES.HOME} className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
