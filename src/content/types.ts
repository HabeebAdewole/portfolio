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
  | 'moon';

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

/** A real screenshot. Replaces the AssetSlot once the image lands. */
export interface Shot {
  /** Imported asset URL — let Vite hash and optimise it. */
  src: string;
  /** Describe what the screen shows, not that it is a screenshot. */
  alt: string;
  caption?: string;
  /** Native pixel dimensions, so the layout reserves space and never shifts. */
  w: number;
  h: number;
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
  /** Real images. When present the AssetSlot is redundant — drop it. */
  shots?: Shot[];
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
