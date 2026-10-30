import type { MetadataRoute } from 'next';
import { privacyDisclosureReady } from '@/lib/site-config';
import { siteOrigin } from '@/lib/site-origin';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) {
    return [];
  }

  const pages: MetadataRoute.Sitemap = [
    {
      url: new URL('/', siteOrigin).toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  if (privacyDisclosureReady) {
    pages.push(
      {
        url: new URL('/privacidade', siteOrigin).toString(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
      {
        url: new URL('/cookies', siteOrigin).toString(),
        changeFrequency: 'yearly',
        priority: 0.2,
      },
    );
  }

  return pages;
}
