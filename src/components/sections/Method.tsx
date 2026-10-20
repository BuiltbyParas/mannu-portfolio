import { RibbonSVG } from "@/components/sculpture/RibbonSVG";
import { Slot } from "@/components/sculpture/Slot";
import type { FormId } from "@/components/sculpture/forms";
import { method } from "@/content/site";

/*
 * How I learn: the page's main scroll-driven moment.
 *
 * Large screens (with scripts): the ribbon holds one sticky box beside the
 * stages and transforms in place as each stage reaches the middle of the
 * screen: an open ring, the ring cut into four parts, the parts tried as steps
 * (one out of line), and finally one smooth knot, which turns once when it
 * closes. Each stage's anchor tells the ribbon when its form is on stage; the
 * box tells it where (see sculpture/controller.ts).
 *
 * Tablets, phones and no-script: every stage keeps its own slot above its
 * words, and the ribbon travels from one to the next. Nothing is pinned.
 *
 * The numbers sit on a rail whose fill reaches each one as its stage becomes
 * current (motion/stages.ts, which also marks the current stage on the section
 * as `data-step`); each stage's words arrive once, as it nears the reading line
 * (motion/reveals.ts). When the knot closes, the last number rings once.
 */
const STAGE_FORMS: FormId[] = ["understand", "break", "try", "learn"];

export function Method() {
  return (
    <section id="how-i-learn" className="section learn" aria-labelledby="learn-title" tabIndex={-1}>
      <div className="wrap learn-head content">
        <h2 id="learn-title" className="t-heading" data-reveal="lines">
          {method.heading}
        </h2>
        <p className="t-lede learn-intro" data-reveal="fade" data-reveal-delay="0.2">
          {method.intro}
        </p>
      </div>

      <div className="wrap learn-track">
        <div className="learn-rail" aria-hidden="true">
          <span className="learn-rail-fill" />
        </div>
        <div className="learn-visual" aria-hidden="true">
          <div className="learn-box" id="learn-box">
            {STAGE_FORMS.map((form, i) => (
              <RibbonSVG form={form} aspect={1.1} className="learn-still" data-for={i} key={form} />
            ))}
          </div>
        </div>

        <ol className="learn-stages">
          {method.stages.map((stage, i) => (
            <li className="stage" data-stage={i} key={stage.title}>
              <span className="stage-anchor" data-sculpture={STAGE_FORMS[i]} data-sculpture-box="learn-box" aria-hidden="true" />
              <Slot form={STAGE_FORMS[i]} aspect={1.25} className="stage-slot" />
              <div className="stage-text content" data-reveal="stage">
                <span className="stage-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="t-stage">
                  <span className="stage-title">{stage.title}</span>
                </h3>
                <p className="t-lede stage-body">{stage.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
