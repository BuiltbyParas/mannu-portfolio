# Mannu Portfolio — Awwwards-Inspired Full Redesign & Craft Sprint

## Mission

Completely redesign the existing Mannu portfolio into a distinctive, light-theme, high-craft interactive portfolio inspired by the *quality of execution* found on strong Awwwards-recognized creative websites and the bespoke 3D storytelling of [Lusion](https://lusion.co/).

This is a **redesign of the current project**, not a new unrelated scaffold. Inspect the repository and existing local website first. Preserve valid content and working functionality, then replace the visual direction and weak implementations decisively.

Your role is a combined **creative director, digital art director, UI/UX designer, motion designer, creative frontend developer, 3D web developer, performance engineer, and critical visual reviewer**.

The bar is not “looks modern” or “uses many libraries.” The bar is a coherent, bespoke art direction with unusually good composition, custom visuals, precise motion, strong typography, working interactions, and actual browser-based iteration.

**Do not stop after research, installation, planning, wireframes, or a first coding pass. Implement, inspect, critique, iterate, and test. Do not commit or push.**

---

## 1. What to learn from top creative websites

Study current references before making design decisions. Start with:

1. **Lusion** — https://lusion.co/ and https://lusion.co/about/
   - Study how 3D, motion, typography, transitions, and project storytelling work together.
   - Notice the balance of striking scenes and clear communication.
   - Take inspiration from craftsmanship and narrative, not its exact layout, assets, branding, or copy.
2. **Awwwards galleries** — https://www.awwwards.com/websites/ and https://www.awwwards.com/awwwards/collections/
   - Inspect recent Sites of the Day and portfolio/creative-studio examples that use a **light or bright visual direction**.
   - Do not limit research to a single trendy style. Select references for composition, image treatment, typography, interaction, and scroll storytelling.
3. **Awwwards-style implementation examples** — https://github.com/Z4YT0N/awwwards-collection and https://github.com/Ali-Sanati/awwwards-portfolio
   - Treat these as learning/reference implementations, not production authority and not templates to copy wholesale.
   - Inspect only the relevant files and techniques. Verify package versions and each repository’s license before reusing code or assets.
4. **React Three Fiber examples** — https://github.com/pmndrs/react-three-fiber and https://github.com/pmndrs/drei
   - Study only components and rendering patterns that serve the chosen visual concept.
5. **Lenis** — https://github.com/darkroomengineering/lenis
   - Use its official GSAP/ScrollTrigger integration instructions if Lenis is adopted.
6. **Taste Skill** — https://github.com/Leonxlnx/taste-skill
   - Use for art-direction exploration and its real-browser critique workflow where compatible.
7. **Impeccable** — https://github.com/pbakaus/impeccable
   - Use its UI audit/polish methodology to challenge weak hierarchy, typography, spacing, and AI-default patterns.
8. **Emil Kowalski’s official skills** — https://github.com/emilkowalski/skills
   - Use its design-engineering and animation review guidance for easing, duration, physicality, interruption, performance, and restraint.
9. **Anthropic Frontend Design** — https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design
   - Use its guidance to choose a subject-specific, deliberate visual direction instead of a template-like output.
10. **Figma MCP official guide** — https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server
   - Set up the official integration if available and authorized; use it to ground implementation in frames, variables, layout, and components rather than guessing from memory.

Do not claim that all Awwwards sites use the same technology stack. They do not. The strong results come from concept, art direction, tailored assets, high-quality implementation, testing, and iteration—not from loading every trendy package.

### Reference analysis before coding

Inspect at least three relevant references, preferably one Lusion page and two recent light-theme creative websites. For each, record:

- What makes the first viewport distinctive.
- Layout and typography choices.
- What moves and what stays still.
- How scrolling affects the visual system.
- How imagery, 3D, or illustration supports the story.
- How transitions connect sections.
- How the site handles mobile, legibility, and navigation.

Do not spend all the time browsing. Use research to make a concrete design decision, then build.

---

## 2. Mannu: factual content and purpose

Mannu is a first-year BCA student at Lovely Professional University. She is curious, broad-minded, hardworking, disciplined, and eager to learn. She enjoys mathematical problems, logical reasoning, and basic coding. She is learning C and has earned approximately 45 certificates. She has some early work experience, but the exact details have not yet been provided.

Her portfolio needs to make visitors interested in her potential and learning approach without pretending she already has years of experience.

### Preserve these narrative sections

1. **Hero** — Mannu; “Curious by nature. Disciplined by choice.”; BCA / Lovely Professional University; her existing introductory paragraph; “Explore my learning journey” and “Contact me”.
2. **Curiosity** — the existing copy about looking at problems from different angles, breaking them into smaller steps, and learning patiently.
3. **How I Learn** — Understand → Break it down → Try a solution → Learn from the result.
4. **Foundations in Progress** — C programming; mathematical and logical problem-solving; core computer application concepts; independent learning and study habits. Keep the copy honest that the portfolio will grow as she builds small programs and projects.
5. **Certificates** — explain that she has around 45 certificates; curate only verified entries.
6. **Experience** — keep an honest, designed section ready for her genuine early work experience.
7. **Contact** — invite learning connections and opportunities; WhatsApp and Instagram only when real URLs have been configured.

### Never fabricate

Do not invent any certificate title, issuer, date, badge, certificate image, job, employer, role, project, award, testimonial, metric, phone number, WhatsApp link, or Instagram profile.

Keep content in a centralized, typed data/configuration file. Empty or incomplete entries must be hidden from the public UI. Unconfigured links must not render as active buttons. The site must still look intentional when no certificate/experience data has been entered.

Do not generate a fake portrait of Mannu or imply a stock photo is her. If a portrait is not provided, build the visual identity using typography, custom geometric art, and the 3D scene.

---

## 3. New creative direction: bright, expressive, sculptural

**The overall website must be light. Do not use a dark navy/black site-wide theme.** Dark text can provide contrast, but the page backgrounds should remain predominantly bright.

Create a bespoke visual identity around the idea **“curiosity becomes connection.”** Mathematics and code can inspire the geometry, but the site must not look like a school worksheet, coding dashboard, generic AI landing page, or sci-fi interface.

### Proposed starting palette

Treat these as design direction, not rigid colors to use everywhere. Tune them for visual harmony and WCAG contrast:

- Porcelain / warm white background: `#F7F7F2`
- Bright paper white: `#FFFFFF`
- Soft powder blue: `#DCE7FF`
- Electric ultramarine: `#3657F5`
- Fresh citron accent: `#D6F36A`
- Warm coral accent used sparingly: `#FF806B`
- Deep ink for readable text: `#20232B`
- Muted text: a contrast-safe slate such as `#626978`

Use broad light surfaces and selective large color fields, not just white background with tiny colored details. The color should be part of the composition and the 3D art direction. Avoid a generic purple gradient, cookie-cutter beige serif aesthetic, or default pastel blob treatment.

### Typography

Select typography deliberately for Mannu’s story. Use one characterful display family plus one highly readable text family; add monospace only for genuinely meaningful small code/math details. Use `clamp()` for responsive headings and establish a real type scale, line heights, weights, and measure.

Do not default to oversized serif typography in every section. Mix expressive typography with quieter, precise sans-serif body text. Typography must help create hierarchy and rhythm—not overpower the content.

### Composition

- Create distinct section compositions instead of repeating the same two-column layout seven times.
- Use strong alignment, asymmetry, layered typography, generous but purposeful negative space, image/visual scale, and clear reading order.
- Use large visual forms where they deserve the space; do not fill every gap with meaningless decoration.
- Build a distinctive hero with a memorable visual hook.
- Create visual change from section to section while maintaining one identity.
- Make mobile feel art-directed, not like a compressed desktop design.

### Explicit anti-patterns

Do not deliver:

- A basic centered title, paragraph, two buttons, and a generic floating orb.
- A dark site with a light accent, or the previous dark background with new text colors.
- The same constellation of dots repeated behind all sections.
- A set of seven identical cards/sections.
- An off-the-shelf dashboard, generic glassmorphism, random gradients, or gratuitous rounded panels.
- Fake project galleries or blank placeholder cards.
- A loading screen that delays useful content.
- A custom cursor or autoplay effects that make normal navigation harder.
- A visually loud site whose text becomes hard to read.

---

## 4. Signature idea: a custom “thinking sculpture”

Create one memorable visual system that has the quality of a designed digital sculpture rather than a conventional particle background.

Explore a 3D object made from interlocking geometric paths, folded ribbons, connected mathematical nodes, translucent colored surfaces, or carefully constructed organic geometry. Choose **one coherent concept** after researching references. Do not combine every idea at once.

The sculpture should feel tactile, dimensional, and composed: thoughtful silhouette, clear focal point, intentional lighting/materials, pleasing motion, and a restrained palette drawn from the light design system. Avoid a generic rotating planet, stock 3D asset, randomly spinning torus, or endless particle cloud.

Use a real Three.js scene if it creates a significant benefit. In a React project, React Three Fiber plus Drei may be appropriate, but use the simplest valid setup. Do not add both R3F and a parallel hand-managed renderer for the same job.

### The sculpture’s narrative states

- **Hero: possibility.** A compact but striking form enters the composition. It has enough depth to reward attention but leaves space for the name, tagline, and actions.
- **Curiosity: exploration.** A few forms or connections separate and respond subtly to scroll/pointer movement.
- **How I Learn: connection.** The visual transforms through the four stages. Pathways clarify; components align; the sculpture becomes more organized as the reasoning process progresses.
- **Foundations: structure.** The form resolves into a cleaner arrangement, visually supporting the idea of foundations.
- **Certificates and experience: focus.** Reduce scene movement so the genuine evidence/content takes priority.
- **Contact: resolution.** The visual resolves into a memorable calm state; contact actions remain obvious.

Use scroll progress to drive only the states that need it. Use a small number of high-quality transitions instead of animating everything.

### Accessibility and fallback

The narrative must work without WebGL. Provide a still SVG/CSS fallback; honor `prefers-reduced-motion`; reduce effects for mobile and low-power devices; cap renderer pixel ratio; avoid expensive post-processing and unnecessarily continuous rendering; clean up GPU resources, event listeners, timelines, and observers.

Do not introduce custom shaders, raymarching, post-processing stacks, WebGPU, or heavy 3D effects unless the design absolutely needs them and the performance budget supports them.

---

## 5. Tooling and skills: install what the work actually needs

First inspect the project and current environment:

- Read `package.json`, the lockfile, framework setup, Node/npm/pnpm version, and current dependencies.
- Inspect the current page in the browser before changing it and capture baseline screenshots if possible.
- Determine whether Claude Code can access Figma MCP, a browser, Playwright, Chrome/Chromium, or existing screenshot tools.
- Identify already-installed Claude skills/plugins before adding duplicates.
- Do not delete lockfiles, change package managers, upgrade the entire dependency tree, or overwrite project configuration without a clear reason.

### Agent skills to use

Use the official installation methods, check the current instructions in each upstream repository, and install the following if they are absent and compatible:

1. **Anthropic Frontend Design** (official) — https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design
2. **Impeccable** — https://github.com/pbakaus/impeccable
3. **Taste Skill** — https://github.com/Leonxlnx/taste-skill
4. **Emil Kowalski’s skills** — https://github.com/emilkowalski/skills

Useful installation paths (verify current repository instructions before executing; do not assume a command succeeded without checking):

```bash
# Official Claude Code frontend-design plugin; run in terminal if supported
claude plugin install frontend-design@claude-plugins-official

# Impeccable: use the project-root installer and then initialize it in Claude Code
npx impeccable install
# In Claude Code, run its /impeccable init command if available

# Taste Skill: current default frontend-art-direction skill
npx skills@latest add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

# Emil Kowalski's design-engineering skill
npx skills@latest add emilkowalski/skills --skill emil-design-eng

# Optional targeted Emil skills for animation creation/review if the CLI supports them
npx skills@latest add emilkowalski/skills --skill animate
npx skills@latest add emilkowalski/skills --skill review-animations
```

Restart or reload Claude Code as required. Verify that each intended skill is actually available. If a command fails, inspect the upstream instructions and report the issue; do not silently replace it with an unrelated fork.

Skills overlap by design. Use them as different lenses rather than running every command in every skill. Taste should lead visual direction and browser critique; Anthropic Frontend Design should enforce subject-specific originality; Impeccable should audit hierarchy/spacing/accessibility; Emil’s skills should review motion. Resolve conflicting advice in favor of the selected creative direction, accessibility, performance, and clarity.

### Figma integration

Use the **official Figma MCP server** if the user has a Figma account and authorizes access. Follow the official setup guide: https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server

The official remote setup can be installed from a terminal with:

```bash
claude plugin install figma@claude-plugins-official
```

Then restart Claude Code, authenticate in the browser, and verify connection according to Figma’s current instructions. Do not pretend to have Figma access if authentication is absent.

If connected:

1. Establish the visual direction and design tokens first.
2. Create or refine high-fidelity frames for desktop (1440 × 900) and mobile (390 × 844), focusing on hero, learning sequence, one content-heavy section, and contact.
3. Define reusable typography, spacing, color, and layout variables/components where practical.
4. Use Figma MCP to read the actual frames/layout/components and translate them into the existing frontend system.
5. Compare implementation screenshots against those designs and refine discrepancies.

If Figma is unavailable, do not block the redesign. Produce a clear written design spec and component/layout map in the repository, then implement from that. State that Figma integration was not available; never claim it was used.

### Runtime dependencies: select a coherent stack

Preserve the existing framework where practical. For the current React/Next.js project, the preferred stack should be:

- Existing Next.js + React + TypeScript.
- Existing CSS approach or Tailwind, depending on what is already configured and genuinely helps.
- GSAP + ScrollTrigger for large scroll-linked narrative animations.
- Lenis only if it can be integrated cleanly and improves the intended scroll feel.
- Three.js or React Three Fiber + Drei for the one custom visual scene, if the scene materially improves the art direction.
- CSS/SVG for typography, shapes, interface transitions, and fallback visuals.
- Playwright or the environment’s existing browser tools for screenshot and responsive checks if no working visual-inspection workflow exists.

Install dependencies only after the design needs are established. Check current official docs and compatibility first; then use the project's existing package manager.

Rules:

- Do not add Framer Motion/Motion if GSAP already covers the page’s needed complex animation, unless a specific component benefits and the two libraries will not overlap awkwardly.
- Do not add Lenis just to claim smooth scrolling. If used, integrate it with ScrollTrigger according to https://github.com/darkroomengineering/lenis and test keyboard navigation, anchors, browser back/forward, mobile touch, and reduced-motion behavior. Preserve native scrolling if Lenis causes regressions.
- Do not use a huge component library for the whole visual language. The signature elements should be custom-designed.
- Do not install every tool listed in an online “Awwwards stack.” No universal stack exists.
- Check package licenses and repository maintenance before adopting code.

---

## 6. Motion design standards

Use motion to make the narrative clearer and the interaction feel polished—not to show off that the page is animated.

- Hero reveal: typography, visual form, and CTAs should enter in one carefully timed sequence.
- Scene progression: scroll changes the scene’s composition meaningfully; it must not simply rotate continuously.
- Section reveals: vary treatments where the content warrants it; avoid the same fade-up on every item.
- Buttons: crisp hover, focus, pressed, and disabled states.
- Navigation: subtle and reliable; no complicated cursor effects that impair usability.
- Motion timing and easing: apply Emil’s motion review principles and define a small shared motion system.
- Lenis and ScrollTrigger: use one coordinated scroll architecture, not duplicate animation frames or competing smooth-scroll systems.
- Motion cleanup: clean up GSAP contexts, ScrollTriggers, RAF loops, pointer listeners, ResizeObservers, and WebGL resources correctly.
- `prefers-reduced-motion`: stop nonessential movement and provide static compositions while keeping all content/action available.

Do not hijack wheel/touch input, force horizontal scrolling, use global scroll snapping, or pin long sections. Keep normal vertical scrolling comfortable and functional.

---

## 7. Whole-site structure and visual rhythm

Keep the content story, but fully re-art-direct every section. Do not merely change the background color of the existing design.

### Hero

Create an unforgettable first viewport using a strong type composition and the custom visual sculpture. Avoid the generic “title left / floating 3D orb right” layout unless the final composition makes that arrangement genuinely distinctive. Keep the opening content immediately readable. Use clear primary and secondary actions.

### Curiosity

Change the visual rhythm and composition. Give the writing space and use the sculpture/graphics to support the theme of exploring a question. Do not repeat the hero layout.

### How I Learn

Make this the primary scroll-driven visual payoff. The four stages need a clear active state, a strong visual transformation, and readable text. The sequence should feel tied to the logic of the content, not an arbitrary timeline.

### Foundations

Use typography and structured graphic elements to show current learning areas without fake percentages or proficiency bars. Maintain visual interest without clutter.

### Certificates

Only display genuine entries. Build a beautiful curated composition that can expand as real data is added. Avoid fake certificate thumbnails or repetitive empty cards.

### Experience

Keep the section compelling but factual. Do not invent employers, roles, dates, or achievements. If data is empty, show designed introductory copy without empty fake entries.

### Contact

Use a memorable concluding composition and simple, clear actions. Render WhatsApp/Instagram only when their real URLs are configured.

---

## 8. Browser-first visual iteration: required, not optional when tools are available

A successful build is not proof of a successful design. Use actual screenshots and inspect them.

### Before changes

- Run the site using its existing workflow.
- Capture baseline screenshots at desktop and mobile sizes if possible.
- Identify the five biggest visual weaknesses, including any clipping/overlap.

### After the redesign

Use the available browser tooling. If necessary and compatible with the project, configure Playwright/Chromium for screenshot capture. Do not download multiple browsers unnecessarily. If no supported browser automation is possible, use an available local browser preview and describe the limitation honestly.

Inspect at minimum:

- Desktop: 1440 × 900.
- Mobile: 390 × 844.
- An intermediate/tablet width if possible.

For each iteration:

1. Capture the real rendered page.
2. Inspect the screenshots and test scrolling/interactions.
3. List the three highest-impact design defects.
4. Fix those defects in code.
5. Capture the screenshots again.

Do at least **two meaningful inspect → critique → fix rounds** after the first complete implementation whenever browser inspection is available. The later pass should target the biggest remaining defects, not tiny decoration.

Look for:

- A distinctive first screen with a clear focal point.
- Balanced scale, margins, and readable hierarchy.
- No large accidental blank areas or sections pushed inexplicably to one side.
- No clipped headings, content hidden under navigation, awkward line breaks, or horizontal overflow.
- The light palette remains light across the page.
- Every section has a distinct purpose and composition.
- The visual scene adds meaning and does not obscure copy or controls.
- Scroll-linked motion has a visible payoff but does not make scrolling tedious.
- Mobile uses purposeful reflow and reduced 3D complexity.
- Real content and links are accessible.

Use Impeccable and Emil’s animation review guidance for critique where available, but do not mistake running a skill command for actual verification. Review the rendered result with your own visual judgment too.

---

## 9. Accessibility, performance, and quality assurance

### Accessibility

- Use semantic HTML and real selectable text.
- All navigation and controls work with keyboard input and have visible focus states.
- Maintain adequate contrast on the light surfaces.
- Provide meaningful accessible labels.
- No critical content depends on hover, WebGL, animation, or color alone.
- Respect reduced-motion preferences.
- Avoid scroll libraries that trap focus or break in-page anchors.

### Performance

- Optimize textures, model geometry, and any images/video.
- Prefer compressed and correctly sized assets.
- Lazy-load nonessential media and the 3D scene when practical.
- Cap device pixel ratio, reduce particles/geometry on mobile, and avoid expensive post-processing unless visually necessary.
- Keep frame work light and clean up WebGL resources.
- No multi-megabyte hero video unless it is essential, optimized, and has a fallback.
- No persistent loader; render essential content immediately.
- Check for layout shifts and avoid loading fonts in ways that cause the layout to jump.

### Run real checks

Run all applicable commands available in the existing project:

- Development server startup.
- Production build.
- Type-check.
- Lint.
- Tests.
- Browser/screenshot checks.

Fix errors introduced by your changes. Report pre-existing errors separately. Never report a command as passed unless it was executed and passed. Do not claim a performance score or test coverage unless it was actually measured.

---

## 10. Definition of done

The task is done only when:

1. The overall site is predominantly light and visually distinct from the previous dark design.
2. The site has a custom, considered art direction rather than a generic website template.
3. The hero has a memorable visual centerpiece tied to Mannu’s actual story.
4. Scroll-linked motion meaningfully transforms the visual system through the learning narrative.
5. The seven sections have varied composition and strong typographic hierarchy.
6. All content remains factual and all editable data is centralized.
7. Figma is used if available and authorized; otherwise a documented design spec is used, with the limitation reported honestly.
8. Required skills are installed/verified when possible, and redundant/conflicting tools are avoided.
9. The page works on desktop and mobile, honors reduced motion, and has a usable fallback for WebGL.
10. Actual screenshots have been reviewed and at least two critique/fix iterations have been completed where browser tools permit.
11. Build, lint, type-check, tests, and browser checks have been run where available, and outcomes are reported accurately.
12. No commits or pushes have been made.

### Final report to the user

Finish with a concise but precise report stating:

- What changed visually and technically.
- Which skills/plugins were actually installed and verified.
- Which dependencies were added and why.
- Whether Figma MCP was connected and used.
- Which viewport screenshots were actually inspected.
- How many visual critique/fix rounds were completed.
- Which build/lint/type/test commands passed or failed.
- Any remaining blockers or information Mannu needs to supply.

**Creative principle:** Awwwards-level work is not an inventory of effects. It is a focused concept brought to life through design, carefully chosen technology, original assets, polished motion, and repeated critique. Build the experience around that principle. Make deliberate decisions, then prove them in the browser.
