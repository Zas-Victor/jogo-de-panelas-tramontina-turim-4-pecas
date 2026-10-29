'use client';

import { useEffect, useState } from 'react';
import { AffiliateCta } from '@/components/affiliate-cta';
import { mercadolivreAffiliateUrl } from '@/lib/site-config';

export function MobileAffiliateBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.querySelector('.hero-primary');

    if (!heroCta || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  if (!mercadolivreAffiliateUrl) {
    return null;
  }

  return (
    <div
      aria-hidden={!isVisible}
      className={`mobile-affiliate-bar${isVisible ? ' is-visible' : ''}`}
      inert={!isVisible}
    >
      <AffiliateCta className="button-primary mobile-affiliate-button">
        Conferir preço
      </AffiliateCta>
    </div>
  );
}
