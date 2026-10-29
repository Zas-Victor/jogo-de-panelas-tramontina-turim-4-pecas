import { ArrowRight, Check, CookingPot, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { kitchenImage } from '@/lib/product-data';

const routineSteps = [
  {
    title: 'Do café ao jantar',
    description:
      'Frigideira, panela, caçarola e fervedor acompanham preparos diferentes ao longo do dia.',
  },
  {
    title: 'Veja o preparo com facilidade',
    description:
      'As tampas de vidro da panela e da caçarola ajudam a acompanhar a receita enquanto cozinha.',
  },
  {
    title: 'Escolha peças para a sua rotina',
    description:
      'O acabamento preto e as quatro capacidades formam um conjunto compacto para diferentes preparos.',
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
            A diferença está na rotina que você constrói.
          </h2>
          <p className="section-lead">
            O café que começa o dia. O almoço que precisa ficar pronto. A
            receita feita com carinho. São essas situações que tornam a cozinha
            tão importante.
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
        <p>O melhor da cozinha não está nas panelas.</p>
        <h2>
          Está nos momentos que você <span>cria com elas.</span>
        </h2>
        <span className="statement-rule" />
        <p className="statement-caption">
          COZINHA É UMA ESCOLHA QUE FAZ PARTE DE TODOS OS DIAS.
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
      'O revestimento antiaderente interno e externo ajuda a tornar o preparo e a limpeza mais práticos. Siga os cuidados do fabricante.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Acompanhe o preparo',
    description:
      'As tampas de vidro da panela e da caçarola permitem acompanhar o cozimento sem levantar a tampa.',
    icon: Eye,
  },
  {
    number: '03',
    title: 'Do começo ao fim da receita',
    description:
      'Frigideira, panela, caçarola e fervedor atendem tarefas distintas, dos acompanhamentos aos líquidos quentes.',
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
            Bonitas por fora. Pensadas para o dia a dia.
          </h2>
          <p className="section-lead">
            Sem promessas mágicas: características concretas que podem fazer
            diferença na sua experiência na cozinha.
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
