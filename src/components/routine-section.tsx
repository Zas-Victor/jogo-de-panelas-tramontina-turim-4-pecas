import { ArrowRight, Check, CookingPot, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { kitchenImage } from '@/lib/product-data';

const routineSteps = [
  {
    title: 'Volumes de 0,7 L a 2 L',
    description:
      'Compare as capacidades com as porções que você costuma preparar; o conjunto é voltado a volumes compactos.',
  },
  {
    title: 'Cuide do revestimento',
    description:
      'Para o Starflon Max, a Tramontina recomenda fogo baixo ou médio e utensílios de silicone, nylon ou madeira.',
  },
];

export function RoutineSection() {
  return (
    <section
      aria-labelledby="routine-title"
      className="routine-section section-light"
    >
      <div className="routine-grid page-shell">
        <figure className="routine-photo-wrap">
          <div className="routine-photo">
            <Image
              alt="Conjunto de panelas Turim disposto sobre uma bancada de cozinha."
              className="object-cover"
              fill
              sizes="(max-width: 850px) 90vw, 48vw"
              src={kitchenImage}
            />
            <figcaption className="routine-photo-caption">
              <span className="caption-dot" />
              UMA ESCOLHA PARA A ROTINA REAL
            </figcaption>
          </div>
        </figure>

        <div className="routine-copy">
          <p className="eyebrow">MAIS DO QUE UTENSÍLIOS</p>
          <h2 className="section-title" id="routine-title">
            Uma peça para cada etapa do preparo.
          </h2>
          <p className="section-lead">
            Frigideira, panela, caçarola e fervedor atendem tarefas diferentes.
            Confira os volumes e os cuidados antes de escolher.
          </p>

          <ul className="routine-list">
            {routineSteps.map((step) => (
              <li className="routine-item" key={step.title}>
                <span aria-hidden="true" className="routine-check">
                  <Check size={14} strokeWidth={2.6} />
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link className="button-dark routine-link" href="#itens">
            Ver o que vem no kit
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StatementBand() {
  return (
    <section aria-label="Inspiração para a cozinha" className="statement-band">
      <div aria-hidden="true" className="statement-ring statement-ring-one" />
      <div aria-hidden="true" className="statement-ring statement-ring-two" />
      <div className="statement-content page-shell">
        <p>ESCOLHA COM MAIS CLAREZA</p>
        <h2>
          Conheça as peças antes <span>de conferir a oferta.</span>
        </h2>
        <span className="statement-rule" />
        <p className="statement-caption">
          COMPOSIÇÃO, CAPACIDADES E COMPATIBILIDADE EM UM SÓ LUGAR.
        </p>
      </div>
    </section>
  );
}

const benefits = [
  {
    number: '01',
    title: 'Revestimento Starflon Max',
    description:
      'O antiaderente ajuda os alimentos a se soltarem e pode facilitar a limpeza quando usado conforme as orientações da Tramontina.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Acompanhe o preparo',
    description:
      'As tampas de vidro da panela e da caçarola permitem observar o cozimento sem precisar levantá-las.',
    icon: Eye,
  },
  {
    number: '03',
    title: 'Quatro funções diferentes',
    description:
      'Frigideira, panela, caçarola e fervedor oferecem opções para preparos rápidos, cozidos e bebidas quentes.',
    icon: CookingPot,
  },
];

export function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-title"
      className="benefits-section section-sand"
      id="beneficios"
    >
      <div className="page-shell">
        <div className="section-heading centered-heading">
          <p className="eyebrow">DETALHES QUE VOCÊ SENTE NA ROTINA</p>
          <h2 className="section-title" id="benefits-title">
            Detalhes que ajudam no preparo e na limpeza.
          </h2>
          <p className="section-lead">
            Veja como o revestimento, as tampas e as funções das peças podem ser
            úteis em receitas cotidianas.
          </p>
        </div>

        <div className="benefit-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article className="benefit-card" key={benefit.number}>
                <div aria-hidden="true" className="benefit-icon">
                  <Icon size={19} strokeWidth={1.9} />
                </div>
                <p className="benefit-number">{benefit.number} / 03</p>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
