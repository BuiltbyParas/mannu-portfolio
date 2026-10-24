import { chapters, type ChapterId } from "@/content/site";

/**
 * A small index above a section's heading: its number in the page, a short
 * rule and its name, the same names the header uses. It draws itself just
 * ahead of the heading (motion/reveals.ts, data-reveal="index"), so each
 * chapter opens label, heading, then text. Hidden from assistive technology:
 * the heading and the header already say where the visitor is.
 */
export function ChapterMark({ id, className }: { id: ChapterId; className?: string }) {
  const at = chapters.findIndex((chapter) => chapter.id === id);
  if (at < 0) return null;
  return (
    <p className={`chapter-mark content${className ? ` ${className}` : ""}`} data-reveal="index" aria-hidden="true">
      <span className="chapter-num">
        <span>{String(at).padStart(2, "0")}</span>
      </span>
      <span className="chapter-rule" />
      <span className="chapter-name">
        <span>{chapters[at].label}</span>
      </span>
    </p>
  );
}
