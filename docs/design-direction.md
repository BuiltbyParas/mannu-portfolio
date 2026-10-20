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

1. **Opening (`#top`, paper).** Context line top-left. The name spans the full width; its letters
   alternate above and below the ribbon layer, so the ribbon weaves over and under them and ties
   a loop around the final “u”. Below: tagline (display, two lines) at left; introduction and the
   two actions at right. Phone: context, name at full width, tagline, introduction, actions,
   all inside the first screen.
2. **Curiosity (`#about`, powder field).** Statement heading across nine columns; the ribbon
   wanders in a wide clearing at lower left and leans toward the pointer; the two paragraphs sit
   in a narrow column at lower right. Phone: heading, ribbon clearing, paragraphs.
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
  SVG drawn from the same form functions; no canvas is created and Lenis never starts.
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

1. *Opening* (`motion/intro.ts`, under 3 s, never blocks scrolling). Header settles; context line
   rises from its mask; the ribbon threads in from the left (`threadSignals.reveal`, driven by the
   opening's timeline) and each letter of the name rises exactly as the ribbon's tip reaches it
   (start times come from the `hero` form's geometry, the measured glyph positions and the
   inverted ribbon ease); the loop ties above the last letter; tagline line by line; introduction;
   the two actions last; then the cue. The name waits for the 3D scene at most 0.65 s
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

**Section beats** (`motion/reveals.ts`, declared in markup, built in page order): Curiosity rises
word by word, then a thread is drawn under its last word and ties a loop hanging below it; its lede
arrives line by line, the rest later. Foundations' heading rises by lines and "Room to grow." eases
apart as it rises (`--grow`, scrubbed); each course draws its rule, then its words, and lifts its
own turn of the coil as it arrives. Certificates keep the 45-mark tally (now tipping slightly
toward the pointer for depth, marks still turning aside near it); real certificate rows draw their
rules and take a hover/focus rule. Experience uncovers left to right; real entries draw their rules.
Contact rises by lines, then rests.

**Typography rules**: SplitText with `autoSplit` + `onSplit` (re-splits on font load and resize,
animation returned for clean-up), reverted to plain text after each entrance. Headings use
`aria: "auto"` (labelled heading, hidden pieces); paragraphs use `aria: "none"` (split into lines
or words, never characters, so they read as whole words). Masks carry `.split-line-mask` /
`.split-word-mask` room below for descenders (bottom-only, so stacked masks cannot add height);
measured: every glyph clears its mask at 1440, 820 and 390. Characters move only in the opening.

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
