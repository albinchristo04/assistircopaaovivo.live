# assistircopaaovivo.live

Guia pt-BR de onde assistir a Copa do Mundo 2026 no Brasil. Astro estático, deploy na Cloudflare Pages.

Links de transmissão apontam **apenas para os canais oficiais**: CazéTV (YouTube), Globo/Globoplay, SBT e N Sports.

## Desenvolvimento

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
```

## Estrutura

- `site.config.ts` — variáveis do domínio (idioma, fuso, sufixo de slug)
- `src/data/fixtures.json` — calendário compartilhado da rede (nomes em espanhol; mapeados para pt-BR em `src/lib/data.ts`)
- `src/data/broadcasters.br.json` — transmissores oficiais do Brasil
- `src/pages/[slug].astro` — páginas por jogo (`/{time-a}-vs-{time-b}-onde-assistir`)
- `.github/workflows/freshness.yml` — rebuild diário + deploy + ping IndexNow

## Deploy (Cloudflare Pages via GitHub Actions)

Secrets necessários no repositório:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `INDEXNOW_KEY` (a chave também é servida como `/<key>.txt`)

Projeto Cloudflare Pages esperado: `assistircopaaovivo-live`.
