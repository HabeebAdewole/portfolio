import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll choreography.
 *
 * The difference from the IntersectionObserver reveal this replaces: these are
 * *scrubbed*. The animation is tied to scroll position rather than fired once
 * on entry, so it plays forward as you scroll down and backwards as you scroll
 * up. That reversibility is what reads as choreography instead of a trigger.
 *
 * Everything is registered inside a gsap.matchMedia so the reduced-motion
 * branch is a real branch, not a disabled one: those visitors get the final
 * state with no triggers created at all.
 */
export function initScroll() {
  const mm = gsap.matchMedia();

  /* ---------- full motion ---------- */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* Hero: the headline lifts and fades as it leaves, so the top of the page
       hands off to the work rather than just scrolling away. */
    const hero = document.querySelector('.hero');
    if (hero) {
      gsap.to(hero, {
        yPercent: -8,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'bottom 85%',
          end: 'bottom 25%',
          scrub: 0.6,
        },
      });
    }

    /* Section rules draw across, scrubbed to the section arriving. */
    gsap.utils.toArray<HTMLElement>('.sect-hd').forEach((el) => {
      gsap.fromTo(
        el,
        { '--rule': 0 },
        {
          '--rule': 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: 0.5 },
        },
      );
    });

    /* Project units rise into place, scrubbed. Travel is larger than the old
       reveal because scrubbed motion is read as movement, not as a flash. */
    gsap.utils.toArray<HTMLElement>('.unit').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 62%', scrub: 0.7 },
        },
      );
    });

    /* Tally chips cascade rather than arriving as one slab. */
    gsap.utils.toArray<HTMLElement>('.tally').forEach((list) => {
      gsap.from(list.children, {
        y: 14,
        opacity: 0,
        stagger: 0.045,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: list, start: 'top 90%', once: true },
      });
    });

    /* Preview cards drift slightly slower than the page, which reads as depth
       without the parallax being obvious enough to notice as an effect. */
    gsap.utils.toArray<HTMLElement>('.pv-stage').forEach((el) => {
      gsap.fromTo(
        el,
        { y: -14 },
        {
          y: 14,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  });

  /* ---------- reduced motion: final state, no triggers ---------- */
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.unit, .hero', { clearProps: 'all' });
    document.documentElement.style.setProperty('--rule', '1');
  });

  return () => mm.revert();
}
