import type { Signature } from '../content/types';

/* ============================================================================
   The Log's data layer — two REST calls against Supabase, hand-rolled.

   @supabase/supabase-js is ~40 kB gzipped and exists to give you realtime,
   auth, storage and a query builder. This needs one GET and one POST. The
   whole page is 116 kB of JS; spending a third of that again on a client for
   two fetches is the wrong trade, and the same reasoning that kept MDX out of
   richText.tsx applies here.

   The anon key ships in the bundle. That is how Supabase is designed to work
   and it is not a leak: it identifies the project, it does not authorise
   anything. Every permission this key has is spelled out in supabase/notes.sql,
   and it amounts to "insert an unapproved row, read approved rows."
   ============================================================================ */

/* Narrowed to string here rather than at every use. Both are genuinely
   optional — see vite-env.d.ts — and logConfigured is the gate: sections.ts
   does not add the section, so nothing below ever runs, unset. */
const URL_BASE: string = import.meta.env.VITE_SUPABASE_URL ?? '';
const ANON: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** Both must be present or the section does not render at all. See sections.ts. */
export const logConfigured = URL_BASE !== '' && ANON !== '';

const REST = `${URL_BASE}/rest/v1/notes`;

function headers(extra?: Record<string, string>) {
  return {
    apikey: ANON,
    Authorization: `Bearer ${ANON}`,
    ...extra,
  };
}

/** Caps mirror the CHECK constraints in notes.sql. Both ends enforce them. */
export const NAME_MAX = 40;
export const BODY_MAX = 280;

/**
 * Approved notes, newest first.
 *
 * `approved=eq.true` is belt-and-braces: the RLS policy already makes it
 * impossible to read anything else, so this is a hint to the query planner
 * rather than a security measure. Never remove the policy and rely on this.
 */
export async function fetchNotes(signal?: AbortSignal): Promise<Signature[]> {
  const q = new URLSearchParams({
    select: 'id,name,body,created_at',
    approved: 'eq.true',
    order: 'created_at.desc',
    limit: '60',
  });

  const res = await fetch(`${REST}?${q}`, { headers: headers(), signal });
  if (!res.ok) throw new Error(`log: read failed (${res.status})`);
  return (await res.json()) as Signature[];
}

export type SignResult = 'held' | 'invalid' | 'failed';

/**
 * Leave a note. Resolves to 'held' on success — never 'published', because
 * nothing this function writes is visible to anyone until it is approved.
 */
export async function sign(name: string, body: string): Promise<SignResult> {
  const n = name.trim();
  const b = body.trim();
  if (!n || !b || n.length > NAME_MAX || b.length > BODY_MAX) return 'invalid';

  try {
    const res = await fetch(REST, {
      method: 'POST',
      headers: headers({
        'Content-Type': 'application/json',
        /* Nothing comes back, and asking for the row would fail anyway: the
           select policy hides unapproved rows, including the one just written. */
        Prefer: 'return=minimal',
      }),
      body: JSON.stringify({ name: n, body: b }),
    });
    return res.ok ? 'held' : 'failed';
  } catch {
    return 'failed';
  }
}

/** '29 Aug 2026' — matches how dates read elsewhere on the page. */
export function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
