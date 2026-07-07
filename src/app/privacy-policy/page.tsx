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
  path: "/privacy-policy",
  title: "Privacy Policy",
  description:
    "How MICRO by The Fix collects, uses, and protects personal information submitted through the website and waitlist.",
  keywords: ["privacy policy", "MICRO by The Fix"],
});

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: [
      "When you join the MICRO waitlist or contact us, we may collect your name, email address, phone number, and any details you choose to share about your interest in founding access, memberships, bookings, or future experiences.",
      "We also collect basic technical information, such as browser type, device information, pages visited, and analytics data, to understand how visitors use the site.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: [
      "We use your information to respond to inquiries, share launch updates, manage waitlist interest, provide founding access information, and improve the MICRO digital experience.",
      "If you opt in, we may send updates about memberships, booking availability, launch timing, and future wellness products.",
    ],
  },
  {
    heading: "3. Information Sharing",
    body: [
      "MICRO by The Fix does not sell, rent, or trade your personal information. We may share information with trusted service providers only when needed to operate the website, waitlist, communications, analytics, or related launch workflows.",
      "We may disclose information if required by law or to protect the rights, safety, and property of MICRO by The Fix, our visitors, or others.",
    ],
  },
  {
    heading: "4. Data Security",
    body: [
      "We take reasonable precautions to protect personal information from unauthorized access, use, or disclosure. No electronic transmission or storage method is completely secure, so we cannot guarantee absolute security.",
      "We retain personal information only as long as necessary for the purposes described in this policy or as required by law.",
    ],
  },
  {
    heading: "5. Cookies & Analytics",
    body: [
      "Our website may use cookies and similar technologies to improve browsing, understand traffic, and measure interest in MICRO. You can control cookie settings through your browser preferences.",
    ],
  },
  {
    heading: "6. Your Rights",
    body: [
      "You may request access to, correction of, or deletion of personal information we hold about you, subject to applicable legal requirements.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      "If you have questions about this Privacy Policy or how we handle your information, contact us at hello@microbythefix.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbListSchema([
          CRUMB_HOME,
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
      <SiteHeader />
      <PageWrapper>
        <main>
          <PageHeader variant="black" />
          <LegalPage
            label="Legal"
            title="Privacy Policy"
            lastUpdated="May 14, 2026"
            sections={SECTIONS}
          />
        </main>
        <SiteFooter />
      </PageWrapper>
    </>
  );
}
