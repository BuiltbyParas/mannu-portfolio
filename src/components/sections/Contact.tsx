import { ExternalLink } from "@/components/ExternalLink";
import { Slot } from "@/components/sculpture/Slot";
import { contactActions } from "@/content/publish";
import { contact, contactSection } from "@/content/site";

/*
 * Contact, on the ultramarine field: the strand from Experience closes into a
 * calm loop beside the invitation, the resolution of the thread, and the trail
 * in the margin closes its own small loop as the page ends. The field swells
 * up into the end of Experience and settles; the statement rises line by line,
 * then everything rests.
 * Each contact button exists only once its link is set (and valid) in
 * site.ts; nothing stands in for a missing one.
 */
export function Contact() {
  const actions = contactActions(contact);
  if (process.env.NODE_ENV !== "production" && actions.length === 0) {
    console.warn("[portfolio] No contact links are set in src/content/site.ts, so no contact buttons are shown.");
  }
  return (
    <section id="contact" className="section contact field-section" aria-labelledby="contact-title" data-tone="ultra" tabIndex={-1}>
      <div className="field" aria-hidden="true" />
      <div className="wrap contact-grid">
        <div className="contact-copy content">
          <h2 id="contact-title" className="t-statement contact-title" data-reveal="lines">
            {contactSection.heading}
          </h2>
          <p className="t-lede contact-intro" data-reveal="fade" data-reveal-delay="0.35">
            {contactSection.intro}
          </p>
          {actions.length > 0 ? (
            <ul className="contact-actions" data-reveal="fade" data-reveal-children data-reveal-delay="0.5">
              {actions.map((action) => (
                <li key={action.id}>
                  <ExternalLink className="button button-light" href={action.href} pill>
                    {action.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Slot form="contact" aspect={1} className="contact-slot" />
      </div>
    </section>
  );
}
