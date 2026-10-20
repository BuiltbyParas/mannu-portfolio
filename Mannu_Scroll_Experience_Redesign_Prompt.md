# Mannu Portfolio — Scroll-Driven Creative Experience Redesign

## Mission

You are the creative director, senior motion designer, Three.js engineer, and frontend lead for the existing Mannu portfolio at:

`/home/demonfromhell/mannu-portfolio`

The site already has a light visual direction and an original 3D ribbon called **The Thread**. The ribbon has ultramarine and citron faces and changes shape as the visitor scrolls. The site has seven narrative sections, responsive behavior, a static fallback, reduced-motion support, and real portfolio copy. Do not throw that work away.

The current problem is not the absence of libraries. The current problem is that the ribbon and sections do not yet produce the rich, choreographed, rewarding sequence of moments seen in excellent creative websites. The page needs to make people curious about what happens next: typography should enter beautifully, the ribbon should feel alive and intentional, sections should transition into each other, navigation and buttons should respond to interaction, and scrolling should reveal a coherent visual story from beginning to end.

Use Lusion (`https://lusion.co/`) as a reference for the *quality of experience*: confident art direction, custom visuals, interaction, pacing, and scroll-led storytelling. Do not copy its layouts, content, branding, assets, or proprietary work. Use the same level of care to make a distinct experience for Mannu.

**Primary objective:** make visitors enjoy every scroll, not merely tolerate a long page. The site should feel authored, fluid, surprising in a controlled way, and professionally finished.

**Secondary objective:** preserve an honest student portfolio. Do not invent projects, certificate titles, job history, employers, awards, results, testimonials, contact details, or capabilities.

Do not stop after writing a plan. Inspect, implement, render, critique, revise, and test.

---

## 1. Inspect the real project first

Before changing code:

1. Inspect the root files, `package.json`, lockfile, source directories, design notes, current ribbon/geometry code, GSAP/Lenis integration, tests, and any existing Figma or browser configuration.
2. Determine the actual framework and animation libraries currently installed. Verify which skills and MCP servers are actually available in this Claude Code session. Do not rely on a previous session's claim that a tool is installed.
3. Run the current project and capture a baseline at desktop and mobile sizes if browser tooling is available.
4. Read the existing design direction document and README. Keep useful architectural and performance decisions.
5. Report a short list of the five most impactful visual/interaction problems, then immediately begin implementing the fixes.

### Architecture constraint

The existing site has been developed as a Next.js/React application using plain Three.js. **Do not migrate the working project to Vue/Vite solely to add more technologies.** Vite + Vue is an alternative application stack, not a plugin that should be installed beside an existing Next/React app. A framework rewrite creates unnecessary regression risk and does not itself improve visual quality.

For this visual refinement, preserve the actual existing stack and use semantic HTML, modern CSS, TypeScript/JavaScript, Three.js, GSAP + ScrollTrigger, and the existing Lenis integration where appropriate. If inspection reveals that the current framework has already changed, adapt to the real codebase. Do not install Vue, Vite, React Three Fiber, or other replacement technologies unless the project genuinely needs them. If you believe a framework migration is essential, explain the concrete benefit and wait for explicit approval before doing it.

Do not use parallel stacks, duplicate animation frameworks, or dependencies as decoration.

---

## 2. Skill and tool setup: verify first, install selectively

Design skills are guidance, not magic. Verify current installations and read their instructions before making decisions. Install missing relevant skills using their official instructions; avoid duplicating existing skills or blindly running commands found in old blog posts. Check each install succeeded and that Claude Code can actually use the skill. If an installer command changed, consult the repository's current README before running it.

### Priority skills / repositories

**Taste Skill — frontend art direction and anti-template design**
- Repository: `https://github.com/Leonxlnx/taste-skill`
- Official installation path to verify: `npx skills@latest add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`
- Also inspect its existing-project redesign workflow if available. The current site is an iteration, not a blank-slate template task.

**Impeccable — systematic design critique and finishing**
- Repository: `https://github.com/pbakaus/impeccable`
- Read the current README first. The current installation command may use `npx impeccable@latest skills install --providers=claude --scope=project`; verify the supported syntax before executing it.
- Use its initialization/audit/detection commands where supported. A detector passing is not a substitute for human-like visual review.

