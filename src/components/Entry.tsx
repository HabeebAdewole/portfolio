import { Fragment } from 'react';
import type { Entry as EntryData } from '../content/types';
import { rich } from '../lib/richText';
import { Icon } from './Icon';
import { Panel } from './Panel';
import { Previews } from './PreviewCard';
import './Entry.css';

export function Entry({ data }: { data: EntryData }) {
  const slim = data.weight === 'slim';

  return (
    <article className={`entry${slim ? ' slim' : ''}`}>
      <span className="idx m">{data.index}</span>

      <div>
        <h3>{data.title}</h3>

        {data.deck.length > 0 && (
          <p className="deck">
            {data.deck.map((d, i) => (
              <Fragment key={d}>
                {i > 0 && (
                  <span className="sep" aria-hidden="true">
                    /
                  </span>
                )}
                <span>{d}</span>
              </Fragment>
            ))}
          </p>
        )}

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

        {data.panels?.map((p, i) => <Panel data={p} key={i} />)}

        {data.stack && (
          <ul className="stack">
            {data.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}

        {data.previews && <Previews items={data.previews} />}

        {data.slot && (
          <div className="slot">
            <Icon name={data.slot.icon} size={20} />
            <span className="txt">
              <span className="what m">{data.slot.what}</span>
              <span className={`st m ${data.slot.status}`}>{data.slot.note}</span>
            </span>
          </div>
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
      </div>
    </article>
  );
}
