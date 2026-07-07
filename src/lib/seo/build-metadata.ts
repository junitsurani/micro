import type { Metadata } from "next";
import {
  absoluteOgImage,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  mergeKeywords,
  SITE_DESCRIPTION,
  SITE_ORIGIN,
  SITE_TITLE,
} from "@/lib/seo/site-config";

export type BuildMetadataInput = {
  /** URL path starting with / (e.g. /about). */
  path: string;
  /** Segment for title template: becomes `Micro - ${title}`. */
  title: string;
  description?: string;
  /** Path to image under /public for OG/Twitter. */
  ogImage?: string;
  /** Extra keywords merged with site defaults. */
  keywords?: string[];
  /** Set false for error-style pages only. */
  index?: boolean;
};

/**
 * Standard page metadata: canonical URL, Open Graph, Twitter card, keywords.
 */
export function buildMetadata({
  path,
  title,
  description = SITE_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  keywords = [],
  index = true,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteOgImage(ogImage);
  const kw = mergeKeywords(...keywords);

  return {
    title,
    description,
    keywords: kw,
    alternates: {
      canonical: url,
    },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false },
    openGraph: {
      title: `${SITE_TITLE} - ${title}`,
      description,
      url,
      siteName: SITE_TITLE,
      locale: "en_CA",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_TITLE} - ${title}`,
      description,
      images: [imageUrl],
    },
  };
}

/** Studio page: keep marketing title aligned with brand default. */
export function buildStudioMetadata(): Metadata {
  const url = SITE_ORIGIN;
  const imageUrl = absoluteOgImage(DEFAULT_OG_IMAGE);
  const titleAbsolute = `${SITE_TITLE} | Chelsea Wellness Space`;

  return {
    title: {
      absolute: titleAbsolute,
    },
    description: SITE_DESCRIPTION,
    keywords: mergeKeywords(),
    alternates: { canonical: url },
    openGraph: {
      title: titleAbsolute,
      description: SITE_DESCRIPTION,
      url,
      siteName: SITE_TITLE,
      locale: "en_CA",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_TITLE}, Chelsea wellness space`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleAbsolute,
      description: SITE_DESCRIPTION,
      images: [imageUrl],
    },
  };
}
