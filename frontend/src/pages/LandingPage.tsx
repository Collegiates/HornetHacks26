import { LandingCTA } from "../components/landing/LandingCTA";
import { LandingFeatures } from "../components/landing/LandingFeatures";
import { LandingFooter } from "../components/landing/LandingFooter";
import { LandingGalleryPreview } from "../components/landing/LandingGalleryPreview";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingHowItWorks } from "../components/landing/LandingHowItWorks";
import { LandingTestimonials } from "../components/landing/LandingTestimonials";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingGalleryPreview />
      <LandingTestimonials />
      <LandingCTA />
      <LandingFooter />
    </main>
  );
}
