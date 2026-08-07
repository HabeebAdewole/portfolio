import { profile } from '../content/profile';
import { sections } from '../content/sections';
import { useStuck } from '../hooks/useStuck';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import './Masthead.css';

export function Masthead() {
  const { theme, toggle } = useTheme();
  const { sentinel, stuck } = useStuck();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      {/* zero-height marker: once this leaves the viewport, the bar is stuck */}
      <div ref={sentinel} className="mast-sentinel" aria-hidden="true" />

      <header className={`masthead${stuck ? ' stuck' : ''}`}>
        <div className="sig">
          <span className="nm m">{profile.name}</span>
          <span className="role m">{profile.role}</span>
          <span className="loc m">{profile.location}</span>
        </div>

        <nav className="mnav" aria-label="Sections">
          {sections.map((s) => (
            <a className="navlink m" key={s.id} href={`#${s.id}`}>
              {s.name.toLowerCase()}
            </a>
          ))}

          <button
            className="themebtn"
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${next} theme`}
          >
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={15} />
          </button>

          <a className="btn" href="#contact">
            CV
            <Icon name="download" size={12} />
          </a>
        </nav>
      </header>
    </>
  );
}
