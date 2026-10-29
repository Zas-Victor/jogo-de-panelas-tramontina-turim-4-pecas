import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site-origin';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    ...(siteOrigin
      ? {
          host: siteOrigin.host,
          sitemap: new URL('/sitemap.xml', siteOrigin).toString(),
        }
      : {}),
  };
}
