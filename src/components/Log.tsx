import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Signature } from '../content/types';
import { BODY_MAX, NAME_MAX, fetchNotes, sign, when } from '../lib/log';
import './Log.css';

/** Approved notes are public; new submissions stay held for moderation. */

type Status = 'idle' | 'sending' | 'held' | 'failed';

export function Log({ preview = false }: { preview?: boolean }) {
  const [notes, setNotes] = useState<Signature[]>(preview ? [
    { id: 'preview-1', name: 'A visitor', body: 'A small hello from this corner of the internet. Glad I stopped by.', created_at: '2026-09-26T12:00:00Z' },
    { id: 'preview-2', name: 'Another visitor', body: 'There is something nice about seeing what someone is making, and how they got there.', created_at: '2026-09-26T12:00:00Z' },
    { id: 'preview-3', name: 'A passing friend', body: 'Keep making things. See you around.', created_at: '2026-09-26T12:00:00Z' },
  ] : []);
  const [loaded, setLoaded] = useState(preview);
  const [open, setOpen] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  /* Filled only by a bot: it is off-screen and has no tab stop, so a person
     never reaches it. Anything arriving with it set is dropped client-side. */
  const pot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preview) return;
    const ac = new AbortController();
    fetchNotes(ac.signal)
      .then(setNotes)
      .catch(() => {
        if (!ac.signal.aborted) setLoadFailed(true);
      })
      .finally(() => setLoaded(true));
    return () => ac.abort();
  }, [preview]);

  const over = body.trim().length > BODY_MAX;
  const ready = name.trim().length > 0 && body.trim().length > 0 && !over;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (preview || !ready || status === 'sending') return;
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
      <div className="board-intro">
        <div><h2 id="h-log">Leave a little note.</h2><p>A hello, a thought, or something you wanted to say.</p></div>
        <button className="btn" type="button" aria-expanded={open} aria-controls="note-composer" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Leave a note'}</button>
      </div>
      {preview && <p className="board-preview">Design preview · sample notes. Sending is disabled here.</p>}
      <div id="note-composer" hidden={!open}>
        <form className="signer" onSubmit={onSubmit} noValidate>


          <div className="field">
            <label className="pkey" htmlFor="log-name">
              Your name
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
              Your note
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

          <button className="send m" type="submit" disabled={preview || !ready || status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send note'}
          </button>

          <p className="held" role="status">
            {status === 'held' && (
              <>
                <strong>Sent.</strong> I’ll read it before pinning it up — which is why it has
                not appeared on the board.
              </>
            )}
            {status === 'failed' && <>That did not send. Your draft is still here. Please try again.</>}
            {(status === 'idle' || status === 'sending') && <>I’ll read your note before it appears on the wall.</>}
          </p>
        </form>

      </div>
      <div className="scraps">
        {notes.map((n) => (
          <article className="scrap" key={n.id}>
            <span className="pin" aria-hidden="true" />
            <p>{n.body}</p>
            <span className="sig">{n.name}</span>
            <span className="pwhen m">{when(n.created_at)}</span>
          </article>
        ))}
      </div>

      {loaded && !loadFailed && notes.length === 0 && (
        <p className="board-empty">A little space for the first hello.</p>
      )}
      {!loaded && <p className="board-empty" role="status">Gathering the notes…</p>}
      {loadFailed && <p className="board-empty" role="status">The notes could not load just now. You can still leave one.</p>}
    </div>
  );
}
