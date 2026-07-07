import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/site-config";

export default function RootJsonLd() {
  return <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />;
}
