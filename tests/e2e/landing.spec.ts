import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
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
    await expect(page.locator('.privacy-consent')).toHaveCount(0);
    return;
  }

  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.dataset.cookieConsentSettingsReady,
      ),
    )
    .toBe('true');

  const rejectButton = page.getByRole('button', {
    name: 'Rejeitar opcionais',
  });
  if (!(await rejectButton.isVisible().catch(() => false))) {
    return;
  }
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
    await expect(
      page.locator('main img:not(.hero-meta-product-image)'),
    ).toHaveCount(16);

    const testimonialColumns = await page
      .locator('.testimonials-grid')
      .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns);
    const testimonialColumnCount = testimonialColumns.split(' ').length;
    expect(testimonialColumnCount).toBe(
      viewport.width <= 639 ? 1 : viewport.width <= 1023 ? 2 : 3,
    );

    const testimonialTitleLines = await page
      .getByRole('heading', { name: 'Quem comprou, conta como foi' })
      .evaluate((heading) => {
        const range = document.createRange();
        range.selectNodeContents(heading);
        return range.getClientRects().length;
      });
    if (viewport.width >= 1024) {
      expect(testimonialTitleLines).toBe(1);
    }

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
      const heroThumbnail = page.locator('.hero-meta-product-image');
      await expect(heroThumbnail).toBeVisible();
      await expect
        .poll(() =>
          heroThumbnail.evaluate(
            (image: HTMLImageElement) => image.naturalWidth,
          ),
        )
        .toBeGreaterThan(0);
      const heroCtaBounds = await page.locator('.hero-primary').boundingBox();
      if (!heroCtaBounds) {
        throw new Error('Hero CTA should have visible bounds on mobile');
      }
      expect(heroCtaBounds.y + heroCtaBounds.height).toBeLessThanOrEqual(
        viewport.height,
      );
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(stickyCta).toHaveCSS('visibility', 'visible');
    }
  }
});

test('privacy and cookies pages remain responsive at target widths', async ({
  page,
}) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    for (const route of ['/privacidade', '/cookies']) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();

      const documentWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(documentWidth).toBeLessThanOrEqual(viewport.width);
    }
  }
});

test('cookie preferences fit narrow screens and restore keyboard focus', async ({
  page,
}) => {
  test.skip(!consentTestEnabled);

  for (const viewport of viewports.slice(0, 4)) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const trigger = page.getByRole('button', {
      name: 'Personalizar',
      exact: true,
    });
    await expect(
      page.getByRole('button', { name: 'Aceitar opcionais' }),
    ).toBeVisible();
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(
      page.getByRole('heading', { name: 'Preferências de cookies' }),
    ).toBeFocused();

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(documentWidth).toBeLessThanOrEqual(viewport.width);

    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
});

test('first-visit consent actions fit mobile screens without covering the hero CTA', async ({
  page,
}) => {
  test.skip(!consentTestEnabled);

  for (const viewport of viewports.slice(0, 4)) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('kynovra-privacy-consent-v2');
      sessionStorage.removeItem('kynovra-cookie-session-choice-v1');
    });
    await page.reload();

    const panel = page.locator('.privacy-consent');
    await expect(panel).toBeVisible();
    const bounds = await panel.boundingBox();
    if (!bounds) throw new Error('Consent panel should have visible bounds');
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);

    for (const name of [
      'Aceitar opcionais',
      'Rejeitar opcionais',
      'Personalizar',
    ]) {
      const button = page.getByRole('button', { name, exact: true });
      await expect(button).toBeVisible();
      const buttonBounds = await button.boundingBox();
      if (!buttonBounds) {
        throw new Error(`${name} should have visible bounds`);
      }
      expect(buttonBounds.y + buttonBounds.height).toBeLessThanOrEqual(
        bounds.y + bounds.height,
      );
    }

    await expect(page.locator('.mobile-affiliate-bar')).toHaveCSS(
      'visibility',
      'hidden',
    );
    await page.getByRole('button', { name: 'Rejeitar opcionais' }).click();
    await expect(panel).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('.mobile-affiliate-bar')).toHaveCSS(
      'visibility',
      'visible',
    );
  }
});

test('all page images load and have descriptive alternatives', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');

  const images = page.locator('main img:not(.hero-meta-product-image)');
  await expect(images).toHaveCount(16);

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

test('product composition and capacities are visible before the offer CTA', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.locator('.product-intro')).toContainText(
    'quatro peças compactas',
  );
  await expect(page.locator('.product-dimensions')).toHaveText([
    '18 cm · 0,7 L',
    '16 cm · 1,4 L',
    '18 cm · 2 L',
    '12 cm · 1,1 L',
  ]);
  await expect(page.getByRole('link', { name: 'Avaliações' })).toHaveAttribute(
    'href',
    '#depoimentos',
  );
  await expect(
    page.getByText(/não é compatível com indução/i).first(),
  ).toBeVisible();
});

