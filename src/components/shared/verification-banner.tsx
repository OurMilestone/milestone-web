"use client";

import { AppRoutePaths } from "@/config/routes-config";
import { AlertTriangle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerificationBanner() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (
			status === "authenticated" &&
			session?.user &&
			!session.user.is_verified &&
			!pathname.includes(AppRoutePaths.VerifyEmail) &&
			!pathname.includes(AppRoutePaths.SignIn) &&
			!pathname.includes(AppRoutePaths.SignUp)
		) {
			const dismissedKey = `verificationBannerDismissed_${session.user.id}`;
			const isDismissed =
				typeof window !== "undefined"
					? localStorage.getItem(dismissedKey)
					: null;

			if (!isDismissed) {
				setIsVisible(true);
			}
		} else {
			setIsVisible(false);
		}
	}, [status, session, pathname]);

	const handleDismiss = () => {
		if (session?.user?.id && typeof window !== "undefined") {
			const dismissedKey = `verificationBannerDismissed_${session.user.id}`;
			localStorage.setItem(dismissedKey, "true");
		}
		setIsVisible(false);
	};

	if (!isVisible || !session?.user?.email) return null;

	const verifyEmailLink = `${AppRoutePaths.VerifyEmail}?email=${encodeURIComponent(session.user.email)}&callbackUrl=${encodeURIComponent(pathname + (typeof window !== "undefined" ? window.location.search : ""))}`;

	return (
		<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 fixed top-0 left-0 right-0 z-50 shadow-md print:hidden">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center">
					<AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
					<p className="text-sm">
						Your email address is not verified. Please{" "}
						<Link href={verifyEmailLink} className="font-bold hover:underline">
							verify your email
						</Link>{" "}
						to access all features.
					</p>
				</div>
				<button
					type="button"
					onClick={handleDismiss}
					className="text-secondary hover:text-yellow-700 ml-4 flex-shrink-0 cursor-pointer"
					aria-label="Dismiss verification message"
				>
					<X className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
}
