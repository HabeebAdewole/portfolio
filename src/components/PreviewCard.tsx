import { useState } from 'react';
import type { Preview } from '../content/types';
import { usePlayInView } from '../hooks/usePlayInView';
import { usePrewarm } from '../hooks/usePrewarm';
import { Icon } from './Icon';
import './PreviewCard.css';

/* A framed instrument containing a live feed, not a rounded media tile:
   header strip, viewport, footer strip — the same chrome the data panels use,
   so a running app reads as another reading rather than a decoration.

   Three modes, in order of precedence:
     embed  — the real deployment, loaded on click
     src    — a screen recording, looped while on screen
     poster — the still, and an honest note that nothing else exists yet */

function Card({ p }: { p: Preview }) {
  const [live, setLive] = useState(false);
  const hasVideo = Boolean(p.src);
  const hasEmbed = Boolean(p.embed);
  const { ref: videoRef, playing, reduced, toggle } = usePlayInView(hasVideo && !hasEmbed);
  const warmRef = usePrewarm(p.prewarm);

  const box = { aspectRatio: p.aspect ?? `${p.w} / ${p.h}` };

  return (
    <figure className="pv" ref={warmRef as React.Ref<HTMLElement>}>
      <div className="pv-hd m">
        <span>{p.label}</span>
        {p.meta && <span className="pv-meta">{p.meta}</span>}
      </div>

      <div className="pv-stage" style={box}>
        {hasEmbed && live ? (
          <iframe
            src={p.embed}
            title={p.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : hasVideo && !hasEmbed ? (
          <video
            ref={videoRef}
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

        {hasEmbed && !live && (
          <button className="pv-load" type="button" onClick={() => setLive(true)}>
            <span className="pv-chip">
              <Icon name="play" size={12} />
              Load the live app
            </span>
            <span className="pv-warn">free tier — may take a moment to wake</span>
          </button>
        )}
      </div>

      <figcaption className="pv-ft m">
        <span className="pv-cap">{p.caption}</span>

        {hasEmbed ? (
          <a className="pv-btn" href={p.embed} target="_blank" rel="noreferrer noopener">
            <Icon name="external" size={11} />
            Open in a tab
          </a>
        ) : hasVideo && !reduced ? (
          <button className="pv-btn" type="button" onClick={toggle}>
            <Icon name={playing ? 'pause' : 'play'} size={11} />
            {playing ? 'Pause' : 'Play'}
            {p.seconds && <span className="pv-dur">{p.seconds}s loop</span>}
          </button>
        ) : (
          <span className="pv-state">
            {hasVideo ? 'paused — reduced motion' : 'recording pending'}
          </span>
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
