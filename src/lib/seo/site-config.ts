import {
  CONTACT_INFO,
  SERVICE_AREAS,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/constants";

/** Canonical production origin (no trailing slash). */
export const SITE_ORIGIN = "https://microbythefix.com";

/** Default Open Graph / Twitter image generated for the MICRO visual system. */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

export const SITE_KEYWORDS = [
  "Lagree Chelsea",
  "Lagree London",
  "Lagree Microformer London",
  "Lagree Microformer",
  "Microformer studio",
  "wellness studio Chelsea",
  "luxury fitness Chelsea",
  "sensory wellness",
  "nervous system regulation",
  "recovery Chelsea",
  "The Fix Collective",
  "MICRO by The Fix",
  "microbythefix",
  "precision strength ritual",
  "sensory recovery",
  "founding membership",
] as const;

const AREA_LIST = SERVICE_AREAS.split(",").map((s) => s.trim());

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}

export function absoluteOgImage(path: string): string {
  const rel = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${rel}`;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "MICRO by The Fix",
    legalName: "The Fix Collective Ltd",
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    image: absoluteOgImage(DEFAULT_OG_IMAGE),
    telephone: "+447500805226",
    email: CONTACT_INFO.email.display,
    areaServed: AREA_LIST.map((name) => ({
      "@type": "Place",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chelsea",
      addressRegion: "London",
      addressCountry: "GB",
    },
    priceRange: "$$",
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: SITE_TITLE,
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    inLanguage: "en-GB",
  };
}

export function mergeKeywords(...extra: string[]): string[] {
  return [...SITE_KEYWORDS, ...extra];
}

export { AREA_LIST, SITE_DESCRIPTION, SITE_TITLE };
