# Design direction: “The Thread”

The written specification for the October 2026 light redesign, made from
`Mannu_Awwwards_Level_Redesign_Brief.md`. It replaces the earlier “Gift Box” draft, which was
planned against a different brief and never built. Figma frames that mirror this file live in
the Figma file `q9yLnsGHvtEou7haNE3Cw0` (see section 9 for what Figma was and was not used for).

## 1. Audit of the previous site

Baseline screenshots (1440×900, 820×1180, 390×844) were captured from the running dark build
before any change. The five biggest weaknesses:

1. **A dark navy page.** Paper text on `#080d16` everywhere; the brief requires a predominantly
   light site.
2. **No visual subject.** The constellation was faint 1px dots and hairlines; the first screen
   was a Bodoni wordmark and empty space.
3. **The signature did not tell the story.** The dots looked like a generic particle network and
   only drifted between sections.
4. **One layout, seven times.** Chapter numeral, Didone heading and a two-column split in every
   section; Certificates, Experience and Contact were mostly empty dark space.
5. **Mobile friction.** The hero actions fell under the fold and collided with the dev badge,
   giant serif stage titles in “How I learn” forced long scrolls, and an empty constellation band
   filled the top of the phone hero.

## 2. Reference analysis (inspected in a real browser, October 2026)

| | Lusion (about) | Neutomni (SOTD Oct 13) | Huy Phan vol. 2 (SOTD Oct 14) |
| --- | --- | --- | --- |
| First viewport | One sculptural particle mass above a viewport-wide outlined wordmark | The studio name as a full-bleed custom red wordmark; everything else is small | Giant red name with an illustrated figure physically pushing the letters |
| Layout and type | Huge wordmark, tiny UI, two pill controls | One display face at two extremes of scale; italic serif asides | Bold grotesk at poster scale, white page |
| What moves | The 3D mass reacts to pointer and scroll; text holds still | Colour-field cards stack while type stays put | The figure interacts with the type; type is the stage |
| Scroll | The scene changes state per section, scrubbed | Sections arrive as layered colour fields | Short, one idea per screen |
| Imagery / 3D | One bespoke scene carries the brand | Real photographs and product shots | One authored character, used sparingly |
| Transitions | Scene continuity links sections | Hard colour edges between fields | Cuts |
| Mobile | Same idea, simplified scene | Wordmark still spans the width; generous stacking | Type and figure rescale together |

Also inspected: Signal-A (mixed-width justified type block), Heron AI (light paper ground with
one illustrated object), Belgrade Arbor and FORMAT (both mostly dark, so used only for motion
pacing). Lusion’s home page opened with a percentage loader; the brief bans that, so the lesson
taken is the scene/type relationship, not the loading ritual.

Decisions taken from the research:

- The name at wordmark scale is the stage (Neutomni, Lusion), and the visual **interacts with the
  letters** instead of sitting beside them (Huy Phan).
- One bespoke 3D object carries the whole page and changes state with the story (Lusion).
- Colour arrives as full-bleed fields with hard edges, not as tints on cards (Neutomni).
- UI chrome stays small and quiet so the type and the object do the work.

## 3. Concept: curiosity becomes connection

One continuous **ribbon**, ultramarine on one face and citron on the other: discipline on one
side, curiosity on the other, one strip of material. It threads through Mannu’s name, loosens to
explore, is cut into parts, rejoined, organised into a knot, coiled into foundations, rests while
the evidence speaks, and finally closes into a loop beside the invitation to talk. Every state is
the same strip, so the page reads as one line of thought.

Rejected: a sphere/particle cloud (the generic orb), glazed toy blocks (the earlier draft; reads
as kindergarten rather than reasoning), and a node network (the old site’s constellation).

