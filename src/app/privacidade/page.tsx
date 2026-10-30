import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import {
  ga4MeasurementId,
  metaPixelId,
  privacyContactLabel,
  privacyContactUrl,
  privacyControllerName,
  privacyDisclosureReady,
  privacyRetentionSummary,
  privacyTechnicalLogsSummary,
  privacyTransferSummary,
} from '@/lib/site-config';
import { siteOrigin } from '@/lib/site-origin';

export const metadata: Metadata = {
  title: 'Aviso de Privacidade | Kynovra Deals',
  description:
    'Entenda quais dados a landing page Kynovra Deals trata, para quais finalidades e como exercer seus direitos de privacidade.',
  alternates: siteOrigin
    ? { canonical: new URL('/privacidade', siteOrigin) }
    : undefined,
  robots: { index: privacyDisclosureReady, follow: true },
};

function ExternalLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

export default function PrivacyPage() {
  const hasConfiguredTracker = Boolean(ga4MeasurementId || metaPixelId);

  return (
    <>
      <a className="skip-link" href="#privacy-content">
        Pular para o conteúdo
      </a>
      <main
        className="privacy-page page-shell"
        id="privacy-content"
        tabIndex={-1}
      >
        <Link className="privacy-back-link" href="/">
          Voltar à Kynovra Deals
        </Link>
        <p className="eyebrow">TRANSPARÊNCIA E CONTROLE</p>
        <h1 className="section-title">Aviso de Privacidade</h1>
        <p className="privacy-intro">
          Este aviso descreve o tratamento de dados na landing page Kynovra
          Deals, uma página de divulgação e afiliação. A compra e o pagamento
          são feitos no Mercado Livre; esta página não recebe dados de pedido ou
          pagamento.
        </p>

        <section aria-labelledby="privacy-controller">
          <h2 id="privacy-controller">1. Quem é responsável</h2>
          <p>
            Kynovra Deals é uma marca da Kynovra Solutions, operação de pessoa
            física sem CNPJ. A localidade informada para a operação é Natal, Rio
            Grande do Norte, Brasil.
          </p>
          <p>
            <strong>Controlador:</strong>{' '}
            {privacyControllerName ??
              'pessoa física responsável pela operação; nome civil pendente de confirmação.'}
          </p>
          <p>
            <strong>Canal para privacidade:</strong>{' '}
            <a href={privacyContactUrl}>{privacyContactLabel}</a>. As
            solicitações podem ser enviadas por e-mail e são tratadas
            manualmente pelo responsável. O recebimento deste endereço ainda
            está pendente de teste.
          </p>
        </section>

        <section aria-labelledby="privacy-data">
          <h2 id="privacy-data">
            2. Dados tratados, finalidades e bases legais
          </h2>
          <ul>
            <li>
              <strong>Preferência de cookies:</strong> a escolha entre Analytics
              e Marketing fica no armazenamento local do navegador, sem
              identificador de visita. Serve para guardar e respeitar a escolha.
              A definição da base legal específica para este registro mínimo
              está pendente de revisão.
            </li>
            <li>
              <strong>Dados técnicos de acesso:</strong> a Netlify recebe a
              requisição HTTP necessária para entregar e proteger o site. A URL
              pode incluir parâmetros de campanha (UTMs). Ainda é preciso
              confirmar quais campos são registrados nos logs, quem os acessa,
              por quanto tempo são mantidos e qual base legal se aplica.
            </li>
            <li>
              <strong>Parâmetros de campanha (UTMs):</strong> quando presentes
              no endereço, podem ser enviados junto a eventos de analytics ou
              marketing somente se a categoria correspondente estiver
              configurada, liberada e autorizada. A base legal é o consentimento
              para a categoria escolhida.
            </li>
            <li>
              <strong>Eventos opcionais:</strong> com consentimento, o Google
              Analytics 4 pode receber visualizações de página e do produto e
              cliques de saída; o Meta Pixel pode receber visualizações e
              cliques de saída. A base legal é o consentimento, que pode ser
              revogado. Nenhum evento de compra é enviado.
            </li>
            <li>
              <strong>Navegação para o Mercado Livre:</strong> ao ativar um link
              comercial, o navegador abre o endereço de afiliado solicitado e
              envia dados técnicos ao destino. Sem consentimento para
              mensuração, a landing page não registra esse clique em analytics
              ou marketing.
            </li>
            <li>
              <strong>Pedidos de privacidade:</strong> se você enviar um e-mail,
              o endereço e o conteúdo da mensagem serão usados para responder e
              tratar a solicitação. O canal e o atendimento são manuais; a base
              legal específica e a retenção dessas mensagens ainda precisam ser
              documentadas.
            </li>
          </ul>
          <p>
            A página não possui formulário, não recebe pagamentos e não coleta
            dados de compra. O Mercado Livre informa as próprias condições de
            compra, pagamento e entrega no anúncio de destino.
          </p>
        </section>

        <section aria-labelledby="privacy-logs">
          <h2 id="privacy-logs">3. Logs técnicos e ferramentas de análise</h2>
          <p>
            A Netlify hospeda e entrega a página e pode gerar registros técnicos
            de requisições. A URL recebida pelo serviço pode conter UTMs; ainda
            não confirmamos quais campos são efetivamente mantidos em logs, quem
            pode acessá-los, sua finalidade detalhada nem os períodos de
            retenção. Não atribuímos prazos ou práticas não verificados.
          </p>
          <p>
            {hasConfiguredTracker
              ? 'Há um ou mais IDs de integração configurados neste ambiente. Os scripts continuam bloqueados até que as informações legais e técnicas sejam confirmadas e você autorize a categoria correspondente.'
              : 'Nenhum ID de Google Analytics 4 ou Meta Pixel está configurado neste ambiente; por isso, esses scripts não são carregados.'}{' '}
            Quando habilitados após revisão, Analytics e Marketing são
            independentes e opcionais. Consulte a{' '}
            <Link href="/cookies">Política de Cookies</Link>.
          </p>
        </section>

        <section aria-labelledby="privacy-cookies">
          <h2 id="privacy-cookies">4. Cookies e armazenamento local</h2>
          <p>
            A preferência é salva prioritariamente no armazenamento local
            (localStorage). Se ele estiver indisponível, a página tenta usar
            sessionStorage para manter a escolha durante a sessão daquela aba. O
            registro contém a versão da preferência e as escolhas de Analytics e
            Marketing, sem ID de visita ou data. O localStorage não tem
            expiração automática; o sessionStorage dura enquanto a sessão da aba
            permanecer aberta.
          </p>
          <p>
            Google Analytics 4 e Meta Pixel podem usar cookies ou
            identificadores de navegador quando configurados e autorizados. Os
            nomes e prazos efetivos dependem das configurações dos serviços e
            ainda não foram verificados nesta instalação. Não declaramos
            períodos não confirmados. Consulte a{' '}
            <Link href="/cookies">Política de Cookies</Link>. Depois da primeira
            decisão, o botão “Alterar consentimento” no rodapé permite revisar
            ou revogar as escolhas; a janela também reaparece em uma nova
            sessão.
          </p>
        </section>

        <section aria-labelledby="privacy-sharing">
          <h2 id="privacy-sharing">5. Compartilhamento com fornecedores</h2>
          <ul>
            <li>
              <strong>Netlify:</strong> hospedagem e entrega da landing page;
              pode processar requisições e gerar registros técnicos. Os campos,
              acessos e prazos efetivos ainda precisam ser confirmados.
            </li>
            <li>
              <strong>Mercado Livre:</strong> recebe a requisição quando você
              segue o link de afiliado; compra e pagamento acontecem fora desta
              página.
            </li>
            <li>
              <strong>Google:</strong> recebe eventos de analytics apenas com
              integração configurada, revisão concluída e consentimento de
              Analytics.
            </li>
            <li>
              <strong>Meta:</strong> recebe eventos de marketing apenas com
              integração configurada, revisão concluída e consentimento de
              Marketing.
            </li>
          </ul>
          <p>
            Cada fornecedor aplica seus próprios termos e avisos de privacidade.
            Não adicionamos outros destinatários além dos serviços informados
            para esta operação.
          </p>
          <ul>
            <li>
              <ExternalLink href="https://www.netlify.com/privacy/">
                Aviso de privacidade da Netlify
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.mercadolivre.com.br/privacidade/declaracao-privacidade">
                Aviso de privacidade do Mercado Livre
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://policies.google.com/privacy">
                Política de privacidade do Google
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.facebook.com/privacy/policy/">
                Política de privacidade da Meta
              </ExternalLink>
            </li>
          </ul>
        </section>

        <section aria-labelledby="privacy-transfers">
          <h2 id="privacy-transfers">6. Transferências internacionais</h2>
          <p>
            Já foi identificado que a operação envolve transferências
            internacionais relacionadas aos serviços utilizados. Os países de
            destino, os dados envolvidos, os papéis dos fornecedores e os
            mecanismos aplicáveis ainda precisam ser documentados. Analytics e
            Meta Pixel permanecem desativados enquanto essa revisão estiver
            pendente; hospedagem e navegação para serviços externos continuam
            sujeitas às práticas dos respectivos fornecedores.
          </p>
          {privacyTransferSummary ? <p>{privacyTransferSummary}</p> : null}
          <p>
            <ExternalLink href="https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024">
              Regulamento de Transferência Internacional de Dados da ANPD
            </ExternalLink>
          </p>
        </section>

        <section aria-labelledby="privacy-retention">
          <h2 id="privacy-retention">7. Retenção e exclusão</h2>
          <p>
            Mantemos dados pelo menor prazo necessário a cada finalidade, mas os
            períodos específicos ainda precisam ser verificados por tipo de dado
            e fornecedor. O registro da preferência no navegador não tem
            expiração automática; ao alterar ou revogar a escolha, o registro é
            atualizado. Você também pode apagar os dados do site no navegador.
          </p>
          {privacyRetentionSummary ? <p>{privacyRetentionSummary}</p> : null}
          {privacyTechnicalLogsSummary ? (
            <p>{privacyTechnicalLogsSummary}</p>
          ) : null}
        </section>

        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights">8. Seus direitos e como solicitá-los</h2>
          <p>
            A LGPD prevê, conforme aplicável, confirmação e acesso aos dados,
            correção, anonimização, bloqueio ou eliminação de dados
            desnecessários ou tratados em desconformidade, portabilidade nos
            termos da regulamentação, informação sobre compartilhamento,
            informação sobre consentimento e sua revogação, e oposição nas
            hipóteses previstas em lei. Também é possível peticionar à ANPD.
          </p>
          <p>
            Para pedir acesso, correção ou exclusão, escreva para{' '}
            <a href={privacyContactUrl}>{privacyContactLabel}</a>, descreva o
            pedido e indique a página ou o tratamento a que se refere. O
            responsável fará o atendimento manualmente e poderá solicitar
            informações proporcionais para confirmar a identidade antes de agir.
            Não envie senha, dados de pagamento ou documentos além do necessário
            para essa confirmação.
          </p>
          <p>
            <ExternalLink href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares">
              Orientação da ANPD sobre direitos dos titulares
            </ExternalLink>
          </p>
        </section>

        <section aria-labelledby="privacy-security">
          <h2 id="privacy-security">9. Segurança</h2>
          <p>
            A landing page é estática, não oferece formulário nem processa
            pagamentos. Scripts opcionais só podem ser carregados após a revisão
            das informações e a escolha afirmativa correspondente. A
            infraestrutura de hospedagem e cada fornecedor mantêm controles
            próprios; detalhes específicos de logs e salvaguardas de
            transferências ainda precisam ser confirmados. Nenhuma medida
            elimina todos os riscos.
          </p>
        </section>

        <section aria-labelledby="privacy-changes">
          <h2 id="privacy-changes">10. Atualizações deste aviso</h2>
          <p>
            Atualizaremos esta página quando as práticas ou as informações
            confirmadas mudarem. Uma alteração que mude a finalidade ou as
            categorias opcionais exigirá nova escolha antes de carregar os
            respectivos rastreadores.
          </p>
          <p>Última atualização: 30 de outubro de 2026.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
