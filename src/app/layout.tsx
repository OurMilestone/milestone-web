import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/components/providers/auth-context-provider";
import AuthSessionProvider from "@/components/providers/auth-session-provider";
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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased font-sans`}>
				<NextTopLoader showSpinner={false} color="#59594E" />
				<AuthSessionProvider>
					<AuthContextProvider>{children}</AuthContextProvider>
				</AuthSessionProvider>
				<Toaster richColors closeButton position="top-right" />
			</body>
		</html>
	);
}
