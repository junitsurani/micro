import { SERVICE_CATEGORIES } from "@/lib/constants";
import { SITE_ORIGIN } from "@/lib/seo/site-config";

/** Highlights primary service lines for search + AI surfaces. */
export function getPrimaryServicesItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MICRO method pathways",
    itemListElement: SERVICE_CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${SITE_ORIGIN}${c.href}`,
    })),
  };
}
