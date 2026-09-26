import { profile } from '../content/profile';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import './Masthead.css';
export function Masthead() {
  const { theme, toggle } = useTheme();
  return <header className="masthead">
    <a className="brand" href="#main">Habeeb.</a>
    <nav className="mnav" aria-label="Main navigation">
      <a href="#work">Work</a>
      <a className="nav-contact" href="#contact">Say hello</a>
      <a href={profile.cv} download>Download CV</a>
      <button className="themebtn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'moon' : 'sun'} size={18}/></button>
    </nav>
  </header>;
}
