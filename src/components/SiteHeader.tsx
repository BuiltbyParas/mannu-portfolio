"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { PillLabel } from "@/components/PillLabel";
import { chapters, profile, type ChapterId } from "@/content/site";
import { holdScroll, scrollToElement } from "@/lib/lenis";
import { STAGE_CHAPTER } from "@/lib/stage";

const NAV = chapters.filter((c) => c.id !== "top" && c.id !== "contact");
// Everything focusable outside the menu, including the skip link, goes inert while it is open.
const BACKGROUND = ["skip-link", "main", "site-footer", "site-header"];

type Tone = "paper" | "powder" | "citron" | "white" | "ultra";

/**
 * Compact fixed header. It marks the section being read, turns into a solid
 * sheet once the page has scrolled, takes the colour of the field beneath it
 * (`data-tone` zones: powder, citron, white, ultramarine) so it never sits as a
 * grey band over a coloured section, and on small screens opens a full-screen
 * menu that behaves like a modal dialog (focus moves in, the page behind is
 * inert and still, Escape closes it, focus returns to the toggle).
 */
export function SiteHeader() {
  const [active, setActive] = useState<ChapterId>("top");
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<Tone>("paper");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Where the opening's stage holds still, its two sections both fill that band; the stage then
    // says which one is showing (its `data-chapter`, and an event when that changes; lib/stage.ts).
    const chapterOf = (section: Element) => ((section.closest<HTMLElement>("[data-chapter]")?.dataset.chapter ?? section.id) as ChapterId);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(chapterOf(entry.target));
      },
      // A thin band across the middle of the viewport decides the current section.
      { rootMargin: "-45% 0px -54% 0px" },
    );
    chapters.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    const onStage = (event: Event) => {
      const id = (event as CustomEvent<ChapterId | null>).detail;
      if (id) setActive(id);
    };
    window.addEventListener(STAGE_CHAPTER, onStage);
    return () => {
      observer.disconnect();
      window.removeEventListener(STAGE_CHAPTER, onStage);
    };
  }, []);

  useEffect(() => {
    // The zone under the header's own band decides its colour; later zones win where they meet.
    const zones = Array.from(document.querySelectorAll<HTMLElement>("#main [data-tone], #site-footer[data-tone]"));
    const under = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) under.add(entry.target);
          else under.delete(entry.target);
        }
        let next: Tone = "paper";
        for (const zone of zones) if (under.has(zone)) next = zone.dataset.tone as Tone;
        setTone(next);
      },
      { rootMargin: "0px 0px -93% 0px" },
    );
    zones.forEach((zone) => observer.observe(zone));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const background = BACKGROUND.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    background.forEach((el) => (el.inert = true));
    document.documentElement.classList.add("menu-open");
    holdScroll(true);
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      background.forEach((el) => (el.inert = false));
      document.documentElement.classList.remove("menu-open");
      holdScroll(false);
      toggle?.focus();
    };
  }, [open]);

  // Menu links close the menu first (restoring page scroll), then travel.
  const travel = (id: ChapterId) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      scrollToElement(target);
      target.focus({ preventScroll: true });
      history.replaceState(null, "", `#${id}`);
    });
  };

  return (
    <>
      <span ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
      <a id="skip-link" className="skip-link" href="#main">
        Skip to content
      </a>
      <header id="site-header" className="site-header" data-scrolled={scrolled ? "" : undefined} data-tone={tone} data-intro="header">
        <div className="wrap site-bar">
          <a className="wordmark" href="#top">
            {profile.name}
            <span className="sr-only"> (back to top)</span>
          </a>
          <nav className="site-nav" aria-label="Sections">
            <ul>
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <a className="nav-link" href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="button button-secondary button-small nav-contact" href="#contact" aria-current={active === "contact" ? "true" : undefined}>
            <PillLabel>Contact</PillLabel>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="button button-secondary button-small menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <PillLabel>Menu</PillLabel>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        ref={panelRef}
        className="menu-panel"
        data-open={open ? "" : undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="wrap menu-bar">
          <span className="wordmark" aria-hidden="true">
            {profile.name}
          </span>
          <button type="button" className="button button-secondary button-small" onClick={() => setOpen(false)}>
            <PillLabel>Close</PillLabel>
          </button>
        </div>
        <nav className="wrap menu-nav" aria-label="Sections">
          <ul className="menu-list">
            {chapters.map(({ id, label }, i) => (
              <li className="menu-item" key={id} style={{ "--i": i } as CSSProperties}>
                <a
                  className="menu-link"
                  href={`#${id}`}
                  onClick={travel(id)}
                  aria-current={active === id ? "true" : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