**Emil Kowalski — design engineering and motion quality**
- Repository: `https://github.com/emilkowalski/skills`
- Official skills CLI path to verify: `npx skills@latest add emilkowalski/skills`
- Use the most relevant skills, especially `emil-design-eng`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-performance`, and `animation-vocabulary` if present. Invoke the review/improvement skills when the workflow supports it; do not claim to have used a skill that was not actually invoked.

**GSAP official AI skills — correct ScrollTrigger patterns and performance**
- Repository: `https://github.com/greensock/gsap-skills`
- Installation path to verify: `npx skills@latest add https://github.com/greensock/gsap-skills`
- Use `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`, and the relevant framework lifecycle skill. Follow the official current docs for all integration details.

**Anthropic Frontend Design skill**
- Source: `https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design`
- Check whether the frontend-design skill/plugin is already installed or available in the current Claude Code version. Follow the official repository/marketplace instructions if not. Do not assume an old plugin name or install command still works.

**Figma MCP**
- Official Claude Code setup: `https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server`
- Recommended official plugin command, only if missing: `claude plugin install figma@claude-plugins-official`
- Verify its connection using the current Claude Code plugin/MCP interface and complete browser authorization only if required. The previous session already created Figma reference frames and styles: inspect the existing project notes first and reuse those artifacts rather than creating duplicate designs or exhausting the monthly tool allowance. If Figma cannot be accessed, continue with the codebase and screenshots and report the limitation honestly.

**Playwright / browser inspection**
- Official MCP repository: `https://github.com/microsoft/playwright-mcp`
- Official setup reference: `https://playwright.dev/docs/getting-started-mcp`
- Check if an existing browser preview tool, Playwright installation, or MCP server is already available. Only if browser control is missing and installation is possible, follow the current official instructions; the documented Claude Code form has been `claude mcp add playwright npx @playwright/mcp@latest`.
- Also use the project's actual browser/screenshot workflow. An accessibility tree is helpful for interaction tests but does not replace visual screenshots.

### Useful code references

Read docs/examples as needed; do not clone huge repositories or paste entire templates into the project.

- Three.js: `https://github.com/mrdoob/three.js` and `https://threejs.org/examples/`
- Lenis: `https://github.com/darkroomengineering/lenis`
- GSAP: `https://gsap.com/docs/v3/` and `https://github.com/greensock/gsap-skills`
- React Three Fiber / Drei are optional React-specific tools, not requirements. Only consider them if a measured architectural advantage justifies migrating the existing plain Three.js sculpture: `https://github.com/pmndrs/react-three-fiber`, `https://github.com/pmndrs/drei`
- Three.js postprocessing is optional; do not add it unless one carefully selected effect materially improves the design and the performance budget supports it: `https://github.com/pmndrs/postprocessing`

### Repository safety and dependency hygiene

- Read license, latest README, release/compatibility notes, and required runtime versions before adopting a repository.
- Never blindly run shell scripts from an unfamiliar repository. Inspect the command and intended effects first.
- Install only tools that are missing and useful for this project's concrete requirements.
- Do not copy another portfolio or CodePen wholesale. Use patterns to learn, then implement an original result.
- Do not commit, push, publish, or modify unrelated directories.

---

## 3. Keep and elevate the existing art direction

The user likes the current predominantly light theme, The Thread 3D ribbon, yellow/citron, white, ultramarine, and the broader gradient color relationships. Preserve that foundation.

### Palette direction

Use a light, editorial, playful-but-sophisticated palette built around:

- warm white / paper: `#F8F8F2` or a similarly soft off-white;
- citron / butter yellow: around `#E8F36A` or `#F4E989`;
- powder blue: around `#DCEBFF`;
- ultramarine / electric blue: around `#3546E8`;
- soft coral as a very limited secondary accent;
- deep ink used selectively for text and contrast, **not as the main page background**.

Treat these as working tokens; derive and document a coherent, contrast-checked palette. Avoid turning every section into a rainbow gradient. Large color fields should be intentional, and transitions between them should feel composed. Keep the site predominantly light and preserve the clean visual relief of the current page.

### Typography

Inspect the current Funnel Display / Funnel Sans pairing before replacing it. Keep it if the real rendered typography is good, the font files load reliably, and text wrapping is appropriate. Otherwise choose a distinctive but highly legible editorial display face with a clean sans-serif. Use a monospace face only for meaningful technical details, such as the existing real C example. Set a responsive type scale with `clamp()`, consistent line lengths, and careful line breaks at each target viewport.

### Composition

