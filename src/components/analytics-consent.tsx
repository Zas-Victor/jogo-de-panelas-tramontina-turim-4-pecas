'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ga4MeasurementId,
  mercadolivreAffiliateUrl,
  metaPixelId,
  privacyDisclosureReady,
} from '@/lib/site-config';

const consentStorageKey = 'kynovra-privacy-consent-v2';
const consentSessionChoiceKey = 'kynovra-cookie-session-choice-v1';
const openConsentEvent = 'kynovra:open-consent-settings';
const consentDecisionChangedEvent = 'kynovra:consent-decision-changed';
const hasAnalytics = Boolean(ga4MeasurementId && privacyDisclosureReady);
const hasMarketing = Boolean(metaPixelId && privacyDisclosureReady);
const hasOptionalTrackers = hasAnalytics || hasMarketing;
let consentDecisionExists = false;

type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = ConsentChoice & {
  version: 2;
};

type CampaignParameters = Record<string, string>;

function publishConsentDecision(exists: boolean) {
  consentDecisionExists = exists;
  window.dispatchEvent(
    new CustomEvent(consentDecisionChangedEvent, { detail: exists }),
  );
}

function hasDecisionInCurrentSession(): boolean {
  try {
    return window.sessionStorage.getItem(consentSessionChoiceKey) === '1';
  } catch {
    return false;
  }
}

function markDecisionInCurrentSession() {
  try {
    window.sessionStorage.setItem(consentSessionChoiceKey, '1');
  } catch {
    // The visible component state still prevents a repeat until navigation reloads.
  }
}

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

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    const script = document.createElement('script');
    script.async = true;
    script.id = 'kynovra-ga4-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);

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

function removeFirstPartyCookies(pattern: RegExp) {
  const host = window.location.hostname;
  const domains = [host];

  if (host.endsWith('.kynovra.digital')) {
    domains.push('.kynovra.digital', 'kynovra.digital');
  }

  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => pattern.test(name));

  for (const name of names) {
    const secureAttribute =
      window.location.protocol === 'https:' ? '; Secure' : '';
    for (const domain of domains) {
      // biome-ignore lint/suspicious/noDocumentCookie: Clear known first-party identifiers in browsers without Cookie Store API support.
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax${secureAttribute}`;
    }

    // biome-ignore lint/suspicious/noDocumentCookie: Clear known first-party identifiers in browsers without Cookie Store API support.
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${secureAttribute}`;
  }
}

function clearAnalyticsIdentifiers() {
  removeFirstPartyCookies(/^_(?:ga(?:_|$)|gid$|gat(?:_|$))/);
}

function clearMarketingIdentifiers() {
  removeFirstPartyCookies(/^_(?:fbp|fbc)$/);
}

function getStoredConsentValue(
  storage: 'localStorage' | 'sessionStorage',
): string | null {
  try {
    return window[storage].getItem(consentStorageKey);
  } catch {
    return null;
  }
}

function parseStoredConsent(value: string | null): ConsentChoice | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<StoredConsent>;

    if (
      parsed.version !== 2 ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean'
    ) {
      return null;
    }

    return {
      analytics: parsed.analytics,
      marketing: parsed.marketing,
    };
  } catch {
    return null;
  }
}

