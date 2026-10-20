# Product

<!-- impeccable:product-schema 1 -->

> Inferred from `Mannu_Light_Lusion_Design_Redesign_Prompt.md`, then `Mannu_Awwwards_Level_Redesign_Brief.md`,
> and the existing site on 2026-10-20.
> The brief told the agent to proceed without an interview, so no fact below was confirmed in
> conversation. Lines marked _(inferred)_ are readings of the brief, not answers.

## Platform

web

## Users

- Primary: people meeting Mannu for the first time through a shared link: teachers, classmates,
  people offering internships or early work, and anyone she contacts on WhatsApp or Instagram.
  They are deciding whether she is curious, disciplined and worth a conversation. _(inferred)_
- Mannu herself, who will keep editing the content as certificates, projects and experience
  arrive.

## Product Purpose

A single-page portfolio for Mannu, a first-year BCA student at Lovely Professional University.
It tells an honest story: curiosity, built one problem at a time. Success is a visitor who
understands within one screen who she is and how she learns, and knows how to reach her.

## Positioning

Not a showcase of finished work: she is at the beginning. The site's claim is her method
(understand, break it down, try a solution, learn from the result) and the discipline behind it,
which a neighbouring student portfolio stuffed with skill bars cannot truthfully copy.

## Operating Context

- Mostly opened on phones from a link in a chat or profile; also on laptops. _(inferred)_
- Content lives in `src/content/site.ts`; incomplete entries are hidden by `src/content/publish.ts`.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, GSAP. Static, prerendered.
- Seven sections in a fixed order with fixed ids: `top`, `about`, `how-i-learn`, `foundations`,
  `certificates`, `experience`, `contact`.
- Copy for every section is fixed by the brief and must not be rewritten into new claims.
- Contact links (WhatsApp, Instagram), certificate entries and experience entries are empty until
  Mannu supplies them; each appears only when complete and valid.

## Brand Commitments

- Name: Mannu. Context line: BCA student, Lovely Professional University.
- Guiding line: “Curiosity, built one problem at a time.”
- Hero lines: “Curious by nature. Disciplined by choice.”
- The brief pins a predominantly light theme (no dark navy/black page), an ultramarine brand colour
  with citron and a sparing coral, and one custom 3D visual system: “The Thread”, a two-tone ribbon
  (see docs/design-direction.md). Guiding idea: curiosity becomes connection.

## Evidence on Hand

- Real: name, university, year of study, the introduction and section copy in the brief, the
  approximate certificate count (“around 45”), and the four current foundations.
- Absent and never to be fabricated: certificate titles/issuers/links/images, employers, roles,
  dates, projects, contact URLs, photos of Mannu, testimonials, metrics, skill ratings.

## Product Principles

1. Honesty over impressiveness: show the beginning as a beginning.
2. The method is the proof: how she approaches a problem is the centrepiece.
3. Every section stays readable and usable without animation or WebGL.
4. Empty data is hidden or framed as “in progress”, never filled with stand-ins.

## Accessibility & Inclusion

WCAG 2.2 AA contrast, keyboard access with visible focus, a skip link, semantic landmarks, and
`prefers-reduced-motion` honoured in CSS, GSAP, smooth scrolling and the 3D scene. _(inferred
from the brief)_