- Avoid generic centered hero layouts, rows of identical cards, endless pill badges, over-rounded panels, excessive borders, and random decorative labels.
- Use intentional asymmetric balance, large but readable typography, negative space that serves a purpose, different section compositions, and strong foreground/background relationships.
- Do not fill every empty area merely because it is empty. Whitespace is useful when it creates rhythm; dead space that makes scrolling feel inert is not.
- Keep real text in accessible HTML, not baked into images or a canvas.

---

## 4. The Thread: preserve the 3D ribbon and make it feel choreographed

The existing ribbon geometry and scroll-state logic are assets. Inspect the code and current screenshots, understand how its geometry maps to each section, and build on it rather than casually replacing it.

It should feel like one evolving visual performer traveling through the portfolio, not a 3D decoration which happens to change shape at section boundaries.

### Core behavior

- Preserve the ultramarine/citron two-face identity and the custom ribbon geometry.
- Smoothly interpolate between meaningful states using normalized scroll progress and deliberate easing, avoiding abrupt state changes, discontinuities, sudden rotations, or crushed geometry.
- Maintain its path, width, curvature, normals, and face orientation across state changes. Add geometry regression tests if changing the math.
- Provide a clear sense of depth through camera composition, form overlap, lighting, shadows where appropriate, and restrained depth cues. Do not automatically add heavy bloom, depth-of-field, or noisy postprocessing.
- Use pointer response only when it improves the scene. Keep it subtle, stable, and disabled or reduced for touch/reduced-motion settings.
- Keep the scene behind or beside text only when contrast and occlusion are controlled. Do not let the ribbon obscure names, navigation, buttons, or body text.
- The static SVG/CSS fallback must communicate the same design intent and remain visually polished.

### The Thread as a progress companion

Create a subtle visual sense that the ribbon or a related line accompanies the visitor through the story. For example, its path can visually connect selected section landmarks and resolve near the contact area. Keep a clear relationship between its position and page progress.

Do not add an unrelated fixed progress bar plus a second line plus a custom cursor plus multiple progress indicators. One well-executed motif is enough. On phones and tablets, keep the ribbon in its dedicated visual area above or beside copy, as in the current responsive design. Never allow it to spill into content or create horizontal overflow.

### A cinematic, space-inspired moment

The user likes the feeling of a cinematic, Interstellar-inspired sequence: a sense of travel, discovery, scale, and transformation which rewards scrolling. Create an **original** brief visual sequence using the existing ribbon/Three.js scene, for example:

- the camera moves through a pale, spacious environment with fine luminous points;
- separate elements begin to connect into a path;
- the ribbon sweeps through the space, changes orientation, and resolves into the next section's composition;
- the transition ends in a clean light field that reveals the next content.

It can use powder blue, off-white, ultramarine, citron, and a small amount of coral; it does not need a dark sci-fi environment. Aim for filmic pacing and controlled scale rather than imitating a particular movie shot.

Do not download or use copyrighted movie clips, film soundtracks, or other unlicensed media. Do not add autoplay audio. If a video asset is genuinely needed, use only original or properly licensed content; prefer the existing real-time scene if it can deliver the effect cleanly.

The cinematic sequence must be short enough to keep normal scrolling enjoyable. A visitor must never have to wait for a long animation to finish before reaching content.

---

## 5. Make the entire page feel alive: section-by-section motion brief

The user specifically wants beautiful text animations, hover interactions, hero animation, smoother scroll-linked motion, and rewarding details throughout the page. Implement these as one motion system with variation and purpose, not a library of disconnected effects.

### A. Initial load and header

**The first 1–2 seconds should feel art-directed without delaying access to the page.**

- Make the header enter cleanly with a small opacity/position transition. Do not let it overlap the ribbon or hero heading.
- Animate the hero name using a carefully staged clip/mask or word/line reveal. Use letter-level motion only if it remains readable and does not become a gimmick.
- Reveal the tagline and introductory copy with a distinct, slower sequence after the name.
- Let the ribbon draw, weave, or settle into its hero pose in coordination with the typography. Its movement should feel physically coherent.
- Reveal the primary/secondary CTAs with a small, purposeful motion.
- Add a subtle scroll cue that responds or fades away when the visitor begins scrolling.
- Keep first paint fast. Text should not remain invisible if JS, GSAP, or WebGL fails.

Do not delay the page behind a full-screen loader or force an intro animation before the visitor can scroll.

### B. Header, navigation, links, and buttons

Implement refined hover, focus, active, and pressed states for all interactive elements, including items that currently look static.

Possible treatments:

- underline that draws from one side to the other;
- a small arrow that shifts or rotates;
- a short color transition between the current palette colors;
- a low-distance magnetic or cursor-aware response on desktop only, **only if it feels controlled**;
- clear keyboard focus that is just as deliberate as the hover effect.

