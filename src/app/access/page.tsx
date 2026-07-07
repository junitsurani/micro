import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PageWrapper from "@/components/layout/PageWrapper";
import AccessForm from "@/components/sections/access/AccessForm";
import AccessFaq from "@/components/sections/access/AccessFaq";
import ParallaxImage from "@/components/sections/access/ParallaxImage";
import AccessAnimations from "@/components/sections/access/AccessAnimations";
import { buildMetadata } from "@/lib/seo/build-metadata";

const ACCESS_FAQS = [
  {
    question: "What is MICRO?",
    answer:
      "MICRO is a sensory movement studio in Chelsea, London, one of the city’s few Lagree Microformer studios. It brings together movement, recovery and nutrition in a space architected to settle the nervous system before the body moves. Opening on Sloane Avenue, 2026.",
  },
  {
    question: "Where is MICRO?",
    answer: "60 Sloane Avenue, Chelsea, London SW3 3AP.",
  },
  {
    question: "Is this Lagree?",
    answer:
      "The Lagree Microformer sits at the centre, but it isn’t the whole of it. Five proprietary formats are built around it, developed in-house and unique to the studio.",
  },
  {
    question: "Who is MICRO for?",
    answer:
      "For the body that has done everything and still feels it, and for the body just beginning. MICRO is for the exhausted and the curious, the first-timer and the lifelong athlete. Not only movement, but recovery, nutrition and a space that settles the nervous system, meeting you where you are.",
  },
  {
    question: "What happens inside?",
    answer:
      "Some things are better felt than explained. The five proprietary formats reveal themselves to founding members of Circle 001 first.",
  },
  {
    question: "How does membership work?",
    answer:
      "Membership is a tiered approach, centred on the depth of practice, not a ladder of packages. You won’t find a beginner option and a premium one here; you’ll find a way in, and a way deeper. Founding access opens first to Circle 001, sixty members, by invitation.",
  },
  {
    question: "Is there food?",
    answer:
      "Nutrition is part of the practice, not an afterthought, every modality chosen for its merit, not its moment.",
  },
  {
    question: "When does Chelsea open?",
    answer: "Autumn 2026. Founding Circle 001 members are granted first access.",
  },
  {
    question: "How does booking work?",
    answer: "Booking opens to the founding list first, in phases.",
  },
] as const;

export const metadata: Metadata = buildMetadata({
  path: "/access",
  title: "Access",
  description:
    "Request access to the founding list for MICRO by The Fix in Chelsea.",
  keywords: ["MICRO by The Fix", "founding access", "waitlist", "Chelsea wellness studio"],
});

function getAccessFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ACCESS_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export default function AccessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getAccessFaqSchema()) }}
      />
      <SiteHeader />
      <PageWrapper>
        <main className="access-page">
          <AccessAnimations />

          <section className="access-capture" id="access-form" aria-labelledby="access-capture-title">
            <div className="access-capture-copy">
              <div className="access-kicker">
                <span aria-hidden="true" />
                Founding access
              </div>
              <h1 id="access-capture-title">
                Be part of the first circle,
                <br />
                before the doors open.
              </h1>
              <div className="access-capture-panel" aria-hidden="true" />
            </div>

            <AccessForm />
          </section>

          <section className="access-private" aria-labelledby="access-private-title">
            <div className="access-private-grid">
              <div className="access-private-copy">
                <h2 id="access-private-title">
                  Private access,
                  <br />
                  for a quieter
                  <br />
                  kind of strength.
                </h2>
                <span className="access-private-rule" aria-hidden="true" />
                <p>
                  The founding list for Chelsea. Movement, recovery, nutrition
                  and sensory design, held as one practice.
                </p>
              </div>

              <ParallaxImage
                src="/images/access-private-portrait.png"
                alt="MICRO private access portrait"
              />
            </div>
          </section>

          <section className="access-location" id="location-contact" aria-labelledby="access-title">
            <div className="access-location-heading">
              <div className="access-kicker">
                <span aria-hidden="true" />
                The founding list for Chelsea.
              </div>
              <h2 id="access-title">
                <span className="access-reveal-mask">
                  <span className="access-reveal-line">Come closer.</span>
                </span>
              </h2>
            </div>

            <div className="access-body">
              <div className="access-map">
                <div className="access-map-frame">
                  <iframe
                    src="https://www.google.com/maps?q=60%20Sloane%20Avenue%2C%20Chelsea%2C%20London%20SW3%203AP&output=embed"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="eager"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MICRO by The Fix, 60 Sloane Avenue, Chelsea, London SW3 3AP"
                  />
                </div>
                <div className="access-map-caption">
                  <div className="access-detail-block">
                    <h2>
                      <span aria-hidden="true" />
                      Location
                    </h2>
                    <p>60 Sloane Avenue, Chelsea, London SW3 3AP</p>
                  </div>
                </div>
              </div>

              <div className="access-details" aria-label="Location and contact">
                <div className="access-detail-block">
                  <h2>
                    <span aria-hidden="true" />
                    Location
                  </h2>
                  <p>60 Sloane Avenue, Chelsea, London SW3 3AP</p>
                </div>

                <div className="access-detail-block">
                  <h2>
                    <span aria-hidden="true" />
                    Contact
                  </h2>
                  <p>
                    <a href="mailto:hello@microbythefix.com">hello@microbythefix.com</a>
                    <br />
                    <a href="https://www.instagram.com/microbythefix" target="_blank" rel="noreferrer">
                      @microbythefix
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="access-faq" aria-labelledby="access-faq-title">
            <div className="access-faq-kicker">FAQ</div>
            <div className="access-faq-grid">
              <h2 id="access-faq-title">
                <span className="access-reveal-mask">
                  <span className="access-reveal-line">The questions</span>
                </span>
                <span className="access-reveal-mask">
                  <span className="access-reveal-line">before you arrive.</span>
                </span>
              </h2>

              <AccessFaq items={ACCESS_FAQS} />
            </div>

            <div className="access-faq-bottom">
              <span className="access-faq-mark" aria-hidden="true" />
            </div>
          </section>

          <section className="access-stay-close" aria-label="Stay close">
            <p>
              Follow{" "}
              <a href="https://www.instagram.com/microbythefix" target="_blank" rel="noreferrer">
                @microbythefix
              </a>, we’ll see you there.
            </p>
          </section>
        </main>
        <SiteFooter />
      </PageWrapper>
    </>
  );
}
