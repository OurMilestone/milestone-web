import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Milestone — The operating system for managing external work",
	description:
		"Manage contractors from contract to payment. Milestone gives companies one place to manage agreements, track work, verify deliverables, approve milestones and manage payments.",
	keywords: [
		"contractor management",
		"external workforce",
		"milestone payments",
		"contractor contracts",
		"work verification",
		"contractor operations",
		"HR support",
		"legal support",
	],
	authors: [{ name: "Milestone Team", url: "https://www.ourmilestones.com/" }],
	creator: "Milestone Team",
	publisher: "Milestone",
	metadataBase: new URL("https://www.ourmilestones.com/"),
	category: "business",
	generator: "Next.js",
	applicationName: "Milestone",
	referrer: "origin-when-cross-origin",
	verification: {
		google: "Lp_2GOyrfqos1sqzv2h-t46wd8unVgIIyaWPc2puy7A",
	},

	openGraph: {
		title: "Milestone — Manage contractors from contract to payment",
		description:
			"One place to manage contractor agreements, track work, verify deliverables, approve milestones and manage payments.",
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
		title: "Milestone — The operating system for managing external work",
		description:
			"Manage contractors from contract to payment. Contracts, work, verification, approvals and payments in one place.",
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
			<body className={`${inter.variable} ${inter.className} antialiased`}>
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
							description:
								"The operating system for managing external work. Manage contractors from contract to payment.",
							sameAs: [
								"https://x.com/_yourmilestone",
								"https://www.linkedin.com/company/yourmilestone/",
							],
						}),
					}}
				/>
				<NextTopLoader showSpinner={false} color="#0C153C" />
				{children}
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
