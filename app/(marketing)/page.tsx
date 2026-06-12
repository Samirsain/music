import { Hero } from "@/components/site/hero";
import { CategoryMarquee } from "@/components/site/marquee";
import {
  AudienceSection,
  FeaturesSection,
  FinalCta,
  HowItWorks,
  InfluencerCta,
  ProblemSection,
  RoadmapSection,
} from "@/components/site/landing-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryMarquee />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <InfluencerCta />
      <AudienceSection />
      <RoadmapSection />
      <FinalCta />
    </>
  );
}
