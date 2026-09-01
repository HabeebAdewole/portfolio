# STATE.md — Portfolio (`_this_me`)

## Project Overview
Personal portfolio site for **Adewole Habeeb Adebola** — final-year Computer Science,
Crescent University Abeokuta, graduating 2026. Built and live at **`https://adebola.me`**.

**Two audiences, both decided:**
1. **Recruiters / hiring managers** — skimming ~20 seconds. Stack visible, CV one click away.
2. **Freelance clients** — non-technical. Need outcomes and live things to click, not F1 scores.

## Section 05 — the Log (built 2026-09-01, NOT yet switched on)
A visitor pinboard: anyone may leave a note, notes are held unapproved until he
puts them up. Built and verified, but **dormant** — see the switch below.

**The switch.** `src/content/sections.ts` adds section 05 only when both
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set at build time. With
them unset the section does not render, does not appear in the nav, and the
string does not reach the bundle — verified by grepping `dist`. **The live site
today is byte-for-byte what it was before the Log existed.**

**To turn it on:**
1. Create a Supabase project, run `supabase/notes.sql` in its SQL editor.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as **repository
   secrets** (Settings → Secrets and variables → Actions). `deploy.yml` already
   passes them to `npm run build`.
3. Push. The section appears.

⚠️ **The anon key is public and that is fine** — it ships in the JS bundle by
design, identifies the project, and authorises nothing. Every permission it has
is in `supabase/notes.sql`: insert an unapproved row, read approved rows.
**Never put the `service_role` key in these vars** — it bypasses every policy.

⚠️ ~~**Approving is manual, via the Supabase dashboard.**~~ **Superseded
2026-09-01 — Telegram moderation.** A Database Webhook on INSERT calls the
`notify` edge function, which messages one chat with the note's full text and
two buttons; tapping one hits the `moderate` function, which flips the row. The
dashboard is out of the daily loop. Setup steps live in `supabase/README.md`.

- **Dismiss does not delete** — it sets `dismissed`, so a turned-down note is
  recoverable and the record of what was said survives.
- ⚠️ **`moderate` MUST be deployed with `--no-verify-jwt`.** It is opened by
  tapping a link, which carries no auth header. The HMAC in the URL is what
  authorises it. `notify` keeps its JWT check, because the webhook sends the
  service_role key and nobody else should be able to make his phone buzz.
- ⚠️ **The links are signed for a reason.** An unsigned `?id=…&a=approve` is
  guessable by anyone who sees the pattern once, which would hand the board to a
  stranger. HMAC-SHA256 over `id:action:expiry`, seven-day TTL, constant-time
  compare. Verified against eight forgery cases (wrong action, wrong id, wrong
  secret, expired, tampered expiry, truncated, empty, NaN expiry) — all rejected.
  **Rotating `MODERATION_SECRET` invalidates every outstanding link**, which is
  the fix if one leaks.
- ⚠️ **The webhook is created in the dashboard, never as committed SQL** — the
  trigger definition holds the service_role key, and that must not enter the
  repo.
- Notifications stop above 12/hour so a spam run cannot bury the inbox; the
  queue is still readable via `select * from notes_pending`.
- ⚠️ **The edge functions are written but UNTESTED** as of 2026-09-01 — Deno is
  not installed on this machine and they cannot run until he deploys them. Only
  the HMAC was verified, by running the identical Web Crypto code in a browser.
  Expect to debug the first real note.

⚠️ **There is no real rate limiting.** The honeypot stops naive bots and the
CHECK constraints cap length, but a determined person can POST in a loop. If
that ever happens the fix is a Supabase edge function in front of the insert;
not built, because it is speculative until it isn't.

**Design decisions:**
- **Pinboard direction**, chosen off a six-direction spread:
  `claude.ai/code/artifact/485a2b4c-db64-4742-9e8c-3380f9362c41`.
  Resolved mockup: `claude.ai/code/artifact/79ef9e5d-0fd8-4f4f-897a-afa7af342388`.
