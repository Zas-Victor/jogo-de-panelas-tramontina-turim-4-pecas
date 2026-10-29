import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { mercadolivreAffiliateUrl } from '@/lib/site-config';

type AffiliateCtaProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function AffiliateCta({
  children,
  className = '',
  ariaLabel,
}: AffiliateCtaProps) {
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0"
        strokeWidth={2.4}
      />
    </>
  );

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      data-affiliate-cta="mercadolivre"
      href={mercadolivreAffiliateUrl}
      rel="sponsored nofollow noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
}
