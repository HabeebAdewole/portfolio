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
  | 'download'
  | 'arrow'
  | 'network'
  | 'vector'
  | 'dashboard'
  | 'wireframe'
  | 'sun'
  | 'moon'
  | 'play'
  | 'pause';

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

/** States what exists rather than showing an empty box pretending to be a screenshot. */
export interface AssetSlot {
  what: string;
  /** 'ready' — the asset exists and needs dropping in. 'waiting' — blocked on something. */
  status: 'ready' | 'waiting';
  note: string;
  icon: IconName;
}

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
  /** Screen recording. Omit until it has been captured. */
  src?: string;
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
  /** Preview cards. When present the AssetSlot is redundant — drop it. */
  previews?: Preview[];
  slot?: AssetSlot;
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

export interface Section {
  no: string;
  id: string;
  name: string;
  say: string;
}
