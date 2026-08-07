import type { Section } from '../content/types';
import './SectionHeader.css';

/* The number is an index, not decoration: the page is a catalogue and the
   order is the reading order. Entry indices (01.3) key back to it. */

export function SectionHeader({ no, id, name, say }: Section) {
  return (
    <div className="sect-hd">
      <span className="sect-no m">{no}</span>
      <h2 className="sect-name m" id={`h-${id}`}>
        {name}
      </h2>
      <span className="sect-say">{say}</span>
    </div>
  );
}