## 4. Tokens

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--paper` | `#F7F7F2` | page canvas | |
| `--white` | `#FFFFFF` | raised sheets (header, Experience) | |
| `--powder` | `#DCE7FF` | Curiosity field | |
| `--citron` | `#D6F36A` | ribbon reverse, Certificates field | ink 12.6:1 |
| `--ultra` | `#3657F5` | ribbon face, primary button, Contact field | on paper 5.1:1; white on it 5.5:1 |
| `--ultra-deep` | `#2442D6` | hover/pressed ultramarine, links | on paper 6.9:1 |
| `--coral` | `#FF806B` | graphics only: the ribbon piece that did not fit (“Try a solution”) | |
| `--ink` | `#20232B` | text | 14.6:1 on paper |
| `--ink-soft` | `#4A5161` | secondary text on any field | ≥6.4:1 on paper, powder, citron |
| `--muted` | `#626978` | tertiary text on paper/white only | 5.1:1 |
| `--mist` | `#E8EDFF` | secondary text on ultramarine | 4.7:1 |

- Shape rule: interactive elements are full pills (they echo the ribbon’s rounded ends); colour
  fields and sheets are square and full-bleed. Nothing else is rounded.
- Type: **Funnel Display** (variable 300–800) for display, **Funnel Sans** for text and UI,
  Geist Mono only for the one real line of C. Funnel’s tapering joins give the letters a drawn,
  slightly curious character without becoming a novelty face; the pair is not on any of the
  installed skills’ default lists.
- Scale (`clamp()`): name `min(32.5vw, 58svh)`; statement `clamp(2.6rem, 5.6vw, 5.75rem)`;
  heading `clamp(2.1rem, 3.9vw, 3.9rem)`; stage title `clamp(1.75rem, 2.6vw, 2.6rem)`; lede
  `clamp(1.2rem, 1.45vw, 1.45rem)`; body `1.0625rem/1.6`; small `0.875rem`. Display tracking
  `-0.035em`, leading 0.92–1.04; body measure 60–66ch.
- Spacing: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 176 px. Section padding
  `clamp(6rem, 13vh, 11rem)`; page gutter `clamp(1rem, 4vw, 3.5rem)`; 12-column grid, 24px gap.
- Motion: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0,
  0.175, 1)`; press 140ms, hover 200ms, UI ≤ 260ms; one orchestrated load sequence; scroll-scrubbed
  ribbon states with damping.

## 5. Layout map (desktop 1440 / phone 390)

1. **Opening (`#top`).** Desktop (1024 px and up, since the October 2026 hero pass, §10): a
   landing scene. A sky with a horizon (pearl warming to a bright horizon with a blush glow,
   powder haze high on the left, a cooler ground), the world around the ribbon (glass at three
   depths, motes, two orbits around the loop) and the cue in the right margin where the trail will
   run. The name, its label `BCA STUDENT · LOVELY PROFESSIONAL UNIVERSITY` (just above the
   name's first letter) and the ribbon weaving through the letters (alternately over and under
   them, its loop rising above the name) are the landing's (§11); the stage keeps them in the
   page for assistive technology only. There is no tagline and there are no actions in the
   opening, and the introduction paragraph is not repeated here (the label already says who and
   where; Curiosity carries the rest). Tablet and phone, unchanged apart from that: context, name
   at full width, introduction, all inside the first screen.
2. **Curiosity (`#about`, powder field).** Statement heading across nine columns; the ribbon
   wanders in a wide clearing at lower left and leans toward the pointer; the two paragraphs sit
   in a narrow column at lower right. Desktop with motion: the same composition fitted into one
   viewport on the opening's stage (§10). Phone: heading, ribbon clearing, paragraphs.
3. **How I learn (`#how-i-learn`, paper).** Heading with the introduction stacked under it. Then
   four stages scrolling in the right-hand column beside one sticky box on the left, where the
   ribbon transforms in place (numeral, title, line per stage). The stage on the reading line is
   active (ink and ultramarine), finished ones keep a filled numeral, upcoming ones are muted.
   Sticky, never pinned. Phone, tablet and no-script: each stage gets the ribbon above its text.
4. **Foundations (`#foundations`, paper).** Statement heading and introduction; the four
   foundations as courses of a wall (rule, name, note; the C course shows `#include <stdio.h>`)
   beside a four-turn coil, one turn per course. Real projects appear under the courses when
   added.
