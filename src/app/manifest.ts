import { BASE_URL, SITE } from '@/lib/constants';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.short_name,
    description: SITE.description,
    start_url: BASE_URL,
    display: 'standalone',
    background_color: '#00000000',
    theme_color: '#ff1414',
    icons: [
      { src: `${BASE_URL}/img/16x16.png`, sizes: '16x16', type: 'image/png' },
      { src: `${BASE_URL}/img/32x32.png`, sizes: '32x32', type: 'image/png' },
      { src: `${BASE_URL}/img/64x64.png`, sizes: '64x64', type: 'image/png' },
      { src: `${BASE_URL}/img/80x80.png`, sizes: '80x80', type: 'image/png' },
      { src: `${BASE_URL}/img/180x180.png`, sizes: '180x180', type: 'image/png' },
      { src: `${BASE_URL}/img/apple-icon.png`, sizes: '180x180', type: 'image/png' },
      { src: `${BASE_URL}/img/192x192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${BASE_URL}/img/200x200.png`, sizes: '200x200', type: 'image/png' },
      { src: `${BASE_URL}/img/512x512.png`, sizes: '512x512', type: 'image/png' },
      { src: `${BASE_URL}/img/825x330.png`, sizes: '825x330', type: 'image/png' },
      { src: `${BASE_URL}/img/logo.svg`, sizes: 'any', type: 'image/svg+xml' },
      {
        src: `${BASE_URL}/img/1024x1024.png`,
        sizes: '1024x1024',
        type: 'image/png',
      },
      { src: `${BASE_URL}/img/1050x700.png`, sizes: '1050x700', type: 'image/png' },
      {
        src: `${BASE_URL}/img/opengraph-image.jpg`,
        sizes: '1200x630',
        type: 'image/jpeg',
      },
      {
        src: `${BASE_URL}/img/twitter-image.jpg`,
        sizes: '1200x630',
        type: 'image/jpeg',
      },
    ],
    categories: ['business', 'lifestyle'],
  };
}
