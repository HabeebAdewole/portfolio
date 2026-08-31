import type { CSSProperties } from 'react';
import { profile, status } from '../content/profile';
import { rich } from '../lib/richText';
import { Icon } from './Icon';
import { Readout } from './Readout';
import './Hero.css';

export function Hero() {
  return (
    /* One orchestrated arrival rather than four elements each animating to
       their own schedule. --i is the position in the sequence. */
    <section className="hero">
      <h1 className="d enter" style={{ '--i': 0 } as CSSProperties}>
        {profile.headline}
      </h1>

      <p className="lede enter" style={{ '--i': 1 } as CSSProperties}>
        {rich(profile.lede)}
      </p>

      <div className="hero-acts enter" style={{ '--i': 2 } as CSSProperties}>
        <a className="btn" href={`mailto:${profile.email}`}>
          <Icon name="mail" />
          {profile.email}
        </a>
        <a className="btn" href="#work">
          See the work
          <Icon name="arrow" size={12} />
        </a>
      </div>

      <div className="enter" style={{ '--i': 3 } as CSSProperties}>
        <Readout label="Current status" badge={profile.available} items={status} />
      </div>
    </section>
  );
}
