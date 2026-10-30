import { Star } from 'lucide-react';
import { TestimonialGallery } from '@/components/testimonial-gallery';
import { testimonials } from '@/lib/testimonials';

const starValues = [1, 2, 3, 4, 5] as const;

export function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="testimonials-section section-sand"
      id="depoimentos"
    >
      <div className="page-shell">
        <header className="testimonials-heading">
          <p className="eyebrow">OPINIÕES DE COMPRADORES</p>
          <h2 className="section-title" id="testimonials-title">
            Quem comprou, conta como foi
          </h2>
          <p>
            Confira opiniões compartilhadas por compradores e veja fotos reais
            do produto.
          </p>
        </header>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.id}>
              <div
                aria-label={`${testimonial.rating} de 5 estrelas`}
                className="testimonial-rating"
                role="img"
              >
                {starValues.slice(0, testimonial.rating).map((star) => (
                  <Star
                    aria-hidden="true"
                    fill="currentColor"
                    key={`${testimonial.id}-star-${star}`}
                    size={17}
                    strokeWidth={1.6}
                  />
                ))}
              </div>

              <h3>{`Avaliação ${testimonial.number}`}</h3>
              <blockquote>{testimonial.text}</blockquote>

              <TestimonialGallery
                photos={testimonial.photos}
                reviewNumber={testimonial.number}
              />

              <p className="testimonial-source">
                Fonte: avaliação publicada no Mercado Livre.
              </p>
            </article>
          ))}
        </div>

        <p className="testimonials-disclosure">
          As opiniões e fotos foram publicadas no Mercado Livre. A Kynovra Deals
          é afiliada e não realizou essas vendas.
        </p>
      </div>
    </section>
  );
}
