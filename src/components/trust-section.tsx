import {
  BadgeCheck,
  CircleHelp,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const trustDetails = [
  {
    eyebrow: 'INFORMAÇÃO IMPORTANTE',
    title: 'Não é compatível com indução.',
    description:
      'É indicada para fogões a gás, elétricos e vitrocerâmicos com resistência elétrica. Confira a ficha técnica do fabricante.',
    icon: CircleHelp,
  },
  {
    eyebrow: 'COMPRA, ENTREGA E PAGAMENTO',
    title: 'Você conclui a compra no Mercado Livre.',
    description:
      'A Kynovra Deals é afiliada, não fabricante nem vendedora direta. Vendedor, pagamento e entrega são definidos no anúncio de destino.',
    icon: ExternalLink,
  },
  {
    eyebrow: 'PREÇO E DISPONIBILIDADE',
    title: 'Consulte os dados atualizados no destino.',
    description:
      'Preço, frete, estoque e prazo podem mudar. Confira essas condições diretamente no anúncio antes de comprar.',
    icon: BadgeCheck,
  },
  {
    eyebrow: 'USO E CONSERVAÇÃO',
    title: 'Siga as orientações do fabricante.',
    description:
      'Consulte as instruções de uso, limpeza e conservação para cuidar do revestimento e utilizar cada peça corretamente.',
    icon: ShieldCheck,
  },
];

export function TrustSection() {
  return (
    <section
      aria-labelledby="trust-title"
      className="trust-section"
      id="antes-de-comprar"
    >
      <div className="page-shell">
        <div className="trust-heading">
          <p className="eyebrow eyebrow-light">TRANSPARÊNCIA ANTES DE TUDO</p>
          <h2 className="section-title" id="trust-title">
            Uma boa compra começa com a informação certa.
          </h2>
          <p>
            Preferimos ajudar você a escolher com segurança, em vez de esconder
            detalhes que podem fazer diferença.
          </p>
        </div>

        <div className="trust-grid">
          {trustDetails.map((detail) => {
            const Icon = detail.icon;

            return (
              <article className="trust-card" key={detail.title}>
                <div className="trust-card-heading">
                  <span className="trust-card-icon">
                    <Icon aria-hidden="true" size={17} strokeWidth={1.9} />
                  </span>
                  <p className="trust-eyebrow">{detail.eyebrow}</p>
                </div>
                <h3>{detail.title}</h3>
                <p>{detail.description}</p>
              </article>
            );
          })}
        </div>

        <p className="affiliate-disclosure">
          <span aria-hidden="true" className="disclosure-dot" />A Kynovra Deals
          é uma marca da Kynovra Solutions e pode receber comissão por compras
          elegíveis realizadas por links de afiliado.
        </p>
      </div>
    </section>
  );
}
