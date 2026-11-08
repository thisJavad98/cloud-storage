"use client";

import AuthRedirect from "../AuthRedirect";
import IosAddToHomeGate from "../IosAddToHomeGate";
import LandingFeatures from "./LandingFeatures";
import LandingFinalCta from "./LandingFinalCta";
import LandingHero from "./LandingHero";
import LandingHighlight from "./LandingHighlight";
import LandingNav from "./LandingNav";
import LandingScope from "./LandingScope";
import LandingSteps from "./LandingSteps";

export default function Landing() {
  return (
    <div className="landing-page min-h-[100dvh]">
      <AuthRedirect />
      <IosAddToHomeGate />
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHighlight />
        <LandingScope />
        <LandingSteps />
        <LandingFinalCta />
      </main>
    </div>
  );
}
