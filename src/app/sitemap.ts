import { BASE_URL } from '@/lib/constants';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/home',
    '/services',
    '/about',
    '/reviews',
    '/quote',
    '/schedule',
    '/auth/login',
    '/dashboard',
    '/admin-dashboard',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority:
      route === '' ? 1 : route === '/quote' || route === '/schedule' ? 0.9 : 0.6,
  }));
}
