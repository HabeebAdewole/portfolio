import type { Note } from './types';

/* Nothing is published yet, and the section says so rather than showing
   "Read →" links that go nowhere. Flip status to 'published' and add href
   as each one gets written. */

export const notes: Note[] = [
  {
    when: '2025.12',
    title: 'Two hours on a port that was never free',
    status: 'queued',
  },
  {
    when: '2026.02',
    title: 'Implementing SHAP by hand when SHAP won’t install',
    status: 'queued',
  },
  {
    when: '2026.04',
    title: 'Why my graph neural network lost to a Random Forest',
    status: 'queued',
  },
];

export const notesAllQueued = notes.every((n) => n.status === 'queued');
