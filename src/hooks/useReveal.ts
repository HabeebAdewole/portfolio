import { useEffect, useRef, useState } from 'react';

/**
 * 'off'     — reduced motion, or no IntersectionObserver. Render final values.
 * 'pending' — mounted, not yet scrolled to. Render the start of the animation.
 * 'in'      — in view. Animate to the real value, once.
 *
 * The initial state is computed synchronously, so React's first paint is
 * already 'pending'. Deciding after mount would paint the final value and
 * then snap back to zero — a visible flicker on every panel above the fold.
 */
export type RevealState = 'off' | 'pending' | 'in';

function initial(): RevealState {
  if (typeof window === 'undefined') return 'off';
  if (typeof IntersectionObserver === 'undefined') return 'off';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
  return 'pending';
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>(initial);

  useEffect(() => {
    if (state !== 'pending') return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in');
          io.disconnect();
        }
      },
      /* fire a little before the panel is fully on screen, so the reading has
         settled by the time it is actually being read */
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [state]);

  return { ref, state, revealed: state !== 'pending' };
}
