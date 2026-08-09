import { chromium } from 'playwright';

const URL = process.env.URL ?? 'http://localhost:4173/';
const browser = await chromium.launch();
const out = {};

/* --- normal motion: scroll the whole page, nothing may stay invisible --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  out.atLoad = await page.evaluate(() => ({
    heroVisible: [...document.querySelectorAll('.hero .enter')].map(
      (e) => +getComputedStyle(e).opacity,
    ),
    revealStates: [...new Set([...document.querySelectorAll('[data-reveal]')].map((e) => e.dataset.reveal))],
  }));

  // walk the page the way a reader would
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 1400));
  });

  out.afterScroll = await page.evaluate(() => {
    const invisible = [...document.querySelectorAll('body *')]
      .filter((e) => {
        const s = getComputedStyle(e);
        if (s.display === 'none' || s.visibility === 'hidden') return false;
        if (!e.textContent.trim() && !e.querySelector('img,svg,iframe')) return false;
        return parseFloat(s.opacity) < 0.95;
      })
      .map((e) => (e.className || e.tagName) + ' @op=' + getComputedStyle(e).opacity);
    return {
      stillInvisible: invisible.slice(0, 8),
      count: invisible.length,
      revealStates: [...new Set([...document.querySelectorAll('[data-reveal]')].map((e) => e.dataset.reveal))],
      sectionRules: [...document.querySelectorAll('.sect-hd')].map((e) => e.dataset.reveal),
    };
  });
  await page.close();
}

/* --- reduced motion: everything must render final, no animation --- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  out.reducedMotion = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('body *')].filter((e) => {
      const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      if (!e.textContent.trim() && !e.querySelector('img,svg,iframe')) return false;
      return parseFloat(s.opacity) < 0.95;
    });
    const led = document.querySelector('.led');
    return {
      revealStates: [...new Set([...document.querySelectorAll('[data-reveal]')].map((e) => e.dataset.reveal))],
      anythingInvisible: hidden.length,
      ledAnimationDuration: led ? getComputedStyle(led).animationDuration : 'n/a',
      heroOpacity: [...document.querySelectorAll('.hero .enter')].map((e) => +getComputedStyle(e).opacity),
      sectionRuleVisible: getComputedStyle(document.querySelector('.sect-hd'), '::after').transform,
    };
  });
  await page.close();
}

/* --- no horizontal overflow introduced by transforms --- */
{
  out.overflow = [];
  for (const w of [1440, 640, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    out.overflow.push({ width: w, overflow: await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth) });
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
