# Mannu Portfolio — Cinematic Motion & Visual Enrichment Sprint

## Mission

Enhance the existing Mannu portfolio so scrolling feels rewarding, expressive, and cinematic. The current light theme, colour palette, typography, section structure, and 3D ribbon concept are already approved. **This is a focused animation and visual-enrichment sprint, not a redesign from scratch.**

The live local site is expected to run at `http://localhost:3000/#top`, but inspect the actual code and active development server rather than assuming the URL or implementation is unchanged.

The desired feeling is that each scroll reveals a new part of one continuous visual story, inspired by the craft and pacing of high-end interactive portfolios such as Lusion. Study the reference for principles—visual anticipation, scroll-linked motion, transitions, depth, pacing, and moments of surprise—not for copied layouts, text, 3D assets, video, or branding.

## What must stay

- Preserve the current predominantly light visual theme, including the powder blue, white, citron/yellow, ultramarine, and existing coral accent where already used.
- Preserve the existing 3D ribbon concept, geometry work, visual identity, content, and functioning layout unless a specific bug requires a small fix.
- Keep the current Next.js + React + plain Three.js architecture. **Do not migrate to Vue/Vite.** The goal is better motion, not a framework rewrite.
- Retain Lenis if it is already integrated correctly, and keep GSAP + ScrollTrigger as the main scroll-animation system.
- Keep the website naturally scrollable. Do not hijack wheel/touch input, force horizontal scrolling, or add long pinned sections everywhere.
- Keep the existing text and real data. Do not invent projects, certificate titles, experience, achievements, employers, or contact links.
- Keep all sections useful with reduced motion, no WebGL, and JavaScript disabled where the current fallback supports it.
- Do not commit, push, publish, or overwrite the existing backup.

## First: inspect the real implementation

1. Inspect the project structure, the current running site, package scripts, GSAP/ScrollTrigger/Lenis versions, current ribbon implementation, existing motion utilities, content configuration, and installed agent skills.
2. Read the current animation code and `src/lib/motion.ts` plus the relevant tokens in `globals.css` if they still exist. Inspect current documentation before changing architecture.
3. Capture baseline browser screenshots at desktop (`1440 × 900`), tablet (`820 × 1180`), and mobile (`390 × 844`). Capture the hero, at least one mid-page position, every major section transition, and the contact ending. Record what currently happens while scrolling both down and up.
4. Run the installed design/motion skills if available: Taste (`design-taste-frontend`), Anthropic Frontend Design, Impeccable, and Emil Kowalski's `emil-design-eng`. Use animation-specific skills such as `improve-animations`, `find-animation-opportunities`, `animate`, and `review-animations` if present. The user should not need to start an optional audit manually: apply the available written guidance yourself if a skill cannot be invoked as a sub-agent.
5. If an essential skill is genuinely missing, inspect its official repository and install only that missing skill. Check repository instructions and installation commands first. Do not reinstall skills that are already present and working.
6. Briefly list the most important opportunities, then continue into implementation without asking for approval.

Useful official references:
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- Emil Kowalski's skills: https://github.com/emilkowalski/skills
- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Lenis: https://github.com/darkroomengineering/lenis
- React Three Fiber performance notes (use only if relevant; this project currently uses plain Three.js): https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx

## Motion philosophy

The current site already contains significant animation work. The missing quality should not be addressed by making every element move at once. Improve **choreography, contrast, pacing, transitions, and visual payoffs**.

Use a tiered motion system:

- **Tier 1 — narrative motion:** hero entrance, ribbon state changes, the space interlude, the four-step learning sequence, and section-to-section transitions.
- **Tier 2 — typography:** masked line/word reveals, restrained stagger, underlines drawing on, and selected text responding to scroll.
- **Tier 3 — micro-interactions:** button label rolls, links, navigation, skill hover, certificate-mark response, and menu interaction.

Not every element needs all three tiers. Give each section one primary motion idea and at most one supporting visual idea. Include occasional pauses where the eye can appreciate the composition. Avoid constant motion for its own sake.

Prefer animating `transform` and `opacity`; use clip-path, masks, SVG strokes, and colour changes selectively. Avoid expensive layout animation (`width`, `height`, `top`, `left`, `margin`) for repeated motion where a transform can achieve the same result.

