import { ChevronDown } from 'lucide-react';

const questions = [
  {
    question: 'O que vem no Jogo de Panelas Tramontina Turim 4 peças?',
    answer:
      'A referência reúne frigideira de 18 cm (0,7 L), panela de 16 cm (1,4 L), caçarola de 18 cm (2 L) e fervedor de 12 cm (1,1 L). A panela e a caçarola acompanham tampas de vidro. Confira a composição no anúncio antes da compra.',
  },
  {
    question: 'As capacidades atendem às porções que costumo preparar?',
    answer:
      'As peças variam de 0,7 L a 2 L e são voltadas a volumes compactos. Compare as capacidades com o tamanho das porções que você costuma fazer; podem não ser suficientes para receitas maiores.',
  },
  {
    question: 'Como usar e cuidar do revestimento Starflon Max?',
    answer:
      'Antes do primeiro uso, a Tramontina recomenda lavar com esponja macia, secar, untar levemente o interior com óleo e aquecer por um ou dois minutos em fogo baixo; depois, deixe esfriar e lave novamente. Use fogo baixo ou médio, utensílios de silicone, nylon ou madeira e evite abrasivos e choque térmico.',
  },
  {
    question: 'Funciona em fogão de indução?',
    answer:
      'Não. A referência Turim 20298044 é indicada para fogões a gás, elétricos e vitrocerâmicos com resistência elétrica, não para indução.',
  },
  {
    question: 'Quem vende, recebe o pagamento e faz a entrega?',
    answer:
      'A compra e o pagamento são feitos no Mercado Livre, conforme as condições do vendedor do anúncio; a entrega segue as opções exibidas lá. A Kynovra Deals, marca da Kynovra Solutions, é afiliada, não fabrica nem vende o produto e pode receber comissão por compras elegíveis.',
  },
  {
    question: 'Onde vejo o preço e a disponibilidade?',
    answer:
      'Preço, estoque, frete e prazo podem mudar. Consulte os valores e as condições diretamente no anúncio do Mercado Livre no momento da compra.',
  },
];

export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="faq-section section-light"
      id="duvidas"
    >
      <div className="faq-inner page-shell">
        <div className="section-heading centered-heading">
          <p className="eyebrow">RESPOSTAS ANTES DA SUA ESCOLHA</p>
          <h2 className="section-title" id="faq-title">
            Dúvidas esclarecidas. Escolha mais segura.
          </h2>
          <p className="section-lead">
            O que você precisa saber sobre o conjunto Tramontina Turim 4 peças
            antes de consultar o anúncio.
          </p>
        </div>

        <div className="faq-list">
          {questions.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="faq-chevron"
                  size={18}
                />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
