import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 960 },
];

const privacyConfigPresent = Boolean(
  process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME &&
    process.env.NEXT_PUBLIC_PRIVACY_RETENTION_SUMMARY &&
    process.env.NEXT_PUBLIC_PRIVACY_TRANSFER_SUMMARY &&
    process.env.NEXT_PUBLIC_PRIVACY_TECHNICAL_LOGS_SUMMARY &&
    process.env.NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED === 'true',
);
const analyticsTestEnabled = Boolean(
  privacyConfigPresent && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
);
const marketingTestEnabled = Boolean(
  privacyConfigPresent && process.env.NEXT_PUBLIC_META_PIXEL_ID,
);
const consentTestEnabled = Boolean(
  privacyConfigPresent && (analyticsTestEnabled || marketingTestEnabled),
);

async function rejectOptionalTracking(page: import('@playwright/test').Page) {
  if (!consentTestEnabled) {
    return;
  }

  const hasSavedChoice = await page.evaluate(() =>
    localStorage.getItem('kynovra-privacy-consent-v2'),
  );
  if (hasSavedChoice) {
    return;
  }

  const rejectButton = page.getByRole('button', {
    name: 'Rejeitar opcionais',
  });

  await expect(rejectButton).toBeVisible();
  await rejectButton.click();
}

async function triggerAffiliateClick(page: import('@playwright/test').Page) {
  await page.context().route('https://meli.la/**', (route) => route.abort());
  const popupPromise = page.waitForEvent('popup');
  await page.locator('a[data-affiliate-cta="mercadolivre"]').first().click();
  const popup = await popupPromise;
  await popup.close();
}

test('renders the landing page without horizontal overflow', async ({
  page,
}) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await rejectOptionalTracking(page);

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Jogo de Panelas Tramontina Turim 4 peças',
    );
    await expect(page.locator('main img')).toHaveCount(8);

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(documentWidth).toBeLessThanOrEqual(viewport.width);

    const headerCta = page.locator('.site-header .header-cta');
    await expect(headerCta).toBeVisible();
    await expect(page.locator('.mobile-affiliate-bar')).toHaveCSS(
      'display',
      viewport.width <= 639 ? 'flex' : 'none',
    );

    if (viewport.width <= 639) {
      const stickyCta = page.locator('.mobile-affiliate-bar');
      await expect(stickyCta).toHaveCSS('visibility', 'hidden');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(stickyCta).toHaveCSS('visibility', 'visible');
    }
  }
});

test('all page images load and have descriptive alternatives', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');

  const images = page.locator('main img');
  await expect(images).toHaveCount(8);

  for (let index = 0; index < (await images.count()); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.complete))
      .toBe(true);
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);
    await expect(image).not.toHaveAttribute('alt', '');
  }
});

test('key text colors meet WCAG AA contrast on their rendered backgrounds', async ({
  page,
}) => {
  await page.goto('/');

  const contrastChecks = await page.evaluate(() => {
    const getRgb = (color: string) => {
      const match = color.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const [red, green, blue, alpha = '1'] = match[1]
        .split(',')
        .map((channel) => channel.trim());
      if (Number(alpha) === 0) return null;
      return [Number(red), Number(green), Number(blue)];
    };
    const luminance = (color: number[]) => {
      const linear = color.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const ratio = (foreground: number[], background: number[]) => {
      const [lighter, darker] = [
        luminance(foreground),
        luminance(background),
      ].sort((left, right) => right - left);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const selectors = [
      '.eyebrow:not(.eyebrow-light)',
      '.section-lead',
      '.assurance-item small',
      '.hero-card-topline span:last-child',
      '.product-index',
      '.product-use',
      '.packaging-figure figcaption',
      '.reference-note',
      '.footer-bottom',
    ];
    const checks: Array<{ selector: string; ratio: number }> = [];

    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        const foreground = getRgb(getComputedStyle(element).color);
        let ancestor: Element | null = element;
        let background: number[] | null = null;

        while (ancestor && !background) {
          background = getRgb(getComputedStyle(ancestor).backgroundColor);
          ancestor = ancestor.parentElement;
        }

        if (foreground && background) {
          checks.push({ selector, ratio: ratio(foreground, background) });
        }
      }
    }

    return checks;
  });

  expect(contrastChecks.length).toBeGreaterThan(0);
  expect(contrastChecks.filter((check) => check.ratio < 4.5)).toEqual([]);
});

test('FAQ disclosures expand using native details behavior', async ({
  page,
}) => {
  await page.goto('/');
  await rejectOptionalTracking(page);

  const firstQuestion = page.locator('.faq-item').first();
  await firstQuestion.locator('summary').click();
  await expect(firstQuestion).toHaveAttribute('open', '');
});

