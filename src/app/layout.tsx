import './globals.css';

import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { CssBaseline } from '@mui/material';
import { BackgroundSvg } from '@/components/background-svg';
import Menubar from '@/components/ui/menubar';

export const metadata: Metadata = { title: 'E-Confection' };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ overscrollBehavior: 'none', height: '100%' }}>
        <BackgroundSvg />
        <CssBaseline />
        <Providers>
          <div style={{ height: '100%', position: 'relative', zIndex: '500' }}>
            {children}
            <Menubar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
