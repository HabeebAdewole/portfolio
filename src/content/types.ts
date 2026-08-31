/* ============================================================================
   CONTENT TYPES
   Entries render from data, not JSX. Adding a project later is one object.

   Inline measured figures use {{...}} in body text — the renderer converts
   them to <span class="n">, which is the only place ochre appears in prose.
   Example: "reached {{0.807}} F1 on the illicit class"
   ============================================================================ */

export type IconName =
  | 'github'
  | 'external'
  | 'mail'
  | 'linkedin'
  | 'x'
  | 'arrow'
  | 'sun'
  | 'moon'
  | 'play'
  | 'pause'
  | 'download';

/* ---------- body ---------- */

export type Block =
  | { t: 'p'; text: string; quiet?: boolean }
  /** A line worth lifting out of the prose. Use sparingly — one per entry. */
  | { t: 'pull'; text: string };

/* ---------- instrument panels ---------- */

export interface Metric {
  key: string;
  value: string;
  unit?: string;
  /** 0–100. Drives the gauge width. Omit for a figure with no meaningful scale. */
  fill?: number;
}

export interface CmpRow {
  label: string;
  /** null renders as an em dash with a hatched pending bar. Never invent a number. */
  value: string | null;
  fill: number | null;
  /** The winning row: bold label, bar in --mark instead of --bar-dim. */
  lead?: boolean;
}

export interface Fact {
  key: string;
  value: string;
}

export type Panel =
  | { kind: 'metrics'; title: string; corner?: string; items: Metric[] }
  | {
      kind: 'comparison';
      title: string;
      corner?: string;
      caption?: string;
      columns: [string, string];
      rows: CmpRow[];
    }
  | { kind: 'facts'; title: string; corner?: string; items: Fact[] }
  | { kind: 'tally'; title: string; corner?: string; items: string[] };

/* ---------- assets ---------- */

/**
 * A preview card: the project running, not a picture of it.
 *
 * `poster` is required and `src` is not, so a card is complete and honest
 * before any video exists — it shows the still and says the recording is
 * pending, rather than leaving a hole in the page.
 */
export interface Preview {
  /** Still frame. Imported asset URL — let Vite hash it. */
  poster: string;
  /** Native poster dimensions, so the box is reserved before load. */
  w: number;
  h: number;
  /**
   * The window the card shows, e.g. '16 / 10'. App screens are often much
   * taller than they are wide; without this a single entry produces a card
   * that swallows the whole column. Defaults to the poster's own ratio.
   * Content is anchored to the top, so the header of the app stays visible.
   */
  aspect?: string;
  /**
   * 'cover' (default) fills the window and crops. 'contain' sits the whole
   * image inside it, which is what a phone screenshot needs — cropping a
   * 414-wide capture into a landscape window destroys it.
   */
  fit?: 'cover' | 'contain';
  /** Screen recording. Omit until it has been captured. */
  src?: string;
  /**
   * A live deployment to embed. Takes precedence over `src`.
   * Loaded on click, never on page load — three embedded apps on one page is
   * slow, and most of them will never be looked at.
   */
  embed?: string;
  /**
   * An endpoint to ping when this card scrolls into view, to wake a sleeping
   * backend before the visitor clicks through. Free tiers spin down after
   * inactivity; Tracer's API measured a 32-second cold start, which is long
   * enough that a recruiter concludes the project is broken.
   */
  prewarm?: string;
  /** Header strip, left. What this view is. */
  label: string;
  /** Header strip, right. A reading, a count, a URL. */
  meta?: string;
  /** Describe what the screen shows, not that it is a video. */
  alt: string;
  caption?: string;
  /** Rough loop length, shown in the footer once a video exists. */
  seconds?: number;
}

export interface Action {
  label: string;
  href?: string;
  icon?: IconName;
  /** No href yet, and honest about why. Renders dashed and non-interactive. */
  pending?: boolean;
}

/* ---------- entries ---------- */

export interface Entry {
  id: string;
  /** Shown in the left gutter, e.g. "01.3". Encodes section and position. */
  index: string;
  title: string;
  /** Slash-separated metadata under the title. */
  deck: string[];
  body: Block[];
  panels?: Panel[];
  stack?: string[];
  /** Preview cards: the project running, not a picture of it. */
  previews?: Preview[];
  actions?: Action[];
  /** 'slim' for entries that should not take a full screen. */
  weight?: 'full' | 'slim';
}

export interface Note {
  when: string;
  title: string;
  status: 'queued' | 'draft' | 'published';
  href?: string;
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface Credential {
  key: string;
  value: string;
  detail: string;
}

/** A note left by a visitor in section 05. Shape mirrors supabase/notes.sql.
    Named Signature because Note is already the writing queue. */
export interface Signature {
  id: string;
  name: string;
  body: string;
  created_at: string;
}

export interface Section {
  no: string;
  id: string;
  name: string;
  say: string;
}
