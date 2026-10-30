import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import {
  analyticsTrackingAvailable,
  ga4MeasurementId,
  marketingTrackingAvailable,
  metaPixelId,
  optionalTrackingAvailable,
  privacyDisclosureReady,
} from '@/lib/site-config';
import { siteOrigin } from '@/lib/site-origin';

export const metadata: Metadata = {
  title: 'Política de Cookies | Kynovra Deals',
  description: optionalTrackingAvailable
    ? 'Entenda como as escolhas de consentimento controlam Analytics e Marketing na Kynovra Deals.'
    : 'Conheça o armazenamento e as tecnologias de rastreamento da Kynovra Deals. Atualmente, Analytics e Marketing não estão habilitados.',
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

        <section aria-labelledby="cookies-essential">
          <h2 id="cookies-essential">1. Essenciais e preferência</h2>
          <p>
            Não identificamos cookies próprios indispensáveis no código da
            landing page. O armazenamento local de preferências só é usado
            quando há uma integração opcional liberada e o painel de
            consentimento está ativo; essa preferência não é um cookie.
          </p>
          {optionalTrackingAvailable ? (
            <p>
              Nesse caso, a escolha é salva no localStorage, com fallback para
              sessionStorage durante a sessão da aba. A janela aparece na nova
              sessão e não em cada navegação interna; escolhas anteriores são
              mostradas para confirmação ou alteração. Se os dois armazenamentos
              forem bloqueados, os rastreadores opcionais permanecem desligados.
            </p>
          ) : (
            <p>
              Neste momento não há integrações opcionais liberadas, então não
              mostramos um painel de consentimento nem guardamos escolhas de
              Analytics ou Marketing. Se restar uma preferência de uma versão
              anterior, ela é removida ao carregar a página.
            </p>
          )}
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
          ) : !analyticsTrackingAvailable ? (
            <p>
              Há um ID configurado, mas a integração permanece desativada até a
              revisão das informações de privacidade.
            </p>
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
          ) : !marketingTrackingAvailable ? (
            <p>
              Há um ID configurado, mas a integração permanece desativada até a
              revisão das informações de privacidade.
            </p>
          ) : null}
        </section>

        <section aria-labelledby="cookies-status">
          <h2 id="cookies-status">4. Estado atual e retenção</h2>
          <p>
            {optionalTrackingAvailable
              ? 'Há integração opcional liberada neste ambiente. Ela só carrega depois da autorização específica; Analytics e Marketing são escolhas independentes.'
              : hasConfiguredTracker
                ? 'Há ID(s) configurado(s), mas as integrações seguem desativadas enquanto a revisão de privacidade estiver pendente.'
                : 'Não há IDs de Analytics ou Marketing configurados neste ambiente; esses scripts não são carregados e o painel de consentimento não é exibido.'}{' '}
            Não são informados prazos de cookies de terceiros sem validação da
            configuração real. Consulte também o{' '}
            <Link href="/privacidade">Aviso de Privacidade</Link>.
          </p>
          {optionalTrackingAvailable ? (
            <p>
              Ao revogar uma categoria, a página interrompe novos eventos,
              atualiza o estado de consentimento do fornecedor quando o script
              já foi carregado e tenta remover identificadores próprios
              conhecidos. Não consegue apagar cookies definidos em outros
              domínios; eles podem ser removidos nas configurações do navegador.
            </p>
          ) : null}
        </section>

        <section aria-labelledby="cookies-manage">
          <h2 id="cookies-manage">5. Como alterar ou apagar preferências</h2>
          <p>
            {optionalTrackingAvailable
              ? 'Na janela inicial, escolha Aceitar opcionais, Rejeitar opcionais ou Personalizar. Analytics e Marketing têm controles independentes e começam desativados. Após decidir, o botão “Alterar consentimento” aparece no rodapé; a janela volta em uma nova sessão com a escolha anterior para confirmação ou alteração.'
              : 'Como não há rastreadores opcionais liberados neste ambiente, não há painel nem preferências para alterar. Se uma integração for habilitada após a revisão de privacidade, o painel será apresentado antes de qualquer rastreamento opcional.'}{' '}
            O conteúdo e os links comerciais permanecem acessíveis em qualquer
            configuração.
          </p>
        </section>

        <section aria-labelledby="cookies-updates">
          <h2 id="cookies-updates">6. Atualizações</h2>
          <p>
            Esta política será revisada quando os serviços, configurações ou
            prazos efetivamente usados forem confirmados ou alterados.
          </p>
          <p>Última atualização: 30 de outubro de 2026.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