- **The blend rule, and this section is its first use: lock type, vary surface.**
  Crete Round, Alegreya Sans and mono do exactly the jobs they do everywhere
  else. Paper, tape, rotation, shadow and ground are what change.
- ⚠️ **Shadows exist ONLY here.** The rest of the site has none, deliberately.
  Paper needs one or it is a rectangle. Do not let this leak outward.
- ⚠️ **Caveat is a fourth family and a deliberate carve-out** — signatures only,
  never a note. A name is a short expected string; a paragraph in a script face
  excludes people. Its latin file is 51 kB, larger than the display and prose
  romans combined, and is only fetched once a signature is on screen. **Worth
  subsetting to A–Z plus punctuation** (would go under 10 kB); not done because
  it needs `fonttools`, which this machine does not have.
- Rotations are fixed per position via `nth-child`, **never random** — a random
  angle re-rolls every render and reads as the page twitching.
- Supabase is called with two hand-rolled `fetch`es rather than
  `@supabase/supabase-js` (~40 kB gzipped for a query builder this does not
  need). Same reasoning that kept MDX out of `richText.tsx`.

**Redesigned 2026-09-01, at his request:**
- **The board is gone.** The section sits on `--ground` like every other
  section — notes are pinned to the page, not to a slab. `--board`,
  `--board-2` and `--board-edge` were deleted.
- ⚠️ **The paper border is now load-bearing in BOTH themes.** On the page
  ground the fill separates by 1.07 light and 1.27 dark — effectively not at
  all. `--paper-edge` measures 3.27 / 3.26 against `--ground` and is the whole
  card boundary. **Do not soften it**; there is nothing behind it.
- **Pushpins replaced the tape**, cycling five colours. Pin colours cycle every
  5 while rotations cycle every 4, so a pairing repeats only every 20 notes —
  the wall keeps looking accidental as it fills.
- Ink/date/signature ratios are unchanged: 12.96 / 11.89, 4.88 / 4.76,
  7.48 / 6.68.

⚠️ **The site now defaults to LIGHT, not to the visitor's OS** (2026-09-01).
`index.html` stamps `data-theme` before first paint; a saved choice still wins.
`useTheme` no longer listens to `prefers-color-scheme` — there is nothing to
follow. The media query in `tokens.css` survives only as a no-JS fallback.
`public/moderated.html` reads the same `localStorage` key, so the Telegram
confirmation lands in whichever theme he is actually using.

`verify` and `verify:motion` pass in both states: zero overflow at five widths,
no target under 44px, no heading skips.

⚠️ **Advice he has not yet accepted or declined: do not launch it empty.**
An empty board reads as neglect and Notes is already empty. Ask a handful of
real people to sign it first. **Never seed it with invented notes** — that
breaks the no-fabricated-data rule the whole site rests on.

## Phase Progress
- [x] Phase 1: Design direction — register, structure, content locked
- [x] Phase 2: Build & ship v1 — **live at `https://adebola.me`** (2026-08-09)
- [x] Phase 3: Site-wide motion — shipped 2026-08-09
- [ ] Phase 4: VectoGen embed (blocked on the VectoGen deploy)  ← **YOU ARE HERE**
- [ ] Phase 5: Write the three queued notes

## Current Phase Goal
_None set — Phase 3 shipped. Start Phase 4 with DISCUSS._

### Phase 3 — what actually happened
Scoped as "transaction network + command palette + cursor readout". It became a
**site-wide motion pass** instead, because that was the real ask.

**Shipped:**
- `src/styles/motion.css` — one motion vocabulary: three durations, three easings.
- `src/lib/scroll.ts` — GSAP + ScrollTrigger. Motion is **scrubbed** to scroll position,
  not fired once on entry, so it reverses on the way back up. That distinction is the whole
  point; an entry-triggered reveal cannot be made to feel like this by turning it up.
  Reference was gsap.com.
- Hero hands off on scroll, section rules draw, units rise 64px, tally chips cascade,
  preview stages drift for depth, buttons fill from the left on hover.
