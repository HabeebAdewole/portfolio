import { Fragment } from 'react';
import type { Entry as EntryData } from '../content/types';
import { useReveal } from '../hooks/useReveal';
import { rich } from '../lib/richText';
import { Icon } from './Icon';
import { Panel } from './Panel';
import { Previews } from './PreviewCard';
import './Entry.css';

/* Each project is a bounded unit rather than a row in a running list.
   The unit is the instrument case; the panels and previews inside it
   are compartments — edge to edge, divided by hairlines, no frames of their
   own. Nothing nests, which is what makes a bordered block read as built
   rather than as a card with more cards in it. */

export function Entry({ data }: { data: EntryData }) {
  const slim = data.weight === 'slim';
  const hasFooter = Boolean(data.stack?.length || data.actions?.length);
  /* Each unit arrives as it is scrolled to, rather than the whole section
     animating at once. Under reduced motion the hook reports 'off' and the
     unit renders in place. */
  const { ref, state } = useReveal<HTMLElement>();

  return (
    <article className={`unit${slim ? ' slim' : ''}`} ref={ref} data-reveal={state}>
      <header className="unit-hd">
        <span className="unit-idx m">{data.index}</span>
        <h3>{data.title}</h3>
        {data.deck.length > 0 && (
          <p className="unit-deck m">
            {data.deck.map((d, i) => (
              <Fragment key={d}>
                {i > 0 && (
                  <span className="sep" aria-hidden="true">
                    ·
                  </span>
                )}
                <span>{d}</span>
              </Fragment>
            ))}
          </p>
        )}
      </header>

      <div className="unit-body">
        {data.body.map((b, i) =>
          b.t === 'pull' ? (
            <p className="pull" key={i}>
              {rich(b.text)}
            </p>
          ) : (
            <p className={`body${b.quiet ? ' quiet' : ''}`} key={i}>
              {rich(b.text)}
            </p>
          ),
        )}
      </div>

      {data.panels?.map((p, i) => <Panel data={p} key={i} />)}

      {data.previews && <Previews items={data.previews} />}


      {hasFooter && (
        <footer className="unit-ft">
          {data.stack && (
            <ul className="stack">
              {data.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}

          {data.actions && data.actions.length > 0 && (
            <div className="acts">
              {data.actions.map((a) =>
                /* No href yet, and honest about why — rendered as text, not a
                   link that goes nowhere. */
                a.pending || !a.href ? (
                  <span className="act pending" key={a.label}>
                    {a.label}
                  </span>
                ) : (
                  <a className="act" href={a.href} key={a.label}>
                    {a.icon && <Icon name={a.icon} />}
                    {a.label}
                  </a>
                ),
              )}
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
