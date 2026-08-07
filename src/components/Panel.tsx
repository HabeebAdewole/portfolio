import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import type { Panel as PanelData } from '../content/types';
import { CountUp } from './CountUp';
import './Panel.css';

/* Instrument panels. Adjacent panels join into one stack — `.panel + .panel`
   drops the shared border so a metrics block and its comparison read as one
   instrument rather than two cards.

   Readings settle as the panel comes into view: bars fill, figures count to
   their value. Under reduced motion the reveal never arms and everything
   renders final. */

function Head({ title, corner }: { title: string; corner?: string }) {
  return (
    <div className="panel-hd m">
      <span>{title}</span>
      {corner && <span>{corner}</span>}
    </div>
  );
}

/** `--fill` drives width in CSS, so the default state needs no inline style. */
const fillVar = (pct: number) => ({ '--fill': `${pct}%` }) as CSSProperties;

export function Panel({ data }: { data: PanelData }) {
  const { ref, state } = useReveal();

  if (data.kind === 'metrics') {
    return (
      <div className="panel" ref={ref} data-reveal={state}>
        <Head title={data.title} corner={data.corner} />
        <div className="metrics">
          {data.items.map((m) => (
            <div className="metric" key={m.key}>
              <span className="key">{m.key}</span>
              <span className="val">
                <CountUp value={m.value} state={state} />
                {m.unit && <span className="unit">{m.unit}</span>}
              </span>
              {m.fill !== undefined && (
                <span className="gauge" style={fillVar(m.fill)}>
                  <i />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.kind === 'facts') {
    return (
      <div className="panel" ref={ref} data-reveal={state}>
        <Head title={data.title} corner={data.corner} />
        <div className="facts">
          {data.items.map((f) => (
            <div key={f.key}>
              <span className="key">{f.key}</span>
              <span className="val">
                <CountUp value={f.value} state={state} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.kind === 'tally') {
    return (
      <div className="panel" ref={ref} data-reveal={state}>
        <Head title={data.title} corner={data.corner} />
        <div className="panel-bd">
          <ul className="tally">
            {data.items.map((t) => (
              <li key={t}>
                <span className="tick" aria-hidden="true">
                  &#10003;
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // comparison — the bar column only exists when something is actually scaled
  const scaled = data.rows.some((r) => r.fill !== null);

  return (
    <div className="panel" ref={ref} data-reveal={state}>
      <Head title={data.title} corner={data.corner} />
      <div className="panel-bd">
        <table className="cmp">
          {data.caption && <caption>{data.caption}</caption>}
          <thead>
            <tr>
              <th scope="col">{data.columns[0]}</th>
              <th scope="col" className={scaled ? 'num' : undefined}>
                {data.columns[1]}
              </th>
              {scaled && (
                <th scope="col">
                  <span className="vh">Relative score</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.label} className={r.lead ? 'lead' : undefined}>
                <td className="rowlab">{r.label}</td>
                <td className={`${scaled ? 'num' : ''} ${r.value === null ? 'pending' : ''}`}>
                  {r.value === null ? '—' : <CountUp value={r.value} state={state} />}
                </td>
                {scaled && (
                  <td className="barcell">
                    {r.fill === null ? (
                      <span className="bar pending" />
                    ) : (
                      <span className="bar" style={fillVar(r.fill)}>
                        <i />
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
