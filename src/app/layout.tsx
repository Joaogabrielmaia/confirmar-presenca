import type { Metadata } from 'next';
import { Playfair_Display, Great_Vibes, Montserrat } from 'next/font/google';
import { ArranjoFundoPagina } from '@/components/ArranjoFloral';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Confirme sua Presença',
  description: 'Confirmação de presença online',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${greatVibes.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans bg-white text-[#1b365d] selection:bg-[#e2d5b6] selection:text-[#1b365d] relative min-h-screen">
        <ArranjoFundoPagina />
        <main className="min-h-screen flex flex-col items-center justify-center px-3 py-4 sm:p-6 md:p-8 relative z-10 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
