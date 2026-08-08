import type { Entry } from './types';

export const experience: Entry[] = [
  {
    id: 'nacos',
    index: '02.1',
    title: 'President, NACOS Crescent University chapter',
    deck: ['2025–26 session', 'Finished and handed over'],
    body: [
      {
        t: 'p',
        text:
          'Ran the executive for the Computer Science department for one session. Technical, ' +
          'welfare, academic and social, and the line between the student body and the ' +
          'faculty whenever either had something to say to the other.',
      },
      {
        t: 'p',
        text:
          'Three manual processes went digital while I was there. Two events ran for the ' +
          'first time and are still running. I rebuilt the chapter Dev Team so students below ' +
          'final year had something real to build.',
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
    actions: [{ label: 'What I’d do differently, not written yet', pending: true }],
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
          'Java, on the fundamentals. Inheritance, static members, method overriding, and text ' +
          'parsing with the Pattern and Matcher API. A banking app and a student grading ' +
          'system came out of it.',
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
          'Structures. Teaching a proof is the fastest way to find out you do not understand it.',
      },
    ],
  },
];
