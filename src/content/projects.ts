import latexHome from '../assets/shots/latex-home.png';
import latexShopPhone from '../assets/shots/latex-shop-phone.png';
import opportunaHome from '../assets/shots/opportuna.png';
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
          'Trained on the Elliptic dataset and shipped as a real application, not a notebook. ' +
          'A Random Forest got {{0.807}} F1 on the illicit class. That matches the published ' +
          'Weber benchmark on the same data and the same split.',
      },
      {
        t: 'p',
        text:
          'SMOTE for the class imbalance. The split is temporal, so no future data leaks ' +
          'backwards into training. The app scores every transaction per time step against a ' +
          'capacity budget, raises alerts for the analyst, and draws the 2-hop payment ' +
          'neighbourhood of whatever it just scored.',
      },
      {
        t: 'p',
        text:
          'SHAP would not install in the target environment, so I wrote the attribution myself ' +
          'in NumPy over scikit-learn’s trees. There is a test asserting the contributions sum ' +
          'exactly to the prediction. They do.',
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
          'I expected the graph model to win. Both of the clever ones lost to the plain ' +
          'forest. The features already summarise each transaction’s neighbours, so the ' +
          'graph was learning something the forest had.',
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
        meta: 'sign in with analyst / analyst123',
        embed: 'https://tracer-web.onrender.com',
        prewarm: 'https://tracer-api-68u0.onrender.com',
        alt: 'The Tracer analyst interface: transaction 30179316 flagged illicit at 91.0% fraud probability, Random Forest and GraphSAGE scores side by side, a decision-path attribution chart showing which features pushed the score, and the 2-hop payment network below.',
        caption: 'Search a transaction, score it, see what moved the decision',
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
      { label: 'Writeup, not written yet', pending: true },
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
          'Type a prompt, get an editable SVG back. The first build used the good tools. ' +
          'Stability AI for generation, Vectorizer.AI for the trace, Supabase holding the ' +
          'result. One flow, no manual step in the middle.',
      },
      {
        t: 'p',
        text:
          'Then I built it again with no external AI in it, to see whether I could. An intent ' +
          'parser in scikit-learn, an SVG assembly engine, and a variation system, all mine, ' +
          'served from a FastAPI microservice.',
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
          { label: 'v1, with APIs', value: 'stability ai → vectorizer.ai', fill: null, lead: true },
          { label: 'v2, no APIs', value: 'sklearn parser → svg engine', fill: null },
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
    actions: [
      { label: 'Live, deploying', pending: true },
      {
        label: 'v1 repo, the API build',
        href: 'https://github.com/HabeebAdewole/reimagined-system',
        icon: 'github',
      },
      {
        label: 'v2 repo, the self-built one',
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
          'Verified internship listings on one side, recruitment on the other. I built the ' +
          'flows that hold it together. Auth, discovery, applications, profiles, and separate ' +
          'dashboards for students, employers and admins.',
      },
      {
        t: 'p',
        quiet: true,
        text:
          'Ideation through to MVP, so I spent as much time arguing about requirements and ' +
          'the design system as writing components.',
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
        caption: 'This is the public side. The three dashboards are behind sign-in',
      },
    ],
    actions: [
      { label: 'Open it live', href: 'https://opportuna-website.vercel.app', icon: 'external' },
      { label: 'Repo is private to the team', pending: true },
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
          'code. Brand documentation, requirements, a design system, wireframes. The job was ' +
          'translation. The owner knew her business and not software, and somebody had to ' +
          'turn one into the other.',
      },
      {
        t: 'p',
        text:
          'Then I built it. Ten routes, cart and wishlist held locally, and orders that hand ' +
          'off to WhatsApp because that is where her customers already are. It installs to ' +
          'the home screen and keeps working when the connection drops. In Lagos that is not ' +
          'a nice-to-have.',
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
        title: 'Delivered before any code',
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
    previews: [
      {
        poster: latexHome,
        w: 1440,
        h: 900,
        aspect: '16 / 10',
        label: 'The storefront',
        meta: 'woven in heritage',
        alt: 'The Latex Fabrics home page: a deep burgundy hero reading "Discover Premium Fabrics", with lace, Swiss voile and sequins, and a row of fabric categories below.',
        caption: 'Lace, Swiss voile, cord lace and aso-oke, priced by the yard',
      },
      {
        poster: latexShopPhone,
        w: 414,
        h: 896,
        aspect: '16 / 10',
        /* A 414-wide capture cropped into a landscape window is destroyed,
           so this one sits whole on the stage instead. */
        fit: 'contain',
        label: 'Shop, on a phone',
        meta: '12 fabrics in stock',
        alt: 'The Latex Fabrics shop on a phone: fabric cards with naira prices per yard, live stock counts, add-to-cart buttons and a bottom tab bar for home, shop, search, wishlist and cart.',
        caption: 'Where it is actually used. Naira by the yard, live stock, and a cart that survives going offline',
      },
    ],
    actions: [
      {
        label: 'Repo',
        href: 'https://github.com/HabeebAdewole/latex-fabrics',
        icon: 'github',
      },
      { label: 'Not deployed yet', pending: true },
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
          'integration, so there was no design handoff step at all.',
      },
    ],
    stack: ['react', 'typescript', 'figma mcp'],
    actions: [{ label: 'Never pushed it', pending: true }],
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
          'We ran the chapter elections on it. Cleaning nomination data, de-duplicating ' +
          'nominee records, pushing results back to the official portal. Boring work, and it ' +
          'is the only reason anyone trusted the count.',
      },
    ],
  },
];
