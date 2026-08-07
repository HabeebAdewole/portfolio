import type { Fact } from '../content/types';
import './Readout.css';

interface Props {
  label: string;
  badge?: string;
  items: Fact[];
}

/**
 * The hero readings panel. It is the page's thesis: this is someone who
 * reports figures. Values are split on the first space so a unit renders
 * quietly beside its number instead of competing with it.
 */
export function Readout({ label, badge, items }: Props) {
  return (
    <div className="readout">
      <div className="readout-hd m">
        <span>{label}</span>
        {badge && (
          <span className="badge">
            <i className="led" aria-hidden="true" />
            {badge}
          </span>
        )}
      </div>

      <div className="readout-grid">
        {items.map((f) => {
          const [head, ...rest] = f.value.split(' ');
          return (
            <div className="cell" key={f.key}>
              <span className="key">{f.key}</span>
              <span className="val">
                {head}
                {rest.length > 0 && <span className="unit"> {rest.join(' ')}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
