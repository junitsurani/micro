import { absoluteOgImage, absoluteUrl, SITE_ORIGIN } from "@/lib/seo/site-config";

export function getProjectArticleJsonLd(input: {
  path: string;
  headline: string;
  description: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    image: [absoluteOgImage(input.image)],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.path),
    },
    author: { "@id": `${SITE_ORIGIN}/#organization` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };
}
