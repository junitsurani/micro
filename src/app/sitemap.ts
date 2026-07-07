import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo/site-config";

const BASE_URL = SITE_ORIGIN;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/experience`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/access`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return staticPages;
}
