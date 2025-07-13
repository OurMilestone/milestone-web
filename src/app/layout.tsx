import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Milestone - Secure Payments & Project Management for Freelancers",
	description:
		"Milestone helps remote workers and clients manage projects, resolve disputes, and ensure secure milestone-based payments.",
	keywords: [
		"freelancer payments",
		"secure project payments",
		"remote project management",
		"dispute resolution",
		"freelance contracts",
		"milestone payment platform",
	],
	authors: [{ name: "Milestone Team", url: "https://www.ourmilestones.com/" }],
	creator: "Milestone Team",
	publisher: "Milestone",
	metadataBase: new URL("https://www.ourmilestones.com/"),
	category: "technology",
	generator: "Next.js",
	applicationName: "Milestone",
	referrer: "origin-when-cross-origin",
	verification: {
		google: "Lp_2GOyrfqos1sqzv2h-t46wd8unVgIIyaWPc2puy7A",
	},

	openGraph: {
		title: "Milestone - Secure Payments & Project Management for Freelancers",
		description:
			"Secure your freelance income with milestone-based project tracking and payments.",
		url: "https://www.ourmilestones.com/",
		siteName: "Milestone",
		images: [
			{
				url: "https://res.cloudinary.com/dbofcawb1/image/upload/v1752277670/Screenshot_2025-07-11_at_4.54.45_PM_he42bb.png",
				width: 1200,
				height: 630,
				alt: "Milestone App Preview",
			},
		],
		locale: "en_US",
		type: "website",
	},

	twitter: {
		card: "summary_large_image",
		title: "Milestone - Secure Payments for Freelancers",
		description:
			"Milestone offers milestone-based contracts, dispute management, and guaranteed payouts.",
		images: [
			"https://res.cloudinary.com/dbofcawb1/image/upload/v1752277670/Screenshot_2025-07-11_at_4.54.45_PM_he42bb.png",
		],
		creator: "@_yourmilestone",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased font-sans`}>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Structured data for SEO
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Milestone",
							url: "https://www.ourmilestones.com/",
							logo: "https://res.cloudinary.com/dqy5f2fji/image/upload/v1752101116/milestone-media/milestone_full_lbaslt.jpg",
							sameAs: [
								"https://x.com/_yourmilestone",
								"https://www.linkedin.com/company/yourmilestone/",
							],
						}),
					}}
				/>
				<NextTopLoader showSpinner={false} color="#edbb32" />
				{children}
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