5. **Certificates (`#certificates`, citron field).** Statement and the two paragraphs at left; at
   right the ribbon is cut into forty-five short marks in a ledger: the record of time spent. When
   real certificates exist they list under the copy with verify links; otherwise nothing fake.
6. **Experience (`#experience`, white sheet).** Heading and introduction offset to the right; the
   ribbon runs out as one long strand toward the edge of the page. Real entries form a list under
   the strand; none are invented.
7. **Contact (`#contact`, ultramarine field).** Statement heading in white, invitation, real
   contact buttons only when configured, and the ribbon closed into a calm loop. The footer
   (sign-off, back to top) sits inside the field.

## 6. Sculpture states

| Slot | State | Form |
| --- | --- | --- |
| `#top` | possibility | Tail weaves through the name, ties a loop around the “u”; threads in on load |
| `#about` | exploration | Loose three-loop wander in depth; leans toward the pointer |
| Understand | look first | An open ring, ends apart |
| Break it down | parts | The ring cut into four arcs, pulled apart |
| Try a solution | attempt | The arcs joined as a staircase; one coral piece sits out of line |
| Learn from the result | connection | All pieces joined into a smooth closed trefoil |
| `#foundations` | structure | A four-turn coil |
| `#certificates` | focus | Forty-five short marks in a 9 × 5 ledger; no idle motion |
| `#experience` | focus | One long strand running out to the right; no idle motion |
| `#contact` | resolution | A single closed loop with one full twist, white and citron on ultramarine |

Mechanics: every state is a pure function `form(s, aspect)` in `src/components/sculpture/forms.ts`.
Each section holds a slot element; the ribbon is anchored to the slot of the section on stage and
glides to the next one between sections (morph staggered along the strip so it looks like it is
re-threading itself). The same functions draw the static SVG fallback on the server.

## 7. Fallbacks, accessibility, performance

- No JavaScript, no WebGL, or `prefers-reduced-motion`: each slot shows the same state as a still
  SVG drawn from the same form functions; no canvas is created and Lenis never starts. On desktop
  the opening keeps its sky (CSS) and its world as a still (`WorldSVG.tsx`, drawn from
  `scenery.ts`), and Curiosity follows it in the page; without WebGL but with motion the stage
  still holds and the two ribbon stills cross over as the ribbon would change.
- Three.js loads lazily after first paint; one draw call for the ribbon (one geometry, vertex colours, one
  physical material), one shadow-catcher plane on desktop only, pixel ratio capped (1.75 desktop,
  1.5 phone), fewer samples on phones, rendering paused when the tab is hidden or nothing changes.
  The shadow map and its catcher are skipped on frames where the shadow is invisible (forms
  without one, the middle of a transit), and the idle sway stops on the wall clock, so slow
  devices settle as quickly as fast ones.
  The passage's point field is a second draw call, updated and drawn only while it is visible.
- Lenis drives wheel smoothing only (touch stays native), shares GSAP’s ticker and ScrollTrigger,
  handles in-page anchors, and is skipped for reduced motion. `scroll-padding-top` keeps
  anchored headings clear of the fixed header.
- Text stays above the ribbon everywhere except the two hero letters it passes over, and the
  ribbon is never drawn behind words either: each drawn frame, the boxes of the text on screen
  become a clearance mask in the ribbon, shadow and point-field shaders (`clearance.ts`), with
  a soft edge of 14–26 px. Transits between slots (whose straight paths must cross the next
  heading) tuck under the words; resting forms sit clear of them and are unaffected.

## 8. Motion system (October 2026 scroll-experience pass, extended by the motion sprint)

One system, three tiers. Tokens live in `src/lib/motion.ts` (GSAP) and at the top of
`src/app/globals.css` (CSS); change timing there, not per component. Each section has one primary
motion idea and at most one supporting one, with pauses where the composition can be read.

