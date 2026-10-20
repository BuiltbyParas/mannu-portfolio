import { ArrowUp } from "lucide-react";
import { profile } from "@/content/site";

/** The close of the page, set inside the contact field. */
export function SiteFooter() {
  return (
    <footer id="site-footer" className="site-footer" data-tone="ultra">
      <div className="wrap footer-row">
        <p className="footer-signoff">{profile.signOff}</p>
        <a className="footer-top" href="#top">
          <ArrowUp className="link-icon" aria-hidden="true" strokeWidth={1.75} />
          <span className="link-text">Back to top</span>
        </a>
      </div>
    </footer>
  );
}
