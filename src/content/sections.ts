import type { Section } from './types';
import { logConfigured } from '../lib/log';

const base: Section[] = [
  { no: '01', id: 'work', name: 'Work', say: 'What I built, and how it went.' },
  { no: '02', id: 'experience', name: 'Experience', say: 'Where the time went.' },
  {
    no: '03',
    id: 'notes',
    name: 'Notes',
    say: 'Mostly things that broke. None of it written up yet.',
  },
  { no: '04', id: 'stack', name: 'Stack', say: 'What I reach for.' },
];

/* The Log appears only once Supabase is configured at build time. With no env
   vars set — which is the state of every clone of this repo, and of the site
   until the secrets are added in GitHub — the page is exactly what it was
   before: four sections, no board, no form, nothing to abuse. */
export const sections: Section[] = logConfigured
  ? [...base, { no: '05', id: 'log', name: 'Log', say: 'Sign it if you passed through.' }]
  : base;
