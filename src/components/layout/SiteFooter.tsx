import TransitionLink from "@/components/ui/TransitionLink";
import { MINDBODY_BOOKING_LABEL, MINDBODY_BOOKING_URL } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer className="ft">
      <div className="ft-container">
        <p className="ft-brand">MICRO</p>

        <p className="ft-statement">
          A space for <em>internal recalibration.</em>
          <br />
          Precision. <em>Control.</em> Regulation.
        </p>

        <nav className="ft-nav" aria-label="Footer navigation">
          <div className="ft-nav-group">
            <p className="ft-nav-title">Explore</p>
            <TransitionLink href="/experience" className="ft-link">Experience</TransitionLink>
            <TransitionLink href="/access" className="ft-link">Access</TransitionLink>
          </div>

          <div className="ft-nav-group">
            <p className="ft-nav-title">Connect</p>
            <a href="mailto:hello@microbythefix.com" className="ft-link">Contact</a>
            <a href="https://www.instagram.com/microbythefix" target="_blank" rel="noreferrer" className="ft-link">
              Instagram
            </a>
          </div>

          <div className="ft-nav-group">
            <p className="ft-nav-title">Access</p>
            <TransitionLink href="/access" className="ft-link">Join the waitlist</TransitionLink>
            {MINDBODY_BOOKING_URL ? (
              <a
                href={MINDBODY_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                className="ft-link"
              >
                {MINDBODY_BOOKING_LABEL}
              </a>
            ) : null}
          </div>
        </nav>

        <p className="ft-credit">
          © MICRO by The Fix — 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
