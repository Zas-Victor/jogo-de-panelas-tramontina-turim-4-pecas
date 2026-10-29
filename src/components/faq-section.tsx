import { ChevronDown } from 'lucide-react';

const questions = [
  {
    question: 'O que vem no Jogo de Panelas Tramontina Turim 4 peças?',
    answer:
      'A referência apresenta uma frigideira de 18 cm e 0,7 L, uma panela com tampa de 16 cm e 1,4 L, uma caçarola com tampa de 18 cm e 2 L e um fervedor de 12 cm e 1,1 L. Confira o conteúdo descrito no anúncio antes da compra.',
  },
  {
    question: 'As capacidades são adequadas para qualquer tamanho de família?',
    answer:
      'As peças têm capacidades compactas, entre 0,7 L e 2 L. Elas atendem a diferentes preparos, mas podem não servir para porções maiores; compare os volumes com o que você costuma cozinhar.',
  },
  {
    question: 'O Starflon Max facilita a limpeza?',
    answer:
      'O revestimento Starflon Max é antiaderente e a ficha do modelo informa que as peças podem ser lavadas na máquina de louças. Para preservar o conjunto, siga as orientações atualizadas de uso e limpeza da Tramontina.',
  },
  {
    question: 'Funciona em fogão de indução?',
    answer:
      'Não. A referência Turim 20298044 é indicada para fogões a gás, elétricos e vitrocerâmicos com resistência elétrica, não para indução.',
  },
  {
    question: 'As quatro peças vêm com tampa?',
    answer:
      'Não. A panela e a caçarola acompanham suas respectivas tampas de vidro. A frigideira e o fervedor não aparecem com tampa na composição de referência.',
  },
  {
    question: 'As imagens incluem alimentos e objetos de decoração?',
    answer:
      'Não. Ingredientes, utensílios de apoio e objetos de decoração que aparecem nas imagens não fazem parte do conjunto.',
  },
  {
    question: 'A Kynovra Deals vende ou entrega o produto?',
    answer:
      'Não. A Kynovra Deals, marca da Kynovra Solutions, é afiliada e não é fabricante nem vendedora direta. Podemos receber comissão por compras elegíveis feitas pelo link; compra, pagamento e entrega são tratados no anúncio do Mercado Livre.',
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
