# Mannu Portfolio — Full Light-Theme Creative Redesign

## Mission

Redesign the existing Mannu portfolio at `http://localhost:3000` into a bespoke, high-craft, light-theme interactive portfolio. This is a full visual redesign of the existing website, not a greenfield rewrite and not a small polish pass.

Act as a creative director, senior interaction designer, motion designer, frontend architect, 3D web artist, accessibility engineer, and QA reviewer. Inspect the current project and the live site first, then improve the complete experience and verify the result in a browser.

The creative benchmark is the *quality of execution* in [Lusion](https://lusion.co/): original visual storytelling, designed motion, custom 3D, purposeful interactions, and a cohesive scroll narrative. Do not copy Lusion's layouts, assets, text, or brand identity.

**Hard visual requirement: this site must use a predominantly light theme. Do not return to the existing dark navy/black full-page look.** Use light surfaces, dark readable text, expressive color, custom visuals, and carefully composed motion.

The guiding idea is:

> **Curiosity, built one problem at a time.**

The site should express Mannu's curiosity and developing technical foundations without pretending she is already an experienced professional.

---

## Phase 0 — Audit the existing project before editing

1. Inspect the repository, `package.json`, lockfile, scripts, framework, styles, current components, assets, animation setup, and any existing agent instructions.
2. Check how the current site runs and inspect the actual page at `http://localhost:3000` if the server is already running. Do not start a second server on the same port.
3. Identify the five biggest visual or UX problems in the current implementation. Record them briefly before making changes.
4. Keep the existing framework, package manager, content, and functional behavior unless there is a real reason to change them. The current project is expected to be Next.js/React; verify rather than assume.
5. Do not delete or rewrite unrelated project files. Do not commit or push changes.
6. Before changing the site, check existing skills, MCP servers, browser tooling, and dependencies so nothing is installed twice.

After the audit, write a concise plan and proceed without waiting for user approval. Do not stop after the plan.

## Phase 1 — Install and activate the design workflow

The goal is not to install every frontend library on GitHub. Install the specific design skills and the runtime tools needed for the selected implementation. Reuse dependencies already present. Review each installation command and its effects; do not execute destructive commands or overwrite local settings without understanding the diff.

### A. Design / UX / anti-generic-design skills

Check the current official README and install the latest compatible version of these selected resources:

1. **Impeccable** — design critique, UX review, hierarchy, responsive layout, accessibility, and final polish.
   - Official repository: https://github.com/pbakaus/impeccable
   - Preferred documented setup: run `npx impeccable install` from the project root, then use `/impeccable init` inside Claude Code.
   - If the repository's current instructions differ, follow the current official README rather than blindly forcing an outdated command.

2. **Taste Skill** — original art direction, anti-template decisions, section blueprints, and screenshot-based visual review.
   - Official repository: https://github.com/Leonxlnx/taste-skill
   - Supported CLI route: `npx skills@latest add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend" -a claude-code`
   - Alternatively use its documented Claude Code plugin route, but do not install the same skill twice.

3. **Emil Kowalski's design/animation skills** — motion timing, easing, animation opportunities, and strict animation review.
   - Official repository: https://github.com/emilkowalski/skills
   - Install the relevant website skills with the current documented `skills` CLI. Prioritize `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-performance`, and `animation-vocabulary` if these exact names are present in the current repository.
   - Do not use React Native / Expo / Swift-only skills for this web portfolio.

4. **UI/UX Pro Max** — searchable design-system knowledge, typography and palette references, UX rules, and implementation checks.
   - Official repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
   - Supported CLI route: `npx ui-ux-pro-max-cli init --ai claude`
   - Check prerequisites first. If Python or another prerequisite is missing, report it and ask for approval before installing system packages. Do not use `sudo` or alter system Python.

5. **Anthropic Frontend Design plugin** — a clear art-direction and high-craft frontend implementation skill.
   - Official source: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design
   - Inside Claude Code, attempt the official installation route documented for the current release, commonly `/plugin install frontend-design@claude-plugins-official`.
   - If the plugin name or marketplace differs, check Anthropic's current documentation. Do not substitute an unknown third-party plugin just to make installation pass.

Use these resources with distinct jobs rather than asking five skills to redesign the same page independently:

- Taste Skill: choose and defend the creative direction; run the browser-based redesign and screenshot critique loop.
- Impeccable: audit, shape, critique, and polish the design and UX.
- UI/UX Pro Max: research relevant design-system decisions and validate the chosen system; do not blindly select a random template.
- Emil's skills: make motion deliberate, then audit timing, easing, opportunities, and performance.
- Frontend Design: implement a distinctive solution rather than a generic component-library layout.

If two skills disagree, prioritize this brief, the existing content's truth, accessibility, performance, and a cohesive art direction. Avoid duplicated or contradictory global instructions.

### B. Figma-to-code workflow

Use the official Figma MCP integration if the user has an available Figma account and can authenticate it.

- Official docs: https://developers.figma.com/docs/figma-mcp-server/
- Official setup: https://help.figma.com/hc/en-us/articles/39216419318551-Get-started-with-the-Figma-MCP-server
- The official remote MCP endpoint is `https://mcp.figma.com/mcp`; follow the currently documented Claude Code setup and sign-in flow rather than guessing a config format.

Required design-first workflow:

1. Use the art-direction skills to develop **three materially different light-theme directions** before coding. Each must have a distinct concept, layout, display typography, palette, use of 3D, and motion personality. Do not create three near-identical color variations.
2. Select the strongest direction based on Mannu's story, the Lusion-inspired goals, visual distinctiveness, legibility, and performance. Document why it wins.
3. If Figma MCP is available and authenticated, create or refine native Figma frames/components for the 1440×900 desktop hero, 390×844 mobile hero, navigation, main section compositions, and key interaction states. Use real design context and screenshots as the source of truth.
4. When implementing a Figma frame, fetch both structured design context and a screenshot for the exact frame/node before writing the corresponding code. Use the actual spacing, typography, colors, layout, and assets as references, then adapt to the existing component architecture.
5. Compare the implementation against the design in a real browser. Fix deviations rather than treating generated code as final.
6. If Figma MCP requires sign-in, a paid seat, permissions, or an unavailable feature, explain the exact blocker briefly and continue with a documented design specification in the repository. Do not claim that Figma was used or that a Figma file was created if it was not.

Figma is a design bridge, not a one-click finished-site generator. The implementation still needs real coding and visual QA.

### C. Browser testing / visual feedback

The website must be inspected in a real browser after implementation.

1. Check whether the Taste Skill browser workflow, existing browser MCP, or Playwright is already available.
2. If Playwright is missing and the current package manager supports it, add a project-local dev dependency such as `@playwright/test`, then install Chromium using the documented Playwright command (`npx playwright install chromium`). Preserve the current package manager and lockfile.
3. Only add the Microsoft Playwright MCP server if an MCP browser workflow is actually useful and not already configured. Official repo: https://github.com/microsoft/playwright-mcp
4. Do not create multiple overlapping browser automation setups. One reliable screenshot-and-interaction path is enough.

### D. Runtime technologies — install only when needed

Use the existing framework and styles. For a Next.js/React implementation, the expected candidates are:

- **GSAP + ScrollTrigger** for the primary scroll choreography.
- **Lenis** for smooth scrolling, integrated correctly with GSAP and native anchor navigation.
- **Three.js** and optionally **React Three Fiber + Drei** for the primary custom visual scene, if the art direction genuinely benefits from it.
- CSS, SVG, Canvas, and the existing styling approach for typography, interface states, secondary visuals, and fallbacks.

Before installing, inspect the current dependency tree. Add only missing packages that the implementation actually needs. A likely package set for the intended React approach is `gsap`, `@gsap/react`, `lenis`, `three`, `@react-three/fiber`, and `@react-three/drei`; verify React compatibility first. Do not add a second animation framework such as Motion/Framer Motion when GSAP already handles the planned complex scroll timelines. Do not add every package “just in case.”

If the current project is not React/Next.js, do not force React Three Fiber into it. Use Three.js directly or the correct renderer for the existing stack.

### E. Component repositories — selective use only

These are component references, not templates to dump into the site:

- React Bits: https://github.com/DavidHDev/react-bits
- Three.js: https://github.com/mrdoob/three.js
- React Three Fiber: https://github.com/pmndrs/react-three-fiber
- Lenis: https://github.com/darkroomengineering/lenis
- GSAP: https://gsap.com/docs/v3/Installation/ (use current official documentation)

Inspect the license, dependencies, accessibility, quality, and relevance of any component before adopting it. Prefer adapting one useful component or writing a purpose-built visual over importing a whole showcase. Do not copy an entire third-party portfolio, scrape proprietary assets, or reproduce Lusion's exact composition.

### Installation reporting

Before installing, briefly list existing relevant tools, tools already installed, and new dependencies/skills you plan to add. Proceed with ordinary project-local package and documented skill installations. Pause only when an action genuinely requires the user's authentication, permission, or a risky system-level change. Never use `sudo` without explicit permission. If an installation fails, inspect the error and follow the source's current documented fallback; do not repeatedly try random commands.

---

## Phase 2 — Research the creative benchmark and extract principles

Use these references for principles, not to clone them:

- Lusion: https://lusion.co/ — original 3D visual storytelling, project-driven narrative, motion, and custom production craft.
- Lusion About: https://lusion.co/about/ — how a creative studio unites design, motion, 3D, and technology.
- Bruno Simon: https://bruno-simon.com/ — a memorable custom 3D portfolio with the creator openly documenting Three.js.
- Active Theory: https://v5.activetheory.net/ and https://xr.activetheory.net/ — specialized interactive production and immersive web technology.
- Emil Kowalski: https://emilkowal.ski/ — thoughtful motion and interaction design.
- Impeccable: https://impeccable.style/ — critique and refinement workflows.
- Taste Skill: https://github.com/Leonxlnx/taste-skill — researched art direction and screenshot-based iteration.

Extract a short, project-specific set of design principles before implementation:

1. One memorable visual idea—not a pile of effects.
2. An instantly legible first screen with a clear focal point.
3. Motion supports the concept and reading order.
4. Each section advances the story and changes visual state or composition intentionally.
5. Responsive layouts are designed for their viewport, not merely shrunk.
6. Performance, accessibility, and useful navigation are part of the design rather than cleanup tasks.
7. Real content and restrained, authentic details beat fake project cards, generic assets, or inflated credentials.

---

## Phase 3 — Original light-theme art direction

### Non-negotiable color and mood direction

Create a bright, predominantly light website. Do not use dark navy/black as the main page background, and do not solve the new design by switching the current design to an all-white generic SaaS template.

Explore a sophisticated light palette such as:

- Warm porcelain / soft ivory as the main canvas.
- White and very light neutral surfaces for separation.
- Deep ink or charcoal for highly readable typography, not as full-page backgrounds.
- Saturated cobalt / ultramarine as a major brand color.
- One carefully selected contrasting accent such as vermilion, coral, acid chartreuse, or vivid tangerine; keep the overall palette controlled.
- Soft color only where it is part of the designed artwork, lighting, or depth—not random gradients everywhere.

The chosen colors should feel creative, expressive, sophisticated, and tactile. Do not rely on pastel pink, generic purple-blue gradients, or a stereotypical “girl portfolio” palette. Do not use default Tailwind-looking color combinations without art direction.

The color system may include a small number of deliberately designed colored sections, but the overall page must remain predominantly light.

### Type and layout

Use distinctive editorial typography with a clear display/body contrast. Explore a characterful display family such as Instrument Serif, Editorial New (only if properly licensed), or another suitable expressive face, paired with a highly readable neutral sans-serif such as Geist or DM Sans. Use `next/font` or a reliable local font setup when appropriate. Check font licensing and provide fallbacks.

Build a deliberate type scale with responsive `clamp()` values, controlled line lengths, careful leading, and clear hierarchy. Do not make every section headline enormous. Use typography to direct attention, not fill space.

Use strong composition, asymmetric grids, overlapping planes, whitespace with purpose, and carefully aligned content. Avoid repeating the same split layout or identical card pattern in all seven sections.

### Signature visual idea

Develop an original visual concept called **“Ideas in Motion”** (the name can be refined if the chosen direction is stronger): mathematical relationships become visual structures as Mannu moves from curiosity to understanding.

Use one carefully art-directed hero visual—a custom 3D abstract sculpture/network, not an off-the-shelf floating sphere, default particle field, or generic wireframe globe. Consider a sculptural combination of connected forms, colored translucent/ceramic materials, flowing curves, measured geometry, and light. Build it from custom geometry/materials or a carefully adapted open-source component, and make it feel designed rather than procedurally random.

The bright background should remain visible and integral to the composition. The scene must be beautiful as a still image, then gain meaning through interaction.

Create one coherent visual system that can transform into different states throughout the page. Do not create an unrelated 3D animation for every section.

---

## Phase 4 — Redesign Mannu’s complete story

Keep the content honest and preserve these narrative sections. You may refine visual hierarchy and microcopy, but do not invent facts.

### 01. Hero — “Curious by nature. Disciplined by choice.”

Name: **Mannu**

Context: `BCA STUDENT · LOVELY PROFESSIONAL UNIVERSITY`

Intro: “I’m Mannu, a first-year BCA student at Lovely Professional University. I’m interested in the way mathematics and code turn questions into solutions. Right now, I’m strengthening my programming foundations in C, practicing problem-solving, and learning something new whenever I can.”

Actions: `Explore my learning journey` and `Contact me`.

Design the hero as a strong, light-theme, creative-studio-quality composition: typography, visual subject, and whitespace must work together. Show the actual page content immediately; do not hide it behind a long loader. The hero should remain comprehensible with animation disabled.

### 02. Curiosity

Heading: **“A mind that keeps asking questions.”**

Copy: “I’ve always been curious about how things work. I enjoy looking at a problem from different angles, breaking it into smaller steps, and working through it patiently. That curiosity leads me from mathematical problems to coding exercises and new topics I want to understand. I’m still at the beginning of my journey, but I bring focus, discipline, and a willingness to keep improving.”

Use a distinctly different composition from the hero while preserving visual continuity. Do not use oversized serif body text that becomes tiring to read.

### 03. How I Learn

Heading: **“Every difficult problem has a starting point.”**

Intro: “I like understanding a problem before rushing toward an answer. Whether I’m working through a mathematical question or practicing C programming, I try to break the challenge into manageable steps and learn from the result.”

Four steps:

- **Understand:** Start by asking what the problem is actually asking.
- **Break it down:** Separate the challenge into smaller, manageable parts.
- **Try a solution:** Apply logic, test an approach, and work through the steps.
- **Learn from the result:** Review what worked, understand what did not, and improve the next attempt.

This is the signature scroll interaction. A geometric structure should evolve from loose, separated forms into a legible connected sequence in sync with the four steps. The interaction should feel original and satisfying, not like four text cards over a generic animation. Preserve native scroll; keep pinning short or avoid it entirely.

### 04. Foundations in Progress

Heading: **“Strong foundations. Room to grow.”**

Copy: “My portfolio is at the beginning, just like my BCA journey. As I build small programs and projects, I’ll share the ones that best show what I’m learning and how I approach a problem.”

Current foundations:

- C programming.
- Mathematical and logical problem-solving.
- Core computer application concepts.
- Independent learning and study habits.

Do not assign fabricated proficiency percentages, skill ratings, or fake achievements. The section should have a visually rich but readable composition that evolves from the main visual language.

### 05. Certificates

Heading: **“A record of curiosity.”**

Copy: “I’ve earned around 45 certificates through my learning journey. Each one represents time spent exploring a topic and building my knowledge. Rather than listing every certificate at once, I’ll feature a few that are most relevant to my interests and current goals.”

Use editable typed data for actual certificate title, issuer, date, verification URL, and genuine image. Do not invent entries, badge graphics, names, or links. Hide incomplete entries. Until genuine certificates are entered, use a polished editorial empty-data state with the supplied approximate count rather than fake cards.

### 06. Experience

Heading: **“Learning beyond the classroom.”**

Copy: “Alongside my studies, I’ve had some early work experiences. They’re helping me understand how I learn and contribute in practical settings.”

Use editable fields for role/activity, organization, dates, contributions, and real links. Those details have not been supplied. Hide empty items and do not invent employers, titles, dates, or a fake career timeline.

### 07. Contact

Heading: **“Every journey starts with a conversation.”**

Copy: “I’m open to learning, meeting people who enjoy solving problems, and exploring new opportunities.”

Potential actions: `Message me on WhatsApp` and `Find me on Instagram`.

The actual WhatsApp URL and Instagram profile have not been provided. Store them as empty configuration values; show only links that have been filled with genuine, valid URLs. End with a visually composed resolution of the main visual idea.

---

## Phase 5 — Motion and interaction specification

### Use the right jobs for the right tools

- **Lenis:** scroll feel and coordinated scroll behavior, if it improves this project.
- **GSAP + ScrollTrigger:** hero timeline, a small number of scroll-synchronized scene transitions, and carefully sequenced reveals.
- **Three.js / React Three Fiber:** the custom 3D centerpiece and controlled changes in its state.
- **CSS / SVG:** typography, navigation, simple transitions, icons/diagrams, and reduced-motion fallbacks.
- **Emil’s skills:** make motion choices deliberate and review them after implementation.

Do not use GSAP, Motion, and multiple other animation systems for overlapping jobs. Do not add a library unless a specific effect needs it.

### Motion requirements

- The hero visual responds gently to scroll and, if useful, pointer movement.
- The scene shifts between the narrative sections in ways the visitor can perceive.
- The four-step learning sequence has the strongest scroll-linked choreography.
- Hover and focus states are crafted but quiet; do not move layout boxes unpredictably.
- Every reveal respects reading order and does not delay access to content.
- No scroll hijacking, forced horizontal scroll, global scroll snapping, or prolonged pinned sequences.
- Do not use an artificial custom cursor unless there is a compelling usability-safe reason.
- Avoid constant idle animation when nothing needs to move.
- On smaller devices, simplify or remove costly effects while preserving the design idea.

### Correct Lenis/GSAP integration

If Lenis is used, follow its current official integration guidance with GSAP/ScrollTrigger. Set up one scroll controller only, sync ticker/updates correctly, and avoid double smooth-scrolling systems. Ensure anchor navigation, `scroll-margin-top`, sticky navigation, focus handling, and back/forward browser behavior still work. Do not force smooth behavior when `prefers-reduced-motion` requests reduced motion.

### 3D quality and performance

- The 3D canvas is decorative and `aria-hidden`; all copy and controls live in semantic DOM.
- Clamp device pixel ratio and scene complexity.
- Avoid expensive bloom/blur/post-processing by default.
- Avoid excessive draw calls and unbounded particle counts.
- Pause or reduce rendering while offscreen or the tab is inactive where sensible.
- Dispose of geometries, materials, textures, and event listeners correctly.
- Provide a static poster / SVG / CSS fallback.
- Do not create a loader unless there is a genuine loading need; if used, it must never hold the user hostage.

---

## Phase 6 — UX, accessibility, responsiveness, SEO

- Keep the page predominantly light with strong text contrast.
- Use semantic landmarks, proper headings, descriptive links, and visible keyboard focus.
- Add a skip link where appropriate.
- Every section and contact action must remain understandable without WebGL or animation.
- Honor `prefers-reduced-motion` in CSS, GSAP, Lenis, and the 3D scene.
- Make the mobile version a deliberate composition, not a shrunken desktop layout.
- Keep touch targets comfortably sized; do not rely on hover alone.
- Avoid horizontal overflow, clipped typography, overlapping fixed headers, and layout shifts.
- Use meaningful page title, metadata, social sharing metadata, and favicon assets if the project supports them.
- Keep all important text crawlable and selectable.
- No fake reviews, logos, metrics, testimonials, projects, or credentials.

## Phase 7 — Required visual iteration loop

Do not treat a successful build as proof of visual quality.

1. Capture the current version before changing it, if browser screenshot tooling is available.
2. Implement the new design and start the actual site using its existing development workflow.
3. Capture and inspect browser screenshots at **1440×900**, **390×844**, and one tablet/intermediate size.
4. Scroll through all sections and inspect how transitions behave. Also check keyboard navigation and direct anchor navigation.
5. Critique the screenshots using Taste Skill and Impeccable. Ask Emil's motion skills to review the actual animation implementation.
6. Write down the top three visual defects. Fix them.
7. Capture screenshots again and repeat the critique/fix loop at least **three times**, or until each remaining issue is clearly documented and no longer realistically fixable within the available time.
8. Test under reduced motion and with the WebGL scene disabled or unavailable.
9. Check console output, asset failures, layout overflow, and broken interaction states.

Inspect the actual rendered website, not only source code. Do not say a visual check happened if it did not. If browser access is missing, establish the simplest documented Playwright/screenshot route possible. If it remains impossible, report the exact limitation without pretending the result is verified.

## Phase 8 — Validation and delivery

Run the existing applicable scripts for production build, type checking, lint, and tests. Use the package manager already in the repository. Fix regressions created by the redesign.

Check:

- All seven sections work and have intentional compositions.
- The hero is immediately legible and visually memorable.
- The 3D visual feels custom and relevant, not generic.
- The four-stage learning sequence is the signature interaction.
- Lenis and GSAP do not fight each other.
- The page remains usable without animation and with reduced motion.
- Mobile has no clipped text, accidental horizontal scroll, or controls hidden behind the header.
- Missing certificates, experience, and contact details do not appear as fake content.
- The site starts reliably and the production build passes, or any failure is accurately explained.

At the end, provide a concise factual report with:

1. What was redesigned.
2. Design direction and rationale.
3. Skills and tools installed, with versions where available.
4. Where genuine certificate, experience, and contact data should be edited.
5. Screens/viewports actually tested and the number of screenshot-refinement rounds completed.
6. Build, lint, type-check, and test results.
7. Anything blocked by Figma authentication, missing browser support, or unavailable tools.

Do not commit, push, or deploy. Do not stop after installing the skills or setting up dependencies. **Finish the redesign, inspect it, correct it, and report truthfully.**

---

## Final principle

A top-tier portfolio is not a large pile of dependencies. It is an original idea, strong art direction, custom visuals that serve the idea, exact typography and layout, useful motion, good accessibility, and repeated real-browser critique.

Use the tools above as an integrated workflow. The final site should feel like a light, expressive, meticulously made creative experience inspired by Lusion's level of craft—not a clone of Lusion and not an AI-generated template with colorful animations.
