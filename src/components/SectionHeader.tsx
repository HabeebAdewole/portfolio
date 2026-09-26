import type { Section } from '../content/types';
import './SectionHeader.css';
export function SectionHeader({ id, name, say }: Section) {
  return <div className="sect-hd"><h2 className="sect-name" id={`h-${id}`}>{id === 'work' ? 'Things I’ve built.' : name}</h2><p className="sect-say">{say}</p></div>;
}
