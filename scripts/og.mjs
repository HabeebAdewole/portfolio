/* Renders the Open Graph card to public/og.png at 1200x630.
   Run with: node scripts/og.mjs
   Re-run whenever the figures on the card change. */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, 'og-card.html');
const out = path.join(here, '..', 'public', 'og.png');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto('file://' + src.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

console.log('wrote', out);
