import { Slot } from "@/components/sculpture/Slot";
import { profile } from "@/content/site";

/*
 * The opening. The name's letters alternate above and below the ribbon's
 * layer (M, n and u sit over it; a and the second n sit under it), so the
 * ribbon weaves through the word before it ties its loop. Each letter sits in
 * its own mask so the entrance can raise it onto the baseline as the ribbon's
 * tip reaches it (motion/intro.ts). Everything here is readable before any
 * script runs.
 *
 * Large screens: the opening follows the landing (sections/Landing.tsx) and
 * sits on a stage with Curiosity (sections/Opening.tsx). The single visible
 * name, its label and its ribbon are the landing's; here the label (drawn
 * once, by the landing) and the name stay in the document for assistive
 * technology only, and the introduction paragraph is left to Curiosity, which
 * follows on the same stage (motion/opening.ts).
 *
 * Small screens keep the opening as it was: the label, the name across the
 * page with its ribbon, then the introduction, scrolling away normally.
 */
export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-name" tabIndex={-1} data-stage-at="0">
      <div className="wrap hero-inner">
        <div className="hero-title">
          <div className="hero-mark">
            <p className="hero-context content" data-intro="context">
              <span>{profile.context[0]}</span>
              <span className="hero-context-sep">
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
              </span>
              <span>{profile.context[1]}</span>
            </p>
          </div>

          <div className="hero-name-wrap">
            <h1 id="hero-name" className="hero-name">
              <span className="sr-only">{profile.name}</span>
              <span className="hero-glyphs" aria-hidden="true">
                {profile.name.split("").map((glyph, i) => (
                  <span className={`hero-mask ${i % 2 === 0 ? "is-over" : "is-under"}`} key={i}>
                    <span className="hero-sink">
                      <span className="hero-ch">{glyph}</span>
                    </span>
                  </span>
                ))}
              </span>
            </h1>
            <Slot form="hero" aspect={4.2} phoneAspect={1.97} className="hero-slot" live stageAt={0} />
          </div>
        </div>

        <div className="hero-foot">
          <div className="hero-aside content">
            <p className="hero-intro" data-intro="aside">
              {profile.introduction}
            </p>
          </div>
        </div>

        {/* The cue is also a way in for the pointer (keyboard users just scroll). */}
        <a className="hero-cue" href="#about" data-intro="cue" aria-hidden="true" tabIndex={-1}>
          <span className="hero-cue-inner">
            <span className="hero-cue-line">
              <span className="hero-cue-fill" />
            </span>
            <span className="hero-cue-label">Scroll</span>
          </span>
        </a>
      </div>
    </section>
  );
}
