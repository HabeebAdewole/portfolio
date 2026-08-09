import type { Section } from '../content/types';
import './SectionHeader.css';

/* The number is an index, not decoration: the page is a catalogue and the
   order is the reading order. Entry indices (01.3) key back to it.

   The rule beneath is drawn by scaleX(var(--rule)); ScrollTrigger scrubs
   --rule from 0 to 1 as the section arrives. It defaults to 1 so the rule is
   simply there if scripting never runs. */

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
