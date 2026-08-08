import opportunaHome from '../assets/shots/opportuna.png';
import tracerAlerts from '../assets/shots/tracer-alerts.png';
import tracerAnalyze from '../assets/shots/tracer-analyze.png';
import type { Entry } from './types';

export const projects: Entry[] = [
  {
    id: 'tracer',
    index: '01.1',
    title: 'Tracer',
    deck: ['Final year project', '2026', 'Illicit Bitcoin transaction detection'],
    body: [
      {
        t: 'p',
        text:
          'Trained on the Elliptic dataset and shipped as a working application rather than ' +
          'a notebook. A Random Forest reached {{0.807}} F1 on the illicit class, reproducing ' +
          'the Weber et al. (2019) benchmark under the same evaluation protocol.',
      },
      {
        t: 'p',
        text:
          'SMOTE for class rebalance, and a temporal train/test split so no future data leaks ' +
          'backwards into training. The app screens every transaction per time step against a ' +
          'capacity budget, raises analyst alerts, and draws the 2-hop payment neighbourhood ' +
          'of whatever it scored.',
      },
    ],
    panels: [
      {
        kind: 'metrics',
        title: 'Test set performance',
        corner: 'Illicit class',
        items: [
          { key: 'F1', value: '0.807', fill: 80.7 },
          { key: 'Precision', value: '92.5', unit: '%', fill: 92.5 },
          { key: 'Recall', value: '71.6', unit: '%', fill: 71.6 },
          { key: 'AUC-ROC', value: '0.944', fill: 94.4 },
        ],
      },
      {
        kind: 'comparison',
        title: 'Models compared',
        corner: 'F1, illicit',
        caption:
          'I expected the graph model to win. Both of the clever approaches lost to the ' +
          'plain forest, and the dataset explains why.',
        columns: ['Model', 'F1'],
        rows: [
          { label: 'Random Forest', value: '0.807', fill: 80.7, lead: true },
          { label: 'RF / GNN hybrid', value: '0.707', fill: 70.7 },
          { label: 'GraphSAGE', value: '0.697', fill: 69.7 },
        ],
      },
    ],
    stack: [
      'python',
      'scikit-learn',
      'pytorch geometric',
      'flask',
      'jwt',
      'react 18',
      'vite',
      'mysql',
      'pytest',
    ],
    previews: [
      {
        poster: tracerAnalyze,
        w: 1430,
        h: 1653,
        aspect: '16 / 10',
        label: 'Tracer, running',
        /* The embed lands on a login wall, so the credentials belong on the
           card rather than in a README nobody opens. The deployment runs with
           DEMO_MODE on, which makes the admin writes read-only. */
        meta: 'sign in — analyst / analyst123',
        embed: 'https://tracer-web.onrender.com',
        prewarm: 'https://tracer-api-68u0.onrender.com',
        alt: 'The Tracer analyst interface: transaction 30179316 flagged illicit at 91.0% fraud probability, Random Forest and GraphSAGE scores side by side, a decision-path attribution chart showing which features pushed the score, and the 2-hop payment network below.',
        caption: 'Search a transaction, score it, and see which features moved the decision',
      },
      {
        poster: tracerAlerts,
        w: 1440,
        h: 900,
        aspect: '16 / 10',
        label: 'Working the alert queue',
        meta: '142 open',
        alt: 'The analyst alert queue, showing open alerts with transaction id, ground truth, model probability and which model raised each one.',
        caption: 'Every alert traced back to the model and time step that raised it',
        seconds: 10,
      },
    ],
    actions: [
      {
        label: 'Open it live',
        href: 'https://tracer-web.onrender.com',
        icon: 'external',
      },
      {
        label: 'Repo',
        href: 'https://github.com/HabeebAdewole/fraud-detection-system',
        icon: 'github',
      },
      { label: 'Writeup — not published yet', pending: true },
    ],
  },

  {
    id: 'vectogen',
    index: '01.2',
    title: 'VectoGen',
    deck: ['2026', 'Text to editable vector graphics', 'Built twice'],
    body: [
      {
        t: 'p',
        text:
          'Type a prompt, get an editable SVG back. The first build leaned on the good tools ' +
          '— Stability AI for generation, Vectorizer.AI for the trace, Supabase holding the ' +
          'result. One flow, no manual step in the middle.',
      },
      {
        t: 'p',
        text:
          'Then I rebuilt the whole generation path with no external AI in it, to find out ' +
          'whether I could. Three pieces, all mine: an NLP intent parser in scikit-learn, a ' +
          'programmatic SVG assembly engine, and a design variation system, served from a ' +
          'FastAPI microservice.',
      },
      {
        t: 'pull',
        text:
          'The first one makes better pictures. The second one taught me what the first one ' +
          'was doing.',
      },
    ],
    panels: [
      {
        kind: 'comparison',
        title: 'Two builds',
        corner: 'Same product',
        columns: ['Build', 'Generation path'],
        rows: [
          { label: 'v1 — API', value: 'stability ai → vectorizer.ai', fill: null, lead: true },
          { label: 'v2 — self-built', value: 'sklearn parser → svg engine', fill: null },
        ],
      },
    ],
    stack: [
      'next.js 14',
      'typescript',
      'supabase',
      'stability ai',
      'vectorizer.ai',
      'fastapi',
      'scikit-learn',
    ],
    slot: {
      what: 'Prompt to SVG, screen recording',
      status: 'waiting',
      note: 'after the v1 deploy',
      icon: 'vector',
    },
    actions: [
      { label: 'Live — deploying', pending: true },
      {
        label: 'v1 repo — API build',
        href: 'https://github.com/HabeebAdewole/reimagined-system',
        icon: 'github',
      },
      {
        label: 'v2 repo — self-built',
        href: 'https://github.com/HabeebAdewole/vectogen-v2',
        icon: 'github',
      },
    ],
  },

  {
    id: 'opportuna',
    index: '01.3',
    title: 'Opportuna',
    deck: ['2025', 'Co-founder, frontend lead', 'Internship platform'],
    body: [
      {
        t: 'p',
        text:
          'Verified internship listings on one side, recruitment workflow on the other. I ' +
          'built the flows that hold it together — auth, discovery, application management, ' +
          'profiles, and role-based dashboards for three different kinds of user.',
      },
      {
        t: 'p',
        quiet: true,
        text:
          'Worked from product ideation through to MVP, which meant arguing about requirements ' +
          'and the design system as much as writing components.',
      },
    ],
    panels: [
      {
        kind: 'tally',
        title: 'Shipped in the MVP',
        corner: 'Frontend',
        items: [
          'Authentication',
          'Internship discovery',
          'Application management',
          'Profile creation',
          'Student dashboard',
          'Employer dashboard',
          'Admin dashboard',
        ],
      },
    ],
    stack: ['react', 'typescript', 'tailwind', 'figma'],
    previews: [
      {
        poster: opportunaHome,
        w: 1440,
        h: 900,
        aspect: '16 / 10',
        label: 'Opportuna, running',
        meta: 'live on vercel',
        embed: 'https://opportuna-website.vercel.app',
        alt: 'The Opportuna landing page: "Find the Right Internships or Interns", with navigation for companies, interns, schools, and a sign-up call to action.',
        /* The three dashboards are behind the login, so the embed shows the
           public side only. Say that rather than implying otherwise. */
        caption: 'Public side of the platform — the three dashboards sit behind sign-in',
      },
    ],
    slot: {
      what: 'Student, employer and admin dashboards',
      status: 'waiting',
      note: 'behind login — needs a screenshot or demo credentials',
      icon: 'dashboard',
    },
    actions: [
      { label: 'Open it live', href: 'https://opportuna-website.vercel.app', icon: 'external' },
      { label: 'Repo — private to the team', pending: true },
    ],
  },

  {
    id: 'latex-fabrics',
    index: '01.4',
    title: 'Latex Fabrics',
    deck: ['2025', 'Freelance', 'Installable storefront for a Lagos fabric retailer'],
    body: [
      {
        t: 'p',
        text:
          'Brought in to work out what a fabric business actually needed before anyone wrote ' +
          'code — brand documentation, requirements, a design system, wireframes. The job ' +
          'started as translation: turning a non-technical owner’s commercial goals into ' +
          'something a developer could build from without guessing.',
      },
      {
        t: 'p',
        text:
          'Then I built it. Ten routes, cart and wishlist in local state, and orders that ' +
          'hand off to WhatsApp because that is where the customers already are. It installs ' +
          'to the home screen and keeps working when the connection drops, which in Lagos is ' +
          'a requirement rather than a nice-to-have.',
      },
    ],
    panels: [
      {
        kind: 'facts',
        title: 'Built',
        corner: 'PWA',
        items: [
          { key: 'Routes', value: '10' },
          { key: 'Offline', value: 'Yes' },
          { key: 'Installable', value: 'Yes' },
          { key: 'Checkout', value: 'WhatsApp' },
        ],
      },
      {
        kind: 'tally',
        title: 'Delivered before a line of code',
        corner: '5 documents',
        items: [
          'Brand documentation',
          'Product requirements (PRD)',
          'Functional requirements (FRD)',
          'Design system',
          'Wireframe specifications',
        ],
      },
    ],
    stack: ['react 19', 'typescript', 'vite', 'tailwind', 'zustand', 'vite-plugin-pwa'],
    slot: {
      what: 'Storefront on a phone',
      status: 'ready',
      note: 'app runs locally — needs a screenshot',
      icon: 'wireframe',
    },
    actions: [
      {
        label: 'Repo',
        href: 'https://github.com/HabeebAdewole/latex-fabrics',
        icon: 'github',
      },
      { label: 'Live — not deployed yet', pending: true },
    ],
  },

  {
    id: 'drs',
    index: '01.5',
    title: 'Departmental Receipt System',
    weight: 'slim',
    deck: ['2025', 'Frontend', 'Built for the NACOS chapter'],
    body: [
      {
        t: 'p',
        text:
          'Replaced a paper dues book with receipts and searchable payment records. Built in ' +
          'React and TypeScript straight against the Figma file through a Figma MCP ' +
          'integration, which cut the design-handoff step out entirely.',
      },
    ],
    stack: ['react', 'typescript', 'figma mcp'],
    actions: [{ label: 'Repo — not pushed yet', pending: true }],
  },

  {
    id: 'evs',
    index: '01.6',
    title: 'Electronic Voting System',
    weight: 'slim',
    deck: ['2025', 'Commissioned as president', 'NACOS chapter elections'],
    body: [
      {
        t: 'p',
        text:
          'Ran the chapter’s elections off it. Nomination data cleaning, de-duplication of ' +
          'nominee records, and results integration back into the official portal — the ' +
          'boring parts that decide whether anyone trusts the count.',
      },
    ],
  },
];
