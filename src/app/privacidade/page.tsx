import type { Metadata } from 'next';
import Link from 'next/link';
import { PrivacySettingsButton } from '@/components/analytics-consent';
import {
  ga4MeasurementId,
  metaPixelId,
  privacyContactUrl,
  privacyControllerName,
  privacyDisclosureReady,
  privacyRetentionSummary,
} from '@/lib/site-config';
import { siteOrigin } from '@/lib/site-origin';

export const metadata: Metadata = {
  title: 'Privacidade e cookies | Kynovra Deals',
  description:
    'Saiba como as preferências de cookies, as UTMs de campanha e os eventos opcionais são tratados na Kynovra Deals.',
  alternates: siteOrigin
    ? { canonical: new URL('/privacidade', siteOrigin) }
    : undefined,
};

const hasConfiguredTracker = Boolean(ga4MeasurementId || metaPixelId);
const trackingEnabled = Boolean(hasConfiguredTracker && privacyDisclosureReady);

export default function PrivacyPage() {
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
        <h1 className="section-title">Privacidade e cookies</h1>
        <p className="privacy-intro">
          Este aviso explica como a landing page Kynovra Deals trata dados
          usados para mensuração de campanhas e como você pode controlar esse
          uso.
        </p>

        <section aria-labelledby="privacy-operator">
          <h2 id="privacy-operator">Quem opera este site</h2>
          <p>
            Kynovra Deals é uma marca da Kynovra Solutions. A identificação
            legal do controlador precisa ser confirmada pela empresa antes de
            ativar rastreadores opcionais.
          </p>
          {privacyControllerName ? (
            <p>
              <strong>Controlador informado:</strong> {privacyControllerName}
            </p>
          ) : (
            <p className="privacy-pending">
              Nome legal do controlador: pendente de confirmação pela Kynovra
              Solutions.
            </p>
          )}
          {privacyContactUrl ? (
            <p>
              <strong>Canal de privacidade:</strong>{' '}
              <a href={privacyContactUrl} rel="noreferrer">
                {privacyContactUrl.startsWith('mailto:')
                  ? privacyContactUrl.slice('mailto:'.length)
                  : 'Acessar canal oficial'}
              </a>
            </p>
          ) : (
            <p className="privacy-pending">
              Canal oficial para solicitações de privacidade: pendente de
              informação pela Kynovra Solutions.
            </p>
          )}
        </section>

        <section aria-labelledby="privacy-data">
          <h2 id="privacy-data">O que é tratado e para quê</h2>
          <p>
            Se configurados e autorizados por você, Google Analytics 4 pode
            receber eventos de visualização da página, visualização do produto e
            clique de saída para o Mercado Livre. Meta Pixel pode receber
            eventos de visualização da página, visualização do produto e clique
            de saída. Nenhum evento de compra é enviado por esta landing page.
          </p>
          <p>
            Parâmetros de campanha presentes no endereço (como origem, campanha
            e criativo) acompanham esses eventos somente após o consentimento
            correspondente. Eles não são gravados separadamente pelo site.
          </p>
          <p>
            A escolha de consentimento fica salva no armazenamento local do
            navegador para respeitar sua preferência. Sem IDs configurados, sem
            os dados legais necessários ou sem consentimento, os rastreadores
            não são carregados. Os links para o Mercado Livre continuam
            disponíveis.
          </p>
          <p>
            <strong>Retenção:</strong>{' '}
            {privacyRetentionSummary ??
              'prazo pendente de confirmação pela Kynovra Solutions antes de ativar os rastreadores.'}
          </p>
        </section>

        <section aria-labelledby="privacy-third-parties">
          <h2 id="privacy-third-parties">Serviços de terceiros</h2>
          <p>
            Quando autorizados, os eventos são enviados diretamente ao Google
            e/ou à Meta, que tratam dados conforme suas próprias políticas e
            configurações. Esta página não recebe informações de pagamento,
            pedidos ou confirmação de compra.
          </p>
          <ul>
            {ga4MeasurementId ? (
              <li>
                Google Analytics 4:{' '}
                <a href="https://policies.google.com/privacy" rel="noreferrer">
                  Política de privacidade do Google
                </a>
                {trackingEnabled
                  ? null
                  : ' (rastreamento desativado nesta configuração)'}
              </li>
            ) : null}
            {metaPixelId ? (
              <li>
                Meta Pixel:{' '}
                <a
                  href="https://www.facebook.com/privacy/policy/"
                  rel="noreferrer"
                >
                  Política de privacidade da Meta
                </a>
                {trackingEnabled
                  ? null
                  : ' (rastreamento desativado nesta configuração)'}
              </li>
            ) : null}
            {!hasConfiguredTracker ? (
              <li>
                Nenhum ID de rastreamento está configurado neste ambiente.
              </li>
            ) : null}
          </ul>
        </section>

        <section aria-labelledby="privacy-control">
          <h2 id="privacy-control">Como alterar ou retirar sua escolha</h2>
          <p>
            Você pode rejeitar os rastreadores opcionais, escolher cada
            categoria separadamente ou retirar o consentimento a qualquer
            momento por meio das preferências abaixo. Também é possível apagar
            os dados locais do navegador.
          </p>
          <p>
            A LGPD também prevê direitos como confirmar e acessar dados,
            corrigir informações, solicitar anonimização, bloqueio, eliminação
            ou portabilidade nos casos aplicáveis, obter informações sobre
            compartilhamento e revogar o consentimento. Consulte a{' '}
            <a
              href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares"
              rel="noreferrer"
              target="_blank"
            >
              orientação da ANPD sobre direitos dos titulares
            </a>
            .
          </p>
          {trackingEnabled ? (
            <PrivacySettingsButton />
          ) : (
            <p className="privacy-pending">
              As preferências serão disponibilizadas quando os IDs e os dados
              legais de privacidade forem configurados.
            </p>
          )}
        </section>

        {!privacyDisclosureReady ? (
          <p className="privacy-update-note">
            Rastreadores opcionais permanecem desativados até a confirmação da
            identificação legal, do canal de privacidade e dos prazos de
            retenção.
          </p>
        ) : null}
      </main>
    </>
  );
}
