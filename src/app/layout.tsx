import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import { AnalyticsConsent } from '@/components/analytics-consent';
import { heroProductImage } from '@/lib/product-data';
import { siteOrigin } from '@/lib/site-origin';
import './globals.css';

const manrope = Manrope({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Tramontina Turim 4 Peças Preto | Kynovra Deals',
  description:
    'Jogo de Panelas Tramontina Turim 4 peças preto, ref. 20298044: veja a composição, o Starflon Max e a compatibilidade. Confira preço no Mercado Livre.',
  applicationName: 'Kynovra Deals',
  metadataBase: siteOrigin ?? undefined,
  alternates: siteOrigin ? { canonical: new URL('/', siteOrigin) } : undefined,
  openGraph: {
    title: 'Tramontina Turim 4 Peças Preto | Kynovra Deals',
    description:
      'Quatro peças para diferentes preparos do dia a dia. Consulte as características do modelo 20298044 e confira a oferta no Mercado Livre.',
    siteName: 'Kynovra Deals',
    locale: 'pt_BR',
    type: 'website',
    ...(siteOrigin
      ? {
          url: new URL('/', siteOrigin),
          images: [
            {
              url: new URL(heroProductImage.src, siteOrigin),
              width: heroProductImage.width,
              height: heroProductImage.height,
              alt: 'Jogo de Panelas Tramontina Turim preto com quatro peças.',
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tramontina Turim 4 Peças Preto',
    description:
      'Veja composição, revestimento Starflon Max e compatibilidade do modelo 20298044.',
    ...(siteOrigin
      ? {
          images: [
            {
              url: new URL(heroProductImage.src, siteOrigin),
              alt: 'Jogo de Panelas Tramontina Turim preto com quatro peças.',
            },
          ],
        }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR">
      <body className={`${manrope.variable} ${dmSans.variable}`}>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