Do not add a custom cursor unless it provides real value and has a proper fallback. Do not make buttons wobble, bounce, or follow a pointer aggressively. Respect `prefers-reduced-motion`.

The header should stay polished while scrolling and must never hide the top of a target section. Fix anchor offsets and heading clipping issues observed in previous screenshots. Verify mobile navigation, Escape behavior, focus management, and page locking.

### C. Curiosity section

Do not simply fade a heading and paragraph upward. Use a designed reveal which connects visually to the hero:

- typography reveals through a clipped line or carefully staggered phrase;
- the ribbon loosens or changes its curvature as scroll progresses;
- selected words or one short phrase may receive a controlled color emphasis if it supports the meaning;
- the background or visual arrangement evolves slightly to establish a new chapter.

Keep the copy readable at rest and on reduced motion.

### D. How I Learn — the signature scroll experience

This is the most important narrative sequence after the hero. The four stages are:

1. Understand the problem.
2. Break it into steps.
3. Try a solution.
4. Learn from the result.

Connect the motion to the content precisely:

- an open form signals the problem;
- the ribbon separates into meaningful segments during decomposition;
- the segments test/reorder into a clear path during the attempt;
- the pieces resolve into a satisfying, coherent knot/loop when learning is complete.

Use GSAP timelines and ScrollTrigger to connect progress with the visitor's scroll position, not merely start an unrelated animation when the section appears. Tie the highlighted copy/stage to the same progress state.

A short, carefully designed pinned sequence is acceptable only if it creates a material improvement and remains comfortable on touch screens; otherwise use standard scroll-linked motion. Never force long or horizontal scrolling. Ensure the section works when scrolling upward and downward, resizes properly, and has understandable static content if animation is unavailable.

The ending of this sequence should give a small visual payoff that makes visitors want to continue.

### E. Foundations — “Strong foundations. Room to grow.”

The user has additional ideas for this section and wants to add details later. Do not overdesign its final information architecture or invent content before those ideas arrive. Keep the existing honest content and make the component easy to adjust later.

For this pass, focus on craft:

- intentional headline reveal;
- clean entrance and spacing for the existing skill list;
- subtle interaction feedback on real skill entries;
- use the ribbon's coil/state change as a meaningful visual transition;
- avoid fake percentage bars, proficiency meters, random floating icons, or invented skill levels.

Leave this section modular so future content/design decisions can be added without rewriting the global motion system.

### F. Certificates — a record of curiosity

The user also has specific ideas to discuss later for this section. For now, focus on animation polish and maintainable structure without locking in an elaborate gallery that may later be replaced.

- Preserve the approximate count of around 45 certificates as supplied; do not invent individual credentials.
- If the existing 45 small marks are retained, give them purposeful reveal timing and subtle interaction states without making them look like meaningless crystals, debris, or generic floating particles.
- Use restrained staggered drawing/reveal as the visitor arrives, then settle the field so it stops competing with the text.
- Do not create fake certificate tiles, issuer logos, names, dates, or links.
- Keep certificate data and presentation separate so the user can provide their intended design and real certificate information later.

### G. Experience

Keep the current honest narrative, with no invented history. Use the long-strand concept to move the visitor onward and build a sense of continuity. Animate the strand with a controlled draw/reveal or curvature transition; keep text readable and avoid leaving lines half-drawn when the section settles.

Maintain a modular layout to accommodate real entries in the future.

### H. Contact ending

The current colored contact band can remain a strong contrast moment against the light page.

- Make the transition into it feel like a resolution of The Thread.
- Reveal its heading with a carefully paced mask/line animation.
- Give each configured contact action a clear, polished hover and focus state.
- Use only real, configured WhatsApp and Instagram URLs. If the URLs are empty, do not render dead buttons or pretend contact is possible.
- Finish with a visually composed final ribbon state, not an abrupt end or an endless animation loop.

---

## 6. Motion and scroll implementation rules

Use GSAP + ScrollTrigger for the main choreography and CSS transitions for small interaction states. Avoid competing motion libraries.