test('testimonial copy, ratings, sources, and photos match the supplied reviews', async ({
  page,
}) => {
  await page.goto('/');
  await rejectOptionalTracking(page);

  const section = page.locator('#depoimentos');
  await expect(
    section.getByRole('heading', { name: 'Quem comprou, conta como foi' }),
  ).toBeVisible();

  const expectedReviews = [
    {
      number: '01',
      text: 'Produto de qualidade, tramontina não tem erro, panelas pequenas pra duas ou três pessoas no máximo.',
      photoCount: 3,
      photoIds: [
        'depoimento-01-foto-01',
        'depoimento-01-foto-02',
        'depoimento-01-foto-03',
      ],
    },
    {
      number: '02',
      text: 'Comprei de presente pra minha filha e ela amou.',
      photoCount: 2,
      photoIds: ['depoimento-02-foto-01', 'depoimento-02-foto-02'],
    },
    {
      number: '03',
      text: 'Material material de alta qualidade. Super indico. São meio pequenas mais são boas as panelas. Top.',
      photoCount: 3,
      photoIds: [
        'depoimento-03-foto-01',
        'depoimento-03-foto-02',
        'depoimento-03-miniatura-video',
      ],
    },
  ];

  const cards = section.locator('.testimonial-card');
  await expect(cards).toHaveCount(3);
  await expect(
    section.getByRole('heading', { name: /Avaliação 0[1-3]/ }),
  ).toHaveCount(0);
  const galleryHeights = await section
    .locator('.testimonial-gallery')
    .evaluateAll((galleries) =>
      galleries.map((gallery) => gallery.getBoundingClientRect().height),
    );
  expect(
    Math.max(...galleryHeights) - Math.min(...galleryHeights),
  ).toBeLessThanOrEqual(1);
  for (let index = 0; index < expectedReviews.length; index += 1) {
    const review = expectedReviews[index];
    const card = cards.nth(index);
    await expect(card.locator('blockquote')).toHaveText(review.text);
    await expect(
      card.getByRole('img', { name: '5 de 5 estrelas' }),
    ).toBeVisible();
    await expect(
      card.getByText('Fonte: avaliação publicada no Mercado Livre.'),
    ).toBeVisible();
    await expect(
      card.getByTestId(`testimonial-gallery-${review.number}`),
    ).toHaveAttribute('data-photo-count', String(review.photoCount));
    await expect(card.locator('.testimonial-gallery-button')).toHaveCount(
      review.photoCount,
    );
    await expect(
      card
        .locator('.testimonial-gallery-button')
        .evaluateAll((buttons) =>
          buttons.map((button) => button.getAttribute('data-photo-id')),
        ),
    ).resolves.toEqual(review.photoIds);
  }

  await expect(section.locator('video')).toHaveCount(0);
  await expect(
    section.getByText('Miniatura estática', { exact: true }),
  ).toBeVisible();
  await expect(section.getByText(/não realizou essas vendas/)).toBeVisible();

  const productJsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(productJsonLd).not.toContain('AggregateRating');
  expect(productJsonLd).not.toContain('review');
});