## Section-by-section execution brief

### 1. Hero — turn the first viewport into an event

Keep the existing ribbon weaving through “Mannu”; improve timing and text/shape coordination rather than replacing the concept.

- Create a composed entrance: header settles; name reveals with a carefully paced line/word or letter animation; ribbon arrives in sync with selected letters; tagline and supporting copy follow; CTA buttons enter last.
- Avoid a slow intro that blocks access to the website. The entire hero should be readable and usable immediately if GSAP fails or reduced motion is enabled.
- Add a small, refined scroll cue that responds to actual scroll progress and fades away once the visitor starts scrolling.
- Give the two primary actions crafted hover, pressed, and keyboard-focus states: a restrained label roll or mask reveal, a subtle colour-face shift, and tactile press feedback. Ensure the label can never become temporarily invisible.
- Add a little spatial depth and asymmetry to the hero visual without compromising readability.
- At mobile widths, keep the ribbon proportional to the title and never allow it to cover letters or controls.

### 2. A continuous thread across the whole page

The ribbon should feel like a companion guiding the visitor through the story, not a separate animation restarting in every section.

- Add a subtle visual progress cue using the existing ribbon or an SVG thread. Its progress should correspond to the visitor's position in the page and carry through to the ending.
- Use ScrollTrigger-linked state changes so the ribbon's state and nearby narrative change together. Scrolling backwards should reverse the same choreography naturally.
- Create deliberate transitions between powder-blue, white, citron, and ultramarine areas. Replace abrupt colour-band boundaries with a controlled reveal, mask, curved/organic edge, or overlapping visual transition where it fits the existing composition. Keep section boundaries clear; do not cover text.
- Add light parallax at two or three well-chosen moments, not everywhere. Any pointer movement must be subtle, optional, and disabled on touch/reduced-motion contexts.
- Do not add a second competing global progress line if the ribbon already communicates progress clearly.

### 3. Cosmic interlude — a cinematic visual reward

The existing space-inspired moment should feel like a short, art-directed transition—not a generic star-particle demo.

- Build an original interstellar-inspired moment using the existing Three.js ribbon and lightweight points, curves, depth, and lighting. It may evoke scale, distance, and motion through space, but must not copy a scene, shot, soundtrack, logo, or visual asset from *Interstellar* or another copyrighted work.
- Coordinate scroll progress with the visual: sparse points emerge, depth increases as the visitor moves forward, the points converge toward the ribbon, and the scene resolves cleanly into the next section.
- Make the sequence scrubbed/reversible where appropriate, so moving up the page does not leave particles or visual states stranded.
- Use the current light palette as the base. A short deep/space-like moment can create contrast only if it remains consistent with the approved light direction and transitions back gracefully; do not redesign the website into a dark theme.
- Add visual depth through layered scales and controlled movement, not huge quantities of particles, heavy post-processing, or a huge looping video.
- If a real video is used at all, it must be original or properly licensed, optimised, muted by default, respectful of reduced motion, and backed by a static fallback. Prefer the current procedural Three.js approach unless video gives a clear and measured benefit.

### 4. Curiosity — expressive typography

- Use an intentional text reveal for the heading, preferably line- or word-based clipping with restrained stagger rather than every character bouncing independently.
- Let a selected word or phrase receive a drawn underline, colour shift, or subtle emphasis that connects to the ribbon's path.
- Reveal the body copy in a separate, slower stage so users can read it comfortably.
- Consider one supporting abstract visual (for example, a few connected marks, a small diagram, or a ribbon loop) that builds on the same visual language. Do not add a decorative illustration that feels unrelated.

### 5. How I Learn — the main interaction payoff

Preserve the existing four-stage learning sequence and the ribbon states already implemented.

- Tie stage copy and visual states to the same ScrollTrigger progress so they never become desynchronised.
- As each stage approaches the reading position, reveal its title and copy with a clear mask/line entrance. Bring the stage marker into focus, draw or brighten its connection, and transform the ribbon in parallel.
- Use noticeably different states for Understand, Break it down, Try a solution, and Learn from the result. The final closed knot should feel like a clear payoff, with a short settle/turn and a final underline or line-draw accent.
- Provide a short transition from one state to the next so the progression feels continuous—not four cards switching abruptly.
- Keep the current desktop sticky composition only if it remains comfortable. Do not pin the full section for excessive time. Tablet and phone should keep natural scrolling and a readable order.
- Scroll-up must reverse the visual sequence cleanly.