test('affiliate actions use the official short URL unchanged', async ({
  page,
}) => {
  await page.goto('/');

  const affiliateLinks = page.locator('a[data-affiliate-cta="mercadolivre"]');
  const destinations = await affiliateLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  );

  expect(destinations.length).toBeGreaterThan(0);
  expect(new Set(destinations)).toEqual(new Set(['https://meli.la/1REfxSi']));
  await expect(affiliateLinks.first()).toHaveAccessibleName(
    'Conferir preço no Mercado Livre',
  );
  await expect(affiliateLinks.first()).toHaveAttribute('target', '_blank');
  await expect(affiliateLinks.first()).toHaveAttribute(
    'rel',
    'sponsored nofollow noopener noreferrer',
  );
});

test('metadata, canonical, sitemap, and robots resolve for the Vercel origin', async ({
  page,
  request,
}) => {
  test.skip(
    !process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      !process.env.NEXT_PUBLIC_SITE_URL,
  );

  await page.goto('/');
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  await expect(page).toHaveTitle(/Tramontina Turim 4 Peças Preto/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Confira preço no Mercado Livre/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    expectedOrigin,
  );

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(`${expectedOrigin}/`);

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(`${expectedOrigin}/sitemap.xml`);
});

test('in-page links resolve and the complete FAQ is keyboard operable', async ({
  page,
}) => {
  await page.goto('/');

  const missingTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href')?.slice(1))
        .filter((target) => target && !document.getElementById(target)),
    );
  expect(missingTargets).toEqual([]);

  const questions = page.locator('.faq-item');
  await expect(questions).toHaveCount(8);
  for (let index = 0; index < (await questions.count()); index += 1) {
    const question = questions.nth(index);
    await question.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(question).toHaveAttribute('open', '');
    await expect(question.locator('.faq-answer')).toBeVisible();
  }
});

test('privacy and cookies routes are reachable and the settings panel is keyboard accessible', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused();
  await rejectOptionalTracking(page);

  await page.getByRole('link', { name: 'Política de privacidade' }).click();
  await expect(
    page.getByRole('heading', { name: 'Aviso de Privacidade' }),
  ).toBeVisible();

  await expect(page.getByText('Documento preliminar')).toBeVisible();
  await page
    .getByRole('button', { name: 'Preferências de cookies' })
    .last()
    .click();
  await expect(
    page.getByRole('heading', { name: 'Preferências de cookies' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Preferências de cookies' }).last(),
  ).toBeFocused();

  await page
    .locator('.footer-nav')
    .getByRole('link', { name: 'Política de cookies' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Política de Cookies' }),
  ).toBeVisible();
  await expect(page.getByText('kynovra-privacy-consent-v2')).toBeVisible();
});

test('cookie preferences remain available without tracker IDs and keep scripts unloaded', async ({
  page,
}) => {
  test.skip(analyticsTestEnabled || marketingTestEnabled);
  await page.goto('/');

  await page.getByRole('button', { name: 'Preferências de cookies' }).click();
  await expect(
    page.getByRole('heading', { name: 'Preferências de cookies' }),
  ).toBeVisible();
  await expect(
    page.getByRole('checkbox', { name: /Analytics/ }),
  ).toBeDisabled();
  await expect(
    page.getByRole('checkbox', { name: /Marketing/ }),
  ).toBeDisabled();
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);

  await page.getByRole('button', { name: 'Salvar preferências' }).click();
  const storedChoice = await page.evaluate(() =>
    localStorage.getItem('kynovra-privacy-consent-v2'),
  );
  expect(storedChoice).toContain('"analytics":false');
  expect(storedChoice).toContain('"marketing":false');
});

test('consent rejection keeps both optional trackers unloaded', async ({
  page,
}) => {
  test.skip(!analyticsTestEnabled || !marketingTestEnabled);
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.abort(),
  );
  await page.route('https://connect.facebook.net/**', (route) => route.abort());

  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Rejeitar opcionais' }),
  ).toBeVisible();
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);

  await page.getByRole('button', { name: 'Rejeitar opcionais' }).click();
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);

  const storedChoice = await page.evaluate(() =>
    localStorage.getItem('kynovra-privacy-consent-v2'),
  );
  expect(storedChoice).toContain('"analytics":false');
  expect(storedChoice).toContain('"marketing":false');

  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Aceitar opcionais' }),
  ).toHaveCount(0);
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);
});

