import { GlassCanvas } from "@/components/glass/GlassCanvas";
import { GlassStill } from "@/components/glass/GlassStill";
import { Slot } from "@/components/sculpture/Slot";
import { profile } from "@/content/site";

/*
 * The landing (large screens): one full view of liquid glass on a pale field
 * (components/glass), with the name set in the middle, in front of the largest
 * form, its label (who and where) just above its first letter, and a quiet cue
 * to scroll. It is an ordinary section: scrolling simply carries it away and brings the opening up from
 * below (sections/Opening.tsx), whose name arrives as it comes into view
 * (motion/intro.ts, opening.ts).
 *
 * The ribbon's opening form rests on the name (the slot): the letters
 * alternate above and below the ribbon's layer (M, n and u over it; a and the
 * second n under it), so the ribbon weaves through the word. The words arrive
 * with the page (motion/intro.ts): the ribbon threads in from the left and each
 * letter rises out of its mask as its tip reaches it, then the cue. The label
 * rises just before the name. The label and the name repeat the opening's,
 * which it keeps for assistive technology only (Hero.tsx), so the landing is
 * hidden from assistive technology, and its cue is a way in for the pointer
 * only (keyboard users scroll, or skip to the content).
 *
 * Small screens do not show it; the page opens on the name as before.
 */
export function Landing() {
  return (
    <div className="landing" aria-hidden="true">
      <div className="landing-scene">
        <GlassStill className="landing-still" />
        <GlassCanvas />
      </div>
      <div className="landing-words">
        <div className="landing-name-wrap">
          <p className="landing-mark">
            <span className="landing-context" data-intro="landing-context">
              {profile.context.join(" · ")}
            </span>
          </p>
          <p className="landing-name" data-intro="landing-name">
            {profile.name.split("").map((glyph, i) => (
              <span className={`landing-mask ${i % 2 === 0 ? "is-over" : "is-under"}`} key={i}>
                <span className="landing-ch">{glyph}</span>
              </span>
            ))}
          </p>
          <Slot form="hero" aspect={4.2} phoneAspect={1.97} className="landing-slot" live boxId="slot-landing" />
        </div>
      </div>
      <a className="landing-cue" href="#top" tabIndex={-1}>
        <span className="landing-cue-inner" data-intro="landing-cue">
          <span className="landing-cue-label">Scroll to explore</span>
          <span className="landing-cue-line" />
        </span>
      </a>
    </div>
  );
}
