import { chromium } from 'playwright';

const URL = process.env.URL ?? 'http://localhost:4173/';
const browser = await chromium.launch();
const out = {};


/* ---------- full motion ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  out.triggers = await page.evaluate(() => {
    const ST = window.ScrollTrigger ?? window.gsap?.core?.globals?.().ScrollTrigger;
    return ST ? ST.getAll().length : 'ScrollTrigger not on window (bundled, expected)';
  });

  // walk down
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 1500));
  });
  out.atBottom = await page.evaluate(() => {
    const inv = [...document.querySelectorAll('body *')]
      .filter((e) => {
        const s = getComputedStyle(e);
        if (s.display === 'none' || s.visibility === 'hidden') return false;
        if (!e.textContent.trim() && !e.querySelector('img,svg,iframe')) return false;
        return parseFloat(s.opacity) < 0.9;
      })
      .map((e) => (e.className || e.tagName) + ' @' + getComputedStyle(e).opacity);
    return {
      invisible: inv.slice(0, 6),
      count: inv.length,
      ruleVar: getComputedStyle(document.documentElement).getPropertyValue('--rule').trim(),
    };
  });

  // scrub must reverse: go back to the top
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 1500));
  });
  out.backAtTop = await page.evaluate(() => ({
    heroOpacity: +getComputedStyle(document.querySelector('.hero')).opacity,
    firstUnitOpacity: +getComputedStyle(document.querySelector('.unit')).opacity,
  }));

  await page.close();
}

/* ---------- reduced motion ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  out.reducedMotion = await page.evaluate(() => {
    const inv = [...document.querySelectorAll('body *')].filter((e) => {
      const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      if (!e.textContent.trim() && !e.querySelector('img,svg,iframe')) return false;
      return parseFloat(s.opacity) < 0.9;
    });
    return {
      invisibleCount: inv.length,
      heroOpacity: +getComputedStyle(document.querySelector('.hero')).opacity,
      unitOpacity: +getComputedStyle(document.querySelector('.unit')).opacity,
      ruleVar: getComputedStyle(document.documentElement).getPropertyValue('--rule').trim(),
      ledDuration: getComputedStyle(document.querySelector('.led')).animationDuration,
    };
  });
  await page.close();
}

/* ---------- overflow ---------- */
{
  out.overflow = [];
  for (const w of [1440, 640, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight / 2);
      await new Promise((r) => setTimeout(r, 700));
    });
    out.overflow.push({
      width: w,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    });
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
