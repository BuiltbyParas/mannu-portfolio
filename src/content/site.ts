/*
 * Mannu's portfolio — every word and link on the site lives in this file.
 * ──────────────────────────────────────────────────────────────────────
 *
 * How to edit:
 *  - Only add real information. Nothing here is generated or filled in for you.
 *  - Entries with missing required fields are automatically hidden, so it is
 *    safe to leave a half-finished entry in place while you collect details.
 *  - Every link must be a full https:// URL. Anything else is ignored.
 *  - Images go in /public (for example /public/certificates/…) and are
 *    referenced with a path that starts with "/".
 */

/* ── Types ─────────────────────────────────────────────────────────── */

export type Certificate = {
  /** Required. The title exactly as it appears on the certificate. */
  title: string;
  /** Required. The organisation that issued it. */
  issuer: string;
  /** Optional. Completion date as it should read, e.g. "March 2026". */
  date?: string;
  /** Optional. Official verification page (https). Preferred over `image`. */
  url?: string;
  /** Optional. Authentic scan in /public, e.g. "/certificates/c-basics.jpg". */
  image?: string;
  /** Optional. Featured certificates are listed first. */
  featured?: boolean;
};

export type Experience = {
  /** Required. Role or activity, e.g. "Volunteer" or "Part-time assistant". */
  role: string;
  /** Required. Where it happened. */
  organization: string;
  /** Optional. Start date as it should read, e.g. "June 2026". */
  start?: string;
  /** Optional. End date. Leave empty if it is ongoing or a single date. */
  end?: string;
  /** Optional. One or two sentences on what Mannu contributed or learned. */
  summary?: string;
  /** Optional. A relevant https link. */
  link?: string;
};

export type Project = {
  /** Required. Project name. */
  title: string;
  /** Required. What it does and what it taught her, in a sentence or two. */
  summary: string;
  /** Optional. e.g. "2026". */
  year?: string;
  /** Optional. e.g. ["C"]. */
  tools?: string[];
  /** Optional. Source code (https). */
  codeUrl?: string;
  /** Optional. Live demo (https). */
  liveUrl?: string;
};

export type ContactConfig = {
  /**
   * WhatsApp click-to-chat link, e.g. "https://wa.me/<country code><number>".
   * Leave as "" to hide the WhatsApp button.
   */
  whatsappUrl: string;
  /**
   * Instagram profile link, e.g. "https://www.instagram.com/<username>/".
   * Leave as "" to hide the Instagram button.
   */
  instagramUrl: string;
};

/* ── Contact ───────────────────────────────────────────────────────── */

// TODO(Mannu): add your real links. Buttons only appear once a valid URL is set.
export const contact: ContactConfig = {
  whatsappUrl: "",
  instagramUrl: "",
};

/* ── Certificates ──────────────────────────────────────────────────── */

/** Shown in the copy as "around 45". Update as the collection grows. */
export const approximateCertificateCount = 45;

// TODO(Mannu): replace these blank entries with real certificates.
// Blank entries are hidden; an entry appears once it has a title AND an issuer.
export const certificates: Certificate[] = [
  { title: "", issuer: "", date: "", url: "", image: "", featured: true },
  { title: "", issuer: "", date: "", url: "", image: "", featured: true },
  { title: "", issuer: "", date: "", url: "", image: "", featured: true },
];

/* ── Experience ────────────────────────────────────────────────────── */

// TODO(Mannu): add early work experience. An entry appears once it has a role
// AND an organisation. List the most recent first.
export const experience: Experience[] = [
  { role: "", organization: "", start: "", end: "", summary: "", link: "" },
];

/* ── Projects ──────────────────────────────────────────────────────── */

// TODO(Mannu): add programs and projects as they are built. A project appears
// once it has a title AND a summary.
export const projects: Project[] = [
  { title: "", summary: "", year: "", tools: [], codeUrl: "", liveUrl: "" },
];

/* ── Page copy ─────────────────────────────────────────────────────── */

export const profile = {
  name: "Mannu",
  /** Rendered in capitals by CSS, so screen readers still read real words. */
  context: ["BCA student", "Lovely Professional University"],
  tagline: ["Curious by nature.", "Disciplined by choice."],
  introduction:
    "I’m Mannu, a first-year BCA student at Lovely Professional University. I’m interested in the way mathematics and code turn questions into solutions. Right now, I’m strengthening my programming foundations in C, practicing problem-solving, and learning something new whenever I can.",
  signOff: "Curiosity, built one problem at a time.",
};

export const about = {
  heading: "A mind that keeps asking questions.",
  paragraphs: [
    "I’ve always been curious about how things work. I enjoy looking at a problem from different angles, breaking it into smaller steps, and working through it patiently.",
    "That curiosity leads me from mathematical problems to coding exercises and new topics I want to understand. I’m still at the beginning of my journey, but I bring focus, discipline, and a willingness to keep improving.",
  ],
};

export const method = {
  heading: "Every difficult problem has a starting point.",
  intro:
    "I like understanding a problem before rushing toward an answer. Whether I’m working through a mathematical question or practicing C programming, I try to break the challenge into manageable steps and learn from the result.",
  stages: [
    { title: "Understand", body: "Start by asking what the problem is actually asking." },
    { title: "Break it down", body: "Separate the challenge into smaller, more manageable parts." },
    { title: "Try a solution", body: "Apply logic, test an approach, and work through the steps." },
    {
      title: "Learn from the result",
      body: "Review what worked, understand what did not, and improve the next attempt.",
    },
  ],
};

export const foundations = {
  heading: "Strong foundations. Room to grow.",
  intro:
    "My portfolio is at the beginning, just like my BCA journey. As I build small programs and projects, I’ll share the ones that best show what I’m learning and how I approach a problem.",
  items: [
    {
      name: "C programming",
      note: "The language I’m learning now, one small program at a time.",
      code: "#include <stdio.h>",
    },
    {
      name: "Mathematical and logical problem-solving",
      note: "Working through a problem step by step until the reasoning holds.",
    },
    {
      name: "Core computer application concepts",
      note: "The groundwork of my BCA coursework.",
    },
    {
      name: "Independent learning and study habits",
      note: "Consistent study, and picking up new subjects on my own.",
    },
  ],
};

export const certificatesSection = {
  heading: "A record of curiosity.",
  paragraphs: [
    `I’ve earned around ${approximateCertificateCount} certificates through my learning journey. Each one represents time spent exploring a topic and building my knowledge.`,
    "Rather than listing every certificate at once, I’ll feature a few that are most relevant to my interests and current goals.",
  ],
};

export const experienceSection = {
  heading: "Learning beyond the classroom.",
  intro:
    "Alongside my studies, I’ve had some early work experiences. They’re helping me understand how I learn and contribute in practical settings.",
};

export const contactSection = {
  heading: "Every journey starts with a conversation.",
  intro:
    "I’m open to learning, meeting people who enjoy solving problems, and exploring new opportunities.",
};

/* ── Chapters (navigation + section ids) ──────────────────────────── */

/** Order matters: it drives the section numbers and the constellation. */
export const chapters = [
  { id: "top", label: "Opening" },
  { id: "about", label: "About" },
  { id: "how-i-learn", label: "How I learn" },
  { id: "foundations", label: "Foundations" },
  { id: "certificates", label: "Certificates" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