### 6. Strong foundations — more visual texture, no fake skill ratings

- Reveal each skill in a different but related sequence: first its fine rule/path draws, then its label and supporting text settle into view.
- Let each skill correspond to a turn/segment of the existing ribbon coil. Hover or keyboard focus may lift/highlight that segment, but the effect must be clear, quick, and reversible.
- Make the coil evolve as the section enters and leaves; avoid continuous spinning that competes with reading.
- Avoid skill percentages, circular meters, fake proficiency scores, and dashboard-style cards.
- The layout must remain polished even before Mannu adds more detail.

### 7. Certificates — turn the existing 45 marks into a visual moment

Mannu has around 45 certificates, but their individual names and proof links may be supplied later. Do not invent certificate data.

- Preserve the real approximate count and the existing 45 marks if they are already implemented.
- Enrich their entrance with a paced cascade/line draw, subtle depth or orbit, and a pointer response that feels tactile. Avoid turning every mark into a fake badge or fake certificate card.
- Add restrained focus/hover states and an intentional resting composition.
- Ensure motion does not make the count difficult to understand or the marks look like actual credentials with invented metadata.
- When real records are added later, the interaction should support actual title, issuer, date, and verification URL without requiring a visual rebuild.

### 8. Experience — a strand being drawn

- Use the existing strand/timeline idea. Reveal the path as the section approaches, then reveal real entries if present.
- Empty experience data must not generate fake jobs, dates, company names, or placeholder cards in the published view.
- Keep the visual satisfying without entries—e.g. a restrained standalone path or intro composition—and ensure the section remains easy to edit when Mannu supplies details.

### 9. Contact — finish the journey

- Let the guiding thread arrive at and complete its final loop.
- Use a clear heading reveal and a restrained final background/colour transition.
- Add polished interaction states to configured WhatsApp and Instagram actions. Only show active buttons for valid configured URLs; don't make the CTA look functional if its destination is empty.
- The final motion should resolve and pause rather than continue to draw attention indefinitely.

## Typography and text animation: specific requirements

Use the existing font system unless the actual audit reveals a problem.

- Prefer GSAP SplitText for heading lines/words if it is installed and compatible with the existing GSAP version. Check the official docs first and install/update only if needed.
- Use line masks for editorial headings, word stagger for selected phrases, and character-level animation only in one or two moments where it genuinely improves the visual story.
- Use `autoSplit` and `onSplit` correctly for line-based text so line wrapping survives font loading and responsive resizing. Revert split DOM on cleanup.
- Preserve screen-reader text and semantic headings. Verify SplitText's aria behavior; never expose a screen reader to the text read letter-by-letter.
- Do not split huge paragraphs into characters. Paragraph copy should appear in readable chunks and remain selectable.
- Respect reduced motion and keep the underlying text visible if the animation doesn't initialise.
- Prevent transformed heading containers from clipping descenders, accents, or the bottom of letters. Test all breakpoints.

## Interactions to refine

- Buttons: hover, focus-visible, active/pressed, and touch-safe behavior.
- Inline links: animated underline and a small directional cue where appropriate.
- Navigation: active section state and smooth but predictable anchor behavior.
- Mobile menu: sequenced item entrance, focus management, Escape close, and correct page locking.
- Skills and certificate marks: clear hover/focus responses that also work using a keyboard where interaction is meaningful.

Do not apply an identical animation to every control. Keep durations and easing coherent, with enough variation to feel designed.

## Tooling and agent skills

