const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function getSiteOrigin(value: string | undefined): URL | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    return url.protocol === 'https:' ? new URL(url.origin) : null;
  } catch {
    return null;
  }
}

export const siteOrigin = getSiteOrigin(configuredSiteUrl);
