'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ga4MeasurementId,
  mercadolivreAffiliateUrl,
  metaPixelId,
  privacyDisclosureReady,
} from '@/lib/site-config';

const consentStorageKey = 'kynovra-privacy-consent-v1';
const openConsentEvent = 'kynovra:open-consent-settings';
const hasAnalytics = Boolean(ga4MeasurementId && privacyDisclosureReady);
const hasMarketing = Boolean(metaPixelId && privacyDisclosureReady);
const hasOptionalTrackers = hasAnalytics || hasMarketing;
const configuredServices = [
  hasAnalytics ? 'Google Analytics 4' : null,
  hasMarketing ? 'Meta Pixel' : null,
]
  .filter(Boolean)
  .join(' e ');

type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = ConsentChoice & {
  version: 1;
};

type CampaignParameters = Record<string, string>;

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  push?: MetaPixelFunction;
  queue: unknown[][];
  version?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[][];
    fbq?: MetaPixelFunction;
    gtag?: (...args: unknown[]) => void;
    _fbq?: MetaPixelFunction;
    kynovraMetaPixelId?: string;
  }
}

const utmKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
] as const;

function getCampaignParameters(): CampaignParameters {
  const query = new URLSearchParams(window.location.search);
  const parameters: CampaignParameters = {};

  for (const key of utmKeys) {
    const value = query.get(key)?.trim();

    if (
      value &&
      value.length <= 100 &&
      !Array.from(value).some((character) => {
        const code = character.charCodeAt(0);
        return code < 32 || code === 127;
      })
    ) {
      parameters[key] = value;
    }
  }

  return parameters;
}

function getGaCampaignParameters(
  parameters: CampaignParameters,
): CampaignParameters {
  const gaNames: Record<(typeof utmKeys)[number], string> = {
    utm_source: 'campaign_source',
    utm_medium: 'campaign_medium',
    utm_campaign: 'campaign_name',
    utm_content: 'campaign_content',
    utm_term: 'campaign_term',
    utm_id: 'campaign_id',
  };

  return Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [
      gaNames[key as (typeof utmKeys)[number]],
      value,
    ]),
  );
}

function getPageLocation(parameters: CampaignParameters): string {
  const page = new URL(window.location.pathname, window.location.origin);

  for (const [key, value] of Object.entries(parameters)) {
    page.searchParams.set(key, value);
  }

  return `${page.toString()}${window.location.hash}`;
}

function getGoogleAnalytics(measurementId: string) {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };

    const script = document.createElement('script');
    script.async = true;
    script.id = 'kynovra-ga4-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);

    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  return window.gtag;
}

function getMetaPixel(): MetaPixelFunction {
  if (window.fbq) {
    return window.fbq;
  }

  const pixel = ((...args: unknown[]) => {
    if (pixel.callMethod) {
      pixel.callMethod(...args);
    } else {
      pixel.queue.push(args);
    }
  }) as MetaPixelFunction;

  pixel.queue = [];
  pixel.push = pixel;
  pixel.loaded = true;
  pixel.version = '2.0';
  window.fbq = pixel;
  window._fbq = pixel;

  const script = document.createElement('script');
  script.async = true;
  script.id = 'kynovra-meta-pixel-script';
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.append(script);

  return pixel;
}

