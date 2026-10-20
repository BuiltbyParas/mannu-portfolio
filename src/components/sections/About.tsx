import { Slot } from "@/components/sculpture/Slot";
import { about } from "@/content/site";
import { Emphasis } from "./Emphasis";

/*
 * Curiosity, on the powder-blue field. The section opens with the passage: a
 * pale band where the paper turns to powder and the 3D scene flies through a
 * field of fine points that gather onto the ribbon (sculpture/passage.ts).
 * Then the statement, word by word, and a thread drawn under its last word
 * that ties a loop of its own; the ribbon loosens into loops in the clearing
 * below and leans toward the pointer while the writing keeps a narrow column.
 * The writing arrives in two slower stages (the lede line by line, then the
 * rest), and the paper of "How I learn" rises into the end of the field.
 */
export function About() {
  const [lede, ...rest] = about.paragraphs;
  return (
    <section id="about" className="section curiosity" aria-labelledby="about-title" tabIndex={-1}>
      <div className="curiosity-passage" aria-hidden="true" />
      <div className="wrap curiosity-grid" data-tone="powder">
        <h2 id="about-title" className="t-statement curiosity-title content" data-reveal="words">
          <Emphasis text={about.heading} />
        </h2>
        <Slot form="curiosity" aspect={1.6} className="curiosity-slot" />
        <div className="curiosity-copy content">
          <p className="t-lede" data-reveal="lede" data-reveal-delay="0.3">
            {lede}
          </p>
          {rest.map((paragraph) => (
            <p className="t-body" key={paragraph} data-reveal="fade" data-reveal-delay="0.85">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="rise rise-paper" aria-hidden="true" />
    </section>
  );
}
