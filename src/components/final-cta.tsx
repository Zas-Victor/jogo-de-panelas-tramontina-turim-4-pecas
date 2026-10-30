import Image from 'next/image';
import { AffiliateCta } from '@/components/affiliate-cta';
import { heroProductImage } from '@/lib/product-data';

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="final-cta-section">
      <div className="final-cta-card page-shell">
        <div className="final-cta-image">
          <Image
            alt="As quatro peças do conjunto Tramontina Turim em acabamento preto."
            className="object-contain p-2"
            fill
            sizes="(max-width: 767px) 90vw, 42vw"
            src={heroProductImage}
          />
        </div>
        <div className="final-cta-copy">
          <p className="eyebrow">SUA PRÓXIMA ESCOLHA COMEÇA COM CLAREZA</p>
          <h2 className="section-title" id="final-cta-title">
            Pronto para conhecer o Tramontina Turim?
          </h2>
          <p>
            Veja o conjunto com calma, confira o preço, o vendedor e a
            disponibilidade no anúncio do Mercado Livre. A decisão é sua, com as
            informações em mãos.
          </p>
          <AffiliateCta
            className="button-primary final-cta-button"
            placement="final-cta"
          >
            Conferir preço no Mercado Livre
          </AffiliateCta>
          <p className="final-cta-disclosure">
            A Kynovra Deals é afiliada, não vende nem fabrica o produto, e pode
            receber comissão por compras elegíveis feitas pelo link.
          </p>
        </div>
      </div>
    </section>
  );
}
