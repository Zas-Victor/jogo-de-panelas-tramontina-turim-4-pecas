export const mercadolivreAffiliateUrl = 'https://meli.la/1REfxSi';

const ga4Candidate = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const metaPixelCandidate = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const privacyContactCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_CONTACT_URL?.trim();
const privacyControllerCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME?.trim();
const privacyRetentionCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_RETENTION_SUMMARY?.trim();

export const ga4MeasurementId = ga4Candidate?.match(/^G-[A-Z0-9]+$/i)
  ? ga4Candidate
  : null;

export const metaPixelId = metaPixelCandidate?.match(/^\d{5,20}$/)
  ? metaPixelCandidate
  : null;

function getPrivacyContactUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    return url.protocol === 'https:' || url.protocol === 'mailto:'
      ? value
      : null;
  } catch {
    return null;
  }
}

export const privacyContactUrl = getPrivacyContactUrl(privacyContactCandidate);
export const privacyControllerName = privacyControllerCandidate || null;
export const privacyRetentionSummary = privacyRetentionCandidate || null;
export const privacyDisclosureReady = Boolean(
  privacyContactUrl && privacyControllerName && privacyRetentionSummary,
);
