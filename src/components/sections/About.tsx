import { ChapterMark } from "@/components/ChapterMark";
import { Slot } from "@/components/sculpture/Slot";
import { OPENING } from "@/components/sculpture/scenery";
import { about } from "@/content/site";
import { Emphasis } from "./Emphasis";

/*
 * Curiosity, on the powder-blue field: the statement, the ribbon loosened into
 * loops in the clearing below it (leaning toward the pointer), and the
 * writing in a narrow column beside them.
 *
 * Large screens: it is the second state of the opening's stage
 * (sections/Opening.tsx). The opening's words step back, the view
 * travels on through the world and the sky turns to powder, and Curiosity
 * arrives in place, all on one scroll: its label, the statement line by line
 * out of masks, the thread under "questions.", then the paragraphs in groups
 * of lines (motion/opening.ts). `data-stage-at` is the moment links to
 * #about land on (sculpture/scenery.ts, OPENING.settled).
 *
 * Small screens and reduced motion: the section follows the opening in the
 * page. It opens with the passage, a pale band where the paper turns to
 * powder and the 3D scene flies through a field of fine points that gather
 * onto the ribbon (sculpture/passage.ts); the statement rises line by line
 * into the thread under its last word, and the writing arrives in two slower
 * stages (motion/reveals.ts). Either way the paper of "How I learn" rises into
 * the end of the field.
 */
export function About() {
  const [lede, ...rest] = about.paragraphs;
  return (
    <section id="about" className="section curiosity" aria-labelledby="about-title" tabIndex={-1} data-stage-at={OPENING.settled}>
      <div className="curiosity-passage" aria-hidden="true" />
      <div className="wrap curiosity-grid" data-tone="powder">
        <ChapterMark id="about" className="curiosity-mark" />
        <h2 id="about-title" className="t-statement curiosity-title content" data-reveal="question">
          <Emphasis text={about.heading} />
        </h2>
        <Slot form="curiosity" aspect={1.6} className="curiosity-slot" live stageAt={1} />
        <div className="curiosity-copy content">
          <p className="t-lede" data-reveal="lede" data-reveal-delay="0.35">
            {lede}
          </p>
          {rest.map((paragraph) => (
            <p className="t-body" key={paragraph} data-reveal="lede" data-reveal-delay="0.9">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="rise rise-paper" aria-hidden="true" />
    </section>
  );
}
