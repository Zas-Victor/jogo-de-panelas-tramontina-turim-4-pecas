import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site-origin';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) {
    return [];
  }

  return [
    {
      url: new URL('/', siteOrigin).toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
