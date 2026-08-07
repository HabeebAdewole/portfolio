import { useEffect, useRef, useState } from 'react';
import type { RevealState } from '../hooks/useReveal';

/* Parses a display string once and reproduces its exact shape while counting:
   "0.807" keeps three decimals, "203,769" keeps its separators, "92.5" keeps
   one. Anything that is not a plain number is passed through untouched. */
function shapeOf(target: string) {
  const cleaned = target.replace(/,/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const dot = cleaned.indexOf('.');
  return {
    value: parseFloat(cleaned),
    decimals: dot === -1 ? 0 : cleaned.length - dot - 1,
    grouped: target.includes(','),
  };
}

function format(v: number, decimals: number, grouped: boolean) {
  const fixed = v.toFixed(decimals);
  if (!grouped) return fixed;
  const [int, frac] = fixed.split('.');
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${withSep}.${frac}` : withSep;
}

const DURATION = 620;
/* exponential ease-out — fast departure, long settle, like a needle */
const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

interface Props {
  value: string;
  state: RevealState;
}

export function CountUp({ value, state }: Props) {
  const shape = shapeOf(value);
  const [display, setDisplay] = useState(() =>
    state === 'off' || !shape ? value : format(0, shape.decimals, shape.grouped),
  );
  const frame = useRef(0);

  useEffect(() => {
    if (!shape || state !== 'in') return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setDisplay(format(shape.value * ease(t), shape.decimals, shape.grouped));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // shape is derived from `value`; depending on the object identity would
    // restart the animation on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, value]);

  if (!shape || state === 'off') return <>{value}</>;

  /* A screen reader should hear the final figure, not a stream of
     intermediate ones. The animated text is decorative; the real value is
     announced from the visually hidden copy. */
  return (
    <>
      <span aria-hidden="true">{display}</span>
      <span className="vh">{value}</span>
    </>
  );
}
