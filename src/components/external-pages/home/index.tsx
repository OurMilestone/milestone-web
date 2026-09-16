"use client";

import Footer from "../footer";
import Header from "../header";
import DisputeSection from "./dispute";
import FinalCta from "./final-cta";
import Hero from "./hero";
import InsightsSection from "./insights";
import IntegrationsSection from "./integrations";
import PlatformSection from "./platform";
import PricingSection from "./pricing";
import SecuritySection from "./security";
import SolutionsSection from "./solutions";
import SupportSection from "./support";
import TestimonialsSection from "./testimonials";

export default function HomeLandingPage() {
	return (
		<div className="landing-page min-h-screen">
			<Header />
			<main>
				<Hero />
				<PlatformSection />
				<DisputeSection />
				<SupportSection />
				<SolutionsSection />
				<TestimonialsSection />
				<IntegrationsSection />
				<InsightsSection />
				<SecuritySection />
				<PricingSection />
				<FinalCta />
			</main>
			<Footer />
		</div>
	);
}
