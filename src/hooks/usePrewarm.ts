import { useEffect, useRef } from 'react';

/**
 * Wakes a sleeping backend when its card scrolls into view.
 *
 * Free hosting tiers spin a service down after ~15 minutes idle, and the
 * cold start is long — Tracer's API measured 32 seconds. Somebody who clicks
 * through to a live demo in that window sees a UI that hangs and concludes
 * the project is broken.
 *
 * Scrolling to the card is a good predictor of clicking it, so the request
 * goes out early and the spin-up overlaps with the time spent reading. The
 * response is irrelevant and unreadable anyway — `no-cors` is deliberate,
 * since only the fact that the request arrived matters.
 */
export function usePrewarm(url: string | undefined) {
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !url || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        io.disconnect();
        void fetch(url, { mode: 'no-cors', cache: 'no-store' }).catch(() => {
          /* a failed wake-up is not worth telling anyone about */
        });
      },
      { rootMargin: '600px 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [url]);

  return ref;
}