- Register GSAP plugins once in the appropriate module/context.
- In React/Next.js, scope GSAP to component refs and use the project's existing cleanup pattern or `@gsap/react`/`gsap.context()` if appropriate. Revert contexts and kill obsolete triggers on unmount.
- Prefer transforms, opacity/autoAlpha, clip-path where safe, and SVG strokes over animating layout properties.
- Scrub timelines for animations that should physically follow scroll. Use discrete enter/reverse behavior for simple reveals. Do not apply both scrub and conflicting `toggleActions` to the same timeline.
- Make ScrollTrigger creation order predictable and refresh after fonts, layout, or content changes when needed.
- Do not animate the pinned trigger itself if pinning is used; animate its descendants.
- Ensure timeline progress is stable when scrolling upward, down, rapidly, or after resizing.
- Keep all important text visible if the animation setup fails; no content may depend on `from()` animations that leave it at `opacity: 0` after an exception.

### Lenis integration

The site already uses Lenis. Inspect its current setup and fix rather than duplicate it.

- Use the current official Lenis + GSAP/ScrollTrigger integration instructions: `https://github.com/darkroomengineering/lenis`.
- Synchronize Lenis scroll events with `ScrollTrigger.update` and use one coordinated RAF/ticker strategy.
- Do not combine `autoRaf: true` with a second custom ticker loop. Do not initialize two Lenis instances.
- Avoid double-smoothing, delayed scroll response, anchor jumps, or ScrollTrigger desynchronization.
- Keep touch scrolling natural; test on mobile rather than assuming desktop behavior translates.
- Respect `prefers-reduced-motion`; reduce or disable smooth interpolation if necessary.
- Avoid scroll hijacking and global CSS that breaks normal browser scrolling.

### Timing and motion hierarchy

Create a small motion specification and document it, including easing families and approximate durations. Motion should have three levels:

1. **Signature motion:** hero + the learning-method transformation + the final ribbon resolution.
2. **Section motion:** distinct but restrained transitions between narrative chapters.
3. **Micro-interactions:** responsive hovers, focus states, button arrows, navigation feedback.

Not every element needs animation. Avoid repeated generic fade-up reveals, nonstop wobble, unnecessary parallax, delayed content, and animations that restart continuously while the visitor scrolls up and down.

---

## 7. Sound, video, images, and creative assets

The user wants the emotional feeling of cinematic visual storytelling, including an interstellar/space-inspired visual moment. Do not interpret this as permission to use movie footage, music, or unlicensed assets.

Prefer custom geometry and procedural visual effects built from The Thread, dots, curves, camera movement, depth, and lighting. If imagery/video is needed, first inspect existing project assets. Use only original or appropriately licensed sources, optimize them, and provide poster/fallback behavior. Do not add autoplay audio; any optional sound would need a visible opt-in and is not required for this brief.

No generic stock-photo collage. Do not fabricate a portrait of Mannu or use AI-generated images as evidence of her work or credentials.

---

## 8. Performance and accessibility are design requirements

The scene was previously tested on a machine using software WebGL rendering, so its software frame times were not representative of actual GPU performance. Do not claim smooth 60fps on hardware that has not been measured.

- Keep the existing lightweight Three.js approach unless there is a measured reason to change it.
- Avoid expensive postprocessing by default.
- Cap device pixel ratio and geometry complexity; use lower-detail settings for narrow or low-power devices.
- Pause or reduce rendering when the scene is not visible or the document is backgrounded where practical.
- Avoid React state updates every animation frame.
- Dispose of geometries, materials, textures, renderers, observers, and listeners correctly.
- Avoid layout shifts; reserve dimensions for fonts and scene containers.
- Keep body text and interactive elements high contrast.
- Ensure keyboard focus remains visible and never hidden behind the 3D canvas.
- Support reduced motion and static fallback. The page must be complete without WebGL, and content must work if JavaScript is unavailable to the extent supported by the existing framework.
- Do not force motion-sensitive users to sit through the full cinematic sequence.

Use modern HTML semantics and CSS. Keep headings, paragraphs, sections, navigation links, and buttons as actual accessible DOM content.

---

## 9. Test at least three rounds of real browser output

A successful build is not proof of a top-tier visual result. Use actual screenshots and interaction tests if the environment supports them. Do not claim visual inspection unless you performed it.

### Round 1 — Macro design and visual hierarchy

Check the desktop hero, overall section rhythm, light palette, ribbon composition, headline scale, whitespace, and relationship between text and visual. Fix the biggest composition problems first.

### Round 2 — Motion and scroll choreography

Record/test the page at the top, during each section transition, through all four learning steps, at the certificate section, and at contact. Check the ribbon's continuity, timing, easing, text reveal, hover feedback, header state, upward scrolling, anchors, and Lenis/ScrollTrigger synchronization. Fix abrupt state changes, motion that feels mechanical, overlaps, dead areas, and sections that offer no reward for continued scrolling.

