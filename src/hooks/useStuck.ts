import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether a sticky element has left its resting position.
 *
 * Uses a zero-height sentinel above the element rather than a scroll
 * listener — the observer fires once per state change instead of on every
 * frame of a scroll, so there is nothing to throttle and nothing to jank.
 */
export function useStuck<T extends HTMLElement = HTMLDivElement>() {
  const sentinel = useRef<T>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { sentinel, stuck };
}
