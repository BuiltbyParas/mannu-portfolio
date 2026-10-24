import { ChapterMark } from "@/components/ChapterMark";
import { ExternalLink } from "@/components/ExternalLink";
import { Slot } from "@/components/sculpture/Slot";
import { publishExperience } from "@/content/publish";
import { experience, experienceSection } from "@/content/site";

/*
 * Experience, on a white sheet. The heading sits to the right and uncovers
 * from the left, the way the strand beneath it runs: the ribbon draws out as
 * one long strand toward the edge of the page, the road ahead, and carries
 * the visitor on to Contact, while the heading drifts a little against it
 * (motion/scenes.ts). Real entries from site.ts are listed under the strand as
 * a plain list, each drawing its rule as it arrives, so they can be added
 * later without new layout; none are invented, and with none added the section
 * is complete as it is. The ultramarine of Contact rises into its end.
 */
export function Experience() {
  const entries = publishExperience(experience);
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title" data-tone="white" tabIndex={-1}>
      <div className="wrap experience-grid">
        <div className="experience-head content">
          <ChapterMark id="experience" />
          <h2 id="experience-title" className="t-heading" data-reveal="wipe">
            {experienceSection.heading}
          </h2>
          <p className="t-lede experience-intro" data-reveal="lede" data-reveal-delay="0.4">
            {experienceSection.intro}
          </p>
        </div>

        <Slot form="experience" aspect={4} className="experience-slot" />

        {entries.length > 0 ? (
          <ol className="timeline content" data-reveal="ruled">
            {entries.map((entry) => (
              <li className="timeline-entry" key={`${entry.role}-${entry.organization}`}>
                <span className="rule entry-rule" aria-hidden="true" />
                <span className="rule-knot" aria-hidden="true" />
                {entry.period ? <p className="timeline-period">{entry.period}</p> : null}
                <div className="timeline-body">
                  <h3 className="timeline-role">{entry.role}</h3>
                  <p className="timeline-org">{entry.organization}</p>
                  {entry.summary ? <p className="timeline-summary">{entry.summary}</p> : null}
                  {entry.href ? (
                    <ExternalLink className="text-link" href={entry.href}>
                      Learn more
                    </ExternalLink>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      <div className="rise rise-ultra" aria-hidden="true" />
    </section>
  );
}
