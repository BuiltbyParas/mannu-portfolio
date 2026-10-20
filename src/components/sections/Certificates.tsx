import Image from "next/image";
import { ExternalLink } from "@/components/ExternalLink";
import { Slot } from "@/components/sculpture/Slot";
import { publishCertificates, type PublishedCertificate } from "@/content/publish";
import { LEDGER_MARKS } from "@/components/sculpture/forms";
import { certificates, certificatesSection } from "@/content/site";
import { CertificateArchive } from "./CertificateArchive";

/*
 * Certificates, on the citron field (which swells up into the end of
 * Foundations as a soft dome and settles flat as it arrives). The ribbon is cut
 * into a ledger of short marks, about one for each certificate, re-threaded one
 * mark after another as it arrives; then it holds still so the words lead,
 * tips a little toward the pointer for depth and turns a few marks aside where
 * the pointer passes. Only real, complete entries from site.ts are listed, each
 * drawing its rule as it arrives; with none added the section is the statement
 * and the ledger, with no empty slots.
 *
 * Data (site.ts → publish.ts) and presentation (this file) stay separate, so
 * the real certificates and a final design for them can arrive later.
 */
export function Certificates() {
  const { featured, more } = publishCertificates(certificates);
  return (
    <section id="certificates" className="section certificates field-section" aria-labelledby="certificates-title" data-tone="citron" tabIndex={-1}>
      <div className="field" aria-hidden="true" />
      <div className="wrap certificates-grid">
        <div className="certificates-copy content">
          <h2 id="certificates-title" className="t-statement" data-reveal="lines">
            {certificatesSection.heading}
          </h2>
          <div className="certificates-text" data-reveal="fade" data-reveal-children data-reveal-delay="0.2">
            {certificatesSection.paragraphs.map((paragraph, i) => (
              <p className={i === 0 ? "t-lede" : "t-body"} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          {featured.length > 0 ? (
            <div className="cert-block">
              <CertificateList items={featured} reveal />
              {more.length > 0 ? (
                <CertificateArchive count={more.length}>
                  <CertificateList items={more} />
                </CertificateArchive>
              ) : null}
            </div>
          ) : null}
        </div>

        <figure className="ledger">
          <Slot form="certificates" aspect={1.1} className="certificates-slot" />
          <figcaption className="ledger-caption content" data-reveal="fade" data-reveal-delay="0.6">
            {LEDGER_MARKS} marks, about one for every certificate so far.
          </figcaption>
        </figure>
      </div>
      <div className="rise rise-white" aria-hidden="true" />
    </section>
  );
}

function CertificateList({ items, reveal }: { items: PublishedCertificate[]; reveal?: boolean }) {
  return (
    <ul className="cert-list" data-reveal={reveal ? "ruled" : undefined}>
      {items.map((cert) => (
        <li className="cert" key={`${cert.title}-${cert.issuer}`}>
          <span className="rule cert-rule" aria-hidden="true" />
          <div className="cert-text">
            <h3 className="cert-title">{cert.title}</h3>
            <p className="cert-meta">
              {cert.issuer}
              {cert.date ? <span className="cert-date">{cert.date}</span> : null}
            </p>
            {cert.href ? (
              <ExternalLink className="text-link" href={cert.href}>
                {cert.href === cert.image ? "View certificate" : "Verify certificate"}
              </ExternalLink>
            ) : null}
          </div>
          {cert.image ? (
            <div className="cert-thumb">
              <Image src={cert.image} alt="" fill sizes="8rem" loading="lazy" />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
