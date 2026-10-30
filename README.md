# Kynovra Deals

Landing page estática de afiliados para o Jogo de Panelas Tramontina Turim 4 peças. O projeto usa Next.js App Router, TypeScript, Tailwind CSS e imagens locais preservadas em `interface/`; não requer backend ou banco de dados.

## Instalação local

Requer NVM, Node.js `24.22.2` (`.nvmrc`) e pnpm `12.16.1`.

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

Para validar antes de publicar: `pnpm lint`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e`.

## Ambiente

Copie `.env.example` para `.env.local`. Defina `NEXT_PUBLIC_SITE_URL` como a origem HTTPS canônica do domínio de produção; o valor da Netlify está em `netlify.toml`.

Os IDs opcionais são `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `NEXT_PUBLIC_META_PIXEL_ID`. Só use IDs públicos. Os scripts exigem consentimento por categoria e revisão concluída, indicada por `NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED=true` junto com controlador, retenção, transferências internacionais e detalhes dos logs técnicos confirmados. O contato confirmado é `contato@kynovra.digital`. Consulte `docs/legal-release-checklist.md`; não marque o aviso como aprovado antes de concluir a revisão. Sem a configuração completa, os rastreadores permanecem desativados e os links comerciais funcionam.

Todas as CTAs comerciais levam ao link fixo `https://meli.la/1REfxSi`, sem alteração de parâmetros.

## Deploy na Netlify

O projeto tramontina-turim publica a branch main do GitHub. Pushes nessa branch geram deploys de produção; pull requests geram previews. O adaptador Next.js da Netlify é detectado durante pnpm build. O netlify.toml define a URL canônica e as opções de instalação pnpm.

Configure NEXT_PUBLIC_GA_MEASUREMENT_ID ou NEXT_PUBLIC_META_PIXEL_ID somente após a revisão de privacidade e consentimento. Sem esses IDs, os rastreadores permanecem desativados.

## Métricas e atribuição

Com os IDs configurados e o consentimento correspondente, GA4 mede `page_view` e `affiliate_outbound_click`; o clique inclui UTMs válidas e a posição do CTA (`cta_position`). Com consentimento de Marketing, o Meta Pixel mede `PageView`, `ViewContent` e `AffiliateOutboundClick`. Clique de saída não é venda; nenhum evento `Purchase` é enviado. Os CTAs sem consentimento e as visitas sem IDs ficam sem mensuração nesses sistemas, portanto ausência de evento não significa ausência de visita. Compare cliques no link e investimento no Meta Ads Manager com visitas e saídas consentidas no analytics; use comissões aprovadas do painel de afiliados do Mercado Livre para resultado comercial, sujeito às regras de atribuição da plataforma.

- Taxa de carregamento: visualizações mensuradas da página ÷ cliques no link do anúncio.
- Taxa de saída: cliques de saída mensurados ÷ visualizações mensuradas.
- Custo por visita e por saída: investimento reportado ÷ visitas ou saídas mensuradas, respectivamente.
- Resultado financeiro: comissões aprovadas menos investimento e demais custos relevantes.

Essas métricas têm fontes e consentimentos diferentes; não compare como contagens completas se parte do tráfego não autorizou a mensuração. Um orçamento pequeno não permite concluir significância estatística nem rentabilidade apenas com cliques.

O CNAME de panelas-turim deve apontar para tramontina-turim.netlify.app; não altere nameservers nem outros registros.
