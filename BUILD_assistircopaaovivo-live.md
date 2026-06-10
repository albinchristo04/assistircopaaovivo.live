# Claude Code Build Spec — assistircopaaovivo.live

## Role of this domain in the network
**Portuguese-language, Brazil-focused** "where to watch" guide. Target literal queries: **"assistir copa ao vivo"**, **"copa do mundo ao vivo"**, **"onde assistir a copa"**. Brazil is the single biggest market in the network.

> Model: legitimate where-to-watch guide linking to official Brazilian rights holders. Brazil is especially favourable because **CazéTV streams all 104 matches FREE on YouTube** — so the honest answer to "assistir grátis e legal" is a real, linkable, free option.

## Target keyword clusters (Bing, pt-BR) — grounded in live query data
Pattern: subject + intent modifier. The free cluster is huge in Brazil — lead with CazéTV.
- **Primary**: assistir copa ao vivo · copa do mundo ao vivo · onde assistir a copa
- **Free (high volume)**: assistir copa do mundo 2026 grátis · copa ao vivo grátis · CazéTV ao vivo · jogo do brasil ao vivo grátis
- **Seleção**: que horas é o jogo do brasil · jogos do brasil na copa 2026 · `brasil vs {rival} onde assistir` / `que horas`
- **Daily**: jogos de hoje · jogos de hoje na tv · futebol ao vivo hoje
- **Per-fixture long-tail (highest fast-rank value, one page each)**: `{A} vs {B} onde assistir ao vivo` · `{A} x {B} que horas e qual canal` · `que horas é o jogo do {seleção}`
- **Modifiers to place literally in title/H1/first-100-words**: ao vivo · grátis · de graça · hoje · que horas · onde assistir · qual canal · transmissão
- **Question-format headings** (~22% more Bing visibility): "Que horas é o jogo do Brasil?", "Onde assistir {A} x {B} ao vivo?"
- **Kickoff times in horário de Brasília** on every match page (Brazil games 19h/22h).
- **Avoid**: broadcaster brand terms as primary; pirate-intent phrasing. "Grátis" is legitimate — CazéTV streams all 104 free on YouTube.

## Bing-first SEO requirements
- **Title**: `Assistir Copa ao Vivo 2026: Onde Ver Todos os Jogos Grátis | Globo, CazéTV, SBT`
- **H1** (one): `Assistir Copa do Mundo ao Vivo 2026 — Onde Ver no Brasil`
- Exact phrase "assistir copa ao vivo" in first 100 words, meta description, and H2s ("Assistir grátis no YouTube via CazéTV", "Na TV pela Globo", "SBT e N Sports").
- JSON-LD: `SportsEvent` + `BroadcastEvent` + `FAQPage`.
- Freshness: "próximos jogos / horários de Brasília" block, kept current.
- 900+ words core pages; sitemap to Bing Webmaster Tools + IndexNow.
- Alt text = keyword + broadcaster.

## Page structure
1. **Home** (`/`): "Assistir Copa ao vivo 2026 — onde ver no Brasil". Intro, the three official routes (free YouTube / TV / pay), next jogos, FAQ.
2. **Como assistir grátis** (`/gratis`): CazéTV on YouTube — the legitimate free route. Strong literal-query magnet ("assistir copa gratis"). Links straight to the official CazéTV channel.
3. **Jogos de hoje / calendário** (`/jogos`): fixtures in horário de Brasília. High-freshness.
4. **Jogos do Brasil** (`/brasil`): the seleção's matches + where each airs.
5. **FAQ**.

## Official broadcasters to link out to (verify at build)
- **CazéTV** — free, all 104 matches, on YouTube (youtube.com/@CazeTVoficial). Lead with this for the "grátis e legal" angle.
- **Grupo Globo** — TV (primary, ~55 matches) + Globoplay (globoplay.globo.com) + ge.globo for info.
- **SBT** + **N Sports** — secondary FTA (~32 matches).
- Label all as "transmissão oficial"; link to each broadcaster's own site/app/channel only.

## Internal linking (careful)
- 1–2 contextual links, descriptive Portuguese anchors:
  - → `mundialenvivo.live` as "guia em espanhol para ver o Mundial na América do Sul" (only where genuinely relevant, e.g. for cross-border fans).
  - → `partidosdehoy.live` sparingly (it's Spanish — link only if you add a PT-equivalent "jogos de hoje" page, otherwise keep cross-links within PT).
- No footer ring; vary anchors.

## Outbound authority links
FIFA official + the broadcasters above. Bing rewards relevant high-authority outbound links.

## Tech stack (Astro + Cloudflare Pages + GitHub Actions)
- **Framework**: Astro, static output (`output: 'static'`). Zero client JS by default; Astro island only where truly needed.
- **Per-site config**: `site.config.ts` sets this domain's variables — `<html lang>` `pt-BR`, watch verb `assistir`, slug suffix `onde-assistir`, focus country BR, social handles. Selected via `SITE` env var. Shared codebase with the Spanish sites.
- **Content/data**: content collections from `fixtures.json` (use `teamA_pt`/`teamB_pt` fields) + `broadcasters.json`. Per-match pages via `getStaticPaths()` for Brazil.
- **Per-match page**: route `/[teamA]-vs-[teamB]-onde-assistir`. Title/H1 = exact PT long-tail query. First 100 words = date, horário de Brasília, canal oficial, grátis/pago — lead the free answer with CazéTV (YouTube). JSON-LD SportsEvent + BroadcastEvent in `<head>`.
- **Schema**: blocks from `assets_schema_jsonld.md` translated to PT (`inLanguage: pt-BR`); broadcaster data from `broadcasters.json`.
- **Styling**: minimal CSS, inline critical CSS, sub-1s mobile LCP, answer above the fold.
- **Sitemap**: `@astrojs/sitemap`; submit to Bing Webmaster Tools.
- **IndexNow key**: `/<key>.txt` in `/public`.
- **Hosting**: Cloudflare Pages, auto-deploy from GitHub on push to `main`.
- **Freshness (GitHub Actions)**: scheduled `.github/workflows/freshness.yml` → build (stamping today's date + jogos) → wrangler deploy → IndexNow push of changed URLs. Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `INDEXNOW_KEY`.
- HTTPS, one H1/page.
- Footer + share to Instagram page for social signals (tie via `sameAs` schema).

## Constraints
- No embedded players, no m3u8, no links to unlicensed streams. The "grátis" page resolves to **CazéTV's official YouTube**, never to a pirate stream.
