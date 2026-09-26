import { StackLabel } from './StackLabel';
import { credentials, stack } from '../content/profile';
import './Stack.css';

export function Stack() {
  return (
    <>
      <dl className="bay">
        {stack.map((g) => (
          <div key={g.label}>
            <dt>{g.label}</dt>
            <dd>
              {g.items.map((i) => (
                <StackLabel key={i} name={i} />
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <dl className="creds">
        {credentials.map((c) => (
          <div key={c.key}>
            <dt className="key">{c.key}</dt>
            <dd className="cval">{c.value}</dd>
            <dd className="cdetail">{c.detail}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
