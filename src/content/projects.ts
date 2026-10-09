import receiptPreview from '../assets/shots/departmental-receipt.jpg';
import formHome from '../assets/shots/form-home.png';
import formMember from '../assets/shots/form-member-desktop.png';
import formAdmin from '../assets/shots/form-admin-desktop.png';
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
    id: 'form',
    index: '01.2',
    title: 'FORM',
    deck: ['2026', 'Personal project', 'Gym booking frontend'],
    body: [
      {
        t: 'p',
        text: 'FORM explores a gym journey from finding a class to managing a training week. I designed and built the React and TypeScript frontend: public pages, a member workspace and a separate club administration interface.',
      },
      {
        t: 'p',
        text: 'The first design looked polished but did not feel enough like a gym. I moved toward training photography, background video and direct fitness copy. Reduced-motion preferences retain stills, and video pauses offscreen.',
      },
      {
        t: 'p',
        text: 'Public schedule filters live in the URL. Members can book and cancel classes, see their remaining credits, pause or change a plan, and explore checkout outcomes. The admin schedule checks trainer and room conflicts; trainers with assigned sessions cannot be marked inactive.',
      },
      {
        t: 'p',
        text: 'I checked the production build, TypeScript and lint, then walked through booking, membership changes, checkout retries and admin validation. Verification is documented separately from business results: this project has no measured conversion or revenue claims.',
      },
      {
        t: 'p',
        quiet: true,
        text: 'Frontend concept using fictional records and browser-local state. Member and admin datasets are independent. Account and contact forms validate locally; authentication, real reservations, email delivery and payment processing are not connected. Stock photography illustrates the training disciplines.',
      },
    ],
    stack: ['react', 'typescript', 'tailwind css', 'vite', 'vercel'],
    previews: [
      {
        poster: formHome,
        w: 1440,
        h: 900,
        aspect: '16 / 10',
        label: 'FORM, the club',
        meta: 'frontend demo',
        alt: 'FORM homepage with a strength-training video background, the headline Built through every rep, and links to the class schedule and memberships.',
        caption: 'Explore the club, find a coach, plan a training week',
      },
      {
        poster: formMember, w: 1425, h: 990, aspect: '1425 / 990',
        label: 'FORM, member workspace', meta: 'booking and membership',
        alt: 'FORM member dashboard showing a Foundation plan, one upcoming class and three remaining credits.',
        caption: 'A booking updates the dashboard and remaining credits',
      },
      {
        poster: formAdmin, w: 1425, h: 990, aspect: '1425 / 990',
        label: 'FORM, club administration', meta: 'seeded operational records',
        alt: 'FORM administration overview with seeded membership, transaction and attendance summaries.',
        caption: 'Member records, trainer assignments and a recurring schedule',
      },
    ],
    actions: [
      { label: 'Open it live', href: 'https://form-gym-alpha.vercel.app/', icon: 'external' },
      { label: 'Member space', href: 'https://form-gym-alpha.vercel.app/#/member', icon: 'external' },
      { label: 'Club administration', href: 'https://form-gym-alpha.vercel.app/#/admin', icon: 'external' },
      { label: 'Discuss a frontend project', href: 'mailto:brightopeyemi4@gmail.com' },
      { label: 'Repo', href: 'https://github.com/HabeebAdewole/bookish-fortnight', icon: 'github' },
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
    id: 'drs',
    index: '01.4',
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
    previews: [{
      poster: receiptPreview, w: 5760, h: 4096, aspect: '16 / 10',
      label: 'Departmental Receipt System', meta: 'Receipt claim interface',
      alt: 'NACOS CUAB departmental receipt claim form alongside a blue introduction panel and a mobile preview.',
      caption: 'Submit a departmental receipt claim',
    }],
    stack: ['react', 'typescript', 'figma mcp'],
    actions: [{ label: 'Never pushed it', pending: true }],
  },

  {
    id: 'evs',
    index: '01.5',
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
