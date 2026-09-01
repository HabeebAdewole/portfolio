import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Signature } from '../content/types';
import { BODY_MAX, NAME_MAX, fetchNotes, sign, when } from '../lib/log';
import './Log.css';

/* ============================================================================
   Section 05 — the Log.

   A pinboard: paper, tape, a signature in a hand. This is the one section that
   varies surface. Type does not move — Crete Round, Alegreya Sans and mono do
   the same jobs here as everywhere else — and Caveat is a carve-out for
   signatures only, because a signature is content, not a type role.

   Nothing a visitor writes appears here. Notes are held unapproved until he
   puts them up, which the form says plainly rather than implying otherwise.
   ============================================================================ */

type Status = 'idle' | 'sending' | 'held' | 'failed';

export function Log() {
  const [notes, setNotes] = useState<Signature[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  /* Filled only by a bot: it is off-screen and has no tab stop, so a person
     never reaches it. Anything arriving with it set is dropped client-side. */
  const pot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetchNotes(ac.signal)
      .then(setNotes)
      .catch(() => {
        /* An unreachable board is not worth an error state on a portfolio:
           the form still works, and the section reads as simply empty. */
      })
      .finally(() => setLoaded(true));
    return () => ac.abort();
  }, []);

  const over = body.trim().length > BODY_MAX;
  const ready = name.trim().length > 0 && body.trim().length > 0 && !over;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || status === 'sending') return;
    if (pot.current?.value) return;

    setStatus('sending');
    const r = await sign(name, body);
    if (r === 'held') {
      setName('');
      setBody('');
      setStatus('held');
    } else {
      setStatus('failed');
    }
  }

  const count = body.trim().length;

  return (
    <div className="board">
      <div className="scraps">
        <form className="scrap signer" onSubmit={onSubmit} noValidate>
          <span className="pin" aria-hidden="true" />

          <div className="field">
            <label className="pkey" htmlFor="log-name">
              Sign here
            </label>
            <input
              className="name-in"
              id="log-name"
              type="text"
              value={name}
              maxLength={NAME_MAX}
              autoComplete="name"
              placeholder="your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="pkey" htmlFor="log-body">
              And say something
            </label>
            <textarea
              id="log-body"
              value={body}
              maxLength={400}
              placeholder="What you came looking for, what you thought, what you’re building."
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="gauge-row">
              <span className={`pgauge${over ? ' over' : ''}`} aria-hidden="true">
                <span style={{ transform: `scaleX(${Math.min(1, count / BODY_MAX)})` }} />
              </span>
              <span className="pcount m" aria-live="polite">
                {count} / {BODY_MAX}
              </span>
            </div>
          </div>

          <div className="pot" aria-hidden="true">
            <label htmlFor="log-url">Leave this empty</label>
            <input id="log-url" ref={pot} type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <button className="send m" type="submit" disabled={!ready || status === 'sending'}>
            {status === 'sending' ? 'Pinning…' : 'Pin it up'}
          </button>

          <p className="held" role="status">
            {status === 'held' && (
              <>
                <strong>Sent.</strong> It stays with him until he pins it up — which is why it has
                not appeared on the board.
              </>
            )}
            {status === 'failed' && <>That did not send. Try again, or email him instead.</>}
            {(status === 'idle' || status === 'sending') && <>Held until he reads it.</>}
          </p>
        </form>

        {notes.map((n) => (
          <article className="scrap" key={n.id}>
            <span className="pin" aria-hidden="true" />
            <p>{n.body}</p>
            <span className="sig">{n.name}</span>
            <span className="pwhen m">{when(n.created_at)}</span>
          </article>
        ))}
      </div>

      {loaded && notes.length === 0 && (
        <p className="board-empty">Nobody has signed it yet. Be the first.</p>
      )}
    </div>
  );
}