- Icons move in the direction they point. Brand marks never move.
- Everything inside `gsap.matchMedia`, so reduced motion creates **no triggers at all**.
- Cost: +46 kB gzipped (JS 70 → 116 kB).

**Dropped, by his call:**
- **Transaction network** — he did not want a Tracer-specific feature. Do not re-propose it.
- **Cursor work** — offered crosshair/magnetic/custom, he chose to leave the native cursor.
- **Command palette** — never discussed. Still available if he ever wants it.

`npm run verify:motion` guards the motion layer: it fails if a scroll reveal ever strands
content at zero opacity, or if reduced motion stops rendering the final state.

Phase 2 goal was "ship a live portfolio at a real URL within one week." Met: all 11 tasks in
`.plans/phase-2-plan.md` are done and the site is public.

### The live site
**`https://adebola.me`** — the canonical URL. This is the one that goes on the CV, in the X
bio, and on the GitHub profile.

**Host moved to GitHub Pages** (confirmed 2026-08-28: `server: GitHub.com`, Fastly edge,
last modified 2026-08-18). `.github/workflows/deploy.yml` runs `npm ci && npm run build` on
every push to `main` and publishes `dist` via `actions/deploy-pages`. The custom domain is
configured in **Settings → Pages**, not as a `CNAME` file in the repo — so it is invisible
from a checkout. Do not go looking for one.

⚠️ **`habeeb-adebola14.vercel.app` is still live and serving the same site** (verified
2026-08-28). Two hosts, one site. It is now a duplicate, not the home. Either retire the
Vercel project or leave it as a fallback, but nothing should ever link to it again.

⚠️ **Do not use `portfolio-habeeb9.vercel.app`.** Different project under a different scope,
sitting behind Vercel Authentication (302 → `sso-api`). It is not this portfolio. It cost a
session's worth of wrong turns.

### Repo
`github.com/HabeebAdewole/portfolio` (public), branch `main`, pushed and in sync.
Commit identity is `brainpizzy <brightopeyemi4@gmail.com>`, which GitHub links to his
account, so commits count on his contribution graph.

**Never add `Co-Authored-By: Claude` or `Claude-Session:` trailers to his commits.** Nine
commits carrying them were rewritten and force-pushed out on 2026-08-09 at his request.

### Deploy notes
- **GitHub Pages via GitHub Actions**, from `main`. Node 22, `npm ci`, `npm run build`,
  upload `dist`. Vite needs no base-path override because the site is served from a domain
  apex, not a `/repo/` subpath — **if the custom domain is ever removed, `base` in
  `vite.config.ts` has to be set or every asset 404s.**
- `playwright` is a devDependency but has **no install hooks**, so `npm ci` in CI will not
  download browsers. Build is safe. `npm run verify` and `verify:motion` are **not** in the
  workflow — they are local gates only.
- ~~`og:image` is still a relative path.~~ **Done 2026-08-09.**
- ~~The four meta URLs point at the Vercel host.~~ **Done 2026-08-28.** `canonical`,
  `og:url`, `og:image` and `twitter:image` now resolve against `https://adebola.me`. The
  domain is still hardcoded in exactly those four places in `index.html`, with a comment
  saying so — another move is one find-and-replace and nothing else.

### Custom domain — **`adebola.me`, resolved**
Live and serving on HTTPS. `habeebadewole.com` was the old target and was never bought;
`adewole.dev` is taken by an unrelated person. Both are closed — do not reopen them.

⚠️ **Unconfirmed and worth confirming: where `adebola.me` was registered and when it
expires.** If it came from the GitHub Student Pack's free `.me`, **that lapses after 12
months**, and a dead link on an already-sent CV is worse than an ugly one. Find the renewal
date, put it somewhere with a reminder, and decide before it lands.

