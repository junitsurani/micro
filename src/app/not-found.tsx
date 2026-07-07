import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PageWrapper from "@/components/layout/PageWrapper";
import TransitionLink from "@/components/ui/TransitionLink";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <PageWrapper>
        <main className="not-found-page">
          <section className="not-found-inner">
            <p className="not-found-kicker">404</p>
            <h1>Lost the thread? Let&apos;s get you back to centre.</h1>
            <TransitionLink href="/" className="base-btn is-waitlist">
              <span className="btn-label">
                <span className="btn-line">Return home</span>
                <span className="btn-line" aria-hidden="true">Return home</span>
              </span>
            </TransitionLink>
          </section>
        </main>
        <SiteFooter />
      </PageWrapper>
    </>
  );
}
