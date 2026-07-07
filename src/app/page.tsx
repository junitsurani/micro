import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import PageWrapper from "@/components/layout/PageWrapper";
import HeroSection from "@/components/sections/HeroSection";
import IntroText from "@/components/sections/IntroText";
import ProductGrid from "@/components/sections/ProductGrid";
import ShowroomBanner from "@/components/sections/ShowroomBanner";
import ProjectGallery from "@/components/sections/ProjectGallery";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import { buildStudioMetadata } from "@/lib/seo/build-metadata";

export const metadata = buildStudioMetadata();

export default function StudioPage() {
  return (
    <>
      <SiteHeader />
      <PageWrapper>
        <main className="home-page">
          <HeroSection />
          <IntroText />
          <ProjectGallery />
          <ProductGrid />
          <ShowroomBanner />
          <NewsletterSignup />
        </main>
        <SiteFooter />
      </PageWrapper>
    </>
  );
}
