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

Copie `.env.example` para `.env.local`. `NEXT_PUBLIC_SITE_URL` deve conter a origem HTTPS canônica. Na Vercel, se não for definido, a página usa `VERCEL_PROJECT_PRODUCTION_URL` e depois `VERCEL_URL` para canonical, Open Graph, sitemap e robots.

Os IDs opcionais são `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `NEXT_PUBLIC_META_PIXEL_ID`. Só use IDs públicos. O carregamento exige também `NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME`, `NEXT_PUBLIC_PRIVACY_CONTACT_URL` (canal oficial HTTPS ou mailto) e `NEXT_PUBLIC_PRIVACY_RETENTION_SUMMARY`, além do consentimento correspondente do visitante. Sem essa configuração, os rastreadores permanecem desativados e os links comerciais funcionam.

Todas as CTAs comerciais levam ao link fixo `https://meli.la/1REfxSi`, sem alteração de parâmetros.

## Deploy na Vercel

Importe o repositório conectado ao GitHub e mantenha o preset Next.js e os comandos detectados pela Vercel (`pnpm install` / `pnpm build`). Configure `NEXT_PUBLIC_SITE_URL` após definir o domínio de produção; adicione IDs e dados de privacidade somente quando confirmados. O site e suas rotas são gerados sem serviços de backend.