test('analytics consent records product and affiliate clicks with UTMs', async ({
  page,
}) => {
  test.skip(!analyticsTestEnabled);
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.abort(),
  );
  await page.route('https://connect.facebook.net/**', (route) => route.abort());

  await page.goto(
    '/?utm_source=instagram&utm_medium=paid_social&utm_campaign=turim&utm_content=story-01',
  );
  await expect(
    page.locator('a[data-affiliate-cta="mercadolivre"]').first(),
  ).toHaveAttribute('href', 'https://meli.la/1REfxSi');
  await page.getByRole('button', { name: 'Personalizar' }).click();
  await page.getByRole('checkbox', { name: /Analytics/ }).check();
  if (marketingTestEnabled) {
    await page.getByRole('checkbox', { name: /Marketing/ }).uncheck();
  }
  await page.getByRole('button', { name: 'Salvar preferências' }).click();

  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(1);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);

  const viewItem = await page.evaluate(() => {
    const entries =
      (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [];
    const event = entries.find(
      (entry) => entry[0] === 'event' && entry[1] === 'view_item',
    );
    return event?.[2] as Record<string, unknown> | undefined;
  });
  expect(viewItem).toMatchObject({
    campaign_source: 'instagram',
    campaign_medium: 'paid_social',
    campaign_name: 'turim',
    campaign_content: 'story-01',
  });

  await triggerAffiliateClick(page);

  await expect
    .poll(() =>
      page.evaluate(() => {
        const entries =
          (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [];
        return entries.some(
          (entry) =>
            entry[0] === 'event' && entry[1] === 'affiliate_outbound_click',
        );
      }),
    )
    .toBe(true);

  const gaEventNames = await page.evaluate(() => {
    const entries =
      (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [];
    return entries
      .filter((entry) => entry[0] === 'event')
      .map((entry) => entry[1]);
  });
  expect(gaEventNames).not.toContain('purchase');
});

test('marketing consent records Meta view and affiliate events without GA4', async ({
  page,
}) => {
  test.skip(!marketingTestEnabled);
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.abort(),
  );
  await page.route('https://connect.facebook.net/**', (route) => route.abort());

  await page.goto('/?utm_source=facebook&utm_content=carousel-02');
  await page.getByRole('button', { name: 'Personalizar' }).click();
  if (analyticsTestEnabled) {
    await page.getByRole('checkbox', { name: /Analytics/ }).uncheck();
  }
  await page.getByRole('checkbox', { name: /Marketing/ }).check();
  await page.getByRole('button', { name: 'Salvar preferências' }).click();

  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(1);
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);

  const viewContent = await page.evaluate(() => {
    const queue = (window as Window & { fbq?: { queue: unknown[][] } }).fbq
      ?.queue;
    return queue?.find(
      (entry) => entry[0] === 'track' && entry[1] === 'ViewContent',
    )?.[2] as Record<string, unknown> | undefined;
  });
  expect(viewContent).toMatchObject({
    content_ids: ['20298044'],
    utm_source: 'facebook',
    utm_content: 'carousel-02',
  });

  await triggerAffiliateClick(page);

  const outboundEvents = await page.evaluate(() => {
    const queue = (window as Window & { fbq?: { queue: unknown[][] } }).fbq
      ?.queue;
    return queue?.filter(
      (entry) =>
        entry[0] === 'trackCustom' && entry[1] === 'AffiliateOutboundClick',
    ).length;
  });
  expect(outboundEvents).toBe(1);

  const hasPurchaseEvent = await page.evaluate(() => {
    const queue = (window as Window & { fbq?: { queue: unknown[][] } }).fbq
      ?.queue;
    return queue?.some(
      (entry) => entry[0] === 'track' && entry[1] === 'Purchase',
    );
  });
  expect(hasPurchaseEvent).toBeFalsy();
});

test('revoking categories blocks future tracking and clears known first-party identifiers', async ({
  page,
}) => {
  test.skip(!consentTestEnabled);
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.abort(),
  );
  await page.route('https://connect.facebook.net/**', (route) => route.abort());

  await page.goto('/');
  await page.getByRole('button', { name: 'Aceitar opcionais' }).click();
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(
    analyticsTestEnabled ? 1 : 0,
  );
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(
    marketingTestEnabled ? 1 : 0,
  );

  await page.context().addCookies([
    { name: '_ga', value: 'test', url: 'http://127.0.0.1:3000' },
    { name: '_fbp', value: 'test', url: 'http://127.0.0.1:3000' },
  ]);
  await page.getByRole('button', { name: 'Preferências de cookies' }).click();
  if (analyticsTestEnabled) {
    await page.getByRole('checkbox', { name: /Analytics/ }).uncheck();
  }
  if (marketingTestEnabled) {
    await page.getByRole('checkbox', { name: /Marketing/ }).uncheck();
  }
  await page.getByRole('button', { name: 'Salvar preferências' }).click();

  await expect
    .poll(() => page.evaluate(() => document.cookie))
    .not.toContain('_ga=');
  await expect
    .poll(() => page.evaluate(() => document.cookie))
    .not.toContain('_fbp=');

  const deniedAnalytics = await page.evaluate(() => {
    const entries =
      (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [];
    return entries.some(
      (entry) =>
        entry[0] === 'consent' &&
        entry[1] === 'update' &&
        (entry[2] as Record<string, unknown>).analytics_storage === 'denied',
    );
  });
  if (analyticsTestEnabled) {
    expect(deniedAnalytics).toBe(true);
  }

  const revokedMarketing = await page.evaluate(() => {
    const queue = (window as Window & { fbq?: { queue: unknown[][] } }).fbq
      ?.queue;
    return queue?.some(
      (entry) => entry[0] === 'consent' && entry[1] === 'revoke',
    );
  });
  if (marketingTestEnabled) {
    expect(revokedMarketing).toBe(true);
  }
});