function readStoredConsent(): ConsentChoice | null {
  try {
    const storedValue = localStorage.getItem(consentStorageKey);

    if (!storedValue) {
      return null;
    }

    const parsed = JSON.parse(storedValue) as Partial<StoredConsent>;

    if (
      parsed.version !== 1 ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean'
    ) {
      return null;
    }

    return {
      analytics: parsed.analytics && hasAnalytics,
      marketing: parsed.marketing && hasMarketing,
    };
  } catch {
    return null;
  }
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);
  const [marketingDraft, setMarketingDraft] = useState(false);

  useEffect(() => {
    if (hasOptionalTrackers) {
      setConsent(readStoredConsent());
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      setAnalyticsDraft(consent?.analytics ?? false);
      setMarketingDraft(consent?.marketing ?? false);
      setPreferencesOpen(true);
    };

    window.addEventListener(openConsentEvent, openPreferences);
    return () => window.removeEventListener(openConsentEvent, openPreferences);
  }, [consent]);

  useEffect(() => {
    if (!consent) {
      return;
    }

    window.gtag?.('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    if (window.fbq && !consent.marketing) {
      window.fbq('consent', 'revoke');
    }
  }, [consent]);

  useEffect(() => {
    if (!consent?.analytics || !hasAnalytics || !ga4MeasurementId) {
      return;
    }

    const gtag = getGoogleAnalytics(ga4MeasurementId);
    const campaign = getCampaignParameters();
    const campaignData = getGaCampaignParameters(campaign);

    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    gtag('event', 'page_view', {
      page_location: getPageLocation(campaign),
      page_title: document.title,
      ...campaignData,
    });

    if (pathname === '/') {
      gtag('event', 'view_item', {
        items: [
          {
            item_id: '20298044',
            item_name: 'Jogo de Panelas Tramontina Turim 4 Peças Preto',
            item_brand: 'Tramontina',
            item_category: 'Jogo de panelas',
          },
        ],
        ...campaignData,
      });
    }
  }, [consent?.analytics, pathname]);

  useEffect(() => {
    if (!consent?.marketing || !hasMarketing || !metaPixelId) {
      return;
    }

    const pixel = getMetaPixel();
    pixel('consent', 'grant');
    if (window.kynovraMetaPixelId !== metaPixelId) {
      pixel('init', metaPixelId);
      window.kynovraMetaPixelId = metaPixelId;
    }
    pixel('track', 'PageView');

    if (pathname === '/') {
      pixel('track', 'ViewContent', {
        content_ids: ['20298044'],
        content_name: 'Jogo de Panelas Tramontina Turim 4 Peças Preto',
        content_type: 'product',
        ...getCampaignParameters(),
      });
    }
  }, [consent?.marketing, pathname]);

  useEffect(() => {
    if (
      !consent ||
      (!consent.analytics && !consent.marketing) ||
      !hasOptionalTrackers
    ) {
      return;
    }

    const trackAffiliateClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>(
        'a[data-affiliate-cta="mercadolivre"]',
      );

      if (!link || link.href !== mercadolivreAffiliateUrl) {
        return;
      }

      const campaign = getCampaignParameters();

      if (consent.analytics && window.gtag) {
        window.gtag('event', 'affiliate_outbound_click', {
          link_url: mercadolivreAffiliateUrl,
          link_domain: 'meli.la',
          outbound: true,
          ...getGaCampaignParameters(campaign),
        });
      }

      if (consent.marketing && window.fbq) {
        window.fbq('trackCustom', 'AffiliateOutboundClick', {
          destination: 'Mercado Livre',
          content_ids: ['20298044'],
          ...campaign,
        });
      }
    };

    document.addEventListener('click', trackAffiliateClick, true);
    return () =>
      document.removeEventListener('click', trackAffiliateClick, true);
  }, [consent]);

  function saveConsent(choice: ConsentChoice) {
    const nextChoice = {
      analytics: choice.analytics && hasAnalytics,
      marketing: choice.marketing && hasMarketing,
    };

    try {
      localStorage.setItem(
        consentStorageKey,
        JSON.stringify({ version: 1, ...nextChoice } satisfies StoredConsent),
      );
    } catch {
      // Keep the current page usable if browser storage is unavailable.
    }

    setConsent(nextChoice);
    setPreferencesOpen(false);
  }

  if (!hydrated || !hasOptionalTrackers) {
    return null;
  }

  if (consent && !preferencesOpen) {
    return null;
  }

  return (
    <section
      aria-labelledby="consent-title"
      className="privacy-consent"
      id="preferencias-de-privacidade"
    >
      <div className="privacy-consent-copy">
        <p className="eyebrow">SUA PRIVACIDADE</p>
        <h2 id="consent-title">
          {preferencesOpen
            ? 'Escolha suas preferências'
            : 'Cookies e mensuração'}
        </h2>
        <p>
          {preferencesOpen
            ? 'Você pode alterar ou retirar estas escolhas quando quiser na página de privacidade.'
            : `O uso de ${configuredServices} é opcional. Escolha se autoriza o rastreamento; os links de compra funcionam mesmo se você recusar.`}
        </p>
      </div>

      {preferencesOpen ? (
        <fieldset className="privacy-options">
          <legend>Escolha as categorias opcionais:</legend>
          {hasAnalytics ? (
            <label>
              <input
                checked={analyticsDraft}
                onChange={(event) =>
                  setAnalyticsDraft(event.currentTarget.checked)
                }
                type="checkbox"
              />
              <span>
                <strong>Estatísticas</strong>
                <small>Google Analytics 4 para medir visitas e cliques.</small>
              </span>
            </label>
          ) : null}
          {hasMarketing ? (
            <label>
              <input
                checked={marketingDraft}
                onChange={(event) =>
                  setMarketingDraft(event.currentTarget.checked)
                }
                type="checkbox"
              />
              <span>
                <strong>Marketing</strong>
                <small>Meta Pixel para mensurar campanhas e anúncios.</small>
              </span>
            </label>
          ) : null}
        </fieldset>
      ) : null}

      <div className="privacy-consent-actions">
        <a href="/privacidade">Política de privacidade</a>
        {preferencesOpen ? (
          <>
            <button
              className="consent-button"
              onClick={() => setPreferencesOpen(false)}
              type="button"
            >
              Voltar
            </button>
            <button
              className="consent-button"
              onClick={() =>
                saveConsent({
                  analytics: analyticsDraft,
                  marketing: marketingDraft,
                })
              }
              type="button"
            >
              Salvar escolhas
            </button>
          </>
        ) : (
          <>
            <button
              className="consent-button"
              onClick={() =>
                saveConsent({ analytics: false, marketing: false })
              }
              type="button"
            >
              Rejeitar opcionais
            </button>
            <button
              className="consent-button"
              onClick={() => saveConsent({ analytics: true, marketing: true })}
              type="button"
            >
              Aceitar todos
            </button>
            <button
              className="consent-button"
              onClick={() => setPreferencesOpen(true)}
              type="button"
            >
              Personalizar
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export function PrivacySettingsButton() {
  return (
    <button
      className="privacy-settings-button"
      onClick={() => window.dispatchEvent(new Event(openConsentEvent))}
      type="button"
    >
      Gerenciar consentimento de cookies
    </button>
  );
}