function readStoredConsent(): ConsentChoice | null {
  return (
    parseStoredConsent(getStoredConsentValue('sessionStorage')) ??
    parseStoredConsent(getStoredConsentValue('localStorage'))
  );
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [initialPromptOpen, setInitialPromptOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);
  const [marketingDraft, setMarketingDraft] = useState(false);
  const panelTitleRef = useRef<HTMLHeadingElement>(null);
  const wasPreferencesOpen = useRef(false);
  const lastPreferencesTrigger = useRef<HTMLElement | null>(null);
  const lastAnalyticsView = useRef('');
  const lastMarketingView = useRef('');

  const openPreferences = useCallback(
    (trigger?: HTMLElement | null) => {
      if (trigger) {
        lastPreferencesTrigger.current = trigger;
      }
      setAnalyticsDraft(consent?.analytics ?? false);
      setMarketingDraft(consent?.marketing ?? false);
      setPreferencesOpen(true);
    },
    [consent],
  );

  useEffect(() => {
    const storedConsent = readStoredConsent();
    setConsent(storedConsent);
    publishConsentDecision(storedConsent !== null);
    setInitialPromptOpen(!hasDecisionInCurrentSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleOpenPreferences = (event: Event) => {
      const trigger =
        event instanceof CustomEvent && event.detail instanceof HTMLElement
          ? event.detail
          : null;
      openPreferences(trigger);
    };

    window.addEventListener(openConsentEvent, handleOpenPreferences);
    document.documentElement.dataset.cookieConsentSettingsReady = 'true';
    return () => {
      window.removeEventListener(openConsentEvent, handleOpenPreferences);
      delete document.documentElement.dataset.cookieConsentSettingsReady;
    };
  }, [openPreferences]);

  useEffect(() => {
    if (preferencesOpen) {
      panelTitleRef.current?.focus();
      wasPreferencesOpen.current = true;
    } else if (wasPreferencesOpen.current) {
      if (lastPreferencesTrigger.current?.isConnected) {
        lastPreferencesTrigger.current.focus();
      } else {
        document
          .querySelector<HTMLElement>('[data-consent-settings-trigger]')
          ?.focus();
      }
      wasPreferencesOpen.current = false;
    }
  }, [preferencesOpen]);

  useEffect(() => {
    if (!consent?.analytics) {
      lastAnalyticsView.current = '';
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      clearAnalyticsIdentifiers();
    }

    if (!consent?.marketing) {
      lastMarketingView.current = '';
      window.fbq?.('consent', 'revoke');
      clearMarketingIdentifiers();
    }
  }, [consent]);

  useEffect(() => {
    if (!consent?.analytics || !hasAnalytics || !ga4MeasurementId) {
      return;
    }

    const viewKey = `${pathname}|${consent.analytics}`;
    if (lastAnalyticsView.current === viewKey) {
      return;
    }
    lastAnalyticsView.current = viewKey;

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

    const viewKey = `${pathname}|${consent.marketing}`;
    if (lastMarketingView.current === viewKey) {
      return;
    }
    lastMarketingView.current = viewKey;

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
      if (!event.isTrusted || !(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>(
        'a[data-affiliate-cta="mercadolivre"]',
      );

      if (!link || link.href !== mercadolivreAffiliateUrl) {
        return;
      }

      const campaign = getCampaignParameters();
      const placement = link.dataset.affiliatePlacement ?? 'unknown';

      if (consent.analytics && window.gtag) {
        window.gtag('event', 'affiliate_outbound_click', {
          link_url: mercadolivreAffiliateUrl,
          link_domain: 'meli.la',
          outbound: true,
          cta_position: placement,
          ...getGaCampaignParameters(campaign),
        });
      }

      if (consent.marketing && window.fbq) {
        window.fbq('trackCustom', 'AffiliateOutboundClick', {
          destination: 'Mercado Livre',
          content_ids: ['20298044'],
          cta_position: placement,
          ...campaign,
        });
      }
    };

    document.addEventListener('click', trackAffiliateClick, true);
    return () =>
      document.removeEventListener('click', trackAffiliateClick, true);
  }, [consent]);

  function saveConsent(choice: ConsentChoice) {
    const requestedChoice = {
      analytics: choice.analytics && hasAnalytics,
      marketing: choice.marketing && hasMarketing,
    };
    const serializedChoice = JSON.stringify({
      version: 2,
      ...requestedChoice,
    } satisfies StoredConsent);
    let persisted = false;

    try {
      window.sessionStorage.removeItem(consentStorageKey);
    } catch {
      // localStorage remains the primary preference store.
    }

    try {
      window.localStorage.setItem(consentStorageKey, serializedChoice);
      persisted = true;
      try {
        window.sessionStorage.removeItem(consentStorageKey);
      } catch {
        // An inaccessible session store cannot override localStorage.
      }
    } catch {
      try {
        window.sessionStorage.setItem(consentStorageKey, serializedChoice);
        persisted = true;
      } catch {
        // Without browser storage, optional tracking cannot be enabled.
      }
    }

    setConsent(
      persisted ? requestedChoice : { analytics: false, marketing: false },
    );
    publishConsentDecision(true);
    markDecisionInCurrentSession();
    setInitialPromptOpen(false);
    setPreferencesOpen(false);
  }

  function closePreferences() {
    setPreferencesOpen(false);
  }

  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && preferencesOpen) {
      closePreferences();
    }
  }

  const showInitialBanner = Boolean(hydrated && initialPromptOpen);

  if (!hydrated || (!showInitialBanner && !preferencesOpen)) {
    return null;
  }

  return (
    <section
      aria-labelledby="consent-title"
      className="privacy-consent"
      id="preferencias-de-privacidade"
      onKeyDown={handlePanelKeyDown}
    >
      <div className="privacy-consent-copy">
        <p className="eyebrow">SUA PRIVACIDADE</p>
        <h2 id="consent-title" ref={panelTitleRef} tabIndex={-1}>
          {preferencesOpen
            ? 'Preferências de cookies'
            : consent
              ? 'Revise suas preferências'
              : 'Cookies e privacidade'}
        </h2>
        <p>
          Análise e publicidade opcionais só funcionam com sua autorização.
          Recusar não limita o acesso à oferta.
        </p>
        {!preferencesOpen && consent ? (
          <p className="privacy-consent-previous-choice">
            Escolha anterior — Analytics:{' '}
            {consent.analytics ? 'autorizado' : 'recusado'}; Marketing:{' '}
            {consent.marketing ? 'autorizado' : 'recusado'}.
          </p>
        ) : null}
      </div>

      {preferencesOpen ? (
        <fieldset className="privacy-options">
          <legend>Escolha as categorias opcionais:</legend>
          <label>
            <input
              checked={analyticsDraft}
              disabled={!hasAnalytics}
              onChange={(event) =>
                setAnalyticsDraft(event.currentTarget.checked)
              }
              type="checkbox"
            />
            <span>
              <strong>Analytics</strong>
              <small>
                Google Analytics 4 para medir visitas e cliques de saída.
                {!ga4MeasurementId
                  ? ' Indisponível até que a integração seja configurada.'
                  : !privacyDisclosureReady
                    ? ' Desativado até a revisão de privacidade ser concluída.'
                    : ''}
              </small>
            </span>
          </label>
          <label>
            <input
              checked={marketingDraft}
              disabled={!hasMarketing}
              onChange={(event) =>
                setMarketingDraft(event.currentTarget.checked)
              }
              type="checkbox"
            />
            <span>
              <strong>Marketing</strong>
              <small>
                Meta Pixel para mensurar campanhas e anúncios.
                {!metaPixelId
                  ? ' Indisponível até que a integração seja configurada.'
                  : !privacyDisclosureReady
                    ? ' Desativado até a revisão de privacidade ser concluída.'
                    : ''}
              </small>
            </span>
          </label>
        </fieldset>
      ) : null}

      <div className="privacy-consent-actions">
        <Link href="/privacidade">Política de privacidade</Link>
        <Link href="/cookies">Política de cookies</Link>
        {preferencesOpen ? (
          <>
            <button
              className="consent-button"
              onClick={closePreferences}
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
              Salvar preferências
            </button>
          </>
        ) : (
          <>
            <button
              className="consent-button"
              onClick={() =>
                saveConsent({
                  analytics: hasAnalytics,
                  marketing: hasMarketing,
                })
              }
              type="button"
            >
              Aceitar opcionais
            </button>
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
              data-consent-settings-trigger
              onClick={(event) => openPreferences(event.currentTarget)}
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

export function ConsentChangeButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleConsentDecisionChange = (event?: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === 'boolean') {
        setVisible(event.detail);
      } else {
        setVisible(consentDecisionExists);
      }
    };

    handleConsentDecisionChange();
    window.addEventListener(
      consentDecisionChangedEvent,
      handleConsentDecisionChange,
    );
    return () =>
      window.removeEventListener(
        consentDecisionChangedEvent,
        handleConsentDecisionChange,
      );
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      data-consent-settings-trigger
      className="privacy-settings-button"
      onClick={(event) =>
        window.dispatchEvent(
          new CustomEvent(openConsentEvent, { detail: event.currentTarget }),
        )
      }
      type="button"
    >
      Alterar consentimento
    </button>
  );
}
