import { useReveal } from '../hooks/useReveal';
import type { Section } from '../content/types';
import './SectionHeader.css';

/* The number is an index, not decoration: the page is a catalogue and the
   order is the reading order. Entry indices (01.3) key back to it.

   The rule under the heading draws itself in as the section is reached, which
   is the one place a line animating means something — it is the section
   opening, not an effect. */

export function SectionHeader({ no, id, name, say }: Section) {
  const { ref, state } = useReveal<HTMLDivElement>();

  return (
    <div className="sect-hd" ref={ref} data-reveal={state}>
      <span className="sect-no m">{no}</span>
      <h2 className="sect-name m" id={`h-${id}`}>
        {name}
      </h2>
      <span className="sect-say">{say}</span>
    </div>
  );
}
