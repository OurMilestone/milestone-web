"use client";

import { Loader } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function SessionChecker({ children }: { children: React.ReactNode }) {
	const { status } = useSession();
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		if (status === "loading") {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [status]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader className="h-8 w-8 text-primary animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
}

export default function AuthSessionProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<SessionChecker>{children}</SessionChecker>
		</SessionProvider>
	);
}
