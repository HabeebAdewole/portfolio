import { profile } from '../content/profile';
import { Icon } from './Icon';
import './Hero.css';
export function Hero() {
  return <section className="hero">
    <h1 className="d">Hey, I’m <span>Habeeb.</span></h1>
    <p className="lede">I build software, from the interface you use to the systems behind it. Here’s a little of what I’ve been working on.</p>
    <div className="hero-acts"><a className="btn primary" href="#work">Explore my work <Icon name="arrow" size={14}/></a><a href={`mailto:${profile.email}`}>Let’s talk</a></div>
    <p className="availability"><span aria-hidden="true" />{profile.available}</p>
  </section>;
}
