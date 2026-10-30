import { ArrowDown, CookingPot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AffiliateCta } from '@/components/affiliate-cta';
import { heroProductImage } from '@/lib/product-data';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-section" id="inicio">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner page-shell">
        <div className="hero-copy">
          <div className="hero-meta">
            <div className="hero-meta-copy">
              <span className="hero-pill">Seleção Kynovra Deals</span>
              <span className="hero-product-name">
                TRAMONTINA TURIM · 4 PEÇAS
              </span>
            </div>
            <Image
              alt=""
              aria-hidden="true"
              className="hero-meta-product-image"
              fetchPriority="high"
              height={64}
              loading="eager"
              sizes="64px"
              src={heroProductImage}
              width={64}
            />
          </div>

          <h1 className="hero-title" id="hero-title">
            Jogo de Panelas Tramontina Turim 4 peças:{' '}
            <span>praticidade para os seus dias.</span>
          </h1>
          <p className="hero-description">
            O conjunto reúne frigideira, panela, caçarola e fervedor em alumínio
            com revestimento antiaderente Starflon Max. Panela e caçarola têm
            tampa de vidro; não é compatível com indução.
          </p>

          <div className="hero-actions">
            <AffiliateCta
              className="button-primary hero-primary"
              placement="hero"
            >
              Conferir preço no Mercado Livre
            </AffiliateCta>
            <Link className="button-secondary" href="#beneficios">
              Descobrir benefícios
              <ArrowDown aria-hidden="true" size={16} />
            </Link>
          </div>

          <p className="hero-disclosure">
            A compra acontece no Mercado Livre. Confira ali preço, frete e
            condições. A Kynovra Deals é afiliada; não fabrica nem vende.
          </p>
        </div>

        <div className="hero-product-wrap">
          <div className="hero-product-card group">
            <div className="hero-card-topline">
              <span>TRAMONTINA · TURIM</span>
              <span>PRETO</span>
            </div>
            <div className="hero-product-image">
              <Image
                alt="Conjunto preto Tramontina Turim com frigideira, panela, caçarola e fervedor."
                className="object-contain p-[9px] transition-transform duration-300 group-hover:scale-[1.025]"
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 850px) 90vw, (max-width: 1100px) 48vw, 570px"
                src={heroProductImage}
              />
            </div>
            <div className="hero-card-bottomline">
              <span>Quatro peças, muitas possibilidades.</span>
              <span>STARFLON MAX</span>
            </div>
          </div>
          <div aria-hidden="true" className="hero-sticker">
            <CookingPot aria-hidden="true" size={17} />
            <span>4 peças</span>
          </div>
        </div>
      </div>
    </section>
  );
}
