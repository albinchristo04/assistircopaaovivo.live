// Pings IndexNow with the site's key URLs after each freshness deploy.
// Requires INDEXNOW_KEY (also served as /<key>.txt — written into dist/ by the workflow).
const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.error('INDEXNOW_KEY not set — skipping IndexNow ping.');
  process.exit(0);
}

const host = 'assistircopaaovivo.live';
const urlList = ['/', '/gratis', '/jogos', '/brasil', '/faq'].map((p) => `https://${host}${p}`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList })
});

console.log(`IndexNow ping: ${res.status} ${res.statusText} (${urlList.length} URLs)`);
if (!res.ok && res.status !== 202) process.exit(1);