### Round 3 — Responsive polish and failure states

Inspect at approximately:
- Desktop: `1440 × 900`
- Tablet: `820 × 1180`
- Phone: `390 × 844`

Also test reduced motion, WebGL disabled/unavailable, long or empty content states, keyboard navigation, mobile menu, and resizing while partway through the page.

Specific regression checks:
- No ribbon/text overlap or off-screen ribbon spill.
- No clipped headers, section titles hidden under sticky navigation, or broken anchor offsets.
- No horizontal scrolling at any target viewport.
- No line/coil geometry seams, pointed crystal artifacts, broken normals, half-drawn paths, or discontinuous transitions.
- No duplicate animation instances after hot reload or resize.
- No elements left invisible due to a failed entrance animation.
- No dead CTA/contact buttons.
- No blank certificate/experience cards or fake data.
- No browser console errors, failed asset loads, or obvious font/layout flashes.

If Playwright is available, use it for repeatable viewport and interaction checks. Use browser screenshots for visual review and repeat after significant fixes. Run Impeccable's detection/audit where available, and invoke Emil's animation review/improvement skills where available.

Do not make up test results. If a browser or skill is unavailable, state the precise limitation and continue with the checks that are possible.

---

## 10. Engineering checks and change discipline

Run the project through its actual existing scripts and package manager. At minimum, run applicable:

- lint;
- type-check;
- unit tests, including the current ribbon geometry tests;
- production build;
- local development server/browser checks.

Run an accessibility and performance audit if the environment already supports it or it can be added without destabilizing the project. Report real results and known limitations. Be clear that a local synthetic audit is not the same as a real-device GPU performance test.

Do not commit, push, publish, deploy, or change Git state. Do not delete the `.backup` snapshot or unrelated files. Inspect the stray files mentioned in the prior report and only remove them if their paths and contents are clearly confirmed to be accidental; otherwise leave them and report their exact paths and sizes. Do not perform destructive cleanup automatically.

Keep source changes targeted and readable. Update README/design notes to describe the actual new animation system and how to modify it. Keep the current content data structure intact unless a specific improvement is necessary.

---

## 11. Definition of done

The redesign is complete when:

1. The light palette and existing Thread concept are preserved and noticeably elevated.
2. The hero has a polished text reveal, ribbon entrance, and excellent first-view composition.
3. Navigation, links, and buttons have thoughtful hover, active, pressed, and keyboard-focus feedback.
4. Each section provides a small visual reward for scrolling, while the whole page feels like one continuous story.
5. The learning-method section has a meaningful four-stage scroll-driven transformation and visual payoff.
6. The ribbon behaves continuously and correctly on desktop, tablet, and phone.
7. The certificate and foundations components remain easy to refine later and contain no invented content.
8. The cinematic space-inspired moment is original, integrated into the light visual language, and short enough not to obstruct normal scrolling.
9. Motion is stable when scrolling in either direction, on resize, and with reduced motion enabled.
10. The site remains readable, accessible, responsive, and usable without WebGL.
11. Three actual rounds of browser review and correction have been performed if browser tools are available.
12. Lint, type-check, tests, and production build have been run, with truthful results reported.
13. Nothing is committed, pushed, or published.

## Final instruction

Be a creative director, not a feature collector. The target is not “add lots of animation”; it is an experience that makes someone want to see the next section. Every scroll should offer a reason to continue: a change in form, a small reveal, a satisfying transition, a strong composition, or a meaningful interaction. Keep the light, white/yellow/citron/blue identity and the existing 3D ribbon, and turn them into a coherent, memorable, high-craft story.

Start by inspecting the real site and its tools. Then implement and validate the result. Do not stop at analysis, installations, or a list of recommendations.

---

## Reference URLs

- Lusion: https://lusion.co/
- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Impeccable: https://github.com/pbakaus/impeccable
- Emil Kowalski skills: https://github.com/emilkowalski/skills
- GSAP official AI skills: https://github.com/greensock/gsap-skills
- GSAP documentation: https://gsap.com/docs/v3/
- Lenis: https://github.com/darkroomengineering/lenis
- Three.js: https://github.com/mrdoob/three.js
- Three.js examples: https://threejs.org/examples/
- Figma MCP setup for Claude Code: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
- Playwright MCP: https://github.com/microsoft/playwright-mcp
- Playwright MCP docs: https://playwright.dev/docs/getting-started-mcp
- Anthropic Frontend Design source: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design
