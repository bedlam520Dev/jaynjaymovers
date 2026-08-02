import localFont from 'next/font/local';

export const permanentMarker = localFont({
  src: './PermanentMarker.woff2',
  weight: '400',
  variable: '--font-heading',
});

export const martianGrotesk = localFont({
  src: './MartianGrotesk.woff2',
  weight: '400',
  variable: '--font-sans',
});

export const martianMono = localFont({
  src: './MartianMono.woff2',
  weight: '400',
  variable: '--font-mono',
});
