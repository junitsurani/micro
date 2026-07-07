import type { Metadata } from "next";
import "./globals.css";

import TransitionProvider from "@/components/layout/TransitionProvider";
import LenisProvider from "@/components/layout/LenisProvider";
import SitePreloader from "@/components/layout/SitePreloader";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import RootJsonLd from "@/components/seo/RootJsonLd";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_ORIGIN,
  SITE_TITLE,
} from "@/lib/seo/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE_TITLE} | Chelsea Wellness Space`,
    template: `${SITE_TITLE} - %s`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  authors: [{ name: SITE_TITLE }],
  robots: "index, follow",
  openGraph: {
    title: `${SITE_TITLE} | Chelsea Wellness Space`,
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    siteName: SITE_TITLE,
    locale: "en_GB",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} | Chelsea Wellness Space`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/oof0ptb.css" />
      </head>
      <body>
        <GoogleAnalytics />
        <RootJsonLd />
        <SitePreloader />
        <LenisProvider>
          <AnalyticsProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </AnalyticsProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