test('testimonial lightbox supports keyboard navigation, Escape, and focus return', async ({
  page,
}) => {
  await page.goto('/');
  await rejectOptionalTracking(page);

  const photoButton = page
    .getByTestId('testimonial-gallery-01')
    .locator('button')
    .first();
  await photoButton.scrollIntoViewIfNeeded();
  await photoButton.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('button', { name: 'Fechar visualização da foto' }),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    dialog.getByRole('button', { name: 'Próxima foto' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    dialog.getByRole('button', { name: 'Fechar visualização da foto' }),
  ).toBeFocused();
  await expect
    .poll(() =>
      dialog
        .locator('img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  const imageRatio = await dialog
    .locator('img')
    .evaluate((image: HTMLImageElement) => {
      const bounds = image.getBoundingClientRect();
      return bounds.width / bounds.height;
    });
  const naturalImageRatio = await dialog
    .locator('img')
    .evaluate(
      (image: HTMLImageElement) => image.naturalWidth / image.naturalHeight,
    );
  expect(imageRatio).toBeCloseTo(naturalImageRatio, 2);
  await page.keyboard.press('ArrowRight');
  await expect(
    dialog.locator('.testimonial-lightbox-navigation [aria-live]'),
  ).toHaveText('Foto 2 de 3');
  await page.keyboard.press('ArrowLeft');
  await expect(
    dialog.locator('.testimonial-lightbox-navigation [aria-live]'),
  ).toHaveText('Foto 1 de 3');
  await dialog.getByRole('button', { name: 'Próxima foto' }).click();
  await expect(
    dialog.locator('.testimonial-lightbox-navigation [aria-live]'),
  ).toHaveText('Foto 2 de 3');

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(photoButton).toBeFocused();
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
  const placements = await affiliateLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute('data-affiliate-placement')),
  );
  expect(new Set(placements)).toEqual(
    new Set([
      'header',
      'hero',
      'product-summary',
      'product-details',
      'final-cta',
      'mobile-sticky',
    ]),
  );
  await expect(affiliateLinks.first()).toHaveAccessibleName(
    'Conferir preço no Mercado Livre',
  );
  await expect(affiliateLinks.first()).toHaveAttribute('target', '_blank');
  await expect(affiliateLinks.first()).toHaveAttribute(
    'rel',
    'sponsored nofollow noopener noreferrer',
  );
});

test('metadata, canonical, sitemap, and robots resolve for the Netlify origin', async ({
  page,
  request,
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  test.skip(!siteUrl);
  if (!siteUrl) return;

  await page.goto('/');
  const expectedOrigin = new URL(siteUrl).origin;

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
  await expect(questions).toHaveCount(6);
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

  await page
    .locator('.footer-nav')
    .getByRole('link', { name: 'Política de privacidade' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Aviso de Privacidade' }),
  ).toBeVisible();

  await expect(page.getByText('Documento preliminar')).toHaveCount(0);
  await expect(page.getByText(/Controlador:/)).toBeVisible();
  await expect(page.getByText(/Vercel/)).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Aviso de privacidade da Netlify' }),
  ).toBeVisible();
  if (consentTestEnabled) {
    await page
      .getByRole('button', { name: 'Alterar consentimento' })
      .last()
      .click();
    await expect(
      page.getByRole('heading', { name: 'Preferências de cookies' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Alterar consentimento' }).last(),
    ).toBeFocused();
  } else {
    await expect(
      page.getByRole('button', { name: 'Alterar consentimento' }),
    ).toHaveCount(0);
  }

  await page
    .locator('.footer-nav')
    .getByRole('link', { name: 'Política de cookies' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Política de Cookies' }),
  ).toBeVisible();
  if (consentTestEnabled) {
    await expect(page.getByText('kynovra-privacy-consent-v2')).toHaveCount(0);
  } else {
    await expect(
      page.getByText(/não mostramos um painel de consentimento/i),
    ).toBeVisible();
  }
});

test('unavailable trackers do not show a consent prompt or store a stale choice', async ({
  page,
}) => {
  test.skip(analyticsTestEnabled || marketingTestEnabled);
  const trackerRequests: string[] = [];
  page.on('request', (request) => {
    if (
      request.url().startsWith('https://www.googletagmanager.com/') ||
      request.url().startsWith('https://connect.facebook.net/')
    ) {
      trackerRequests.push(request.url());
    }
  });
  await page.addInitScript(() => {
    localStorage.setItem(
      'kynovra-privacy-consent-v2',
      JSON.stringify({ version: 2, analytics: true, marketing: true }),
    );
    sessionStorage.setItem('kynovra-cookie-session-choice-v1', '1');
  });
  await page.goto('/');

  await expect(page.locator('.privacy-consent')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Alterar consentimento' }),
  ).toHaveCount(0);
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);
  expect(trackerRequests).toEqual([]);
  await expect
    .poll(() =>
      page.evaluate(() => ({
        gtag: typeof window.gtag,
        fbq: typeof window.fbq,
      })),
    )
    .toEqual({ gtag: 'undefined', fbq: 'undefined' });
  await expect
    .poll(() =>
      page.evaluate(() => ({
        local: localStorage.getItem('kynovra-privacy-consent-v2'),
        session: sessionStorage.getItem('kynovra-privacy-consent-v2'),
        sessionChoice: sessionStorage.getItem(
          'kynovra-cookie-session-choice-v1',
        ),
      })),
    )
    .toEqual({ local: null, session: null, sessionChoice: null });
  await expect(
    page.getByRole('link', { name: 'Conferir preço no Mercado Livre' }).first(),
  ).toBeVisible();
});

test('tracking integrations unavailable keeps optional tags disabled and clears old preferences', async ({
  page,
}) => {
  test.skip(analyticsTestEnabled || marketingTestEnabled);
  await page.addInitScript(() => {
    localStorage.setItem(
      'kynovra-privacy-consent-v2',
      JSON.stringify({ version: 2, analytics: true, marketing: true }),
    );
  });

  await page.goto('/');
  await expect(page.locator('.privacy-consent')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Alterar consentimento' }),
  ).toHaveCount(0);
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem('kynovra-privacy-consent-v2')),
    )
    .toBeNull();
});

test('return session restores independent consent choices for confirmation or change', async ({
  page,
}) => {
  test.skip(!consentTestEnabled);
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.abort(),
  );
  await page.route('https://connect.facebook.net/**', (route) => route.abort());

  await page.goto('/');
  await page.getByRole('button', { name: 'Personalizar' }).click();
  if (analyticsTestEnabled) {
    await page.getByRole('checkbox', { name: /Analytics/ }).check();
  }
  if (marketingTestEnabled) {
    await page.getByRole('checkbox', { name: /Marketing/ }).uncheck();
  }
  if (!analyticsTestEnabled) {
    await expect(page.getByRole('checkbox', { name: /Analytics/ })).toHaveCount(
      0,
    );
  }
  if (!marketingTestEnabled) {
    await expect(page.getByRole('checkbox', { name: /Marketing/ })).toHaveCount(
      0,
    );
  }
  await page.getByRole('button', { name: 'Salvar preferências' }).click();

  const savedChoice = await page.evaluate(() =>
    localStorage.getItem('kynovra-privacy-consent-v2'),
  );
  expect(savedChoice).toContain(
    `"analytics":${analyticsTestEnabled ? 'true' : 'false'}`,
  );
  expect(savedChoice).toContain('"marketing":false');

  await page.evaluate(() =>
    sessionStorage.removeItem('kynovra-cookie-session-choice-v1'),
  );
  await page.reload();

  await expect(
    page.getByRole('heading', { name: 'Revise suas preferências' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      new RegExp(
        `Analytics: ${analyticsTestEnabled ? 'autorizado' : 'recusado'}; Marketing: recusado`,
      ),
    ),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Personalizar' }).click();
  if (analyticsTestEnabled) {
    await expect(
      page.getByRole('checkbox', { name: /Analytics/ }),
    ).toBeChecked();
  } else {
    await expect(page.getByRole('checkbox', { name: /Analytics/ })).toHaveCount(
      0,
    );
  }
  if (marketingTestEnabled) {
    await expect(
      page.getByRole('checkbox', { name: /Marketing/ }),
    ).not.toBeChecked();
  } else {
    await expect(page.getByRole('checkbox', { name: /Marketing/ })).toHaveCount(
      0,
    );
  }
});

test('consent falls back to session storage when localStorage is unavailable', async ({
  page,
}) => {
  test.skip(!consentTestEnabled);

  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (
        this === window.localStorage &&
        key === 'kynovra-privacy-consent-v2'
      ) {
        throw new DOMException('Storage blocked', 'SecurityError');
      }
      return originalSetItem.call(this, key, value);
    };
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Rejeitar opcionais' }).click();

  const storedChoice = await page.evaluate(() =>
    sessionStorage.getItem('kynovra-privacy-consent-v2'),
  );
  expect(storedChoice).toContain('"analytics":false');
  expect(storedChoice).toContain('"marketing":false');

  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Rejeitar opcionais' }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Alterar consentimento' }),
  ).toBeVisible();
  await expect(page.locator('#kynovra-ga4-script')).toHaveCount(0);
  await expect(page.locator('#kynovra-meta-pixel-script')).toHaveCount(0);
});

