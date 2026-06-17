import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://assistircopaaovivo.live',
  output: 'static',
  integrations: [
    sitemap({
      lastmod: new Date(),
      changefreq: 'daily',
      priority: 0.7,
      serialize(item) {
        // Boost the priority of the hub pages most likely to rank in Bing.
        if (item.url === 'https://assistircopaaovivo.live/') {
          item.priority = 1.0;
        } else if (/\/(gratis|jogos|brasil)$/.test(item.url)) {
          item.priority = 0.9;
        }
        return item;
      }
    })
  ],
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always'
  }
});
