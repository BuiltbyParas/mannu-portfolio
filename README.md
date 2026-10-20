# Mannu, portfolio

A single-page portfolio for Mannu, a first-year BCA student at Lovely Professional University.
The guiding idea: **curiosity becomes connection.** One two-tone ribbon (ultramarine on one face,
citron on the other) travels through the whole page and changes shape with the story. The full
design specification is in [`docs/design-direction.md`](docs/design-direction.md).

| Section           | Ribbon                                                                              |
| ----------------- | ----------------------------------------------------------------------------------- |
| Opening           | threads in through the letters of the name, ties a loop around the u                |
| (passage)         | a flight through fine points that gather onto the ribbon as it loosens              |
| Curiosity         | loosens into three loops and leans toward the pointer                               |
| How I learn       | in one sticky box: open ring, four parts, steps with one coral piece, a knot (turns once) |
| Foundations       | a four-turn coil that winds with the scroll; hovering a foundation lifts its turn   |
| Certificates      | cut into a ledger of marks, one arriving after another; the pointer turns them aside |
| Experience        | one long strand running out to the edge of the page                                 |
| Contact           | a single closed loop                                                                |

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Checks: `npm run lint`, `npm run typecheck`, `npm test` (content-publishing rules and the ribbon
geometry, Node's built-in runner).

## Editing the content

**Everything a visitor reads is in [`src/content/site.ts`](src/content/site.ts).** Components never
hold copy or links of their own.

- **Contact links**: set `contact.whatsappUrl` (e.g. `https://wa.me/<country code><number>`) and
  `contact.instagramUrl` (e.g. `https://www.instagram.com/<username>/`). Each button appears only
  once its link is set and valid; with neither set, the contact section shows its invitation
  without buttons.
- **Certificates**: replace the blank entries in `certificates`. An entry is shown once it has a
  `title` and an `issuer`. Add `url` for an official verification page, or put an authentic scan in
  `public/certificates/` and reference it as `image: "/certificates/name.jpg"`. Up to four entries
  are listed (featured first); the rest sit behind a “Show more” control.
- **Experience**: fill in `experience`. An entry is shown once it has a `role` and an
  `organization`; dates, summary and link are optional and never invented.
- **Projects**: fill in `projects`. A project is shown (under Foundations) once it has a `title`
  and a `summary`.
- `approximateCertificateCount` drives the “around 45” copy and the number of marks in the ledger.

Incomplete entries are filtered out by [`src/content/publish.ts`](src/content/publish.ts), which
also rejects anything that is not an `https://` link.

## How it’s built

- **Next.js 16** (App Router, statically prerendered), **React 19**, **TypeScript**, plain CSS with
  tokens in [`src/app/globals.css`](src/app/globals.css) (Tailwind 4 supplies the reset).
- **Three.js** draws the ribbon: one mesh, vertex colours, a physical material with a studio
  environment, and a shadow-catching plane on large screens. It loads lazily after the page.
- **GSAP + ScrollTrigger + SplitText** for the opening, the scrubbed scenery (chapter domes, the
  trail, parallax), the section reveals and the stage state (`src/components/motion/`); **Lenis**
  smooths wheel scrolling on mouse/trackpad devices and shares GSAP's ticker. CSS transitions
  handle hover, focus and press (on `scale` / `translate`, never on a property GSAP animates).
- **Type:** Funnel Display (display), Funnel Sans (text and interface), Geist Mono (only the line
  of C).
- **Colour:** porcelain `#f7f7f2`, white, powder `#dce7ff`, citron `#d6f36a`, ultramarine
  `#3657f5`, coral `#ff806b` (ribbon only), ink `#20232b`.

```
src/
  app/                       layout (fonts, boot script), page, globals.css, icon
  content/site.ts            ← all copy, links and entries
  content/publish.ts         what is complete enough to show (+ tests)
  lib/gsap.ts, lib/lenis.ts  shared GSAP/Lenis setup
  lib/motion.ts              motion tokens: easing, durations, staggers
  components/
    motion/
      Choreography.tsx       mounts the whole motion system once (one GSAP context)
      intro.ts               the opening: letters rise as the ribbon's tip reaches them
      scenes.ts              scrubbed scenery: hero exit, cue, passage veil, chapter domes, parallax
      reveals.ts             data-reveal entrances, built in page order
      stages.ts              which "How I learn" stage is current (data-step) + the rail
      trail.ts               the progress trail in the right margin
      split.ts               SplitText aria choice (headings labelled, paragraphs left readable)
    sculpture/
      forms.ts               the ribbon's states as pure functions (+ tests)
      strip.ts               blends states into a drawable strip (shared by WebGL and SVG)
      RibbonSVG.tsx          the still version of a state, rendered on the server
      Slot.tsx               a place on the page where the ribbon rests
      passage.ts             the point-field flight into Curiosity, as pure math (+ tests)
      scene.ts               the Three.js renderer (ribbon + point field)
      controller.ts          scroll position → state, pointer lean, render on demand
      clearance.ts           keeps the ribbon off the words: text boxes → shader mask (+ tests)
      signals.ts             values the page hands the ribbon (hovered turn, reveal, ready)
      Sculpture.tsx          the fixed canvas; lazy-loads the scene
    sections/                Hero, About, Method, Foundations, Certificates, Experience, Contact
    SiteHeader.tsx           nav with current section, field-coloured bar, mobile menu dialog
    SmoothScroll.tsx         Lenis setup
    PillLabel.tsx            a pill's label on both faces (the hover/focus/press turn)
    Trail.tsx                the trail's markup (a knot per chapter, a loop for Contact)
```

### Motion and accessibility notes

The full motion specification (levels, easing, durations, every signature moment) is in
[`docs/design-direction.md` §8](docs/design-direction.md). In short:

- **Change timing** in `src/lib/motion.ts` and the `--t-*` / `--ease-*` tokens in `globals.css`.
- **Make something reveal** by giving it `data-reveal="lines" | "words" | "wipe" | "lede" | "fade"`
  (add `data-reveal-children` to stagger its children, `data-reveal-delay="0.2"` to wait), or
  `data-reveal="ruled"` on a list whose items each hold a `<span class="rule">`. A heading
  containing `<span class="em">` gets its loop drawn once it lands.
- **Colour changes between sections**: put `<div class="rise rise-<colour>">` as the last child of
  the section *before* the change (`paper`, `citron`, `white`, `ultra`); it swells up as a dome
  and settles flat with the scroll. Fields themselves are `<div class="field">` in a
  `.field-section` with `--field` set.
- **Header colour** follows `data-tone` zones (`powder`, `citron`, `white`, `ultra`).
- Native scrolling throughout: nothing is pinned or snapped; "How I learn" uses `position:
  sticky` on large screens only; touch scrolling is untouched.
- `prefers-reduced-motion: reduce`, no WebGL, or no JavaScript: no canvas is created, Lenis never
  starts, entrances do not run, and every slot shows the same state as a still SVG drawn from
  the same geometry (the sticky box crossfades between the four stage drawings).
- The ribbon is never drawn over words (except the two letters of the name it passes under, on
  purpose). Resting forms are laid out clear of the text; in transit, `sculpture/clearance.ts`
  hands the scene the boxes of the text on screen each frame, and the ribbon, its shadow and the
  passage points fade out over a short soft edge around them, so a strip crossing to the next
  section tucks under the words instead of running behind them. A text block inside `.content`
  (or the footer) is covered automatically; the opening's name is deliberately not `.content`.
- The opening hides its entrance elements only after an inline boot script confirms motion is
  allowed, and a CSS failsafe reveals everything after about three seconds regardless. Every
  other entrance applies its start state from script, so if scripts fail nothing is hidden.
- Performance (October 2026, re-measured after the motion sprint): headless Chromium on the
  development laptop's integrated GPU (AMD Radeon, Ryzen 3 7330U; confirmed via the WebGL
  renderer string), wheel-scrolling the whole production build with Lenis: 1440 × 900 at 1×
  median and p95 16.7 ms (2 of 530 frames over 33 ms on the way down), 390 × 844 at 2× median and
  p99 16.8 ms with none over 20 ms; no long tasks, cumulative layout shift 0, and no drawing at
  all once the idle sway settles. Real phones and other GPUs have not been measured; software
  WebGL (SwiftShader) is not a guide.