| Tier | What | Easing | Duration |
| --- | --- | --- | --- |
| Narrative | the opening; the passage; the learning sequence; chapter domes; the trail; the final loop | `expo.out` entrances, `power2/3.inOut` moves, scroll-linked = linear scrub | 1.1–1.9 s, or the scroll |
| Typography | line masks, word masks, the lede, stage titles, the loop under a word, "Room to grow." | `expo.out`; scrubbed text follows the scroll | 0.9–1.4 s |
| Micro | pill turn, press, links, nav, course and certificate rows, menu sheet | `--ease-face` in, `--ease-out` out, `--ease-drawer` for the sheet | 140 ms press, 220 ms colour, 380 ms in / 240 ms out |

**Narrative moments**

On desktop, moments 1 and 2 below are replaced, after the load sequence, by the opening's stage
(§10); tablets and phones keep them as written.

1. *Opening* (`motion/intro.ts`, under 3 s, never blocks scrolling). Header settles; context line
   rises from its mask; the ribbon threads in from the left (`threadSignals.reveal`, driven by the
   opening's timeline) and each letter of the name rises exactly as the ribbon's tip reaches it
   (start times come from the `hero` form's geometry, the measured glyph positions and the
   inverted ribbon ease); the loop ties above the last letter; introduction; then the cue. The name waits for the 3D scene at most 0.65 s
   (`THREAD_READY`), so a slow device or no WebGL costs a fraction of a second. CSS failsafe as
   before. As the page leaves the opening, the name and context line rise faster than the page
   (parallax 1 of 3; the hero slot is `live`, so the ribbon follows the name), and the cue's line
   fills with the scroll and hands over to the trail.
2. *The passage* (`sculpture/passage.ts` + `scene.ts`). A few points appear, then the field; the
   flight gathers speed (near points stretch into radial streaks toward the edges of the view and
   blur out of focus, far ones stay fine) and slows as the points spiral onto the ribbon, come
   into focus on it and are absorbed while the ribbon brightens briefly (emissive). A pale
   ultramarine vignette (`.passage-veil`) deepens around the view during the flight and clears;
   the theme stays light. Still a pure function of scroll progress: scrolling back replays it in
   reverse, and nothing is left stranded (parallax/depth 2 of 3).
3. *How I learn* (`Method.tsx`, `controller.ts`, `motion/stages.ts`). Numbers sit on a rail; its
   fill is scrubbed piecewise so it reaches each number exactly when that stage becomes current,
   the same line the ribbon uses, so rail, numbers, words and ribbon never desynchronise, and
   scrolling up draws it back. Each stage's number comes into focus, its title rises from a mask,
   then its sentence (once, `data-reveal="stage"`). The forms are as before; when the knot closes
   it turns once while swelling slightly and settling (scale 1 → 1.05 → 1), the last number rings
   out once in citron, and the last title gets its citron stroke. Nothing is pinned.
4. *Continuity*. The trail (`Trail.tsx`, `motion/trail.ts`) is a hairline in the right margin,
   drawn with the scroll, with a knot where each chapter arrives under the header; at Contact it
   turns light and its end closes into a small loop over the last stretch of the page, as the
   ribbon closes its own loop. Each colour change is a dome (`.rise`): the next colour swells up
   into the end of the previous section and settles flat with the scroll (paper over powder,
   citron, white, ultramarine), replacing the hard bands and the old inset field reveal.
   Experience's heading drifts against its strand (parallax 3 of 3).

**Section beats** (`motion/reveals.ts`, declared in markup, built in page order; typography pass,
October 2026). Every section's text has a deliberate treatment, but they differ by role, so the
page never reads as one preset:

| Element | Treatment | Trigger | Timing | Why |
| --- | --- | --- | --- | --- |
| Hero name | characters rise as the ribbon tip reaches each (unchanged, 3° lean) | opening timeline | 1.3 s `expo.out`, started from ribbon geometry | the one place letters move |
| Hero introduction | two or three groups of lines, small rise + clear | +0.3 s after the name | 0.75 s `power3.out`, 160 ms between groups | readable, never typed out |
| Chapter marks (01–06) | rule draws, number and name rise from masks | `top 90%` | 0.7 s / 0.9 s | an index that leads the heading: label, heading, text |
| Curiosity statement | lines lift 65 % through masks while clearing, then run straight on: "questions." turns ultramarine, the split reverts and the thread draws | `top 84%` | 1.1 s lines, 120 ms stagger; colour at +0.46 s; thread from +0.79 s, 1.1 s `sine.inOut` | one continuous gesture, not two effects |
| How I learn heading | lines rise from masks; words then fill slate → ink with the scroll, "starting point." → ultramarine | entrance `top 84%`; fill scrubbed `top 80%`→`bottom 48%` | scrub = scroll | the one scroll-linked statement; drains back on scroll up |
| Stages | number wipes up inside its ring, title rises word by word, sentence follows in one calm step | `top 76%` | 0.6 s / 0.85 s, 70 ms / 0.75 s | state (current/done, rail, ribbon form) stays on the shared centre line |
| Foundations heading | "Strong foundations." rises by lines; "Room to grow." a beat later word by word inside its line, then eases apart with the scroll (`--grow`) | `top 84%` | 1.0 s, words 90 ms | two blocks moving into alignment |
| Courses (and future certificate / experience rows) | knot appears, rule draws out of it, label rises from a mask, details follow; the course's turn of the coil lifts | batch `top 88%` | knot 0.4 s, rule 1.1 s, label 0.9 s | reading order: rule, label, coil |
| Certificates heading | plain masked line rise | `top 84%` | 1.0 s, 90 ms | the ledger carries the moment: its 45 marks now arrive in five row waves (`forms.ts` `order`) |
| Experience heading | left-to-right wipe (clip widened so descenders and the full stop are never cut) | `top 84%` | 1.3 s | follows the strand's direction |
| Contact heading | opening lines rise together, the last line later and slower, "conversation." settles into citron | `top 80%` | 0.9 s, last line 1.5 s | the final beat, resolving with the loop |
| Paragraphs (all sections) | the same line-group reveal as the hero introduction, delayed so the eye moves down | `top 84%` + delay | 0.75 s | calm, readable |

**Typography rules**: SplitText with `autoSplit` + `onSplit` (re-splits on font load and resize,
animation returned for clean-up), reverted to plain text after each entrance; only How I learn's
heading stays split while its fill is scroll-linked. Use the least granular split: lines for
headings and paragraphs, stage titles and "Room to grow.", characters
only for the name. Headings use `aria: "auto"` (labelled heading, hidden pieces); paragraphs use
`aria: "none"` (lines, never characters, so they read as whole words). Masks carry
`.split-line-mask` / `.split-word-mask` room below for descenders (bottom-only, so stacked masks
cannot add height). Resting colours (`.em`, `.tint`) are the CSS default, so reduced motion and
no-script show the final state; motion only holds them at `data-mark="pending"` until they land.

**Micro-interactions** (CSS): pills (`PillLabel.tsx`) set their label on both faces; hover turns
the other face up behind a domed mask, its words surfacing with it, so the label reads whole at
every frame; it leaves faster, holding the words still. Keyboard focus shows the turned face at once
plus the ring. Touch screens show the face while a finger is down (with a passive `touchstart`
listener so iOS applies `:active`). Press scales to 0.97. The current-section Contact pill turns
citron. Links redraw their underline and lean their arrow; nav underlines draw in and out; the
phone menu drops as a sheet and its entries rise 30 ms apart. Hover motion is gated to fine
pointers. CSS transitions use `scale` / `translate`, never `transform` or `opacity` on anything GSAP
animates (they would fight and make entrances lag).

**Reduced motion**: no canvas, no Lenis, no entrances, no scrubbed scenery (domes stay flat, the
underline loop is simply drawn); faces crossfade; the trail, the rail and stage states remain.

**Robustness**: a debounced `ResizeObserver` refreshes ScrollTrigger when the page height changes
without a window resize (the certificate archive, a viewport whose height settles after its
width), so triggers, the rail and the trail stay exact.

**How to change it**: timing → `src/lib/motion.ts` and the `--t-*`/`--ease-*` tokens; which
elements reveal and how → their `data-reveal`; a colour change → a `.rise` at the end of the
section before it; a ribbon state → its function in `forms.ts` (add a test in `forms.test.ts`);
the passage → `passage.ts` (tested) and the dust shaders in `scene.ts`.

## 9. Figma

Connected through the official Figma MCP server (account on a Starter plan with a View seat, which
Figma limits to a small monthly number of MCP calls). Used for: colour and spacing variables, text
styles, and four reference frames (desktop and phone opening; desktop learning sequence and
contact). The 3D ribbon cannot exist as native layers; frames show its silhouette as a flat
two-tone vector.

## 10. The opening's stage (desktop hero → introduction, October 2026)

Made from `Mannu_Organimo_Inspired_Hero_Introduction_Prompt.md`, after inspecting organimo.com in a
real browser (opening and the scroll states after it). What was taken is the experience pattern,
not anything visible: a full-bleed real-time scene with the statement layered into it, forms at
several depths around one focal object, and a first scroll that moves the view *through* the
scene while the words change in place, instead of the page sliding the next block up. Organimo's
sea, rocks, objects, copy and layout are not used; the world here is original and procedural.

**Structure.** `sections/Opening.tsx` wraps the opening and Curiosity in one stage. With motion,
at 1024 px wide and 600 px tall and up (`STAGE` in `src/lib/stage.ts`, mirrored in
`globals.css`), the stage is sticky inside a wrapper one viewport plus `--opening-run` (100vh)
tall (`--rest-run` is 0: the landing's name has already gone, so a rest would show an empty sky):
it holds for one viewport of ordinary, native scrolling, then is released and
"How I learn" follows. Above it, the desktop landing (§11) scrolls away as an ordinary section. Both sections lie on it, one over the other. The ribbon's canvas is
rendered inside the stage, because a sticky box is a layer of its own and the name's letters
must still pass over and under the ribbon; being fixed, the canvas covers the view the same way
wherever it sits. Nothing else is pinned; the landing above has its own small canvas (§11).

**One progress value.** A ScrollTrigger on the wrapper measures the stuck stretch (again after
fonts and on every resize); `motion/opening.ts` eases it once (≈ 110 ms) into `p ∈ [0, 1]`,
applies it to one paused timeline for the words, the sky and the stills, and publishes it as
`threadSignals.opening`, which the ribbon controller and the world read on the same frame. The
beats live in `sculpture/scenery.ts` (`OPENING`) and are unit-tested:

| p | What happens |
| --- | --- |
| 0 | The stage has just stuck; the ribbon, carried off the landing's name as the stage rose (`carried()` in the controller: it drifts to the middle of the view instead of scrolling away), is already crossing the sky |
| 0–0.72 | The view travels: the world comes toward the viewer, slides and turns (`cameraAt`); near glass passes out of frame, far glass grows into place above the writing; the CSS sky swells toward its horizon |
| 0–0.60 | The sky turns from pearl and blush to Curiosity's powder in one broad cross-fade (no band edge) |
| 0–0.60 | The ribbon changes from the opening's form to Curiosity's (the existing state system and its re-threading stagger), from mid-view to the lower-left clearing |
| 0.30–0.50 | Curiosity's label (rule, number, name), then the statement line by line out of masks |
| 0.48–0.58 | "questions." turns ultramarine and its thread is drawn |
| 0.42–0.70 | The lede, then the paragraph, each in two or three groups of lines (never letters) |
| 0.84–1 | Settled; the paper of "How I learn" swells into the bottom of the stage, then flattens as the stage leaves |

Links to `#about` (the hero's first action, the nav, the menu, an address with the hash) land on
`p = 0.76`, links to `#top` on `p = 0`; the header names the opening, then About, from `p = 0.3`,
shows its small wordmark once the name has gone, and turns into its solid bar only when the stage
is released. The layer whose words are out of play is `data-dormant` (no pointer, no clearance).

**The world** (`sculpture/world.ts`, layout in `scenery.ts`): three clear glass spheres (a
thin-film rim from powder through blush, a crisp highlight, a soft caustic; no textures). Six
extra draw calls, only while the stage is on screen, all inside the clearance mask and clipped to
the stage's lower edge as it leaves; while the stage is still rising into view under the landing
the world rises with it (the stage's own box gives the shift), and while the stage is wholly below
the landing the ribbon's canvas draws nothing. On the stage the glass carries the travel, so the
passage's point field (`passage.ts`) is kept for small screens only. Measured on the laptop AMD GPU at 1440×900: 60 fps average through the stage,
p95 frame 16.7 ms.

## 11. The landing (desktop hero, October 2026)

Made from `Mannu_Landing_Step_1_Abstract_Hero.md` (step 1 of 3), in the chosen Lumina-inspired
direction: one full view before the opening, of original abstract liquid glass on a light field,
with the name set as HTML in front of it, its label just above, and a quiet "Scroll to explore" cue. It
replaces the earlier bubble landing and its fly-through. Steps 2 (changing slides) and 3 (the scene
turning into the ribbon on scroll) are not built: the visitor simply scrolls from the landing into
the opening, which sits directly below it in the page.

**Structure.** `sections/Landing.tsx` is an ordinary section before `sections/Opening.tsx`, at
1024 px and up only (small screens open on the name as before). It lies over the opening's stage
and the ribbon's fixed canvas (z-index, opaque paper), and its lower edge reflects the top of the
opening's sky into itself and fades out (`.landing::after`, sharing `--sky-horizon` with
`.sky-landing`), so the two meet without a seam as the stage rises into view. Its words repeat the
opening's h1 and label, which follow at once, so the landing is `aria-hidden`.

**The scene** (`components/glass`): its own small Three.js renderer, on the same `three` chunk the
ribbon loads, started after hydration and only where the landing shows. The ground is one quad
painting the field: a pearl-to-pale base, soft pools (powder, an ultramarine pool behind the large
form, a citron glow behind the near drop, a white source where the name stands) and two faint bands
of light. Five forms of glass (one large behind the name, a near drop cut by the lower-left edge, a
pebble, a bead and a seed at other depths) are spheres whose surfaces swell slowly (simplex noise in
the vertex shader). Each is drawn opaque: its fragment shader evaluates the same field where the
glass bends the view (a thick lens, magnified and turned over toward the rim, the three colours bent
slightly differently), gathers the bands more strongly than the page shows them, soaks up a little
tint where it is thick, darkens in a ring toward the rim, and adds a pale studio's reflections (key,
softbox, rim light, a cool horizon band that gives the edge on a light page). Six draw calls a frame,
no textures or render targets. Composition, field and motion are data in `glass/layout.ts`
(unit-tested) and placed by share of the view, so the composition holds on any screen shape.

**Motion.** Forms settle into place as the scene fades in over the field, then drift on two unequal
swings per axis (11–23 s periods), turn slowly and swell; the field's pools and bands wander a
little. The words arrive with the page (`motion/intro.ts`): the label out of its mask, then the
letters, then the cue. Scrolling away, the cue steps back first and the words lag a
little behind the glass and fade before they reach the header (scrubbed; `setupLandingFlow` in
`motion/opening.ts`). The name's entrance in the opening plays once the opening's top passes 30%
of the view and steps back only when it falls below 55% on the way up.

**Performance and fallbacks.** The scene draws on GSAP's ticker only while the landing is on screen
and the tab is visible, at half rate after 12 s without input. Reduced motion draws one still frame
(`STILL_T`). Without WebGL 2 or JavaScript, `GlassStill.tsx` (an SVG drawn from the same layout)
is the picture; with motion, only its field shows until the scene's first frame. Measured on the
laptop AMD GPU in headless Chromium at 1440×900: 60 fps (median and p95 frame 16.7 ms) at device
pixel ratio 1 and 2 (the canvas is capped at 1.5).