⚠️ **Delete the `habeeb.adewole` entry in Vercel** if the Vercel project is kept at all.
`.adewole` is not a TLD and returns NXDOMAIN from the root zone, so it shows "Invalid
Configuration" forever. Vercel's "Add Existing" field accepts any string without checking
the TLD exists.

### Live deployments (found 2026-08-08)
| Project | URL | Notes |
|---|---|---|
| Tracer frontend | `https://tracer-web.onrender.com` | Live, fast. Sign in `analyst` / `analyst123`, or `admin` / `admin123`. Credentials are published in the repo and the deployment runs `DEMO_MODE=true`, so admin writes are read-only. |
| Tracer API | `https://tracer-api-68u0.onrender.com` | Render free tier. **Measured 32-second cold start.** |
| Opportuna frontend | `https://opportuna-website.vercel.app` | Live, embeddable. Poster captured from the deployment itself. **Landing page only — the three dashboards are behind sign-in.** |
| Opportuna backend | Cloud Run, `europe-west2` | From `opportuna-frontend/.env`. Only key there is `VITE_BASE_URL`, which ships in the client bundle anyway — not a secret. |
| VectoGen | not yet | He can deploy soon. |

**The cold start is the important one.** A recruiter who clicks through while the API is
asleep gets a UI that hangs for half a minute and concludes the project is broken. Handled
two ways: `usePrewarm` fires a `no-cors` ping at the API when the card scrolls within 600px
of the viewport, so the spin-up overlaps with reading time; and the load overlay says
"free tier — may take a moment to wake" rather than letting it look broken.

Tracer sends no `x-frame-options` and no CSP `frame-ancestors`, so it can legitimately be
embedded.

### Preview cards — capture spec
Screenshots were replaced with **preview cards**: the project running, not a picture of it.
Cards are built and live; they render the poster and a `RECORDING PENDING` chip until a
video exists, so the page is complete and honest right now.

Drop recordings in `src/assets/previews/`, then add `src:` to the matching object in
`src/content/projects.ts`. Nothing else changes.

| Setting | Value | Why |
|---|---|---|
| Format | MP4, H.264, **no audio track** | Universal, and a muted video with no audio stream is smaller |
| Capture size | **1440 × 900** | Matches the card's 16:10 window, so nothing gets cropped unexpectedly |
| Length | 10–15s, **looping cleanly** | End the take where it started or the loop visibly jumps |
| Bitrate | ~1–1.5 Mbps, target **under 2 MB** | Two of these already outweigh the whole JS bundle |
| Tools | Win+G (Game Bar), OBS, or ShareX | Any of them; Game Bar is already installed |

Move slowly and deliberately — pointer jitter reads as nervous on a loop.

**Shot list:**
1. `tracer-analyze.mp4` (~14s) — type a transaction id, hit Go, score resolves, scroll down
   through the attribution chart to the network graph.
2. `tracer-alerts.mp4` (~10s) — the queue, switch the ALL / OPEN / RESOLVED tabs, resolve one.
3. Latex Fabrics and VectoGen once each is deployed.

### Session log
- **Session 1 (tasks 1–3) — DONE.** Vite + React 19 + TS scaffolded by hand (`npm create vite`
  would have prompted to wipe `STATE.md` and `.plans`). Tokens ported and re-verified in the
  browser at the exact v3 ratios. Shell built: Masthead, Hero, Readout, Contact, section
  headers, skip link. Typed content layer complete. `npm run build` passes clean.
- **Session 2 (tasks 4–6) — DONE.** `<Entry>` plus the panel family (`metrics`, `comparison`,
  `facts`, `tally`), asset slots, actions. All four sections render from data. Notes and Stack
  built. Contact, theme persistence and focus management had already landed in Session 1.
  Build passes: 57 modules, 13.6 kB CSS, 68 kB JS gzipped.
  - ⚠️ **Browser verification did not run this session** — the Playwright MCP server
    disconnected mid-session. Verified instead against the compiled CSS: `.gauge` and `.bar`
    both carry `display:block`, all ten measured token values appear exactly twice (base +
    `data-theme` scope), both theme scopes present, reduced-motion covers `*, *::before,
    *::after`. **Session 3's a11y pass must re-measure in a real browser** — nothing has
    confirmed the React DOM renders these at the right sizes.
