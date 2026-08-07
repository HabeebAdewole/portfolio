import type { Shot as ShotData } from '../content/types';
import './Shot.css';

/* Real screenshots. `width`/`height` are the native pixel dimensions so the
   browser reserves the right box before the image loads — no reflow partway
   down a long page. */

export function Shots({ shots }: { shots: ShotData[] }) {
  return (
    <div className="shots">
      {shots.map((s) => (
        <figure className="shot" key={s.src}>
          <img
            src={s.src}
            alt={s.alt}
            width={s.w}
            height={s.h}
            loading="lazy"
            decoding="async"
          />
          {s.caption && <figcaption className="m">{s.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
