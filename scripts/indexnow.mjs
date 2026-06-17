// Pings IndexNow (Bing/Yandex/etc.) with every built URL after each deploy, for
// near-instant indexing. Reads the freshly built dist/ so per-match pages are
// included automatically — not just the static hub pages.
//
// Requires INDEXNOW_KEY (also served as /<key>.txt — written into dist/ by the
// workflow). Skips gracefully if the key is missing so it never breaks a deploy.

import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.error('INDEXNOW_KEY not set — skipping IndexNow ping.');
  process.exit(0);
}

const host = 'assistircopaaovivo.live';
const DIST = 'dist';

async function collectHtml(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectHtml(full)));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function fileToUrl(file) {
  // dist/index.html -> /, dist/jogos/index.html -> /jogos
  let rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return `https://${host}/`;
  rel = rel.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return `https://${host}/${rel}`;
}

const files = await collectHtml(DIST);
let urlList = [...new Set(files.map(fileToUrl))].filter((u) => !u.endsWith('/404')).sort();

// Fallback to the known hub pages if dist/ couldn't be read (e.g. run out of order).
if (urlList.length === 0) {
  urlList = ['/', '/gratis', '/jogos', '/brasil', '/faq'].map((p) => `https://${host}${p}`);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList })
});

console.log(`IndexNow ping: ${res.status} ${res.statusText} (${urlList.length} URLs)`);
if (!res.ok && res.status !== 202) process.exit(1);