- **Interstitial fix — sticky masthead.** Requested before Session 3; also closes the
  critique's mobile red flag ("no sticky nav, no back-to-top" on a 10,000px page).
  `position: sticky` with an IntersectionObserver sentinel rather than a scroll listener.
  Condenses when stuck: desktop drops the role and location, **mobile drops the whole name
  row and keeps navigation** — you don't need to be told his name twice, you need to move.
  `scroll-margin-top` 84px / 68px so anchor jumps clear the bar. Touch targets held at 44px
  on mobile rather than shrinking the bar.
- **Session 3 (tasks 7–9) — DONE.** Scroll-driven reveal, full a11y pass in a real browser,
  real screenshots and real repo URLs. Playwright installed as a devDependency;
  `npm run verify` runs the whole measurement suite headless.

  **Verified measurements (Chromium, live DOM):**
  contrast light/dark — muted 5.53/5.82, data 5.82/8.56, mark 6.21/7.59, ink 14.32/14.98,
  edge 3.06/3.09, mark-soft 3.57/3.12, bar-dim 3.31/3.12. Zero horizontal overflow and zero
  targets under 44px at 1440 / 1024 / 820 / 640 / 390. One h1, inside `<main>`, no heading
  skips, skip link present, four landmarks, both images carry alt + intrinsic dimensions +
  lazy loading, zero broken anchors. Gauges start at 0 and settle at exactly
  80.7 / 92.5 / 71.6 / 94.4. Under `prefers-reduced-motion` every panel reports `off` and
  renders final values with no animation.

  **Three defects the browser pass caught:**
  1. `--bar-dim` measured 2.95:1 in light, not the 3.03 calculated by hand. Now 3.31.
  2. The reveal transition was declared only under `[data-reveal='in']`, so the transition
     and the width change arrived in the same style recalculation — fragile, and it can snap
     instead of animating. Moved to the base rule so the state flip changes one property.
  3. The first verification run read every gauge mid-flight. Cause was the test, not the
     page: `scroll-behavior: smooth` meant the wait started when the scroll began rather
     than when the panel arrived.

  **Content corrections from the filesystem and GitHub:**
  - **Latex Fabrics was built, not just designed.** Earlier sessions had it as a
    scoping-and-design engagement because that is all the resume describes. The repo is a
    real React 19 + Vite PWA — 10 routes, zustand cart and wishlist, `vite-plugin-pwa`,
    offline page, WhatsApp checkout. Entry rewritten; it is now the strongest item for the
    freelance-client audience.
  - Real repos wired: Tracer → `fraud-detection-system`, VectoGen v1 → `reimagined-system`,
    VectoGen v2 → `vectogen-v2`, Latex Fabrics → `latex-fabrics`. Opportuna lives under a
    collaborator's account and DRS was never pushed, so both say so rather than linking out.
  - Two real Tracer screenshots dropped in from `Projects/fraud-detection/report/screenshots`
    (`crop-network.png`, `06-alerts.png`). **The Tracer UI already speaks the instrument
    register** — mono tracked labels, corner readouts, hairlines — so they sit natively in
    the page rather than looking pasted in.
  - Notes stay `queued`; still nothing published.

### Phase 2 decisions
- **Vite + React + TS**, not Next.js — fastest path to a live URL, and closest to how Tracer
  and Opportuna were built. SEO cost is acceptable: portfolio traffic comes from links he
  sends, his X bio and his GitHub profile, not search.
- **Plain CSS with the v3 custom properties — not Tailwind.** The tokens are written and
  contrast-verified; Tailwind's defaults would fight them for two days and zero visible gain.
  Tailwind is already demonstrated on Opportuna, Latex Fabrics and DRS.
