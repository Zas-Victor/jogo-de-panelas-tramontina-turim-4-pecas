import { BadgeCheck, Eye, ShoppingBasket } from 'lucide-react';
import { FaqSection } from '@/components/faq-section';
import { FinalCta } from '@/components/final-cta';
import { Hero } from '@/components/hero';
import { MobileAffiliateBar } from '@/components/mobile-affiliate-bar';
import {
  ProductDetailsSection,
  ProductSection,
} from '@/components/product-section';
import {
  BenefitsSection,
  RoutineSection,
  StatementBand,
} from '@/components/routine-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TrustSection } from '@/components/trust-section';
import { heroProductImage } from '@/lib/product-data';
import { mercadolivreAffiliateUrl } from '@/lib/site-config';
import { siteOrigin } from '@/lib/site-origin';

const assurances = [
  {
    title: 'Conheça antes de escolher',
    description: 'Características e limites explicados',
    icon: BadgeCheck,
  },
  {
    title: 'Consulta no Mercado Livre',
    description: 'Preço e vendedor disponíveis no destino',
    icon: ShoppingBasket,
  },
  {
    title: 'Recomendação transparente',
    description: 'Sem avaliações ou ofertas inventadas',
    icon: Eye,
  },
];

function AssuranceStrip() {
  return (
    <section
      aria-label="Como funciona a recomendação"
      className="assurance-strip"
    >
      <div className="assurance-inner page-shell">
        {assurances.map((assurance) => {
          const Icon = assurance.icon;

          return (
            <div className="assurance-item" key={assurance.title}>
              <span className="assurance-icon">
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{assurance.title}</strong>
                <small>{assurance.description}</small>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Jogo de Panelas Tramontina Turim 4 Peças Preto',
    description:
      'Conjunto de quatro peças em alumínio com revestimento interno e externo Starflon Max: frigideira, panela, caçarola e fervedor. Panela e caçarola acompanham tampas de vidro.',
    brand: {
      '@type': 'Brand',
      name: 'Tramontina',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Tramontina',
    },
    model: '20298044',
    color: 'Preto',
    category: 'Jogo de panelas',
    ...(siteOrigin
      ? { image: new URL(heroProductImage.src, siteOrigin).toString() }
      : {}),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Material',
        value: 'Alumínio',
      },
      {
        '@type': 'PropertyValue',
        name: 'Revestimento',
        value: 'Starflon Max interno e externo',
      },
      {
        '@type': 'PropertyValue',
        name: 'Compatibilidade',
        value:
          'Fogões a gás, elétricos e vitrocerâmicos com resistência elétrica; incompatível com indução',
      },
    ],
  };

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD uses static product facts and escapes HTML-sensitive characters.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData).replaceAll(
            '<',
            '\\u003c',
          ),
        }}
        type="application/ld+json"
      />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <AssuranceStrip />
        <RoutineSection />
        <StatementBand />
        <BenefitsSection />
        <ProductSection />
        <ProductDetailsSection />
        <TrustSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
      {mercadolivreAffiliateUrl ? (
        <>
          <MobileAffiliateBar />
          <div aria-hidden="true" className="mobile-footer-clearance" />
        </>
      ) : null}
    </>
  );
}
