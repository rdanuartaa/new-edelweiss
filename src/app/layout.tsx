import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Prompt } from 'next/font/google';
import '@/styles/globals.scss';
import { BRAND } from '@/constants/brand';
import { BottomNav } from '@/components/common/BottomNav/BottomNav';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher/LanguageSwitcher';
import { TranslationPatch } from '@/components/common/TranslationPatch/TranslationPatch';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const prompt = Prompt({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-prompt',
  display: 'swap',
});

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
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${prompt.variable}`}
    >
      <body suppressHydrationWarning>
        <TranslationPatch />
        {children}
        <BottomNav />
        <LanguageSwitcher />
      </body>
    </html>
  );
}
