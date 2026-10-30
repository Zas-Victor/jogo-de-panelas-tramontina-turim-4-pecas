import Image from 'next/image';
import Link from 'next/link';
import { AffiliateCta } from '@/components/affiliate-cta';
import { brandLogo } from '@/lib/product-data';

const navigation = [
  { href: '#beneficios', label: 'Benefícios' },
  { href: '#itens', label: 'O que vem no kit' },
  { href: '#depoimentos', label: 'Avaliações' },
  { href: '#antes-de-comprar', label: 'Antes de comprar' },
  { href: '#duvidas', label: 'Dúvidas' },
];

export function SiteHeader() {
  return (
    <>
      <div className="notice-bar">
        <span>PUBLICIDADE</span>
        <span aria-hidden="true">·</span>
        <span>LINKS DE AFILIADO</span>
      </div>

      <header className="site-header">
        <div className="site-header-inner">
          <Link
            aria-label="Kynovra Deals — início"
            className="brand-lockup"
            href="#inicio"
          >
            <Image
              alt=""
              className="brand-logo"
              height={52}
              loading="eager"
              src={brandLogo}
              width={52}
            />
            <span className="brand-copy">
              <span className="brand-name">
                KYNOVRA <span>DEALS</span>
              </span>
              <span className="brand-tagline">
                ESCOLHAS PARA O SEU DIA A DIA
              </span>
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="desktop-nav">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <AffiliateCta
            ariaLabel="Conferir preço no Mercado Livre"
            className="header-cta"
            placement="header"
          >
            Conferir preço no Mercado Livre
          </AffiliateCta>
        </div>
      </header>
    </>
  );
}