test('consent rejection keeps both optional trackers unloaded', async ({
  page,
}) => {
  test.skip(!analyticsTestEnabled || !marketingTestEnabled);
  const trackerRequests: string[] = [];
  page.on('request', (request) => {
    if (
      request.url().startsWith('https://www.googletagmanager.com/') ||
      request.url().startsWith('https://connect.facebook.net/')
    ) {
      trackerRequests.push(request.url());
    }
  });
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
  expect(trackerRequests).toEqual([]);

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

  const affiliateEvents = await page.evaluate(() => {
    const entries =
      (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [];
    return entries.filter(
      (entry) =>
        entry[0] === 'event' && entry[1] === 'affiliate_outbound_click',
    );
  });
  expect(affiliateEvents).toHaveLength(1);
  expect(affiliateEvents[0]?.[2]).toMatchObject({ cta_position: 'header' });
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
    return (
      queue?.filter(
        (entry) =>
          entry[0] === 'trackCustom' && entry[1] === 'AffiliateOutboundClick',
      ) ?? []
    );
  });
  expect(outboundEvents).toHaveLength(1);
  expect(outboundEvents[0]?.[2]).toMatchObject({ cta_position: 'header' });

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
  await page.getByRole('button', { name: 'Alterar consentimento' }).click();
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
