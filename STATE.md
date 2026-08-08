# STATE.md — Portfolio (`_this_me`)

## Project Overview
Personal portfolio site for **Adewole Habeeb Adebola** — final-year Computer Science,
Crescent University Abeokuta, graduating 2026. Not built yet: the design direction is
locked and a working mockup exists, but no production code has been written.

**Two audiences, both decided:**
1. **Recruiters / hiring managers** — skimming ~20 seconds. Stack visible, CV one click away.
2. **Freelance clients** — non-technical. Need outcomes and live things to click, not F1 scores.

## Phase Progress
- [x] Phase 1: Design direction — register, structure, content locked
- [ ] Phase 2: Build & ship v1  ← **YOU ARE HERE** (PLAN done, EXECUTE next)
- [ ] Phase 3: Transaction network + command palette + cursor readout
- [ ] Phase 4: VectoGen embed (blocked on the VectoGen deploy)
- [ ] Phase 5: Write the three queued notes

## Current Phase Goal
**Ship a live portfolio at a real URL within one week**, built as a Vite + React + TypeScript
app so the site is itself evidence of frontend ability.

Plan: `.plans/phase-2-plan.md` — 11 tasks across 4 sessions, max 3 per session.
Next action: **Session 3.5 — record the previews**, then Session 4 (meta/OG, deploy).

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
- **Cursor work, if any, is a crosshair readout over the charts** — value under the pointer,
  like a chart inspector. Not a cursor that follows the mouse. Prototype it with the network
  graph in Phase 3, not before.

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
- **Mono is the display voice** (Consolas / SF Mono / DejaVu Sans Mono). Chosen partly
  because the previous serif (Constantia) collapsed to Georgia off-Windows and reflowed
  the headline. Mono is load-bearing here — data and measurement — never a costume.
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
- **Latex Fabrics is labelled design work, not a shipped product.** It was scoping and
  design only — brand doc, PRD, FRD, design system, wireframes. Nothing was built.
- **Left off the site deliberately:** phone number (public page), "References available on
  request," and the resume's Personal Skills list. A page whose whole argument is
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
**Phase 3 — the transaction network.** Once v1 is live, build the interactive 2-hop payment
graph on the Tracer entry. It's the strongest frontend evidence available — his own work,
genuinely hard, visually unmistakable — and it's the right place to prototype the crosshair
cursor readout. Command palette slots in alongside it as the cheap win.

## Last Session Date
2026-08-07
