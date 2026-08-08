import { useEffect, useRef, useState } from 'react';

/**
 * Plays a muted loop only while it is on screen, and never when the visitor
 * has asked for reduced motion.
 *
 * Two reasons this is not just `autoplay loop`:
 *  - a page with four autoplaying videos burns battery decoding frames nobody
 *    is looking at
 *  - WCAG 2.2.2 requires anything that moves for more than five seconds to be
 *    pausable, so the manual override below is a requirement, not a nicety
 */
export function usePlayInView(hasVideo: boolean) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  /** null = follow the viewport, true/false = the visitor has taken over */
  const [override, setOverride] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasVideo || reduced) return;
    if (override === false) {
      el.pause();
      return;
    }
    if (override === true) {
      void el.play().catch(() => {});
      return;
    }
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo, reduced, override]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    el.addEventListener('play', on);
    el.addEventListener('pause', off);
    return () => {
      el.removeEventListener('play', on);
      el.removeEventListener('pause', off);
    };
  }, [hasVideo]);

  return {
    ref,
    playing,
    reduced,
    toggle: () => setOverride(ref.current?.paused ?? true),
  };
}
