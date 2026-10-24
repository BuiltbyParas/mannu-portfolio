import type { ReactNode } from "react";
import { Sculpture } from "@/components/sculpture/Sculpture";
import { WorldSVG } from "@/components/sculpture/WorldSVG";

/*
 * The opening and Curiosity, on one stage.
 *
 * Large screens with motion: the landing (sections/Landing.tsx) scrolls away
 * above, the stage rises into view, and as it reaches the top it holds still
 * (sticky) for one screen of scroll (no rest first: the landing's name has
 * gone, and the ribbon rides the stage up and crosses its sky; controller.ts).
 * The opening becomes the introduction in place: the opening's words
 * step back, the view travels on through its world of glass, the sky turns
 * from pearl and blush to powder, the ribbon gathers into Curiosity's loops
 * and Curiosity's words arrive. Then the stage is released and the page
 * carries on into "How I learn". One progress value drives all of it
 * (sculpture/scenery.ts; motion/opening.ts for the words and the sky,
 * sculpture/controller.ts and world.ts for the scene); scrolling back plays it
 * in reverse. Native scrolling throughout; nothing waits.
 *
 * The stage is also the ribbon canvas's layer (Sculpture is rendered inside
 * it): a sticky box is a layer of its own, so the canvas has to share it for
 * the name's letters to keep passing over and under the ribbon.
 *
 * `.opening-lead` measures an optional rest before the opening (lib/stage.ts);
 * its length (`--rest-run`, now 0) is set in globals.css.
 *
 * Everywhere else the stage is an ordinary block. Large screens without the
 * stage (reduced motion, no scripts, a short window) show the opening on its
 * sky and its world's still; small screens open on the name as before.
 */
export function Opening({ children }: { children: ReactNode }) {
  return (
    <div className="opening">
      <div className="opening-stage">
        <div className="opening-sky" aria-hidden="true">
          <div className="sky sky-landing" />
          <div className="sky sky-intro" />
          <WorldSVG className="world-still" />
        </div>
        <Sculpture />
        {children}
      </div>
      <div className="opening-lead" aria-hidden="true" />
    </div>
  );
}
