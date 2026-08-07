import { notes } from '../content/notes';
import { Icon } from './Icon';
import './Notes.css';

/* A queued note is not a link. Flip status to 'published' and add href as
   each one gets written, and the row becomes clickable on its own. */

export function Notes() {
  return (
    <ul className="notes">
      {notes.map((n) => {
        const published = n.status === 'published' && n.href;

        const inner = (
          <>
            <span className="when m">{n.when}</span>
            <span className="ttl">{n.title}</span>
            {published ? (
              <span className="go m">
                Read
                <Icon name="arrow" size={11} />
              </span>
            ) : (
              <span className="go m pend">{n.status}</span>
            )}
          </>
        );

        return (
          <li key={n.title} className={published ? 'live' : undefined}>
            {published ? <a href={n.href}>{inner}</a> : inner}
          </li>
        );
      })}
    </ul>
  );
}
