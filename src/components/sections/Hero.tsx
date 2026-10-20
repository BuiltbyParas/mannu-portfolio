import { ArrowDown } from "lucide-react";
import { PillLabel } from "@/components/PillLabel";
import { Slot } from "@/components/sculpture/Slot";
import { profile } from "@/content/site";

/*
 * The opening. The name is set at the width of the page and its letters
 * alternate above and below the ribbon's layer (M, n and u sit over it; a and
 * the second n sit under it), so the ribbon weaves through the word before it
 * ties its loop. Each letter sits in its own mask so the entrance can raise it
 * onto the baseline as the ribbon's tip reaches it (motion/intro.ts). As the
 * page leaves the opening, the name and its context line rise a little faster
 * than the page and the cue's line fills with the scroll (motion/scenes.ts).
 * Everything here is readable before any script runs.
 */
export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-name" tabIndex={-1}>
      <div className="wrap hero-inner">
        <p className="hero-context content" data-intro="context">
          <span>{profile.context[0]}</span>
          <span className="hero-context-sep">, </span>
          <span>{profile.context[1]}</span>
        </p>

        <div className="hero-name-wrap">
          <h1 id="hero-name" className="hero-name">
            <span className="sr-only">{profile.name}</span>
            <span className="hero-glyphs" aria-hidden="true">
              {profile.name.split("").map((glyph, i) => (
                <span className={`hero-mask ${i % 2 === 0 ? "is-over" : "is-under"}`} key={i}>
                  <span className="hero-ch">{glyph}</span>
                </span>
              ))}
            </span>
          </h1>
          <Slot form="hero" aspect={4.2} phoneAspect={1.97} className="hero-slot" live />
        </div>

        <div className="hero-foot">
          <p className="hero-tagline content" data-intro="tagline">
            {profile.tagline.map((line, i) => (
              <span className="hero-tagline-line" key={line}>
                {line}
                {i < profile.tagline.length - 1 ? " " : null}
              </span>
            ))}
          </p>
          <div className="hero-aside content">
            <p className="hero-intro" data-intro="aside">
              {profile.introduction}
            </p>
            <div className="hero-actions" data-intro="actions">
              <a className="button button-primary" href="#about">
                <PillLabel icon={<ArrowDown className="button-icon" aria-hidden="true" strokeWidth={2} />}>Explore my learning journey</PillLabel>
              </a>
              <a className="button button-secondary" href="#contact">
                <PillLabel>Contact me</PillLabel>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-cue" data-intro="cue" aria-hidden="true">
          <div className="hero-cue-inner">
            <span className="hero-cue-line">
              <span className="hero-cue-fill" />
            </span>
            <span className="hero-cue-label">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
