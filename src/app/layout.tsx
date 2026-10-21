import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { BRAND } from '@/constants/brand';
import { BottomNav } from '@/components/common/BottomNav/BottomNav';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher/LanguageSwitcher';

export const metadata: Metadata = {
  title: `${BRAND.NAME} - ${BRAND.TAGLINE}`,
  description: BRAND.DESCRIPTION,
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/images/logoicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        {children}
        <BottomNav />
        <LanguageSwitcher />
      </body>
    </html>
  );
}