- **Frontend showcase is a hard requirement** — he was a frontend developer before an
  engineer, and the UI has to prove it. But interactivity must stay *functional*:
  a gauge animating is reporting a reading. Nothing moves to prove it can move.
- **Three of the four showcase pieces are deliberately deferred** so v1 ships. Only the
  scroll-driven instrument panel is in v1.
- **Cursor work: declined.** Offered in Phase 3, he chose to keep the native cursor.

---

## Key Decisions Made

### Direction
- **Design register: "the instrument."** Measurement, readings, tolerances, comparisons.
  Chosen after rejecting four alternatives (Editorial, The Index, Lagos Print, and the
  original plain "Log").
- **Explicitly NOT a terminal/CLI aesthetic.** Structure was taken from
  [hamzat.me](https://www.hamzat.me/), but Hamzat is a co-founder on Opportuna — adopting
  his terminal costume would clone a collaborator's site. An instrument is about *readings*;
  a terminal is about *commands*. Same discipline, different world.
- **Page structure: typed, numbered sections** (`01 Work`, `02 Experience`, `03 Notes`,
  `04 Stack`) — not one merged chronological log. This replaced a five-way filter row that
  had mixed taxonomy and no feedback design.
- **Rejected outright: the Nigerian print palette** (danfo yellow / market green).
  Direct quote: "I don't even want it." Do not reintroduce.

### Visual system
- **Three voices, amended 2026-08-31.** Mono was the display voice for Phases 1–4; it is
  now the *instrument* voice only, and a serif took the display role back.
  - **Display: Crete Round** (TypeTogether, OFL), self-hosted in `public/fonts/`. Carries
    the headline and each entry title — the two places the page speaks rather than reports.
  - **Instrument: mono** (Consolas / SF Mono / DejaVu Sans Mono). Every index, label,
    figure and readout. Still load-bearing, still never a costume.
    ⚠️ **Still a system stack** — the one voice that varies by OS. Left that way on purpose:
    monospace is a genre, the fallbacks are metrically close, and it carries short labels
    rather than paragraphs. Raised and deferred 2026-08-31, not overlooked.
  - **Prose: Alegreya Sans** (Juan Pablo del Peral / HT Fonts, OFL), self-hosted, weights
    400 and 700. Anything that is an argument, not a reading — about 1,570 words, the bulk
    of the page. Replaced the `Segoe UI` system stack on 2026-08-31; that stack was the last
    thing rendering as a different typeface per visitor, which is the Constantia failure
    again. Chosen off a five-face comparison in his real Tracer entry:
    `claude.ai/code/artifact/b9d6ae1a-887e-4502-ba15-a863210fc77f`.

    ⚠️ **Alegreya Sans has no 600.** Weights are 100/300/400/500/700/800/900. The two rules
    that asked for 600 (`.hero .lede strong`, `.contact h2`) now say 700 explicitly rather
    than letting CSS font matching resolve it silently.

    ⚠️ **`size-adjust: 108%` on its @font-face is load-bearing — do not remove it.** Measured
    at 100px, Alegreya Sans is x-height 46 / cap 65 against Segoe UI's 50 / 70, so at the
    same px it renders ~8% small. 108% scales it back so the verified type scale needed no
    change; at 16px it now measures x-height 8px / cap 11px, identical to the outgoing face.

    The italic is not shipped — nothing in `src/content` uses italic emphasis and
    `richText.tsx` has no italic marker.

  The original reason for going mono was that Constantia collapsed to Georgia off-Windows
  and reflowed the headline. **Self-hosting removes that failure mode entirely**, which is
  what reopened the decision. The fallback stack is led by Georgia on purpose: measured at
  100px, Crete Round is x-height 50 / cap 68 / test-line 1895px against Georgia's
  48 / 69 / 1881 — within about 1%, so the `font-display: swap` reflow is nearly invisible.

  ⚠️ **Crete Round ships Regular 400 and an italic. There is no bold.** Every rule using
  `--display` states `font-weight: 400` explicitly; a 600 or 700 left in place would hand
  the browser a synthetic bolder, which fattens the stems and flattens the roundness that
  is the whole reason for the face. Emphasis comes from size, spacing and colour.
  The italic is not shipped because nothing uses it yet — see `src/styles/fonts.css`.

  **How it was chosen.** Habibi (his find, rank 998/1946) shipped first and was rejected for
  having no bold at all. A comparison artifact then set fifteen candidates in his own
  headline on his own palette, ranked by Google Fonts popularity as a proxy for "generic":
  `claude.ai/code/artifact/02318963-29e8-494f-adb0-4b4ab86bf896`.
  ⚠️ **Do not propose Fraunces, Bricolage Grotesque, Inter, Space Grotesk or Playfair
  Display.** All rank inside the top 50 and were ruled out by name as the faces an AI
  reaches for by reflex. He rejects generic and he rejects heavy — the brief that landed
  was *presence without mass*.
- **Two accents, strict jobs, no drift:** blue `--mark` = interactive only.
  Ochre `--data` = a measured figure inline in prose only. Everything else neutral.
- Sans (`Segoe UI` stack) carries prose only — anything that is an argument, not a reading.

### Positioning
- **"Don't frame it yet"** — no niche label on the site. Descriptive, not positioned.
- ⚠️ **Open question:** the resume opens with "Software Engineer," which *is* a framing and
  contradicts this. Decision deferred, not resolved.

### Content
- **VectoGen: show the API build live, frame the project as "built twice."**
  v1 used Stability AI + Vectorizer.AI; v2 rebuilt the generation path with no external AI
  (own sklearn intent parser, own SVG assembly engine). The API build makes better pictures
  and demos better; the rebuild carries the engineering credibility. Both on one entry.
  - ⚠️ **Unconfirmed:** which build came first. Page currently says APIs first, rebuild second.
- ~~**Latex Fabrics is labelled design work, not a shipped product.**~~ **Overturned in
  Session 3 — it was built.** A real React 19 + Vite PWA: 10 routes, zustand cart and
  wishlist, `vite-plugin-pwa`, offline page, WhatsApp checkout. The entry says so. This
  line is kept struck through because the wrong version was believed for three sessions.
- **The CV is hosted for download** (`public/Adewole-Habeeb-Adebola-CV.pdf`), changed
  2026-08-28. It had been a `mailto:` "Ask for CV" since Phase 2; a recruiter skimming for
  twenty seconds does not send an email and wait a day, so the button now delivers.
  ⚠️ **The hosted PDF is not the master.** The phone number is stripped from the copy before
  export — the phone is kept off the public page on purpose, and a PDF at a fixed URL is
  reachable by anyone who guesses the path. Email and GitHub survive on it, so there is
  still a way through. Master `.docx` lives outside the repo in `Downloads/`; to regenerate,
  strip the phone paragraph, export to PDF, replace the file, bump `cvUpdated` in
  `profile.ts`. Verified 2026-08-28: 2 pages before and after, phone absent.
- **Left off the site deliberately:** phone number (public page and the hosted CV),
  "References available on request," and the resume's Personal Skills list. A page whose whole argument is
  *show, don't claim* can't carry "critical and creative problem solving."
- **No fabricated data, anywhere.** The RF/GNN hybrid F1 renders as a pending hatched bar
  because the number isn't known. The Notes section says "Nothing published yet — this is
  the queue" because none of the three articles are written.

---

## Completed Tasks This Phase
- Explored five design directions as a rendered mood board, chose one by reaction
- Extracted real content from `Downloads/Adewole_Habeeb_Resume.docx` (31 Jul 2026)
- Blended chosen direction with editorial typography (v1 → v2)
- Ran `/impeccable critique` — dual-agent, scored **17/32 (53%, Acceptable)**
- Rebuilt as v3 in the instrument register with hamzat.me page structure
- Closed every P0, P1 and P2 from the critique, plus all minor observations
- Verified in two batched browser rounds; detector clean (0 findings, exit 0) both passes

**Artifacts:**
- Mood board (5 directions): `claude.ai/code/artifact/afe38ab6-2f64-403b-a29f-de513aad2adc`
- v2 (superseded): `claude.ai/code/artifact/38efd82d-8d16-45d6-8e44-4db62a684e94`
- **v3 (current): `claude.ai/code/artifact/b3560150-4e9b-490d-abf9-954dc2777254`**
- Critique snapshot: `.impeccable/critique/2026-08-06T23-44-19Z__the-log-v2-html.md`

---

## Issues Found & Fixed

### From the critique (v2)
| Issue | Before | After |
|---|---|---|
| `--muted` contrast | 4.24:1 — 17 of 26 text roles failing AA | 5.53 light / 5.82 dark |
| `.label` specificity collision | Same class rendered 17px and 11px | Gone — no shared class across scopes |
| Category-interchangeable design | Generic editorial shell | Instrument register |
| Links indistinguishable from captions | Identical to static labels | Bordered controls at 3.06:1 |
| Touch targets | 17 of 25 under 24px | 0 under 44px |
| Filter system | 5 mixed-axis options, no feedback | Deleted; sections replace it |
| Tracked labels | 9px at 2.75:1 | No text under 11px |
| Spine continuity | Gaps of 49/26/25/8/2px | Rail replaced by section indices |
| "Newest at the top" | False — order ran 2026, 2025–26, 2026 | Claim removed |
| Reduced-motion | `*` doesn't match pseudo-elements | `*, *::before, *::after` |
| Print, theme control, skip link, landmarks, `mailto:` | All missing | All added |
| Dead links | 0 real | 9 real |

### Found during the v3 build (browser round, not the critique)
- **Gauges and comparison bars rendered as nothing.** `.gauge` and `.bar` were inline
  `<span>`s — `height` does not apply to inline elements. Fixed with `display:block`.
  *This is the trap to remember: a CSS bar chart made of spans silently renders zero-height.*
- `--mark-soft` was still 2.74:1 after a first correction pass. Now 3.57:1.
- `--rule` at 1.53:1 was doing double duty as a control boundary. Split out `--edge` at 3.06:1.
- The losing comparison bar was 1.68:1 against its track — invisible, which defeats the
  entire point of a comparison. Now 3.03:1.

### Correction to earlier project assumptions
⚠️ **The global `~/.claude/CLAUDE.md` Template A is out of date and will mislead future
sessions.** It describes VectoGen as the final year project, built on Stability AI and
Vectorizer.AI, at "Phase 4 of 5." Per the July 2026 resume:
- The final year project is **Tracer** (Bitcoin fraud detection), not VectoGen.
- VectoGen is a separate project, and the version the resume describes uses **no third-party
  AI APIs at all**.
- Location is **Abeokuta**, not Lagos. (Lagos was the Latex Fabrics *client's* location.)

---

## Blockers
Nothing blocking design. Three things block the *build*:
1. **Screenshots.** Tracer's dashboard and the Latex Fabrics wireframes both already exist
   and just need dropping in. VectoGen's needs the deploy first.
2. **VectoGen deploy.** Gate generation behind the existing Supabase auth and cap it per
   account before going public — Stability AI and Vectorizer.AI both bill per call, and
   Vectorizer runs on every generation.
3. **Missing facts:** the RF/GNN hybrid F1, and per-project repo URLs (all six currently
   point at the GitHub profile).

---

## Next Phase Preview
**Phase 4 — the VectoGen embed**, still blocked on the VectoGen deploy. If that stays
blocked, Phase 5 (write the three queued notes) is the one that moves without waiting on
anything, and it is the only section of the site currently admitting it is empty.

⚠️ The old preview here described a transaction network and a crosshair cursor. **Both were
dropped by his call in Phase 3. Do not re-propose them.**

## Last Session Date
2026-08-28 — checked the live site. Host had moved to GitHub Pages on `adebola.me` without
STATE.md knowing; meta URLs repointed, deploy and domain sections rewritten.
