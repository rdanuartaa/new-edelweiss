import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { BRAND } from '@/constants/brand';
import { BottomNav } from '@/components/common/BottomNav/BottomNav';

export const metadata: Metadata = {
  title: `${BRAND.NAME} - ${BRAND.TAGLINE}`,
  description: BRAND.DESCRIPTION,
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
      </body>
    </html>
  );
}
