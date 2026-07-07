import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import LegalPage from "@/components/sections/legal/LegalPage";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { CRUMB_HOME, getBreadcrumbListSchema } from "@/lib/seo/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  path: "/terms-conditions",
  title: "Terms & Conditions",
  description:
    "Terms of use for the MICRO by The Fix website, waitlist, founding access updates, and digital experiences.",
  keywords: ["terms and conditions", "MICRO by The Fix"],
});

const SECTIONS = [
  {
    heading: "1. Agreement to Terms",
    body: [
      "By accessing or using the MICRO by The Fix website, waitlist, or related digital experiences, you agree to these Terms & Conditions. If you do not agree, you should not use the site or submit your information.",
    ],
  },
  {
    heading: "2. Waitlist & Founding Access",
    body: [
      "Submitting your details registers interest in MICRO, founding access, memberships, bookings, launch updates, and future wellness experiences. Waitlist submission does not guarantee membership availability, booking priority, pricing, or studio access.",
      "Launch timing, membership details, availability, and product information may change as the studio and wider ecosystem develop.",
    ],
  },
  {
    heading: "3. Website Content",
    body: [
      "All content on this website, including text, images, design, brand elements, and interface patterns, belongs to MICRO by The Fix or its licensors and may not be copied, distributed, or reused without permission.",
    ],
  },
  {
    heading: "4. Health & Wellness Notice",
    body: [
      "Information on this website is for general informational purposes only and does not replace professional medical advice. Always consult an appropriate professional before beginning any new fitness, wellness, or recovery practice if you have health concerns.",
    ],
  },
  {
    heading: "5. Third-Party Services",
    body: [
      "The website may use third-party tools for forms, analytics, email, hosting, or future booking workflows. We are not responsible for third-party websites or services outside our control.",
    ],
  },
  {
    heading: "6. Limitation of Liability",
    body: [
      "MICRO by The Fix is not liable for indirect, incidental, or consequential damages arising from use of the website, waitlist, or launch communications, to the fullest extent permitted by law.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      "If you have questions about these Terms & Conditions, contact us at hello@microbythefix.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbListSchema([
          CRUMB_HOME,
          { name: "Terms & Conditions", path: "/terms-conditions" },
        ])}
      />
      <SiteHeader />
      <PageWrapper>
        <main>
          <PageHeader variant="black" />
          <LegalPage
            label="Legal"
            title="Terms & Conditions"
            lastUpdated="May 14, 2026"
            sections={SECTIONS}
          />
        </main>
        <SiteFooter />
      </PageWrapper>
    </>
  );
}
