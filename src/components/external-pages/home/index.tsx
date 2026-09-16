"use client";

import Footer from "../footer";
import Header from "../header";
import DisputeSection from "./dispute";
import Hero from "./hero";
import InsightsSection from "./insights";
import IntegrationsSection from "./integrations";
import PlatformSection from "./platform";
import SecuritySection from "./security";
import SolutionsSection from "./solutions";
import TestimonialsSection from "./testimonials";

export default function HomeLandingPage() {
	return (
		<div className="landing-page min-h-screen">
			<Header />
			<main>
				<Hero />
				<SolutionsSection />
				<PlatformSection />
				<DisputeSection />
				<TestimonialsSection />
				<IntegrationsSection />
				<InsightsSection />
				<SecuritySection />
			</main>
			<Footer />
		</div>
	);
}
