'use client';

import { MeshBackground } from './mesh-background';
import { LandingNav } from './landing-nav';
import { HeroSection } from './hero-section';
import { TrustedBySection } from './trusted-by';
import { BentoFeaturesSection } from './bento-features';
import { PipelineSection } from './pipeline-section';
import { ActivitySection } from './activity-section';
import { CtaSection, LandingFooter } from './cta-footer';

export function LandingPage() {
  return (
    <div className="landing-root relative min-h-screen overflow-x-hidden selection:bg-[#8b5cf6]/30">
      <MeshBackground />
      <LandingNav />
      <main>
        <HeroSection />
        <TrustedBySection />
        <BentoFeaturesSection />
        <PipelineSection />
        <ActivitySection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
