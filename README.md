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

O CNAME de panelas-turim deve apontar para tramontina-turim.netlify.app; não altere nameservers nem outros registros.
