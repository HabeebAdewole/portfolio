import { profile, status } from '../content/profile';
import { rich } from '../lib/richText';
import { Icon } from './Icon';
import { Readout } from './Readout';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero">
      <h1 className="m">{profile.headline}</h1>
      <p className="lede">{rich(profile.lede)}</p>

      <div className="hero-acts">
        <a className="btn" href={`mailto:${profile.email}`}>
          <Icon name="mail" />
          {profile.email}
        </a>
        <a className="btn" href="#work">
          See the work
          <Icon name="arrow" size={12} />
        </a>
      </div>

      <Readout label="Current status" badge={profile.available} items={status} />
    </section>
  );
}
