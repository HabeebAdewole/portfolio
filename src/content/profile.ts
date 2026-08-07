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

  headline: 'I build things that get measured, and I report the number either way.',

  lede:
    'Final-year Computer Science at Crescent University Abeokuta. I write **React and ' +
    'TypeScript** on the front, **Python, Flask and FastAPI** behind it, and I spent this ' +
    'year training models to catch fraud. Last session I ran the Computer Science ' +
    'department as NACOS president.',
} as const;

/** The hero readings panel. Figures only — nothing here is a claim. */
export const status: Fact[] = [
  { key: 'Graduating', value: '2026' },
  { key: 'Major GPA', value: '5.0 / 5.0' },
  { key: 'Cumulative', value: '4.23 / 5.0' },
  { key: 'Shipped', value: '6 projects' },
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
    detail: '4.23 / 5.0 cumulative, final results pending',
  },
  {
    key: 'Certified',
    value: 'Java Programming',
    detail: 'APTECH Nigeria, 2025',
  },
];
