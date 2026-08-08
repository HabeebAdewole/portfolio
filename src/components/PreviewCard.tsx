import type { Preview } from '../content/types';
import { usePlayInView } from '../hooks/usePlayInView';
import { Icon } from './Icon';
import './PreviewCard.css';

/* A framed instrument containing a live feed, not a rounded media tile:
   header strip, viewport, footer strip — the same chrome the data panels use,
   so a running app reads as another reading rather than a decoration. */

function Card({ p }: { p: Preview }) {
  const hasVideo = Boolean(p.src);
  const { ref, playing, reduced, toggle } = usePlayInView(hasVideo);

  /* Reserve the exact box before anything loads, so a long page never
     reflows under the reader as media arrives. */
  const box = { aspectRatio: p.aspect ?? `${p.w} / ${p.h}` };

  return (
    <figure className="pv">
      <div className="pv-hd m">
        <span>{p.label}</span>
        {p.meta && <span className="pv-meta">{p.meta}</span>}
      </div>

      <div className="pv-stage" style={box}>
        {hasVideo ? (
          <video
            ref={ref}
            src={p.src}
            poster={p.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={p.alt}
            width={p.w}
            height={p.h}
          />
        ) : (
          <img src={p.poster} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" />
        )}
      </div>

      <figcaption className="pv-ft m">
        <span className="pv-cap">{p.caption}</span>

        {hasVideo && !reduced ? (
          <button className="pv-btn" type="button" onClick={toggle}>
            <Icon name={playing ? 'pause' : 'play'} size={11} />
            {playing ? 'Pause' : 'Play'}
            {p.seconds && <span className="pv-dur">{p.seconds}s loop</span>}
          </button>
        ) : (
          <span className="pv-state">{hasVideo ? 'paused — reduced motion' : 'recording pending'}</span>
        )}
      </figcaption>
    </figure>
  );
}

export function Previews({ items }: { items: Preview[] }) {
  return (
    <div className="pvs">
      {items.map((p) => (
        <Card p={p} key={p.poster} />
      ))}
    </div>
  );
}
