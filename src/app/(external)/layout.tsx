import type { Metadata } from "next";

import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
	title: "Milestone",
	description: "Connect, collaborate, and grow your career with ease",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-white min-h-screen w-full">
			<NextTopLoader showSpinner={false} color="#edbb32" />
			{children}
		</div>
	);
}
