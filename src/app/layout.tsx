import { AppShell } from '@/components/app-shell';
import { Providers } from '@/components/providers';
import { BASE_URL, SITE } from '@/lib/constants';
import type { Metadata, Viewport } from 'next';

import { permanentMarker, martianGrotesk, martianMono } from './fonts/fonts';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE.name} — Professional Moving Company`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'moving company',
    'movers',
    'residential moving',
    'commercial moving',
    'long distance moving',
    'packing services',
    'storage solutions',
    'Salem Oregon',
    'Jay N Jay Movers',
  ],
  authors: [{ name: 'BEDLAM520 Development', url: 'https://github.com/bedlam520Dev' }],
  creator: 'BEDLAM520 Development',
  publisher: 'BEDLAM520 Development',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE.name,
    title: `${SITE.name} — Professional Moving Company`,
    description: SITE.description,
    images: [
      {
        url: '/img/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: `Professional movers from ${SITE.name} carefully wrapping and loading furniture onto a local moving truck.`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Professional Moving Company`,
    description: SITE.description,
    creator: 'BEDLAM520 Development',
    images: [
      {
        url: '/img/twitter-image.jpg',
        width: 1200,
        height: 630,
        alt: `Professional moving services provided by ${SITE.name}.`,
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/img/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/img/apple-icon.png',
  },
  category: 'business',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d5c63' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1a2f' },
  ],
  viewportFit: 'cover',
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      data-scroll-behavior='smooth'
      className={`${permanentMarker.variable} ${martianGrotesk.variable} ${martianMono.variable} antialiased`}
    >
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
