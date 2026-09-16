"use client";

import { Loader } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AUTH_PATH_PREFIXES = [
	"/login",
	"/register",
	"/forgot-password",
	"/verify-email",
	"/post-login-redirect",
];

function SessionChecker({ children }: { children: React.ReactNode }) {
	const { status } = useSession();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	const isAuthFlow = AUTH_PATH_PREFIXES.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	useEffect(() => {
		if (isAuthFlow) {
			setIsLoading(false);
			return;
		}

		setIsLoading(status === "loading");
	}, [status, isAuthFlow]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return <>{children}</>;
}

export default function AuthSessionProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
			<SessionChecker>{children}</SessionChecker>
		</SessionProvider>
	);
}
