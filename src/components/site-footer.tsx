import Image from 'next/image';
import Link from 'next/link';
import { PrivacySettingsButton } from '@/components/analytics-consent';
import { brandLogo } from '@/lib/product-data';
import {
  ga4MeasurementId,
  metaPixelId,
  privacyDisclosureReady,
} from '@/lib/site-config';

const canManagePrivacy =
  privacyDisclosureReady && Boolean(ga4MeasurementId || metaPixelId);

const footerLinks = [
  { href: '#inicio', label: 'Voltar ao início' },
  { href: '#antes-de-comprar', label: 'Transparência e informações' },
  { href: '#duvidas', label: 'Perguntas frequentes' },
  { href: '/privacidade', label: 'Privacidade e cookies' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-shell">
        <div className="footer-top">
          <Link
            aria-label="Kynovra Deals — início"
            className="footer-brand"
            href="#inicio"
          >
            <Image
              alt=""
              className="rounded-full object-cover"
              height={42}
              src={brandLogo}
              width={42}
            />
            <span>
              <strong>
                KYNOVRA <em>DEALS</em>
              </strong>
              <small>ESCOLHAS PARA O SEU DIA A DIA</small>
            </span>
          </Link>

          <nav aria-label="Links do rodapé" className="footer-nav">
            {footerLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="footer-description">
          A Kynovra Deals é uma marca da Kynovra Solutions e atua como afiliada;
          não é fabricante nem vendedora direta dos produtos apresentados e pode
          receber comissão por compras elegíveis feitas por nossos links. Preço,
          disponibilidade, pagamento e entrega são informados pelo vendedor no
          anúncio de destino.
        </p>

        {canManagePrivacy ? <PrivacySettingsButton /> : null}

        <div className="footer-bottom">
          <span>© Kynovra Deals · Kynovra Solutions</span>
          <span>Publicidade e transparência em cada recomendação.</span>
        </div>
      </div>
    </footer>
  );
}
