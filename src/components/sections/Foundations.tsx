import { Fragment, type CSSProperties } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { Slot } from "@/components/sculpture/Slot";
import { publishProjects } from "@/content/publish";
import { foundations, projects } from "@/content/site";

/*
 * Foundations: the four current areas laid as courses of a wall, beside the
 * ribbon wound into a four-turn coil (one turn per course). The coil winds as
 * the page scrolls past it; as each course draws its rule and arrives, its
 * turn of the coil lifts for a moment (motion/reveals.ts), and hovering a
 * course lifts it again (motion/Choreography.tsx). No ratings or percentages:
 * each course says what it is and nothing more. Real programs and projects
 * appear under the courses once they are added in site.ts. The citron of
 * Certificates rises into the end of the section.
 *
 * Kept deliberately modular: the heading block, the course list and the
 * projects list are independent, so this section can be redesigned later
 * without touching the motion system (it only reads the data-reveal hooks).
 */
export function Foundations() {
  const published = publishProjects(projects);
  return (
    <section id="foundations" className="section foundations" aria-labelledby="foundations-title" tabIndex={-1}>
      <div className="wrap foundations-grid">
        <div className="foundations-head content">
          <h2 id="foundations-title" className="t-statement" data-reveal="lines" data-grow>
            <Grow text={foundations.heading} />
          </h2>
          <p className="t-lede foundations-intro" data-reveal="fade" data-reveal-delay="0.2">
            {foundations.intro}
          </p>
        </div>

        <ul className="courses content" data-reveal="ruled" data-reveal-turns>
          {foundations.items.map((item) => (
            <li className="course" key={item.name}>
              <span className="rule course-rule" aria-hidden="true" />
              <h3 className="t-course">{item.name}</h3>
              <div className="course-detail">
                <p className="t-body">{item.note}</p>
                {"code" in item && item.code ? <code className="course-code">{item.code}</code> : null}
              </div>
            </li>
          ))}
        </ul>

        <Slot form="foundations" aspect={0.85} className="foundations-slot" />

        {published.length > 0 ? (
          <div className="projects content" data-reveal="fade">
            <h3 className="projects-title">Programs and projects</h3>
            <ul className="project-list">
              {published.map((project) => (
                <li className="project" key={project.title}>
                  <div className="project-head">
                    <h4 className="project-name">{project.title}</h4>
                    {project.year ? <span className="project-year">{project.year}</span> : null}
                  </div>
                  <p className="project-summary">{project.summary}</p>
                  {project.tools.length > 0 ? <p className="project-tools">{project.tools.join(", ")}</p> : null}
                  {project.codeHref || project.liveHref ? (
                    <div className="project-links">
                      {project.codeHref ? (
                        <ExternalLink className="text-link" href={project.codeHref}>
                          View the code
                        </ExternalLink>
                      ) : null}
                      {project.liveHref ? (
                        <ExternalLink className="text-link" href={project.liveHref}>
                          Open the project
                        </ExternalLink>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="rise rise-citron" aria-hidden="true" />
    </section>
  );
}

/**
 * The heading with the words of its last sentence ("Room to grow.") set apart,
 * so they can ease away from each other as the section is read
 * (motion/scenes.ts drives `--grow` on the heading). Plain words otherwise.
 */
function Grow({ text }: { text: string }) {
  const cut = text.lastIndexOf(". ");
  if (cut < 0) return text;
  const words = text.slice(cut + 2).split(" ");
  return (
    <>
      {text.slice(0, cut + 2)}
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="grow-word" style={{ "--i": i } as CSSProperties}>
            {word}
          </span>
        </Fragment>
      ))}
    </>
  );
}
