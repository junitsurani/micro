import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PageWrapper from "@/components/layout/PageWrapper";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutIntro from "@/components/sections/about/AboutIntro";
import AboutManifesto from "@/components/sections/about/AboutManifesto";
import AboutValues from "@/components/sections/about/AboutValues";
import AboutBeliefs from "@/components/sections/about/AboutBeliefs";
import PremiumCollection from "@/components/sections/PremiumCollection";
import CallToAction from "@/components/sections/CallToAction";
import { buildMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildMetadata({
  path: "/experience",
  title: "The Experience",
  description:
    "The Lagree Microformer at the centre, with light, scent and sound doing the quiet work before practice begins.",
  keywords: [
    "MICRO experience",
    "sensory wellness",
    "Lagree method",
    "strength ritual",
    "nervous system regulation",
    "Chelsea wellness",
  ],
});

export default function ExperiencePage() {
  return (
    <>
      <SiteHeader />
      <PageWrapper>
        <main className="experience-page">
          <AboutHero />
          <AboutIntro />
          <AboutManifesto />
          <AboutValues />
          <AboutBeliefs />
          <PremiumCollection />
          <CallToAction />
        </main>
        <SiteFooter />
      </PageWrapper>
    </>
  );
}
