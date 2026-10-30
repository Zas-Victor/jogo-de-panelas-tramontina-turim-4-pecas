import type { Metadata } from 'next';
import Link from 'next/link';
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
    'Entenda quando aparece a janela de consentimento e como as escolhas de cookies controlam Analytics e Marketing na Kynovra Deals.',
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
            A página salva as opções de Analytics e Marketing no localStorage,
            na chave <code>kynovra-privacy-consent-v2</code>. Se o localStorage
            estiver indisponível, tenta usar sessionStorage na mesma chave. O
            registro contém apenas as escolhas e a versão da preferência, sem ID
            de visita ou data adicional.
          </p>
          <p>
            Esses mecanismos de armazenamento não são cookies. Não há, no código
            da landing page, outro cookie essencial identificado. A escolha
            salva no localStorage não expira automaticamente; a cópia em
            sessionStorage vale durante a sessão daquela aba. Um marcador
            separado em sessionStorage registra que você já decidiu durante a
            sessão atual, para a janela não reaparecer em cada navegação
            interna.
          </p>
          <p>
            Se o localStorage estiver indisponível, a página tenta manter a
            escolha em sessionStorage durante a sessão da aba. Se ambos forem
            bloqueados, a preferência não poderá ser persistida e as integrações
            opcionais não serão carregadas; o acesso ao conteúdo e aos links
            comerciais continua disponível.
          </p>
          <p>
            A janela aparece automaticamente no início de uma nova sessão. Se
            houver uma escolha anterior salva, ela é apresentada novamente para
            confirmação ou alteração. Na primeira visita, nenhuma categoria
            opcional vem autorizada.
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
            Na janela inicial, escolha Aceitar opcionais, Rejeitar opcionais ou
            Personalizar. Em Personalizar, Analytics e Marketing têm controles
            independentes; sem consentimento anterior, ambos começam
            desativados. Depois da primeira decisão, o botão discreto “Alterar
            consentimento” aparece no rodapé e permite revogar ou modificar a
            escolha a qualquer momento. Ao iniciar uma nova sessão, a janela
            reaparece e mostra as opções salvas anteriormente. Você também pode
            limpar os dados do site nas configurações do navegador.
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
