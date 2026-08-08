import type { Credential, Fact, StackGroup } from './types';

export const profile = {
  name: 'Adewole Habeeb Adebola',
  role: 'Software Engineer',
  location: 'Abeokuta, NG',
  locationLong: 'Abeokuta, Ogun State, Nigeria',
  email: 'brightopeyemi4@gmail.com',
  github: 'https://github.com/HabeebAdewole',
  linkedin: 'https://www.linkedin.com/in/habeeb-adewole-16368a285/',
  x: 'https://x.com/_debola7',
  xHandle: '@_debola7',
  available: 'Open to work & freelance',
  updated: '2026.08',

  headline: 'You found me. This is where the time went, and what I’ve had my hands in.',

  /* No stack, no school. Both are further down the page and the visitor will
     get to them; the top of the page is for who is talking. */
  lede:
    'Some of it is still running, and you can open it right here without leaving. ' +
    'Some of it lost to a simpler model and I wrote the number down anyway. Explore…',
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
    detail: 'Crescent University Abeokuta, expected 2026',
  },
  {
    key: 'Standing',
    value: 'Second Class Upper',
    detail: '4.27 / 5.0 cumulative, final results pending',
  },
  {
    key: 'Certified',
    value: 'Java Programming',
    detail: 'APTECH Nigeria, 2025',
  },
];
