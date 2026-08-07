import { profile } from '../content/profile';
import { Icon } from './Icon';
import './Contact.css';

export function Contact() {
  return (
    <footer className="contact" id="contact">
      <h2>Want something built?</h2>
      <p>I’m open to work and to freelance projects. Fastest way to reach me is email.</p>

      <div className="row">
        <a className="btn" href={`mailto:${profile.email}`}>
          <Icon name="mail" />
          {profile.email}
        </a>
        <a className="btn" href={profile.github}>
          <Icon name="github" />
          GitHub
        </a>
        <a className="btn" href={profile.linkedin}>
          <Icon name="linkedin" />
          LinkedIn
        </a>
        <a className="btn" href={profile.x}>
          <Icon name="x" />
          {profile.xHandle}
        </a>
      </div>

      <div className="colophon m">
        <span>
          {profile.name} · {profile.locationLong}
        </span>
        <span>Last updated {profile.updated}</span>
      </div>
    </footer>
  );
}
