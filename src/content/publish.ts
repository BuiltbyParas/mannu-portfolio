/*
 * Publishing rules for the content in site.ts.
 *
 * The site never shows a half-filled entry or an unverified link: these
 * helpers decide what is complete enough to appear. They are pure functions
 * (no imports at runtime) so they can be unit-tested with `npm test`.
 */

import type { Certificate, ContactConfig, Experience, Project } from "./site";

const filled = (value: string | undefined | null): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** Returns a normalised https URL, or null if the value is empty or unsafe. */
export function safeExternalUrl(value: string | undefined, allowedHosts?: readonly string[]) {
  if (!filled(value)) return null;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (allowedHosts && !allowedHosts.includes(url.hostname.toLowerCase())) return null;
  return url.toString();
}

/** Only local images from /public are accepted, e.g. "/certificates/c.jpg". */
export function safeLocalImage(value: string | undefined) {
  if (!filled(value)) return null;
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("..")) return null;
  return /\.(avif|webp|png|jpe?g)$/i.test(path) ? path : null;
}

const WHATSAPP_HOSTS = ["wa.me", "api.whatsapp.com", "whatsapp.com", "www.whatsapp.com"];
const INSTAGRAM_HOSTS = ["instagram.com", "www.instagram.com"];

export function whatsappHref(value: string | undefined) {
  const href = safeExternalUrl(value, WHATSAPP_HOSTS);
  if (!href) return null;
  const url = new URL(href);
  // wa.me links must include a number; api.whatsapp.com links use ?phone=
  if (url.hostname === "wa.me") return /^\/\d{6,15}\/?$/.test(url.pathname) ? href : null;
  return url.searchParams.has("phone") || url.pathname.length > 1 ? href : null;
}

export function instagramHref(value: string | undefined) {
  const href = safeExternalUrl(value, INSTAGRAM_HOSTS);
  if (!href) return null;
  // A profile link has exactly one path segment: the username.
  return /^\/[A-Za-z0-9._]{1,30}\/?$/.test(new URL(href).pathname) ? href : null;
}

export type ContactAction = { id: "whatsapp" | "instagram"; label: string; href: string };

export function contactActions(config: ContactConfig): ContactAction[] {
  const actions: ContactAction[] = [];
  const whatsapp = whatsappHref(config.whatsappUrl);
  if (whatsapp) actions.push({ id: "whatsapp", label: "Message me on WhatsApp", href: whatsapp });
  const instagram = instagramHref(config.instagramUrl);
  if (instagram) actions.push({ id: "instagram", label: "Find me on Instagram", href: instagram });
  return actions;
}

export type PublishedCertificate = {
  title: string;
  issuer: string;
  date: string | null;
  /** Where the entry links to: the verification page, else the authentic image. */
  href: string | null;
  image: string | null;
  featured: boolean;
};

/** How many certificates show before the "Show all" control. */
export const FEATURED_CERTIFICATE_LIMIT = 4;

export function publishCertificates(list: readonly Certificate[]) {
  const complete: PublishedCertificate[] = list
    .filter((c) => filled(c.title) && filled(c.issuer))
    .map((c) => {
      const image = safeLocalImage(c.image);
      return {
        title: c.title.trim(),
        issuer: c.issuer.trim(),
        date: filled(c.date) ? c.date.trim() : null,
        href: safeExternalUrl(c.url) ?? image,
        image,
        featured: Boolean(c.featured),
      };
    });
  // Featured first; otherwise keep the order they were written in.
  const ordered = [...complete.filter((c) => c.featured), ...complete.filter((c) => !c.featured)];
  return {
    featured: ordered.slice(0, FEATURED_CERTIFICATE_LIMIT),
    more: ordered.slice(FEATURED_CERTIFICATE_LIMIT),
  };
}

export type PublishedExperience = {
  role: string;
  organization: string;
  period: string | null;
  summary: string | null;
  href: string | null;
};

export function publishExperience(list: readonly Experience[]): PublishedExperience[] {
  return list
    .filter((e) => filled(e.role) && filled(e.organization))
    .map((e) => {
      const start = filled(e.start) ? e.start.trim() : null;
      const end = filled(e.end) ? e.end.trim() : null;
      return {
        role: e.role.trim(),
        organization: e.organization.trim(),
        period: start && end ? `${start} - ${end}` : (start ?? end),
        summary: filled(e.summary) ? e.summary.trim() : null,
        href: safeExternalUrl(e.link),
      };
    });
}

export type PublishedProject = {
  title: string;
  summary: string;
  year: string | null;
  tools: string[];
  codeHref: string | null;
  liveHref: string | null;
};

export function publishProjects(list: readonly Project[]): PublishedProject[] {
  return list
    .filter((p) => filled(p.title) && filled(p.summary))
    .map((p) => ({
      title: p.title.trim(),
      summary: p.summary.trim(),
      year: filled(p.year) ? p.year.trim() : null,
      tools: (p.tools ?? []).filter(filled).map((t) => t.trim()),
      codeHref: safeExternalUrl(p.codeUrl),
      liveHref: safeExternalUrl(p.liveUrl),
    }));
}
