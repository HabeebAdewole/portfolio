import { chromium } from 'playwright';

const URL = 'http://localhost:5173/';
const out = {};

const lum = (c) => {
  const [r, g, b] = c.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const browser = await chromium.launch();

/* ---------- contrast + semantics, desktop ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  out.contrast = await page.evaluate(() => {
    const lum2 = (c) => {
      const [r, g, b] = c.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const hx = (h) => {
      h = h.trim().replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    const rt = (a, b) => {
      const l1 = lum2(hx(a)), l2 = lum2(hx(b));
      const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
      return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
    };
    const tok = (n) => getComputedStyle(document.documentElement).getPropertyValue(n);
    const root = document.documentElement;
    const probe = () => ({
      'muted/ground (4.5)': rt(tok('--muted'), tok('--ground')),
      'data/ground (4.5)': rt(tok('--data'), tok('--ground')),
      'mark/ground (4.5)': rt(tok('--mark'), tok('--ground')),
      'ink/ground (4.5)': rt(tok('--ink'), tok('--ground')),
      'edge/ground (3.0)': rt(tok('--edge'), tok('--ground')),
      'markSoft/ground (3.0)': rt(tok('--mark-soft'), tok('--ground')),
      'bar/sunk (3.0)': rt(tok('--bar'), tok('--sunk')),
      'barDim/sunk (3.0)': rt(tok('--bar-dim'), tok('--sunk')),
    });
    root.setAttribute('data-theme', 'light');
    const light = probe();
    root.setAttribute('data-theme', 'dark');
    const dark = probe();
    root.removeAttribute('data-theme');
    return { light, dark };
  });

  out.semantics = await page.evaluate(() => {
    const heads = [...document.querySelectorAll('h1,h2,h3')].map((h) => +h.tagName[1]);
    const skips = [];
    for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) skips.push(`${heads[i - 1]}->${heads[i]}`);
    const imgs = [...document.querySelectorAll('img')];
    return {
      headingSkips: skips.length ? skips : 'none',
      h1Count: document.querySelectorAll('h1').length,
      h1InLandmark: !!document.querySelector('h1').closest('main'),
      skipLink: !!document.querySelector('.skip'),
      landmarks: [...document.querySelectorAll('header,main,footer,nav')].map((e) => e.tagName.toLowerCase()),
      images: imgs.length,
      imagesWithAlt: imgs.filter((i) => i.getAttribute('alt')?.trim()).length,
      imagesWithDims: imgs.filter((i) => i.getAttribute('width') && i.getAttribute('height')).length,
      imagesLazy: imgs.filter((i) => i.getAttribute('loading') === 'lazy').length,
      links: document.querySelectorAll('a[href]').length,
      realLinks: [...document.querySelectorAll('a[href]')].filter((a) => /^(https?|mailto):/.test(a.getAttribute('href'))).length,
      hashLinks: [...document.querySelectorAll('a[href]')].filter((a) => a.getAttribute('href').startsWith('#')).length,
      pendingActions: document.querySelectorAll('.act.pending').length,
      emptyHrefTargets: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute('href').slice(1))
        .filter((id) => id && !document.getElementById(id)),
    };
  });

  /* reveal: gauges must start collapsed and settle at their real value.
     Smooth scrolling is disabled first — otherwise the wait starts when the
     scroll begins, not when the panel actually arrives, and every reading is
     mid-flight. */
  out.reveal = await page.evaluate(async () => {
    const first = document.querySelector('.panel[data-reveal]');
    const initialState = first?.getAttribute('data-reveal') ?? 'none';
    const pendingWidths = [...document.querySelectorAll('.panel[data-reveal="pending"] .gauge i')]
      .slice(0, 4)
      .map((i) => Math.round(i.getBoundingClientRect().width));

    document.documentElement.style.scrollBehavior = 'auto';
    const panel = document.querySelectorAll('.metrics')[0];
    panel.scrollIntoView({ block: 'center', behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 2500));

    const settled = [...panel.querySelectorAll('.gauge i')].map((i) => {
      const track = i.parentElement.getBoundingClientRect().width;
      return Math.round((i.getBoundingClientRect().width / track) * 1000) / 10;
    });
    return {
      firstPanelInitialState: initialState,
      offscreenGaugeWidths: pendingWidths,
      settledPercents: settled,
      expected: [80.7, 92.5, 71.6, 94.4],
      /* the animated span is aria-hidden; the vh span carries the true value */
      announced: [...panel.querySelectorAll('.val .vh')].map((v) => v.textContent),
      visible: [...panel.querySelectorAll('.val [aria-hidden="true"]')].map((v) => v.textContent),
    };
  });

  await page.screenshot({ path: 'shot-desktop-light.png' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: 'shot-desktop-dark.png' });
  await page.close();
}

/* ---------- responsive overflow + targets ---------- */
{
  out.responsive = [];
  for (const w of [1440, 1024, 820, 640, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const t = [...document.querySelectorAll('a[href],button')];
      const small = t
        .map((e) => {
          const b = e.getBoundingClientRect();
          return { t: (e.textContent || '').trim().slice(0, 24), w: Math.round(b.width), h: Math.round(b.height) };
        })
        .filter((x) => x.h < 44 && x.h > 0);
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        past: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1).length,
        targetsUnder44: small,
        targetsUnder24: small.filter((x) => x.h < 24 || x.w < 24).length,
        height: document.documentElement.scrollHeight,
      };
    });
    out.responsive.push({ width: w, ...r });
    if (w === 390) await page.screenshot({ path: 'shot-mobile-light.png' });
    await page.close();
  }
}

/* ---------- reduced motion must render final values ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(URL, { waitUntil: 'networkidle' });
  out.reducedMotion = await page.evaluate(() => {
    const panels = [...document.querySelectorAll('.panel[data-reveal]')].map((p) => p.getAttribute('data-reveal'));
    const g = document.querySelector('.metrics .gauge i');
    const track = g?.parentElement.getBoundingClientRect().width ?? 1;
    return {
      panelStates: [...new Set(panels)],
      firstGaugePercent: Math.round((g.getBoundingClientRect().width / track) * 1000) / 10,
      firstMetricText: document.querySelector('.metrics .val').textContent.trim(),
    };
  });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
