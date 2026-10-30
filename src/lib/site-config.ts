export const mercadolivreAffiliateUrl = 'https://meli.la/1REfxSi';

const ga4Candidate = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const metaPixelCandidate = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const privacyContactCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_CONTACT_URL?.trim();
const privacyControllerCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME?.trim();
const privacyRetentionCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_RETENTION_SUMMARY?.trim();
const privacyTransferCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_TRANSFER_SUMMARY?.trim();
const privacyTechnicalLogsCandidate =
  process.env.NEXT_PUBLIC_PRIVACY_TECHNICAL_LOGS_SUMMARY?.trim();
const privacyNoticeApproved =
  process.env.NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED === 'true';

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

export const privacyContactUrl =
  getPrivacyContactUrl(privacyContactCandidate) ??
  'mailto:contato@kynovra.digital';
export const privacyContactLabel = privacyContactUrl.startsWith('mailto:')
  ? privacyContactUrl.slice('mailto:'.length)
  : 'canal oficial de privacidade';
export const privacyControllerName = privacyControllerCandidate || null;
export const privacyRetentionSummary = privacyRetentionCandidate || null;
export const privacyTransferSummary = privacyTransferCandidate || null;
export const privacyTechnicalLogsSummary =
  privacyTechnicalLogsCandidate || null;
export const privacyDisclosureReady = Boolean(
  privacyControllerName &&
    privacyRetentionSummary &&
    privacyTransferSummary &&
    privacyTechnicalLogsSummary &&
    privacyNoticeApproved,
);

export const analyticsTrackingAvailable = Boolean(
  ga4MeasurementId && privacyDisclosureReady,
);
export const marketingTrackingAvailable = Boolean(
  metaPixelId && privacyDisclosureReady,
);
export const optionalTrackingAvailable =
  analyticsTrackingAvailable || marketingTrackingAvailable;
