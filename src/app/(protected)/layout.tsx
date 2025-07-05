import type { Metadata } from "next";

import { AuthContextProvider } from "@/components/providers/auth-context-provider";
import AuthSessionProvider from "@/components/providers/auth-session-provider";
import { QueryProvider } from "@/components/providers/queryclient-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";
import VerificationBanner from "@/components/shared/verification-banner";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
	title: "Milestone",
	description: "Connect, collaborate, and grow your career with ease",
};

export default function ProtectedRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NextTopLoader showSpinner={false} color="#edbb32" />
			<QueryProvider>
				<AuthSessionProvider>
					<AuthContextProvider>
						<VerificationBanner />
						<WalletProvider>{children}</WalletProvider>
					</AuthContextProvider>
				</AuthSessionProvider>
				<Toaster position="top-right" />
			</QueryProvider>
		</>
	);
}
