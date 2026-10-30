import type { Metadata } from 'next';
import Link from 'next/link';
import { PrivacySettingsButton } from '@/components/analytics-consent';
import { SiteFooter } from '@/components/site-footer';
import {
  ga4MeasurementId,
  metaPixelId,
  privacyDisclosureReady,
} from '@/lib/site-config';
import { siteOrigin } from '@/lib/site-origin';

export const metadata: Metadata = {
  title: 'Política de Cookies | Kynovra Deals',
  description:
    'Veja como as preferências, o Google Analytics 4 e o Meta Pixel podem usar cookies ou identificadores na Kynovra Deals.',
  alternates: siteOrigin
    ? { canonical: new URL('/cookies', siteOrigin) }
    : undefined,
  robots: { index: privacyDisclosureReady, follow: true },
};

export default function CookiesPage() {
  const hasConfiguredTracker = Boolean(ga4MeasurementId || metaPixelId);

  return (
    <>
      <a className="skip-link" href="#cookies-content">
        Pular para o conteúdo
      </a>
      <main
        className="privacy-page page-shell"
        id="cookies-content"
        tabIndex={-1}
      >
        <Link className="privacy-back-link" href="/">
          Voltar à Kynovra Deals
        </Link>
        <p className="eyebrow">CONTROLE DA SUA NAVEGAÇÃO</p>
        <h1 className="section-title">Política de Cookies</h1>
        <p className="privacy-intro">
          Esta página explica o armazenamento local e as tecnologias opcionais
          que podem ser usadas nesta landing page. Recusar cookies opcionais não
          bloqueia o conteúdo nem os links comerciais.
        </p>

        {!privacyDisclosureReady ? (
          <p className="privacy-update-note" role="status">
            <strong>Documento preliminar:</strong> os detalhes de retenção,
            identificadores efetivamente criados e transferências internacionais
            ainda precisam ser confirmados. Os rastreadores opcionais ficam
            desativados até a revisão dessas informações.
          </p>
        ) : null}

        <section aria-labelledby="cookies-essential">
          <h2 id="cookies-essential">1. Essenciais e preferência</h2>
          <p>
            O código desta página não grava cookies próprios para manter sua
            preferência. Ele salva as opções de Analytics e Marketing no
            armazenamento local do navegador, na chave{' '}
            <code>kynovra-privacy-consent-v2</code>. Esse registro guarda apenas
            as escolhas e a versão da preferência, sem ID de visita ou data
            adicional.
          </p>
          <p>
            O armazenamento local é usado para lembrar a decisão e não é um
            cookie. Não há, no código da landing page, outro cookie essencial
            identificado. A preferência permanece até ser revogada, apagada no
            navegador ou invalidada por mudança de versão; não há expiração
            automática configurada.
          </p>
          <p>
            Se o navegador bloquear o armazenamento local, a escolha permanece
            apenas na página atual e será solicitada novamente após uma nova
            visita. Isso não impede o acesso ao conteúdo ou ao Mercado Livre.
          </p>
        </section>

        <section aria-labelledby="cookies-analytics">
          <h2 id="cookies-analytics">2. Analytics — Google Analytics 4</h2>
          <p>
            Se houver ID configurado, a revisão de privacidade estiver concluída
            e você autorizar Analytics, o Google Analytics 4 pode receber
            visualizações da página e do produto e cliques de saída. O serviço
            pode gravar cookies ou outros identificadores no navegador para
            distinguir visitas e medir uso. Os nomes e os prazos efetivos
            dependem da configuração do serviço e ainda não foram verificados
            para esta instalação.
          </p>
          {!ga4MeasurementId ? (
            <p>Neste ambiente, não há ID de Google Analytics 4 configurado.</p>
          ) : null}
        </section>

        <section aria-labelledby="cookies-marketing">
          <h2 id="cookies-marketing">3. Marketing — Meta Pixel</h2>
          <p>
            Se houver ID configurado, a revisão de privacidade estiver concluída
            e você autorizar Marketing, o Meta Pixel pode receber eventos de
            visualização e cliques de saída para medir campanhas. O serviço pode
            usar cookies ou identificadores de navegador para atribuição e
            mensuração de anúncios. Os identificadores e os prazos efetivos
            dependem da configuração da Meta e ainda não foram verificados para
            esta instalação.
          </p>
          {!metaPixelId ? (
            <p>Neste ambiente, não há ID de Meta Pixel configurado.</p>
          ) : null}
        </section>

        <section aria-labelledby="cookies-status">
          <h2 id="cookies-status">4. Estado atual e retenção</h2>
          <p>
            {hasConfiguredTracker
              ? 'Há integração configurada neste ambiente, mas ela permanece bloqueada até que as informações de privacidade sejam confirmadas e você autorize a categoria correspondente.'
              : 'Não há IDs de Analytics ou Marketing configurados neste ambiente; portanto, esses scripts opcionais não são carregados.'}{' '}
            Não são informados prazos de cookies de terceiros sem validação da
            configuração real. Consulte também o{' '}
            <Link href="/privacidade">Aviso de Privacidade</Link>.
          </p>
          <p>
            Quando você revoga uma categoria, a página pede ao Google que negue
            o armazenamento de Analytics, envia ao Meta a instrução de revogação
            se o Pixel tiver sido carregado e tenta remover identificadores
            próprios conhecidos desses serviços. Cookies de terceiros fora do
            domínio da página não podem ser apagados por ela; se necessário,
            remova-os também nas configurações do navegador.
          </p>
        </section>

        <section aria-labelledby="cookies-manage">
          <h2 id="cookies-manage">5. Como alterar ou apagar preferências</h2>
          <p>
            Use o botão abaixo ou o link permanente “Preferências de cookies” no
            rodapé para aceitar, rejeitar ou escolher Analytics e Marketing
            separadamente. A escolha pode ser alterada a qualquer momento. Você
            também pode limpar os dados do site nas configurações do navegador;
            nesse caso, a página perguntará novamente quando houver integrações
            opcionais disponíveis.
          </p>
          <PrivacySettingsButton />
        </section>

        <section aria-labelledby="cookies-updates">
          <h2 id="cookies-updates">6. Atualizações</h2>
          <p>
            Esta política será revisada quando os serviços, configurações ou
            prazos efetivamente usados forem confirmados ou alterados.
          </p>
          <p>Última atualização: 29 de outubro de 2026.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