- Audit existing versions and configuration before modifying packages.
- Use the existing GSAP/ScrollTrigger and Lenis integration if sound. Verify Lenis and ScrollTrigger are synchronised using the official Lenis + GSAP integration guidance: https://github.com/darkroomengineering/lenis#gsap-scrolltrigger-integration. Avoid double requestAnimationFrame loops or duplicate ticker registrations.
- Use the official GSAP SplitText documentation: https://gsap.com/docs/v3/Plugins/SplitText/ .
- Use GSAP ScrollTrigger's `scrub` for scroll-bound motion and normal enter/reveal triggers for one-shot animation; don't use scrub for every text reveal. See https://gsap.com/docs/v3/Plugins/ScrollTrigger/ .
- Use Emil Kowalski's animation guidance and skills: https://github.com/emilkowalski/skills . If available, apply `improve-animations`, `find-animation-opportunities`, `animate`, and `review-animations`. If an optional skill is not callable, read/apply its guidance rather than stopping the task.
- Use Taste Skill to keep the existing art direction and review screenshots: https://github.com/Leonxlnx/taste-skill . Follow the special case for preserving an existing design system; do not choose a new palette.
- Use Impeccable to critique visual hierarchy and implementation, but don't let automated rules override intentional design decisions without visual evidence.
- Use Playwright/browser inspection if already configured. Do not add another MCP tool if the project's Playwright setup can perform the required screenshots and scroll tests.
- Install only missing, relevant skills or dependencies. List what was missing, what was installed, why it was needed, and whether installation succeeded. Do not install tools just to increase the list of technologies.

## Technical requirements

- Keep the current app framework and current plain Three.js implementation.
- Organise animations by section or reusable motion utility; avoid a giant component or untracked side effects.
- Use GSAP context/scoped setup and cleanup, following current React/Next.js conventions.
- Avoid duplicate timelines/ScrollTriggers, stale refs, leaked event listeners, and repeated Lenis ticker setup.
- Recalculate ScrollTrigger after fonts/images/layout settle and on resize when appropriate.
- Animate transforms/opacity where possible. Keep layout-affecting animation rare.
- Pause/limit rendering when the 3D scene is hidden or idle if it can be done without desynchronising scroll-scrubbed states.
- Avoid adding Framer Motion, Motion One, Lottie, Rive, Theatre.js, a second smooth-scroll engine, or a second 3D renderer unless the existing project has a concrete requirement for one. GSAP + CSS/SVG + existing Three.js are enough.
- Preserve working fallbacks for no WebGL, reduced motion, and no JavaScript. Do not leave hidden text permanently invisible waiting for JS.
- Never break the real content data or insert fictional portfolio claims.

## Required validation: three rounds

### Round 1 — motion and composition

Run the site. Inspect the page and scroll through the entire story in the browser. Verify the visual hierarchy, line masks, ribbon/text separation, motion timing, section transitions, and the overall rhythm. Fix the three highest-impact problems found.

### Round 2 — scroll and interaction

Use real wheel/trackpad scrolling down and back up, plus navigation anchors. Verify scrubbing is continuous and reversible, text isn't left hidden, active stages match ribbon states, buttons don't flicker, and Lenis/ScrollTrigger don't drift. Test pointer, keyboard, and mobile touch contexts.

### Round 3 — responsive, accessibility, and production checks

Capture and inspect at approximately 1440 × 900, 820 × 1180, and 390 × 844. Test reduced motion, WebGL disabled, JavaScript disabled where feasible, mid-scroll resize, phone menu behavior, and empty/filled content states. Check for horizontal overflow, clipped heading glyphs, ribbon overlap, broken anchor offsets, console errors, and layout shift. Run the available lint, type-check, tests, and production build.

Do not call an inspection successful unless it was actually performed. If GPU acceleration cannot be verified, say so.

## Definition of success

The theme remains the same, but the site becomes more engaging to scroll through because:

1. The hero feels like a coordinated sequence, not a fade.
2. Text reveals have rhythm, variety, and excellent readability.
3. The ribbon visually accompanies the visitor across the whole page.
4. The space interlude feels cinematic, original, and connected to the narrative.
5. The learning sequence has a satisfying build and payoff.
6. Foundations, certificates, experience, and contact each have a distinct visual beat without looking like unrelated templates.
7. Hover states feel crafted, not merely recoloured.
8. The animations reverse or reset cleanly and remain responsive.
9. The interface remains usable and performant on mobile and with reduced motion.
10. At least three rounds of browser-based critique and correction are completed wherever the available environment permits.

Implement this as an incremental upgrade. No framework migration, no random effects, no invented content, no commit/push, and no claims about checks that were not run.
