import type { Credential, Fact, StackGroup } from './types';

export const profile = {
  name: 'Adewole Habeeb Adebola',
  role: 'Software Engineer',
  email: 'brightopeyemi4@gmail.com',
  github: 'https://github.com/HabeebAdewole',
  linkedin: 'https://www.linkedin.com/in/habeeb-adewole-16368a285/',
  x: 'https://x.com/_debola7',
  xHandle: '@_debola7',

  /* Public Drive viewer; viewer download, copy and print are disabled in Drive. */
  cv: 'https://drive.google.com/file/d/11bPj1QGwTpugI1ugwSR-ULB77a4bGgk2/view',
  cvUpdated: '2026.10',
  available: 'Open to work & freelance',
  updated: '2026.09',

  /* A greeting, not a sentence about the page. Short on purpose — it is the
     one line set large enough for the face to actually be seen. */
  headline: 'Hey, I’m Habeeb.',

  /* No stack, no school. Both are further down the page and the visitor will
     get to them; the top of the page is for who is talking.

     The first sentence used to be the second half of the headline. It moved
     here rather than being cut: a greeting says nothing about the work, and
     without this line the top of the page would not say what it is. */
  lede:
    'This is where the time went, and what I’ve had my hands in. Some of it is ' +
    'still running, and you can open it right here without leaving. Some of it ' +
    'lost to a simpler model and I wrote the number down anyway.',
} as const;

/**
 * The hero readings panel. Figures only, nothing here is a claim.
 *
 * Deliberately not academic: the GPAs sit with the rest of the credentials
 * in section 04, where someone who wants them will look. The top of the page
 * answers what he has built and whether he is reachable.
 */
export const status: Fact[] = [
  { key: 'Shipped', value: '6 projects' },
  { key: 'Running live', value: '2' },
  { key: 'Building since', value: '2023' },
  { key: 'Free from', value: '2026' },
];

export const stack: StackGroup[] = [
  {
    label: 'Languages',
    items: ['typescript', 'javascript', 'python', 'java', 'html', 'css'],
  },
  { label: 'Frontend', items: ['react 18', 'next.js 14', 'vite', 'tailwind'] },
  {
    label: 'Backend',
    items: ['flask', 'fastapi', 'mysql', 'supabase', 'rest', 'jwt', 'bcrypt'],
  },
  {
    label: 'Machine learning',
    items: [
      'scikit-learn',
      'pytorch',
      'pytorch geometric',
      'pandas',
      'numpy',
      'imbalanced-learn',
    ],
  },
  { label: 'Tools', items: ['git', 'pytest', 'figma', 'playwright'] },
];

export const credentials: Credential[] = [
  {
    key: 'Degree',
    value: 'BSc Computer Science',
    detail: 'Crescent University Abeokuta, 2026',
  },
  {
    key: 'Standing',
    value: 'Second Class Upper',
    detail: '4.35 / 5.0 final CGPA',
  },
  {
    key: 'Certified',
    value: 'Java Programming',
    detail: 'APTECH Nigeria, 2025',
  },
];
