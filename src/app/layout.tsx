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
	title: "Milestone",
	description: "Connect, collaborate, and grow your career with ease",
	verification: {
		google: "Lp_2GOyrfqos1sqzv2h-t46wd8unVgIIyaWPc2puy7A",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head />
			<body className={`${poppins.variable} antialiased font-sans`}>
				<NextTopLoader showSpinner={false} color="#edbb32" />
				{children}
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
