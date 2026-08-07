import type { Section } from './types';

export const sections: Section[] = [
  { no: '01', id: 'work', name: 'Work', say: 'Things I built, and how they did.' },
  { no: '02', id: 'experience', name: 'Experience', say: 'Where the time actually went.' },
  {
    no: '03',
    id: 'notes',
    name: 'Notes',
    say: 'Mostly things that broke. Nothing published yet — this is the queue.',
  },
  { no: '04', id: 'stack', name: 'Stack', say: 'What I reach for.' },
];
