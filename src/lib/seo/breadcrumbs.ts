import { SITE_ORIGIN, SITE_TITLE } from "@/lib/seo/site-config";

export type Crumb = { name: string; path: string };

export function getBreadcrumbListSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export const CRUMB_HOME: Crumb = { name: SITE_TITLE, path: "/" };
