import { Check, Info } from 'lucide-react';
import Image from 'next/image';
import { AffiliateCta } from '@/components/affiliate-cta';
import { packagingImage, productPieces } from '@/lib/product-data';

export function ProductSection() {
  return (
    <section
      aria-labelledby="pieces-title"
      className="product-section section-white"
      id="itens"
    >
      <div className="page-shell">
        <div className="product-heading">
          <div>
            <p className="eyebrow">VEJA EXATAMENTE O QUE VOCÊ RECEBE</p>
            <h2 className="section-title" id="pieces-title">
              Tramontina Turim 4 peças para diferentes receitas.
            </h2>
          </div>
          <p className="product-intro">
            Conheça o jogo de panelas preto Tramontina Turim, referência{' '}
            <strong>20298044</strong>, e confira a composição do anúncio antes
            de escolher.
          </p>
        </div>

        <div className="product-grid">
          {productPieces.map((piece, index) => (
            <article className="product-card group" key={piece.name}>
              <div className="product-card-image">
                <Image
                  alt={piece.alt}
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.045] max-sm:p-2"
                  fill
                  sizes="(max-width: 639px) 44vw, (max-width: 1023px) 43vw, 280px"
                  src={piece.image}
                />
              </div>
              <div className="product-card-copy">
                <p className="product-index">{`0${index + 1}`} / 04</p>
                <h3>{piece.name}</h3>
                <p className="product-dimensions">{piece.dimensions}</p>
                <p className="product-use">{piece.use}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="product-offer-note">
          <div className="product-note-copy">
            <p>
              <strong>Quatro peças, cada uma com uma função.</strong> A panela e
              a caçarola vêm com tampas de vidro; frigideira e fervedor
              completam o conjunto.
            </p>
            <p>
              Ingredientes e objetos de decoração das fotos não fazem parte do
              kit.
            </p>
          </div>
          <AffiliateCta
            className="button-primary product-note-cta"
            placement="product-summary"
          >
            Conferir preço no Mercado Livre
          </AffiliateCta>
        </div>
      </div>
    </section>
  );
}

const productFacts = [
  'Quatro peças: frigideira, panela, caçarola e fervedor.',
  'Corpo de alumínio com revestimento antiaderente Starflon Max no interior e no exterior.',
  'Tampas de vidro acompanham a panela e a caçarola.',
  'Compatível com fogões a gás, elétricos e vitrocerâmicos com resistência; não funciona por indução.',
];

export function ProductDetailsSection() {
  return (
    <section
      aria-labelledby="details-title"
      className="details-section section-cream"
    >
      <div className="details-grid page-shell">
        <figure className="packaging-figure">
          <div className="packaging-image-wrap">
            <Image
              alt="Embalagem do conjunto Tramontina Turim junto das quatro peças."
              className="object-contain p-5 max-sm:p-3"
              fill
              sizes="(max-width: 850px) 90vw, 48vw"
              src={packagingImage}
            />
          </div>
          <figcaption>
            Imagem de referência da embalagem e do conjunto.
          </figcaption>
        </figure>

        <div className="details-copy">
          <p className="eyebrow">UMA ESCOLHA MAIS CONSCIENTE</p>
          <h2 className="section-title" id="details-title">
            Qualidade também é saber o que está comprando.
          </h2>
          <p className="section-lead">
            O conjunto Turim 20298044 reúne quatro peças para preparos
            cotidianos. Confira se as capacidades atendem à sua casa e confirme
            as condições atualizadas no anúncio antes da compra.
          </p>

          <ul className="details-list">
            {productFacts.map((fact) => (
              <li key={fact}>
                <Check aria-hidden="true" size={15} strokeWidth={2.5} />
                <span>{fact}</span>
              </li>
            ))}
          </ul>

          <p className="reference-note">
            <Info aria-hidden="true" size={15} />
            As dimensões exibidas correspondem às peças; confira a composição e
            a descrição do anúncio de destino antes de comprar.
          </p>
          <AffiliateCta
            className="button-dark details-cta"
            placement="product-details"
          >
            Conferir preço no Mercado Livre
          </AffiliateCta>
        </div>
      </div>
    </section>
  );
}
