import type { Entry } from './types';

export const experience: Entry[] = [
  {
    id: 'nacos',
    index: '02.1',
    title: 'President, NACOS Crescent University chapter',
    deck: ['2025–26 session', 'Completed, handed over'],
    body: [
      {
        t: 'p',
        text:
          'Ran the executive administration for the Computer Science department across ' +
          'technical, welfare, academic and social portfolios — the primary channel between ' +
          'the student body and faculty leadership.',
      },
      {
        t: 'p',
        text:
          'Three manual processes went digital under it. Two departmental events ran for the ' +
          'first time and are now fixtures. I rebuilt the chapter Dev Team so students across ' +
          'year groups had something real to build.',
      },
    ],
    panels: [
      {
        kind: 'facts',
        title: 'Delivered in one session',
        corner: '2025–26',
        items: [
          { key: 'Systems shipped', value: '3' },
          { key: 'First-ever events', value: '2' },
          { key: 'Industry partners', value: '2' },
          { key: 'Portfolios run', value: '4' },
        ],
      },
      {
        kind: 'tally',
        title: 'What that was',
        items: [
          'Electronic Voting System',
          'Departmental Receipt System',
          'Chapter website redesign',
          'NACOS CUAB Hackathon',
          'NACOS GameFest',
          'Zulfah Group workshop',
          'Ogun Tech Community · AI & data',
          'Dev Team rebuild',
        ],
      },
    ],
    actions: [{ label: 'What I’d do differently — not written yet', pending: true }],
  },

  {
    id: 'aptech',
    index: '02.2',
    title: 'Frontend & Java Developer Intern',
    weight: 'slim',
    deck: ['APTECH Computer Education', '2023'],
    body: [
      {
        t: 'p',
        text:
          'Java on OOP fundamentals — inheritance, static members, method overriding — plus ' +
          'text parsing and validation with the Pattern and Matcher API. A banking application ' +
          'and a student grading system came out of it. Certificate awarded 2025.',
      },
    ],
    stack: ['java', 'html', 'css', 'javascript'],
  },

  {
    id: 'tutor',
    index: '02.3',
    title: 'Peer tutor',
    weight: 'slim',
    deck: ['Crescent University', '2023 – present'],
    body: [
      {
        t: 'p',
        text:
          'Computational Science, Numerical Methods, Algorithms & Complexity, Discrete ' +
          'Structures. Teaching a proof is the fastest way to find out you don’t understand it.',
      },
    ],
  },
];
